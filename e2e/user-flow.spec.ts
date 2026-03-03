import { test, expect } from '@playwright/test';

test.describe('Flujo de usuario DiabeCheck', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('debe mostrar el dashboard correctamente', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /DiabeCheck/i })).toBeVisible();
    await expect(page.getByText(/Glucemia Actual/i)).toBeVisible();
  });

  test('debe abrir el formulario de glucemia', async ({ page }) => {
    await page.getByRole('button', { name: /Glucemia/i }).click();
    await expect(page.getByRole('heading', { name: /Registro de Glucosa/i })).toBeVisible();
    
    // Rellenar y guardar
    await page.getByPlaceholder(/0/i).fill('120');
    await page.getByRole('button', { name: /Guardar Registro/i }).click();
    
    // Verificar que se cerró el modal
    await expect(page.getByRole('heading', { name: /Registro de Glucosa/i })).not.toBeVisible();
  });

  test('debe cambiar a la pestaña de alertas', async ({ page }) => {
    await page.getByLabel('Alertas').click();
    await expect(page.getByRole('heading', { name: /Recordatorios/i })).toBeVisible();
  });

  test('debe activar el modo alto contraste', async ({ page }) => {
    await page.getByLabel('Perfil').click();
    await page.getByText(/Alto Contraste/i).click();
    
    // Verificar que el el header cambió de color o clase
    const header = page.locator('header');
    await expect(header).toHaveCSS('background-color', 'rgb(255, 255, 255)'); // El color cambiará según el modo, pero comprobamos que no falla la navegación
  });
});
