# INSPECT-11D Validation Log

Status: post-rebase local validation complete; paired PRs opened and final lead reviewed
Date: 2026-06-18
Sprint: `INSPECT-11D`

## Rebase Context

- Platform branch rebased onto `origin/main` at `5889de03`.
- Lesson branch rebased onto `origin/main` at `bfd6565`.
- Post-rebase validation ran after both branches were one scoped commit ahead
  of their fresh `origin/main` bases. The later platform log-only amend did
  not change source, generated lesson output, or rendered proof.

## Completed Build Evidence

The affected Chapter 1.3 lesson output was regenerated from the platform
generator in the paired lesson worktree.

```text
paragraph build_pdf.py: 1.3.1, 1.3.2, 1.3.3, 1.3.4 completed
chapter build_chapter.py: completed
PDF fallback: headless Chrome where WeasyPrint was unavailable
chapter table balancing: completed
```

## Local Validation Results

| Command | Result | Notes |
|---|---|---|
| `node build-scripts/sprints/check-sprint-plan.js archive/sprints/INSPECT-11D/INSPECT-11D-sprint-plan.md` | pass | Sprint plan satisfies required quality/proof headings. |
| `node -e "JSON.parse(...chapter-1-3-readiness-closure.json...)"` | pass | Closure JSON parses. |
| `node build-scripts/references/check-roadmap-version-index.js` | pass | 151 roadmap entries checked. |
| `npm.cmd run check:scope-language` | pass | Active scope-language surfaces OK. |
| `node build-scripts/sprints/emit-url-index.js --check` | pass | URL index current after regeneration. |
| `git diff --check` | pass | Platform diff hygiene clean. |
| `git -C <lesson worktree> diff --check` | pass | Lesson diff hygiene clean after generated text normalization. |
| `npm.cmd run check:platform` | pass | 54 test suites passed, 6 skipped; 809 tests passed, 8 skipped. |
| `node scripts/validate-chapter.js <Chapter 1.3>` | pass | Chapter 1.3: 0 errors, 0 warnings. |
| `node scripts/validate-paragraph.js --mode part-a --profile publisher-print <1.3.1>` | pass | Paragraph 1.3.1 passed all checks. |
| `node scripts/validate-paragraph.js --mode part-a --profile publisher-print <1.3.2>` | pass | Paragraph 1.3.2 passed all checks. |
| `node scripts/validate-paragraph.js --mode part-a --profile publisher-print <1.3.3>` | pass | Paragraph 1.3.3 passed all checks. |
| `node scripts/validate-paragraph.js --mode part-a --profile publisher-print <1.3.4>` | pass | Paragraph 1.3.4 passed all checks. |
| `node scripts/check-book.js --paragraph-mode part-a --paragraph-profile publisher-print <Book 1>` | fail outside scoped repair | Known pre-existing Chapter 1.1 and Chapter 1.4 assembly issues; output reports `OK chapter 1.3` and all Chapter 1.3 paragraphs OK. |
| `node build-scripts/sprints/check-sprint-bundle.js archive/sprints/INSPECT-11D` | known checker limitation | Legacy checker reports `unexpected sprint id format: archive/sprints/INSPECT-11D`; plan records this checker as visibility only for archived sprint-path layout. |

## Rendered Proof Validation

`archive/sprints/INSPECT-11D/rendered-proof/viewport-metrics.json` records no
horizontal overflow for:

- Chapter 1.3 desktop;
- Chapter 1.3 mobile;
- `1.3.4` opgaven desktop;
- `1.3.4` opgaven mobile.

Before/after PDF contact sheets for `1.3.4` opgaven and answers are present in
`archive/sprints/INSPECT-11D/rendered-proof/`.

## Final Validation And PR Publication

All required local validation has been run. The platform and lesson PRs were
pushed, visible, fresh against current main, mergeable, and green before final
lead review.

## Paired PR Validation And Final Lead Review

- Platform PR: `https://github.com/meijer1973/4veco-platform/pull/114`
- Lesson PR: `https://github.com/meijer1973/4veco-lessen/pull/28`
- Platform PR was opened first; lesson PR was opened second.
- Final lead review returned `PASS` for human-review request.
- Remaining gate: renewed human review and governed merge sequence.
