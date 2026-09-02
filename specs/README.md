# Especificaciones del producto

## Proceso SDD

Cada especificación debe contener:

- Contexto y objetivo.
- Alcance y fuera de alcance.
- Reglas de negocio.
- Flujos de usuario.
- Criterios de aceptación.
- Consideraciones de datos, privacidad y errores.
- Estado: `propuesta`, `aprobada`, `en desarrollo`, `verificada` o `descartada`.

## Orden de incrementos

1. `000-product-foundation.md`: visión, límites y decisiones de producto.
2. `001-app-foundation.md`: bienvenida, beneficios y acceso inicial.
3. Registro y autenticación.
4. Evaluación corporal y cálculos.
5. Plan alimenticio y seguimiento de comidas.
6. Plan de entrenamiento y seguimiento de series.
7. Suplementación, recomendaciones y comidas trampa.
8. Calendario, horarios y notificaciones.
9. Sueño y recuperación.
10. `009-pdf-import-ocr.md`: Importación de PDF, OCR y revisión asistida por IA.
11. `010-offline-sync.md`: Sincronización offline-first.
12. `011-progress-tracking.md`: Progreso, gráficas y reportes.
13. `012-menstrual-cycle.md`: Personalización del ciclo menstrual, cuando aplique.
14. `015-navigation-overview.md`: Tab Bar inferior y Overview principal.
15. `016-ai-provider-configuration.md`: Configuración manual del proveedor externo de IA.
16. `017-loading-transitions.md`: Loaders, skeletons y transiciones de vistas.
17. `018-interface-refinement.md`: Refinamiento de navegación, acciones y modales.
18. `019-el-yim-branding.md`: Identidad visual y lenguaje de marca de El Yim.
19. `020-splash-screen-branding.md`: Splash screen animada con el logo oficial de El Yim.
20. `021-compact-header.md`: Encabezado compacto sin leyenda duplicada.
21. `022-header-sin-isotipo.md`: Encabezado sin isotipo ni leyenda de marca.
22. `013-capacitor-platform.md`: Ejecución final de Capacitor/CapSign, sincronización y validación de Android/iOS.

La ejecución de Capacitor/CapSign queda reservada deliberadamente para el último incremento del backlog.

El orden puede cambiar si una dependencia técnica o una decisión de producto lo requiere, pero ningún incremento debe implementarse sin una especificación y criterios de aceptación claros.
