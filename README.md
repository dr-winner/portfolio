# Richard Winner Duvor — Portfolio

Personal portfolio site for **Richard Winner Duvor**, SOC Analyst & AI Engineer.

Built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS and
Framer Motion. Ships with a lightweight admin CMS backed by Prisma + SQLite so
every project, tool, experience entry, certification, and testimonial can be
managed without touching code.

## Getting started

```bash
npm install
cp .env.example .env
# generate a session secret (any long random string)
node -e "console.log('SESSION_SECRET=\"' + require('crypto').randomBytes(48).toString('hex') + '\"')"
# generate an admin password hash
npm run admin:hash -- "your-strong-password"
```

Paste the generated values into `.env`, then:

```bash
npm run db:push      # create the SQLite schema
npm run db:seed      # populate it from src/content/*
npm run dev          # start the site on http://localhost:3000
```

Sign in at `/admin/login` with username `admin` and the password you hashed.

## Scripts

| command | what it does |
| --- | --- |
| `npm run dev` | Next.js dev server. |
| `npm run build` | `prisma generate` + `next build`. |
| `npm run start` | Production server after a build. |
| `npm run db:push` | Creates / updates the SQLite schema from `prisma/schema.prisma`. |
| `npm run db:studio` | Opens Prisma Studio, a DB GUI. |
| `npm run db:seed` | Seeds the database from `src/content/*`. |
| `npm run admin:hash -- "password"` | Generates a bcrypt hash for the admin password. |

## Admin console

The admin lives under `/admin`. It is protected by a signed HTTP-only cookie
(HMAC-SHA256 via the Web Crypto API, so it works on the Edge runtime too). Only
one admin user is supported; the username and bcrypt-hashed password come from
`.env`:

```env
ADMIN_USERNAME="admin"
ADMIN_PASSWORD_HASH="$2b$12$…"   # npm run admin:hash -- "your password"
SESSION_SECRET="at-least-32-chars-of-random"
```

It covers:

- **Projects** — full CRUD with image upload (saved to `/public/uploads`).
- **Stack categories + items** — reorderable, with a lucide-react icon picker.
- **Experience** — timeline entries with a "current role" flag.
- **Certifications** — status, progress, exam code, modules, skills.
- **Testimonials** — with a "hidden" flag to take one off the site temporarily.

Changes are written to the database and trigger `revalidatePath("/")` so the
public site picks them up on the next request.

If the database is empty or unavailable for any reason, the public site
transparently falls back to the seed data in `src/content/*`. This means the
site always renders — editing via the admin is a pure upgrade.

## Data model

Prisma / SQLite schema in [`prisma/schema.prisma`](./prisma/schema.prisma):

- `Project`, `StackCategory` + `StackItem`, `Experience`, `Certification`, `Testimonial`.
- Array-shaped fields (`tags`, `results`, `skills`, …) are stored as JSON strings
  and parsed in the content layer.
- Icons are stored as string keys resolved at render time via
  [`src/lib/icons.ts`](./src/lib/icons.ts).

## Design system

- **Colors**: deep `ink`, vibrant `cyber`, warm `signal`, `ok` green, `threat` red.
- **Typography**: `Inter` (body), `Space Grotesk` (display), `JetBrains Mono` (terminal).
- **Motion**: Framer Motion for scroll-driven reveals; a custom `AgenticBackground`
  canvas for ambient drifting orbs + ghost code tokens. All animations honour
  `prefers-reduced-motion`.

## Push to GitHub

1. Confirm secrets are not tracked: `.env` is gitignored; only `.env.example` is committed.
2. Review changes: `git status`
3. Commit and push (from `main` or your working branch):

```bash
git add -A
git status   # sanity check
git commit -m "Describe your changes in a full sentence."
git push origin main
```

If the remote is new: `git remote add origin https://github.com/YOUR_USER/portfolio.git` then `git push -u origin main`.

## Deploy on Vercel (from GitHub)

1. In the [Vercel dashboard](https://vercel.com), **Add New Project** → **Import** your GitHub repository.
2. **Framework Preset**: Next.js (auto-detected). **Build Command**: `npm run build` (default). **Output**: Next.js default.
3. **Environment Variables** — add the same keys as in [`.env.example`](./.env.example), at minimum for a working public site + admin:
   - `DATABASE_URL` — **not** a local `file:` path for production; use a hosted PostgreSQL URL (Vercel Postgres, Neon, Supabase, etc.) and change `provider` in `prisma/schema.prisma` to `postgresql`, then run `npx prisma migrate` / `db push` against that database once.
   - `SESSION_SECRET` — long random string.
   - `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` (or `ADMIN_PASSWORD_HASH_B64`) — same as local.
4. Optional: `GITHUB_TOKEN`, `GROQ_API_KEY` / `GROQ_MODEL`, `ANALYTICS_SALT` for full feature parity.
5. **Deploy**. Vercel runs `postinstall` → `prisma generate` and your `build` script.

**SQLite on Vercel:** Serverless instances do not keep a durable `file:` database or `/public/uploads` across invocations. The **public site still renders** using built-in fallbacks in `src/content/*` if the DB is empty or unavailable; **admin and DB-backed edits** need a real `DATABASE_URL` and (for uploads) blob storage—see below.

**Production checklist (recommended before relying on admin in prod):** switch Prisma to PostgreSQL, run migrations, seed if needed, and replace local file uploads with object storage (e.g. Vercel Blob / S3 / R2) in [`src/lib/upload.ts`](./src/lib/upload.ts).

## Deployment notes (self‑hosted / advanced)

- **Local / self-hosted**: SQLite at `prisma/dev.db` works out of the box.
  The `public/uploads` directory persists between deploys as long as the
  filesystem does (e.g. on a VPS or Railway volume).
- **Vercel + full CMS:** Same as above: PostgreSQL + object storage for uploads; SQLite + local disk are dev-friendly only in serverless.

## Tech

- **App**: Next.js 15, React 19, TypeScript.
- **Styling**: Tailwind CSS 3, `clsx`, `tailwind-merge`.
- **Motion**: Framer Motion + canvas / CSS animations.
- **UX**: `cmdk` (command palette), `react-wrap-balancer`, `lucide-react`.
- **Backend**: Prisma 6, SQLite, bcryptjs, Web-Crypto HMAC cookie sessions,
  Next.js Server Actions.

Made with care by Richard Winner Duvor (`drwinner03@gmail.com`).
