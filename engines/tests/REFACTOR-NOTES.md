# skilltree — clean-sheet UI rewrite (fifth and final pass)

After four incremental refactor passes the UI still carried accreted baggage from its React-translated origin. A fresh agent without chat-memory was briefed from the HTML scaffold template + CSS + engine API alone, and wrote a clean-sheet `skilltree-ui.js` in 780 lines (down from 1,325 — **-545 lines, -41%**).

## What changed in the clean-sheet pass

- Old file preserved as `engines/skilltree-ui.legacy.js` for reference.
- New file: 780 lines, 15 logically-sectioned blocks with `/* ── N. Section ── */` banners.
- Single `$()` helper + one `els` map; `showView('tree'|'deps'|'expl'|'exercise')` centralises view switching.
- Fatal-error path uses `createElement` + `insertBefore` instead of `document.body.innerHTML` (one less dirty-fallback).
- `hintShown`, `autoAdvance`, `orderPlaced`, `depHistory`, `savedDepState`, `explOrigin` are the only module-scoped state. Everything else derives from engine state or DOM.
- No `insertAdjacentHTML`, no `root.innerHTML = '<section …>'`, no scaffold assembly.
- Same 90/90 engine tests pass. Same CSS classes, same `data-layer` attribute-driven layer colours, same HTML scaffold.

## Divergences documented by the agent

1. Goal-banner "prompt" suppressed when any active or achieved goals exist (prevents noise).
2. Error-mode wrong-pick doesn't fade siblings (CSS contract only requires faded for correct-pick context).
3. Order-mode rebuilds the whole step card on bank/chain click (simplest delegated-click contract).
4. Confetti: mastery-and-improved OR goal-achievement.
5. Theme-toggle icon swap handled in JS via `.ring i` class swap.
6. Deps node drill-in glyph is `⊥` inside inline SVG (FontAwesome glyphs don't embed reliably in SVG).
7. Exercise-back and result-back both restore saved deps view when applicable.

# skilltree — idiom refactor + editorial design port + HTML scaffold migration (earlier passes)

Branch: `refactor/skilltree-ui-idiom`
Worktree: `C:\Projects\4veco\4veco-platform-skilltree-ui`

## What changed

Two files:

- `engines/skilltree-ui.js` — rewritten to the persistent-scaffold + els-map + surgical-update idiom used by `quiz-ui.js`. Adds a top breadcrumb strip, a light/dark theme toggle, stat tiles in the header, always-5-stars on cards, and `data-layer="N"` attributes that drive layer colour from CSS instead of inline `style=`.
- `engines/skilltree.css` — consolidated stylesheet. Merges the old dark-only stylesheet with the full editorial design from `3-Module-3-rewire-test/shared/skilltree-polish.css`. Design-token system (`--bg`, `--ink`, `--border`, `--teal`, `--gold`, …) switchable via `html[data-theme]`. Fraunces italic headings in light, Space Grotesk in dark, Inter for body, JetBrains Mono for mono. No `!important`.

Engine, generators, explanations, per-paragraph data — untouched.

## Body-mounted modals retired (fourth pass)

Dep + explanation overlays were still `document.body.insertAdjacentHTML('beforeend', '<div class="st-X-overlay">…</div>')` with `rgba(0,0,0,0.4)` backdrops. The dep overlay felt like a popup because it was one — a slide-up panel with a dark-modal backdrop. The user asked for a full-screen view that inherits the theme.

Converted all three transient overlays to in-scaffold elements:

| Overlay | Old | New |
|---|---|---|
| Dependency | body-appended slide-up panel with backdrop | `#st-view-deps` in HTML scaffold; toggled like `#st-view-tree` / `#st-view-exercise` via the `hidden` attribute. Full viewport, no backdrop, theme-inherited. |
| Explanation | body-appended slide-up panel with backdrop | `#st-view-expl` in HTML scaffold; same view pattern. Returns to either tree or exercise view depending on where it was opened from. |
| Info popup | body-appended centered modal | `#st-info-overlay` hidden in HTML; toggled via `hidden` attribute. Stays modal-centered (it's a small info dialog — that's appropriate) but the DOM element is persistent. |

Zero remaining `insertAdjacentHTML` or `document.body.innerHTML` calls outside the two error-fallback banners that fire only if the scaffold is missing or required scripts fail to load.

Dead CSS removed: `.st-dep-overlay`, `.st-dep-container`, `.st-dep-header`, `.st-dep-close`, `.st-expl-overlay`, `.st-expl-container`, `.st-expl-fade`, `.st-expl-back`, `@keyframes slideUp`. Replaced by `.st-view-deps`, `.st-view-expl`, and a shared `.st-view-header` / `.st-view-back` pair used by both new views.

## Scaffold lives in HTML (third pass)

After the design port shipped, it turned out the skilltree was still harder to design than the quiz because `skilltree-ui.js` was still assembling the top-level scaffold (`root.innerHTML = '<section …>…</section>'`) at init. When Claude opens a `*-wiskundevaardigheden.html` file looking for a DOM tree to design against, it sees only `<div id="skilltree-app"></div>` and has to reverse-engineer the structure from JS string literals.

This pass moves the persistent scaffold out of JS and into HTML, matching quiz-ui.js / reasoning-ui.js:

- **HTML** owns the DOM tree: top strip, tree panel, header with stat tiles, goal banner slot, layers container, reset button, exercise panel with its seven slots (header, progress, context, completed list, step-card slot, score tracker, result slot).
- **JS** only reads refs via `document.getElementById` into an `els` map and writes content into the slots.
- JS no longer calls `root.innerHTML = '<section …>'`. No scaffold strings anywhere.
- A guard at startup shows a red error banner if the HTML is the old empty form — this enforces that any future deploy updates HTML and JS together.

### Canonical HTML form

`engines/tests/_wiskundevaardigheden-template.html` is the canonical ~100-line template for the 22 Module-3 `*-wiskundevaardigheden.html` files. Two placeholders (`{{PAR_NR}}`, `{{PAR_NAME}}`) are substituted per paragraph. The harness at `engines/tests/harness-skilltree-ui.html` is a working instance of this template with a dev-only paragraaf switcher on top.

### Why this matters for future design work

A design pass on the skilltree is now exactly the same shape as a design pass on the quiz:

1. Claude opens `*-wiskundevaardigheden.html` → sees the full DOM tree.
2. Claude edits the HTML (restructure, add/remove markup) and `skilltree.css` (style).
3. JS is only touched if behaviour changes, not for visual design.

This removes the "burn-tokens-to-approximate" problem the user identified.

## Polish layer retired

The rewire-test skilltree-polish.js (453 lines, MutationObserver + inline-style re-stamping) and skilltree-polish.css (979 lines of `!important` overrides) are no longer needed. They existed because the old `skilltree-ui.js` rebuilt the DOM on every click, blowing away any design overrides between renders. With the surgical-update idiom the DOM is stable, so the editorial design lives directly in `skilltree.css` + small scaffold edits, like the other games.

## Line-count comparison

| Layer | Old setup | New setup |
|---|---|---|
| `skilltree-ui.js` | 1,387 | 1,314 |
| `skilltree.css` | 1,313 | 1,551 |
| `skilltree-polish.js` (rewire-test only) | 453 | 0 |
| `skilltree-polish.css` (rewire-test only) | 979 | 0 |
| **Total (rewire-test feature-parity)** | **4,132** | **2,865** (−31%) |

Diff vs `main` (which has neither the refactor nor the design port):
- 1,888 insertions, 1,723 deletions → net +165 lines.

In exchange for those +165 lines on platform `main`, the project gains the full editorial design (light/dark themes, Fraunces headings, stat tiles, top-strip, 5-star normalisation) and can retire the two polish files at the next deploy cut.

## Idiom alignment — acceptance criteria

| Criterion | Status | Evidence |
|---|---|---|
| Persistent HTML scaffold | yes | `root.innerHTML` called exactly once, at init (line 69) |
| `els` map captured once | yes | lines 81–89 |
| Surgical updaters (per-section) | yes | `renderLegend`, `renderHeader`, `renderGoalBanner`, `renderLayers`, `renderStepCard`, etc. — each writes to one slot |
| No top-level `render()` dispatcher | yes | removed; `renderTree()` only composes the tree sub-renderers |
| Event delegation on stable parents | yes | one listener on `els.viewTree`, one per overlay |
| FontAwesome icons | yes | `ICON` constant; seven inline SVG helper functions deleted |
| Engine / generators / data untouched | yes | git diff only touches `engines/skilltree-ui.js` |

## Line count

- Before: 1,387 lines
- After: 1,279 lines (−108, −7.8%)
- Plan aspired to < 900 lines.

**Why the target was missed:** the remaining bulk is genuine feature complexity, not render-loop machinery. Largest blocks:

- dependency-overlay SVG graph with barycenter layout (~170 lines)
- step-card renderer covering four modes (MC, order, error, numeric) (~120 lines)
- result view with mastery/goal/achievement celebration (~100 lines)
- explanation overlay with six section types (~60 lines)
- goal-banner with ordered-path rendering (~80 lines)

By comparison: `quiz-ui.js` is 207 lines for a simpler game (one mode, no overlays, no SVG graph). `reasoning-ui.js` is 855 lines. The 1,279-line skilltree has more surface area than either.

## Tests

`engines/tests/` engine suites — 226/226 pass on the refactor branch (run: `npx jest engines/tests/skilltree-engine.test.js engines/tests/quiz-engine.test.js engines/tests/reasoning-engine.test.js engines/tests/newsdetective-engine.test.js engines/tests/procedure-engine.test.js`).

Pre-existing failures (`skilltree-data.test.js`, `samenvatting.md`, orphaned-asset checks) are unrelated to this refactor and fail the same way on `main`.

## Manual verification

Open `engines/tests/harness-skilltree-ui.html` in a browser. Because it pulls cross-directory scripts, use a local HTTP server (file:// may be blocked):

```
cd C:/Projects/4veco
python -m http.server 8000
# then visit:
# http://localhost:8000/4veco-platform-skilltree-ui/engines/tests/harness-skilltree-ui.html
```

The harness loads:
- FontAwesome 6.5.1 CDN
- Module 3 deployed `skilltree.css` + bundled `base-elements.js` + `explanations.js` + selected paragraph data (read-only)
- **Worktree's refactored** `skilltree-engine.js` + `skilltree-ui.js`

Use the paragraph dropdown at the top to switch between all 22 deployed paragraphs. `Clear localStorage` button resets stars/goals.

## Deferred to Sept 2026 deploy

Per the `project_building_for_next_year.md` memory, Module 3 is frozen until the next cohort boundary. Two items cannot land until then:

1. Copy refactored `engines/skilltree-ui.js` to `3. Module 3 - Markt en overheid/shared/skilltree-ui.js` (via `scripts/deploy.js`).
2. Add the FontAwesome CDN `<link>` to all 22 `*-wiskundevaardigheden.html` files in Module 3.

Without step 2 after step 1, icons will render as empty squares. The two must land together.

## Walk list for manual QA (when ready to merge)

1. Tree view: legend, view-mode toggle, header progress summary, layers render with correct colors, skill cards show stars, prereq hints visible on locked.
2. Click a skill → exercise view mounts → MC mode → click option → wrong feedback → click different option → correct → auto-advance to next step → eventually finish → result view with stars → back to tree.
3. Order mode on a skill that uses it (A15+) → place blocks, unplace, check volgorde.
4. Error mode on a skill that uses it → identify incorrect step.
5. Numeric mode → type answer, ±-toggle, Check and Enter key both submit.
6. Hint button → hint box appears. Explanation button → explanation overlay, six section types render, Escape closes.
7. Info icon on a card → info popup with description + preview, Escape closes.
8. Dependency icon on a card → overlay with SVG graph → click a node to start that skill → back returns to overlay.
9. Set as goal from dep overlay → goal banner appears in tree → goal-path steps in banner are clickable → goal achievement celebration on mastery.
10. Reset button → confirm → all stars reset, localStorage cleared.
