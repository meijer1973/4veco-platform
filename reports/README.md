# reports/

Generated diagnostic reports for the 4veco platform. Every file in this folder is produced by a script under `build-scripts/reports/` and regenerated on each build. Hand-edits here are pointless — they will be overwritten.

## Report catalog

Reports land in this folder as they are built. Each report is a separate concern; generation is independent so a failure in one does not block the others.

### Unit registry integrity (fail CI on violation)

| Report | Purpose |
|---|---|
| `unresolved-refs.md` | Paragraph plans citing missing unit IDs |
| `terminology-drift.md` | Units using terms not in `economie-terminologie.md` |
| `dag-integrity.md` | Cycles, layer consistency, missing `needs` targets |

### Unit registry audit (informational)

| Report | Purpose |
|---|---|
| `exercise-coverage.md` | Per unit → exercises requiring it. **Primary exercise-first audit surface.** Zero-backed units are candidates for deprecation. |
| `dead-units.md` | Units defined but unused by any paragraph plan |
| `orphaned-builds.md` | Built outputs under `output/` with no live paragraph plan — pilot cleanup signal |
| `pilot-status.md` | Age of pilot paragraph plans — enforces the "pilots are ephemeral" policy |

### Exam alignment (the diagnostic lens)

These three reports make visible the drift between syllabus claims, real-exam reality, blueprint intent, and built materials.

| Report | Purpose |
|---|---|
| `exam-coverage.md` | Per eindterm → units teaching it → paragraphs citing those units |
| `exam-question-audit.md` | Per real havo/vwo exam question: required skills (unit IDs) + question type + cited eindtermen. Two-dimensional trace. |
| `exam-question-type-distribution.md` | Distribution of question types across real exams vs. platform materials. Under-served types surface. |
| `exam-vs-program-gaps.md` | Bidirectional: (a) eindtermen with no real-exam presence, (b) skills observed in exams without a clean eindterm link |
| `blueprint-vs-exam-gaps.md` | Skills in real exams not covered by blueprint target exercises, and blueprint targets not exercised in real exams |

### Yearly cadence

| Report | Cadence |
|---|---|
| `exam-program-delta.md` | Yearly — diff new CvTE syllabus extraction against prior snapshot |

---

## Generation

Every report has a corresponding generator at `build-scripts/reports/<report-name>.js`. Reports regenerate on every build; there is no caching.

Reports that fail CI are wired into the build's exit code. The others are diagnostic surfaces for review but do not block deploys.

## Why reports are not stored data

Reports are **derived views** over the unit registry + paragraph plans + exam papers. Storing them as source data would invite drift between the stored view and the underlying reality. By regenerating on every build, the report always reflects the current state — stale reports are impossible.

See `knowledge/micro-teaching-units-plan.md` §8 for the architectural rationale.
