# Chih-Kai Wang — portfolio

A portfolio for software engineering and AI internships, built around one idea: claims with the evidence attached. It is staged as one terminal session (`ckw`): every section is a command that types itself and prints its output. The page is rendered from a single catalog file, `src/data/projects.json`, and lists every record of that file with its raw entry a visitor can inspect.

[Live portfolio](https://f0909172434.github.io/) · [Profile](https://github.com/f0909172434) · [CV](https://f0909172434.github.io/Chih-Kai-Wang-CV.pdf)

## Local development

Use Node 24. Run `npm ci`, then `npm run dev`. `npm run build` checks the generated files, type-checks, and writes the prerendered site to `dist/`; `npm run preview` serves it. `npm run check` runs the same checks without building.

Stack: Preact, Vite, TypeScript and plain CSS with custom properties (no CSS framework). The page follows `prefers-color-scheme`; `t` or the ◐ button switches theme and remembers the choice. Keyboard: `/` or ⌘K opens the command palette (every section prompt is a command it understands), `j`/`k` move between sections. All motion stops under `prefers-reduced-motion`.

`src/art/films.ts` draws the three ASCII films as pure functions of time. The site plays them live on a canvas; the README generator pre-renders the same functions into SVG frames, so both show identical pictures.

## Content: one catalog, several outputs

Project records, status labels, the profile text and the six profile pins live in `src/data/projects.json` (schema version 2). Edit that file only, then run:

- `npm run locale` — regenerates `src/data/zh-hans.generated.json`.
- `npm run profile` — regenerates `public/profile/`: the profile README in three languages and its animated SVGs in `assets/` (hero, pinned-project cards, film players and footer, each in light and dark). Fonts are subset into each SVG from JetBrains Mono and Noto Sans TC/SC, so the images look the same everywhere GitHub shows them.
- `npm run profile:sync -- --to ../profile` — mirrors `public/profile/` into a checkout of the profile repository (removing images the generator no longer writes) and prints each file's SHA-256.

The terminal output on the pinned-project cards lives in `scripts/profile/runs.mjs`. Each block was copied from a real run against the commit it names; when a project changes, re-run the command and paste the new output rather than editing it.

`npm run build` fails if either generated output is stale. UI strings live in `src/data/ui.json` and the case-study summaries in `src/data/case-studies.json`; both have English and Traditional Chinese text. Case-study sources and the CV source live in the profile repository; copy a newly rendered CV to `public/Chih-Kai-Wang-CV.pdf` and compare its SHA-256 with the source copy.

## Locales

English, Traditional Chinese (the source of truth) and Simplified Chinese. The Simplified text is generated at build time from the Traditional text with opencc-js through `scripts/zh-cn.mjs` — the same module that produces the profile's `README.zh-CN.md` — and committed as `src/data/zh-hans.generated.json`. It is never edited by hand: fix the Traditional source and run `npm run locale`. `status` and `made` strings, product names, code and the raw records stay as written. Use `?lang=en`, `?lang=zh-Hant` or `?lang=zh-Hans`; otherwise the browser language decides.

## Verifying the catalog hash

The hero and the status line print the SHA-256 of `src/data/projects.json`, computed over the file's bytes at build time. Each record shows its raw entry, sliced verbatim from the same file, with a link to the exact lines on GitHub. To check:

```sh
git clone https://github.com/f0909172434/f0909172434.github.io && cd f0909172434.github.io
shasum -a 256 src/data/projects.json
```

The output should begin with the hash shown on the page.

## Prerendering and requests

`vite build` prerenders the English page into `dist/index.html` (through `@preact/preset-vite`), so the content, the records' `<details>` and every link work without JavaScript; filters, the palette, the theme and language switches need JavaScript and are hidden without it. The client hydrates and then applies the visitor's locale. Fonts (JetBrains Mono, and Noto Sans TC and SC through Fontsource) are self-hosted; the page makes no third-party requests and has no analytics.

The Pages workflow builds on pull requests and deploys the main branch only after a successful build. `public/examples/rigorgraph/` is the static example linked from the RigorGraph record and its case study.
