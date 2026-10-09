import { useEffect, useState } from "preact/hooks";
import type { Locale, UI } from "../locale";
import { fmt, formatMonth, pick } from "../locale";
import { EMAIL, GITHUB, META, counts, type Catalog } from "../catalog";
import { useTyped } from "../lib/motion";
import { DotName } from "./DotName";

const SWATCHES = ["--ink", "--ink-2", "--dim", "--green", "--amber", "--red", "--blue", "--violet"];

export function Hero({ ui, locale, catalog }: { ui: UI; locale: Locale; catalog: Catalog }) {
  const [run, setRun] = useState(false);
  useEffect(() => { const id = setTimeout(() => setRun(true), 380); return () => clearTimeout(id); }, []);
  const typed = useTyped("ckw whoami", run, 46);
  const k = ui.hero.keys;
  const [based, study] = catalog.profile.facts;
  const rows: [string, string, string?][] = [
    [k.name, locale === "en" ? "Chih-Kai Wang · 王治凱" : "王治凱 · Chih-Kai Wang"],
    [k.study, pick(study, locale)],
    [k.based, `${pick(based, locale)} · UTC+8`],
    [k.stack, ui.hero.stack],
    [k.agents, ui.hero.agents],
    [k.records, fmt(ui.hero.records, { projects: counts.projects, negatives: counts.negatives, merged: counts.merged })],
    [k.status, ui.hero.status, "ok"],
  ];

  return (
    <section id="top" class={`hero container${run || typed.done ? " out" : ""}`} style={{ "--d0": `${run ? typed.ms + 900 : 0}ms` }} aria-labelledby="hero-name">
      <p class="cmd hero-cmd">
        <span class="ps1" aria-hidden="true"><span class="ps1-host">ckw</span> <span class="ps1-cwd">~</span> <span class="ps1-arrow">❯</span> </span>
        <span class="cmd-typed">{typed.text}</span>
        <span class={`caret${typed.done ? " caret-off" : ""}`} aria-hidden="true" />
        <span class="hero-sha" aria-hidden="true">sha256 {META.sha256.slice(0, 8)}</span>
      </p>

      <div id="hero-name" class="hero-name">
        {run && <DotName wide={["CHIH-KAI WANG"]} narrow={["CHIH-KAI", "WANG"]} label="Chih-Kai Wang" />}
        {!run && <div class="dotname"><h1 class="dotname-text">Chih-Kai Wang</h1></div>}
      </div>

      <div class="hero-grid">
        <div class="fetch">
          <p class="fetch-head ln" style={{ "--i": 0 }}><span class="g">chih-kai</span><span class="dim">@</span><span class="g">taipei</span></p>
          <p class="fetch-rule ln" style={{ "--i": 1 }} aria-hidden="true">────────────────</p>
          <dl class="fetch-list">
            {rows.map(([key, value, tone], i) => (
              <div class="ln" style={{ "--i": i + 2 }} key={key}>
                <dt>{key}</dt>
                <dd class={tone === "ok" ? "ok" : undefined}>{tone === "ok" && <span class="pulse" aria-hidden="true" />}{value}</dd>
              </div>
            ))}
          </dl>
          <p class="swatches ln" style={{ "--i": rows.length + 2 }} aria-hidden="true">
            {SWATCHES.map((v) => <span key={v} style={{ background: `var(${v})` }} />)}
          </p>
        </div>

        <div class="hero-side">
          <p class="comment ln" style={{ "--i": 3 }}><span class="hash" aria-hidden="true"># </span>{pick(catalog.positioning, locale)}</p>
          <div class="actions ln" style={{ "--i": 5 }}>
            <a class="key key-primary" href="#work"><span>{ui.hero.primary}</span><kbd aria-hidden="true">↵</kbd></a>
            <a class="key" href="/Chih-Kai-Wang-CV.pdf">{ui.common.cv}</a>
            <a class="key" href={EMAIL}>{ui.common.email}</a>
            <a class="key" href={GITHUB}>{ui.common.github} <span aria-hidden="true">↗</span></a>
          </div>
          <p class="hero-meta ln" style={{ "--i": 7 }}>
            <span>{fmt(ui.hero.updated, { date: formatMonth(catalog.profile.now.asOf, locale) })}</span>
            <span class="hint" aria-hidden="true">{ui.hero.hint}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
