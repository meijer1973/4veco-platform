# Sprint BOOK-2-FOUNDATION-OUTLINE-1: Result

Generated: 2026-09-01

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

The payload adds:

- a canonical prose semantic outline plus a compact identity/freshness/target/
  review/hold machine companion for all 12 Book 2 paragraphs;
- action-scoped, evidence-releasable holds that permit §2.1.1 design while
  continuing to block approval and production;
- a Part A-owned `X.Y.Z-textbook-plan.md` and dedicated complete foundation
  template, while Part B retains its consumer-only `_paragraph-plan.md`;
- explicit five-way prerequisite classifications, non-goals, prepares-for,
  model conditions/relevant range, and target-dependent retrieval;
- a reusable structural/action/approved-use checker, CI wiring, and 44 focused
  mutation/contract tests;
- renewed teacher, economics, curriculum-sequencing, and round-3 lead review evidence;
- a Level-4 human-review packet for draft PR #226.

The first remote PR run exposed that Windows Actions initially checked some
files out with CRLF before the workflow's reset. The checker now hashes
canonical UTF-8 text after line-ending normalization, and a dedicated mutation
proves LF and CRLF checkouts produce the same currentness verdict.

Local substantive implementation has `PASS` from the three renewed specialist
lenses and `PASS WITH FLAGS` from renewed lead review. The flags are the human
gate, exact-head CI, named holds, and non-independent review disclosure—not a
blocking substantive finding. The outline remains `review_ready_with_holds`; §2.1.1 design and
specialist review are permitted, while owner approval, goal/target approval,
production, lesson authoring, and merge remain blocked.

## Acceptance test results

Passing command-log evidence includes:

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/BOOK-2-FOUNDATION-OUTLINE-1-plan.md`
- `node build-scripts/sprints/check-sprint-bundle.js BOOK-2-FOUNDATION-OUTLINE-1`
- `npm.cmd run check:book-outline-currentness`
- `npm.cmd run check:book-outline-currentness -- --action goal_design --paragraph 2.1.1` — PASS
- `npm.cmd run check:book-outline-currentness -- --action paragraph_production --paragraph 2.1.1` — expected FAIL on the two matching open holds
- `npm.cmd run test:book-outline-currentness` — 44/44 tests
- `npm.cmd run check:blueprint-pedagogical-boundaries`
- `npm.cmd run check:part-a-exercise-authoring-contract`
- `npx.cmd jest build-scripts/workflows/check-part-a-exercise-authoring-contract.test.js build-scripts/workflows/check-blueprint-pedagogical-boundaries.test.js build-scripts/workflows/check-paragraph-workflow-wording.test.js --runInBand`
- `npm.cmd run check:paragraph-lane-scope -- --lane shared --base origin/main --head HEAD`
- `npm.cmd run check:paragraph-workflow-wording`
- `npm.cmd run check:scope-language`
- `npm.cmd run check:platform` — 108 suites and 1,697 tests passed; 6 suites
  and 8 tests skipped
- roadmap, report-JSON, agent-index, URL-index, dashboard, finalization,
  evidence-line-ending, sprint-result, command-log, lead-review, review-packet,
  and complete-bundle checks
- platform and lesson `git diff --check`; lesson `git status --short` remained
  empty

Approved-use mode is intentionally not a passing acceptance test while
`H-OUTLINE-OWNER` remains active. It fails closed until a governed follow-up
records the owner's exact version/hash/PR/commit approval.

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
are useful specialist lenses, but are not independent human reviews and do not
substitute for the named owner gate.

## Open follow-ups

- Obtain successful `validate-platform` CI on the exact terminal PR #226 head,
  then ask the owner to approve, revise, or reject that exact payload.
- If approved and later merged, record the owner version/hash/PR/commit pin in a
  governed follow-up before approved-use mode may pass.
- §2.1.1 goal/target design and specialist review may proceed provisionally,
  but approval/authority/production remain held until the exact release
  conditions are evidenced.
- Resolve the named target-quality holds separately, including stale
  cross-references, marginal-interval normalization, opportunity-cost scope,
  elastic contrast, v5 target limitations, and the §2.3.4 placeholder.
- Handle the missing lesson Book 2 root outline and Chapter 2.3 plan in a
  separate lesson-authorized task.

## Rollback instructions

Revert the PR #226 commits after reviewed substantive head
`c38040d34bae12f6c61c1d26a43c5bdf354927b8`, together with the earlier PR
commits, on the dedicated branch. Do not change the lesson repository during
rollback because this sprint made no lesson write.
