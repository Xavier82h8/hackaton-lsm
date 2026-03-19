# 🎤 UNIVOZ - Prioridad para Usuarios Ciegos

## Versión 3.2 - Acceso Urgente a Dictado

UNIVOZ 3.2 **prioriza a los usuarios ciegos** con acceso inmediato a funciones críticas como dictado de voz, sin importar en qué pantalla se encuentren.

---

## 🚨 Acceso Urgente a Dictado

### Para Usuarios Ciegos - ¡Dictar Inmediatamente!

Si un usuario ciego **necesita tomar nota urgentemente**, puede decir:

| Comando | Acción |
|---------|--------|
| `"dictar"` | Abre dictado y activa micrófono **inmediatamente** |
| `"tomar nota"` | Abre dictado y activa micrófono **inmediatamente** |
| `"nota rápida"` | Abre dictado y activa micrófono **inmediatamente** |
| `"ir a dictar"` | Abre dictado y activa micrófono **inmediatamente** |

### Flujo de Dictado Urgente

```
USUARIO (en cualquier pantalla): "dictar"

ASISTENTE: "Abriendo dictado inmediatamente."
[0.5 segundos después]
ASISTENTE: "Micrófono activado. Comienza a dictar."

[El usuario puede comenzar a dictar inmediatamente]
```

---

## 📋 Comandos Prioritarios por Pantalla

### Pantalla 0 - Inicio

**Saludo del Asistente:**
> "Bienvenido a UNIVOZ. Soy tu asistente de voz. ¿Cómo puedo ayudarte hoy? **Para dictar urgentemente, di 'dictar'.**"

**Comandos Disponibles:**

| Prioridad | Comando | Acción |
|-----------|---------|--------|
| **ALTA** | `"dictar"` / `"tomar nota"` / `"nota rápida"` | Dictado inmediato |
| Normal | `"perfil"` / `"seleccionar"` | Ir a selección de perfil |
| Normal | `"detectar"` / `"ia"` | Detección con IA |
| Normal | `"ayuda"` | Escuchar opciones |
| Normal | `"continuar"` / `"reanudar"` | Reanudar sesión |

**Mensaje si no hay respuesta:**
> "No he escuchado tu respuesta. **Para usuarios ciegos: di 'dictar' para tomar nota inmediatamente.** También puedes decir: seleccionar perfil, detectar con IA, o pedir ayuda. ¿Qué deseas hacer?"

---

### Pantalla 1 - Selección de Perfil

**Saludo del Asistente:**
> "Estás en selección de perfil. ¿Qué perfil describes mejor para ti? **Si necesitas dictar, di 'dictar'.**"

**Comandos Disponibles:**

| Prioridad | Comando | Acción |
|-----------|---------|--------|
| **ALTA** | `"dictar"` / `"nota rápida"` / `"urgente"` | Dictado inmediato |
| Normal | `"ciega"` / `"ciego"` / `"no veo"` | Perfil ciego |
| Normal | `"sorda"` / `"sordo"` / `"no escucho"` | Perfil sordo |
| Normal | `"muda"` / `"mudo"` / `"no hablo"` | Perfil mudo |
| Normal | `"sordomuda"` / `"sordomudo"` / `"señas"` | Perfil sordomudo |

**Mensaje si no hay respuesta:**
> "No he escuchado tu respuesta. Puedes decir: soy ciega, soy sorda, soy muda, o soy sordomuda. **Si necesitas dictar urgentemente, di 'dictar'.** ¿Cuál describes para ti?"

---

### Pantalla 5 - Inicio Modo Ciego (PRIORIDAD MÁXIMA)

**Saludo del Asistente:**
> "Estás en el inicio de modo ciego. ¿Qué acción deseas realizar? **Para dictar, di 'dictar'.**"

**Comandos Disponibles:**

| Prioridad | Comando | Acción |
|-----------|---------|--------|
| **ALTA** | `"dictar"` / `"tomar nota"` / `"urgente"` | Dictado inmediato |
| Normal | `"historial"` / `"anteriores"` | Ver historial |
| Normal | `"ajustes"` / `"configuración"` | Configuración |
| Normal | `"ayuda"` | Escuchar opciones |
| Normal | `"leer"` / `"escuchar"` | Leer pantalla |

**Mensaje si no hay respuesta:**
> "No he escuchado tu respuesta. **Para usuarios ciegos: di 'dictar' para tomar nota inmediatamente.** También puedes decir: historial, ajustes, ayuda, o leer pantalla. ¿Qué deseas hacer?"

---

### Pantalla 6 - Dictado

**Saludo del Asistente:**
> "Estás en dictado de voz. El micrófono está listo. ¿Qué deseas hacer?"

**Comandos Disponibles:**

| Prioridad | Comando | Acción |
|-----------|---------|--------|
| **ALTA** | `"micrófono"` / `"grabar"` / `"activar"` | Activar micrófono |
| Normal | `"escuchar"` / `"leer"` | Leer texto |
| Normal | `"copiar"` | Copiar texto |
| Normal | `"borrar"` / `"limpiar"` | Borrar texto |
| Normal | `"ayuda"` | Escuchar opciones |

---

## 🎯 Flujo Completo - Usuario Ciego Urgente

### Escenario: Necesita Tomar Nota Rápida

```
1. USUARIO abre la app (pantalla 0 - Inicio)

2. USUARIO: "dictar"

3. ASISTENTE: "Abriendo dictado inmediatamente."
   [Navega directamente a pantalla 6]

4. ASISTENTE: "Micrófono activado. Comienza a dictar."
   [Activa el micrófono automáticamente]

5. USUARIO comienza a dictar su nota urgentemente

6. USUARIO: "copiar"
   ASISTENTE: "Texto copiado al portapapeles."

7. USUARIO: "atrás"
   ASISTENTE: "Saliendo de dictado."
```

### Escenario: En Selección de Perfil, Necesita Dictar

```
1. USUARIO está en pantalla 1 (Selección de Perfil)

2. USUARIO: "dictar"

3. ASISTENTE: "Abriendo dictado inmediatamente. Activando micrófono."
   [Navega a pantalla 6 y activa micrófono]

4. ASISTENTE: "Micrófono activado. Comienza a dictar."

5. USUARIO dicta su nota urgente

6. DESPUÉS puede regresar a seleccionar perfil:
   USUARIO: "atrás"
   ASISTENTE: "Regresando a la pantalla anterior."
```

---

## 🔊 Características de Prioridad

### 1. Dictado Sin Preguntas

**Antes (versión anterior):**
```
USUARIO: "dictar"
ASISTENTE: "Iremos a dictar. ¿Deseas activar el micrófono inmediatamente?"
USUARIO: "sí"
ASISTENTE: "Perfecto. Micrófono activado."
```

**Ahora (versión 3.2 - PRIORIDAD CIEGOS):**
```
USUARIO: "dictar"
ASISTENTE: "Abriendo dictado inmediatamente."
[0.5s después]
ASISTENTE: "Micrófono activado. Comienza a dictar."
```

**Beneficio:** Ahorra 2-3 segundos críticos en situaciones urgentes.

### 2. Comandos Múltiples para la Misma Acción

Para asegurar que el reconocimiento funcione en diferentes acentos y formas de hablar:

| Acción | Comandos Equivalentes |
|--------|----------------------|
| Dictado urgente | `"dictar"`, `"tomar nota"`, `"nota rápida"`, `"ir a dictar"`, `"grabar voz"` |
| Activar micrófono | `"micrófono"`, `"grabar"`, `"activar"`, `"iniciar"`, `"comenzar"` |
| Leer texto | `"escuchar"`, `"leer"`, `"leer texto"`, `"reproducir"` |
| Copiar texto | `"copiar"`, `"copiar texto"`, `"portapapeles"` |

### 3. Ayuda Prioriza Comandos para Ciegos

**Cuando el usuario dice "ayuda":**

```
ASISTENTE: "Ayuda de UNIVOZ. 
            Para dictar urgentemente, di: 'dictar', 'tomar nota', o 'nota rápida'. 
            En esta pantalla también puedes decir: dictar, historial, ajustes, ayuda, leer, atrás. 
            Comandos globales: inicio, ajustes, atrás, emergencia. 
            ¿Qué deseas hacer?"
```

**Nota:** Los comandos de dictado se mencionan **primero**.

---

## 🎯 Comparativa: Usuario Ciego vs Usuario que Puede Ver

### Usuario Ciego (Prioritario)

| Necesidad | Comando | Respuesta |
|-----------|---------|-----------|
| Dictar urgentemente | `"dictar"` | Inmediato, sin preguntas |
| Activar micrófono | `"micrófono"` | Activa inmediatamente |
| Escuchar texto | `"escuchar"` | Lee en voz alta |
| Copiar texto | `"copiar"` | Copia y confirma |
| Emergencia | `"emergencia"` | Reproduce frase de ayuda |

### Usuario que Puede Ver (Opcional)

| Necesidad | Acción | Respuesta |
|-----------|--------|-----------|
| Silencio | Botón "Omitir asistente" | Modo lectura activado |
| Navegación visual | Toques en pantalla | Sin anuncios de voz |
| Reactivar voz | Toque en indicador o `"activar asistente"` | Asistente reactivado |

---

## 📊 Tiempos de Respuesta

### Versión Anterior (Sin Prioridad)

| Acción | Tiempo |
|--------|--------|
| Decir "dictar" → Micrófono activo | ~3-4 segundos |
| Preguntas intermedias | Sí |
| Confirmaciones | Múltiples |

### Versión 3.2 (Prioridad Ciegos)

| Acción | Tiempo |
|--------|--------|
| Decir "dictar" → Micrófono activo | **~0.5 segundos** |
| Preguntas intermedias | **No** |
| Confirmaciones | **Mínimas** |

**Mejora:** 6-8x más rápido para situaciones urgentes.

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Nota Médica Urgente

```
SITUACIÓN: Usuario ciego necesita anotar información médica urgente

USUARIO: "dictar"
ASISTENTE: "Abriendo dictado inmediatamente. Micrófono activado. Comienza a dictar."

USUARIO dicta: "Cita con el doctor el martes 19 de marzo a las 3 de la tarde. 
                Teléfono: 555-1234. Tomar pastilla antes de comer."

USUARIO: "copiar"
ASISTENTE: "Texto copiado al portapapeles. Ya puedes pegarlo en otra aplicación."

USUARIO: "inicio"
ASISTENTE: "Regresando al inicio."
```

### Ejemplo 2: Idea Repentina

```
SITUACIÓN: Usuario ciego tiene una idea y necesita anotarla rápido

USUARIO (desde pantalla de selección de perfil): "nota rápida"
ASISTENTE: "Abriendo dictado inmediatamente. Micrófono activado. Comienza a dictar."

USUARIO dicta rápidamente su idea

USUARIO: "escuchar"
ASISTENTE: [Lee el texto en voz alta]

USUARIO: "copiar"
ASISTENTE: "Texto copiado al portapapeles."
```

### Ejemplo 3: Número de Teléfono

```
SITUACIÓN: Alguien le dice un número de teléfono al usuario ciego

USUARIO: "tomar nota"
ASISTENTE: "Abriendo dictado inmediatamente. Micrófono activado. Comienza a dictar."

USUARIO dicta: "Teléfono de María: 555-9876. Llamar mañana."

USUARIO: "copiar"
ASISTENTE: "Texto copiado al portapapeles."
```

---

## 🔧 Implementación Técnica

### Flujo de Dictado Urgente

```javascript
'dictar': () => {
  // PRIORIDAD PARA CIEGOS: Ir directo a dictar sin preguntar
  go(6);  // Navega a pantalla de dictado
  assistantAnnounce('Abriendo dictado inmediatamente.');
  setTimeout(() => {
    toggleBlindMic();  // Activa micrófono
    announce('Micrófono activado. Comienza a dictar.', 'high');
  }, 500);  // Solo 0.5 segundos de espera
}
```

### Flujos Conversacionales con Prioridad

```javascript
CONVERSATIONAL_FLOWS = {
  0: { // Inicio
    priority: ['dictar', 'nota rápida', 'tomar nota'], // PRIORITARIOS
    options: [
      { keywords: ['dictar', 'nota rápida'], action: 'goToDictationImmediate' },
      // ... otras opciones
    ],
  },
  5: { // Inicio modo ciego - PRIORIDAD MÁXIMA
    priority: ['dictar', 'nota rápida', 'urgente'],
    options: [
      { keywords: ['dictar', 'urgente'], action: 'goToDictationImmediate' },
      // ... otras opciones
    ],
  },
}
```

### Acción de Dictado Inmediato

```javascript
case 'goToDictationImmediate':
  // Ir a dictado INMEDIATAMENTE sin preguntar - PRIORIDAD PARA CIEGOS
  go(6);
  assistantAnnounce(option.response + ' Activando micrófono.');
  setTimeout(() => {
    toggleBlindMic();
    announce('Micrófono activado. Comienza a dictar.', 'high');
  }, 500);
  break;
```

---

## 🎯 Beneficios para Usuarios Ciegos

1. **Velocidad**: Dictado en 0.5 segundos vs 3-4 segundos anteriores
2. **Sin preguntas**: No hay diálogo intermedio que retrase la acción
3. **Múltiples comandos**: Diferentes formas de decir lo mismo
4. **Prioridad en ayuda**: Comandos de dictado se mencionan primero
5. **Acceso desde cualquier pantalla**: No importa dónde estés, "dictar" funciona
6. **Confirmaciones claras**: Sabes exactamente qué está pasando

---

## 📋 Resumen de Comandos Prioritarios

### Dictado Urgente (Máxima Prioridad)

| Comando | Cuándo Usar |
|---------|-------------|
| `"dictar"` | Comando principal, más directo |
| `"tomar nota"` | Alternativa natural |
| `"nota rápida"` | Para notas breves |
| `"ir a dictar"` | Comando explícito de navegación |
| `"grabar voz"` | Alternativa descriptiva |

### Acciones en Dictado (Alta Prioridad)

| Comando | Acción |
|---------|--------|
| `"micrófono"` / `"grabar"` | Activar/desactivar micrófono |
| `"escuchar"` / `"leer"` | Leer texto transcrito |
| `"copiar"` | Copiar al portapapeles |
| `"borrar"` / `"limpiar"` | Borrar texto |

---

**UNIVOZ 3.2** - Comunicación accesible para todos 🎯

*Priorizando las necesidades de usuarios ciegos.*
