# SPEC-020: Splash screen animada de El Yim

**Estado:** verificada (web/PWA) · Capacitor/CapSign diferido  
**Tipo:** experiencia de arranque y branding  
**Dependencias:** SPEC-019, SPEC-017

## Historia de usuario

Como usuario de El Yim, quiero ver una splash screen de marca cada vez que abro o recargo la aplicación, para reconocer inmediatamente mi Yim y comenzar la experiencia con una transición cuidada.

## Contexto actual

La aplicación ya tiene el nombre visible **El Yim**, un loader de navegación y recursos estáticos de arranque generados por Capacitor. Todavía no existe una splash screen de marca implementada en la interfaz web/PWA ni una animación basada en el logo oficial que proporcionará el usuario.

## Insumos requeridos del usuario

Antes de ejecutar esta historia, el usuario deberá proporcionar los logos oficiales de El Yim, preferentemente:

- Logo en SVG, si existe.
- PNG con transparencia y resolución suficiente.
- Versión horizontal y/o isotipo, si ambas se utilizarán.
- Colores oficiales, fondo preferido y restricciones de uso.
- Indicación de si el logo puede girar, escalar, brillar o únicamente aparecer con fade.

No se generará un logo sustituto cuando el objetivo sea animar la identidad oficial.

## Alcance

- Crear una splash screen para la carga inicial y la recarga de la aplicación web/PWA.
- Mostrar el logo oficial centrado con fondo coherente con la identidad de El Yim.
- Animar la entrada del logo con una transición breve, fluida y accesible.
- Mostrar un estado de carga reconocible sin bloquear innecesariamente la aplicación.
- Evitar el parpadeo entre la splash screen y la primera vista.
- Respetar `prefers-reduced-motion`, mostrando una entrada estática o mínima cuando corresponda.
- Preparar los recursos y configuración para que Capacitor utilice la misma identidad en Android e iOS.

## Flujo esperado

1. El usuario abre o recarga El Yim.
2. Se muestra el fondo de arranque y el logo oficial.
3. El logo realiza la animación definida con el usuario.
4. La aplicación prepara la sesión y los datos locales.
5. La splash screen desaparece con una transición suave hacia bienvenida, login o Overview.
6. Si la carga tarda, se conserva un estado visual claro sin dejar la pantalla congelada.

## Criterios de aceptación

- La splash screen aparece al abrir y recargar la app web/PWA.
- Utiliza el logo oficial entregado por el usuario, sin deformarlo ni recortarlo.
- La animación se ejecuta una vez por arranque y no se reinicia por cada cambio de tab.
- La transición termina cuando la vista inicial está lista o después de un tiempo máximo definido.
- El logo mantiene contraste y área segura en tema claro y oscuro.
- La experiencia funciona en viewport móvil y escritorio.
- Con movimiento reducido, la animación se desactiva o se reduce respetando la preferencia del sistema.
- El build web continúa funcionando correctamente.
- La configuración final de splash nativa y la prueba en dispositivos Android/iOS se validan en la historia final de Capacitor/CapSign.

## Fuera de alcance

- Diseñar o redibujar el logo oficial.
- Publicar en tiendas.
- Firmar APK, AAB o IPA.
- Ejecutar Xcode o validar dispositivos físicos.
- Cambiar el identificador técnico `com.gymapp.mobile`.
