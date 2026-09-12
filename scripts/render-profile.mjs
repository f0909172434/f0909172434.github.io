import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const catalog = JSON.parse(readFileSync(new URL('src/data/projects.json', root), 'utf8'));
const slugs = catalog.projects.map((p) => p.repo.split('/').at(-1));
if (catalog.schemaVersion !== 1 || new Set(slugs).size !== slugs.length || catalog.pinOrder.length !== 6 || new Set(catalog.pinOrder).size !== 6 || catalog.pinOrder.some((p) => !slugs.includes(p))) throw new Error('Invalid project catalog or pins');
for (const project of catalog.projects) {
  if (!['engineering', 'research', 'learning', 'other'].includes(project.kind) || !project.descZh || !project.descEn || !project.status) throw new Error(`Incomplete project: ${project.name}`);
  for (const url of [project.repo, project.live, ...project.links.map((link) => link.url)].filter(Boolean)) if (new URL(url).protocol !== 'https:') throw new Error(`Expected HTTPS: ${url}`);
}
const selected = catalog.pinOrder.map((slug) => catalog.projects.find((p) => p.repo.endsWith(`/${slug}`)));
const lines = selected.map((p) => `| **[${p.name}](${p.repo})** | ${p.descEn} | ${p.live ? `[Try it](${p.live.replace('?lang=zh-Hant', '?lang=en')})` : `[Source](${p.repo})`} |`);
const markdown = `# Chih-Kai Wang | 王治凱

${catalog.positioning.en}

I am a B.S. student in the Mathematics Division, Department of Mathematics and Information Education at National Taipei University of Education, expected 2028. Based in Taipei; open to software engineering and AI application internships.

[Portfolio](https://f0909172434.github.io/) · [CV](https://f0909172434.github.io/Chih-Kai-Wang-CV.pdf) · [Email](mailto:f0909172434@gmail.com)

## Selected work

| Project | What it does | Explore |
|---|---|---|
${lines.join('\n')}

HonestCI checks test-execution evidence. RigorGraph audits evidence and review records. ProofWeave checks an explicit formal target with Lean; semantic alignment remains a separate question.

## Learning and experiments

[MiniHarness](https://github.com/f0909172434/miniharness) teaches agent engineering through an eight-step workshop with a Traditional Chinese prerequisite curriculum. [Charlie Alpha](https://github.com/f0909172434/Charlie-Alpha-4B) records statistical procedure-selection experiments, including negative results. [Verified Search](https://github.com/f0909172434/dsh-plugin-verified-search) retains retrieval sources; its extended tools remain experimental.

## Open-source contribution

I contributed a [merged Windows verification fix](https://github.com/EmiyaKatuz/Codex-Dream-Skin-Needy-Girl-Overdose/pull/10) to Codex Dream Skin: unrelated native-window errors remain failures, and standalone verification loads its helpers correctly. I also maintain [DeepSeek Girl for Codex](https://github.com/f0909172434/deepseek-girl-codex-pet) and its [Harness adapter](https://github.com/f0909172434/dsh-deepseek-girl-pet), built around one animation atlas.

Python · TypeScript · GitHub Actions · JSON Schema · MLX. Developing Lean 4 / Mathlib skills through formal-checking and research projects.

<!-- Generated from f0909172434.github.io/src/data/projects.json and scripts/render-profile.mjs. -->
`;
const output = new URL('public/profile-README.md', root);
if (process.argv.includes('--check')) {
  if (readFileSync(output, 'utf8') !== markdown) throw new Error('Run node scripts/render-profile.mjs to refresh the profile snapshot.');
  console.log('Project catalog and generated profile are consistent.');
} else {
  writeFileSync(output, markdown);
  console.log(`Wrote ${fileURLToPath(output)}`);
}
