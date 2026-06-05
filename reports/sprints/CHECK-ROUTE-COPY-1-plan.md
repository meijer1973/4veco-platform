# CHECK-ROUTE-COPY-1 Plan

Generated: 2026-06-05

## Objective

Repair the first-three paragraph landing-page check-route copy so students can
clearly distinguish the advisory `Korte check` from the target-equivalent
`Exit ticket` route.

This is the third product-quality repair after
`GATE-CHECK-SHORT-EXIT-2` returned `REVISE / hold_for_surface_repair`.

## Quality Floor

The Check section on the `1.1.1`, `1.1.2`, and `1.1.3` paragraph landing pages
must make the two check cards visually and behaviorally different:

1. `Korte check` must read as local route advice: a small check that helps the
   student choose what to practise next.
2. `Exit ticket` must read as the end check with target-exercise-like
   operations, without claiming completion unless separately authorized.
3. The copy must avoid diagnostic, mastery, sequencing, summative, PV, Scale
   Gate, or broad product-authority language.
4. The reviewed `1.1.2` completion-language authority must remain untouched.
5. `1.1.1` and `1.1.3` completion language must remain held.

## Specification Requirements Fulfilled

The product-end-state spec requires a visible route from current readiness to
target-equivalent proof. That route has two distinct Check surfaces:

- advisory short check: local feedback and next-step advice;
- exit ticket: target-equivalent end check, subject to review authority.

This sprint repairs the landing route affordance only. It does not decide
whether the exit-ticket candidates pass the human gate.

## Evidence Needed

- Updated `build-scripts/platform/build-landing-page.js` check-card copy and
  markup.
- Regenerated Book 1 landing pages through `node scripts/deploy.js`.
- Focused checker `build-scripts/sprints/check-check-route-copy1.js`.
- Screenshot/proof capture for first-three landing Check sections:
  `build-scripts/sprints/capture-check-route-copy1-screenshots.js`.
- `reports/json/check-route-copy1-proof.json`.
- Screenshot manifest and desktop/mobile/dark screenshots.
- Planning review, lead review, visual QA, verification review, command log,
  result, refreshed repository maps, and validators.

## Review Gate

No human gate is requested by this sprint. The retry human gate remains blocked
until `VISUAL-QA-HARDEN-2` and `CHECK-SURFACE-PREGATE-1` complete.

## Procedure

1. Record plan, baseline, and planning review.
2. Add a specific check-card renderer to the landing-page generator.
3. Give `Korte check` and `Exit ticket` distinct badges, descriptions, and
   action text.
4. Add data attributes so generated landing pages can be checked
   deterministically.
5. Deploy Book 1 generated output.
6. Add focused checker and screenshot/proof capture.
7. Run focused and broad validators.
8. Update roadmap status, maps, URL indexes, and dashboard.
9. Commit and push platform and generated lesson output.

## Stop Conditions

Stop if:

- the landing cards still only say generic "Kies wat je nog wilt oefenen" and
  "Maak de volledige paragraaf-check";
- the two cards are not visually/semantically distinguishable;
- the new copy claims diagnostics, mastery, sequencing, a grade, summative
  status, Scale Gate, PV, product adoption, or unreviewed completion;
- `1.1.2` reviewed completion authority changes;
- `1.1.1` or `1.1.3` completion language becomes eligible;
- generated Book 1 output is hand-edited instead of deployed;
- the retry human gate is requested before `CHECK-SURFACE-PREGATE-1`.

## Follow-Up Work

This sprint does not harden the full visual-QA standard or prepare the retry
gate packet. Those remain `VISUAL-QA-HARDEN-2` and
`CHECK-SURFACE-PREGATE-1`.
