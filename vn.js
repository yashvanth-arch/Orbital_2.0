/* ORBITAL 2.0 — visual novel engine.
 * VN.start(missionId, { onExit, onComplete })
 * Step types (see story/mission001/story.js): title, bg, panel, say, choice, fail, success, end
 */
(() => {
  const root = document.getElementById('vn');
  const SPEED = 24;                       // ms per character
  const EXTS = ['png', 'jpg', 'jpeg', 'webp'];
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  let M = null, hooks = {}, imgs = {}, stack = [], mode = 'none', timer = null, typing = null,
      paused = false, active = false, curBgKey = null, choiceBg = null, retryPt = null,
      spr = { left: null, right: null }, speaker = null, session = 0, lastTick = 0, panelTimers = [];
  let ui = {};

  /* ---------------------------------------------------------------- assets */
  function loadImg(key) {
    if (key in imgs) return Promise.resolve(imgs[key]);
    const meta = M.images[key];
    return new Promise((res) => {
      if (!meta) { imgs[key] = null; return res(null); }
      let i = 0;
      const attempt = () => {
        if (i >= EXTS.length) { imgs[key] = null; return res(null); }
        const url = `${M.folder}/${meta.file}.${EXTS[i++]}`;
        const im = new Image();
        im.onload = () => { imgs[key] = url; (im.decode ? im.decode().catch(() => {}) : Promise.resolve()).then(() => res(url)); };
        im.onerror = attempt;
        im.src = url;
      };
      attempt();
    });
  }

  /* ----------------------------------------------------------------- build */
  function build() {
    root.innerHTML = '';
    ui.bgs = el('div', 'vn-bgs');
    ui.shade = el('div', 'vn-shade');
    ui.sprites = el('div', 'vn-sprites');
    ui.panel = el('div', 'vn-panel');
    ui.top = el('div', 'vn-top', `<span class="vn-tag">${esc(M.code)} <i>//</i> ${esc(M.name)}</span>`);
    ui.menuBtn = el('button', 'vn-mini', 'MENU <small>ESC</small>');
    ui.menuBtn.onclick = () => togglePause();
    ui.top.appendChild(ui.menuBtn);
    ui.box = el('div', 'vn-box', '<div class="vn-name"></div><p class="vn-text"></p><i class="vn-next">▼ <small>SPACE</small></i>');
    ui.name = ui.box.querySelector('.vn-name'); ui.text = ui.box.querySelector('.vn-text'); ui.next = ui.box.querySelector('.vn-next');
    ui.ov = el('div', 'vn-ov');                       // title / choice / fail / success / end
    ui.pause = el('div', 'vn-pause', `<div class="vn-card"><h2>PAUSED</h2>
      <button class="hud-btn small" data-p="resume"><span class="lbl">RESUME</span><span class="chev"></span></button>
      <button class="hud-btn small" data-p="exit"><span class="lbl">EXIT TO MISSIONS</span><span class="chev"></span></button></div>`);
    ui.pause.hidden = true;
    ui.pause.addEventListener('click', (e) => { const b = e.target.closest('[data-p]'); if (!b) return;
      b.dataset.p === 'resume' ? togglePause() : exit(); });
    ui.load = el('div', 'vn-load', `<div class="vn-load-in"><div class="t">LOADING ${esc(M.code)}</div><div class="n">${esc(M.name)}</div>
      <div class="bar"><b></b></div><div class="c">0 / 0</div><div class="m"></div></div>`);
    ui.fade = el('div', 'vn-fade');
    root.append(ui.bgs, ui.shade, ui.sprites, ui.panel, ui.top, ui.box, ui.ov, ui.pause, ui.load, ui.fade);
  }

  /* ------------------------------------------------------------ backgrounds */
  function setBg(key, keep) {
    curBgKey = key;
    const old = ui.bgs.lastElementChild;
    const layer = el('div', 'vn-bg');
    const url = imgs[key];
    if (url) { const p = el('div', 'pic'); p.style.backgroundImage = `url("${url}")`; layer.appendChild(p); }
    else {
      const meta = M.images[key] || { file: key, desc: '' };
      const hue = 200 + (Object.keys(M.images).indexOf(key) * 17) % 60;
      layer.innerHTML = `<div class="ph" style="--h:${hue}"><b>${esc(meta.file)}.png</b><span>${esc(meta.desc)}</span></div>`;
    }
    ui.bgs.appendChild(layer);
    void layer.offsetWidth;
    layer.classList.add('in');
    if (old) setTimeout(() => old.remove(), 1100);
    if (!keep) { clearSprites(); clearPanel(); }
  }

  /* ---------------------------------------------------------------- sprites */
  function clearSprites() {
    for (const side of ['left', 'right']) if (spr[side]) { const n = spr[side].node; n.classList.remove('in'); setTimeout(() => n.remove(), 450); spr[side] = null; }
  }
  function showSprite(who) {
    const c = M.chars[who]; if (!c || !c.sprite) return;
    const cur = spr[c.side];
    if (cur && cur.who === who) return;
    if (cur) { const n = cur.node; n.classList.remove('in'); setTimeout(() => n.remove(), 450); }
    const node = el('div', `spr ${c.side}`);
    const url = imgs[c.sprite];
    if (url) node.innerHTML = `<img src="${url}" alt="${esc(c.name)}">`;
    else node.innerHTML = `<div class="spr-ph" style="--c:${c.color}"><b>${esc(c.name)}</b><span>${esc(M.images[c.sprite].file)}.png</span></div>`;
    ui.sprites.appendChild(node);
    void node.offsetWidth; node.classList.add('in');
    spr[c.side] = { who, node };
  }
  function setSpeaker(who) {
    speaker = who; showSprite(who);
    for (const side of ['left', 'right']) if (spr[side]) spr[side].node.classList.toggle('dim', spr[side].who !== who);
  }

  /* ----------------------------------------------------------------- panels */
  function clearPanel() {
    panelTimers.forEach(clearTimeout); panelTimers = [];
    ui.panel.classList.remove('show');
  }
  function showPanel(p) {
    clearPanel();
    ui.panel.className = `vn-panel pos-${p.pos || 'center'}${p.wide ? ' wide' : ''}`;
    ui.panel.innerHTML = `<h3>${esc(p.title)}</h3>` + (p.note ? `<div class="note">${esc(p.note)}</div>` : '') +
      `<div class="rows">${p.rows.map((r) => `<div class="r${r[0] === 'Total' ? ' tot' : ''}"><span>${esc(r[0])}</span><b>${esc(r[1])}</b></div>`).join('')}</div>`;
    void ui.panel.offsetWidth; ui.panel.classList.add('show');
    ui.panel.querySelectorAll('.r').forEach((r, i) => panelTimers.push(setTimeout(() => r.classList.add('in'), 350 + i * 380)));
  }

  /* ----------------------------------------------------------------- dialogue */
  function tickSound() {
    const now = performance.now(); if (now - lastTick < 45) return; lastTick = now;
    window.Orbital && Orbital.blip && Orbital.blip(1500, .012, .01);
  }
  function showLine(s) {
    const c = M.chars[s.say] || { name: s.say, color: '#fff' };
    setSpeaker(s.say);
    ui.box.className = `vn-box show ${c.style || ''}`;
    ui.box.style.setProperty('--who', c.color);
    ui.name.innerHTML = esc(c.name) + (s.tag ? ` <em>// ${esc(s.tag)}</em>` : '');
    ui.text.textContent = ''; ui.next.classList.remove('on');
    const full = s.text, t0 = performance.now();
    let last = -1;
    typing = { full };
    const tick = (now) => {
      if (!typing) return;
      const n = Math.min(full.length, Math.floor((now - t0) / SPEED));
      if (n !== last) { ui.text.textContent = full.slice(0, n); if (n % 2 === 0) tickSound(); last = n; }
      if (n >= full.length) { typing = null; mode = 'line'; ui.next.classList.add('on'); return; }
      typing.id = requestAnimationFrame(tick);
    };
    typing.id = requestAnimationFrame(tick);
    mode = 'typing';
  }
  function finishTyping() {
    if (!typing) return;
    cancelAnimationFrame(typing.id); ui.text.textContent = typing.full; typing = null;
    mode = 'line'; ui.next.classList.add('on');
  }
  const hideBox = () => ui.box.classList.remove('show');

  /* ------------------------------------------------------------------ overlays */
  function overlay(cls, html) {
    ui.ov.className = `vn-ov show ${cls || ''}`;
    ui.ov.innerHTML = html;
  }
  function closeOverlay() { ui.ov.classList.remove('show'); }

  function showTitle(t, ms) {
    hideBox(); mode = 'title';
    overlay('title', `<div class="ttl">${t.sub ? `<div class="s">${esc(t.sub)}</div>` : ''}<div class="a">${esc(t.small)}</div><div class="b">${esc(t.big)}</div><div class="ln"></div></div>`);
    timer = setTimeout(() => { closeOverlay(); setTimeout(next, 350); }, ms || 2400);
  }

  function showChoice(c, frame, idx) {
    hideBox(); mode = 'choice'; choiceBg = curBgKey;
    overlay('choice', `<div class="ch"><h2>${esc(c.title)}</h2>${c.objective ? `<p class="obj">${esc(c.objective)}</p>` : ''}
      <div class="opts">${c.options.map((o, i) => `<button class="level" data-i="${i}"><span class="num">${'AB'.charAt(i) || i + 1}</span>
        <span class="info"><span class="code">OPTION ${'AB'.charAt(i) || i + 1} · PRESS ${i + 1}</span><span class="name">${esc(o.label)}</span>${o.sub ? `<span class="sub">${esc(o.sub)}</span>` : ''}</span></button>`).join('')}</div></div>`);
    const btns = ui.ov.querySelectorAll('.level');
    btns.forEach((b) => b.addEventListener('click', () => pick(c, +b.dataset.i, frame, idx)));
    btns.forEach((b) => b.addEventListener('pointerenter', () => window.Orbital && Orbital.blip(1320, .03, .025)));
    setTimeout(() => btns[0] && btns[0].focus({ preventScroll: true }), 60);
  }
  function pick(c, i, frame, idx) {
    if (mode !== 'choice') return;
    window.Orbital && Orbital.blip(760, .08, .06);
    retryPt = { frame, idx };
    closeOverlay();
    stack.push({ steps: c.options[i].result, i: 0 });
    mode = 'wait'; setTimeout(next, 450);
  }

  function showFail(reason) {
    hideBox(); mode = 'fail';
    overlay('fail', `<div class="res"><div class="big">MISSION FAILED</div><p>Reason: ${esc(reason)}</p>
      <button class="hud-btn small" data-r="1"><span class="lbl">RETRY DECISION</span><span class="chev"></span></button></div>`);
    const b = ui.ov.querySelector('button'); b.onclick = retry; setTimeout(() => b.focus(), 60);
  }
  function retry() {
    if (mode !== 'fail' || !retryPt) return;
    window.Orbital && Orbital.blip(520, .1, .06);
    const { frame, idx } = retryPt;
    stack.length = stack.indexOf(frame) + 1;          // drop the failed branch, keep chapter progress
    frame.i = idx;
    closeOverlay();
    if (choiceBg && choiceBg !== curBgKey) setBg(choiceBg, true);
    mode = 'wait'; setTimeout(next, 500);
  }

  function showSuccess(s) {
    hideBox(); mode = 'success'; clearPanel();
    overlay('success', `<div class="res"><div class="big">${esc(s.title)}</div><div class="nm">${esc(s.name)}</div>
      <div class="score"><h4>${esc(s.scoreTitle)}</h4>${s.scores.map((r, i) => `<div class="r" style="--d:${0.5 + i * 0.35}s"><span>${esc(r[0])}</span><b>${esc(r[1])}</b></div>`).join('')}</div>
      <div class="ach" style="--d:${0.5 + s.scores.length * 0.35 + 0.3}s"><small>${esc(s.achievementTitle)}</small><b>★ ${esc(s.achievement)}</b></div>
      <button class="hud-btn small" style="--d:${0.5 + s.scores.length * 0.35 + 0.9}s"><span class="lbl">${esc(s.button)}</span><span class="chev"></span></button></div>`);
    const b = ui.ov.querySelector('button'); b.onclick = () => { window.Orbital && Orbital.blip(760, .08, .06); next(); }; setTimeout(() => b.focus(), 2200);
  }

  function showEnd(e) {
    hideBox(); mode = 'end'; ui.fade.classList.add('on');
    setTimeout(() => {
      overlay('end', `<div class="endc"><div class="logo">${esc(e.logo)}</div><div class="l1">${esc(e.line)}</div><div class="l2">${esc(e.sub)}</div></div>`);
      timer = setTimeout(finishMission, 7000);
    }, 800);
  }

  /* --------------------------------------------------------------- flow control */
  function exec(s, frame) {
    if (s.title) { showTitle(s.title, s.ms); return 'stop'; }
    if ('bg' in s) {
      setBg(s.bg, s.keep);
      if (s.wait) { hideBox(); mode = 'wait'; timer = setTimeout(next, s.wait); return 'stop'; }
      return;
    }
    if ('panel' in s) { s.panel ? showPanel(s.panel) : clearPanel(); return; }
    if (s.say) { showLine(s); return 'stop'; }
    if (s.choice) { showChoice(s.choice, frame, frame.i - 1); return 'stop'; }
    if (s.fail) { showFail(s.fail); return 'stop'; }
    if (s.success) { showSuccess(s.success); return 'stop'; }
    if (s.end) { showEnd(s.end); return 'stop'; }
    if (s.clear) { clearSprites(); return; }
  }
  function next() {
    clearTimeout(timer);
    if (!active) return;
    while (stack.length) {
      const f = stack[stack.length - 1];
      if (f.i >= f.steps.length) { stack.pop(); continue; }
      if (exec(f.steps[f.i++], f) === 'stop') return;
    }
    finishMission();
  }
  function advance() {
    if (!active || paused) return;
    if (mode === 'typing') finishTyping();
    else if (mode === 'line') next();
    else if (mode === 'title') { clearTimeout(timer); closeOverlay(); mode = 'wait'; setTimeout(next, 250); }
    else if (mode === 'wait' && !ui.ov.classList.contains('show')) { /* auto-advancing step */ if (timer) next(); }
    else if (mode === 'end') { clearTimeout(timer); finishMission(); }
  }
  function finishMission() {
    if (!active) return;
    hooks.onComplete && hooks.onComplete();
    exit();
  }

  /* --------------------------------------------------------------------- pause/exit */
  function togglePause() {
    if (!active || mode === 'loading') return;
    paused = !paused; ui.pause.hidden = !paused;
    if (paused) setTimeout(() => ui.pause.querySelector('button').focus(), 30);
  }
  function exit() {
    if (!active) return;
    active = false; session++;
    clearTimeout(timer); typing && cancelAnimationFrame(typing.id); typing = null; clearPanel();
    root.classList.remove('in'); root.classList.add('leaving');
    setTimeout(() => { root.hidden = true; root.classList.remove('leaving'); root.innerHTML = ''; ui = {}; hooks.onExit && hooks.onExit(); }, 650);
  }

  /* -------------------------------------------------------------------------- input */
  function activateFocused() {
    const scope = paused ? ui.pause : ui.ov;
    const a = document.activeElement;
    if (a && scope.contains(a) && a.tagName === 'BUTTON') return a.click();
    const b = scope.querySelector('button'); b && b.click();
  }
  window.addEventListener('keydown', (e) => {
    if (!active) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); togglePause(); return; }
    if (mode === 'loading') return;
    const confirm = e.code === 'Space' || e.key === 'Enter';
    if (confirm) {
      e.preventDefault();
      if (e.repeat) return;
      if (paused || ['choice', 'fail', 'success'].includes(mode)) return activateFocused();
      return advance();
    }
    if (paused) return;
    if (mode === 'choice') {
      const btns = [...ui.ov.querySelectorAll('.level')];
      if (/^[1-9]$/.test(e.key) && btns[+e.key - 1]) btns[+e.key - 1].click();
      else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const i = btns.indexOf(document.activeElement), d = e.key === 'ArrowDown' ? 1 : -1;
        btns[(i + d + btns.length) % btns.length].focus();
      }
    }
  }, true);
  root.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    if (mode === 'typing' || mode === 'line' || mode === 'title' || mode === 'end' || mode === 'wait') advance();
  });

  /* ---------------------------------------------------------------------------- start */
  async function start(id, h) {
    M = (window.MISSIONS || {})[id]; if (!M) return false;
    hooks = h || {}; active = true; paused = false; mode = 'loading'; imgs = {}; stack = []; spr = { left: null, right: null };
    curBgKey = choiceBg = retryPt = null; const my = ++session;
    build();
    root.hidden = false; root.classList.remove('leaving'); void root.offsetWidth; root.classList.add('in');

    const keys = Object.keys(M.images); let done = 0, missing = 0;
    const bar = ui.load.querySelector('.bar b'), cnt = ui.load.querySelector('.c');
    cnt.textContent = `0 / ${keys.length}`;
    const minWait = new Promise((r) => setTimeout(r, 1100));
    await Promise.all(keys.map((k) => loadImg(k).then((u) => {
      done++; if (!u) missing++;
      if (my !== session) return;
      bar.style.width = (done / keys.length * 100) + '%'; cnt.textContent = `${done} / ${keys.length}`;
    })));
    await minWait;
    if (my !== session || !active) return;
    if (missing) { ui.load.querySelector('.m').textContent = `${missing} visual${missing > 1 ? 's' : ''} not found in ${M.folder}/ — placeholders will be shown`; await new Promise((r) => setTimeout(r, 1400)); }
    if (my !== session || !active) return;
    ui.load.classList.add('done');
    stack = [{ steps: M.steps, i: 0 }];
    mode = 'wait';
    setTimeout(() => { if (my === session && active) next(); }, 700);
    return true;
  }

  window.VN = { start, isActive: () => active, exit };
})();
