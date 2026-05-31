# SKILLMAP-OP-1 Accessibility Review

Generated: 2026-05-31

Reviewer role: Accessibility Agent, following `agents/accessibility-agent.md`.

## Accessibility Summary

- Verdict: PASS WITH FLAGS
- Scope: focused review of SKILLMAP-OP-1 route panels only.
- Human-review escalation status: No accessibility blocker requiring a human pause. Lead review round 2 should record the flags below before accepting sprint closure.

The route panels are readable in the reviewed screenshots, fit mobile widths, use semantic HTML, expose a focusable primary action link, and do not visibly leak MTU codes or prohibited product claims. The remaining accessibility risks are not blockers for route-visibility proof, but they should be corrected or explicitly accepted before product-scale exposure.

## Evidence Inspected

- `agents/accessibility-agent.md`
- `reports/sprints/SKILLMAP-OP-1-student-route-proof.md`
- `reports/sprints/SKILLMAP-OP-1-screenshot-manifest.md`
- `reports/sprints/SKILLMAP-OP-1-screenshots/desktop-111-reasoning.png`
- `reports/sprints/SKILLMAP-OP-1-screenshots/desktop-112-reasoning.png`
- `reports/sprints/SKILLMAP-OP-1-screenshots/desktop-112-math.png`
- `reports/sprints/SKILLMAP-OP-1-screenshots/mobile-112-math.png`
- `reports/sprints/SKILLMAP-OP-1-screenshots/desktop-113-graph.png`
- `reports/sprints/SKILLMAP-OP-1-screenshots/mobile-113-graph.png`
- `reports/sprints/SKILLMAP-OP-1-result.md`
- `engines/skill-map-route.css`
- `engines/skill-map-route-ui.js`
- generated route files under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod`

## Checks Run

| Check | Result |
|---|---|
| `node build-scripts\sprints\check-skillmap-op1-route-output.js "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"` | PASS, 7 routes checked |
| Focused static route accessibility script over 7 generated route cases | PASS for section label, `h2`, action link, list items, local-boundary copy, no visible internal IDs |
| Route CSS contrast ratio spot check | PASS for sampled light and dark route colors |
| Screenshot inspection | PASS WITH FLAGS; no visible route clipping, but no dark-mode route screenshot evidence |

The focused static script also found that `.skill-map-route-action` has no route-specific `:focus-visible` rule. Some host surfaces provide global focus styling and browsers provide default link focus, but the shared route component should not rely on that.

## Findings

### Readability

PASS WITH FLAGS.

The route panels are legible on the reviewed desktop and mobile captures. The main route title, paragraph target, purpose text, skill labels, state labels, and progress badges remain readable at 390 px mobile width. The mobile `1.1.3` graph screenshot shows long labels wrapping without clipping.

Flag: the smallest helper labels are intentionally compact: `.skill-map-route-kicker` is `0.72rem`, and state/boundary text is `0.75rem`. This is acceptable for secondary labels, but these should not carry essential-only instructions in future task-shell integration.

### Contrast

PASS WITH FLAGS.

Sampled route CSS color pairs meet WCAG AA-equivalent contrast for normal text:

| Pair | Approx. ratio |
|---|---:|
| body text `#1e293b` on white | 14.63 |
| secondary label `#64748b` on white | 4.76 |
| target/purpose `#334155` on white | 10.35 |
| action text white on `#0f766e` | 5.47 |
| focus pill `#075985` on `#e0f2fe` | 6.59 |
| state text `#64748b` on `#f8fafc` | 4.55 |
| dark body `#e2e8f0` on dark panel approximation | 14.48 |
| dark secondary `#94a3b8` on dark panel approximation | 6.96 |

Flag: dark-mode route contrast is supported by CSS, but SKILLMAP-OP-1 screenshot evidence does not include a dark-mode route panel capture. Add dark-mode desktop/mobile route screenshots before using this as product-scale accessibility proof.

### Semantic Accessibility

PASS.

`SkillMapRouteUI` renders the route as:

- a `<section class="skill-map-route" aria-label="...">`;
- a visible `<h2>`;
- a focusable primary `<a class="skill-map-route-action" href="...">`;
- a `<ul>` with `<li>` route items;
- progress badges with `aria-label`, for example `0/3 oefensterren`.

The route items are not made keyboard-focusable, which is correct because they are status rows, not controls. The primary action is the only route-panel interaction.

### Interaction Accessibility

PASS WITH FLAGS.

The primary action is a real link, so it participates in normal keyboard tab order. The route panel does not introduce custom keyboard traps or pointer-only controls. Graphical surfaces include global `a:focus-visible` styling, and other surfaces appear to retain browser-default link focus.

Flag: the shared route CSS does not define its own `.skill-map-route-action:focus-visible` style. Add a component-local focus ring so the route action remains visibly focusable on every host surface, independent of global CSS.

### Mobile Behavior

PASS.

The reviewed mobile route panels fit inside a 390 px viewport. The screenshot manifest records route widths of 362 px for mobile math and 320 px for mobile graph, with no recorded overflow. Visual inspection confirms wrapping is controlled and the route does not clip the skill labels, progress badges, or boundary text.

### Internal-Code And Prohibited-Claim Leakage

PASS.

The generated route text does not visibly expose MTU IDs such as `A38`, `A39`, `A61`, `B01`, or `B02`. The visible boundary copy says:

```text
Alleen lokale oefenvoortgang. Geen diagnose, beoordeling of automatische route.
```

No target-equivalent proof, grade, mastery, diagnostic, adaptive-routing, AI, PV, Scale Gate, summative, or product-use claim is visible in the reviewed route panels.

### Alt Text And OCR

N/A for this focused route-panel review.

The route panels are live HTML, not educational bitmap images. Screenshot OCR was not used as an accessibility substitute. The graph SVGs visible in graph-game screenshots are outside this focused route-panel scope, although they should remain under `GRAPH-UX-2` accessibility review.

## Critical Accessibility Issues

None found in the focused route-panel scope.

## Required Fixes

Before SKILLMAP-OP-1 lead review round 2:

- Record this accessibility review as formal specialist evidence.
- Record the focus-style and dark-mode screenshot gaps as accepted flags or correction items.

Before product-scale exposure or Scale Gate use:

- Add a component-local focus rule for `.skill-map-route-action:focus-visible`.
- Capture at least one desktop and one mobile dark-mode route-panel screenshot.
- Keep any future route-panel helper labels from carrying essential-only instructions at `0.72rem` or `0.75rem`.

## Human Review Required

No human accessibility pause is required. Lead review round 2 is still required to decide whether these flags are accepted for SKILLMAP-OP-1 closure or converted into immediate corrections.
