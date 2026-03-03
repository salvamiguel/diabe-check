import { test, expect } from '@playwright/test';

/**
 * Test de Integración E2E para la conectividad P2P (Paciente <-> Cuidador)
 * Simula dos contextos de navegador diferentes para verificar el handshake WebRTC.
 */
test.describe('Sincronización P2P DiabeCheck', () => {
  
  test('debe conectar a un cuidador con un paciente mediante enlace de sincronización', async ({ browser }) => {
    // 1. Crear el contexto del PACIENTE
    const patientContext = await browser.newContext();
    const patientPage = await patientContext.newPage();
    await patientPage.goto('/');
    
    // Abrir el diálogo de compartir para generar el Link de PeerJS
    await patientPage.click('text=Sincronizar Cuidador');
    
    // Esperar a que el QR/Link esté disponible (PeerID generado)
    const shareDialog = patientPage.locator('h3:has-text("Monitorización P2P")');
    await expect(shareDialog).toBeVisible();
    
    // Obtener el enlace de sincronización
    // Nota: Como no podemos leer el QR fácilmente en el test, usamos el botón de copiar
    // o simplemente extraemos la URL actual si el componente la expone.
    // Usaremos una técnica para obtener el valor de la URL de sincronización generada internamente.
    const syncUrl = await patientPage.evaluate(() => {
      // Accedemos al estado global si es posible o simplemente simulamos el botón copiar
      // Para este test, asumimos que el link se genera con el peer id en la URL
      return (document.querySelector('input') as any)?.value || window.location.href; 
    });

    // En nuestro caso, el PeerID se persiste en localStorage
    const patientPeerId = await patientPage.evaluate(() => localStorage.getItem('diabecheck_peer_id'));
    expect(patientPeerId).not.toBeNull();

    const caretakerUrl = `${await patientPage.evaluate(() => window.location.origin)}/?peer=${patientPeerId}`;

    // 2. Crear el contexto del CUIDADOR
    const caretakerContext = await browser.newContext();
    const caretakerPage = await caretakerContext.newPage();
    
    // El cuidador entra con el link de sincronización
    await caretakerPage.goto(caretakerUrl);

    // 3. Verificar HANDSHAKE en el CUIDADOR
    // Debe aparecer la cabecera de "Monitorizando a:"
    await expect(caretakerPage.locator('text=Monitorizando a:')).toBeVisible();
    
    // Verificar que el estado en la Hero Card es "LIVE"
    const liveBadge = caretakerPage.locator('span:has-text("Live")');
    await expect(liveBadge).toBeVisible();

    // 4. Verificar HANDSHAKE en el PACIENTE
    // El diálogo de compartir debe cambiar a "¡Cuidador Conectado!"
    await expect(patientPage.locator('text=¡Cuidador Conectado!')).toBeVisible();

    // 5. Prueba de transferencia de DATOS (Real-time)
    // Añadimos una glucemia en el Paciente
    await patientPage.click('button:has-text("Cerrar")'); // Cerrar diálogo éxito
    await patientPage.click('button:has-text("Glucemia")');
    await patientPage.fill('input[type="number"]', '185');
    await patientPage.click('button:has-text("Guardar Registro")');

    // Comprobar que el Cuidador recibe el dato (185 mg/dL) instantáneamente
    const glucoseValue = caretakerPage.locator('text=185');
    await expect(glucoseValue).toBeVisible();
    
    // Comprobar que el estado cambia a HIPERGLUCEMIA en la vista del cuidador
    await expect(caretakerPage.locator('text=HIPERGLUCEMIA')).toBeVisible();

    // 6. Simular paciente desconectado y refresco del cuidador
    await patientContext.close(); // paciente offline
    await caretakerPage.reload();

    // tras reload, debería conservar el último valor guardado aun sin conexión
    await expect(caretakerPage.locator('text=185')).toBeVisible();
    // la etiqueta LIVE ya no debería mostrarse porque no hay conexión
    await expect(caretakerPage.locator('span:has-text("Live")')).toHaveCount(0);

    // Limpieza
    await caretakerContext.close();
  });
});
