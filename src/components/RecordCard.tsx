import type { Locale, UI } from "../locale";
import { formatMonth } from "../locale";
import { META, RAW_URL, SOURCE_URL, counts, type Catalog } from "../catalog";

export function RecordCard({ ui, locale, catalog }: { ui: UI; locale: Locale; catalog: Catalog }) {
  const asOf = catalog.profile.now.asOf;
  return (
    <aside class="record-card" aria-labelledby="rc-title">
      <p class="label" id="rc-title">{ui.record.title}</p>
      <dl class="record-dl">
        <div><dt>{ui.record.projects}</dt><dd><span class="num">{counts.projects}</span></dd></div>
        <div><dt>{ui.record.negatives}</dt><dd><span class="num">{counts.negatives}</span></dd></div>
        <div><dt>{ui.record.merged}</dt><dd><span class="num">{counts.merged}</span></dd></div>
        <div><dt>{ui.record.films}</dt><dd><span class="num">{counts.films}</span></dd></div>
        <div><dt>{ui.record.asOf}</dt><dd><time datetime={asOf}>{formatMonth(asOf, locale)}</time></dd></div>
        <div class="record-hash"><dt>{ui.record.hash}</dt><dd><code title={META.sha256}>{META.sha256.slice(0, 16)}…</code></dd></div>
      </dl>
      <p class="record-verify mono">
        <a href={SOURCE_URL} target="_blank" rel="noreferrer">{ui.record.source} ↗</a> ·{" "}
        <a href={RAW_URL} target="_blank" rel="noreferrer">{ui.record.raw} ↗</a>
        <br />
        <code>shasum -a 256 src/data/projects.json</code>
      </p>
    </aside>
  );
}
