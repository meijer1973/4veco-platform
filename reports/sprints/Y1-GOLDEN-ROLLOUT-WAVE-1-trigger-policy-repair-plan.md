# Y1-GOLDEN-ROLLOUT-WAVE-1 Trigger Policy Repair Plan

Generated: 2026-08-24

## Authority references

- Product end-state:
  `../4veco-lessen/specifications/product-end-state.md`
- Companion specifications:
  `../4veco-lessen/specifications/companion-core-specifications.md`
- Original rollout plan:
  `docs/roadmaps/golden-workbench/golden-workbench-rollout-original-plan-20260612.md`
- Original sprint specification:
  `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-plan.md`
- Current gate packet:
  `reports/review-gates/GATE-Y1-GOLDEN-ROLLOUT-WAVE-1/review-packet.json`

## Objective

Repair the future-PR CI regression found in human review of platform PR #214.
Shared infrastructure files that were legitimately changed by the renewal must
remain allowed without activating the renewal-only fixed-path allowlist for
later unrelated work.

## Blocking finding

The current policy includes these shared paths in both `allowed_exact` and
`trigger_exact`:

- `.github/workflows/platform-ci.yml`
- `package.json`
- `build-scripts/sprints/emit-url-index.js`

In `auto` mode, any one of those paths currently activates the Y1 renewal
allowlist for the whole changed-path range. A future legitimate change combining
a shared path with a non-Y1 path can therefore fail required platform CI.

## Repair

1. Keep all three shared paths in `allowed_exact` so the historical PR #214
   payload remains valid.
2. Remove all three shared paths from `trigger_exact`.
3. Keep Y1-owned checker, test, wave, proof, packet, and sprint paths as renewal
   triggers.
4. Add policy regressions using the repository's actual wave policy:
   - every non-empty subset of the three shared paths, seven combinations in
     total, plus an unrelated future path does not trigger the renewal allowlist
     in `auto` mode and reports `scope_attestation_triggered:false`;
   - a Y1-specific checker path plus an unrelated future path does trigger and
     is rejected as mixed renewal scope;
   - the existing unrelated-only future-work regression remains passing.
5. Preserve full state, authority, rendered-input, route, roadmap, and wiring
   validation when renewal scope is not triggered.

## Evidence renewal

The policy and regression edits are substantive. After lead approval and local
validation:

1. Commit the repaired policy/tests as a new substantive payload.
2. Rebind the rendered delta proof, proof, packet, result, and lead evidence to
   that payload in an evidence-only commit.
3. Regenerate the internal dashboard and GitHub agent indexes in deterministic
   follow-up commits.
4. Refresh the PR description and active evidence with the focused and platform
   test totals observed after implementation; do not copy pre-repair totals.
5. Obtain renewed exact-head lead review, remote `validate-platform`, live
   branch-protection output, and PR Readiness Reviewer routing.
6. Mark ready only if the route is `READY_FOR_HUMAN_REVIEW`; do not merge without
   explicit owner authorization for the final exact head.

## Validation

```text
npm.cmd test -- --runInBand build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js
npm.cmd run check:y1-golden-rollout-wave-1 -- --event-mode pull_request --scope-mode auto --base b7ec603880bcd8cc98c93526121ca71d3f31edcd --head <exact-head> --lesson-base 071a465a03e287bc5768d88aabbec3e63b15ee09 --lesson-head 96c0970f45739a8758cf7e932c6bce77806cd68d
npm.cmd run check:platform
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/emit-url-index.js --check
npm.cmd run check:agent-index-freshness
npm.cmd run check:scope-language
git diff --check origin/main...HEAD
git -C ../4veco-lessen diff --check
```

## Authority boundary

This repair changes only guard activation and evidence. It does not authorize
rollout/adoption, automatic migration, completion language, diagnostics,
mastery/sequencing, adaptive routing, PV, summative use, broad product use, or
student/product use. It does not change exercise source, engine behavior,
generated lesson output, routes, screenshots, or target-readiness flags.

## Non-negotiable requirements

- Shared infrastructure paths remain allowed for this historical renewal but
  never activate its fixed-path allowlist by themselves or in combination.
- A Y1-owned trigger combined with any unrelated path remains rejected.
- Non-triggered ranges still run stable state, authority, rendered-input, route,
  roadmap, and wiring validation.
- Exact event base/head verification and committed changed-path comparison stay
  intact.
- The six-surface contract and commit-bound screenshot reuse remain unchanged.
- No missing core requirement may be carried under `PASS WITH FLAGS`.
- No product, rollout, completion, diagnostic, mastery, PV, summative, broad-use,
  or student-use authority is expanded.
- PR #214 remains draft until exact-head CI, lead review, live branch protection,
  and readiness routing all pass on the renewed head.

## Core-requirement checklist

| Requirement | Planned proof |
|---|---|
| Shared paths remain in `allowed_exact` | Direct policy assertion |
| Shared paths are absent from `trigger_exact` | Direct policy assertion |
| All seven shared-path subsets plus unrelated work remain non-triggering | Actual-policy regression loop and false-scope output |
| Y1-specific plus unrelated work is rejected | Actual-policy negative regression |
| Unrelated-only work still passes | Existing real-Git regression |
| Non-triggered full validation remains active | Existing full-mode state/rendered-drift regressions |
| Event and committed-path guarantees remain intact | Existing deletion, rename, event, synthetic-merge, and Unicode tests |
| Evidence and review are rebound to the new substantive payload | Cross-bound packet/proof/delta checks |
| Published test totals are current | Totals captured from post-repair focused and full runs |
| Authority holds remain intact | Packet/proof/result assertions and scope-language validation |
| Exact-head publication workflow is complete | Green CI, branch protection `ok:true`, lead verdict, and readiness decision |
