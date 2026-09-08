# Indiabulls Securities Community — Next.js frontend

A Discourse-inspired community frontend (topic lists, post streams, composer)
built in Next.js/React and restyled in the Indiabulls Securities brand.
Currently a standalone prototype with sample data — no backend yet.

## Run it locally

Requires Node.js (this repo was built/tested against Node v24 LTS).

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Production build

```bash
npm run build
npm run start -- -p 3000
```

## Structure

- `src/app/page.tsx` — homepage: category sidebar + latest-topics table
- `src/app/topic/[slug]/page.tsx` — topic detail page (dynamic route, statically
  generated per topic via `generateStaticParams`)
- `src/components/` — Header, Sidebar, Footer, ComposerModal, LikeButton, etc.
- `src/lib/data.ts` — sample categories/topics/posts (swap for real data later)
- `src/app/globals.css` — brand design tokens (colors, fonts, radii) and all
  component styles, ported from the earlier static-HTML prototype in
  `../frontend/`

## Wiring to a real Discourse instance later

Discourse exposes a JSON API on every page (`/latest.json`, `/t/:id.json`,
etc.). Replace the static imports from `src/lib/data.ts` with `fetch()` calls
against that API in the relevant Server Components — the component
boundaries were kept close to Discourse's own data shape to make that swap
straightforward.
