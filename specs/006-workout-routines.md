# SPEC-006: Rutinas de entrenamiento y seguimiento de series

**Estado:** verificada  
**Tipo:** entrenamiento  
**Dependencias:** SPEC-004

## Historia de usuario

Como usuario, quiero consultar la rutina que me corresponde cada día, ver cómo ejecutar cada ejercicio y marcar mis series completadas para llevar seguimiento de mi entrenamiento.

## Alcance

- Calendario semanal de 6 o 7 días.
- Configuración de un día de descanso, o ningún día de descanso cuando el plan tenga 7 días.
- Distribución de rutinas A, B y C.
- Selección de un día para consultar su rutina.
- Ejercicios con imagen ilustrativa, series, repeticiones, descanso y notas técnicas.
- Registro del peso utilizado.
- Checkbox individual para cada serie.
- Porcentaje de progreso de la sesión.
- Persistencia local del avance.

## Reglas de negocio

1. Un día marcado como descanso no muestra ejercicios pendientes.
2. Una rutina puede tener ejercicios diferentes, pero cada ejercicio debe conservar su prescripción.
3. Marcar una serie no modifica la cantidad prescrita.
4. El peso utilizado es un registro del usuario y no sustituye el peso sugerido por el profesional.
5. Las imágenes y notas son ilustrativas; la técnica definitiva debe confirmarse con el instructor.

## Criterios de aceptación

- El usuario puede elegir cualquier día de la semana.
- El usuario puede alternar entre 6 y 7 días.
- El usuario puede seleccionar un día de descanso cuando corresponda.
- El día seleccionado muestra la rutina, duración y enfoque.
- Cada ejercicio muestra series, repeticiones, descanso e indicaciones.
- Cada serie se puede marcar y desmarcar.
- El progreso se actualiza en tiempo real.
- El peso utilizado se conserva al recargar.
- Una rutina de demostración está identificada como tal.
