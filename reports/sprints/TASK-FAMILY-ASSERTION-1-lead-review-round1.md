# Lead Review Summary

Sprint: `TASK-FAMILY-ASSERTION-1`

Round: lead review round 1

## Scope

Evidence inspected: `reports/sprints/TASK-FAMILY-ASSERTION-1-lead-review-assignment.md`,
`reports/sprints/TASK-FAMILY-ASSERTION-1-plan.md`,
`reports/sprints/TASK-FAMILY-ASSERTION-1-baseline.md`,
`reports/sprints/TASK-FAMILY-ASSERTION-1-planning-review.md`,
`references/data/sprints/TASK-FAMILY-ASSERTION-1.plan.json`,
`reports/sprints/TASK-FAMILY-CHOICE-1-contract.md`,
`reports/json/task-family-choice-contract.json`,
`engines/task-shell-engine.js`, `engines/task-shell-ui.js`,
`engines/task-shell.css`, `engines/exit-ticket-ui.js`,
`engines/skilltree-ui.js`, `engines/graphical-ui.js`,
`engines/tests/task-shell-engine.test.js`,
`engines/tests/task-shell-ui.test.js`,
`engines/tests/exit-ticket-ui.test.js`,
`engines/tests/skilltree-ui.test.js`,
`engines/tests/graphical-ui.test.js`,
`build-scripts/sprints/check-task-family-assertion1.js`,
`reports/json/task-family-assertion1-proof.json`,
`reports/sprints/TASK-FAMILY-ASSERTION-1-rendered-fixture.html`,
`reports/sprints/TASK-FAMILY-ASSERTION-1-screenshot-manifest.md`, and
the tracked old archive `knowledge/exit-ticket-game-1.1.1.zip`.

Reviewed the implemented runtime-only `assertion_reason` shared task-shell
family. This review does not authorize generated lesson output, source-data
adoption, product-route adoption, target-equivalent reliance, diagnostics,
adaptive routing, mastery, sequencing, student-facing AI, summative use, PV,
Scale Gate 1, or product-wide use.

## Review Plan

| Review/Test | Agent or tool | Required evidence | Status |
|---|---|---|---|
| Contract and learning-quality review | lead reviewer agent | `assertion_reason` remains a sparse reviewed relation-judgement action, not quiz variety or default reasoning format | PASS |
| Runtime engine review | lead reviewer agent | First-class deterministic family, required assertion/reason text, relation option validation, expected value validation, exact relation matching | PASS |
| Strict negative coverage review | lead reviewer agent plus checker/tests | Missing/empty value, wrong relation, raw string, raw array, array-with-value, nested value, non-string value, alternate key, unknown option, and extra keys reject | PASS |
| UI/accessibility review | lead reviewer agent | Assertion/reason panel, labelled relation group, selected summary, focus selectors, one feedback region, narrow/dark fixture proof | PASS WITH FLAGS |
| Wrapper review | lead reviewer agent | Exit-ticket, skilltree, and graph wrappers delegate collection and click handling through shared `TaskShellUI` helpers | PASS |
| Product-boundary review | proof JSON, git status, scope-language check | No generated output, source data, protected references, old archive mutation, diagnostics, mastery, sequencing, PV, Scale Gate 1, or product authority | PASS |
| Validation stack | focused Jest, custom checker, bundle checks, scope/report/diff checks | Required focused commands pass | PASS |

## Consolidated Verdict

Verdict: PASS WITH FLAGS

No blocking findings. The implementation satisfies the accepted runtime scope:
`assertion_reason` is first-class, deterministic, strict-shape,
relation-judgement specific, wrapper-delegated, rendered in a report fixture,
and practice-only.

Carried flags:

- Runtime proof is report-fixture proof only; generated-route screenshots and
  browser inspection remain deferred until later product-route adoption review
  or `GATE-TASK-FAMILY-1`.
- `assertion_reason` may support sparse reviewed practice/advisory
  relation-judgement tasks, but does not authorize target-equivalent proof,
  constructed-response substitution, reasoning migration reliance, check
  implementation reliance, diagnostics, mastery, sequencing, PV, Scale Gate 1,
  or product-wide use.
- Feedback may show selected relation and expected relation in neutral
  practice-only terms, but may not become diagnostic, misconception-profile,
  mastery, sequencing, or target-equivalent output.
- Final closure still needs the normal closure artifacts that are outside this
  assignment's inspected evidence, including correction log, round-2 recheck,
  result markdown/JSON, diff summary, roadmap/index/dashboard refresh as
  applicable, and complete bundle validation.

## Blocking Findings

None.

## Specialist Findings

Contract and learning-quality boundary: PASS. The sprint plan, proof JSON, and
implementation frame `assertion_reason` as a compact relation judgement over a
visible assertion and reason. The proof explicitly records that it is not
generic quiz variety, not a constructed-reasoning replacement, not a
target-equivalent substitute, and not the default reasoning-game format.

Runtime/schema validation: PASS. `engines/task-shell-engine.js` declares
`assertion_reason` as deterministic. Validation requires
`assertionLabel`, `assertionText`, `reasonLabel`, `reasonText`,
`optionLabel`, at least four relation options, non-empty option `id`, `label`,
and `description`, unique option ids, `expected.kind: "assertion_reason"`,
and an expected value from the relation option bank. Non-`practice_only`
partial feedback is rejected.

Strict response matching: PASS. Matching requires the exact response object
`{ value: optionId }` with exactly one key. It rejects raw strings, raw arrays,
array-with-value, nested object values, non-string values, missing values,
empty values, alternate-key responses, unknown option ids, and extra response
keys. Wrong relation ids produce retry state and neutral practice feedback.

Feedback boundary: PASS. `assertionReasonFeedback` is emitted only when
`partialFeedback` is `practice_only` and the answer is not matched. It reports
selected relation, expected relation, and relation match state without
diagnostic labels, misconception profiles, mastery state, sequencing state, or
target-equivalent claims.

UI/accessibility: PASS WITH FLAGS. `engines/task-shell-ui.js` renders a
specific assertion/reason panel, relation option buttons with `aria-pressed`,
a labelled `role="group"`, assertion-specific selectors, selected relation
summary, and assertion-specific feedback. The screenshot manifest documents
standard, narrow/mobile, dark, after-click, and feedback fixture states. The
remaining flag is proof scope: this is report-fixture proof, not generated
student-route proof.

Wrapper delegation: PASS. Exit-ticket, skilltree, and graphical wrappers
collect `assertion_reason` responses through `TaskShellUI` and delegate click
handling through the shared helper. The custom checker and focused tests cover
these wrapper fragments.

Product boundaries and archive: PASS. Proof JSON records no generated lesson
output, no source data changes, no protected-reference changes, no
target-exercise registry changes, no candidate storage, no old exit-ticket
archive change, and no product authority. Git boundary checks reported no
changes under `knowledge/exit-ticket-game-1.1.1.zip`, `source-data`,
`references/machine`, `references/external`, or generated Book 1 lesson output.
The old archive remains tracked.

## Test Evidence

Passed:

```text
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-ASSERTION-1-plan.md
OK sprint plan: reports\sprints\TASK-FAMILY-ASSERTION-1-plan.md
```

Passed:

```text
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-ASSERTION-1
OK sprint bundle: TASK-FAMILY-ASSERTION-1 planned/active
```

Passed:

```text
npx.cmd jest engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js --runInBand
Test Suites: 5 passed, 5 total
Tests: 73 passed, 73 total
```

Passed:

```text
node build-scripts/sprints/check-task-family-assertion1.js
TASK-FAMILY-ASSERTION-1 check OK
```

Additional checks passed:

```text
npm.cmd run check:scope-language
OK scope-language check: active surfaces

node build-scripts/reports/validate-report-json.js
OK report JSON contract: 14 report(s)

git diff --check
```

`git diff --check` exited 0 with line-ending warnings only.

Passed:

```text
git -C ../4veco-lessen diff --check
```

Boundary checks:

```text
git status --short -- knowledge/exit-ticket-game-1.1.1.zip source-data references/machine references/external
git -C ../4veco-lessen status --short -- "Boek 1 - Grondslagen, vraag en aanbod"
git ls-files --error-unmatch knowledge/exit-ticket-game-1.1.1.zip
```

No platform protected/source/archive changes or generated Book 1 lesson-output
changes were reported, and `knowledge/exit-ticket-game-1.1.1.zip` remains
tracked.

## Learning Quality Evidence

The family asks students to judge a visible assertion and visible reason as a
single relation. That is a bounded, reviewed relation-judgement action, not a
generic single-answer quiz. The implementation remains suitable for sparse
practice/advisory use where the target action is genuinely assertion-reason
judgement, and it correctly avoids claiming constructed reasoning,
target-equivalent proof, diagnostic profiling, or sequencing authority.

## Student Experience Evidence

The rendered fixture shows the student-facing structure required for runtime
proof: assertion card, reason card, relation option group, selected relation
summary, after-click selected state, one practice-only feedback block,
narrow/mobile proof note, and dark-mode proof note. Relation options are
keyboard-operable buttons with selected state via `aria-pressed`; the option
group and feedback have accessible labels.

## Ownership and Handoff

The shared task-shell engine owns schema validation, deterministic matching,
focus plan, and practice-only feedback. `TaskShellUI` owns assertion/reason
rendering, relation option selection, response collection, summary updates,
and feedback rendering. Exit-ticket, skilltree, and graphical surfaces remain
thin wrappers that consume shared helpers.

No implementation blocker remains from lead-review round 1. The carried flags
must remain visible in the correction log, round-2 recheck, result, and closure
records.

## Required Next Action

Record the correction log. Because round 1 found no blocking findings, the
correction log may state that no runtime/test/checker corrections are required
and carry the PASS WITH FLAGS conditions forward. Then request lead-review
round 2 before sprint closure. Do not start product-route adoption, generated
lesson output, source-data adoption, reasoning migration reliance,
target-equivalent reliance, diagnostics, mastery, sequencing, PV, Scale Gate 1,
or product-wide use from this sprint.
