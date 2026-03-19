/* ============================================================
   COMANDOS DE VOZ PARA USUARIOS CIEGOS
   Versión 3.2 - UNIVOZ - Asistente Conversacional con Prioridad para Ciegos
   ============================================================ */

let voiceCommandActive = false;
let recognition = null;
let isListening = false;
let isFirstTime = true;
let currentScreenName = '';
let assistantSkipped = false;  // Si el usuario omitió el asistente
let assistantEnabled = true;   // Si el asistente está habilitado

// Estado del asistente conversacional
let assistantState = {
  isActive: false,
  currentFlow: null,
  currentStep: 0,
  awaitingResponse: false,
  context: {},
  lastAction: null,
  errorCount: 0
};

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

const ASSISTANT_RESPONSES = {
  confirm: ['Entendido', 'Perfecto', 'Listo', 'Hecho', 'Completado'],
  navigating: ['Navegando a', 'Yendo a', 'Cambiando a', 'Moviendo a'],
  error: ['No entendí bien', 'Disculpa, no escuché claramente', '¿Podrías repetirlo?', 'No estoy segura de haber entendido'],
  encouragement: ['¡Excelente!', '¡Muy bien!', '¡Perfecto!', '¡Genial!'],
};

// Flujos conversacionales PRIORIZANDO ACCIONES PARA CIEGOS
const CONVERSATIONAL_FLOWS = {
  0: {
    greeting: 'Bienvenido a UNIVOZ. Soy tu asistente de voz. ¿Cómo puedo ayudarte hoy?',
    priority: ['dictar', 'nota rápida', 'tomar nota'],
    options: [
      { keywords: ['dictar', 'nota rápida', 'tomar nota', 'grabar voz'], action: 'goToDictationImmediate', response: 'Abriendo dictado inmediatamente.' },
      { keywords: ['perfil', 'seleccionar', 'elegir'], action: 'goToProfile', response: 'Te llevaré a seleccionar tu perfil de accesibilidad.' },
      { keywords: ['detectar', 'ia', 'automático'], action: 'detectProfile', response: 'Activaré la detección automática con inteligencia artificial.' },
      { keywords: ['ayuda', 'qué puedo', 'cómo'], action: 'showHelp', response: 'Te explicaré las opciones disponibles.' },
      { keywords: ['continuar', 'reanudar', 'sesión anterior'], action: 'resumeSession', response: 'Reanudaremos tu sesión anterior.' },
    ],
    noResponse: 'No he escuchado tu respuesta. Para usuarios ciegos: di "dictar" para tomar nota inmediatamente. También puedes decir: seleccionar perfil, detectar con IA, o pedir ayuda. ¿Qué deseas hacer?',
  },
  1: {
    greeting: 'Estás en selección de perfil. ¿Qué perfil describes mejor para ti?',
    priority: ['dictar', 'nota rápida'],
    options: [
      { keywords: ['ciega', 'ciego', 'no veo', 'visión'], action: 'selectBlind', response: 'Perfil ciego seleccionado. Te guiaré con voz en cada paso.' },
      { keywords: ['sorda', 'sordo', 'no escucho', 'audición'], action: 'selectDeaf', response: 'Perfil sordo seleccionado. Activaré subtítulos y lenguaje de señas.' },
      { keywords: ['muda', 'mudo', 'no hablo', 'voz'], action: 'selectMute', response: 'Perfil mudo seleccionado. Podrás escribir y la app hablará por ti.' },
      { keywords: ['sordomuda', 'sordomudo', 'señas', 'lsm'], action: 'selectDeafBlind', response: 'Perfil sordomudo seleccionado. Activaré LSM y texto.' },
      { keywords: ['dictar', 'nota rápida', 'urgente'], action: 'goToDictationImmediate', response: 'Abriendo dictado inmediatamente. Después podrás seleccionar tu perfil.' },
      { keywords: ['atrás', 'regresar', 'volver'], action: 'goBack', response: 'Regresando a la pantalla anterior.' },
    ],
    noResponse: 'No he escuchado tu respuesta. Puedes decir: soy ciega, soy sorda, soy muda, o soy sordomuda. Si necesitas dictar urgentemente, di "dictar". ¿Cuál describes para ti?',
  },
  5: {
    greeting: 'Estás en el inicio de modo ciego. ¿Qué acción deseas realizar?',
    priority: ['dictar', 'nota rápida', 'tomar nota', 'urgente'],
    options: [
      { keywords: ['dictar', 'nota rápida', 'tomar nota', 'hablar', 'voz', 'grabar', 'urgente'], action: 'goToDictationImmediate', response: 'Abriendo dictado inmediatamente.' },
      { keywords: ['historial', 'anteriores', 'transcripciones'], action: 'goToHistory', response: 'Mostraré tu historial de transcripciones.' },
      { keywords: ['ajustes', 'configuración', 'opciones'], action: 'goToSettings', response: 'Abriré la configuración de modo ciego.' },
      { keywords: ['ayuda', 'qué puedo', 'cómo'], action: 'showHelp', response: 'Te explicaré las opciones disponibles en modo ciego.' },
      { keywords: ['leer', 'escuchar', 'texto'], action: 'readScreen', response: 'Leeré el contenido de esta pantalla.' },
      { keywords: ['atrás', 'regresar', 'volver'], action: 'goBack', response: 'Regresando a la pantalla anterior.' },
    ],
    followUp: {
      'goToDictation': {
        question: '¿Deseas activar el micrófono ahora?',
        yes: () => { go(6); setTimeout(() => toggleBlindMic(), 500); announce('Micrófono activado. Puedes comenzar a dictar.', 'high'); },
        no: () => { go(6); announce('Entendido. El micrófono está listo cuando lo necesites.', 'high'); }
      }
    },
    noResponse: 'No he escuchado tu respuesta. Para usuarios ciegos: di "dictar" para tomar nota inmediatamente. También puedes decir: historial, ajustes, ayuda, o leer pantalla. ¿Qué deseas hacer?',
  },
  6: {
    greeting: 'Estás en dictado de voz. El micrófono está listo. ¿Qué deseas hacer?',
    priority: ['micrófono', 'escuchar', 'copiar'],
    options: [
      { keywords: ['micrófono', 'grabar', 'activar', 'iniciar', 'comenzar'], action: 'toggleMic', response: 'Activando micrófono. Comienza a dictar cuando escuches el tono.' },
      { keywords: ['escuchar', 'leer', 'reproducir', 'texto'], action: 'readText', response: 'Leeré el texto transcrito en voz alta.' },
      { keywords: ['copiar', 'portapapeles', 'copiar texto'], action: 'copyText', response: 'Texto copiado al portapapeles. Ya puedes pegarlo en otra aplicación.' },
      { keywords: ['borrar', 'limpiar', 'eliminar'], action: 'clearText', response: 'Texto borrado. El área de dictado está limpia.' },
      { keywords: ['ayuda', 'qué puedo', 'cómo'], action: 'showHelp', response: 'En dictado puedes: activar micrófono, escuchar texto, copiar, o borrar.' },
      { keywords: ['atrás', 'regresar', 'volver', 'inicio'], action: 'goBack', response: 'Saliendo de dictado.' },
      { keywords: ['emergencia', 'ayuda emergencia', 'necesito ayuda'], action: 'emergency', response: 'Activando ayuda de emergencia.' },
    ],
    noResponse: 'No he escuchado tu respuesta. Las opciones son: micrófono, escuchar texto, copiar, borrar, ayuda, o regresar. ¿Qué deseas hacer?',
  },
};

const VOICE_COMMANDS = {
  // Navegación principal
  'inicio': () => { goHome(); assistantAnnounce('Regresando al inicio. ' + getScreenGreeting(0)); },
  'ir a inicio': () => VOICE_COMMANDS['inicio'](),
  'pantalla principal': () => VOICE_COMMANDS['inicio'](),
  'home': () => VOICE_COMMANDS['inicio'](),

  // PRIORIDAD CIEGOS: Dictado inmediato
  'dictar': () => {
    go(6);
    assistantAnnounce('Abriendo dictado inmediatamente.');
    setTimeout(() => { toggleBlindMic(); announce('Micrófono activado. Comienza a dictar.', 'high'); }, 500);
  },
  'ir a dictar': () => VOICE_COMMANDS['dictar'](),
  'modo dictado': () => VOICE_COMMANDS['dictar'](),
  'tomar nota': () => VOICE_COMMANDS['dictar'](),
  'nota rápida': () => VOICE_COMMANDS['dictar'](),

  'historial': () => {
    const profile = appState.activeProfile;
    if (profile === 'blind') { go(5); assistantAnnounce('Mostrando historial de transcripciones.'); }
    else { assistantAnnounce('El historial está disponible en modo ciego. ¿Deseas cambiar a modo ciego?'); assistantState.awaitingResponse = true; assistantState.currentFlow = 'confirmProfileChange'; }
  },
  'ir al historial': () => VOICE_COMMANDS['historial'](),
  'ver historial': () => VOICE_COMMANDS['historial'](),

  'ajustes': () => { openSettings(); assistantAnnounce('Abriendo configuración.'); },
  'ir a ajustes': () => VOICE_COMMANDS['ajustes'](),
  'configuración': () => VOICE_COMMANDS['ajustes'](),
  'opciones': () => VOICE_COMMANDS['ajustes'](),

  'atrás': () => { goBack(); assistantAnnounce('Regresando a la pantalla anterior.'); },
  'regresar': () => VOICE_COMMANDS['atrás'](),
  'volver': () => VOICE_COMMANDS['atrás'](),

  // Acciones de dictado
  'escuchar': () => { speakBlindText(); assistantAnnounce('Leyendo texto en voz alta.'); },
  'leer texto': () => VOICE_COMMANDS['escuchar'](),
  'reproducir': () => VOICE_COMMANDS['escuchar'](),
  'leer': () => VOICE_COMMANDS['escuchar'](),

  'copiar': () => { copyBlindText(); assistantAnnounce('Texto copiado al portapapeles.'); },
  'copiar texto': () => VOICE_COMMANDS['copiar'](),

  'micrófono': () => {
    toggleBlindMic();
    const status = isBlindMicActive() ? 'Micrófono activado. Comienza a dictar.' : 'Micrófono desactivado.';
    assistantAnnounce(status);
  },
  'activar micrófono': () => VOICE_COMMANDS['micrófono'](),
  'grabar': () => VOICE_COMMANDS['micrófono'](),
  'iniciar dictado': () => {
    if (appState.currentScreen !== 6) {
      go(6);
      setTimeout(() => { toggleBlindMic(); assistantAnnounce('Micrófono activado. Comienza a dictar.'); }, 500);
    } else {
      toggleBlindMic();
      assistantAnnounce('Micrófono activado. Comienza a dictar.');
    }
  },

  // Frases rápidas
  'necesito ayuda': () => { speakBlindPhrase('Necesito ayuda'); assistantAnnounce('Frase de ayuda reproducida.'); },
  'ayuda': () => showVoiceHelp(),
  'emergencia': () => { speakBlindPhrase('Necesito ayuda de emergencia'); assistantAnnounce('Frase de emergencia reproducida. ¿Necesitas algo más?'); },
  'ayuda emergencia': () => VOICE_COMMANDS['emergencia'](),
  'llamar ayuda': () => VOICE_COMMANDS['emergencia'](),

  // Control de voz
  'activar voz': () => enableAssistant(),
  'desactivar voz': () => disableAssistant(),
  'comandos de voz': () => toggleAssistant(),
  'activar asistente': () => enableAssistantAgain(),
  'reactivar asistente': () => enableAssistantAgain(),
  'omitir': () => skipAssistant(),
  'omitir asistente': () => skipAssistant(),
  'saltar asistente': () => skipAssistant(),
  'ayuda de comandos': () => showVoiceHelp(),
  'qué puedo decir': () => showVoiceHelp(),
  'lista de comandos': () => showVoiceHelp(),

  // Comandos rápidos para ir directo
  'ir a ciega': () => { selectProfile('blind'); assistantAnnounce('Perfil ciego seleccionado.'); },
  'ir a sordo': () => { selectProfile('deaf'); assistantAnnounce('Perfil sordo seleccionado.'); },
  'ir a mudo': () => { selectProfile('mute'); assistantAnnounce('Perfil mudo seleccionado.'); },
  'modo ciego': () => { selectProfile('blind'); assistantAnnounce('Perfil ciego seleccionado.'); },
  'modo sordo': () => { selectProfile('deaf'); assistantAnnounce('Perfil sordo seleccionado.'); },
  'modo mudo': () => { selectProfile('mute'); assistantAnnounce('Perfil mudo seleccionado.'); },

  // Información
  'qué pantalla es esta': () => announceCurrentScreen(),
  'pantalla actual': () => announceCurrentScreen(),
  'dónde estoy': () => announceCurrentScreen(),
  'información': () => announceCurrentScreen(),

  // Tutorial
  'tutorial': () => startInteractiveTutorial(),
  'iniciar tutorial': () => startInteractiveTutorial(),
  'cómo se usa': () => startInteractiveTutorial(),
  'ayuda inicial': () => startInteractiveTutorial(),

  // Respuestas sí/no
  'sí': () => handleYesNoResponse(true),
  'si': () => handleYesNoResponse(true),
  'yes': () => handleYesNoResponse(true),
  'no': () => handleYesNoResponse(false),
  'correcto': () => handleYesNoResponse(true),
  'incorrecto': () => handleYesNoResponse(false),
  'confirmo': () => handleYesNoResponse(true),
  'cancelo': () => handleYesNoResponse(false),
};

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
    if (typeof updateAssistantUI === 'function') updateAssistantUI();
  };

  recognition.onend = () => {
    isListening = false;
    if (typeof updateAssistantUI === 'function') updateAssistantUI();
    if (voiceCommandActive && !assistantState.awaitingResponse) {
      setTimeout(() => startListening(), 500);
    }
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
      if (!assistantState.awaitingResponse) {
        announce('No escuché nada. ¿Podrías repetirlo?', 'normal');
      }
      assistantState.errorCount++;
      if (assistantState.errorCount >= 3) {
        announce('Parece que hay dificultades. Di "ayuda" para ver las opciones disponibles.', 'normal');
        assistantState.errorCount = 0;
      }
    } else if (event.error === 'audio-capture') {
      announce('No se detectó micrófono. Verifique su configuración.', 'high');
    }
  };

  return true;
}

function processVoiceCommand(command) {
  console.log('Procesando comando:', command);

  if (assistantState.awaitingResponse) {
    const yesCommands = ['sí', 'si', 'yes', 'correcto', 'confirmo', 'acepto', 'ok', 'bueno', 'dale', 'va'];
    const noCommands = ['no', 'incorrecto', 'cancelo', 'rechazo', 'nunca', 'jamás', 'jamas'];
    
    const isYes = yesCommands.some(cmd => command.includes(cmd));
    const isNo = noCommands.some(cmd => command.includes(cmd));
    
    if (isYes) { handleYesNoResponse(true); return; }
    else if (isNo) { handleYesNoResponse(false); return; }
    
    announce('No entendí tu respuesta. ¿Podrías decir sí o no?', 'normal');
    return;
  }

  if (VOICE_COMMANDS[command]) {
    VOICE_COMMANDS[command]();
    assistantState.errorCount = 0;
    return;
  }

  for (const [key, action] of Object.entries(VOICE_COMMANDS)) {
    if (command.includes(key)) {
      action();
      assistantState.errorCount = 0;
      return;
    }
  }

  const screenFlow = CONVERSATIONAL_FLOWS[appState.currentScreen];
  if (screenFlow) {
    for (const option of screenFlow.options) {
      for (const keyword of option.keywords) {
        if (command.includes(keyword)) {
          executeFlowAction(option);
          assistantState.errorCount = 0;
          return;
        }
      }
    }
  }

  const randomError = ASSISTANT_RESPONSES.error[Math.floor(Math.random() * ASSISTANT_RESPONSES.error.length)];
  announce(`${randomError}. Di "ayuda" para ver las opciones disponibles.`, 'normal');
  assistantState.errorCount++;
}

function executeFlowAction(option) {
  switch (option.action) {
    case 'goToProfile': go(1); assistantAnnounce(option.response); break;
    case 'detectProfile': startProfileDetection(); assistantAnnounce(option.response); break;
    case 'showHelp': showVoiceHelp(); break;
    case 'goToDictation':
      assistantState.awaitingResponse = true;
      assistantState.currentFlow = 'followUp';
      assistantState.context.followUpType = 'goToDictation';
      assistantAnnounce(option.response);
      setTimeout(() => {
        const followUp = CONVERSATIONAL_FLOWS[appState.currentScreen]?.followUp?.['goToDictation'];
        if (followUp) announce(followUp.question, 'high');
      }, 1000);
      break;
    case 'goToDictationImmediate':
      go(6);
      assistantAnnounce(option.response + ' Activando micrófono.');
      setTimeout(() => { toggleBlindMic(); announce('Micrófono activado. Comienza a dictar.', 'high'); }, 500);
      break;
    case 'goToHistory': go(5); assistantAnnounce(option.response); break;
    case 'goToSettings': openSettings(); assistantAnnounce(option.response); break;
    case 'readScreen': announceCurrentScreen(); break;
    case 'goBack': goBack(); assistantAnnounce(option.response); break;
    case 'toggleMic': toggleBlindMic(); assistantAnnounce(option.response); break;
    case 'readText': speakBlindText(); assistantAnnounce(option.response); break;
    case 'copyText': copyBlindText(); assistantAnnounce(option.response); break;
    case 'clearText': clearBlindText(); assistantAnnounce(option.response); break;
    case 'emergency': speakBlindPhrase('Necesito ayuda de emergencia'); assistantAnnounce(option.response); break;
    case 'selectBlind': selectProfile('blind'); assistantAnnounce(option.response); break;
    case 'selectDeaf': selectProfile('deaf'); assistantAnnounce(option.response); break;
    case 'selectMute': selectProfile('mute'); assistantAnnounce(option.response); break;
    case 'selectDeafBlind': selectProfile('deafblind'); assistantAnnounce(option.response); break;
    default: assistantAnnounce(option.response);
  }
}

function handleYesNoResponse(isYes) {
  assistantState.awaitingResponse = false;
  
  if (assistantState.currentFlow === 'followUp') {
    const followUpType = assistantState.context.followUpType;
    const followUp = CONVERSATIONAL_FLOWS[appState.currentScreen]?.followUp?.[followUpType];
    if (followUp) {
      if (isYes) {
        const randomConfirm = ASSISTANT_RESPONSES.confirm[Math.floor(Math.random() * ASSISTANT_RESPONSES.confirm.length)];
        announce(`${randomConfirm}.`, 'normal');
        followUp.yes();
      } else {
        announce('Entendido.', 'normal');
        followUp.no();
      }
    }
    assistantState.currentFlow = null;
    assistantState.context = {};
  } else if (assistantState.currentFlow === 'confirmProfileChange') {
    if (isYes) { selectProfile('blind'); announce('Cambiando a modo ciego.', 'high'); }
    else { announce('Entendido. Permanecemos en el perfil actual.', 'normal'); }
    assistantState.currentFlow = null;
  } else if (assistantState.currentFlow === 'tutorialComplete') {
    if (isYes) { announce('¡Excelente! Comencemos a usar UNIVOZ.', 'high'); }
    else { announce('Está bien. Cuando estés listo, di "activar voz" para comenzar.', 'normal'); disableAssistant(); return; }
    assistantState.currentFlow = null;
  }
}

function enableAssistant() {
  if (!recognition && !initVoiceRecognition()) {
    announce('El reconocimiento de voz no está disponible en este dispositivo.', 'high');
    return;
  }

  if (assistantSkipped) {
    assistantSkipped = false;
    assistantEnabled = true;
    localStorage.removeItem('univoz_assistant_skipped');
  }

  voiceCommandActive = true;
  assistantState.isActive = true;
  updateAssistantUI();

  const greeting = getScreenGreeting(appState.currentScreen);
  announce('Asistente de voz activado. ' + greeting, 'high');
  startListening();
}

function disableAssistant() {
  voiceCommandActive = false;
  assistantState.isActive = false;
  assistantState.awaitingResponse = false;
  if (recognition && isListening) recognition.stop();
  updateAssistantUI();
  announce('Asistente desactivado. Para reactivar, di "activar voz" o toca el indicador.', 'normal');
}

function toggleAssistant() {
  if (voiceCommandActive) disableAssistant();
  else enableAssistant();
}

function getScreenGreeting(screenNumber) {
  const flow = CONVERSATIONAL_FLOWS[screenNumber];
  if (flow) {
    if (screenNumber === 0 || screenNumber === 5) {
      return flow.greeting + ' Para dictar urgentemente, di "dictar".';
    }
    return flow.greeting;
  }
  
  const defaultGreetings = {
    0: 'Bienvenido a UNIVOZ. Soy tu asistente de voz. ¿Cómo puedo ayudarte hoy? Para dictar, di "dictar".',
    1: 'Estás en selección de perfil. ¿Qué perfil describes mejor para ti? Si necesitas dictar, di "dictar".',
    2: 'La IA está analizando tu interacción. Espera un momento.',
    3: 'Confirma el perfil seleccionado. ¿Es correcto?',
    4: 'Configuración de perfil ciego. Revisa las preferencias.',
    5: 'Estás en el inicio de modo ciego. ¿Qué acción deseas realizar? Para dictar, di "dictar".',
    6: 'Estás en dictado de voz. ¿Qué deseas hacer?',
    7: 'Configuración de perfil sordo.',
    8: 'Modo sordo activo. ¿Qué necesitas?',
    9: 'Subtítulos en vivo. Habla y verás el texto en pantalla.',
    10: 'Señas LSM. Muestra tus manos frente a la cámara.',
    11: 'Transcripción de audio.',
    12: 'Configuración de perfil mudo.',
    13: 'Modo mudo activo. Escribe y la app hablará por ti.',
    14: 'Texto a voz. Escribe para escuchar.',
    15: 'Ajustes de modo ciego.',
    16: 'Ajustes de modo sordo.',
    17: 'Ajustes de modo mudo.',
  };
  
  return defaultGreetings[screenNumber] || 'Bienvenido a UNIVOZ.';
}

function assistantAnnounce(text) {
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  announce(text, 'high');
}

function startListening() {
  if (!voiceCommandActive || !recognition || isListening) return;
  try { recognition.start(); } catch (e) { console.error('Error al iniciar reconocimiento:', e); }
}

function stopListening() {
  if (recognition && isListening) {
    try { recognition.stop(); } catch (e) { console.error('Error al detener reconocimiento:', e); }
  }
}

function showVoiceHelp() {
  const screen = appState.currentScreen;
  const flow = CONVERSATIONAL_FLOWS[screen];

  let helpText = 'Ayuda de UNIVOZ. Para dictar urgentemente, di: "dictar", "tomar nota", o "nota rápida". ';

  if (flow) {
    helpText += 'En esta pantalla también puedes decir: ';
    const priorityActions = flow.priority || [];
    const otherActions = flow.options
      .filter(opt => !priorityActions.some(p => opt.keywords.includes(p)))
      .map(opt => opt.keywords[0]);
    helpText += [...priorityActions, ...otherActions].join(', ') + '. ';
  }

  helpText += 'Comandos globales: inicio, ajustes, atrás, emergencia. ¿Qué deseas hacer?';

  announce(helpText, 'high');
  console.log('Ayuda:', helpText);

  setTimeout(() => { if (voiceCommandActive) startListening(); }, 1000);
}

function announce(text, priority = 'normal') {
  if (!('speechSynthesis' in window)) return;
  if (priority === 'high') speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;
  speechSynthesis.speak(utterance);
}

function announceScreenChange(screenNumber) {
  const screenName = SCREEN_NAMES[screenNumber] || 'Pantalla';
  currentScreenName = screenName;
  const actions = getAvailableActions(screenNumber);
  announce(`${screenName}. ${actions}`, 'high');
}

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

function announceCurrentScreen() {
  const screenNum = appState.currentScreen;
  const screenName = SCREEN_NAMES[screenNum] || 'Pantalla desconocida';
  const actions = getAvailableActions(screenNum);
  announce(`${screenName}. ${actions}`, 'high');
}

function startInteractiveTutorial() {
  disableAssistant();

  const tutorialSteps = [
    { text: '¡Bienvenido al tutorial de UNIVOZ! Soy tu asistente de voz y te guiaré paso a paso.', pause: 5000 },
    { text: 'UNIVOZ está diseñado para que lo uses con tu voz. Yo soy tu asistente y estaré aquí para ayudarte.', pause: 5000 },
    { text: 'Paso 1: Navegación. Puedes decir "inicio" para ir al inicio, "dictar" para dictar texto, o "ajustes" para configurar.', pause: 6000 },
    { text: 'Paso 2: Para regresar a la pantalla anterior, di "atrás", "regresar" o "volver".', pause: 4000 },
    { text: 'Paso 3: En dictado, puedes decir "micrófono" para activar la grabación, "escuchar" para oír el texto, o "copiar" para copiar.', pause: 6000 },
    { text: 'Paso 4: En cualquier momento puedes decir "ayuda" para escuchar las opciones disponibles.', pause: 4000 },
    { text: 'Paso 5: Para emergencias, di "emergencia" o "necesito ayuda" y la app reproducirá un mensaje de auxilio.', pause: 5000 },
    { text: 'Paso 6: Yo te guiaré en cada pantalla. Cuando llegues a una nueva pantalla, te explicaré qué puedes hacer.', pause: 5000 },
    { text: '¡Tutorial completado! Activaré el asistente de voz. ¿Deseas comenzar a usar UNIVOZ?', pause: 0 },
  ];

  let step = 0;

  function playNextStep() {
    if (step >= tutorialSteps.length) {
      enableAssistant();
      return;
    }

    const currentStep = tutorialSteps[step];
    announce(currentStep.text, 'high');
    step++;

    if (currentStep.pause > 0) {
      setTimeout(playNextStep, currentStep.pause);
    } else {
      assistantState.awaitingResponse = true;
      assistantState.currentFlow = 'tutorialComplete';
    }
  }

  playNextStep();
}

function smartGuide() {
  const screen = appState.currentScreen;
  const flow = CONVERSATIONAL_FLOWS[screen];
  if (flow) {
    announce(flow.greeting, 'normal');
    return;
  }

  const guides = {
    0: 'Bienvenido a UNIVOZ. Para comenzar, selecciona tu perfil diciendo "selección de perfil" o usa detección con IA diciendo "detectar perfil".',
    1: 'Estás en selección de perfil. Di "soy ciega" para perfil ciego, "soy sorda" para perfil sordo, o "soy muda" para perfil mudo.',
    5: 'Estás en el inicio de modo ciego. Di "dictar" para comenzar a dictar, "historial" para ver transcripciones anteriores, o "ajustes" para configuración.',
    6: 'Estás en dictado de voz. Di "micrófono" para activar la grabación, "escuchar" para escuchar lo transcrito, o "copiar" para copiar el texto.',
  };

  if (guides[screen]) announce(guides[screen], 'normal');
}

function initVoiceSystem() {
  if (initVoiceRecognition()) {
    console.log('Sistema de voz inicializado correctamente');
    updateAssistantUI();

    const hasVisitedBefore = localStorage.getItem('univoz_visited');
    const hasSkippedAssistant = localStorage.getItem('univoz_assistant_skipped');

    if (!hasVisitedBefore) {
      setTimeout(() => {
        if (!assistantSkipped) {
          announce('Bienvenido a UNIVOZ. Esta es tu primera vez aquí. Soy tu asistente de voz. ¿Te gustaría escuchar un tutorial rápido? Di "tutorial" para comenzar o "omitir" para continuar.', 'normal');
        }
        localStorage.setItem('univoz_visited', 'true');
        isFirstTime = false;
      }, 2500);
    } else {
      setTimeout(() => {
        if (!assistantSkipped && assistantEnabled) {
          announce('UNIVOZ está lista. Soy tu asistente de voz. Di "activar voz" para comenzar o toca el botón de micrófono.', 'normal');
        }
      }, 2000);
    }
  }
}

function updateAssistantUI() {
  const skipBtn = document.getElementById('skipAssistantBtn');
  const indicator = document.getElementById('assistantIndicator');
  
  if (skipBtn) skipBtn.style.display = assistantEnabled ? 'block' : 'none';
  if (indicator) {
    indicator.style.display = voiceCommandActive ? 'flex' : 'none';
    if (voiceCommandActive) {
      indicator.classList.add('active');
      if (isListening) indicator.classList.add('listening');
      else indicator.classList.remove('listening');
    } else {
      indicator.classList.remove('active', 'listening');
    }
  }
}

function skipAssistant() {
  assistantSkipped = true;
  assistantEnabled = false;
  voiceCommandActive = false;
  assistantState.isActive = false;
  
  if (recognition && isListening) recognition.stop();
  localStorage.setItem('univoz_assistant_skipped', 'true');
  updateAssistantUI();
  
  console.log('Asistente omitido - Modo lectura activado');
  announce('Asistente omitido. Modo lectura activado. Puedes reactivarlo en cualquier momento diciendo "activar asistente".', 'normal');
}

function enableAssistantAgain() {
  assistantSkipped = false;
  assistantEnabled = true;
  localStorage.removeItem('univoz_assistant_skipped');
  updateAssistantUI();
  announce('Asistente reactivado. ¿Qué deseas hacer?', 'high');
  enableAssistant();
}

function toggleAssistantFromIndicator() {
  if (voiceCommandActive) disableAssistant();
  else enableAssistant();
  updateAssistantUI();
}

function announceNavigation(screenNumber) {
  if (assistantSkipped) return;
  
  if (voiceCommandActive) {
    setTimeout(() => {
      const screenName = SCREEN_NAMES[screenNumber] || 'Pantalla';
      const flow = CONVERSATIONAL_FLOWS[screenNumber];
      const greeting = flow ? flow.greeting : '';
      
      if (greeting) {
        announce(`Llegando a ${screenName}. ${greeting}`, 'high');
      } else {
        announceScreenChange(screenNumber);
      }
    }, 500);
  }
}

// Funciones helper
function selectProfile(profile) {
  if (typeof window.selectProfile === 'function') window.selectProfile(profile);
  else console.log('selectProfile no está definida, usando perfil:', profile);
}

function startProfileDetection() {
  if (typeof window.startProfileDetection === 'function') window.startProfileDetection();
}

function openSettings() {
  const profile = appState.activeProfile;
  if (profile === 'blind') go(15);
  else if (profile === 'deaf') go(16);
  else if (profile === 'mute') go(17);
  else go(15);
}

function isBlindMicActive() {
  return appState.blind?.micActive || false;
}

function toggleBlindMic() {
  if (typeof window.toggleBlindMic === 'function') window.toggleBlindMic();
}

function speakBlindText() {
  if (typeof window.speakBlindText === 'function') window.speakBlindText();
}

function copyBlindText() {
  if (typeof window.copyBlindText === 'function') window.copyBlindText();
}

function clearBlindText() {
  const blindText = document.getElementById('blindOutput');
  if (blindText) {
    blindText.textContent = '';
    if (appState.blind) appState.blind.text = '';
  }
}

function speakBlindPhrase(phrase) {
  if (typeof window.speakBlindPhrase === 'function') window.speakBlindPhrase(phrase);
}

function goHome() { go(0); }

function goBack() {
  const screenHistory = appState.screenHistory || [];
  if (screenHistory.length > 1) {
    screenHistory.pop();
    const previous = screenHistory[screenHistory.length - 1];
    go(previous);
  } else {
    go(0);
  }
}

// Exportar funciones globales
window.enableVoiceCommands = enableAssistant;
window.disableVoiceCommands = disableAssistant;
window.toggleVoiceCommands = toggleAssistant;
window.enableAssistant = enableAssistant;
window.disableAssistant = disableAssistant;
window.toggleAssistant = toggleAssistant;
window.enableAssistantAgain = enableAssistantAgain;
window.skipAssistant = skipAssistant;
window.toggleAssistantFromIndicator = toggleAssistantFromIndicator;
window.startListening = startListening;
window.stopListening = stopListening;
window.showVoiceHelp = showVoiceHelp;
window.announce = announce;
window.announceScreenChange = announceScreenChange;
window.announceCurrentScreen = announceCurrentScreen;
window.initVoiceSystem = initVoiceSystem;
window.processVoiceCommand = processVoiceCommand;
window.startTutorial = startInteractiveTutorial;
window.startInteractiveTutorial = startInteractiveTutorial;
window.smartGuide = smartGuide;
window.announceNavigation = announceNavigation;
window.handleYesNoResponse = handleYesNoResponse;
window.updateAssistantUI = updateAssistantUI;
