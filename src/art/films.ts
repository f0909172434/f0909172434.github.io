// ASCII films. Every frame is a pure function of time, so the site (live canvas) and the
// profile README (pre-rendered SVG frames) draw exactly the same pictures from this one file.
// No imports: Node runs this file directly with type stripping.

/** Tone indices; each renderer maps them to its own theme colours. */
export const TONE = { faint: 0, dim: 1, ink: 2, green: 3, amber: 4, red: 5, blue: 6, violet: 7 } as const;

export interface Frame { cols: number; rows: number; chars: string[]; tones: Uint8Array }
export interface Film { id: string; seconds: number; cols: number; rows: number; poster: number; render(t: number): Frame }

const COLS = 56;
const ROWS = 21;
const ASPECT = 2.05;               // a character cell is about twice as tall as it is wide

// ---------- deterministic noise ----------
function hash(x: number, y: number, z = 0): number {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(z | 0, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
const fade = (t: number) => t * t * (3 - 2 * t);
function noise(x: number, y: number, z = 0): number {
  const xi = Math.floor(x), yi = Math.floor(y), u = fade(x - xi), v = fade(y - yi);
  const a = hash(xi, yi, z), b = hash(xi + 1, yi, z), c = hash(xi, yi + 1, z), d = hash(xi + 1, yi + 1, z);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoothstep = (a: number, b: number, v: number) => fade(clamp01((v - a) / (b - a)));
const easeOut = (v: number) => 1 - Math.pow(1 - clamp01(v), 3);

function blank(cols = COLS, rows = ROWS): Frame {
  return { cols, rows, chars: new Array(cols * rows).fill(" "), tones: new Uint8Array(cols * rows) };
}
function put(f: Frame, x: number, y: number, ch: string, tone: number) {
  x = Math.round(x); y = Math.round(y);
  if (x < 0 || y < 0 || x >= f.cols || y >= f.rows) return;
  f.chars[y * f.cols + x] = ch;
  f.tones[y * f.cols + x] = tone;
}
function text(f: Frame, x: number, y: number, s: string, tone: number) {
  [...s].forEach((ch, i) => put(f, x + i, y, ch, tone));
}

// ---------- 卜 ORACLE: heat on bone, the crack that answers ----------
const RAMP = " .:-=+*#%@";
const ORACLE_SECONDS = 8;
type Step = { x: number; y: number; ch: string };
function crackPath(): { up: Step[]; down: Step[]; branch: Step[] } {
  const cx = 22, cy = 8;
  const walk = (dir: 1 | -1, n: number, seed: number) => {
    const out: Step[] = [];
    let x = cx;
    for (let i = 1; i <= n; i++) {
      const r = hash(i, seed, 7);
      let ch = "│";
      if (r < 0.16) { x -= 1; ch = dir > 0 ? "╱" : "╲"; } else if (r > 0.86) { x += 1; ch = dir > 0 ? "╲" : "╱"; }
      out.push({ x, y: cy + dir * i, ch });
    }
    return out;
  };
  const branch: Step[] = [];
  let bx = cx + 1, by = cy + 1;
  for (let i = 0; i < 15; i++) {             // the short right-hand stroke of 卜
    const down = i % 2 === 1 || hash(i, 3, 9) > 0.8;
    branch.push({ x: bx, y: by, ch: down ? "╲" : "─" });
    bx += 1; if (down) by += 1;
    if (by > cy + 6) break;
  }
  return { up: walk(-1, 7, 1), down: walk(1, 12, 2), branch };
}
const CRACK = crackPath();

function renderOracle(t: number): Frame {
  const f = blank();
  const p = (t % ORACLE_SECONDS) / ORACLE_SECONDS;
  const cx = 22, cy = 8;
  const heat = smoothstep(0.02, 0.24, p) * (1 - smoothstep(0.82, 0.98, p));
  const flicker = 0.82 + 0.18 * noise(t * 7, 0.5, 4);
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
    const grain = noise(x * 0.21 + t * 0.04, y * 0.42, 1);           // bone surface
    if (grain > 0.74) put(f, x, y, grain > 0.86 ? ":" : ".", TONE.faint);
    const dx = x - cx, dy = (y - cy) * ASPECT;
    const g = heat * flicker * Math.exp(-(dx * dx + dy * dy) / (2 * 5.2 * 5.2));
    if (g > 0.08) put(f, x, y, RAMP[Math.min(9, Math.floor(g * 10))], g > 0.55 ? TONE.amber : g > 0.25 ? TONE.red : TONE.dim);
  }
  const fadeOut = 1 - smoothstep(0.86, 0.99, p);
  const drawn = (steps: Step[], start: number, span: number) => {
    const n = Math.floor(easeOut((p - start) / span) * steps.length * fadeOut + 0.0001);
    steps.slice(0, n).forEach((s, i) => {
      const tip = i >= n - 1 && p < 0.8;
      put(f, s.x, s.y, tip ? "*" : s.ch, tip ? TONE.amber : i > n - 4 ? TONE.ink : TONE.dim);
    });
  };
  drawn(CRACK.down, 0.22, 0.3);
  drawn(CRACK.up, 0.26, 0.26);
  drawn(CRACK.branch, 0.4, 0.28);
  if (heat > 0.5) put(f, cx, cy, "@", TONE.amber);
  return f;
}

// ---------- 病名為AI: watercolour blooms with darkened edges ----------
const WASH = " .·:;=+*%#";
const DISEASE_SECONDS = 9;
const BLOBS = [
  { x: 18, y: 8, r: 11, at: 0.02, tone: TONE.red, seed: 11 },
  { x: 36, y: 12, r: 10, at: 0.16, tone: TONE.blue, seed: 12 },
  { x: 29, y: 4, r: 7, at: 0.32, tone: TONE.amber, seed: 13 },
  { x: 46, y: 5, r: 6, at: 0.46, tone: TONE.violet, seed: 14 },
  { x: 10, y: 16, r: 6, at: 0.56, tone: TONE.blue, seed: 15 },
];
function renderDisease(t: number): Frame {
  const f = blank();
  const p = (t % DISEASE_SECONDS) / DISEASE_SECONDS;
  const dry = 1 - smoothstep(0.84, 0.99, p);
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
    let best = 0, tone: number = TONE.faint;
    for (const b of BLOBS) {
      const r = b.r * easeOut((p - b.at) / 0.34) * dry;
      if (r <= 0.2) continue;
      const dx = x - b.x, dy = (y - b.y) * ASPECT * 0.5;   // blooms spread wider than tall
      const d = Math.sqrt(dx * dx + dy * dy) + (noise(x * 0.3, y * 0.6, b.seed) - 0.5) * 4;
      if (d > r) continue;
      const edge = Math.exp(-Math.pow((r - d) / 1.3, 2));                // pigment pools at the rim
      const v = 0.04 + 0.8 * edge + 0.22 * Math.pow(noise(x * 0.45, y * 0.9, b.seed + 40), 2) + 0.06 * hash(x, y, b.seed);
      if (v > best) { best = v; tone = b.tone; }
    }
    if (best > 0.1) put(f, x, y, WASH[Math.min(9, Math.floor(best * 10))], best < 0.2 ? TONE.dim : tone);
    else if (hash(x, y, 99) > 0.985) put(f, x, y, ".", TONE.faint);         // paper tooth
  }
  return f;
}

// ---------- world.execute(me);: a wireframe world drawn in braille ----------
const WORLD_SECONDS = 6;
const BRAILLE_BITS = [[0x01, 0x08], [0x02, 0x10], [0x04, 0x20], [0x40, 0x80]];
function renderWorld(t: number): Frame {
  const f = blank();
  const W = COLS * 2, H = (ROWS - 2) * 4;
  const front = new Uint8Array(COLS * ROWS), back = new Uint8Array(COLS * ROWS);
  const theta = (t / WORLD_SECONDS) * Math.PI * 2, tilt = 0.42;
  const R = 33, cx = W / 2, cy = H / 2 + 1;
  const plot = (lat: number, lon: number) => {
    const x0 = Math.cos(lat) * Math.sin(lon + theta), y0 = Math.sin(lat), z0 = Math.cos(lat) * Math.cos(lon + theta);
    const y1 = y0 * Math.cos(tilt) - z0 * Math.sin(tilt), z1 = y0 * Math.sin(tilt) + z0 * Math.cos(tilt);
    const px = Math.round(cx + x0 * R * 1.02), py = Math.round(cy - y1 * R * 0.98);
    if (px < 0 || py < 0 || px >= W || py >= H) return;
    const cell = (py >> 2) * COLS + (px >> 1), bit = BRAILLE_BITS[py & 3][px & 1];
    if (z1 >= 0) front[cell] |= bit; else if ((px + py) % 3 === 0) back[cell] |= bit;
  };
  for (let m = 0; m < 12; m++) for (let s = 0; s <= 120; s++) plot(-Math.PI / 2 + (Math.PI * s) / 120, (m * Math.PI) / 6);
  for (let k = -2; k <= 2; k++) for (let s = 0; s < 240; s++) plot((k * Math.PI) / 6, (s * Math.PI * 2) / 240);
  const glitch = t % WORLD_SECONDS > 4.1 && t % WORLD_SECONDS < 4.45;
  for (let row = 0; row < ROWS - 2; row++) {
    const shift = glitch && hash(row, Math.floor(t * 12), 5) > 0.6 ? Math.round((hash(row, 2, 6) - 0.5) * 10) : 0;
    for (let col = 0; col < COLS; col++) {
      const i = row * COLS + col, bits = front[i] || back[i];
      if (bits) put(f, col + shift, row, String.fromCharCode(0x2800 + bits), front[i] ? (shift ? TONE.red : TONE.green) : TONE.faint);
    }
  }
  const line = "world.execute(me);";
  const p = (t % WORLD_SECONDS) / WORLD_SECONDS;
  const n = Math.min(line.length, Math.floor(clamp01(p / 0.45) * line.length));
  text(f, 2, ROWS - 1, "❯", TONE.green);
  text(f, 4, ROWS - 1, line.slice(0, n), TONE.ink);
  if (Math.floor(t * 2.2) % 2 === 0 || n < line.length) put(f, 4 + n, ROWS - 1, "█", TONE.ink);
  return f;
}

export const FILMS: Record<"oracle" | "disease" | "world", Film> = {
  oracle: { id: "oracle", seconds: ORACLE_SECONDS, cols: COLS, rows: ROWS, poster: 0.6, render: renderOracle },
  disease: { id: "disease", seconds: DISEASE_SECONDS, cols: COLS, rows: ROWS, poster: 0.78, render: renderDisease },
  world: { id: "world", seconds: WORLD_SECONDS, cols: COLS, rows: ROWS, poster: 0.5, render: renderWorld },
};

/** Braille cells are drawn as dots by every renderer, so no font needs braille glyphs. */
export function brailleDots(ch: string): [number, number][] | null {
  const code = ch.charCodeAt(0);
  if (code < 0x2801 || code > 0x28ff) return null;
  const bits = code - 0x2800, dots: [number, number][] = [];
  BRAILLE_BITS.forEach((row, y) => row.forEach((bit, x) => { if (bits & bit) dots.push([x, y]); }));
  return dots;
}
