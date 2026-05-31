# Sprint GAME-ARCH-2: File-Level Disposition

Generated: 2026-05-31

## Decision Legend

| Decision | Meaning |
|---|---|
| KEEP | Stable shared or domain code that remains part of the architecture |
| WRAP | Existing engine code stays, but future work should make it a thin consumer of route/task APIs |
| DEPRECATE | Keep for compatibility or historical use, but not part of the intended route |
| REBUILD | Replace through later governed implementation if wrapping cannot remove drift |

No code change is authorized by this file.

## Shared Route And Task Shell

| File | Decision | Rationale | Follow-up owner |
|---|---|---|---|
| `engines/skill-map-engine.js` | KEEP | Owns route request normalization, aspect normalization, view-model construction, progress summary, warnings, and boundary flags. It is the shared route engine behind the route UI. | Harden route API, target-chain linkage, and local-only boundary tests. |
| `engines/skill-map-route-ui.js` | KEEP | Already renders scoped route panels with paragraph target, local progress, practice action, and local-only boundary text. | Harden route API, keyboard/focus proof, and target-chain linkage. |
| `engines/skill-map-route.css` | KEEP | Shared route panel styling belongs in one place. | Add future shared focus/spacing rules here when implementation is authorized. |
| `engines/task-shell-engine.js` | KEEP | Canonical validation/evaluation layer for common task families and blocked student-facing terms. | Extend only through reviewed task-family requests. |
| `engines/task-shell-ui.js` | KEEP | Canonical static renderer for shared task families and neutral feedback cards. | Keep default renderer; wrappers should not duplicate common input UI. |
| `engines/task-shell.css` | KEEP | Shared task styling should remain centralized. | Future implementation should align graph/math/reasoning feedback spacing and focus tokens here. |

## Graph/Table Route

| File | Decision | Rationale | Follow-up owner |
|---|---|---|---|
| `engines/graphical-engine.js` | KEEP | Strongest current domain module; derives task-shell graph/table tasks and evaluates through `TaskShellEngine`. | Refactor only where graph feedback/state duplicates shared shell behavior. |
| `engines/graphical-ui.js` | WRAP | Renders graph visuals and consumes task shell, but still owns wrapper feedback regions and next-button flow. | Keep graph visuals; move generic feedback grammar/focus rules toward shared shell conventions. |
| `engines/graphical.css` | WRAP | Contains graph-specific layout plus task/feedback styling. | Separate graph visual styling from generic feedback/task styling in later work. |
| `build-scripts/platform/build-graphical-shells.js` | KEEP | Correct shell generator for graph route and shared route/task-shell includes. | Keep as route consumer; no output generation in GAME-ARCH-2. |
| `build-scripts/content/book-1/b1-113-graphical-data.js` | KEEP | Current reference data builder for `1.1.3` graph/table task-shell route. | Use as reference pattern for target-operation coverage mapping. |
| `build-scripts/content/book-1/b1-112-graphical-data.js` | WRAP | Existing graph data path may remain useful but should use shared task conventions when active. | Align with graph task schema when touched. |

## Math/Calculation Route

| File | Decision | Rationale | Follow-up owner |
|---|---|---|---|
| `engines/skilltree-engine.js` | WRAP | Owns math exercise state and task-shell evaluation for A38/A39, but still carries star/progress concepts that need local-only language discipline. | Refactor around target-operation chain tasks and shared state ownership. |
| `engines/skilltree-ui.js` | WRAP | Renders shared task-shell steps but still owns generic step, feedback, result, next-action, and route UI. | Keep skill cards; move overlapping task/feedback UI to shared shell conventions. |
| `engines/skilltree.css` | WRAP | Includes math UI plus generic exercise and feedback styles. | Align common task/focus/feedback tokens with shared shell. |
| `engines/skilltree-ui.legacy.js` | DEPRECATE | Legacy UI path should not guide future unified experience work. | Keep only for compatibility unless later cleanup removes it. |
| `engines/skilltree/base-elements.js` | KEEP | Source of shared skill catalog and generator-backed task-shell steps. | Future answer-form units remain generator-blocked until separately authorized. |
| `engines/skilltree/generators.js` | WRAP | Generates task content; should emit task-shell-compatible data when interactions overlap. | Align generated tasks with task-shell API. |
| `engines/skilltree/explanations.js` | KEEP | Student explanations remain domain content, not generic task UI. | Ensure terminology and procedure continuity in later content work. |
| `build-scripts/platform/build-skilltree-shells.js` | KEEP | Emits skilltree shells, route config, and shared script includes. | Keep as route/task-shell consumer. |

## Reasoning Route

| File | Decision | Rationale | Follow-up owner |
|---|---|---|---|
| `engines/reasoning-engine.js` | WRAP | Supports structured reasoning through task shell, but answer-form quality and self-check boundaries need a clearer contract. | Refactor around answer-form MTUs and constructed-response standards. |
| `engines/reasoning-ui.js` | WRAP | Consumes route panel and task shell, but still owns several feedback grammars and progress summaries. | Centralize common feedback grammar; keep reasoning-chain displays as domain-specific. |
| `engines/reasoning.css` | WRAP | Contains reasoning-specific styling plus feedback/state styling. | Separate reasoning visuals from common task/feedback tokens later. |
| `build-scripts/platform/build-reasoning-engine.js` | KEEP | Generates reasoning shells with route/task includes. | Keep as route/task-shell consumer. |
| `build-scripts/platform/build-reasoning-questions.js` | WRAP | CSV-to-data builder should emit task-shell-compatible structured reasoning where used. | Align data export with route/task API during next reasoning refactor. |
| `source-data/book-1/reasoning/1.1.1.csv` | KEEP | Active Book 1 reasoning source. | Continue to treat as data source, not UI logic. |
| `source-data/book-1/reasoning/1.1.2.csv` | KEEP | Active Book 1 reasoning source. | Continue to treat as data source, not UI logic. |
| `source-data/book-1/reasoning/README.md` | KEEP | Documents active reasoning source path. | Update only if data contract changes in later sprint. |

## Checkpoint And Short Check

| File | Decision | Rationale | Follow-up owner |
|---|---|---|---|
| `engines/exit-ticket-engine.js` | WRAP | Has metadata guardrails and task-shell delegation, but must support advisory short check and future target-equivalent composition as separate modes. | Define two-mode checkpoint composition before `L1.7B-Q2`. |
| `engines/exit-ticket-ui.js` | WRAP | Renders task-shell and legacy checkpoint tasks, but feedback/advice copy needs the new advisory/proof boundary. | Refactor copy/state only after architecture gate. |
| `engines/exit-ticket.css` | WRAP | Useful checkpoint styling, but should align with shared task/focus/feedback CSS. | Keep until checkpoint refactor. |
| `build-scripts/platform/build-exit-ticket-shells.js` | KEEP | Correct shell generator for checkpoint pages and route includes. | Do not publish new target-equivalent pages from GAME-ARCH-2. |
| `source-data/book-1/exit-ticket/1.1.1.json` | KEEP | Current advisory short-check source with proof flag false. | Do not mutate in GAME-ARCH-2; future advisory-copy changes need their own sprint. |

## Procedure Support And Landing

| File | Decision | Rationale | Follow-up owner |
|---|---|---|---|
| `engines/procedure-engine.js` | WRAP | Useful step-order support; not primary calculation route. | Keep support role and local-only progress boundaries. |
| `engines/procedure-ui.js` | WRAP | Consumes shared route panel but owns separate feedback/result UI. | Keep procedure-specific pipeline display; align generic feedback later. |
| `engines/procedure.css` | WRAP | Procedure-specific visuals can remain. | Align common feedback/focus tokens later. |
| `build-scripts/platform/build-procedure-shells.js` | KEEP | Correct shell generator for procedure support. | Keep as support route generator. |
| `build-scripts/content/book-1/b1-111-procedure-data.js` | KEEP | Active procedure data builder for Book 1 support. | Do not promote to target-equivalent proof. |
| `build-scripts/platform/build-landing-page.js` | WRAP | Current landing IA is useful, but future advice should consume route API rather than hard-coded route text. | Refactor landing route recommendations after `GATE-ENGINE-1`. |

## Legacy And Retiring Inputs

| File or family | Decision | Rationale | Follow-up owner |
|---|---|---|---|
| `source-data/legacy-target/skilltree/*.js` | DEPRECATE | Legacy target support; not the future unified route source. | Keep only for retiring stack compatibility. |
| `source-data/legacy-target/reasoning/*.csv` | DEPRECATE | Legacy target support; active Book 1 source lives under `source-data/book-1`. | Keep only for retiring stack compatibility. |
| `build-scripts/archive/*` | DEPRECATE | Historical/archived tooling should not shape new architecture. | Do not use for future route/task shell work unless explicitly reviewed. |

## Rebuild Triggers

No file is immediately marked REBUILD during GAME-ARCH-2. A later
implementation sprint should mark a file or module REBUILD only if wrapping
fails one of these tests:

- it cannot consume the route API without duplicating route state;
- it cannot consume the task-shell API for an overlapping task family;
- it creates separate product-boundary language;
- it persists diagnostic/mastery/sequencing/proof-like state;
- it hides generic feedback/focus behavior inside domain UI;
- it cannot be tested by `GATE-ENGINE-1` live-output evidence.
