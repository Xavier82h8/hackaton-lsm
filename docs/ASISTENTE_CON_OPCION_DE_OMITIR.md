# 🎤 UNIVOZ - Asistente de Voz con Opción de Omitir

## Versión 3.1 - Control Total del Asistente

UNIVOZ 3.1 introduce la capacidad de **omitir el asistente** para usuarios que pueden ver, mientras mantiene la **guía completa por voz** para usuarios ciegos.

---

## 🎯 Dos Modos de Uso

### 👁️ **Modo Lectura** (Asistente Omitido)
- Para usuarios que **pueden ver** la pantalla
- Sin anuncios de voz
- Navegación silenciosa
- Ideal para entornos ruidosos o privacidad

### 🎤 **Modo Asistente** (Activado)
- Para usuarios **ciegos** o con baja visión
- Guía completa por voz
- Anuncios de cada acción
- Diálogo interactivo

---

## 🚀 Primera Vez que Usas la App

### Flujo Normal (Con Asistente)

```
1. App carga
   ↓
2. Anuncio: "Bienvenido a UNIVOZ. Esta es tu primera vez aquí. 
            Soy tu asistente de voz. ¿Te gustaría escuchar un 
            tutorial rápido? Di 'tutorial' para comenzar o 'omitir' 
            para continuar."
   ↓
3. Usuario dice: "tutorial" → Inicia tutorial
   O Usuario dice: "omitir" → Continúa sin tutorial
```

### Botón "Omitir Asistente"

En la pantalla de inicio, verás un botón:

```
┌──────────────────────────────────────────┐
│  [❓ Omitir asistente de voz - Modo lectura] │
└──────────────────────────────────────────┘
```

**Al hacer clic:**
- El asistente se desactiva permanentemente
- Se guarda preferencia en el navegador
- La app funciona en silencio
- Puedes reactivar en cualquier momento

---

## 🎙️ Comandos para Controlar el Asistente

### Omitir/Reactivar Asistente

| Comando de Voz | Acción |
|---------------|--------|
| `"omitir"` | Omite el asistente inmediatamente |
| `"omitir asistente"` | Omite el asistente inmediatamente |
| `"saltar asistente"` | Omite el asistente inmediatamente |
| `"activar asistente"` | Reactiva el asistente si fue omitido |
| `"reactivar asistente"` | Reactiva el asistente si fue omitido |

### Activar/Desactivar Voz

| Comando de Voz | Acción |
|---------------|--------|
| `"activar voz"` | Activa el asistente de voz |
| `"desactivar voz"` | Desactiva el asistente de voz |
| `"comandos de voz"` | Alterna activar/desactivar |

---

## 🔘 Indicador Visual del Asistente

En la **esquina superior derecha** de la pantalla:

```
  ┌─────────────────────────────────┐
  │                          🎤    │ ← Indicador (activo)
  │                                 │
  │    [Contenido de la app]        │
  │                                 │
  └─────────────────────────────────┘
```

### Estados del Indicador

| Estado | Apariencia | Significado |
|--------|-----------|-------------|
| **Inactivo** | No visible | Asistente apagado |
| **Activo** | 🟣 Morado, pulso suave | Escuchando comandos |
| **Escuchando** | 🟢 Verde, pulso rápido | Procesando voz |

**Al hacer clic en el indicador:**
- Si está activo → Desactiva el asistente
- Si está inactivo → Activa el asistente

---

## ⚡ Comandos Rápidos - Ir Directo a la Acción

Para usuarios que ya conocen la app y quieren **ahorrar tiempo**:

### Selección Rápida de Perfil

| Comando | Acción | Confirmación |
|---------|--------|--------------|
| `"ir a ciega"` | Selecciona perfil ciego | *"Perfil ciego seleccionado."* |
| `"ir a sordo"` | Selecciona perfil sordo | *"Perfil sordo seleccionado."* |
| `"ir a mudo"` | Selecciona perfil mudo | *"Perfil mudo seleccionado."* |
| `"modo ciego"` | Selecciona perfil ciego | *"Perfil ciego seleccionado."* |
| `"modo sordo"` | Selecciona perfil sordo | *"Perfil sordo seleccionado."* |
| `"modo mudo"` | Selecciona perfil mudo | *"Perfil mudo seleccionado."* |

### Ejemplo de Uso Rápido

```
USUARIO (al abrir la app): "modo ciego"
ASISTENTE: "Perfil ciego seleccionado."
[La app navega directamente a configuración de perfil ciego]
```

---

## 📋 Flujo Completo - Usuario Ciego (Primera Vez)

### Opción A: Con Tutorial (Recomendado)

```
1. USUARIO abre la app
2. ASISTENTE: "Bienvenido a UNIVOZ. Esta es tu primera vez aquí. 
               Soy tu asistente de voz. ¿Te gustaría escuchar un 
               tutorial rápido? Di 'tutorial' para comenzar o 
               'omitir' para continuar."

3. USUARIO: "tutorial"
4. ASISTENTE: [Reproduce tutorial de 9 pasos]

5. ASISTENTE: "¡Tutorial completado! Activaré el asistente de voz. 
               ¿Deseas comenzar a usar UNIVOZ?"

6. USUARIO: "sí"
7. ASISTENTE: "¡Excelente! Comencemos a usar UNIVOZ. 
               Asistente de voz activado. Estás en el inicio de 
               modo ciego. ¿Qué acción deseas realizar?"
```

### Opción B: Sin Tutorial (Rápido)

```
1. USUARIO abre la app
2. ASISTENTE: "Bienvenido a UNIVOZ. Esta es tu primera vez aquí. 
               Soy tu asistente de voz. ¿Te gustaría escuchar un 
               tutorial rápido? Di 'tutorial' para comenzar o 
               'omitir' para continuar."

3. USUARIO: "omitir"
4. ASISTENTE: "Asistente omitido. Modo lectura activado. 
               Puedes reactivarlo en cualquier momento diciendo 
               'activar asistente'."

[El usuario puede reactivar en cualquier momento]
```

### Opción C: Botón Físico (Usuarios que pueden ver)

```
1. USUARIO abre la app
2. USUARIO ve el botón "Omitir asistente de voz - Modo lectura"
3. USUARIO hace clic en el botón
4. ASISTENTE: "Asistente omitido. Modo lectura activado."

[La app funciona en silencio desde ese momento]
```

---

## 📋 Flujo Completo - Usuario Recurrente

### Con Asistente Activado

```
1. USUARIO abre la app
2. ASISTENTE: "UNIVOZ está lista. Soy tu asistente de voz. 
               Di 'activar voz' para comenzar o toca el botón 
               de micrófono."

3. USUARIO: "activar voz"
4. ASISTENTE: "Asistente de voz activado. Estás en el inicio 
               de modo ciego. ¿Qué acción deseas realizar?"
```

### Con Asistente Omitido (Preferencia Guardada)

```
1. USUARIO abre la app
2. [Sin anuncio de voz - silencio]
3. USUARIO puede:
   - Usar la app en silencio (modo lectura)
   - Decir "activar asistente" para reactivar
   - Tocar el indicador de micrófono
```

---

## 🎯 Comandos por Pantalla (Resumen)

### Pantalla 0 - Inicio

**Saludo del Asistente:**
> "Bienvenido a UNIVOZ. Soy tu asistente de voz. ¿Cómo puedo ayudarte hoy?"

**Comandos Disponibles:**

| Tipo | Comando | Acción |
|------|---------|--------|
| **Rápido** | `"modo ciego"` | Ir directo a perfil ciego |
| **Rápido** | `"modo sordo"` | Ir directo a perfil sordo |
| **Rápido** | `"modo mudo"` | Ir directo a perfil mudo |
| Normal | `"perfil"` / `"seleccionar"` | Ir a selección de perfil |
| Normal | `"detectar"` / `"ia"` | Activar detección con IA |
| Normal | `"continuar"` / `"reanudar"` | Reanudar sesión anterior |
| Control | `"omitir"` | Omitir asistente |
| Control | `"tutorial"` | Iniciar tutorial |
| Control | `"ayuda"` | Escuchar opciones |

---

## ⚙️ Preferencias Guardadas

La app guarda las siguientes preferencias en el navegador:

| Preferencia | Key | Valor |
|------------|-----|-------|
| Primera visita | `univoz_visited` | `'true'` |
| Asistente omitido | `univoz_assistant_skipped` | `'true'` |

### Resetear Preferencias

Para restaurar el comportamiento predeterminado:

```javascript
localStorage.removeItem('univoz_visited');
localStorage.removeItem('univoz_assistant_skipped');
location.reload();
```

---

## 🎨 Elementos de UI

### Botón "Omitir Asistente"

**Ubicación:** Pantalla de inicio (sc0), debajo de los botones principales

**Apariencia:**
```
┌───────────────────────────────────────────┐
│  ⏭️ Omitir asistente de voz - Modo lectura │
└───────────────────────────────────────────┘
```

**Visible solo cuando:**
- El asistente está habilitado
- El usuario no lo ha omitido permanentemente

### Indicador de Asistente

**Ubicación:** Esquina superior derecha de cualquier pantalla

**Estados:**

1. **Inactivo** (no visible)
   - Asistente desactivado
   - Modo lectura activo

2. **Activo** (🟣 Morado, pulso suave)
   - Asistente activado
   - Esperando comandos

3. **Escuchando** (🟢 Verde, pulso rápido)
   - Procesando comando de voz
   - Grabando audio

---

## 🚀 Comandos Más Usados

### Para Usuarios Principiantes

1. `"activar voz"` - Activar el asistente
2. `"tutorial"` - Escuchar tutorial
3. `"ayuda"` - Ver opciones disponibles
4. `"omitir"` - Omitir asistente

### Para Usuarios Avanzados

1. `"modo ciego"` - Ir directo a perfil ciego
2. `"dictar"` - Ir a dictado
3. `"micrófono"` - Activar micrófono
4. `"copiar"` - Copiar texto
5. `"atrás"` - Regresar

---

## 💡 Consejos de Uso

### Para Usuarios Ciegos

1. **Activa el asistente** diciendo "activar voz"
2. **Escucha el saludo** de la pantalla actual
3. **Di el comando** que deseas ejecutar
4. **Espera la confirmación** del asistente
5. **Di "ayuda"** si no estás seguro de las opciones

### Para Usuarios que Pueden Ver

1. **Explora la interfaz** visualmente
2. **Usa el botón "Omitir asistente"** si prefieres silencio
3. **Toca el indicador** para reactivar el asistente cuando lo necesites
4. **Usa comandos rápidos** como "modo ciego" para ir directo

### Para Entornos Ruidosos

1. **Omite el asistente** temporalmente
2. **Usa la interfaz táctil**
3. **Reactiva el asistente** cuando el entorno sea más silencioso

---

## 🔧 Solución de Problemas

### "El botón de omitir no aparece"

- Verifica que el asistente no haya sido omitido ya
- Revisa si `univoz_assistant_skipped` está en localStorage

### "El indicador no cambia de color"

- Verifica que el micrófono tenga permisos
- Revisa la consola del navegador para errores

### "El asistente se activa solo"

- El indicador puede haber sido tocado accidentalmente
- Omite el asistente permanentemente con el botón o comando de voz

### "Quiero volver a escuchar los anuncios"

- Di "activar asistente" o
- Toca el indicador de micrófono o
- Elimina `univoz_assistant_skipped` del localStorage

---

## 📊 Comparativa: Antes vs Después

| Característica | Versión Anterior | Versión 3.1 |
|---------------|------------------|-------------|
| Omitir asistente | ❌ No disponible | ✅ Botón y comandos |
| Indicador visual | ❌ No disponible | ✅ Con estados |
| Comandos rápidos | ⚠️ Limitados | ✅ Para ir directo |
| Preferencia guardada | ❌ No | ✅ En localStorage |
| Reactivar fácil | ❌ Difícil | ✅ Múltiples formas |
| Modo lectura | ❌ No existe | ✅ Silencio total |

---

## 🎯 Beneficios

### Para Usuarios Ciegos

1. **Guía completa** en cada paso
2. **Confirmaciones** de cada acción
3. **Diálogo interactivo** natural
4. **Tutorial** para aprender

### Para Usuarios que Pueden Ver

1. **Opción de omitir** el asistente
2. **Modo lectura** silencioso
3. **Comandos rápidos** para eficiencia
4. **Reactivar fácil** cuando lo necesiten

### Para Todos

1. **Preferencia guardada** en el navegador
2. **Indicador visual** del estado
3. **Múltiples formas** de controlar el asistente
4. **Flexibilidad** total de uso

---

**UNIVOZ 3.1** - Comunicación accesible para todos 🎯

*El asistente que se adapta a tus necesidades.*
