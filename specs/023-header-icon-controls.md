# SPEC-023: Controles de encabezado con iconos

**Estado:** verificada  
**Tipo:** refinamiento de interfaz  
**Dependencias:** SPEC-022

## Historia de usuario

Como usuario de El Yim, quiero controlar el tema y cerrar sesión desde iconos compactos ubicados en la esquina superior izquierda, para liberar espacio visual y reconocer rápidamente cada acción.

## Alcance

- Reemplazar el selector textual “Claro / Oscuro” por un icono de sol y un icono de luna.
- Marcar visualmente el tema activo y conservar el cambio persistente.
- Reemplazar el botón textual “Salir” por un icono de salida.
- Colocar el grupo de controles en la esquina superior izquierda.
- Mantener nombres accesibles, estados `aria-pressed` y textos `title`.

## Criterios de aceptación

- El tema claro se activa con el icono de sol.
- El tema oscuro se activa con el icono de luna.
- El control activo se distingue visualmente.
- El cierre de sesión se ejecuta mediante el icono de salida.
- Los controles aparecen en la esquina superior izquierda.
- La interfaz no depende exclusivamente del color para comunicar el estado.
- `npm run build` finaliza correctamente.
