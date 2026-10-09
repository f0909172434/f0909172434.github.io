import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import type { Locale, UI } from "../locale";
import { fmt } from "../locale";
import { EMAIL, GITHUB, slug, type Catalog } from "../catalog";
import { FILTERS, type Filter } from "./Ledger";

export interface PaletteActions {
  go: (id: string) => void;
  filter: (f: Filter) => void;
  open: (slug: string) => void;
  lang: (l: Locale) => void;
  theme: (t: "dark" | "light" | "auto") => void;
}
interface Cmd { name: string; desc: string; run: () => void }

const KIND_FLAG: Record<Filter, string> = { all: "", tool: "tool", research: "research", learning: "learning", creative: "film", other: "other" };

/** A real command line for the page. Every section prompt shows a command this palette also understands. */
export function Palette({ ui, catalog, open, onClose, act }: { ui: UI; catalog: Catalog; open: boolean; onClose: () => void; act: PaletteActions }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const c = ui.palette.cmds;

  const all: Cmd[] = useMemo(() => [
    { name: "whoami", desc: c.whoami, run: () => act.go("top") },
    { name: "ls", desc: c.ls, run: () => { act.filter("all"); act.go("work"); } },
    ...FILTERS.filter((f) => f !== "all").map((f) => ({ name: `ls ${KIND_FLAG[f]}`, desc: c["ls-kind"], run: () => { act.filter(f); act.go("work"); } })),
    ...catalog.projects.map((p) => ({ name: `open ${slug(p)}`, desc: p.name, run: () => act.open(slug(p)) })),
    { name: "verify", desc: c.negatives, run: () => act.go("negatives") },
    { name: "cases", desc: c.cases, run: () => act.go("cases") },
    { name: "method", desc: c.method, run: () => act.go("method") },
    { name: "play", desc: c.play, run: () => act.go("films") },
    { name: "log", desc: c.log, run: () => act.go("log") },
    { name: "about", desc: c.about, run: () => act.go("about") },
    { name: "cv", desc: c.cv, run: () => { location.href = "/Chih-Kai-Wang-CV.pdf"; } },
    { name: "mail", desc: c.mail, run: () => { location.href = EMAIL; } },
    { name: "github", desc: c.github, run: () => { window.open(GITHUB, "_blank", "noopener"); } },
    { name: "lang en", desc: c.lang, run: () => act.lang("en") },
    { name: "lang zh-Hant", desc: c.lang, run: () => act.lang("zh-Hant") },
    { name: "lang zh-Hans", desc: c.lang, run: () => act.lang("zh-Hans") },
    { name: "theme dark", desc: c.theme, run: () => act.theme("dark") },
    { name: "theme light", desc: c.theme, run: () => act.theme("light") },
    { name: "theme auto", desc: c.theme, run: () => act.theme("auto") },
  ], [ui, catalog]);

  const words = q.trim().toLowerCase().replace(/^ckw\s+/, "").split(/\s+/).filter(Boolean);
  const list = words.length
    ? all.filter((x) => words.every((w) => `${x.name} ${x.desc}`.toLowerCase().includes(w)))
        .sort((a, b) => Number(!a.name.startsWith(words[0])) - Number(!b.name.startsWith(words[0])))
    : all.filter((x) => !x.name.startsWith("open ") && !x.name.startsWith("ls ") && !x.name.startsWith("lang ") && !x.name.startsWith("theme ")).concat(all.filter((x) => x.name === "lang zh-Hant" || x.name === "theme light"));
  const shown = list.slice(0, 9);

  useEffect(() => { if (open) { setQ(""); setSel(0); input.current?.focus(); } }, [open]);
  useEffect(() => setSel(0), [q]);
  if (!open) return null;

  const run = (cmd?: Cmd) => { if (!cmd) return; onClose(); cmd.run(); };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") { e.preventDefault(); onClose(); }
    else if (e.key === "ArrowDown" || (e.ctrlKey && e.key === "n")) { e.preventDefault(); setSel((s) => Math.min(shown.length - 1, s + 1)); }
    else if (e.key === "ArrowUp" || (e.ctrlKey && e.key === "p")) { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
    else if (e.key === "Enter") { e.preventDefault(); run(shown[sel]); }
    else if (e.key === "Tab" && shown[sel]) { e.preventDefault(); setQ(shown[sel].name); }
  };

  return (
    <div class="pal-scrim" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div class="pal" role="dialog" aria-modal="true" aria-label={ui.palette.label}>
        <label class="pal-input">
          <span class="ps1" aria-hidden="true"><span class="ps1-host">ckw</span> <span class="ps1-arrow">❯</span></span>
          <input ref={input} autoFocus value={q} onInput={(e) => setQ((e.target as HTMLInputElement).value)} onKeyDown={onKey}
            placeholder={ui.palette.placeholder} spellcheck={false} autocomplete="off" autocapitalize="off"
            role="combobox" aria-expanded="true" aria-controls="pal-list" aria-activedescendant={shown[sel] ? `pal-${sel}` : undefined} />
        </label>
        <ul class="pal-list" id="pal-list" role="listbox">
          {shown.map((x, i) => (
            <li key={x.name} id={`pal-${i}`} role="option" aria-selected={i === sel} class={i === sel ? "on" : undefined}
              onMouseEnter={() => setSel(i)} onClick={() => run(x)}>
              <span class="pal-name">{x.name}</span><span class="pal-desc">{x.desc}</span>
            </li>
          ))}
          {!shown.length && <li class="pal-empty">{fmt(ui.palette.empty, { q: q.trim() })}</li>}
        </ul>
        <p class="pal-hint">{ui.palette.hint}</p>
      </div>
    </div>
  );
}
