# Targeted closure addendum — 14 September 2026

The authorized optional-packaging cleanup is complete. Local lesson commit: `5c5ebf387550c636f665f7ced4f08b10315b831c`, following the timed-run commit `5c72fdb04865dee214da677fcbc9d09c1073bc46`. The actual textbook lane checker and Part A validator both return **PASS, exit 0**. Both paired worktrees are clean, on `codex/assessment-paragraph-20260913`, owner `assessment-paragraph`; platform remains `85b0f347f3070e005eae3f35f0b11ce6eac71b4d`.

This is a separate cleanup after the timed assessment, not additional timed authoring. `completion.md`, `measurement-summary.json`, the original negative lane result and the independent review retain the 13 September outcome. Its stop time and reading/authoring measurements have not been rewritten. Two entry-instruction rereads were appended to the original `events.jsonl` with explicit 14 September timestamps before closure logging moved to `closure-20260914/events.jsonl`; those reads are outside the original timed totals.

## Changes and preservation

The refreshed exercise ZIP was copied byte-for-byte to `closure-20260914/delivery/2.1.1 Kostenstructuren – opgaven.zip`, outside the tracked lesson tree. Its SHA-256 is `3643bcf518473342aa23a9d06310c4deafc89faa0d545e026b24377e4b13d2fd`. ZIP CRC and every member were checked against the current exercise MD/HTML/PDF and local assets.

The tracked ZIP was restored exactly from lesson baseline `0acaaa97443e5c4fee34f7da8a12ccd5db62d762`; restored SHA-256 is `bb951635865a5e7e321f562ef73c640c84948f99441385f217cf366d9e3e996d`. The handoff now identifies ZIP packaging as optional external delivery evidence and explains that the tracked legacy ZIP is not this draft's delivery package. These are the only two tracked-file changes. The quality record already excluded ZIP packaging, so it needed no change.

All 18 reviewed files and the manifest file remain byte-identical to the timed-run commit. Each saved manifest file hash was checked as well. The accepted manifest remains `76f9267ba0dc5934631cb9f74e49380b54b26e099630055a4e175f0f11f403d6`; no content, target/source authority, figure, HTML, PDF, review, plan, foundation or generator changed. No rendering was repeated.

## Checks and evidence

| Check | Result | Evidence |
|---|---|---|
| Expected clean paired heads and ownership | PASS; existing claims match owner/task | `closure-20260914/events.jsonl` |
| Governance freshness against fetched `origin/main` | PASS; no differing entrypoints | `closure-20260914/events.jsonl` |
| Exact reviewed files, manifest and ZIP preservation | PASS | `closure-20260914/packaging-export.json`, `packaging-verify.json` |
| `validate-paragraph.js --mode part-a` | PASS, exit 0; current manifest and review | `closure-20260914/part-a-validation.txt`, `part-a-validation-result.json` |
| Actual textbook lane, `--base origin/main --head HEAD` | PASS, exit 0; 21 Part A paths and one quality record, no unknown ZIP delta | `closure-20260914/lane-scope.txt`, `lane-scope-result.json` |
| `git diff --check` and final paired status | PASS; clean; ZIP has no baseline-to-HEAD delta | `closure-20260914/events.jsonl` |

The claims were older than eight hours, which the checker reported as a warning; the same owner/task checks passed and no lock was overridden. No additional dependency issue arose in the requested checks. Actual-browser QA, shared skill/checksum work and any dedicated remote evidence branch remain with the parent task. This addendum makes no new claim about browser compatibility or hosted CI, and nothing was pushed, merged, deployed or published.

## Assignment provenance and work scope

The initial cold-agent assignment was retained in this conversation and is captured verbatim in `task-prompt.md`, clearly identified as retained text rather than reconstructed wording. The cleanup used the repository entry instructions, existing ownership/current-file checks and the narrow Part A closure route. It did not load authoring skills, create new teaching material or run a broad test suite.

Closure began at 06:59:49 UTC. Key command wall times: initial pair checks 0.470/0.518 seconds; fetches 0.917/0.924; governance 1.790; ownership 0.904/0.866; export verification 1.279; ZIP restore 0.162; local commit 0.400; final Part A validation 0.651; lane check 0.763; final packaging and hygiene batch 1.627. File-read ranges and subsequent completion timestamp are retained in the separate closure event log.
