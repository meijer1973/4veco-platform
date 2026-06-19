# GATE-PRODUCT-3P-AUTHORITY-COPY-REPAIR-AND-REREVIEW-1 Plan

Date: 2026-06-18

Status: EXECUTED FOR REREVIEW.

## Objective

Repair the held authority-copy blocker from
`GATE-PRODUCT-3P-RENDERED-PATH-PROOF-BUNDLE-1`, regenerate affected lesson
landing output, recapture the first-three rendered product-path proof, and
return only with a substantial rereview bundle for human gate review.

## Product And Gate Authority

Product end-state:

- `../4veco-lessen/specifications/product-end-state.md`
- `reports/sprints/GOLDEN-EXERCISE-WORKBENCH-ROLLOUT-end-state.md`

Original sprint/gate specs:

- `../4veco-lessen/specifications/companion-core-specifications.md`
- `reports/sprints/GATE-PRODUCT-3P-RENDERED-PATH-PROOF-BUNDLE-1-result.md`
- `reports/json/gate-product-3p-rendered-path-proof-bundle-1-proof.json`
- `reports/review-gates/GATE-PRODUCT-3P-RENDERED-PATH-PROOF-BUNDLE-1/review-packet.json`

## Non-Negotiable Requirements

- Do not authorize target-equivalent completion language.
- Do not authorize product-route adoption.
- Do not authorize diagnostics, mastery/sequencing, PV, summative use, Scale
  Gate 1, broad product use, or student/product use.
- Do not mutate target-readiness flags.
- Do not migrate routes.
- Do not hand-edit generated lesson output.
- Do not expand the `GATE-PRODUCT-3P` claim beyond `1.1.1`, `1.1.2`, and
  `1.1.3`.
- Treat `1.1.4` only as same-copy hygiene if the central generator naturally
  updates it.
- Under REV-STD-1, do not carry a missing core requirement under PASS WITH
  FLAGS.

## Repair Plan

1. Read the prior rendered-path proof bundle and review packet.
2. Confirm updated-main generator/source authority.
3. Regenerate affected lesson landing pages through the central landing
   generator.
4. Verify the first-three landing Exit ticket rows use the accepted neutral
   copy:
   - row: `Maak de aparte eindcontrole wanneer je de paragraaf hebt geoefend.`
   - tile: `Werk de eindcontrole uit en gebruik de feedback om je volgende oefenstap te kiezen.`
5. Audit `1.1.4` as same-copy hygiene only.
6. Recapture first-three route, rendered, mobile, dark, feedback, and authority
   evidence.
7. Add a checker that fails if the prior authority-copy blocker reappears.
8. Run internal specialist and lead rereview.
9. Run platform and lesson validation.

## Branches And Worktrees

- Platform branch:
  `codex/gate-product-3p-authority-copy-repair-and-rereview-1-20260618`
- Platform worktree:
  `C:\wt\GATE-PRODUCT-3P-AUTHCOPY-20260618\4veco-platform`
- Lesson branch:
  `codex/gate-product-3p-authority-copy-repair-and-rereview-1-20260618`
- Lesson worktree:
  `C:\wt\GATE-PRODUCT-3P-AUTHCOPY-20260618\4veco-lessen`

## Expected Output Split

Platform PR:

- capture/checker scripts;
- proof JSON;
- screenshot manifest and screenshots;
- sprint reports;
- review packet.

Lesson PR:

- generated landing output only.

Merge order later: platform first, lesson second.
