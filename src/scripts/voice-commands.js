/* ============================================================
   COMANDOS DE VOZ PARA USUARIOS CIEGOS
   Versión 2.0 - UNIVOZ - Con guía de audio activa
   ============================================================ */

let voiceCommandActive = false;
let recognition = null;
let isListening = false;
let isFirstTime = true;
let currentScreenName = '';

// Mapa de nombres de pantallas para anuncios
const SCREEN_NAMES = {
  0: 'Pantalla de inicio',
  1: 'Selección de perfil',
  2: 'Detección con IA',
  3: 'Confirmación de perfil',
  4: 'Configuración de perfil ciego',
  5: 'Inicio modo ciego',
  6: 'Dictado de voz',
  7: 'Configuración de perfil sordo',
  8: 'Inicio modo sordo',
  9: 'Subtítulos en vivo',
  10: 'Señas LSM',
  11: 'Transcripción',
  12: 'Configuración de perfil mudo',
  13: 'Inicio modo mudo',
  14: 'Texto a voz',
  15: 'Ajustes modo ciego',
  16: 'Ajustes modo sordo',
  17: 'Ajustes modo mudo',
};

// Comandos de voz disponibles
const VOICE_COMMANDS = {
  // Navegación principal
  'inicio': () => goHome(),
  'ir a inicio': () => goHome(),
  'pantalla principal': () => goHome(),
  'home': () => goHome(),
  
  'dictar': () => go(6),
  'ir a dictar': () => go(6),
  'modo dictado': () => go(6),
  
  'historial': () => {
    const profile = appState.activeProfile;
    if (profile === 'blind') go(5);
    else announce('El historial está disponible en modo ciego');
  },
  'ir al historial': () => VOICE_COMMANDS['historial'](),
  'ver historial': () => VOICE_COMMANDS['historial'](),
  
  'ajustes': () => openSettings(),
  'ir a ajustes': () => openSettings(),
  'configuración': () => openSettings(),
  'opciones': () => openSettings(),
  
  'atrás': () => goBack(),
  'regresar': () => goBack(),
  'volver': () => goBack(),
  
  // Acciones de dictado
  'escuchar': () => speakBlindText(),
  'leer texto': () => speakBlindText(),
  'reproducir': () => speakBlindText(),
  'leer': () => speakBlindText(),
  
  'copiar': () => copyBlindText(),
  'copiar texto': () => copyBlindText(),
  
  'micrófono': () => toggleBlindMic(),
  'activar micrófono': () => toggleBlindMic(),
  'grabar': () => toggleBlindMic(),
  'iniciar dictado': () => {
    if (appState.currentScreen !== 6) {
      go(6);
      setTimeout(() => toggleBlindMic(), 500);
    } else {
      toggleBlindMic();
    }
  },
  
  // Frases rápidas
  'necesito ayuda': () => speakBlindPhrase('Necesito ayuda'),
  'ayuda': () => speakBlindPhrase('Necesito ayuda'),
  'emergencia': () => speakBlindPhrase('Necesito ayuda de emergencia'),
  'ayuda emergencia': () => speakBlindPhrase('Necesito ayuda de emergencia'),
  'llamar ayuda': () => speakBlindPhrase('Necesito ayuda de emergencia'),
  
  // Control de voz
  'activar voz': () => enableVoiceCommands(),
  'desactivar voz': () => disableVoiceCommands(),
  'comandos de voz': () => toggleVoiceCommands(),
  'ayuda de comandos': () => showVoiceHelp(),
  'ayuda': () => showVoiceHelp(),
  'qué puedo decir': () => showVoiceHelp(),
  'lista de comandos': () => showVoiceHelp(),
  
  // Información
  'qué pantalla es esta': () => announceCurrentScreen(),
  'pantalla actual': () => announceCurrentScreen(),
  'dónde estoy': () => announceCurrentScreen(),
  'información': () => announceCurrentScreen(),
  
  // Tutorial
  'tutorial': () => startTutorial(),
  'iniciar tutorial': () => startTutorial(),
  'cómo se usa': () => startTutorial(),
  'ayuda inicial': () => startTutorial(),
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
function announceScreenChange(screenNumber) {
  const screenName = SCREEN_NAMES[screenNumber] || 'Pantalla';
  currentScreenName = screenName;
  
  // Anunciar nombre de pantalla y acciones disponibles
  const actions = getAvailableActions(screenNumber);
  announce(`${screenName}. ${actions}`, 'high');
}

// Obtener acciones disponibles por pantalla
function getAvailableActions(screenNumber) {
  const actions = {
    0: 'Para comenzar, selecciona tu perfil o usa detección con IA',
    1: 'Selecciona un perfil: Soy ciega, Soy sorda, o Soy muda',
    2: 'La IA está analizando. Espera un momento',
    3: 'Confirma tu perfil seleccionado',
    4: 'Revisa las preferencias. Presiona Entrar a UNIVOZ cuando estés listo',
    5: 'Modo ciego activo. Di "dictar" para comenzar o "ayuda" para más opciones',
    6: 'Dictado de voz. Di "micrófono" para activar o "ayuda" para más opciones',
    7: 'Configuración de perfil sordo',
    8: 'Modo sordo activo',
    9: 'Subtítulos en vivo',
    10: 'Señas LSM',
    11: 'Transcripción de audio',
    12: 'Configuración de perfil mudo',
    13: 'Modo mudo activo',
    14: 'Texto a voz',
    15: 'Ajustes de modo ciego',
    16: 'Ajustes de modo sordo',
    17: 'Ajustes de modo mudo',
  };
  return actions[screenNumber] || '';
}

// Anunciar pantalla actual
function announceCurrentScreen() {
  const screenNum = appState.currentScreen;
  const screenName = SCREEN_NAMES[screenNum] || 'Pantalla desconocida';
  const actions = getAvailableActions(screenNum);
  
  announce(`${screenName}. ${actions}`, 'high');
}

// Tutorial guiado para primera vez
function startTutorial() {
  disableVoiceCommands();
  
  const tutorialSteps = [
    'Bienvenido a UNIVOZ. Este es un tutorial para usar la app con comandos de voz.',
    'Paso 1: Para navegar, di el nombre de la acción. Por ejemplo: "inicio", "dictar", "ajustes".',
    'Paso 2: Para regresar, di "atrás" o "volver".',
    'Paso 3: Para activar el dictado, di "micrófono" o "iniciar dictado".',
    'Paso 4: Para escuchar el texto transcrito, di "escuchar" o "leer texto".',
    'Paso 5: En caso de emergencia, di "emergencia" o "ayuda emergencia".',
    'Paso 6: Para ver esta ayuda nuevamente, di "tutorial" o "ayuda de comandos".',
    'Tutorial completado. Los comandos de voz siguen activos. ¡Comienza a usar UNIVOZ!',
  ];
  
  let step = 0;
  
  function playNextStep() {
    if (step >= tutorialSteps.length) {
      enableVoiceCommands();
      return;
    }
    
    announce(tutorialSteps[step], 'normal');
    step++;
    
    // Esperar 4 segundos entre cada paso
    setTimeout(playNextStep, 4000);
  }
  
  playNextStep();
}

// Guía contextual inteligente
function smartGuide() {
  const screen = appState.currentScreen;
  
  // Guías específicas por pantalla
  const guides = {
    0: 'Bienvenido a UNIVOZ. Para comenzar, selecciona tu perfil diciendo "selección de perfil" o usa detección con IA diciendo "detectar perfil".',
    1: 'Estás en selección de perfil. Di "soy ciega" para perfil ciego, "soy sorda" para perfil sordo, o "soy muda" para perfil mudo.',
    5: 'Estás en el inicio de modo ciego. Di "dictar" para comenzar a dictar, "historial" para ver transcripciones anteriores, o "ajustes" para configuración.',
    6: 'Estás en dictado de voz. Di "micrófono" para activar la grabación, "escuchar" para escuchar lo transcrito, o "copiar" para copiar el texto.',
  };
  
  if (guides[screen]) {
    announce(guides[screen], 'normal');
  }
}

// Inicializar sistema de voz
function initVoiceSystem() {
  if (initVoiceRecognition()) {
    console.log('Sistema de voz inicializado correctamente');
    
    // Verificar si es la primera vez
    const hasVisitedBefore = localStorage.getItem('univoz_visited');
    
    if (!hasVisitedBefore) {
      // Primera visita - ofrecer tutorial
      setTimeout(() => {
        announce('Bienvenido a UNIVOZ. Esta es tu primera vez aquí. ¿Te gustaría escuchar un tutorial rápido? Di "tutorial" para comenzar o "omitir" para continuar.', 'normal');
        localStorage.setItem('univoz_visited', 'true');
        isFirstTime = false;
      }, 2500);
    } else {
      // Visita recurrente
      setTimeout(() => {
        announce('UNIVOZ está lista. Di "activar voz" para usar comandos de voz o toca el botón de micrófono.', 'normal');
      }, 2000);
    }
  }
}

// Integrar con función go() para anunciar cambios de pantalla
function announceNavigation(screenNumber) {
  if (voiceCommandActive) {
    setTimeout(() => {
      announceScreenChange(screenNumber);
    }, 500);
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
window.announceCurrentScreen = announceCurrentScreen;
window.initVoiceSystem = initVoiceSystem;
window.processVoiceCommand = processVoiceCommand;
window.startTutorial = startTutorial;
window.smartGuide = smartGuide;
window.announceNavigation = announceNavigation;
