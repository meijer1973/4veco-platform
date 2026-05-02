# Sprint RX.5: Representation Operation Registry And Reports

## Goal

Build the report bridge between the provisional S7 skill/operation overlay, RX representation-sensitive unit mutations, and PV pilot links.

RX.5 must make current operation coverage inspectable without promoting any operation records into `references/machine/`.

## Context

S7 created `references/data/skill-operation-registry.json` as a governed overlay. CP-4 closed as `pass_with_conditions`: `exercise_operations` remain provisional, `required_skills` remains legacy/source-only, and no machine operation or skill-tag registry is authorized.

RX.2, RX.2b, RX.3a, RX.3b, and RX.4 then added representation-sensitive A-domain units through `unit-add.js`. The S7 overlay still preserves the older source statuses for several now-live units, so RX.5 should report those stale/live differences rather than silently rewriting governance history.

PV.3 and PV.4 added pilot procedure templates and procedure-game alignment. RX.5 should show which representation operations have PV links and which remain generator-blocked.

## Allowed paths

- `docs/sprints/RX.5-plan.md`
- `references/data/sprints/RX.5.plan.json`
- `reports/sprints/RX.5-baseline.md`
- `build-scripts/references/build-representation-operation-coverage.js`
- `build-scripts/references/check-representation-operation-coverage.js`
- `reports/json/representation-operation-coverage.json`
- `reports/representation-operation-coverage.md`
- `reports/markdown/representation-operation-coverage.md`
- `reports/json/graph-skill-tree.json`
- `reports/graph-skill-tree.md`
- `reports/markdown/graph-skill-tree.md`
- `reports/json/representation-transfer-gaps.json`
- `reports/representation-transfer-gaps.md`
- `reports/markdown/representation-transfer-gaps.md`
- `reports/review-gates/GATE-RX5-representation-operation-reports/review-packet.json`
- `reports/review-gates/GATE-RX5-representation-operation-reports/review-packet.md`
- `reports/review-gates/GATE-RX5-representation-operation-reports/technical-closure.json`
- `reports/review-gates/GATE-RX5-representation-operation-reports/technical-closure.md`
- `reports/review-gates/GATE-RX5-representation-operation-reports/bundle-urls.md`
- `reports/url-index.md`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.32-pv4-procedure-game-contract.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `reports/sprints/RX.5-result.md`
- `reports/sprints/RX.5-diff-summary.md`
- `references/data/sprints/RX.5.result.json`

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- creation of `references/machine/exercise-operations.json`
- creation of `references/machine/skill-tags.json`
- creation of `references/machine/representation-operations.json`
- creation of `references/machine/procedure-templates.json`
- creation of `references/machine/visual-states.json`
- mutation of authored source files or RAG chunks
- lesson repo commits or generated lesson target edits
- operation ID promotion to governed machine authority
- bulk exercise metadata backfill
- student-facing skill-tree publication from generator-blocked units
- student diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative decisions
- student-facing PV projection

## Inputs

- `references/data/skill-operation-registry.json`
- `references/data/sprints/RX.1-representation-operation-inventory.json`
- `references/machine/micro-teaching-units.json`
- `references/data/procedure-visual/procedure-templates.json`
- `references/data/procedure-visual/visual-states.json`
- `references/data/procedure-visual/unit-template-links.json`
- generator-blocked sprint/gate JSON files
- `engines/skilltree/generators.js`
- `references/reference-team-roadmap.md`

## Outputs

- A read-only representation-operation coverage report.
- A graph skill-tree report that lists graphical A-domain units, dependencies, operation links, PV links, and generator-block state.
- A representation-transfer gap report with proof-to-close fields.
- A technical RX.5 gate packet and closure for the report contract.
- Updated roadmap/version index moving RX.5 to completed and PV.5 to the top open sprint.

## Operationalized sprint procedure

1. Record this plan and baseline before marking RX.5 complete.
2. Build a read-only report script that reads S7, RX.1, live units, PV links, generator implementations, and generator-block records.
3. Emit JSON and Markdown reports that distinguish live units, candidate/held records, stale S7 source statuses, generator-blocked live units, missing PV templates, and diagnostic transfer gaps.
4. Add a checker that verifies the RX.5 reports preserve CP-4/RX/PV boundaries: no machine registries, no student-facing use, held A71/A80/A81, live A61/A62/A63/A64/A65/A68/A69/A73/A75/A76/A77/A78/A79/A82/A83/A84, and explicit generator blocks.
5. Emit a technical report gate bundle for `GATE-RX5-representation-operation-reports`.
6. Update the roadmap and version index only after the builder/checker and sprint bundle validators pass.
7. Stop if the work would require operation-registry promotion, machine-reference mutation, external-source mutation, authored-source mutation, RAG chunk patching, lesson-side edits, or student-facing publication.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/RX.5-plan.md
node build-scripts/references/build-representation-operation-coverage.js
node build-scripts/references/check-representation-operation-coverage.js
node build-scripts/references/validate-procedure-visual-registry.js
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-RX5-representation-operation-reports
node build-scripts/sprints/check-bundle-urls.js GATE-RX5-representation-operation-reports
node build-scripts/sprints/check-sprint-bundle.js RX.5
node build-scripts/sprints/check-sprint-result.js reports/sprints/RX.5-result.md
node build-scripts/sprints/check-sprint-bundle.js RX.5 --complete
node build-scripts/references/check-roadmap-version-index.js
```

## Rollback plan

Revert the RX.5 commit. That removes the read-only report builder/checker, generated coverage/gap reports, technical gate artifacts, sprint records, roadmap archive/version update, and URL-index update.

No protected reference data rollback is needed because RX.5 must not mutate `references/machine/` or `references/external/`.

## Human review required

No formal human review is required for RX.5 because it is a report-only technical gate. Human review remains required before any operation registry promotion, machine registry creation, bulk backfill, generator/publication exposure, or student-facing PV use.
