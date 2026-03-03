# Project-wide Copilot Instructions

# Main objective
El objetivo es crear una web-app que emule una app iOS-native (mobile-first) para el autocontrol de la diabetes tipo 1 (DM1). La app debe ser intuitiva, fácil de usar y accesible para personas con DM1, así como para sus cuidadores y profesionales sanitarios. Debe incluir funcionalidades clave como el registro de glucemias, cálculo de insulina, monitorización en tiempo real para cuidadores, generación de informes automáticos, recordatorios y comunicación segura con profesionales sanitarios.

# Requisitos técnicos
- Frontend: Vue.js + Vite (se debe poder desplegar en GitHub Pages).
- Backend: Debe ser only frontend, los datos se almacenarán localmente en el navegador (localStorage) de forma segura y cifrada.
- Diseño: Mobile-first, con un enfoque en la usabilidad y accesibilidad (ampliable, alto contraste, iconografía clara).
- DevOps: El proyecto debe estar alojado en un repositorio de GitHub, con una estructura clara y organizada. Se deben incluir instrucciones de instalación y uso en el README.md. El proyecto debe ser fácilmente desplegable en GitHub Pages gracias a GitHub Actions.
- Si puedes usa las notificaciones web para establecer alertas y recordatorios, pero si no es posible, puedes simular esta funcionalidad con alertas visuales dentro de la app.
- Test: Suite completa de pruebas unitarias, y tests de integración para las funcionalidades clave (registro de glucemias, cálculo de insulina, monitorización de cuidadores, generación de informes) usando playwright.


## Requisitos funcionales y estructurales de la app
Pantalla de Inicio / Dashboard
- Resumen rápido de glucemias del día.
- Indicador visual tipo semáforo (hipoglucemia, rango normal, hiperglucemia).
- Gráfica de evolución rápida (últimas 24 horas).
- Última dosis de insulina registrada.
- Acceso rápido a:
○ Registrar glucemia
○ Registrar insulina
○ Ver informes
○ Función cuidadores
### Realizar un registro Diario de Glucemias
Funcionalidad clave para el autocontrol:
- Introducción manual de valores.
- Registro automático si se vincula con sensor continuo.
- Selección del momento del día.
- Comentarios opcionales (ejercicio, enfermedad, etc.).
- Historial consultable por día, semana y mes.
### Cálculo y Registro de Insulina
Apartado esencial en DM1 que debe incluir:
- Registro de insulina basal.
- Registro de insulina rápida.
- Calculadora de bolo (según raciones de hidratos y glucemia actual).
- Historial de dosis administradas.
- Alertas en caso de valores peligrosos.
### Funcionalidad de Cuidadores (Monitorización en Tiempo Real)
Elemento diferencial del videotutorial, debe permitir:
- Vinculación de cuenta paciente–cuidador.
- Visualización remota de glucemias.
- Alertas automáticas ante hipoglucemias o hiperglucemias.
- Acceso a informes compartidos.
- Configuración de notificaciones.
NOTA: Para esta funcionalidad ofreceme ideas sin backend. Y alteramos el plan segun lo que me digas.
### Informes y Gráficas Automáticas
Pensado para facilitar el seguimiento clínico:
- Gráficas de evolución diaria/semanal/mensual.
- Tiempo en rango.
- Media de glucemias.
- Registro de eventos hipo/hiperglucémicos.
- Exportación en PDF para mostrar al endocrino.
- Posibilidad de compartir con el profesional sanitario.
### Sistema de Recordatorios y Alarmas
Para mejorar adherencia al tratamiento:
- Recordatorio de medición de glucosa.
- Recordatorio de administración de insulina.
- Alarmas visuales y sonoras.
- Notificaciones automáticas al cuidador si no se registra medición.
### Comunicación Paciente–Profesional Sanitario
Según los objetivos específicos del trabajo:
- Envío automático de datos al profesional.
- Sistema seguro de mensajería (opcional).
- Sincronización en la nube.
- Acceso clínico simplificado para revisión rápida.
### Perfil de Usuario y Configuración
Debe permitir:
- Datos personales.
- Factores de corrección.
- Ratio insulina/hidratos.
- Rango objetivo de glucemia.
- Gestión de cuidadores.
- Preferencias de accesibilidad.
### Accesibilidad
Dado el apartado 6 del trabajo:
- Letras ampliables.
- Modo alto contraste.
- Subtítulos en videotutorial integrado.
- Iconografía clara.
- Navegación sencilla e intuitiva.
- Lenguaje no técnico.
### Seguridad y Protección de Datos
Muy importante en salud digital:
- Inicio de sesión seguro.
- Verificación en dos pasos.
- Cifrado de datos.
- Cumplimiento de la normativa de protección de datos.

## Resumen estructural final de la app
1. Inicio / Dashboard
2. Registro de glucemias
3. Registro y cálculo de insulina
4. Función cuidadores
5. Informes y gráficas
6. Recordatorios y alarmas
7. Comunicación con profesional sanitario
8. Perfil y configuración
9. Accesibilidad
10. Seguridad de datos