# SPEC-012: Personalización del ciclo menstrual

**Estado:** verificada

## Contexto y objetivo

Cuando el perfil indica sexo femenino, la app debe ofrecer un calendario opcional para registrar el inicio del ciclo y dar contexto al seguimiento de entrenamiento, descanso y alimentación. El objetivo es adaptar la experiencia sin asumir que todos los ciclos son iguales.

## Alcance

- Mostrar esta sección únicamente para perfiles femeninos.
- Registrar el inicio del último periodo, duración promedio del ciclo y duración promedio del periodo.
- Mostrar día actual del ciclo, fase orientativa y próxima fecha estimada.
- Mostrar un calendario visual del ciclo con días de periodo, día actual y ventana fértil estimada.
- Permitir notas de síntomas, energía o necesidades de ajuste para conversarlas con el profesional.
- Guardar localmente y agregar la actualización a la cola offline-first.

## Fuera de alcance

- Diagnosticar trastornos hormonales, embarazo o condiciones ginecológicas.
- Confirmar ovulación o fertilidad.
- Cambiar automáticamente dieta, suplementación, intensidad de entrenamiento o tratamiento.
- Compartir datos del ciclo con terceros sin consentimiento explícito.

## Reglas de negocio

1. El ciclo se cuenta desde el primer día del último periodo.
2. La duración promedio del ciclo debe estar entre 21 y 40 días; el periodo, entre 2 y 10 días.
3. Las fases y fechas mostradas son estimaciones basadas en los datos introducidos por la usuaria.
4. Si no existe fecha de inicio, se muestra una invitación para configurar el calendario y no se generan conclusiones.
5. Los días del periodo no deben bloquear el registro de alimentos ni obligar a dejar de entrenar; solo aportan contexto para decidir con el profesional.
6. La usuaria puede corregir o borrar sus datos del ciclo.

## Criterios de aceptación

- Un perfil masculino no ve la sección menstrual.
- Un perfil femenino puede guardar la configuración del ciclo y verla tras recargar.
- La interfaz muestra día del ciclo, fase estimada y próxima fecha estimada cuando hay datos suficientes.
- El calendario identifica visualmente periodo, ventana fértil estimada y día actual con una leyenda textual.
- Se muestra un aviso claro de que la información es orientativa y no médica.
- Guardar cambios agrega una operación de sincronización offline.
