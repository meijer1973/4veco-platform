# Sprint EX-NS0: Result

## Plan reference

- Plan: `reports/sprints/EX-NS0-plan.md`
- Baseline: `reports/sprints/EX-NS0-baseline.md`
- Plan metadata: `references/data/sprints/EX-NS0.plan.json`
- Result metadata: `references/data/sprints/EX-NS0.result.json`

## Summary

EX-NS0 completed the cross-repo exam-ingestion north-star guidance update.

The platform now explicitly states that a future official CvTE exam question
must be ingestible with prompt, source annexes, official correction model, point
allocation, answer-construction requirements, operation decomposition, MTU
mapping, and lesson-build implications separately traceable.

The reference roadmap now adds EX-0 through EX-4 after CP.6e and before REF-CT3.
The lesson roadmap now adds L-EX0 and L-EX1 before L2.4-TEA. The lesson research
map now points active anchors to `course_blueprint_v5.md` and current Chapter
1.3 `Aanbod en marktevenwicht` paths.

No exam-ingestion overlays, schemas, protected mutations, or generated lesson
outputs were created or changed.

## Acceptance test results

Passed:

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/EX-NS0-plan.md
node build-scripts/sprints/check-sprint-bundle.js EX-NS0
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
npm.cmd run dashboard:internal
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/references/build-reference-inventory.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
git status --short -- references/machine references/external references/authored/course-target-exercises.json references/owned/course-blueprint-v5.md
node build-scripts/sprints/check-sprint-result.js reports/sprints/EX-NS0-result.md
node build-scripts/sprints/check-sprint-bundle.js EX-NS0 --complete
npm.cmd test -- --runInBand
```

One inventory hash mismatch appeared after `npm.cmd run dashboard:internal`
rewrote dashboard files. `node build-scripts/references/build-reference-inventory.js`
was rerun after the final dashboard refresh, and `check-source-manifest` plus
`check-document-inventory` then passed.

Full Jest also passed: 30 test suites passed, 6 skipped; 515 tests passed, 8
skipped. The validator fixture warnings printed during Jest are expected
negative-fixture output and the command exited 0.

## Changed files

Primary platform guidance:

- `AGENTS.md`
- `AGENT_GITHUB_ENTRY.md`
- `BUILD-PARAGRAPH.md`
- `RESEARCH_AGENT_MAP.md`
- `RESEARCH_AGENT_MAP_REFERENCES.md`
- `references/SOURCE_OF_TRUTH.md`
- `references/data/exercises/README.md`
- `references/reference-team-roadmap.md`

Roadmap/versioning:

- `docs/roadmaps/outdated/reference-team-roadmap-v2.54-cp6a-lesson-side-recheck.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`

Sprint bundle:

- `reports/sprints/EX-NS0-plan.md`
- `reports/sprints/EX-NS0-baseline.md`
- `reports/sprints/EX-NS0-result.md`
- `reports/sprints/EX-NS0-diff-summary.md`
- `reports/sprints/EX-NS0-lead-review-assignment.md`
- `reports/sprints/EX-NS0-lead-review-round1.md`
- `reports/sprints/EX-NS0-lead-review-corrections.md`
- `reports/sprints/EX-NS0-lead-review-round2.md`
- `references/data/sprints/EX-NS0.plan.json`
- `references/data/sprints/EX-NS0.result.json`

Lesson guidance:

- `../4veco-lessen/AGENTS.md`
- `../4veco-lessen/AGENT_GITHUB_ENTRY.md`
- `../4veco-lessen/RESEARCH_AGENT_MAP.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/archive/sprints/L-EXNS0/L-EXNS0-guidance-update-log.md`

Generated maps/reports:

- `reports/github-agent-index-*.md`
- `reports/github-agent-index-*.json`
- `reports/url-index.md`
- `reports/internal-dashboard/*`
- `reports/json/*`
- `reports/markdown/*`
- `references/data/source_manifest.json`
- `references/data/document_inventory.json`

## Data integrity notes

No protected reference data changed. `git status --short -- references/machine
references/external references/authored/course-target-exercises.json
references/owned/course-blueprint-v5.md` produced no output.

EX-NS0 did not mutate `references/machine/` or `references/external/`, did not
edit `references/authored/course-target-exercises.json`, did not edit
`references/owned/course-blueprint-v5.md`, did not create real exam-ingestion
overlays, did not mint units, did not promote target exercises, did not
finalize placeholders, did not close CP-6, and did not close Year 1.

The lesson-side changes were limited to guidance, roadmap, map, and archive-log
files. No generated lesson output was hand-patched.

## Open follow-ups

- Continue with `CP.6b Year-1 Target-Exercise Review`.
- Continue lesson-side `L1.7A` and `L2.0` foundation hardening.
- Run EX-0 only after CP.6b-CP.6e are handled or the roadmap explicitly
  authorizes the design sprint.
- Do not draft a CP-6 closure proposal from EX-NS0.

## Rollback instructions

Revert the platform and lesson commits for EX-NS0. Because this sprint is
guidance and roadmap work only, rollback removes guidance text, roadmap rows,
map updates, sprint logs, generated indexes/reports, and the archived v2.54
roadmap snapshot.

Do not manually patch `references/machine/`, `references/external/`,
`references/authored/course-target-exercises.json`,
`references/owned/course-blueprint-v5.md`, or generated lesson output during
rollback.
