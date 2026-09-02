# SPEC-022: Encabezado sin isotipo

**Estado:** en desarrollo  
**Tipo:** refinamiento de interfaz  
**Dependencias:** SPEC-021

## Historia de usuario

Como usuario de El Yim, quiero que el encabezado no muestre isotipo ni leyenda de marca, para mantener una cabecera mínima y dar prioridad al contenido de la aplicación.

## Alcance

- Retirar el isotipo `Y` del encabezado.
- Retirar el botón visual de acceso al inicio asociado al isotipo.
- Conservar en la cabecera únicamente los controles funcionales actuales, como tema y salida.
- Mantener el branding de El Yim en la splash screen, bienvenida, título y metadatos.

## Criterios de aceptación

- El encabezado no muestra el isotipo ni una leyenda de marca.
- El control de tema y el botón “Salir” continúan disponibles.
- La aplicación conserva la splash screen y los textos de bienvenida de El Yim.
- El contenido ocupa el espacio superior liberado sin desplazamientos inesperados.
- `npm run build` finaliza correctamente.
