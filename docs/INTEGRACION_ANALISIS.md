# 🔍 Análisis Comparativo - UNIVOZ Versions

## Versiones Comparadas

| Característica | hackaton-lsm (Nuestra versión) | univoz-master v7 (Compañero) |
|---------------|-------------------------------|------------------------------|
| **Perfiles** | 3 perfiles (ciego, sordo, mudo) | 5 perfiles (+ sordomudo, normal) |
| **Navegación** | PWA con navbar por perfil | Menú desarrollador visible |
| **Comandos de Voz** | ✅ 37 comandos implementados | ❌ No implementado |
| **Guía de Voz Activa** | ✅ Sí, con anuncios automáticos | ❌ No |
| **Tutorial Primera Vez** | ✅ Sí | ❌ No |
| **Botón Reanudar Sesión** | ❌ No | ✅ Sí (resumeBtn) |
| **Temporizador Perfil** | ❌ No | ✅ Sí (5 segundos) |
| **Modo Normal** | ❌ No | ✅ Sí (sin discapacidad) |
| **Perfil Sordomudo** | ❌ No | ✅ Sí |
| **Menú Desarrollador** | ❌ No | ✅ Sí (sc0-sc16) |
| **Diseño** | Mejorado con hover/active effects | Más básico |
| **Iconos** | Material Symbols corregidos | Material Symbols |
| **Pantallas** | 18 pantallas (sc0-sc17) | 17+ pantallas (sc0-sc16+) |

---

## 🎯 Características para Integrar

### **Alta Prioridad**

#### 1. **Botón Reanudar Sesión (resumeBtn)**
```html
<!-- En sc0 (splash) -->
<button id="resumeBtn" onclick="resumeSession()">
  <span class="resume-top">
    <span class="mi sm fill">replay</span> Continuar sesión anterior
  </span>
  <span class="resume-lbl" id="resumeLabel">Cargando...</span>
</button>
```

**Beneficio:** El usuario puede continuar donde lo dejó sin tener que navegar desde el inicio.

#### 2. **Temporizador de Perfil (5 segundos)**
```javascript
// Cuenta regresiva automática en sc1
let profileTimeout;
let countdown = 5;

function startProfileCountdown() {
  const ring = document.getElementById('profileCountdownRing');
  const label = document.getElementById('profileCountdown');
  
  countdown = 5;
  updateCountdownUI();
  
  profileTimeout = setInterval(() => {
    countdown--;
    updateCountdownUI();
    
    if (countdown <= 0) {
      clearInterval(profileTimeout);
      selectProfile('blind'); // Default
    }
  }, 1000);
}
```

**Beneficio:** Mejora la accesibilidad para usuarios ciegos que no tocan la pantalla.

#### 3. **Perfil Sordomudo**
- Screen sc10+ para usuarios sordomudos
- Combinación de señas LSM + texto
- Icono: `sign_language`
- Color: púrpura (pri-c)

**Beneficio:** Incluye a más usuarios con necesidades diferentes.

#### 4. **Modo Normal (sin discapacidad)**
- Screen sc16 para interlocutores
- Color: verde (#16A34A)
- Funcionalidad: Traducir a LSM
- Para personas que se comunican con alguien con discapacidad

**Beneficio:** Hace la app más inclusiva para todos los participantes en la comunicación.

---

### **Media Prioridad**

#### 5. **Menú de Desarrollador (Prototipo)**
```html
<div class="dev-menu">
  <!-- Navegación rápida entre pantallas -->
  <button onclick="go(0)">0 · Splash</button>
  <button onclick="go(6)">6 · Dictado</button>
  <button onclick="go(9)">9 · Subtítulos</button>
  ...
</div>
```

**Beneficio:** Útil para testing y desarrollo, pero debería ocultarse en producción.

#### 6. **Indicadores Visuales de Perfil**
```html
<span style="background:var(--blind-l);color:var(--blind);">👁 Ciego</span>
<span style="background:var(--deaf-l);color:var(--deaf);">🦻 Sordo</span>
<span style="background:var(--mute-l);color:var(--mute-c);">🤐 Mudo</span>
<span style="background:rgba(120,80,200,.10);color:var(--pri-c);">🤟 Sordomudo</span>
<span style="background:var(--green-l);color:var(--green);">♿ Sin discapacidad</span>
```

**Beneficio:** Makes los perfiles más visibles y comprensibles.

---

### **Baja Prioridad**

#### 7. **Header de Prototipo**
- Logo más pequeño
- Badge de versión (v7.1)
- Estilo más "dev"

**Decisión:** Mantener nuestro diseño actual que es más pulido.

---

## 📋 Plan de Integración

### **Fase 1: Características Esenciales**
1. ✅ Agregar botón "Reanudar sesión" en sc0
2. ✅ Implementar temporizador de 5s en selección de perfil
3. ✅ Agregar perfil sordomudo (sc10+)
4. ✅ Agregar modo normal (sc16+)

### **Fase 2: Mejoras de UX**
5. Guardar sesión en localStorage
6. Función resumeSession() que navega a la última pantalla
7. Contador visual con anillo de progreso
8. Integrar con sistema de voz existente

### **Fase 3: Limpieza**
9. Remover menú de desarrollador (o hacerlo opcional)
10. Unificar estilos CSS
11. Actualizar documentación

---

## 🎨 Estilos a Agregar (univoz-master-styles.css)

```css
/* Botón reanudar sesión */
#resumeBtn {
  display:none;
  flex-direction:column;
  gap:4px;
  background:var(--pri-ll);
  border:1.5px solid var(--pri-br);
  border-radius:var(--r);
  padding:12px 16px;
  cursor:pointer;
  width:100%;
}

#resumeBtn:hover { 
  background:var(--pri-l); 
}

.resume-top { 
  font-size:11px;
  font-weight:700;
  color:var(--pri-c);
}

.resume-lbl { 
  font-size:12px;
  color:var(--t2); 
}

/* Modo Normal (verde) */
:root {
  --green:#16A34A;
  --green-l:#F0FDF4;
  --green-br:rgba(22,163,74,.22);
  --green-sh:rgba(22,163,74,.28);
}

.normal-card { 
  border-color:var(--green-br) !important; 
}

.normal-card .mode-ico { 
  background:var(--green-l) !important; 
}
```

---

## 🔧 Funciones a Implementar

```javascript
// Guardar sesión actual
function saveSession(screenNumber) {
  localStorage.setItem('univoz_lastScreen', screenNumber);
  localStorage.setItem('univoz_lastProfile', appState.activeProfile);
  localStorage.setItem('univoz_lastVisit', new Date().toISOString());
}

// Reanudar sesión
function resumeSession() {
  const lastScreen = localStorage.getItem('univoz_lastScreen');
  const lastProfile = localStorage.getItem('univoz_lastProfile');
  
  if (lastScreen && lastProfile) {
    appState.activeProfile = lastProfile;
    go(parseInt(lastScreen));
    announce('Sesión reanudada. Perfil: ' + lastProfile);
  }
}

// Verificar si hay sesión guardada
function checkForSavedSession() {
  const lastScreen = localStorage.getItem('univoz_lastScreen');
  const resumeBtn = document.getElementById('resumeBtn');
  const resumeLabel = document.getElementById('resumeLabel');
  
  if (lastScreen && resumeBtn) {
    const lastVisit = localStorage.getItem('univoz_lastVisit');
    const date = new Date(lastVisit);
    const now = new Date();
    const hoursAgo = Math.floor((now - date) / (1000 * 60 * 60));
    
    resumeLabel.textContent = `Hace ${hoursAgo}h · Pantalla ${lastScreen}`;
    resumeBtn.style.display = 'flex';
  }
}

// Temporizador de perfil
let profileCountdownInterval;

function startProfileCountdown() {
  let countdown = 5;
  const ring = document.getElementById('profileCountdownRing');
  const label = document.getElementById('profileCountdown');
  
  if (!ring || !label) return;
  
  clearInterval(profileCountdownInterval);
  
  function updateUI() {
    label.textContent = countdown;
    const circumference = 106.8;
    const offset = circumference - (countdown / 5) * circumference;
    ring.style.strokeDashoffset = offset;
  }
  
  updateUI();
  
  profileCountdownInterval = setInterval(() => {
    countdown--;
    updateUI();
    
    if (countdown <= 0) {
      clearInterval(profileCountdownInterval);
      selectProfile('blind');
    }
  }, 1000);
}

// Detener temporizador al seleccionar perfil
function selectProfile(profile) {
  clearInterval(profileCountdownInterval);
  // ... resto de la lógica
}
```

---

## ✅ Checklist de Integración

- [ ] Copiar estilos CSS de univoz-master
- [ ] Agregar botón resumeBtn en sc0
- [ ] Implementar función saveSession()
- [ ] Implementar función resumeSession()
- [ ] Implementar función checkForSavedSession()
- [ ] Agregar temporizador de 5s en sc1
- [ ] Agregar perfil sordomudo (sc18-19)
- [ ] Agregar modo normal (sc20-21)
- [ ] Integrar con sistema de voz existente
- [ ] Actualizar navegación para 5 perfiles
- [ ] Remover menú desarrollador (opcional)
- [ ] Probar todas las combinaciones
- [ ] Actualizar documentación

---

## 🎯 Resultado Final Esperado

Una app que combina:
- ✅ **Nuestro sistema de voz** (37 comandos + guía activa)
- ✅ **Características de univoz-master** (5 perfiles + resume session)
- ✅ **Nuestro diseño mejorado** (hover effects + navegación PWA)
- ✅ **Accesibilidad mejorada** (temporizador + anuncios de voz)

**Total:** La versión más completa y accesible de UNIVOZ.
