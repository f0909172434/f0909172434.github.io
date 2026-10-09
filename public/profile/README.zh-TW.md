<picture><source media="(prefers-color-scheme: dark)" srcset="assets/hero-zh-TW-dark.svg"><img src="assets/hero-zh-TW-light.svg" alt="王治凱 — 一段終端機會話，做自我介紹：在台北念數學，做可以自己檢查的小工具，也用程式拍影片；正在找軟體與 AI 實習。" width="100%"></picture>

<p><a href="README.md">English</a> · <b>繁體中文</b> · <a href="README.zh-CN.md">简体中文</a> &nbsp;│&nbsp; <a href="https://f0909172434.github.io/?lang=zh-Hant">作品集</a> · <a href="https://f0909172434.github.io/Chih-Kai-Wang-CV.pdf">履歷 PDF</a> · <a href="mailto:f0909172434@gmail.com">Email</a></p>

我在國立臺北教育大學數學暨資訊教育學系數學組念書，預計 2028 年畢業。做專案時我最喜歡的時刻，是一個說法終於變得「可以檢查」：CI 不再只相信綠燈，而是真的去讀測試報告；研究的主張被綁到證據的每一個位元組；搜尋器交出反例時，也告訴你它找過多遠。沒有成功的想法，我也會留著公開——那也是工作的一部分。

最近在學 Lean 4 和 Mathlib，大多是邊做 ProofWeave、邊做 SAIR 求解器邊學的。我正在找軟體或 AI 實習，想加入一個用測試和證據、而不是用信心來決定什麼能上線的團隊。

## 做過的東西 &nbsp;<sub><code>ls -l --pinned</code></sub>

<p>
<a href="https://github.com/f0909172434/honest-ci"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/card-honest-ci-zh-TW-dark.svg"><img src="assets/card-honest-ci-zh-TW-light.svg" alt="HonestCI — 讓綠燈代表：該跑的測試，真的跑了。" width="49%"></picture></a>
<a href="https://f0909172434.github.io/examples/rigorgraph/math.html"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/card-rigorgraph-zh-TW-dark.svg"><img src="assets/card-rigorgraph-zh-TW-light.svg" alt="RigorGraph — 每個主張都綁著證據的位元組；改動一個位元組，稽核就失敗。" width="49%"></picture></a>
<a href="https://f0909172434.github.io/finite-witness-webmcp/"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/card-finite-witness-webmcp-zh-TW-dark.svg"><img src="assets/card-finite-witness-webmcp-zh-TW-light.svg" alt="Finite Witness — 把小圖全部檢查一遍找反例，再交給你一張能重播的憑證。" width="49%"></picture></a>
<a href="https://f0909172434.github.io/sair-stage2-proof-press/"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/card-sair-stage2-proof-press-zh-TW-dark.svg"><img src="assets/card-sair-stage2-proof-press-zh-TW-light.svg" alt="SAIR Proof Press — Lean 檢查過的證明或有限反模型；1,669 個公開輸入全數通過。" width="49%"></picture></a>
<a href="https://youtu.be/kQH1PZRkn00"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/card-ORACLE-zh-TW-dark.svg"><img src="assets/card-ORACLE-zh-TW-light.svg" alt="卜 ORACLE — 凌晨三點，有人問 AI 一個問題。一部完全由程式渲染的 4 分 30 秒短片。" width="49%"></picture></a>
<a href="https://github.com/f0909172434/rulediff-negative-result"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/card-rulediff-negative-result-zh-TW-dark.svg"><img src="assets/card-rulediff-negative-result-zh-TW-light.svg" alt="RuleDiff negative result — 開發集 0.99，保留集 0.67。結果沒撐住，所以我把它凍結、公開。" width="49%"></picture></a>
</p>

<sub>上面每個終端機畫面，都是對標示的 commit 真的跑過一次——輸出是複製下來的，不是寫出來的。</sub>

## 用程式拍的影片 &nbsp;<sub><code>ckw play --loop *</code></sub>

2026 年 10 月，我做了三件作品：畫面、音樂和剪接，全部都是程式碼。每個倉庫都寫下了它是怎麼做出來的，以及它做不到的地方。

<p>
<a href="https://youtu.be/kQH1PZRkn00"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/film-oracle-dark.svg"><img src="assets/film-oracle-light.svg" alt="卜 ORACLE" width="32%"></picture></a>
<a href="https://youtu.be/ha-ANfqri6g"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/film-disease-dark.svg"><img src="assets/film-disease-light.svg" alt="病名為AI · The Disease Called AI" width="32%"></picture></a>
<a href="https://youtu.be/iEsGiRECytY"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/film-world-dark.svg"><img src="assets/film-world-light.svg" alt="world.execute(me); · Claude Code" width="32%"></picture></a>
</p>

- **[卜 ORACLE](https://github.com/f0909172434/ORACLE)** — 一部 4 分 30 秒的短片。凌晨三點，有人問 AI：「她會好起來嗎？」畫面用 Three.js 在無頭 Chromium 裡只靠 CPU 渲染，配樂和音效用 Python 合成。片中的史料在 README 註明出處，也標出哪些是重建的。 `Three.js r169 · SwiftShader (CPU) · numpy/scipy score` · [▶ 觀看](https://youtu.be/kQH1PZRkn00)
- **[病名為AI · The Disease Called AI](https://github.com/f0909172434/The-Disease-Called-AI)** — 一首原創歌曲和手繪水彩 MV，3 分 35 秒、67 個鏡頭。樂譜是一支 Python 程式，DiffSinger 的歌聲用固定種子逐位元重現，再讓 Whisper 聽一遍檢查咬字。 `p5.js + p5.brush · DiffSinger · Kokoro · Whisper QA` · [▶ 觀看](https://youtu.be/ha-ANfqri6g)
- **[world.execute(me); · Claude Code](https://github.com/f0909172434/world-execute-me-claude-code)** — 把 Mili 的 world.execute(me); 演成一場 Claude Code 會話，直接在你的終端機裡即時播放。純 Node、零依賴，每一格畫面都是歌曲時間的函數。非官方同人作品，承接 MisakaZentai 的 DeepSeek Harness 版本；不含歌曲本身。 `Node 20, zero dependencies · 24-bit ANSI · braille/sextant canvases` · [▶ 觀看](https://youtu.be/iEsGiRECytY)

## 沒成功的實驗 &nbsp;<sub><code>ckw verify --keep-negatives</code></sub>

不是每個實驗都會成功。這些是沒有照我期待走的結果，一樣公開，一樣附上凍結的資料。

- ✗ **[RuleShift](https://github.com/f0909172434/ruleshift)** — 最簡單的檢索就和複雜的記憶策略一樣好——多出來的複雜度沒有換到成效。
- ✗ **[RuleShift-Web](https://github.com/f0909172434/ruleshift-web)** — 在凍結的保留資料上，不用 LLM 的控制器贏過兩個模型。
- ✗ **[RuleDiff negative result](https://github.com/f0909172434/rulediff-negative-result)** — 開發集 0.99、保留集 0.67。依照我事先登記好的規則，完整論文的後續就此停止，凍結成這份報告。
- ✗ **[Charlie Alpha 4B](https://github.com/f0909172434/Charlie-Alpha-4B)** — P-Bench 和 StatQA 沒有進步；只有模擬基準有變化。

## 我怎麼工作 &nbsp;<sub><code>git log --graph</code></sub>

**`01` 先問清楚。** 動手之前，我先寫下：要回答什麼問題、範圍到哪裡、怎樣才算完成——要過哪些測試、用什麼重播、比對哪個雜湊。

**`02` 和 agent 一起做。** 大部分的程式、測試和文件，由 Claude Code 與 Codex（含 Codex Cloud）在我審閱的分支上完成。這裡多數的程式碼是 agent 打的，但每一個主張都由我負責。

**`03` 讓證據決定。** 留下什麼，由測試、獨立重播和內容雜湊決定，而不是看我有多有把握。令人失望的結果，也用同樣的認真公開。

連這一頁也照這個規則：網站和 GitHub 個人頁由同一份目錄檔產生，兩邊對不上，建置就不會通過。

## 最近 · 2026 年 10 月 &nbsp;<sub><code>ckw log --now</code></sub>

- 完成三件全部用程式做的作品：卜 ORACLE、病名為AI、world.execute(me)。
- 把 RuleDiff 的負面結果寫成一份短的技術報告；RuleShift-Web 的論文還是草稿。
- 兩個修正被合併進別人的專案：DeepSeek Harness Desktop 與 dsh-engram。
- 透過 ProofWeave 和 SAIR，一個證明、一個證明地學 Lean 4 與 Mathlib。

## 被合併進別人專案的貢獻 &nbsp;<sub><code>gh pr list --state merged</code></sub>

- [dsh-tauri/deepseek-harness-desktop#740](https://github.com/dsh-tauri/deepseek-harness-desktop/pull/740) — 讓 worktree 路徑先解析符號連結，重建 worktree 時就不會誤判、刪掉還沒提交的修改。 <sub>2026-09-26</sub>
- [kenz1117/dsh-engram#4](https://github.com/kenz1117/dsh-engram/pull/4) — 追查舊資料庫裡存放的宣稱，加上一個謹慎、保守的遷移。 <sub>2026-09-21</sub>
- [EmiyaKatuz/Codex-Dream-Skin-Needy-Girl-Overdose#10](https://github.com/EmiyaKatuz/Codex-Dream-Skin-Needy-Girl-Overdose/pull/10) — 讓 Windows 上的驗證失敗分得清楚：縮小原生視窗的降級判斷，並修好獨立執行時的輔助模組載入。 <sub>2026-07-28</sub> · [案例](case-studies/windows-contribution.md)

<details>
<summary><b>更多作品</b> — 還有 10 個</summary>

**工具**

- [Verified Search](https://github.com/f0909172434/dsh-plugin-verified-search) — DeepSeek Harness 的檢索外掛：保留它引用的原文段落，也讓你看見證據在哪裡斷掉。只有 verified_search 是穩定版，另外四個擴充仍在實驗。250 個測試，尚未經過獨立驗證。 *v0.1.1 · stable search / experimental extensions*
- [Second Agent Kit](https://github.com/f0909172434/dsh-second-agent-kit) — 讓 DeepSeek Harness 在 macOS 上跑得更安全的修補：用 Seatbelt 限制 shell 指令、限制輸入呼叫次數、每個專案的記憶彼此隔離。還有哪些缺口都寫清楚了——它不是萬用防火牆。 *v0.1.4 · macOS only · experimental parts*
- [DSH Architecture Lab](https://github.com/f0909172434/dsh-architecture-lab) — 開發中的實驗室：在隔離環境（Lima VM 或 Seatbelt）裡試 DeepSeek Harness 的記憶與規劃想法，配上外部評審和費用計量。目前的結果只來自一個小型修復任務。85 個測試。 *v0.1.0-dev.9 · development preview*

**研究**

- [ProofWeave Core](https://github.com/f0909172434/proofweave-math-lab) — 用結構化的 Markdown 寫證明，ProofWeave 會拿固定版本的 Lean 4 / Mathlib 來檢查。它把兩件事分開回報：Lean 有沒有認證，以及有沒有人確認敘述真的是你想說的。它不做自然語言翻譯。 *experimental · Core 2*
- [RuleShift](https://github.com/f0909172434/ruleshift) — 一個小而確定的測試世界，用來問：規則改變時，agent 的記憶撐不撐得住？這次先導實驗裡，最簡單的檢索和比較複雜的策略表現相當（153 / 160），成本還更低。 *research pilot · 800 paired tasks*
- [RuleShift-Web](https://github.com/f0909172434/ruleshift-web) — 稽核 agent 如何記住網站政策的工作台：3,200 次模型執行，對照 1,600 次控制組。意外的是，完全不用 LLM 的控制器比兩個模型都強。論文還是草稿，尚未經過審查。 *pre-submission research snapshot*
- [Charlie Alpha 4B](https://github.com/f0909172434/Charlie-Alpha-4B) — 實驗性的 4B 模型（Qwen3.5，用 MLX 微調），在本機建議該用哪種統計方法。它在模擬基準上進步了（DGP-Regret −34%），但在 P-Bench 和 StatQA 上沒有。 *experimental v0.3.0 · mixed results*

**學習**

- [TokenScope](https://github.com/f0909172434/tokenscope) — 一個看進語言模型內部的雙語遊樂場：手動設定的單頭 5×5 注意力玩具、取樣旋鈕（temperature、top-k、top-p），以及一步一步的 BPE 合併。每個數字都能匯出。 *educational browser lab*
- [MiniHarness](https://github.com/f0909172434/miniharness) — Python 工作坊：分八步親手做出一個小型 agent harness，全程離線、搭配腳本化的模擬模型，附 38 個單元的繁體中文課程。用來學習，不是上線用的。 *8-step workshop · zh-TW curriculum*

**其他**

- [DeepSeek Girl](https://github.com/f0909172434/deepseek-girl-codex-pet) — 同一套動畫、兩個非官方的家：Codex Desktop 上會朝 16 個方向看的動畫寵物，以及會隨 Session 狀態反應的 DeepSeek Harness 外掛。離線運作。 *Codex v0.1.0 · Harness v0.2.0 · unofficial*

</details>

<picture><source media="(prefers-color-scheme: dark)" srcset="assets/footer-zh-TW-dark.svg"><img src="assets/footer-zh-TW-light.svg" alt="exit" width="100%"></picture>

<sub>由 <a href="https://github.com/f0909172434/f0909172434.github.io/blob/main/src/data/projects.json">projects.json</a> 經 <code>scripts/render-profile.mjs</code> 產生；手動修改會被覆蓋。動畫會遵守 <code>prefers-reduced-motion</code>。</sub>
