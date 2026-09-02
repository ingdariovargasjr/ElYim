# El Yim

Aplicación móvil y web para organizar planes de entrenamiento, alimentación y recuperación a partir de la información proporcionada por el instructor y el nutriólogo.

## Enfoque de desarrollo

El proyecto utiliza **Spec-Driven Development (SDD)**:

1. Cada incremento comienza con una especificación funcional.
2. La especificación define criterios de aceptación verificables.
3. Se implementa únicamente el alcance aprobado del incremento.
4. Se ejecutan pruebas y se actualiza la documentación.

Consulta [`specs/README.md`](specs/README.md) para el proceso y [`docs/architecture.md`](docs/architecture.md) para la arquitectura propuesta.

## Estado

El primer incremento es la fundación visual móvil: bienvenida, beneficios y acceso al registro o inicio de sesión. La información de planes todavía es demostrativa; no se deben usar datos de prueba como un plan real.

## Stack objetivo

- Vue 3 + Vite
- JavaScript
- Tailwind CSS
- PWA para navegador
- Capacitor para Android e iOS

## Comandos de plataforma

- `npm run cap:sync`: compila la web y sincroniza los assets con Android, iOS y web.
- `npm run cap:open:android`: abre el proyecto Android en Android Studio.
- `npm run cap:open:ios`: abre el proyecto iOS en Xcode cuando se ejecuta en macOS.

Los proyectos nativos requieren sus SDK correspondientes. La compilación de iOS no puede ejecutarse en Windows.
