# UNIVOZ - App de Accesibilidad Universal

App web progresiva (PWA) orientada a accesibilidad para personas ciegas, sordas y mudas.

## Estructura actual

```text
hackaton-lsm/
├── index.html
├── manifest.json
├── sw.js
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   └── screenshot-mobile.png
├── src/
│   ├── scripts/
│   │   ├── navigation.js
│   │   └── app.js
│   └── styles/
│       └── app.css
└── docs/
    └── ARCHITECTURE.md
```

## Separación por responsabilidad

- `src/scripts/navigation.js`: configuración de rutas por perfil.
- `src/scripts/app.js`: lógica funcional de pantallas y navegación.
- `src/styles/app.css`: estilos globales.
- `docs/ARCHITECTURE.md`: reglas de navegación y escalabilidad.

## Perfiles y pantallas

- Flujo compartido: `sc0-sc3`
- Ciego: `sc4-sc6` + `sc15` (ajustes)
- Sordo: `sc7-sc11` + `sc16` (ajustes)
- Mudo: `sc12-sc14` + `sc17` (ajustes)

## Notas de ejecución

- `index.html` carga:
  - `src/styles/app.css`
  - `src/scripts/navigation.js`
  - `src/scripts/app.js`
- `sw.js` precachea estos nuevos paths.
