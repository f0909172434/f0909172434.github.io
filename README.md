# Chih-Kai Wang portfolio

Personal site for Chih-Kai Wang, focused on AI for Mathematics, verifiable reasoning, and reproducible research engineering.

## Concept

The site is built as a **verification lens**. Visitors move through claim, evidence, and boundary layers instead of seeing a conventional project-card gallery. The lens responds to pointer, touch, keyboard, and scroll state; project filters expose the public work by role rather than popularity.

Private repositories and unreleased evaluation artifacts are intentionally excluded.

## Run locally

```bash
npm ci
npm run dev
```

Production checks:

```bash
npm run check
npm run build
npm run preview
```

## Implementation

- Preact, TypeScript, Vite, and self-hosted Geist Variable
- Traditional Chinese and English with query-string locale state
- Pointer, touch, and keyboard control for the core interaction
- Mobile-specific composition and `prefers-reduced-motion` fallback
- GitHub Pages workflow for the account-level `f0909172434.github.io` site

The site uses no API key, remote runtime service, analytics, or external font request.
