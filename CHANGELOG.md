# Portfolio overhaul — changelog

## Shipped

### Positioning and SEO

- Standardized the public identity around **Cyber & Cloud Security Engineer**.
- Made the Open Graph image and JSON-LD occupation derive from `profile.role`.
- Refocused metadata keywords on cybersecurity, threat detection, SOC, and cloud security in Ghana.
- Removed the obsolete `SearchAction` schema because the site has no internal search.
- Removed empty structured-data properties and reduced unrelated AI/LLM topical signals.
- Removed unsupported `Crawl-delay` from `robots.txt`.
- Rebranded the web manifest with the owner’s name, description, dark theme colors, scope, start URL, and maskable icons.
- Kept the sitemap limited to canonical documents; section hash fragments are intentionally excluded.

### Performance and motion

- Preserved Lenis + ScrollTrigger integration while fixing provider initialization and cleanup races.
- Changed Lenis context state so consumers receive the initialized instance.
- Replaced the permanent full-screen canvas animation loop with static composited gradients.
- Removed blur filters from horizontal project animations.
- Replaced animated height/width with `scaleY`/`scaleX` transforms.
- Limited detailed project animation to the first three cards; later cards use opacity only.
- Disabled pinned horizontal projects below `1200px`, matching the site’s desktop layout breakpoint.
- Made the semantic vertical project list the server/default render, then progressively enhanced large screens after hydration.
- Lazy-loaded the command palette and terminal only when requested.
- Reduced the home route from **223 kB** first-load JS to **200 kB**.
- Corrected hero letter animation duration to `0.6s` and removed narrow-screen no-wrap constraints.

### Accessibility

- Fixed invalid `aria-label` use on plain text spans in the hero and stack.
- Added a screen-reader-only unsplit hero heading while hiding visual character spans.
- Matched accessible names to visible header and email labels.
- Corrected project heading hierarchy from `h2` to `h3` beneath the section heading.
- Increased testimonial controls to 44×44 CSS-pixel targets.
- Added testimonial previous/next controls, focus pause, `aria-current`, and a concise polite live status.
- Disabled testimonial auto-advance when reduced motion is requested.
- Preserved visible keyboard focus rings and logical source order.
- Added a real terminal-dialog focus trap, background inerting, page scroll lock, Escape handling, and opener focus restoration.

### Security and platform

- Upgraded Next.js to `15.5.21`, PostCSS to `8.5.23`, and Sharp to `0.35.3`.
- Added verified npm overrides so Next resolves patched PostCSS and Sharp copies.
- Added `poweredByHeader: false`.
- Tightened framing policy to CSP `frame-ancestors 'none'` plus `X-Frame-Options: DENY`.
- Hardened admin image uploads by validating decoded image format, limiting input pixels, stripping metadata, and re-encoding to WebP before public storage.
- Removed GIF uploads and no longer trusts filename extensions or browser-provided MIME types.
- Removed the public exact waitlist count and added a server-validated honeypot.
- Added explicit waitlist privacy acknowledgment and a crawlable `/privacy` notice.
- Moved deprecated Prisma seed configuration into validated `prisma.config.ts`.
- Pinned patched `nanoid@3.3.18` after a new upstream advisory was published.

## Verification

Production build tested locally with Next.js `15.5.21` and Lighthouse mobile emulation.

| Metric | Before | After |
|---|---:|---:|
| Performance | 82 | **92** |
| Accessibility | 92 | **100** |
| Best Practices | 96 | **96** |
| SEO | 100 | **100** |
| First Contentful Paint | 1.2s | **1.2s** |
| Largest Contentful Paint | 4.4s | **3.4s** |
| Total Blocking Time | 90ms | **50ms** |
| Cumulative Layout Shift | 0.014 | **0.019** |
| Speed Index | 4.0s | **1.6s** |

Validation completed:

- `npm run build` — 26 routes generated successfully, including `/privacy`
- Project diagnostics — zero errors and zero warnings
- `npm audit --omit=dev` — zero production vulnerabilities
- `git diff --check` — no whitespace errors
- Lighthouse — Performance ≥90, Accessibility 100, SEO 100

## Known follow-up

The requested Lighthouse Performance threshold is met, but measured LCP is **3.4s**, not yet below the aspirational 2.0s budget. The remaining opportunity is architectural: reduce initial Framer Motion/client-component hydration by moving more below-the-fold sections to server-rendered markup with small animation islands. Local Lighthouse also reports the expected Vercel Analytics script 404 outside Vercel; production should be checked independently for console cleanliness.
