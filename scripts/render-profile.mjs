import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { toZhCn as toCn } from './zh-cn.mjs';

const root = new URL('../', import.meta.url);
const outDir = new URL('public/profile/', root);
const catalog = JSON.parse(readFileSync(new URL('src/data/projects.json', root), 'utf8'));

// ---------- validation (throws on failure) ----------
const KINDS = ['tool', 'research', 'learning', 'creative', 'other'];
const CASE_STUDIES = ['rigorgraph', 'sair-proof-press', 'proofweave', 'windows-contribution', 'honest-ci', 'miniharness', 'finite-witness'];
const fail = (message) => { throw new Error(`Invalid project catalog: ${message}`); };
const text = (value) => typeof value === 'string' && value.trim() !== '';
const lang = (value, where) => { if (!value || !text(value.zh) || !text(value.en)) fail(`${where} needs non-empty zh and en`); };
const https = (value, where) => {
  let url;
  try { url = new URL(value); } catch { fail(`${where} is not a URL: ${value}`); }
  if (url.protocol !== 'https:') fail(`${where} must be https: ${value}`);
};

if (catalog.schemaVersion !== 2) fail('schemaVersion must be 2');
const { profile, projects } = catalog;
if (!profile || !Array.isArray(projects)) fail('missing profile or projects');
lang(catalog.positioning, 'positioning');
const slugs = projects.map((p) => String(p.repo).split('/').at(-1));
if (new Set(slugs).size !== slugs.length) fail('repo slugs must be unique');
if (!Array.isArray(catalog.pinOrder) || catalog.pinOrder.length !== 6 || new Set(catalog.pinOrder).size !== 6 || catalog.pinOrder.some((slug) => !slugs.includes(slug))) fail('pinOrder must be six unique known slugs');
if (!Array.isArray(profile.facts) || profile.facts.length !== 3) fail('profile.facts must have 3 items');
profile.facts.forEach((fact, i) => lang(fact, `profile.facts[${i}]`));
if (!Array.isArray(profile.method) || profile.method.length !== 3) fail('profile.method must have 3 items');
profile.method.forEach((item, i) => { lang(item.title, `profile.method[${i}].title`); lang(item.body, `profile.method[${i}].body`); });
for (const key of ['about', 'learning', 'methodNote', 'filmsIntro', 'negativesIntro']) lang(profile[key], `profile.${key}`);
if (!profile.now || !/^\d{4}-(0[1-9]|1[0-2])$/.test(profile.now.asOf)) fail('profile.now.asOf must be YYYY-MM');
if (!Array.isArray(profile.now.items)) fail('profile.now.items must be an array');
profile.now.items.forEach((item, i) => lang(item, `profile.now.items[${i}]`));
if (!Array.isArray(profile.contributions)) fail('profile.contributions must be an array');
profile.contributions.forEach((c, i) => {
  if (!text(c.repo)) fail(`contributions[${i}].repo`);
  https(c.url, `contributions[${i}].url`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(c.merged)) fail(`contributions[${i}].merged must be YYYY-MM-DD`);
  lang(c.title, `contributions[${i}].title`);
  if (c.caseStudy !== undefined && !CASE_STUDIES.includes(c.caseStudy)) fail(`contributions[${i}].caseStudy unknown: ${c.caseStudy}`);
});
for (const p of projects) {
  if (!KINDS.includes(p.kind)) fail(`unknown kind for ${p.name}`);
  for (const key of ['name', 'status', 'descZh', 'descEn', 'repo']) if (!text(p[key])) fail(`${p.name || '(unnamed)'} missing ${key}`);
  if (!Array.isArray(p.links)) fail(`${p.name} links must be an array`);
  if (p.kind === 'creative' && !(text(p.watch) && text(p.made))) fail(`${p.name} (creative) requires watch and made`);
  if (p.kind !== 'creative' && p.watch !== undefined) fail(`${p.name} has watch but is not creative`);
  if (p.negative !== undefined) lang(p.negative, `${p.name}.negative`);
  for (const [where, url] of [['repo', p.repo], ['live', p.live], ['watch', p.watch], ...p.links.map((l, i) => [`links[${i}]`, l.url])]) if (url !== undefined) https(url, `${p.name}.${where}`);
}

// ---------- shared helpers ----------
const MONTHS = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};
const formatMonth = (asOf, locale) => {
  const [year, month] = asOf.split('-');
  return locale === 'en' ? `${MONTHS.en[Number(month) - 1]} ${year}` : `${year} 年 ${Number(month)} 月`;
};
const bySlug = (slug) => projects.find((p) => p.repo.endsWith(`/${slug}`));
const pinned = catalog.pinOrder.map(bySlug);
const films = projects.filter((p) => p.kind === 'creative');
const negatives = projects.filter((p) => p.negative);
const SITE = 'https://f0909172434.github.io/';
const SOURCE = 'https://github.com/f0909172434/f0909172434.github.io/blob/main/src/data/projects.json';

const STRINGS = {
  en: {
    key: 'en',
    other: 'English · [繁體中文](README.zh-TW.md) · [简体中文](README.zh-CN.md)',
    links: `[Portfolio](${SITE}?lang=en) · [CV (PDF)](${SITE}Chih-Kai-Wang-CV.pdf) · [Email](mailto:f0909172434@gmail.com)`,
    now: `Now · ${formatMonth(profile.now.asOf, 'en')}`,
    selected: 'Selected work', head: '| Project | What it does | Status | Open |',
    live: 'Live', watch: 'Watch', source: 'Source',
    how: 'How I work', films: 'Films made as code', negatives: 'Negative results, kept',
    merged: 'Merged upstream', caseStudy: 'case study', everything: 'Everything else',
    kinds: { tool: 'Tools', research: 'Research', learning: 'Learning', other: 'Other' },
    note: `<sub>Generated from <a href="${SOURCE}">projects.json</a> by <code>scripts/render-profile.mjs</code>; edits by hand are overwritten.</sub>`,
    sentence: (f) => `${f[1].en}. ${f[0].en}. ${f[2].en}.`,
    period: '.',
  },
  zh: {
    key: 'zh',
    other: '[English](README.md) · 繁體中文 · [简体中文](README.zh-CN.md)',
    links: `[作品集](${SITE}?lang=zh-Hant) · [履歷 PDF](${SITE}Chih-Kai-Wang-CV.pdf) · [Email](mailto:f0909172434@gmail.com)`,
    now: `近況 · ${formatMonth(profile.now.asOf, 'zh')}`,
    selected: '精選作品', head: '| 專案 | 做什麼 | 狀態 | 開啟 |',
    live: '實際網站', watch: '觀看', source: '原始碼',
    how: '我怎麼工作', films: '以程式完成的影片', negatives: '留下來的負面結果',
    merged: '已合併的上游貢獻', caseStudy: '案例', everything: '其他作品',
    kinds: { tool: '工具', research: '研究', learning: '學習', other: '其他' },
    note: `<sub>由 <a href="${SOURCE}">projects.json</a> 經 <code>scripts/render-profile.mjs</code> 產生；手動修改會被覆蓋。</sub>`,
    sentence: (f) => `${f[1].zh}。${f[0].zh}。${f[2].zh}。`,
    period: '。',
  },
};

function renderReadme(s) {
  const L = s.key;
  const desc = (p) => (L === 'en' ? p.descEn : p.descZh);
  const live = (p) => (L === 'en' ? p.live.replace('?lang=zh-Hant', '?lang=en') : p.live);
  const open = (p) => (p.live ? `[${s.live}](${live(p)})` : p.watch ? `[${s.watch}](${p.watch})` : `[${s.source}](${p.repo})`);
  const rows = pinned.map((p) => `| **[${p.name}](${p.repo})** | ${desc(p)} | ${p.status} | ${open(p)} |`);
  const heroAlt = 'Chih-Kai Wang — claims, with the evidence attached. A four-cycle C4: four vertices of degree 2, zero triangles.';
  const groups = ['tool', 'research', 'learning', 'other'].map((kind) => {
    const items = projects.filter((p) => p.kind === kind && !catalog.pinOrder.includes(p.repo.split('/').at(-1)));
    return items.length ? `**${s.kinds[kind]}**\n\n${items.map((p) => `- [${p.name}](${p.repo}) — ${desc(p)} *${p.status}*`).join('\n')}` : null;
  }).filter(Boolean);
  const sections = [
    `<picture>\n  <source media="(prefers-color-scheme: dark)" srcset="assets/profile-hero-dark.svg">\n  <img src="assets/profile-hero.svg" alt="${heroAlt}" width="100%">\n</picture>`,
    s.other,
    '# Chih-Kai Wang 王治凱',
    catalog.positioning[L],
    s.sentence(profile.facts),
    s.links,
    `## ${s.now}\n\n${profile.now.items.map((item) => `- ${item[L]}`).join('\n')}`,
    `## ${s.selected}\n\n${s.head}\n|---|---|---|---|\n${rows.join('\n')}`,
    `## ${s.how}`,
    ...profile.method.map((m) => `**${m.title[L]}${s.period}** ${m.body[L]}`),
    profile.methodNote[L],
    `## ${s.films}\n\n${profile.filmsIntro[L]}\n\n${films.map((p) => `- **[${p.name}](${p.repo})** — ${desc(p)} \`${p.made}\` · [${s.watch}](${p.watch})`).join('\n')}`,
    `## ${s.negatives}\n\n${profile.negativesIntro[L]}\n\n${negatives.map((p) => `- **[${p.name}](${p.repo})** — ${p.negative[L]}`).join('\n')}`,
    `## ${s.merged}\n\n${profile.contributions.map((c) => `- [${c.repo}](${c.url}) — ${c.title[L]} (${c.merged})${c.caseStudy ? ` · [${s.caseStudy}](case-studies/${c.caseStudy}.md)` : ''}`).join('\n')}`,
    `## ${s.everything}\n\n${groups.join('\n\n')}`,
    s.note,
  ];
  return `${sections.join('\n\n')}\n`;
}

// ---------- hero SVG ----------
const HERO_PALETTE = {
  light: { bg: '#f6f3ec', ink: '#1c1b17', muted: '#6b675e', line: '#d9d4c8', accent: '#a8471f' },
  dark: { bg: '#171613', ink: '#ebe6da', muted: '#948f84', line: '#35332d', accent: '#e0865c' },
};
const MONO = 'ui-monospace, Menlo, Consolas, "Courier New", monospace';
const SERIF = 'Georgia, "Times New Roman", "Songti TC", serif';
const SANS = '-apple-system, "Segoe UI", "Helvetica Neue", Arial, "PingFang TC", "Microsoft JhengHei", sans-serif';
export function renderHero(theme) {
  const c = HERO_PALETTE[theme];
  const V = [[938, 56], [1082, 56], [1082, 200], [938, 200]];
  const off = [[-18, 4], [18, 4], [18, 4], [-18, 4]];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="300" viewBox="0 0 1200 300" role="img" aria-labelledby="t d">
<title id="t">Chih-Kai Wang — claims, with the evidence attached</title>
<desc id="d">A four-cycle C4 drawn as a counterexample: four vertices of degree two and no triangle.</desc>
<rect width="1200" height="300" fill="${c.bg}"/>
<path d="M56 256H1144" stroke="${c.line}" stroke-width="1"/>
<text x="56" y="72" font-family='${MONO}' font-size="13" letter-spacing="2" fill="${c.muted}">CHIH-KAI WANG · 王治凱 · TAIPEI · NTUE 2028</text>
<text font-family='${SERIF}' font-size="60" fill="${c.ink}"><tspan x="56" y="140">Claims, with the</tspan><tspan x="56" y="206">evidence attached.</tspan></text>
<text x="56" y="240" font-family='${SANS}' font-size="17" fill="${c.muted}">Inspectable AI and mathematical research tools · Python &amp; TypeScript</text>
<text x="56" y="282" font-family='${MONO}' font-size="11" letter-spacing="1.2" fill="${c.muted}">CLAIM → EVIDENCE → BOUNDARY · NEGATIVE RESULTS KEPT · BUILT WITH CLAUDE CODE AND CODEX</text>
<path d="M938 56L1082 200M1082 56L938 200" stroke="${c.line}" stroke-width="1" stroke-dasharray="3 6"/>
<path d="M938 56H1082V200H938Z" fill="none" stroke="${c.accent}" stroke-width="3" stroke-linejoin="round" stroke-dasharray="576" stroke-dashoffset="0"><animate attributeName="stroke-dashoffset" from="576" to="0" dur="1.4s" begin="0s" fill="freeze" calcMode="spline" keySplines="0.2 0.7 0.2 1" keyTimes="0;1"/></path>
${V.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="9" fill="${c.accent}"/><text x="${x + off[i][0]}" y="${y + off[i][1]}" font-family='${MONO}' font-size="12" fill="${c.muted}" text-anchor="${off[i][0] < 0 ? 'end' : 'start'}">v${i + 1}</text>`).join('\n')}
<text x="1010" y="232" font-family='${MONO}' font-size="12" fill="${c.muted}" text-anchor="middle">C₄ · candidate 39 · min degree 2 · 0 triangles</text>
<text x="1010" y="248" font-family='${MONO}' font-size="11" fill="${c.muted}" text-anchor="middle">one counterexample disproves a universal claim</text>
</svg>
`;
}

// ---------- outputs ----------
// zh-CN is derived from the zh-TW render (phrase-level twp -> cn); the language line is restated explicitly.
const zhTw = renderReadme(STRINGS.zh);
const zhCn = toCn(zhTw).replace(toCn(STRINGS.zh.other), '[English](README.md) · [繁體中文](README.zh-TW.md) · 简体中文');
if (!zhCn.includes('· 简体中文\n')) throw new Error('zh-CN language line was not substituted');
const outputs = {
  'README.md': renderReadme(STRINGS.en),
  'README.zh-TW.md': zhTw,
  'README.zh-CN.md': zhCn,
  'profile-hero.svg': renderHero('light'),
  'profile-hero-dark.svg': renderHero('dark'),
};

if (process.argv.includes('--check')) {
  for (const [name, content] of Object.entries(outputs)) {
    let current = null;
    try { current = readFileSync(new URL(name, outDir), 'utf8'); } catch { /* missing counts as drift */ }
    if (current !== content) throw new Error(`public/profile/${name} is out of date. Run npm run profile to refresh it.`);
  }
  console.log('Project catalog and generated profile are consistent.');
} else {
  mkdirSync(outDir, { recursive: true });
  for (const [name, content] of Object.entries(outputs)) writeFileSync(new URL(name, outDir), content);
  console.log(`Wrote ${Object.keys(outputs).length} files to ${fileURLToPath(outDir)}`);
}
