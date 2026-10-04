import catalogRaw from "./data/projects.json";
import caseStudiesHant from "./data/case-studies.json";
import hans from "./data/zh-hans.generated.json";
import type { Locale } from "./locale";

export interface Lang { en: string; zh: string }
export type Kind = "tool" | "research" | "learning" | "creative" | "other";
export interface Project {
  name: string; kind: Kind; status: string; descZh: string; descEn: string; repo: string;
  live?: string; watch?: string; made?: string; negative?: Lang;
  links: { label: string; url: string }[];
}
export interface Contribution { repo: string; url: string; merged: string; title: Lang; caseStudy?: string }
export interface Catalog {
  schemaVersion: number;
  positioning: Lang;
  pinOrder: string[];
  profile: {
    facts: Lang[]; about: Lang; learning: Lang;
    method: { title: Lang; body: Lang }[];
    methodNote: Lang; filmsIntro: Lang; negativesIntro: Lang;
    now: { asOf: string; items: Lang[] };
    contributions: Contribution[];
  };
  projects: Project[];
}
export interface CaseStudy { slug: string; project: string | null; url?: string; title: Lang; summary: Lang }

const catalogHant = catalogRaw as unknown as Catalog;
export const META = __CATALOG_META__;
export const slug = (p: Project) => p.repo.split("/").at(-1)!;
export function catalogFor(locale: Locale): Catalog { return locale === "zh-Hans" ? (hans.catalog as unknown as Catalog) : catalogHant; }
export function caseStudiesFor(locale: Locale): CaseStudy[] {
  return (locale === "zh-Hans" ? hans.caseStudies : caseStudiesHant) as unknown as CaseStudy[];
}
export function rawRecord(p: Project) { return META.records[slug(p)].text; }   // the file's own text, not a re-serialisation
export const counts = {
  projects: catalogHant.projects.length,
  negatives: catalogHant.projects.filter((p) => p.negative).length,
  merged: catalogHant.profile.contributions.length,
  films: catalogHant.projects.filter((p) => p.kind === "creative").length,
};
export const SOURCE_URL = "https://github.com/f0909172434/f0909172434.github.io/blob/main/src/data/projects.json";
export const RAW_URL = "https://raw.githubusercontent.com/f0909172434/f0909172434.github.io/main/src/data/projects.json";
export const SITE_REPO_URL = "https://github.com/f0909172434/f0909172434.github.io";
export const lineUrl = (p: Project) => { const r = META.records[slug(p)]; return `${SOURCE_URL}#L${r.start}-L${r.end}`; };
export const caseStudyUrl = (s: string) => `https://github.com/f0909172434/f0909172434/blob/main/case-studies/${s}.md`;
export const GITHUB = "https://github.com/f0909172434";
export const EMAIL = "mailto:f0909172434@gmail.com";
