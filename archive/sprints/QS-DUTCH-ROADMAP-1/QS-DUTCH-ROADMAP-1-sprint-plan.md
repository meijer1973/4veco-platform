# QS-DUTCH-ROADMAP-1 Sprint Plan

Status: planning
Date: 2026-06-09
Branch: `codex/dutch-quality-scope-roadmap-20260609`
Base: `origin/main` at `226c42a9664f02e01d8eae286341e5f2f21c1508`
Roadmap: `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
Ledger: `docs/roadmaps/quality-standards/sprint-ledger.md`
Authorising record: `archive/sprints/QS-DUTCH-ROADMAP-1/QS-DUTCH-ROADMAP-1-human-decision.md`

## Purpose

QS-DUTCH-ROADMAP-1 resets the active quality-standards roadmap to Dutch scope
only. It removes international compatibility, common-quality, and country
overlay work from the active roadmap, and replaces the candidate next work with
a Dutch quality-control closure path.

This sprint is roadmap/governance work only. It does not generate new evidence
packs, mutate generated lesson output, integrate dashboards or gates, process
personal data, or make compliance/approval claims.

## Allowed Outputs

```text
archive/sprints/QS-DUTCH-ROADMAP-1/QS-DUTCH-ROADMAP-1-human-decision.md
archive/sprints/QS-DUTCH-ROADMAP-1/QS-DUTCH-ROADMAP-1-sprint-plan.md
archive/sprints/QS-DUTCH-ROADMAP-1/QS-DUTCH-ROADMAP-1-planning-review.md
archive/sprints/QS-DUTCH-ROADMAP-1/QS-DUTCH-ROADMAP-1-lead-review.md
archive/sprints/QS-DUTCH-ROADMAP-1/QS-DUTCH-ROADMAP-1-validation-log.md
archive/sprints/QS-DUTCH-ROADMAP-1/QS-DUTCH-ROADMAP-1-closure-log.md
docs/roadmaps/quality-standards/inspection-standards-roadmap.md
docs/roadmaps/quality-standards/sprint-ledger.md
docs/roadmaps/quality-standards/README.md
docs/roadmaps/quality-standards/quality-standards-end-state.md
references/data/inspection-standards/README.md
references/data/inspection-standards/nl-vo-evidence-profile.v0.json metadata/next-step update
generated reports/indexes required by changed roadmap surfaces
```

## Procedure

1. Confirm branch and clean worktree on a fresh `codex/` branch based on
   current `origin/main`.
2. Record the human decision and this sprint plan.
3. Have a planning/review agent check that the sprint is Dutch-only and
   documentation-only.
4. Rewrite the active roadmap so it:
   - has a Dutch-only purpose and endpoint;
   - keeps INSPECT-0 through INSPECT-7 as completed history;
   - removes active international/common-quality/country-overlay phases;
   - states that international work must happen later in a separate worktree
     and roadmap;
   - defines a Dutch-only next sequence, starting with Dutch Evidence Scale
     Readiness;
   - keeps all safe-claim, product/school, OP0, privacy, and competent
     authority boundaries.
5. Update the sprint ledger candidate future sprints to Dutch-only work.
6. Update README/end-state/data notes to avoid active international scope.
7. Refresh generated maps/reports if roadmap or review surfaces changed.
8. Validate:
   - JSON parse changed profile/source files;
   - `node build-scripts/references/check-roadmap-version-index.js`;
   - `node build-scripts/sprints/emit-url-index.js --check`;
   - `git diff --check`;
   - `npm.cmd run agent:index`;
   - `npm.cmd run dashboard:internal`;
   - clean worktree safety before push if committing.
9. Run lead review for closure readiness.
10. Record validation, lead review, closure log, and recommended next action.

## Acceptance Criteria

- Active roadmap is Dutch-only.
- Active candidate next work starts with Dutch evidence scale readiness.
- International work is removed from active phases and candidate sprints.
- International work is described only as future separate-worktree work, not
  as part of this roadmap.
- No source data is deleted merely to hide history; any existing non-Dutch
  source inventory is marked inactive/out-of-scope for this roadmap.
- Safe-claim and forbidden-claim boundaries remain intact.
- No new generated evidence packs, dashboards/gates, quality-ref/Scale Gate
  integration, lesson-output mutation, personal-data processing, or compliance
  claims are introduced.

## Stop Conditions

Stop and record the blocker if:

- removing international scope would require deleting historical source
  records needed for auditability;
- the roadmap cannot be made Dutch-only without weakening safe-claim,
  product/school, OP0, or privacy boundaries;
- validation fails in a way unrelated to documentation/index refresh;
- worktree contains unrelated user changes.

## Required Next Action

Have a planning/review agent check this plan. If it passes, rewrite the active
quality-standards roadmap to Dutch scope only and validate the result.
