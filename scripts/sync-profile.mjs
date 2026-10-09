import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

// Mirror public/profile/ into the profile repository: README*.md at the root and every image under assets/.
// Files under assets/ that the generator no longer writes are removed, so the two repositories cannot drift.
const index = process.argv.indexOf('--to');
const target = index === -1 ? undefined : process.argv[index + 1];
if (!target) throw new Error('Usage: node scripts/sync-profile.mjs --to <profile-repo-dir>');

const source = fileURLToPath(new URL('../public/profile/', import.meta.url));
const destination = resolve(target);
const list = (dir, pre = '') => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? list(join(dir, e.name), `${pre}${e.name}/`) : [`${pre}${e.name}`]));
const files = list(source).filter((f) => /^README(\.zh-(TW|CN))?\.md$/.test(f) || f.startsWith('assets/'));
if (!files.includes('README.md')) throw new Error('public/profile/README.md is missing; run npm run profile first');

mkdirSync(join(destination, 'assets'), { recursive: true });
for (const stale of list(join(destination, 'assets')).map((f) => `assets/${f}`).filter((f) => !files.includes(f))) {
  rmSync(join(destination, stale));
  console.log(`removed  ${stale}`);
}
for (const f of files) {
  mkdirSync(dirname(join(destination, f)), { recursive: true });
  copyFileSync(join(source, f), join(destination, f));
  const hash = createHash('sha256').update(readFileSync(join(destination, f))).digest('hex');
  console.log(`${hash.slice(0, 16)}  ${f}`);
}
