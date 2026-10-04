import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';

const index = process.argv.indexOf('--to');
const target = index === -1 ? undefined : process.argv[index + 1];
if (!target) throw new Error('Usage: node scripts/sync-profile.mjs --to <profile-repo-dir>');

const source = new URL('../public/profile/', import.meta.url);
const destination = resolve(target);
const files = [
  ['README.md', 'README.md'],
  ['README.zh-TW.md', 'README.zh-TW.md'],
  ['README.zh-CN.md', 'README.zh-CN.md'],
  ['profile-hero.svg', 'assets/profile-hero.svg'],
  ['profile-hero-dark.svg', 'assets/profile-hero-dark.svg'],
];

mkdirSync(join(destination, 'assets'), { recursive: true });
for (const [from, to] of files) {
  const input = fileURLToPath(new URL(from, source));
  const output = join(destination, to);
  copyFileSync(input, output);
  const hash = createHash('sha256').update(readFileSync(output)).digest('hex');
  console.log(`${hash}  ${to}`);
}
