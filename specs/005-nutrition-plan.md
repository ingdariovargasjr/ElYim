# SPEC-005: Régimen alimenticio y seguimiento diario

**Estado:** verificada  
**Tipo:** alimentación  
**Dependencias:** SPEC-004

## Objetivo

Mostrar el régimen alimenticio de cada día de forma clara y permitir que el usuario marque lo que va cumpliendo.

## Alcance

- Desayuno, comida y cena como comidas base.
- Posibilidad de agregar otras comidas en una fase posterior.
- Dropdown por comida.
- Ingredientes con cantidad, unidad y checkbox de cumplimiento.
- Horario editable por comida.
- Sección de suplementación diaria.
- Recomendaciones del profesional.
- Catálogo de alimentos verde, amarillo y rojo.
- Grasas permitidas con instrucciones de uso.
- Persistencia local del avance diario.

## Reglas de negocio

1. Marcar un ingrediente no elimina ni modifica la cantidad indicada.
2. El porcentaje de cumplimiento se calcula con ingredientes completados sobre ingredientes totales.
3. El color del catálogo es una guía de frecuencia definida por el profesional.
4. Un plan de demostración debe identificarse como tal y poder sustituirse por el plan importado del PDF.
5. La app no recomienda por sí sola cantidades de alimentos o suplementos.

## Criterios de aceptación

- El usuario puede abrir y cerrar cada comida.
- Cada ingrediente tiene checkbox y cantidad visible.
- El avance se conserva después de recargar la aplicación.
- El usuario puede modificar el horario de una comida.
- Los suplementos tienen estado pendiente/completado.
- Las recomendaciones y grasas se muestran separadas del plan de comidas.
- El catálogo distingue visualmente las categorías verde, amarilla y roja.
- El dashboard muestra el porcentaje de alimentación completada.
