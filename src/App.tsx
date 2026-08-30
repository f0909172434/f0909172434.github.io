import { useEffect, useMemo, useRef, useState } from "preact/hooks";

type Locale = "zh-Hant" | "en";
type LensMode = "claim" | "evidence" | "boundary";
type ProjectKind = "all" | "research" | "infrastructure" | "interfaces";

const LINKS = {
  github: "https://github.com/f0909172434",
  finite: "https://f0909172434.github.io/finite-witness-webmcp/",
};

const copy = {
  "zh-Hant": {
    nav: ["方法", "公開作品", "研究方向", "關於我"],
    navLabel: "主要導覽",
    heroKicker: "王治凱 · AI4Math / 可驗證推理",
    heroTitle: "讓證據，\n跟得上主張。",
    heroBody: "我研究 AI 如何參與數學與科學工作，也製作讓推理、失敗與可信邊界可以被檢查的開源工具。",
    explore: "進入驗證透鏡",
    github: "查看 GitHub",
    location: "台北，台灣",
    education: "國立臺北教育大學 · 2028 預計畢業",
    focus: "AI for Mathematics · Research infrastructure",
    lensKicker: "核心方法 / 01—03",
    lensTitle: "不要只看結論。移動透鏡，檢查它憑什麼成立。",
    lensHelp: "拖曳、觸控或用方向鍵移動透鏡；向下閱讀會切換檢查層。",
    lensModes: { claim: "主張", evidence: "證據", boundary: "邊界" },
    chapters: [
      { title: "先固定主張", body: "把問題、版本與成功條件寫清楚，避免結果出現後才移動標準。" },
      { title: "再接上證據", body: "保存來源、執行環境、計數與失敗，讓別人能重播判斷。" },
      { title: "最後標出邊界", body: "通過檢查代表什麼、不代表什麼，必須一起出現在結果旁。" },
    ],
    noteOpen: "打開研究者邊註",
    noteClose: "收起研究者邊註",
    note: "我偏好能保留負面結果的系統。沒有升級、資料不足、只在有限範圍成立，都是結果的一部分。",
    workKicker: "公開工作 / 9 個原創倉庫",
    workTitle: "不是作品牆，是一組檢查工具。",
    workBody: "以下只列公開倉庫。私有研究資料與尚未公開的評測不會被包裝成作品。",
    filters: { all: "全部", research: "研究", infrastructure: "基礎設施", interfaces: "互動介面" },
    openRepo: "開啟倉庫",
    openLive: "開啟實際網站",
    current: "目前狀態",
    researchKicker: "研究方向 / 現在進行式",
    researchTitle: "我關心的是：證據到底允許我們說到哪裡？",
    researchBody: "從形式化證明、有限反例搜尋，到模型評測與可重現研究代理，我把『判斷依據』做成可讀、可執行、可追溯的物件。",
    axes: [
      ["數學推理", "自動定理證明、Autoformalization、有限結構與反例"],
      ["證據治理", "主張升級條件、負面結果、可重現評測與稽核"],
      ["研究工程", "本機優先工具、確定性報告、工作流程與安全邊界"],
    ],
    aboutTitle: "王治凱",
    aboutBody: "國立臺北教育大學數學暨資訊教育學系數學組學士生，預計 2028 年畢業。我主要使用 Python、TypeScript 與 Lean 4，並持續尋找 AI4Math 研究、實習與開源協作機會。",
    contact: "研究或合作",
    cv: "履歷 PDF",
    back: "回到頂端",
    metaTitle: "王治凱｜AI4Math 與可驗證推理",
    metaDescription: "王治凱的 AI4Math、可驗證推理與可稽核研究工程作品集。",
  },
  en: {
    nav: ["Method", "Public work", "Research", "About"],
    navLabel: "Primary navigation",
    heroKicker: "CHIH-KAI WANG · AI4MATH / VERIFIABLE REASONING",
    heroTitle: "Keep evidence\nattached to claims.",
    heroBody: "I study how AI can participate in mathematical and scientific work, and build open tools that keep reasoning, failures, and trust boundaries inspectable.",
    explore: "Enter the verification lens",
    github: "View GitHub",
    location: "Taipei, Taiwan",
    education: "National Taipei University of Education · Expected 2028",
    focus: "AI for Mathematics · Research infrastructure",
    lensKicker: "CORE METHOD / 01—03",
    lensTitle: "Do not stop at the conclusion. Move the lens and inspect what licenses it.",
    lensHelp: "Drag, touch, or use arrow keys. Scrolling changes the layer under inspection.",
    lensModes: { claim: "Claim", evidence: "Evidence", boundary: "Boundary" },
    chapters: [
      { title: "Freeze the claim", body: "State the question, version, and success condition before seeing the result." },
      { title: "Attach the evidence", body: "Keep sources, runtime, counts, and failures so another person can replay the judgment." },
      { title: "Mark the boundary", body: "What a check means, and what it cannot establish, should stay next to the result." },
    ],
    noteOpen: "Open research margin note",
    noteClose: "Close research margin note",
    note: "I prefer systems that preserve negative results. No upgrade, insufficient evidence, and bounded validity are outcomes, too.",
    workKicker: "PUBLIC WORK / 9 ORIGINAL REPOSITORIES",
    workTitle: "A set of instruments, not a project wall.",
    workBody: "Only public repositories appear here. Private research data and unreleased evaluations are not repackaged as portfolio work.",
    filters: { all: "All", research: "Research", infrastructure: "Infrastructure", interfaces: "Interfaces" },
    openRepo: "Open repository",
    openLive: "Open live site",
    current: "Current state",
    researchKicker: "RESEARCH / IN PROGRESS",
    researchTitle: "What does the evidence actually license us to say?",
    researchBody: "Across formal proofs, finite counterexample search, model evaluation, and reproducible research agents, I turn the basis for a judgment into something readable, executable, and traceable.",
    axes: [
      ["Mathematical reasoning", "Automated theorem proving, autoformalization, finite structures, and counterexamples"],
      ["Evidence governance", "Claim promotion, negative results, reproducible evaluation, and audit"],
      ["Research engineering", "Local-first tools, deterministic reports, workflows, and safety boundaries"],
    ],
    aboutTitle: "Chih-Kai Wang",
    aboutBody: "B.S. student in the Mathematics Education Division at National Taipei University of Education, expected 2028. I work mainly with Python, TypeScript, and Lean 4, and I am open to AI4Math research, internships, and open-source collaboration.",
    contact: "Research or collaboration",
    cv: "CV PDF",
    back: "Back to top",
    metaTitle: "Chih-Kai Wang | AI4Math & Verifiable Reasoning",
    metaDescription: "Chih-Kai Wang — AI4Math, verifiable reasoning, and auditable research engineering.",
  },
} as const;

const projectData = [
  { name: "Finite Witness", kind: "interfaces", status: "Live · WebMCP", descZh: "人與代理共享的有限圖論反例實驗室；搜尋最小反例、保存證據並測試修補後的主張。", descEn: "A shared finite-graph counterexample lab for people and agents: find a minimal witness, preserve it, and test repairs.", repo: "https://github.com/f0909172434/finite-witness-webmcp", live: LINKS.finite, mark: "FW", tone: "coral" },
  { name: "RigorGraph", kind: "infrastructure", status: "v1.0.1 · Public beta", descZh: "本機優先的主張—證據圖、確定性稽核、離線報告與 GitHub Action。", descEn: "Local-first claim-evidence graphs, deterministic audit, offline reports, and a GitHub Action.", repo: "https://github.com/f0909172434/rigorgraph", mark: "RG", tone: "blue" },
  { name: "ProofWeave Core", kind: "research", status: "v2.0.0", descZh: "把作者提供的結構化證明轉成可檢查的認證流程，並保持形式憑證與語意範圍分離。", descEn: "Turns author-supplied structured proofs into inspectable certification runs while separating formal validity from semantic scope.", repo: "https://github.com/f0909172434/proofweave-math-lab", mark: "PW", tone: "ink" },
  { name: "HonestCI", kind: "infrastructure", status: "v1.0.4 · npm", descZh: "檢查綠燈 CI 背後的 JUnit 證據是否新鮮、非空，且符合可信測試基線。", descEn: "Checks that the JUnit evidence behind green CI is fresh, non-empty, and consistent with a trusted baseline.", repo: "https://github.com/f0909172434/honest-ci", mark: "HC", tone: "acid" },
  { name: "Charlie Alpha 4B", kind: "research", status: "Experimental v0.3.0", descZh: "Apple Silicon 上的三語統計程序選擇模型；公開結果保留 DGP 改善與其他基準未改善的負面結論。", descEn: "A trilingual statistical procedure-selection model for Apple Silicon; its public result preserves both DGP gains and benchmark non-improvements.", repo: "https://github.com/f0909172434/Charlie-Alpha-4B", mark: "CA", tone: "violet" },
  { name: "Verified Search", kind: "infrastructure", status: "v0.1.1 stable", descZh: "為 DeepSeek Harness 提供限制範圍、保留來源與可見缺口的即時資訊檢索。", descEn: "Bounded current-source retrieval for DeepSeek Harness with retained sources and visible evidence gaps.", repo: "https://github.com/f0909172434/dsh-plugin-verified-search", mark: "VS", tone: "blue" },
  { name: "DeepSeek Girl / Harness", kind: "interfaces", status: "v0.2.0", descZh: "依 Session 狀態切換動畫、具 16 方向追視與減少動態支援的 Cordis 桌寵。", descEn: "A Cordis desktop pet with session-aware animation, 16-direction tracking, and reduced-motion support.", repo: "https://github.com/f0909172434/dsh-deepseek-girl-pet", mark: "DG", tone: "coral" },
  { name: "DeepSeek Girl / Codex", kind: "interfaces", status: "Pet v2", descZh: "為 Codex Desktop 製作的開源動畫圖集與安裝工具，包含九種狀態與 16 個觀看方向。", descEn: "An open animated pet sheet and installer for Codex Desktop, with nine states and 16 viewing directions.", repo: "https://github.com/f0909172434/deepseek-girl-codex-pet", mark: "CD", tone: "violet" },
  { name: "SWP5 Input Bridge", kind: "infrastructure", status: "v0.2.0 · Experimental", descZh: "把受限數學記法轉成 Scientific WorkPlace 5.5 原生物件與保守 UI 操作。", descEn: "Converts restricted math notation into native Scientific WorkPlace 5.5 objects through conservative UI automation.", repo: "https://github.com/f0909172434/swp5-input-bridge", mark: "S5", tone: "ink" },
] as const;

function VerificationLens({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const storyRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<LensMode>("claim");
  const [position, setPosition] = useState({ x: 62, y: 38 });
  const [note, setNote] = useState(false);

  useEffect(() => {
    const update = () => {
      const node = storyRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const travel = Math.max(1, node.offsetHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(0.999, -rect.top / travel));
      setMode(progress < 0.34 ? "claim" : progress < 0.68 ? "evidence" : "boundary");
    };
    update();
    addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, []);

  const move = (clientX: number, clientY: number) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition({
      x: Math.max(9, Math.min(91, ((clientX - rect.left) / rect.width) * 100)),
      y: Math.max(12, Math.min(88, ((clientY - rect.top) / rect.height) * 100)),
    });
  };

  const keyboardMove = (event: KeyboardEvent) => {
    const delta = event.shiftKey ? 8 : 3;
    const next = { ...position };
    if (event.key === "ArrowLeft") next.x -= delta;
    else if (event.key === "ArrowRight") next.x += delta;
    else if (event.key === "ArrowUp") next.y -= delta;
    else if (event.key === "ArrowDown") next.y += delta;
    else return;
    event.preventDefault();
    setPosition({ x: Math.max(9, Math.min(91, next.x)), y: Math.max(12, Math.min(88, next.y)) });
  };

  return (
    <section ref={storyRef} id="method" className="lens-story" aria-labelledby="lens-title">
      <div className="lens-sticky section-pad">
        <header className="lens-heading">
          <p className="eyebrow">{t.lensKicker}</p>
          <h2 id="lens-title">{t.lensTitle}</h2>
          <p>{t.lensHelp}</p>
        </header>
        <div className="lens-layout">
          <div
            ref={stageRef}
            className={`lens-stage mode-${mode}`}
            style={{ "--lens-x": `${position.x}%`, "--lens-y": `${position.y}%` }}
            onPointerMove={(event) => move(event.clientX, event.clientY)}
            onPointerDown={(event) => move(event.clientX, event.clientY)}
            onKeyDown={keyboardMove}
            role="application"
            tabIndex={0}
            aria-label={`${t.lensModes[mode]} — ${t.lensHelp}`}
          >
            <div className="lens-grid" aria-hidden="true" />
            <div className="specimen specimen-claim"><span>CLAIM / C-17</span><strong>Evidence justifies promotion</strong><small>scope: bounded evaluation</small></div>
            <div className="specimen specimen-evidence"><span>EVIDENCE / E-42</span><strong>source hash · run log · review</strong><small>replayable record · retained failures</small></div>
            <div className="specimen specimen-boundary"><span>BOUNDARY / B-03</span><strong>Workflow evidence only</strong><small>does not establish universal truth</small></div>
            <div className="lens-reveal" aria-hidden="true">
              <div className="reveal-ring"><span>{t.lensModes[mode]}</span></div>
              <svg viewBox="0 0 700 480" preserveAspectRatio="none">
                <path className="trace trace-one" d="M72 118 C180 54 254 206 346 146 S520 70 630 116" />
                <path className="trace trace-two" d="M62 335 C184 250 248 402 374 310 S534 246 642 350" />
                <path className="trace trace-three" d="M136 70 C198 178 122 254 232 348 S454 412 560 236" />
                <g className="trace-nodes"><circle cx="72" cy="118" r="7"/><circle cx="346" cy="146" r="7"/><circle cx="630" cy="116" r="7"/><circle cx="62" cy="335" r="7"/><circle cx="374" cy="310" r="7"/><circle cx="642" cy="350" r="7"/></g>
              </svg>
            </div>
            <div className="lens-cursor" aria-hidden="true"><span>{String(Math.round(position.x)).padStart(2, "0")} / {String(Math.round(position.y)).padStart(2, "0")}</span></div>
          </div>
          <div className="lens-chapters" aria-live="polite">
            {(["claim", "evidence", "boundary"] as LensMode[]).map((key, index) => (
              <button className={mode === key ? "is-active" : ""} onClick={() => setMode(key)} type="button" key={key}>
                <span>0{index + 1}</span><strong>{t.chapters[index].title}</strong><p>{t.chapters[index].body}</p>
              </button>
            ))}
            <button className="margin-note-toggle" type="button" aria-expanded={note} onClick={() => setNote(!note)}>{note ? t.noteClose : t.noteOpen} <span aria-hidden="true">{note ? "×" : "+"}</span></button>
            {note && <aside className="margin-note"><span>HAND NOTE / NEGATIVE RESULTS</span><p>{t.note}</p></aside>}
          </div>
        </div>
      </div>
    </section>
  );
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
      <nav className="top-nav section-pad" aria-label={t.navLabel}>
        <a className="brand" href="#top"><span>C</span> Chih-Kai Wang</a>
        <div className="nav-links">{["#method", "#work", "#research", "#about"].map((href, index) => <a href={href} key={href}>{t.nav[index]}</a>)}</div>
        <div className="locale-switch" aria-label="Language"><button className={locale === "zh-Hant" ? "is-active" : ""} onClick={() => setLocale("zh-Hant")} type="button" aria-pressed={locale === "zh-Hant"}>繁</button><button className={locale === "en" ? "is-active" : ""} onClick={() => setLocale("en")} type="button" aria-pressed={locale === "en"}>EN</button></div>
      </nav>

      <section className="hero section-pad">
        <div className="hero-copy"><p className="eyebrow">{t.heroKicker}</p><h1>{t.heroTitle.split("\n").map((line) => <span key={line}>{line}</span>)}</h1><p className="hero-body">{t.heroBody}</p><div className="hero-actions"><a className="primary-action" href="#method">{t.explore} ↓</a><a href={LINKS.github} target="_blank" rel="noreferrer">{t.github} ↗</a></div></div>
        <div className="hero-device" aria-hidden="true">
          <div className="orbit orbit-one"><span>CLAIM</span></div><div className="orbit orbit-two"><span>EVIDENCE</span></div><div className="orbit orbit-three"><span>BOUNDARY</span></div>
          <div className="hero-seal"><strong>CW</strong><span>VERIFIABLE<br/>REASONING</span></div>
          <svg viewBox="0 0 580 580"><path d="M74 310C94 152 210 65 361 89c117 18 180 108 154 223-27 122-141 220-276 196C116 486 56 424 74 310Z"/><path d="M123 345c58-88 107-142 206-160 80-15 152 27 166 102 15 78-51 156-143 178-105 25-179-26-229-120Z"/></svg>
        </div>
        <div className="hero-meta"><p><span>01</span>{t.location}</p><p><span>02</span>{t.education}</p><p><span>03</span>{t.focus}</p></div>
      </section>

      <VerificationLens locale={locale} />
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
