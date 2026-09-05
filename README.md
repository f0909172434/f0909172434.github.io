# Chih-Kai Wang — portfolio

A bilingual portfolio for software engineering and AI application internships. The central work sample lets visitors inspect Finite Witness, HonestCI and RigorGraph, then continue into the matching engineering case study.

[Live portfolio](https://f0909172434.github.io/) · [Profile](https://github.com/f0909172434) · [CV](https://f0909172434.github.io/Chih-Kai-Wang-CV.pdf)

## Local development

Use Node 24 and run `npm ci`, then `npm run dev`. Run `npm run build` for the production build and `npm run preview` to inspect it.

The sample device replays recorded examples or clearly labeled workflow illustrations. It does not call a backend or rerun project engines. A native range input, chapter buttons, vertex inspection and static-reading control work with keyboard and touch. The operating system's reduced-motion preference is honored by default.

## Updating content

Public project descriptions and sample copy are in `src/App.tsx`. The shared sample selection connects the first screen to its case study. Case-study sources and the CV source live in the profile repository. Copy a newly rendered CV to `public/Chih-Kai-Wang-CV.pdf` before building.

The Pages workflow builds on pull requests and deploys the main branch only after a successful build. The September 2026 review verified desktop and 390px mobile layouts, both languages, sample selection, keyboard scrubbing, static reading, and source links.

## Native specimen artwork

The C₄ model was built and refined in Blender 4.5.9 LTS, then exported as seven lightweight views with matching vertex coordinates. See [art sources and reproduction](art/README.md). Normal builds use the checked-in WebP assets.
