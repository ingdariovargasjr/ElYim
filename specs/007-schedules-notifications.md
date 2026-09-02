# SPEC-007: Horarios, calendario y recordatorios

**Estado:** verificada  
**Tipo:** planificación diaria  
**Dependencias:** SPEC-005, SPEC-006

## Historia de usuario

Como usuario, quiero configurar mis horarios de comidas, entrenamiento y descanso para recibir recordatorios oportunos y mantener una rutina diaria constante.

## Alcance

- Hora de entrenamiento.
- Hora habitual de dormir y despertar.
- Recordatorios configurables para comidas, entrenamiento, suplementos y sueño.
- Resumen de próximos eventos del día.
- Persistencia local de la configuración.
- Preparación para notificaciones locales de Capacitor.

## Reglas de negocio

1. El usuario puede activar o desactivar cada tipo de recordatorio.
2. Los horarios de las comidas siguen siendo editables desde cada comida.
3. La aplicación no debe crear recordatorios si están desactivados.
4. Los recordatorios son ayudas de seguimiento y no sustituyen indicaciones profesionales.
5. La integración real con notificaciones nativas se conectará mediante un adaptador de plataforma.

## Criterios de aceptación

- El usuario puede modificar sus horarios principales.
- Puede activar o desactivar recordatorios individualmente.
- La configuración permanece después de recargar.
- El dashboard muestra los siguientes eventos del día.
- La interfaz diferencia configuración guardada de cambios pendientes.
- La base queda preparada para notificaciones locales en Android e iOS.
