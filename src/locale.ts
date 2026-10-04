import uiJson from "./data/ui.json";
import hans from "./data/zh-hans.generated.json";

export type Locale = "en" | "zh-Hant" | "zh-Hans";
export const LOCALES: Locale[] = ["en", "zh-Hant", "zh-Hans"];
export type UI = typeof uiJson.en;

export function detectLocale(): Locale {               // client only
  const q = new URLSearchParams(location.search).get("lang");
  if (q === "en" || q === "zh-Hant" || q === "zh-Hans") return q;
  const l = navigator.language.toLowerCase();
  if (l.startsWith("zh")) return /hans|cn|sg/.test(l) ? "zh-Hans" : "zh-Hant";
  return "en";
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function formatMonth(asOf: string, locale: Locale): string {   // "2026-10"
  const [y, m] = asOf.split("-").map(Number);
  return locale === "en" ? `${MONTHS[m - 1]} ${y}` : `${y} 年 ${m} 月`;
}
export const formatDate = (iso: string) => iso;        // ISO dates stay ISO in every locale (mono)
export function pick<T extends { en: string; zh: string }>(v: T, locale: Locale) { return locale === "en" ? v.en : v.zh; }

export function uiFor(locale: Locale): UI {
  if (locale === "en") return uiJson.en;
  if (locale === "zh-Hant") return uiJson["zh-Hant"] as UI;
  return hans.ui as UI;
}

/** Fill `{name}` placeholders in a UI template. */
export function fmt(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(values[k] ?? ""));
}
