# Arquitectura de Pantallas y Navegación

## Estructura de carpetas

- `index.html`: shell principal de la app (pantallas y UI)
- `src/styles/app.css`: estilos globales y componentes visuales
- `src/scripts/navigation.js`: configuración central de rutas por perfil
- `src/scripts/app.js`: lógica funcional de pantallas + navegación
- `sw.js`: service worker y precache de assets
- `icons/`: iconos PWA y screenshots

## Separación por perfiles

### Flujo compartido (onboarding)
- `sc0`: Splash
- `sc1`: Perfil
- `sc2`: Detección IA
- `sc3`: Resultado IA

### Perfil Ciego
- `sc4`: Config inicial
- `sc5`: Home
- `sc6`: Dictado
- `sc15`: Ajustes (ciego)

### Perfil Sordo
- `sc7`: Config inicial
- `sc8`: Home
- `sc9`: Subtítulos
- `sc10`: LSM 3D
- `sc11`: Transcribir
- `sc16`: Ajustes (sordo)

### Perfil Mudo
- `sc12`: Config inicial
- `sc13`: Home
- `sc14`: Texto a voz
- `sc17`: Ajustes (mudo)

## Reglas de navegación

La navegación está centralizada en `src/scripts/navigation.js` y consumida por `src/scripts/app.js`.

- `PROFILE_SCREENS`: define qué pantallas pertenecen a cada perfil.
- `PROFILE_HOME`: home por perfil.
- `PROFILE_CONFIG`: configuración inicial por perfil.
- `PROFILE_SETTINGS`: ajustes por perfil.
- `SETTINGS_PROFILE`: mapea pantalla de ajustes a perfil.

### Restricciones activas

- Una vez definido `activeProfile`, se bloquea entrada a pantallas de otros perfiles.
- `openSettings()` siempre abre ajustes del perfil activo.
- `settingsBack()` siempre regresa al home del perfil activo.
- `goProfileConfig()` siempre va a la config del perfil activo.
- `logout()` limpia `activeProfile` y regresa a `sc0`.

## Escalabilidad

Para agregar un nuevo perfil:

1. Crear pantallas nuevas en `index.html` (`scX...`).
2. Registrar rutas en `src/scripts/navigation.js`.
3. Conectar botones UI a helpers (`goHome`, `openSettings`, etc.).
4. Actualizar `TOTAL_SCREENS`.
5. Verificar precache en `sw.js` si agregas nuevos assets estáticos.
