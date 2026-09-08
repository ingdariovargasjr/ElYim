# SPEC-024: Menú hamburguesa de controles

**Estado:** verificada  
**Tipo:** refinamiento de interfaz  
**Dependencias:** SPEC-023

## Historia de usuario

Como usuario de El Yim, quiero encontrar los controles de tema y salida dentro de un menú hamburguesa compacto en la esquina superior derecha, para mantener el encabezado limpio y acceder a las acciones en un eje horizontal.

## Alcance

- Mover el grupo de controles al extremo superior derecho.
- Reducir el tamaño de los iconos y del botón hamburguesa.
- Mostrar inicialmente solo el botón hamburguesa.
- Al abrir, desplazar los controles hacia la izquierda en este orden: sol, luna y salida.
- Permitir abrir y cerrar el menú en el mismo eje horizontal.
- Cerrar el menú con Escape y al cerrar sesión.

## Criterios de aceptación

- El menú hamburguesa aparece en la esquina superior derecha.
- Los iconos se despliegan hacia la izquierda con una transición suave.
- El orden visual es sol, luna y salida.
- El botón comunica su estado mediante `aria-expanded`.
- Los controles siguen siendo accesibles por teclado y conservan sus etiquetas.
- El encabezado no recupera la leyenda ni el isotipo de El Yim.
- `npm run build` finaliza correctamente.
