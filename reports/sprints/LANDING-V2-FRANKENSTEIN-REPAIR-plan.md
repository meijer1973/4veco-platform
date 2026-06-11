# LANDING-V2-FRANKENSTEIN-REPAIR Plan

Date: 2026-06-11
Owner: codex
Status: complete
Branch: `codex/paragraph-landing-v2-prototype-port-20260611`

## Product End State And Source Spec

Product end-state: every paragraph exposes one visible student route from
current readiness to local target-equivalent proof. Visible route items need a
student-facing label, purpose, status or focus, and a real action or explicit
fallback.

Original sprint/gate spec: LANDING-V2-PARAGRAPH-ROUTE-REPLACEMENT required the
six-row paragraph route. The follow-up human verdict classifies the first PR
pair as `hold_for_visual_reset`: rows and tile inventory were present, but the
page was rebuilt inside the old lesson shell instead of porting the approved
prototype.

Repair source artifacts:

- `references/ui/paragraph-landing-v2/approved-light.html`
- `references/ui/paragraph-landing-v2/approved-dark.html`
- `LANDING-V2-FRANKENSTEIN-REPAIR-INSTRUCTIONS.md` supplied with the repair
  packet.

## Quality Floor

Generated paragraph pages must use the approved prototype structure and visual
system as the implementation baseline. Passing row/tile tests is not sufficient
if the output still uses the old paragraph shell, old shared landing CSS, or the
previous `landing-v2-*` visual system.

## Non-Negotiable Requirements

- Add approved light and dark prototype files as canonical platform fixtures.
- Rebuild the paragraph renderer by parameterizing the prototype structure.
- Delete the old paragraph renderer/card helper block from the production
  generator.
- Do not link paragraph landing pages to `../../shared/voorkennis.css`.
- Generated paragraph pages must contain `.app-shell`, `.route-strip`,
  `.learning-row`, `.row-label`, `.tile-grid`, and `.tile`.
- Generated paragraph pages must not contain `.page-layout`, `.sidebar-toggle`,
  `.sidebar-overlay`, `.resource-card`, `.route-secondary-group`,
  `.landing-v2-*`, or `data-layout="paragraaf-v2"`.
- Render six rows and the sixteen required tile IDs for every paragraph.
- Missing future surfaces render as disabled placeholders with no `href`.
- Light and dark mode use the same DOM and spacing with theme token switching
  only.
- Do not claim closure for downstream Scale Gate 1, product-route adoption,
  diagnostics/mastery/PV, or student/product-use work.

## Core-Requirement Checklist

- [x] Create fresh repair branch from current `main`.
- [x] Claim coordinated platform and lesson worktrees.
- [x] Add approved prototype fixtures to the platform repo.
- [x] Add canonical fixture README.
- [x] Add or refresh paragraph landing V2 spec references.
- [x] Replace paragraph rendering path in
      `build-scripts/platform/build-landing-page.js`.
- [x] Delete old paragraph renderer/card helper block from the production
      generator.
- [x] Add anti-Frankenstein tests for prototype structure and forbidden legacy
      markers.
- [x] Generate Book 1 paragraph outputs from the corrected renderer.
- [x] Capture approved/generated light comparison, approved/generated dark
      comparison, and generated mobile proof.
- [x] Run grep proof, link check, paragraph validators, and platform tests.

## Evidence Required

- Source diff in `4veco-platform`.
- Generated `index.html` files in `4veco-lessen`.
- Screenshot proof comparing approved light/dark fixtures to generated 1.1.1.
- Generated mobile/narrow screenshot.
- Grep proof for forbidden legacy markers.
- Proof missing tiles are disabled placeholders with no `href`.
- Proof rows and tile IDs are correct.
- Link-check result and platform test result.

## Finding Classification For Review

- `blocks`: generated page uses legacy shell, missing prototype structure,
  missing core row/tile, fake link, missing placeholder, old paragraph renderer
  retained, or generated output not produced by the corrected generator.
- `does_not_block`: minor text or spacing refinements that do not weaken the
  prototype structure, route contract, or student action.
- `proof_required_to_close`: fixture-vs-generated screenshots, grep proof,
  link-check, validator output, and human visual review.

PASS WITH FLAGS may not carry a missing core requirement.
