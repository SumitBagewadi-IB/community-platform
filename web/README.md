# Indiabulls Securities Community

A Discourse-inspired community platform (topic lists, post streams, composer)
built in Next.js/React and restyled in the Indiabulls Securities brand, backed
by a real Firebase (Firestore + Authentication) backend.

**Live:** https://community-platform-620876318042.asia-south1.run.app
(Cloud Run, project `ibproduct-vibe-coding`, region `asia-south1`)

## Run it locally

Requires Node.js (built/tested against Node v24 LTS) and access to the
`ibproduct-vibe-coding` Firebase project.

```bash
npm install
cp .env.example .env.local   # fill in via: firebase apps:sdkconfig WEB <appId>
npm run dev
```

Open http://localhost:3000

## Production build

```bash
npm run build
npm run start -- -p 3000
```

## Deploying

```bash
gcloud run deploy community-platform \
  --source . \
  --region asia-south1 \
  --project ibproduct-vibe-coding \
  --allow-unauthenticated
```

Builds via Cloud Build using the repo's `Dockerfile` (Next.js standalone
output) — no local Docker needed. Firebase's client config is picked up from
the committed `.env.production` at build time (safe to expose — see
`.env.example`); it is not a secret, access control is enforced by Firestore
Security Rules instead.

If you ever change to a different Cloud Run URL/custom domain, add it to
Firebase Auth's authorized domains or Google Sign-In will fail there:

```bash
# Firebase Console → Authentication → Settings → Authorized domains
```

## Structure

- `src/app/page.tsx` — homepage: category sidebar + latest-topics table
  (search via `?q=`, sort via `?sort=top`)
- `src/app/topic/[slug]/page.tsx` — topic detail page, live via Firestore
  real-time listeners (`subscribeTopic`/`subscribeTopicPosts`)
- `src/app/c/[slug]/page.tsx`, `src/app/categories/page.tsx` — category views
- `src/components/` — Header, Sidebar, Footer, ComposerModal, SignInModal,
  LikeButton, etc.
- `src/lib/firebase.ts` — Firebase client SDK init
- `src/lib/firestore.ts` — Firestore data access (subscriptions + writes)
- `src/lib/data.ts` — static categories list + seed data (consumed by
  `scripts/seed.ts`, not by the running app)
- `src/app/globals.css` — brand design tokens (colors, fonts, radii), verified
  directly against indiabullssecurities.com's live computed styles

## Backend

- **Firestore** (`categories`, `topics`, `topics/{slug}/posts`) — see
  `firestore.rules` for access control (public read; create requires auth +
  matching `authorId`; topic updates limited to `repliesCount`/
  `lastActivityAt`/`views`; post updates limited to the `likedBy` field and
  only the caller's own uid).
- **Firebase Authentication** — Email/Password + Google. Posting/replying is
  gated behind sign-in.
- **Seeding**: `npx tsx scripts/seed.ts` (idempotent — safe to re-run; skips
  topics that already have posts).
- Deploy rule changes: `npx firebase-tools deploy --only firestore:rules --project ibproduct-vibe-coding`

Known gap: "Unread" filtering is intentionally disabled (not faked) — it
needs per-user read-state tracking, which isn't built yet.
