# SPEC-001: Bienvenida y acceso inicial

**Estado:** en desarrollo  
**Tipo:** experiencia inicial  
**Dependencias:** SPEC-000

## Objetivo

Explicar rápidamente el valor de El Yim y ofrecer al usuario dos caminos: crear una cuenta o iniciar sesión.

## Alcance

Incluye una pantalla móvil-first con:

- Nombre y propuesta de valor de El Yim.
- Beneficios principales.
- Acciones para crear cuenta e iniciar sesión.
- Indicador de que el plan puede consultarse y sincronizarse.

No incluye todavía autenticación real ni carga de PDF.

## Flujo

1. El usuario abre la aplicación.
2. Ve la propuesta de valor y beneficios.
3. Pulsa **Crear cuenta** para continuar al futuro registro.
4. Pulsa **Iniciar sesión** para continuar al futuro acceso.

Durante este incremento, ambas acciones muestran un estado de “próximamente” sin guardar datos.

## Criterios de aceptación

- La pantalla funciona en un viewport móvil sin scroll horizontal.
- Los botones principales son visibles y tienen etiquetas claras.
- El contenido comunica al menos organización de dieta, rutinas, progreso y recordatorios.
- Existe una tarjeta o sección visual para “plan diario”, “progreso” y “sincronización”.
- El contraste del texto es legible sobre el fondo.
- La interfaz conserva una alternativa visual razonable si el efecto glass no está disponible.
- No se solicitan permisos del dispositivo antes de que exista una función que los necesite.
