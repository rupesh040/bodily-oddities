# Bodily Oddities

A responsive, Apple-inspired field guide to the fascinating human body. Built with React 19, Vite, and Lucide icons.

## Experience

- All 164 topics from the reference collection, each with a fresh short summary, two concise explanations, commonness information, and source links.
- Search, all 12 body-region filters, and seven kinds of oddity.
- Saved discoveries stored locally in the visitor's browser.
- Shareable article links, browser Back support, random discovery, and a timed afterimage experiment.
- Original generated lavender brain illustration and original SVG topic artwork.
- Responsive layouts, keyboard navigation, focus trapping, and reduced-motion support.

## Run locally

```sh
npm install
npm run dev
```

## Production

```sh
npm run build
npm run preview
```

The production output is `dist/`. The included `vercel.json` configures Vercel's Vite build. Import this repository in Vercel and use its detected Vite preset; no environment variables are required.

## Content and attribution

Inspired by [Bodily Oddities](https://bodilyoddities.com/), the original collection by Demjan Vester. The catalog was reviewed on 18 October 2026. Every entry links to its original page and available research/further-reading references. `src/data/metadata.json` records the catalog structure, provenance, and content notes.

No explicit reuse license was found on the reference site. This project uses original condensed explanations and original artwork rather than reproducing the source's article prose or illustrations. Source research links are retained for further reading; estimates vary between studies. The original website, names, and linked research remain their respective owners' work. No affiliation with Apple or the original collection is implied.

This site provides general educational content, not personal medical advice. The afterimage experiment uses a colored screen circle; it does not involve staring at bright lights.

Saved topics remain on the visitor's device. No account, analytics, backend, or database is required. Fonts are requested from Google Fonts, with system font fallbacks.
