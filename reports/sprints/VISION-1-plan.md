# Sprint VISION-1: Strategic Product Vision Canonicalization

Generated: 2026-06-06

## Goal

Add a canonical strategic product vision layer for 4veco so future human
contributors and coding/review agents can make trade-offs from a stable,
machine-readable decision instrument. The sprint must preserve
`../4veco-lessen/specifications/product-end-state.md` as the operational
student-route end-state and
`../4veco-lessen/specifications/companion-core-specifications.md` as the
companion-surface baseline.

## Context

The current operational product end-state is strong: every paragraph gives the
student a visible route from current readiness to local target-equivalent proof
for the paragraph target exercise. The gap is strategic rather than
operational. The repositories do not yet fully encode the wider product
vision: where 4veco should outperform, where it must meet parity, how lean
open diffusion and no-account/local-storage constraints shape choices, why the
MTU tree and exercise-first design are a moat, and how the repository design
itself improves future agent reliability.

This is a specification/governance sprint. It creates and links strategic
vision files, adds a presence/schema/link checker, refreshes maps/indexes, and
records closure evidence. It does not generate lesson output and does not
authorize any new product-use claim.

## Quality Standard

Quality floor: the strategic vision must satisfy the requested specification
inside this governance scope. It must be crisp enough for sprint planning and
agent decomposition, not marketing copy. The vision must preserve the
operational product-end-state specification, keep the companion specification
intact, and name proof and follow-up requirements for future work. Rendered output
and student-facing lesson surfaces are explicitly out of scope here;
the student-facing quality proof for this sprint is link/schema validation and
review evidence that future rendered-output proof remains required before
product claims. Missing implementation work must be named as future sprint
work, blocker, or waiver.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Strategic vision is canonical but separate from operational end-state. | `../4veco-lessen/specifications/product-vision.md`, relationship note in `product-end-state.md`, links in repo maps. | Checker verifies files and links; lead review checks no end-state weakening. | planned |
| Machine-readable vision exists with stable keys. | `../4veco-lessen/specifications/product-vision.json`. | Checker parses JSON and validates required keys. | planned |
| Trade-off logic covers moat, parity, efficiency, understandability, motivation, diffusion, agent reliability, and boundary rules. | Vision sections and JSON pillars/constraints. | Planning review and lead review inspect decision-instrument usefulness. | planned |
| Key platform and lesson docs route agents to the vision. | Updates to AGENTS, BUILD-PARAGRAPH, AGENT_GITHUB_ENTRY, RESEARCH_AGENT_MAP, and roadmaps. | Checker verifies required docs mention `product-vision.md`. | planned |
| No generated output or new authority is created. | Roadmap/result boundary notes and clean forbidden-surface diffs. | Scope-language, diff checks, lead review, and data-integrity notes. | planned |

## Quality Improvement Candidates

| Candidate | Classification | Disposition |
|---|---|---|
| Add a lightweight product-vision link/schema checker. | include_now | Needed so the strategic layer is not prose-only. |
| Add future sprint checklist keys to the JSON companion. | include_now | Directly improves future agent planning reliability without scope drift. |
| Rewrite all existing sprint plans to cite the new vision. | defer_named_follow_up | Future non-trivial sprint plans should cite it; historical plans stay audit-stable. |
| Add generated lesson output, route UI, diagnostics, mastery, sequencing, or Scale Gate authority. | reject_scope_creep | This sprint is governance-only and cannot authorize product-use claims. |

## Allowed paths

- `../4veco-lessen/specifications/product-vision.md`
- `../4veco-lessen/specifications/product-vision.json`
- `../4veco-lessen/AGENTS.md`
- `../4veco-lessen/AGENT_GITHUB_ENTRY.md`
- `../4veco-lessen/RESEARCH_AGENT_MAP.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `AGENTS.md`
- `AGENT_GITHUB_ENTRY.md`
- `RESEARCH_AGENT_MAP.md`
- `BUILD-PARAGRAPH.md`
- `build-scripts/README.md` if the checker or map refresh needs it
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `build-scripts/sprints/check-product-vision-links.js`
- sprint records and metadata for `VISION-1`
- command logs for `VISION-1`
- generated repository-map, URL-index, and dashboard artifacts

## Forbidden paths

- No generated Book 1 lesson output or paragraph artifacts.
- No engine implementation.
- No source-data writes.
- No `references/machine/` or `references/external/` edits.
- No target-exercise registry writes.
- No generated companion HTML/PDF/DOCX/PPTX production.
- No diagnostics, adaptive routing, mastery/sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, Scale Gate 1,
  product-wide use, or broad scaling authority.

## Inputs

- `RESEARCH_AGENT_MAP.md`
- `AGENTS.md`
- `BUILD-PARAGRAPH.md`
- `references/reference-team-roadmap.md`
- `reports/sprints/SYNC-PRODUCT-1-result.md`
- `reports/sprints/SYNC-PRODUCT-1-baseline.md`
- `../4veco-lessen/RESEARCH_AGENT_MAP.md`
- `../4veco-lessen/AGENTS.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `../4veco-lessen/lessen-team-roadmap.md`

## Outputs

- New strategic vision files:
  - `../4veco-lessen/specifications/product-vision.md`
  - `../4veco-lessen/specifications/product-vision.json`
- Updated platform and lesson entry points that link the vision.
- Updated platform and lesson roadmaps with `VISION-1` as a
  specification/governance sprint.
- New checker: `build-scripts/sprints/check-product-vision-links.js`.
- Sprint records:
  - `reports/sprints/VISION-1-plan.md`
  - `reports/sprints/VISION-1-baseline.md`
  - `reports/sprints/VISION-1-planning-review.md`
  - `reports/sprints/VISION-1-result.md`
  - `reports/sprints/VISION-1-diff-summary.md`
  - `reports/sprints/VISION-1-lead-review-assignment.md`
  - `reports/sprints/VISION-1-lead-review-round1.md`
  - `reports/sprints/VISION-1-lead-review-corrections.md`
  - `reports/sprints/VISION-1-lead-review-round2.md`
  - `reports/sprints/VISION-1-verification-review.md`
  - `reports/sprints/VISION-1-command-log.jsonl`
  - `reports/sprints/VISION-1-command-log.md`
  - `references/data/sprints/VISION-1.plan.json`
  - `references/data/sprints/VISION-1.result.json`

## Operationalized sprint procedure

1. Record this plan, baseline, and metadata; add current `VISION-1` roadmap
   ledger rows so the planned bundle checker can run.
2. Run a planning-review subagent before implementation edits. Stop and revise
   the plan if the review finds missing generated-output statements, weak
   quality floor, missing stop conditions, or omitted requested files.
3. Add the new strategic vision Markdown and JSON in `4veco-lessen`, preserving
   the operational end-state and companion specification as separate authority.
4. Update the named platform and lesson entry points to link the vision and
   state its relationship to product-end-state and companion specs.
5. Add the lightweight checker and run it before broader validators. Stop if
   any required file, JSON key, or required link is absent.
6. Refresh maps/indexes and dashboards only after the source docs and checker
   are stable.
7. Run wrapped acceptance commands and record command-log evidence for every
   passed result claim.
8. Run structural lead-review round 1. Apply corrections or record that no
   blockers were found, then run round 2 against the final closure bundle.
9. Fetch/prune both remotes, resolve/report behind or diverged state, commit
   and push both changed repos, and report hashes plus validation results.

Stop conditions:

- Stop if the vision duplicates or weakens `product-end-state.md`.
- Stop if validation shows any required link or JSON key missing.
- Stop if generated lesson output, protected reference data, source data, or
  unauthorized product authority appears in the diff.
- Stop if lead review returns REVISE, FAIL, or PAUSE until corrections are
  complete.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/VISION-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js VISION-1
node build-scripts/sprints/check-product-vision-links.js
npm.cmd run check:scope-language
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/check-sprint-command-log.js VISION-1
node build-scripts/sprints/check-lead-review-substance.js VISION-1
node build-scripts/sprints/check-sprint-result.js reports/sprints/VISION-1-result.md
node build-scripts/sprints/check-sprint-bundle.js VISION-1 --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

Proof required to close: `product-vision.md` and `product-vision.json` exist,
the JSON parses with required stable keys, all named entry docs mention the
vision, the checker passes, both roadmaps record `VISION-1`, command-log
evidence covers all passed result acceptance tests, lead-review round 2 returns
PASS or PASS WITH FLAGS, and diff checks show no generated lesson output,
protected reference mutation, or unauthorized product authority.

## Rollback plan

Before commit, revert only the `VISION-1` vision/spec/link/checker/sprint
artifact/index changes. After commit, revert the platform and lesson commits
together so cross-repo vision links remain aligned.

## Human review required

No new human review gate is required for this governance sprint. The user
explicitly requested the strategic vision layer and specified the intended
content and boundaries. Future changes to the canonical strategic vision
should happen only by explicit human review.
