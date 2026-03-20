# apps/web

Local-first `Next.js` MVP for the artist portfolio.

## Commands

- `npm run dev`
- `npm run lint`
- `npm run build`
- `npm run start`

## Local MVP Features

- public routes: `/`, `/gallery`, `/artwork/[slug]`, `/about`, `/contacts`
- theme switcher with cookie persistence
- admin login at `/admin/login`
- protected local admin at `/admin`
- artwork CRUD backed by `data/artworks.json`
- local file uploads into `public/uploads`

## Environment

Copy values from the repo root `.env.example` or use this app-local `.env.example` as reference.
