/* ============================================================
   COMANDOS DE VOZ PARA USUARIOS CIEGOS
   Versión 1.0 - UNIVOZ
   ============================================================ */

let voiceCommandActive = false;
let recognition = null;
let isListening = false;

// Comandos de voz disponibles
const VOICE_COMMANDS = {
  // Navegación principal
  'inicio': () => goHome(),
  'ir a inicio': () => goHome(),
  'pantalla principal': () => goHome(),
  
  'dictar': () => go(6),
  'ir a dictar': () => go(6),
  'modo dictado': () => go(6),
  
  'historial': () => go(5),
  'ir al historial': () => go(5),
  'ver historial': () => go(5),
  
  'ajustes': () => openSettings(),
  'ir a ajustes': () => openSettings(),
  'configuración': () => openSettings(),
  
  'atrás': () => goBack(),
  'regresar': () => goBack(),
  'volver': () => goBack(),
  
  // Acciones de dictado
  'escuchar': () => speakBlindText(),
  'leer texto': () => speakBlindText(),
  'reproducir': () => speakBlindText(),
  
  'copiar': () => copyBlindText(),
  'copiar texto': () => copyBlindText(),
  
  'micrófono': () => toggleBlindMic(),
  'activar micrófono': () => toggleBlindMic(),
  'grabar': () => toggleBlindMic(),
  
  // Frases rápidas
  'necesito ayuda': () => speakBlindPhrase('Necesito ayuda'),
  'ayuda': () => speakBlindPhrase('Necesito ayuda'),
  'emergencia': () => speakBlindPhrase('Necesito ayuda de emergencia'),
  'ayuda emergencia': () => speakBlindPhrase('Necesito ayuda de emergencia'),
  
  // Control de voz
  'activar voz': () => enableVoiceCommands(),
  'desactivar voz': () => disableVoiceCommands(),
  'comandos de voz': () => toggleVoiceCommands(),
  'ayuda de comandos': () => showVoiceHelp(),
};

// Inicializar reconocimiento de voz
function initVoiceRecognition() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    console.log('Reconocimiento de voz no soportado');
    return false;
  }
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'es-ES';
  
  recognition.onstart = () => {
    isListening = true;
    announce('Escuchando comando...');
  };
  
  recognition.onend = () => {
    isListening = false;
  };
  
  recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.toLowerCase().trim();
    console.log('Comando de voz detectado:', command);
    processVoiceCommand(command);
  };
  
  recognition.onerror = (event) => {
    console.error('Error en reconocimiento de voz:', event.error);
    isListening = false;
    if (event.error === 'no-speech') {
      announce('No se detectó voz. Intente nuevamente.');
    } else if (event.error === 'audio-capture') {
      announce('No se detectó micrófono. Verifique su configuración.');
    }
  };
  
  return true;
}

// Procesar comando de voz
function processVoiceCommand(command) {
  console.log('Procesando comando:', command);
  
  // Buscar comando exacto
  if (VOICE_COMMANDS[command]) {
    VOICE_COMMANDS[command]();
    announce('Comando ejecutado: ' + command);
    return;
  }
  
  // Buscar comandos parciales
  for (const [key, action] of Object.entries(VOICE_COMMANDS)) {
    if (command.includes(key)) {
      action();
      announce('Comando ejecutado: ' + key);
      return;
    }
  }
  
  // Comando no reconocido
  announce('Comando no reconocido. Diga "ayuda de comandos" para ver la lista.');
}

// Activar comandos de voz
function enableVoiceCommands() {
  if (!recognition && !initVoiceRecognition()) {
    announce('El reconocimiento de voz no está disponible en este dispositivo.');
    return;
  }
  
  voiceCommandActive = true;
  announce('Comandos de voz activados. Puede comenzar a hablar.');
  startListening();
}

// Desactivar comandos de voz
function disableVoiceCommands() {
  voiceCommandActive = false;
  if (recognition && isListening) {
    recognition.stop();
  }
  announce('Comandos de voz desactivados.');
}

// Alternar comandos de voz
function toggleVoiceCommands() {
  if (voiceCommandActive) {
    disableVoiceCommands();
  } else {
    enableVoiceCommands();
  }
}

// Iniciar escucha
function startListening() {
  if (!voiceCommandActive || !recognition || isListening) return;
  
  try {
    recognition.start();
  } catch (e) {
    console.error('Error al iniciar reconocimiento:', e);
  }
}

// Detener escucha
function stopListening() {
  if (recognition && isListening) {
    try {
      recognition.stop();
    } catch (e) {
      console.error('Error al detener reconocimiento:', e);
    }
  }
}

// Mostrar ayuda de comandos
function showVoiceHelp() {
  const helpText = `
    Comandos de voz disponibles:
    
    Navegación:
    - Inicio, Ir a inicio
    - Dictar, Ir a dictar
    - Historial, Ir al historial
    - Ajustes, Ir a ajustes
    - Atrás, Regresar, Volver
    
    Acciones:
    - Escuchar, Leer texto
    - Copiar, Copiar texto
    - Micrófono, Activar micrófono, Grabar
    
    Frases rápidas:
    - Necesito ayuda, Ayuda
    - Emergencia, Ayuda emergencia
    
    Control:
    - Activar voz
    - Desactivar voz
    - Ayuda de comandos
  `;
  
  announce(helpText);
  console.log(helpText);
}

// Anunciar texto con síntesis de voz
function announce(text, priority = 'normal') {
  if (!('speechSynthesis' in window)) return;
  
  // Cancelar anuncios anteriores si es prioridad alta
  if (priority === 'high') {
    speechSynthesis.cancel();
  }
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';
  utterance.rate = 0.9; // Un poco más lento para claridad
  utterance.pitch = 1;
  utterance.volume = 1;
  
  speechSynthesis.speak(utterance);
}

// Anunciar cambios de pantalla
function announceScreenChange(screenName) {
  announce('Navegando a: ' + screenName, 'high');
}

// Inicializar sistema de voz
function initVoiceSystem() {
  if (initVoiceRecognition()) {
    console.log('Sistema de voz inicializado correctamente');
    
    // Anunciar que la app está lista
    setTimeout(() => {
      announce('UNIVOZ está lista. Para activar comandos de voz, diga "activar voz" o toque el botón de micrófono.');
    }, 2000);
  }
}

// Exportar funciones globales
window.enableVoiceCommands = enableVoiceCommands;
window.disableVoiceCommands = disableVoiceCommands;
window.toggleVoiceCommands = toggleVoiceCommands;
window.startListening = startListening;
window.stopListening = stopListening;
window.showVoiceHelp = showVoiceHelp;
window.announce = announce;
window.announceScreenChange = announceScreenChange;
window.initVoiceSystem = initVoiceSystem;
window.processVoiceCommand = processVoiceCommand;
