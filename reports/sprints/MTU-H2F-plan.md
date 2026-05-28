# Sprint MTU-H2F: Conditional Solo q1-q3 CLI Execution

Date: 2026-05-28

Status: planned after GATE-MTU-H2E pass-with-conditions.

## Goal

Execute the GATE-MTU-H2E reviewed CLI command set for `A12`, `A88`, `A89`,
`A90`, `A92`, and `A93` only, with `A20` held. The sprint must use the
reference CLI, print each reviewed JSON spec before execution, refresh
generator-readiness records, and prove no student-facing exposure for missing
generators.

## Context

GATE-MTU-H2E closed as PASS WITH CONDITIONS. It authorized a later bounded CLI
execution sprint for:

- `A12` update
- `A88` add
- `A89` add
- `A90` add
- `A92` add
- `A93` add

The reviewed remote commit is:

```text
52ffc484b270182964283e20cd696aca6ce5f9e6
```

`A20` remains held for a separate split/deprecate/replacement and
affected-mapping/generator packet.

## Quality Standard

The quality floor is that execution is successful only if the machine registry changes are produced by
the reference CLI, the reviewed specification matches the executed specs, the live
catalog validates after each execution phase, and generator-blocked status is
honest. The sprint must not expose missing generators in student-facing
skill-tree or PV routes. No rendered output, lesson output, target-exercise promotion,
candidate writes, diagnostics, adaptive routing, mastery/sequencing,
student-facing AI, summative use, PV projection, PV machine promotion, or
student/product use is part of this sprint. Any unresolved issue must be
recorded as an explicit follow-up rather than hidden in execution logs, and
every acceptance claim must have command-output proof.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Remote reviewed baseline | H2E closure records commit `52ffc484b270182964283e20cd696aca6ce5f9e6` | Preflight log cites reviewed commit | planned |
| A12 safe update | Run `unit-update --dry-run` first and then CLI update if dry-run passes | `A2.11` remains after execution | planned |
| A88/A89 zero-needs | Use reviewed `unit-add` specs with `zero_needs_status` and rationale | Validator accepts true-zero records | planned |
| A90 linear GO-rule | Use reviewed `unit-add` spec depending on `A89` only | No table/graph route hidden in procedure | planned |
| A92 dependency route | Add only after `A89` is present | Catalog validates dependency | planned |
| A93 price-change route | Use `A38`/`A92`, not `A66` | Incidence/pass-through remains MTU-H3 | planned |
| Generator boundary | Refresh generator-readiness records after new units | Missing generators are blocked/non-interactive and not exposed | planned |
| A20 hold | No `A20` command in execution log | Pre/post proof confirms A20 unchanged | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Print and compare every extracted spec before execution | `include_now` | GATE-MTU-H2E made extracted-spec logging a condition because `unit-add` has no dry-run. |
| Build `unit-add --dry-run` wrapper before execution | `defer_named_follow_up` | Useful CLI hygiene, but GATE-MTU-H2E accepted direct `unit-add` with exact spec logging and validation. |
| Implement `GEN_A88`/`GEN_A89`/`GEN_A90`/`GEN_A92`/`GEN_A93` now | `defer_or_route` | H2F is registry execution; missing generators are allowed only as generator-blocked/non-interactive with proof of non-exposure. |
| Include `A20` split in H2F | `reject_scope_creep` | GATE-MTU-H2E explicitly keeps `A20` held for a separate packet. |

## Allowed paths

- `references/machine/micro-teaching-units.md`
- `references/machine/micro-teaching-units.json`
- generator-readiness records/reports produced by reference scripts
- `build-scripts/references/execute-mtu-h2f-conditional-lanes.js`
- `reports/sprints/MTU-H2F-*`
- `references/data/sprints/MTU-H2F.*.json`
- roadmap/index updates after execution

Machine reference changes must be produced only by `build-scripts/references`
CLI commands.

## Forbidden paths

- hand edits to `references/machine/`
- `references/external/`
- direct `A20` execution
- candidate-storage creation
- candidate writes
- lesson-output mutation
- target-exercise promotion
- CP-6 or Year-1 closure
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, or student/product use

## Inputs

- GATE-MTU-H2E closure record
- GATE-MTU-H2E human-interview record
- `reports/mtu-hardening/solo-q1-q3-conditional-lane-execution-packet.json`
- `references/machine/micro-teaching-units.json`
- `engines/skilltree/generators.js`

## Outputs

- CLI-executed changes for `A12`, `A88`, `A89`, `A90`, `A92`, and `A93`;
- refreshed generator-readiness records/reports;
- sprint preflight/result/diff logs;
- no lesson output and no student-facing exposure.

## Operationalized sprint procedure

1. Verify remote and local baseline: `git status --short`, reviewed commit, and
   current `origin/main`.
2. Fresh-check `A88`, `A89`, `A90`, `A92`, and `A93` are absent.
3. Fresh-check `A12` and `A20` are present.
4. Extract reviewed specs from the H2E execution packet and print each spec to
   the preflight/execution log.
5. Confirm no `A20` command exists in the command set.
6. Run `A12` `unit-update --dry-run`; stop if `A2.11` would be removed.
7. Execute the reviewed CLI command set in dependency order:
   `A12`, `A88`, `A89`, `A90`, `A92`, `A93`.
8. Run unit-index/schema validation.
9. Refresh and check skill-tree generator readiness.
10. Prove missing generators for `A88`, `A89`, `A90`, `A92`, and `A93` are
    generator-blocked/not-yet-interactive or otherwise not exposed.
11. Run H2E/H2D lifecycle checks, report JSON validation, Jest, and
    `git diff --check`.
12. Write result/diff logs and update roadmap/indexes.
13. If any stop condition requires a new human gate, show each calibration question,
    record each answer, run pattern analysis, ask targeted
    follow-ups, draft a closure proposal, and require explicit human confirmation
    before continuing.

## Acceptance tests

```bash
node build-scripts/references/check-mtu-h2e-conditional-lane-execution-packet.js
node build-scripts/references/build-unit-index.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/references/build-skilltree-generator-readiness.js
node build-scripts/references/check-skilltree-generator-readiness.js
node build-scripts/references/check-mtu-h2d-held-conditional-resolution.js
node build-scripts/sprints/check-sprint-plan.js reports/sprints/MTU-H2F-plan.md
node build-scripts/sprints/check-sprint-bundle.js MTU-H2F
node build-scripts/reports/validate-report-json.js
npm.cmd test -- --runInBand
git diff --check
```

## Proof Required to Close

Proof required to close must include closure proof from GATE-MTU-H2E review,
final preflight, extracted-spec log, CLI command log, before/after diff,
generator-readiness proof, validator output, test evidence, and explicit proof
that no `A20`, candidate, lesson-output, target-exercise, or product boundary
was crossed.

## Rollback plan

If a command fails before commit, restore only the affected CLI-generated diffs
from the pre-execution commit. If a newly minted unit is later rejected after
commit, use a reviewed `unit-deprecate` or revert lane; do not hand-edit
`references/machine/`. If `A12` update is rejected, rerun `unit-update` with
the previous reviewed `A12` JSON patch or revert the execution commit.

## Human review required

No new human review is required before H2F execution because GATE-MTU-H2E
authorized the bounded execution sprint with conditions. Stop and route a new
review if final preflight differs from the reviewed command set, if any ID
collision appears, if `A12` would lose `A2.11`, if `A20` must be touched, or if
generator-blocked non-exposure cannot be proven.
