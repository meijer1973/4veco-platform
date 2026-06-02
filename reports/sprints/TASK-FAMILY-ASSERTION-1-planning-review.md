# TASK-FAMILY-ASSERTION-1 Planning Review

Generated: 2026-06-02

Reviewer role: structural planning/review agent, review-only. No runtime code
was implemented or edited in this pass.

## Verdict

PASS WITH FLAGS.

Implementation may proceed. The plan is operational enough for a runtime-only
shared task-shell sprint and correctly preserves the product-boundary limits.
The carried flags below must remain visible during implementation, checker
design, lead review, and closure.

## Evidence inspected

- `../CLAUDE.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `reports/sprints/TASK-FAMILY-ASSERTION-1-plan.md`
- `reports/sprints/TASK-FAMILY-ASSERTION-1-baseline.md`
- `references/data/sprints/TASK-FAMILY-ASSERTION-1.plan.json`
- `reports/sprints/TASK-FAMILY-CHOICE-1-contract.md`
- `reports/json/task-family-choice-contract.json`
- `reports/sprints/TASK-FAMILY-TWO-TIER-1-result.md`
- `reports/sprints/TASK-FAMILY-TWO-TIER-1-lead-review-round2.md`
- `reports/json/task-family-two-tier1-proof.json`

## Findings

### 1. Quality floor and specification fulfilment: PASS

The plan states a real quality floor, not just a file checklist. It requires a
first-class deterministic `assertion_reason` family, visible assertion/reason
context, a labelled relation option group, selected relation state, one
combined feedback region, practice-only feedback, stable wrapper collection,
keyboard-operable controls, narrow/mobile fixture behavior, dark-mode styling,
and strict response-shape proof.

This matches the structured-choice contract and the product specs: structured
choice families are reviewed student actions, not quiz variety, and may not
replace calculation, graph/table, source-chain, constructed reasoning, or
target-equivalent proof unless the target action is genuinely choice-like.

### 2. Operational procedure and evidence: PASS

The plan has concrete implementation steps, allowed paths, forbidden paths,
required outputs, proof requirements, acceptance tests, lead-review artifacts,
rollback route, and stop conditions. It also explicitly requires planning
review before implementation and structural lead-review round 1 plus round 2
before closure.

The planned validation stack is complete enough for this sprint class:
sprint-plan check, sprint-bundle checks, focused Jest, custom sprint checker,
platform and scope-language checks, report JSON validation, roadmap/index
checks, result checks, diff checks, and map/dashboard refresh at closure.

### 3. Schema and response-shape plan: PASS WITH FLAGS

The plan operationalizes the accepted contract:

- interaction requires assertion label/text, reason label/text, option label,
  and relation options;
- every option requires `id`, `label`, and `description`;
- option ids must be unique non-empty strings;
- at least four options are required;
- expected shape is `{ kind: "assertion_reason", value: "optionId" }`;
- student response shape is exactly `{ value: "optionId" }`;
- raw strings, arrays, nested objects, non-string ids, unknown ids, missing
  keys, and extra response keys must not match;
- `partialFeedback` is practice-only and neutral.

Carried planning flag: implementation tests and the custom checker must make
these negative cases explicit, including missing `value`, raw string, raw
array, array-with-value, nested value, non-string value, unknown value,
extra keys, duplicate option ids, too few options, missing descriptions,
expected value outside the option bank, wrong `expected.kind`, and
non-`practice_only` feedback.

### 4. Product authority and forbidden surfaces: PASS

The plan and plan JSON correctly prohibit generated lesson output, source
exercise adoption, target-equivalent reliance, diagnostics, adaptive routing,
mastery, sequencing, student-facing AI, summative use, PV, Scale Gate 1, and
product-wide use. They also protect `references/machine/`,
`references/external/`, `source-data/book-1/exit-ticket/`,
`source-data/book-1/reasoning/`, generated Book 1 output, target-exercise
registry records, candidate storage, and
`knowledge/exit-ticket-game-1.1.1.zip`.

The old exit-ticket archive no-change requirement is explicit in the plan,
baseline, and plan JSON.

### 5. Learning-quality boundary: PASS WITH FLAGS

The plan does not downscope `assertion_reason` into generic quiz variety. It
frames the family as a sparse, reviewed, compact relation-judgement task for
cases where the student action is genuinely judging assertion correctness,
reason correctness, and explanatory relation.

Carried planning flag: lead review must reject any implementation evidence or
result language that presents `assertion_reason` as the default reasoning-game
format, a diagnostic/misconception profiler, or a replacement for constructed
reasoning and target-equivalent exit-ticket proof.

### 6. Roadmap alignment: PASS

Both roadmaps place `TASK-FAMILY-ASSERTION-1` after the higher-priority
structured choice families and before `GATE-TASK-FAMILY-1`. The next adoption
boundary is correctly preserved: `GATE-TASK-FAMILY-1` must inspect rendered
output, feedback, schema/validation, focus/keyboard behavior, and target-proof
boundaries before structured choice or construction families are relied on for
reasoning migration, check implementation, first-three-paragraph product proof,
or Scale Gate 1.

## Required corrections or carried flags

Required corrections before implementation: none.

Carried flags for implementation and lead review:

- Keep `assertion_reason` sparse and reviewed; do not let it become generic
  quiz variety or default reasoning-game format.
- Implement explicit negative coverage for strict response shape, option-bank
  validation, expected-shape validation, and practice-only feedback.
- Preserve runtime/report-fixture scope only; generated-route screenshots and
  product-route adoption remain later review work.
- Preserve old exit-ticket archive no-change evidence.
- Do not claim diagnostics, misconception profiling, mastery, sequencing,
  target-equivalent proof, reasoning migration reliance, Scale Gate 1, or
  product-wide authority.

## Validation note

Passed during planning review:

```text
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-ASSERTION-1-plan.md
OK sprint plan: reports\sprints\TASK-FAMILY-ASSERTION-1-plan.md
```

Passed during planning review:

```text
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-ASSERTION-1
OK sprint bundle: TASK-FAMILY-ASSERTION-1 planned/active
```

No implementation commands were run.

## Next action

Proceed to implementation of `TASK-FAMILY-ASSERTION-1` within the plan's
runtime-only scope. Stop and revise if implementation would require generated
lesson output, source-data adoption, old archive changes, product-route
adoption, target-equivalent reliance, diagnostic/misconception-profile output,
or any broader product authority.
