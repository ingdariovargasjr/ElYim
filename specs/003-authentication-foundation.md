# SPEC-003: Registro e inicio de sesión

**Estado:** verificada  
**Tipo:** experiencia y sesión  
**Dependencias:** SPEC-001

## Objetivo

Permitir que una persona cree una cuenta o inicie sesión desde la pantalla inicial, con validaciones claras y un estado de sesión que lleve al resumen diario.

## Alcance de este incremento

- Formulario de registro.
- Formulario de inicio de sesión.
- Validación de campos obligatorios.
- Mensajes de error accesibles.
- Persistencia local de demostración para poder probar el flujo sin backend.
- Estado de sesión local y cierre de sesión.
- Resumen diario inicial después de acceder.

## Fuera de alcance

- Autenticación contra un servidor.
- Recuperación de contraseña por correo.
- OAuth con Google o Apple.
- Verificación de correo.
- Almacenamiento de contraseñas en producción.

## Reglas de negocio

1. El nombre debe tener al menos dos caracteres.
2. El correo debe tener un formato válido.
3. La contraseña debe tener al menos ocho caracteres.
4. La confirmación debe coincidir con la contraseña.
5. El usuario debe aceptar los términos para crear la cuenta.
6. El prototipo local no debe presentarse como autenticación de producción.

## Criterios de aceptación

- Desde bienvenida se puede abrir registro o inicio de sesión.
- Un registro incompleto no permite continuar y muestra el problema junto al campo correspondiente.
- Un registro válido muestra el resumen diario.
- Un inicio de sesión con una cuenta local inexistente muestra un mensaje útil.
- Una sesión activa muestra el nombre del usuario.
- Cerrar sesión devuelve a la pantalla de bienvenida.
- Los formularios funcionan con teclado y tienen etiquetas asociadas.
- La información local de demostración se encapsula para reemplazarla por un repositorio remoto posteriormente.
