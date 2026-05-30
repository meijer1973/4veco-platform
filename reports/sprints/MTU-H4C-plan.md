# Sprint MTU-H4C: Answer-Form Bounded CLI Execution

Date: 2026-05-30

Status: planned after GATE-MTU-H4B pass-with-conditions.

## Goal

Execute the GATE-MTU-H4B authorized bounded answer-form scope:

- add `A96` for `ANS_BEREKEN`;
- add `A97` for `ANS_LEG_UIT_DAT`;
- add `A98` for `ANS_LEG_UIT_OF`;
- add `A99` for `ANS_LEG_UIT_MET_VOORBEELD`;
- add `A80` for `ANS_NOEM_GEEF_AAN`, with split-if-needed condition;
- add `A81` for `ANS_BRON_GEBRUIKEN`, only as source-use modifier plus an
  underlying answer form.

The sprint may mutate only the MTU catalog through the reviewed `unit-add.js`
commands. It must not write target-exercise fields, candidate storage,
projections as a source-mutation side effect, lesson output, or
student/product-facing routes.

## Context

GATE-MTU-H4B closed as PASS WITH CONDITIONS and authorized this bounded
execution sprint. The reviewed remote commit is:

```text
f59c83a7067678aa3ff2c4bab4455ab9d90d72af
```

The closure authorizes only `MTU-H4C` execution of the reviewed H4B command
set and conditions. It does not authorize hand edits to `references/machine` or
`references/external`, candidate storage creation, candidate writes,
target-exercise `question_type` or `answer_form` writes, lesson output,
diagnostics, adaptive routing, mastery/sequencing, student-facing AI,
summative use, PV projection, PV machine promotion, Scale Gate 1, or
student/product use.

## Quality Standard

The quality floor is exact CLI execution of the reviewed specification with
command-output proof, post-execution catalog validation, and no student-facing
exposure. Machine-reference changes must be produced through `unit-add.js`
only, never by hand. Because these answer-form units declare generators that
are not expected to exist yet, rendered output proof means proving the units
are generator-blocked or non-interactive and cannot leak into student-facing
skill-tree, PV, lesson, diagnostic, adaptive, mastery, sequencing, AI,
summative, or product routes.

Any unresolved issue must become a named follow-up, not a hidden acceptance
gap. The sprint may leave graph/draw/shade, Type 4 motiveer/classificatie, and
analysis/evaluation held; it may not resolve those lanes silently.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| H4B closure authority | H4B closure record authorizes `MTU-H4C` bounded execution | Preflight cites closure and reviewed commit | planned |
| Clean final preflight | `A80`, `A81`, and `A96`-`A99` absent; `A71` held; `A100` invalid; candidate storage absent; target fields absent | Baseline and execution log record the checks | planned |
| Exact command execution | Execute only reviewed `unit-add` specs and hashes from H4B | Execution log prints each spec, command hash, stdout, and order | planned |
| Protected mutation by CLI only | `references/machine/micro-teaching-units.md` and `.json` change only through `unit-add.js` | Diff and execution log show no hand edits | planned |
| Generator exposure block | Rebuild/check generator readiness after minting | `GEN_A80`, `GEN_A81`, and `GEN_A96`-`GEN_A99` are implemented or generator-blocked/non-interactive with no exposed blocked routes | planned |
| Boundary preservation | No target-exercise fields, candidate storage/writes, projections as source side effects, lesson output, or product use | Validators, git diff, and result log prove forbidden surfaces stay untouched | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Use a bounded execution helper that reads the reviewed packet and verifies command hashes before running `unit-add.js` | `include_now` | Reduces risk of a copied command drifting from the reviewed packet. |
| Rebuild generator readiness immediately after minting | `include_now` | GATE-MTU-H4B identified premature exposure as the main risk. |
| Decide a future A-domain namespace or ID policy now | `defer_named_follow_up` | The closure requires future policy before additional A-domain growth, but H4C only executes the bounded accepted allocation. |
| Mint graph/draw/shade, Type 4, or analysis/evaluation lanes | `reject_scope_creep` | These lanes remain held pending stronger evidence or a separate gate. |

## Allowed paths

- `references/machine/micro-teaching-units.md`
- `references/machine/micro-teaching-units.json`
- `build-scripts/references/execute-mtu-h4c-answer-form-cli.js`
- `build-scripts/references/check-mtu-h4b-answer-form-cli-execution-packet.js`
- `reports/sprints/MTU-H4C-*`
- `references/data/sprints/MTU-H4C.*.json`
- generator-readiness reports and generator-block records required to prove
  non-exposure
- roadmap, roadmap archive, roadmap version index, generated indexes,
  source/document inventories, URL index, and GitHub agent index updates after
  execution

Machine reference changes must be produced only by `build-scripts/references`
CLI commands.

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- `A71` consumption
- `A100` use as a valid ID
- graph/draw/shade, Type 4 motiveer/classificatie, or analysis/evaluation lane
  minting
- treating `A81`/`bron` as a standalone complete answer form
- target-exercise `question_type` or `answer_form` writes
- answer-skill candidate storage creation or writes
- generated projection refresh as a source mutation side effect
- lesson-output mutation
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, Scale Gate 1, or
  student/product use

## Inputs

- GATE-MTU-H4B closure record
- `reports/mtu-hardening/mtu-h4b-answer-form-cli-execution-packet.json`
- GATE-MTU-H4A closure record
- `reports/mtu-hardening/mtu-h4a-answer-form-cli-mutation-plan.json`
- `references/machine/micro-teaching-units.json`
- `references/authored/course-target-exercises.json`
- `references/data/exam-ingestion/operation-answer-skill-contract.json`
- `build-scripts/references/unit-add.js`
- `build-scripts/references/build-unit-index.js`
- `reports/json/skilltree-generator-readiness.json`
- `references/reference-team-roadmap.md`

## Outputs

- CLI-executed `A96`, `A97`, `A98`, `A99`, `A80`, and `A81` additions;
- execution log with final preflight, extracted specs, command hashes, command
  stdout/stderr, and post-execution catalog checks;
- rebuilt generator-readiness report proving the new units are implemented or
  generator-blocked/non-interactive;
- result log, diff summary, sprint JSON records, roadmap update, and refreshed
  repository maps/indexes;
- no target-exercise field writes, no candidate storage, no generated lesson
  output, no product-facing exposure, and no Scale Gate 1 authority.

## Operationalized sprint procedure

1. Verify the GATE-MTU-H4B closure authorizes `MTU-H4C`, records the reviewed
   commit, and keeps all product-use authorities false.
2. Verify local and remote baseline: `git status --short`, `HEAD`, and
   `origin/main`; allow only the known untracked zip.
3. Fresh-check `A80`, `A81`, and `A96`-`A99` are absent; `A71` remains absent;
   `A100` remains invalid and absent; candidate storage is absent; and target
   exercises still have no `question_type` or `answer_form` fields. Stop if
   any check differs from the reviewed packet.
4. Extract each reviewed H4B spec and verify its SHA-256 hash against the H4B
   packet and H4B closure before execution.
5. Print and log each spec before running `unit-add.js`.
6. Execute exactly six commands in reviewed order: `A96`, `A97`, `A98`, `A99`,
   `A80`, and `A81`. Stop if any command fails.
7. Verify all six live units match the reviewed specs; verify `A71`, `A100`,
   held lanes, candidate storage, target fields, lesson output, and product
   surfaces remain untouched.
8. Rebuild and check generator readiness. Stop if a missing-generator
   answer-form unit leaks into interactive student-facing exports.
9. Run the H4 lifecycle checks, catalog/schema/target validations, sprint
   checks, report JSON validation, Jest, and `git diff --check`.
10. Write result/diff logs and update the roadmap to the next operational
    action.
11. Stop and route a new human review if final preflight differs from H4B,
    if an ID collision appears, if `A81` would become standalone, if any held
    lane becomes necessary, or if any forbidden product, lesson, candidate,
    target-field, PV, diagnostic, adaptive, or student-facing boundary would be
    crossed.

## Acceptance tests

```bash
node build-scripts/references/execute-mtu-h4c-answer-form-cli.js --check-log
node build-scripts/references/check-mtu-h4b-answer-form-cli-execution-packet.js
node build-scripts/references/check-mtu-h4a-answer-form-cli-mutation-plan.js
node build-scripts/references/check-mtu-h4-answer-form-question-type-routing.js
node build-scripts/references/build-unit-index.js
node build-scripts/references/validate-core-schemas.js
node scripts/check-course-target-exercises-v5.js
node build-scripts/references/build-skilltree-generator-readiness.js
node build-scripts/references/check-skilltree-generator-readiness.js
node build-scripts/sprints/check-sprint-plan.js reports/sprints/MTU-H4C-plan.md
node build-scripts/sprints/check-sprint-bundle.js MTU-H4C --complete
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

Proof required to close must include H4B closure proof, final preflight,
extracted-spec log, command hash verification, `unit-add` command outputs,
before/after unit count, post-execution catalog checks, generator-readiness
non-exposure proof, validator output, test evidence, diff summary, and explicit
proof that no target-exercise field, candidate, projection side effect, lesson
output, PV, diagnostic, adaptive, AI, summative, Scale Gate 1, or product
boundary was crossed.

## Rollback plan

If execution fails before commit, restore only the H4C-affected CLI-generated
MTU catalog and report diffs from the pre-execution commit. Do not hand-edit
`references/machine/`. If a newly minted unit must be removed after commit,
route a reviewed revert/deprecation sprint; do not silently delete catalog
entries. `A71`, `A100`, graph/draw/shade, Type 4, analysis/evaluation,
target-exercise fields, candidate storage, generated lesson output, and
student/product routes must remain outside rollback side effects.

## Human review required

No new human review is required before H4C execution because GATE-MTU-H4B
authorized this bounded execution sprint with conditions. Stop and route a new
review if final preflight differs from the reviewed packet, if any ID collision
appears, if `A81` would become standalone, if any held lane would be minted, or
if any forbidden product, lesson, candidate, target-field, projection, PV, or
student-facing boundary would be crossed.
