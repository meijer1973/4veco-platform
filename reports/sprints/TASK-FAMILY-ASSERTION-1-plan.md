# Sprint TASK-FAMILY-ASSERTION-1: Assertion-Reason Task-Family Implementation

Generated: 2026-06-02

## Goal

Implement `assertion_reason` as a deterministic structured-choice family in
the shared task shell.

Students must be able to judge a visible assertion and a visible reason as a
single relation: whether each statement is correct and whether the reason
explains the assertion. The family is meant for sparse, reviewed, compact
exam-style reasoning practice where the target student action is genuinely a
relation judgement.

This sprint may implement shared runtime support and report-fixture proof only.
It does not allow generated lesson output, source exercise adoption,
target-equivalent reliance, diagnostics, adaptive routing, mastery, sequencing,
student-facing AI, summative use, PV, Scale Gate 1, or product-wide use.

## Context

`TASK-FAMILY-CHOICE-1` closed the structured-choice contract and named
`TASK-FAMILY-ASSERTION-1` as the implementation lane for `assertion_reason`.

The accepted contract defines:

- response shape: `{ "value": "optionId" }`;
- expected shape: `{ "kind": "assertion_reason", "value": "optionId" }`;
- validation owner: shared task shell;
- feedback owner: shared task shell plus domain module;
- focus/keyboard expectation: an assertion/reason panel, relation option
  group, and one combined feedback region;
- target-proof limit: lower priority; must remain reviewed and sparse because
  artificial assertion-reason tasks can weaken learning quality.

The product proof track adds structured choice families only as reviewed
student actions, not quiz variety. `assertion_reason` therefore checks a
bounded relation judgement. It is not a diagnostic engine, misconception
profiler, automatic sequencing signal, generic multiple-choice substitute, or
substitute for calculation, graph/table, source-chain, or full constructed
reasoning proof.

Prior runtime-family sprints established the implementation standard:
first-class family declaration, strict response-shape matching, shared UI
helpers, wrapper collection support, focused tests, custom sprint checker,
report-fixture proof, and structural lead review before closure.

The old exit-ticket game archive remains separately tracked as
`knowledge/exit-ticket-game-1.1.1.zip`. This sprint must not modify it.

## Implementation Schema

`assertion_reason` must use this interaction schema:

```json
{
  "family": "assertion_reason",
  "interaction": {
    "assertionLabel": "Stelling",
    "assertionText": "Als de prijs stijgt, daalt de gevraagde hoeveelheid.",
    "reasonLabel": "Reden",
    "reasonText": "Consumenten kopen bij een hogere prijs meestal minder.",
    "optionLabel": "Kies de juiste relatie",
    "options": [
      {
        "id": "both-correct-explains",
        "label": "Stelling en reden zijn juist, en de reden verklaart de stelling.",
        "description": "Beide uitspraken kloppen en de reden ondersteunt de stelling."
      },
      {
        "id": "both-correct-no-explain",
        "label": "Stelling en reden zijn juist, maar de reden verklaart de stelling niet.",
        "description": "Beide uitspraken kloppen, maar het verband ontbreekt."
      },
      {
        "id": "assertion-correct-reason-wrong",
        "label": "De stelling is juist, maar de reden is onjuist.",
        "description": "Alleen de stelling klopt."
      },
      {
        "id": "assertion-wrong-reason-correct",
        "label": "De stelling is onjuist, maar de reden is juist.",
        "description": "Alleen de reden klopt."
      },
      {
        "id": "both-wrong",
        "label": "Stelling en reden zijn allebei onjuist.",
        "description": "Geen van beide uitspraken klopt."
      }
    ]
  },
  "expected": {
    "kind": "assertion_reason",
    "value": "both-correct-explains",
    "partialFeedback": "practice_only"
  }
}
```

Rules:

- `interaction.assertionLabel`, `interaction.assertionText`,
  `interaction.reasonLabel`, `interaction.reasonText`, and
  `interaction.optionLabel` are required.
- `interaction.options` defines one visible relation-option group. Each option
  has `id`, `label`, and `description`.
- Option ids must be unique and non-empty strings.
- The option group must include at least four options so the task is not a
  shallow binary judgement.
- Every option must have a non-empty `description` so rendered controls expose
  accessible context, not only terse visible labels.
- `expected.kind` must be `assertion_reason`.
- `expected.value` must match one relation-option id.
- The student response shape is exactly `{ "value": "optionId" }`. Raw
  strings, arrays, nested objects, non-string ids, unknown ids, missing keys,
  and extra response keys must not match.
- Deterministic matching requires the exact expected relation id.
- `partialFeedback: "practice_only"` is optional and may report the selected
  relation and the expected relation in neutral terms. It does not create
  diagnostics, misconception labels, mastery, sequencing, or target-equivalent
  proof.

## Quality Standard

The quality floor is a specification-accurate shared implementation that lets
student-facing surfaces ask students to judge the relation between a bounded
assertion and reason without falling back to generic single-answer
recognition. Passing tests alone is insufficient: the implementation must prove
rendered output quality by showing the assertion/reason panel, one labelled
relation option group, selected relation state, one combined feedback region,
practice-only feedback, stable wrapper collection, keyboard-operable controls,
narrow/mobile fixture behavior, dark-mode-compatible styling, and strict
response-shape proof.

This sprint fulfils the product specification by adding the last structured
choice task family named in the current structured-choice lane. It names
follow-up work before `assertion_reason` is used in generated product routes,
target-equivalent exit tickets, reasoning migration, or Scale Gate proof.

The review gate for this sprint is structural lead review before closure. A
future `GATE-TASK-FAMILY-1` or product adoption review must still inspect
rendered generated output before `assertion_reason` is relied on in reasoning
migration, check implementation, first-three-paragraph product proof, or Scale
Gate 1.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| `assertion_reason` is a first-class shared task-shell family. | `engines/task-shell-engine.js` declares the family and validates assertion/reason text, relation options, option descriptions, expected id, and strict response shape. | Focused Jest and custom sprint checker. | planned |
| Matching requires exact relation judgement. | Engine matching rejects missing key, raw string, raw array, nested object, non-string id, unknown id, and extra keys. | Engine tests plus custom checker. | planned |
| Assertion/reason context is visible. | `TaskShellUI` renders assertion and reason text in a specific panel instead of only showing options. | UI tests and rendered fixture proof. | planned |
| Accessible descriptions are concrete. | Validation rejects relation options without descriptions. | Engine tests and custom checker. | planned |
| Optional partial feedback is practice-only and neutral. | `partialFeedback: "practice_only"` returns selected/expected relation cues without diagnostic, mastery, or sequencing language. | Engine/UI tests, rendered fixture, and lead review. | planned |
| Rendered output uses assertion-specific controls. | `engines/task-shell-ui.js` renders `.ts-assertion-*` controls with stable `data-assertion-*` selectors, not recycled single-choice selectors. | UI tests and rendered fixture proof. | planned |
| Keyboard/focus behavior is explicit. | Focus plan includes relation option controls and assertion feedback region. | Focus-plan tests, checker, and fixture proof. | planned |
| Wrapper collection is shared-shell owned. | Exit-ticket, skilltree, and graph wrappers collect `assertion_reason` responses through `TaskShellUI` helpers and delegate click handling. | Wrapper tests/static checks and custom checker. | planned |
| Product authority boundaries stay intact. | No source exercise data, generated lesson output, protected references, target-exercise registry, candidate storage, product route, or old exit-ticket game archive changes. | Bundle checker, diff review, and lead review. | planned |

## Quality Improvement Candidates

| Candidate | Decision | Rationale |
|---|---|---|
| Require a five-option classic relation set. | defer_named_follow_up | Some valid assertion-reason tasks may use four reviewed relations; this runtime lane requires at least four options and exact reviewed options. |
| Add relation-specific misconception categories. | reject_scope_creep | That becomes diagnostics/misconception profiling unless a later reviewed design authorizes it. |
| Show selected relation and expected relation in feedback. | include_now | This is useful repair feedback as long as it stays neutral and practice-only. |
| Require descriptions for every option. | include_now | Labels alone may be terse; descriptions support screen-reader and review proof. |
| Generated-route screenshots in this runtime sprint. | defer_named_follow_up | This sprint produces report-fixture proof only; product-route adoption and generated screenshots belong to a later adoption sprint and `GATE-TASK-FAMILY-1`. |
| Treat assertion-reason as default reasoning game format. | reject_scope_creep | It must remain sparse and reviewed because artificial assertion-reason tasks can weaken learning quality. |

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

- `build-scripts/sprints/check-task-family-assertion1.js`
- `reports/sprints/TASK-FAMILY-ASSERTION-1-*`
- `reports/json/task-family-assertion1-proof.json`
- `references/data/sprints/TASK-FAMILY-ASSERTION-1.plan.json`
- `references/data/sprints/TASK-FAMILY-ASSERTION-1.result.json`

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
- `reports/sprints/TASK-FAMILY-TWO-TIER-1-result.md`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- current shared task-shell runtime, UI, CSS, wrapper, and focused-test files.

## Outputs

Required outputs:

- first-class `assertion_reason` runtime, UI, CSS, wrapper, and test support;
- deterministic sprint checker;
- proof JSON;
- rendered fixture and screenshot manifest with standard, narrow/mobile,
  dark-mode, after-click, and feedback states;
- sprint result JSON and markdown result;
- diff summary;
- structural lead-review assignment, round 1, corrections if needed, and
  round 2;
- updated roadmap/index/dashboard artifacts only at closure.

## Operationalized sprint procedure

1. Validate this plan, baseline, and plan JSON with the sprint-plan and planned
   bundle checkers. Stop if the plan does not pass.
2. Ask the planning/review agent to inspect the plan, baseline, plan JSON,
   accepted structured-choice contract, product specifications, and prior
   runtime sprint pattern. Stop and revise if the planning review returns
   blockers.
3. Implement the shared-shell runtime: family declaration, assertion/reason
   interaction validation, expected validation, strict response-shape matching,
   practice-only feedback, and focus plan.
4. Implement shared UI/CSS support using assertion-specific selectors and
   keyboard-operable relation controls.
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

## Proof Required to Close

The sprint may close only after producing:

- updated shared task-shell engine support;
- updated shared task-shell UI and CSS support;
- wrapper collection/click handling for exit-ticket, skilltree, and graph
  surfaces;
- focused Jest tests for engine, UI, and wrappers;
- a custom `TASK-FAMILY-ASSERTION-1` checker;
- proof JSON;
- rendered fixture proof including standard, narrow/mobile, dark-mode,
  after-click, and feedback states;
- planning review;
- structural lead-review assignment, round 1, correction log, and round 2;
- sprint result markdown and JSON;
- diff summary;
- updated platform and lesson roadmap state at closure;
- refreshed repository maps/index/dashboard after closure;
- validation stack listed below.

## Acceptance tests

Planned validation stack:

```text
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-ASSERTION-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-ASSERTION-1
npx.cmd jest --runInBand --runTestsByPath engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js
node build-scripts/sprints/check-task-family-assertion1.js
npm.cmd run check:platform
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/check-sprint-result.js reports/sprints/TASK-FAMILY-ASSERTION-1-result.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-ASSERTION-1 --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -C ../4veco-lessen diff --check
```

## Stop Conditions

Stop and revise before implementation if:

- the plan fails sprint-plan validation;
- the plan fails planning review;
- the implementation would require source exercise adoption or generated lesson
  output;
- assertion-reason tasks are framed as generic quiz variety rather than a
  reviewed relation-judgement action;
- feedback would imply diagnostics, misconception profiling, mastery,
  sequencing, or target-equivalent proof;
- `knowledge/exit-ticket-game-1.1.1.zip` changes;
- protected references, target registry records, candidate storage, source
  exit-ticket data, reasoning CSVs, or generated Book 1 output would need
  mutation.

## Human review required

No human review is required for this runtime-only implementation sprint.

Human review remains required later if `assertion_reason` is proposed for
generated product-route adoption, target-equivalent exit-ticket reliance,
reasoning migration reliance, first-three-paragraph product proof, or Scale
Gate 1.

## Lead Review Required

Lead review is required before sprint closure.

Lead review artifacts:

- `reports/sprints/TASK-FAMILY-ASSERTION-1-lead-review-assignment.md`
- `reports/sprints/TASK-FAMILY-ASSERTION-1-lead-review-round1.md`
- `reports/sprints/TASK-FAMILY-ASSERTION-1-lead-review-corrections.md`
- `reports/sprints/TASK-FAMILY-ASSERTION-1-lead-review-round2.md`

Round 1 must inspect runtime strictness, schema validation, feedback language,
wrapper delegation, rendered fixture proof, old archive no-change status, and
all forbidden-surface boundaries.

Round 2 must recheck corrections or confirm no blocking corrections were
required before final sprint closure.

## Rollback plan

Rollback by reverting the `TASK-FAMILY-ASSERTION-1` commit. Because this sprint
does not write source data, generated lesson output, protected references,
target registry records, candidate storage, or the old exit-ticket archive,
rollback does not require generated-output cleanup.

## Next Authorized Work After Closure

If this sprint closes PASS or PASS WITH FLAGS, the next authorized work is:

- `GATE-TASK-FAMILY-1` review preparation if the structured task-family lane is
  ready for product-route reliance review; or
- `GAME-ROUTE-AFFORDANCE-1` if the priority is actionable route items in
  non-exit practice games.

No product-route adoption, generated lesson output, target-equivalent reliance,
diagnostics, adaptive routing, mastery, sequencing, summative use, PV,
Scale Gate 1, or product-wide use is authorized by this sprint.
