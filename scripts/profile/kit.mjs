// Shared kit for the profile README images: palettes, fonts embedded as subsets, text measuring,
// and the SVG document wrapper. Everything is deterministic so `npm run check` can re-render and compare.
import subsetFont from 'subset-font';
import * as fontkit from 'fontkit';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const nm = (p) => new URL(`../../node_modules/${p}`, import.meta.url);

// ---------- palettes (mirror src/styles/tokens.css) ----------
export const PALETTE = {
  dark: {
    bg: '#0b0c0e', bg1: '#101215', bg2: '#161a1e', line: '#20252a', line2: '#2c3238', faint: '#3a4148',
    dim: '#6e7781', ink2: '#a7b0b8', ink: '#e7eaed', green: '#7ee2a8', amber: '#f3c06e', red: '#ff7b72', blue: '#7cb7ff', violet: '#c9a6ff',
  },
  light: {
    bg: '#f5f5f1', bg1: '#edede8', bg2: '#e5e5df', line: '#d9d9d1', line2: '#c9c9c0', faint: '#b3b5ae',
    dim: '#73787e', ink2: '#3c4147', ink: '#111316', green: '#0c7a45', amber: '#9c5a00', red: '#c4362b', blue: '#1c5ec2', violet: '#7440bd',
  },
};
/** films.ts tone index → palette key */
export const TONES = ['line2', 'dim', 'ink', 'green', 'amber', 'red', 'blue', 'violet'];

// ---------- fonts ----------
const JB = (w) => nm(`jetbrains-mono/fonts/webfonts/JetBrainsMonoNL-${w}.woff2`);
const FACE_FILE = { mono: JB('Regular'), bold: JB('Bold'), xbold: JB('ExtraBold'), italic: JB('Italic') };
const FACE_CJK_WGHT = { mono: 400, bold: 700, xbold: 800, italic: 400 };
const BRAILLE_FILE = nm('@fontsource/noto-sans-symbols-2/files/noto-sans-symbols-2-braille-400-normal.woff2');

const bufCache = new Map();
const buf = (url) => { const k = url.href; if (!bufCache.has(k)) bufCache.set(k, readFileSync(url)); return bufCache.get(k); };
const kitCache = new Map();
const fk = (url) => { const k = url.href; if (!kitCache.has(k)) kitCache.set(k, fontkit.create(buf(url))); return kitCache.get(k); };
export const jb = (face = 'mono') => fk(FACE_FILE[face]);

// fontsource splits Noto Sans TC/SC into unicode-range chunks; map each code point to its chunk file.
const chunkMaps = {};
function cjkChunks(script) {
  if (chunkMaps[script]) return chunkMaps[script];
  const pkg = `@fontsource-variable/noto-sans-${script}`;
  const css = readFileSync(nm(`${pkg}/index.css`), 'utf8');
  const map = new Map();
  for (const block of css.split('@font-face').slice(1)) {
    const file = block.match(/url\(\.\/files\/([^)]+\.woff2)\)/)?.[1];
    const ranges = block.match(/unicode-range:\s*([^;]+);/)?.[1];
    if (!file || !ranges) continue;
    for (const r of ranges.split(',')) {
      const [a, b] = r.trim().replace('U+', '').split('-').map((h) => parseInt(h, 16));
      for (let c = a; c <= (b ?? a); c++) if (!map.has(c)) map.set(c, `${pkg}/files/${file}`);
    }
  }
  return (chunkMaps[script] = map);
}

const subsetCache = new Map();
async function subset(url, chars, axes) {
  const text = [...new Set(chars)].sort().join('');
  const key = `${url.href}|${JSON.stringify(axes ?? {})}|${text}`;
  if (!subsetCache.has(key)) {
    subsetCache.set(key, subsetFont(buf(url), text, { targetFormat: 'woff2', ...(axes ? { variationAxes: axes } : {}) }).then((b) => b.toString('base64')));
  }
  return subsetCache.get(key);
}

export const isWide = (ch) => {
  const c = ch.codePointAt(0);
  return (c >= 0x1100 && c <= 0x115f) || (c >= 0x2e80 && c <= 0xa4cf) || (c >= 0xac00 && c <= 0xd7a3) || (c >= 0xf900 && c <= 0xfaff) || (c >= 0xfe30 && c <= 0xfe4f) || (c >= 0xff00 && c <= 0xff60) || (c >= 0xffe0 && c <= 0xffe6);
};
/** Width in em: JetBrains Mono advances are 0.6em; CJK glyphs are 1em. */
export const emWidth = (s) => [...s].reduce((w, ch) => w + (isWide(ch) ? 1 : 0.6), 0);

const NO_START = new Set('，。、：；！？）」』》〉,.;:!?)]}%');
/** Wrap to a width in em. Latin breaks at spaces, CJK between characters, with simple kinsoku. */
export function wrap(text, maxEm) {
  const tokens = text.match(/[⺀-꓏＀-｠　-〿][，。、：；！？）」』]?|[^\s⺀-꓏＀-｠　-〿]+|\s+/g) ?? [];
  const lines = [];
  let cur = '';
  for (const t of tokens) {
    if (/^\s+$/.test(t)) { if (cur) cur += ' '; continue; }
    const next = cur + t;
    if (emWidth(next.trimEnd()) <= maxEm || !cur.trim()) cur = next;
    else if (NO_START.has(t[0]) && emWidth(next) <= maxEm + 1) cur = next;
    else { lines.push(cur.trimEnd()); cur = t; }
  }
  if (cur.trim()) lines.push(cur.trimEnd());
  return lines;
}

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * One SVG image. `t()` writes text and records which glyphs each face needs; `render()` subsets exactly those
 * glyphs into data: URL fonts (img-embedded SVGs cannot load anything else).
 */
export class Doc {
  constructor({ w, h, theme, locale = 'en', title, desc }) {
    Object.assign(this, { w, h, theme, locale, title, desc });
    this.c = PALETTE[theme];
    this.used = { mono: new Set(), bold: new Set(), xbold: new Set(), italic: new Set() };
  }
  use(face, s) { for (const ch of String(s)) this.used[face].add(ch); }
  /** <text> in a face. `attrs` is a raw attribute string. */
  t(x, y, s, { face = 'mono', size = 14, fill = this.c.ink, attrs = '', anchor } = {}) {
    this.use(face, s);
    const a = anchor ? ` text-anchor="${anchor}"` : '';
    let cls = face;
    attrs = attrs.replace(/class="([^"]*)"\s*/, (_, c) => { cls += ` ${c}`; return ''; });
    return `<text class="${cls}" x="${r(x)}" y="${r(y)}" font-size="${size}" fill="${fill}"${a}${attrs ? ` ${attrs}` : ''} xml:space="preserve">${esc(s)}</text>`;
  }
  /** Coloured runs on one line: [[text, fill, face?], ...] */
  runs(x, y, parts, { size = 14, attrs = '' } = {}) {
    let out = '';
    for (const [s, fill, face = 'mono'] of parts) { this.use(face, s); out += `<tspan class="${face}" fill="${fill}">${esc(s)}</tspan>`; }
    return `<text x="${r(x)}" y="${r(y)}" font-size="${size}"${attrs ? ` ${attrs}` : ''} xml:space="preserve">${out}</text>`;
  }
  async fontCss() {
    const script = this.locale === 'zh-CN' ? 'sc' : 'tc';
    const chunks = cjkChunks(script);
    const faces = [];
    const classes = [];
    const cjkByW = new Map();             // weight -> Map(file -> Set(chars))
    // Safari shares @font-face rules by family name across every SVG image on a page, so two images that both
    // declare "j-mono" with different subsets would steal each other's glyphs. Name each subset by its content.
    const uniq = (base, data) => `${base}-${createHash('sha256').update(data).digest('hex').slice(0, 10)}`;
    const latinFamily = {};
    const braille = new Set();
    for (const [face, set] of Object.entries(this.used)) {
      if (!set.size) continue;
      const font = jb(face);
      const latin = [];
      for (const ch of set) {
        const cp = ch.codePointAt(0);
        if (ch === ' ' || font.hasGlyphForCodePoint(cp)) latin.push(ch);
        else if (cp >= 0x2800 && cp <= 0x28ff) braille.add(ch);
        else if (chunks.has(cp)) {
          const wgt = FACE_CJK_WGHT[face];
          if (!cjkByW.has(wgt)) cjkByW.set(wgt, new Map());
          const m = cjkByW.get(wgt), file = chunks.get(cp);
          if (!m.has(file)) m.set(file, new Set());
          m.get(file).add(ch);
        } else throw new Error(`No font covers U+${cp.toString(16)} (${ch}) in face ${face}`);
      }
      const data = await subset(FACE_FILE[face], latin);
      latinFamily[face] = uniq(`j-${face}`, data);
      faces.push(`@font-face{font-family:${latinFamily[face]};src:url(data:font/woff2;base64,${data}) format("woff2")}`);
    }
    const cjkFamilies = new Map();
    for (const [wgt, files] of [...cjkByW].sort((a, b) => a[0] - b[0])) {
      const fams = [];
      let i = 0;
      for (const [file, chars] of [...files].sort((a, b) => a[0].localeCompare(b[0]))) {
        const data = await subset(nm(file), [...chars], { wght: wgt });
        const fam = uniq(`c${wgt}-${i++}`, data);
        fams.push(fam);
        faces.push(`@font-face{font-family:${fam};src:url(data:font/woff2;base64,${data}) format("woff2")}`);
      }
      cjkFamilies.set(wgt, fams);
    }
    let brFamily = '';
    if (braille.size) { const data = await subset(BRAILLE_FILE, [...braille]); brFamily = uniq('br', data); faces.push(`@font-face{font-family:${brFamily};src:url(data:font/woff2;base64,${data}) format("woff2")}`); }
    for (const face of Object.keys(this.used)) {
      if (!this.used[face].size) continue;
      const fams = [latinFamily[face], ...(cjkFamilies.get(FACE_CJK_WGHT[face]) ?? []), ...(brFamily ? [brFamily] : [])];
      classes.push(`.${face}{font-family:${fams.join(',')},ui-monospace,Menlo,Consolas,monospace${face === 'italic' ? ';font-style:normal' : ''}}`);
    }
    return faces.join('\n') + '\n' + classes.join('');
  }
  async render(body, css = '') {
    const fonts = await this.fontCss();
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${this.w}" height="${this.h}" viewBox="0 0 ${this.w} ${this.h}" role="img" aria-labelledby="t d">
<title id="t">${esc(this.title)}</title>
<desc id="d">${esc(this.desc)}</desc>
<style>
${fonts}
${BASE_CSS}${css}
</style>
<g class="paint">
${body}
</g>
</svg>
`;
  }
}
const r = (n) => Math.round(n * 100) / 100;
export { r as round };

// Motion vocabulary shared by every image. Every element's un-animated state is its finished frame,
// so where animation does not run (reduced motion, some viewers) the picture is complete.
const BASE_CSS = `
text{font-variant-ligatures:none}
.in{animation:in .5s cubic-bezier(.2,.7,.2,1) backwards}
@keyframes in{from{opacity:0;transform:translateY(5px)}}
.cover{transform-box:fill-box;transform-origin:100% 50%;transform:scaleX(0)}
@keyframes cover{from{transform:scaleX(1)}}
.cur{animation:blink 1.05s steps(1) infinite}
@keyframes blink{50%{opacity:0}}
@keyframes caret{from{transform:translateX(var(--from));opacity:1}to{opacity:1}}
@media (prefers-reduced-motion:reduce){*:not(.paint){animation:none!important}}
.paint{animation:paint .5s steps(1) 16}
@keyframes paint{50%{opacity:.998}}
`;

/**
 * A typed command: the text is drawn complete; a background-coloured cover shrinks in character steps
 * and a block caret walks with it, then blinks.
 */
export function typed(doc, x, y, s, { size = 14, start = 0.3, cps = 34, fill, bg, caret = 'run' } = {}) {
  const cw = size * 0.6, n = [...s].length, dur = n / cps;
  const w = emWidth(s) * size;
  const parts = [doc.t(x, y, s, { size, fill: fill ?? doc.c.ink })];
  parts.push(`<rect class="cover" x="${r(x - 1)}" y="${r(y - size * 0.95)}" width="${r(w + 2)}" height="${r(size * 1.3)}" fill="${bg ?? doc.c.bg}" style="animation:cover ${r(dur)}s steps(${n}) ${r(start)}s backwards"/>`);
  if (caret !== 'none') {
    // 'run': the caret walks with the text and is gone once typing ends; 'stay': it then keeps blinking.
    const anim = [`caret ${r(dur)}s steps(${n}) ${r(start)}s ${caret === 'run' ? 'none' : 'backwards'}`];
    if (caret === 'stay') anim.push(`blink 1.05s steps(1) ${r(start + dur + 0.3)}s infinite`);
    parts.push(`<rect x="${r(x + w + 1)}" y="${r(y - size * 0.86)}" width="${r(cw)}" height="${r(size * 1.14)}" fill="${doc.c.amber}" style="--from:${r(-w)}px;${caret === 'run' ? 'opacity:0;' : ''}animation:${anim.join(',')}"/>`);
  }
  return { svg: parts.join(''), end: start + dur, width: w };
}
