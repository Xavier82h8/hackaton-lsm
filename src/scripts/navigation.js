window.NAV_CONFIG = {
  TOTAL_SCREENS: 18,
  PROFILE_SCREENS: {
    blind: [4, 5, 6],
    deaf: [7, 8, 9, 10, 11],
    mute: [12, 13, 14],
  },
  PROFILE_HOME: { blind: 5, deaf: 8, mute: 13 },
  PROFILE_CONFIG: { blind: 4, deaf: 7, mute: 12 },
  PROFILE_SETTINGS: { blind: 15, deaf: 16, mute: 17 },
};

/* ============================================================
   NAVEGACIÓN ENTRE PANTALLAS
   ============================================================ */
const NAV = window.NAV_CONFIG || {};
const TOTAL_SCREENS = NAV.TOTAL_SCREENS || 18;
const PROFILE_SCREENS = {
  blind: new Set(NAV.PROFILE_SCREENS.blind || [4, 5, 6]),
  deaf: new Set(NAV.PROFILE_SCREENS.deaf || [7, 8, 9, 10, 11]),
  mute: new Set(NAV.PROFILE_SCREENS.mute || [12, 13, 14]),
};
const PROFILE_HOME = NAV.PROFILE_HOME || { blind: 5, deaf: 8, mute: 13 };
const PROFILE_CONFIG = NAV.PROFILE_CONFIG || { blind: 4, deaf: 7, mute: 12 };
const PROFILE_SETTINGS = NAV.PROFILE_SETTINGS || { blind: 15, deaf: 16, mute: 17 };

const appState = {
  currentScreen: 0,
  activeProfile: null,
};

let cntInt, detectInt;

function profileByScreen(screen) {
  if (PROFILE_SCREENS.blind.has(screen)) return 'blind';
  if (PROFILE_SCREENS.deaf.has(screen)) return 'deaf';
  if (PROFILE_SCREENS.mute.has(screen)) return 'mute';
  return null;
}

function setActiveProfile(profile) {
  if (!profile) return;
  appState.activeProfile = profile;
}

function go(n) {
  // Si vamos a la pantalla de selección de perfil (sc1), limpiar perfil activo
  if (n === 1) {
    appState.activeProfile = null;
  }
  
  // Evitar navegación redundante
  if (n === appState.currentScreen) return;
  
  // Si vamos a una pantalla de configuración de perfil (sc4, sc7, sc12),
  // establecer el perfil correspondiente
  if (n === 4) {
    appState.activeProfile = 'blind';
  } else if (n === 7) {
    appState.activeProfile = 'deaf';
  } else if (n === 12) {
    appState.activeProfile = 'mute';
  }
  
  // Verificar si estamos yendo a una pantalla de otro perfil
  const targetProfile = profileByScreen(n);
  if (targetProfile && appState.activeProfile && appState.activeProfile !== targetProfile) {
    // Si intentamos ir a una pantalla de otro perfil, ir al home del perfil actual
    n = PROFILE_HOME[appState.activeProfile];
  }
  
  // Establecer perfil según la pantalla si no está establecido
  if (targetProfile && !appState.activeProfile) {
    setActiveProfile(targetProfile);
  }
  
  // Ocultar todas las pantallas
  for (let i = 0; i < TOTAL_SCREENS; i++) {
    const sc = document.getElementById('sc' + i);
    if (sc) sc.classList.remove('on');
  }
  
  // Mostrar pantalla actual
  requestAnimationFrame(() => {
    const targetSc = document.getElementById('sc' + n);
    if (targetSc) {
      targetSc.classList.add('on');
    }
  });
  
  appState.currentScreen = n;

  // Guardar sesión
  if (typeof saveSession === 'function') {
    saveSession(n);
  }

  // Anunciar cambio de pantalla si los comandos de voz están activos
  if (typeof announceNavigation === 'function') {
    announceNavigation(n);
  }

  // Inicializaciones específicas por pantalla
  if (n === 1) {
    // Iniciar temporizador en pantalla de selección de perfil
    if (typeof startProfileCountdown === 'function') {
      setTimeout(() => startProfileCountdown(), 500);
    }
  }
  if (n === 2) startDetect();
  if (n === 3) startCountdown();
  if (n === 6 && typeof initBlindWaveform === 'function') initBlindWaveform();
  if (n === 10) {
    if (typeof initLSMGrid === 'function') initLSMGrid();
  }

  // Resetear scroll
  const scrollContent = document.querySelector('.scroll-content');
  if (scrollContent) {
    setTimeout(() => scrollContent.scrollTop = 0, 50);
  }
}

function openSettings() {
  if (appState.activeProfile) {
    go(PROFILE_SETTINGS[appState.activeProfile]);
  } else {
    go(PROFILE_SETTINGS.blind);
  }
}

function settingsBack() {
  if (appState.activeProfile) {
    go(PROFILE_HOME[appState.activeProfile]);
  } else {
    go(0);
  }
}

function goHome() {
  if (appState.activeProfile) {
    go(PROFILE_HOME[appState.activeProfile]);
  } else {
    go(0);
  }
}

function goProfileConfig() {
  if (appState.activeProfile) {
    go(PROFILE_CONFIG[appState.activeProfile]);
  } else {
    go(1);
  }
}

function logout() {
  appState.activeProfile = null;
  go(0);
}

// Exportar funciones al scope global
window.go = go;
window.openSettings = openSettings;
window.settingsBack = settingsBack;
window.goHome = goHome;
window.goProfileConfig = goProfileConfig;
window.logout = logout;
