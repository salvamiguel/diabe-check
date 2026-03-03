# Plan de Desarrollo DiabeCheck - Universidad Europea

Este documento detalla el plan de desarrollo para la aplicación DiabeCheck, una web-app mobile-first para el autocontrol de la diabetes tipo 1, siguiendo la identidad visual de la Universidad Europea.

## Estado del Proyecto
- **Fase Actual:** Inicialización y Planificación
- **Progreso Global:** 5%

## Tareas y Roadmap

### Fase 1: Inicialización y Configuración (Prioridad Alta)
- [ ] Configurar proyecto Vite + Vue.js - *Est. 1h*
- [ ] Implementar Design Tokens (CSS Variables) basados en la marca UE - *Est. 1h*
- [ ] Configurar Tailwind CSS / SCSS con la paleta de colores UE - *Est. 1h*
- [ ] Configurar Playwright para tests de integración - *Est. 1h*

### Fase 2: Componentes Base y Layout (Prioridad Alta)
- [ ] Estructura de Layout Mobile-first (Header, Nav, Content) - *Est. 2h*
- [ ] Componentes UI Atómicos (Botones UE, Inputs, Cards, Badges) - *Est. 3h*
- [ ] Implementar Dashboard Principal con resumen rápido - *Est. 4h*

### Fase 3: Registro y Lógica de Datos (Prioridad Extra Alta)
- [ ] Servicio de Persistencia (LocalStorage + Cifrado) - *Est. 3h*
- [ ] Funcionalidad: Registro de Glucemia (Manual + Selector de momento) - *Est. 4h*
- [ ] Funcionalidad: Registro y Calculadora de Insulina (Bolo/Basal) - *Est. 5h*
- [ ] Historial consultable y edición de registros - *Est. 3h*

### Fase 4: Visualización y Reportes (Prioridad Media)
- [ ] Gráficas de evolución (Chart.js / ECharts) - *Est. 4h*
- [ ] Generación de Informes PDF para médicos - *Est. 4h*
- [ ] Indicadores de Tiempo en Rango (TiR) y Medias - *Est. 2h*

### Fase 5: Funcionalidades Especiales (Prioridad Media)
- [ ] Sistema de Recordatorios y Alarmas (Web Notifications/Simulado) - *Est. 3h*
- [ ] Función Cuidadores (Propuesta: Sincronización vía QR/Enlace sin backend) - *Est. 5h*
- [ ] Configuración del Perfil (Factores de corrección, ratios) - *Est. 3h*

### Fase 6: Accesibilidad y Refinamiento (Prioridad Alta)
- [ ] Implementar modo alto contraste y letras ampliables - *Est. 3h*
- [ ] Auditoría de accesibilidad (Aria labels, navegación teclado) - *Est. 2h*
- [ ] Refinar diseño según reglas de marca UE (Hero, Overlays) - *Est. 3h*

### Fase 7: Deployment y Testing Final (Prioridad Alta)
- [ ] Configurar GitHub Actions para despliegue en GitHub Pages - *Est. 2h*
- [ ] Suite completa de tests unitarios (Vitest) - *Est. 4h*
- [ ] Suite completa de tests E2E (Playwright) - *Est. 4h*

## Decisiones de Diseño y Notas
- **Mobile First:** La navegación principal será inferior (tipo app nativa).
- **Seguridad:** Uso de `crypto-js` para cifrado de datos en LocalStorage.
- **Marca UE:** Uso dominante de `#F82F28` para acciones y `#6F0714` para elementos estructurales.
- **Sin Backend:** La monitorización de cuidadores se explorará mediante exportación/importación de datos cifrados o uso de WebRTC/P2P si es viable, o soluciones basadas en compartir URLs con estado.

## Criterios de Aceptación Generales
1. Puntuación Lighthouse > 90 en Accesibilidad.
2. Funcionamiento offline básico (PWA).
3. Cobertura de tests en funcionalidades críticas > 80%.
