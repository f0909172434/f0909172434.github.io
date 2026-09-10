# Chih-Kai Wang — portfolio

A bilingual portfolio for software engineering and AI application internships. The central work sample lets visitors inspect Finite Witness, HonestCI and RigorGraph, then continue into the matching engineering case study.

[Live portfolio](https://f0909172434.github.io/) · [Profile](https://github.com/f0909172434) · [CV](https://f0909172434.github.io/Chih-Kai-Wang-CV.pdf)

## Local development

Use Node 24 and run `npm ci`, then `npm run dev`. Run `npm run build` for the production build and `npm run preview` to inspect it.

The sample device replays recorded examples or clearly labeled workflow illustrations. It does not call a backend or rerun project engines. A native range input, chapter buttons, vertex inspection and static-reading control work with keyboard and touch. The operating system's reduced-motion preference is honored by default.

## Updating content

Public project descriptions, paths, status labels and six profile pins live in `src/data/projects.json`. Sample copy remains in `src/App.tsx`. Run `node scripts/render-profile.mjs` after editing the catalog; the build checks that `public/profile-README.md` is current. Copy that generated file into the profile repository's `README.md` in the same delivery. This creates no cross-repository write permissions or automatic pushes.

The shared sample selection connects the first screen to its case study. Case-study sources and the CV source live in the profile repository. Copy a newly rendered CV to `public/Chih-Kai-Wang-CV.pdf` before building and compare its SHA-256 with the source copy. The two desktop-pet host packages share one portfolio entry while retaining their own installation links.

The Pages workflow builds on pull requests and deploys the main branch only after a successful build. The September 2026 review verified desktop and 390px mobile layouts, both languages, sample selection, keyboard scrubbing, static reading, and source links.

## Native specimen artwork

The C₄ model was built and refined in Blender 4.5.9 LTS, then exported as seven lightweight views with matching vertex coordinates. See [art sources and reproduction](art/README.md). Normal builds use the checked-in WebP assets.
