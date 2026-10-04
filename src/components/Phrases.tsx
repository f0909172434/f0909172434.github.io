import type { Locale } from "../locale";

/** CJK headings: keep each clause (split after ，：；) together so lines break between clauses, not inside them. */
export function Phrases({ text, locale }: { text: string; locale: Locale }) {
  if (locale === "en") return <>{text}</>;
  const clauses = text.match(/[^，：；]+[，：；]?/g) ?? [text];
  return <>{clauses.map((c, i) => <span class="ph" key={i}>{c}</span>)}</>;
}
