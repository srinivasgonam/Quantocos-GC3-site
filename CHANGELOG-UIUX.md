# Changelog — UI/UX enhancement pass

Backup point: git tag **`pre-uiux-pass`** (commit `0a98888`). To restore the site
exactly as it was before this pass: `git checkout pre-uiux-pass -- .` (or
`git reset --hard pre-uiux-pass`).

All additions below are additive and independent. Reverting any one of them does
not affect the others.

---

## Added

### 1. Back-to-top button
- **New file:** `assets/js/uiux.js` — injects a `.q-backtop` button (chevron-up,
  gold on dark glass). Hidden until the page is scrolled past 600px; smooth-scrolls
  to top on click (auto-scrolls under `prefers-reduced-motion`).
- **CSS:** `assets/css/theme.css` → `.q-backtop` rules (end of file).
- **Wiring:** `build.py` → `SCRIPTS` gained `<script src="assets/js/uiux.js" defer>`.

**Revert:** delete `assets/js/uiux.js`, remove its `<script>` line in `build.py`
(SCRIPTS), and remove the `.q-backtop` block in `theme.css`.

### 2. Anchored sections clear the sticky header
- **CSS:** `assets/css/theme.css` → `section[id] { scroll-margin-top: calc(var(--header-h,72px)+20px); }`
  Fixes in-page nav (e.g. gc3 "On this page") landing under the sticky header.

**Revert:** delete that one `section[id]` rule.

### 3. Custom dark scrollbar
- **CSS:** `assets/css/theme.css` → `html { scrollbar-width/scrollbar-color }` +
  `::-webkit-scrollbar*` rules (dark track, gold on hover).

**Revert:** delete the scrollbar rules.

### 4. Stagger reveal on card grids
- **Generators:** `q_pages_1.py`, `q_pages_2.py`, `q_pages_3.py`, `q_pages_4.py`
  → added `data-stagger` to 16 card grids (`grid--3` / `grid--4`). The existing
  motion engine (`motion.js`) now fades cards in with a staggered slide-up on scroll.

**Revert:** remove the `data-stagger` attribute from those `<div class="grid grid--3/--4">` lines
(they revert to `<div class="grid grid--N">`).

### 5. Glassmorphism refinement (from ui.zip reference analysis)
- **CSS:** `assets/css/theme.css` → two rules:
  - `.band--deep/.band--alt/.band--paper` gained ambient **corner radial glows**
    (warm gold top-left + violet bottom-right) via `background-image`.
  - Cards on dark bands (`.band--* .card:not(.card--tint/.card--deep/.card--flat)`)
    became **frosted glass**: translucent `rgba(17,17,24,.5)` + `backdrop-filter:
    blur(16px) saturate(140%)` + `1px rgba(255,255,255,.09)` border + `24px` squircle radius.
- Light bands (`band--light*`) and the tinted/deep card variants are intentionally untouched.

**Revert:** delete the two blocks under "Reference-derived glassmorphism refinement".

### 6. Animations (reference-derived)
- **CSS:** `assets/css/theme.css` → three animations:
  - **Shine sweep** on dark-band cards (`::after` diagonal light sweep, on hover).
  - **Ken-burns** on the spectrum banner image (`spectrumPan`, slow scale/pan).
  - **Flowing spectrum** edge line (`spectrumFlow`, animated `background-position`).
  - All disabled under `prefers-reduced-motion`.

**Revert:** delete the block under "Animations (reference-derived)".

### 7. Hero title descender clearance
- **CSS:** `assets/css/theme.css` → `.hero__title { line-height: 1.2 }` (was `--lh-heading` 1.14)
  and `.hero__title em { line-height: 1.08; margin-top: 0.16em }` so the "y" descender in
  "capability" no longer collides with the gradient serif line below it.

**Revert:** remove those two property additions.

### 8. Corner-glow cards (violet → teal → amber), site-wide
- **CSS:** `assets/css/theme.css` → replaced the frosted-glass card background with
  **solid-base + ambient corner glow** cards, alternating by `:nth-child(3n+1/3n+2/3n)`:
  violet `rgba(107,33,168)` / teal `rgba(14,116,144)` / amber `rgba(161,107,30)`, each a
  `radial-gradient(circle at 85% 15%, …)` over a near-black base. Applies to dark bands
  (`band--deep/-alt/-paper`), excluding `card--tint/deep/flat`. Light bands untouched.

**Revert:** delete the "Corner-glow cards" block (restores the previous frosted-glass rule if you
`git show 9cc830f:assets/css/theme.css`).

### 9. Final-CTA decorative circles (left/right)
- **CSS:** `assets/css/theme.css` → `.spectrum-strip + .band--deep` (the final CTA band) gets
  `position:relative; overflow:hidden` plus two decorative rings:
  - `::before` — thick **violet** ring (`64px rgba(117,44,255,.07)`, 440px) bottom-left.
  - `::after` — thin **cyan** ring (`1px rgba(0,216,255,.22)` + violet glow, 380px) top-right.
  Content lifted to `z-index:1`.

**Revert:** delete the "Final CTA: decorative circles" block.

### 10. "10/10" playbook-alignment pass (restraint + single accent)
- **Cards:** violet/teal/amber corner glows → **single gold glow** (`radial-gradient` at 85% 15%) on a lifted dark base. `theme.css`.
- **Dropped:** ambient band glows (violet+gold ellipse), CTA left/right circles, spectrum-edge flow animation. `theme.css`.
- **Orbital rings:** violet + cyan → **gold**, opacity reduced. `theme.css`.
- **Palette:** `void #030304 → #0d0e11`; `void-2/3/4` + `void-line`/`line` lifted proportionally; `deep`/`deep-ink` now `var(--void)`. `theme.py` → regenerated `brand.css`.
- **Typography:** removed the blanket `-0.026em` heading tracking (restores token hierarchy `-0.024/-0.02/-0.01`); serif tracking (`hero em`, `.serif`) → `0`; nav gap `2px → 6px`. `theme.css` + `site.css`.

**Revert:** `git show 6bab971:assets/css/theme.css` (cards/rings/animations) + `git show 6bab971:theme.py` (palette).

### 11. Workflow pipeline text-collision + hero gradient fix
- **Pipeline** (`assets/js/dataflow.js`): "Specialist review" (17 chars) exceeded the 16-char wrap limit and wrapped onto a second line that collided with "a named human". Fixed: title wrap limit `16 → 20`; step box height `78 → 84`; subtitle offset `railY+18 → +22`. Verified: title renders on one line, subtitle 20px below.
- **Hero gradient** (`assets/css/site.css` `.hero__title em`): brightened the tail from dark violet→cyan to `#eab308 → #ec4899 → #a855f7 → #38bdf8` (readable azure on dark).

**Revert:** `git show 5a02391:assets/js/dataflow.js` + `git show 5a02391:assets/css/site.css`.

---

## Not added (already present — no change made)

The site already ships a full motion/interaction stack, so these were **left
untouched** rather than duplicated:
- Reveal-on-scroll, stagger, hero split-text, counters, parallax, progress bar
  (`assets/js/motion.js` + GSAP/ScrollTrigger/SplitText).
- Sticky header, mega menu, mobile drawer, accordions, forms, scroll-spy,
  year stamp (`assets/js/site.js`).
- Smooth scroll, gold `::selection`, gold `:focus-visible` ring.

## Not done (limitation)

Visual extraction from `ui.zip` reference images was **palette-only** — no vision
model is available, so specific layouts/animations inside the images could not be
identified by eye. Changes above were chosen to match the site's existing
dark-glass + gold design language, which the reference images share.
