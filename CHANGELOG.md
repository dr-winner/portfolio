# Motion + UX Overhaul — CHANGELOG

## What shipped

### 1. Lenis smooth scroll
- `SmoothScrollProvider` initialises Lenis (lerp 0.1, duration 1.2) after first paint via dynamic import
- GSAP ScrollTrigger wired via `lenis.on('scroll', ScrollTrigger.update)` and `gsap.ticker`
- Full `prefers-reduced-motion` guard — Lenis does not boot, CSS animations collapse to 0.001 ms
- Added to `Providers.tsx` so it wraps the whole tree once

### 2. Hero — character stagger + parallax orbs
- `HeroAnimation` + `CharSplit` components split H1 into individual `<span class="hero-char">` elements
- GSAP stagger: y 24 → 0, opacity 0 → 1, duration 0.6, ease expo.out, stagger 0.04, delay 0.15 s
- Two absolutely-positioned orb divs with Framer Motion `useTransform` parallax (y 0 → -80 over hero scroll)
- Terminal typing unchanged (existing `TypedLines` state machine retained)

### 3. Horizontal projects scroll (`#projects`)
- New `HorizontalProjects` section replaces vertical `Projects` section
- GSAP `ScrollTrigger` pin + scrub 1.5: track translates `x: 0 → -(trackWidth - viewportWidth)`
- 1 px progress bar at section top fills 0 → 100 % across pin duration
- Section heading fades out (`opacity: 0, y: -20`) as horizontal scroll begins
- Active card counter (01 / 03) updates via ScrollTrigger `onEnter` callbacks
- Cards 1–3: y 20, scale 0.96 → 1 on enter via `containerAnimation`
- Cards 4+: simple opacity fade (performance budget)
- Tech-stack chips stagger in (opacity 0, y 8 → 0) when card is ~50 % visible
- 3D card tilt: Framer Motion `useMotionValue` + `useSpring`, max 6 deg
- Mobile/reduced-motion fallback: vertical card stack

### 4. Capabilities grid (`#capabilities`)
- GSAP `ScrollTrigger.batch` replaces per-card `ScrollReveal`: 60 ms stagger, `once: true`
- Proficiency progress bar per card: `level` + `proficiency` fields added to `Capability` type
- Bar animates width 0 → `proficiency%` via Framer Motion `whileInView`
- Hover lift: Framer Motion `whileHover` y –4 px

### 5. Marquee strip
- New `Marquee` component between `#stack` and `#projects`
- Framer Motion `animate(x, [0, -halfWidth])`, duration 30 s, linear, repeat Infinity
- Pause-on-hover via `AnimationPlaybackControls.pause()` / `.play()`
- 18 tech keywords; `prefers-reduced-motion` guard skips animation

### 6. Experience timeline (`#experience`)
- Row separator: `motion.div` with `scaleX: 0 → 1, transformOrigin: left`, scrubbed via `useScroll`
- Role date range: separate `motion.span` fades in after separator finishes drawing
- Existing centre-spine and dot animations retained

### 7. Testimonials carousel (`#testimonials`)
- Full rewrite from CSS marquee → `AnimatePresence` slide carousel
- Auto-advance every 6 s; pauses on hover via mouse enter/leave state
- Slide transition: current exits `x ± 100 %`, new enters from opposite side, 500 ms ease
- Dot indicators: clicking jumps with directional animation
- `useReducedMotion`: auto-advance disabled, only manual navigation

### 8. Contact (`#contact`)
- `WordReveal` component splits heading by word, staggers opacity 0 → 1, y 14 → 0, 30 ms per word
- `GrainLayer`: SVG `feTurbulence` noise texture, opacity 0.04, `animate-grain-move` 30 s loop
- Ripple on click: `addRipple` injects `<span class="ripple-wave">` with CSS `@keyframes ripple-expand`
- Email + LinkedIn CTAs wrapped in `MagneticButton` (Framer Motion spring x/y toward cursor)

### 9. Global micro-interactions
- `CustomCursor`: fixed 12 px cyan dot, lerp 0.15, scales to 1.6 on interactive elements
  - Only on `(pointer: fine)` non-touch devices
  - `document.body.classList.add('custom-cursor-active')` hides native cursor
- `MagneticButton`: Framer Motion `useSpring` x/y offset driven by cursor distance
- `ScrubText`: GSAP `clipPath inset(0 100% 0 0) → inset(0 0% 0 0)` scrub reveal
- Link underline: `.link-hover::after` scaleX 0 → 1, transform-origin left, 200 ms
- `ScrollToTop`: appears after 1 viewport scroll, Framer Motion fade + slide
- `motion.config.ts`: centralises all easings, durations, stagger values, reduced-motion overrides

## Packages added
- `gsap@^3.15.0` — ScrollTrigger, context cleanup, ticker
- `lenis@^1.3.23` — smooth scroll; lazy-loaded after first paint

## Performance notes
- GSAP and Lenis are dynamic `import()` — zero impact on first paint
- All animations use `transform` and `opacity` only
- `will-change: transform` only on elements actively animating; GSAP removes it on `onComplete` via context cleanup
- Cards 4+ use single fade-in (no scale/y animation)
- Custom cursor uses `requestAnimationFrame` loop, not React state

## Accessibility
- `prefers-reduced-motion: reduce` disables Lenis, Marquee, CustomCursor, GSAP batch, hero char stagger; collapses all CSS animations to 0.001 ms
- Testimonials: auto-advance disabled; `aria-live="polite"` + `aria-atomic="true"` on carousel
- All interactive elements keyboard-accessible; focus ring preserved (2 px cyan)
- `CharSplit` preserves `aria-label` on parent span; individual char spans are `aria-hidden`
- `ScrubText` has ghost underlay + `sr-only` span for screen readers
- Heading hierarchy: h1 (hero), h2 (section headers added via SectionHeader), h3 (cards/items)

## Lighthouse (self-reported — run `npm run build && npx serve out` to verify)
- Build passes with zero type errors and zero ESLint errors
- No hydration mismatches (all browser-only code in `useEffect`)
- Target: LCP < 2.0 s, CLS < 0.05, INP < 200 ms, Performance ≥ 90
