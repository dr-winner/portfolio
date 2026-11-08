# Richard Winner Duvor | Portfolio

Personal portfolio site for **Richard Winner Duvor**, focused on application security: web, API, and AI/LLM app security. He is a frontend engineer at Synchora Health, and that work is described as frontend work only.

Built as a lean static-first Next.js 15 (App Router) site with React 19, TypeScript, and Tailwind CSS. All public portfolio content lives in typed modules under `src/content/` and is reviewed through Git.

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

| command | what it does |
| --- | --- |
| `npm run dev` | Next.js dev server. |
| `npm run build` | Production build (`next build`). |
| `npm run start` | Production server after a build. |
| `npm run lint` | Runs `next lint`. |

## Content structure

Public content is versioned directly in [`src/content/`](./src/content):

- [`src/content/site.ts`](./src/content/site.ts) — site identity, contact links, feature flags, and the `/cv.pdf` download target.
- [`src/content/profile.ts`](./src/content/profile.ts) — headline, bio, education, and social links.
- [`src/content/work.ts`](./src/content/work.ts) — security case studies, training labs (explicitly badged and scoped), and archived builds.
- [`src/content/experience.ts`](./src/content/experience.ts) — work and internship timeline.
- [`src/content/certifications.ts`](./src/content/certifications.ts) — earned certifications and active training.
- [`src/content/skills.ts`](./src/content/skills.ts) — grouped AppSec, AI/LLM security, cloud detection, and tooling skills.
- [`src/content/writeups.ts`](./src/content/writeups.ts) — write-ups index (unpublished while all entries are marked `draft: true`).
- [`public/cv.pdf`](./public/cv.pdf) — downloadable CV served with `Content-Disposition: inline; filename="Richard-Winner-Duvor-AppSec-CV.pdf"`.

## Security posture

- Per-request CSP nonces and strict response headers in [`src/middleware.ts`](./src/middleware.ts) and [`next.config.mjs`](./next.config.mjs).
- No runtime database, public write endpoints, file upload surface, or exposed admin routes (`/admin` and `/studio` return 404 with `noindex`).
- Disclosure policy published at `/security` and `/.well-known/security.txt`.

## Deploy on Vercel

1. Import the repository in Vercel.
2. **Framework Preset**: Next.js. **Build Command**: `npm run build`.
3. Optionally set `NEXT_PUBLIC_SITE_URL` if deploying to a custom origin other than `https://duvorrichardwinner.me`.

Made by Richard Winner Duvor (`duvorrichardwinner@gmail.com`).
