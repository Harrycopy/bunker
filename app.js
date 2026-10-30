/* Bunker · site novo feito com Claude. HTML, CSS e JS puros, ligado no mesmo banco do Bunker do Lovable. */
(function () {
  'use strict';

  // ---------- modo e estado ----------
  const qp = new URLSearchParams(location.search);
  const LIVE = !qp.has('demo') && window.BunkerLive ? window.BunkerLive : null;
  const EDITOR = 'edson.junior@shippingcaps.com';
  const store = { get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sem armazenamento */ } } };
  const empty = () => ({ pages: [], people: [], activity: [], invites: [] });
  let DB = LIVE ? empty() : (store.get('bunker-demo') && store.get('bunker-demo').v === window.BUNKER_SEED_VERSION ? store.get('bunker-demo') : window.buildBunkerSeed());
  const UI = { user: LIVE ? null : (qp.get('as') || 'u_edson'), boot: !!LIVE, denied: false, deniedWhy: '', mode: 'login', recovery: /type=recovery/.test(location.hash), briefs: { q: '', niche: '', sort: 'recent', view: 'grid' }, cal: null, ctl: 'all', preview: {} };
  const commit = () => { if (!LIVE) store.set('bunker-demo', DB); };

  // ---------- utilidades ----------
  const app = document.getElementById('app');
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fold = (s) => String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const compact = (s) => fold(s).replace(/\s+/g, '');
  const pt = 'pt-BR';
  // data e hora sempre no fuso de quem está olhando (no Bunker antigo o card mostrava UTC e virava o dia depois das 21h)
  const dayOf = (iso) => { const d = new Date(iso); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const fmtDay = (ymd, opt) => (ymd ? new Date(ymd + 'T12:00:00').toLocaleDateString(pt, opt || { day: '2-digit', month: 'short' }) : '—');
  const fmtDT = (iso) => (iso ? new Date(iso).toLocaleString(pt, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—');
  const ago = (iso) => { const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000); if (m < 1) return 'agora'; if (m < 60) return 'há ' + m + ' min'; if (m < 1440) return 'há ' + Math.round(m / 60) + ' h'; const d = Math.round(m / 1440); return d === 1 ? 'ontem' : 'há ' + d + ' dias'; };
  const todayYMD = () => dayOf(new Date().toISOString());
  const safeUrl = (u) => { try { const x = new URL(u); return /^https?:$/.test(x.protocol) ? x.href : '#'; } catch (e) { return '#'; } };
  const isHost = (u, h) => { try { const x = new URL(u); return x.protocol === 'https:' && (x.hostname === h || x.hostname.endsWith('.' + h)); } catch (e) { return false; } };
  const initials = (n) => String(n || '?').split(/\s+/).map((x) => x[0]).slice(0, 2).join('').toUpperCase();
  const plural = (n, a, b) => n + ' ' + (n === 1 ? a : b);

  // ---------- nichos: nome oficial primeiro, palavra-chave só de reserva ----------
  const NICHES = [
    { key: 'ed', name: 'Disfunção erétil', short: 'ED', re: /\bed\b|erect|disfun/, c: '#e8a36a', icon: '<circle cx="10" cy="14" r="6"/><path d="M14.5 9.5 20 4M15 4h5v5"/>' },
    { key: 'memoria', name: 'Memória', short: 'Memória', re: /\bmemo|alzheim|cogni/, c: '#a99be6', icon: '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a3 3 0 0 0-3-1Z"/><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/>' },
    { key: 'diabetes', name: 'Diabetes', short: 'Diabetes', re: /diabet|glic/, c: '#7fb6e8', icon: '<path d="M12 3s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11Z"/><path d="M9.5 15a2.5 2.5 0 0 0 2.5 2.5"/>' },
    { key: 'hipertensao', name: 'Hipertensão', short: 'Hipertensão', re: /hipertens|pressao/, c: '#ec8c8c', icon: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/><path d="M6 12h3l1.5-2 2 4 1.5-2H18"/>' },
    { key: 'emagrecimento', name: 'Emagrecimento', short: 'Emagrecimento', re: /\bemag|peso|obes/, c: '#8fcfa8', icon: '<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M8.5 11a3.5 3.5 0 0 1 7 0M12 11l1.5-2"/>' },
    { key: 'neuropatia', name: 'Neuropatia', short: 'Neuropatia', re: /\bneuro|\bpes\b/, c: '#e8c96a', icon: '<path d="M13 3 6 13h5l-1 8 7-10h-5l1-8Z"/>' },
    { key: 'pulmao', name: 'Pulmão', short: 'Pulmão', re: /pulm|respir/, c: '#7ad0d4', icon: '<path d="M12 4v8M12 12c-1 0-2 1-3 2"/><path d="M12 12c1 0 2 1 3 2"/><path d="M9 7C5 8 3 13 3 17c0 2 1.5 3 3 3 2 0 3-1.5 3-3V7Z"/><path d="M15 7c4 1 6 6 6 10 0 2-1.5 3-3 3-2 0-3-1.5-3-3V7Z"/>' },
    { key: 'visao', name: 'Visão', short: 'Visão', re: /visao|\bolho|ocular|catarat/, c: '#d99ac8', icon: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>' },
  ];
  const OTHER = { key: 'outro', name: 'Sem nicho', short: 'Outro', c: '#a4a8b0', icon: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h4"/>' };
  function nicheOf(p) {
    const o = fold(p.offer).trim();
    const exact = NICHES.find((n) => fold(n.name) === o || fold(n.short) === o);
    if (exact) return exact;
    const hay = fold(p.offer + ' ' + p.title);
    return NICHES.find((n) => n.re.test(hay)) || OTHER;
  }
  const art = (n, cls) => (window.BunkerArt && window.BunkerArt(n.key, cls)) || '';
  const emblem = (n, size) => `<svg class="emb" viewBox="0 0 24 24" width="${size || 28}" height="${size || 28}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${n.icon}</svg>`;

  // ---------- estrutura ----------
  const me = () => DB.people.find((p) => p.id === UI.user) || (LIVE && LIVE.me ? { id: LIVE.me.id, name: LIVE.me.name, email: LIVE.me.email, role: 'membro' } : { name: '?' });
  const canEdit = () => fold(me().email || '') === EDITOR;
  const person = (id) => DB.people.find((p) => p.id === id);
  const page = (id) => DB.pages.find((p) => p.id === id);
  const roots = () => DB.pages.filter((p) => !p.parent).sort((a, b) => a.sort - b.sort);
  const procRoot = () => roots().find((p) => fold(p.title).includes('processo'));
  const rootFor = (kind) => roots().find((p) => p.kind === 'page' && p.section === kind);
  const isBrief = (p) => p.kind === 'vsl' || p.kind === 'ads';
  const briefs = () => DB.pages.filter(isBrief);
  const processes = () => { const r = procRoot(); return r ? DB.pages.filter((p) => p.parent === r.id) : []; };
  const subido = (p) => (p.dueDate ? fmtDay(p.dueDate) + (p.dueTime ? ' · ' + p.dueTime : '') : fmtDT(p.created));
  const docsLink = (p) => (isHost(p.docs, 'docs.google.com') ? p.docs : isHost(p.drive, 'docs.google.com') ? p.drive : '');
  const driveLink = (p) => (p.drive && !isHost(p.drive, 'docs.google.com') ? p.drive : '');

  // ---------- ícones ----------
  const I = (d) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const IC = {
    home: I('<path d="M3 11 12 4l9 7v9H3z"/><path d="M9 20v-6h6v6"/>'), brief: I('<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h5"/>'),
    proc: I('<path d="M4 6h16M4 12h10M4 18h6"/><circle cx="18" cy="16" r="3"/>'), cal: I('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
    pulse: I('<path d="M3 12h4l2-6 4 12 2-6h6"/>'), team: I('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.5-5.5 6.5-5.5s5.7 2 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M22 20c-.5-2.4-1.9-4.1-3.8-4.9"/>'),
    plus: I('<path d="M12 5v14M5 12h14"/>'), search: I('<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>'), ext: I('<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>'),
    docs: I('<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h7"/>'), drive: I('<path d="M8 3h8l6 10-4 7H6l-4-7z"/><path d="m8 3 6 10H2M16 3 10 13M22 13H10l-4 7"/>'),
    trash: I('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'), back: I('<path d="M15 18 9 12l6-6"/>'), next: I('<path d="m9 6 6 6-6 6"/>'), x: I('<path d="M6 6l12 12M18 6 6 18"/>'),
    sun: I('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'), moon: I('<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/>'),
    out: I('<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h11"/>'), lock: I('<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>'), mail: I('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
    grid: I('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'), list: I('<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>'),
    eye: I('<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>'), shield: I('<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>'),
  };

  // ---------- banco real ----------
  const errText = (e) => (e && e.code === '42501' ? 'Só quem edita o Bunker pode fazer isso.' : (e && (e.message || e.error_description)) || String(e));
  let reloading = null, reloadTimer = null, stopListen = null;
  async function reload() {
    if (!LIVE || !LIVE.me) return;
    if (reloading) return reloading;
    reloading = (async () => { try { DB = await LIVE.load(canEdit()); ensureMe(); if (!document.querySelector('.modal-root.on')) render(); } catch (e) { toast('Não atualizou: ' + errText(e)); } finally { reloading = null; } })();
    return reloading;
  }
  const reloadSoon = (ms) => { clearTimeout(reloadTimer); reloadTimer = setTimeout(reload, ms == null ? 900 : ms); };
  function ensureMe() { if (LIVE && LIVE.me && !DB.people.some((p) => p.id === LIVE.me.id)) DB.people.push({ id: LIVE.me.id, name: LIVE.me.name, email: LIVE.me.email, role: 'membro' }); }
  async function write(fn, ok) { try { const r = await fn(); if (LIVE) await reload(); if (ok) toast(ok); return r; } catch (e) { toast('Não salvou: ' + errText(e)); throw e; } }

  // ---------- roteador ----------
  function route() { const [path, qs] = (location.hash || '#/').slice(1).split('?'); const parts = path.split('/').filter(Boolean); return { name: parts[0] || 'painel', id: parts[1], q: Object.fromEntries(new URLSearchParams(qs || '')) }; }
  const go = (h) => { if (location.hash === h) render(); else location.hash = h; };
  window.addEventListener('hashchange', () => { closeModal(); render(); window.scrollTo(0, 0); });

  // ---------- casca ----------
  function shell(body, active) {
    const u = me();
    const nav = [['painel', '#/', IC.home, 'Painel'], ['briefs', '#/briefs', IC.brief, 'Briefs'], ['processos', '#/processos', IC.proc, 'Processos'], ['calendario', '#/calendario', IC.cal, 'Calendário'], ['controle', '#/controle', IC.pulse, 'Controle'], ['equipe', '#/equipe', IC.team, 'Equipe']];
    return `${LIVE ? '' : `<div class="demo">${IC.lock}<span>Demo com dados de exemplo · nada aqui mexe no Bunker real</span><a href="./">Entrar no Bunker real</a></div>`}
    <div class="stripe" aria-hidden="true"></div>
    <header class="top"><div class="top-in">
      <a class="brand" href="#/"><b>BUNKER</b><small>ShippingCaps</small></a>
      <nav class="nav">${nav.map(([k, h, ic, l]) => `<a href="${h}" class="${active === k ? 'on' : ''}">${ic}<span>${l}</span></a>`).join('')}</nav>
      <div class="tools">
        <button class="tool" data-a="palette" title="Busca rápida (⌘K)">${IC.search}<span class="kbd">⌘K</span></button>
        ${canEdit() ? `<button class="btn primary sm" data-a="newBrief">${IC.plus}<span>Novo brief</span></button>` : `<span class="ro" title="Só o Edson edita o Bunker">${IC.eye}<span>Leitura</span></span>`}
        <button class="tool" data-a="theme" title="Trocar tema">${isDark() ? IC.sun : IC.moon}</button>
        <div class="me"><span class="av">${esc(initials(u.name))}</span><span class="me-t"><b>${esc(u.name)}</b><small>${canEdit() ? 'Editor' : 'Leitura'}</small></span>
          <button class="tool" data-a="signOut" title="Sair">${IC.out}</button></div>
      </div>
    </div></header>
    <main class="ws">${body}</main>
    <footer class="foot"><span>BUNKER · SHIPPINGCAPS</span><span>Workspace interno · feito com Claude</span></footer>`;
  }
  const isDark = () => document.documentElement.dataset.theme === 'dark';

  // ---------- login ----------
  function viewAuth() {
    const m = UI.mode;
    return `<div class="auth"><section class="auth-l"><div class="stripe big"></div>
        <div class="auth-brand"><b>BUNKER</b><small>ShippingCaps</small></div>
        <div class="auth-hero">${radar(true)}<h1>Briefs em ordem.<br><span>Entregas no radar.</span></h1><p>Workspace interno para conduzir VSLs e Ads com clareza operacional.</p></div>
      </section>
      <section class="auth-r"><form class="auth-card" data-form="auth" novalidate>
        <span class="auth-ic">${IC.shield}</span>
        <h2>${m === 'signup' ? 'Criar acesso' : m === 'forgot' ? 'Esqueci a senha' : m === 'link' ? 'Colar o link do e-mail' : 'Acessar workspace'}</h2>
        <p class="muted">${m === 'signup' ? 'Para quem já foi convidado pela equipe.' : m === 'forgot' ? 'Mandamos um link para o seu e-mail. Clique no botão do e-mail e crie a senha nova aqui no Bunker.' : m === 'link' ? 'No e-mail do Bunker, clique com o botão direito no botão (no celular, segure o dedo) e escolha "Copiar endereço do link". Cole abaixo. Cada link vale uma vez só.' : 'Use o e-mail autorizado pela equipe. A senha é a do Bunker (não a do Traffic Hub).'}</p>
        ${m === 'link' ? `<label class="f"><span>Link do e-mail</span><textarea name="link" rows="4" required placeholder="https://shyzppzwaziaftdhjnwx.supabase.co/auth/v1/verify?token=..."></textarea></label>` : `<label class="f"><span>E-mail</span><input name="email" type="email" autocomplete="username" maxlength="255" required></label>`}
        ${m === 'forgot' || m === 'link' ? '' : `<label class="f"><span>Senha</span><input name="password" type="password" autocomplete="${m === 'signup' ? 'new-password' : 'current-password'}" minlength="6"></label>`}
        <p class="err" role="alert"></p>
        <button class="btn primary big">${m === 'signup' ? 'Criar acesso' : m === 'forgot' ? 'Enviar link para criar senha nova' : m === 'link' ? 'Usar o link e continuar' : 'Entrar com senha'}</button>
        ${m === 'login' ? `<button type="button" class="link center" data-a="authMode" data-m="forgot">Esqueci a senha</button><button type="button" class="btn ghost big" data-a="magic">${IC.mail}Enviar link de acesso por e-mail</button>` : ''}
        ${m === 'login' || m === 'forgot' ? `<button type="button" class="link center" data-a="authMode" data-m="link">Já recebi o e-mail: colar o link</button>` : ''}
        <button type="button" class="link center" data-a="authMode" data-m="${m === 'login' ? 'signup' : 'login'}">${m === 'login' ? 'Primeiro acesso? Criar senha' : 'Voltar para entrar com senha'}</button>
        <p class="note">Sem convite, o acesso não libera. Quem convida é o Edson, em Equipe.</p>
        <a class="link center" href="?demo">Ver a demo com dados de exemplo</a>
      </form></section></div>`;
  }
  function viewNewPassword() {
    return `<div class="denied"><div class="stripe big"></div><form class="denied-in auth-card" data-form="newpw" novalidate><span class="auth-ic">${IC.lock}</span><h2>Criar senha nova</h2>
      <p class="muted">Você entrou pelo link do e-mail. Escolha a senha nova do Bunker (mínimo de 6 caracteres).</p>
      <label class="f"><span>Senha nova</span><input name="p1" type="password" autocomplete="new-password" minlength="6" required></label>
      <label class="f"><span>Repita a senha</span><input name="p2" type="password" autocomplete="new-password" minlength="6" required></label>
      <p class="err" role="alert"></p><button class="btn primary big">Salvar senha e entrar</button></form></div>`;
  }
  function viewDenied() {
    return `<div class="denied"><div class="stripe big"></div><div class="denied-in"><span class="auth-ic">${IC.lock}</span><h2>Seu e-mail ainda não está na equipe</h2>
      <p class="muted">O login funcionou, mas o Bunker só abre para quem foi convidado. Peça para o Edson te convidar em Equipe e entre de novo.</p>
      ${UI.deniedWhy ? `<p class="small muted">${esc(UI.deniedWhy)}</p>` : ''}<button class="btn primary" data-a="signOut">${IC.out}Sair</button></div></div>`;
  }

  // ---------- radar ----------
  function radar(decor) {
    const bs = briefs(); const R = 130, C = 150;
    const by = NICHES.map((n) => { const list = bs.filter((p) => nicheOf(p) === n); const last = list.reduce((m, p) => (p.created > m ? p.created : m), ''); return { n, count: list.length, last }; }).filter((x) => x.count || decor);
    const max = Math.max(1, ...by.map((x) => x.count));
    // o lote mais recente fica no anel de dentro; os outros se espalham para fora, sem amontoar
    const rank = by.slice().sort((a, b) => b.last.localeCompare(a.last)).map((x) => x.n);
    const blips = by.map((x, i) => {
      const ang = (i / Math.max(1, by.length)) * Math.PI * 2 - Math.PI / 2;
      const k = rank.indexOf(x.n) / Math.max(1, by.length - 1);
      const rr = decor ? 50 + (i % 3) * 28 : 44 + k * 74;
      const x0 = C + Math.cos(ang) * rr, y0 = C + Math.sin(ang) * rr; const size = decor ? 4 : 4 + (x.count / max) * 9;
      const left = Math.cos(ang) < -0.2; const tx = left ? x0 - size - 5 : x0 + size + 5;
      return `<g class="blip" style="--c:${x.n.c};--d:${(i * 0.37).toFixed(2)}s"><circle class="ping" cx="${x0.toFixed(1)}" cy="${y0.toFixed(1)}" r="${size.toFixed(1)}"/><circle class="dot" cx="${x0.toFixed(1)}" cy="${y0.toFixed(1)}" r="${size.toFixed(1)}"/>${decor ? '' : `<text x="${tx.toFixed(1)}" y="${(y0 + 4).toFixed(1)}" text-anchor="${left ? 'end' : 'start'}">${esc(x.n.short)} · ${x.count}</text>`}</g>`;
    }).join('');
    return `<svg class="radar${decor ? ' decor' : ''}" viewBox="0 0 300 300" role="img" aria-label="Radar de nichos">
      <defs><linearGradient id="sweep" gradientTransform="rotate(90)"><stop offset="0" stop-color="var(--warn)" stop-opacity=".0"/><stop offset="1" stop-color="var(--warn)" stop-opacity=".35"/></linearGradient></defs>
      ${[1, 0.72, 0.46, 0.2].map((k) => `<circle class="ring" cx="${C}" cy="${C}" r="${R * k}"/>`).join('')}
      <path class="axis" d="M${C} ${C - R}V${C + R}M${C - R} ${C}H${C + R}"/>
      <g class="sweep"><path d="M${C} ${C}L${C} ${C - R}A${R} ${R} 0 0 1 ${C + R * Math.sin(Math.PI / 4)} ${C - R * Math.cos(Math.PI / 4)}Z" fill="url(#sweep)"/><path class="beam" d="M${C} ${C}V${C - R}"/></g>
      ${blips}<circle class="core" cx="${C}" cy="${C}" r="4"/></svg>`;
  }

  // ---------- painel ----------
  function viewPainel() {
    const bs = briefs(); const today = todayYMD();
    const week = bs.filter((p) => (Date.now() - new Date(p.created).getTime()) < 7 * 864e5).length;
    const linked = bs.filter((p) => docsLink(p) && driveLink(p)).length;
    const active = new Set(bs.map((p) => nicheOf(p).key).filter((k) => k !== 'outro')).size;
    const recent = bs.slice().sort((a, b) => b.created.localeCompare(a.created)).slice(0, 7);
    const feed = DB.activity.slice(0, 9);
    const tiles = NICHES.map((n) => { const list = bs.filter((p) => nicheOf(p) === n).sort((a, b) => b.created.localeCompare(a.created)); return { n, list }; });
    const otherList = bs.filter((p) => nicheOf(p) === OTHER);
    const hello = new Date().getHours() < 12 ? 'Bom dia' : new Date().getHours() < 18 ? 'Boa tarde' : 'Boa noite';
    return `<section class="hero">
        <div class="hero-txt">
          <p class="eyebrow"><i class="live"></i>${hello}, ${esc((me().name || '').split(' ')[0])} · ${esc(new Date().toLocaleDateString(pt, { weekday: 'long', day: 'numeric', month: 'long' }))}</p>
          <h1 class="mega">BUNKER</h1>
          <p class="hero-sub">Briefs em ordem. <span>Entregas no radar.</span></p>
          <div class="kpis">
            ${kpi(bs.length, 'briefs no bunker', IC.brief)}${kpi(active, 'nichos ativos', IC.grid)}${kpi(week, 'subidos em 7 dias', IC.pulse)}${kpi(bs.length ? Math.round((linked / bs.length) * 100) + '%' : '—', 'com Docs e Drive', IC.drive)}${kpi(DB.people.length, 'na equipe', IC.team)}
          </div>
        </div>
        <div class="hero-radar">${radar(false)}<p class="radar-cap">Cada ponto é um nicho. Quanto maior, mais briefs; quanto mais perto do centro, mais recente o último lote subido.</p></div>
      </section>
      <section class="block"><header class="bh"><h2>Nichos</h2><a class="link" href="#/briefs">Ver todos os briefs ${IC.next}</a></header>
        <div class="niches">${tiles.map(({ n, list }) => nicheTile(n, list)).join('')}${otherList.length ? nicheTile(OTHER, otherList) : ''}</div></section>
      <section class="two">
        <div class="block"><header class="bh"><h2>Últimos briefs</h2><a class="link" href="#/briefs">Abrir lista ${IC.next}</a></header>
          <ul class="recent">${recent.map((p) => { const n = nicheOf(p); return `<li><a class="r-main" href="#/p/${p.id}"><span class="r-emb" style="--c:${n.c}">${emblem(n, 18)}</span><span><b>${esc(p.title)}</b><small>${esc(n.name)} · ${esc(subido(p))}${p.dueDate === today ? ' · <em>hoje</em>' : ''}</small></span></a>${quick(p)}</li>`; }).join('') || '<li class="empty-s">Nenhum brief ainda.</li>'}</ul></div>
        <div class="block"><header class="bh"><h2>Movimento</h2><a class="link" href="#/controle">Controle completo ${IC.next}</a></header>
          <ol class="feed">${feed.map(feedItem).join('') || '<li class="empty-s">Sem movimento ainda.</li>'}</ol></div>
      </section>
      <section class="block"><header class="bh"><h2>Ritmo de entregas</h2><span class="muted small">últimas 12 semanas · cada quadrado é um dia</span></header>${heatmap()}</section>
      ${processes().length ? `<section class="block"><header class="bh"><h2>Processos</h2><a class="link" href="#/processos">Ver processos ${IC.next}</a></header><div class="procs">${processes().map(procCard).join('')}</div></section>` : ''}`;
  }
  const kpi = (v, l, ic) => `<div class="kpi"><span class="k-ic">${ic}</span><b data-up="${typeof v === 'number' ? v : ''}">${v}</b><small>${esc(l)}</small></div>`;
  function nicheTile(n, list) {
    const last = list[0];
    return `<a class="tile" href="#/briefs?n=${n.key}" style="--c:${n.c}"><span class="t-emb">${art(n, 't-art') || emblem(n, 34)}</span><span class="t-count">${list.length}</span><b>${esc(n.name)}</b><small>${last ? 'último: ' + esc(last.title.replace(/^BRIEF\s+(ADS|VSL)\s+/i, '')) + ' · ' + esc(ago(last.created)) : 'nenhum brief ainda'}</small></a>`;
  }
  const quick = (p) => `<span class="q">${docsLink(p) ? `<a class="qb" href="${esc(safeUrl(docsLink(p)))}" target="_blank" rel="noopener" title="Abrir Google Docs">${IC.docs}</a>` : ''}${driveLink(p) ? `<a class="qb" href="${esc(safeUrl(driveLink(p)))}" target="_blank" rel="noopener" title="Abrir pasta do Drive">${IC.drive}</a>` : ''}</span>`;
  const ACT = { criou: ['criou', IC.plus, '#8fcfa8'], entrega: ['entrega', IC.cal, '#e8c96a'], drive: ['drive', IC.drive, '#7fb6e8'], moveu: ['moveu', IC.next, '#a99be6'] };
  function feedItem(a) {
    const p = page(a.page); const who = person(a.user); const m = ACT[a.action] || ['', IC.pulse, '#aaa'];
    return `<li><span class="f-ic" style="--c:${m[2]}">${m[1]}</span><span><b>${esc((who && who.name) || 'Alguém')}</b> ${esc(a.detail.replace(/^\s*/, ''))}${p ? ` <a href="#/p/${p.id}">abrir</a>` : ''}<small>${esc(ago(a.at))}</small></span></li>`;
  }
  function heatmap() {
    const counts = {};
    DB.activity.forEach((a) => { const d = dayOf(a.at); counts[d] = (counts[d] || 0) + 1; });
    const end = new Date(); end.setHours(12, 0, 0, 0);
    const start = new Date(end); start.setDate(end.getDate() - 83); const dow = (start.getDay() + 6) % 7; start.setDate(start.getDate() - dow);
    const days = []; for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) days.push(dayOf(d.toISOString()));
    const max = Math.max(1, ...days.map((d) => counts[d] || 0));
    const weeks = []; for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
    const total = days.reduce((s, d) => s + (counts[d] || 0), 0);
    return `<div class="heat"><div class="h-grid">${weeks.map((w) => `<div class="h-col">${w.map((d) => { const v = counts[d] || 0; const lv = v ? Math.ceil((v / max) * 4) : 0; return `<i class="l${lv}" title="${esc(fmtDay(d, { day: '2-digit', month: 'short' }))}: ${plural(v, 'evento', 'eventos')}"></i>`; }).join('')}</div>`).join('')}</div>
      <div class="h-leg"><span>${plural(total, 'evento', 'eventos')} no período</span><span class="h-scale">menos <i class="l0"></i><i class="l1"></i><i class="l2"></i><i class="l3"></i><i class="l4"></i> mais</span></div></div>`;
  }
  const procCard = (p) => `<a class="proc" href="#/p/${p.id}"><span class="pc-ic">${IC.proc}</span><span><b>${esc(p.title)}</b><small>${esc((p.offer || 'Processo').slice(0, 140))}</small></span>${IC.next}</a>`;

  // ---------- briefs ----------
  function viewBriefs() {
    const B = UI.briefs; const r = route(); if (r.q.n !== undefined && r.q.n !== B.lastN) { B.niche = r.q.n; B.lastN = r.q.n; }
    let list = briefs();
    const counts = {}; list.forEach((p) => { const k = nicheOf(p).key; counts[k] = (counts[k] || 0) + 1; });
    if (B.niche) list = list.filter((p) => nicheOf(p).key === B.niche);
    if (B.kind) list = list.filter((p) => p.kind === B.kind);
    if (B.q) list = list.filter((p) => compact(p.title + ' ' + p.offer + ' ' + nicheOf(p).name).includes(compact(B.q)) || fold(p.title).includes(fold(B.q)));
    const sorters = { recent: (a, b) => b.created.localeCompare(a.created), name: (a, b) => a.title.localeCompare(b.title, pt, { numeric: true }), niche: (a, b) => (NICHES.indexOf(nicheOf(a)) - NICHES.indexOf(nicheOf(b))) || a.title.localeCompare(b.title, pt, { numeric: true }) };
    list.sort(sorters[B.sort] || sorters.recent);
    const chips = [['', 'Todos', briefs().length]].concat(NICHES.filter((n) => counts[n.key]).map((n) => [n.key, n.name, counts[n.key]])).concat(counts.outro ? [['outro', 'Sem nicho', counts.outro]] : []);
    return `<div class="ph"><div><p class="eyebrow">Swipe de briefs</p><h1 class="title">Briefs</h1><p class="muted">${plural(list.length, 'brief', 'briefs')}${B.niche || B.q || B.kind ? ' com os filtros atuais' : ' no bunker'}.</p></div>
        ${canEdit() ? `<button class="btn primary" data-a="newBrief">${IC.plus}Novo brief</button>` : ''}</div>
      <div class="bar">
        <label class="search">${IC.search}<input id="q" data-in="q" value="${esc(B.q)}" placeholder="Buscar por lote, nicho, título…"></label>
        <div class="seg">${[['', 'Todos'], ['ads', 'Ads'], ['vsl', 'VSL']].map(([k, l]) => `<button class="${(B.kind || '') === k ? 'on' : ''}" data-a="kind" data-k="${k}">${l}</button>`).join('')}</div>
        <label class="sel"><span>Ordem</span><select data-ch="sort"><option value="recent"${B.sort === 'recent' ? ' selected' : ''}>Mais recentes</option><option value="name"${B.sort === 'name' ? ' selected' : ''}>Nome</option><option value="niche"${B.sort === 'niche' ? ' selected' : ''}>Nicho</option></select></label>
        <div class="seg">${[['grid', IC.grid, 'Galeria'], ['table', IC.list, 'Tabela']].map(([k, ic, l]) => `<button class="${B.view === k ? 'on' : ''}" data-a="view" data-k="${k}" title="${l}">${ic}</button>`).join('')}</div>
      </div>
      <div class="chips">${chips.map(([k, l, c]) => { const n = NICHES.find((x) => x.key === k); return `<button class="chip${(B.niche || '') === k ? ' on' : ''}" data-a="niche" data-k="${k}" ${n ? `style="--c:${n.c}"` : ''}>${n ? '<i></i>' : ''}${esc(l)}<b>${c}</b></button>`; }).join('')}</div>
      ${!list.length ? `<div class="empty"><b>Nenhum brief com esses filtros.</b><button class="btn ghost sm" data-a="clear">Limpar filtros</button></div>` : B.view === 'table' ? table(list) : `<div class="gallery">${list.map(card).join('')}</div>`}`;
  }
  function card(p) {
    const n = nicheOf(p);
    return `<article class="card" style="--c:${n.c}">
      <a class="c-cover" href="#/p/${p.id}"><span class="c-glow"></span>${art(n) || emblem(n, 46)}<span class="c-niche">${esc(n.short)}</span><span class="c-kind">${p.kind.toUpperCase()}</span></a>
      <div class="c-body"><a class="c-title" href="#/p/${p.id}">${esc(p.title)}</a>
        <p class="c-meta">${esc(subido(p))} · ${esc((person(p.by) || {}).name || 'Membro')}</p>
        <div class="c-act">${docsLink(p) ? `<a class="btn ghost xs" href="${esc(safeUrl(docsLink(p)))}" target="_blank" rel="noopener">${IC.docs}Docs</a>` : '<span class="miss">sem Docs</span>'}${driveLink(p) ? `<a class="btn ghost xs" href="${esc(safeUrl(driveLink(p)))}" target="_blank" rel="noopener">${IC.drive}Drive</a>` : '<span class="miss">sem Drive</span>'}
        ${canEdit() ? `<button class="btn ghost xs danger" data-a="del" data-id="${p.id}" title="Excluir">${IC.trash}</button>` : ''}</div></div></article>`;
  }
  function table(list) {
    return `<div class="tbl-w"><table class="tbl"><thead><tr><th>Brief</th><th>Nicho</th><th>Tipo</th><th>Subido em</th><th>Criado por</th><th>Links</th>${canEdit() ? '<th></th>' : ''}</tr></thead><tbody>
      ${list.map((p) => { const n = nicheOf(p); return `<tr><td><a class="strong" href="#/p/${p.id}">${esc(p.title)}</a></td><td><span class="tag" style="--c:${n.c}"><i></i>${esc(n.name)}</span></td><td class="mono">${p.kind.toUpperCase()}</td><td class="mono">${esc(subido(p))}</td><td>${esc((person(p.by) || {}).name || 'Membro')}</td><td>${quick(p)}</td>${canEdit() ? `<td><button class="btn ghost xs danger" data-a="del" data-id="${p.id}">${IC.trash}</button></td>` : ''}</tr>`; }).join('')}
    </tbody></table></div>`;
  }

  // ---------- página (brief ou processo) ----------
  function viewPage(id) {
    const p = page(id);
    if (!p) return `<div class="empty big"><b>Página não encontrada.</b><a class="btn ghost" href="#/">Voltar ao painel</a></div>`;
    if (!p.parent) { if (procRoot() && p.id === procRoot().id) return viewProcessos(); UI.briefs.kind = p.section || ''; return viewBriefs(); }
    const parent = page(p.parent); const proc = !isBrief(p); const n = nicheOf(p); const ed = canEdit();
    const hist = DB.activity.filter((a) => a.page === p.id);
    const docs = docsLink(p), drive = driveLink(p);
    const docId = docs && (docs.match(/\/d\/([\w-]+)/) || [])[1];
    return `<a class="back" href="${proc ? '#/processos' : '#/briefs'}">${IC.back}${esc(parent ? parent.title : 'Voltar')}</a>
      <section class="pg" style="--c:${proc ? '#a99be6' : n.c}">
        <div class="pg-cover"><span class="c-glow"></span>${proc ? `<span class="pg-emb">${IC.proc}</span>` : art(n, 'pg-art') || emblem(n, 64)}<div><p class="eyebrow">${proc ? 'Processo' : esc(p.kind.toUpperCase()) + ' · ' + esc(n.name)}</p>
          ${ed ? `<input class="pg-title" data-edit="title" value="${esc(p.title)}" maxlength="240" aria-label="Título">` : `<h1 class="pg-title">${esc(p.title)}</h1>`}</div></div>
        <div class="pg-actions">
          ${docs ? `<a class="btn primary big" href="${esc(safeUrl(docs))}" target="_blank" rel="noopener">${IC.docs}Abrir Google Docs${IC.ext}</a>` : '<span class="miss big">Sem Google Docs</span>'}
          ${drive ? `<a class="btn ghost big" href="${esc(safeUrl(drive))}" target="_blank" rel="noopener">${IC.drive}Abrir pasta do Drive${IC.ext}</a>` : '<span class="miss big">Sem Drive</span>'}
          ${docId ? `<button class="btn ghost big" data-a="preview" data-id="${p.id}">${IC.eye}${UI.preview[p.id] ? 'Fechar prévia' : 'Ver prévia aqui'}</button>` : ''}
        </div>
        ${docId && UI.preview[p.id] ? `<div class="preview"><iframe src="https://docs.google.com/document/d/${esc(docId)}/preview" title="Prévia do Google Docs" loading="lazy"></iframe><p class="small muted">Se pedir login, o documento não está aberto para quem tem o link. Use "Abrir Google Docs".</p></div>` : ''}
        <dl class="props">
          ${proc ? `<div><dt>Descrição</dt><dd>${ed ? `<textarea data-edit="offer" maxlength="500" placeholder="Descreva o processo">${esc(p.offer)}</textarea>` : esc(p.offer || '—')}</dd></div>` : `<div><dt>Nicho</dt><dd>${ed ? `<select data-edit="offer"><option value="">Sem nicho</option>${NICHES.map((x) => `<option${x === n ? ' selected' : ''}>${esc(x.name)}</option>`).join('')}${p.offer && n === OTHER ? `<option selected>${esc(p.offer)}</option>` : ''}</select>` : `<span class="tag" style="--c:${n.c}"><i></i>${esc(n.name)}</span>`}</dd></div>`}
          <div><dt>Google Docs</dt><dd>${ed ? `<input data-edit="docs" value="${esc(p.docs || (isHost(p.drive, 'docs.google.com') ? p.drive : ''))}" placeholder="https://docs.google.com/…">` : docs ? `<a class="link" href="${esc(safeUrl(docs))}" target="_blank" rel="noopener">${esc(docs)}</a>` : '—'}</dd></div>
          <div><dt>Google Drive</dt><dd>${ed ? `<input data-edit="drive" value="${esc(drive)}" placeholder="https://drive.google.com/…">` : drive ? `<a class="link" href="${esc(safeUrl(drive))}" target="_blank" rel="noopener">${esc(drive)}</a>` : p.drive ? `<span class="warn-t">Link fora do Google Drive: ${esc(p.drive)}</span>` : '—'}</dd></div>
          <div><dt>Subido em</dt><dd class="mono">${esc(subido(p))}</dd></div>
          <div><dt>Criado por</dt><dd>${esc((person(p.by) || {}).name || 'Membro')} · ${esc(fmtDT(p.created))}</dd></div>
          <div><dt>Última mudança</dt><dd>${esc((person(p.upBy) || {}).name || 'Membro')} · ${esc(ago(p.updated))}</dd></div>
        </dl>
        ${ed ? `<div class="pg-danger"><button class="btn ghost sm danger" data-a="del" data-id="${p.id}">${IC.trash}Excluir</button></div>` : ''}
      </section>
      <section class="block"><header class="bh"><h2>Histórico</h2></header><ol class="feed">${hist.map(feedItem).join('') || '<li class="empty-s">Sem registros para esta página.</li>'}</ol></section>`;
  }

  // ---------- processos ----------
  function viewProcessos() {
    const ps = processes();
    return `<div class="ph"><div><p class="eyebrow">Como a equipe trabalha</p><h1 class="title">Processos</h1><p class="muted">${plural(ps.length, 'processo', 'processos')}.</p></div>${canEdit() ? `<button class="btn primary" data-a="newBrief" data-k="processos">${IC.plus}Novo processo</button>` : ''}</div>
      <div class="procs big">${ps.map(procCard).join('') || '<div class="empty"><b>Nenhum processo ainda.</b></div>'}</div>`;
  }

  // ---------- calendário ----------
  function viewCalendario() {
    const base = UI.cal ? new Date(UI.cal + '-01T12:00:00') : new Date(); base.setDate(1);
    const ym = base.getFullYear() + '-' + String(base.getMonth() + 1).padStart(2, '0'); UI.cal = ym;
    const start = new Date(base); start.setDate(1 - ((base.getDay() + 6) % 7));
    const today = todayYMD();
    const by = {}; briefs().forEach((p) => { const d = p.dueDate || dayOf(p.created); (by[d] = by[d] || []).push(p); });
    const days = []; for (let i = 0; i < 42; i++) { const d = new Date(start); d.setDate(start.getDate() + i); days.push(d); }
    const monthCount = Object.entries(by).filter(([d]) => d.startsWith(ym)).reduce((s, [, l]) => s + l.length, 0);
    return `<div class="ph"><div><p class="eyebrow">Quando cada brief subiu</p><h1 class="title">${esc(base.toLocaleDateString(pt, { month: 'long', year: 'numeric' }))}</h1><p class="muted">${plural(monthCount, 'brief subido', 'briefs subidos')} neste mês.</p></div>
      <div class="seg"><button data-a="calMove" data-k="-1" title="Mês anterior">${IC.back}</button><button data-a="calMove" data-k="0">Hoje</button><button data-a="calMove" data-k="1" title="Próximo mês">${IC.next}</button></div></div>
      <div class="cal"><div class="cal-h">${['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom'].map((d) => `<span>${d}</span>`).join('')}</div>
      <div class="cal-g">${days.map((d) => { const k = dayOf(d.toISOString()); const items = (by[k] || []); return `<div class="cd${k.startsWith(ym) ? '' : ' out'}${k === today ? ' today' : ''}"><span class="cd-n">${d.getDate()}</span>${items.slice(0, 3).map((p) => { const n = nicheOf(p); return `<a class="cd-i" href="#/p/${p.id}" style="--c:${n.c}"><i></i>${esc(p.title.replace(/^BRIEF\s+(ADS|VSL)\s+/i, ''))}</a>`; }).join('')}${items.length > 3 ? `<span class="cd-more">+${items.length - 3}</span>` : ''}</div>`; }).join('')}</div></div>`;
  }

  // ---------- controle ----------
  function viewControle() {
    const f = UI.ctl; const list = DB.activity.filter((a) => f === 'all' || a.action === f);
    const groups = {}; list.forEach((a) => { const d = dayOf(a.at); (groups[d] = groups[d] || []).push(a); });
    const counts = {}; DB.activity.forEach((a) => { counts[a.action] = (counts[a.action] || 0) + 1; });
    const opts = [['all', 'Tudo', DB.activity.length], ['criou', 'Criações', counts.criou || 0], ['entrega', 'Entregas', counts.entrega || 0], ['drive', 'Drive', counts.drive || 0], ['moveu', 'Movimentações', counts.moveu || 0]];
    return `<div class="ph"><div><p class="eyebrow">Tudo o que aconteceu no bunker</p><h1 class="title">Controle</h1></div></div>
      <div class="chips">${opts.map(([k, l, c]) => `<button class="chip${f === k ? ' on' : ''}" data-a="ctl" data-k="${k}">${l}<b>${c}</b></button>`).join('')}</div>
      ${Object.entries(groups).map(([d, items]) => `<section class="day"><h3>${esc(fmtDay(d, { weekday: 'long', day: 'numeric', month: 'long' }))}</h3><ol class="feed">${items.map(feedItem).join('')}</ol></section>`).join('') || '<div class="empty"><b>Nada por aqui.</b></div>'}
      <p class="muted small">O banco registra criação, entrega, Drive e mudança de lugar. Troca de título, nicho, Docs e exclusões não ficam registradas.</p>`;
  }

  // ---------- equipe ----------
  function viewEquipe() {
    const ed = canEdit();
    return `<div class="ph"><div><p class="eyebrow">Quem tem acesso</p><h1 class="title">Equipe</h1><p class="muted">${plural(DB.people.length, 'pessoa', 'pessoas')} com acesso. Só o Edson convida, remove e edita.</p></div></div>
      ${ed ? `<form class="invite" data-form="invite"><label class="search">${IC.mail}<input name="email" type="email" placeholder="email@empresa.com" required></label><button class="btn primary">Convidar</button></form><p class="muted small">O convite vale 7 dias e não manda e-mail: avise a pessoa para entrar em "Primeiro acesso? Criar senha" com esse e-mail.</p>` : ''}
      <div class="people">${DB.people.map((u) => `<div class="pp"><span class="av big">${esc(initials(u.name))}</span><div><b>${esc(u.name)}</b><small>${esc(u.email)}</small></div><span class="tag">${fold(u.email) === EDITOR ? 'Editor' : u.role === 'admin' ? 'Admin' : 'Membro'}</span>${ed && u.id !== UI.user ? `<button class="btn ghost xs danger" data-a="remove" data-id="${u.id}" title="Remover acesso">${IC.trash}</button>` : ''}</div>`).join('')}</div>
      ${ed && DB.invites.length ? `<section class="block"><header class="bh"><h2>Convites pendentes</h2></header><div class="people">${DB.invites.map((i) => `<div class="pp"><span class="av big">${IC.mail}</span><div><b>${esc(i.email)}</b><small>vale até ${esc(fmtDay(dayOf(i.expires), { day: '2-digit', month: 'short' }))}</small></div><span class="tag">Pendente</span></div>`).join('')}</div></section>` : ''}`;
  }

  // ---------- modais ----------
  const modalRoot = document.getElementById('modal'); let onSubmit = null;
  function openModal(title, body, submit, okLabel, danger) {
    onSubmit = submit;
    modalRoot.innerHTML = `<div class="mback" data-a="closeModal"></div><form class="modal" data-form="modal" novalidate><header><h2>${esc(title)}</h2><button type="button" class="tool" data-a="closeModal">${IC.x}</button></header><div class="mb">${body}</div><p class="err" role="alert"></p><footer><button type="button" class="btn ghost" data-a="closeModal">Cancelar</button><button class="btn ${danger ? 'danger-b' : 'primary'}">${esc(okLabel || 'Salvar')}</button></footer></form>`;
    modalRoot.classList.add('on'); const f = modalRoot.querySelector('input:not([type=radio]),textarea'); if (f) setTimeout(() => f.focus(), 30);
  }
  function closeModal() { modalRoot.classList.remove('on'); modalRoot.innerHTML = ''; onSubmit = null; }
  const mErr = (m) => { const e = modalRoot.querySelector('.err'); if (e) e.textContent = m; };
  function newBriefModal(kind) {
    kind = kind || 'ads';
    openModal('Novo ' + (kind === 'processos' ? 'processo' : 'brief'), `<div class="kinds">${[['ads', 'Ads'], ['vsl', 'VSL'], ['processos', 'Processos']].map(([k, l]) => `<label><input type="radio" name="kind" value="${k}"${k === kind ? ' checked' : ''}><span>${l}</span></label>`).join('')}</div>
      <label class="f"><span>Título</span><input name="title" maxlength="240" placeholder="BRIEF ADS ED LOTE 14" required></label>
      <label class="f nb-niche"><span>Nicho</span><select name="offer"><option value="">Sem nicho</option>${NICHES.map((n) => `<option>${esc(n.name)}</option>`).join('')}</select></label>
      <label class="f"><span>Google Docs (opcional)</span><input name="docs" placeholder="https://docs.google.com/…"></label>
      <label class="f"><span>Google Drive (opcional)</span><input name="drive" placeholder="https://drive.google.com/…"></label>`, async (fd) => {
      const k = fd.get('kind'); const title = String(fd.get('title') || '').trim();
      if (!title) return mErr('Dê um título.');
      const docs = String(fd.get('docs') || '').trim(), drive = String(fd.get('drive') || '').trim();
      if (docs && !isHost(docs, 'docs.google.com')) return mErr('O link do Docs tem que ser do docs.google.com.');
      if (drive && !isHost(drive, 'drive.google.com')) return mErr('O link do Drive tem que ser do drive.google.com.');
      const root = k === 'processos' ? procRoot() : rootFor(k);
      if (!root) return mErr('A guia principal de ' + (k === 'processos' ? 'Processos' : k.toUpperCase()) + ' não existe no Bunker.');
      const now = new Date();
      const input = { title, kind: k === 'processos' ? 'page' : k, section: k === 'processos' ? null : k, parent_id: root.id, offer: k === 'processos' ? null : (fd.get('offer') || null), docs_url: docs || null, drive_url: drive || null, due_date: todayYMD(), due_time: now.toTimeString().slice(0, 5), sort_order: now.getTime() };
      modalRoot.querySelector('footer .btn:last-child').disabled = true;
      try {
        let id;
        if (LIVE) id = (await write(() => LIVE.createPage(input), 'Criado')).id;
        else { id = 'p' + Date.now(); DB.pages.push({ id, title, parent: root.id, kind: input.kind, section: input.section, sort: input.sort_order, offer: input.offer || '', docs: docs, drive: drive, dueDate: input.due_date, dueTime: input.due_time, by: UI.user, upBy: UI.user, created: now.toISOString(), updated: now.toISOString() }); DB.activity.unshift({ id: 'a' + Date.now(), page: id, user: UI.user, action: 'criou', detail: 'criou ' + title, at: now.toISOString() }); commit(); toast('Criado'); }
        closeModal(); go('#/p/' + id);
      } catch (e) { const b = modalRoot.querySelector('footer .btn:last-child'); if (b) b.disabled = false; mErr(errText(e)); }
    }, 'Criar');
  }
  function confirmDelete(id) {
    const p = page(id); if (!p) return;
    openModal('Excluir', `<p>Excluir <b>${esc(p.title)}</b>? Isso apaga a página no Bunker e não tem como desfazer.</p>`, async () => {
      try {
        if (LIVE) await write(() => LIVE.deletePage(id), 'Excluído');
        else { DB.pages = DB.pages.filter((x) => x.id !== id && x.parent !== id); commit(); toast('Excluído'); }
        closeModal(); if (route().name === 'p') go('#/briefs'); else render();
      } catch (e) { mErr(errText(e)); }
    }, 'Excluir', true);
  }

  // ---------- busca rápida ----------
  function palette() {
    const items = [['#/', 'Painel', 'Página'], ['#/briefs', 'Briefs', 'Página'], ['#/processos', 'Processos', 'Página'], ['#/calendario', 'Calendário', 'Página'], ['#/controle', 'Controle', 'Página'], ['#/equipe', 'Equipe', 'Página']]
      .concat(NICHES.map((n) => ['#/briefs?n=' + n.key, n.name, 'Nicho'])).concat(DB.pages.filter((p) => p.parent).map((p) => ['#/p/' + p.id, p.title, isBrief(p) ? nicheOf(p).name : 'Processo']));
    modalRoot.innerHTML = `<div class="mback" data-a="closeModal"></div><div class="pal"><label class="search big">${IC.search}<input id="pal" placeholder="Ir para um brief, nicho ou página…" autocomplete="off"></label><div class="pal-l" id="pal-l"></div></div>`;
    modalRoot.classList.add('on');
    const q = document.getElementById('pal'), L = document.getElementById('pal-l'); let idx = 0, shown = [];
    const draw = () => { const s = q.value.trim(); shown = items.filter(([, l, k]) => !s || compact(l + ' ' + k).includes(compact(s))).slice(0, 12); idx = Math.min(idx, Math.max(0, shown.length - 1)); L.innerHTML = shown.map(([h, l, k], i) => `<a href="${h}" class="${i === idx ? 'on' : ''}"><span>${esc(l)}</span><small>${esc(k)}</small></a>`).join('') || '<p class="empty-s">Nada encontrado.</p>'; };
    q.addEventListener('input', () => { idx = 0; draw(); });
    q.addEventListener('keydown', (e) => { if (e.key === 'ArrowDown') { idx = Math.min(shown.length - 1, idx + 1); draw(); e.preventDefault(); } if (e.key === 'ArrowUp') { idx = Math.max(0, idx - 1); draw(); e.preventDefault(); } if (e.key === 'Enter' && shown[idx]) { closeModal(); go(shown[idx][0]); } });
    L.addEventListener('click', () => setTimeout(closeModal, 0)); draw(); q.focus();
  }

  // ---------- toasts ----------
  const toasts = document.getElementById('toasts');
  function toast(msg) { const el = document.createElement('div'); el.className = 'toast'; el.textContent = msg; toasts.appendChild(el); requestAnimationFrame(() => el.classList.add('in')); setTimeout(() => { el.classList.remove('in'); setTimeout(() => el.remove(), 300); }, 3200); }

  // ---------- render ----------
  function render() {
    if (UI.boot) { app.innerHTML = `<div class="boot"><div class="stripe big"></div><b>BUNKER</b><p>Abrindo o bunker…</p></div>`; return; }
    if (UI.recovery && LIVE && LIVE.session) { app.innerHTML = viewNewPassword(); document.title = 'Bunker · Senha nova'; return; }
    if (!UI.user) { app.innerHTML = viewAuth(); document.title = 'Bunker · Entrar'; return; }
    if (UI.denied) { app.innerHTML = viewDenied(); return; }
    const r = route(); let body, active = r.name, title = 'Painel';
    if (r.name === 'painel') body = viewPainel();
    else if (r.name === 'briefs') { body = viewBriefs(); title = 'Briefs'; }
    else if (r.name === 'processos') { body = viewProcessos(); title = 'Processos'; }
    else if (r.name === 'p') { body = viewPage(r.id); const p = page(r.id); title = p ? p.title : 'Página'; active = p && !isBrief(p) ? 'processos' : 'briefs'; }
    else if (r.name === 'calendario') { body = viewCalendario(); title = 'Calendário'; }
    else if (r.name === 'controle') { body = viewControle(); title = 'Controle'; }
    else if (r.name === 'equipe') { body = viewEquipe(); title = 'Equipe'; }
    else body = `<div class="empty big"><b>Página não encontrada.</b><a class="btn ghost" href="#/">Ir ao painel</a></div>`;
    const focus = document.activeElement && document.activeElement.id === 'q' ? document.activeElement.selectionStart : null;
    app.innerHTML = shell(body, active);
    document.title = title + ' · Bunker';
    if (focus != null) { const el = document.getElementById('q'); if (el) { el.focus(); el.setSelectionRange(focus, focus); } }
    if (r.name === 'painel') countUp();
  }
  let counted = false;
  function countUp() {
    if (counted) return; counted = true;
    document.querySelectorAll('[data-up]').forEach((el) => { const to = +el.dataset.up; if (!to) return; const t0 = performance.now(); const tick = (now) => { const k = Math.min(1, (now - t0) / 1100); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
  }

  // ---------- eventos ----------
  const A = {
    closeModal, palette,
    theme: () => { const d = !isDark(); document.documentElement.dataset.theme = d ? 'dark' : 'light'; try { localStorage.setItem('bunker-theme', d ? 'dark' : 'light'); } catch (e) { /* ok */ } render(); },
    signOut: async () => { if (LIVE) { if (stopListen) stopListen(); stopListen = null; await LIVE.signOut(); DB = empty(); } UI.user = null; UI.denied = false; render(); },
    authMode: (el) => { UI.mode = el.dataset.m || 'login'; render(); },
    magic: async (el) => {
      const f = el.closest('form'); const email = String(new FormData(f).get('email') || '').trim(); const err = f.querySelector('.err');
      if (!/^\S+@\S+\.\S+$/.test(email)) { err.textContent = 'Digite um e-mail válido.'; return; }
      if (!LIVE) { err.textContent = 'Na demo não há envio de e-mail.'; return; }
      try { el.disabled = true; await LIVE.magic(email); toast('Enviamos o link de acesso para o seu e-mail.'); } catch (e) { err.textContent = errText(e); } finally { el.disabled = false; }
    },
    newBrief: (el) => newBriefModal(el.dataset.k),
    del: (el) => confirmDelete(el.dataset.id),
    niche: (el) => { UI.briefs.niche = el.dataset.k; render(); },
    kind: (el) => { UI.briefs.kind = el.dataset.k; render(); },
    view: (el) => { UI.briefs.view = el.dataset.k; render(); },
    clear: () => { Object.assign(UI.briefs, { q: '', niche: '', kind: '' }); render(); },
    ctl: (el) => { UI.ctl = el.dataset.k; render(); },
    preview: (el) => { UI.preview[el.dataset.id] = !UI.preview[el.dataset.id]; render(); },
    calMove: (el) => { const k = +el.dataset.k; if (!k) UI.cal = null; else { const d = new Date(UI.cal + '-01T12:00:00'); d.setMonth(d.getMonth() + k); UI.cal = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); } render(); },
    remove: (el) => {
      const u = person(el.dataset.id);
      openModal('Remover acesso', `<p>Tirar o acesso de <b>${esc(u.name)}</b> ao Bunker?</p>`, async () => {
        try { if (LIVE) await write(() => LIVE.removeMember(u.id), 'Acesso removido'); else { DB.people = DB.people.filter((x) => x.id !== u.id); commit(); toast('Acesso removido'); } closeModal(); render(); }
        catch (e) { mErr(/foreign|violates/i.test(errText(e)) ? 'O banco não deixa remover quem já criou ou mexeu em briefs.' : errText(e)); }
      }, 'Remover', true);
    },
  };
  document.addEventListener('click', (e) => { const el = e.target.closest('[data-a]'); if (!el) return; const fn = A[el.dataset.a]; if (fn) { e.preventDefault(); fn(el, e); } });
  let qTimer;
  document.addEventListener('input', (e) => { if (e.target.dataset.in === 'q') { UI.briefs.q = e.target.value; clearTimeout(qTimer); qTimer = setTimeout(render, 120); } });
  document.addEventListener('change', async (e) => {
    const el = e.target;
    if (el.dataset.ch === 'sort') { UI.briefs.sort = el.value; return render(); }
    if (el.dataset.edit) await saveEdit(el);
  });
  // edição do brief (só o editor vê os campos): grava ao sair do campo
  document.addEventListener('focusout', (e) => { const el = e.target; if (el.dataset && el.dataset.edit && el.tagName !== 'SELECT') saveEdit(el); });
  const savingNow = new Set();
  async function saveEdit(el) {
    const p = page(route().id); if (!p || savingNow.has(el)) return;
    const f = el.dataset.edit; const v = el.value.trim();
    const cur = { title: p.title, offer: p.offer, docs: p.docs || (isHost(p.drive, 'docs.google.com') ? p.drive : ''), drive: driveLink(p) || (p.drive && !isHost(p.drive, 'docs.google.com') ? p.drive : '') }[f];
    if (v === (cur || '')) return;
    let patch;
    if (f === 'title') { if (!v) { el.value = p.title; return toast('O título não pode ficar vazio.'); } patch = { title: v }; }
    else if (f === 'offer') patch = { offer: v || null };
    else if (f === 'docs') { if (v && !isHost(v, 'docs.google.com')) { toast('O link do Docs tem que ser do docs.google.com.'); el.value = cur; return; } patch = Object.assign({ docs_url: v || null }, isHost(p.drive, 'docs.google.com') ? { drive_url: null } : {}); }
    else if (f === 'drive') { if (v && !isHost(v, 'drive.google.com')) { toast('O link do Drive tem que ser do drive.google.com.'); el.value = cur; return; } patch = { drive_url: v || null }; }
    savingNow.add(el);
    try {
      if (LIVE) await write(() => LIVE.updatePage(p.id, patch), 'Salvo');
      else { if (patch.title !== undefined) p.title = patch.title; if ('offer' in patch) p.offer = patch.offer || ''; if ('docs_url' in patch) p.docs = patch.docs_url || ''; if ('drive_url' in patch) p.drive = patch.drive_url || ''; p.updated = new Date().toISOString(); p.upBy = UI.user; commit(); toast('Salvo'); render(); }
    } catch (e) { /* write já avisou */ } finally { savingNow.delete(el); }
  }
  document.addEventListener('submit', async (e) => {
    const f = e.target; const k = f.dataset.form; if (!k) return; e.preventDefault(); const fd = new FormData(f);
    if (k === 'modal' && onSubmit) return onSubmit(fd);
    if (k === 'auth') {
      const email = String(fd.get('email') || '').trim(), pw = String(fd.get('password') || ''); const err = f.querySelector('.err'); err.textContent = '';
      if (!LIVE) { UI.user = 'u_edson'; return render(); }
      if (UI.mode === 'link') {
        const link = String(fd.get('link') || '');
        const b = f.querySelector('button.primary'); b.disabled = true; UI.boot = true;
        try {
          const type = await LIVE.useEmailLink(link); UI.boot = false;
          if (type === 'recovery') { UI.recovery = true; UI.mode = 'login'; return render(); }
          UI.mode = 'login'; await boot();
        } catch (x) { UI.boot = false; b.disabled = false; err.textContent = /expired|invalid|not found|otp/i.test(x.message || '') ? 'Esse link já foi usado ou venceu. Peça um novo em "Esqueci a senha" e cole sem clicar nele.' : errText(x); }
        return;
      }
      if (UI.mode === 'forgot') {
        if (!/^\S+@\S+\.\S+$/.test(email)) { err.textContent = 'Digite um e-mail válido.'; return; }
        const b = f.querySelector('button.primary'); b.disabled = true;
        try { await LIVE.recover(email); err.style.color = 'var(--ok)'; err.textContent = 'Pronto. Abra o e-mail do Bunker, clique no botão e crie a senha nova.'; } catch (x) { err.textContent = errText(x); } finally { b.disabled = false; }
        return;
      }
      if (pw.length < 6) { err.textContent = 'A senha precisa ter pelo menos 6 caracteres.'; return; }
      const btn = f.querySelector('button.primary'); btn.disabled = true;
      try {
        if (UI.mode === 'signup') { const s = await LIVE.signUp(email, pw); if (!s) { btn.disabled = false; err.textContent = 'Confirme seu e-mail para entrar (o link chega na caixa de entrada).'; return; } }
        else await LIVE.signIn(email, pw);
        await boot();
      } catch (x) { btn.disabled = false; err.textContent = /invalid/i.test(x.message || '') ? 'E-mail ou senha errados.' : errText(x); }
    }
    if (k === 'newpw') {
      const p1 = String(fd.get('p1') || ''), p2 = String(fd.get('p2') || ''); const err = f.querySelector('.err');
      if (p1.length < 6) { err.textContent = 'A senha precisa ter pelo menos 6 caracteres.'; return; }
      if (p1 !== p2) { err.textContent = 'As duas senhas não estão iguais.'; return; }
      const b = f.querySelector('button.primary'); b.disabled = true;
      try { await LIVE.setPassword(p1); UI.recovery = false; toast('Senha nova salva'); history.replaceState(null, '', location.pathname + '#/'); await boot(); } catch (x) { b.disabled = false; err.textContent = errText(x); }
      return;
    }
    if (k === 'invite') {
      const email = String(fd.get('email') || '').trim().toLowerCase();
      if (!/^\S+@\S+\.\S+$/.test(email)) return toast('Digite um e-mail válido.');
      try { if (LIVE) await write(() => LIVE.invite(email), 'Convite liberado. Avise a pessoa para criar a senha.'); else { DB.invites.push({ id: 'i' + Date.now(), email, role: 'membro', expires: new Date(Date.now() + 7 * 864e5).toISOString(), at: new Date().toISOString() }); commit(); toast('Convite liberado'); render(); } } catch (x) { /* avisado */ }
    }
  });
  document.addEventListener('keydown', (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k' && UI.user && !UI.denied) { e.preventDefault(); palette(); } if (e.key === 'Escape' && modalRoot.classList.contains('on')) closeModal(); });

  // ---------- início ----------
  async function boot() {
    if (!LIVE) { render(); return; }
    UI.boot = true; render();
    try {
      await LIVE.getSession();
      if (/access_token=|type=/.test(location.hash) && !UI.recovery) history.replaceState(null, '', location.pathname + location.search + '#/');
      if (!LIVE.session) { UI.boot = false; UI.user = null; return render(); }
      if (UI.recovery) { UI.boot = false; return render(); }
      const id = await LIVE.identity();
      UI.user = LIVE.session.user.id;
      if (!id || !id.invited) { UI.denied = true; UI.deniedWhy = id ? id.reason : ''; UI.boot = false; return render(); }
      UI.denied = false;
      DB = await LIVE.load(canEdit()); ensureMe();
      if (stopListen) stopListen(); stopListen = LIVE.listen(() => reloadSoon());
    } catch (e) { toast('Não carregou: ' + errText(e)); }
    UI.boot = false; render();
  }
  if (LIVE) {
    LIVE.sb.auth.onAuthStateChange((ev) => {
      if (ev === 'PASSWORD_RECOVERY') { UI.recovery = true; UI.boot = false; render(); return; } if (ev === 'SIGNED_OUT' && UI.user) { DB = empty(); UI.user = null; render(); } if (ev === 'SIGNED_IN' && !UI.user && !UI.boot) boot(); });
    document.addEventListener('visibilitychange', () => { if (UI.user && document.visibilityState === 'visible') reloadSoon(300); });
    window.addEventListener('online', () => reloadSoon(300));
  }
  boot();
})();
