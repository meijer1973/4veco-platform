# NEWS-DETECTIVE-V2-PROTOTYPE-REPLACEMENT-1 Plan

Date: 2026-06-18

## Product End-State

Generated Nieuws-detective pages use the approved V2 product structure and
visual system. The student can read the complete article during every game
round while preserving the existing four-round game logic, scoring, feedback,
replay, light/dark mode, mobile behavior, and navigation back to the paragraph.

## Original Sprint Spec

Source handoff:

- Attachment `b6e3f4b6-56b4-48a9-9c1c-80aace262b82/pasted-text.txt`.
- Prototype placed in the worktree root:
  `4veco-news-detective-v2-prototype.html`.

The handoff states this is a replacement sprint, not a polish sprint. The old
Nieuws-detective front end must not survive as the active layout.

## Non-Negotiable Requirements

- Use the approved V2 prototype as the canonical visual/structural baseline.
- Keep `engines/newsdetective-engine.js` and `NEWS_DETECTIVE_DATA` as the
  behavioral contract, except for concrete runtime bugs.
- Replace the old production UI/CSS/shell; do not wrap the old layout.
- Keep the complete article readable in all four active rounds.
- Do not use compact article rendering, line clamp, ellipsis, or hidden
  overflow for article text.
- Generate lesson output from platform; do not hand-edit lesson files.
- No fake `href="#"` links in production output.
- Provide rendered desktop/mobile/light/dark/result proof from generated
  lesson output.

## Core Checklist

- [x] Canonical fixture added under `references/ui/news-detective-v2/`.
- [x] Production `newsdetective-ui.js` rewritten around the V2 DOM.
- [x] Production `newsdetective.css` replaced with V2 visual system.
- [x] Generated shell emits only V2 structure and production assets.
- [x] Complete article rendered in start and active game screens.
- [x] Four engine rounds render and advance in the V2 controls.
- [x] Score, feedback, replay, and return-to-paragraph navigation work.
- [x] Light and dark mode use the same DOM.
- [x] Mobile stacks article above the active round.
- [x] Dedicated no-Frankenstein checker added.
- [x] Generated Book 1 lesson output refreshed.
- [x] Rendered proof and DOM/computed proof captured.

## Execution Notes

During rendered proof, real lesson data exposed a concrete engine bug:
`getDomainColors()` JSON-parsed missing optional `domainColors`. The engine now
returns `{}` when that optional payload is absent, and the generator now copies
the fixed engine asset into lesson output.

Rendered proof also exposed a desktop overflow regression from a prototype
`100vw` content width. Production CSS now sizes the content column against its
grid column, and the checker forbids the rejected `calc(100vw - var(--sidebar))`
pattern in production/copied CSS.

## Boundaries

This sprint changes only the Nieuws-detective front end and the one engine
optional-field bug needed to make real data run. It does not close Scale Gate 1,
product-route adoption, diagnostics, mastery/PV, or student/product-use
authority.
