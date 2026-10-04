import { useEffect, useState } from "preact/hooks";
import { detectLocale, uiFor, type Locale } from "./locale";
import { catalogFor } from "./catalog";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Ledger } from "./components/Ledger";
import { Negatives } from "./components/Negatives";
import { CaseStudies } from "./components/CaseStudies";
import { Method } from "./components/Method";
import { Films } from "./components/Films";
import { Log } from "./components/Log";
import { About } from "./components/About";
import { Footer } from "./components/Footer";

export default function App() {
  const [locale, setLocale] = useState<Locale>("en");     // prerendered HTML is English; detection runs after hydration
  const [ready, setReady] = useState(false);
  const ui = uiFor(locale);
  const catalog = catalogFor(locale);

  useEffect(() => { setLocale(detectLocale()); setReady(true); }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = locale;
    document.title = ui.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", ui.meta.description);
    const url = new URL(location.href);
    url.searchParams.set("lang", locale);
    history.replaceState(null, "", url);
  }, [locale, ready]);

  return (
    <>
      <a class="skip-link" href="#work">{ui.nav.skip}</a>
      <Nav ui={ui} locale={locale} onLocale={setLocale} />
      <main>
        <Hero ui={ui} locale={locale} catalog={catalog} />
        <Ledger ui={ui} locale={locale} catalog={catalog} />
        <Negatives ui={ui} locale={locale} catalog={catalog} />
        <CaseStudies ui={ui} locale={locale} catalog={catalog} />
        <Method ui={ui} locale={locale} catalog={catalog} />
        <Films ui={ui} locale={locale} catalog={catalog} />
        <Log ui={ui} locale={locale} catalog={catalog} />
        <About ui={ui} locale={locale} catalog={catalog} />
      </main>
      <Footer ui={ui} />
    </>
  );
}
