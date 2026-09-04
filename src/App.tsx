import { useEffect, useMemo, useState } from "preact/hooks";

type Locale = "zh-Hant" | "en";
type ProjectKind = "all" | "research" | "infrastructure" | "interfaces";

const LINKS = {
  github: "https://github.com/f0909172434",
  finite: "https://f0909172434.github.io/finite-witness-webmcp/",
};

const copy = {
  "zh-Hant": {
    nav: ["案例", "公開作品", "研究方向", "關於我"],
    navLabel: "主要導覽",
    heroKicker: "王治凱 · 尋找軟體工程與 AI 應用實習",
    heroTitle: "寫出工具，\n留下依據。",
    heroBody: "我用 Python 與 TypeScript 製作開發工具和互動研究應用。從圖論反例搜尋到測試報告檢查，讓使用者看見結果，也能追查結果的依據。",
    explore: "閱讀實作案例",
    github: "查看 GitHub",
    location: "台北，台灣",
    education: "國立臺北教育大學 · 2028 預計畢業",
    focus: "Python · TypeScript · AI research tools",
    workKicker: "公開作品 / 10 個專案",
    workTitle: "從實作，看到方法。",
    workBody: "每個專案附上目前狀態與原始碼。先看上方三件代表作，再依你的興趣展開其他工作。",
    filters: { all: "全部", research: "研究", infrastructure: "基礎設施", interfaces: "互動介面" },
    openRepo: "開啟倉庫",
    openLive: "開啟實際網站",
    current: "目前狀態",
    researchKicker: "研究方向 / 現在進行式",
    researchTitle: "持續研究，持續留下可檢查的結果。",
    researchBody: "從形式化證明、有限反例搜尋，到模型評測與可重現研究代理，我把『判斷依據』做成可讀、可執行、可追溯的物件。",
    axes: [
      ["數學推理", "自動定理證明、Autoformalization、有限結構與反例"],
      ["證據治理", "主張升級條件、負面結果、可重現評測與稽核"],
      ["研究工程", "本機優先工具、確定性報告、工作流程與安全邊界"],
    ],
    aboutTitle: "王治凱",
    aboutBody: "國立臺北教育大學數學暨資訊教育學系數學組學士生，預計 2028 年畢業。我希望參與軟體工程與 AI 應用實習，持續累積開發、測試與開源協作經驗；Lean 4 與形式化方法是目前的研究學習方向。",
    contact: "實習與合作聯絡",
    cv: "履歷 PDF",
    back: "回到頂端",
    metaTitle: "王治凱｜軟體工程與 AI 研究工具作品集",
    metaDescription: "王治凱的 Python、TypeScript、開發工具與互動研究作品。尋找軟體工程與 AI 應用實習，預計 2028 年畢業。",
  },
  en: {
    nav: ["Case studies", "Public work", "Research", "About"],
    navLabel: "Primary navigation",
    heroKicker: "CHIH-KAI WANG · OPEN TO SOFTWARE & AI INTERNSHIPS",
    heroTitle: "Make the work\ninspectable.",
    heroBody: "I build developer tools and interactive research applications with Python and TypeScript. From graph counterexamples to test reports, I make results and their supporting evidence easy to inspect.",
    explore: "Read the case studies",
    github: "View GitHub",
    location: "Taipei, Taiwan",
    education: "National Taipei University of Education · Expected 2028",
    focus: "Python · TypeScript · AI research tools",
    workKicker: "PUBLIC WORK / 10 PROJECTS",
    workTitle: "Code, with a point of view.",
    workBody: "Each project includes its current status and source. Start with the three selected samples above, then explore the rest by area.",
    filters: { all: "All", research: "Research", infrastructure: "Infrastructure", interfaces: "Interfaces" },
    openRepo: "Open repository",
    openLive: "Open live site",
    current: "Current state",
    researchKicker: "RESEARCH / IN PROGRESS",
    researchTitle: "Research with inspectable results.",
    researchBody: "Across formal proofs, finite counterexample search, model evaluation, and reproducible research agents, I turn the basis for a judgment into something readable, executable, and traceable.",
    axes: [
      ["Mathematical reasoning", "Automated theorem proving, autoformalization, finite structures, and counterexamples"],
      ["Evidence governance", "Claim promotion, negative results, reproducible evaluation, and audit"],
      ["Research engineering", "Local-first tools, deterministic reports, workflows, and safety boundaries"],
    ],
    aboutTitle: "Chih-Kai Wang",
    aboutBody: "B.S. student in the Mathematics Education Division at National Taipei University of Education, expected 2028. I am seeking software engineering and AI application internships, and developing my skills in Lean 4 and formal methods through research projects.",
    contact: "Internships & collaboration",
    cv: "CV PDF",
    back: "Back to top",
    metaTitle: "Chih-Kai Wang | Software & AI Research Tools",
    metaDescription: "Python, TypeScript, developer tools and interactive research applications by Chih-Kai Wang. Open to software and AI internships. Expected graduation 2028.",
  },
} as const;

const projectData = [
  { name: "Finite Witness", kind: "interfaces", status: "Live · WebMCP", descZh: "人與代理共享的有限圖論反例實驗室；搜尋最小反例、保存證據並測試修補後的主張。", descEn: "A shared finite-graph counterexample lab for people and agents: find a minimal witness, preserve it, and test repairs.", repo: "https://github.com/f0909172434/finite-witness-webmcp", live: LINKS.finite, mark: "FW", tone: "coral" },
  { name: "RigorGraph", kind: "infrastructure", status: "v1.0.1 · Public beta", descZh: "本機優先的主張—證據圖、確定性稽核、離線報告與 GitHub Action。", descEn: "Local-first claim-evidence graphs, deterministic audit, offline reports, and a GitHub Action.", repo: "https://github.com/f0909172434/rigorgraph", mark: "RG", tone: "blue" },
  { name: "ProofWeave Core", kind: "research", status: "Experimental · Core 2.0.0 / evidence v0.1.0", descZh: "把作者提供的結構化證明轉成可檢查的認證流程，並保持形式憑證與語意範圍分離。", descEn: "Turns author-supplied structured proofs into inspectable certification runs while separating formal validity from semantic scope.", repo: "https://github.com/f0909172434/proofweave-math-lab", mark: "PW", tone: "ink" },
  { name: "HonestCI", kind: "infrastructure", status: "v1.0.4 · npm", descZh: "檢查綠燈 CI 背後的 JUnit 證據是否新鮮、非空，且符合可信測試基線。", descEn: "Checks that the JUnit evidence behind green CI is fresh, non-empty, and consistent with a trusted baseline.", repo: "https://github.com/f0909172434/honest-ci", mark: "HC", tone: "acid" },
  { name: "Charlie Alpha 4B", kind: "research", status: "Experimental v0.3.0", descZh: "Apple Silicon 上的三語統計程序選擇模型；公開結果保留 DGP 改善與其他基準未改善的負面結論。", descEn: "A trilingual statistical procedure-selection model for Apple Silicon; its public result preserves both DGP gains and benchmark non-improvements.", repo: "https://github.com/f0909172434/Charlie-Alpha-4B", mark: "CA", tone: "violet" },
  { name: "Verified Search", kind: "infrastructure", status: "v0.1.1 stable", descZh: "為 DeepSeek Harness 提供限制範圍、保留來源與可見缺口的即時資訊檢索。", descEn: "Bounded current-source retrieval for DeepSeek Harness with retained sources and visible evidence gaps.", repo: "https://github.com/f0909172434/dsh-plugin-verified-search", mark: "VS", tone: "blue" },
  { name: "DeepSeek Girl / Harness", kind: "interfaces", status: "v0.2.0", descZh: "依 Session 狀態切換動畫、具 16 方向追視與減少動態支援的 Cordis 桌寵。", descEn: "A Cordis desktop pet with session-aware animation, 16-direction tracking, and reduced-motion support.", repo: "https://github.com/f0909172434/dsh-deepseek-girl-pet", mark: "DG", tone: "coral" },
  { name: "DeepSeek Girl / Codex", kind: "interfaces", status: "Pet v2", descZh: "為 Codex Desktop 製作的開源動畫圖集與安裝工具，包含九種狀態與 16 個觀看方向。", descEn: "An open animated pet sheet and installer for Codex Desktop, with nine states and 16 viewing directions.", repo: "https://github.com/f0909172434/deepseek-girl-codex-pet", mark: "CD", tone: "violet" },
  { name: "SAIR Proof Press", kind: "research", status: "Released-input evaluation", descZh: "Lean 檢查的等式蘊涵求解器公開伴隨站；收錄凍結產物、公開輸入評測與英文論文。", descEn: "Public companion to Lean-checked equational implication solvers, with frozen artifacts, released-input evaluation and an English paper.", repo: "https://github.com/f0909172434/sair-stage2-proof-press", live: "https://f0909172434.github.io/sair-stage2-proof-press/", mark: "SP", tone: "ink" },
  { name: "MiniHarness", kind: "interfaces", status: "2 ready / 38 planned modules", descZh: "Python agent harness 教材與八步動手營，附可操作的循環示範；較廣的課程地圖仍在編寫。", descEn: "A Python agent-harness tutorial and eight-step workshop with an interactive loop demo; the broader curriculum is in progress.", repo: "https://github.com/f0909172434/miniharness", live: "https://f0909172434.github.io/miniharness/", mark: "MH", tone: "acid" },
] as const;

const samples = [
  {
    name: "Finite Witness", mark: "FW", category: "JavaScript / Web Workers / WebMCP",
    result: "C₄ · 39 candidates", receipt: "fw-b20670c4", slug: "finite-witness",
    source: "https://github.com/f0909172434/finite-witness-webmcp",
    link: "https://f0909172434.github.io/finite-witness-webmcp/",
    zh: {
      problem: "每個最小度數至少為 2 的圖，都有三角形嗎？",
      process: "在 3–6 個頂點的有限範圍枚舉簡單圖，保留實際搜尋前綴。",
      result: "第 39 個候選：四邊形 C₄。四個頂點、四條邊、零個三角形。",
      boundary: "C₄ 已推翻這個全稱主張；其他搜尋若沒有找到反例，只能報告搜尋範圍。",
      decision: "將枚舉放入 Web Worker，介面保持可操作。UI 與八個 WebMCP 工具使用相同引擎，讓人與代理能檢查同一份結果。",
      detail: "點選頂點，檢查度數。四個頂點的度數都是 2，仍然沒有三角形。",
      scope: "已記錄的搜尋範例。這裡重播結果；完整搜尋可在原專案執行。",
    },
    en: {
      problem: "Does every graph with minimum degree 2 contain a triangle?",
      process: "Enumerate simple graphs with 3–6 vertices and retain the exact searched prefix.",
      result: "Candidate 39 is C₄: four vertices, four edges, zero triangles.",
      boundary: "C₄ disproves this universal claim. A search with no witness can only report its searched bound.",
      decision: "Enumeration runs in a Web Worker to keep the UI responsive. The interface and eight WebMCP tools share one engine, so people and agents can inspect the same result.",
      detail: "Select a vertex to inspect its degree. All four have degree 2, with no triangle.",
      scope: "Recorded search example. This view replays the result; run the full search in the project.",
    },
  },
  {
    name: "HonestCI", mark: "HC", category: "TypeScript / Node.js / GitHub Actions",
    result: "HCI004_ZERO_TESTS", receipt: "JUnit: tests = 0", slug: "honest-ci",
    source: "https://github.com/f0909172434/honest-ci",
    link: "https://github.com/f0909172434/honest-ci/blob/main/launch/DEMO.md",
    zh: {
      problem: "測試指令成功結束，就代表真的有執行測試嗎？",
      process: "讀取 JUnit 報告，檢查報告是否存在、是否新鮮、測試數量與可信基線。",
      result: "報告記錄零個測試，HonestCI 以 HCI004_ZERO_TESTS 阻擋這次執行。",
      boundary: "檢查的是測試證據的完整性；通過並不表示軟體沒有錯誤。",
      decision: "將檢查包成 CLI 與 GitHub Action，留下機器可讀的證據。基線來自可信版本，避免待驗證的修改自行降低標準。",
      detail: "執行指令的退出碼和 JUnit 測試數量是不同訊號；這個範例故意讓退出碼為 0。",
      scope: "文件中的零測試情境示意。查看原始 demo 可重跑相同失敗模式。",
    },
    en: {
      problem: "Does a successful test command mean any tests actually ran?",
      process: "Inspect JUnit reports for presence, freshness, test counts and a trusted baseline.",
      result: "The report contains zero tests. HonestCI blocks the run with HCI004_ZERO_TESTS.",
      boundary: "This checks the integrity of test evidence. Passing does not establish that software is bug-free.",
      decision: "A CLI and GitHub Action retain machine-readable evidence. Baselines come from a trusted revision, so a proposed change cannot silently lower its own standard.",
      detail: "An exit code and a JUnit test count are separate signals. This example deliberately exits with code 0.",
      scope: "Illustration of the documented zero-test scenario. The source demo reproduces the failure mode.",
    },
  },
  {
    name: "RigorGraph", mark: "RG", category: "Python / JSON Schema / Offline HTML",
    result: "Evidence changed → review", receipt: "Workflow integrity", slug: "rigorgraph",
    source: "https://github.com/f0909172434/rigorgraph",
    link: "https://github.com/f0909172434/rigorgraph#quick-start-three-minutes",
    zh: {
      problem: "證據檔案改變後，舊的審查結論還適用嗎？",
      process: "把主張、證據檔案、內容雜湊與審查記錄連在一起，確定性地檢查狀態。",
      result: "證據內容變動會被稽核指出，讓舊審查與目前檔案的差異可見。",
      boundary: "驗證研究流程與記錄完整性，沒有自動判定科學結論為真。",
      decision: "採用可版本控制的 JSON 記錄，輸出自含式離線報告。研究者可以一起檢查主張與證據，也能在沒有服務後端的環境分享。",
      detail: "雜湊只能回答檔案是否相同。證據是否充分，仍然需要有範圍的審查。",
      scope: "工作流程概念示意。安裝 PyPI 公開 beta 1.0.1 可操作實際稽核。",
    },
    en: {
      problem: "When evidence changes, does an earlier review still apply?",
      process: "Connect claims, evidence files, content hashes and reviews, then audit their state deterministically.",
      result: "Changed evidence bytes are surfaced so an old review can be distinguished from the current file.",
      boundary: "This verifies workflow and record integrity. It does not decide whether a scientific claim is true.",
      decision: "Version-controlled JSON records produce self-contained offline reports. Researchers can inspect claims beside their evidence and share reports without a service backend.",
      detail: "A hash answers whether bytes match. Whether evidence is sufficient still requires a scoped review.",
      scope: "Conceptual workflow illustration. Install public beta 1.0.1 from PyPI to run the actual audit.",
    },
  },
] as const;

function SampleSelector({ selected, onSelect }: { selected: number; onSelect: (index: number) => void }) {
  return <div className="sample-selector" role="group" aria-label="Work sample">
    {samples.map((sample, i) => <button type="button" aria-pressed={i === selected} onClick={() => onSelect(i)} key={sample.mark}><span>0{i + 1}</span>{sample.name}</button>)}
  </div>;
}

function SampleDevice({ locale, selected, onSelect }: { locale: Locale; selected: number; onSelect: (index: number) => void }) {
  const [progress, setProgress] = useState(60);
  const [playing, setPlaying] = useState(false);
  const [inspection, setInspection] = useState<number | null>(null);
  const [detail, setDetail] = useState(false);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const sample = samples[selected];
  const t = locale === "en" ? sample.en : sample.zh;
  const labels = locale === "en" ? ["Problem", "Check", "Result", "Boundary"] : ["問題", "檢查", "結果", "範圍"];
  const stage = Math.min(3, Math.floor(progress / 25));
  const stageText = [t.problem, t.process, t.result, t.boundary][stage];
  useEffect(() => { setProgress(60); setPlaying(false); setInspection(null); setDetail(false); }, [selected]);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { setReduced(media.matches); if (media.matches) setPlaying(false); };
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (!playing || reduced) return;
    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const step = Math.min(60, now - previous) / 120;
      previous = now;
      setProgress(p => Math.min(100, p + step));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, reduced]);
  useEffect(() => { if (progress >= 100) setPlaying(false); }, [progress]);
  const seek = (value: number) => { setPlaying(false); setProgress(value); };
  return <div className="sample-book">
    <div className="book-binding"><span>OPEN WORK / 2026</span><span>0{selected + 1} — 03</span></div>
    <SampleSelector selected={selected} onSelect={onSelect} />
    <div className={`sample-drawing sample-${sample.mark.toLowerCase()}`} style={{ "--scan": `${progress}%` }}>
      <div className="drawing-label"><span>{sample.mark} / {labels[stage]}</span><span>{locale === 'en' ? 'RECORDED EXAMPLE' : '記錄與示意'}</span></div>
      {selected === 0 ? <svg viewBox="0 0 500 270" role="group" aria-label={locale === "en" ? "C4 graph; select a vertex to inspect its degree" : "四邊形 C4；選擇頂點檢查度數"}>
        <path className="graph-guide" d="M120 54H380V218H120Z M120 54L380 218 M380 54L120 218" />
        <path className="graph-edges" d="M120 54H380V218H120Z" pathLength="100" style={{ strokeDasharray: 100, strokeDashoffset: 100 - Math.min(100, progress * 1.7) }} />
        {[[120,54], [380,54], [380,218], [120,218]].map(([x,y],i) => <g className="vertex" key={i} role="button" tabIndex={0} aria-label={`v${i + 1}, ${locale === 'en' ? 'degree 2' : '度數 2'}`} aria-pressed={inspection === i} onClick={() => setInspection(inspection === i ? null : i)} onKeyDown={e => {if(e.key === 'Enter' || e.key === ' ') {e.preventDefault(); setInspection(inspection === i ? null : i);}}}>
          <circle className="vertex-target" cx={x} cy={y} r="23" /><circle className={inspection === i ? 'selected-node' : ''} cx={x} cy={y} r="8" /><text x={x + (i === 0 || i === 3 ? -30 : 22)} y={y + 5}>v{i + 1}</text>
        </g>)}
        <text className="figure-big" x="250" y="132" textAnchor="middle">{progress < 50 ? '∀ ?' : 'C₄'}</text>
        <text className="figure-small" x="250" y="156" textAnchor="middle">{inspection !== null ? `deg(v${inspection + 1}) = 2` : progress < 50 ? 'min degree ≥ 2' : '4 V / 4 E / 0 triangles'}</text>
      </svg> : selected === 1 ? <svg viewBox="0 0 500 270" role="img" aria-label={t.result}>
        <path className="report-outline" d="M94 36H316L348 68V232H94Z M316 36V68H348" />
        <text className="figure-small" x="120" y="75">RUNNER / EXIT CODE 0</text>
        {[0,1,2].map(i=><line className="report-line" key={i} x1="120" y1={104+i*16} x2={275-i*30} y2={104+i*16}/>)}
        <text className="figure-big" x="120" y="195">0 <tspan className="figure-small">tests</tspan></text>
        <g style={{ opacity: progress >= 50 ? 1 : .12 }}><circle className="failure-stamp" cx="355" cy="176" r="57"/><path className="failure-cross" d="M338 159L372 193M372 159L338 193"/></g>
      </svg> : <svg viewBox="0 0 500 270" role="img" aria-label={t.result}>
        <path className="graph-guide" d="M98 134H400" />
        <path className="graph-edges" d="M98 134H250" pathLength="100" style={{strokeDasharray:100,strokeDashoffset:100-Math.min(100,progress*2)}}/>
        <path className="review-edge" d="M250 134H400" style={{strokeDasharray:progress>=50 ? '5 8':'none'}}/>
        {[98,250,400].map((x,i)=><g key={x}><circle className={i === 1 && progress >=50 ? 'changed-record' : 'record-node'} cx={x} cy="134" r="29"/><text className="figure-small" x={x} y="139" textAnchor="middle">{['C','E','R'][i]}</text><text className="figure-small" x={x} y="192" textAnchor="middle">{['claim','evidence','review'][i]}</text></g>)}
        <text className="figure-small" x="250" y="65" textAnchor="middle">{progress >= 50 ? 'hash changed → review needed' : 'claim → evidence → review'}</text>
      </svg>}
      <div className="scan-line" aria-hidden="true" />
      <div className="drawing-foot"><span>{progress < 50 ? 'INSPECTING' : sample.receipt}</span><span>{String(Math.round(progress)).padStart(3,'0')} / 100</span></div>
    </div>
    <div className="sample-controls">
      <div className="sequence-stages" role="group" aria-label={locale === 'en' ? 'Sequence chapter' : '示範章節'}>{labels.map((label,i)=><button type="button" key={label} aria-pressed={stage === i} onClick={()=>seek(i === 3 ? 100 : i*25)}><span>0{i+1}</span>{label}</button>)}</div>
      <label className="sequence-range"><span>{locale === 'en' ? 'Scrub the example' : '拖曳檢查過程'}</span><input type="range" min="0" max="100" value={progress} onInput={e=>seek(Number(e.currentTarget.value))} aria-valuetext={`${Math.round(progress)}% · ${labels[stage]}`} /></label>
      <p className="sequence-caption" aria-live={playing ? 'off' : 'polite'}>{stageText}</p>
      <div className="sequence-actions">{!reduced && <button type="button" onClick={()=>{if(!playing)setProgress(0);setPlaying(!playing);}}>{playing ? (locale === 'en' ? 'Ⅱ Pause' : 'Ⅱ 暫停') : (locale === 'en' ? '▷ Replay 12-second sequence' : '▷ 重播 12 秒過程')}</button>}<button type="button" aria-expanded={detail} onClick={()=>setDetail(!detail)}>{locale === 'en' ? 'Inspect a detail' : '打開細節'} {detail?'−':'+'}</button><button type="button" aria-pressed={reduced} onClick={()=>{setReduced(!reduced);setPlaying(false);}}>{locale === 'en' ? 'Static reading' : '靜態閱讀'} {reduced?'✓':''}</button></div><a className="sample-origin" href={sample.link} target="_blank" rel="noreferrer">{locale === 'en' ? 'Open the original example' : '開啟原始範例'} ↗</a>
      {detail && <aside className="specimen-note">{t.detail}</aside>}
      <p className="sample-disclosure">{t.scope}</p>
    </div>
  </div>;
}

function CaseStudy({ locale, selected, onSelect }: { locale: Locale; selected: number; onSelect: (index: number) => void }) {
  const sample = samples[selected];
  const t = locale === 'en' ? sample.en : sample.zh;
  return <section className="case-section section-pad" id="method" aria-labelledby="case-title">
    <div className="case-heading"><p className="eyebrow">{locale === 'en' ? 'FROM SAMPLE TO SOURCE' : '從樣本，走到原始碼'}</p><h2 id="case-title">{locale === 'en' ? 'The decisions behind the result.' : '結果背後，\n做了哪些選擇。'}</h2><SampleSelector selected={selected} onSelect={onSelect}/></div>
    <article className="case-record" key={sample.mark}>
      <div className="case-record-top"><span>0{selected+1} / {sample.mark}</span><span>{sample.category}</span></div>
      <h3>{sample.name}</h3><p className="case-problem">{t.problem}</p>
      <div className="case-facts"><div><span>{locale==='en'?'ENGINEERING DECISION':'實作選擇'}</span><p>{t.decision}</p></div><div><span>{locale==='en'?'OBSERVABLE RESULT':'可檢查的結果'}</span><p>{t.result}</p></div></div>
      <p className="case-boundary"><span>↳</span>{t.boundary}</p>
      <div className="case-links"><a href={`${LINKS.github}/f0909172434/blob/main/case-studies/${sample.slug}.md`} target="_blank" rel="noreferrer">{locale==='en'?'Full case study':'完整案例'} ↗</a><a href={sample.link} target="_blank" rel="noreferrer">{locale==='en'?'Try the example':'查看範例'} ↗</a><a href={sample.source} target="_blank" rel="noreferrer">{locale==='en'?'Source':'原始碼'} ↗</a></div>
    </article>
    <aside className="contribution-strip"><span>{locale==='en'?'MERGED CONTRIBUTION':'已合併的外部貢獻'}</span><p>{locale==='en'?'Codex Dream Skin · Windows verification fallback and standalone helper loading.':'Codex Dream Skin · 修正 Windows 驗證的降級判斷與獨立執行時的輔助模組載入。'}</p><a href="https://github.com/EmiyaKatuz/Codex-Dream-Skin-Needy-Girl-Overdose/pull/10" target="_blank" rel="noreferrer">PR #10 ↗</a></aside>
  </section>;
}

function ProjectIndex({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [kind, setKind] = useState<ProjectKind>("all");
  const projects = useMemo(() => projectData.filter((project) => kind === "all" || project.kind === kind), [kind]);
  return (
    <section id="work" className="work section-pad" aria-labelledby="work-title">
      <header className="work-heading"><p className="eyebrow">{t.workKicker}</p><h2 id="work-title">{t.workTitle}</h2><p>{t.workBody}</p></header>
      <div className="project-filters" aria-label="Project filters">
        {(Object.keys(t.filters) as ProjectKind[]).map((key) => <button type="button" className={kind === key ? "is-active" : ""} aria-pressed={kind === key} onClick={() => setKind(key)} key={key}>{t.filters[key]}</button>)}
      </div>
      <div className="project-index">
        {projects.map((project, index) => (
          <article className={`project-row tone-${project.tone}`} key={project.name}>
            <div className="project-number">{String(index + 1).padStart(2, "0")}</div><div className="project-mark" aria-hidden="true">{project.mark}</div>
            <div className="project-copy"><h3>{project.name}</h3><p>{locale === "zh-Hant" ? project.descZh : project.descEn}</p></div>
            <div className="project-status"><span>{t.current}</span><strong>{project.status}</strong></div>
            <div className="project-links">{"live" in project && project.live && <a href={project.live} target="_blank" rel="noreferrer">{t.openLive} ↗</a>}<a href={project.repo} target="_blank" rel="noreferrer">{t.openRepo} ↗</a></div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const [locale, setLocale] = useState<Locale>(() => {
    const requested = new URLSearchParams(location.search).get("lang");
    if (requested === "en" || requested === "zh-Hant") return requested;
    return navigator.language.startsWith("zh") ? "zh-Hant" : "en";
  });
  const t = copy[locale];
  const [sample, setSample] = useState(0);

  useEffect(() => {
    document.documentElement.lang = locale === "zh-Hant" ? "zh-Hant" : "en";
    document.title = t.metaTitle;
    document.querySelector('meta[name="description"]')?.setAttribute("content", t.metaDescription);
    const url = new URL(location.href);
    url.searchParams.set("lang", locale);
    history.replaceState({}, "", url);
  }, [locale, t.metaDescription, t.metaTitle]);

  return (
    <main id="top">
      <a className="skip-link" href="#method">{locale === "en" ? "Skip to case study" : "跳到實作案例"}</a>
      <nav className="top-nav section-pad" aria-label={t.navLabel}>
        <a className="brand" href="#top"><span>C</span> Chih-Kai Wang</a>
        <div className="nav-links">{["#method", "#work", "#research", "#about"].map((href, index) => <a href={href} key={href}>{t.nav[index]}</a>)}</div>
        <div className="locale-switch" aria-label="Language"><button className={locale === "zh-Hant" ? "is-active" : ""} onClick={() => setLocale("zh-Hant")} type="button" aria-pressed={locale === "zh-Hant"}>繁</button><button className={locale === "en" ? "is-active" : ""} onClick={() => setLocale("en")} type="button" aria-pressed={locale === "en"}>EN</button></div>
      </nav>

      <section className="hero section-pad">
        <div className="hero-copy"><p className="eyebrow">{t.heroKicker}</p><h1>{t.heroTitle.split("\n").map((line) => <span key={line}>{line}</span>)}</h1><p className="hero-body">{t.heroBody}</p><div className="hero-actions"><a className="primary-action" href="#method">{t.explore} ↓</a><a href="/Chih-Kai-Wang-CV.pdf" target="_blank" rel="noreferrer">{t.cv} ↗</a></div></div>
        <SampleDevice locale={locale} selected={sample} onSelect={setSample} />
        <div className="hero-meta"><p><span>01</span>{t.location}</p><p><span>02</span>{t.education}</p><p><span>03</span>{t.focus}</p></div>
      </section>

      <CaseStudy locale={locale} selected={sample} onSelect={setSample} />
      <ProjectIndex locale={locale} />

      <section id="research" className="research section-pad">
        <div className="research-intro"><p className="eyebrow">{t.researchKicker}</p><h2>{t.researchTitle}</h2><p>{t.researchBody}</p></div>
        <div className="research-axes">{t.axes.map(([title, body], index) => <article key={title}><span>R/{index + 1}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
      </section>

      <section id="about" className="about section-pad"><div className="about-number">2028</div><div className="about-copy"><p className="eyebrow">{t.location}</p><h2>{t.aboutTitle}</h2><p>{t.aboutBody}</p></div><div className="about-links"><p>{t.contact}</p><a href="mailto:f0909172434@gmail.com">f0909172434@gmail.com</a><a href="/Chih-Kai-Wang-CV.pdf" target="_blank" rel="noreferrer">{t.cv} ↗</a></div></section>
      <footer className="footer section-pad"><p>© 2026 Chih-Kai Wang</p><a href={LINKS.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href="#top">{t.back} ↑</a></footer>
    </main>
  );
}
