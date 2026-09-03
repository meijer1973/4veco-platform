# Sprint BOOK-2-FOUNDATION-OUTLINE-1: Result

Generated: 2026-09-03

## Plan reference

Plan: `reports/sprints/BOOK-2-FOUNDATION-OUTLINE-1-plan.md`

Plan JSON: `references/data/sprints/BOOK-2-FOUNDATION-OUTLINE-1.plan.json`

## Summary

Corrected the local, platform-only Gate 0B-0 payload after the owner returned
PR #226 with `REVISE` against head
`56b98478d43437895664a70efe6f57d8f82a453d`. The source audit remains
`VALID_WITH_DERIVED_OUTLINE_REQUIRED`. The resulting Book 2 outline binds the
current v6/v5 blueprint route, all 12 target-registry paragraph records, the
pedagogical-boundary contract, and the Part A exercise contract without
editing those inputs or the lesson repository.

After a second owner `REVISE` decision against head
`32f861b0734566c548c0f4cb0bb9c6deeba4fd01`, substantive head
`46e2f83c894d4dec8a850bc90ca8326a7cea7c0a` closes the remaining authority
transition and enforcement defects. Resolution decisions/repairs are now
distinct from approved use/integration; scopes are typed and schema-validated;
the Book 2 root and Chapter 2.3 lesson holds are separate; every human hold
projection field is compared with machine enforcement; and the active GitHub
entrypoint routes Part A and Part B to their correct templates.

The later structural/governance rereview accepted substantive head
`72b87403ea7866aaee877e9945a2021cc2559552` with `PASS WITH FLAGS` and
confirmed that all three bypasses are closed. Pre-refresh terminal head
`25312dfccee01b5c9bdd764a8a3c9e35ea6a11ed` passed `validate-platform` in
run `33554042557`. The semantic outline hash remains exactly
`69d803d2786e97bbd7519d2feed3ee29b79751b00a3c8a440432621927a13cde`.
This refresh changes evidence and machine review state only; it does not change
curriculum, implementation behavior, or lesson output.

The human owner subsequently recorded `APPROVE BOOK 2 OUTLINE WITH HOLDS`
against evidence-closure head
`2166cd074e1cb8d24f7908e9f792a996dbfd48e7` and the exact semantic hash above.
The binding decision is published at
https://github.com/meijer1973/4veco-platform/pull/226#issuecomment-5515033629.
This lifecycle-only transition records the governed approval pin and releases
only `H-OUTLINE-OWNER`; all named downstream holds remain active.

The owner then separately authorized PR #226 payload head
`b7f74aeded196669a215b920c16d671b6b919164` and one bounded
merge-governance transition at
https://github.com/meijer1973/4veco-platform/pull/226#issuecomment-5521351557.
That decision releases only `H-MERGE-GOVERNANCE` in addition to the already
released outline-owner hold. The other 13 content and lesson holds remain open;
the semantic outline hash, target registry, and lesson snapshot stay unchanged.

The payload adds:

- a canonical prose semantic outline plus a compact identity/freshness/target/
  review/hold machine companion for all 12 Book 2 paragraphs;
- action-scoped, evidence-releasable holds that permit §2.1.1 design while
  continuing to block approval and production;
- a Part A-owned `X.Y.Z-textbook-plan.md` and dedicated complete foundation
  template, while Part B retains its consumer-only `_paragraph-plan.md`;
- explicit five-way prerequisite classifications, non-goals, prepares-for,
  model conditions/relevant range, and target-dependent retrieval;
- a reusable structural/action/approved-use checker, CI wiring, and 88 focused
  mutation/contract tests, now 89/89 after the merge-transition fixture;
- renewed teacher, economics, curriculum-sequencing, and round-3 lead review evidence;
- a Level-4 human-review packet for draft PR #226.

The first remote PR run exposed that Windows Actions initially checked some
files out with CRLF before the workflow's reset. The checker now hashes
canonical UTF-8 text after line-ending normalization, and a dedicated mutation
proves LF and CRLF checkouts produce the same currentness verdict.

Local substantive implementation has `PASS` from the three renewed specialist
lenses and `PASS WITH FLAGS` from renewed lead review. The later
structural/governance rereview is also `PASS WITH FLAGS` and closes the
substantive bypass findings. Evidence closure and the human owner gate are now
complete. Separate payload/merge authorization is also complete. The remaining
flags are exact-head CI and governed integration validation for the bounded
merge-transition head, named downstream holds, and the non-independent review
disclosure—not a blocking substantive finding. The outline is
`approved_with_holds`; approved outline use and governed merge are permitted,
while goal/target approval, target repair and integration, production, and
lesson authoring remain blocked by their applicable holds.

## Acceptance test results

Passing command-log evidence includes:

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/BOOK-2-FOUNDATION-OUTLINE-1-plan.md`
- `node build-scripts/sprints/check-sprint-bundle.js BOOK-2-FOUNDATION-OUTLINE-1`
- `npm.cmd run check:book-outline-currentness`
- `npm.cmd run check:book-outline-currentness -- --require-approved` — PASS
- `npm.cmd run check:book-outline-currentness -- --action approved_outline_use` — PASS
- `npm.cmd run check:book-outline-currentness -- --action merge` — PASS
- `npm.cmd run check:book-outline-currentness -- --action outline_owner_decision` — PASS
- `npm.cmd run check:book-outline-currentness -- --action goal_design --paragraph 2.1.1` — PASS
- `npm.cmd run check:book-outline-currentness -- --action paragraph_production --paragraph 2.1.1` — expected FAIL on the two matching open holds
- `npm.cmd run check:book-outline-currentness -- --action chapter_production --chapter 2.3` — expected FAIL on the matching downstream Chapter 2.3 holds
- `npm.cmd run test:book-outline-currentness` — 89/89 tests
- `npm.cmd run check:blueprint-pedagogical-boundaries`
- `npm.cmd run check:part-a-exercise-authoring-contract`
- `npx.cmd jest build-scripts/workflows/check-part-a-exercise-authoring-contract.test.js build-scripts/workflows/check-blueprint-pedagogical-boundaries.test.js build-scripts/workflows/check-paragraph-workflow-wording.test.js --runInBand`
- `npm.cmd run check:paragraph-lane-scope -- --lane shared --base origin/main --head HEAD`
- `npm.cmd run check:paragraph-workflow-wording`
- `npm.cmd run check:scope-language`
- `npm.cmd run check:platform` — 1,742 tests passed
- accepted `validate-platform` run `33674533779` on payload-authorized source
  head `b7f74aeded196669a215b920c16d671b6b919164`; the bounded transition
  requires a new exact-head run
- roadmap, report-JSON, agent-index, URL-index, dashboard, finalization,
  evidence-line-ending, sprint-result, command-log, lead-review, review-packet,
  and complete-bundle checks
- platform and lesson `git diff --check`; lesson `git status --short` remained
  empty

Approved-use mode now passes because the governed owner approval binds the
exact version/hash/PR/commit/decision and `H-OUTLINE-OWNER` is released. The
mutation suite still proves that pending, mismatched, or incomplete approval
records fail closed.

## Changed files

Core outline and guardrail:

- `references/authored/book-outlines/book-2-outline.md`
- `references/authored/book-outlines/book-2-outline.meta.json`
- `build-scripts/workflows/check-book-outline-currentness.js`
- `build-scripts/workflows/check-book-outline-currentness.test.js`
- `package.json`
- `.github/workflows/platform-ci.yml`
- `AGENT_GITHUB_ENTRY.md`

Planning and review surfaces:

- `BUILD-PARAGRAPH.md`
- `BUILD-CHAPTER.md`
- `skills/econ-textbook-paragraph.md`
- `docs/workflows/textbook-paragraph-lane.md`
- `agents/teacher-learning-quality-review-agent.md`
- `build-scripts/templates/template-paragraph-plan.md`
- `build-scripts/templates/template-textbook-paragraph-plan.md`

Roadmap, sprint, gate, and generated navigation evidence:

- `docs/roadmaps/textbook/textbook-production-roadmap.md`
- `docs/roadmaps/textbook/sprint-ledger.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `reports/sprints/BOOK-2-FOUNDATION-OUTLINE-1-*`
- `references/data/sprints/BOOK-2-FOUNDATION-OUTLINE-1.*.json`
- `reports/review-gates/GATE-BOOK-2-FOUNDATION-OUTLINE-1/*`
- generated agent indexes, URL index, and internal dashboard artifacts

## Data integrity notes

No existing protected reference data changed. In particular,
`references/owned/`, `references/machine/`, and `references/external/` remain
unchanged. The sprint created one new derived artifact under
`references/authored/book-outlines/`; it did not mutate the blueprints,
target registry, boundary source, Part A contract, source data, or candidate
storage.

The lesson repository remained clean at
`f09fd6e88edc5049b026b16b0158e7e188091d2d`. No lesson Markdown, HTML, PDF,
answer, asset, chapter plan, or generated student-facing output changed.

The reviews are role-based checks performed within one Codex execution. They
are useful specialist lenses, but are not independent human reviews. The named
human owner approval is recorded separately against the exact evidence-closure
head and semantic hash.

## Open follow-ups

- Commit the bounded merge-governance transition, regenerate the required
  dashboard and index-only tails, and obtain successful `validate-platform` CI
  on the exact terminal PR #226 head.
- Bind that exact transition head to the existing bounded authorization, mark
  PR #226 ready, complete the governed dry run, then merge through the governed
  lane using a merge commit and require green post-merge CI.
- §2.1.1 goal/target design and specialist review may proceed provisionally,
  but approval/authority/production remain held until the exact release
  conditions are evidenced.
- Resolve the named target-quality holds separately, including stale
  cross-references, marginal-interval normalization, opportunity-cost scope,
  elastic contrast, v5 target limitations, and the §2.3.4 placeholder.
- Handle the missing lesson Book 2 root outline and Chapter 2.3 plan in a
  separate lesson-authorized task.

## Rollback instructions

Revert the approval-transition commits after owner-approved evidence-closure
head `2166cd074e1cb8d24f7908e9f792a996dbfd48e7` to restore the pre-approval
lifecycle state without changing the approved semantic payload. For full
payload rollback, revert the PR #226 commits after accepted substantive head
`72b87403ea7866aaee877e9945a2021cc2559552`, together with the earlier PR
commits, on the dedicated branch. Do not change the lesson repository because
this sprint made no lesson write.
