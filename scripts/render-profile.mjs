import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { toZhCn as toCn } from './zh-cn.mjs';
import { card, filmPlayer, footer, hero } from './profile/art.mjs';
import { TAGLINES } from './profile/runs.mjs';

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
const ui = JSON.parse(readFileSync(new URL('src/data/ui.json', root), 'utf8'));
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const formatMonth = (asOf, locale) => {
  const [year, month] = asOf.split('-');
  return locale === 'en' ? `${MONTHS[Number(month) - 1]} ${year}` : `${year} 年 ${Number(month)} 月`;
};
const slugOf = (p) => p.repo.split('/').at(-1);
const bySlug = (slug) => projects.find((p) => slugOf(p) === slug);
const pinned = catalog.pinOrder.map(bySlug);
const films = projects.filter((p) => p.kind === 'creative');
const negatives = projects.filter((p) => p.negative);
const counts = { projects: projects.length, negatives: negatives.length, merged: profile.contributions.length };
const sha = createHash('sha256').update(readFileSync(new URL('src/data/projects.json', root))).digest('hex');
const SITE = 'https://f0909172434.github.io/';
const SOURCE = 'https://github.com/f0909172434/f0909172434.github.io/blob/main/src/data/projects.json';
const FILM_SCREEN = {
  ORACLE: { id: 'oracle', file: 'oracle.mp4', length: '4:30' },
  'The-Disease-Called-AI': { id: 'disease', file: 'the-disease-called-ai.mp4', length: '3:35' },
  'world-execute-me-claude-code': { id: 'world', file: 'world.execute-me.cast', length: 'tty' },
};
const LOCALES = { en: 'en', 'zh-TW': 'zh', 'zh-CN': 'zh' };

const STRINGS = {
  en: {
    other: '<b>English</b> · <a href="README.zh-TW.md">繁體中文</a> · <a href="README.zh-CN.md">简体中文</a>',
    links: `<a href="${SITE}?lang=en">Portfolio</a> · <a href="${SITE}Chih-Kai-Wang-CV.pdf">CV (PDF)</a> · <a href="mailto:f0909172434@gmail.com">Email</a>`,
    selected: 'Selected work', films: 'Films made as code', negatives: 'Negative results, kept', how: 'How I work',
    now: (d) => `Now · ${d}`, merged: 'Merged upstream', caseStudy: 'case study', watch: 'Watch',
    runsNote: 'Each terminal replays a real run against the commit it names; the output is copied, not written.',
    everything: (n) => `<b>Everything else</b> — ${n} more records`,
    kinds: { tool: 'Tools', research: 'Research', learning: 'Learning', other: 'Other' },
    heroAlt: 'Chih-Kai Wang — a terminal session that prints a short profile: Taipei; Python and TypeScript tools for inspectable AI and mathematical research; open to software and AI internships.',
    note: `<sub>Generated from <a href="${SOURCE}">projects.json</a> by <code>scripts/render-profile.mjs</code>; edits by hand are overwritten. Motion respects <code>prefers-reduced-motion</code>.</sub>`,
    period: '.',
  },
  zh: {
    other: '<a href="README.md">English</a> · <b>繁體中文</b> · <a href="README.zh-CN.md">简体中文</a>',
    links: `<a href="${SITE}?lang=zh-Hant">作品集</a> · <a href="${SITE}Chih-Kai-Wang-CV.pdf">履歷 PDF</a> · <a href="mailto:f0909172434@gmail.com">Email</a>`,
    selected: '精選作品', films: '以程式完成的影片', negatives: '留下來的負面結果', how: '我怎麼工作',
    now: (d) => `近況 · ${d}`, merged: '已合併的上游貢獻', caseStudy: '案例', watch: '觀看',
    runsNote: '每個終端機畫面都重播一次對指定 commit 的真實執行；輸出是複製的，不是寫出來的。',
    everything: (n) => `<b>其他作品</b> — 還有 ${n} 筆記錄`,
    kinds: { tool: '工具', research: '研究', learning: '學習', other: '其他' },
    heroAlt: '王治凱 — 一段終端機會話，印出簡短的自我介紹：台北；做可檢查的 AI 與數學研究工具（Python 與 TypeScript）；尋找軟體與 AI 實習。',
    note: `<sub>由 <a href="${SOURCE}">projects.json</a> 經 <code>scripts/render-profile.mjs</code> 產生；手動修改會被覆蓋。動畫會遵守 <code>prefers-reduced-motion</code>。</sub>`,
    period: '。',
  },
};

const pic = (base, alt, width) => `<picture><source media="(prefers-color-scheme: dark)" srcset="assets/${base}-dark.svg"><img src="assets/${base}-light.svg" alt="${alt.replace(/"/g, '&quot;')}" width="${width}"></picture>`;
const cmd = (c) => ` &nbsp;<sub><code>${c}</code></sub>`;

function renderReadme(loc) {
  const L = LOCALES[loc], s = STRINGS[L];
  const desc = (p) => (L === 'en' ? p.descEn : p.descZh);
  const live = (p) => (L === 'en' && p.live ? p.live.replace('?lang=zh-Hant', '?lang=en') : p.live);
  const cards = pinned.map((p) => {
    const slug = slugOf(p);
    const tag = L === 'en' ? TAGLINES[slug].en : TAGLINES[slug].zh;
    return `<a href="${live(p) ?? p.watch ?? p.repo}">${pic(`card-${slug}-${loc}`, `${p.name} — ${tag}`, '49%')}</a>`;
  });
  const players = films.map((p) => `<a href="${p.watch}">${pic(`film-${FILM_SCREEN[slugOf(p)].id}`, p.name, '32%')}</a>`);
  const groups = ['tool', 'research', 'learning', 'other'].map((kind) => {
    const items = projects.filter((p) => p.kind === kind && !catalog.pinOrder.includes(slugOf(p)));
    return items.length ? `**${s.kinds[kind]}**\n\n${items.map((p) => `- [${p.name}](${p.repo}) — ${desc(p)} *${p.status}*`).join('\n')}` : null;
  }).filter(Boolean);
  const rest = projects.filter((p) => p.kind !== 'creative' && !catalog.pinOrder.includes(slugOf(p))).length;
  const sections = [
    pic(`hero-${loc}`, s.heroAlt, '100%'),
    `<p>${s.other} &nbsp;│&nbsp; ${s.links}</p>`,
    `## ${s.selected}${cmd('ls -l --pinned')}\n\n<p>\n${cards.join('\n')}\n</p>\n\n<sub>${s.runsNote}</sub>`,
    `## ${s.films}${cmd('ckw play --loop *')}\n\n${profile.filmsIntro[L]}\n\n<p>\n${players.join('\n')}\n</p>\n\n${films.map((p) => `- **[${p.name}](${p.repo})** — ${desc(p)} \`${p.made}\` · [▶ ${s.watch}](${p.watch})`).join('\n')}`,
    `## ${s.negatives}${cmd('ckw verify --keep-negatives')}\n\n${profile.negativesIntro[L]}\n\n${negatives.map((p) => `- ✗ **[${p.name}](${p.repo})** — ${p.negative[L]}`).join('\n')}`,
    `## ${s.how}${cmd('git log --graph')}\n\n${profile.method.map((m, i) => `**\`0${i + 1}\` ${m.title[L]}${s.period}** ${m.body[L]}`).join('\n\n')}\n\n${profile.methodNote[L]}`,
    `## ${s.now(formatMonth(profile.now.asOf, L))}${cmd('ckw log --now')}\n\n${profile.now.items.map((item) => `- ${item[L]}`).join('\n')}`,
    `## ${s.merged}${cmd('gh pr list --state merged')}\n\n${profile.contributions.map((c) => `- [${c.repo}#${c.url.match(/\/pull\/(\d+)/)?.[1] ?? ''}](${c.url}) — ${c.title[L]} <sub>${c.merged}</sub>${c.caseStudy ? ` · [${s.caseStudy}](case-studies/${c.caseStudy}.md)` : ''}`).join('\n')}`,
    `<details>\n<summary>${s.everything(rest)}</summary>\n\n${groups.join('\n\n')}\n\n</details>`,
    pic(`footer-${loc}`, 'exit', '100%'),
    s.note,
  ];
  return `${sections.join('\n\n')}\n`;
}

// ---------- outputs ----------
const toLocale = (loc) => (loc === 'zh-CN' ? toCn : (x) => x);
const uiFor = (loc) => (loc === 'en' ? ui.en : ui['zh-Hant']);
const zhTw = renderReadme('zh-TW');
const zhCn = toCn(zhTw).replace(toCn(STRINGS.zh.other), '<a href="README.md">English</a> · <a href="README.zh-TW.md">繁體中文</a> · <b>简体中文</b>').replaceAll('-zh-TW-', '-zh-CN-').replaceAll('lang=zh-Hant', 'lang=zh-Hans');
if (!zhCn.includes('<b>简体中文</b>')) throw new Error('zh-CN language line was not substituted');
const outputs = { 'README.md': renderReadme('en'), 'README.zh-TW.md': zhTw, 'README.zh-CN.md': zhCn };
for (const theme of ['dark', 'light']) {
  for (const loc of ['en', 'zh-TW', 'zh-CN']) {
    const args = { theme, locale: loc, ui: uiFor(loc), zh: toLocale(loc), catalog, counts, sha, month: formatMonth(profile.now.asOf, LOCALES[loc]) };
    outputs[`assets/hero-${loc}-${theme}.svg`] = await hero(args);
    outputs[`assets/footer-${loc}-${theme}.svg`] = await footer(args);
    for (const [i, p] of pinned.entries()) outputs[`assets/card-${slugOf(p)}-${loc}-${theme}.svg`] = await card({ ...args, project: p, index: i + 1 });
  }
  for (const p of films) outputs[`assets/film-${FILM_SCREEN[slugOf(p)].id}-${theme}.svg`] = await filmPlayer({ theme, project: p, ...FILM_SCREEN[slugOf(p)] });
}

const listFiles = (dir) => {
  const out = [];
  const walk = (d, pre) => { let ents = []; try { ents = readdirSync(d, { withFileTypes: true }); } catch { return; } for (const e of ents) { if (e.isDirectory()) walk(join(d, e.name), `${pre}${e.name}/`); else out.push(`${pre}${e.name}`); } };
  walk(dir, '');
  return out;
};
const outPath = fileURLToPath(outDir);
if (process.argv.includes('--check')) {
  for (const [name, content] of Object.entries(outputs)) {
    let current = null;
    try { current = readFileSync(new URL(name, outDir), 'utf8'); } catch { /* missing counts as drift */ }
    if (current !== content) throw new Error(`public/profile/${name} is out of date. Run npm run profile to refresh it.`);
  }
  const stale = listFiles(outPath).filter((f) => !(f in outputs));
  if (stale.length) throw new Error(`public/profile has files the generator no longer writes: ${stale.join(', ')}`);
  console.log('Project catalog and generated profile are consistent.');
} else {
  for (const f of listFiles(outPath)) if (!(f in outputs)) rmSync(join(outPath, f));
  let bytes = 0;
  for (const [name, content] of Object.entries(outputs)) { mkdirSync(dirname(join(outPath, name)), { recursive: true }); writeFileSync(join(outPath, name), content); bytes += Buffer.byteLength(content); }
  console.log(`Wrote ${Object.keys(outputs).length} files (${(bytes / 1024).toFixed(0)} KB) to ${outPath}`);
}
