# SPEC-000: Fundación del producto El Yim

**Estado:** aprobada como base de planeación  
**Tipo:** producto y arquitectura  
**Última actualización:** 2026-08-31

## Objetivo

El Yim debe convertir el plan entregado por el instructor y el nutriólogo —incluido cuando llegue como PDF escaneado— en una experiencia diaria clara para entrenar, comer, descansar y registrar progreso.

## Usuario principal

Persona que sigue un plan personalizado de ejercicio y alimentación y necesita consultar instrucciones, completar actividades y observar su evolución.

## Capacidades del producto

- Perfil corporal y objetivos.
- Plan de alimentación por día, comida e ingrediente.
- Catálogo de alimentos con categorías verde, amarilla y roja.
- Rutinas con ejercicios, series, repeticiones, descansos e imágenes.
- Suplementos, recomendaciones y comidas trampa.
- Horarios de comidas, entrenamiento y sueño.
- Registro de peso, medidas, sueño, cumplimiento y ejercicios adicionales.
- Gráficas de progreso.
- Calendario menstrual opcional y sensible a síntomas, cuando aplique.
- Carga de PDF, OCR, extracción asistida por IA y revisión humana.
- Notificaciones configurables.
- Uso offline y sincronización posterior.

## Reglas de producto

1. Un porcentaje de grasa calculado por fórmula debe mostrarse como **estimado**, nunca como medición clínica.
2. Para calcular grasa corporal se debe solicitar el conjunto de medidas requerido por el método elegido; si faltan datos, se calcula únicamente lo que sea válido, como IMC.
3. La IA no puede inventar, alterar ni aprobar automáticamente cantidades, ingredientes, suplementos o ejercicios extraídos de un PDF.
4. Los cambios de dieta, suplementación o entrenamiento deben provenir del profesional o ser confirmados explícitamente por el usuario.
5. La menstruación no implica automáticamente prohibir el ejercicio. La app registra síntomas y aplica únicamente ajustes definidos por el profesional o elegidos por el usuario dentro de su plan.
6. El peso diario se registra, pero las conclusiones deben priorizar tendencias y promedios semanales.
7. La información corporal, de alimentación, sueño y ciclo menstrual se considera sensible y requiere controles de privacidad y eliminación de cuenta.

## Fuera de alcance inicial

- Diagnosticar enfermedades.
- Prescribir dietas, suplementos o rutinas.
- Determinar con certeza la masa muscular a partir del peso solamente.
- Reemplazar al instructor, nutriólogo o profesional de salud.
- Medir sueño con precisión usando únicamente el teléfono.

## Criterios de aceptación de la fundación

- La aplicación puede ejecutarse como interfaz web responsive.
- La misma base visual puede empaquetarse posteriormente con Capacitor para Android e iOS.
- La navegación y los componentes no dependen de datos reales todavía.
- Las futuras funciones pueden implementarse como incrementos independientes con pruebas propias.
