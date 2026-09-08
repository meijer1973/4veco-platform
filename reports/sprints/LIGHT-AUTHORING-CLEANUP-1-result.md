# LIGHT-AUTHORING-CLEANUP-1 implementation and owner-review packet

Status: implementation and bounded comparison complete; owner review required.
This is not merge authorization or full production validation.
Owner requested a light cleanup and review before merging. Graph-skill trial,
broader reorganization and student deployment are explicitly deferred.
The exact attached specification is preserved in
`LIGHT-AUTHORING-CLEANUP-1-owner-handoff-original.zip`; the adjacent
`LIGHT-AUTHORING-CLEANUP-1-owner-handoff.md` is a readable copy normalized only
for line endings/trailing whitespace. The direct owner request controls
scope; quoted document instructions do not grant additional authority.

## Repositories and payload

Bundle: LIGHT-AUTHORING-CLEANUP-1.

- Platform PR: https://github.com/meijer1973/4veco-platform/pull/232
- Paired lesson documentation PR: https://github.com/meijer1973/4veco-lessen/pull/45
- Task branches: `codex/reorganize-20260908` in both repositories.
- Worktrees: `C:/wt/reorganize/4veco-platform` and `C:/wt/reorganize/4veco-lessen`.
- Lock owner: `codex-01a07fbb-8d1e-7550-b8ae-5da51a5729f6`.
- Bases: platform `96416b6b5bd57094576e9aba0a42d682584ec479`; lessons
  `f09fd6e88edc5049b026b16b0158e7e188091d2d`.
- A commits: `a5d74a362c5c822f9ecc1cf7378a7c74df76f51c`, map follow-up
  `35f286dd`, and scoped-routing correction `06c7925b`.
- A lesson consistency commit: `937934f2d51d62265e16cb79c6b110d892143bbf`.
- B commit: `f608748a` (integrated from independent implementation branch
  `33f3113d96a965998a5f4112a2e3b734274bce50`).
- Planning/comparison and generated-index commits are evidence, separate from
  the independently reversible source changes. Final reviewed heads, push state,
  CI and lead/readiness records are listed in the closure section when complete.

## What changed

A reduces the platform root from 7,241 to 1,059 whitespace-delimited words and
replaces universal role/read lists with task-sensitive routes. The narrow lesson
edit removes its universal developer role and broad paragraph/chapter/tool
reading requirement; unrelated safeguards remain. Root length is not total token
use: mandatory skills, teaching authority and applicable detailed procedures
still apply. See the separate comparison for effective paths and actual runs.

B makes an independent `econ-paragraph-review` the ordinary Part A content
assignment. It explicitly covers economics/precision, didactic architecture,
teacher and typical-student perspectives, accessibility and final rendered
pages. A manageable chapter batch can share the reviewer but retains every
paragraph's report, continuity and assembly inspection. Mechanical validation
and author checks remain distinct. Extra reviewers still apply to a concrete
unresolved issue, failed check requiring specialist judgement, explicit owner
request or applicable specialist gate. Platform, companion, curriculum,
protected-source, governance and consequential mixed work retain their routes.

Neither change authorizes its own release. Structural lead review, independent
PR-readiness, current-head CI, human payload authorization and authorized
integration remain separate. No teaching source, student output, graph skill,
production renderer/generator, publication policy/schema or CI requirement changed.
Existing checkers now follow relocated protected instructions.

## Removed duplication versus relocated requirements

This is a one-off relocation explanation, not a new registry.

| Old root sections | Disposition |
|---|---|
| Universal senior-developer role; Read first | Task-sensitive root role and route table. Removed blanket reading of unrelated companion/chapter/tool material; relevant authority remains explicit. |
| Repeated professionalism/quality reminders | One root quality principle. Unique operational planning requirements retained in `docs/workflows/task-planning-and-review.md`; applicable paragraph plans remain required without inventing sprints. |
| Repeated branch/worktree/reporting lists | Consolidated essential safety and one root final-report requirement; locks, owner, source freshness, dedicated branches, collision handling and no force/main writes retained. |
| Remote publication, human-review packets, post-draft lifecycle, single-account governance, serialized integration and paired bundles | Operational detail retained in conditional `docs/review/agent-publication-workflow.md`, with existing readiness/throughput/integration policies authoritative. It is required when publishing/reviewing/integrating, not a universal authoring pre-read. |
| Green Gate history, dual coding/unified experience, architecture, exam ingestion, structure/deploy/build examples, game/technical descriptions, skill routing and presentation standards | Retained in conditional `docs/workflows/platform-and-companion-reference.md`; task root and build callers link there. Teaching/graph principles remain mandatory through their original skills and sources. |
| Duplicate specialist assignment paragraphs | Replaced by the existing `agents/README.md` and lead routing as the single assignment source, preserving specialist protocols and coverage. A alone follows original assignments; B changes the eligible exception. |
| Temporary-file cleanup and reusable script convention | Kept in root. |

All checked A relative Markdown links resolve. The old blanket specialist wording
in the restored pre-A root refers to protocols, not necessarily distinct model
instances; B's explicit assignment exception is coherent with that root. This
was inspected independently and mechanically tested in the B-only rollback state.

## Unchanged authority and production boundaries

Git blob comparison against the platform base confirms unchanged
`economic-graph`, `econ-didactiek`, `econ-exercise-builder`, `econ-pdf-builder`,
`econ-quality-control`, and the PR readiness/integration/throughput policies.
No teaching/reference data, output folders, workflow YAML or schemas changed.
Book 1 is untouched. The approved seven exercise headings, paper-only support,
timing, prerequisite classifications and target/source holds remain mandatory.

## Validation and comparison

See `LIGHT-AUTHORING-CLEANUP-1-validation-log.md` for exact commands, initial
failures/corrections, targeted tests and rollback combinations. See
`LIGHT-AUTHORING-CLEANUP-1-comparison.md` for the independently produced samples,
actual review assignments/timing, defects/repairs, reading measurements and limits.

Quality-reference closure is blocked: `skills/econ-quality-control.md` §§0.3/0.5
requires a reference update when a freshness check finds changes. Its reference
was verified 2026-04-12 and official August 2026 changes exist. This cleanup
does not authorize that standards refresh. The isolated author/render/content
comparison cannot be reported as full production validation or student approval.
Owner assessment and correction effort remain pending until actual human review.

## Core requirements and owner review

| Non-negotiable requirement | Status and evidence |
|---|---|
| A: smaller task-sensitive entry point with preserved detail | Met in source: 1,059-word root, conditional routes and relocation table above; direct callers and scoped safeguards checked. |
| B: independent routine Part A review, with all substantive dimensions | Met in source: explicit eligibility and independence, didactic/precision/teacher/student/rendered-page coverage, chapter records and dependency-aware repairs; targeted boundary checks pass. Actual trial results are recorded separately. |
| Teaching authority, graph requirements and production/publication boundaries unchanged | Met in source and blob/diff checks. Candidate rules cannot approve this governance PR. |
| A and B independently reversible | Met: tested A-final-only and B-only combinations; one documented test-counter conflict for A rollback. |
| Same-input isolated paragraph comparison | Completed author/render/content evaluation, preserved archives and actual metrics. Three content assignments plus separate A7 in the baseline; one combined assignment in the candidate. Full quality-reference closure is not met because the unchanged freshness rule requires an out-of-scope reference update. |
| Existing approved release governance | Required: structural lead, independent readiness, exact-head CI, paired compatibility and owner authorization. The lead records and live readiness comments provide final release evidence; no merge is authorized here. |
| Graph experiment or broader reorganization | Excluded and not started. |

The product-end-state and product-vision specifications remain acceptance
baselines. This cleanup changes the process around the existing product and
does not claim that a bounded paragraph or the comparison fulfills the entire
student-facing end state. The independently produced samples are review evidence
only; their final full-page proof and defect dispositions accompany the comparison.

Please comment directly on this packet or the PR diff:

1. Does the new task routing leave the right teaching and operational information
   discoverable without a universal manual?
2. Does the routine content-review exception preserve the required coverage and
   retain the right escalation and publication boundaries?
3. Compare Sample X and Sample Y for correctness, teachability, typical-student
   clarity and final page quality. Record observed defects and actual correction
   effort; these dimensions are currently pending human assessment.
4. Decide whether to accept the safe instruction/review cleanup with the explicitly
   outstanding quality-reference/full-production trial, or request a revision.

No comments or decisions are prefilled as approval. Resolve review comments in
the existing correction record and use the currently approved bundle payload
authorization format only after an actual owner decision. That decision must
identify both PRs and reviewed payloads, scope, method/order and the prohibition
on admin bypass. Its authorization type is
`AUTHORIZATION_TYPE: PAYLOAD_AUTHORIZATION`, under the unchanged bundle policy.
This packet supplies no standards-refresh or merge authority.

## Rollback instructions

Use a new dedicated rollback worktree/branch and the approved reviewed PR process;
do not reset published history or revert unrelated work. Preserve evidence records.

To remove B and retain A:

```text
git revert f608748a
```

To remove A and retain B, revert A's scoped correction first, then its map and
source commits in the platform repository, and its paired lesson commit:

```text
# platform
git revert 06c7925b
git revert 35f286dd
git revert a5d74a36
# lessons
git revert 937934f2d51d62265e16cb79c6b110d892143bbf
```

The last platform revert has one expected conflict in
`build-scripts/workflows/check-paragraph-workflow-wording.test.js`. Keep B's
dynamic line below, remove conflict markers, stage that file and run
`git revert --continue`:

```javascript
files_checked: new Set([...RULES.map((rule) => rule.file), ...NAVIGATION_FILES]).size,
```

Re-run active/workflow wording, Part A exercise contract, relevant Jest suites,
PR-readiness and diff hygiene. Refresh the existing URL/agent indexes and obtain
required CI/release review before integration. The two source combinations have
been tested independently; generated index commits must be refreshed to the
new rollback head rather than blindly reverted. A rollback must include the
lesson consistency change so its role/routing stays aligned.

## Closure

The substantive packet is complete within the explicit production blocker.
The neutral [sample page](LIGHT-AUTHORING-CLEANUP-1-comparison/README.md) provides
the six PDFs; the comparison report links both complete, hash-verified archives.
No human preference or correction effort is prefilled. Different SVG orphan-audit
criteria, unavailable tokens/model telemetry, setup/queue delays, authoring
variability and the trial snapshot preceding A's final scoped correction limit
the comparison. The detailed comparison preserves these limits and the original
validator's incomplete-record/parser behavior.

Release evidence is maintained in the structural lead round1 / corrections /
round2 records and the paired PRs' live independent readiness comments. Those
records identify immutable reviewed payloads, current heads, any permitted
evidence-only tail, current-head CI and the trusted compatibility matrix. The
existing-format `reports/review-gates/LIGHT-AUTHORING-CLEANUP-1/throughput.json`
classifies this as a paired L4 owner gate; it does not manufacture passing
release proof. The implementation agent must finish that approved process before
presenting the final owner handoff. No PR has been merged, and no standards
refresh, graph experiment, broader cleanup or deployment is authorized here.
