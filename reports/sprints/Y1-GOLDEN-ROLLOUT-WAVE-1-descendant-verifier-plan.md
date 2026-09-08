# Sprint Y1-GOLDEN-ROLLOUT-WAVE-1: Historical Renewal and Current Descendant Verification

Date: 2026-09-08. Status: planning review pending; implementation authorized,
merge authorization withheld.

## Goal

Allow the active Y1 CI check to reuse the historical rendered renewal for later
lesson commits only when their complete discovered rendered inputs remain
identical and every route target exists. Preserve the historical verifier,
its source manifest, captures, proof, and decisions as historical evidence.

## Context

The owner authorized preparation of this separate prerequisite after the
AGENT-ENTRY-CLEANUP-20260908 integration merged Lessons #46 as
`57b31a1f4a3d2aa0da3945abbc5a7a0ee5d05e6a`. Platform #233 remains open at
`3a87cb49050fac3db4b332fe9d1e3653cfb1ea07`. CI run 34235097135 failed because
the historical checker compared the current lesson SHA with its fixed renewed
snapshot `f09fd6e88edc5049b026b16b0158e7e188091d2d` before checking current
dependency equality. Independent reproduction found only AGENTS.md changed,
78 unchanged lesson rendering inputs, and 55 existing route targets.

This prerequisite starts from Platform main
`96416b6b5bd57094576e9aba0a42d682584ec479` and the lesson merge above, in paired
worktrees under `C:/wt/reorganize 2/y1-renewal-repair/`. The task branch is
`codex/y1-renewal-descendants-20260908`; owner is `codex-y1-renewal`.

The original specification and evidence are the Y1 plan, its evidence-renewal
and evidence-prerequisite plans, the historical Scale Proof, and their existing
validators. Product vision pillar: agent-scalable production and reproducible
review. This is reliability work supporting the product end-state's evidence
requirements; it makes no new student-use or instructional-quality claim.

## Quality Standard

The specification's quality floor remains actual rendered output proof for the
student-facing route. This repair may reuse that proof only within its existing
first-viewport qualification and unchanged inputs. It must reject changes or
missing files, retain source and artifact hashes, and identify historical and
current lesson refs separately. No new rendered output is needed because all
rendering inputs must be identical. Any changed input requires separate renewed
capture and review. Broader renewal generalization is named follow-up work.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Preserve historical evidence and verifier | New additive current verifier; old files unchanged | Committed blob inventory and independent review | pending |
| Validate original capture against its recorded snapshot | Run the complete historical validator with f09fd6e snapshot | Existing tests and explicit historical result | pending |
| Verify actual current lesson descendant | Ancestry, independently discovered union, equality and existence checks | Real docs-only descendant and synthetic negative tests | pending |
| Bind active verifier to reviewed source | New successor evidence record with exact payload/source hashes | Missing, malformed, stale and tampered binding tests | pending |
| Run current verification in protected CI | Explicit new npm command and exact active workflow wiring | Workflow regression and complete exact-pair CI | pending |
| Retain all validation and authority holds | Historical validation remains mandatory; no scope-only/waiver active mode | Negative tests, source review, L4 readiness | pending |
| Keep original bundle unchanged | Separate platform PR and clean lesson worktree | Git/PR verification | pending |

## Quality Improvement Candidates

- `include_now`: separate historical capture truth from current dependency
  equality; verify active CI wiring and report both commit identities.
- `defer_named_follow_up`: general multi-capture renewal; delegated-CI report
  wording; hosted integration temporary-clone authentication.
- `reject_scope_creep`: product, lesson, engine, source-data, protected-reference,
  authorization, merge tooling, or branch-protection changes.

## Allowed paths

- `build-scripts/sprints/check-y1-golden-rollout-wave-1-current.js`
- `build-scripts/sprints/check-y1-golden-rollout-wave-1-current.test.js`
- `build-scripts/sprints/write-y1-golden-rollout-wave-1-current-evidence.js`
- `package.json`, limited to the additive current-verifier command.
- `.github/workflows/platform-ci.yml`, limited to selecting that command.
- `reports/json/y1-golden-rollout-wave-1-current-verifier.json`
- `reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-descendant-verifier-*.md`, limited to
  plan, planning review, execution log/result, and structural review records.
- `reports/url-index.md` and the four generated GitHub agent index files.

No other source path may change without correcting this plan and its independent
review first. PR/readiness records are published as current-head GitHub comments.

## Forbidden paths

All lesson files; `source-data/`; `engines/`; `references/machine/`;
`references/external/`; protected references; the historical Y1 checker/tests,
changed-path policy, source manifest, delta proof, wave proof, review packet,
result, renewal, screenshots, selectors, and all historical Scale Proof files.
CI permissions, job conditions, protected contexts, and merge tooling are fixed.

## Inputs

- Exact Platform base and lesson refs above; original blocker report at
  https://github.com/meijer1973/4veco-platform/pull/233#issuecomment-5586644724.
- Historical Y1 payload and snapshot from the unchanged delta proof.
- Existing complete historical validator and dependency discovery routines.
- Platform lead-review, throughput, readiness, and integration policies.

## Outputs

An additive current verifier, focused tests, deterministic evidence writer and
successor source-binding record; independently reviewed plan and result; an L4
platform PR with complete current-pair CI and readiness for human review.

### Binding contract and sealing sequence

The successor certificate records schema/version and purpose, baseline Platform
`96416b6b...`, source payload P, historical lesson snapshot f09fd6e, initial
observed lesson57b31a1f, and an exact source inventory. Each source entry contains
path, binding mode, Git blob OID and SHA-256 read from P. The inventory consists
of the new verifier, its tests/writer, package.json and platform-ci.yml. A
separate exact historical inventory binds the old verifier/tests/policy,
source manifest, renewal/capture/visual records, delta/wave/packet/result, and
the original Scale Proof inputs at the baseline, with Git OIDs and SHA-256.

Historical files must stay byte-identical. The three successor-owned code files
must stay byte-identical from P to actual current Platform H. Package/workflow
full hashes at P prove reviewed provenance; current checks enforce the precise
owned Y1 mapping, single mandatory invocation, event/lesson refs and protected
job/checkout contract. Unrelated npm scripts, workflow steps and Platform tail
files are allowed. P must be an ancestor of H, but H need not equal P. Existing
historical checks still reject changed Platform rendering inputs.

Lesson57 is an initial observation, not a static current-head requirement.
Actual lesson C must descend from historical snapshot f09 and pass newly
discovered union/equality/existence checks. The stable certificate never claims
to be the latest runtime result; output reports actual H/C and full attestations.

Seal in this order: validate and commit corrected source as P; run the separate
deterministic writer against committed P and the initial lesson commit; commit
the certificate and generated indexes as H; perform independent review and full
CI at exact H. The certificate is not part of its own source inventory, avoiding
self-hash and commit-SHA cycles. A source correction requires a new P and freshly
generated certificate before another H review. Active CI rejects all write-only,
scope-only, alternate-root/policy and unbound-packet options; sealing is never a
validation success. No working-tree bytes substitute for committed source proof.

## Operationalized sprint procedure

1. Fetch both repositories, create dedicated worktrees from the exact current
   main refs, run governance freshness, and claim ownership before source edits.
2. Obtain independent planning/design review. Resolve missing dependencies,
   ambiguous historical/current claims, and binding risks before implementation.
3. Add the current verifier. Run every historical check with its recorded lesson
   snapshot and the actual platform event refs, then independently discover and
   verify actual lesson descendant dependencies. Do not change historical bytes.
4. Bind the successor verifier, its tests/writer and exact CI wiring to a
   committed source payload. Preserve immutable historical records; validate
   lineage and source hashes for current heads without requiring later unrelated
   lesson commits to equal the historical snapshot SHA.
5. Test the real documentation-only descendant and rejection of rendering drift,
   missing routes, non-descendants, artifact/hash drift, malformed/stale bindings,
   and active wiring regressions. Active CI cannot use write-only, scope-only,
   unbound-packet, historical-only or substitute-lesson shortcuts.
   Also test unrelated Platform tails, npm scripts and workflow steps passing;
   later lesson descendants passing with fresh checks; and Y1 command removal,
   duplication, mapping/argument/condition drift and stale source records failing.
6. Publish the separate draft PR, refresh deterministic navigation, run relevant
   local checks and complete CI against actual lesson main. Obtain independent
   structural review, fix findings, and perform a second review of corrections.
7. Run independent readiness and apply its allowed draft-to-ready transition.
   Return for explicit payload authorization. Do not merge this prerequisite or
   resume the original bundle under its earlier authorization in this task.

Stop on unexpected branch/head movement, changed historical artifacts, rendered
input drift, incomplete dependency discovery, weaker active validation, evidence
that cannot be bound to committed bytes, or unexplained CI failure.

## Acceptance tests

```bash
npm test -- --runInBand build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js build-scripts/sprints/check-y1-golden-rollout-wave-1-current.test.js
npm run check:platform
npm run check:y1-golden-rollout-wave-1-current -- --event-mode manual --scope-mode auto --base 96416b6b5bd57094576e9aba0a42d682584ec479 --head HEAD --lesson-head HEAD
node build-scripts/sprints/check-sprint-plan.js reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-descendant-verifier-plan.md
node build-scripts/sprints/check-sprint-bundle.js Y1-GOLDEN-ROLLOUT-WAVE-1 --complete
node build-scripts/reports/validate-report-json.js
node build-scripts/sprints/emit-url-index.js --check
npm run check:agent-index-freshness
npm run check:paragraph-lane-scope -- --lane shared --base origin/main --head HEAD
npm run finalization:freshness
git diff --check
```

## Proof Required to Close

Proof required to close includes the exact published platform head and actual lesson main,
complete changed-path inventory, deterministic source-binding record, passing
focused/full tests and complete protected CI, independent plan/structural review,
L4 human-review readiness, and confirmation that the prerequisite remains
unmerged. The human can inspect the actual code, historical/current ref results,
and every regression result. A review PASS is readiness evidence, not authority.

## Human review required

L4 governance review and explicit owner payload authorization are required before
integration. Review prompts: does the current verifier preserve every historical
claim, fail closed for every input drift, and bind the active code and CI to the
reviewed source? Does its separate current result avoid implying a new capture
or broader viewport/product authority? Record comments and resolutions on the PR.

## Rollback plan

Before merge, revise or close the separate prerequisite PR. No lesson rollback
or restoration of historical artifacts is needed. The original platform cleanup
PR stays open until a separately authorized prerequisite restores full CI.

## Execution log

- 2026-09-08: user authorized preparation. Platform/lesson bases fetched and
  verified; both worktrees clean; governance freshness and ownership claims pass.
- Independent planning and structural reviewer: `entry_rule_review`.
- Design inspection selected an additive successor because editing the old
  verifier would invalidate its immutable historical source-manifest hashes.
- Planning review round 1 requested explicit binding modes and sealing order;
  both are specified above, including future unrelated-head regression coverage.
