/* Ligação com o banco real do Bunker (Supabase do Lovable). Mesmo login e mesmas regras de acesso do Bunker antigo. */
(function () {
  'use strict';
  const URL_ = 'https://shyzppzwaziaftdhjnwx.supabase.co';
  const KEY = 'sb_publishable_yQ-ut-WSY_nK82ao1imNxA_B0Udjeqh';
  window.OLD_BUNKER = 'https://bunkershipping.lovable.app';
  if (!window.supabase || !window.supabase.createClient) return;
  const sb = window.supabase.createClient(URL_, KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: 'bunker-claude-auth' } });
  const must = (r) => { if (r.error) throw r.error; return r.data; };
  const here = () => location.origin + location.pathname;

  const L = {
    sb, session: null, me: null,
    async getSession() { const r = await sb.auth.getSession(); L.session = r.data.session; return L.session; },
    async signIn(email, password) { const r = await sb.auth.signInWithPassword({ email, password }); if (r.error) throw r.error; L.session = r.data.session; return r.data.session; },
    async magic(email) { must(await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: here() } })); },
    async signUp(email, password) { const r = await sb.auth.signUp({ email, password, options: { emailRedirectTo: here() } }); if (r.error) throw r.error; L.session = r.data.session; return r.data.session; },
    // esqueci a senha: o Supabase manda um link; ao voltar por ele, a pessoa define a senha nova aqui
    async recover(email) { must(await sb.auth.resetPasswordForEmail(email, { redirectTo: here() })); },
    async setPassword(password) { must(await sb.auth.updateUser({ password })); },
    async signOut() { try { await sb.auth.signOut(); } catch (e) { /* sessão já caiu */ } L.session = null; L.me = null; },

    // cria o perfil no primeiro login de quem foi convidado (mesma função que o Bunker antigo chama)
    async identity() {
      const u = L.session && L.session.user; if (!u) return null;
      const name = (u.user_metadata && u.user_metadata.full_name) || (u.email || '').split('@')[0];
      const ens = await sb.rpc('ensure_my_profile', { _name: name });
      const p = await sb.from('profiles').select('*').eq('id', u.id).maybeSingle();
      if (p.error) throw p.error;
      L.me = p.data ? { id: u.id, email: p.data.email, name: p.data.name, avatar: p.data.avatar_url } : null;
      return { me: L.me, invited: !!p.data, reason: ens.error ? ens.error.message : '' };
    },

    async load(canEdit) {
      const [pages, profiles, roles, activity, invites] = await Promise.all([
        sb.from('pages').select('id,title,parent_id,kind,section,sort_order,offer,drive_url,docs_url,due_date,due_time,created_by,updated_by,created_at,updated_at').order('sort_order').range(0, 4999).then(must),
        sb.from('profiles').select('*').order('name').then(must),
        sb.from('user_roles').select('user_id,role').then((r) => (r.error ? [] : r.data || [])),
        sb.from('activity').select('*').order('created_at', { ascending: false }).limit(600).then(must),
        canEdit ? sb.from('member_invites').select('*').is('accepted_at', null).order('email').then((r) => (r.error ? [] : r.data || [])) : Promise.resolve([]),
      ]);
      const role = new Map(roles.map((r) => [r.user_id, r.role]));
      return {
        pages: pages.map((p) => ({ id: p.id, title: p.title, parent: p.parent_id, kind: p.kind, section: p.section, sort: Number(p.sort_order) || 0, offer: p.offer || '', drive: p.drive_url || '', docs: p.docs_url || '', dueDate: p.due_date, dueTime: p.due_time ? String(p.due_time).slice(0, 5) : '', by: p.created_by, upBy: p.updated_by, created: p.created_at, updated: p.updated_at })),
        people: profiles.map((p) => ({ id: p.id, name: p.name, email: p.email, avatar: p.avatar_url, role: role.get(p.id) || 'membro', since: p.created_at })),
        activity: activity.map((a) => ({ id: a.id, page: a.page_id, user: a.user_id, action: a.action, detail: a.detail, at: a.created_at })),
        invites: invites.map((i) => ({ id: i.id, email: i.email, role: i.role, expires: i.expires_at, at: i.created_at })),
      };
    },

    // ---- gravações (iguais às do Bunker antigo; o banco só deixa quem pode editar) ----
    async createPage(input) { return must(await sb.from('pages').insert(Object.assign({}, input, { created_by: L.me.id, updated_by: L.me.id })).select('id').single()); },
    async updatePage(id, patch) { must(await sb.from('pages').update(Object.assign({}, patch, { updated_by: L.me.id })).eq('id', id).select('id').single()); },
    async deletePage(id) { must(await sb.from('pages').delete().eq('id', id).select('id')); },
    async invite(email) { must(await sb.rpc('create_member_invite', { _email: email.trim().toLowerCase(), _role: 'membro' })); },
    async removeMember(id) { must(await sb.rpc('remove_member', { _user_id: id })); },
    async setup() { must(await sb.rpc('setup_initial_structure')); },

    listen(onChange) {
      const ch = sb.channel('bunker-claude-' + (L.me ? L.me.id : 'x'))
        .on('postgres_changes', { event: '*', schema: 'public', table: 'pages' }, () => onChange('pages'))
        .on('postgres_changes', { event: '*', schema: 'public', table: 'activity' }, () => onChange('activity'))
        .subscribe();
      return () => sb.removeChannel(ch);
    },
  };
  window.BunkerLive = L;
})();
