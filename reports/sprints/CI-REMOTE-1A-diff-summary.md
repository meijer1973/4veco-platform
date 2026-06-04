# Sprint CI-REMOTE-1A: Diff Summary

## Summary

This diff records current-head CI proof and changes branch-protection
governance from owner-bypass to admin-enforced.

## Added Surfaces

- `reports/sprints/CI-REMOTE-1A-*`
- `references/data/sprints/CI-REMOTE-1A.plan.json`
- `references/data/sprints/CI-REMOTE-1A.result.json`
- `BATCH-CLOSURE-WAIVER.md`

## Updated Surfaces

- `reports/sprints/CI-REMOTE-1-result.md`
- `reports/sprints/CI-REMOTE-1-diff-summary.md`
- `references/data/sprints/CI-REMOTE-1.result.json`
- `references/reference-team-roadmap.md`
- repository maps, URL index, and internal dashboard

## Protected surfaces

No protected surfaces were intentionally changed:

- `references/machine/`: unchanged
- `references/external/`: unchanged
- `source-data/`: unchanged
- generated Book 1 lesson output: unchanged
- target registries, candidate storage, PV outputs, and product route files:
  unchanged

## Validation

- Current-head remote run `26954512486` passed on
  `9f6e5cbf645143bcf06de3bd2800e7cb226b6877`.
- Artifact `platform-ci-diagnostics`, id `7412612729`, exists.
- Branch protection now records `enforce_admins: true`.
- Local sprint result, lead-review, bundle, report JSON, roadmap index,
  URL-index, scope-language, and diff checks passed.

## Follow-Up Boundary

The next authorized work is `GATE-SHARED-TASK-INGEST-REPAIR-1` human gate
preparation, but its packet must cite passing CI for the reviewed commit or an
explicit waiver. This sprint does not authorize generated lesson output,
product-route adoption, target-equivalent proof, diagnostics,
mastery/sequencing, PV, Scale Gate 1, or student/product use.
