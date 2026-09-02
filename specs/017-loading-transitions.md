# SPEC-017: Loaders, skeletons y transiciones de vistas

**Estado:** verificada  
**Tipo:** experiencia visual  
**Dependencias:** SPEC-010, SPEC-015

## Historia de usuario

Como usuario, quiero ver estados de carga, esqueletos y transiciones suaves al cambiar de vista o actualizar información para entender que la app está trabajando y no confundir una pantalla vacía con un error.

## Alcance

- Loader reutilizable para operaciones de carga.
- Skeleton loader para tarjetas, listas y widgets.
- Estado de carga de 1 a 2 segundos al actualizar una vista aunque exista información local.
- Animación de entrada y salida al cambiar de vista.
- Animaciones suaves para botones y elementos interactivos.
- Mensajes accesibles con `aria-busy` y `aria-live`.
- Degradación razonable cuando las animaciones están reducidas o desactivadas.

## Reglas de negocio

1. El skeleton representa la estructura esperada y no debe parecer información real.
2. La información cacheada puede mostrarse mientras se actualiza, pero la interfaz debe comunicar que existe una actualización en curso.
3. La espera visual debe ser breve y no bloquear innecesariamente una acción del usuario.
4. Las animaciones no deben impedir navegación con teclado ni lectores de pantalla.
5. Se debe respetar `prefers-reduced-motion`.

## Criterios de aceptación

- Cambiar de vista muestra una transición de entrada y salida.
- El dashboard muestra skeletons durante su carga inicial o actualización.
- El loader indica claramente que la información está cargando.
- La vista no salta bruscamente cuando llega el contenido.
- Los estados de carga tienen texto accesible.
- La app funciona aunque el usuario prefiera reducir movimiento.
