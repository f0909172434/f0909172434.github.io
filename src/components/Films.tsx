import type { Locale, UI } from "../locale";
import { pick } from "../locale";
import { slug, type Catalog } from "../catalog";
import { AsciiFilm } from "./AsciiFilm";
import { Section } from "./Section";

const SCREEN: Record<string, { id: "oracle" | "disease" | "world"; file: string; length: string }> = {
  ORACLE: { id: "oracle", file: "oracle.mp4", length: "4:30" },
  "The-Disease-Called-AI": { id: "disease", file: "the-disease-called-ai.mp4", length: "3:35" },
  "world-execute-me-claude-code": { id: "world", file: "world.execute-me.cast", length: "tty" },
};

export function Films({ ui, locale, catalog }: { ui: UI; locale: Locale; catalog: Catalog }) {
  const films = catalog.projects.filter((p) => p.kind === "creative");
  return (
    <Section id="films" num="05" cwd="~/films" cmd="ckw play --loop *" title={ui.films.title} intro={pick(catalog.profile.filmsIntro, locale)}>
      <div class="films">
        {films.map((p, i) => {
          const s = SCREEN[slug(p)];
          return (
            <article class="film ln" style={{ "--i": 2 + i }} key={slug(p)}>
              <header class="film-bar">
                <span class="film-play" aria-hidden="true">▶</span>
                <span class="film-file">{s?.file ?? slug(p)}</span>
                <span class="film-len">{s?.length}</span>
              </header>
              {s && <AsciiFilm id={s.id} label={p.name} />}
              <div class="film-info">
                <h3>{p.name}</h3>
                <p>{locale === "en" ? p.descEn : p.descZh}</p>
                <p class="film-made"><span class="dim">{ui.films.made}</span> {p.made}</p>
                <p class="film-links">
                  {p.watch && <a class="key key-primary" href={p.watch} target="_blank" rel="noreferrer">▶ {ui.common.watch}</a>}
                  <a class="key" href={p.repo} target="_blank" rel="noreferrer">{ui.common.source} ↗</a>
                </p>
              </div>
            </article>
          );
        })}
      </div>
      <p class="films-note ln" style={{ "--i": 6 }}><span class="hash" aria-hidden="true"># </span>{ui.films.note}</p>
    </Section>
  );
}
