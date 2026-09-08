# SPEC-019: Branding de El Yim

**Estado:** en desarrollo  
**Tipo:** refinamiento de identidad de producto  
**Dependencias:** SPEC-001, SPEC-018

## Historia de usuario

Como nuevo usuario, quiero recibir una experiencia identificada como **El Yim**, para sentir que la aplicación es mi espacio personal de entrenamiento, alimentación, descanso y progreso.

## Alcance

- Sustituir la marca visible GymApp por El Yim.
- Usar expresiones como “Bienvenido a tu Yim” y “tu Yim” en bienvenida, acceso y resumen diario.
- Actualizar el nombre visible en navegador, PWA, Android e iOS.
- Actualizar la documentación funcional para reflejar la nueva marca.
- Mantener los identificadores técnicos existentes para no romper almacenamiento local, paquetes nativos ni datos guardados.

## Criterios de aceptación

- La pantalla de bienvenida muestra “Bienvenido a tu Yim”.
- El encabezado muestra “El Yim” y el ícono utiliza la inicial `Y`.
- Registro, login y Overview utilizan lenguaje coherente con la marca.
- El título del documento, manifest, nombre de Capacitor y nombres visibles nativos muestran “El Yim”.
- `npm run build` finaliza correctamente.
- No se modifican `com.gymapp.mobile` ni las claves `gymapp.prototype.*` en este refinamiento.

## Fuera de alcance

- Cambio del identificador de paquete o bundle.
- Rediseño completo del logotipo como imagen.
- Publicación final en tiendas; esa ejecución continúa reservada para la historia final de Capacitor/CapSign.
