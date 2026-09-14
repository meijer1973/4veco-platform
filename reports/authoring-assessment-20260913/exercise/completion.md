# Exercise correction assessment

The requested assessment-only correction is implemented and independently reviewed with a scoped PASS: Opgave 2 now uses EUR 175 per month for the software subscription, TCK = 1075 and TK = 1475 at 200 posters. The fixed/variable distinction, question structure, target operations, other amounts and workload are preserved. Ten textual files contain only the requested numeric replacements; five PDFs and the existing ZIP were regenerated. See `independent-review.md` for the parent review. No full paragraph, chapter, browser or classroom-release acceptance is claimed.

## Evidence and scope

- `review-ready.md` and `scoped-review-manifest.json` describe the 16-file delta. Manifest SHA256: `734b714ba97e980a3458290a429455e2aadc17fda390d857cb53da25c11deb43`.
- Existing builders succeeded; page counts remain 6/5/8 for paragraph answers/opgaven/paragraaf and 24/36 for chapter answers/text. Six changed pages were visually inspected; ten neighbours are pixel-identical to the baseline. `review-pages.json`, `visual-page-comparison.json` and `renders/` preserve that evidence.
- Final serialized HTML was separately rendered offline. Its six affected page images match the inspected PDF images exactly (`html-offline-review/results.json`). CUA rejected local-file navigation; no workaround was attempted. Browser-specific rendering is unverified.
- `scoped-final-check.log` verifies the exact text delta, arithmetic, unchanged manifest and ZIP membership/payloads. The ZIP retains 15 entries; its 14 file payloads equal current standalone files. Its old graph assets, graph-bearing renders and quality metadata were already stale; these were synchronized to keep the refreshed bundle internally consistent. `zip-member-comparison.json` makes this explicit. No historical review was renewed.
- `diff-hygiene-final.log`: exit 0. Full Part A validation exits 1 only because the existing paragraph lacks a current review manifest. This is a reported baseline acceptance gap, not a new exercise failure. Parent review also identified an unchanged orphaned Opgave 4 heading on integrated paragraph page 6; it was outside the numeric correction and preserved.
- Post-commit `textbook-lane-scope.log`: exit 1, with 15 files classified Part A and the existing `opgaven.zip` classified unknown. This remains an explicit automated-check gap. No exception or tooling change was added. Committed diff hygiene passes; reviewed manifest hashes remain unchanged after commit.

## Skills actually used

- `4veco-platform/skills/econ-exercise-builder.md`: scoped question/answer revision, target-operation check, dependent-value inspection, unchanged timing rationale.
- Installed `pdf/SKILL.md`: artifact marker for five PDF edits, raster review and final static-output verification. Existing Pandoc/WeasyPrint builders supplied generation; no renderer/tooling edits were made.
- The installed `computer-use/SKILL.md` was read but not applied: it documents native `sky`, whereas this session exposes CUA browser APIs and disables native APIs. The browser API's own returned documentation was used for the failed local-HTML attempt. Textbook, graph, didactic and quality-control skills were not loaded because their authoring decisions did not change.

## Timing and measurement

- Start: 11:38:32.744 UTC. First student-content edit: 11:41:05.973 (2m33s). First review request: 11:44:48.710 (6m16s).
- `measurement-summary.json` initially records 22 external-reader events across 20 paths, 11,394 selected words. These are selected-text volume, not tokens. Platform AGENTS was retried after a Windows UnicodeEncodeError; chapter-builder reads were disjoint sections, not repeated content. Tool-returned documentation and searches are recorded separately in `events.jsonl`.
- Dedicated command logs contain exact commands, return codes and measured subprocess durations. The first chapter build failed on a long Windows path (0.15s); the unchanged script succeeded using `\\?\` (6.80s). Paragraph build took 2.35s; offline final-HTML retry took 14.17s. A QA-only filename error cost one failed 2.07s run.
- Active logging/reporting time was not continuously timed; estimated total is roughly 2 minutes so far. Two early event duration fields were estimates (25s logging, 30s visual check), explicitly corrected and excluded from measured totals. This is a measurement limitation. The final completion segment is separately timestamped.

## Friction and suggested improvements

- The narrow-route clauses helped: Part A checklist lines 10–15 says “For a bounded revision, reuse valid plans, foundation and prior checks”; exercise skill lines 18–25 says “Do not generate the other exercise stages, a paragraph plan, PDF packet or review records solely because this skill describes a complete set.” They prevented an unrelated paragraph rewrite. Keep this distinction prominent.
- Part A review lines 20–26 says “Do not restart authoring or require a new full exercise set for a bounded edit” and allows scoped findings without paragraph acceptance. The full validator nevertheless has no bounded-revision mode and fails on the missing historical manifest. Add a clearly named delta-check mode that reports baseline acceptance gaps without implying paragraph PASS.
- AGENTS lines 14–15 says “Repair generated outputs through their source and owning platform tool.” The existing lesson wrappers are older renderers, while the shared platform renderer would restyle the entire paragraph. Define an explicit supported bounded-rebuild route for existing editions. This run reused the existing wrappers and normalized only serialization whitespace, yielding numeric-only final text diffs.
- Maintenance preflight lines 107–108 says “Use a user-specified task folder when provided.” This long assessment path caused the existing chapter builder to fail opening a valid sibling filename. Make builders safe for Windows long paths and UTF-8 by default; do not require authors to discover `\\?\` or `python -X utf8`.
- PDF skill line 17 requires an artifact marker and line 139 requires final PNG inspection. Those were satisfied. Browser URL policy prevented local HTML navigation; offline exact-pixel evidence should be an explicit acceptable static-artifact fallback when browser-specific behavior is irrelevant.
- Unnecessary work: an overbroad `zip|archive` search returned 25,309 tool tokens and was truncated; it was narrowed, and no unrelated archive/assessment/experimental PR was opened. The native computer-use skill read and failed browser attempt added overhead. The first diff command also used the wrong working directory once. These are recorded as author/tool friction, not repository defects.
- The prescribed textbook lane checker rejects this existing student-output ZIP: “unknown paths require explicit classification.” Add an explicitly scoped archive-output classification or documented supported packaging route in a separate tooling task; this assessment prohibits tooling changes and leaves the failure visible.

## Repository and publication state

Paired worktrees: `exercise/4veco-platform` and `exercise/4veco-lessen`; branch `codex/assessment-exercise-20260913`; owner `assessment-exercise`. Platform remains clean at `85b0f347f3070e005eae3f35f0b11ce6eac71b4d`. Lessons is clean at local commit `6b9b5134a6983fc1aae7e35e4061c1908c814196` (base `0acaaa97443e5c4fee34f7da8a12ccd5db62d762`). The independent review binds the unchanged 16-file manifest. No push, PR, merge, deployment, policy change or package mutation occurred. Remote CI was not run.

The bounded correction is complete. Remaining outside this local assessment: ZIP lane classification, any future whole-paragraph baseline review/current manifest, and browser-specific QA if that delivery mode is requested. Existing worktree ownership is retained for handoff to the parent. Substantive work stopped after local commit and final checks, before 11:50 UTC and well before the 12:08:30 deadline; the exact final event/time metrics are in `events.jsonl` and `measurement-summary.json`.
