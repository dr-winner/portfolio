# winnerOS Phase 0, recon and plan

Branch: `os/v1` (created from `main` at `5a6eaa8`). Nothing merged to `main`, ever.
This plan needs approval before Phase 1 code lands.

## 1. What I found (rule 1 of section 0)

### Routes and rendering

| Route | File today | Mode |
|---|---|---|
| `/` | `src/app/(public)/page.tsx` | dynamic (reads `headers()` for the nonce) |
| `/work` | `src/app/(public)/work/page.tsx` | prerendered |
| `/work/[slug]` | + per slug OG image + `generateStaticParams` for 6 slugs | prerendered |
| `/about`, `/contact`, `/security`, `/writeups` | own pages | prerendered |
| `/classic` | missing | Phase 1 adds it |
| `/cv.pdf`, `/.well-known/security.txt` | static assets | headers via `next.config.mjs` |
| `sitemap.ts`, `robots.ts`, `error.tsx`, `global-error.tsx`, `not-found.tsx` | root | untouched |

The site chrome (`SiteHeader`, `SiteFooter`, `BackgroundFx`, `CommandHotkey`, `HashRedirect`) lives in `src/app/(public)/layout.tsx`, so the frame switch has to happen at that layout level. Pages import their own content components, which is exactly what the two frames need to reuse.

### CSP and headers (verified unchanged-able)

- `src/middleware.ts`: per request nonce from `crypto.randomUUID()`, passed to the app as the `x-nonce` request header and set into CSP as `script-src 'self' 'nonce-$' 'strict-dynamic'` (no `unsafe-eval` in prod). HSTS on Vercel only. `/admin` and `/studio` 404 from middleware; `/CV.pdf` 308 to `/cv.pdf`.
- Inline script precedent already exists: the home page reads `x-nonce` via `headers()` and renders nonce-permitted JSON-LD `<script>` tags. The boot script uses the same pattern.
- `next.config.mjs`: `htmlLimitedBots: /.*/` (full blocking head), static security headers for all paths, legacy redirects (all preserved).

### Content layer today

`src/content/`: `site.ts`, `profile.ts`, `work.ts` (6 case studies and labs, 3 archive, `WorkSection` = id/heading/paragraphs), `skills.ts` (6 titled groups), `experience.ts` (`group: "security" | "engineering"`, CV wording), `certifications.ts` (2 earned, 2 in progress), `writeups.ts` (all drafts). `profile.education` has the UPSA BSc. Contact links and email live in `site.ts`.

Findings are prose inside `sections[].paragraphs` (the LLM lab's five attack paths carry CVSS + OWASP refs inside the sentence text; the Healthcare chain items are narrated with "remediation recommendation" wording). There is no typed findings array yet.

`src/lab/llm-agent-security/engine.ts` (611 lines) is fully typed and testable: `ATTACK_SCENARIOS` (5), `runScenario(scenario, mode)`, `EvaluationResult`, `TraceStep`, KNOWLEDGE_CHUNKS. Agent Lab imports this directly (brief 4.4), so the demo cannot drift from the tested code.

### Fonts, deps, CI, assets

- Fonts: `geist` package (self hosted Geist Sans + Mono, variable). No other fonts.
- Deps: zod 4.6.7 and sharp already present. Missing: `motion`, `zustand`, `cmdk`, `@next/bundle-analyzer`.
- CI (`.github/workflows/ci.yml`): runs on PRs and `main` pushes only, `npm ci`, `tsc --noEmit`, `lint`, `npm test` (single file: the engine suite), `npm audit --audit-level=moderate`. Branch pushes to `os/v1` will not trigger it, so I run everything locally and the audit evidence goes in phase reports. The `npm test` script gets extended to run the whole `src/**` test glob, no new framework.
- Tailwind custom screens: `sm 375, md 768, lg 1200, xl 1440`. The OS uses its own breakpoint constants (768, 1024, 1280) in `src/os` rather than stretching Tailwind semantics.
- `cv.pdf` is exactly 2 pages, matching the brief's Preview math.
- After the Nov 10 audit pass: shared JS on `/` is 103 kB gz, mobile Lighthouse 100/100/100/100, TBT 30 ms. Copy rules (no dashes, no junior, Gigsama, no NSS, no Proof9 link) already hold in `src/` outside `profile.ts`.

## 2. Conflicts with the brief (section 0, rule 5)

1. `profile.tagline` still holds the pre audit hero sentence ("I build frontends for a living...") and renders nowhere. To kill copy drift I update it to the live sentence the brief mandates for Welcome. Flagging because it touches a content file.
2. Welcome headline: brief 2.3 specifies "Application Security Engineer | AI/LLM Security | Penetration Testing". The site's headline facts are "Application Security" / "Web, API & AI/LLM App Security" (rendered by classic pages and OG images). Per "follow the brief and list the conflict": Welcome gets a new content field (`welcomeHeadline`) with the brief string, classic pages keep their facts.
3. Architecture conflict found during recon: the brief says both server frames are "chosen by the `view` searchParam", but Next.js layouts cannot read searchParams and the OS frame decision must be server side (classic view has to work without JS, no-JS users must not see the OS shell). Resolution: middleware sets an internal `x-view: classic` request header, the `(public)/layout.tsx` awaits `headers()` once and picks the frame. CSP, response headers and statuses stay byte for byte the same; only one internal request header is added. Trade off: pages that were prerendered become dynamic SSR (the home page already is). Plan B if classic TTFB cannot hold Lighthouse 98+: a mirrored `(classic)` route tree reached by rewrite, same components.
4. `npm test` runs one file today; extending the script to the test glob is a repo change the brief explicitly calls for (section 3.12).
5. Classic view header per brief 7.1 is a simpler document header, not the current `SiteHeader`. So `ClassicFrame` gets its own header and footer, and the current `SiteHeader`/`SiteFooter` remain only on the classic frame. This is a deliberate replacement, not a regression.

## 3. Content layer plan

- All facts stay in `src/content/`. The OS reads nothing that is not there.
- New derived, typed data built at build time from the existing text (zod validated), so a fact that exists twice is impossible:
  - `findings.ts`: the LLM lab's five attack paths typed (id, title, severity, cvss, owasp ids, status, remediation) with sentences taken verbatim from the existing section text; Healthcare chain entries with `severity: "see-report"` where no score exists in content. Feeds Findings, Proxy, Doc windows.
  - `detections.ts`: the six AWS rules (rule name, ATT&CK id or "managed", one line, status) from the AWS case study section text.
  - `fs.ts` + `search-index.ts`: terminal filesystem and search index generated from all of the above (Phase 2, `scripts/gen-fs.mjs`).
- `XSS, SSRF` leaves the About focus list (brief 10 leftover) as its own content commit in Phase 1.
- No new claims: Welcome proof row numbers (5 attack paths, 6 detections, 2 earned, 2 in progress) all exist in content and match.

## 4. File map

New (Phase 1):

```
src/os/motion.ts
src/os/wm/{store,reducer,geometry,keyboard,persistence}.ts   reducer.test.ts
src/os/theme/{accent,tokens in globals}.ts
src/os/shell/{DesktopShell,MenuBar,Dock,DesktopIcons,Wallpaper,Window,WindowChrome,
              SnapPreview,Switcher,Boot,Toasts,SkipLink}.tsx
src/os/shell/{ClassicFrame,WindowShell}.tsx   (server components)
src/os/apps/welcome/  + apps/hello/ (temporary WM proof)
src/os/mobile/{HomeScreen,StatusBar,AppSheet}.tsx
src/os/icons/{glyphs + 13 app tiles}.tsx
src/app/(public)/classic/page.tsx
docs/os/phase-1-evidence-screenshots
```

Changed (Phase 1): `src/middleware.ts` (x-view request header only), `(public)/layout.tsx` (frame pick), `(public)/page.tsx` (content into the Welcome window shell), root `layout.tsx` (boot inline script + nonce), `globals.css` + `tokens.css` (additive OS tokens, wallpapers, boot keyframes), `package.json` (scripts + deps), `skills.ts`/about (XSS,SSRF leftover), `profile.ts` (tagline drift).

Phase 2 plus: `src/os/apps/{files,doc,terminal,proxy,agent-lab,findings,detections,about,mail,preview,settings,security,search}/`, `scripts/{cv-preview,gen-headers,gen-fs,gen-search}.mjs`, per app dynamic imports.

## 5. Phase 1 build plan (commit sequence)

1. deps: `motion`, `zustand` (runtime, sized below), `@next/bundle-analyzer` (dev). extend `npm test` to the src glob. one commit.
2. tokens + motion presets (`src/os/motion.ts`) + icon set: 24px system glyphs (1.5px stroke, round caps) drawn as inline SVG components, plus the 13 app tiles per 6.7, folder icon original. No icon pack.
3. wallpapers: the four CSS only wallpapers (6.4) with the grid mask, cursor light + parallax in one shared rAF, fine pointer only, stops while still 2s / hidden tab. Banned list stays empty (no grain, no scanlines, no particles).
4. frames: `x-view` in middleware, layout level `DesktopFrame`/`ClassicFrame` switch, `/classic` one pager, skip link first focusable, noscript line. Boot NOT in this commit.
5. window manager pure core: reducer + geometry + persistence + zod session validation + unit tests via `npm test` (open/close/focus/single-instance/cascade wrap/clamp/snap/restore-after-maximize/z normalization/close focus fallback/10 cap/parse fallback/deep link validation).
6. window interactions: drag via pointer capture + rAF ref loop + translate3d, commit on pointerup, inertia glide to clamp; 8 resize zones; snap previews (left/right/maximize) with release commit; maximize via layout animation; minimize genie to dock rect; close; keyboard map per 3.8; Alt backtick switcher; F6 regions; dialog roles + focus management (3.10); focus-return on close.
7. shell chrome: menu bar (system menu, focused app menu, clock with SSR placeholder + Accra tooltip, shield/search/control icons, CV + Hire me buttons), dock (magnification 1.6x, tooltips 300ms, running dot, roving tabindex, first launch bounce), desktop icons (select, keyboard, real `<a href>` before hydration).
8. boot: nonce'd pre-paint inline script setting `data-booted` from `sessionStorage['wos:booted']` + skip conditions (`?open=`, non `/` route, `saveData`, classic view), SSR boot overlay as CSS keyframes only (2.2s desktop / 1.4s mobile, skippable button 44px, fade end even without JS), reduced motion disables it in CSS, welcome bloom entrance.
9. Welcome window (real content per 2.3, all buttons live) + temporary Hello app used to demonstrate multiple open windows in evidence.
10. mobile home screen skeleton (two snap pages, profile widget, 60px grid, dock with safe area, AppSheet open/close on the sheet spring, history pushState per app open, 44px targets).
11. content leftovers commit (About focus list, profile.tagline) + `docs/os/phase-1-report.md`.

Evidence at STOP (11): screenshots 1440x900 (boot mid frame, desktop at rest, three overlapping windows, snapped window, switcher) and 390x844 (home page 1 and 2, one open app), a 20 to 30s recording (boot, drag, resize, min/max, snap, switcher), Lighthouse on `/` and `/classic`, bundle numbers, WM test output.

## 6. Libraries

| Package | Use | Note |
|---|---|---|
| `motion` | springs, drag inertia, layout, LazyMotion domAnimation / domMax behind a dynamic chunk | no eval/new Function, no WebGL |
| `zustand` | WM + settings stores | ~1.4 kB gz |
| `@next/bundle-analyzer` | dev only | budgets in every report |
| `cmdk` | deferred to Phase 4 (Search), not Phase 1 | |
Sizes verified and reported after install from the analyzer, budgets in 7.6 tracked from day one.

## 7. Budgets versus reality (from the last build)

- `/` initial before shell: 103 kB gz today (classic page with WorkIndex + trace client). The OS `/` base drops WorkIndex/trace/tabs to static content, so this falls well under 110 kB; the shell chunk then lands within the 170 kB total cap.
- Classic routes keep their current class; Lighthouse classic target 98+ repeated after the frame switch.
- CSS stays one sheet; wallpaper + chrome additions must keep the total under 40 kB measured.

## 8. Open questions for you

1. Evidence screenshots and recordings committed into the repo under `docs/os/` (my default), or kept out of the repo in a separate folder?
2. Do we add `os/v1` CI runs (ci.yml trigger change) or keep CI on PRs only as today?
3. For the boot mark, brief suggests a shield that reads as "w" drawn from two offset strokes. Any other direction you already like from the reference screenshots, interaction depth only?

**STOP. Phase 0 ends here. No code until you approve this plan.**
