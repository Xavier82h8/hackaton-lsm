# 🎤 UNIVOZ - Asistente de Voz Conversacional para Usuarios Ciegos

## Versión 3.0 - Asistente Interactivo

UNIVOZ ahora cuenta con un **asistente de voz conversacional** que guía activamente a los usuarios ciegos mediante diálogos interactivos, similar a tener un asistente humano acompañándote en cada paso.

---

## ✨ Nueva Experiencia Conversacional

### ¿Qué es el Asistente Conversacional?

El asistente conversacional es un sistema inteligente que:
1. **Te saluda** cuando activas la voz
2. **Te pregunta** qué deseas hacer
3. **Espera tu respuesta** y la procesa
4. **Confirma** cada acción que realiza
5. **Te guía** con preguntas de seguimiento cuando es necesario

### Flujo de Diálogo Ejemplo

```
USUARIO: "activar voz"
ASISTENTE: "Asistente de voz activado. Estás en el inicio de modo ciego. 
            ¿Qué acción deseas realizar?"

USUARIO: "dictar"
ASISTENTE: "Iremos a dictar. ¿Deseas activar el micrófono inmediatamente?"

USUARIO: "sí"
ASISTENTE: "Perfecto. Micrófono activado. Puedes comenzar a dictar."
```

---

## 🎯 Activación del Asistente

### Primera Vez
1. La app anunciará: *"Bienvenido a UNIVOZ. Esta es tu primera vez aquí. Soy tu asistente de voz. ¿Te gustaría escuchar un tutorial rápido? Di 'tutorial' para comenzar o 'omitir' para continuar."*
2. **Di "tutorial"** para escuchar el tutorial interactivo
3. **Di "omitir"** para comenzar directamente

### Activación Normal
- **Di "activar voz"** desde cualquier pantalla de modo ciego
- El asistente responderá: *"Asistente de voz activado. [Saludo contextual]. ¿Qué deseas hacer?"*

---

## 📋 Comandos Disponibles por Pantalla

### 🏠 Pantalla 0 - Inicio

**Saludo del Asistente:**
> "Bienvenido a UNIVOZ. Soy tu asistente de voz. ¿Cómo puedo ayudarte hoy?"

**Comandos Disponibles:**
| Comando | Acción |
|---------|--------|
| `"perfil"` / `"seleccionar"` | Ir a selección de perfil |
| `"detectar"` / `"ia"` | Activar detección con IA |
| `"ayuda"` | Escuchar opciones disponibles |
| `"continuar"` / `"reanudar"` | Reanudar sesión anterior |

---

### 👤 Pantalla 1 - Selección de Perfil

**Saludo del Asistente:**
> "Estás en selección de perfil. ¿Qué perfil describes mejor para ti?"

**Comandos Disponibles:**
| Comando | Acción |
|---------|--------|
| `"ciega"` / `"ciego"` / `"no veo"` | Seleccionar perfil ciego |
| `"sorda"` / `"sordo"` / `"no escucho"` | Seleccionar perfil sordo |
| `"muda"` / `"mudo"` / `"no hablo"` | Seleccionar perfil mudo |
| `"sordomuda"` / `"señas"` | Seleccionar perfil sordomudo |
| `"atrás"` / `"regresar"` | Regresar a pantalla anterior |

**Confirmación del Asistente:**
- *"Perfil ciego seleccionado. Te guiaré con voz en cada paso."*
- *"Perfil sordo seleccionado. Activaré subtítulos y lenguaje de señas."*
- *"Perfil mudo seleccionado. Podrás escribir y la app hablará por ti."*

---

### 🎙️ Pantalla 5 - Inicio Modo Ciego

**Saludo del Asistente:**
> "Estás en el inicio de modo ciego. ¿Qué acción deseas realizar?"

**Comandos Disponibles:**
| Comando | Acción |
|---------|--------|
| `"dictar"` / `"hablar"` / `"grabar"` | Ir a dictado |
| `"historial"` / `"anteriores"` | Ver historial de transcripciones |
| `"ajustes"` / `"configuración"` | Abrir configuración |
| `"ayuda"` | Escuchar opciones disponibles |
| `"leer"` / `"escuchar"` | Leer contenido de la pantalla |
| `"atrás"` / `"regresar"` | Regresar a pantalla anterior |

**Diálogo con Pregunta de Seguimiento:**
```
USUARIO: "dictar"
ASISTENTE: "Iremos a dictar. ¿Deseas activar el micrófono inmediatamente?"
USUARIO: "sí"
ASISTENTE: "Perfecto. Micrófono activado. Puedes comenzar a dictar."
```

---

### 🎤 Pantalla 6 - Dictado de Voz

**Saludo del Asistente:**
> "Estás en dictado de voz. El micrófono está listo. ¿Qué deseas hacer?"

**Comandos Disponibles:**
| Comando | Acción | Confirmación |
|---------|--------|--------------|
| `"micrófono"` / `"grabar"` | Activar/desactivar micrófono | *"Activando micrófono. Comienza a dictar cuando escuches el tono."* |
| `"escuchar"` / `"leer"` | Leer texto transcrito | *"Leeré el texto transcrito en voz alta."* |
| `"copiar"` | Copiar al portapapeles | *"Texto copiado al portapapeles. Ya puedes pegarlo en otra aplicación."* |
| `"borrar"` / `"limpiar"` | Borrar texto | *"Texto borrado. El área de dictado está limpia."* |
| `"ayuda"` | Escuchar opciones | *"En dictado puedes: activar micrófono, escuchar texto, copiar, o borrar."* |
| `"atrás"` / `"regresar"` | Salir de dictado | *"Saliendo de dictado."* |
| `"emergencia"` | Llamar ayuda | *"Activando ayuda de emergencia."* |

---

## 💬 Respuestas que el Asistente Entiende

### Para Afirmar (SÍ):
- "sí"
- "si"
- "yes"
- "correcto"
- "confirmo"
- "acepto"
- "ok"
- "bueno"
- "dale"
- "va"

### Para Negar (NO):
- "no"
- "incorrecto"
- "cancelo"
- "rechazo"
- "nunca"
- "jamás"

---

## 🔊 Características del Asistente

### 1. Confirmaciones Después de Cada Acción

El asistente **siempre confirma** lo que ha hecho:

| Acción | Confirmación |
|--------|--------------|
| Navegar a otra pantalla | *"Navegando a [pantalla]. [Saludo contextual]"* |
| Copiar texto | *"Texto copiado al portapapeles."* |
| Activar micrófono | *"Micrófono activado. Comienza a dictar."* |
| Leer texto | *"Leyendo texto en voz alta."* |

### 2. Manejo Inteligente de Errores

**Primer Error:**
> *"No entendí bien. Di 'ayuda' para ver las opciones disponibles."*

**Segundo Error:**
> *"Disculpa, no escuché claramente. Di 'ayuda' para ver las opciones disponibles."*

**Tercer Error:**
> *"Parece que hay dificultades. Di 'ayuda' para ver las opciones disponibles."*

### 3. Preguntas de Seguimiento

El asistente hace preguntas cuando necesita más información:

```
USUARIO: "dictar"
ASISTENTE: "Iremos a dictar. ¿Deseas activar el micrófono inmediatamente?"
[Espera respuesta: sí o no]
```

### 4. Contexto por Pantalla

El asistente sabe en qué pantalla estás y ofrece opciones relevantes:

- En **Inicio**: ofrece navegación a perfiles
- En **Selección de Perfil**: ofrece los tipos de perfil
- En **Modo Ciego**: ofrece dictado, historial, ajustes
- En **Dictado**: ofrece micrófono, escuchar, copiar, borrar

---

## 🎓 Tutorial Interactivo

### Activar Tutorial
- **Di "tutorial"** desde cualquier pantalla

### Pasos del Tutorial

1. **Bienvenida** (5 segundos)
   > "¡Bienvenido al tutorial de UNIVOZ! Soy tu asistente de voz y te guiaré paso a paso."

2. **Introducción** (5 segundos)
   > "UNIVOZ está diseñado para que lo uses con tu voz. Yo soy tu asistente y estaré aquí para ayudarte."

3. **Navegación** (6 segundos)
   > "Paso 1: Navegación. Puedes decir 'inicio' para ir al inicio, 'dictar' para dictar texto, o 'ajustes' para configurar."

4. **Regresar** (4 segundos)
   > "Paso 2: Para regresar a la pantalla anterior, di 'atrás', 'regresar' o 'volver'."

5. **Dictado** (6 segundos)
   > "Paso 3: En dictado, puedes decir 'micrófono' para activar la grabación, 'escuchar' para oír el texto, o 'copiar' para copiar."

6. **Ayuda** (4 segundos)
   > "Paso 4: En cualquier momento puedes decir 'ayuda' para escuchar las opciones disponibles."

7. **Emergencia** (5 segundos)
   > "Paso 5: Para emergencias, di 'emergencia' o 'necesito ayuda' y la app reproducirá un mensaje de auxilio."

8. **Guía por Pantalla** (5 segundos)
   > "Paso 6: Yo te guiaré en cada pantalla. Cuando llegues a una nueva pantalla, te explicaré qué puedes hacer."

9. **Completado**
   > "¡Tutorial completado! Activaré el asistente de voz. ¿Deseas comenzar a usar UNIVOZ?"
   > [Espera respuesta: sí o no]

---

## 🆘 Comandos de Emergencia

| Comando | Acción |
|---------|--------|
| `"emergencia"` | Reproducir "Necesito ayuda de emergencia" |
| `"ayuda emergencia"` | Reproducir "Necesito ayuda de emergencia" |
| `"necesito ayuda"` | Reproducir "Necesito ayuda" |
| `"llamar ayuda"` | Reproducir "Necesito ayuda de emergencia" |

**Confirmación:** *"Frase de emergencia reproducida. ¿Necesitas algo más?"*

---

## ⚙️ Control del Asistente

| Comando | Acción |
|---------|--------|
| `"activar voz"` | Activar el asistente de voz |
| `"desactivar voz"` | Desactivar el asistente de voz |
| `"comandos de voz"` | Alternar activar/desactivar |
| `"ayuda"` | Escuchar opciones disponibles en la pantalla actual |
| `"tutorial"` | Iniciar tutorial interactivo |

---

## 🎯 Flujo Completo de Uso

### Ejemplo 1: Activar y Navegar

```
1. USUARIO: "activar voz"
2. ASISTENTE: "Asistente de voz activado. Estás en el inicio de modo ciego. 
               ¿Qué acción deseas realizar?"
3. USUARIO: "historial"
4. ASISTENTE: "Mostraré tu historial de transcripciones."
5. [La app navega al historial]
6. ASISTENTE: "Estás en el inicio de modo ciego. ¿Qué acción deseas realizar?"
```

### Ejemplo 2: Dictado con Pregunta de Seguimiento

```
1. USUARIO: "activar voz"
2. ASISTENTE: "Asistente de voz activado. Estás en el inicio de modo ciego. 
               ¿Qué acción deseas realizar?"
3. USUARIO: "dictar"
4. ASISTENTE: "Iremos a dictar. ¿Deseas activar el micrófono inmediatamente?"
5. USUARIO: "sí"
6. ASISTENTE: "Perfecto. Micrófono activado. Puedes comenzar a dictar."
```

### Ejemplo 3: Manejo de Error

```
1. USUARIO: "copiar"
2. ASISTENTE: "Texto copiado al portapapeles."
3. USUARIO: "comando no reconocido"
4. ASISTENTE: "No entendí bien. Di 'ayuda' para ver las opciones disponibles."
5. USUARIO: "ayuda"
6. ASISTENTE: "Ayuda de UNIVOZ. En esta pantalla puedes decir: micrófono, 
               escuchar, copiar, borrar, ayuda, atrás. También puedes decir: 
               inicio, dictar, ajustes, atrás, o emergencia. ¿Qué deseas hacer?"
```

---

## 🛠️ Implementación Técnica

### Estado del Asistente

```javascript
assistantState = {
  isActive: false,           // Si el asistente está guiando activamente
  currentFlow: null,         // Flujo actual: 'navigation', 'dictation', etc.
  currentStep: 0,            // Paso actual en el flujo
  awaitingResponse: false,   // Si está esperando respuesta del usuario
  context: {},               // Contexto de la conversación
  lastAction: null,          // Última acción ejecutada
  errorCount: 0              // Contador de errores para ayuda progresiva
}
```

### Flujos Conversacionales

Cada pantalla tiene un flujo definido con:
- `greeting`: Saludo inicial
- `options`: Lista de opciones con palabras clave y acciones
- `followUp`: Preguntas de seguimiento (sí/no)
- `noResponse`: Mensaje si no hay respuesta

### Procesamiento de Comandos

1. **Verifica si está esperando respuesta** (sí/no)
2. **Busca comando exacto** en el diccionario
3. **Busca comandos parciales** (contiene la palabra clave)
4. **Verifica flujos conversacionales** de la pantalla actual
5. **Maneja error** con mensaje amigable

---

## 📋 Resumen de Comandos

### Navegación (8 comandos)
- inicio, ir a inicio, pantalla principal, home
- atrás, regresar, volver
- dictar, ir a dictar

### Acciones de Dictado (6 comandos)
- escuchar, leer texto, reproducir, leer
- copiar, copiar texto
- micrófono, activar micrófono, grabar
- borrar, limpiar
- iniciar dictado

### Emergencia (4 comandos)
- necesito ayuda, ayuda
- emergencia, ayuda emergencia, llamar ayuda

### Información (4 comandos)
- qué pantalla es esta, pantalla actual, dónde estoy, información

### Tutorial y Ayuda (4 comandos)
- tutorial, iniciar tutorial
- ayuda de comandos, ayuda, qué puedo decir

### Control de Voz (3 comandos)
- activar voz, desactivar voz, comandos de voz

### Respuestas Sí/No (10+ comandos)
- sí, si, yes, correcto, confirmo, acepto, ok, bueno, dale, va
- no, incorrecto, cancelo, rechazo, nunca, jamás

**Total: 40+ comandos disponibles**

---

## 🎯 Beneficios para el Usuario Ciego

1. **Independencia Total**: Puede usar la app sin asistencia visual
2. **Confianza**: Sabe dónde está y qué puede hacer en todo momento
3. **Diálogo Natural**: Conversa con el asistente como con una persona
4. **Confirmaciones**: Cada acción es confirmada verbalmente
5. **Preguntas de Seguimiento**: El asistente pregunta cuando necesita más información
6. **Manejo de Errores**: Retroalimentación clara y útil cuando no entiende
7. **Tutorial Completo**: Aprende a usar la app paso a paso
8. **Contexto Inteligente**: El asistente sabe dónde estás y ofrece opciones relevantes

---

## 🚀 Próximas Mejoras (Futuro)

- [ ] Reconocimiento de voz offline
- [ ] Comandos personalizables por usuario
- [ ] Velocidad de voz ajustable
- [ ] Múltiples idiomas
- [ ] Feedback háptico sincronizado
- [ ] Comandos por gestos
- [ ] Integración con lectores de pantalla nativos (TalkBack, VoiceOver)
- [ ] Historial de comandos recientes
- [ ] Comandos de voz para edición de texto

---

**UNIVOZ 3.0** - Comunicación accesible para todos 🎯

*El asistente de voz que te acompaña en cada paso.*
