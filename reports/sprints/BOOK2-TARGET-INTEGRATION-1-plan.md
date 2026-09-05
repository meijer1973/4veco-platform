# Sprint BOOK2-TARGET-INTEGRATION-1: Governed target activation

## Goal

Activate the immutable twelve-record Book 2 package authorized by the owner on
2026-09-05, as milestone 1 of one combined #229/#223 Part A textbook project.
Preserve the historical content-only decision. Do not infer merge authority.

## Context

PR #230 merged at ad27f9c30205042c01cacf0b362f4d3f87e6c7a9; post-merge
validate-platform passed in run 33956928761. The targets are present but twelve
candidate holds remain open. The owner now says: "I authorize the governed
target transition then begin lesson production."

This permits implementing the transition and the subsequent complete textbook
project, not merging a future unreviewed payload. Issue #229 requires integrated
authority before student-output work unless an explicit cross-repository bundle
exception is granted. No such exception is inferred here. Milestone 1 stops at
READY_FOR_HUMAN_REVIEW for its exact governance payload; production starts after
its authorized merge and green main CI. #229 remains the umbrella; #223 is the
first internal exemplar, not a competing production project.

## Quality Standard

The specification quality floor is immutable, fail-closed authority: one exact
package, separate content/integration/production/merge decisions, real ancestor
commit evidence, and intact unrelated holds. Student-facing quality and
rendered output are deliberately not claimed by this transition. Proof must include
positive authorized activation and adversarial negatives. The named follow-up
BOOK2-TEXTBOOK-PRODUCTION-1 supplies complete paper teaching routes and reviewed
PDFs after the integration gate. Vision fit: exercise-first and agent-scalable
production are advantage investments; correct reproducible PDFs are parity.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Frozen twelve-record package remains unchanged | Registry/package hash 914d1a39f18f8f9b7cf7fad938d2c42f9c2bc19671d94c24be151b1da0371310 | Exact git diff and durable validator | Planned |
| Separate immutable owner integration decision | Verbatim decision evidence committed before validator pins; exact evidence/hash/identity/date/package/outline binding | Independent code review and field-mutation tests | Planned |
| Real activation provenance | New transition commit descending from evidence commit, containing frozen registry and exact decision; subsequent release metadata pins it | Ancestry/content/evidence tests, not a candidate-only old commit | Planned |
| Release only the twelve integration holds | Candidate-to-target binding transition, exact historical baseline and content approval retained | Positive transition; release field, scope, pin, package, evidence negatives | Planned |
| All authority consumers use the separate grant | Currentness integration-action and released-state gates; durable lifecycle and approval-block retirement | All three consumers pass authorized fixtures and reject absent/forged grants | Planned |
| Preserve prior decisions and remaining prerequisites | Historical H-211 and Ei releases unchanged; H-221-PRIOR, H-22-ELASTIC-CONTRAST, root/chapter and OP-C2 holds retained | Before/after hold inventory; blocked actions stay blocked | Planned |
| One coordinated production project | Full-book continuation manifest, existing §2.1.1 salvage inventory and older-pin reconciliation | Planning reviewer | Planned |
| Remote reviewable exact payload | Sprint evidence, independent verifier and structural lead cycle, CI and readiness | READY_FOR_HUMAN_REVIEW, normal authorized integration lane only | Planned |

## Quality Improvement Candidates

- include_now: bind each release and top-level integration evidence to the new
  exact decision, and require a post-authorization ancestor commit rather than
  treating old content-presence commits as an activation.
- defer_named_follow_up: BOOK2-TEXTBOOK-PRODUCTION-1 includes root/chapter plans,
  nine theory and three consolidation routes, complete PDFs and classroom timing.
- reject_scope_creep: rewriting frozen records, changing Ei semantics, Book 1
  output, Part B websites/games, speculative MTUs, admin bypass or broad merge grants.

## Allowed paths

- build-scripts/workflows/book2-integration-decision.js and its focused tests;
  the three existing Book 2 authority consumers and their tests.
- references/authored/book-outlines/book-2-outline.meta.json and lifecycle-only
  hold projection in book-2-outline.md (semantic hash must remain 919c39f64dd212dba37b62902a5bb2e2ce6388c6020a0491e1621017ae2192a1).
- reports/sprints/BOOK2-TARGET-INTEGRATION-1-*;
  references/data/sprints/BOOK2-TARGET-INTEGRATION-1.*;
  reports/review-gates/GATE-BOOK2-TARGET-INTEGRATION-1/.
- reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-* (continuation plan only).
- Deterministic maps/indexes/dashboard projections required by AGENTS.md.
- docs/roadmaps/textbook/textbook-production-roadmap.md and sprint-ledger.md:
  record this active transition and keep earlier sprint rows as historical snapshots.

## Forbidden paths

- references/machine/ and references/external/; all target registry and frozen
  candidate/alignment content; historical content approval and Ei decision.
- 4veco-lessen student outputs in this first milestone; any other agent's worktree.
- Merge policy, branch protection, integration lane, Part B and Book 1 output.

## Inputs

Current platform main ad27f9c30205042c01cacf0b362f4d3f87e6c7a9 and lessons main
f09fd6e88edc5049b026b16b0158e7e188091d2d. Immutable content reviewed at
b614577f19c6e8a95c9981256aa125e56d26cd79, owner evidence at
6d6f42226987f9ef9977f46dbb869455a88c25e2. Both AGENTS, product vision/end-state,
Book 2 outline/meta, Part A lane and econ-textbook-paragraph foundation gate,
issues #229/#223, the owner handoff passed at 197178a468525d596527702c09e7efae09ede73b,
existing validators/tests and prior correction-resolution report are baseline.

## Outputs

No student-facing files generated in milestone 1. Exact outputs:

- This plan, baseline, planning-review, command-log, prerequisite-inventory,
  result, diff-summary, finished-verification, lead-review-assignment,
  lead-review-round1, lead-review-corrections and lead-review-round2 Markdown
  under reports/sprints/BOOK2-TARGET-INTEGRATION-1-*.
- references/data/sprints/BOOK2-TARGET-INTEGRATION-1.plan.json and .result.json.
- reports/sprints/BOOK2-TARGET-INTEGRATION-1-owner-authorization.md; immutable
  reference to its commit and canonical SHA-256 in the new decision helper.
- New integration helper/tests and changed lifecycle consumers/tests; metadata
  plus its human-readable lifecycle projection.
- reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-continuation-plan.md.
- Review packet, readiness evidence and exact-head CI links under
  reports/review-gates/GATE-BOOK2-TARGET-INTEGRATION-1/; generated repository maps,
  URL index and dashboard when required by the normal tools.

## Operationalized sprint procedure

1. Fetch both remotes; verify clean dedicated paired worktrees, claim both for
   codex-root, run governance and currentness preflights. Log expected failures
   from twelve pending candidate holds; never mislabel them as a green gate.
2. Record this plan and baseline. Obtain independent planning review before
   validator/data implementation. Repair every blocking planning finding.
3. Commit the verbatim owner authorization and contextual scope as immutable
   evidence. Pin the exact full commit, file hash, package, outline, actor/date,
   decisions and absence of merge authority in a separate helper. Leave the
   historical content-only owner decision completely unchanged.
4. Add and test support for the new decision across integration-action,
   released-state, and durable retirement consumers. Reject unknown grant fields,
   absent/altered evidence, forged package or outline, changed actor/date, flipped
   old flags, wrong/nonancestor/content-only old commits, partial releases and
   synchronized live-record/pin/hash tampering. Keep all content/alignment checks.
5. Commit the validator and new decision metadata while holds are still open;
   use that real post-authorization commit as activation provenance. Then release
   exactly the twelve bindings, pin that commit and exact authorization reference
   at top level and per hold, and regenerate only the hold projection. Run the
   complete target activation validators; verify unrelated holds still block.
6. Independent finished-artifact verification; structural lead assignment,
   round 1, logged repairs and round 2. Re-run focused/full validation, refresh
   maps, commit/push and open a draft platform PR. Obtain exact-head CI and run
   the independent readiness lane; apply MARK_READY when permitted.
7. Stop for the required exact-payload governance merge authorization. Do not
   begin lesson output on a local release alone. After authorized lane merge and
   green main CI, refresh paired worktrees and execute the continuation plan:
   prerequisites, §2.1.1 exemplar, remaining eleven paragraphs, chapter/book
   assembly, independent economics/teaching/language/rendered-page reviews,
   cross-repository compatibility and final owner review.

Stop conditions: unknown scope or decision evidence; main drift affecting pins;
dirty/owned worktree collision; any immutable package or semantic change; missing
or forged provenance; unresolved specialist/lead blocker; failing exact-head CI;
remaining action-specific prerequisite holds; no new payload merge authorization.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/BOOK2-TARGET-INTEGRATION-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js BOOK2-TARGET-INTEGRATION-1
npm.cmd test -- --runInBand build-scripts/workflows/book2-integration-decision.test.js build-scripts/workflows/check-book2-target-authority-remediation.test.js build-scripts/workflows/check-book-outline-currentness.test.js
node build-scripts/workflows/check-book2-target-authority-remediation.js --durable
node build-scripts/workflows/check-book2-candidate-approval-block.js
npm.cmd run check:book-outline-currentness -- --require-approved
npm.cmd run check:book-outline-currentness -- --require-approved --action paragraph_production --paragraph 2.1.1
npm.cmd run check:platform
npm.cmd test -- --runInBand
git diff --check
```

Additionally enumerate all twelve integration actions and compare before/after
holds. Assert H-221-PRIOR/H-22-ELASTIC-CONTRAST still block affected production;
Chapter 2.3 and whole-book assembly remain blocked. Prove unchanged target and
outline semantic hashes and unchanged lesson worktree. Run shared lane-scope,
sprint --complete, finalization:freshness, remote exact-head CI and readiness.

## Proof Required to Close

Close this milestone only with validator/test proof, immutable authorization and
activation ancestry, unchanged frozen package and unrelated holds, independent
verification and lead recheck, all required output files, pushed exact-head CI
and an applied readiness decision. Record production as not begun at this gate.
Actual deployment/production readiness requires the later authorized merge and
green main CI. Keep classroom timing, especially §2.3.3, open pending observations.

## Rollback plan

Before publication, fix only task-owned changes. After publication, use additive
reviewed corrections or a new governed revert PR. Do not rewrite history, reset
shared worktrees or revoke historical approvals. If activation evidence fails,
leave holds open and stop the transition; never weaken a checker to manufacture
production permission.

## Human review required

Yes: authority-validator changes are governance/self-modification. Publish full
evidence and independent structural lead review before requesting exact-payload
merge authorization. The present task grant authorizes implementation only; the
future merge method remains merge commit, admin bypass prohibited. Use the
authorized integration lane, followed by post-merge CI verification.
