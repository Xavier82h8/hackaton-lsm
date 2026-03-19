/* ============================================================
   UNIVOZ — app.js
   Versión PWA - Producción v6 + Integración univoz-master
   ============================================================ */

/* ============================================================
   0. EXPORTAR FUNCIONES GLOBALES INMEDIATAS
   ============================================================ */
// Asegurar que las funciones estén disponibles antes de que el DOM cargue
window.selectProfile = function(profile) {
  if (typeof stopProfileCountdown === 'function') {
    stopProfileCountdown();
  }
  
  const profileMap = {
    'blind': { screen: 4 },
    'deaf': { screen: 7 },
    'mute': { screen: 12 },
    'deafblind': { screen: 4 }
  };
  
  const config = profileMap[profile];
  if (config) {
    if (typeof selP === 'function') {
      selP(profile === 'deafblind' ? 'db' : profile[0]);
    }
    
    if (typeof appState !== 'undefined') {
      appState.activeProfile = profile;
    }
    
    if (typeof go === 'function') {
      go(config.screen);
    }
    
    if (typeof saveSession === 'function') {
      saveSession(config.screen);
    }
  }
};

/* ============================================================
   1. GESTIÓN DE SESIÓN Y TEMPORIZADOR
   ============================================================ */
let profileCountdownInterval;
let PROFILE_COUNTDOWN = 5;

// Guardar sesión actual
function saveSession(screenNumber) {
  if (!screenNumber) screenNumber = appState ? appState.currentScreen : 0;
  const profile = appState ? appState.activeProfile : null;
  
  localStorage.setItem('univoz_lastScreen', screenNumber);
  localStorage.setItem('univoz_lastProfile', profile || 'unknown');
  localStorage.setItem('univoz_lastVisit', new Date().toISOString());
}

// Reanudar sesión
function resumeSession() {
  const lastScreen = localStorage.getItem('univoz_lastScreen');
  const lastProfile = localStorage.getItem('univoz_lastProfile');
  
  if (lastScreen && lastProfile) {
    if (typeof appState !== 'undefined') {
      appState.activeProfile = lastProfile;
    }
    const screen = parseInt(lastScreen);
    go(screen);
    
    if (typeof announce === 'function') {
      announce('Sesión reanudada. Perfil: ' + lastProfile);
    }
  }
}

// Verificar si hay sesión guardada
function checkForSavedSession() {
  const lastScreen = localStorage.getItem('univoz_lastScreen');
  const resumeBtn = document.getElementById('resumeBtn');
  const resumeLabel = document.getElementById('resumeLabel');
  
  if (lastScreen && resumeBtn && resumeLabel) {
    const lastVisit = localStorage.getItem('univoz_lastVisit');
    if (lastVisit) {
      const date = new Date(lastVisit);
      const now = new Date();
      const hoursAgo = Math.floor((now - date) / (1000 * 60 * 60));
      
      const screenNames = {
        0: 'Inicio', 1: 'Perfil', 2: 'IA', 3: 'Confirmación',
        4: 'Config Ciego', 5: 'Inicio Ciego', 6: 'Dictado',
        7: 'Config Sordo', 8: 'Inicio Sordo', 9: 'Subtítulos',
        10: 'LSM', 11: 'Transcripción', 12: 'Config Mudo',
        13: 'Inicio Mudo', 14: 'Texto a Voz'
      };
      
      const screenName = screenNames[lastScreen] || 'Pantalla ' + lastScreen;
      resumeLabel.textContent = `Hace ${hoursAgo}h · ${screenName}`;
      resumeBtn.style.display = 'flex';
    }
  }
}

// Iniciar temporizador de perfil
function startProfileCountdown() {
  const ring = document.getElementById('profileCountdownRing');
  const label = document.getElementById('profileCountdown');
  
  if (!ring || !label) return;
  
  clearInterval(profileCountdownInterval);
  
  let countdown = PROFILE_COUNTDOWN;
  const circumference = 106.8;
  
  function updateUI() {
    label.textContent = countdown;
    const offset = circumference - (countdown / PROFILE_COUNTDOWN) * circumference;
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

// Detener temporizador
function stopProfileCountdown() {
  clearInterval(profileCountdownInterval);
}

/* ============================================================
   2. SELECCIÓN DE PERFIL
   ============================================================ */
function selP(t) {
  ['b','d','m','db'].forEach(p => {
    const el = document.getElementById('psel-' + p);
    if (el) el.classList.remove('sel-blind','sel-deaf','sel-mute','sel-deafblind');
  });
  const map = { b: 'sel-blind', d: 'sel-deaf', m: 'sel-mute', db: 'sel-deafblind' };
  const el = document.getElementById('psel-' + t);
  if (el) el.classList.add(map[t]);
}


/* ============================================================
   3. DETECCIÓN IA (pantalla sc2)
   ============================================================ */
function startDetect() {
  clearInterval(detectInt);
  const fill   = document.getElementById('ls-fill');
  const sec    = document.getElementById('ls-sec');
  const sec2   = document.getElementById('ls-sec2');
  const status = document.getElementById('ls-status');
  const aiRes  = document.getElementById('ai-res');
  const cbarF  = document.querySelector('.cbar-f');

  if (fill)  fill.style.width = '0%';
  if (aiRes) aiRes.style.opacity = '0';
  ['sig-mic','sig-cam','sig-tap'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('hot','hot-blind');
  });
  ['sv-mic','sv-cam','sv-tap'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '—';
  });

  const phases = [
    { t: 1.5, status: 'Analizando micrófono...', chip: 'sig-mic', val: 'sv-mic', value: 'Escuchando', cls: 'hot' },
    { t: 3.0, status: 'Observando cámara...', chip: 'sig-cam', val: 'sv-cam', value: 'Observando', cls: 'hot-blind' },
    { t: 4.5, status: 'Midiendo interacción...', chip: 'sig-tap', val: 'sv-tap', value: 'Detectando', cls: 'hot-blind' },
    { t: 6.0, status: 'Procesando patrones IA...',    dot: 2 },
    { t: 7.5, status: 'Perfil detectado → Ciego (87%)', dot: 3, result: true },
  ];

  let t = 0;
  detectInt = setInterval(() => {
    t += 0.1;
    const pct = Math.min((t / 8) * 100, 100);
    if (fill)  fill.style.width = pct + '%';
    if (sec)   sec.textContent  = Math.round(t) + 's';
    if (sec2)  sec2.textContent = Math.round(t) + 's';
    phases.forEach(ph => {
      if (Math.abs(t - ph.t) < 0.15) {
        if (status) status.textContent = ph.status;
        if (ph.chip) {
          const chip = document.getElementById(ph.chip);
          const vl   = document.getElementById(ph.val);
          if (chip) chip.classList.add(ph.cls);
          if (vl)   vl.textContent = ph.value;
        }
        if (ph.result && aiRes) {
          aiRes.style.opacity = '1';
          if (cbarF) { cbarF.style.width = '0%'; setTimeout(() => cbarF.style.width = '87%', 100); }
        }
      }
    });
    if (t >= 8) { clearInterval(detectInt); setTimeout(() => go(3), 800); }
  }, 100);
}


/* ============================================================
   4. CUENTA REGRESIVA (pantalla sc3)
   ============================================================ */
function startCountdown() {
  clearInterval(cntInt);
  let t = 8;
  const el  = document.getElementById('cnt-num');
  const el2 = document.getElementById('cnt-num2');
  const update = () => {
    if (el)  el.textContent  = t + 's';
    if (el2) el2.textContent = t + 's';
  };
  update();
  cntInt = setInterval(() => {
    t--;
    update();
    if (t <= 0) { clearInterval(cntInt); go(4); }
  }, 1000);
}


/* ============================================================
   5. MODO CIEGO
   ============================================================ */
let blindRec = null;
let isBlindRecording = false;
let blindWaveInterval = null;

function initBlindWaveform() {
  const container = document.getElementById('blindWaveform');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < 18; i++) {
    const bar = document.createElement('div');
    bar.style.cssText = 'width:3px;border-radius:2px;background:var(--blind);opacity:0.25;height:4px;transition:height .1s;';
    container.appendChild(bar);
  }
}

function initBlindRecognition() {
  initBlindWaveform();
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  blindRec = new SR();
  blindRec.continuous = true;
  blindRec.interimResults = true;
  blindRec.lang = 'es-ES';
  blindRec.onresult = (e) => {
    let txt = '';
    for (let i = e.resultIndex; i < e.results.length; i++) txt += e.results[i][0].transcript;
    const el = document.getElementById('blindOutput');
    if (el) el.textContent = txt;
  };
  blindRec.onend = () => { if (isBlindRecording) blindRec.start(); };
}

function toggleBlindMic() {
  const btn    = document.getElementById('blindMicBtn');
  const status = document.getElementById('blindMicStatus');
  if (!isBlindRecording) {
    isBlindRecording = true;
    if (btn)    { btn.style.background = '#DC2626'; btn.style.animation = 'none'; }
    if (status) status.textContent = 'Escuchando... toca para detener';
    animateBlindWaveform(true);
    if (blindRec) { try { blindRec.start(); } catch(e) {} }
    else {
      const el = document.getElementById('blindOutput');
      if (el) el.textContent = 'Micrófono activo.';
    }
  } else {
    isBlindRecording = false;
    if (btn)    { btn.style.background = 'var(--blind)'; btn.style.animation = 'orb-blind 3s ease-in-out infinite'; }
    if (status) status.textContent = 'Toca para hablar';
    animateBlindWaveform(false);
    if (blindRec) { try { blindRec.stop(); } catch(e) {} }
  }
}

function animateBlindWaveform(active) {
  clearInterval(blindWaveInterval);
  const container = document.getElementById('blindWaveform');
  if (!container) return;
  if (!active) {
    container.querySelectorAll('div').forEach(b => { b.style.height = '4px'; b.style.opacity = '0.25'; });
    return;
  }
  blindWaveInterval = setInterval(() => {
    container.querySelectorAll('div').forEach(b => {
      b.style.height  = (4 + Math.random() * 24) + 'px';
      b.style.opacity = '0.8';
    });
  }, 80);
}

function copyBlindText() {
  const el = document.getElementById('blindOutput');
  if (el) navigator.clipboard.writeText(el.textContent).catch(() => {});
}

function speakBlindText() {
  const el = document.getElementById('blindOutput');
  if (el && 'speechSynthesis' in window) {
    const utt = new SpeechSynthesisUtterance(el.textContent);
    utt.lang = 'es-ES';
    speechSynthesis.speak(utt);
  }
}

function speakBlindPhrase(text) {
  if ('speechSynthesis' in window) {
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'es-ES';
    speechSynthesis.speak(utt);
  }
  addToBlindHistory(text);
}

function addToBlindHistory(text) {
  const history = document.getElementById('blindHistory');
  if (!history) return;
  const item = document.createElement('div');
  item.style.cssText = 'font-size:11px;color:var(--t2);padding:4px 0;border-bottom:1px solid var(--b0);';
  item.textContent = '🔊 ' + text.substring(0,35) + (text.length > 35 ? '…' : '') + ' – ' + new Date().toLocaleTimeString();
  const placeholder = history.querySelector('div[style*="italic"]');
  if (placeholder) history.innerHTML = '';
  history.insertBefore(item, history.firstChild);
  while (history.children.length > 5) history.removeChild(history.lastChild);
}


/* ============================================================
   6. MODO SORDO — SUBTÍTULOS
   ============================================================ */
let deafRec = null;
let isDeafRecording = false;

function initDeafRecognition() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  deafRec = new SR();
  deafRec.continuous = true;
  deafRec.interimResults = true;
  deafRec.lang = 'es-ES';
  deafRec.onresult = (e) => {
    let txt = '';
    for (let i = e.resultIndex; i < e.results.length; i++) txt += e.results[i][0].transcript;
    const sub = document.getElementById('deafSubtitle');
    if (sub) sub.innerHTML = '"' + txt + '"<span style="display:inline-block;width:2px;height:22px;background:var(--deaf);margin-left:2px;vertical-align:middle;animation:blink .8s ease-in-out infinite;"></span>';
    addToDeafHistory(txt);
  };
  deafRec.onend = () => { if (isDeafRecording) deafRec.start(); };
}

function toggleDeafTranscription() {
  const btn     = document.getElementById('deafStartBtn');
  const btnText = document.getElementById('deafBtnText');
  if (!isDeafRecording) {
    isDeafRecording = true;
    if (btn)     btn.style.background = '#DC2626';
    if (btnText) btnText.textContent  = 'Detener escucha';
    if (deafRec) { try { deafRec.start(); } catch(e) {} }
  } else {
    isDeafRecording = false;
    if (btn)     btn.style.background = 'var(--deaf)';
    if (btnText) btnText.textContent  = 'Iniciar escucha';
    if (deafRec) { try { deafRec.stop(); } catch(e) {} }
  }
}

function clearDeafSubtitle() {
  const sub = document.getElementById('deafSubtitle');
  if (sub) sub.innerHTML = '"Toca aquí para iniciar..."<span style="display:inline-block;width:2px;height:22px;background:var(--deaf);margin-left:2px;vertical-align:middle;animation:blink .8s ease-in-out infinite;"></span>';
}

function quickDeafPhrase(text) {
  speakBlindPhrase(text);
}

function emergencyDeaf() {
  if ('speechSynthesis' in window) {
    const utt = new SpeechSynthesisUtterance('Necesito ayuda de emergencia');
    utt.lang = 'es-ES'; utt.rate = 0.8; utt.pitch = 1.2;
    speechSynthesis.speak(utt);
  }
}

function addToDeafHistory(text) {
  const h = document.getElementById('deafHistory');
  if (!h) return;
  const item = document.createElement('div');
  item.style.cssText = 'font-size:11px;color:var(--t2);padding:4px 0;border-bottom:1px solid var(--b0);';
  item.textContent = '💬 ' + text.substring(0,40) + (text.length > 40 ? '…' : '') + ' – ' + new Date().toLocaleTimeString();
  const ph = h.querySelector('div[style*="italic"]');
  if (ph) h.innerHTML = '';
  h.insertBefore(item, h.firstChild);
  while (h.children.length > 5) h.removeChild(h.lastChild);
}


/* ============================================================
   7. SEÑAS LSM
   ============================================================ */
const LSM_ALPHABET = [
  { l:'A', e:'✊' },{ l:'B', e:'✋' },{ l:'C', e:'🤙' },{ l:'D', e:'👆' },{ l:'E', e:'🤞' },{ l:'F', e:'👌' },{ l:'G', e:'👈' },
  { l:'H', e:'🤟' },{ l:'I', e:'🤙' },{ l:'J', e:'✌️' },{ l:'K', e:'🤘' },{ l:'L', e:'🤙' },{ l:'M', e:'🤜' },{ l:'N', e:'✊' },
  { l:'O', e:'👏' },{ l:'P', e:'🤞' },{ l:'Q', e:'🖐'  },{ l:'R', e:'🤞' },{ l:'S', e:'✊' },{ l:'T', e:'👊' },{ l:'U', e:'☝️' },
  { l:'V', e:'✌️' },{ l:'W', e:'🖖' },{ l:'X', e:'🤙' },{ l:'Y', e:'🤙' },{ l:'Z', e:'👇' }
];
let activeLsmCell = null;

function initLSMGrid() {
  const grid = document.getElementById('alphaGrid');
  if (!grid || grid.children.length > 0) return;
  LSM_ALPHABET.forEach(item => {
    const cell = document.createElement('div');
    cell.className = 'lsm-cell';
    cell.innerHTML = '<span class="lsm-emoji">' + item.e + '</span><span class="lsm-letter">' + item.l + '</span>';
    cell.onclick = () => showSign(item, cell);
    grid.appendChild(cell);
  });
}

function showSign(item, cell) {
  if (activeLsmCell) activeLsmCell.classList.remove('active');
  activeLsmCell = cell;
  cell.classList.add('active');
  const lLetter = document.getElementById('lLetter');
  const lName = document.getElementById('lName');
  if (lLetter) lLetter.textContent = item.l;
  if (lName) lName.textContent = 'Seña de la letra "' + item.l + '"';
}

function spellWord() {
  const input = document.getElementById('lsmInput');
  if (!input || !input.value) return;
  const word = input.value.toUpperCase();
  let i = 0;
  const interval = setInterval(() => {
    if (i >= word.length) { clearInterval(interval); return; }
    const letter = word[i];
    const item = LSM_ALPHABET.find(x => x.l === letter);
    if (item) {
      const cell = Array.from(document.querySelectorAll('.lsm-cell')).find(c => c.textContent.includes(item.l));
      if (cell) showSign(item, cell);
    }
    i++;
  }, 1000);
}

function clearLSM() {
  const input = document.getElementById('lsmInput');
  if (input) input.value = '';
  if (activeLsmCell) {
    activeLsmCell.classList.remove('active');
    activeLsmCell = null;
  }
  const lLetter = document.getElementById('lLetter');
  const lName = document.getElementById('lName');
  if (lLetter) lLetter.textContent = 'A';
  if (lName) lName.textContent = 'Toca una letra para ver la seña';
}

function setLSMSpd(val) {
  const slider = document.getElementById('lsmSpeedSlider');
  const label = document.getElementById('lsmSpeedVal');
  if (label) {
    if (val < 500) label.textContent = 'Lento';
    else if (val < 1000) label.textContent = 'Normal';
    else label.textContent = 'Rápido';
  }
}


/* ============================================================
   8. MODO MUDO — TEXTO A VOZ
   ============================================================ */
let muteSpeed = 1;

function updateMuteSpeed(val) {
  muteSpeed = parseFloat(val);
  const label  = document.getElementById('muteSpeedLabel');
  const labels = { '0.5':'Muy lento', '0.75':'Lento', '1':'Normal', '1.25':'Rápido', '1.5':'Muy rápido', '2':'Máximo' };
  if (label) label.textContent = labels[val] || 'Normal';
}

function updateMuteCharCount() {
  const input = document.getElementById('muteTextInput');
  const count = document.getElementById('muteCharCount');
  if (input && count) count.textContent = input.value.length + ' / 300';
}

function speakMuteText() {
  const input = document.getElementById('muteTextInput');
  if (!input || !input.value.trim()) return;
  const text = input.value.trim();
  if ('speechSynthesis' in window) {
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'es-ES'; utt.rate = muteSpeed;
    speechSynthesis.speak(utt);
  }
  addToMuteHistory(text);
}

function clearMuteText() {
  const input = document.getElementById('muteTextInput');
  if (input) { input.value = ''; updateMuteCharCount(); }
}

function setMutePhrase(text) {
  const input = document.getElementById('muteTextInput');
  if (input) { input.value = text; updateMuteCharCount(); }
  speakMuteText();
}

function quickMuteSpeak(text) {
  if ('speechSynthesis' in window) {
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'es-ES'; utt.rate = muteSpeed;
    speechSynthesis.speak(utt);
  }
  addToMuteHistory(text);
}

function addToMuteHistory(text) {
  const history = document.getElementById('muteHistory');
  if (!history) return;
  const item = document.createElement('div');
  item.style.cssText = 'font-size:11px;color:var(--t2);padding:4px 0;border-bottom:1px solid var(--b0);';
  item.textContent = '🔊 ' + text.substring(0,35) + (text.length > 35 ? '…' : '') + ' – ' + new Date().toLocaleTimeString();
  const ph = history.querySelector('div[style*="italic"]');
  if (ph) history.innerHTML = '';
  history.insertBefore(item, history.firstChild);
  while (history.children.length > 5) history.removeChild(history.lastChild);
}


/* ============================================================
   9. TRANSCRIPCIÓN AUDIO/VIDEO
   ============================================================ */
let isRecording = false, recTimer = null, recSecs = 0, transcribeRecObj = null;

function initTranscribeRecognition() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  transcribeRecObj = new SR();
  transcribeRecObj.continuous = true;
  transcribeRecObj.interimResults = true;
  transcribeRecObj.lang = 'es-ES';
  transcribeRecObj.onresult = (e) => {
    let txt = '';
    for (let i = e.resultIndex; i < e.results.length; i++) txt += e.results[i][0].transcript;
    appendTranscribe(txt);
  };
}

function switchTranscribeTab(tab) {
  const upload = document.getElementById('uploadSection');
  const record = document.getElementById('recordSection');
  const tabU   = document.getElementById('tabUpload');
  const tabR   = document.getElementById('tabRecord');
  if (tab === 'upload') {
    upload.style.display = '';   record.style.display = 'none';
    tabU.style.background = 'var(--deaf)'; tabU.style.color = '#fff';
    tabR.style.background = 'var(--surf)'; tabR.style.color = 'var(--deaf)';
  } else {
    upload.style.display = 'none'; record.style.display = '';
    tabR.style.background = 'var(--deaf)'; tabR.style.color = '#fff';
    tabU.style.background = 'var(--surf)'; tabU.style.color = 'var(--deaf)';
  }
}

function toggleRecording() {
  const btn    = document.getElementById('recordBtn');
  const status = document.getElementById('recordStatus');
  const timer  = document.getElementById('recordTimer');
  if (!isRecording) {
    isRecording = true; recSecs = 0;
    if (btn)    { btn.style.background = '#DC2626'; btn.style.animation = 'none'; }
    if (status) status.textContent = 'Grabando… toca para detener';
    if (transcribeRecObj) { try { transcribeRecObj.start(); } catch(e) {} }
    recTimer = setInterval(() => {
      recSecs++;
      const m = Math.floor(recSecs / 60).toString().padStart(2, '0');
      const s = (recSecs % 60).toString().padStart(2, '0');
      if (timer) timer.textContent = m + ':' + s;
    }, 1000);
  } else {
    isRecording = false;
    clearInterval(recTimer);
    if (btn)    { btn.style.background = 'var(--deaf)'; btn.style.animation = 'orb-deaf 3s ease-in-out infinite'; }
    if (status) status.textContent = 'Toca para grabar';
    if (transcribeRecObj) { try { transcribeRecObj.stop(); } catch(e) {} }
    const st = document.getElementById('transcribeStatus');
    if (st) { st.textContent = 'Transcrito'; st.style.background = 'var(--deaf-l)'; st.style.color = 'var(--deaf)'; }
  }
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  const el = document.getElementById('selectedFile');
  if (el) el.textContent = '✓ ' + file.name;
  const status = document.getElementById('transcribeStatus');
  const progress = document.getElementById('progressSection');
  if (status) { status.textContent = 'Procesando…'; }
  if (progress) progress.style.display = '';

  let pct = 0;
  const bar = document.getElementById('progressBar');
  const pctEl = document.getElementById('progressPercent');
  const sim = setInterval(() => {
    pct += 5;
    if (bar) bar.style.width = pct + '%';
    if (pctEl) pctEl.textContent = pct + '%';
    if (pct >= 100) {
      clearInterval(sim);
      const st = document.getElementById('transcribeStatus');
      if (st) { st.textContent = 'Completado'; st.style.background = 'var(--deaf-l)'; st.style.color = 'var(--deaf)'; }
      appendTranscribe('Archivo procesado: ' + file.name);
    }
  }, 100);
}

function appendTranscribe(text) {
  const out = document.getElementById('transcribeOutput');
  if (out) out.textContent = text || 'La transcripción aparecerá aquí...';
}

function clearTranscribe() {
  const out = document.getElementById('transcribeOutput');
  const status = document.getElementById('transcribeStatus');
  if (out) out.textContent = 'La transcripción aparecerá aquí...';
  if (status) { status.textContent = 'Esperando…'; status.style.background = 'var(--surf2)'; status.style.color = 'var(--t3)'; }
}

function copyTranscribe() {
  const out = document.getElementById('transcribeOutput');
  if (out) navigator.clipboard.writeText(out.textContent).catch(() => {});
}

function downloadTranscribe() {
  const out = document.getElementById('transcribeOutput');
  if (!out || !out.textContent) return;
  const blob = new Blob([out.textContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'transcripcion-' + Date.now() + '.txt';
  a.click();
  URL.revokeObjectURL(url);
}

function addToTranscribeHistory(text) {
  // Placeholder para historial
}


/* ============================================================
   10. INICIALIZACIÓN GENERAL
   ============================================================ */
window.addEventListener('DOMContentLoaded', () => {
  initBlindRecognition();
  initDeafRecognition();
  initTranscribeRecognition();
});

// Exportar funciones globales
window.selP = selP;
window.selectProfile = selectProfile;
window.resumeSession = resumeSession;
window.checkForSavedSession = checkForSavedSession;
window.startProfileCountdown = startProfileCountdown;
window.stopProfileCountdown = stopProfileCountdown;
window.saveSession = saveSession;
window.startDetect = startDetect;
window.startCountdown = startCountdown;
window.toggleBlindMic = toggleBlindMic;
window.copyBlindText = copyBlindText;
window.speakBlindText = speakBlindText;
window.speakBlindPhrase = speakBlindPhrase;
window.toggleDeafTranscription = toggleDeafTranscription;
window.clearDeafSubtitle = clearDeafSubtitle;
window.quickDeafPhrase = quickDeafPhrase;
window.emergencyDeaf = emergencyDeaf;
window.initLSMGrid = initLSMGrid;
window.showSign = showSign;
window.spellWord = spellWord;
window.clearLSM = clearLSM;
window.setLSMSpd = setLSMSpd;
window.updateMuteSpeed = updateMuteSpeed;
window.updateMuteCharCount = updateMuteCharCount;
window.speakMuteText = speakMuteText;
window.clearMuteText = clearMuteText;
window.setMutePhrase = setMutePhrase;
window.quickMuteSpeak = quickMuteSpeak;
window.switchTranscribeTab = switchTranscribeTab;
window.toggleRecording = toggleRecording;
window.handleFileSelect = handleFileSelect;
window.clearTranscribe = clearTranscribe;
window.copyTranscribe = copyTranscribe;
window.downloadTranscribe = downloadTranscribe;
