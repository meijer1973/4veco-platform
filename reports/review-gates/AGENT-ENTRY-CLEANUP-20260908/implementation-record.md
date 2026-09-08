# Agent entry cleanup — implementation and review record

Date: 2026-09-08
Task: reorganize-2-20260908
Status: implemented; round-1 corrections applied; final validation/review pending

## Request and scope

The supplied assessment recommends separating startup rules, specialist
procedures, and historical decisions without restructuring the repositories.
This first increment follows its proposed bounded starting point: platform
`AGENTS.md`, lesson `AGENTS.md`, and their task-dependent reading routes.
The wider skill and navigation work is recorded below as a separate increment.

Quality floor: a new agent can identify source/output ownership, applicable
workflow, safety obligations, and closure gates from the entry documents without
reading unrelated build manuals. No active gate, reviewer requirement, protected
reference rule, or merge-authority boundary may be weakened through shortening.
This supports the product vision's agent-scalable production pillar; product
and curriculum specifications themselves are unchanged.

In-scope quality improvements: make the read-only/maintenance/production/review/
integration routes explicit, remove the false automatic-skill-loading claim,
and resolve the lesson entry's interview drift by inheriting the shared direct
packet-comment protocol. The review gate is independent structural review of
instruction preservation and route usability. Student-facing quality review is
not applicable because the change produces no learning artifact or UI.

## Planned outputs

- Platform `AGENTS.md`: approximately 200–250 lines of shared operating rules,
  task routing, protected-source boundaries, quality principles, and closure.
- Lesson `AGENTS.md`: lesson-specific source/output rules and one canonical
  pointer to platform operating rules, with task-specific reading links.
- Existing phrase checks: keep useful entry-level contracts; relocate only
  specialist-procedure assertions to an existing canonical policy that already
  contains the same requirement, retaining a checked entrypoint link.
- This record: plan, rule-preservation evidence, commands/results, review
  findings and dispositions, and final limitations.
- Existing generated GitHub agent indexes and URL index: refresh through their
  generators if the changed surfaces require updated navigation metadata.

No student-facing artifact is produced. Rendered learning-product review,
paragraph/chapter builds, and curriculum acceptance are not applicable.

## Procedure and acceptance evidence

1. Fetch both origins; verify clean dedicated branches and ownership locks;
   run governance freshness with the explicit intentional-policy-edit option.
2. Inspect both entry documents, destination runbooks/policies, and checks
   that read their wording. Map active requirements to retained text or an
   existing canonical destination before removing duplicates.
3. Rewrite the two entry documents. Keep specialist destinations discoverable;
   keep task categories descriptive of existing obligations, without creating
   exemptions from production, roadmap, review, or integration gates.
4. Check preserved rule coverage, task routing for read-only investigation,
   routine maintenance, textbook production, companion production, chapter
   assembly, roadmap/gate work, and PR integration. Verify local links.
5. Run existing governance wording, paragraph workflow wording, product vision,
   reasoning-game skill checks, and the focused workflow tests that read
   `AGENTS.md`. Check whitespace, line/word counts, and paragraph-lane scope.
6. Obtain independent structural lead review under the repository's PR
   lifecycle rules; resolve findings and obtain a second check where repairs
   are needed. Review specifically for deleted obligations and false exemptions.
7. Refresh required navigation indexes, validate, commit and publish the paired
   changes for review. Follow existing PR readiness/bundle policy using current
   remote evidence. Governance edits require human payload authorization before
   integration; this request does not supply that later payload decision.

Stop conditions: branch/ownership collision; missing canonical destination for
an active rule; an ambiguous restriction whose status cannot be established;
a failing check caused by the cleanup; or an evidence/authority gap preventing
the relevant PR lifecycle step. Resolve within scope where possible and report
remaining limits precisely. Never infer a legacy-target release from its date.

## Follow-up scope

- Conditional loading inside specialist skills, including textbook/graph/PDF
  construction details (recommendation 5 beyond the entry-file wording).
- Navigation introductions and campaign placement in research maps, prompts,
  and GitHub entry documents (recommendation 6).
- Any policy change to reviewer counts or release of a protected legacy target
  requires a separate explicit decision; neither is part of this cleanup.

## Baseline

- Platform: `96416b6b5bd57094576e9aba0a42d682584ec479`.
- Lessons: `f09fd6e88edc5049b026b16b0158e7e188091d2d`.
- Both branches: `codex/reorganize-2-20260908`.
- Both ownership locks: `codex-reorganize-2`.
- Fetch, governance freshness, and both clean-worktree checks passed before edits.

## Local implementation and rule preservation

| Requirement | Result / destination |
|---|---|
| Short operating guide | Platform reduced from 883 lines / 7,241 words to approximately 250 lines; final counts are recorded at closure. |
| Lesson-specific entry | Lessons reduced from 264 lines / 1,873 words to 74 lines / 604 words; shared operating rules now have one canonical owner. |
| Task-specific reading | Both files route paragraph production to lane runbooks, chapter assembly to its chapter guide, complete verification to its full manual, narrow maintenance to affected source/tests, and integration to review policies. |
| Branch/worktree safety | Dedicated branch/worktree, fetch/status/freshness, locks, forced-operation prohibitions, paired paths, collision stops, and reporting remain explicit. |
| Plan and review triggers | All six non-trivial plan fields remain; operational-plan categories and roadmap-sprint separated-agent rules remain distinct. No new small-change exemption is created. |
| Human review | Shared entry retains packet-comment default, complete packet contents, comment resolution/decision evidence, interview exceptions, pre-gate lead review, published proof, and interactive/rendered evidence. |
| Integration detail | Existing integration/readiness/throughput policies remain unchanged and linked. Two bundle-test assertions now check specialist instructions in the existing integration policy; the entry policy link remains checked. |
| Source and product boundaries | Machine/external CLI-only editing, exercise-first design, generated-output ownership, two lanes, route completeness, teaching principles, and specialist reviews remain. |
| Legacy target | Current reference roadmap preserves external-target protection. No release is inferred from the old September wording. No target/storage state changed. |
| Historical material | Entry-level integration experiment history, Green Gate history, legacy architecture inventory, deployment recipes, and presentation recipes are removed in favor of existing relevant procedures. |

The independent planning/preservation review returned PASS WITH FLAGS. Its
flags asked for explicit plan quality fields and named follow-up scope; both
are recorded here. It confirmed that the direct packet-comment protocol lacks
an equivalent canonical destination and must remain in the platform entry.

## Validation evidence

Commands ran in the dedicated platform worktree unless a lesson path is stated.
Existing dependencies supplied the Jest executable from the anchor clone;
the tests used this worktree's source and did not modify shared dependencies.

| Command / check | Exit | Result |
|---|---|---|
| `npm.cmd run check:active-governance-wording` | 0 | Passed, including both entry files and canonical route contracts. |
| `npm.cmd run check:paragraph-workflow-wording` | 0 | 12 files checked; no missing phrase/navigation contracts. |
| `npm.cmd run check:reasoning-golden:skill` | 0 | Required reasoning skill/exemplar and legacy-route contracts retained. |
| `node build-scripts/sprints/check-product-vision-links.js` | 0 | Vision links and JSON keys passed. |
| `jest --runInBand --runTestsByPath build-scripts/review-gates/cross-repo-bundle-workflow.test.js build-scripts/workflows/check-paragraph-workflow-wording.test.js` | 0 | 2 suites, 47 tests passed. |
| Markdown local-link inspection of both `AGENTS.md` files | 0 | Every linked local file/directory exists. |
| `git diff --check` in each repository | 0 | No whitespace errors. |

Navigation freshness, final lane scope, remote CI, final lead review, and
readiness publication remain pending. This record does not claim integration
authorization or completed human review.

## Round-1 review and corrections

The independent reviewer returned REVISE with five preservation findings:

| Finding | Correction |
|---|---|
| Shared-platform scope check lost its explicit trigger | Restored the exact shared-lane closure command plus lesson-lane routing and reviewed machine-readable exceptions. |
| Platform Part A route no longer inherited product-spec pre-reading | Added paragraph-build explicitly to the product-spec task row. |
| Reporting/cleanup/next-action duties were narrowed to completed non-trivial work | Restored every-mutating-task reporting, every-task cleanup, and every-non-trivial-response next-action triggers. Publication retains its non-trivial-work trigger. |
| Engine/generation/roadmap controls had no equivalent linked destination | Restored engine tests, deployment/browser checks, post-generation/deployment validators, and current roadmap sprint status. |
| Gap-report interpretation omitted | Restored that gap reports are diagnostic signals, not automatic unit-minting backlogs. |

A preliminary lane-scope invocation before the first commit failed because
`origin/main...HEAD` still contained no changed paths. This was a sequencing
mistake, not an exemption; rerun the check on the actual committed payload.
The record is stored in the existing `reports/review-gates/` evidence category
so the lane checker can classify it without adding a new repository category.
