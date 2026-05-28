# Sprint MTU-H3C: Incidence Pass-Through Bounded CLI Execution

Date: 2026-05-28

Status: planned after GATE-MTU-H3B pass-with-conditions.

## Goal

Execute the GATE-MTU-H3B authorized bounded scope:

- add `D41` for tax wedge and `Pc`/`Pp` graphical labeling;
- add `D42` for tax burden amounts in euros, with no `D41` dependency;
- add `D43` for subsidy effective prices;
- add `D45` for qualitative relative-elasticity incidence explanation;
- add `D46` for cost-shock pass-through share;
- update `D07` to the narrowed tax afwentelingspercentage / percentage burden route;
- update authored target-exercise mappings for `3.1.1`, `3.1.2`, and `3.1.3`;
- refresh generated projections only after the authorized unit and mapping source mutations.

`D44` remains held and unmapped.

## Context

GATE-MTU-H3B closed as PASS WITH CONDITIONS and authorized this bounded
execution sprint. The reviewed remote commit is:

```text
ad7d69c3836176a10111384aeb640d49e93b705d
```

The closure authorizes execution only for the reviewed H3B command set and
conditions. It does not authorize hand edits to `references/machine` or
`references/external`, target-exercise promotion, candidate writes, lesson
output, diagnostics, adaptive routing, mastery/sequencing, student-facing AI,
summative use, PV projection, PV machine promotion, or student/product use.

## Quality Standard

The quality floor is exact, coupled execution of the reviewed specification
with command-output proof. Machine-reference changes must be produced through
the reference CLI only. Authored target-exercise changes must match the
reviewed before/after arrays exactly and must not alter status, source,
placeholder, paragraph metadata, or promotion fields.

No rendered output or student-facing route is part of this sprint. Generated
projections may refresh only after the source mutations they project. Any
unresolved issue must be recorded as a named follow-up rather than hidden in
the execution log, and every acceptance claim must have validator or test
proof.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| H3B closure authority | H3B closure record authorizes MTU-H3C execution | Preflight cites closure and reviewed commit | planned |
| Clean final preflight | `git status --short` is clean except known untracked zip | Execution log records status and remote hash | planned |
| `D41` add | `unit-add.js` with reviewed spec | `D41` depends on `D05`, not welfare-area units | planned |
| `D42` add | `unit-add.js` with reviewed spec adjusted to `zero_needs_status: true_zero` | `D42` has no `D41` dependency and records zero-needs rationale | planned |
| `D43` add | `unit-add.js` with reviewed spec | `D43` depends on `A41` and maps to subsidy effective prices | planned |
| `D45` add | `unit-add.js` with reviewed spec | `D45` keeps supply elasticity qualitative and visible | planned |
| `D46` add | `unit-add.js` with reviewed spec | `D46` uses cost shock as denominator and leaves `A93` unchanged | planned |
| `D07` update | `unit-update --dry-run` then CLI update | `D07` needs `D42`/`A38`, removes `A15`, and has no hidden elasticity explanation | planned |
| Mapping patch | update `course-target-exercises.json` arrays only | `3.1.1`, `3.1.2`, and `3.1.3` match reviewed after arrays; `D44` unmapped | planned |
| Projection refresh | refresh owned graph, RAG chunks, procedure/PV reports, and indexes after source mutations | Generated surfaces are downstream only; no PV machine promotion | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Execute `D42` as `true_zero` rather than `underbouw_assumed` | `include_now` | GATE-MTU-H3B preferred this wording and allowed the execution sprint to decide or fix the label. |
| Add a separate numeric supply-elasticity unit before `D45` | `defer_named_follow_up` | H3B accepted qualitative internal supply-elasticity reasoning for this sprint. |
| Mint or map `D44` now | `reject_scope_creep` | Current reviewed target evidence does not explicitly ask subsidy benefit-sharing. |

## Allowed paths

- `references/machine/micro-teaching-units.md`
- `references/machine/micro-teaching-units.json`
- `references/authored/course-target-exercises.json`
- generated owned-content graph, RAG chunks, procedure/PV reports, reference inventories, URL index, and GitHub indexes
- `build-scripts/references/execute-mtu-h3c-incidence-cli.js`
- `build-scripts/references/check-mtu-h3c-incidence-cli-execution.js`
- H3 lifecycle checkers needed for post-H3C state
- `reports/sprints/MTU-H3C-*`
- `references/data/sprints/MTU-H3C.*.json`
- roadmap, roadmap archive, and roadmap version index updates after execution

Machine reference changes must be produced only by `build-scripts/references`
CLI commands.

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- `D44` minting or mapping
- target-exercise promotion
- candidate-storage creation
- candidate writes
- lesson-output mutation
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, or student/product use

## Inputs

- GATE-MTU-H3B closure record
- `reports/mtu-hardening/mtu-h3b-incidence-cli-execution-packet.json`
- `references/machine/micro-teaching-units.json`
- `references/authored/course-target-exercises.json`
- `build-scripts/references/unit-update.js`
- `build-scripts/references/unit-add.js`
- `references/reference-team-roadmap.md`

## Outputs

- CLI-executed `D41`, `D42`, `D43`, `D45`, and `D46` additions;
- CLI-executed `D07` update after dry-run;
- exact authored mapping changes for `3.1.1`, `3.1.2`, and `3.1.3`;
- refreshed generated projections and indexes after source mutations;
- execution log, result log, diff summary, sprint JSON records, and post-H3C checker;
- no `D44` execution, no lesson output, no PV projection, and no student/product exposure.

## Operationalized sprint procedure

1. Commit and push this H3C plan/baseline before executing the bounded
   mutations.
2. Verify local and remote baseline: `git status --short`, `HEAD`, and
   `origin/main`; allow only the known untracked zip.
3. Fresh-check `D41`, `D42`, `D43`, `D45`, and `D46` are absent.
4. Fresh-check `D44` is absent and absent from the command set.
5. Fresh-check `D07`, `D05`, `A38`, `A41`, `A93`, and `A15` are present.
6. Extract reviewed specs from the H3B execution packet and write them to the
   execution log; adjust only `D42.zero_needs_status` to `true_zero` with the
   closure rationale.
7. Print every extracted spec before CLI execution.
8. Run `D07 unit-update --dry-run`; stop if `A15` remains, hidden elasticity
   remains, or `D42`/`A38` needs are not present.
9. Execute the unit commands in order: `D41`, `D42`, `D43`, `D45`, `D46`, then
   `D07`.
10. Apply only the reviewed target-exercise array updates for `3.1.1`,
    `3.1.2`, and `3.1.3`.
11. Verify no target-exercise status, source, placeholder, paragraph metadata,
    or promotion fields changed.
12. Refresh generated projections and indexes only after the source mutations.
13. Run H3 lifecycle checks, catalog/schema/target validations, projection
    checks, sprint checks, report JSON validation, Jest, and `git diff --check`.
14. Write result/diff logs and update the roadmap to the next operational
    action.
15. Stop and route a new human review if final preflight differs from the
    reviewed packet, if an ID collision appears, if mapping changes differ from
    the reviewed arrays, if `D44` becomes necessary, or if any product/PV/lesson
    boundary would be crossed.

## Acceptance tests

```bash
node build-scripts/references/check-mtu-h3c-incidence-cli-execution.js
node build-scripts/references/check-mtu-h3b-incidence-cli-execution-packet.js
node build-scripts/references/check-mtu-h3a-incidence-cli-mutation-plan.js
node build-scripts/references/check-mtu-h3-incidence-pass-through-review.js
node build-scripts/references/build-unit-index.js
node build-scripts/references/validate-core-schemas.js
node scripts/check-course-target-exercises-v5.js
node build-scripts/references/build-owned-content-graph.js
node build-scripts/references/check-owned-content-graph.js
node build-scripts/rag/build-chunks.js
node build-scripts/rag/validate-chunks.js
node build-scripts/references/build-procedure-visual-inventory.js
node build-scripts/references/check-procedure-visual-inventory.js
node build-scripts/references/build-procedure-visual-coverage.js
node build-scripts/references/check-procedure-visual-coverage.js
node build-scripts/sprints/check-sprint-plan.js reports/sprints/MTU-H3C-plan.md
node build-scripts/sprints/check-sprint-bundle.js MTU-H3C --complete
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/references/check-source-document-registry.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/reports/validate-report-json.js
npm.cmd test -- --runInBand
git diff --check
```

## Proof Required to Close

Proof required to close must include H3B closure proof, final preflight,
extracted-spec log, `D42` true-zero decision, CLI command log, `D07` dry-run
output, mapping before/after arrays, before/after diff, projection-refresh
evidence, validator output, test evidence, and explicit proof that no
candidate, lesson-output, promotion, PV projection, or product boundary was
crossed.

## Rollback plan

If execution fails before commit, restore only the H3C-affected CLI-generated,
authored, projection, and report diffs from the pre-execution commit. Do not
hand-edit `references/machine/`. If a newly minted unit must be removed after
commit, use a reviewed `unit-deprecate` or revert lane. `D44` must remain
absent during rollback.

## Human review required

No new human review is required before H3C execution because GATE-MTU-H3B
authorized this bounded execution sprint with conditions. Stop and route a new
review if final preflight differs from the reviewed packet, if any ID collision
appears, if `D07` would retain `A15` or hidden elasticity, if mapping changes
differ from the reviewed arrays, if `D44` becomes needed, or if any forbidden
product, lesson, candidate, PV, or student-facing boundary would be crossed.
