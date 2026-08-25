# PR #200 Renewal Plan

Generated: 2026-08-23

## Goal

Renew PR #200 against current platform `main` while preserving its intended
workflow clarification and every newer companion-route guardrail.

The repository has exactly two paragraph-production lanes:

- **Part A / textbook lane** owns textbook source, textbook HTML renders,
  `build_pdf.py`, and paragraph PDFs used for human review. The
  `publisher-print` profile remains the later Part A chapter/book print handoff;
  it is not the only paragraph PDF gate.
- **Part B / companion lane** owns the student-web companion route, native HTML
  and games, route files, and companion PPTX. DOCX is an opt-in Office/legacy
  export, not a normal Part B requirement.

`student-web`, `publisher-print`, `office`, and `legacy-full` are validation or
export profiles, not additional production lanes.

## Quality Standard

Quality floor: an external reviewer must be able to identify the two lanes and
their outputs without mistaking profiles, formats, or route phases for separate
lanes. Part A baseline validation must require the normal PDF review packet,
and Part B baseline validation must remain free of DOCX requirements.

Specification requirements: preserve current `main` as the authority for the
full `Start -> Leer -> Check -> Oefen -> Exit ticket` companion route, including
the advisory short check and separate target-equivalent exit ticket. The
14-file Part B validator baseline must be described as a baseline, not as the
complete product state.

Rendered output and student-facing lesson files are out of scope. This renewal
changes platform workflow, validation, and review guidance only. Proof must
show that the current lesson repository already satisfies the Part A PDF rule;
no lesson-content migration is expected. That proof must use a fetched, pinned
`4veco-lessen origin/main`, not the state of an arbitrary sibling checkout.

## Required Corrections

| Requirement | Implementation evidence | Review and proof |
|---|---|---|
| Synchronize with current `main`. | Merge `origin/main` into the existing PR branch without rewriting published history. | Clean mergeability and a compare showing behind by zero. |
| Preserve newer route guardrails. | Resolve conflicts from current-main wording first, then reapply only the Part A PDF clarification. | Diff review confirms `Start -> Leer -> Check -> Oefen -> Exit ticket`, advisory short check, target-equivalent exit ticket, and baseline-versus-product wording remain intact. |
| Correct `build-scripts/README.md`. | Part A `student-web` profile guidance requires source, textbook HTML renders, `build_pdf.py`, and paragraph PDFs; `publisher-print` is the chapter/book handoff profile. | Wording consistency search and lead review. |
| Correct the textbook-to-companion handoff. | Make Part A PDF outputs and `build_pdf.py` normal required handoff evidence, independent of `publisher-print`. | Template review and scope-language check. |
| Clarify the legacy profile. | State that 14 files are only the Part B validation baseline and do not prove the complete route. | Lead review against current-main route requirements. |
| Keep validator behavior narrow. | Part A baseline requires `build_pdf.py` and PDFs; normal Part B `student-web` has no DOCX requirement. | Focused Jest tests plus the full platform suite. |
| Refresh generated maps. | Regenerate agent indexes and URL index from the repaired branch. | Clean regeneration rerun and generated-file diff review. |
| Invalidate stale evidence. | Do not reuse the July authorization or readiness evidence. | Fresh exact-head lead review, CI, PR Readiness, mergeability, and human-review packet. |
| Prove lesson-main compatibility. | Inventory every active lesson paragraph containing textbook markdown at a pinned lesson `origin/main`; verify `build_pdf.py` and the complete type-specific PDF packet. | Record lesson SHA, paragraph count, pass count, and failures in `lesson-main-pdf-inventory.json` and `.md`. |

## Conflict Strategy

1. Merge current `origin/main` into the published PR branch. Do not rebase or
   force-push.
2. For hand-authored conflicts, begin from the current-main version and
   incorporate the narrow Part A PDF clarification. Do not accept the older PR
   version wholesale.
3. Preserve current-main route sequencing, product completeness warnings,
   review requirements, and companion terminology.
4. For generated index conflicts, keep current-main inputs, complete the source
   repairs, and regenerate rather than hand-merging generated content.
5. Inspect every overlapping changed path, including auto-merged files, for
   semantic regression.

The expected content conflicts are:

- `AGENTS.md`
- `BUILD-PARAGRAPH.md`
- `agents/econ-companion-visual-review.md`
- `reports/github-agent-index-platform.json`
- `reports/github-agent-index-platform.md`

The expected overlapping paths that auto-merge but still require semantic
review are:

- `docs/workflows/web-companion-paragraph-lane.md`
- `scripts/tests/validate-paragraph.test.js`
- `skills/econ-companion-artifacts.md`
- `skills/econ-quality-control.md`

Record the resolution and retained current-main behavior for all nine paths in
`conflict-resolution-log.md`.

## Allowed Scope

- The existing PR #200 workflow, validator, test, agent, and skill surfaces.
- `build-scripts/README.md`.
- `build-scripts/templates/textbook-to-companion-handoff.md`.
- Narrow tests needed to lock the repaired wording or validator behavior.
- `build-scripts/workflows/check-part-a-pdf-readiness.js` and its focused test.
- Narrow deterministic-timestamp support and tests for
  `build-scripts/reports/github-agent-index.js` when needed for reproducible
  generated-tail verification.
- Generated repository maps and indexes required by current governance.
- Renewal plan, compatibility proof, conflict log, and lead-review records
  under this directory.

## Forbidden Scope

- Generated lesson output or paragraph content in `4veco-lessen`.
- New production lanes, new output profiles, or a lesson migration.
- Changes to the companion route beyond preserving current-main behavior.
- Protected reference mutation under `references/machine/` or
  `references/external/`.
- Raw merge, stale authorization reuse, or admin bypass.

## Execution

1. Record and obtain lead-review approval of this plan before resolving the
   merge conflicts.
2. Return PR #200 to draft. Post a renewal notice that preserves but explicitly
   supersedes the July readiness and payload-authorization records; neither may
   be reused. Require a new reviewed payload SHA and new human authorization.
3. Merge current `origin/main`; resolve all conflicts according to the conflict
   strategy and inspect every overlap.
4. Complete `conflict-resolution-log.md` for the five content conflicts and
   four semantic auto-merges.
5. Repair the two missed workflow surfaces and the legacy-profile wording.
6. Add focused regression tests proving that Part A baseline validation fails
   without `build_pdf.py`, fails when any required paragraph PDF is absent,
   and Part B `student-web` passes without DOCX. Add a deterministic wording
   check proving that the 14-file baseline is not called complete-product proof
   and that the advisory short check remains separate from the target-equivalent
   exit ticket.
7. Fetch lesson `origin/main` in a clean detached lesson worktree and run
   `check-part-a-pdf-readiness.js` with both the expected lesson SHA and the
   JSON/Markdown output paths. The checker must discover every active paragraph
   containing textbook markdown, determine the required packet by paragraph
   type, fail nonzero for any missing `build_pdf.py` or PDF, and bind both
   evidence files to the observed/fetched lesson SHA. Require lesson `HEAD`,
   lesson `origin/main`, and `--expected-lesson-sha` to resolve to the same SHA
   before the audit or index generation proceeds.
8. Run focused paragraph validator tests, the full test suite, scope and lane
   checks, current platform checks, and diff hygiene.
9. Commit the repaired source, tests, compatibility inventory, conflict log,
   and pre-implementation review evidence.
10. From that committed source head, set `FOURVECO_LESSEN_ROOT` to the clean
    detached lesson-main worktree, both lesson source-ref variables to
    `origin/main`, and a fixed `FOURVECO_INDEX_GENERATED_AT`. Regenerate the
    four agent-index files and URL index from source commit `S`, stage exactly
    those five files, rerun both generators with identical inputs, and compare
    the working copies to the staged versions to prove idempotence. Commit only
    those generated files as generated tail `G`. Verify `S` is `G^` and
    `S..G` contains only the five allowlisted paths. On committed `G`, run agent
    index freshness, URL-index check mode, and final diff hygiene before push.
11. Push the generated-tail candidate. Re-fetch the remote branch and record
    its exact SHA.
12. Obtain implementation lead/delta review against that exact remote SHA. If
    corrections are required, implement, validate, regenerate if needed,
    commit the source correction, regenerate and commit a separate deterministic
    tail, push, and repeat review on the new exact remote SHA until the reviewer
    returns `OK` or `PASS`.
13. On the final lead-reviewed head, wait for exact-head
    `platform-ci / validate-platform`, confirm clean mergeability and no
    unresolved review threads, then run finalization freshness after fetching
    both remote `main` and the PR branch.
14. Run exact-head PR Readiness and the final sub-agent PR workflow review. If
    either produces a required repository correction, commit/push it and repeat
    every affected exact-head gate. Permit no later substantive or evidence
    commit without repeating lead review, CI, freshness, and readiness as
    applicable.
15. Apply only the readiness transition allowed by the fresh decision, then
    present PR #200 for renewed human authorization. Stop before merge.

## Validation

At minimum, run the repository-current equivalents of:

```powershell
npx.cmd jest build-scripts/workflows/check-paragraph-lane-scope.test.js build-scripts/workflows/check-part-a-pdf-readiness.test.js scripts/tests/validate-paragraph.test.js scripts/tests/validate-paragraph-modes.test.js --runInBand
npm.cmd test -- --runInBand
npm.cmd run check:scope-language
npm.cmd run check:paragraph-lane-scope -- --lane shared --base origin/main --head HEAD
npm.cmd run check:platform
$env:FOURVECO_LESSEN_ROOT = "<clean-detached-lesson-main-worktree>"
$env:FOURVECO_LESSEN_SOURCE_REF = "origin/main"
$env:FOURVECO_LESSEN_SOURCE_BRANCH = "origin/main"
$env:FOURVECO_INDEX_GENERATED_AT = "2026-08-23T00:00:00.000Z"
git -C $env:FOURVECO_LESSEN_ROOT fetch --prune origin
git -C $env:FOURVECO_LESSEN_ROOT rev-parse HEAD
git -C $env:FOURVECO_LESSEN_ROOT rev-parse origin/main
node build-scripts/workflows/check-part-a-pdf-readiness.js --lesson-root $env:FOURVECO_LESSEN_ROOT --expected-lesson-sha "<fetched-lesson-origin-main-sha>" --json-out reports/review-gates/PR200-RENEWAL-20260823/lesson-main-pdf-inventory.json --markdown-out reports/review-gates/PR200-RENEWAL-20260823/lesson-main-pdf-inventory.md
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js --branch codex/part-a-pdf-human-review-workflow-20260702
git add reports/github-agent-index-platform.json reports/github-agent-index-platform.md reports/github-agent-index-lessen.json reports/github-agent-index-lessen.md reports/url-index.md
npm.cmd run agent:index
git diff --exit-code -- reports/github-agent-index-platform.json reports/github-agent-index-platform.md reports/github-agent-index-lessen.json reports/github-agent-index-lessen.md reports/url-index.md
git commit -m "Refresh generated repository indexes"
git diff --name-only HEAD^..HEAD
npm.cmd run check:agent-index-freshness
node build-scripts/sprints/emit-url-index.js --check --branch codex/part-a-pdf-human-review-workflow-20260702
git diff origin/main...HEAD --check
git diff --check
```

The exact command set may expand when current `main` exposes additional
required checks. Any failing current-main check must be investigated rather
than waived silently. After the final commit and push, fetch both remote refs
and run `npm.cmd run finalization:freshness` against the exact reviewed head.

## Acceptance And Stop Conditions

Acceptance requires all of the following:

- current `main` is an ancestor of the repaired PR head;
- the two-lane vocabulary is unambiguous across all active workflow surfaces;
- Part A PDF review output is baseline, while publisher-print remains the
  Part A chapter/book handoff;
- the Part B 14-file baseline is not represented as the complete route;
- current-main route guardrails survive;
- focused and full validation pass;
- the pinned lesson-main inventory records every active textbook paragraph as
  passing, or names any failure as a blocker;
- generated indexes are current;
- lead review and PR workflow review return `OK` or `PASS` at the relevant
  exact heads;
- GitHub reports the PR mergeable with exact-head CI green;
- PR Readiness routes the governance change to human review.

Stop and return for owner direction if conflict resolution would require a
lesson-content migration, change product-route behavior, introduce a third
lane, weaken a current-main guardrail, or broaden authority beyond this
workflow clarification.

## Rollback

Before push, abort the in-progress merge if a stop condition is reached. After
push, revert only the renewal commits through a follow-up PR; do not rewrite the
published branch history. The July authorization remains invalid regardless of
rollback because manual conflict resolution has occurred.
