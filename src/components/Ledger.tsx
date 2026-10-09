import { useEffect, useRef } from "preact/hooks";
import type { Locale, UI } from "../locale";
import { fmt, pick } from "../locale";
import { META, lineUrl, rawRecord, slug, type Catalog, type Kind, type Project } from "../catalog";
import { Section } from "./Section";

export type Filter = "all" | Kind;
export const FILTERS: Filter[] = ["all", "tool", "research", "learning", "creative", "other"];
const FLAG: Record<Filter, string> = { all: "", tool: "tool", research: "research", learning: "learning", creative: "film", other: "other" };
export const filterCommand = (f: Filter) => (f === "all" ? "ls -l" : `ls -l --kind=${FLAG[f]}`);

/** Minimal JSON colouring: keys, strings, numbers, literals, punctuation. */
function Json({ text, start }: { text: string; start: number }) {
  const re = /("(?:[^"\\]|\\.)*")(\s*:)?|(-?\d+(?:\.\d+)?)|\b(true|false|null)\b|([{}[\],])/g;
  return (
    <>
      {text.split("\n").map((line, i) => {
        const parts: preact.JSX.Element[] = [];
        let at = 0, m: RegExpExecArray | null;
        re.lastIndex = 0;
        while ((m = re.exec(line))) {
          if (m.index > at) parts.push(<>{line.slice(at, m.index)}</>);
          const cls = m[1] ? (m[2] ? "j-key" : "j-str") : m[3] ? "j-num" : m[4] ? "j-lit" : "j-pun";
          parts.push(<span class={cls}>{m[1] ?? m[0]}</span>);
          if (m[2]) parts.push(<span class="j-pun">{m[2]}</span>);
          at = m.index + m[0].length;
        }
        if (at < line.length) parts.push(<>{line.slice(at)}</>);
        return <span class="j-line" key={i}><span class="j-no" aria-hidden="true">{start + i}</span><span>{parts}</span>{"\n"}</span>;
      })}
    </>
  );
}

function Row({ p, index, total, ui, locale }: { p: Project; index: number; total: number; ui: UI; locale: Locale }) {
  const s = slug(p);
  const rec = META.records[s];
  const links: { href: string; label: string }[] = [];
  if (p.live) links.push({ href: p.live, label: ui.common.live });
  if (p.watch) links.push({ href: p.watch, label: ui.common.watch });
  links.push({ href: p.repo, label: ui.common.source });
  p.links.forEach((l) => links.push({ href: l.url, label: l.label }));
  return (
    <details class="rec" id={`rec-${s}`} {...{ name: "ledger" }}>
      <summary class="rec-sum">
        <span class="rec-idx">{String(index).padStart(2, "0")}</span>
        <span class={`rec-kind k-${p.kind}`}>{ui.ledger.kinds[p.kind]}</span>
        <span class="rec-name">{p.name}</span>
        <span class="rec-status">{p.status}</span>
        <span class="rec-neg" aria-hidden="true">{p.negative ? "−" : ""}</span>
        {p.negative && <span class="sr-only">{ui.ledger.hasNegative}</span>}
        <span class="rec-chev" aria-hidden="true">›</span>
      </summary>
      <div class="rec-body">
        <p class="rec-desc">{locale === "en" ? p.descEn : p.descZh}</p>
        {p.negative && <p class="rec-negative"><span class="tag tag-red">−</span><span>{pick(p.negative, locale)}</span></p>}
        <p class="rec-links">
          {links.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noreferrer">{l.label} <span aria-hidden="true">↗</span></a>)}
        </p>
        <div class="raw">
          <p class="raw-head">
            <span><span class="dim">$</span> sed -n '{rec.start},{rec.end}p' src/data/projects.json</span>
            <a href={lineUrl(p)} target="_blank" rel="noreferrer">#L{rec.start}–L{rec.end} ↗</a>
          </p>
          <pre class="raw-code" role="region" aria-label={ui.ledger.rawHeading} tabIndex={0}><code><Json text={rawRecord(p)} start={rec.start} /></code></pre>
          <p class="raw-foot">
            {fmt(ui.ledger.origin, { i: index, total })} · sha256 {META.sha256.slice(0, 16)}…
            {locale === "zh-Hans" && <> · {ui.ledger.canonicalNote}</>}
          </p>
        </div>
      </div>
    </details>
  );
}

export function Ledger({ ui, locale, catalog, filter, onFilter }: { ui: UI; locale: Locale; catalog: Catalog; filter: Filter; onFilter: (f: Filter) => void }) {
  const listRef = useRef<HTMLOListElement>(null);
  const total = catalog.projects.length;
  const visible = catalog.projects.filter((p) => filter === "all" || p.kind === filter);
  const countText = fmt(ui.ledger.count, { n: visible.length, total });

  useEffect(() => {                                // deep links: #rec-{slug} opens that record
    const open = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (!id.startsWith("rec-")) return;
      const el = document.getElementById(id);
      if (!(el instanceof HTMLDetailsElement) || !listRef.current?.contains(el)) return;
      if (el.parentElement?.hidden) onFilter("all");
      el.open = true;
      setTimeout(() => el.scrollIntoView({ block: "center" }), 60);
    };
    open();
    addEventListener("hashchange", open);
    return () => removeEventListener("hashchange", open);
  }, []);

  let shown = 0;
  return (
    <Section id="work" num="01" cwd="~/work" cmd={filterCommand(filter)} title={ui.ledger.title} intro={ui.ledger.intro}>
      <div class="flags ln" style={{ "--i": 2 }} role="group" aria-label={ui.ledger.filterLabel} data-needs-js>
        {FILTERS.map((f) => (
          <button type="button" key={f} class="flag" aria-pressed={f === filter} onClick={() => onFilter(f)}>
            <span class="dim" aria-hidden="true">--</span>{ui.ledger.filters[f]}
            <span class="flag-n">{f === "all" ? total : catalog.projects.filter((p) => p.kind === f).length}</span>
          </button>
        ))}
        <span class="flags-count" aria-live="polite">{countText}</span>
      </div>
      <div class="ledger-head ln" style={{ "--i": 3 }} aria-hidden="true">
        <span>#</span><span>{ui.ledger.head.kind}</span><span>{ui.ledger.head.name}</span><span>{ui.ledger.head.status}</span>
      </div>
      <ol class="ledger" ref={listRef}>
        {catalog.projects.map((p, i) => {
          const hidden = filter !== "all" && p.kind !== filter;
          if (!hidden) shown += 1;
          return (
            <li key={slug(p)} hidden={hidden} class="ln" style={{ "--i": 4 + shown }}>
              <Row p={p} index={i + 1} total={total} ui={ui} locale={locale} />
            </li>
          );
        })}
      </ol>
      <p class="ledger-foot ln" style={{ "--i": 5 + visible.length }}>
        <span class="g">✓</span> {countText} · <span class="dim">projects.json</span> sha256 <span class="violet">{META.sha256.slice(0, 12)}</span>
      </p>
    </Section>
  );
}
