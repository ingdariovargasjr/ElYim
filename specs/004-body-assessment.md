# SPEC-004: Evaluación corporal inicial

**Estado:** verificada  
**Tipo:** perfil y composición corporal  
**Dependencias:** SPEC-003

## Objetivo

Recopilar los datos iniciales del usuario, calcular indicadores corporales y guardar una línea base para comparar el progreso futuro.

## Datos requeridos

- Nombre completo
- Edad
- Estatura en centímetros
- Peso en kilogramos
- Perfil masculino o femenino para el cálculo antropométrico
- Cintura
- Cadera
- Muslo izquierdo
- Muslo derecho
- Bíceps izquierdo
- Torso
- Cuello
- Objetivo principal
- Fecha de inicio del entrenamiento
- Fecha de inicio de la dieta

## Objetivos disponibles

- Recomposición corporal
- Perder grasa
- Ganar masa muscular
- Mantener el peso
- Mejorar fuerza y rendimiento
- Mejorar condición física
- Crear constancia y disciplina

## Cálculos

- IMC a partir de peso y estatura.
- Porcentaje de grasa estimado mediante fórmula antropométrica cuando existan las medidas necesarias.
- Kilogramos estimados de grasa.
- Kilogramos estimados de masa libre de grasa.

Todos los resultados derivados deben identificarse como estimados. Si el usuario tiene una medición profesional, podrá agregarse en un incremento posterior como valor medido independiente.

## Criterios de aceptación

- La evaluación se abre después de un registro válido si todavía no existe un perfil corporal.
- Los datos numéricos se validan y muestran unidades.
- El usuario puede ver los cálculos mientras completa el formulario cuando existen datos suficientes.
- No se permite guardar una evaluación incompleta.
- El perfil guardado aparece en el dashboard.
- Las medidas se conservan con fecha de captura para futuras comparaciones.
- La fórmula no muestra un resultado si faltan medidas indispensables o si son inválidas.
- La interfaz explica que el resultado es una estimación y no un diagnóstico.
