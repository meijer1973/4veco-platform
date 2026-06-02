# Sprint TASK-FAMILY-TWO-TIER-1: Two-Tier Choice Task-Family Implementation

Generated: 2026-06-02

## Goal

Implement `two_tier_choice` as a deterministic structured-choice family in the
shared task shell.

Students must be able to select both an answer and the reason that supports
that answer through two visible, labelled, keyboard-operable option groups. The
family is meant for bounded misconception repair and explanation-quality
practice, such as index-points-versus-percent, elasticity interpretation,
movement along a curve versus curve shift, and surplus-region reasoning.

This sprint may implement shared runtime support and report-fixture proof only.
It does not allow generated lesson output, source exercise adoption,
target-equivalent reliance, diagnostics, adaptive routing, mastery, sequencing,
student-facing AI, summative use, PV, Scale Gate 1, or product-wide use.

## Context

`TASK-FAMILY-CHOICE-1` closed the structured-choice contract and named
`TASK-FAMILY-TWO-TIER-1` as the implementation lane for `two_tier_choice`.

The accepted contract defines:

- response shape: `{ "answer": "optionId", "reason": "reasonId" }`;
- expected shape:
  `{ "kind": "two_tier_choice", "answer": "optionId", "reason": "reasonId" }`;
- validation owner: shared task shell;
- feedback owner: shared task shell plus domain module;
- focus/keyboard expectation: two labelled option groups with independent
  keyboard operation and one combined feedback region;
- target-proof limit: eligible only for reviewed misconception or reasoning
  checkpoints; not a complete constructed-response substitute.

The current product proof track adds structured choice families only as
reviewed student actions, not quiz variety. `two_tier_choice` therefore checks
whether a student can connect a bounded answer to its supporting reason. It is
not a diagnostic engine, misconception profiler, automatic sequencing signal,
or substitute for calculation, graph/table, source-chain, or full constructed
reasoning proof.

Prior runtime-family sprints established the implementation standard:
first-class family declaration, strict response-shape matching, shared UI
helpers, wrapper collection support, focused tests, custom sprint checker,
report-fixture proof, and structural lead review before closure.

The old exit-ticket game archive remains separately tracked as
`knowledge/exit-ticket-game-1.1.1.zip`. This sprint must not modify it.

## Implementation Schema

`two_tier_choice` must use this interaction schema:

```json
{
  "family": "two_tier_choice",
  "interaction": {
    "answerLabel": "Kies de juiste uitspraak",
    "reasonLabel": "Kies de reden",
    "answerOptions": [
      {
        "id": "indexpunten",
        "label": "De stijging is 4 indexpunten.",
        "description": "Het verschil tussen 112 en 108 is vier punten."
      },
      {
        "id": "vier-procent",
        "label": "De stijging is 4 procent.",
        "description": "Afleider: dit verwart punten met procentuele verandering."
      }
    ],
    "reasonOptions": [
      {
        "id": "percent-apart",
        "label": "Een procentuele verandering bereken je apart met de oude index als basis.",
        "description": "Je deelt de verandering door 108 en vermenigvuldigt met 100."
      },
      {
        "id": "delen-door-100",
        "label": "Bij indexcijfers deel je de verandering altijd door 100.",
        "description": "Afleider: de oude index is hier de basis."
      }
    ]
  },
  "expected": {
    "kind": "two_tier_choice",
    "answer": "indexpunten",
    "reason": "percent-apart",
    "partialFeedback": "practice_only"
  }
}
```

Rules:

- `interaction.answerLabel` and `interaction.reasonLabel` are required.
- `interaction.answerOptions` and `interaction.reasonOptions` each define one
  visible option group. Each option has `id`, `label`, and `description`.
- Option ids must be unique within their own tier and must be non-empty
  strings.
- Each tier must include at least two options so the task is not an automatic
  one-option confirmation.
- Every option must have a non-empty `description` so rendered controls expose
  accessible context, not only terse visible labels.
- `expected.kind` must be `two_tier_choice`.
- `expected.answer` must match an answer-option id. `expected.reason` must
  match a reason-option id.
- The student response shape is exactly
  `{ "answer": "answerOptionId", "reason": "reasonOptionId" }`. Raw strings,
  arrays, nested objects, non-string ids, unknown ids, missing keys, and extra
  response keys must not match.
- Deterministic matching requires both the expected answer and the expected
  reason.
- `partialFeedback: "practice_only"` is optional and may report whether the
  answer tier, reason tier, or answer-reason combination still needs repair in
  neutral terms. It does not create diagnostics, misconception labels, mastery,
  sequencing, or target-equivalent proof.

## Quality Standard

The quality floor is a specification-accurate shared implementation that lets
student-facing surfaces ask students to connect a bounded answer with a
supporting reason without falling back to generic single-answer recognition.
Passing tests alone is insufficient: the implementation must prove rendered output
quality by showing two labelled option groups, selected answer and reason states,
one combined feedback region, practice-only feedback, stable wrapper
collection, keyboard-operable controls, narrow/mobile fixture behavior,
dark-mode-compatible styling, and strict response-shape proof.

This sprint fulfils the product specification by adding a two-tier
answer-plus-reason task family that can later support misconception repair and
bounded reasoning practice. It names follow-up work before `two_tier_choice` is
used in generated product routes, target-equivalent exit tickets, reasoning
migration, or Scale Gate proof.

The review gate for this sprint is structural lead review before closure. A
future `GATE-TASK-FAMILY-1` or product adoption review must still inspect
rendered generated output before `two_tier_choice` is relied on in reasoning
migration, check implementation, first-three-paragraph product proof, or Scale
Gate 1.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| `two_tier_choice` is a first-class shared task-shell family. | `engines/task-shell-engine.js` declares the family and validates answer/reason tiers, option descriptions, expected ids, and strict response shapes. | Focused Jest and custom sprint checker. | planned |
| Matching requires both answer and reason. | Engine matching rejects answer-only, reason-only, wrong answer, wrong reason, wrong pair, missing keys, non-string ids, unknown ids, nested objects, arrays, raw strings, and extra keys. | Engine tests plus custom checker. | planned |
| Two option tiers stay distinct. | Validation rejects expected answer ids from the reason tier and expected reason ids from the answer tier. | Engine tests and custom checker. | planned |
| Accessible descriptions are concrete. | Validation rejects answer or reason options without descriptions. | Engine tests and custom checker. | planned |
| Optional partial feedback is practice-only and neutral. | `partialFeedback: "practice_only"` returns answer/reason/combination repair cues without diagnostic, mastery, or sequencing language. | Engine/UI tests, rendered fixture, and lead review. | planned |
| Rendered output uses two-tier-specific controls. | `engines/task-shell-ui.js` renders `.ts-two-tier-*` controls with stable `data-two-tier-*` selectors, not recycled single-choice selectors. | UI tests and rendered fixture proof. | planned |
| Keyboard/focus behavior is explicit. | Focus plan includes answer controls, reason controls, and the combined selected-state/feedback region. | Focus-plan tests, checker, and fixture proof. | planned |
| Wrapper collection is shared-shell owned. | Exit-ticket, skilltree, and graph wrappers collect `two_tier_choice` responses through `TaskShellUI` helpers and delegate click handling. | Wrapper tests/static checks and custom checker. | planned |
| Product authority boundaries stay intact. | No source exercise data, generated lesson output, protected references, target-exercise registry, candidate storage, product route, or old exit-ticket game archive changes. | Bundle checker, diff review, and lead review. | planned |

## Quality Improvement Candidates

| Candidate | Decision | Rationale |
|---|---|---|
| Add relation-specific misconception labels. | reject_scope_creep | That becomes diagnostics/misconception profiling unless a later reviewed design authorizes it. |
| Support multiple correct reasons for one answer. | defer_named_follow_up | The first runtime lane is exact answer+reason. Multiple accepted reasons need a reviewed expected schema. |
| Show separate answer-tier and reason-tier feedback. | include_now | This is the core learning value of two-tier choice, as long as it stays neutral and practice-only. |
| Require descriptions for every option. | include_now | Labels alone may be terse; descriptions support screen-reader and review proof. |
| Generated-route screenshots in this runtime sprint. | defer_named_follow_up | This sprint produces report-fixture proof only; product-route adoption and generated screenshots belong to a later adoption sprint and `GATE-TASK-FAMILY-1`. |
| Treat two-tier choice as a constructed-response substitute. | reject_scope_creep | It can support bounded reasoning checkpoints, but it cannot replace full answer construction unless a later gate reviews that exact target action. |

## Allowed paths

Allowed runtime paths:

- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`
- `engines/exit-ticket-ui.js`
- `engines/skilltree-ui.js`
- `engines/graphical-ui.js`
- `engines/tests/task-shell-engine.test.js`
- `engines/tests/task-shell-ui.test.js`
- `engines/tests/exit-ticket-ui.test.js`
- `engines/tests/skilltree-ui.test.js`
- `engines/tests/graphical-ui.test.js`

Allowed sprint/proof/checker paths:

- `build-scripts/sprints/check-task-family-two-tier1.js`
- `reports/sprints/TASK-FAMILY-TWO-TIER-1-*`
- `reports/json/task-family-two-tier1-proof.json`
- `references/data/sprints/TASK-FAMILY-TWO-TIER-1.plan.json`
- `references/data/sprints/TASK-FAMILY-TWO-TIER-1.result.json`

Allowed closure/index paths after implementation and review:

- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/outdated/reference-team-roadmap-*.md`
- `reports/github-agent-index-*.md`
- `reports/github-agent-index-*.json`
- `reports/url-index.md`
- `reports/internal-dashboard/*`
- `../4veco-lessen/lessen-team-roadmap.md`

## Forbidden paths

Forbidden paths and surfaces:

- `references/machine/`
- `references/external/`
- `source-data/book-1/exit-ticket/`
- `source-data/book-1/reasoning/`
- generated Book 1 lesson output under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`
- `knowledge/exit-ticket-game-1.1.1.zip`
- target-exercise registry records
- candidate-storage files
- PV projection or PV machine-promotion outputs

## Inputs

Required inputs:

- `reports/sprints/TASK-FAMILY-CHOICE-1-contract.md`
- `reports/json/task-family-choice-contract.json`
- `reports/sprints/TASK-FAMILY-MATCH-1-result.md`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- current shared task-shell runtime, UI, CSS, wrapper, and focused-test files.

## Outputs

Required outputs:

- first-class `two_tier_choice` runtime, UI, CSS, wrapper, and test support;
- deterministic sprint checker;
- proof JSON;
- rendered fixture and screenshot manifest with standard, narrow/mobile,
  dark-mode, after-click, and feedback states;
- sprint result JSON and markdown result;
- diff summary;
- structural lead-review assignment, round 1, corrections if needed, and
  round 2;
- updated roadmap/index/dashboard artifacts only at closure.

## Proof Required to Close

The sprint may close only after producing:

- updated shared task-shell engine support;
- updated shared task-shell UI and CSS support;
- wrapper collection/click handling for exit-ticket, skilltree, and graph
  surfaces;
- focused Jest tests for engine, UI, and wrappers;
- a custom `TASK-FAMILY-TWO-TIER-1` checker;
- proof JSON;
- rendered fixture proof including standard, narrow/mobile, dark-mode,
  after-click, and feedback states;
- planning review;
- structural lead-review assignment, round 1, corrections if needed, and
  round 2;
- result and diff summary artifacts;
- roadmap/index/dashboard refresh if the sprint closes.

## Planned Files

Sprint artifacts:

- `reports/sprints/TASK-FAMILY-TWO-TIER-1-plan.md`
- `reports/sprints/TASK-FAMILY-TWO-TIER-1-baseline.md`
- `reports/sprints/TASK-FAMILY-TWO-TIER-1-planning-review.md`
- `reports/sprints/TASK-FAMILY-TWO-TIER-1-rendered-fixture.html`
- `reports/sprints/TASK-FAMILY-TWO-TIER-1-screenshot-manifest.md`
- `reports/sprints/TASK-FAMILY-TWO-TIER-1-result.md`
- `reports/sprints/TASK-FAMILY-TWO-TIER-1-diff-summary.md`
- `reports/json/task-family-two-tier1-proof.json`
- `references/data/sprints/TASK-FAMILY-TWO-TIER-1.plan.json`
- `references/data/sprints/TASK-FAMILY-TWO-TIER-1.result.json`

Runtime and tests:

- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`
- `engines/exit-ticket-ui.js`
- `engines/skilltree-ui.js`
- `engines/graphical-ui.js`
- `engines/tests/task-shell-engine.test.js`
- `engines/tests/task-shell-ui.test.js`
- `engines/tests/exit-ticket-ui.test.js`
- `engines/tests/skilltree-ui.test.js`
- `engines/tests/graphical-ui.test.js`
- `build-scripts/sprints/check-task-family-two-tier1.js`

Roadmap and index artifacts may be updated only during closure.

## Operationalized sprint procedure

1. Validate this plan, baseline, and plan JSON with the sprint-plan and planned
   bundle checkers. Stop if the plan does not pass.
2. Ask the planning/review agent to inspect the plan, baseline, plan JSON,
   accepted structured-choice contract, and prior runtime sprint pattern. Stop
   and revise if the planning review returns blockers.
3. Implement the shared-shell runtime: family declaration, interaction
   validation, expected validation, strict response-shape matching,
   practice-only feedback, and focus plan.
4. Implement shared UI/CSS support using two-tier-specific selectors and
   keyboard-operable answer/reason controls.
5. Integrate wrapper collection and click handling for exit-ticket, skilltree,
   and graph surfaces through `TaskShellUI` helpers.
6. Add focused tests, sprint checker, proof JSON, rendered fixture, and
   screenshot manifest. Run acceptance validators before lead review.
7. Assign structural lead review, record round 1, make corrections if needed,
   and record round 2. Do not close the sprint until round 2 passes.
8. Update roadmap, version index, URL index, GitHub-facing maps, and internal
   dashboard only after implementation and lead review are accepted.
9. Run the final validation stack. Commit and push only after `git fetch
   --prune origin` confirms the remote branch is current or the divergence is
   resolved.

## Acceptance tests

Run during implementation and closure:

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-TWO-TIER-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-TWO-TIER-1
npx.cmd jest --runInBand --runTestsByPath engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js
node build-scripts/sprints/check-task-family-two-tier1.js
npm.cmd run check:platform
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/check-sprint-result.js reports/sprints/TASK-FAMILY-TWO-TIER-1-result.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-TWO-TIER-1 --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -C ../4veco-lessen diff --check
```

## Stop Conditions

Stop and revise the plan or route a governance pause if:

- planning review finds missing answer/reason tier, keyboard, mobile,
  dark-mode, feedback, or target-proof boundary requirements;
- implementation would require generated lesson output or source-data adoption;
- the family cannot be implemented without two distinct labelled option
  groups;
- matching accepts raw strings, raw arrays, nested objects, non-string ids,
  unknown ids, missing answer/reason keys, or extra response keys;
- validation allows expected answer ids from the reason tier or expected reason
  ids from the answer tier;
- validation allows option groups without accessible descriptions;
- feedback implies diagnostics, misconception profiling, mastery, sequencing,
  or target-equivalent proof;
- rendered output cannot show two stable option groups in standard and narrow
  fixture states;
- any artifact allows diagnostics, adaptive routing, mastery, sequencing,
  student-facing AI, summative use, PV, Scale Gate 1, or product-wide use.

## Human review required

No human review gate is required for this runtime-only implementation sprint.

Structural lead review is required before sprint closure:

- lead-review assignment;
- lead-review round 1;
- correction log, even if no blocking correction is required;
- lead-review round 2 recheck.

`GATE-TASK-FAMILY-1` remains the later human/lead review point before
structured choice or construction families are relied on by reasoning
migration, check implementation, first-three-paragraph product proof, or Scale
Gate 1.

## Forbidden Changes

- No edits under `references/machine` or `references/external`.
- No source-data/book-1/exit-ticket writes.
- No reasoning CSV writes.
- No target-exercise registry writes.
- No generated Book 1 lesson output writes.
- No candidate storage creation or candidate writes.
- No changes to `knowledge/exit-ticket-game-1.1.1.zip`.
- No protected reference mutation, machine reference mutation,
  external-source mutation, unit minting, unit update, unit split, or unit
  deprecation.
- No diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV, CP-6/Year-1 promotion, Scale Gate 1, or product-wide use.

## Rollback plan

Before commit, remove only the `TASK-FAMILY-TWO-TIER-1` runtime/test changes,
checker, proof artifacts, sprint records, result metadata, and any roadmap or
index refresh generated for this sprint. After commit, revert the sprint
commit. Do not revert previous task-family sprint records, source data,
generated Book 1 output, protected references, unrelated user work, or
`knowledge/exit-ticket-game-1.1.1.zip`.
