<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/profile-hero-dark.svg">
  <img src="assets/profile-hero.svg" alt="Chih-Kai Wang — claims, with the evidence attached. A four-cycle C4: four vertices of degree 2, zero triangles." width="100%">
</picture>

[English](README.md) · [繁體中文](README.zh-TW.md) · 简体中文

# Chih-Kai Wang 王治凯

用 Python 与 TypeScript 做可检查的 AI 与数学研究工具：主张附上证据、负面结果留着、边界说清楚。

国立台北教育大学 数学暨资讯教育学系 数学组 · 预计 2028 年毕业。台北，台湾。Python · TypeScript · 寻找软件与 AI 实习。

[作品集](https://f0909172434.github.io/?lang=zh-Hant) · [简历 PDF](https://f0909172434.github.io/Chih-Kai-Wang-CV.pdf) · [Email](mailto:f0909172434@gmail.com)

## 近况 · 2026 年 10 月

- 发布三件全部以程序完成的作品：卜 ORACLE、病名为AI、world.execute(me)。
- 把 RuleDiff 的负面结果冻结成技术报告；RuleShift-Web 的论文仍在投稿前。
- 两个上游修正已合并：DeepSeek Harness Desktop 与 dsh-engram。
- 通过 ProofWeave 与 SAIR 学 Lean 4 / Mathlib。

## 精选作品

| 项目 | 做什么 | 状态 | 打开 |
|---|---|---|---|
| **[HonestCI](https://github.com/f0909172434/honest-ci)** | CLI 与 GitHub Action：检查 JUnit 报告存在、新鲜，且测试数不低于可信基线。不判断测试质量。 | v1.0.4 · npm / GitHub Marketplace | [源代码](https://github.com/f0909172434/honest-ci) |
| **[RigorGraph](https://github.com/f0909172434/rigorgraph)** | 本机优先的 Python CLI：把研究主张连到证据文件与独立审查记录，检查 SHA-256 哈希，输出离线审核报告。VERIFIED 表示通过记录的流程，不表示结论为真。 | PyPI 1.0.1 · public beta | [实际网站](https://f0909172434.github.io/examples/rigorgraph/math.html) |
| **[Finite Witness](https://github.com/f0909172434/finite-witness-webmcp)** | 在浏览器里穷举 6 个顶点以内的小图找反例，输出可由独立 Python 脚本重播的凭证。通过有限搜索是证据，不是证明。 | educational tool · 8 WebMCP tools | [实际网站](https://f0909172434.github.io/finite-witness-webmcp/) |
| **[SAIR Proof Press](https://github.com/f0909172434/sair-stage2-proof-press)** | 等式蕴涵求解器的公开伴随站：输出 Lean 检查的证明或有限反模型。冻结产物在 1,669 / 1,669 个公开输入上通过，最终运行没有调用模型。 | released-input evaluation · frozen artifacts | [实际网站](https://f0909172434.github.io/sair-stage2-proof-press/) |
| **[卜 ORACLE](https://github.com/f0909172434/ORACLE)** | 4 分 30 秒短片：凌晨三点，有人问 AI「她会好起来吗？」Three.js 在无头 Chromium 里只用 CPU 渲染，配乐与音效用 Python 合成。README 为片中的史料注明出处，并标示哪些是重建。 | v3.0 release · Oct 2026 | [观看](https://youtu.be/kQH1PZRkn00) |
| **[RuleDiff negative result](https://github.com/f0909172434/rulediff-negative-result)** | 四页技术报告：词汇式政策影响预测器在开发集的 macro-F1 是 0.99，在一组保留数据上掉到 0.67。未经同行评审。 | negative result · technical report | [源代码](https://github.com/f0909172434/rulediff-negative-result) |

## 我怎么工作

**设定框架。** 我写下问题、边界，以及什么才算完成：哪些测试、哪个重播、哪个哈希。

**运行。** Claude Code 与 Codex（含 Codex Cloud）在我审阅的分支上写大部分的程序、测试与文档。这些仓库里大多数的行是 agent 打出来的；每一个主张都由我负责。

**决定。** 由证据决定，不由信心决定：测试、独立的重播检查器、内容哈希。负面结果和正面结果一样，用同样的标准留下来。

这个网站与 GitHub 个人页 README 由同一份目录文件产生；两者不一致时，构建会失败。

## 以程序完成的影片

2026 年 10 月的三件作品：画面、音乐与剪接全部是源代码。每个仓库都记录了流程与限制。

- **[卜 ORACLE](https://github.com/f0909172434/ORACLE)** — 4 分 30 秒短片：凌晨三点，有人问 AI「她会好起来吗？」Three.js 在无头 Chromium 里只用 CPU 渲染，配乐与音效用 Python 合成。README 为片中的史料注明出处，并标示哪些是重建。 `Three.js r169 · SwiftShader (CPU) · numpy/scipy score` · [观看](https://youtu.be/kQH1PZRkn00)
- **[病名为AI · The Disease Called AI](https://github.com/f0909172434/The-Disease-Called-AI)** — 原创歌曲与手绘水彩 MV，3 分 35 秒，67 个镜头。乐谱是一支 Python 程序；DiffSinger 歌声用固定种子逐比特重现；用 Whisper 听写检查咬字。 `p5.js + p5.brush · DiffSinger · Kokoro · Whisper QA` · [观看](https://youtu.be/ha-ANfqri6g)
- **[world.execute(me); · Claude Code](https://github.com/f0909172434/world-execute-me-claude-code)** — 把 Mili 的 world.execute(me); 演成一场 Claude Code 会话，直接在终端里实时播放。纯 Node、零依赖；每一格画面都是歌曲时间的函数。非官方同人作品，承接 MisakaZentai 的 DeepSeek Harness 版；不含歌曲音频文件。 `Node 20, zero dependencies · 24-bit ANSI · braille/sextant canvases` · [观看](https://youtu.be/iEsGiRECytY)

## 留下来的负面结果

没有照期望走的结果也公开，和成功的结果一样附上冻结的产物。

- **[RuleShift](https://github.com/f0909172434/ruleshift)** — 简单检索与较复杂的记忆策略表现相当；复杂度没有换到成效。
- **[RuleShift-Web](https://github.com/f0909172434/ruleshift-web)** — 在冻结的保留矩阵上，不用 LLM 的控制器胜过两个模型。
- **[RuleDiff negative result](https://github.com/f0909172434/rulediff-negative-result)** — 开发集 0.99、保留集 0.67；完整论文的后续依预先注册的规则停止，冻结成这份报告。
- **[Charlie Alpha 4B](https://github.com/f0909172434/Charlie-Alpha-4B)** — P-Bench 与 StatQA 没有改善；只有模拟基准有变化。

## 已合并的上游贡献

- [dsh-tauri/deepseek-harness-desktop](https://github.com/dsh-tauri/deepseek-harness-desktop/pull/740) — 规范化符号链接的 worktree 路径，避免重建 worktree 时误判并删除未提交的修改。 (2026-09-26)
- [kenz1117/dsh-engram](https://github.com/kenz1117/dsh-engram/pull/4) — 追溯旧数据库的宣称，加入保守的迁移。 (2026-09-21)
- [EmiyaKatuz/Codex-Dream-Skin-Needy-Girl-Overdose](https://github.com/EmiyaKatuz/Codex-Dream-Skin-Needy-Girl-Overdose/pull/10) — 让 Windows 验证失败可区分：缩小原生窗口的降级判断，修正独立运行时的辅助模块加载。 (2026-07-28) · [案例](case-studies/windows-contribution.md)

## 其他作品

**工具**

- [Verified Search](https://github.com/f0909172434/dsh-plugin-verified-search) — DeepSeek Harness 检索插件：保留引用片段，让证据缺口可见。只有 verified_search 是稳定版，四个扩展工具仍属实验。250 个测试；尚无独立验证。 *v0.1.1 · stable search / experimental extensions*
- [Second Agent Kit](https://github.com/f0909172434/dsh-second-agent-kit) — DeepSeek Harness 的 macOS 修补：shell 进程的 Seatbelt 限制、输入调用上限、以项目为单位的记忆隔离。缺口都有记录；它不是通用防火墙。 *v0.1.4 · macOS only · experimental parts*
- [DSH Architecture Lab](https://github.com/f0909172434/dsh-architecture-lab) — 开发预览：在 DeepSeek Harness 上跑隔离的记忆／规划实验（Lima VM 或 Seatbelt），附外部评判与费用计量。目前的结果只来自一个小型修复任务。85 个测试。 *v0.1.0-dev.9 · development preview*

**研究**

- [ProofWeave Core](https://github.com/f0909172434/proofweave-math-lab) — 把作者手写的结构化 Markdown 证明交给固定版本的 Lean 4 / Mathlib 检查，并把「已认证」与「人工确认语义对齐」分开回报。不做自然语言翻译。 *experimental · Core 2*
- [RuleShift](https://github.com/f0909172434/ruleshift) — 确定性的本机测试床，看 agent 记忆策略如何面对规则改变。这次先导实验里，简单检索与较复杂的策略表现相当（153 / 160），成本更低。 *research pilot · 800 paired tasks*
- [RuleShift-Web](https://github.com/f0909172434/ruleshift-web) — Web 政策记忆审核工作台：3,200 次模型运行与 1,600 次对照。不用 LLM 的控制器比两个模型都强。草稿论文，未经审查。 *pre-submission research snapshot*
- [Charlie Alpha 4B](https://github.com/f0909172434/Charlie-Alpha-4B) — 实验性的 Qwen3.5-4B MLX 微调，在本机挑选统计程序。在模拟基准有改善（DGP-Regret −34%），在 P-Bench 与 StatQA 没有。 *experimental v0.3.0 · mixed results*

**学习**

- [TokenScope](https://github.com/f0909172434/tokenscope) — 双语浏览器实验室：手动设置的单头 5×5 注意力玩具、采样控制（temperature、top-k、top-p）、逐步 BPE 合并演示，数值可导出。 *educational browser lab*
- [MiniHarness](https://github.com/f0909172434/miniharness) — Python 工作坊：八步做出一个小型 agent harness，离线使用脚本化的模拟模型，附 38 个模块的繁体中文课程。不是生产环境用的。 *8-step workshop · zh-TW curriculum*

**其他**

- [DeepSeek Girl](https://github.com/f0909172434/deepseek-girl-codex-pet) — 同一份动画图集、两个非官方宿主套件：Codex Desktop 的 16 方向动画宠物，以及回应 Session 状态的 DeepSeek Harness 插件，离线运作。 *Codex v0.1.0 · Harness v0.2.0 · unofficial*

<sub>由 <a href="https://github.com/f0909172434/f0909172434.github.io/blob/main/src/data/projects.json">projects.json</a> 经 <code>scripts/render-profile.mjs</code> 产生；手动修改会被覆盖。</sub>
