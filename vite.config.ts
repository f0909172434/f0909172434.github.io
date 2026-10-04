import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const catalogUrl = new URL("./src/data/projects.json", import.meta.url);
const bytes = readFileSync(catalogUrl);                       // hash the BYTES, byte-exact against `shasum -a 256`
const sha256 = createHash("sha256").update(bytes).digest("hex");
const text = bytes.toString("utf8");
const catalog = JSON.parse(text);
// Slice each project's record out of the file text, verbatim (the file is 2-space JSON; project objects sit at indent 4).
// records[slug] = { start, end (1-based, inclusive), text }. Self-check: the slice must parse to the same object.
const lines = text.split("\n");
const records: Record<string, { start: number; end: number; text: string }> = {};
let start = -1;
lines.forEach((line, i) => {
  if (/^ {4}\{$/.test(line)) start = i;
  else if (start >= 0 && /^ {4}\},?$/.test(line)) {
    const slice = lines.slice(start, i + 1).join("\n").replace(/,$/, "");
    const obj = JSON.parse(slice);
    const slug = String(obj.repo).split("/").at(-1)!;
    const expected = catalog.projects.find((p: { repo: string }) => p.repo === obj.repo);
    if (JSON.stringify(obj) !== JSON.stringify(expected)) throw new Error(`Record slice mismatch for ${slug}`);
    records[slug] = { start: start + 1, end: i + 1, text: slice };
    start = -1;
  }
});
if (Object.keys(records).length !== catalog.projects.length) throw new Error("Did not slice every project record");

export default defineConfig({
  plugins: [preact({ prerender: { enabled: true, renderTarget: "#root" } })],
  define: { __CATALOG_META__: JSON.stringify({ sha256, records }) },
});
