window.NAV_CONFIG = {
  TOTAL_SCREENS: 20,
  PROFILE_SCREENS: {
    blind: [4, 5, 6],
    deaf: [7, 8, 9, 10, 11],
    mute: [12, 13, 14],
    deafblind: [18, 19],
  },
  PROFILE_HOME: { blind: 5, deaf: 8, mute: 13, deafblind: 19 },
  PROFILE_CONFIG: { blind: 4, deaf: 7, mute: 12, deafblind: 18 },
  PROFILE_SETTINGS: { blind: 15, deaf: 16, mute: 17, deafblind: 15 },
};

/* ============================================================
   NAVEGACION ENTRE PANTALLAS
   ============================================================ */
const NAV = window.NAV_CONFIG || {};
const TOTAL_SCREENS = NAV.TOTAL_SCREENS || 20;
const PROFILE_SCREENS = {
  blind: new Set(NAV.PROFILE_SCREENS?.blind || [4, 5, 6]),
  deaf: new Set(NAV.PROFILE_SCREENS?.deaf || [7, 8, 9, 10, 11]),
  mute: new Set(NAV.PROFILE_SCREENS?.mute || [12, 13, 14]),
  deafblind: new Set(NAV.PROFILE_SCREENS?.deafblind || [18, 19]),
};
const PROFILE_HOME = NAV.PROFILE_HOME || { blind: 5, deaf: 8, mute: 13, deafblind: 19 };
const PROFILE_CONFIG = NAV.PROFILE_CONFIG || { blind: 4, deaf: 7, mute: 12, deafblind: 18 };
const PROFILE_SETTINGS = NAV.PROFILE_SETTINGS || { blind: 15, deaf: 16, mute: 17, deafblind: 15 };
const runtimeState = window.__univozRuntime = window.__univozRuntime || {
  detectInt: null,
  detectedProfile: null,
  cntInt: null,
};

const appState = {
  currentScreen: 0,
  previousScreen: null,
  activeProfile: null,
  skipSessionSave: false,
};

function profileByScreen(screen) {
  if (PROFILE_SCREENS.blind.has(screen)) return 'blind';
  if (PROFILE_SCREENS.deaf.has(screen)) return 'deaf';
  if (PROFILE_SCREENS.mute.has(screen)) return 'mute';
  if (PROFILE_SCREENS.deafblind.has(screen)) return 'deafblind';
  return null;
}

function setActiveProfile(profile) {
  if (!profile) return;
  appState.activeProfile = profile;
}

function go(n) {
  if (!Number.isInteger(n) || n < 0 || n >= TOTAL_SCREENS) return;

  if (n === 1) {
    appState.activeProfile = null;
  }

  if (n === appState.currentScreen) {
    if (n === 2 && typeof startDetect === 'function') {
      startDetect();
    } else if (n === 3 && typeof startCountdown === 'function') {
      startCountdown();
    }
    return;
  }

  if (n === 4) {
    appState.activeProfile = 'blind';
  } else if (n === 7) {
    appState.activeProfile = 'deaf';
  } else if (n === 12) {
    appState.activeProfile = 'mute';
  } else if (n === 18) {
    appState.activeProfile = 'deafblind';
  }

  const targetProfile = profileByScreen(n);
  if (targetProfile && appState.activeProfile && appState.activeProfile !== targetProfile) {
    n = PROFILE_HOME[appState.activeProfile];
  }

  if (targetProfile && !appState.activeProfile) {
    setActiveProfile(targetProfile);
  }

  for (let i = 0; i < TOTAL_SCREENS; i++) {
    const screen = document.getElementById(`sc${i}`);
    if (screen) screen.classList.remove('on');
  }

  requestAnimationFrame(() => {
    const targetScreen = document.getElementById(`sc${n}`);
    if (targetScreen) {
      targetScreen.classList.add('on');
    }
  });

  appState.previousScreen = appState.currentScreen;
  appState.currentScreen = n;

  if (n !== 2 && runtimeState.detectInt) {
    clearInterval(runtimeState.detectInt);
    runtimeState.detectInt = null;
    runtimeState.detectedProfile = null;
  }

  if (n !== 3 && runtimeState.cntInt) {
    clearInterval(runtimeState.cntInt);
    runtimeState.cntInt = null;
  }

  if (!appState.skipSessionSave && typeof saveSession === 'function') {
    saveSession(n);
  }
  appState.skipSessionSave = false;

  if (typeof announceNavigation === 'function') {
    announceNavigation(n);
  }

  if (n === 1 && typeof startProfileCountdown === 'function') {
    setTimeout(() => startProfileCountdown(), 500);
  }
  if (n === 2 && typeof startDetect === 'function') startDetect();
  if (n === 3 && typeof startCountdown === 'function') startCountdown();
  if (n === 6 && typeof initBlindWaveform === 'function') initBlindWaveform();
  if (n === 10 && typeof initLSMGrid === 'function') initLSMGrid();

  const scrollContent = document.querySelector(`#sc${n} .scroll-content`);
  if (scrollContent) {
    setTimeout(() => {
      scrollContent.scrollTop = 0;
    }, 50);
  }
}

function openSettings() {
  if (appState.activeProfile) {
    go(PROFILE_SETTINGS[appState.activeProfile]);
    return;
  }
  go(PROFILE_SETTINGS.blind);
}

function settingsBack() {
  if (appState.activeProfile) {
    go(PROFILE_HOME[appState.activeProfile]);
    return;
  }
  go(0);
}

function goHome() {
  if (appState.activeProfile) {
    go(PROFILE_HOME[appState.activeProfile]);
    return;
  }
  go(0);
}

function goProfileConfig() {
  if (appState.activeProfile) {
    go(PROFILE_CONFIG[appState.activeProfile]);
    return;
  }
  go(1);
}

function goBack() {
  if (Number.isInteger(appState.previousScreen) && appState.previousScreen >= 0) {
    const previous = appState.previousScreen;
    appState.previousScreen = null;
    go(previous);
    return;
  }

  if (appState.activeProfile) {
    go(PROFILE_HOME[appState.activeProfile]);
    return;
  }

  go(0);
}

function logout() {
  appState.skipSessionSave = true;
  appState.activeProfile = null;
  appState.previousScreen = null;
  if (typeof clearSession === 'function') {
    clearSession();
  }
  go(0);
}

window.appState = appState;
window.go = go;
window.goBack = goBack;
window.openSettings = openSettings;
window.settingsBack = settingsBack;
window.goHome = goHome;
window.goProfileConfig = goProfileConfig;
window.logout = logout;
