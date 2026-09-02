# SPEC-015: Tab Bar y Overview principal

**Estado:** verificada  
**Tipo:** navegación y resumen  
**Dependencias:** SPEC-005, SPEC-006, SPEC-009, SPEC-012

## Historia de usuario

Como usuario, quiero cambiar rápidamente entre Overview, Rutinas y Régimen alimenticio mediante un Tab Bar inferior para consultar cada área sin mezclar la información y ver mi progreso general desde una pantalla principal.

## Alcance previsto

- Tab Bar fijo en la parte inferior de la aplicación móvil.
- Pestañas principales: Overview, Rutinas y Régimen alimenticio.
- Overview como resumen inicial de progreso.
- Widgets de peso, grasa estimada, cumplimiento de dieta, entrenamiento, sueño y recuperación.
- Gráficas y visuales de progreso.
- Estado activo de la pestaña y navegación accesible.
- Persistencia de la pestaña seleccionada cuando sea apropiado.

## Decisión de backlog

Esta feature se agrega al final del backlog y no cambia el orden de los incrementos anteriores. Su implementación deberá reutilizar los datos producidos por rutinas, alimentación, sueño y progreso, evitando duplicar lógica.

## Criterios de aceptación previstos

- Al abrir la app, el usuario llega a Overview.
- El usuario puede cambiar entre las tres áreas desde el Tab Bar inferior.
- Cada pestaña muestra únicamente su responsabilidad principal.
- Overview reúne indicadores de las demás áreas sin reemplazarlas.
- El diseño funciona en Android, iOS, PWA y navegador responsive.
- La navegación puede utilizarse con teclado y lector de pantalla.
