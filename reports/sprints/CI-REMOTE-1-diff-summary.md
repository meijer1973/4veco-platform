# Sprint CI-REMOTE-1: Diff Summary

## Summary

This diff adds remote GitHub Actions CI for platform validation and records the
CI setup sprint evidence.

## Added Surfaces

- `.github/workflows/platform-ci.yml`
- `.github/ci-python-requirements.txt`
- `.gitattributes` with LF checkout policy for the generated URL index
- `reports/sprints/CI-REMOTE-1-*`
- `references/data/sprints/CI-REMOTE-1.plan.json`
- `references/data/sprints/CI-REMOTE-1.result.json`

## Roadmap and Index Updates

- Inserted and closed `CI-REMOTE-1` before `GATE-SHARED-TASK-INGEST-REPAIR-1`
  in `references/reference-team-roadmap.md`.
- Inserted and closed `CI-REMOTE-1` in
  `../4veco-lessen/lessen-team-roadmap.md`.
- Refreshed GitHub-facing indexes and internal dashboard through existing
  scripts.

## Protected surfaces

No protected surfaces were intentionally changed:

- `references/machine/`: unchanged
- `references/external/`: unchanged
- `source-data/`: unchanged
- generated Book 1 lesson output: unchanged
- target registries, candidate storage, PV outputs, and product route files:
  unchanged

## Validation

- Local sprint plan and bundle checks passed.
- Local platform Jest passed.
- Local scope-language, report JSON, roadmap version index, URL-index, and
  diff hygiene checks passed.
- Remote GitHub Actions run `26954512486` passed on current hardened workflow
  commit `9f6e5cbf645143bcf06de3bd2800e7cb226b6877`.
- Closure-maintenance run `26953928228` exposed a Windows CRLF checkout false
  failure for `reports/url-index.md`; `.gitattributes` and workflow
  normalization now force LF for that byte-checked generated report.
- Branch protection requires status-check context `validate-platform` and,
  after `CI-REMOTE-1A`, enforces admins/owners too.

## Follow-Up Boundary

The next authorized work is `GATE-SHARED-TASK-INGEST-REPAIR-1` human gate
preparation. This sprint does not authorize generated lesson output,
product-route adoption, target-equivalent proof, diagnostics,
mastery/sequencing, PV, Scale Gate 1, or student/product use.
