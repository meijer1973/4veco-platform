# Sprint MTU-H2J: A20/A94/A95 Bounded CLI Execution

Date: 2026-05-28

Status: planned after GATE-MTU-H2I pass-with-conditions.

## Goal

Execute the GATE-MTU-H2I authorized bounded scope:

- update `A20` to the narrowed derived-MO plus derived-MK route;
- add `A94` for price-taker `MO = P` plus derived MK;
- add `A95` for given MK-function solving;
- update authored target-exercise mappings for `3.2.2` and `4.1.2` while
  verifying `3.3.3` remains unchanged;
- move current `GEN.A20` behavior to `GEN.A95` and block `GEN.A20` until a
  narrowed derive-both generator exists;
- refresh generator-readiness and generated projections only after the
  authorized source mutations.

## Context

GATE-MTU-H2I closed as PASS WITH CONDITIONS and authorized this bounded
execution sprint. The reviewed remote commit is:

```text
1fb0b95fc6b031f37ff780fb3db063dd9deb7d25
```

This sprint is the first sprint in the A20 lane that may mutate the protected
machine MTU registry, authored target-exercise mappings, and the skill-tree
generator source. It must keep those changes coupled. Partial execution is a
stop condition.

## Quality Standard

The quality floor is that execution is successful only if the reviewed H2I
specification is executed exactly:

- machine-reference changes are produced through the reference CLI;
- authored target-exercise changes match the reviewed before/after arrays
  exactly;
- generator changes match the reviewed route and are logged before mutation;
- `A20`, target mappings, and generator readiness cannot become stale relative
  to each other;
- no lesson output, target-exercise promotion, PV projection, PV machine
  promotion, diagnostics, adaptive routing, mastery/sequencing,
  student-facing AI, summative use, or student/product use occurs.

No rendered output or student-facing route is part of this sprint. Any
unresolved issue must be recorded as a named follow-up rather than hidden in
the execution log, and every acceptance claim must have command-output proof.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| H2I closure authority | H2I closure record authorizes H2J | Preflight cites closure and reviewed commit | planned |
| Clean final preflight | `git status --short` is clean except known untracked zip | Execution log records status | planned |
| `A20` update | `unit-update --dry-run` then CLI update | `A2.11` remains and A20 has reviewed spec | planned |
| `A94` add | `unit-add.js` with reviewed spec | A94 has price-taker `MO = P` step and no `A12` need | planned |
| `A95` add | `unit-add.js` with reviewed spec | A95 remains distinct from A91 and carries given MK-function route | planned |
| Mapping patch | update `course-target-exercises.json` arrays only | `3.2.2` and `4.1.2` match reviewed after arrays; `3.3.3` unchanged | planned |
| Generator route | move `GEN.A20` body to `GEN.A95`; remove/disable `GEN.A20` | A20 and A94 are generator-blocked; A95 implemented; no stale exposure | planned |
| Projection refresh | refresh generator readiness, owned graph, RAG chunks, PV/procedure reports | refresh happens only after source mutations | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Print every extracted unit spec before CLI execution | `include_now` | H2I made this a hard execution condition. |
| Print exact mapping arrays and generator patch summary before source writes | `include_now` | Prevents partial or invisible mutation. |
| Implement a new narrowed `GEN.A20` now | `defer_named_follow_up` | H2I accepted blocking `GEN.A20` after moving current behavior to `GEN.A95`. |
| Implement `GEN.A94` now | `defer_named_follow_up` | H2I accepted `A94` as generator-blocked/not-yet-interactive unless separately implemented. |
| Refresh PV machine projections | `reject_scope_creep` | PV projection and PV machine promotion remain unauthorized. |

## Allowed paths

- `references/machine/micro-teaching-units.md`
- `references/machine/micro-teaching-units.json`
- `references/authored/course-target-exercises.json`
- `engines/skilltree/generators.js`
- generated generator-readiness reports
- generated owned-content graph and RAG chunks
- generated procedure/PV reports, without PV machine promotion
- `build-scripts/references/execute-mtu-h2j-a20-a94-a95.js`
- `build-scripts/references/check-mtu-h2j-a20-a94-a95-execution.js`
- `reports/sprints/MTU-H2J-*`
- `references/data/sprints/MTU-H2J.*.json`
- roadmap/index updates after execution

Machine reference changes must be produced only by `build-scripts/references`
CLI commands.

## Forbidden paths

- hand edits to `references/machine/`
- `references/external/`
- target-exercise promotion
- candidate-storage creation
- candidate writes
- lesson-output mutation
- CP-6 or Year-1 closure
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, or student/product use

## Inputs

- H2I gate closure record
- H2I human review record
- `reports/mtu-hardening/solo-q1-q3-a20-cli-execution-packet.json`
- `references/machine/micro-teaching-units.json`
- `references/authored/course-target-exercises.json`
- `engines/skilltree/generators.js`

## Outputs

- CLI-executed `A20` update and `A94`/`A95` additions;
- exact authored mapping changes for `3.2.2` and `4.1.2`;
- `GEN.A95` implementation copied from current `GEN.A20` behavior and
  `GEN.A20` blocked until a narrowed generator exists;
- refreshed generator-readiness and projection reports;
- sprint preflight/execution/result/diff logs;
- no lesson output and no student/product exposure.

## Operationalized sprint procedure

1. Commit/push the H2I closure and this H2J plan before execution.
2. Verify local and remote baseline: `git status --short`, reviewed commit,
   and `origin/main`.
3. Fresh-check `A94` and `A95` are absent.
4. Fresh-check `A20`, `A91`, `A12`, `A13`, and `A02` are present.
5. Fresh-check `GEN.A20` exists and `GEN.A94`/`GEN.A95` do not exist.
6. Extract reviewed specs from the H2I execution packet and write them to the
   execution log.
7. Run `A20` `unit-update --dry-run`; stop if `A2.11` would be removed.
8. Execute the unit commands in order: `A20`, `A94`, `A95`.
9. Apply only the reviewed target-exercise array updates for `3.2.2` and
   `4.1.2`; verify `3.3.3` unchanged.
10. Move current `GEN.A20` body to `GEN.A95`; remove/disable `GEN.A20`;
    leave `GEN.A94` absent unless separately implemented.
11. Run unit-index/schema/target-exercise validation.
12. Refresh generator readiness and prove no stale/missing interactive
    exposure.
13. Refresh generated projections after the source mutations.
14. Run H2 lifecycle checks, sprint checks, report JSON validation, Jest, and
    `git diff --check`.
15. Write result/diff logs and update roadmap/indexes.
16. If any stop condition requires a new human review gate, show all
    calibration questions before binding answers, record each answer, run
    pattern analysis, ask targeted follow-ups, draft a closure proposal, and
    require explicit human confirmation before continuing.

## Acceptance tests

```bash
node build-scripts/references/check-mtu-h2j-a20-a94-a95-execution.js
node build-scripts/references/check-mtu-h2i-a20-cli-execution-packet.js
node build-scripts/references/check-mtu-h2h-a20-cli-mutation-plan.js
node build-scripts/references/check-mtu-h2g-a20-split-packet.js
node build-scripts/references/build-unit-index.js
node build-scripts/references/validate-core-schemas.js
node scripts/check-course-target-exercises-v5.js
node build-scripts/references/build-skilltree-generator-readiness.js
node build-scripts/references/check-skilltree-generator-readiness.js
node build-scripts/references/build-owned-content-graph.js
node build-scripts/references/check-owned-content-graph.js
node build-scripts/rag/build-chunks.js
node build-scripts/references/build-procedure-visual-inventory.js
node build-scripts/references/check-procedure-visual-inventory.js
node build-scripts/sprints/check-sprint-plan.js reports/sprints/MTU-H2J-plan.md
node build-scripts/sprints/check-sprint-bundle.js MTU-H2J --complete
node build-scripts/reports/validate-report-json.js
npm.cmd test -- --runInBand
git diff --check
```

## Proof Required to Close

Proof required to close must include H2I closure proof, final preflight,
extracted-spec log, CLI command log, mapping before/after arrays, generator
patch summary, before/after diff, generator-readiness proof, validator output,
test evidence, projection-refresh evidence, and explicit proof that no
candidate, lesson-output, promotion, PV projection, or product boundary was
crossed.

## Rollback plan

If execution fails before commit, restore only the affected CLI-generated,
authored, generator, and projection diffs from the pre-execution commit. Do
not hand-edit `references/machine/`. If a newly minted unit is later rejected
after commit, use a reviewed `unit-deprecate` or revert lane. If the generator
move is rejected before commit, restore the previous `GEN.A20` body and remove
`GEN.A95`.

## Human review required

No new human review is required before H2J execution because GATE-MTU-H2I
authorized this bounded execution sprint with conditions. Stop and route a new
review if final preflight differs from the reviewed packet, if any ID collision
appears, if `A20` would lose `A2.11`, if mapping changes differ from the
reviewed arrays, if the generator route cannot be applied exactly, or if
generator-blocked non-exposure cannot be proven.
