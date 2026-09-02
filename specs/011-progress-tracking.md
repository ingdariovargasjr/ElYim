# SPEC-011: Progreso, gráficas y reportes

**Estado:** verificada

## Contexto y objetivo

El usuario necesita registrar su evolución durante la recomposición corporal y entender sus tendencias sin depender de una medición aislada. Esta especificación agrega un check-in diario y un resumen visual que relaciona peso, grasa corporal estimada, medidas, cumplimiento y recuperación.

## Alcance

- Registrar un check-in con fecha, peso, porcentaje de grasa opcional, cintura opcional y cadera opcional.
- Asociar al registro el cumplimiento del día: alimentación, entrenamiento, sueño, suplementos, comida trampa y ejercicio adicional.
- Mostrar línea base, valor actual, cambio absoluto y cambio porcentual cuando exista información suficiente.
- Mostrar gráficas sencillas de tendencia para peso y grasa corporal.
- Animar la generación de las métricas, la línea base, los puntos y las líneas de las gráficas cada vez que se carga o actualiza la información.
- Guardar los registros localmente y agregarlos a la cola offline-first.
- Mostrar una interpretación orientativa, sin diagnosticar ni prescribir cambios.

## Fuera de alcance

- Determinar masa muscular real a partir del peso o de una fórmula de composición corporal.
- Sustituir mediciones clínicas, bioimpedancia validada o la evaluación del profesional.
- Generar ajustes automáticos de dieta, suplementación o rutina.
- Sincronizar todavía con básculas, relojes o plataformas de salud externas.

## Reglas de negocio

1. El primer registro de una evaluación aprobada se considera la línea base.
2. El peso debe ser mayor que cero y la fecha es obligatoria.
3. El porcentaje de grasa y las medidas son opcionales para permitir check-ins rápidos.
4. Los cambios se calculan contra el primer registro y no contra el día anterior.
5. La masa libre de grasa se presenta como estimación cuando hay peso y porcentaje de grasa; no se etiqueta como masa muscular.
6. Una sola medición no se interpreta como tendencia.
7. Los registros se almacenan por fecha; guardar el mismo día actualiza el registro de ese día.

## Flujo de usuario

1. El usuario abre la sección Progreso.
2. Consulta sus tarjetas de resumen y las gráficas disponibles.
3. Captura el check-in del día y, si lo desea, agrega medidas y contexto.
4. Guarda el registro y ve la confirmación local.
5. El usuario revisa la tendencia y decide si necesita conversar con sus profesionales.

## Criterios de aceptación

- Existe una sección identificable como “Progreso”.
- El usuario puede registrar peso y fecha, además de campos opcionales de composición y contexto.
- El primer registro se identifica como línea base.
- Se muestran peso actual, cambio desde la línea base y porcentaje de cambio.
- Cuando existen al menos dos registros con porcentaje de grasa, se muestra su tendencia y cambio.
- Al entrar al módulo o actualizar un check-in, las tarjetas aparecen de forma escalonada y las líneas/puntos se dibujan progresivamente.
- La línea base se identifica visualmente sin ocultar los valores ni depender únicamente del color.
- Se muestra masa libre de grasa estimada con una advertencia clara.
- El registro persiste al recargar y genera una operación pendiente de sincronización.
- Si no hay suficientes datos, la interfaz explica qué falta en lugar de mostrar conclusiones engañosas.

## Datos, privacidad y errores

- Los datos corporales son sensibles y se almacenan localmente en este prototipo.
- La fecha futura y los valores inválidos deben rechazarse.
- Los datos enviados a un backend futuro deberán cifrarse en tránsito y limitarse al propósito de seguimiento.
- Toda interpretación debe incluir el carácter orientativo y recomendar la consulta profesional para decisiones clínicas.
