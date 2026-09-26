/* 남구 청년 창업가 마케팅 지원 접수 PWA — 프론트엔드 단독(백엔드 없음). 데이터는 localStorage. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const main = $('#main');
  const LS = { draft: 'namgu.draft.v1', apps: 'namgu.apps.v1', pin: 'namgu.adminpin' };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } };
  const toast = (msg) => { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(t._t); t._t = setTimeout(() => (t.hidden = true), 2600); };
  const fmt = (n) => Number(n || 0).toLocaleString('ko-KR');

  /* ---------- 상태 ---------- */
  const STEPS = ['자격·인적사항', '사업체 정보', '마케팅 현황', '가점·서류', '동의·제출'];
  let draft = load(LS.draft, { step: 0, data: {}, files: [] });
  const saveDraft = () => { draft.savedAt = new Date().toISOString(); save(LS.draft, draft); };

  /* ---------- 라우팅 ---------- */
  const routes = { '/': home, '/notice': notice, '/check': check, '/apply': apply, '/done': done, '/my': my, '/admin': admin };

  /* ---------- 공고문 ---------- */
  function notice() {
    main.innerHTML = `
      <h1>모집 공고(안)</h1>
      <p class="muted">2027년 청년 창업가 마케팅 심화교육 및 마케팅비 지원 사업 참여자 모집 · 남구청 청년정책 공고 양식 기준</p>
      <section class="card">
        <div class="summary">
          <div><b>신청기간</b><span>2027. 2. 1.(월) ~ 2. 28.(일)</span></div>
          <div><b>지원기간</b><span>2027. 4월 ~ 10월 (교육 3개월 + 집행 4개월), '28. 상반기 추적</span></div>
          <div><b>지원대상</b><span>연령 ▸ 공고일 기준 18~39세 청년<br>주소지 ▸ 부산 남구 주민등록자<br>사업장 ▸ 사업자등록 후 실제 영업 중인 창업사업장 (부산 내, 남구 소재 우대)<br>출석 ▸ 4~6월 주 1회 교육 80% 이상 참석 가능자</span></div>
          <div><b>지원내용</b><span>마케팅 심화교육 12회(강의 6 + 실전 밋업 6) 무료<br>계획서 심사 통과 시 1인당 최대 200만 원 마케팅비 (자부담 10%, 광고비 70% 이상 집행)</span></div>
          <div><b>선발인원</b><span>15명 + 예비 2명 (창업 공모전·경진대회 수상자 총점 10% 이내 가점)</span></div>
          <div><b>신청방법</b><span>온라인(이 앱) 또는 남구 청년창조발전소 방문 접수</span></div>
          <div><b>제출서류</b><span>${window.DOCS.map(([n, , r]) => `${esc(n)}${r ? '' : '(선택)'}`).join(', ')}</span></div>
          <div><b>선발절차</b><span>서류 심사(3월 초) → 면접(3월 중) → 최종 발표(3월 말) → 오리엔테이션(4월 첫째 주)</span></div>
          <div><b>문의</b><span>${esc(window.CONTACT.dept)} ☎ ${esc(window.CONTACT.tel)} · ${esc(window.CONTACT.center)} ☎ ${esc(window.CONTACT.centerTel)}</span></div>
        </div>
        <div class="alert alert--info" style="margin-top:16px"><span>ⓘ</span><span>본 공고문은 정책제안 시안입니다. 사업 확정 시 남구청 공고문이 우선합니다.</span></div>
        <div class="actions"><a class="btn btn--primary" href="#/apply">온라인 신청하기</a><a class="btn btn--tertiary" href="#/check">자격 자가진단</a></div>
      </section>`;
  }
  function navigate() {
    const path = (location.hash.replace('#', '') || '/').split('?')[0];
    const view = routes[path] || home;
    $$('.nav a').forEach((a) => { if (a.dataset.route === path) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    main.innerHTML = '';
    view();
    main.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }
  window.addEventListener('hashchange', navigate);

  /* ---------- 홈: 사업안내 ---------- */
  function dday() {
    const ms = new Date(window.DEADLINE) - new Date();
    const d = Math.ceil(ms / 86400000);
    return d > 0 ? `접수 마감 D-${d}` : d === 0 ? '오늘 마감' : '접수 마감';
  }
  function home() {
    main.innerHTML = `
      <section class="card card--hero">
        <p class="slogan">변화하는 남구, 세계가 찾는 도시 · 2027 남구 청년정책(안)</p>
        <span class="dday">${esc(dday())} · 2027. 2. 28.(일) 23:59</span>
        <h1>청년 창업가 마케팅 심화교육<br>및 마케팅비 지원 사업</h1>
        <p class="muted">배우고, 쓰고, 증명한다. 3개월 교육 후 네이버 플레이스·당근 등 지역 채널 광고를 직접 집행하고 수치로 성과를 확인하는 남구형 집행 연계 창업 지원.</p>
        <div class="actions">
          <a class="btn btn--primary" href="#/apply">지금 신청하기</a>
          <a class="btn btn--secondary" href="#/check" style="background:transparent;color:#fff;border-color:rgba(255,255,255,.7)">자격 먼저 확인</a>
        </div>
      </section>
      <div class="stats">
        <div class="stat"><div class="stat__v">15명</div><div class="stat__l">선발 인원 (+예비 2명)</div></div>
        <div class="stat"><div class="stat__v">200만 원</div><div class="stat__l">1인당 최대 마케팅비</div></div>
        <div class="stat"><div class="stat__v">12회</div><div class="stat__l">강의 6 + 실전 밋업 6</div></div>
        <div class="stat"><div class="stat__v">10%</div><div class="stat__l">자부담 (형식 집행 방지)</div></div>
      </div>
      <div class="trio">
        <a class="btn btn--secondary" href="#/notice">공고문 확인<small>지원 자격·제출서류</small></a>
        <a class="btn btn--primary" href="#/apply">온라인 신청하기<small>5단계 · 자동 임시저장</small></a>
        <a class="btn btn--tertiary" href="#/my">접수확인<small>접수번호로 조회·수정</small></a>
      </div>
      <section class="card">
        <h2 class="sec-title">추진 일정</h2>
        <ol class="timeline">${window.SCHEDULE.map((s, i) => `<li class="${s.now ? 'now' : i === 0 ? 'done' : ''}"><span class="dot" aria-hidden="true"></span><div><div class="when">${esc(s.m)}</div><div class="what">${esc(s.t)}</div><div class="small muted">${esc(s.d)}</div></div></li>`).join('')}</ol>
      </section>
      <section class="card">
        <h2 style="margin-top:0">지원 자격</h2>
        <ul>
          <li>남구에 <strong>주민등록</strong>을 둔 <strong>만 18~39세</strong> 청년</li>
          <li><strong>사업자등록</strong>을 보유한 창업가 (예비창업가 제외, 사업장 소재지 남구 권장)</li>
          <li>교육 12회 중 <strong>80% 이상 출석</strong> 가능하고, 교육 후 마케팅 예산 사용계획서 제출·결과보고에 동의하는 분</li>
          <li>창업 관련 공모전·경진대회 수상자(최근 3년)는 총점의 10% 이내 가점</li>
        </ul>
        <h3>지원 내용</h3>
        <ul>
          <li>마케팅 실무 전문가 강의 6회 + 내 가게 실제 데이터로 하는 실전 밋업 6회 (4~6월, 주 1회)</li>
          <li>계획서 심사 통과 시 <strong>1인당 최대 200만 원</strong> 마케팅비 (광고비 70% 이상, 자부담 10%)</li>
          <li>집행 중 전문위원 중간점검 1회, 종료 6개월 후 추적</li>
        </ul>
        <div class="alert alert--warn"><span>⚠</span><span>심사 결과에 따라 미지원 인원이 발생할 수 있으며, 지원금은 「남구 지방보조금 관리 조례」에 따라 정산·환수 규정이 적용됩니다.</span></div>
        <h3>제출서류</h3>
        <div class="tbl-wrap"><table class="tbl"><thead><tr><th>구분</th><th>유의사항</th><th>필수</th></tr></thead><tbody>
          ${window.DOCS.map(([n, d, r]) => `<tr><td><strong>${esc(n)}</strong></td><td>${esc(d)}</td><td>${r ? '<span class="badge badge--red">필수</span>' : '<span class="badge">선택</span>'}</td></tr>`).join('')}
        </tbody></table></div>
        <p class="hint">서류 발급처: 정부24, 국세청 홈택스 등. 온라인 신청 시 스캔본 또는 PDF 등록, 접수 시 없으면 면접 때 지참 가능.</p>
      </section>
      <section class="card">
        <h2 class="sec-title">남구 청년정책 함께 보기</h2>
        <p class="muted small">본 사업은 아래 남구 기존 사업과 대상이 겹치지만 지원 항목이 달라 동시 참여할 수 있습니다.</p>
        <div class="linkcards">${window.NAMGU_LINKS.map((l) => `<a class="linkcard" href="${esc(l.h)}" target="_blank" rel="noopener"><b>${esc(l.t)}</b><span>${esc(l.d)}</span></a>`).join('')}</div>
        <h3>문의(안)</h3>
        <div class="contact">
          <div><b>${esc(window.CONTACT.dept)}</b> ${esc(window.CONTACT.tel)}</div>
          <div><b>${esc(window.CONTACT.center)}</b> ${esc(window.CONTACT.centerAddr)} · ${esc(window.CONTACT.centerTel)} · ${esc(window.CONTACT.centerHours)}</div>
        </div>
      </section>
      <section class="card faq">
        <h2 style="margin-top:0">자주 묻는 질문</h2>
        <details><summary>예비창업자(사업자등록 전)도 신청할 수 있나요?</summary><p>이번 사업은 사업자등록을 보유한 창업가 대상입니다. 예비창업자는 남구 청년창조발전소 등 별도 프로그램을 안내드립니다.</p></details>
        <details><summary>남구 청년 사업자 임차료 지원(월 20만 원)이나 부산시 온라인 마케팅 비용 지원(50만 원)과 중복 신청 가능한가요?</summary><p>가능합니다. 임차료 지원은 지원 항목이 다르고, 부산시 마케팅 비용 지원은 동일 광고 건에 대해 두 사업에서 이중으로 정산받을 수 없다는 조건만 있습니다.</p></details>
        <details><summary>자부담 10%는 언제 내나요?</summary><p>지원금 집행 시 본인 부담분(지원액의 10%)을 포함해 집행하고, 정산 시 증빙합니다. 별도 납부는 없습니다.</p></details>
        <details><summary>접수 후 수정할 수 있나요?</summary><p>접수 마감 전까지 "내 접수"에서 접수번호로 조회해 수정·재제출할 수 있습니다.</p></details>
        <details><summary>서류는 무엇이 필요한가요?</summary><p>사업자등록증, 주민등록초본(남구 거주 확인)은 필수이며, 수상 실적이 있으면 상장·확인서를 첨부합니다. 접수 시 파일이 없으면 선발 면접 때 지참해도 됩니다.</p></details>
      </section>`;
  }

  /* ---------- 자격 자가진단 ---------- */
  function check() {
    const q = [
      ['resident', '남구에 주민등록이 되어 있나요?'],
      ['age', '만 18세 이상 39세 이하인가요?'],
      ['biz', '사업자등록을 보유하고 있나요? (개인·법인 무관)'],
      ['attend', "'27년 4~6월 주 1회 교육에 80% 이상 출석할 수 있나요?"],
      ['report', '교육 후 계획서 제출과 집행 후 수치 성과 보고에 동의하나요?']
    ];
    main.innerHTML = `
      <h1>자격 자가진단</h1>
      <p class="muted">5개 문항에 답하면 신청 가능 여부를 바로 알려드립니다. 결과는 저장되지 않습니다.</p>
      <form class="card" id="chk">
        ${q.map(([k, t], i) => `<div class="field"><span class="lbl">${i + 1}. ${esc(t)}</span><div class="choices">
          <label class="chip"><input type="radio" name="${k}" value="y" required><span>예</span></label>
          <label class="chip"><input type="radio" name="${k}" value="n"><span>아니오</span></label></div></div>`).join('')}
        <div class="actions"><button class="btn btn--primary" type="submit">결과 보기</button></div>
        <div id="chkResult" style="margin-top:16px"></div>
      </form>`;
    $('#chk').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const fails = q.filter(([k]) => fd.get(k) !== 'y').map(([, t]) => t);
      const box = $('#chkResult');
      if (!fails.length) {
        box.innerHTML = `<div class="alert alert--ok"><span>✓</span><span><strong>신청 가능합니다.</strong> 아래 버튼으로 바로 신청서 작성으로 이동하세요.</span></div><a class="btn btn--primary btn--block" href="#/apply">신청서 작성하기</a>`;
      } else {
        box.innerHTML = `<div class="alert alert--no"><span>!</span><span><strong>다음 항목이 요건에 맞지 않습니다.</strong><br>${fails.map(esc).join('<br>')}<br><span class="small">예비창업자는 남구 청년창조발전소 프로그램을, 남구 외 거주자는 부산시 소상공인 온라인 마케팅 지원을 안내드립니다.</span></span></div>`;
      }
      box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ---------- 신청서 ---------- */
  const F = {
    0: [
      { k: 'name', l: '성명', t: 'text', req: true, ph: '홍길동' },
      { k: 'birth', l: '생년월일', t: 'date', req: true, hint: "만 18~39세('87. 1. 1.~'09. 12. 31. 출생)만 신청 가능", v: (x) => { const a = ageOf(x); return a >= 18 && a <= 39 ? '' : '만 18~39세만 신청할 수 있습니다.'; } },
      { k: 'phone', l: '휴대전화', t: 'tel', req: true, ph: '010-0000-0000', v: (x) => /^01[016789]-?\d{3,4}-?\d{4}$/.test(x) ? '' : '휴대전화 형식이 올바르지 않습니다.' },
      { k: 'email', l: '이메일', t: 'email', req: true, ph: 'example@email.com', v: (x) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x) ? '' : '이메일 형식이 올바르지 않습니다.' },
      { k: 'resDong', l: '주민등록 행정동 (남구)', t: 'select', req: true, opts: window.NAMGU_DONGS.map((d) => d[1]) },
      { k: 'resAddr', l: '주소 (동 이하)', t: 'text', req: true, ph: '예) 수영로 ○○번길 ○○, ○○호' }
    ],
    1: [
      { k: 'bizName', l: '상호', t: 'text', req: true },
      { k: 'bizNo', l: '사업자등록번호', t: 'text', req: true, ph: '000-00-00000', v: (x) => /^\d{3}-?\d{2}-?\d{5}$/.test(x) ? '' : '사업자등록번호 10자리를 입력하세요.' },
      { k: 'bizType', l: '사업자 유형', t: 'radio', req: true, opts: ['개인사업자', '법인사업자'] },
      { k: 'openDate', l: '개업일 (사업자등록증 기준)', t: 'date', req: true },
      { k: 'indL', l: '업종 대분류', t: 'select', req: true, opts: Object.keys(window.INDUSTRIES) },
      { k: 'indM', l: '업종 중분류', t: 'select', req: true, opts: [] },
      { k: 'bizDong', l: '사업장 행정동', t: 'select', req: true, opts: [...window.NAMGU_DONGS.map((d) => d[1]), '남구 외'] },
      { k: 'bizAddr', l: '사업장 주소', t: 'text', req: true },
      { k: 'staff', l: '종사자 수 (본인 포함)', t: 'number', req: true, ph: '1' },
      { k: 'sales', l: "최근 12개월 매출 (만 원, 대략)", t: 'number', req: false, hint: '심사 참고용이며 정확하지 않아도 됩니다.' }
    ],
    2: [
      { k: 'channels', l: '현재 사용 중인 홍보 채널 (복수 선택)', t: 'multi', req: true, opts: window.CHANNELS },
      { k: 'adSpend', l: '최근 3개월 월평균 광고·홍보비 (만 원)', t: 'number', req: true, ph: '0' },
      { k: 'pains', l: '마케팅에서 가장 어려운 점 (최대 3개)', t: 'multi', req: true, opts: window.PAINS, max: 3 },
      { k: 'goal', l: '이 사업으로 이루고 싶은 목표', t: 'textarea', req: true, ph: '예) 플레이스 방문자 월 300명 → 600명, 신규 단골 50명 확보', hint: '숫자로 쓰면 심사에 유리합니다. (200자 이내)', max: 200 },
      { k: 'plan', l: '지원금 200만 원을 어디에 쓸 계획인가요?', t: 'textarea', req: true, ph: '예) 당근 광고 월 30만 원 × 4개월, 플레이스 광고 월 20만 원 × 4개월', max: 300 }
    ],
    3: [
      { k: 'award', l: '창업 관련 공모전·경진대회 수상 경력 (최근 3년)', t: 'radio', req: true, opts: ['없음', '있음'] },
      { k: 'awardDetail', l: '수상 내역 (대회명 · 주최 · 연도 · 등급)', t: 'textarea', req: false, ph: '예) 2025 남구 청년 창업동아리 아이디어 경진대회 · 남구청 · 우수상', showIf: (d) => d.award === '있음' },
      { k: 'prior', l: '남구·부산시 창업 지원사업 참여 이력', t: 'multi', req: false, opts: ['소셜리빙랩', '클래스 1839', '초기 창업기업 자생력 강화', '청년 창업동아리 경진대회', '부산시 온라인 마케팅 비용 지원', '기타', '없음'] },
      { k: 'files', l: '첨부 서류', t: 'file', req: false, hint: '주민등록표 초본(최근 5년 주소 포함)·사업자등록증·통장 사본(필수), 매출 증빙·수상 증빙(선택). PDF·JPG·PNG, 파일당 5MB 이하. 지금 없으면 면접 때 지참 가능.' }
    ],
    4: [
      { k: 'agree1', l: '개인정보 수집·이용에 동의합니다. (수집 항목: 성명·생년월일·연락처·주소·사업자 정보 / 목적: 선발 심사 및 사업 운영 / 보유: 사업 종료 후 3년)', t: 'check', req: true },
      { k: 'agree2', l: '심사 결과에 따라 미지원될 수 있으며, 지원 시 자부담 10%·결과보고·6개월 추적관찰에 참여함을 확인합니다.', t: 'check', req: true },
      { k: 'agree3', l: '기재 내용이 사실과 다를 경우 선발이 취소될 수 있음을 확인합니다.', t: 'check', req: true },
      { k: 'agree4', l: '(선택) 성과 우수 사례를 남구 청년 창업 사례로 공개하는 데 동의합니다.', t: 'check', req: false }
    ]
  };
  function ageOf(birth) { if (!birth) return 0; const b = new Date(birth), n = new Date(); let a = n.getFullYear() - b.getFullYear(); if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) a--; return a; }

  function renderField(f, d) {
    const val = d[f.k];
    const id = 'f_' + f.k;
    const lbl = `<label for="${id}" class="${f.req ? 'req' : ''}">${esc(f.l)}</label>`;
    let inp = '';
    switch (f.t) {
      case 'select': {
        const opts = f.k === 'indM' ? (window.INDUSTRIES[d.indL] || []) : f.opts;
        inp = `<select id="${id}" name="${f.k}"><option value="">선택</option>${opts.map((o) => `<option ${o === val ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`; break;
      }
      case 'radio':
        inp = `<div class="choices" role="radiogroup" aria-labelledby="${id}">${f.opts.map((o) => `<label class="chip"><input type="radio" name="${f.k}" value="${esc(o)}" ${o === val ? 'checked' : ''}><span>${esc(o)}</span></label>`).join('')}</div>`; break;
      case 'multi':
        inp = `<div class="choices" role="group" aria-labelledby="${id}">${f.opts.map((o) => `<label class="chip"><input type="checkbox" name="${f.k}" value="${esc(o)}" ${(val || []).includes(o) ? 'checked' : ''}><span>${esc(o)}</span></label>`).join('')}</div>`; break;
      case 'textarea':
        inp = `<textarea id="${id}" name="${f.k}" placeholder="${esc(f.ph || '')}" ${f.max ? `maxlength="${f.max}"` : ''}>${esc(val || '')}</textarea>`; break;
      case 'check':
        return `<div class="field"><label class="check"><input type="checkbox" name="${f.k}" ${val ? 'checked' : ''}><span class="${f.req ? 'req' : ''}">${esc(f.l)}</span></label><div class="err">동의가 필요합니다.</div></div>`;
      case 'file':
        return `<div class="field"><span class="lbl">${esc(f.l)}</span><div class="file-drop"><div class="muted small">파일을 선택하거나 끌어다 놓으세요</div><input type="file" id="${id}" multiple accept=".pdf,.jpg,.jpeg,.png"></div><ul class="file-list" id="fileList">${draft.files.map((x, i) => `<li><span>${esc(x.name)} <span class="muted">(${Math.round(x.size / 1024)}KB)</span></span><button type="button" class="btn btn--text btn--sm" data-rm="${i}">삭제</button></li>`).join('')}</ul>${f.hint ? `<div class="hint">${esc(f.hint)}</div>` : ''}</div>`;
      default:
        inp = `<input type="${f.t}" id="${id}" name="${f.k}" value="${esc(val || '')}" placeholder="${esc(f.ph || '')}" ${f.t === 'number' ? 'min="0" inputmode="numeric"' : ''} ${f.t === 'tel' ? 'inputmode="tel"' : ''}>`;
    }
    return `<div class="field" data-k="${f.k}">${f.t === 'radio' || f.t === 'multi' ? `<span class="lbl ${f.req ? 'req' : ''}" id="${id}">${esc(f.l)}</span>` : lbl}${inp}${f.hint ? `<div class="hint">${esc(f.hint)}</div>` : ''}<div class="err"></div></div>`;
  }

  function apply() {
    const step = draft.step;
    const d = draft.data;
    const fields = F[step].filter((f) => !f.showIf || f.showIf(d));
    const pct = Math.round((step / STEPS.length) * 100);
    main.innerHTML = `
      <h1>신청서 작성</h1>
      <p class="muted">${draft.savedAt ? `임시저장 ${new Date(draft.savedAt).toLocaleString('ko-KR')} · ` : ''}입력 내용은 이 기기에 자동 저장됩니다.</p>
      <ol class="stepper" aria-label="진행 단계">${STEPS.map((s, i) => `<li class="${i < step ? 'done' : i === step ? 'active' : ''}" ${i === step ? 'aria-current="step"' : ''}>${esc(s)}</li>`).join('')}</ol>
      <div class="progress" aria-hidden="true"><i style="width:${pct}%"></i></div>
      <form class="card" id="stepForm" novalidate>
        <h2 style="margin-top:0">${step + 1}. ${esc(STEPS[step])}</h2>
        ${step === 4 ? renderSummary(d) : ''}
        <div class="${step <= 1 ? 'grid2' : ''}">${fields.map((f) => renderField(f, d)).join('')}</div>
        <div class="actions actions--split">
          <div>${step > 0 ? '<button class="btn btn--tertiary" type="button" id="prev">이전</button>' : '<a class="btn btn--tertiary" href="#/">취소</a>'}</div>
          <div style="display:flex;gap:8px"><button class="btn btn--secondary" type="button" id="saveBtn">임시저장</button><button class="btn btn--primary" type="submit">${step === STEPS.length - 1 ? '제출하기' : '다음'}</button></div>
        </div>
      </form>
      ${step === 0 ? '<p class="small muted">중도에 나가도 "신청하기"를 다시 누르면 이어서 작성할 수 있습니다. <button class="btn btn--text btn--sm" type="button" id="reset">처음부터 다시</button></p>' : ''}`;

    const form = $('#stepForm');
    const collect = () => {
      fields.forEach((f) => {
        if (f.t === 'multi') d[f.k] = $$(`input[name="${f.k}"]:checked`, form).map((i) => i.value);
        else if (f.t === 'radio') d[f.k] = ($(`input[name="${f.k}"]:checked`, form) || {}).value || '';
        else if (f.t === 'check') d[f.k] = $(`input[name="${f.k}"]`, form).checked;
        else if (f.t === 'file') { /* handled separately */ }
        else d[f.k] = ($(`[name="${f.k}"]`, form) || {}).value?.trim?.() ?? '';
      });
    };
    form.addEventListener('input', (e) => {
      collect(); saveDraft();
      if (e.target.name === 'indL') { const sel = $('#f_indM'); sel.innerHTML = '<option value="">선택</option>' + (window.INDUSTRIES[d.indL] || []).map((o) => `<option>${esc(o)}</option>`).join(''); d.indM = ''; }
      if (e.target.name === 'award') { apply(); }
      const wrap = e.target.closest('.field'); if (wrap) wrap.classList.remove('is-error');
    });
    const fileInput = $('#f_files');
    if (fileInput) {
      fileInput.addEventListener('change', async () => {
        for (const file of fileInput.files) {
          if (file.size > 5 * 1024 * 1024) { toast(`${file.name}: 5MB를 초과합니다.`); continue; }
          const entry = { name: file.name, size: file.size, type: file.type };
          if (file.size <= 700 * 1024) entry.data = await new Promise((r) => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(file); });
          draft.files.push(entry);
        }
        if (!saveDraft()) { draft.files.forEach((x) => delete x.data); saveDraft(); toast('저장 공간이 부족해 파일 이름만 저장했습니다.'); }
        apply();
      });
      $$('[data-rm]').forEach((b) => b.addEventListener('click', () => { draft.files.splice(+b.dataset.rm, 1); saveDraft(); apply(); }));
    }
    $('#saveBtn').addEventListener('click', () => { collect(); saveDraft(); toast('임시저장했습니다.'); });
    $('#prev')?.addEventListener('click', () => { collect(); draft.step--; saveDraft(); apply(); });
    $('#reset')?.addEventListener('click', () => { if (confirm('작성 중인 내용을 모두 지울까요?')) { draft = { step: 0, data: {}, files: [] }; saveDraft(); apply(); } });
    form.addEventListener('submit', (e) => {
      e.preventDefault(); collect();
      let first = null;
      fields.forEach((f) => {
        const wrap = $(`.field[data-k="${f.k}"]`, form) || $(`input[name="${f.k}"]`, form)?.closest('.field');
        if (!wrap) return;
        const v = d[f.k];
        let msg = '';
        const empty = v === '' || v === undefined || v === false || (Array.isArray(v) && !v.length);
        if (f.req && empty) msg = f.t === 'check' ? '동의가 필요합니다.' : '필수 항목입니다.';
        else if (!empty && f.v) msg = f.v(v);
        else if (f.max && Array.isArray(v) && v.length > f.max) msg = `최대 ${f.max}개까지 선택할 수 있습니다.`;
        wrap.classList.toggle('is-error', !!msg);
        const err = $('.err', wrap); if (err && msg) err.textContent = msg;
        if (msg && !first) first = wrap;
      });
      if (first) { first.scrollIntoView({ behavior: 'smooth', block: 'center' }); $('input,select,textarea', first)?.focus(); return; }
      if (step < STEPS.length - 1) { draft.step++; saveDraft(); apply(); return; }
      submit();
    });
  }

  function renderSummary(d) {
    const rows = [['성명', d.name], ['생년월일', `${d.birth} (만 ${ageOf(d.birth)}세)`], ['연락처', `${d.phone} / ${d.email}`], ['주민등록', `${d.resDong} ${d.resAddr}`],
      ['상호', `${d.bizName} (${d.bizType}, ${d.bizNo})`], ['업종', `${d.indL} > ${d.indM}`], ['사업장', `${d.bizDong} ${d.bizAddr}`], ['개업일', d.openDate],
      ['홍보 채널', (d.channels || []).join(', ')], ['월 광고비', `${fmt(d.adSpend)}만 원`], ['애로', (d.pains || []).join(', ')], ['목표', d.goal], ['집행 계획', d.plan],
      ['수상', d.award === '있음' ? d.awardDetail : '없음'], ['첨부', draft.files.length ? draft.files.map((f) => f.name).join(', ') : '없음 (면접 시 지참)']];
    return `<div class="alert alert--info"><span>ⓘ</span><span>입력 내용을 확인하세요. 수정하려면 "이전"으로 돌아가세요.</span></div><div class="summary" style="margin-bottom:24px">${rows.map(([k, v]) => `<div><b>${esc(k)}</b><span>${esc(v || '-')}</span></div>`).join('')}</div>`;
  }

  async function submit() {
    const apps = load(LS.apps, []);
    const no = draft.editing || `NG27-${String(apps.length + 1).padStart(4, '0')}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
    const rec = { no, submittedAt: new Date().toISOString(), status: '접수', data: { ...draft.data }, files: draft.files.map((f) => ({ name: f.name, size: f.size, data: f.data })) };
    const idx = apps.findIndex((a) => a.no === no);
    if (idx >= 0) apps[idx] = rec; else apps.push(rec);
    if (!save(LS.apps, apps)) { rec.files.forEach((f) => delete f.data); if (idx >= 0) apps[idx] = rec; else apps[apps.length - 1] = rec; save(LS.apps, apps); }
    if (window.SUBMIT_ENDPOINT) {
      try { await fetch(window.SUBMIT_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(rec) }); rec.synced = true; save(LS.apps, apps); }
      catch { toast('서버 전송에 실패해 기기에만 저장했습니다. 온라인 상태에서 "내 접수"에서 다시 전송하세요.'); }
    }
    draft = { step: 0, data: {}, files: [] }; save(LS.draft, draft);
    location.hash = '#/done?' + no;
  }

  function done() {
    const no = location.hash.split('?')[1];
    const rec = load(LS.apps, []).find((a) => a.no === no);
    if (!rec) { location.hash = '#/'; return; }
    main.innerHTML = `
      <div class="alert alert--ok"><span>✓</span><span><strong>접수가 완료되었습니다.</strong> 접수번호를 보관하세요. 선발 결과는 3월 중 문자·이메일로 안내됩니다.</span></div>
      <section class="receipt">
        <div class="muted small">접수번호</div>
        <div class="receipt__no">${esc(rec.no)}</div>
        <div class="summary" style="margin-top:14px">
          <div><b>신청자</b><span>${esc(rec.data.name)} (${esc(rec.data.phone)})</span></div>
          <div><b>상호</b><span>${esc(rec.data.bizName)} · ${esc(rec.data.indL)} > ${esc(rec.data.indM)}</span></div>
          <div><b>사업장</b><span>${esc(rec.data.bizDong)}</span></div>
          <div><b>접수일시</b><span>${new Date(rec.submittedAt).toLocaleString('ko-KR')}</span></div>
          <div><b>첨부</b><span>${rec.files.length ? rec.files.map((f) => esc(f.name)).join(', ') : '없음 (면접 시 지참)'}</span></div>
        </div>
      </section>
      <div class="actions">
        <button class="btn btn--primary" type="button" onclick="window.print()">접수증 인쇄·PDF 저장</button>
        <a class="btn btn--secondary" href="#/my">내 접수 보기</a>
        <a class="btn btn--tertiary" href="#/">처음으로</a>
      </div>
      <h3>다음 단계</h3>
      <ol><li>3월 초 서류 심사 결과 안내 → 면접(대면 또는 화상)</li><li>3월 말 최종 선발 15인 + 예비 2인 발표</li><li>4월 첫째 주 오리엔테이션 (경성대·부경대 인근 남구 청년창조발전소 예정)</li></ol>`;
  }

  function my() {
    const apps = load(LS.apps, []);
    main.innerHTML = `
      <h1>내 접수</h1>
      <p class="muted">이 기기에서 제출한 접수 내역입니다. 다른 기기에서 접수했다면 접수번호와 휴대전화로 조회하세요.</p>
      ${apps.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>접수번호</th><th>상호</th><th>접수일</th><th>상태</th><th></th></tr></thead><tbody>
        ${apps.map((a) => `<tr><td><strong>${esc(a.no)}</strong></td><td>${esc(a.data.bizName)}</td><td>${new Date(a.submittedAt).toLocaleDateString('ko-KR')}</td><td>${badge(a.status)}</td><td><button class="btn btn--sm btn--tertiary" data-edit="${esc(a.no)}">수정</button> <a class="btn btn--sm btn--text" href="#/done?${esc(a.no)}">접수증</a></td></tr>`).join('')}
      </tbody></table></div>` : '<div class="card"><p>접수 내역이 없습니다.</p><a class="btn btn--primary" href="#/apply">신청하기</a></div>'}
      ${draft.data.name ? `<div class="alert alert--info" style="margin-top:16px"><span>ⓘ</span><span>작성 중인 신청서가 있습니다 (${esc(STEPS[draft.step])} 단계). <a href="#/apply">이어서 작성</a></span></div>` : ''}`;
    $$('[data-edit]').forEach((b) => b.addEventListener('click', () => {
      const a = apps.find((x) => x.no === b.dataset.edit);
      if (new Date() > new Date(window.DEADLINE)) return toast('접수가 마감되어 수정할 수 없습니다.');
      draft = { step: 0, data: { ...a.data }, files: a.files.map((f) => ({ ...f })), editing: a.no }; saveDraft(); location.hash = '#/apply';
    }));
  }
  const badge = (s) => `<span class="badge ${({ 접수: 'badge--blue', 서류검토: 'badge--yellow', 선발: 'badge--green', 예비: 'badge--yellow', 미선발: 'badge--red' })[s] || ''}">${esc(s)}</span>`;

  /* ---------- 관리 (프로토타입: 기기 내 데이터만) ---------- */
  function admin() {
    const pin = load(LS.pin, null);
    if (!sessionStorage.getItem('adminOk')) {
      main.innerHTML = `<h1>접수 관리</h1><form class="card" id="pinForm"><div class="field"><label for="pin">${pin ? '관리 PIN 입력' : '관리 PIN 설정 (4자리 이상)'}</label><input type="password" id="pin" inputmode="numeric" autocomplete="off"></div><div class="hint">프로토타입용 간이 잠금입니다. 실제 운영 시 담당자 계정(구청 SSO 등)으로 교체하세요.</div><div class="actions"><button class="btn btn--primary" type="submit">확인</button></div></form>`;
      $('#pinForm').addEventListener('submit', (e) => { e.preventDefault(); const v = $('#pin').value; if (v.length < 4) return toast('4자리 이상 입력하세요.'); if (!pin) { save(LS.pin, v); } else if (v !== pin) return toast('PIN이 일치하지 않습니다.'); sessionStorage.setItem('adminOk', '1'); admin(); });
      return;
    }
    const apps = load(LS.apps, []);
    const cnt = (k) => apps.reduce((m, a) => { const v = a.data[k] || '-'; m[v] = (m[v] || 0) + 1; return m; }, {});
    const byDong = cnt('bizDong'), byInd = cnt('indL'), byStatus = apps.reduce((m, a) => { m[a.status] = (m[a.status] || 0) + 1; return m; }, {});
    const top = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v]) => `${esc(k)} ${v}`).join(' · ') || '-';
    main.innerHTML = `
      <h1>접수 관리</h1>
      <div class="stats">
        <div class="stat"><div class="stat__v">${apps.length}</div><div class="stat__l">총 접수</div></div>
        <div class="stat"><div class="stat__v">${byStatus['선발'] || 0}/15</div><div class="stat__l">선발 확정</div></div>
        <div class="stat"><div class="stat__v">${byStatus['예비'] || 0}/2</div><div class="stat__l">예비 후보</div></div>
        <div class="stat"><div class="stat__v">${byStatus['서류검토'] || 0}</div><div class="stat__l">서류검토 중</div></div>
      </div>
      <div class="card"><strong>사업장 행정동</strong> <span class="muted small">${top(byDong)}</span><br><strong>업종</strong> <span class="muted small">${top(byInd)}</span><div class="hint">군집별 홍보 배분 목표: 대학·중심상권 10 · 주거상권 3 · 항만 배후 2 (정량분석 4절)</div></div>
      <div class="actions" style="margin:0 0 12px"><button class="btn btn--secondary btn--sm" id="csv">CSV 내보내기</button><button class="btn btn--secondary btn--sm" id="json">JSON 백업</button><label class="btn btn--tertiary btn--sm" for="imp">JSON 가져오기<input type="file" id="imp" accept=".json" hidden></label><button class="btn btn--danger btn--sm" id="wipe">전체 삭제</button><button class="btn btn--text btn--sm" id="lock">잠금</button></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>접수번호</th><th>신청자</th><th>상호 / 업종</th><th>사업장</th><th>업력</th><th>월 광고비</th><th>수상</th><th>첨부</th><th>상태</th></tr></thead><tbody>
      ${apps.map((a, i) => `<tr><td><strong>${esc(a.no)}</strong><br><span class="small muted">${new Date(a.submittedAt).toLocaleDateString('ko-KR')}</span></td><td>${esc(a.data.name)}<br><span class="small muted">${esc(a.data.phone)}</span></td><td>${esc(a.data.bizName)}<br><span class="small muted">${esc(a.data.indL)} > ${esc(a.data.indM)}</span></td><td>${esc(a.data.bizDong)}</td><td>${yrs(a.data.openDate)}</td><td>${fmt(a.data.adSpend)}만</td><td>${a.data.award === '있음' ? '○' : '-'}</td><td>${a.files.length}</td><td><select data-st="${i}" style="min-height:40px;padding:6px 32px 6px 10px;font-size:.9rem">${['접수', '서류검토', '선발', '예비', '미선발'].map((s) => `<option ${a.status === s ? 'selected' : ''}>${s}</option>`).join('')}</select></td></tr>`).join('') || '<tr><td colspan="9">접수 없음</td></tr>'}
      </tbody></table></div>`;
    $$('[data-st]').forEach((s) => s.addEventListener('change', () => { apps[+s.dataset.st].status = s.value; save(LS.apps, apps); toast('상태를 저장했습니다.'); }));
    $('#csv').addEventListener('click', () => {
      const cols = ['no', 'submittedAt', 'status', 'name', 'birth', 'phone', 'email', 'resDong', 'resAddr', 'bizName', 'bizNo', 'bizType', 'openDate', 'indL', 'indM', 'bizDong', 'bizAddr', 'staff', 'sales', 'channels', 'adSpend', 'pains', 'goal', 'plan', 'award', 'awardDetail', 'prior', 'agree4'];
      const rows = apps.map((a) => cols.map((c) => { let v = c in a ? a[c] : a.data[c]; if (Array.isArray(v)) v = v.join('|'); return `"${String(v ?? '').replace(/"/g, '""')}"`; }).join(','));
      download(`namgu_apply_${new Date().toISOString().slice(0, 10)}.csv`, '﻿' + [cols.join(','), ...rows].join('\n'), 'text/csv');
    });
    $('#json').addEventListener('click', () => download(`namgu_apply_backup_${Date.now()}.json`, JSON.stringify(apps, null, 1), 'application/json'));
    $('#imp').addEventListener('change', async (e) => { try { const arr = JSON.parse(await e.target.files[0].text()); if (!Array.isArray(arr)) throw 0; const merged = [...apps]; arr.forEach((r) => { const i = merged.findIndex((x) => x.no === r.no); if (i >= 0) merged[i] = r; else merged.push(r); }); save(LS.apps, merged); toast(`${arr.length}건을 가져왔습니다.`); admin(); } catch { toast('파일 형식이 올바르지 않습니다.'); } });
    $('#wipe').addEventListener('click', () => { if (confirm('이 기기의 접수 데이터를 모두 삭제할까요? 되돌릴 수 없습니다.')) { save(LS.apps, []); admin(); } });
    $('#lock').addEventListener('click', () => { sessionStorage.removeItem('adminOk'); admin(); });
  }
  const yrs = (d) => { if (!d) return '-'; const y = (new Date() - new Date(d)) / (365.25 * 86400000); return y < 1 ? `${Math.round(y * 12)}개월` : `${y.toFixed(1)}년`; };
  const download = (name, content, type) => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([content], { type })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); };

  /* ---------- PWA: 설치 · 오프라인 · SW ---------- */
  let deferred = null;
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e; if (!localStorage.getItem('namgu.installDismissed')) $('#install').hidden = false; });
  $('#installBtn').addEventListener('click', async () => { if (!deferred) return; deferred.prompt(); await deferred.userChoice; deferred = null; $('#install').hidden = true; });
  $('#installClose').addEventListener('click', () => { $('#install').hidden = true; localStorage.setItem('namgu.installDismissed', '1'); });
  const net = () => { $('#offline').hidden = navigator.onLine; };
  window.addEventListener('online', net); window.addEventListener('offline', net); net();
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }

  navigate();
})();
