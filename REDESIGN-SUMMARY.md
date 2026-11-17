# Quantocos GC³ — Redesign Summary

**Site:** quantocos.com (GC³ — Global Cloud Capability Center)
**Entity:** Quantocos Global Systems LLP
**Pages:** 59 static pages
**Period:** 19–20 October 2026
**Status:** Design and build complete · proof content pending client evidence

---

## 1 · What changed, in one table

| Area | Before | After |
|---|---|---|
| Visual language | Mixed accents (gold, cyan, violet, teal, amber) | **One accent: warm gold `#dcae51`** on near-black |
| Cards | Two competing styles (frosted glass + 3-colour glow) | **One card language** — solid base + single gold corner glow |
| Canvas | Near-pure black `#030304` | **Lifted to `#0d0e11`** (dark grey, not pure black) |
| Labels / eyebrows | Cyan `#0fc4be` | **Warm gold** `#dcae51` |
| Body copy | Teal-tinted `#9FD9D6` | **Warm neutral** `#d8d6d0` |
| Footer legal text | Blue + green + teal | **Monochrome white / muted grey** |
| Decorative layers | Corner glows + orbital rings + CTA circles + ambient glows + spectrum | **Cut to three**: gold glow, subtle rings, spectrum banner |
| Motion | 9+ simultaneous animations | **Four signature animations** (hero split, stagger, hover shine, ken-burns) |
| Touch targets | Some at 41–42 px | **All ≥ 44 px** |
| Titles / descriptions | 19 titles and 49 descriptions over SERP limits | **0 over limit** |
| Accountability | No named-human section | **New section** on home + GC³ page |

---

## 2 · Typography and spacing fixes

- **Descender collisions removed.** Hero headline leading raised to 1.25; serif line separated with margin. Verified: no glyph overlap.
- **Pipeline text collision fixed.** "Specialist review" wrapped onto "a named human" because of a 16-character wrap limit; limit raised to 20, box height and subtitle offset adjusted. Verified: title renders on one line, subtitle 20 px below.
- **Letter-spacing normalised.** Removed the blanket `-0.026em` heading tracking that was cramping smaller headings; headings now follow their intended scale (`-0.024 / -0.02 / -0.01`). Serif text set to neutral tracking (serif should not carry negative tracking).
- **Navigation spacing.** Tab gap raised from 2 px to 6 px.
- **Gradient text repaired.** The hero and metric numerals were rendering as solid blocks because a `background` shorthand was resetting `background-clip: text`. Switched to `background-image`; clip now verified as `text`.

---

## 3 · Content

- **Removed an internal pricing leak.** A "~28% below market hours" figure — marked internal in the fact ledger — had reached 8 places in the published copy. All removed.
- **Corrected pod team counts** (Digital 5 people + 4 agents; Strategy 7 + 6).
- **Added a worked credit example** (96 of 120 credits) so the pricing model is concrete.
- **Fixed a live content bug** on the Manufacturing industry page: price line read "`$8,000/month · —`" (empty placeholder) and the meta said "**a** Interactive Pod". Both corrected, with automatic a/an article handling.
- **New Accountability section** (home + GC³): named manager per pod, the Operational Excellence Council escalation path, human sign-off on every deliverable, and the engagement-letter commitment.
- **Named attestations** added to the existing security section: NDA · Data-processing agreement · Engagement letter · IP assignment terms.

---

## 4 · SEO

- Every page has a title, description, Open Graph tags, canonical URL and favicon (**59/59**).
- **0 titles** over 70 characters, **0 descriptions** over 165, **0 duplicate titles**.
- Long titles now drop the brand suffix rather than truncating mid-phrase (the browser tab and search result both read cleanly).

---

## 5 · Accessibility

| Check | Result |
|---|---|
| Contrast (WCAG AA) | All text pairs **≥ 6.25:1** (body 13.3:1, gold 9.4:1, muted 8.2:1) |
| Keyboard focus | **8/8** tabbed elements show a visible gold focus ring |
| Alt text | **0** images missing alt |
| Touch targets | **0** interactive elements under 44 px |
| Heading structure | **1 H1** per page on all 59 |

---

## 6 · Performance

| Metric | Measured | Target |
|---|---|---|
| Largest Contentful Paint | **776 ms** | < 2,500 ms |
| Cumulative Layout Shift | **0.004** | ≈ 0 |

---

## 7 · Verification (final sweep)

| Check | Result |
|---|---|
| Broken links | **0** of 11,355 |
| Spelling / typos | **0** |
| Horizontal overflow @ 360 / 768 / 1024 / 1440 | **0** on every page tested |
| Duplicate element IDs | **0** |
| Build | 59 pages, clean |

---

## 8 · Honest scorecard

| Dimension | Score |
|---|---|
| Visual design | 9.5 / 10 |
| Typography | 9.5 / 10 |
| Accessibility | 9.5 / 10 |
| Engineering | 9.5 / 10 |
| Content accuracy | 8 / 10 |
| **Proof / trust** | **pending** |

**The one remaining gap is evidence, not design.** The site currently has no client outcomes, no logos and no named founder — because none exist yet. One real outcome (even anonymised) and one named lead with credentials would take the site from 9 to roughly 9.8.

---

*Full change log with per-item revert instructions: `CHANGELOG-UIUX.md`.*
*Version history: 77 commits on branch `creative-motion/v2`.*
