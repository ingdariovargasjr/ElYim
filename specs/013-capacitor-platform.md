# SPEC-013: Preparación de plataforma con Capacitor

**Estado:** verificada

## Contexto y objetivo

GymApp debe compartir su experiencia web mobile-first con una PWA y con proyectos nativos Android/iOS mediante Capacitor. Este incremento prepara el empaquetado y los assets, pero no publica todavía en tiendas ni configura certificados de firma.

## Alcance

- Instalar Capacitor Core, CLI, Android e iOS.
- Definir identidad compartida: nombre `GymApp` e identificador `com.gymapp.mobile`.
- Usar `dist` como directorio de assets web.
- Agregar manifest, icono y service worker para la PWA.
- Generar los proyectos `android/` e `ios/`.
- Agregar comandos para compilar/sincronizar y abrir cada plataforma.
- Mantener el código Vue compartido entre web, Android e iOS.

## Fuera de alcance

- Firmas, certificados, perfiles de aprovisionamiento y publicación en Google Play o App Store.
- Configuración final de notificaciones nativas, cámara, archivos o permisos.
- Ejecución de Xcode en Windows; el target iOS deberá compilarse y probarse en macOS.
- Automatización CI/CD para generar releases.

## Reglas de negocio

1. El identificador de aplicación debe permanecer estable después de publicar.
2. Los secretos, certificados y credenciales no se guardan en el repositorio.
3. La aplicación debe seguir funcionando como web si un permiso nativo es rechazado.
4. Los plugins nativos se consumirán mediante servicios/adaptadores, no desde cada vista.

## Criterios de aceptación

- `npm run build` genera el bundle web en `dist`.
- La PWA define manifest, icono, modo standalone y cache shell básico.
- Existe configuración Capacitor con nombre, app ID y `webDir` definidos.
- Existen proyectos nativos Android e iOS generados por Capacitor.
- `cap sync` copia los assets web y la configuración a ambos targets.
- Existen comandos documentados para sincronizar y abrir Android/iOS.
- La limitación de compilación iOS en Windows queda documentada.

## Datos, privacidad y errores

- El service worker solo cachea recursos GET y no intercepta formularios ni operaciones de escritura.
- El uso offline conserva la estrategia local existente; no implica sincronización con servidor.
- Antes de una publicación real deberán revisarse permisos, privacidad, iconos, accesibilidad y almacenamiento seguro.
