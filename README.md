# UNIVOZ — App de Accesibilidad Universal

**Proyecto universitario** · Hermosillo, Sonora · v5 + LSM 3D

App web progresiva (PWA) para comunicación accesible dirigida a personas ciegas, sordas y mudas. Funciona 100% en el navegador, sin servidores ni costos.

---

## 🗂️ Estructura del proyecto

```
univoz/
├── index.html        ← Estructura HTML (16 pantallas)
├── styles.css        ← Todos los estilos (19 secciones)
├── app.js            ← Toda la lógica JS + Three.js LSM
├── manifest.json     ← Config PWA (nombre, colores, iconos)
├── sw.js             ← Service Worker (offline)
└── icons/
    ├── icon-192.png
    ├── icon-512.png
    └── screenshot-mobile.png
```

## 🚀 Subir a GitHub Pages (gratis, en 10 minutos)

### Paso 1 — Crear cuenta en GitHub
1. Ve a [github.com](https://github.com) y crea una cuenta (gratis)
2. Confirma tu email

### Paso 2 — Crear el repositorio
1. Click en **"New repository"** (botón verde)
2. Nombre del repo: `univoz` (o el que quieras)
3. Selecciona **Public** (necesario para GitHub Pages gratis)
4. Click **"Create repository"**

### Paso 3 — Subir los archivos
**Opción A — Desde el navegador (más fácil):**
1. En tu repositorio vacío, click **"uploading an existing file"**
2. Arrastra TODOS los archivos del proyecto:
   - `index.html`, `styles.css`, `app.js`
   - `manifest.json`, `sw.js`
   - Carpeta `icons/` con sus 3 imágenes
3. Escribe un mensaje como `"primera versión UNIVOZ"` y click **Commit changes**

**Opción B — Con Git (si ya lo tienes instalado):**
```bash
cd ruta/a/tu/carpeta/univoz
git init
git add .
git commit -m "primera versión UNIVOZ"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/univoz.git
git push -u origin main
```

### Paso 4 — Activar GitHub Pages
1. En tu repositorio, ve a **Settings** (pestaña de arriba)
2. En el menú izquierdo, busca **Pages**
3. En "Source" selecciona: **Deploy from a branch**
4. En "Branch" elige: **main** / **/ (root)**
5. Click **Save**
6. Espera ~2 minutos y recarga la página
7. Verás el link: `https://TU_USUARIO.github.io/univoz/`

### Paso 5 — Abrir en celular
1. Abre ese link en el navegador de tu celular (Chrome recomendado)
2. Aparecerá un banner **"Instalar UNIVOZ"** en la parte inferior
3. Toca **Instalar** → la app queda en tu pantalla de inicio como si fuera nativa
4. Funciona sin internet después de la primera carga ✓

---

## ⚙️ Tecnologías utilizadas (todas gratuitas)

| Componente | Tecnología | Costo |
|------------|-----------|-------|
| Voz → Texto (STT) | Web Speech API del navegador | $0 |
| Texto → Voz (TTS) | Web Speech Synthesis API | $0 |
| Avatar LSM 3D | Three.js r128 (CDN) | $0 |
| Historial local | localStorage del navegador | $0 |
| Offline / PWA | Service Worker nativo | $0 |
| Hosting | GitHub Pages | $0 |
| Fuentes | Google Fonts | $0 |

**Total: $0 MXN / mes**

---

## 📱 Pantallas de la app

| # | Pantalla | Modo |
|---|----------|------|
| 0 | Splash / Bienvenida | — |
| 1 | Selección de perfil | — |
| 2 | Detección automática IA | — |
| 3 | Resultado detección | — |
| 4 | Config inicial | Ciego |
| 5 | Home | Ciego |
| 6 | Dictado de voz | Ciego |
| 7 | Config inicial | Sordo |
| 8 | Home | Sordo |
| 9 | Subtítulos en vivo | Sordo |
| 10 | **Señas LSM 3D** (avatar Three.js) | Sordo |
| 11 | Transcripción audio/video | Sordo |
| 12 | Config inicial | Mudo |
| 13 | Home | Mudo |
| 14 | Texto a Voz | Mudo |
| 15 | Ajustes generales | — |

---

## 🔧 Desarrollo local

No necesitas instalar nada. Solo abre `index.html` en Chrome o Firefox.

> **Nota:** El micrófono requiere HTTPS. En GitHub Pages funciona automáticamente. En local usa `localhost` o una extensión como "Live Server" de VS Code.

---

## 📋 Próximas mejoras sugeridas

- [ ] Integrar Whisper API (OpenAI) para transcripción más precisa
- [ ] Poses LSM animadas (movimiento de manos, no solo posición estática)
- [ ] Soporte ASL y LSE además de LSM
- [ ] Modo oscuro / alto contraste real
- [ ] Persistencia de perfil con localStorage

---

## 👥 Créditos

Desarrollado como proyecto universitario de accesibilidad.  
Universidad de Sonora — Hermosillo, Sonora, México.

---

*UNIVOZ es software libre para uso educativo y social.*
