/* Dados de exemplo da demo (?demo). Nada aqui vem do banco real. */
(function () {
  'use strict';
  window.BUNKER_SEED_VERSION = 2;
  window.buildBunkerSeed = function () {
    let s = 7; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const NOW = Date.now();
    // data e hora no fuso de quem abre, como o Bunker grava
    const local = (iso) => { const d = new Date(iso); const z = (n) => String(n).padStart(2, '0'); return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate()) + 'T' + z(d.getHours()) + ':' + z(d.getMinutes()); };
    const at = (d, h) => new Date(NOW - d * 864e5 - (h || 0) * 36e5).toISOString();
    const people = [
      { id: 'u_edson', name: 'Edson Junior', email: 'edson.junior@shippingcaps.com', role: 'membro', since: at(42) },
      { id: 'u_harry', name: 'Harry', email: 'thepriorylegz@gmail.com', role: 'admin', since: at(42) },
      { id: 'u_kevin', name: 'Kevin Goulart', email: 'kevin@demo.local', role: 'membro', since: at(30) },
      { id: 'u_joao', name: 'João Félix', email: 'joao@demo.local', role: 'membro', since: at(28) },
      { id: 'u_matheus', name: 'Matheus', email: 'matheus@demo.local', role: 'membro', since: at(21) },
      { id: 'u_akshit', name: 'Akshit', email: 'akshit@demo.local', role: 'membro', since: at(9) },
    ];
    const pages = [
      { id: 'root_ads', title: '01 - Briefs de Ads', parent: null, kind: 'page', section: 'ads', sort: 20 },
      { id: 'root_proc', title: 'Processos', parent: null, kind: 'page', section: null, sort: 30 },
      { id: 'root_ed', title: '02 - Briefs de Edição', parent: null, kind: 'page', section: null, sort: 25 },
    ];
    const plan = [['ED', 'Disfunção erétil', 13], ['DIABETES', 'Diabetes', 6], ['MEMO', 'Memória', 5], ['PULMAO', 'Pulmão', 5], ['EMAG', 'Emagrecimento', 4], ['HIPERTENSÃO', 'Hipertensão', 3], ['NEURO', 'Neuropatia', 3], ['VISAO', 'Visão', 2]];
    const activity = [];
    let n = 0;
    plan.forEach(([sig, offer, count]) => {
      for (let i = 1; i <= count; i++) {
        const d = Math.round(41 - (i / count) * 38 - r() * 3);
        const created = at(Math.max(0, d), r() * 8);
        const id = 'p' + (++n);
        const title = 'BRIEF ADS ' + sig + ' LOTE ' + String(i).padStart(2, '0');
        const hasLinks = r() > 0.06;
        pages.push({ id, title, parent: 'root_ads', kind: 'ads', section: 'ads', sort: Date.parse(created), offer, docs: hasLinks ? 'https://docs.google.com/document/d/demo' + n : '', drive: hasLinks ? 'https://drive.google.com/drive/folders/demo' + n : '', dueDate: local(created).slice(0, 10), dueTime: local(created).slice(11, 16), by: 'u_edson', upBy: 'u_edson', created, updated: created });
        activity.push({ id: 'a' + n + 'c', page: id, user: 'u_edson', action: 'criou', detail: 'criou ' + title, at: created });
        if (hasLinks) activity.push({ id: 'a' + n + 'd', page: id, user: 'u_edson', action: 'drive', detail: 'anexou o Drive em ' + title, at: new Date(Date.parse(created) + 6e5).toISOString() });
        activity.push({ id: 'a' + n + 'e', page: id, user: 'u_edson', action: 'entrega', detail: 'marcou a entrega de ' + title, at: new Date(Date.parse(created) + 9e5).toISOString() });
      }
    });
    pages.push({ id: 'proc1', title: 'Rotina de copy', parent: 'root_proc', kind: 'page', section: null, sort: 1, offer: 'Rotina diária da equipe de copy: brief, escrita, revisão e entrega no Drive.', docs: 'https://docs.google.com/document/d/demo-rotina', drive: '', dueDate: at(30).slice(0, 10), dueTime: '10:00', by: 'u_edson', upBy: 'u_edson', created: at(30), updated: at(30) });
    pages.push({ id: 'ed1', title: 'BRIEF EDIÇÃO ED 01', parent: 'root_ed', kind: 'page', section: null, sort: 2, offer: 'Disfunção erétil', docs: 'https://docs.google.com/document/d/demo-ed1', drive: 'https://drive.google.com/drive/folders/demo-ed1', created: at(0, 1) });
    pages.forEach((p) => { p.offer = p.offer || ''; p.docs = p.docs || ''; p.drive = p.drive || ''; p.by = p.by || 'u_edson'; p.created = p.created || at(42); p.updated = p.updated || p.created; p.dueDate = p.dueDate || null; p.dueTime = p.dueTime || ''; });
    const invites = [{ id: 'i1', email: 'munish@demo.local', role: 'membro', expires: at(-5), at: at(2) }];
    activity.sort((a, b) => b.at.localeCompare(a.at));
    return { v: window.BUNKER_SEED_VERSION, pages, people, activity, invites };
  };
})();
