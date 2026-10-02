/* 발표 덱 부가 동작: 포스터의 QR을 누르면 카메라로 찍는 짧은 애니메이션 뒤에 접수 앱(PoC) 쪽으로 이동 */
(() => {
  const CSS = `
  .qrs { position: fixed; inset: 0; z-index: 99999; display: grid; place-items: center; background: rgba(8,9,12,0); backdrop-filter: blur(0px); transition: background .25s ease, backdrop-filter .25s ease; font-family: 'Pretendard JP Variable', 'Pretendard', sans-serif; }
  .qrs.on { background: rgba(8,9,12,.82); backdrop-filter: blur(6px); }
  .qrs__phone { position: relative; width: min(30vh, 320px); aspect-ratio: 9 / 18.5; border-radius: 13% / 6.3%; background: #0b0b0c; box-shadow: 0 0 0 3px rgba(255,255,255,.16), 0 40px 80px rgba(0,0,0,.6); padding: 3.2%; box-sizing: border-box; transform: translateY(110vh) rotate(8deg); transition: transform .5s cubic-bezier(.2,.9,.25,1); }
  .qrs.on .qrs__phone { transform: translateY(0) rotate(0); }
  .qrs__view { position: relative; width: 100%; height: 100%; border-radius: 11% / 5.4%; overflow: hidden; background: linear-gradient(160deg, #004090, #00a9d0 120%); display: grid; place-items: center; }
  .qrs__qr { width: 58%; aspect-ratio: 1; background: #fff; border-radius: 8%; padding: 5%; box-sizing: border-box; transform: scale(.72); transition: transform .9s ease .45s; }
  .qrs.on .qrs__qr { transform: scale(1); }
  .qrs__qr img { width: 100%; height: 100%; display: block; }
  .qrs__frame { position: absolute; width: 70%; aspect-ratio: 1; left: 15%; top: 50%; translate: 0 -50%; scale: 1.35; opacity: 0; transition: scale .5s ease .7s, opacity .3s ease .7s; }
  .qrs.on .qrs__frame { scale: 1; opacity: 1; }
  .qrs__frame i { position: absolute; width: 22%; height: 22%; border: 4px solid #ffd60a; box-sizing: border-box; }
  .qrs__frame i:nth-child(1) { left: 0; top: 0; border-right: 0; border-bottom: 0; border-radius: 14px 0 0 0; }
  .qrs__frame i:nth-child(2) { right: 0; top: 0; border-left: 0; border-bottom: 0; border-radius: 0 14px 0 0; }
  .qrs__frame i:nth-child(3) { left: 0; bottom: 0; border-right: 0; border-top: 0; border-radius: 0 0 0 14px; }
  .qrs__frame i:nth-child(4) { right: 0; bottom: 0; border-left: 0; border-top: 0; border-radius: 0 0 14px 0; }
  .qrs__line { position: absolute; left: 4%; right: 4%; top: 0; height: 3px; background: #ffd60a; box-shadow: 0 0 18px 4px rgba(255,214,10,.7); opacity: 0; }
  .qrs.on .qrs__line { animation: qrsScan .8s ease-in-out 1.1s 1 both; }
  @keyframes qrsScan { 0% { top: 2%; opacity: 1; } 100% { top: 96%; opacity: 0; } }
  .qrs__chip { position: absolute; left: 50%; bottom: 9%; translate: -50% 20px; white-space: nowrap; background: #ffd60a; color: #111; font-weight: 700; font-size: clamp(11px, 1.5vh, 16px); border-radius: 999px; padding: .6em 1.1em; opacity: 0; transition: translate .3s ease 1.8s, opacity .3s ease 1.8s; }
  .qrs.on .qrs__chip { translate: -50% 0; opacity: 1; }
  .qrs__flash { position: absolute; inset: 0; background: #fff; opacity: 0; pointer-events: none; }
  .qrs.on .qrs__flash { animation: qrsFlash .35s ease 2.3s 1 both; }
  @keyframes qrsFlash { 0% { opacity: 0; } 40% { opacity: .9; } 100% { opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { .qrs *, .qrs { transition: none !important; animation: none !important; } }
  `;
  const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);

  let busy = false;
  function goPoc() {
    const deck = document.querySelector('deck-stage');
    const secs = [...document.querySelectorAll('deck-stage > section, section[data-label]')];
    const i = secs.findIndex((s) => s.dataset.label === 'PoC 접수 앱');
    if (deck && i >= 0 && typeof deck.goTo === 'function') deck.goTo(i);
    else if (deck && typeof deck.next === 'function') deck.next();
  }
  function scan() {
    if (busy) return; busy = true;
    const el = document.createElement('div');
    el.className = 'qrs';
    el.innerHTML = '<div class="qrs__phone"><div class="qrs__view"><div class="qrs__qr"><img src="assets/qr.png" alt=""></div><div class="qrs__frame"><i></i><i></i><i></i><i></i><span class="qrs__line"></span></div><span class="qrs__chip">promise722.github.io/namgu-youth-apply 열기</span></div></div><div class="qrs__flash"></div>';
    document.body.appendChild(el);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('on')));
    const finish = () => { goPoc(); el.classList.remove('on'); setTimeout(() => { el.remove(); busy = false; }, 350); };
    const t = setTimeout(finish, reduce ? 400 : 2500);
    el.addEventListener('click', () => { clearTimeout(t); finish(); }, { once: true });
  }
  document.addEventListener('click', (e) => {
    const hit = e.composedPath().find((n) => n instanceof Element && n.hasAttribute('data-qr-scan'));
    if (hit) { e.preventDefault(); e.stopPropagation(); scan(); }
  }, true);
})();

/* 줄바꿈 다듬기: 2~4줄 문단의 마지막 줄이 너무 짧으면 줄 길이를 고르게 맞춘다(줄 수가 늘면 되돌림) */
(() => {
  const linesOf = (el) => {
    const rg = document.createRange(); rg.selectNodeContents(el);
    const lines = [];
    [...rg.getClientRects()].filter((r) => r.width > 1).forEach((r) => {
      const l = lines.find((y) => Math.abs(y.top - r.top) < 4);
      if (l) { l.l = Math.min(l.l, r.left); l.r = Math.max(l.r, r.right); } else lines.push({ top: r.top, l: r.left, r: r.right });
    });
    return lines.map((l) => l.r - l.l);
  };
  let glued = false;
  function glue() {
    // 가운뎃점·화살표가 줄 맨 앞에 오지 않게 앞 낱말에 붙인다
    if (glued) return; glued = true;
    document.querySelectorAll('section[data-label]').forEach((sec) => {
      const tw = document.createTreeWalker(sec, NodeFilter.SHOW_TEXT);
      const nodes = []; while (tw.nextNode()) nodes.push(tw.currentNode);
      nodes.forEach((n) => { if (/ [·→] /.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(/ ([·→]) /g, ' $1 '); });
    });
  }
  function tidy() {
    glue();
    const blocks = new Set();
    document.querySelectorAll('section[data-label] :is(span, p, li, div, h2)').forEach((e) => {
      if (e.closest('svg') || ![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 6)) return;
      let b = e;
      while (b && getComputedStyle(b).display === 'inline') b = b.parentElement;
      if (b && !b.matches('section')) blocks.add(b);
    });
    let n = 0;
    blocks.forEach((b) => {
      const w = linesOf(b);
      if (w.length < 2 || w.length > 4) return;
      if (w[w.length - 1] >= Math.max(...w) * 0.35) return;
      const prev = b.style.textWrap;
      b.style.textWrap = 'balance';
      if (linesOf(b).length > w.length) b.style.textWrap = prev; else n++;
    });
    return n;
  }
  const start = Date.now();
  (function wait() {
    if (document.querySelectorAll('section[data-label]').length > 5) {
      window.__tidied = 0;
      (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => [400, 1500, 3500, 7000].forEach((t) => setTimeout(() => { window.__tidied += tidy(); }, t)));
    } else if (Date.now() - start < 15000) setTimeout(wait, 200);
  })();
})();

/* 접수 관리 화면 팝업: 21쪽 버튼을 누르면 관리 화면(시연용 가상 데이터)을 크게 띄운다 */
(() => {
  const style = document.createElement('style');
  style.textContent = `
  .adm { position: fixed; inset: 0; z-index: 99998; display: grid; place-items: center; background: rgba(8,9,12,.78); backdrop-filter: blur(6px); font-family: 'Pretendard JP Variable', 'Pretendard', sans-serif; }
  .adm__win { width: min(94vw, 1500px); height: 90vh; background: #0b0b0c; border-radius: 16px; padding: 10px; box-sizing: border-box; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 40px 100px rgba(0,0,0,.6), 0 0 0 2px rgba(255,255,255,.14); }
  .adm__bar { display: flex; align-items: center; gap: 10px; color: #aeb0b6; font-size: 14px; }
  .adm__url { flex: 1; background: rgba(255,255,255,.1); border-radius: 8px; padding: 6px 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .adm__bar a, .adm__bar button { color: #fff; background: rgba(255,255,255,.14); border: 0; border-radius: 8px; padding: 7px 14px; font: inherit; font-weight: 600; text-decoration: none; cursor: pointer; }
  .adm__bar button:hover, .adm__bar a:hover { background: rgba(255,255,255,.26); }
  .adm iframe { flex: 1; width: 100%; border: 0; border-radius: 10px; background: #fff; }
  `;
  document.head.appendChild(style);
  let el = null;
  const keys = (e) => { if (!el) return; e.stopPropagation(); if (e.key === 'Escape') close(); };
  function close() { if (el) { el.remove(); el = null; window.removeEventListener('keydown', keys, true); } }
  function open() {
    if (el) return;
    el = document.createElement('div'); el.className = 'adm';
    el.innerHTML = '<div class="adm__win" role="dialog" aria-label="접수 관리 화면"><div class="adm__bar"><span class="adm__url">promise722.github.io/namgu-youth-apply/#/admin · 시연용 가상 데이터</span><a href="../#/admin?demo" target="_blank" rel="noopener">새 창으로 열기</a><button type="button">닫기 (Esc)</button></div><iframe src="../#/admin?demo&focus=ai" title="접수 관리 화면"></iframe></div>';
    el.addEventListener('click', (e) => { if (e.target === el || e.target.closest('button')) close(); });
    document.body.appendChild(el);
    window.addEventListener('keydown', keys, true);
  }
  document.addEventListener('click', (e) => {
    const hit = e.composedPath().find((n) => n instanceof Element && n.hasAttribute('data-admin-popup'));
    if (hit) { e.preventDefault(); e.stopPropagation(); open(); }
  }, true);
})();
