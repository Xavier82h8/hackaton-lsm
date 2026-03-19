# 🎤 UNIVOZ - Sistema de Guía de Voz Activa

## Descripción General

UNIVOZ ahora incluye un **sistema inteligente de guía de voz** que acompaña activamente a los usuarios ciegos durante toda su experiencia en la app.

---

## ✨ Características Principales

### 1. **Anuncios de Navegación Automática**
Cada vez que cambias de pantalla, la app te informa:
- Nombre de la pantalla actual
- Acciones disponibles en esa pantalla
- Contexto de lo que puedes hacer

**Ejemplo:**
```
"Dictado de voz. Di 'micrófono' para activar o 'ayuda' para más opciones."
```

### 2. **Guía Contextual Inteligente (smartGuide)**
La app proporciona ayuda específica según la pantalla donde estés:

| Pantalla | Guía que Proporciona |
|----------|---------------------|
| **Inicio (sc0)** | "Bienvenido a UNIVOZ. Para comenzar, selecciona tu perfil diciendo 'selección de perfil' o usa detección con IA diciendo 'detectar perfil'." |
| **Selección (sc1)** | "Estás en selección de perfil. Di 'soy ciega' para perfil ciego, 'soy sorda' para perfil sordo, o 'soy muda' para perfil mudo." |
| **Inicio Ciego (sc5)** | "Estás en el inicio de modo ciego. Di 'dictar' para comenzar a dictar, 'historial' para ver transcripciones anteriores, o 'ajustes' para configuración." |
| **Dictado (sc6)** | "Estás en dictado de voz. Di 'micrófono' para activar la grabación, 'escuchar' para escuchar lo transcrito, o 'copiar' para copiar el texto." |

### 3. **Tutorial para Primera Vez**
La primera vez que usas la app:
1. Detecta que es tu primera visita
2. Ofrece un tutorial guiado automáticamente
3. Explica los comandos básicos paso a paso
4. Guarda el estado para no mostrar nuevamente

**Pasos del Tutorial:**
```
1. "Bienvenido a UNIVOZ. Este es un tutorial para usar la app con comandos de voz."
2. "Paso 1: Para navegar, di el nombre de la acción. Por ejemplo: inicio, dictar, ajustes."
3. "Paso 2: Para regresar, di atrás o volver."
4. "Paso 3: Para activar el dictado, di micrófono o iniciar dictado."
5. "Paso 4: Para escuchar el texto transcrito, di escuchar o leer texto."
6. "Paso 5: En caso de emergencia, di emergencia o ayuda emergencia."
7. "Paso 6: Para ver esta ayuda nuevamente, di tutorial o ayuda de comandos."
8. "Tutorial completado. Los comandos de voz siguen activos. ¡Comienza a usar UNIVOZ!"
```

### 4. **Botón de Guía en Pantalla**
En el inicio del modo ciego (sc5):
```
┌──────────────────────────────────────────┐
│  🎤 Asistente de Voz                     │
│     Di "activar voz" o toca el micrófono │
│                                          │
│  [❓ Escuchar guía de esta pantalla]     │
└──────────────────────────────────────────┘
```

---

## 🎯 Comandos Nuevos Implementados

### Información de Pantalla
| Comando | Acción |
|---------|--------|
| `"dónde estoy"` | Anuncia la pantalla actual y acciones disponibles |
| `"pantalla actual"` | Anuncia la pantalla actual y acciones disponibles |
| `"qué pantalla es esta"` | Anuncia la pantalla actual y acciones disponibles |
| `"información"` | Anuncia la pantalla actual y acciones disponibles |

### Tutorial y Ayuda
| Comando | Acción |
|---------|--------|
| `"tutorial"` | Inicia el tutorial guiado paso a paso |
| `"iniciar tutorial"` | Inicia el tutorial guiado paso a paso |
| `"cómo se usa"` | Inicia el tutorial guiado paso a paso |
| `"ayuda inicial"` | Inicia el tutorial guiado paso a paso |
| `"ayuda"` | Muestra la lista de comandos disponibles |
| `"qué puedo decir"` | Muestra la lista de comandos disponibles |
| `"lista de comandos"` | Muestra la lista de comandos disponibles |

### Navegación Mejorada
| Comando | Acción |
|---------|--------|
| `"home"` | Ir a pantalla de inicio |
| `"opciones"` | Abrir configuración |
| `"leer"` | Leer texto transcrito |
| `"iniciar dictado"` | Ir a dictado y activar micrófono |
| `"llamar ayuda"` | Reproducir frase de emergencia |

---

## 🔊 Flujo de Experiencia del Usuario

### **Primera Visita:**
```
1. App carga
   ↓
2. Anuncio: "Bienvenido a UNIVOZ. Esta es tu primera vez aquí. 
            ¿Te gustaría escuchar un tutorial rápido? 
            Di 'tutorial' para comenzar o 'omitir' para continuar."
   ↓
3. Usuario dice: "tutorial"
   ↓
4. Tutorial se reproduce (8 pasos, 4 segundos cada uno)
   ↓
5. Tutorial completado
   ↓
6. Comandos de voz permanecen activos
```

### **Visitas Recurrentes:**
```
1. App carga
   ↓
2. Anuncio: "UNIVOZ está lista. Di 'activar voz' para usar 
            comandos de voz o toca el botón de micrófono."
   ↓
3. Usuario dice: "activar voz"
   ↓
4. Anuncio: "Comandos de voz activados. Puede comenzar a hablar."
   ↓
5. Usuario navega con comandos
```

### **Navegación con Guía:**
```
1. Usuario en sc5 (Inicio Ciego)
   ↓
2. Usuario dice: "dictar"
   ↓
3. App navega a sc6
   ↓
4. Anuncio: "Dictado de voz. Di 'micrófono' para activar o 'ayuda' para más opciones."
   ↓
5. Usuario dice: "micrófono"
   ↓
6. Anuncio: "Escuchando comando..."
   ↓
7. Micrófono activado, dictado comienza
```

---

## 🛠️ Implementación Técnica

### Archivos Modificados:
1. **`src/scripts/voice-commands.js`** - Sistema central de guía de voz
2. **`src/scripts/navigation.js`** - Integración con navegación
3. **`index.html`** - Botón de guía en pantalla

### Funciones Clave:
```javascript
// Anuncia cambios de pantalla automáticamente
announceScreenChange(screenNumber)

// Obtiene acciones disponibles por pantalla
getAvailableActions(screenNumber)

// Anuncia pantalla actual bajo demanda
announceCurrentScreen()

// Inicia tutorial guiado
startTutorial()

// Guía contextual inteligente
smartGuide()

// Integración con navegación
announceNavigation(screenNumber)
```

### Integración con go():
```javascript
function go(n) {
  // ... lógica de navegación ...
  
  appState.currentScreen = n;
  
  // Anunciar cambio si voz está activa
  if (typeof announceNavigation === 'function') {
    announceNavigation(n);
  }
  
  // ... resto del código ...
}
```

---

## 📋 Resumen de Comandos Completos

### Navegación (12 comandos)
- inicio, ir a inicio, pantalla principal, home
- dictar, ir a dictar, modo dictado
- historial, ir al historial, ver historial
- ajustes, ir a ajustes, configuración, opciones
- atrás, regresar, volver

### Acciones (8 comandos)
- escuchar, leer texto, reproducir, leer
- copiar, copiar texto
- micrófono, activar micrófono, grabar, iniciar dictado

### Emergencia (4 comandos)
- necesito ayuda, ayuda
- emergencia, ayuda emergencia, llamar ayuda

### Información (4 comandos)
- qué pantalla es esta, pantalla actual, dónde estoy, información

### Tutorial y Ayuda (6 comandos)
- tutorial, iniciar tutorial, cómo se usa, ayuda inicial
- ayuda de comandos, ayuda, qué puedo decir, lista de comandos

### Control de Voz (3 comandos)
- activar voz, desactivar voz, comandos de voz

**Total: 37 comandos de voz disponibles**

---

## 🎯 Beneficios para el Usuario

1. **Independencia**: Puede usar la app sin asistencia visual
2. **Confianza**: Sabe dónde está en todo momento
3. **Eficiencia**: Navegación rápida con comandos
4. **Seguridad**: Acceso rápido a ayuda y emergencia
5. **Aprendizaje**: Tutorial para primera vez
6. **Contexto**: Guía específica por pantalla

---

## 🚀 Próximas Mejoras (Futuro)

- [ ] Reconocimiento de voz offline
- [ ] Comandos personalizables por usuario
- [ ] Velocidad de voz ajustable
- [ ] Múltiples idiomas
- [ ] Feedback háptico sincronizado
- [ ] Comandos por gestos
- [ ] Integración con lectores de pantalla nativos

---

**UNIVOZ** - Comunicación accesible para todos 🎯
