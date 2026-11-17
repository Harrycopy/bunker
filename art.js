/* Ilustração de cada nicho (capa do brief, parede de nichos e página do brief). SVG feito à mão, sem imagem externa. */
(function () {
  'use strict';
  let seq = 0;
  const star = (x, y, r, o) => `<path d="M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z" class="sp" fill="#fff" opacity="${o || 0.75}"/>`;
  const drop = (x, y, s, fill, o) => `<path d="M${x} ${y - 6 * s}C${x + 4 * s} ${y - s} ${x + 4 * s} ${y + 3 * s} ${x} ${y + 4 * s}C${x - 4 * s} ${y + 3 * s} ${x - 4 * s} ${y - s} ${x} ${y - 6 * s}Z" fill="${fill}" opacity="${o || 0.9}"/>`;

  const G = (id, a, b, c) => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset=".55" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient>`;

  const ART = {
    // ED: berinjela, pêssego e selo +18 em neon
    ed: (u) => `<defs>
        <linearGradient id="eg${u}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c58cf0"/><stop offset=".5" stop-color="#7434bd"/><stop offset="1" stop-color="#2c0c57"/></linearGradient>
        <radialGradient id="pc${u}" cx=".35" cy=".35" r=".85"><stop offset="0" stop-color="#ffd9b3"/><stop offset=".5" stop-color="#ff9a6c"/><stop offset="1" stop-color="#d4464a"/></radialGradient>
      </defs>
      <g transform="translate(80 62) rotate(-32)">
        <path d="M-4-34C6-38 16-30 17-16C18-2 26 10 26 24C26 40 12 48 0 46C-14 44-24 34-22 18C-20 4-12-6-12-18C-12-28-10-32-4-34Z" fill="url(#eg${u})"/>
        <path d="M-15 16C-16 5-10-4-8-15" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".45"/>
        <ellipse cx="-12" cy="26" rx="2.4" ry="4" fill="#fff" opacity=".35"/>
        <path d="M2-38C2-46 6-50 11-53" stroke="#4f9a40" stroke-width="3.6" stroke-linecap="round" fill="none"/>
        <path d="M-15-29L-8-19L-2-25L4-17L8-26L17-27C13-34 8-38 2-38C-5-38-11-35-15-29Z" fill="#74c45c"/>
      </g>
      <path d="M128 52C140 50 150 60 149 74C148 88 138 96 128 96C118 96 108 88 107 74C106 60 116 50 128 52Z" fill="url(#pc${u})"/>
      <path d="M128 55C123 65 123 82 128 94" stroke="#a8333a" stroke-width="2" fill="none" opacity=".55"/>
      <ellipse cx="116" cy="67" rx="4" ry="7.5" fill="#fff" opacity=".35"/>
      <path d="M128 53C131 44 140 40 148 42C144 49 137 53 128 53Z" fill="#74c45c"/>
      ${drop(42, 30, 1.2, '#cfeeff')}${drop(53, 19, 0.8, '#cfeeff', 0.75)}${drop(36, 46, 0.7, '#cfeeff', 0.6)}
      <circle cx="164" cy="30" r="18" fill="none" stroke="#ff3d6e" stroke-width="7" opacity=".25"/>
      <circle cx="164" cy="30" r="17" fill="rgba(10,6,12,.55)" stroke="#ff3d6e" stroke-width="2.4"/>
      <text x="164" y="35.5" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-weight="800" font-size="15" fill="#ff4d7a">+18</text>
      <path d="M176 66c0-3 4-4 5-1 1-3 5-2 5 1 0 3-5 6-5 6s-5-3-5-6Z" fill="#ff4d7a" opacity=".85"/>
      ${star(26, 88, 5)}${star(182, 92, 4, 0.6)}${star(100, 14, 3.5, 0.55)}`,

    // Pulmão: traqueia, brônquios e alvéolos
    pulmao: (u) => {
      const half = `<path d="M92 42C82 30 64 34 55 50C46 66 42 84 46 98C50 108 64 108 76 102C88 96 96 88 96 76C96 64 96 52 92 42Z" fill="url(#lg${u})"/>
        <path d="M60 56C54 66 52 78 53 88" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".35"/>
        <path d="M100 46C96 50 90 54 84 58" stroke="#effcfc" stroke-width="3.2" stroke-linecap="round" fill="none"/>
        <path d="M84 58C78 62 72 66 66 72M84 58C82 66 80 74 78 84M72 66C68 72 62 76 58 82M80 74C74 80 70 86 64 92M84 58C88 66 90 74 90 84M66 72C62 70 58 66 56 62" stroke="#effcfc" stroke-width="1.8" stroke-linecap="round" fill="none" opacity=".85"/>
        <g fill="#effcfc" opacity=".75"><circle cx="58" cy="82" r="2.2"/><circle cx="64" cy="92" r="2.2"/><circle cx="78" cy="84" r="2.2"/><circle cx="90" cy="84" r="2.2"/><circle cx="56" cy="62" r="2.2"/></g>`;
      return `<defs><linearGradient id="lg${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a6f0f2"/><stop offset=".55" stop-color="#3aa9b0"/><stop offset="1" stop-color="#1a6469"/></linearGradient></defs>
      ${half}<g transform="matrix(-1 0 0 1 200 0)">${half}</g>
      <rect x="95" y="6" width="10" height="38" rx="4" fill="#dff7f8"/>
      <path d="M95 11h10M95 16h10M95 21h10M95 26h10M95 31h10M95 36h10" stroke="#5fbfc4" stroke-width="1.6"/>
      <g fill="none" stroke="#a6f0f2" opacity=".6"><circle cx="36" cy="26" r="3.2"/><circle cx="26" cy="44" r="2"/><circle cx="164" cy="22" r="2.2"/><circle cx="174" cy="40" r="3.6"/></g>
      ${star(178, 92, 4, 0.55)}${star(22, 90, 3.5, 0.5)}`;
    },

    // Memória: cérebro com conexões acesas
    memoria: (u) => `<defs><linearGradient id="br${u}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9d0ff"/><stop offset=".55" stop-color="#9a87ea"/><stop offset="1" stop-color="#5a46b0"/></linearGradient></defs>
      <g stroke="#cfc6ff" stroke-width="1.4" stroke-dasharray="2 3" fill="none" opacity=".7"><path d="M60 38L36 28M142 32L166 24M146 66L170 78M64 78L32 86"/></g>
      <g fill="#fff"><circle cx="36" cy="28" r="3"/><circle cx="166" cy="24" r="3"/><circle cx="170" cy="78" r="3"/><circle cx="32" cy="86" r="3"/></g>
      <path d="M126 86C136 90 140 98 134 104C128 108 118 104 116 96Z" fill="#6c58c4"/>
      <path d="M104 90C106 100 104 108 100 114" stroke="#8a7cd0" stroke-width="7" stroke-linecap="round" fill="none"/>
      <path d="M62 62C52 58 50 42 60 36C60 24 74 18 84 22C90 12 108 12 114 20C126 16 140 24 140 36C152 40 154 56 146 64C150 76 140 88 128 86C122 96 104 96 98 88C86 94 72 90 70 80C60 80 56 70 62 62Z" fill="url(#br${u})"/>
      <path d="M84 22C82 32 90 36 88 46M114 20C110 30 118 34 112 44M60 36C70 40 74 48 70 56M140 36C130 40 128 50 134 58M98 88C98 76 108 72 104 62M70 80C80 76 82 68 90 66M128 86C122 76 128 70 120 64M88 46C96 50 104 48 112 44M146 64C138 62 134 66 130 72" stroke="#4a3a92" stroke-width="2.2" stroke-linecap="round" fill="none" opacity=".75"/>
      <path d="M72 34C78 28 86 28 92 30" stroke="#fff" stroke-width="2.6" stroke-linecap="round" fill="none" opacity=".45"/>
      ${star(100, 8, 4)}${star(180, 50, 3.5, 0.6)}${star(20, 58, 3, 0.55)}`,

    // Diabetes: glicosímetro, gota de sangue e cubo de açúcar
    diabetes: (u) => `<defs>
        <linearGradient id="gm${u}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eef3f9"/><stop offset="1" stop-color="#9fb2c6"/></linearGradient>
        <linearGradient id="bd${u}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff8080"/><stop offset=".6" stop-color="#d81f3a"/><stop offset="1" stop-color="#8c0a20"/></linearGradient>
      </defs>
      <rect x="70" y="10" width="10" height="24" rx="1.5" fill="#f3e5ad"/><rect x="72.5" y="14" width="5" height="9" fill="#e0b85a"/>
      ${drop(75, 8, 0.9, '#e0283f', 1)}
      <rect x="46" y="30" width="58" height="80" rx="13" fill="url(#gm${u})"/>
      <rect x="54" y="40" width="42" height="32" rx="6" fill="#0d2131"/>
      <text x="75" y="61" text-anchor="middle" font-family="JetBrains Mono,ui-monospace,monospace" font-weight="700" font-size="16" fill="#7fe0ff">98</text>
      <text x="75" y="68.5" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="5.5" fill="#7fb6e8">mg/dL</text>
      <circle cx="65" cy="90" r="5.5" fill="#7fb6e8"/><circle cx="85" cy="90" r="5.5" fill="#5a8fc4"/>
      <path d="M142 22C152 38 162 50 162 66C162 80 152 90 142 90C132 90 122 80 122 66C122 50 132 38 142 22Z" fill="url(#bd${u})"/>
      <path d="M131 64C131 55 135 48 139 43" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".5"/>
      <path d="M154 96l10-5 10 5-10 5Z" fill="#fff"/><path d="M154 96l10 5v11l-10-5Z" fill="#dde4ec"/><path d="M174 96l-10 5v11l10-5Z" fill="#bfcad6"/>
      <path d="M18 26l8-4 8 4-8 4Z" fill="#fff"/><path d="M18 26l8 4v9l-8-4Z" fill="#dde4ec"/><path d="M34 26l-8 4v9l8-4Z" fill="#bfcad6"/>
      ${star(180, 30, 4, 0.6)}${star(28, 96, 3.5, 0.55)}`,

    // Hipertensão: coração, eletrocardiograma e manômetro no vermelho
    hipertensao: (u) => `<defs><linearGradient id="ht${u}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff9a9a"/><stop offset=".55" stop-color="#d93448"/><stop offset="1" stop-color="#7d0d1f"/></linearGradient></defs>
      <path d="M92 38C92 24 100 16 110 16C120 16 125 22 125 30" stroke="#e0505e" stroke-width="8" stroke-linecap="round" fill="none"/>
      <path d="M104 17V7M115 17l2-9" stroke="#e0505e" stroke-width="4" stroke-linecap="round"/>
      <path d="M100 106C78 92 58 76 58 56C58 42 68 34 80 34C90 34 96 40 100 48C104 40 110 34 120 34C132 34 142 42 142 56C142 76 122 92 100 106Z" fill="url(#ht${u})"/>
      <ellipse cx="76" cy="52" rx="6" ry="9" fill="#fff" opacity=".3" transform="rotate(-25 76 52)"/>
      <path d="M8 72H58L66 72L72 58L80 90L88 40L96 80L102 72H192" stroke="#ec8c8c" stroke-width="6" stroke-linejoin="round" stroke-linecap="round" fill="none" opacity=".35"/>
      <path d="M8 72H58L66 72L72 58L80 90L88 40L96 80L102 72H192" stroke="#fff" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" fill="none"/>
      <circle cx="166" cy="32" r="17" fill="#17181c" stroke="#e8e2da" stroke-width="2"/>
      <path d="M155.3 42.7A15 15 0 0 1 166 17" stroke="#7bd49a" stroke-width="3" fill="none"/>
      <path d="M166 17A15 15 0 0 1 177.3 23.3" stroke="#f2c230" stroke-width="3" fill="none"/>
      <path d="M177.3 23.3A15 15 0 0 1 176.6 42.6" stroke="#ff4d5e" stroke-width="3" fill="none"/>
      <path d="M166 32L176 26" stroke="#ff4d5e" stroke-width="2.4" stroke-linecap="round"/><circle cx="166" cy="32" r="2.4" fill="#e8e2da"/>
      ${star(24, 30, 4, 0.6)}${star(182, 100, 3.5, 0.5)}`,

    // Emagrecimento: cintura com fita métrica e seta para baixo
    emagrecimento: (u) => `<defs><linearGradient id="bd${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c8f2d6"/><stop offset=".6" stop-color="#5fb486"/><stop offset="1" stop-color="#2b7651"/></linearGradient></defs>
      <path d="M74 8C74 30 84 44 86 60C88 76 74 92 72 116H128C126 92 112 76 114 60C116 44 126 30 126 8Z" fill="url(#bd${u})"/>
      <path d="M80 18C82 34 90 46 91 58" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".35"/>
      <path d="M120 57C140 50 158 62 152 80C148 92 162 100 176 94" stroke="#ffd34d" stroke-width="8" stroke-linecap="round" fill="none"/>
      <path d="M120 57C140 50 158 62 152 80C148 92 162 100 176 94" stroke="#a77f00" stroke-width="3" stroke-dasharray="1 3.5" fill="none"/>
      <path d="M80 54C94 62 106 62 120 54L121 62C106 70 94 70 79 62Z" fill="#ffd34d"/>
      <path d="M81 58C94 65 106 65 120 58" stroke="#a77f00" stroke-width="3" stroke-dasharray="1 3.5" fill="none"/>
      <rect x="168" y="88" width="14" height="10" rx="2" fill="#e9b21c" transform="rotate(-24 175 93)"/>
      <path d="M38 28V70M28 59l10 12 10-12" stroke="#8fcfa8" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <text x="38" y="92" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-weight="800" font-size="13" class="ink" fill="#e9fff1">-kg</text>
      ${star(160, 24, 4.5, 0.65)}${star(176, 46, 3, 0.5)}`,

    // Neuropatia: pé com o nervo aceso e choque nos dedos
    neuropatia: (u) => `<defs><linearGradient id="ft${u}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f7e6b8"/><stop offset=".6" stop-color="#cfa548"/><stop offset="1" stop-color="#8a6a20"/></linearGradient></defs>
      <path d="M48 18C48 46 46 64 44 78C42 92 50 102 64 102H150C164 102 172 96 170 88C168 82 158 80 146 78C126 74 104 68 90 58C82 52 78 40 78 18Z" fill="url(#ft${u})"/>
      <path d="M52 24C52 44 50 60 49 72" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".35"/>
      <path d="M64 22C64 46 62 66 66 80C72 92 90 94 110 92C126 90 142 90 160 92" stroke="#e8c96a" stroke-width="5.5" stroke-linecap="round" fill="none" opacity=".5"/>
      <path d="M64 22C64 46 62 66 66 80C72 92 90 94 110 92C126 90 142 90 160 92M66 80C60 88 58 93 56 98M110 92C114 86 120 82 128 82M130 91C138 86 146 84 152 84M90 93C92 97 96 99 100 101" stroke="#fffbe0" stroke-width="2" stroke-linecap="round" fill="none"/>
      <g fill="#fffbe0"><circle cx="56" cy="98" r="2"/><circle cx="128" cy="82" r="2"/><circle cx="152" cy="84" r="2"/><circle cx="160" cy="92" r="2.4"/></g>
      <path d="M182 56L172 72H180L172 88" stroke="#ffdf5a" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="M160 50L154 60H159L154 70" stroke="#ffdf5a" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity=".8"/>
      <circle cx="166" cy="92" r="14" fill="none" stroke="#ffdf5a" stroke-width="1.4" stroke-dasharray="2 3" opacity=".7"/>
      ${star(120, 30, 4.5, 0.6)}${star(24, 104, 3.5, 0.5)}`,

    // Visão: olho com íris, cílios e brilho
    visao: (u) => {
      let fib = '';
      for (let i = 0; i < 28; i++) { const a = (i / 28) * Math.PI * 2; fib += `M${(100 + Math.cos(a) * 12).toFixed(1)} ${(60 + Math.sin(a) * 12).toFixed(1)}L${(100 + Math.cos(a) * 25).toFixed(1)} ${(60 + Math.sin(a) * 25).toFixed(1)}`; }
      return `<defs>
        <radialGradient id="ir${u}" cx=".5" cy=".5" r=".5"><stop offset=".3" stop-color="#f6c7ea"/><stop offset=".7" stop-color="#b35aa6"/><stop offset="1" stop-color="#4f1a52"/></radialGradient>
        <linearGradient id="sc${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9d2d4"/><stop offset=".35" stop-color="#fbf8f6"/><stop offset="1" stop-color="#e9e2e2"/></linearGradient>
        <clipPath id="ey${u}"><path d="M24 60C52 24 148 24 176 60C148 96 52 96 24 60Z"/></clipPath>
      </defs>
      <path d="M40 44L31 32M58 34L52 20M78 29L75 14M100 27V11M122 29L125 14M142 34L148 20M160 44L169 32" stroke="#d99ac8" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M24 60C52 24 148 24 176 60C148 96 52 96 24 60Z" fill="url(#sc${u})"/>
      <g clip-path="url(#ey${u})"><circle cx="100" cy="60" r="27" fill="url(#ir${u})"/><path d="${fib}" stroke="#fff" stroke-width="1" opacity=".22"/><circle cx="100" cy="60" r="11" fill="#0b0b0d"/></g>
      <path d="M24 60C52 24 148 24 176 60C148 96 52 96 24 60Z" fill="none" stroke="#d99ac8" stroke-width="2.6"/>
      <circle cx="108" cy="51" r="5" fill="#fff"/><circle cx="93" cy="67" r="2" fill="#fff" opacity=".8"/>
      ${star(184, 86, 4.5, 0.6)}${star(16, 92, 3.5, 0.5)}`;
    },

    // ---- bibliotecas e nichos novos (17/11/2026) ----
    // Próstata: glândula com uretra e gotas
    prostata: (u) => `<defs>${G('pr' + u, '#c9d4ff', '#6f86e8', '#33449c')}</defs>
      <path d="M100 12V30M100 98V112" stroke="#c9d4ff" stroke-width="8" stroke-linecap="round"/>
      <path d="M100 28C128 28 146 44 144 66C142 90 120 100 100 100C80 100 58 90 56 66C54 44 72 28 100 28Z" fill="url(#pr${u})"/>
      <path d="M100 30V98" stroke="#2a3a8c" stroke-width="2" opacity=".3"/>
      <path d="M72 44C66 52 66 62 70 70" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".4"/>
      <circle cx="100" cy="62" r="11" fill="#fff" opacity=".92"/><circle cx="100" cy="62" r="5.5" fill="#33449c"/>
      ${drop(160, 38, 1, '#cfd8ff')}${drop(44, 44, 0.8, '#cfd8ff', 0.7)}${star(176, 90, 4, 0.6)}${star(22, 90, 3.5, 0.55)}`,

    // Dores articulares: articulação com brilho de dor
    dores: (u) => `<defs>${G('dj' + u, '#fff1e8', '#f0a37a', '#b0502a')}<radialGradient id="dg${u}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff5a3c" stop-opacity=".85"/><stop offset="1" stop-color="#ff5a3c" stop-opacity="0"/></radialGradient></defs>
      <circle cx="100" cy="60" r="42" fill="url(#dg${u})"/>
      <g transform="rotate(-18 100 60)"><rect x="86" y="6" width="28" height="48" rx="12" fill="url(#dj${u})"/><rect x="86" y="66" width="28" height="48" rx="12" fill="url(#dj${u})"/><circle cx="100" cy="60" r="13" fill="#fff6ef"/><circle cx="100" cy="60" r="6" fill="#ff5a3c"/></g>
      <path d="M54 38l-14-8M50 62H34M54 86l-14 8M146 38l14-8M150 62h16M146 86l14 8" stroke="#ff7a52" stroke-width="3" stroke-linecap="round"/>
      ${star(172, 20, 4)}${star(26, 104, 3.5, 0.55)}`,

    // Gravidez: rosto de bebê e coração
    gravidez: (u) => `<defs>${G('gv' + u, '#ffe9f1', '#f6a9c4', '#c4568a')}</defs>
      <circle cx="100" cy="62" r="46" fill="url(#gv${u})"/>
      <circle cx="100" cy="64" r="28" fill="#ffe6d6"/>
      <path d="M96 38c-4-8 4-12 8-8 4-2 8 2 4 8" stroke="#c4568a" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M88 62q4 4 8 0M104 62q4 4 8 0" stroke="#7a2a52" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M94 74q6 6 12 0" stroke="#d2566e" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <circle cx="84" cy="70" r="4.5" fill="#ff9fb4" opacity=".7"/><circle cx="116" cy="70" r="4.5" fill="#ff9fb4" opacity=".7"/>
      <path d="M158 30c0-4 6-6 7-1 1-5 8-3 7 1 0 5-7 9-7 9s-7-4-7-9Z" fill="#ff7aa2"/>
      ${star(30, 30, 5)}${star(172, 96, 4, 0.6)}${star(24, 92, 3.5, 0.5)}`,

    // Intestino: tubo em curvas com brilho
    intestino: (u) => `<defs>${G('it' + u, '#ffd9c2', '#e8946a', '#a8482a')}</defs>
      <path d="M40 30H150C170 30 170 56 150 56H50C30 56 30 84 50 84H160" stroke="url(#it${u})" stroke-width="16" stroke-linecap="round" fill="none"/>
      <path d="M44 27H148M52 81H156" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".38"/>
      <g fill="#fff" opacity=".85"><circle cx="70" cy="30" r="2.4"/><circle cx="104" cy="30" r="2.4"/><circle cx="130" cy="56" r="2.4"/><circle cx="90" cy="56" r="2.4"/><circle cx="76" cy="84" r="2.4"/><circle cx="118" cy="84" r="2.4"/></g>
      ${star(176, 102, 4, 0.6)}${star(24, 104, 3.5, 0.5)}${star(110, 10, 4, 0.6)}`,

    // Prosperidade / Religioso: sol dourado com cruz
    prosperidade: (u) => {
      let rays = '';
      for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; rays += `M${(100 + Math.cos(a) * 36).toFixed(1)} ${(62 + Math.sin(a) * 36).toFixed(1)}L${(100 + Math.cos(a) * 56).toFixed(1)} ${(62 + Math.sin(a) * 56).toFixed(1)}`; }
      return `<defs><radialGradient id="pg${u}" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#fff3b8"/><stop offset=".6" stop-color="#e2b93b"/><stop offset="1" stop-color="#8e6a12"/></radialGradient></defs>
      <path d="${rays}" stroke="#f3d472" stroke-width="3" stroke-linecap="round" opacity=".75"/>
      <circle cx="100" cy="62" r="31" fill="url(#pg${u})"/>
      <rect x="95" y="42" width="10" height="40" rx="3" fill="#fffaf0"/><rect x="84" y="53" width="32" height="10" rx="3" fill="#fffaf0"/>
      ${star(30, 26, 5)}${star(176, 100, 4, 0.6)}${star(24, 98, 3.5, 0.5)}`;
    },

    // Reações UGC: celular com carinha e emoji
    reacoes: (u) => `<defs>${G('rc' + u, '#ffd3ea', '#ff7ab8', '#b02a78')}</defs>
      <rect x="68" y="8" width="64" height="104" rx="12" fill="#1b1b24" stroke="url(#rc${u})" stroke-width="3"/>
      <circle cx="100" cy="44" r="20" fill="#ffd36a"/><circle cx="93" cy="40" r="2.6" fill="#5a3a10"/><circle cx="107" cy="40" r="2.6" fill="#5a3a10"/><path d="M90 50q10 10 20 0" stroke="#5a3a10" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <rect x="78" y="74" width="44" height="6" rx="3" fill="#ff7ab8"/><rect x="78" y="86" width="30" height="6" rx="3" fill="#fff" opacity=".35"/>
      <path d="M26 34c0-5 7-7 8-1 1-6 9-4 8 1 0 6-8 10-8 10s-8-4-8-10Z" fill="#ff7ab8"/>
      <circle cx="164" cy="44" r="13" fill="#ffd36a"/><ellipse cx="164" cy="47" rx="3" ry="4" fill="#5a3a10"/><circle cx="159" cy="40" r="1.8" fill="#5a3a10"/><circle cx="169" cy="40" r="1.8" fill="#5a3a10"/>
      ${star(172, 96, 4, 0.6)}${star(28, 90, 4, 0.6)}`,

    // Rejuvenescimento: ampulheta com brilho
    rejuvenescimento: (u) => `<defs>${G('rj' + u, '#e6fff4', '#7fd8b2', '#2f8a68')}</defs>
      <path d="M68 14H132M68 110H132" stroke="#d9fff0" stroke-width="7" stroke-linecap="round"/>
      <path d="M76 18C76 48 100 52 100 62C100 72 76 76 76 106H124C124 76 100 72 100 62C100 52 124 48 124 18Z" fill="url(#rj${u})" opacity=".95"/>
      <path d="M84 24C86 40 98 46 100 52C102 46 114 40 116 24Z" fill="#fff" opacity=".8"/>
      <path d="M100 60V92" stroke="#fff" stroke-width="2" opacity=".8"/>
      <path d="M86 104C90 96 110 96 114 104Z" fill="#fff" opacity=".85"/>
      <path d="M150 40l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#fff"/>${star(38, 34, 5)}${star(166, 92, 4, 0.6)}`,

    // Relacionamento: dois corações
    relacionamento: (u) => `<defs>${G('rl' + u, '#ffd0dc', '#ff6f91', '#b01c4a')}${G('rm' + u, '#ffe9c2', '#ffb36b', '#d4642a')}</defs>
      <g transform="translate(84 64) rotate(-14) scale(1.7)"><path d="M0 22C-26 4-22-16-9-16C-3-16 0-11 0-8C0-11 3-16 9-16C22-16 26 4 0 22Z" fill="url(#rl${u})"/><path d="M-14-8C-18-4-17 2-14 6" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none" opacity=".5"/></g>
      <g transform="translate(124 58) rotate(14) scale(1.3)"><path d="M0 22C-26 4-22-16-9-16C-3-16 0-11 0-8C0-11 3-16 9-16C22-16 26 4 0 22Z" fill="url(#rm${u})"/><path d="M-14-8C-18-4-17 2-14 6" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none" opacity=".5"/></g>
      ${star(28, 30, 5)}${star(176, 22, 4, 0.6)}${star(172, 98, 4, 0.55)}`,

    // Renda extra: moedas e seta subindo
    renda: (u) => `<defs>${G('rd' + u, '#eaffd8', '#5fd37a', '#1f7a3a')}${G('rn' + u, '#fff6c2', '#f2c444', '#a87a14')}</defs>
      <path d="M44 84L86 62L106 74L150 36M132 34H152V54" stroke="url(#rd${u})" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <g><ellipse cx="62" cy="104" rx="24" ry="8" fill="#a87a14"/><rect x="38" y="94" width="48" height="10" fill="#d6a42a"/><ellipse cx="62" cy="94" rx="24" ry="8" fill="url(#rn${u})"/>
      <ellipse cx="62" cy="86" rx="24" ry="8" fill="#a87a14"/><rect x="38" y="78" width="48" height="8" fill="#d6a42a"/><ellipse cx="62" cy="78" rx="24" ry="8" fill="url(#rn${u})"/></g>
      <text x="62" y="82" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-weight="800" font-size="11" fill="#8a6310">$</text>
      ${star(172, 94, 4, 0.6)}${star(26, 40, 4.5)}${star(110, 12, 3.5, 0.55)}`,

    // Zumbido no ouvido: orelha com ondas de som
    zumbido: (u) => `<defs>${G('zb' + u, '#e0e8ff', '#8aa4ff', '#3b4fb8')}</defs>
      <path d="M86 12C62 12 50 32 52 54C54 70 60 80 66 90C72 104 84 112 98 108C110 104 112 94 108 86C104 76 116 70 124 60C132 48 130 34 120 24C112 16 100 12 86 12Z" fill="url(#zb${u})"/>
      <path d="M84 26C70 26 64 40 66 54C68 66 74 72 78 82" stroke="#fff" stroke-width="4.5" stroke-linecap="round" fill="none" opacity=".92"/>
      <path d="M92 40C84 40 80 50 84 58C88 66 98 64 98 56C98 50 94 48 92 52" stroke="#fff" stroke-width="3.6" stroke-linecap="round" fill="none" opacity=".85"/>
      <path d="M104 84C108 92 104 100 96 102" stroke="#33449c" stroke-width="2.6" stroke-linecap="round" fill="none" opacity=".4"/>
      <path d="M142 38q10 20 0 40M154 26q16 32 0 64M166 14q22 44 0 88" stroke="#8aa4ff" stroke-width="3.2" stroke-linecap="round" fill="none" opacity=".85"/>
      ${star(28, 28, 5)}${star(30, 100, 4, 0.6)}`,

    // Mecanismos gerais: engrenagens
    mecanismos: (u) => {
      const gear = (cx, cy, r, n, f) => { let t = ''; for (let i = 0; i < n; i++) t += `<rect x="${cx - 5}" y="${cy - r - 7}" width="10" height="14" rx="2.5" transform="rotate(${((i / n) * 360).toFixed(1)} ${cx} ${cy})" fill="${f}"/>`; return `${t}<circle cx="${cx}" cy="${cy}" r="${r}" fill="${f}"/><circle cx="${cx}" cy="${cy}" r="${(r * 0.42).toFixed(1)}" fill="#14161b"/>`; };
      return `<defs>${G('mg' + u, '#e4ebf5', '#8d9bb0', '#46546a')}${G('mh' + u, '#d6f3ff', '#5fb4d8', '#1f6a8c')}</defs>
      ${gear(78, 62, 28, 10, `url(#mg${u})`)}${gear(134, 46, 20, 8, `url(#mh${u})`)}
      <path d="M118 96h10l6-14 8 22 6-12h14" stroke="#8fdcff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity=".9"/>
      ${star(28, 24, 4.5)}${star(176, 20, 4, 0.6)}${star(34, 104, 3.5, 0.5)}`;
    },

    // Pack de receitas: tigela com ingredientes
    pack: (u) => `<defs>${G('pk' + u, '#fff0d2', '#f2b25e', '#b06418')}</defs>
      <path d="M76 36c-6-8 6-12 0-22M100 32c-6-8 6-12 0-22M124 36c-6-8 6-12 0-22" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".55"/>
      <circle cx="80" cy="56" r="12" fill="#9be07a"/><circle cx="104" cy="50" r="14" fill="#ff8a5c"/><circle cx="126" cy="56" r="11" fill="#ffd34d"/>
      <path d="M46 62H154C154 92 130 108 100 108C70 108 46 92 46 62Z" fill="url(#pk${u})"/>
      <path d="M38 62H162" stroke="#fff0d2" stroke-width="6" stroke-linecap="round"/>
      <path d="M62 70C62 82 70 92 82 96" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".4"/>
      <path d="M150 28c10 2 16 10 14 20-10-2-16-10-14-20Z" fill="#74c45c"/>
      ${star(30, 30, 4.5)}${star(176, 98, 4, 0.6)}`,

    // Edição: claquete com play
    edicao: (u) => {
      let st = ''; for (let i = 0; i < 6; i++) st += `<path d="M${48 + i * 19} 24h10l-8 22h-10z" fill="#fff" opacity=".92"/>`;
      return `<defs>${G('ec' + u, '#d6efff', '#4fb0f0', '#1d62a8')}</defs>
      <rect x="40" y="24" width="120" height="22" rx="5" fill="#13202e"/>${st}
      <rect x="40" y="50" width="120" height="58" rx="8" fill="url(#ec${u})"/>
      <path d="M92 64L118 79L92 94Z" fill="#fff"/>
      <rect x="50" y="98" width="32" height="4" rx="2" fill="#fff" opacity=".45"/><rect x="118" y="98" width="32" height="4" rx="2" fill="#fff" opacity=".45"/>
      ${star(28, 30, 4.5)}${star(176, 100, 4, 0.6)}`;
    },

    // VSL: tela com play e barra de progresso
    vsl: (u) => `<defs>${G('vs' + u, '#ffd6d6', '#e85b5b', '#9a1c1c')}</defs>
      <rect x="30" y="16" width="140" height="80" rx="10" fill="#171a20" stroke="url(#vs${u})" stroke-width="3.5"/>
      <circle cx="100" cy="56" r="22" fill="url(#vs${u})"/><path d="M93 45L116 56L93 67Z" fill="#fff"/>
      <rect x="30" y="104" width="140" height="6" rx="3" fill="#2a2f38"/><rect x="30" y="104" width="88" height="6" rx="3" fill="#e85b5b"/><circle cx="118" cy="107" r="5" fill="#fff"/>
      ${star(24, 24, 4.5)}${star(178, 14, 4, 0.6)}`,
  };
  ART.ed18 = ART.ed; // ED +18 usa a arte do ED

  // Nicho sem ilustração própria (nicho novo que acabou de entrar): imagem automática com a cor e as iniciais do nicho.
  const autoArt = (n, cls) => {
    const u = 'a' + (++seq); const c = n.c || '#a4a8b0';
    const words = String(n.short || n.name || '?').replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean);
    const ini = ((words[0] || '?')[0] + (words[1] ? words[1][0] : (words[0] || '').length > 2 ? (words[0][1] || '') : '')).toUpperCase().replace(/[<>&]/g, '');
    return `<svg class="art${cls ? ' ' + cls : ''}" viewBox="0 0 200 120" aria-hidden="true"><defs><radialGradient id="au${u}" cx=".35" cy=".3" r=".95"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".4" stop-color="${c}"/><stop offset="1" stop-color="${c}" stop-opacity=".4"/></radialGradient></defs>
      <circle cx="100" cy="60" r="54" fill="none" stroke="${c}" stroke-width="2" stroke-dasharray="3 7" opacity=".55"/>
      <circle cx="100" cy="60" r="44" fill="url(#au${u})"/>
      <text x="100" y="75" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-weight="800" font-size="40" fill="#101216">${ini}</text>
      ${star(30, 28, 5)}${star(176, 24, 4, 0.6)}${star(172, 98, 4.5, 0.6)}${star(28, 96, 3.5, 0.5)}</svg>`;
  };

  // devolve o SVG do nicho (n = objeto do nicho, para a arte automática); '' se não há nada (o app cai no ícone de linha)
  window.BunkerArt = function (key, cls, n) {
    const f = ART[key]; if (!f) return n && n.key !== 'outro' ? autoArt(n, cls) : '';
    const u = 'a' + (++seq);
    return `<svg class="art${cls ? ' ' + cls : ''}" viewBox="0 0 200 120" aria-hidden="true">${f(u)}</svg>`;
  };
})();
