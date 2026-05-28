# Sprint MTU-H2C: Reduced-Scope Solo q1-q3 CLI Execution Preflight

Date: 2026-05-28

Status: planned after GATE-MTU-H2B partial pass.

## Goal

Prepare and, only after final preflight, execute a reduced Solo q1-q3 CLI
mutation scope that respects the GATE-MTU-H2B partial-pass conditions. The
sprint must not run H2B as-is. It must exclude `A12` and `A20` unless a later
reviewed packet resolves their blockers, and it must resolve the `A92`/`A89`
dependency before executing either lane.

## Context

GATE-MTU-H2B closed as PARTIAL PASS WITH CONDITIONS. It accepted the H2B
packet as strong enough to continue, but not strong enough to authorize the
full execution-ready set as written.

Binding gate results:

- clean after final preflight: `F19`, `F20`, `A85`, `A86`, `A87`, `A91`;
- `A92` requires dependency resolution because the reviewed spec depends on
  `A89`;
- conditional or revise first: `A88`, `A89`, `A90`, `A93`;
- held: `A12` until `A2.11` is retained or removal is explicitly justified;
- held: `A20` until split/replacement and affected mappings are handled.

## Quality Standard

The specification is the GATE-MTU-H2B closure. The quality floor is that the
sprint can prove the executed scope is exactly the reduced authorized scope,
that every extracted JSON spec was echoed before execution, and that no held or
conditional lane slipped in by accident.

There is no rendered output and no student-facing surface. Proof must come
from preflight logs, CLI output, validator output, post-execution diffs, and a
clear follow-up list for held lanes.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Final collision check | Fresh live-registry check for `F19`, `F20`, `A85-A93` | Preflight log before any command | planned |
| Held lanes excluded | `A12` and `A20` not in command sequence | Command log and post-execution diff | planned |
| Dynamic spec logging | Echo extracted JSON spec before each CLI command | Captured execution log | planned |
| `A92` dependency resolved | Include/accept `A89`, revise `A92`, or hold `A92` | Explicit decision before execution | planned |
| Conditional lanes handled | `A88`, `A89`, `A90`, `A93` either explicitly accepted, revised, or held | Preflight decision table | planned |
| Protected surfaces safe | CLI writes only authorized machine MTU files | Git diff and no-unintended-diff proof | planned |
| Post-execution validation | Unit index, schemas, H2/H2A/H2B checks, reports, health, Jest | Passing command log | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Execute only `F19`, `F20`, `A85`, `A86`, `A87`, `A91` first | `include_now` | This is the cleanest subset after GATE-MTU-H2B. |
| Add `A89` and `A92` together if dependency risk is explicitly accepted | `defer_named_follow_up` | `A92` cannot validate without `A89` under the reviewed spec. |
| Revise `A12` before execution | `defer_named_follow_up` | A12 needs an update spec that retains `A2.11`. |
| Execute `A20` | `reject_scope_creep` | A20 is held by active given-MK usage in target exercise `4.1.2`. |
| Execute H2B's full command set as written | `reject_scope_creep` | The human gate explicitly rejected full execution as written. |

## Allowed paths

- `reports/sprints/MTU-H2C-plan.md`
- `references/data/sprints/MTU-H2C.plan.json`
- future MTU-H2C baseline/result/diff logs;
- the CLI-mutated MTU machine files only if final preflight authorizes the
  reduced exact scope:
  - `references/machine/micro-teaching-units.md`
  - `references/machine/micro-teaching-units.json`
- generated reports, dashboard data, source registry, source manifest,
  document inventory, URL index, and agent indexes after execution.

## Forbidden paths

- `references/external/`
- hand edits to `references/machine/`
- `A12` execution unless a revised spec retains `A2.11` or a later gate
  explicitly authorizes removal;
- `A20` execution;
- candidate-storage creation;
- candidate writes;
- operation-registry mutation;
- answer-skill mutation;
- lesson-output mutation;
- target-exercise promotion;
- CP-6 or Year-1 closure;
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, or student/product use.

## Inputs

- GATE-MTU-H2B closure and human-review records under
  `reports/review-gates/GATE-MTU-H2B-cli-execution/`
- `reports/mtu-hardening/solo-q1-q3-cli-execution-gate-packet.json`
- `reports/mtu-hardening/solo-q1-q3-cli-mutation-plan.json`
- `references/machine/micro-teaching-units.json` as live preflight context
- `build-scripts/references/unit-add.js`
- `build-scripts/references/unit-update.js`

## Outputs

- MTU-H2C preflight and execution logs if execution proceeds;
- updated machine MTU files only for the reduced authorized scope if execution
  proceeds;
- updated reports and generated indexes after validation;
- no generated lesson output.

## Operationalized sprint procedure

1. Read GATE-MTU-H2B closure and H2B packet.
2. Record baseline: git status, current commit, proposed ID availability,
   `A12`/`A20` existence, and absence of candidate-storage files.
3. Decide exact reduced scope:
   - always exclude `A12` and `A20`;
   - execute clean lanes only unless a conditional lane is explicitly accepted
     or revised in the preflight log;
   - do not execute `A92` unless `A89` is included/accepted, `A92` is revised,
     or `A92` is held.
4. Echo the extracted JSON spec before every CLI command.
5. Run the exact CLI commands only for the reduced authorized scope.
6. Run unit-index, schema, H2/H2A/H2B, report, reference-health, Jest, and git
   diff validation.
7. Record result, diff summary, and held-lane follow-ups.
8. Stop and route a new review if preflight discovers a changed registry state,
   a stale reviewed plan file, hidden `A12`/`A20` execution, or unexpected
   lesson/candidate/external-source diff.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/MTU-H2C-plan.md
node build-scripts/sprints/check-sprint-bundle.js MTU-H2C
node build-scripts/references/check-mtu-h2b-cli-execution-gate-packet.js
node build-scripts/references/check-mtu-h2a-cli-mutation-plan.js
node build-scripts/references/check-mtu-h2-solo-cases.js
node build-scripts/references/build-unit-index.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
npm.cmd test -- --runInBand
git diff --check
```

## Proof Required to Close

Proof required to close must include preflight log, exact command log, echoed
specs, post-execution diff, validator/test evidence, and a clear statement that
`A12` and `A20` were not executed. If `A92` executes, the proof must explain
how the `A92`/`A89` dependency was resolved.

## Rollback plan

If execution runs and validation fails, revert the execution commit before any
dependent work proceeds. If a lane is semantically rejected after execution but
validators pass, route a reviewed CLI deprecation/rollback lane rather than
hand-editing machine references.

## Human review required

GATE-MTU-H2B supplied the human authority for reduced-scope continuation. A new
human review is required if MTU-H2C expands beyond the reduced scope, executes
`A12`, executes `A20`, mutates target-exercise mappings, or authorizes any
student/product use.
