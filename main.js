(() => {
  const $ = (s) => document.querySelector(s);
  const intro = $('#intro'), video = $('#transition'), dash = $('#dashboard'),
        loader = $('#loader'), fade = $('#fade'), toast = $('#toast'),
        settings = $('#settings'), stage = $('#stage');

  // ---------- settings (persisted) ----------
  const defaults = { volume: 0.8, motion: true, skip: false };
  let opts = { ...defaults };
  try { opts = { ...defaults, ...JSON.parse(localStorage.getItem('orbital2') || '{}') }; } catch {}
  const save = () => { try { localStorage.setItem('orbital2', JSON.stringify(opts)); } catch {} };
  const $vol = $('#optVolume'), $mot = $('#optMotion'), $skip = $('#optSkip');
  $vol.value = opts.volume; $mot.checked = opts.motion; $skip.checked = opts.skip;
  const applyMotion = () => document.body.classList.toggle('no-motion', !opts.motion);
  applyMotion();
  const $volVal = $('#volVal');
  const showVol = () => { $volVal.textContent = Math.round(opts.volume * 100) + '%'; };
  showVol();
  $vol.oninput  = () => { opts.volume = +$vol.value; showVol(); save(); };
  $mot.onchange = () => { opts.motion = $mot.checked; applyMotion(); save(); };
  $skip.onchange = () => { opts.skip = $skip.checked; save(); };

  // ---------- tiny UI sounds (WebAudio, no files needed) ----------
  let ac;
  const blip = (f = 880, d = 0.06, v = 0.05) => {
    if (opts.volume === 0) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = 'square'; o.frequency.value = f;
      g.gain.setValueAtTime(v * opts.volume, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + d);
      o.connect(g).connect(ac.destination); o.start(); o.stop(ac.currentTime + d);
    } catch {}
  };

  // ---------- preload everything so nothing hitches ----------
  const loadImg = (src) => new Promise((res) => {
    const i = new Image(); i.onload = i.onerror = () => (i.decode ? i.decode().catch(()=>{}).then(res) : res()); i.src = src;
  });
  const loadVideo = () => new Promise((res) => {
    if (video.readyState >= 4) return res();
    video.addEventListener('canplaythrough', res, { once: true });
    video.addEventListener('error', res, { once: true });
    setTimeout(res, 6000); // never block forever
    video.load();
  });

  // real progress: two images (all-or-nothing) + the video's buffered fraction
  let state = 'loading';
  const ldBar = $('#ldBar'), ldPct = $('#ldPct'), ldMsg = $('#ldMsg');
  const part = [0, 0, 0];
  const paint = () => {
    const p = Math.round(part.reduce((a, b) => a + b, 0) / part.length * 100);
    ldBar.style.width = p + '%'; ldPct.textContent = p + '%';
  };
  video.addEventListener('progress', () => {
    if (!video.duration || !video.buffered.length) return;
    part[2] = Math.max(part[2], Math.min(1, video.buffered.end(video.buffered.length - 1) / video.duration)); paint();
  });
  Promise.all([
    loadImg('assets/intro.png').then(() => { part[0] = 1; paint(); }),
    loadImg('assets/dashboard.png').then(() => { part[1] = 1; paint(); }),
    loadVideo().then(() => { part[2] = 1; paint(); }),
  ]).then(() => {
    ldMsg.textContent = 'READY';
    setTimeout(() => { state = 'intro'; loader.classList.add('done'); }, 400);
  });

  // ---------- intro -> transition -> dashboard ----------
  function start() {
    if (state !== 'intro') return;
    state = 'transition';
    blip(520, .12, .07); setTimeout(() => blip(1040, .1, .05), 90);

    const goDash = () => {
      if (state === 'dashboard') return;
      state = 'dashboard';
      dash.removeAttribute('aria-hidden');
      dash.classList.add('live');
      startDust();
      setTimeout(() => { const f = $('#menu .hud-btn'); f && !dash.contains(document.activeElement) && f.focus({ preventScroll: true }); }, 900);
      video.classList.add('fadeout');            // cross-fade video -> dashboard
      setTimeout(() => { video.classList.remove('show','fadeout'); video.pause(); }, 800);
    };

    if (opts.skip) {                              // dip-to-black shortcut
      fade.classList.add('on');
      setTimeout(() => { intro.classList.add('out'); goDash(); fade.classList.remove('on'); }, 460);
      return;
    }

    video.currentTime = 0;
    video.muted = false; video.volume = opts.volume;
    const p = video.play();
    const run = () => {
      video.classList.add('show');                // fade video in over intro
      intro.classList.add('out');
      // start the dashboard cross-fade a touch early so the cut is seamless
      const early = () => {
        if (video.duration && video.currentTime >= video.duration - 0.45) { goDash(); return; }
        if (state === 'transition') requestAnimationFrame(early);
      };
      requestAnimationFrame(early);
    };
    video.addEventListener('ended', goDash, { once: true });
    video.addEventListener('error', goDash, { once: true });
    if (p && p.then) p.then(run).catch(() => { video.muted = true; video.play().then(run).catch(goDash); });
    else run();
  }

  const isModifier = (e) => ['Shift','Control','Alt','Meta','CapsLock','Tab','F5','F12'].includes(e.key) || e.ctrlKey || e.metaKey;
  window.addEventListener('keydown', (e) => { if (state === 'intro' && !isModifier(e)) { e.preventDefault(); start(); } });
  window.addEventListener('pointerdown', () => { if (state === 'intro') start(); });
  window.addEventListener('gamepadconnected', () => {});
  (function padPoll() {                             // gamepad "any button"
    if (state === 'intro' || state === 'loading') {
      const pads = navigator.getGamepads ? navigator.getGamepads() : [];
      for (const p of pads) if (p && p.buttons.some((b) => b.pressed)) { start(); break; }
    }
    requestAnimationFrame(padPoll);
  })();

  // ---------- dashboard menu ----------
  const say = (msg) => {
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(say.t); say.t = setTimeout(() => toast.classList.remove('show'), 2200);
  };
  const menuBtn = (a) => $(`#menu [data-action="${a}"]`);
  const refocus = (a) => { const b = menuBtn(a); b && b.focus({ preventScroll: true }); };
  const openSettings = () => { settings.hidden = false; requestAnimationFrame(() => settings.classList.add('show')); $vol.focus(); };
  const closeSettings = () => { settings.classList.remove('show'); setTimeout(() => (settings.hidden = true), 350); refocus('settings'); };
  const infoEl = $('#info');
  const openInfo = () => { infoEl.hidden = false; requestAnimationFrame(() => { infoEl.classList.add('show'); infoEl.querySelector('button').focus({ preventScroll: true }); }); };
  const closeInfo = () => { infoEl.classList.remove('show'); setTimeout(() => (infoEl.hidden = true), 350); refocus('info'); };

  // ---------- levels ----------
  // Add more missions here later. Names for 002/003 are placeholders.
  const LEVELS = [
    { id: 1, code: 'MISSION 001', name: 'ASTEROID RECONNAISSANCE' },
    { id: 2, code: 'MISSION 002', name: 'CLASSIFIED' },
    { id: 3, code: 'MISSION 003', name: 'CLASSIFIED' },
  ];
  const levelsEl = $('#levels'), listEl = $('#levelList');
  let progress = { cleared: 0 };           // number of missions cleared; next one is unlocked
  try { progress = { ...progress, ...JSON.parse(localStorage.getItem('orbital2_progress') || '{}') }; } catch {}
  const saveProgress = () => { try { localStorage.setItem('orbital2_progress', JSON.stringify(progress)); } catch {} };

  const hasStory = (id) => !!(window.MISSIONS && window.MISSIONS[id]);
  function renderLevels() {
    listEl.innerHTML = LEVELS.map((l) => {
      const soon = !hasStory(l.id);
      const locked = soon || l.id > progress.cleared + 1, done = l.id <= progress.cleared;
      const tag = soon ? 'COMING SOON' : locked ? '<i class="lock"></i>LOCKED' : done ? 'CLEARED' : 'AVAILABLE';
      return `<button class="level${locked ? ' locked' : ''}${done ? ' done' : ''}" data-level="${l.id}" ${locked ? 'aria-disabled="true"' : ''}>
        <span class="num">${String(l.id).padStart(2, '0')}</span>
        <span class="info"><span class="code">${l.code}</span><span class="name">${locked ? 'CLASSIFIED' : l.name}</span></span>
        <span class="tag">${tag}</span>
      </button>`;
    }).join('');
  }
  const openLevels = () => { renderLevels(); dash.classList.add('levels-open'); levelsEl.hidden = false; requestAnimationFrame(() => requestAnimationFrame(() => levelsEl.classList.add('show')));
    const first = listEl.querySelector('.level:not(.locked)'); first && first.focus({ preventScroll: true }); };
  const closeLevels = () => { dash.classList.remove('levels-open'); levelsEl.classList.remove('show'); setTimeout(() => (levelsEl.hidden = true), 450); refocus('play'); };

  // Call from the game when a mission is finished: Orbital.completeLevel(1)
  window.Orbital = { blip, volume: () => opts.volume, completeLevel(id) {
    if (id === progress.cleared + 1 && id <= LEVELS.length) { progress.cleared = id; saveProgress(); renderLevels(); }
  }, resetProgress() { progress.cleared = 0; saveProgress(); renderLevels(); } };

  listEl.addEventListener('click', (e) => {
    const b = e.target.closest('.level'); if (!b) return;
    const id = +b.dataset.level;
    if (!window.VN || !hasStory(id)) { blip(160, .15, .07); say('CURRENTLY UNDER DEVELOPMENT // COMING SOON'); return; }
    if (b.classList.contains('locked')) { blip(160, .15, .07); say('LOCKED // CLEAR PREVIOUS MISSION'); return; }
    blip(760, .08, .06);
    if (window.VN && window.MISSIONS && window.MISSIONS[id]) {
      VN.start(id, {
        onComplete: () => Orbital.completeLevel(id),   // unlocks the next mission
        onExit: () => { renderLevels(); const f = listEl.querySelector('.level:not(.locked):last-child, .level:not(.locked)'); f && f.focus({ preventScroll: true }); },
      });
    }
  });
  listEl.addEventListener('pointerover', (e) => { const b = e.target.closest('.level:not(.locked)'); if (b && !b.contains(e.relatedTarget)) blip(1320, .03, .025); });

  dash.addEventListener('click', (e) => {
    const b = e.target.closest('[data-action]'); if (!b) return;
    blip(760, .08, .06);
    ({ play: openLevels, closeLevels,
       settings: openSettings, close: closeSettings,
       info: openInfo, closeInfo }[b.dataset.action] || (() => {}))();
  });
  dash.querySelectorAll('.hud-btn').forEach((b) => b.addEventListener('pointerenter', () => blip(1320, .03, .025)));
  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || (window.VN && VN.isActive())) return;
    if (!infoEl.hidden) closeInfo(); else if (!settings.hidden) closeSettings(); else if (!levelsEl.hidden) closeLevels();
  });

  // ---------- keyboard navigation (up/down moves between controls in the open layer) ----------
  window.addEventListener('keydown', (e) => {
    if (state !== 'dashboard' || (window.VN && VN.isActive())) return;
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const scope = !infoEl.hidden ? infoEl : !settings.hidden ? settings : !levelsEl.hidden ? levelsEl : $('#menu');
    const items = [...scope.querySelectorAll('button, input')];
    if (!items.length) return;
    e.preventDefault();
    const i = items.indexOf(document.activeElement), d = e.key === 'ArrowDown' ? 1 : -1;
    items[i < 0 ? (d > 0 ? 0 : items.length - 1) : (i + d + items.length) % items.length].focus({ preventScroll: true });
  });

  // ---------- parallax on the dashboard background ----------
  let tx = 0, ty = 0, cx = 0, cy = 0;
  stage.addEventListener('pointermove', (e) => {
    const r = stage.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width - .5) * -2; ty = ((e.clientY - r.top) / r.height - .5) * -2;
  });
  const dashBg = $('#dashBg'), introBg = $('#introBg');
  (function par() {
    cx += (tx - cx) * .06; cy += (ty - cy) * .06;
    if (opts.motion) {
      dashBg.style.translate = `${cx * 10}px ${cy * 6}px`;
      introBg.style.translate = `${cx * 6}px ${cy * 4}px`;
    }
    requestAnimationFrame(par);
  })();

  // ---------- floating dust / star particles ----------
  const cv = $('#dust'), ctx = cv.getContext('2d');
  let parts = [], running = false;
  function sizeCanvas() {
    const r = stage.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
    cv.width = r.width * d; cv.height = r.height * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    parts = Array.from({ length: Math.round(r.width / 14) }, () => ({
      x: Math.random() * r.width, y: Math.random() * r.height,
      z: Math.random() * .8 + .2, s: Math.random() * 1.4 + .3, p: Math.random() * 6.28 }));
  }
  function startDust() {
    if (running) return; running = true; sizeCanvas();
    let last = performance.now();
    (function tick(t) {
      const dt = Math.min((t - last) / 16.7, 3); last = t;
      const w = cv.clientWidth, h = cv.clientHeight;
      ctx.clearRect(0, 0, w, h);
      for (const q of parts) {
        q.x += .18 * q.z * dt; q.y -= .05 * q.z * dt;
        if (q.x > w) q.x = 0; if (q.y < 0) q.y = h;
        const a = (.25 + .5 * Math.abs(Math.sin(t / 1200 + q.p))) * q.z;
        ctx.fillStyle = `rgba(150,225,255,${a})`;
        ctx.beginPath(); ctx.arc(q.x, q.y, q.s * q.z, 0, 6.283); ctx.fill();
      }
      requestAnimationFrame(tick);
    })(last);
  }
  addEventListener('resize', () => running && sizeCanvas());
})();
