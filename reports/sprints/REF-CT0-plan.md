# Sprint REF-CT0: Three-Year Prototype Normalisation And MTU Classification

## Goal

Convert `knowledge/three Year blue print.md` into an explicitly non-authoritative, v5-aware planning prototype and classify candidate units or paragraphs for later review.

REF-CT0 is a foundation-hardening sprint. It prepares the ground for REF-CT1 and CP-6; it does not mutate protected reference data, mint units, promote target exercises, or authorize production scaling.

## Context

The active roadmap places `REF-CT0` before `REF-CT1`. The current active curriculum-source baseline is `references/owned/course-blueprint-v5.md` with four count-bearing books of 12, 12, 14, and 16 paragraphs. The active target-exercise registry is `references/authored/course-target-exercises.json`; it has 54 count-bearing v5 records, including migrated records and explicit placeholders that still need review before final curriculum-quality claims.

`knowledge/three Year blue print.md` is rough concept scaffolding. It contains useful sequencing ideas, but it predates the current v5 baseline in important places: it references the old 49-record target-exercise count, proposes unit IDs that are no longer safe to reuse as facts, and treats D04 as unresolved even though S9a has already retired D04 through CLI-only mutation. This sprint normalizes that rough input into reviewable planning artifacts without promoting it into `references/owned/` or `references/machine/`.

The evidence order remains:

1. real CvTE exam questions and reviewed extracted evidence
2. authored target exercises and built platform exercises
3. consolidation exercises
4. syllabus grouping
5. owned blueprint prose, rough planning notes, and generated reports as weaker context

Generated reports are diagnostics, not primary authority.

## Allowed paths

- `reports/sprints/REF-CT0-plan.md`
- `references/data/sprints/REF-CT0.plan.json`
- `references/data/sprints/REF-CT0.result.json`
- `references/data/sprints/REF-CT0-mtu-classification.json`
- `reports/sprints/REF-CT0-baseline.md`
- `reports/sprints/REF-CT0-result.md`
- `reports/sprints/REF-CT0-diff-summary.md`
- `reports/sprints/REF-CT0-lead-review-assignment.md`
- `reports/sprints/REF-CT0-lead-review-round1.md`
- `reports/sprints/REF-CT0-lead-review-corrections.md`
- `reports/sprints/REF-CT0-lead-review-round2.md`
- `reports/reference-planning/REF-CT0-source-authority-boundary.md`
- `reports/reference-planning/REF-CT0-three-year-prototype.md`
- `reports/reference-planning/REF-CT0-mtu-classification.md`
- `reports/reference-planning/REF-CT0-candidate-review-packet.md`
- `build-scripts/references/build-ref-ct0-planning-artifacts.js`
- `build-scripts/references/check-ref-ct0-planning-artifacts.js`
- `build-scripts/sprints/check-sprint-bundle.js` only to support the official `REF-CT0` sprint id shape
- generated reports and indexes when regenerated through normal scripts
- `references/reference-team-roadmap.md` for sprint bookkeeping after completion
- `docs/roadmaps/outdated/reference-team-roadmap-v2.45-post-l16-foundation-hardening.md` if the roadmap is versioned at closure
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- promotion of `knowledge/three Year blue print.md` into `references/owned/`
- direct mutation of `references/authored/course-target-exercises.json`
- direct mutation of any lesson output in `../4veco-lessen/`
- creation of new machine registries or PV machine registries
- RAG chunk hand-patching
- any student-facing generated output
- diagnostics, adaptive routing, mastery decisions, automatic sequencing, student-facing AI, summative use, PV projection, or PV machine promotion

## Inputs

- `references/reference-team-roadmap.md`
- `references/SOURCE_OF_TRUTH.md`
- `references/owned/course-blueprint-v5.md`
- `references/owned/course-blueprint-v5.meta.json`
- `references/authored/course-target-exercises.json`
- `references/authored/archive/course-target-exercises-v4.json`
- `references/machine/micro-teaching-units.json` as read-only input
- `references/machine/begrippen.json` as read-only input
- `knowledge/three Year blue print.md`
- `reports/json/blueprint-flag-triage.json`
- `reports/json/needs-coverage.json`
- `reports/json/terms-coverage.json`
- `reports/json/exam-question-extraction-gaps.json`
- `reports/json/reference-health.json`
- recent sprint outputs from `S9a` and `SYNC-1`

## Outputs

- SPRINT bundle under `reports/sprints/`: plan, baseline, result, diff summary, lead-review assignment, round-1 lead-review log, corrections log, round-2 lead-review log, plus metadata under `references/data/sprints/`.
- A source/authority boundary note that states what the prototype may and may not be used for.
- A non-authoritative v5-aware three-year planning prototype.
- An MTU classification table with these categories: `year_1_confirmed`, `year_1_backfill_candidate`, `year_2_skeleton_candidate`, `year_3_skeleton_candidate`, `duplicate_merge_split_candidate`, `parked`, and `needs_evidence`.
- A candidate-review packet for REF-CT1 and later MTU or target-exercise work.
- A JSON mirror of the classification with authority metadata and source paths.
- A reproducible report-side artifact builder with a HOW TO ADAPT header.
- A read-only validator for the REF-CT0 planning artifacts.

## Operationalized sprint procedure

1. Record this plan, plan JSON, and baseline before deriving the prototype. Stop if the roadmap row for `REF-CT0` is missing or if the active v5 target-exercise validator does not pass.
2. Patch sprint bundle tooling only if required to recognize the official `REF-CT0` id. Do not broaden the checker beyond the roadmap's sprint naming need.
3. Define the authority boundary in a standalone artifact before classification. Stop if the boundary does not clearly say that the prototype is non-authoritative planning context, not curriculum source of truth.
4. Normalize the rough blueprint against v5. Replace old v4 assumptions with the active 12/12/14/16 book model and record rough-source drift, including the 49-record claim, unsafe proposed ID assumptions, and stale D04 treatment.
5. Build the classification table from current target exercises, live machine units as read-only facts, existing blueprint-flag triage diagnostics, and rough blueprint suggestions as weak hints. Use categories as follows:
   - `year_1_confirmed`: live unit is already required, introduced, or explicitly assumed by an active v5 count-bearing target-exercise record.
   - `year_1_backfill_candidate`: target-exercise-backed missing flag or rough candidate that points to a Year 1 foundation gap and needs later review before CLI mutation.
   - `year_2_skeleton_candidate`: live unit or candidate concept that fits the later finance, risk, information, cooperation, public goods, growth, redistribution, or public-finance skeleton, but has no final v5 target exercise yet.
   - `year_3_skeleton_candidate`: live unit or candidate concept that fits macro policy, monetary policy, open economy, integrated policy, or final exam training, but has no final v5 target exercise yet.
   - `duplicate_merge_split_candidate`: live unit or candidate whose scope overlaps another unit or rough proposal and needs a human design decision before placement.
   - `parked`: rough proposal or source concept intentionally out of v5 print scope or unsuitable for immediate sequencing.
   - `needs_evidence`: candidate cannot be placed because exercise or exam evidence is too thin, stale, or ambiguous.
6. Produce the candidate-review packet. It must tell REF-CT1 exactly what to review first, especially Year 1 confirmed coverage, backfill candidates, placeholders, stale rough-source assumptions, and blocked mutation lanes.
7. Add or run the read-only REF-CT0 validator. Stop if any artifact promotes the prototype to owned/machine authority, claims placeholder records are reviewed final, omits required categories, or implies protected mutation.
8. Run the acceptance tests, regenerate normal reports/indexes when needed, and record result/diff artifacts.
9. Assign the completed sprint bundle to the lead reviewer agent. Log the round-1 review in `reports/sprints/REF-CT0-lead-review-round1.md`.
10. Apply the required corrections or record explicitly that no correction was needed. Log the correction pass in `reports/sprints/REF-CT0-lead-review-corrections.md`.
11. Send the corrected bundle back to the lead reviewer for one recheck. Log the round-2 review in `reports/sprints/REF-CT0-lead-review-round2.md`. Stop and report back if the recheck verdict is not `PASS` or `PASS WITH FLAGS`.
12. Mark REF-CT0 complete in the roadmap only after the complete sprint bundle, REF-CT0 validator, and lead-review cycle pass. Move REF-CT1 to the active top ledger row, preserve all product-use blocks, refresh maps and indexes, fetch/prune remote, commit, push, and report the pushed hash.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/REF-CT0-plan.md
node build-scripts/sprints/check-sprint-bundle.js REF-CT0
node scripts/check-course-target-exercises-v5.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/reports/validate-report-json.js
node build-scripts/references/build-ref-ct0-planning-artifacts.js
node build-scripts/references/check-ref-ct0-planning-artifacts.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/sprints/check-sprint-result.js reports/sprints/REF-CT0-result.md
node build-scripts/sprints/check-sprint-bundle.js REF-CT0 --complete
```

## Rollback plan

Revert the REF-CT0 implementation commit. Because REF-CT0 is non-mutating, rollback should remove only sprint artifacts, planning reports, the read-only validator, generated report/index churn, and roadmap bookkeeping. Do not manually patch `references/machine/` or `references/external/` during rollback.

If the sprint bundle tooling id-pattern update causes an unexpected regression, revert that single checker change and stop for a sprint-tooling decision before continuing REF-CT0.

## Human review required

No new human review gate is required for REF-CT0 because it is a non-mutating planning and classification sprint.

The structural lead-review cycle is still required for sprint closure. It is an internal review/recheck procedure and does not replace a formal human review gate when one is required by a later mutation, promotion, or production sprint.

Human review becomes required before any later sprint uses REF-CT0 to mint units, edit target exercises, close CP-6, promote target-exercise records to `reviewed_final`, change the owned blueprint, change machine registries, or authorize any student-facing/product use.
