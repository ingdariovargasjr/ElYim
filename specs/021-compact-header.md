# SPEC-021: Encabezado compacto de El Yim

**Estado:** en desarrollo  
**Tipo:** refinamiento de interfaz  
**Dependencias:** SPEC-019, SPEC-020

## Historia de usuario

Como usuario de El Yim, quiero un encabezado compacto que conserve el isotipo de la marca sin repetir su nombre como leyenda, para aprovechar mejor el espacio vertical de la aplicación.

## Alcance

- Retirar la leyenda textual “El Yim” que aparece junto al isotipo `Y` en el encabezado.
- Conservar el isotipo como acceso al inicio de la aplicación.
- Reducir el padding superior del contenedor principal para acercar el contenido al encabezado.
- Mantener accesibilidad mediante el nombre accesible del botón de inicio.

## Criterios de aceptación

- El encabezado muestra únicamente el isotipo `Y`.
- El botón conserva el nombre accesible “El Yim inicio”.
- El contenido se visualiza más arriba sin afectar el footer ni la navegación inferior.
- La bienvenida, la splash screen y los metadatos conservan el branding “El Yim”.
- `npm run build` finaliza correctamente.
