# SPEC-016: Configuración manual del proveedor de IA

**Estado:** en desarrollo  
**Tipo:** configuración de integración  
**Dependencias:** SPEC-009, SPEC-010

## Historia de usuario

Como desarrollador de El Yim, quiero proporcionar manualmente la URL y configuración del proveedor externo de IA para conectar OCR, extracción de texto y organización del plan mediante un adaptador controlado.

## Alcance previsto

- Registrar el nombre del proveedor.
- Registrar la URL base o endpoint de la API.
- Registrar el identificador del modelo.
- Configurar los formatos aceptados y límites del documento.
- Configurar una clave secreta únicamente en el backend o en variables de entorno.
- Ejecutar una prueba de conexión desde el backend.
- Mostrar estado de conexión y errores de configuración.
- Mantener un adaptador independiente del resto de la aplicación.

## Guía que se entregará al implementar esta historia

1. Tú proporcionarás la documentación oficial y URL del proveedor.
2. Identificaremos endpoint, método HTTP, autenticación, modelo y formato de respuesta.
3. La clave se guardará únicamente como secreto del backend; nunca en Vue, PWA, APK, IPA ni repositorio.
4. Crearemos un adaptador que normalice la respuesta a campos de El Yim.
5. Probaremos texto digital, PDF escaneado, tablas y errores de límite.
6. La extracción seguirá requiriendo revisión humana antes de activar cambios.

## Criterios de aceptación previstos

- La URL se valida antes de guardarse.
- Las credenciales no aparecen en el cliente ni en los logs.
- El proveedor puede reemplazarse sin reescribir la interfaz.
- La app informa cuando el proveedor no está configurado.
- Los resultados se conservan con confianza y fuente del documento.

## Incremento ejecutado: configuración segura en cliente

En este incremento se implementó la primera parte de la historia:

- Formulario para proveedor, endpoint HTTPS, modelo y límite de PDF.
- Endpoint inicial de OpenAI Responses API: `https://api.openai.com/v1/responses`.
- Validación local antes de guardar y persistencia del ajuste en el dispositivo.
- Estado visible del proveedor dentro del flujo de carga de PDF.
- Prueba local que informa que la conexión real requiere un backend seguro.
- Sin campo de API key en Vue, PWA, Android o iOS.

## Pendiente para cerrar la historia

- Crear el backend o función server-side que lea `OPENAI_API_KEY` desde secretos.
- Implementar el adaptador HTTP real y normalizar la respuesta a El Yim.
- Probar documentos digitales, PDFs escaneados, tablas, errores de autenticación y límites.
- Mantener revisión humana antes de activar cualquier cambio en dieta o rutina.

## Guía de configuración de OpenAI

Una suscripción de ChatGPT y el uso de la API se administran por separado. Para la API se necesita una cuenta en la plataforma de API, facturación de API habilitada cuando corresponda y una API key creada en el panel de la plataforma. La key debe configurarse como secreto del backend, no compartirse en el chat ni pegarse en la app.

El usuario solo debe proporcionar para este formulario la documentación oficial o el endpoint, el modelo elegido y los límites deseados. Para OpenAI, el endpoint inicial ya queda precargado; normalmente no es necesario cambiarlo.
