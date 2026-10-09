<picture><source media="(prefers-color-scheme: dark)" srcset="assets/hero-en-dark.svg"><img src="assets/hero-en-light.svg" alt="Chih-Kai Wang — a terminal session that introduces him: a math student in Taipei who builds tools you can check, and films made in code; open to software and AI internships." width="100%"></picture>

<p><b>English</b> · <a href="README.zh-TW.md">繁體中文</a> · <a href="README.zh-CN.md">简体中文</a> &nbsp;│&nbsp; <a href="https://f0909172434.github.io/?lang=en">Portfolio</a> · <a href="https://f0909172434.github.io/Chih-Kai-Wang-CV.pdf">CV (PDF)</a> · <a href="mailto:f0909172434@gmail.com">Email</a></p>

I study mathematics at National Taipei University of Education (Mathematics Division, Dept. of Mathematics and Information Education), graduating in 2028. My favourite moment in any project is when a claim becomes something you can check: a CI step that reads the test report instead of trusting a green light, an audit that ties a research claim to the exact bytes of its evidence, a search that hands back the counterexample along with how far it looked. When an idea doesn't work out, I keep it public — that's part of the work too.

Lately I've been learning Lean 4 and Mathlib, mostly by building ProofWeave and working on the SAIR solver. I'm looking for a software or AI internship on a team where tests and evidence — not confidence — decide what ships.

## Things I’ve built &nbsp;<sub><code>ls -l --pinned</code></sub>

<p>
<a href="https://github.com/f0909172434/honest-ci"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/card-honest-ci-en-dark.svg"><img src="assets/card-honest-ci-en-light.svg" alt="HonestCI — A green check should mean the tests you expected really ran." width="49%"></picture></a>
<a href="https://f0909172434.github.io/examples/rigorgraph/math.html"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/card-rigorgraph-en-dark.svg"><img src="assets/card-rigorgraph-en-light.svg" alt="RigorGraph — Every claim tied to the bytes of its evidence. Change one byte and the audit fails." width="49%"></picture></a>
<a href="https://f0909172434.github.io/finite-witness-webmcp/"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/card-finite-witness-webmcp-en-dark.svg"><img src="assets/card-finite-witness-webmcp-en-light.svg" alt="Finite Witness — Checks every small graph for a counterexample, then hands you a certificate to replay." width="49%"></picture></a>
<a href="https://f0909172434.github.io/sair-stage2-proof-press/"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/card-sair-stage2-proof-press-en-dark.svg"><img src="assets/card-sair-stage2-proof-press-en-light.svg" alt="SAIR Proof Press — Lean-checked proofs or finite countermodels — all 1,669 released inputs accepted." width="49%"></picture></a>
<a href="https://youtu.be/kQH1PZRkn00"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/card-ORACLE-en-dark.svg"><img src="assets/card-ORACLE-en-light.svg" alt="卜 ORACLE — At 3 a.m., someone asks an AI a question. A 4:30 film rendered entirely from code." width="49%"></picture></a>
<a href="https://github.com/f0909172434/rulediff-negative-result"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/card-rulediff-negative-result-en-dark.svg"><img src="assets/card-rulediff-negative-result-en-light.svg" alt="RuleDiff negative result — 0.99 in development, 0.67 held out. It didn't hold, so I froze it and published it." width="49%"></picture></a>
</p>

<sub>Every terminal above replays a real run against the commit it names — the output is copied, not written.</sub>

## Films made in code &nbsp;<sub><code>ckw play --loop *</code></sub>

In October 2026 I made three pieces where the picture, the music and the edit are all source code. Each repository shows how it was made — and what it can’t do.

<p>
<a href="https://youtu.be/kQH1PZRkn00"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/film-oracle-dark.svg"><img src="assets/film-oracle-light.svg" alt="卜 ORACLE" width="32%"></picture></a>
<a href="https://youtu.be/ha-ANfqri6g"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/film-disease-dark.svg"><img src="assets/film-disease-light.svg" alt="病名為AI · The Disease Called AI" width="32%"></picture></a>
<a href="https://youtu.be/iEsGiRECytY"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/film-world-dark.svg"><img src="assets/film-world-light.svg" alt="world.execute(me); · Claude Code" width="32%"></picture></a>
</p>

- **[卜 ORACLE](https://github.com/f0909172434/ORACLE)** — A 4:30 short film. At 3 a.m., someone asks an AI: “Will she get better?” Rendered with Three.js on the CPU in headless Chromium; the score and sound design were synthesised in Python. The README cites sources for the historical details and marks what was reconstructed. `Three.js r169 · SwiftShader (CPU) · numpy/scipy score` · [▶ Watch](https://youtu.be/kQH1PZRkn00)
- **[病名為AI · The Disease Called AI](https://github.com/f0909172434/The-Disease-Called-AI)** — An original song with a hand-painted watercolour music video — 3:35, 67 shots. The score is a Python program, the DiffSinger vocals render bit-for-bit from fixed seeds, and Whisper listens back to check the diction. `p5.js + p5.brush · DiffSinger · Kokoro · Whisper QA` · [▶ Watch](https://youtu.be/ha-ANfqri6g)
- **[world.execute(me); · Claude Code](https://github.com/f0909172434/world-execute-me-claude-code)** — Mili's world.execute(me); performed as a Claude Code session, playing live in your terminal. Pure Node, no dependencies — every frame is a function of the song's time. An unofficial fan work, after MisakaZentai's DeepSeek Harness version; the song itself isn't included. `Node 20, zero dependencies · 24-bit ANSI · braille/sextant canvases` · [▶ Watch](https://youtu.be/iEsGiRECytY)

## What didn’t work &nbsp;<sub><code>ckw verify --keep-negatives</code></sub>

Not every experiment works. These are the ones that didn't go the way I hoped — kept public, with the same frozen data as the ones that did.

- ✗ **[RuleShift](https://github.com/f0909172434/ruleshift)** — Plain retrieval matched the fancier memory strategies — the extra complexity didn't pay for itself.
- ✗ **[RuleShift-Web](https://github.com/f0909172434/ruleshift-web)** — On the frozen held-out set, a controller with no LLM beat both models.
- ✗ **[RuleDiff negative result](https://github.com/f0909172434/rulediff-negative-result)** — 0.99 in development, 0.67 held out. The full-paper follow-up was stopped by the rule I'd registered in advance, and frozen as this report.
- ✗ **[Charlie Alpha 4B](https://github.com/f0909172434/Charlie-Alpha-4B)** — No gain on P-Bench or StatQA; only the simulator benchmark moved.

## How I work &nbsp;<sub><code>git log --graph</code></sub>

**`01` Frame.** Before any code, I write down the question, where it stops, and what “done” will look like: which tests, which replay, which hash.

**`02` Build.** Claude Code and Codex (including Codex Cloud) write most of the code, tests and docs, on branches I review. Most lines here were typed by an agent; every claim is still mine to stand behind.

**`03` Decide.** Tests, independent replays and content hashes decide what stands — not how sure I feel. Results that disappoint are published with the same care as the ones that don't.

Even this page follows the rule: the site and my GitHub profile are generated from one catalog file, and the build refuses to pass if they disagree.

## Lately · Oct 2026 &nbsp;<sub><code>ckw log --now</code></sub>

- Finished three works made entirely in code: ORACLE, The Disease Called AI, and world.execute(me).
- Wrote up the RuleDiff negative result as a short technical report; the RuleShift-Web paper is still a draft.
- Had two fixes merged into other people's projects: DeepSeek Harness Desktop and dsh-engram.
- Learning Lean 4 and Mathlib, one proof at a time, through ProofWeave and SAIR.

## Merged into other projects &nbsp;<sub><code>gh pr list --state merged</code></sub>

- [dsh-tauri/deepseek-harness-desktop#740](https://github.com/dsh-tauri/deepseek-harness-desktop/pull/740) — Resolved worktree paths through symlinks, so re-creating a worktree can no longer misjudge and delete uncommitted work. <sub>2026-09-26</sub>
- [kenz1117/dsh-engram#4](https://github.com/kenz1117/dsh-engram/pull/4) — Traced claims stored in the legacy database and added a careful, conservative migration. <sub>2026-09-21</sub>
- [EmiyaKatuz/Codex-Dream-Skin-Needy-Girl-Overdose#10](https://github.com/EmiyaKatuz/Codex-Dream-Skin-Needy-Girl-Overdose/pull/10) — Kept Windows verification failures distinguishable: a narrower native-window fallback, and standalone helper loading that works. <sub>2026-07-28</sub> · [case study](case-studies/windows-contribution.md)

<details>
<summary><b>More things I’ve made</b> — 10 more</summary>

**Tools**

- [Verified Search](https://github.com/f0909172434/dsh-plugin-verified-search) — A search plugin for DeepSeek Harness that keeps the passages it cites and shows you where the evidence runs out. Only verified_search is stable; four extensions are still experimental. 250 tests, no independent validation yet. *v0.1.1 · stable search / experimental extensions*
- [Second Agent Kit](https://github.com/f0909172434/dsh-second-agent-kit) — Safety patches for running DeepSeek Harness on macOS: Seatbelt sandboxing for shell commands, limits on input calls, and memory kept separate per project. The gaps are written down — it isn't a firewall for everything. *v0.1.4 · macOS only · experimental parts*
- [DSH Architecture Lab](https://github.com/f0909172434/dsh-architecture-lab) — A development-preview lab for trying memory and planning ideas on DeepSeek Harness in isolation (Lima VM or Seatbelt), with an outside judge and a cost meter. So far the results come from one small repair task. 85 tests. *v0.1.0-dev.9 · development preview*

**Research**

- [ProofWeave Core](https://github.com/f0909172434/proofweave-math-lab) — Write a proof as structured Markdown and ProofWeave checks it against a pinned Lean 4 / Mathlib. It reports two things separately: whether Lean certified it, and whether a person confirmed the statement says what you meant. It doesn't translate natural language. *experimental · Core 2*
- [RuleShift](https://github.com/f0909172434/ruleshift) — A small, deterministic test world for asking how an agent's memory copes when the rules change. In this pilot, plain retrieval did as well as the fancier strategies (153 / 160), for less cost. *research pilot · 800 paired tasks*
- [RuleShift-Web](https://github.com/f0909172434/ruleshift-web) — A workbench for auditing how agents remember web policies: 3,200 model runs against 1,600 controls. The surprise: a controller with no LLM at all beat both models. Draft paper, not yet reviewed. *pre-submission research snapshot*
- [Charlie Alpha 4B](https://github.com/f0909172434/Charlie-Alpha-4B) — An experimental 4B model (Qwen3.5, fine-tuned with MLX) that suggests which statistical procedure to use, running locally. It got better on a simulator benchmark (DGP-Regret −34%) but not on P-Bench or StatQA. *experimental v0.3.0 · mixed results*

**Learning**

- [TokenScope](https://github.com/f0909172434/tokenscope) — A bilingual playground for looking inside a language model: a hand-set one-head 5×5 attention toy, sampling knobs (temperature, top-k, top-p), and BPE merges one step at a time. Every number can be exported. *educational browser lab*
- [MiniHarness](https://github.com/f0909172434/miniharness) — A Python workshop where you build a small agent harness in eight steps — offline, against a scripted mock model — with a 38-module course in Traditional Chinese. For learning, not production. *8-step workshop · zh-TW curriculum*

**Other**

- [DeepSeek Girl](https://github.com/f0909172434/deepseek-girl-codex-pet) — One set of animations, two unofficial homes: a 16-direction animated pet for Codex Desktop, and a DeepSeek Harness plugin that reacts to what the session is doing. Works offline. *Codex v0.1.0 · Harness v0.2.0 · unofficial*

</details>

<picture><source media="(prefers-color-scheme: dark)" srcset="assets/footer-en-dark.svg"><img src="assets/footer-en-light.svg" alt="exit" width="100%"></picture>

<sub>Generated from <a href="https://github.com/f0909172434/f0909172434.github.io/blob/main/src/data/projects.json">projects.json</a> by <code>scripts/render-profile.mjs</code>; edits by hand are overwritten. Motion respects <code>prefers-reduced-motion</code>.</sub>
