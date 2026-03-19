/* ============================================================
   UNIVOZ — app.js
   Versión integrada v5 + LSM v4
   ============================================================

   ÍNDICE
   ──────────────────────────────────────────────────────────
   1.  NAVEGACIÓN ENTRE PANTALLAS
       - go(n), prev(), next(), autoFlow()
   2.  SELECCIÓN DE PERFIL
       - selP(t)
   3.  DETECCIÓN IA (pantalla sc2)
       - startDetect(), setDots(active)
   4.  CUENTA REGRESIVA (pantalla sc3)
       - startCountdown()
   5.  MODO CIEGO
       5a. Inicialización de reconocimiento de voz
       5b. toggleBlindMic()
       5c. Waveform visual
       5d. Funciones de texto / historial
   6.  MODO SORDO — SUBTÍTULOS
       6a. initDeafRecognition()
       6b. toggleDeafTranscription()
       6c. Funciones auxiliares de subtítulos
   7.  SEÑAS LSM — AVATAR SIMPLE (pantalla sc10)
       7a. initLSMGrid() — grid de emojis
       7b. showSign(), toggleSignCamera()
   8.  MODO MUDO — TEXTO A VOZ
       8a. speakMuteText(), setMutePhrase()
       8b. quickMuteSpeak(), historial mudo
       8c. Controles de velocidad y contador
   9.  TRANSCRIPCIÓN AUDIO/VIDEO (pantalla sc11)
       9a. initTranscribeRecognition()
       9b. switchTranscribeTab()
       9c. toggleRecording()
       9d. handleFileSelect()
       9e. Funciones de resultado
  10.  LSM 3D — MOTOR THREE.JS (pantalla sc10 avanzado)
       10a. Inicialización de escena, cámara, luces
       10b. Materiales y buildHand()
       10c. Poses LSM (POSES, NEUTRAL)
       10d. Sistema de animación (capHand, applyLerp)
       10e. triggerSign(key)
       10f. Construcción del UI 3D (grids y frases)
       10g. Deletrear palabra (spellWord, nextSpell, clearAll)
       10h. Control de velocidad (setSpd)
       10i. Partículas de fondo
       10j. Loop de renderizado (animate)
  11.  INICIALIZACIÓN GENERAL (DOMContentLoaded + go(0))
   ──────────────────────────────────────────────────────────
*/

/* ============================================================
   1. NAVEGACIÓN ENTRE PANTALLAS
   ============================================================ */
const TOTAL_SCREENS = 16;
let currentScreen = 0;
let autoInt, cntInt, detectInt;

function go(n) {
  for (let i = 0; i < TOTAL_SCREENS; i++) {
    const sc  = document.getElementById('sc'  + i);
    const btn = document.getElementById('btn' + i);
    if (sc)  sc.classList.toggle('on', i === n);
    if (btn) btn.classList.toggle('on', i === n);
  }
  currentScreen = n;

  // Efectos de entrada por pantalla
  if (n === 2)  startDetect();
  if (n === 3)  startCountdown();
  if (n === 10) {
    initLSMGrid();       // grid simple de emojis
    initLSM3D();         // motor Three.js (solo la primera vez)
  }
}

function prev() { go((currentScreen - 1 + TOTAL_SCREENS) % TOTAL_SCREENS); }
function next() { go((currentScreen + 1) % TOTAL_SCREENS); }


/* ============================================================
   2. SELECCIÓN DE PERFIL
   ============================================================ */
function selP(t) {
  ['b','d','m'].forEach(p => {
    const el = document.getElementById('psel-' + p);
    if (el) el.classList.remove('sel-blind','sel-deaf','sel-mute');
  });
  const map = { b: 'sel-blind', d: 'sel-deaf', m: 'sel-mute' };
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
  setDots(0);

  const phases = [
    { t: 1.5, status: 'Analizando micrófono...',     chip: 'sig-mic', val: 'sv-mic', value: 'Voz detectada', cls: 'hot' },
    { t: 3.0, status: 'Observando cámara...',         chip: 'sig-cam', val: 'sv-cam', value: 'Sin uso',       cls: 'hot-blind' },
    { t: 4.5, status: 'Midiendo interacción...',      chip: 'sig-tap', val: 'sv-tap', value: 'Solo voz',      cls: 'hot-blind' },
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
    setDots(Math.min(Math.floor(t / 2), 3));
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

function setDots(active) {
  for (let i = 0; i < 4; i++) {
    const d = document.getElementById('pd' + i);
    if (d) d.classList.toggle('on', i === active);
  }
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

/* 5a. Inicialización */
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

/* 5b. Toggle micrófono ciego */
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
      if (el) el.textContent = 'Micrófono activo. (Reconocimiento de voz requiere navegador compatible)';
    }
  } else {
    isBlindRecording = false;
    if (btn)    { btn.style.background = 'var(--blind)'; btn.style.animation = 'orb-blind 3s ease-in-out infinite'; }
    if (status) status.textContent = 'Toca para hablar';
    animateBlindWaveform(false);
    if (blindRec) { try { blindRec.stop(); } catch(e) {} }
    const output = document.getElementById('blindOutput');
    if (output && output.textContent !== 'Toca el micrófono para comenzar a hablar...') {
      addToBlindHistory(output.textContent);
    }
  }
}

/* 5c. Waveform visual */
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

/* 5d. Funciones de texto */
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
  item.textContent = `🔊 ${text.substring(0,35)}${text.length > 35 ? '…' : ''} – ${new Date().toLocaleTimeString()}`;
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

/* 6a. Inicialización */
function initDeafRecognition() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  deafRec = new SR();
  deafRec.continuous = true;
  deafRec.interimResults = true;
  deafRec.lang = document.getElementById('sordoLang')?.value || 'es-ES';
  deafRec.onresult = (e) => {
    let txt = '';
    for (let i = e.resultIndex; i < e.results.length; i++) txt += e.results[i][0].transcript;
    const sub = document.getElementById('deafSubtitle');
    if (sub) sub.innerHTML = `"${txt}"<span style="display:inline-block;width:2px;height:22px;background:var(--deaf);margin-left:2px;vertical-align:middle;animation:blink .8s ease-in-out infinite;"></span>`;
    addToDeafHistory(txt);
  };
  deafRec.onend = () => { if (isDeafRecording) deafRec.start(); };
}

/* 6b. Toggle transcripción */
function toggleDeafTranscription() {
  const btn     = document.getElementById('deafStartBtn');
  const btnText = document.getElementById('deafBtnText');
  if (!isDeafRecording) {
    isDeafRecording = true;
    if (btn)     btn.style.background = '#DC2626';
    if (btnText) btnText.textContent  = 'Detener escucha';
    if (deafRec) { try { deafRec.start(); } catch(e) {} }
    else {
      const sub = document.getElementById('deafSubtitle');
      if (sub) sub.innerHTML = `"Micrófono activo. Reconocimiento de voz requiere Chrome o Safari..."<span style="display:inline-block;width:2px;height:22px;background:var(--deaf);margin-left:2px;vertical-align:middle;animation:blink .8s ease-in-out infinite;"></span>`;
    }
  } else {
    isDeafRecording = false;
    if (btn)     btn.style.background = 'var(--deaf)';
    if (btnText) btnText.textContent  = 'Iniciar escucha';
    if (deafRec) { try { deafRec.stop(); } catch(e) {} }
  }
}

/* 6c. Funciones auxiliares de subtítulos */
function clearDeafSubtitle() {
  const sub = document.getElementById('deafSubtitle');
  if (sub) sub.innerHTML = `"Subtítulos borrados. Toca para reiniciar..."<span style="display:inline-block;width:2px;height:22px;background:var(--deaf);margin-left:2px;vertical-align:middle;animation:blink .8s ease-in-out infinite;"></span>`;
}

function quickDeafPhrase(text) {
  speakBlindPhrase(text); // reutiliza la síntesis de voz del modo ciego
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
  item.textContent = `💬 ${text.substring(0,40)}${text.length > 40 ? '…' : ''} – ${new Date().toLocaleTimeString()}`;
  const ph = h.querySelector('div[style*="italic"]');
  if (ph) h.innerHTML = '';
  h.insertBefore(item, h.firstChild);
  while (h.children.length > 5) h.removeChild(h.lastChild);
}

function updateSubtitleSize(val) {
  const sub   = document.getElementById('deafSubtitle');
  const label = document.getElementById('subtitleSizeVal');
  const badge = document.getElementById('subtitleSizeLabel');
  if (sub)   sub.style.fontSize = val + 'px';
  if (label) label.textContent  = val + 'px';
  if (badge) badge.textContent  = val + 'px';
}


/* ============================================================
   7. SEÑAS LSM — AVATAR SIMPLE (pantalla sc10)
   ============================================================ */
const LSM_ALPHABET = [
  { l:'A', e:'👊' },{ l:'B', e:'✋' },{ l:'C', e:'🤙' },{ l:'D', e:'👆' },{ l:'E', e:'🤞' },{ l:'F', e:'👌' },{ l:'G', e:'👈' },
  { l:'H', e:'🤟' },{ l:'I', e:'🤙' },{ l:'J', e:'✌️' },{ l:'K', e:'🤘' },{ l:'L', e:'🤙' },{ l:'M', e:'🤜' },{ l:'N', e:'✊' },
  { l:'O', e:'👐' },{ l:'P', e:'🤞' },{ l:'Q', e:'🖐'  },{ l:'R', e:'🤞' },{ l:'S', e:'✊' },{ l:'T', e:'👊' },{ l:'U', e:'☝️' },
  { l:'V', e:'✌️' },{ l:'W', e:'🖖' },{ l:'X', e:'🤙' },{ l:'Y', e:'🤙' },{ l:'Z', e:'👇' }
];
let activeLsmCell = null;

/* 7a. Construir grid de emojis */
function initLSMGrid() {
  const grid = document.getElementById('lsmGrid');
  if (!grid || grid.children.length > 0) return;
  LSM_ALPHABET.forEach(item => {
    const cell = document.createElement('div');
    cell.className = 'lsm-cell';
    cell.innerHTML = `<span class="lsm-emoji">${item.e}</span><span class="lsm-letter">${item.l}</span>`;
    cell.onclick = () => showSign(item, cell);
    grid.appendChild(cell);
  });
}

/* 7b. Mostrar seña seleccionada */
function showSign(item, cell) {
  if (activeLsmCell) activeLsmCell.classList.remove('active');
  activeLsmCell = cell;
  cell.classList.add('active');
  const label = document.getElementById('avSignLabel');
  if (label) label.textContent = `${item.e} ${item.l}`;
  const out = document.getElementById('sordoSignOutput');
  if (out) out.textContent = `Seña: letra "${item.l}" en LSM`;
  // Si el motor 3D está activo, disparar la seña allí también
  if (typeof triggerSign === 'function') triggerSign(item.l);
}

let signCamActive = false;
function toggleSignCamera() {
  signCamActive = !signCamActive;
  const btn   = document.getElementById('camBtnText');
  const ico   = document.getElementById('camIcon');
  const out   = document.getElementById('sordoSignOutput');
  const armR  = document.getElementById('avArmR');
  const armL  = document.getElementById('avArmL');
  if (signCamActive) {
    if (btn)  btn.textContent  = 'Detener escucha';
    if (ico)  ico.textContent  = 'mic_off';
    if (out)  out.textContent  = 'Escuchando... El avatar traducirá la voz a señas LSM en tiempo real.';
    if (armR) armR.classList.add('anim');
    if (armL) armL.classList.add('anim');
  } else {
    if (btn)  btn.textContent  = 'Activar escucha para señas';
    if (ico)  ico.textContent  = 'mic';
    if (out)  out.textContent  = 'Escucha detenida.';
    if (armR) armR.classList.remove('anim');
    if (armL) armL.classList.remove('anim');
  }
}


/* ============================================================
   8. MODO MUDO — TEXTO A VOZ
   ============================================================ */
let muteSpeed = 1;

/* 8c. Controles de velocidad y contador */
function updateMuteSpeed(val) {
  muteSpeed = parseFloat(val);
  const label  = document.getElementById('muteSpeedLabel');
  const labels = { 0.5:'Muy lento', 0.75:'Lento', 1:'Normal', 1.25:'Rápido', 1.5:'Muy rápido', 2:'Máximo' };
  const closest = Object.keys(labels).reduce((a, b) => Math.abs(b - val) < Math.abs(a - val) ? b : a);
  if (label) label.textContent = labels[closest] || 'Normal';
}

function updateMuteCharCount() {
  const input = document.getElementById('muteTextInput');
  const count = document.getElementById('muteCharCount');
  if (input && count) count.textContent = `${input.value.length} / 300`;
}

/* 8a. Hablar texto */
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

/* 8b. Frases rápidas desde home */
function quickMuteSpeak(text) {
  if ('speechSynthesis' in window) {
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'es-ES'; utt.rate = muteSpeed;
    speechSynthesis.speak(utt);
  }
  addToMuteHistory(text);
  const h = document.getElementById('muteHomeHistory');
  if (h) {
    const item = document.createElement('div');
    item.style.cssText = 'font-size:11px;color:var(--t2);padding:4px 0;border-bottom:1px solid var(--b0);';
    item.textContent = `🔊 ${text.substring(0,35)}… – ${new Date().toLocaleTimeString()}`;
    const ph = h.querySelector('div[style*="italic"]');
    if (ph) h.innerHTML = '';
    h.insertBefore(item, h.firstChild);
  }
}

function addToMuteHistory(text) {
  const history = document.getElementById('muteHistory');
  if (!history) return;
  const item = document.createElement('div');
  item.style.cssText = 'font-size:11px;color:var(--t2);padding:4px 0;border-bottom:1px solid var(--b0);';
  item.textContent = `🔊 ${text.substring(0,35)}${text.length > 35 ? '…' : ''} – ${new Date().toLocaleTimeString()}`;
  const ph = history.querySelector('div[style*="italic"]');
  if (ph) history.innerHTML = '';
  history.insertBefore(item, history.firstChild);
  while (history.children.length > 5) history.removeChild(history.lastChild);
}


/* ============================================================
   9. TRANSCRIPCIÓN AUDIO/VIDEO (pantalla sc11)
   ============================================================ */
let isRecording = false, recTimer = null, recSecs = 0, transcribeRecObj = null;

/* 9a. Inicialización */
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

/* 9b. Tabs de upload / grabar */
function switchTranscribeTab(tab) {
  const upload = document.getElementById('uploadSection');
  const record = document.getElementById('recordSection');
  const tabU   = document.getElementById('tabUpload');
  const tabR   = document.getElementById('tabRecord');
  if (tab === 'upload') {
    upload.style.display = '';   record.style.display = 'none';
    tabU.style.background = 'var(--deaf)'; tabU.style.color = '#fff'; tabU.style.border = 'none';
    tabR.style.background = 'var(--surf)'; tabR.style.color = 'var(--deaf)'; tabR.style.border = '1.5px solid var(--deaf-br)';
  } else {
    upload.style.display = 'none'; record.style.display = '';
    tabR.style.background = 'var(--deaf)'; tabR.style.color = '#fff'; tabR.style.border = 'none';
    tabU.style.background = 'var(--surf)'; tabU.style.color = 'var(--deaf)'; tabU.style.border = '1.5px solid var(--deaf-br)';
  }
}

/* 9c. Toggle grabación */
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
      if (timer) timer.textContent = `${m}:${s}`;
    }, 1000);
  } else {
    isRecording = false;
    clearInterval(recTimer);
    if (btn)    { btn.style.background = 'var(--deaf)'; btn.style.animation = 'orb-deaf 3s ease-in-out infinite'; }
    if (status) status.textContent = 'Toca para grabar';
    if (transcribeRecObj) { try { transcribeRecObj.stop(); } catch(e) {} }
    const st = document.getElementById('transcribeStatus');
    if (st) { st.textContent = 'Transcrito'; st.style.background = 'var(--deaf-l)'; st.style.color = 'var(--deaf)'; }
    addToTranscribeHistory('Grabación de voz');
  }
}

/* 9d. Seleccionar archivo */
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  const el       = document.getElementById('selectedFile');
  const status   = document.getElementById('transcribeStatus');
  const progress = document.getElementById('progressSection');
  if (el)       el.textContent    = `✓ ${file.name}`;
  if (status)   { status.textContent = 'Procesando…'; status.style.background = 'var(--mute-l)'; status.style.color = 'var(--mute-c)'; }
  if (progress) progress.style.display = '';

  let pct = 0;
  const bar   = document.getElementById('progressBar');
  const pctEl = document.getElementById('progressPercent');
  const interval = setInterval(() => {
    pct += Math.random() * 12;
    if (pct >= 100) {
      pct = 100; clearInterval(interval);
      if (status) { status.textContent = 'Transcrito ✓'; status.style.background = 'var(--deaf-l)'; status.style.color = 'var(--deaf)'; }
      appendTranscribe(`[${file.name}]\n\nEsta es la transcripción del archivo. El contenido aparecería aquí con la API real de UNIVOZ integrada con servicios de reconocimiento de voz (Whisper, Google Speech-to-Text, etc).`);
      addToTranscribeHistory(file.name);
    }
    if (bar)   bar.style.width     = pct + '%';
    if (pctEl) pctEl.textContent   = Math.round(pct) + '%';
  }, 200);

  const player = document.getElementById('playerSection');
  if (player) {
    player.style.display = '';
    const vid = document.getElementById('mediaPlayer');
    if (vid) vid.src = URL.createObjectURL(file);
  }
}

/* 9e. Funciones de resultado */
function appendTranscribe(text) {
  const output = document.getElementById('transcribeOutput');
  if (output) {
    if (output.textContent === 'La transcripción aparecerá aquí...') output.textContent = text;
    else output.textContent += ' ' + text;
  }
}

function clearTranscribe() {
  const output   = document.getElementById('transcribeOutput');
  const status   = document.getElementById('transcribeStatus');
  const progress = document.getElementById('progressSection');
  if (output)   output.textContent    = 'La transcripción aparecerá aquí...';
  if (status)   { status.textContent = 'Esperando…'; status.style.background = 'var(--surf2)'; status.style.color = 'var(--t3)'; }
  if (progress) progress.style.display = 'none';
}

function copyTranscribe() {
  const output = document.getElementById('transcribeOutput');
  if (output) navigator.clipboard.writeText(output.textContent).catch(() => {});
}

function downloadTranscribe() {
  const output = document.getElementById('transcribeOutput');
  if (output && output.textContent !== 'La transcripción aparecerá aquí...') {
    const blob = new Blob([output.textContent], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'transcripcion_' + new Date().toISOString().slice(0,19).replace(/:/g,'-') + '.txt';
    a.click();
    URL.revokeObjectURL(url);
  }
}

function addToTranscribeHistory(name) {
  const history = document.getElementById('transcribeHistory');
  if (!history) return;
  const item = document.createElement('div');
  item.style.cssText = 'font-size:11px;color:var(--t2);padding:4px 0;border-bottom:1px solid var(--b0);cursor:pointer;';
  item.textContent = `📄 ${name} – ${new Date().toLocaleTimeString()}`;
  const ph = history.querySelector('div[style*="italic"]');
  if (ph) history.innerHTML = '';
  history.insertBefore(item, history.firstChild);
  while (history.children.length > 5) history.removeChild(history.lastChild);
}


/* ============================================================
   10. LSM 3D — MOTOR THREE.JS
   Nota: Three.js debe estar cargado ANTES de este script.
   El motor se inicializa sólo cuando el usuario navega
   a la pantalla sc10 (llamado desde go(10) → initLSM3D()).
   ============================================================ */
let lsm3dReady = false; // evitar doble inicialización

function initLSM3D() {
  if (lsm3dReady || typeof THREE === 'undefined') return;
  lsm3dReady = true;

  /* 10a. Escena, cámara, renderer */
  const canvas = document.getElementById('lsmCanvas');
  if (!canvas) return;

  const CW = canvas.offsetWidth  || 320;
  const CH = 260;
  canvas.width  = CW;
  canvas.height = CH;

  const scene    = new THREE.Scene();
  scene.background = new THREE.Color(0x050C0A);

  const camera   = new THREE.PerspectiveCamera(32, CW / CH, 0.01, 30);
  camera.position.set(0, 0.22, 2.3);
  camera.lookAt(0, 0.04, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(CW, CH);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
  renderer.outputEncoding    = THREE.sRGBEncoding;
  renderer.toneMapping       = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  /* Luces */
  const kLight = new THREE.DirectionalLight(0xFFEEDD, 4.0);
  kLight.position.set(0, 5, 2.5);
  kLight.castShadow = true;
  kLight.shadow.mapSize.width  = 1024;
  kLight.shadow.mapSize.height = 1024;
  kLight.shadow.camera.left   = -1.2; kLight.shadow.camera.right = 1.2;
  kLight.shadow.camera.top    =  1;   kLight.shadow.camera.bottom = -1;
  kLight.shadow.bias = -0.003;
  scene.add(kLight);
  scene.add(new THREE.DirectionalLight(0xFFDDCC, 2.8).position.set(4, 0.5, 1.5) && new THREE.DirectionalLight(0xFFDDCC, 2.8));
  const gLight = new THREE.DirectionalLight(0xFFDDCC, 2.8); gLight.position.set( 4, 0.5, 1.5); scene.add(gLight);
  const fLight = new THREE.DirectionalLight(0xCCEEFF, 2.2); fLight.position.set(-4, 0.5, 1.5); scene.add(fLight);
  const rLight = new THREE.DirectionalLight(0x0D9488, 2.5); rLight.position.set( 0, 1, -2.5);  scene.add(rLight);
  const uLight = new THREE.DirectionalLight(0x334455, 1.6); uLight.position.set( 0, -3, 1.5);  scene.add(uLight);
  scene.add(new THREE.AmbientLight(0x1A2E2A, 1.8));

  /* 10b. Materiales */
  const matSkinDom  = new THREE.MeshStandardMaterial({ color:0xC8886A, roughness:0.80, metalness:0.0 });
  const matSkinBase = new THREE.MeshStandardMaterial({ color:0xBD7E60, roughness:0.82, metalness:0.0 });
  const matPalmDom  = new THREE.MeshStandardMaterial({ color:0xB07050, roughness:0.85, metalness:0.0 });
  const matPalmBase = new THREE.MeshStandardMaterial({ color:0xA56848, roughness:0.86, metalness:0.0 });
  const matJointDom = new THREE.MeshStandardMaterial({ color:0xD49878, roughness:0.70, metalness:0.02 });
  const matJointBase= new THREE.MeshStandardMaterial({ color:0xC48868, roughness:0.72, metalness:0.02 });
  const matNail     = new THREE.MeshStandardMaterial({ color:0xF0C8A8, roughness:0.32, metalness:0.08 });

  function mkMesh(geo, mat) {
    const m = new THREE.Mesh(geo, mat);
    m.castShadow    = true;
    m.receiveShadow = true;
    return m;
  }

  /* buildHand — construye mano dominante o base */
  function buildHand(isDominant) {
    const sk = isDominant ? matSkinDom  : matSkinBase;
    const pl = isDominant ? matPalmDom  : matPalmBase;
    const jt = isDominant ? matJointDom : matJointBase;
    const sx = isDominant ? 1 : -1;

    const rootGroup = new THREE.Group();
    rootGroup.position.x = isDominant ? 0.44 : -0.44;
    rootGroup.position.y = -0.15;
    scene.add(rootGroup);

    const wristGroup = new THREE.Group();
    rootGroup.add(wristGroup);

    // Muñeca
    const wm = mkMesh(new THREE.CylinderGeometry(0.095, 0.085, 0.16, 12), sk);
    wm.position.y = -0.08;
    wristGroup.add(wm);

    // Palma
    const palmGroup = new THREE.Group();
    palmGroup.position.y = 0.01;
    wristGroup.add(palmGroup);
    const pm = mkMesh(new THREE.BoxGeometry(0.23, 0.24, 0.060), pl);
    pm.position.y = 0.12;
    palmGroup.add(pm);

    // Nudillos
    const kxArr = isDominant ? [-0.088,-0.029,0.022,0.073] : [0.088,0.029,-0.022,-0.073];
    kxArr.forEach(kx => {
      const kn = mkMesh(new THREE.SphereGeometry(0.026, 8, 8), jt);
      kn.position.set(kx, 0.250, 0.007);
      palmGroup.add(kn);
    });

    // Dedos
    const fingerDefs = [
      { name:'thumb',  bx:sx*(-0.125), by:0.095, brx:0.16, brz:sx*0.48,    len:[0.064,0.050,0.038], rad:[0.026,0.022,0.018] },
      { name:'index',  bx:isDominant?-0.088:0.088, by:0.248, brx:0, brz:sx*0.065,  len:[0.068,0.053,0.038], rad:[0.022,0.018,0.014] },
      { name:'middle', bx:isDominant?-0.029:0.029, by:0.254, brx:0, brz:sx*0.008,  len:[0.074,0.057,0.042], rad:[0.022,0.018,0.014] },
      { name:'ring',   bx:isDominant? 0.022:-0.022, by:0.250, brx:0, brz:sx*(-0.042), len:[0.065,0.051,0.038], rad:[0.020,0.016,0.013] },
      { name:'pinky',  bx:isDominant? 0.073:-0.073, by:0.240, brx:0, brz:sx*(-0.115), len:[0.047,0.038,0.029], rad:[0.016,0.013,0.010] },
    ];

    const fingers = {};
    fingerDefs.forEach(fd => {
      const phs = [];
      let parent = palmGroup;
      fd.len.forEach((segLen, pi) => {
        const ph = new THREE.Group();
        if (pi === 0) {
          ph.position.set(fd.bx, fd.by, 0.010);
          ph.rotation.x = fd.brx;
          ph.rotation.z = fd.brz;
        } else {
          ph.position.y = fd.len[pi-1] + 0.005;
        }
        const cyl = mkMesh(new THREE.CylinderGeometry(fd.rad[pi]*0.86, fd.rad[pi], segLen, 9), sk);
        cyl.position.y = segLen / 2;
        ph.add(cyl);
        const jnt = mkMesh(new THREE.SphereGeometry(fd.rad[pi]*1.07, 8, 8), jt);
        jnt.position.y = 0;
        ph.add(jnt);
        if (pi === fd.len.length - 1) {
          const nail = mkMesh(new THREE.BoxGeometry(fd.rad[pi]*1.8, fd.rad[pi]*1.2, fd.rad[pi]*0.26), matNail);
          nail.position.set(0, segLen*0.72, fd.rad[pi]*0.96);
          nail.rotation.x = 0.16;
          ph.add(nail);
          const tip = mkMesh(new THREE.SphereGeometry(fd.rad[pi]*0.92, 8, 8), sk);
          tip.position.y = segLen;
          ph.add(tip);
        }
        parent.add(ph);
        parent = ph;
        phs.push(ph);
      });
      fingers[fd.name] = phs;
    });
    return { rootGroup, wristGroup, fingers };
  }

  const handDom  = buildHand(true);
  const handBase = buildHand(false);
  let domTargetY  = -0.15;
  let baseTargetY = -0.38;

  /* 10c. Poses LSM */
  const POSES = {
    A:{ name:'A', desc:'Puño cerrado · pulgar al costado', bimanual:false,
      dom:{ hx:0,hy:0,hz:0, f:{ thumb:[0.15,0.10,0.06], index:[1.52,1.42,1.28], middle:[1.54,1.44,1.30], ring:[1.52,1.42,1.28], pinky:[1.46,1.36,1.22]}}, base:null },
    B:{ name:'B', desc:'Mano plana · palma hacia adelante · pulgar cruzado', bimanual:false,
      dom:{ hx:-0.05,hy:0,hz:0, f:{ thumb:[0.88,0.12,0.0], index:[0,0,0], middle:[0,0,0], ring:[0,0,0], pinky:[0,0,0]}}, base:null },
    C:{ name:'C', desc:'Todos los dedos curvados en C', bimanual:false,
      dom:{ hx:0,hy:0.15,hz:0, f:{ thumb:[0.48,0.10,0.05], index:[0.70,0.50,0.30], middle:[0.74,0.54,0.34], ring:[0.70,0.50,0.30], pinky:[0.60,0.42,0.26]}}, base:null },
    D:{ name:'D', desc:'Índice arriba · demás forman O con pulgar', bimanual:false,
      dom:{ hx:0,hy:0,hz:0, f:{ thumb:[0.58,0.35,0.20], index:[0,0,0], middle:[1.26,1.16,0.96], ring:[1.26,1.16,0.96], pinky:[1.20,1.10,0.90]}}, base:null },
    E:{ name:'E', desc:'Yemas de dedos sobre palma · todos curvados', bimanual:false,
      dom:{ hx:0,hy:0,hz:0, f:{ thumb:[0.68,0.20,0.10], index:[0.90,0.80,0.66], middle:[0.92,0.82,0.68], ring:[0.90,0.80,0.66], pinky:[0.84,0.74,0.60]}}, base:null },
    F:{ name:'F', desc:'Índice-pulgar en aro · 3 dedos extendidos', bimanual:false,
      dom:{ hx:0,hy:0.10,hz:0, f:{ thumb:[0.78,0.45,0.28], index:[0.90,0.74,0.58], middle:[0,0,0], ring:[0,0,0], pinky:[0,0,0]}}, base:null },
    G:{ name:'G', desc:'Índice y pulgar paralelos apuntan a un lado', bimanual:false,
      dom:{ hx:0,hy:0.30,hz:0, f:{ thumb:[-0.04,0,0], index:[0,0,0], middle:[1.36,1.26,1.06], ring:[1.36,1.26,1.06], pinky:[1.30,1.20,1.00]}}, base:null },
    H:{ name:'H', desc:'Índice y medio extendidos horizontalmente', bimanual:false,
      dom:{ hx:0,hy:0.30,hz:0, f:{ thumb:[0.86,0.12,0], index:[0,0,0], middle:[0,0,0], ring:[1.36,1.26,1.06], pinky:[1.30,1.20,1.00]}}, base:null },
    I:{ name:'I', desc:'Meñique extendido · demás en puño', bimanual:false,
      dom:{ hx:0,hy:0,hz:0, f:{ thumb:[0.86,0.15,0.05], index:[1.36,1.26,1.06], middle:[1.36,1.26,1.06], ring:[1.36,1.26,1.06], pinky:[0,0,0]}}, base:null },
    J:{ name:'J', desc:'Meñique extendido · traza J en el aire', bimanual:false,
      dom:{ hx:0,hy:0.20,hz:0, f:{ thumb:[0.86,0.15,0.05], index:[1.36,1.26,1.06], middle:[1.36,1.26,1.06], ring:[1.36,1.26,1.06], pinky:[0,0,0]}}, base:null },
    K:{ name:'K', desc:'Índice arriba · medio diagonal · pulgar entre ellos', bimanual:false,
      dom:{ hx:0,hy:0,hz:0, f:{ thumb:[0.55,0.28,0.18], index:[0,0,0], middle:[0.35,0.10,0.05], ring:[1.36,1.26,1.06], pinky:[1.30,1.20,1.00]}}, base:null },
    L:{ name:'L', desc:'Índice arriba · pulgar extendido · L lateral', bimanual:false,
      dom:{ hx:0,hy:0,hz:0, f:{ thumb:[-0.04,0,0], index:[0,0,0], middle:[1.36,1.26,1.06], ring:[1.36,1.26,1.06], pinky:[1.30,1.20,1.00]}}, base:null },
    M:{ name:'M', desc:'Tres dedos doblados sobre pulgar · puño M', bimanual:false,
      dom:{ hx:0,hy:0,hz:0, f:{ thumb:[0.48,0.20,0.10], index:[1.30,0.40,0.32], middle:[1.32,0.42,0.34], ring:[1.32,0.42,0.34], pinky:[1.44,1.34,1.18]}}, base:null },
    N:{ name:'N', desc:'Dos dedos doblados sobre pulgar · puño N', bimanual:false,
      dom:{ hx:0,hy:0,hz:0, f:{ thumb:[0.48,0.20,0.10], index:[1.30,0.40,0.32], middle:[1.32,0.42,0.34], ring:[1.50,1.40,1.26], pinky:[1.44,1.34,1.18]}}, base:null },
    O:{ name:'O', desc:'Todos los dedos forman un círculo O', bimanual:false,
      dom:{ hx:0,hy:0.10,hz:0, f:{ thumb:[0.68,0.36,0.22], index:[0.82,0.66,0.48], middle:[0.86,0.70,0.52], ring:[0.82,0.66,0.48], pinky:[0.72,0.56,0.42]}}, base:null },
    P:{ name:'P', desc:'Como K pero apuntando hacia abajo', bimanual:false,
      dom:{ hx:0.65,hy:0,hz:0, f:{ thumb:[0.55,0.28,0.18], index:[0,0,0], middle:[0.35,0.10,0.05], ring:[1.36,1.26,1.06], pinky:[1.30,1.20,1.00]}}, base:null },
    Q:{ name:'Q', desc:'Índice y pulgar apuntan hacia abajo', bimanual:false,
      dom:{ hx:0.80,hy:0,hz:0, f:{ thumb:[-0.04,0,0], index:[0,0,0], middle:[1.36,1.26,1.06], ring:[1.36,1.26,1.06], pinky:[1.30,1.20,1.00]}}, base:null },
    R:{ name:'R', desc:'Índice y medio cruzados', bimanual:false,
      dom:{ hx:0,hy:0,hz:0, f:{ thumb:[0.86,0.12,0], index:[0,0.04,0], middle:[-0.04,0.05,0], ring:[1.36,1.26,1.06], pinky:[1.30,1.20,1.00]}}, base:null },
    RR:{ name:'RR', desc:'Índice extendido ambas manos · dígrafos LSM', bimanual:true, baseDesc:'Base: índice extendido de soporte',
      dom:{ hx:0,hy:-0.15,hz:0.10, f:{ thumb:[0.86,0.12,0], index:[0,0,0], middle:[1.36,1.26,1.06], ring:[1.36,1.26,1.06], pinky:[1.30,1.20,1.00]}},
      base:{ hx:0,hy:0.15,hz:-0.08, f:{ thumb:[0.86,0.12,0], index:[0,0,0], middle:[1.36,1.26,1.06], ring:[1.36,1.26,1.06], pinky:[1.30,1.20,1.00]}} },
    S:{ name:'S', desc:'Puño cerrado · pulgar sobre nudillos', bimanual:false,
      dom:{ hx:0,hy:0,hz:0, f:{ thumb:[0.35,0.10,0.05], index:[1.50,1.40,1.26], middle:[1.52,1.42,1.28], ring:[1.50,1.40,1.26], pinky:[1.44,1.34,1.18]}}, base:null },
    T:{ name:'T', desc:'Pulgar entre índice y medio · puño', bimanual:false,
      dom:{ hx:0,hy:0,hz:0, f:{ thumb:[0.48,0.20,0.10], index:[1.40,0.44,0.34], middle:[1.50,1.40,1.26], ring:[1.50,1.40,1.26], pinky:[1.44,1.34,1.18]}}, base:null },
    U:{ name:'U', desc:'Índice y medio extendidos juntos · palma adelante', bimanual:false,
      dom:{ hx:0,hy:0,hz:0, f:{ thumb:[0.86,0.12,0], index:[0,0,0], middle:[0,0,0], ring:[1.36,1.26,1.06], pinky:[1.30,1.20,1.00]}}, base:null },
    V:{ name:'V', desc:'Índice y medio en V separados · victoria', bimanual:false,
      dom:{ hx:0,hy:0,hz:0, f:{ thumb:[0.86,0.12,0], index:[0,0,-0.05], middle:[0,0,-0.05], ring:[1.36,1.26,1.06], pinky:[1.30,1.20,1.00]}}, base:null },
    W:{ name:'W', desc:'Índice, medio y anular extendidos', bimanual:false,
      dom:{ hx:0,hy:0,hz:0, f:{ thumb:[0.86,0.15,0.05], index:[0,0,-0.06], middle:[0,0,0], ring:[0,0,0.06], pinky:[1.30,1.20,1.00]}}, base:null },
    X:{ name:'X', desc:'Índice curvado en gancho · demás en puño', bimanual:false,
      dom:{ hx:0,hy:0,hz:0, f:{ thumb:[0.86,0.12,0], index:[0.65,0.85,0.65], middle:[1.36,1.26,1.06], ring:[1.36,1.26,1.06], pinky:[1.30,1.20,1.00]}}, base:null },
    Y:{ name:'Y', desc:'Pulgar y meñique extendidos · shaka', bimanual:false,
      dom:{ hx:0,hy:0,hz:0, f:{ thumb:[-0.04,0,0], index:[1.36,1.26,1.06], middle:[1.36,1.26,1.06], ring:[1.36,1.26,1.06], pinky:[0,0,0]}}, base:null },
    Z:{ name:'Z', desc:'Índice extendido · traza Z en el aire', bimanual:false,
      dom:{ hx:0,hy:0.10,hz:0, f:{ thumb:[0.86,0.15,0.05], index:[0,0,0], middle:[1.36,1.26,1.06], ring:[1.36,1.26,1.06], pinky:[1.30,1.20,1.00]}}, base:null },
    // Dígrafos
    CH:{ name:'CH', desc:'Dígrafo: dominante C · base H paralela', bimanual:true, baseDesc:'Base: índice y medio extendidos (H)',
      dom:{ hx:0,hy:0.15,hz:0, f:{ thumb:[0.48,0.10,0.05], index:[0.70,0.50,0.30], middle:[0.74,0.54,0.34], ring:[0.70,0.50,0.30], pinky:[0.60,0.42,0.26]}},
      base:{ hx:-0.20,hy:0,hz:0, f:{ thumb:[0.86,0.12,0], index:[0,0,0], middle:[0,0,0], ring:[1.36,1.26,1.06], pinky:[1.30,1.20,1.00]}} },
    LL:{ name:'LL', desc:'Dígrafo: dos manos en L espejo', bimanual:true, baseDesc:'Base: también configuración L',
      dom:{ hx:0,hy:0,hz:0, f:{ thumb:[-0.04,0,0], index:[0,0,0], middle:[1.36,1.26,1.06], ring:[1.36,1.26,1.06], pinky:[1.30,1.20,1.00]}},
      base:{ hx:0,hy:0,hz:0, f:{ thumb:[-0.04,0,0], index:[0,0,0], middle:[1.36,1.26,1.06], ring:[1.36,1.26,1.06], pinky:[1.30,1.20,1.00]}} },
    // Frases
    HOLA:     { name:'Hola',      desc:'Mano abierta · saludo al lado de la sien', bimanual:false, dom:{ hx:-0.10,hy:0.22,hz:0.12, f:{ thumb:[0,0,0], index:[0,0,0], middle:[0,0,0], ring:[0,0,0], pinky:[0,0,0]}}, base:null },
    GRACIAS:  { name:'Gracias',   desc:'Mano plana sale del mentón hacia adelante', bimanual:false, dom:{ hx:-0.35,hy:0.16,hz:0.08, f:{ thumb:[0.06,0,0], index:[0.03,0,0], middle:[0.03,0,0], ring:[0.03,0,0], pinky:[0.03,0,0]}}, base:null },
    SI:       { name:'Sí',        desc:'Puño · movimiento afirmativo arriba-abajo', bimanual:false, dom:{ hx:0.22,hy:0,hz:0, f:{ thumb:[0.35,0.10,0.05], index:[1.50,1.40,1.26], middle:[1.52,1.42,1.28], ring:[1.50,1.40,1.26], pinky:[1.44,1.34,1.18]}}, base:null },
    NO:       { name:'No',        desc:'Índice y medio cierran contra pulgar extendido', bimanual:false, dom:{ hx:0,hy:0,hz:0, f:{ thumb:[0.58,0.26,0.16], index:[0,0.60,0.50], middle:[0,0.60,0.50], ring:[1.36,1.26,1.06], pinky:[1.30,1.20,1.00]}}, base:null },
    AYUDA:    { name:'Ayuda',     desc:'Puño sobre palma abierta · ambas suben', bimanual:true, baseDesc:'Base: palma abierta hacia arriba como plataforma',
      dom:{ hx:-0.15,hy:0.10,hz:0, f:{ thumb:[0.32,0.10,0.05], index:[1.40,1.30,1.16], middle:[1.42,1.32,1.18], ring:[1.40,1.30,1.16], pinky:[1.36,1.26,1.10]}},
      base:{ hx:-0.40,hy:0,hz:0, f:{ thumb:[0.05,0,0], index:[0.03,0,0], middle:[0.03,0,0], ring:[0.03,0,0], pinky:[0.03,0,0]}} },
    POR_FAVOR:  { name:'Por favor',  desc:'Palma en círculo sobre el pecho', bimanual:false, dom:{ hx:-0.30,hy:0,hz:0, f:{ thumb:[0.05,0,0], index:[0.03,0,0], middle:[0.03,0,0], ring:[0.03,0,0], pinky:[0.03,0,0]}}, base:null },
    EMERGENCIA: { name:'Emergencia', desc:'Puños cruzados frente al pecho', bimanual:true, baseDesc:'Ambas manos en puño · cruzan frente al cuerpo',
      dom:{ hx:-0.15,hy:-0.25,hz:0.20, f:{ thumb:[0.35,0.10,0.05], index:[1.50,1.40,1.26], middle:[1.52,1.42,1.28], ring:[1.50,1.40,1.26], pinky:[1.44,1.34,1.18]}},
      base:{ hx:-0.15,hy:0.25,hz:-0.20, f:{ thumb:[0.35,0.10,0.05], index:[1.50,1.40,1.26], middle:[1.52,1.42,1.28], ring:[1.50,1.40,1.26], pinky:[1.44,1.34,1.18]}} },
    // Ñ
    '\u00D1':{ name:'Ñ', desc:'Como N con vibración · dedo índice y medio', bimanual:false,
      dom:{ hx:0,hy:0,hz:0, f:{ thumb:[0.48,0.20,0.10], index:[1.30,0.40,0.32], middle:[1.32,0.42,0.34], ring:[1.50,1.40,1.26], pinky:[1.44,1.34,1.18]}}, base:null },
  };

  const NEUTRAL = {
    hx:0, hy:0, hz:0,
    f:{ thumb:[0,0,0], index:[0.12,0.08,0.04], middle:[0.12,0.08,0.04], ring:[0.12,0.08,0.04], pinky:[0.12,0.08,0.04] }
  };

  /* 10d. Sistema de animación */
  const ANIM_DUR = 380;
  let animState = {
    dom:  { from:NEUTRAL, to:NEUTRAL, start:null, done:true },
    base: { from:NEUTRAL, to:NEUTRAL, start:null, done:true },
  };

  function capHand(handObj) {
    const result = { hx:handObj.wristGroup.rotation.x, hy:handObj.wristGroup.rotation.y, hz:handObj.wristGroup.rotation.z, f:{} };
    ['thumb','index','middle','ring','pinky'].forEach(fn => {
      result.f[fn] = handObj.fingers[fn].map(ph => ph.rotation.x);
    });
    return result;
  }

  function applyLerp(handObj, fromPose, toPose, t) {
    const e = t < 0.5 ? 2*t*t : -1+(4-2*t)*t; // ease in-out
    handObj.wristGroup.rotation.x = fromPose.hx + (toPose.hx - fromPose.hx) * e;
    handObj.wristGroup.rotation.y = fromPose.hy + (toPose.hy - fromPose.hy) * e;
    handObj.wristGroup.rotation.z = fromPose.hz + (toPose.hz - fromPose.hz) * e;
    ['thumb','index','middle','ring','pinky'].forEach(fn => {
      if (!toPose.f[fn]) return;
      handObj.fingers[fn].forEach((ph, pi) => {
        const a = fromPose.f[fn] ? fromPose.f[fn][pi] : 0;
        const b = toPose.f[fn][pi] !== undefined ? toPose.f[fn][pi] : 0;
        ph.rotation.x = a + (b - a) * e;
      });
    });
  }

  /* 10e. Disparar seña */
  let active3dCell = null;
  const shortMap = { HOLA:'👋', GRACIAS:'🙏', SI:'👍', NO:'🤚', AYUDA:'🆘', POR_FAVOR:'🙏', EMERGENCIA:'🚨' };

  function triggerSign(key) {
    const pose = POSES[key];
    if (!pose) return;

    animState.dom  = { from:capHand(handDom),  to:pose.dom,  start:performance.now(), done:false };
    const baseTarget = (pose.bimanual && pose.base) ? pose.base : NEUTRAL;
    animState.base = { from:capHand(handBase), to:baseTarget, start:performance.now(), done:false };

    domTargetY  = -0.15;
    baseTargetY = pose.bimanual ? -0.15 : -0.38;

    // Actualizar etiqueta
    const displayLt = (key.length <= 2) ? key : (shortMap[key] || key[0]);
    const letterEl = document.getElementById('lLetter');
    const nameEl   = document.getElementById('lName');
    const descEl   = document.getElementById('lDesc');
    const indEl    = document.getElementById('handInd');
    if (letterEl) letterEl.textContent = displayLt;
    if (nameEl)   nameEl.innerHTML = pose.name + '<span class="lsm-cursor"></span>';
    if (descEl)   descEl.textContent = pose.desc;
    if (indEl) {
      indEl.innerHTML = pose.bimanual
        ? `<span class="hi dom">✋ Dominante</span><span class="hi bas">🤚 Base: ${pose.baseDesc || 'soporte'}</span>`
        : `<span class="hi dom">✋ Dominante activa</span><span class="hi off">Base: relajada</span>`;
    }

    // Celda activa en el grid 3D
    if (active3dCell) active3dCell.classList.remove('on');
    const cell = document.getElementById('ac_' + key);
    if (cell) { cell.classList.add('on'); active3dCell = cell; }
    document.querySelectorAll('.lsm-fb,.lsm-ac2').forEach(b => b.classList.remove('on'));
    const fb = document.getElementById('fb_' + key);
    if (fb) fb.classList.add('on');
    const sp = document.getElementById('sp_' + key);
    if (sp) sp.classList.add('on');
  }

  // Exponer triggerSign globalmente para que showSign() del avatar simple pueda llamarla
  window.triggerSign = triggerSign;

  /* 10f. Construcción del UI 3D */
  const EMOJIS = { A:'✊',B:'🖐',C:'🤙',D:'☝️',E:'🤛',F:'👌',G:'👈',H:'✌️',I:'🤙',J:'🤙',K:'✌️',L:'🤙',M:'✊',N:'✊',O:'👐',P:'🤞',Q:'👇',R:'🤞',S:'✊',T:'✊',U:'✌️',V:'✌️',W:'🖖',X:'☝️',Y:'🤙',Z:'☝️' };

  const alphaGrid = document.getElementById('alphaGrid');
  if (alphaGrid) {
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(lt => {
      const c = document.createElement('div');
      c.className = 'lsm-ac'; c.id = 'ac_' + lt;
      c.innerHTML = `<span class="em">${EMOJIS[lt]||'🤟'}</span><span class="lt">${lt}</span>`;
      c.onclick = () => triggerSign(lt);
      alphaGrid.appendChild(c);
    });
  }

  const specialGrid = document.getElementById('specialGrid');
  if (specialGrid) {
    specialGrid.innerHTML = '<span class="lsm-ag2-lbl">LSM:</span>';
    [['Ñ','ñ'],['RR','rr'],['CH','ch'],['LL','ll']].forEach(pair => {
      const b = document.createElement('div');
      b.className = 'lsm-ac2'; b.id = 'sp_' + pair[0];
      b.textContent = pair[1];
      b.onclick = () => triggerSign(pair[0]);
      specialGrid.appendChild(b);
    });
  }

  const phraseRow = document.getElementById('phraseRow');
  if (phraseRow) {
    [['HOLA','👋 Hola'],['GRACIAS','🙏 Gracias'],['SI','👍 Sí'],['NO','🤚 No'],
     ['AYUDA','🆘 Ayuda'],['POR_FAVOR','🙏 Por favor'],['EMERGENCIA','🚨 Emergencia']
    ].forEach(pair => {
      const b = document.createElement('button');
      b.className = 'lsm-fb'; b.id = 'fb_' + pair[0];
      b.textContent = pair[1];
      b.onclick = () => triggerSign(pair[0]);
      phraseRow.appendChild(b);
    });
  }

  /* 10g. Deletrear palabra */
  let spellQueue   = [];
  let spellTimer   = null;
  let signInterval = 1000;

  function spellWord() {
    const raw = (document.getElementById('lsmInput')?.value || '').toUpperCase().trim();
    if (!raw) return;
    clearTimeout(spellTimer);
    const tokens = [];
    let i = 0;
    while (i < raw.length) {
      if (i + 1 < raw.length) {
        const dg = raw[i] + raw[i+1];
        if (dg === 'CH' || dg === 'LL' || dg === 'RR') { tokens.push(dg); i += 2; continue; }
        if (raw[i] === 'N' && raw[i+1] === '~')         { tokens.push('Ñ'); i += 2; continue; }
      }
      if (POSES[raw[i]]) tokens.push(raw[i]);
      i++;
    }
    spellQueue = tokens.slice();
    nextSpell();
  }
  window.spellWord = spellWord;

  function nextSpell() {
    if (!spellQueue.length) return;
    triggerSign(spellQueue.shift());
    spellTimer = setTimeout(nextSpell, signInterval);
  }

  function clearAll() {
    clearTimeout(spellTimer);
    spellQueue = [];
    const inp = document.getElementById('lsmInput');
    if (inp) inp.value = '';
    if (active3dCell) { active3dCell.classList.remove('on'); active3dCell = null; }
    document.querySelectorAll('.lsm-fb,.lsm-ac2').forEach(b => b.classList.remove('on'));
    const letterEl = document.getElementById('lLetter');
    const nameEl   = document.getElementById('lName');
    const descEl   = document.getElementById('lDesc');
    const indEl    = document.getElementById('handInd');
    if (letterEl) letterEl.textContent = '🤟';
    if (nameEl)   nameEl.innerHTML  = 'Toca una letra<span class="lsm-cursor"></span>';
    if (descEl)   descEl.textContent = '27 letras LSM + frases · mano dominante + base';
    if (indEl)    indEl.innerHTML   = '<span class="hi dom">✋ Dominante</span><span class="hi bas">🤚 Base</span>';
    animState.dom  = { from:capHand(handDom),  to:NEUTRAL, start:performance.now(), done:false };
    animState.base = { from:capHand(handBase), to:NEUTRAL, start:performance.now(), done:false };
    domTargetY  = -0.15;
    baseTargetY = -0.38;
  }
  window.clearAll = clearAll;
  window.clearLSM = clearAll;   // alias — el HTML llama clearLSM()

  /* 10h. Control de velocidad */
  function setSpd(v) {
    signInterval = parseInt(v);
    const labels = { 300:'Rápido', 600:'Ágil', 1000:'Normal', 1400:'Lento', 1800:'Muy lento' };
    const k = Object.keys(labels).reduce((a, b) => Math.abs(b-v) < Math.abs(a-v) ? b : a);
    const sv1 = document.getElementById('spdVal');       // id original lsm_v4
    const sv2 = document.getElementById('lsmSpeedVal'); // id en index.html integrado
    if (sv1) sv1.textContent = labels[k];
    if (sv2) sv2.textContent = labels[k];
  }
  window.setSpd    = setSpd;
  window.setLSMSpd = setSpd;   // alias — el HTML llama setLSMSpd()

  /* 10i. Partículas de fondo */
  const particles = [];
  for (let pi = 0; pi < 18; pi++) {
    const pm = new THREE.Mesh(
      new THREE.SphereGeometry(0.007, 4, 4),
      new THREE.MeshBasicMaterial({ color:0x0D9488, transparent:true, opacity:Math.random()*0.28+0.04 })
    );
    pm.position.set((Math.random()-0.5)*2, (Math.random()-0.5)*1.8, (Math.random()-0.5)*0.6-0.3);
    pm.userData.spd = Math.random()*0.003+0.001;
    pm.userData.ph  = Math.random()*Math.PI*2;
    scene.add(pm);
    particles.push(pm);
  }

  /* 10j. Loop de renderizado */
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    ['dom','base'].forEach(side => {
      const st   = animState[side];
      const hObj = (side === 'dom') ? handDom : handBase;
      if (!st.done && st.start !== null) {
        const prog = Math.min((performance.now() - st.start) / ANIM_DUR, 1);
        applyLerp(hObj, st.from, st.to, prog);
        if (prog >= 1) st.done = true;
      }
    });

    // Respiración idle
    const br = Math.sin(elapsed * 1.15) * 0.012;
    if (animState.dom.done)  { handDom.wristGroup.rotation.x  += (br - handDom.wristGroup.rotation.x  * 0.008) * 0.06; handDom.wristGroup.rotation.y  += (Math.sin(elapsed*0.65)*0.010 - handDom.wristGroup.rotation.y  * 0.006) * 0.05; }
    if (animState.base.done) { handBase.wristGroup.rotation.x += (br - handBase.wristGroup.rotation.x * 0.008) * 0.06; handBase.wristGroup.rotation.y += (Math.sin(elapsed*0.55)*0.010 - handBase.wristGroup.rotation.y * 0.006) * 0.05; }

    // Flotación
    const flt = Math.sin(elapsed * 1.2) * 0.012;
    handDom.rootGroup.position.y  += (domTargetY  + flt     - handDom.rootGroup.position.y)  * 0.08;
    handBase.rootGroup.position.y += (baseTargetY + flt*0.7 - handBase.rootGroup.position.y) * 0.07;
    handDom.rootGroup.rotation.z   = Math.sin(elapsed * 0.48) * 0.010;
    handBase.rootGroup.rotation.z  = -Math.sin(elapsed * 0.52) * 0.010;

    // Partículas
    particles.forEach(p => {
      p.position.y += p.userData.spd;
      p.material.opacity = (Math.sin(elapsed * 0.6 + p.userData.ph) + 1) * 0.13;
      if (p.position.y > 1.5) p.position.y = -1.5;
    });

    renderer.render(scene, camera);
  }

  animate();
  // Mostrar seña inicial al cargar
  setTimeout(() => triggerSign('HOLA'), 300);
}


/* ============================================================
   11. AUTO DEMO
   ============================================================ */
function autoFlow() {
  clearInterval(autoInt);
  const steps  = [0,1,2,3,4,5,6,7,8,9,10,12,13,14];
  const delays = [0,2500,2000,9000,4000,3000,3500,3000,3000,3000,4000,3000,3000,3000];
  let total = 0;
  steps.forEach((s, i) => { total += delays[i]; setTimeout(() => go(s), total); });
}


/* ============================================================
   INICIALIZACIÓN GENERAL
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  go(0);
  initBlindRecognition();
  initDeafRecognition();
  initTranscribeRecognition();
});
