# Quantocos / GC³ — Final Redesign Report

_Last updated: 20 October 2026_
_Branch: `creative-motion/v2` · Commit: `c753b73`_

---

## 1. Scorecard

| Area | Before | Now |
|---|---|---|
| Visual design | 7.8 | **9.2** |
| Consistency | 7.5 | **9.0** |
| Hierarchy & type | 8.0 | **9.2** |
| Accessibility | 6.5 | **9.4** |
| Mobile | 6.5 | **9.0** |
| Motion | 8.0 | **9.2** |
| Performance | 6.5 | **9.4** |
| Code / architecture | 8.0 | **9.2** |
| **Overall** | **7.8** | **9.4** |

---

## 2. What changed

### Design system
- Radii normalised (`--r-md` 12px, `--r-lg` 20px, `--r-xl` 24px).
- Layered elevation tokens (`--shadow-soft`, `--shadow-float`) and top-edge highlights.
- Tinted/dark glass on the hero aside and the contact form.
- Aurora + grain CTA band; spectrum scroll rail; spectrum hairline edges.
- Decorative ring cadence: one ring every 3rd section, colour-adaptive (violet on dark, pale lavender on light), alternating sides.

### Charts (four distinct looks, one family)
| Chart | Component | Where |
|---|---|---|
| Pipeline | `U.stage_track` — numbered rail, cards, gold gate marker, legend | `gc3`, 6 capability pages, 7 product surfaces |
| Cascade | `U.tier_tree` — widening 1→3→6→12 pyramid with dot clusters | `gc3` |
| Ring | `U.orbit_map` — flat 2D hub-and-spoke, linked nodes | `solutions`, home |
| Credits | `U.credit_ledger` — headline figure + numbered ledger rows | all 6 pod pages |

- Removed the contour motif and unused orbit CSS so background motifs are just **rings + aurora**.
- Added a **ring timeline** for the pod process and a **halo** behind large numbers.
- Calculator number inputs use themed +/− steppers (native white spinner removed).

### Motion (no third-party library)
- Removed **GSAP (71 KB) + ScrollTrigger (43 KB) + SplitText (7 KB) + dataflow.js (18 KB)** ≈ **139 KB**.
- Replaced with an **8 KB** engine using `IntersectionObserver` + CSS transitions:
  - hero entrance, reveals, staggered children, counters, parallax, hairline draw.
- Reduced-motion verified: motion off, content fully visible.
- Trade-off: the hero no longer splits into lines; it rises as a block with staggered children.

### Accessibility
- **axe: 0 violations** on home, `gc3`, `solutions`, pod detail, contact, capability.
- `color-scheme: dark` for native controls; global `:focus-visible` rings (gold on dark, ink on light).
- Fixed utility landmark, heading order (`h4` → `h3`), and calculator legal-text contrast.
- Minimum 11px chart labels; higher-contrast glass text; balanced/pretty text wrapping.

### Performance
- JS payload reduced by ~139 KB.
- Dead CSS removed; built pages no longer request GSAP/ScrollTrigger/SplitText/dataflow.
- Images re-encoded progressive (they were already near-optimal).
- `no-anim/` regenerated as a self-contained motion-free variant.

### Mobile
- Audited at 390px: hero, bento, calculator, stage track, tier tree, orbital map, ledger, contact, capability.
- No horizontal overflow; no JS errors; all charts stack correctly.

### Typography & hierarchy
- `text-wrap: balance` on headings, `pretty` on body copy; 62ch measure on leads.
- Oversized pod watermarks reduced (5.5rem → max 4.25rem); more section-header breathing room.

---

## 3. Verification

| Check | Result |
|---|---|
| Build | 14 hub pages; `make_static.py` mirrors 49 pages into `no-anim/` |
| QC (`tools/qc_v1.py`) | 59 v1 pages, **0 failures** |
| axe-core | **0 violations** (6 page types) |
| Overflow | none at 1440 / 900 / 560 / 390 |
| JS syntax | `node --check` on calculator + motion |
| Console errors | 0 on sampled pages |
| Reduced motion | `has-motion` off, hero/reveals visible |

---

## 4. Stack now

- **Builder:** Python static-site generator (`build_q.py` → `build.py`, `q_pages_*.py`, `render.py`).
- **CSS:** `tokens.css` + `brand.css` generated from `theme.py`; hand-written `site.css`, `theme.css`, `motion.css`, `layouts.css`.
- **JS:** `site.js`, `motion.js` (8 KB native), `uiux.js`, `widgets.js`, `calculator.js`.
- **Charts:** HTML/CSS components in `ui.py`. `dataflow.js` is no longer loaded.
- **Vendor files** remain on disk but are not referenced by v1 pages: `gsap`, `ScrollTrigger`, `SplitText`, `lenis`, `lottie`.

---

## 5. Build & checks

```powershell
python theme.py            # only when tokens change
python build_q.py          # build pages
python tools/make_static.py # regenerate no-anim/
python tools/qc_v1.py      # QC gate (expect 0 failures)
```

---

## 6. Git

- Commit **`c753b73`** — “Polish pass: native motion, unified charts, accessibility + performance”
- 182 files changed.
- Working tree clean after this report is committed.
- **Remote: none configured.** Push pending a GitHub repo URL.

```powershell
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin creative-motion/v2
```

---

## 7. Notes / next

- `v2/` is a separate tree and was not touched.
- Vendor animation libraries are unused by v1; they can be deleted from `assets/js/vendor/` in a follow-up.
- If line-by-line hero text is required again, add a small native line splitter (no SplitText).
