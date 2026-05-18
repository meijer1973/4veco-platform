# references/authored/

Human-authored references that the platform still hand-edits. This is the **legacy bucket** — its size is a measure of how much of the platform's institutional knowledge remains in hand-maintained form. The long-term direction is to shrink this folder.

## Policy

- Hand-editing is allowed here (for now). Care is the author's responsibility; there is no machine-enforced integrity.
- Every file in this folder is a candidate for migration:
  - To `external/` if an authoritative outside source exists that we can fetch/extract from.
  - To `machine/` if a machine-editing pipeline (CLI + validator) can be built to replace manual maintenance.
- When a file graduates, update the plan (`knowledge/micro-teaching-units-plan.md`) and move the file.

## Initial contents

| File | Long-term path |
|---|---|
| `economie-terminologie.md` | **Migration started 2026-04-22.** Initial `machine/begrippen.{md,json}` seeded from this file (empty definitions). Still read by `build-unit-index.js` as a fallback canonical-term source during the editorial fill-in phase. Retire when ≥ 80% of `begrippen.json` entries have `definition_nl` filled and all skill references have been rerouted to `begrippen.md`. |
| `vraagtypen-en-opgaveontwerp.md` | `machine/` eventually |
| `skill-categories.md` | partly absorbed into `vraagtypen-en-opgaveontwerp.md` and `micro-teaching-units.md`; may be deprecated |
| `economic_mathematical_precision_reference.md` | likely stays `authored/` (expert precision judgement) |
| `didactiek-principes.md` | likely stays `authored/` (pedagogical philosophy) |
| `course-target-exercises.json` | Active authored target-exercise registry; currently v5. Long-term path is `machine/` once target exercises become first-class machine-edited entries. |
| `archive/course-target-exercises-v4.json` | Historical v4 registry archive retained for evidence anchors and migration traceability. |

## What belongs here vs. elsewhere

- **Move to `external/`** when the content is a summary/mirror of an outside authority and a refresh script can replace manual updates.
- **Move to `machine/`** when the content has mechanically checkable invariants (refs, cycles, coverage) and an edit CLI makes hand-editing unnecessary.
- **Leave here** when the content is narrative expert judgement that doesn't reduce to mechanical constraints.

## Why a separate bucket

Progress toward "fewer things humans must maintain by hand" becomes visible: `ls` on this folder is the current human-in-the-loop surface.
