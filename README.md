# ShippingCaps · Bunker

Versão nova do Bunker (briefs de VSL e Ads, processos e entregas), feita com Claude em HTML, CSS e JavaScript puros, sem Lovable e sem build.

Site: https://harrycopy.github.io/bunker/

**Ligado no mesmo banco do Bunker do Lovable**: mesmo login, mesma equipe, mesmos briefs. O que muda aqui aparece lá e o contrário também. As regras de acesso continuam no banco: todo mundo da equipe lê, só o Edson cria, edita, exclui e convida.

Demo com dados de exemplo, sem tocar no banco: https://harrycopy.github.io/bunker/?demo

## O que tem

- Painel: radar dos nichos, indicadores, parede de nichos, últimos briefs com atalho para Docs e Drive, movimento da equipe e ritmo de entregas.
- Briefs em galeria ou tabela, busca, filtro por nicho e tipo, ordem.
- Página do brief com Docs, Drive, prévia do Doc, edição (para o Edson) e histórico.
- Processos, Calendário, Controle (histórico) e Equipe (convites e acessos).
- Tema escuro e claro (fica salvo), busca rápida com ⌘K, celular.

## Atualizar

Subir os arquivos alterados e trocar o `?v=N` dos links de CSS e JS no `index.html`, senão o navegador usa o cache.

## Aba Edição (31/10/2026)

- Item "Edição" no menu: briefings de edição por nicho (Docs de até 15 ads) com o Drive do Bunker de inserts do nicho.
- No banco, sem mudar esquema: raiz "02 - Briefs de Edição" (kind page, section vazio, como Processos) e um item por Doc (kind page, parent = raiz, offer = nicho, docs_url, drive_url).
- app.js v=8, seed.js v=2, style.css v=5. Template: `01 Método TGI/Templates e padrões/TEMPLATE BRIEFING DE EDIÇÃO.md`.

## Aba Validados Internos (09/11/2026)

- Item "Validados Internos" no menu: Docs de brief de copy e de edição dos ads validados internos, agrupados por nicho.
- No banco, sem mudar esquema: raiz "03 - Validados Internos" (kind page, section vazio) e um item por Doc (kind page, parent = raiz, offer = nicho, docs_url, drive_url).
- app.js v=9, seed.js v=3.

## Menu com rolagem e abas novas (17/11/2026)

- Menu de cima com setas nas pontas, rolagem pela roda do mouse e borda esmaecida quando tem mais item (pedido do Harry: "tá ficando tudo grudado").
- Abas: Briefs Notion, Validados Internos, Edição Notion, Edição Internos (raiz "04 - Edição Internos") e Bunker de Inserts (raiz "05 - Bunker de Inserts", um card por nicho com o Drive do Bunker de inserts). As raízes e os cards já estão no banco desde 17/11.
- A raiz de Edição Notion agora é achada por "edicao" sem "interno" (senão pegava a Edição Internos).
- app.js v=10, style.css v=6. Publicado em 17/11 (commit "Bunker v10" no main do Harrycopy/bunker, upload pelo Chrome logado), conferido no ar.

## Imagens de nichos novos e nicho automático (17/11/2026)

- Bunker de Inserts ganhou um card por biblioteca do StockFrame (21 nichos). Os novos apareciam como "OUTRO" com ícone de documento.
- `art.js` v=2: ilustrações novas (Próstata, Dores Articulares, Gravidez, Intestino, Prosperidade/Religioso, Reações UGC, Rejuvenescimento, Relacionamento, Renda Extra, Zumbido, ED +18, Mecanismos Gerais, Pack de Receitas, Edição, VSL) no mesmo estilo das antigas.
- **Nicho novo nasce com imagem:** oferta curta de um card de inserts, edição, validado ou brief que não está na lista vira nicho automático (`dynNiche` no app.js) com cor própria (a partir do nome) e imagem automática (círculo com as iniciais, `autoArt` no art.js). Para dar arte desenhada a um nicho depois, é só incluir em `NICHES` (app.js) e em `ART` (art.js).
- `lib: true` nos nichos novos: não aparecem como tile no painel nem no radar enquanto não tiverem brief.
- Os botões de nicho do Bunker de Inserts incluem os nichos automáticos.
- app.js v=11, art.js v=2.


## Aba Clusters (25/11/2026)

- Item "Clusters" no menu: por nicho, o Cluster 01, 02 e 03 de cada mês (mês da página do SWIPE no Notion) e o Hall da Fama (o montante de todos os meses), de copy e de edição, e a tabela "mês contra Hall da Fama" (igual ou mudou).
- Os dados ficam em `clusters.json` (sem banco): gerado por `~/claude-trabalho/briefing-edicao-bunker/site/monta_clusters_json.py` a partir dos clusters mensais do vault (`15 Bunker/<Nicho>/Clusters/Mensais/`), do Hall da Fama e dos clusters de edição. Para atualizar, só subir o `clusters.json` novo: o app busca com marca de tempo e não precisa trocar `?v=`.
- app.js v=12. Publicado em 25/11 (commit "Bunker v12: aba Clusters (mensal e Hall da Fama)" no main do Harrycopy/bunker, upload pelo Chrome logado), conferido no ar.
