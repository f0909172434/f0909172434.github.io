import { useEffect, useRef, useState } from "preact/hooks";
import type { Locale, UI } from "../locale";
import { fmt, pick } from "../locale";
import { META, lineUrl, rawRecord, slug, type Catalog, type Kind, type Project } from "../catalog";

type Filter = "all" | Kind;
const FILTERS: Filter[] = ["all", "tool", "research", "learning", "creative", "other"];

function LedgerFilters({ ui, filter, onFilter }: { ui: UI; filter: Filter; onFilter: (f: Filter) => void }) {
  return (
    <div class="chips" role="group" aria-label={ui.ledger.filterLabel} data-needs-js>
      {FILTERS.map((f) => (
        <button type="button" key={f} class="chip" aria-pressed={f === filter} onClick={() => onFilter(f)}>{ui.ledger.filters[f]}</button>
      ))}
    </div>
  );
}

function LedgerRecord({ p, index, total, ui, locale }: { p: Project; index: number; total: number; ui: UI; locale: Locale }) {
  const s = slug(p);
  const rec = META.records[s];
  const links: { href: string; label: string }[] = [];
  if (p.live) links.push({ href: p.live, label: ui.ledger.live });
  if (p.watch) links.push({ href: p.watch, label: ui.ledger.watch });
  links.push({ href: p.repo, label: ui.ledger.source });
  p.links.forEach((l) => links.push({ href: l.url, label: l.label }));
  return (
    <details class="record" id={`rec-${s}`} {...{ name: "ledger" }}>
      <summary class="record-summary">
        <span class="record-index mono">{String(index).padStart(2, "0")}</span>
        <span class="record-name">{p.name}</span>
        <span class="record-kind label">{ui.ledger.kinds[p.kind]}</span>
        <span class="record-status mono">{p.status}</span>
        <span class="record-neg mono" aria-hidden="true">{p.negative ? "−" : ""}</span>
        {p.negative && <span class="sr-only">{ui.ledger.hasNegative}</span>}
        <span class="record-toggle" aria-hidden="true"></span>
      </summary>
      <div class="record-body">
        <p class="record-desc">{locale === "en" ? p.descEn : p.descZh}</p>
        {p.negative && <p class="record-negative"><span class="mono accent">−</span><span>{pick(p.negative, locale)}</span></p>}
        <p class="record-links mono">
          {links.map((l, i) => (
            <span key={l.href}>{i > 0 && <span aria-hidden="true">· </span>}<a href={l.href} target="_blank" rel="noreferrer">{l.label} ↗</a></span>
          ))}
        </p>
        <p class="label">{ui.ledger.rawHeading}</p>
        <pre class="record-raw" role="region" aria-label={ui.ledger.rawHeading} tabIndex={0}><code>{rawRecord(p)}</code></pre>
        <p class="record-origin mono muted">
          {fmt(ui.ledger.origin, { i: index, total })} · <a href={lineUrl(p)} target="_blank" rel="noreferrer">projects.json#L{rec.start}–L{rec.end} ↗</a> · sha256 {META.sha256.slice(0, 12)}…
          {locale === "zh-Hans" && <span> · {ui.ledger.canonicalNote}</span>}
        </p>
      </div>
    </details>
  );
}

export function Ledger({ ui, locale, catalog }: { ui: UI; locale: Locale; catalog: Catalog }) {
  const [filter, setFilter] = useState<Filter>("all");
  const olRef = useRef<HTMLOListElement>(null);
  const total = catalog.projects.length;
  const visible = catalog.projects.filter((p) => filter === "all" || p.kind === filter).length;
  const countText = fmt(ui.ledger.count, { n: visible, total });

  // Deep links: open the record named by #rec-{slug}, on load and on hashchange.
  useEffect(() => {
    const open = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (!id.startsWith("rec-")) return;
      setFilter("all");
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el instanceof HTMLDetailsElement && olRef.current?.contains(el)) {
          el.open = true;
          el.scrollIntoView();
        }
      });
    };
    open();
    addEventListener("hashchange", open);
    return () => removeEventListener("hashchange", open);
  }, []);

  return (
    <section id="work" class="section container" aria-labelledby="work-title">
      <div class="section-margin"><p class="label">{ui.ledger.label}</p><p class="mono muted">{countText}</p></div>
      <div class="section-body">
        <h2 id="work-title">{ui.ledger.title}</h2>
        <p class="lede">{ui.ledger.intro}</p>
        <LedgerFilters ui={ui} filter={filter} onFilter={setFilter} />
        <p class="sr-only" aria-live="polite">{countText}</p>
        <ol class="ledger" ref={olRef}>
          {catalog.projects.map((p, i) => (
            <li key={slug(p)} hidden={filter !== "all" && p.kind !== filter}>
              <LedgerRecord p={p} index={i + 1} total={total} ui={ui} locale={locale} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
