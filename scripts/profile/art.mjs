// The profile README's images: hero session, pinned-project cards, ASCII film players, status-line footer.
// Same visual language as the site (src/styles): one monospaced grid, colour as meaning.
import { Doc, TONES, emWidth, esc, round as r, typed, wrap } from './kit.mjs';
import { dotText } from './dots.mjs';
import { FILMS } from '../../src/art/films.ts';
import { RUNS, TAGLINES } from './runs.mjs';

const EASE = 'cubic-bezier(.2,.7,.2,1)';
const fadeIn = (delay, dur = 0.5) => `class="in" style="animation-delay:${r(delay)}s;animation-duration:${dur}s"`;

function frame(doc, { x = 0.5, y = 0.5, w = doc.w - 1, h = doc.h - 1, rx = 12 } = {}) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${doc.c.bg}" stroke="${doc.c.line2}"/>`;
}
function bar(doc, { h = 36, left = [], right = [], y = 0 } = {}) {
  const c = doc.c;
  let out = `<path d="M0.5 ${y + h}H${doc.w - 0.5}" stroke="${c.line}"/>`;
  out += `<path d="M12.5 ${y + 0.5}H${doc.w - 12.5}A12 12 0 0 1 ${doc.w - 0.5} ${y + 12.5}V${y + h}H0.5V${y + 12.5}A12 12 0 0 1 12.5 ${y + 0.5}Z" fill="${c.bg1}"/>`;
  let x = 0;
  for (const seg of left) {
    const w = seg.w ?? emWidth(seg.s) * 12.5 + 26;
    if (seg.bg) out += `<rect x="${x + (x === 0 ? 0.5 : 0)}" y="${y + 0.5}" width="${w}" height="${h - 0.5}" fill="${seg.bg}"${x === 0 ? ' rx="0"' : ''}/>`;
    if (x === 0 && seg.bg) out += `<path d="M12.5 ${y + 0.5}H${w}V${y + h}H0.5V${y + 12.5}A12 12 0 0 1 12.5 ${y + 0.5}Z" fill="${seg.bg}"/>`;
    out += doc.t(x + 13, y + h / 2 + 4.5, seg.s, { size: 12.5, fill: seg.fill ?? c.dim, face: seg.face ?? 'mono' });
    if (seg.sep !== false) out += `<path d="M${x + w} ${y + 0.5}V${y + h}" stroke="${c.line}"/>`;
    x += w;
  }
  let rx = doc.w;
  for (const seg of right) {
    const w = emWidth(seg.s) * 12.5 + 26;
    rx -= w;
    out += doc.t(rx + 13, y + h / 2 + 4.5, seg.s, { size: 12.5, fill: seg.fill ?? c.dim, face: seg.face ?? 'mono' });
    out += `<path d="M${rx} ${y + 0.5}V${y + h}" stroke="${c.line}"/>`;
  }
  return out;
}
function prompt(doc, x, y, cwd, { size = 14, extra } = {}) {
  const parts = [['ckw', doc.c.green, 'bold'], [' ', doc.c.ink], [cwd, doc.c.blue]];
  if (extra) parts.push(['  ', doc.c.ink], [extra, doc.c.faint]);
  return doc.runs(x, y, parts, { size });
}

// ---------------------------------------------------------------- hero
export async function hero({ theme, locale, ui, catalog, counts, sha, zh }) {
  const W = 1200;
  const doc = new Doc({ w: W, h: 700, theme, locale, title: 'Chih-Kai Wang — ckw whoami', desc: 'A terminal session: the name drawn as a dot matrix, then a short profile. Chih-Kai Wang, Taipei; Python and TypeScript tools for inspectable AI and mathematical research.' });
  const c = doc.c, L = (v) => (locale === 'en' ? v.en : zh(v.zh));
  const nav = ui.nav;
  const chrome = () => frame(doc) + bar(doc, {
    left: [
      { s: '[ckw]', bg: c.green, fill: c.bg, face: 'xbold' },
      ...['top', 'work', 'negatives', 'cases', 'method', 'films', 'log', 'about'].map((k, i) => ({ s: `${i} ${nav[k]}${i === 0 ? '*' : ''}`, fill: i === 0 ? c.ink : c.dim, bg: i === 0 ? c.bg2 : undefined })),
    ],
    right: [{ s: 'TPE  UTC+8', fill: c.ink2 }],
  });
  let body = '';
  const X = 56;
  body += prompt(doc, X, 92, '~');
  const p0 = X + emWidth('ckw ~ ') * 15;
  body += doc.t(p0, 92, '❯', { size: 15, fill: c.amber });
  const cmd = typed(doc, p0 + 15 * 1.2, 92, 'ckw whoami', { size: 15, start: 0.45, cps: 20 });
  body += cmd.svg;
  body += doc.t(W - X, 92, `sha256 ${sha.slice(0, 8)}`, { size: 12, fill: c.faint, anchor: 'end' });

  // dot-matrix name
  const pitch = 6.4, dot = 4.3;
  const grid = dotText(['CHIH-KAI WANG'], Math.floor((W - 2 * X) / pitch));
  const gy = 124, t0 = cmd.end + 0.25, sweep = 1.15;
  body += `<defs><pattern id="g" width="${pitch}" height="${pitch}" patternUnits="userSpaceOnUse" x="${X}" y="${gy}"><rect x="${r(pitch / 2 - 0.65)}" y="${r(pitch / 2 - 0.65)}" width="1.3" height="1.3" fill="${c.line2}"/></pattern>`;
  body += `<linearGradient id="scan" x1="0" x2="1"><stop offset="0" stop-color="${c.green}" stop-opacity="0"/><stop offset="1" stop-color="${c.green}" stop-opacity=".35"/></linearGradient></defs>`;
  body += `<rect x="${X}" y="${gy}" width="${r(grid.cols * pitch)}" height="${r(grid.rows * pitch)}" fill="url(#g)"/>`;
  const BAND = 5;
  for (let b = 0; b * BAND < grid.cols; b++) {
    let d = '';
    for (let y = 0; y < grid.rows; y++) for (let x = b * BAND; x < Math.min(grid.cols, (b + 1) * BAND); x++) {
      if (grid.on[y * grid.cols + x]) d += `M${r(X + x * pitch + (pitch - dot) / 2)} ${r(gy + y * pitch + (pitch - dot) / 2)}h${dot}v${dot}h-${dot}z`;
    }
    if (d) body += `<path class="dec" d="${d}" fill="${c.ink}" style="animation-delay:${r(t0 + (b * BAND / grid.cols) * sweep + ((b * 7) % 5) * 0.03)}s"/>`;
  }
  const gw = grid.cols * pitch, gh = grid.rows * pitch;
  body += `<g class="scan" style="animation-delay:${r(t0)}s;animation-duration:${sweep + 0.12}s"><rect x="${X - 90}" y="${gy - 4}" width="90" height="${r(gh + 8)}" fill="url(#scan)"/><rect x="${X - 1.5}" y="${gy - 4}" width="1.5" height="${r(gh + 8)}" fill="${c.green}"/></g>`;

  // profile: neofetch on the left, positioning on the right
  const top = gy + gh + 38, t1 = t0 + sweep + 0.1;
  body += `<path d="M${X} ${top - 0.5}H${W - X}" stroke="${c.line2}" stroke-dasharray="3 4" ${fadeIn(t1 - 0.2)}/>`;
  const k = ui.hero.keys, [based, study] = catalog.profile.facts;
  const rows = [
    [k.name, locale === 'en' ? 'Chih-Kai Wang · 王治凱' : '王治凱 · Chih-Kai Wang'],
    [k.study, L(study)],
    [k.based, `${L(based)} · UTC+8`],
    [k.stack, zh(ui.hero.stack)],
    [k.agents, ui.hero.agents],
    [k.records, zh(ui.hero.records.replace('{projects}', counts.projects).replace('{negatives}', counts.negatives).replace('{merged}', counts.merged))],
    [k.status, zh(ui.hero.status)],
  ];
  let y = top + 34;
  body += `<g ${fadeIn(t1)}>${doc.runs(X, y, [['chih-kai', c.green, 'bold'], ['@', c.dim], ['taipei', c.green, 'bold']], { size: 14 })}</g>`;
  body += `<path d="M${X} ${y + 12.5}H${X + 128}" stroke="${c.faint}" ${fadeIn(t1 + 0.04)}/>`;
  y += 38;
  const keyW = 8 * 14 * 0.6 + 16, valMax = (560 - keyW) / 13.5;
  rows.forEach(([key, val], i) => {
    const lines = wrap(String(val), valMax);
    const ok = i === rows.length - 1;
    let g = doc.t(X, y, zh(key), { size: 13.5, fill: c.green, face: 'bold' });
    lines.forEach((ln, j) => { g += doc.t(X + keyW + (ok ? 16 : 0), y + j * 22, ln, { size: 13.5, fill: ok ? c.green : c.ink }); });
    if (ok) g += `<circle cx="${X + keyW + 4}" cy="${y - 4.5}" r="4" fill="${c.green}"/><circle class="ring" cx="${X + keyW + 4}" cy="${y - 4.5}" r="4" fill="none" stroke="${c.green}"/>`;
    body += `<g ${fadeIn(t1 + 0.08 + i * 0.045)}>${g}</g>`;
    y += lines.length * 22 + 2;
  });
  const sw = ['ink', 'ink2', 'dim', 'green', 'amber', 'red', 'blue', 'violet'];
  body += `<g ${fadeIn(t1 + 0.45)}>${sw.map((s, i) => `<rect x="${X + i * 26}" y="${y + 2}" width="26" height="12" fill="${c[s]}"/>`).join('')}</g>`;

  const RX = 650, rmax = (W - X - RX) / 18;
  const pos = wrap(L(catalog.positioning), rmax - 2);
  let py = top + 40;
  pos.forEach((ln, i) => {
    body += `<g ${fadeIn(t1 + 0.2 + i * 0.05)}>${i === 0 ? doc.t(RX, py, '#', { size: 18, fill: c.dim }) : ''}${doc.t(RX + 18 * 1.2, py, ln, { size: 18, fill: c.ink, face: locale === 'en' ? 'italic' : 'mono' })}</g>`;
    py += 30;
  });
  py += 18;
  const t2 = t1 + 0.55;
  body += `<g ${fadeIn(t2)}>${prompt(doc, RX, py, '~', { size: 13 })}${doc.t(RX + emWidth('ckw ~ ') * 13, py, '❯ ckw log --now | head -2', { size: 13, fill: c.ink })}</g>`;
  py += 26;
  catalog.profile.now.items.slice(0, 2).forEach((item, i) => {
    const date = locale === 'en' ? 'Oct 2026' : '2026-10';
    const ind = emWidth(`● ${date}  `) * 13;
    const lines = wrap(L(item), (W - X - RX - ind) / 13);
    let g = doc.t(RX, py, '●', { size: 11, fill: c.amber }) + doc.t(RX + 13 * 1.2, py, date, { size: 13, fill: c.dim });
    lines.forEach((ln, j) => { g += doc.t(RX + ind, py + j * 21, ln, { size: 13, fill: c.ink2 }); });
    body += `<g ${fadeIn(t2 + 0.12 + i * 0.08)}>${g}</g>`;
    py += lines.length * 21 + 8;
  });

  // closing prompt; the image is as tall as its content
  const fy = Math.max(y + 16, py) + 46;
  doc.h = fy + 34;
  body += `<g ${fadeIn(t1 + 0.6)}>${prompt(doc, X, fy, '~', { size: 15 })}${doc.t(X + emWidth('ckw ~ ') * 15, fy, '❯', { size: 15, fill: c.amber })}<rect class="cur" x="${r(X + emWidth('ckw ~ ❯ ') * 15)}" y="${fy - 13}" width="9" height="17" fill="${c.amber}" style="animation-delay:${r(t1 + 0.6)}s"/></g>`;
  body += doc.t(W - X, fy, zh(ui.hero.updated.replace('{date}', locale === 'en' ? 'Oct 2026' : '2026 年 10 月')), { size: 12, fill: c.faint, anchor: 'end', attrs: fadeIn(t1 + 0.6) });

  body = chrome() + body;
  const css = `
.dec{animation:dec .7s ${EASE} backwards}
@keyframes dec{0%{opacity:0;fill:${c.green}}18%{opacity:1;fill:${c.green}}30%{opacity:.15}46%{opacity:1;fill:${c.green}}100%{opacity:1;fill:${c.ink}}}
.scan{opacity:0;animation:scan 1.2s linear backwards}
@keyframes scan{0%{opacity:1;transform:translateX(0)}92%{opacity:1}100%{opacity:0;transform:translateX(${r(gw + 2)}px)}}
.ring{transform-box:fill-box;transform-origin:center;animation:ring 2.4s ${EASE} infinite;opacity:0}
@keyframes ring{0%{transform:scale(1);opacity:.9}80%,100%{transform:scale(2.6);opacity:0}}`;
  return doc.render(body, css);
}

// ---------------------------------------------------------------- pinned cards
const KIND_TONE = { tool: 'blue', research: 'violet', learning: 'amber', creative: 'red', other: 'dim' };
export async function card({ theme, locale, project, index, ui, zh }) {
  const slug = project.repo.split('/').at(-1);
  const W = 640, H = 460, X = 24, c = undefined;
  const doc = new Doc({ w: W, h: H, theme, locale, title: project.name, desc: `${project.name}: ${locale === 'en' ? TAGLINES[slug].en : zh(TAGLINES[slug].zh)}` });
  const C = doc.c;
  void c;
  const kind = zh(ui.ledger.kinds[project.kind]);
  let body = frame(doc);
  body += bar(doc, { left: [{ s: String(index).padStart(2, '0'), fill: C.amber, w: 46 }, { s: project.name, fill: C.ink, face: 'bold', sep: false }], right: [{ s: kind, fill: C[KIND_TONE[project.kind]] }] });
  const tag = locale === 'en' ? TAGLINES[slug].en : zh(TAGLINES[slug].zh);
  const tl = wrap(tag, (W - 2 * X) / 15 - 2.2);
  let y = 72;
  tl.forEach((ln, i) => { body += `<g ${fadeIn(0.15 + i * 0.05)}>${i === 0 ? doc.t(X, y, '#', { size: 15, fill: C.dim }) : ''}${doc.t(X + 15 * 1.2, y, ln, { size: 15, fill: C.ink, face: locale === 'en' ? 'italic' : 'mono' })}</g>`; y += 24; });
  y += 4;
  body += doc.t(X + 15 * 1.2, y, project.status, { size: 11.5, fill: C.dim, attrs: fadeIn(0.3) });
  y += 18;
  body += `<path d="M${X} ${y}H${W - X}" stroke="${C.line2}" stroke-dasharray="3 4" ${fadeIn(0.3)}/>`;
  y += 30;

  const run = RUNS[slug];
  if (run) body += session(doc, run, X, y, { size: 12.5, lh: 19.5, width: W - 2 * X });
  else if (slug === 'ORACLE') body += filmInCard(doc, project, X, y, ui, zh, locale);
  const foot = run ? `${project.repo.replace('https://github.com/', '')}@${run.commit}` : project.repo.replace('https://github.com/', '');
  body += doc.t(W - X, H - 18, run ? `run against ${foot}` : foot, { size: 10.5, fill: C.faint, anchor: 'end' });
  if (run) {
    const ok = run.exit === 0, s = `exit ${run.exit}`;
    body += `<g ${fadeIn(run.done + 0.15)}><rect x="${X}" y="${H - 33}" width="${r(emWidth(s) * 11 + 16)}" height="21" rx="3" fill="${ok ? C.green : C.red}" fill-opacity=".12" stroke="${ok ? C.green : C.red}"/>${doc.t(X + 8, H - 18.5, s, { size: 11, fill: ok ? C.green : C.red, face: 'bold' })}</g>`;
  }
  return doc.render(body, doc.extraCss ?? '');
}

function session(doc, run, X, y0, { size, lh, width }) {
  const C = doc.c, cols = Math.floor(width / (size * 0.6));
  let out = '', y = y0, t = 0.55;
  const ps1 = (extra) => `ckw ${run.cwd}${extra ? `  ${extra}` : ''} `;
  for (let i = 0; i < run.lines.length; i++) {
    const [kind, text] = run.lines[i];
    if (kind === '$' || kind === '>') {
      let x = X;
      if (kind === '$') {
        const head = ps1(i === 0 ? run.commit : '');
        const multi = i + 1 < run.lines.length && run.lines[i + 1][0] === '>';
        const inline = !multi && emWidth(`${head}❯ ${text}`) <= cols * 0.6 * 1.0001;
        if (i > 0) y += 7;
        out += `<g ${fadeIn(t - 0.1, 0.25)}>${prompt(doc, X, y, run.cwd, { size, extra: i === 0 ? run.commit : undefined })}</g>`;
        if (inline) x = X + emWidth(head) * size; else y += lh;
        out += doc.t(x, y, '❯', { size, fill: C.amber, attrs: fadeIn(t - 0.05, 0.2) });
        x += 2 * size * 0.6;
      } else x = X + 2 * size * 0.6;
      const cps = Math.max(55, text.length / 0.85);
      const tt = typed(doc, x, y, kind === '>' ? text.replace(/^ {2}/, '') : text, { size, start: t, cps });
      out += tt.svg;
      const more = i + 1 < run.lines.length && run.lines[i + 1][0] === '>';
      t = tt.end + (more ? 0.03 : 0.25);
      y += lh;
    } else {
      const parts = Array.isArray(kind) ? kind : [[text, kind]];
      out += doc.runs(X, y, parts.map(([s, tone]) => [s, C[tone], tone === 'red' && /FAILED|ERROR|failed/.test(s) ? 'bold' : 'mono']), { size, attrs: `class="in" style="animation-delay:${r(t)}s;animation-duration:.25s"` });
      t += 0.07;
      y += lh;
    }
  }
  run.done = t;
  y += 7;
  const head = ps1('');
  out += `<g ${fadeIn(t + 0.1, 0.2)}>${prompt(doc, X, y, run.cwd, { size })}${doc.t(X + emWidth(head) * size, y, '❯', { size, fill: C.amber })}<rect class="cur" x="${r(X + emWidth(head) * size + 2 * size * 0.6)}" y="${r(y - size * 0.86)}" width="${r(size * 0.6)}" height="${r(size * 1.14)}" fill="${C.amber}" style="animation-delay:${r(t + 0.1)}s"/></g>`;
  return out;
}

// ---------------------------------------------------------------- ASCII films
const filmCss = (name, frames, seconds) => {
  const step = 100 / frames;
  return `.${name}{opacity:0;animation:${name} ${seconds}s step-end infinite}.${name}.poster{opacity:1}
@keyframes ${name}{0%{opacity:1}${r(step)}%,100%{opacity:0}}`;
};
function filmFrames(doc, id, x, y, cw, ch, fps) {
  const film = FILMS[id];
  const n = Math.round(film.seconds * fps);
  const posterK = Math.round(film.poster * n) % n;
  const name = `f-${id}`;
  const tl = r(cw * film.cols);
  let out = '';
  for (let k = 0; k < n; k++) {
    const f = film.render((k / n) * film.seconds);
    let g = '';
    for (let row = 0; row < f.rows; row++) {
      let line = '', runs = [], cur = -1, buf = '';
      for (let col = 0; col < f.cols; col++) {
        const i = row * f.cols + col, ch = f.chars[i], tone = ch === ' ' ? cur : f.tones[i];
        if (tone !== cur && buf) { runs.push([buf, cur]); buf = ''; }
        cur = tone; buf += ch;
      }
      if (buf) runs.push([buf, cur]);
      if (!runs.some(([s]) => s.trim())) continue;
      line = runs.map(([s, tone]) => { doc.use('mono', s); return tone <= 0 || !s.trim() ? esc(s) : `<tspan class="t${tone}">${esc(s)}</tspan>`; }).join('');
      g += `<text x="${r(x)}" y="${r(y + row * ch + ch * 0.78)}" textLength="${tl}">${line}</text>`;
    }
    out += `<g class="${name}${k === posterK ? ' poster' : ''}" style="animation-delay:${r((k / n) * film.seconds - film.seconds)}s">${g}</g>`;
  }
  const toneCss = TONES.map((t, i) => `.${name} .t${i}{fill:${doc.c[t]}}`).join('');
  const rowCss = `.${name} text{font-size:${r(ch / 1.22)}px;fill:${doc.c[TONES[0]]};white-space:pre;length-adjust:spacing}.${name} text{font-family:inherit}`;
  return { svg: `<g class="mono" style="white-space:pre" font-size="${r(ch / 1.22)}" fill="${doc.c[TONES[0]]}">${out.replaceAll('<text ', '<text lengthAdjust="spacing" xml:space="preserve" ')}</g>`, css: filmCss(name, n, film.seconds) + toneCss + rowCss };
}
function filmInCard(doc, project, X, y, ui, zh, locale) {
  const C = doc.c;
  const cw = 5.2, ch = 11.4;
  const ff = filmFrames(doc, 'oracle', X, y - 10, cw, ch, 6);
  doc.extraCss = (doc.extraCss ?? '') + ff.css;
  const RX = X + 56 * cw + 26;
  const facts = [['runtime', '4:30'], ['render', 'Three.js r169'], ['gpu', 'SwiftShader (CPU)'], ['score', 'numpy / scipy'], ['status', project.status]];
  let out = ff.svg;
  facts.forEach(([k, v], i) => { out += `<g ${fadeIn(0.5 + i * 0.06)}>${doc.t(RX, y + 6 + i * 24, k, { size: 12, fill: C.green, face: 'bold' })}${wrap(v, 13).map((ln, j) => doc.t(RX + 9 * 7.2, y + 6 + i * 24 + j * 17, ln, { size: 12, fill: C.ink })).join('')}</g>`; });
  out += `<g ${fadeIn(1)}><rect x="${RX}" y="${y + 148}" width="118" height="30" rx="4" fill="${C.red}" fill-opacity=".12" stroke="${C.red}"/>${doc.t(RX + 14, y + 167.5, `▶ ${zh(ui.common.watch)}`, { size: 12.5, fill: C.red, face: 'bold' })}</g>`;
  void locale;
  return out;
}

export async function filmPlayer({ theme, project, id, file, length }) {
  const W = 420, H = 330;
  const doc = new Doc({ w: W, h: H, theme, title: project.name, desc: `${project.name}: an ASCII loop drawn from the same idea as the film.` });
  const C = doc.c;
  let body = frame(doc, { rx: 10 });
  body += bar(doc, { h: 32, left: [{ s: '▶', fill: C.red, w: 34 }, { s: file, fill: C.ink2, sep: false }], right: [{ s: length, fill: C.dim }] });
  const cw = 6.6, ch = 12.4, x = (W - 56 * cw) / 2, y = 46;
  const ff = filmFrames(doc, id, x, y, cw, ch, id === 'disease' ? 5 : 6);
  body += ff.svg;
  const FILM = FILMS[id];
  body += `<rect x="0.5" y="${H - 3}" width="${W - 1}" height="2" fill="${C.line}"/><rect class="prog" x="0.5" y="${H - 3}" width="${W - 1}" height="2" fill="${C.green}" style="animation-duration:${FILM.seconds}s"/>`;
  const css = `${ff.css}\n.prog{transform-box:fill-box;transform-origin:left;transform:scaleX(${FILM.poster});animation:prog linear infinite}@keyframes prog{from{transform:scaleX(0)}to{transform:scaleX(1)}}`;
  return doc.render(body, css);
}

// ---------------------------------------------------------------- footer
export async function footer({ theme, locale, ui, sha, zh }) {
  const W = 1200, H = 96;
  const doc = new Doc({ w: W, h: H, theme, locale, title: 'exit', desc: 'A closing status line: the README is rendered from projects.json.' });
  const C = doc.c;
  let body = doc.runs(8, 22, [['ckw', C.green, 'bold'], [' ~ ', C.blue], ['❯ ', C.amber], ['exit', C.ink]], { size: 14 });
  body += doc.t(8, 46, zh(ui.footer.exit), { size: 13, fill: C.dim });
  const y = H - 30;
  body += `<rect x="0.5" y="${y}" width="${W - 1}" height="29.5" rx="4" fill="${C.bg1}" stroke="${C.line}"/>`;
  const segs = [['NORMAL', C.bg, C.green, 'xbold'], ['~/README.md', C.blue, C.bg2], [`projects.json @ ${sha.slice(0, 7)}`, C.dim]];
  let x = 0.5;
  segs.forEach(([s, fill, bg, face]) => { const w = emWidth(s) * 12 + 24; if (bg) body += `<rect x="${x}" y="${y}" width="${r(w)}" height="29.5" fill="${bg}"${x < 1 ? ' rx="4"' : ''}/>`; body += doc.t(x + 12, y + 19, s, { size: 12, fill, face: face ?? 'mono' }); x += w; });
  let rx = W - 0.5;
  for (const [s, fill, bg] of [['Bot', C.ink, C.bg2], [locale, C.dim], ['utf-8', C.dim]]) { const w = emWidth(s) * 12 + 24; rx -= w; if (bg) body += `<rect x="${r(rx)}" y="${y}" width="${r(w)}" height="29.5" fill="${bg}"/>`; body += doc.t(rx + 12, y + 19, s, { size: 12, fill }); body += `<path d="M${r(rx)} ${y}v29.5" stroke="${C.line}"/>`; }
  return doc.render(body, '');
}
