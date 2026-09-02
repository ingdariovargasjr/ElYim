# SPEC-008: Sueño y recuperación

**Estado:** verificada  
**Tipo:** recuperación  
**Dependencias:** SPEC-004, SPEC-007

## Historia de usuario

Como usuario, quiero registrar mis horas de sueño, calidad de descanso y nivel de energía para entender cómo influyen en mi recuperación y en el cumplimiento de mi plan.

## Alcance

- Registro manual de hora de dormir y despertar.
- Cálculo automático de horas dormidas.
- Registro de interrupciones.
- Calificación de calidad del sueño.
- Registro de energía al despertar.
- Nota libre del descanso.
- Indicador orientativo de recuperación.
- Persistencia local por fecha.

## Reglas de negocio

1. El cálculo debe contemplar que la hora de despertar puede ser del día siguiente.
2. La app debe diferenciar horas registradas de horas sincronizadas desde un dispositivo.
3. El indicador es orientativo y no es un diagnóstico médico.
4. Un día sin registro debe mostrar estado pendiente, no asumir que el usuario durmió mal.
5. La información de sueño debe conservar la fecha para futuras gráficas.

## Criterios de aceptación

- El usuario puede registrar hora de dormir y despertar.
- La duración se calcula automáticamente.
- Puede registrar calidad, energía, interrupciones y notas.
- El indicador cambia según los datos capturados.
- El registro permanece después de recargar.
- El dashboard muestra el resumen de recuperación del día.
- La interfaz indica que el registro es manual.
