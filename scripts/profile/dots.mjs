// Rasterise text from the real JetBrains Mono ExtraBold outlines into a dot grid (the README's version of the
// site's canvas name). Curves are flattened; each grid cell centre is tested with the nonzero winding rule.
import { jb } from './kit.mjs';

function flatten(path, scale, ox, oy) {
  const polys = [];
  let cur = [], px = 0, py = 0;
  const pt = (x, y) => { cur.push([ox + x * scale, oy - y * scale]); px = x; py = y; };
  for (const { command, args } of path.commands) {
    if (command === 'moveTo') { if (cur.length) polys.push(cur); cur = []; pt(args[0], args[1]); }
    else if (command === 'lineTo') pt(args[0], args[1]);
    else if (command === 'quadraticCurveTo') {
      const [cx, cy, x, y] = args, sx = px, sy = py;
      for (let i = 1; i <= 8; i++) { const t = i / 8, u = 1 - t; pt(u * u * sx + 2 * u * t * cx + t * t * x, u * u * sy + 2 * u * t * cy + t * t * y); }
    } else if (command === 'bezierCurveTo') {
      const [c1x, c1y, c2x, c2y, x, y] = args, sx = px, sy = py;
      for (let i = 1; i <= 10; i++) { const t = i / 10, u = 1 - t; pt(u * u * u * sx + 3 * u * u * t * c1x + 3 * u * t * t * c2x + t * t * t * x, u * u * u * sy + 3 * u * u * t * c1y + 3 * u * t * t * c2y + t * t * t * y); }
    } else if (command === 'closePath') { if (cur.length) polys.push(cur); cur = []; }
  }
  if (cur.length) polys.push(cur);
  return polys;
}

function winding(polys, x, y) {
  let w = 0;
  for (const poly of polys) for (let i = 0, n = poly.length; i < n; i++) {
    const [x1, y1] = poly[i], [x2, y2] = poly[(i + 1) % n];
    if (y1 <= y) { if (y2 > y && (x2 - x1) * (y - y1) - (x - x1) * (y2 - y1) > 0) w++; }
    else if (y2 <= y && (x2 - x1) * (y - y1) - (x - x1) * (y2 - y1) < 0) w--;
  }
  return w;
}

/** Returns { cols, rows, on: Uint8Array } for `lines` fitted to `cols` cells. */
export function dotText(lines, cols) {
  const font = jb('xbold');
  const upm = font.unitsPerEm;
  const widest = Math.max(...lines.map((l) => font.layout(l).advanceWidth));
  const scale = (cols - 1) / widest;                    // grid cells per font unit
  const cap = font.capHeight * scale;
  const lineH = Math.round(cap * 1.45);
  const rows = Math.ceil(cap) + (lines.length - 1) * lineH + 2;
  const polys = [];
  lines.forEach((l, i) => {
    const run = font.layout(l);
    let x = 0;
    const base = 1 + Math.ceil(cap) + i * lineH;
    run.glyphs.forEach((g, k) => { polys.push(...flatten(g.path, scale, x * scale, base)); x += run.positions[k].xAdvance; });
  });
  const on = new Uint8Array(cols * rows);
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) on[y * cols + x] = winding(polys, x + 0.5, y + 0.5) !== 0 ? 1 : 0;
  void upm;
  return { cols, rows, on };
}
