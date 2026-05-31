# Sprint SKILLMAP-OP-1: Baseline

Generated: 2026-05-31

## Plan reference

Plan: `reports/sprints/SKILLMAP-OP-1-plan.md`

## Roadmap authority

`references/reference-team-roadmap.md` and
`../4veco-lessen/lessen-team-roadmap.md` both mark `SKILLMAP-OP-1` as the
active next sprint after `ENGINE-OP-1`.

The active row requires the shared skill-map runtime contract to become a
visible student route. For each practice mode, the student must see only the
relevant skill subset, the recommended next skill, current paragraph target,
route progress, and practice link without internal MTU codes. Desktop/mobile,
light/dark, keyboard/focus order, and student-experience clarity must be
validated.

## Product specification baseline

`../4veco-lessen/specifications/product-end-state.md` defines the end-state
route as visible progress from current readiness to local target-equivalent
proof. It says the shared skill-map/route layer must show the relevant skill
subset, current paragraph target, recommended next skill, local practice
progress, and next practice link without exposing internal MTU or operation
codes.

`../4veco-lessen/specifications/companion-core-specifications.md` says the
shared skill-map layer is the common progression, filtering,
recommendation, and route-display layer used by games, landing route previews,
and checkpoints where appropriate. It must support scoped reasoning,
calculation/procedure, graphical, and explicit mixed contexts; hide or collapse
the full catalog by default; show local practice progress without mastery
claims; expose student-facing labels; and preserve keyboard, mobile, and
light/dark usability expectations.

## ENGINE-OP-1 carry-in findings

`reports/sprints/ENGINE-OP-1-operational-audit.md` closed the audit with
these route blockers:

- `1.1.2` Redeneren and Grafieken route panels are empty.
- `1.1.1` Redeneren route is mis-scoped toward unrelated calculation/graph
  skills.
- `1.1.2` math practice is restored and scoped, but not visibly unified with
  the shared route panel.
- `1.1.3` graph practice is the strongest current route, but still uses
  engine-specific task UI and must not be treated as target-equivalent proof.
- Generated output does not yet use the GAME-UX-3A task shell.

## Current implementation baseline

- `engines/skill-map-engine.js` builds route view models from
  `elements.SKILLS`.
- `engines/skill-map-route-ui.js` renders the route panel and reads
  `SKILL_TREE_ELEMENTS` plus `SKILL_TREE_DATA`.
- `engines/skilltree/base-elements.js` exposes `SKILL_TREE_ELEMENTS.SKILLS`
  as generator-backed, non-deprecated A-domain units only.
- `engines/reasoning-ui.js`, `engines/graphical-ui.js`, and
  `engines/procedure-ui.js` render shared route panels, but currently pass only
  generic mode/max-visible options.
- `build-scripts/platform/build-skilltree-shells.js` includes
  `skill-map-engine.js`, but the math `wiskundevaardigheden.html` shell does
  not load `skill-map-route-ui.js` or render a shared route panel.
- The Book 1 deploy manifest currently sets:
  - `1.1.1` skilltree skills to `null`, which leads route display toward the
    broad A-domain catalog when no explicit route scope exists.
  - `1.1.2` active skills to `A38` and `A39`, so reasoning/graphical route
    aspect filters have no visible skills unless an explicit route scope is
    provided.
  - `1.1.3` active skills to `A61`, `A62`, `A63`, `A38`, and `A39`, which is
    enough for the current graph route but not a formal per-surface route
    contract.

## Data integrity notes

Protected reference data must remain unchanged. This sprint may not hand-edit
`references/machine/` or `references/external/`, may not write
`references/authored/course-target-exercises.json`, may not create or write
`references/data/exam-ingestion/answer-skill-candidates.json`, and may not
mint, update, split, or deprecate MTUs.

The Book 1 `deploy-config.json` is treated as target deploy manifest/source
configuration for route scopes. Generated Book 1 automated output may change
only after platform deploy/build commands, never by hand-patching HTML, CSS,
JS, or data files.

No target-equivalent proof, diagnostics, adaptive routing, mastery/sequencing,
student-facing AI, summative use, PV projection, PV machine promotion, Scale
Gate 1, or student/product use is authorized by this sprint.

## Initial stop conditions

- Stop if a populated `1.1.1` conceptual route requires changing protected
  references instead of adding route-display catalog support.
- Stop if a route panel can only be fixed by exposing internal MTU IDs to
  students.
- Stop if a generated output diff is produced by hand edits instead of
  platform deploy/build commands.
- Stop if route progress copy implies mastery, diagnostic classification,
  grade, summative pass/fail, automatic sequencing, PV, AI, or
  target-equivalent proof.
