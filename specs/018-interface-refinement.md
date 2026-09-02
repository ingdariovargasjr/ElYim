# SPEC-018: Refinamiento de navegación, acciones y modales

**Estado:** verificada (alcance base) · Refinement R1: verificada · Refinement R1.1: verificada  
**Tipo:** refinamiento de interfaz y navegación  
**Dependencias:** SPEC-009, SPEC-010, SPEC-015, SPEC-017

## Historia de usuario

Como usuario, quiero separar el resumen, check-in, horarios, descanso, régimen y carga de documentos en tabs, vistas enfocadas y modales para encontrar cada función rápidamente sin saturar el Overview.

## Contexto y objetivo

El Overview actual concentra demasiadas responsabilidades. Este refinement reorganiza la interfaz móvil para que Overview sea una pantalla breve de evolución y para que cada operación frecuente tenga un destino claro. La separación debe conservar los datos y servicios existentes sin duplicar lógica de dominio.

## Estructura de navegación

El Tab Bar inferior tendrá cuatro tabs:

1. **Overview**
2. **Rutinas**
3. **Régimen**
4. **Descanso**

La tab **“Sube tu régimen alimenticio”** no se creará. La carga del PDF se abrirá mediante el botón **“Carga tu PDF de tu profesional”** ubicado en las acciones superiores del Overview.

## Alcance funcional

### Overview

Overview deberá mostrar únicamente información resumida de progreso:

- Progreso general.
- Evolución corporal.
- Peso actual y cambios desde la línea base.
- Gráficas de peso y grasa corporal.
- Visuales de tendencia.
- Acciones superiores:
  - **Check in**.
  - **Horarios y recordatorios**.
  - **Carga tu PDF de tu profesional**.
  - **Sincronización**, con icono de estado y última fecha de sincronización.

La leyenda **“Cuenta creada”** debe eliminarse.

### Vista Check in

El botón **Check in** abrirá una vista enfocada que contendrá únicamente:

- Formulario de check-in.
- Fecha del registro.
- Peso.
- Porcentaje de grasa corporal opcional.
- Medidas opcionales.
- Comida trampa, ejercicio adicional y notas.
- Botón para guardar el check-in.
- Fechas y registros recientes relacionados con el progreso.
- Acción para regresar a Overview.

La vista deberá reutilizar el servicio y modelo de progreso existentes.

### Vista Horarios y recordatorios

El botón **Horarios y recordatorios** abrirá una vista enfocada con:

- Horario de entrenamiento.
- Horario de comidas mediante la configuración existente.
- Hora de dormir y despertar.
- Interruptores de recordatorios.
- Próximos avisos.
- Botón para guardar.
- Acción para regresar a Overview.

### Tab Descanso

La tab **Descanso** mostrará:

- Registro del horario de descanso.
- Hora de dormir y despertar.
- Interrupciones.
- Calidad del sueño.
- Energía al despertar.
- Notas.
- Resumen de recuperación.
- Horas dormidas y estado orientativo.
- Botón para guardar el descanso.

### Tab Régimen

La tab **Régimen** conservará únicamente:

- Desayuno, comida y cena.
- Dropdowns de comidas e ingredientes con checkboxes.
- Cumplimiento de alimentación.
- Suplementación.
- Recomendaciones.
- Grasas permitidas.
- Catálogo de alimentos por color.

### Tab Rutinas

La tab **Rutinas** conservará únicamente:

- Selección de días.
- Configuración de seis o siete días.
- Día de descanso.
- Rutina del día.
- Ejercicios, ilustraciones, series y pesos.
- Progreso de la sesión.

### Modal de carga de PDF

El botón **“Carga tu PDF de tu profesional”** abrirá un modal con:

- Selección de archivo PDF.
- Validación de tipo y tamaño.
- Nombre y tamaño del documento seleccionado.
- Loader de carga/procesamiento.
- Progreso visible de la operación.
- Mensaje que indique que el documento está siendo analizado.
- Revisión de campos extraídos antes de aprobar.
- Acciones para aprobar, descartar o cerrar.

El modal deberá reutilizar el flujo existente de revisión OCR/IA y no activar cambios en el plan sin aprobación humana.

### Modal de sincronización

El botón **“Sincronización”** mostrará:

- Icono de estado de sincronización.
- Última fecha y hora de sincronización.
- Cantidad de cambios pendientes.
- Modal con loader mientras se sincroniza.
- Mensaje de éxito o error.
- Estado offline cuando no exista conexión.
- Acción para cerrar el modal.

La sincronización seguirá utilizando la cola offline-first existente.

## Reglas de negocio

1. Al abrir la aplicación, la tab inicial será Overview.
2. El Overview no mostrará el formulario completo de check-in, horarios, sueño, PDF ni sincronización expandida.
3. El Tab Bar permanecerá disponible en las cuatro tabs principales, excepto cuando un modal o una vista enfocada requiera atención.
4. Check-in y Horarios serán vistas enfocadas, no nuevas tabs del Tab Bar.
5. Carga de PDF y Sincronización serán modales.
6. Cerrar un modal no deberá perder datos ya guardados.
7. Una carga o sincronización en curso no podrá ejecutarse dos veces simultáneamente.
8. Si la sincronización falla, los cambios permanecerán en la cola local.
9. Toda operación de carga deberá mostrar estado mientras esté procesándose; no se permitirá una pantalla vacía.
10. La interfaz deberá funcionar con teclado, lector de pantalla y áreas táctiles adecuadas.

## Estados de interfaz

- Vista activa.
- Vista enfocada de Check in.
- Vista enfocada de Horarios y recordatorios.
- Modal de carga de PDF cerrado, listo, cargando, revisando, aprobado o con error.
- Modal de sincronización cerrado, listo, sincronizando, sincronizado, offline o con error.
- Última sincronización disponible o estado “Nunca sincronizado”.

## Criterios de aceptación

- El Tab Bar muestra exactamente Overview, Rutinas, Régimen y Descanso.
- Overview ya no muestra la leyenda “Cuenta creada”.
- Overview contiene progreso, evolución corporal, peso, gráficas y visuales, además de las acciones superiores.
- Check in abre una vista enfocada solo con el formulario y datos relacionados.
- Horarios y recordatorios abre una vista enfocada sin mezclar el resto del dashboard.
- Descanso aparece como nueva tab y contiene el registro y resumen de recuperación.
- Régimen no muestra rutinas, sueño, carga de PDF ni sincronización expandida.
- Rutinas no muestra alimentación, sueño ni carga de PDF.
- “Carga tu PDF de tu profesional” abre un modal.
- El modal muestra validación, loader y progreso durante el procesamiento del PDF.
- “Sincronización” muestra última sincronización, cambios pendientes y un modal con loader.
- La navegación conserva los datos ya guardados y funciona offline según la capacidad actual del prototipo.
- Las transiciones y loaders respetan la preferencia de reducir movimiento.

## Datos, privacidad y errores

- Los datos de composición corporal, descanso y documentos se consideran sensibles.
- El modal no debe mostrar claves de proveedores de IA ni credenciales.
- Los errores de PDF, OCR y sincronización deben mostrarse dentro de su contexto y permitir reintentar o cerrar.
- La última sincronización debe distinguir entre sincronización real con servidor y la cola local del prototipo.
- Este refinement no autoriza todavía cambios automáticos de dieta, rutina o suplementación.

## Refinement R1: diálogos, acciones compactas y temas visuales

### Historia de usuario refinada

Como usuario, quiero que las acciones secundarias de Overview se abran como diálogos claramente visibles, que la sincronización comience al solicitarla y que la interfaz use una paleta consistente con tema claro u oscuro, para operar mi plan sin perder contexto y con una identidad visual reconocible.

### Cambios sobre el alcance base

Este refinement modifica el comportamiento visual y de interacción del alcance base de SPEC-018:

1. **Check in** conserva su vista enfocada propia, con su formulario, registros recientes y navegación de regreso.
2. **Horarios y recordatorios** deja de mostrarse como sección embebida y se abrirá como un diálogo superpuesto a toda la aplicación.
3. **Carga tu PDF de tu profesional** seguirá abriendo un diálogo superpuesto a toda la aplicación.
4. **Sincronización** seguirá abriendo un diálogo superpuesto y comenzará la sincronización automáticamente al hacer clic en el botón principal de Overview.
5. Los diálogos de Horarios, PDF y Sincronización ya no mostrarán la acción “Volver a Overview”. Tendrán una **X roja** en la esquina superior derecha con nombre accesible para cerrar.

### Comportamiento de los diálogos

- El diálogo deberá ocupar el viewport disponible, quedar por encima de toda la interfaz y tener fondo/overlay suficiente para distinguirlo del contenido subyacente.
- El foco inicial deberá entrar al diálogo y el foco no deberá quedar perdido detrás del overlay.
- La X deberá ser visible, táctil, accesible por teclado y anunciarse como “Cerrar horarios y recordatorios”, “Cerrar carga de PDF” o “Cerrar sincronización”, según corresponda.
- Cerrar un diálogo conservará los datos que ya se hayan guardado.
- Escape deberá cerrar el diálogo cuando no exista una operación bloqueante en curso.
- Mientras PDF o sincronización estén procesándose, el diálogo permanecerá visible con loader y el botón de cierre no deberá provocar una segunda operación.

### Sincronización inmediata

El botón principal **Sincronización** de Overview será una acción compuesta:

1. Abrir el diálogo de Sincronización.
2. Iniciar inmediatamente la sincronización, sin requerir un segundo clic.
3. Mostrar el loader, el estado Online/Offline, los cambios pendientes y la última sincronización.
4. Deshabilitar solicitudes duplicadas mientras el estado sea `syncing`.
5. Mostrar éxito, error u offline dentro del diálogo.
6. Mantener los cambios en la cola local si la operación no puede completarse.

El diálogo podrá conservar un botón de “Reintentar” o “Sincronizar ahora” para una segunda solicitud después de terminar o fallar la primera, pero nunca deberá lanzar dos procesos simultáneos.

### Acciones superiores compactas

- Las cuatro acciones superiores de Overview deberán usar botones compactos, no tarjetas grandes.
- El color principal de estos botones será **amarillo `#F2B138`**.
- El texto de los botones amarillos deberá usar `#0D0D0D` para conservar contraste.
- Se conservarán icono, título y subtítulo, pero con altura, padding y jerarquía visual reducidos para que las acciones no compitan con las gráficas.
- El botón de sincronización podrá usar el mismo amarillo con un indicador pequeño de estado; el loader seguirá siendo visible durante la operación.

### Barra superior y selector de tema

- El texto **“Tu plan. Tu ritmo.”** deberá eliminarse.
- En ese espacio, junto al botón **Salir**, se colocará un toggle compacto de tema.
- El botón **Salir** tendrá tratamiento rojo de acción destructiva, con contraste suficiente en ambos temas.
- El toggle deberá presentar claramente los estados **Tema claro** y **Tema oscuro**, permitir teclado y lector de pantalla, y conservar la selección localmente.
- El tema inicial será oscuro si no existe una preferencia guardada; posteriormente podrá respetarse la preferencia del sistema como mejora independiente.
- Cambiar el tema no deberá perder la tab activa, formularios, modales abiertos ni datos locales.

### Tokens de la paleta oficial

La imagen de referencia `AdobeColor-Jaiba Brava.jpeg` define estos colores oficiales:

| Token | Hex | Uso base |
| --- | --- | --- |
| `--color-blue` | `#07B0F2` | Color primario, enlaces y focos |
| `--color-cyan` | `#05C7F2` | Acentos, estados activos y visuales |
| `--color-yellow` | `#F2B138` | Acciones principales y CTAs |
| `--color-sand` | `#F2DAAC` | Superficies suaves, apoyo y estados cálidos |
| `--color-black` | `#0D0D0D` | Fondo/texto según el tema |
| `--color-white` | `#FFFFFF` | Texto/fondo según el tema |

Tema oscuro:

- Fondo principal: `#0D0D0D`.
- Texto principal: `#FFFFFF`.
- Superficies glass: negro translúcido con bordes azul/cian sutiles.
- Acciones principales: `#F2B138` con texto `#0D0D0D`.

Tema claro:

- Fondo principal: `#FFFFFF` con superficies secundarias `#F2DAAC` atenuadas.
- Texto principal: `#0D0D0D`.
- Superficies glass: blanco translúcido con bordes azul/cian.
- Acciones principales: `#F2B138` con texto `#0D0D0D`.

Los componentes no deberán depender exclusivamente de colores Tailwind específicos del tema anterior. La implementación deberá centralizar estos valores en variables CSS para que ambos temas compartan la misma identidad visual.

### Criterios de aceptación del Refinement R1

- Al hacer clic en **Horarios y recordatorios**, aparece un diálogo superpuesto a todo el viewport.
- Al hacer clic en **Carga tu PDF de tu profesional**, aparece un diálogo superpuesto a todo el viewport.
- Al hacer clic en **Sincronización**, aparece el diálogo y la sincronización comienza de inmediato.
- Durante la sincronización no se pueden iniciar dos procesos simultáneos.
- Los tres diálogos usan una X roja en la esquina superior derecha y no muestran “Volver a Overview”.
- Las acciones superiores son botones amarillos compactos y no tarjetas grandes.
- “Tu plan. Tu ritmo.” ya no aparece en la barra superior.
- “Salir” tiene estilo rojo y conserva su acción actual.
- El toggle permite cambiar entre tema claro y oscuro, mantiene la selección al recargar y no pierde el estado de la aplicación.
- La paleta visible utiliza los seis colores oficiales y mantiene contraste legible en ambos temas.
- La preferencia `prefers-reduced-motion` continúa respetándose.

### Fuera de alcance de este refinement

- Conectar todavía un proveedor OCR/IA real.
- Enviar datos sensibles a un servicio externo.
- Añadir nuevas tabs al Tab Bar.
- Cambiar las reglas clínicas, la dieta o la rutina automáticamente.

## Refinement R1.1: azul como color primario

### Historia de usuario refinada

Como usuario, quiero que los botones, acentos, focos y elementos principales de la interfaz utilicen azul, para que el amarillo funcione únicamente como color secundario y la jerarquía visual sea más consistente con la identidad de El Yim.

### Decisión visual

- El color primario pasa a ser `#07B0F2`.
- El color de acento pasa a ser `#05C7F2`.
- Los botones principales, acciones de Overview, progreso, focos, enlaces activos, indicadores y loaders deben usar azul o cian.
- El amarillo `#F2B138` queda reservado para estados secundarios, advertencias, información cálida y categorías semánticas que ya lo necesiten.
- Los botones azules usarán texto `#0D0D0D` para conservar contraste.

### Criterios de aceptación R1.1

- Ningún botón principal de la aplicación se muestra en amarillo.
- Las acciones compactas de Overview se muestran en azul.
- Los acentos que anteriormente usaban amarillo/lima se muestran en azul o cian.
- Las gráficas, indicadores de progreso, focos y loaders utilizan azul/cian.
- El amarillo se conserva solo en usos secundarios o semánticos.
- El tema claro y oscuro mantienen la misma jerarquía azul-primaria.
