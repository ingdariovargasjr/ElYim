# SPEC-002: Plataforma web, PWA y Capacitor

**Estado:** propuesta  
**Tipo:** plataforma  
**Dependencias:** SPEC-001

## Objetivo

Entregar una misma experiencia mobile-first como web responsive, PWA, Android e iOS, manteniendo la lógica de negocio compartida.

## Alcance

- Configuración de build web.
- Manifest e instalación como PWA.
- Service worker para recursos y experiencia básica offline.
- Integración de Capacitor.
- Targets Android e iOS.
- Adaptadores para APIs nativas sin acoplar la lógica de dominio a una plataforma.

## Criterios de aceptación

- La web se puede compilar con `npm run build`.
- La app web define nombre, icono, colores y comportamiento instalable.
- La aplicación empaquetada conserva la navegación y los estilos principales.
- El código compartido no contiene condicionales nativos en cada componente visual.
- Las notificaciones y archivos se invocan mediante servicios/adaptadores.
- Las funciones que requieren permisos funcionan con una degradación razonable si el permiso es rechazado.
- Android e iOS se consideran targets separados para pruebas de permisos, notificaciones y almacenamiento.

## Decisión

Electron no forma parte del target móvil. Si se requiere una aplicación de escritorio, se agregará posteriormente como otro adaptador de plataforma.

