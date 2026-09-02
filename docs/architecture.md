# Arquitectura inicial

## Plataformas

La aplicación se construirá primero como una aplicación web responsive y PWA. Capacitor será la capa de empaquetado y acceso a APIs nativas para Android e iOS. Electron queda reservado para una posible aplicación de escritorio futura.

## Capas

```text
UI Vue/Tailwind
      ↓
Casos de uso y estado (Pinia)
      ↓
Repositorios y sincronización
      ↓
Almacenamiento local + API remota
      ↓
Servicios nativos mediante Capacitor
```

## Principios

- Mobile-first.
- Componentes pequeños y reutilizables.
- Datos locales disponibles primero.
- Sincronización asíncrona y tolerante a pérdida de conexión.
- Separar la lógica de negocio de la UI y de las APIs nativas.
- Permisos solicitados en contexto, no todos al iniciar.
- Accesibilidad y legibilidad por encima de los efectos visuales.

## Adaptadores nativos previstos

- Notificaciones locales y push.
- Archivos y selección de PDF.
- Cámara para medidas o fotos de progreso, si se aprueba.
- Integraciones de salud y sueño en una fase posterior.

## OCR y documentos

El documento original se conserva. Un servicio de procesamiento detectará texto digital o páginas escaneadas, ejecutará OCR cuando sea necesario y devolverá datos estructurados con confianza por campo. El usuario revisará y aprobará esos datos antes de convertirlos en su plan activo.

## Datos locales

La caché de lectura y la persistencia del usuario no deben confundirse. El plan y los registros requieren almacenamiento local persistente; los cambios pendientes deben guardarse en una cola de sincronización con identificador, fecha, versión y estado.

