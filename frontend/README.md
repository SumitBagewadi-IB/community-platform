# Indiabulls Securities Community — Frontend (standalone)

A self-contained, backend-free frontend that mirrors Discourse's core UI
patterns (topic-list table, post-stream, sticky composer) restyled in the
Indiabulls Securities brand. Plain HTML/CSS/JS — no build step, no Node,
no Discourse instance required.

## Run it locally

```
cd frontend
python3 -m http.server 8000
```

Then open http://localhost:8000

## Pages

- `index.html` — latest topics list + category sidebar
- `topic.html` — a single topic with a sample post stream and composer

## Data

All topics/replies/counts are hardcoded sample content for layout purposes
— there is no backend behind this yet.

## Wiring to a real Discourse instance later

Discourse exposes a JSON API on every page (`/latest.json`, `/t/:id.json`,
etc.). When a Discourse backend exists, replace the hardcoded markup in
`index.html`/`topic.html` with `fetch()` calls against that API — the CSS
classes/structure here were deliberately kept close to Discourse's own
DOM conventions to make that swap straightforward.
