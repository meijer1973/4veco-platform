# LANDING-V2-PARAGRAPH-ROUTE-REPLACEMENT Plan

Date: 2026-06-11
Status: complete
Owner: codex

## Product End State And Source Spec

Product end-state: every paragraph must expose one visible student route from
current readiness to local target-equivalent proof. Visible route items need a
student-facing label, purpose, status or focus, and a real action or explicit
fallback.

Original sprint/gate spec: the human implementation report for
LANDING-V2-PARAGRAPH-ROUTE-REPLACEMENT says this is a replacement sprint, not a
polish sprint. The approved new paragraph route replaces the old
Start/Leer/Oefen/Check/Verdiep renderer as structural foundation.

## Non-Negotiable Requirements

- Replace the old paragraph landing renderer with the V2 route layout.
- Keep useful backend scanning and deploy-config resolution.
- Render the same six rows for every paragraph.
- Do not hide missing future surfaces; show disabled placeholders.
- Do not create fake links or silent no-op links.
- Keep light and dark mode as one shared layout with theme tokens.
- Generate proof output for paragraphs 1.1.1, 1.1.2, and 1.1.3.

## Core-Requirement Checklist

- [x] Add `4veco-lessen/specifications/paragraph-landing-layout-v2.md`.
- [x] Reference the new spec from product end-state and companion specs.
- [x] Reference the new spec from platform AGENTS, BUILD-PARAGRAPH, and
      build-scripts README.
- [x] Replace paragraph page rendering path in
      `build-scripts/platform/build-landing-page.js`.
- [x] Preserve scanFiles, encPath, deploy-config loading, and chapter/book
      generation.
- [x] Render six rows: Start, Skill-tree games, Leer, Oefen, Check,
      Open & verdiep.
- [x] Render explicit placeholder tiles for missing future surfaces.
- [x] Generate paragraph index pages for 1.1.1, 1.1.2, and 1.1.3 through the
      generator.
- [x] Run link checking and relevant platform/paragraph validation.
- [x] Capture light, dark, and narrow/mobile rendered proof.

## Evidence Required

- Source diff in `4veco-platform`.
- Generated `index.html` files in `4veco-lessen`.
- Screenshot proof for 1.1.1 in light, dark, and narrow/mobile mode.
- Proof that missing tiles are disabled placeholders.
- Link-check result.
- Relevant validation result.

## Finding Classification For Review

- `blocks`: missing V2 row, missing core tile, fake link, silent dead tile,
  old paragraph structure visible, generated output not produced by generator.
- `does_not_block`: minor copy, spacing, or visual refinements that do not
  weaken the core route model.
- `proof_required_to_close`: rendered screenshots, link-check, validator output,
  and reviewer comparison against the approved V2 contract.

PASS WITH FLAGS may not carry a missing core requirement.
