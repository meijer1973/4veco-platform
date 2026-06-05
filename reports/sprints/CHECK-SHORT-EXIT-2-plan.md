# Sprint CHECK-SHORT-EXIT-2: Implement Both Check Types For First Three Paragraphs

Generated: 2026-06-05

Status: active plan before implementation.

## Goal

Implement the Product Proof Track check-surface requirement for Book 1
paragraphs `1.1.1`, `1.1.2`, and `1.1.3`: each paragraph must have an
advisory short check and a separate target-equivalent exit-ticket surface, or
an explicit blocker recorded with evidence.

This sprint may implement bounded platform generator/runtime changes,
author checked source data under `source-data/book-1/exit-ticket/`, deploy
generated Book 1 output through the platform pipeline, and prepare rendered
review evidence. It must not authorize product-route adoption, broad
target-equivalent reliance, diagnostics, mastery/sequencing, student-facing
AI, summative use, PV, Scale Gate 1, or product-wide use.

## Context

`CHECK-SHORT-EXIT-1` recorded the current state:

- `1.1.1` has only an advisory `Korte check` and lacks target-equivalent
  A43/B01/B02 proof.
- `1.1.2` has the reviewed local target-equivalent `Exit ticket` and lacks a
  separate advisory short check.
- `1.1.3` has no check route, no advisory short check, and no target-equivalent
  graph/table exit ticket.

`GATE-SHARED-TASK-INGEST-REPAIR-1` closed PASS WITH FLAGS for review-only
source/context ingestion readiness and authorizes controlled downstream
adoption-preparation. Its flags must carry into this sprint: `1.1.3`
source-dependent tasks need context-first source blocks, readable table/graph
context, graph-construction substitute quality boundaries, source/support/
prompt separation, duplicate-label prevention, and no generated-output or
target-equivalent authority without this sprint's own proof and review.

The current platform has two architectural blockers that must be repaired
before content implementation:

1. `build-exit-ticket-shells.js` and the landing-page generator support one
   check page per paragraph. This sprint needs two pages per paragraph.
2. `exit-ticket-ui.js` renders shared task-shell tasks individually but does
   not yet render task-shell context blocks in the exit-ticket wrapper. The
   `1.1.3` target-equivalent candidate needs source text, table, procedure,
   formula, and task context visible before controls.
3. The shared `graph_construction_substitute` family validates graph
   responses but must render a real graph workspace and response collector
   before `1.1.3` can be a playable generated route instead of a textarea
   placeholder.

## Quality Standard

Quality floor: the sprint must satisfy the product-end-state and companion
specifications within the authorized first-three-paragraph check-surface
scope. Passing tests or producing files is not enough. Rendered output must
show two distinct Check cards where both surfaces exist, clear student-facing
labels, hidden short-check hints where used, no content hints in exit tickets,
source/context blocks for `1.1.3`, useful feedback, and no target-equivalent
completion language for newly built surfaces until review authorizes it.

Specification requirements being fulfilled:

- every paragraph has an advisory short check and separate exit ticket, or a
  named blocker;
- advisory short checks provide local route advice only and do not claim
  target-equivalent proof;
- exit tickets check the paragraph target-operation chain at the same level,
  with matching answer forms;
- source-dependent exit tickets use context-first source blocks with readable
  text/table/procedure/formula context, graph-workspace controls, and task
  `contextRefs`;
- product-boundary claims stay blocked until the appropriate rendered-output
  review accepts them.

Evidence needed to prove fulfilment:

- source data for six surfaces or explicit blocker records;
- generator/runtime tests for multi-surface check pages and exit-ticket
  context rendering;
- deployed Book 1 pages and landing-page links for `1.1.1`, `1.1.2`, and
  `1.1.3`;
- screenshots for landing Check sections, short-check initial/retry/completed
  states, exit-ticket initial/retry/completed states, `1.1.3` context rendering,
  mobile, and dark mode;
- JSON proof and a deterministic checker for source shape, generated output,
  rendered evidence paths, forbidden authority, and roadmap boundaries;
- planning review, lead-review round 1, correction log, lead-review round 2,
  and direct human review before new target-equivalent completion claims.

The review gate judging student-facing quality is a new direct human review
packet for `CHECK-SHORT-EXIT-2` / first-three-paragraph check surfaces. The
sprint may prepare the packet and record comments, but gate closure and any
new target-equivalent completion language require explicit human confirmation.

Named follow-up work not included here: Scale Gate 1, `SCALE-PROOF-3P`,
`GATE-PRODUCT-3P`, full graph-engine quality beyond
`graph_construction_substitute`, the later shared-task hardening series, and
product-wide adoption.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| `1.1.1` keeps advisory short check and gains target-equivalent candidate or blocker. | Migrated/retained advisory source plus A43/B01/B02 exit-ticket source covering revenue, opportunity cost, mixed allocation, and scarcity explanation. | Engine tests, generated pages, screenshots, checker, lead review, human review. | planned |
| `1.1.2` keeps reviewed exit ticket and gains advisory short check. | Existing reviewed exit-ticket source preserved; new advisory source with local route feedback only. | Regression tests for reviewed `1.1.2`, screenshots, checker. | planned |
| `1.1.3` gains advisory short check and graph/table exit-ticket candidate or blocker. | Source-context exit-ticket data using source text/table/procedure/formula context blocks, shared `graph_construction_substitute`, graph reading, and interval-halving check. | Context rendering screenshots, task-shell validation, checker, lead review, human review. | planned |
| Landing pages can show two Check cards per paragraph. | `build-exit-ticket-shells.js` and `build-landing-page.js` support multi-surface check files and clean stale single-surface output. | Unit/generator tests plus deployed landing screenshots. | planned |
| Exit-ticket wrapper renders source/context blocks. | `exit-ticket-ui.js` renders task-shell context blocks and context refs without leaking internal codes or answer hints. | Jest, custom checker, rendered `1.1.3` screenshots. | planned |
| Short-check hints are hidden/collapsible; exit-ticket hints remain absent. | Source data and UI scans show hidden hints only on advisory surfaces and no content hints on exit tickets. | Checker and rendered proof. | planned |
| Newly built target-equivalent candidates do not overclaim. | New candidates keep `gateApproved: false` and `completionLanguageEligible: false` until human review; copy avoids proof/mastery/diagnostic language. | Scope-language checker, custom checker, human-review packet. | planned |
| Generated output is reproducible. | Book 1 output generated only through `node scripts/deploy.js`. | `check:book`, diff checks, repository maps, URL index. | planned |

## Quality Improvement Candidates

| Candidate | Classification | Disposition |
|---|---|---|
| Adopt a filename/source-key convention such as `1.1.3-korte-check.json` and `1.1.3-exit-ticket.json`. | include_now | Required so two check surfaces can coexist per paragraph. |
| Render task-shell context blocks inside exit-ticket pages. | include_now | Required for `1.1.3` source-dependent proof. |
| Reuse Repair 4 `1.1.3` graph/table task sequence for the exit-ticket candidate. | include_now | It is the reviewed controlled source-context preparation surface. |
| Add a direct human review packet for new check-surface authority. | include_now | New target-equivalent claims need rendered-output review. |
| Promote a full freehand graphing engine. | defer_named_follow_up | This sprint adds a playable shared graph-construction substitute; full graph-engine promotion belongs later. |
| Start `SCALE-PROOF-3P` or Scale Gate 1. | reject_scope_creep | Still blocked until this sprint, product proof, and gates close. |
| Mutate protected reference registries to mark target exercise status. | reject_scope_creep | This sprint works through source data and generated proof, not protected reference mutation. |

## Allowed paths

- `reports/sprints/CHECK-SHORT-EXIT-2-*`
- `references/data/sprints/CHECK-SHORT-EXIT-2.plan.json`
- `references/data/sprints/CHECK-SHORT-EXIT-2.result.json`
- `reports/json/check-short-exit2-proof.json`
- `build-scripts/sprints/check-check-short-exit2.js`
- `build-scripts/sprints/capture-check-short-exit2-screenshots.js`
- `build-scripts/platform/build-exit-ticket-shells.js`
- `build-scripts/platform/build-landing-page.js`
- `engines/exit-ticket-engine.js`
- `engines/exit-ticket-ui.js`
- `engines/exit-ticket.css`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`
- `engines/graphical-ui.js`
- `engines/skilltree-ui.js`
- focused tests under `engines/tests/`
- `source-data/book-1/exit-ticket/*.json`
- generated Book 1 output under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/` produced by the deploy pipeline
- review packet artifacts under `reports/review-gates/GATE-CHECK-SHORT-EXIT-2-first-three-check-surfaces-review/`
- platform and lesson roadmap status updates
- generated repository maps, URL indexes, and dashboard artifacts

## Forbidden paths

- No edits under `references/machine/` or `references/external/`.
- No protected reference mutation, machine reference mutation, external-source
  mutation, unit mutation, unit minting, unit split, or unit deprecation.
- No direct writes to `references/authored/course-target-exercises.json`.
- No candidate-storage creation or writes.
- No reasoning CSV mutation.
- No hand edits to generated Book 1 lesson output; output must be deployed.
- No target-equivalent completion language for newly built `1.1.1` or `1.1.3`
  surfaces before explicit human review authorizes it.
- No diagnostics, adaptive routing, mastery/sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, CP-6/Year-1 promotion,
  Scale Gate 1, or product-wide use.
- Do not import, stage, move, or edit `knowledge/exit-ticket-game-1.1.1.zip`.

## Inputs

- `../CLAUDE.md`
- `AGENTS.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `reports/sprints/CHECK-SHORT-EXIT-1-inventory.md`
- `reports/json/check-short-exit-inventory.json`
- `reports/sprints/TASK-SHELL-UX-2-result.md`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review/gate-closure.md`
- `reports/json/task-ingest-transform3-textbook.json`
- `reports/json/task-ingest-transform3-textbook-proof.json`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-task-family-map.md`
- `source-data/book-1/exit-ticket/1.1.1.json`
- `source-data/book-1/exit-ticket/1.1.2.json`
- `references/authored/course-target-exercises.json` as read-only context
- current Book 1 generated output as deploy/readback target

## Outputs

- Multi-surface check source convention and generator support.
- Six check-surface source records, or explicit blockers where implementation
  fails the quality floor.
- Generated Book 1 short-check and exit-ticket pages for `1.1.1`-`1.1.3`.
- Landing pages showing separate `Korte check` and `Exit ticket` cards where
  both exist.
- Exit-ticket context rendering for source-dependent tasks.
- Focused tests for engine/UI/generator/landing behavior.
- `reports/json/check-short-exit2-proof.json`
- `reports/sprints/CHECK-SHORT-EXIT-2-screenshot-manifest.md`
- screenshot set under `reports/sprints/CHECK-SHORT-EXIT-2-screenshots/`
- deterministic checker `build-scripts/sprints/check-check-short-exit2.js`
- sprint plan, baseline, planning review, command log, lead-review records,
  result, diff summary, result metadata, roadmap updates, and review packet
  artifacts

## Operationalized sprint procedure

1. Record this plan, baseline, and plan metadata. Stop if the plan does not
   name the multi-surface generator change and the exit-ticket context-render
   change.
2. Run planning review before implementation. Stop if review finds target-
   equivalence overclaim, generated-output hand edits, or missing rendered
   proof.
3. Implement the multi-surface source convention:
   - source file key derives from the JSON filename;
   - `data.parNr` remains the paragraph id;
   - `data.surface` determines `korte-check` or `exit-ticket`;
   - generated data files and HTML shells use the source key so two surfaces
     can coexist.
4. Update landing-page scanning/rendering so a paragraph Check section can
   show separate `Korte check` and `Exit ticket` cards.
5. Update exit-ticket validation/rendering so source-dependent target tasks
   may include `contextBlocks` and task `contextRefs`; exit-ticket pages render
   those blocks before task controls.
6. Migrate existing sources into the new convention while preserving behavior:
   - current `1.1.1` remains advisory;
   - current reviewed `1.1.2` remains the approved local exit ticket.
7. Author missing surfaces:
   - `1.1.1` target-equivalent candidate covering A43/B01/B02;
   - `1.1.2` advisory short check;
   - `1.1.3` advisory short check;
   - `1.1.3` graph/table target-equivalent candidate using source context,
     shared graph-construction controls, and the accepted Repair 4 task economy.
8. Add tests and a custom checker for:
   - six source surfaces;
   - two check links per paragraph where applicable;
   - no stale single-surface check pages linked from landing pages;
   - no exit-ticket content hints;
   - no target-equivalent completion language for unapproved new candidates;
   - `1.1.3` context blocks and task refs.
9. Deploy Book 1 output through
   `node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"`.
10. Capture rendered screenshots for desktop, mobile, and dark-mode evidence.
11. Run validators and lead-review round 1.
12. Apply corrections, record correction log, and run lead-review round 2.
13. Prepare direct human review packet. Do not close the gate or enable new
    completion language until returned comments, resolution log, closure
    proposal where allowed, and explicit human confirmation exist.
14. Refresh repository maps/indexes/dashboard, fetch/prune, commit, push, and
    report local and remote hashes.

Decision points:

- If the multi-surface generator cannot be completed cleanly, stop and record
  a blocker instead of hiding one surface.
- If `1.1.1` or `1.1.3` target-equivalent data cannot satisfy same-level
  operation-chain and answer-form expectations, record a candidate/blocker
  rather than setting completion-language eligibility.
- If `1.1.3` context blocks are unreadable or answer-leaking in rendered
  output, stop before human review.
- If generated output cannot be deployed through the platform pipeline, do not
  hand-edit the lesson target.

Stop conditions:

- Stop if any new student-facing copy claims diagnostics, mastery, grading,
  automatic sequencing, summative use, product-wide readiness, or Scale Gate 1.
- Stop if a short check claims target-equivalent readiness.
- Stop if an exit ticket exposes content hints before attempt.
- Stop if a new unapproved exit-ticket candidate shows target-equivalent
  completion language.
- Stop if `1.1.3` source/table/graph context does not render on the page.
- Stop if landing pages cannot show both check surfaces distinctly.
- Stop if protected references, candidate storage, or generated output are
  hand-edited.

Review and validator details:

- Planning review must pass before implementation.
- Lead-review round 2 must return PASS or PASS WITH FLAGS before human review.
- Human review is required before new target-equivalent completion authority or
  gate closure.
- The custom checker must fail the stop conditions above.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/CHECK-SHORT-EXIT-2-plan.md
node build-scripts/sprints/check-sprint-bundle.js CHECK-SHORT-EXIT-2
npx.cmd jest --runInBand engines/tests/exit-ticket-engine.test.js engines/tests/exit-ticket-ui.test.js engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js
node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/sprints/capture-check-short-exit2-screenshots.js
node build-scripts/sprints/check-check-short-exit2.js
npm.cmd run check:book -- "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
npm.cmd run check:platform
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/check-lead-review-substance.js CHECK-SHORT-EXIT-2
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/check-sprint-result.js reports/sprints/CHECK-SHORT-EXIT-2-result.md
node build-scripts/sprints/check-sprint-bundle.js CHECK-SHORT-EXIT-2 --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

Proof required to close: all three paragraphs have a rendered advisory short
check and a separate rendered exit-ticket surface, or an explicit blocker is
recorded; generated landing pages show distinct Check cards; short checks are
advisory-only; exit tickets expose no content hints; `1.1.3` renders context
blocks, a shared graph-construction workspace, and context-linked graph/table tasks; screenshots and proof JSON cover
initial, retry, feedback, completion/blocked-completion, mobile, and dark
states; custom checker and validators pass; lead-review round 2 passes; human
review comments and resolution artifacts are complete for any new
target-equivalent authority; generated output was deployed, not hand-edited;
and all product-authority boundaries remain intact.

## Rollback plan

Before commit, revert only the CHECK-SHORT-EXIT-2 source-data, generator,
runtime/UI, tests, generated-output, report, checker, metadata, roadmap/index,
dashboard, and review-packet changes. After commit, revert the sprint commit
and any generated lesson-output commit if the human review fails.

Do not revert prior gate closure artifacts, protected references, unrelated
branches/worktrees, target-exercise records, candidate-storage state, or
`knowledge/exit-ticket-game-1.1.1.zip`.

## Human review required

Yes. This sprint introduces new rendered check surfaces and new target-
equivalent candidates. Direct human review is required before any new
target-equivalent completion language, product-route adoption, product proof,
or gate closure is claimed.
