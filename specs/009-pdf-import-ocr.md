# SPEC-009: Importación de PDF, OCR y revisión asistida por IA

**Estado:** verificada  
**Tipo:** documentos y extracción  
**Dependencias:** SPEC-005, SPEC-006

## Historia de usuario

Como usuario, quiero cargar el PDF de mi instructor o nutriólogo y revisar la información que la app extraiga para convertirla en un plan organizado sin tener que capturar todo manualmente.

## Alcance de este incremento

- Selector de archivos PDF.
- Validación de formato y tamaño.
- Estado de carga y procesamiento.
- Vista de revisión con campos extraídos y nivel de confianza.
- Identificación visual de que el documento puede requerir OCR.
- Aprobación local de la revisión.
- Registro local del documento procesado.

## Fuera de alcance

- Envío real a un proveedor OCR o modelo de IA.
- Extracción completa de tablas complejas.
- Sustitución automática del plan activo.
- Análisis de texto manuscrito.
- Almacenamiento remoto del PDF.

## Reglas de negocio

1. Solo se aceptan archivos PDF.
2. El documento original debe conservarse como referencia cuando exista almacenamiento disponible.
3. Cada campo extraído debe mostrar su nivel de confianza.
4. Los datos extraídos no se convierten en plan activo sin aprobación explícita.
5. La IA puede organizar información, pero no inventar cantidades, ejercicios o suplementos.
6. El usuario debe poder descartar una revisión sin modificar su dieta o rutina.

## Criterios de aceptación

- El usuario puede seleccionar un PDF desde el dashboard.
- Un archivo inválido muestra un error claro.
- Se muestra un estado de procesamiento antes de la revisión.
- La revisión separa alimentación, entrenamiento, suplementos y recomendaciones.
- Los campos tienen confianza alta, media o baja.
- El usuario puede aprobar o descartar la revisión.
- La aprobación se conserva localmente.
- La interfaz indica que el OCR/IA real se conectará en el siguiente adaptador.
