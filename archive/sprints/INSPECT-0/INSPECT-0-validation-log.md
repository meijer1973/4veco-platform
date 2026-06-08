# INSPECT-0 Validation Log

Status: completed
Date: 2026-06-08

## Scope Validated

This validation log covers the INSPECT-0 research/data outputs:

- `references/data/inspection-standards/source-register.json`
- `references/data/inspection-standards/nl-vo-evidence-profile.v0.json`
- `docs/inspection-standards/nl-vo-evidence-model.md`
- `archive/sprints/INSPECT-0/INSPECT-0-sprint-plan.md`
- `archive/sprints/INSPECT-0/INSPECT-0-current-state-audit.md`

No generated lesson artifacts were edited.

## Manual Checks

- Source register uses official or primary sources where possible.
- Every source record includes jurisdiction, authority, source type, title, URL,
  retrieval date, status, scope, authority-boundary note, relevance note,
  citation policy, and notes.
- Non-inspection comparators are marked `non_inspection_comparator`.
- US sources are framed as accountability/standards comparators, not inspection
  sources.
- Germany and Spain include regionalisation warnings.
- Dutch profile includes safe and forbidden claims.
- Dutch profile preserves exercise-first source hierarchy.
- Dutch profile states school implementation boundaries.

## Commands Run

```bash
node -e "const fs=require('fs'); for (const p of ['references/data/inspection-standards/source-register.json','references/data/inspection-standards/nl-vo-evidence-profile.v0.json']) JSON.parse(fs.readFileSync(p,'utf8')); console.log('OK inspection JSON parse');"
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/emit-url-index.js --check
git diff --check
npm.cmd run check:agent-worktree-safety -- --check --task QS-20260608 --agent codex --require-prefix codex/
npm.cmd run check:agent-branch-safety
npm.cmd run check:platform
```

Actual broader JSON parse command also included the generated roadmap/dashboard
JSON surfaces:

```bash
node -e "const fs=require('fs'); for (const p of ['references/data/inspection-standards/source-register.json','references/data/inspection-standards/nl-vo-evidence-profile.v0.json','docs/roadmaps/roadmap-version-index.json','reports/github-agent-index-platform.json','reports/github-agent-index-lessen.json','reports/internal-dashboard/dashboard-data.json']) JSON.parse(fs.readFileSync(p,'utf8')); console.log('OK JSON parse');"
```

## Results

```text
OK JSON parse
OK roadmap version index: 148 entries
OK url-index: reports/url-index.md is current
git diff --check: passed
check:agent-worktree-safety: passed with expected dirty-worktree warning before commit
check:agent-branch-safety: passed with expected dirty-worktree warning before commit
check:platform: passed, 48 test suites passed, 6 skipped; 759 tests passed, 8 skipped
```

`check:platform` printed existing fixture warnings about intentionally invalid
test folders/assets, but Jest exited successfully.

## Not Run / Not Applicable

- No inspection-evidence validator exists or is authorised in this sprint.
- No schema validation exists or is authorised in this sprint.
- No generated lesson-output validation is applicable because lesson output was
  not changed.
