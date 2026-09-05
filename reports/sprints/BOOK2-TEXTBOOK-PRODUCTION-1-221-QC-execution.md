# §2.2.1 R6 specialist QC — execution log

Date: 2026-09-05. Reviewer: released_pin_analysis.
Task: BOOK2-TEXTBOOK-PRODUCTION-1-221-QC.

## Completed checks

- Paired isolated worktrees claimed under the correct task/owner; fresh fetch
  in both repositories exit 0; governance freshness PASS against origin/main
  96416b6b5bd57094576e9aba0a42d682584ec479, no differing policy files.
- Approved currentness, exact action specialist_review / paragraph_production,
  paragraph 2.2.1: both PASS. Durable target authority: all twelve PASS.
- Forty-three input/document/asset/page raw hashes independently recomputed:
  PASS. Three canonical immutable manifest hashes match; all still PENDING
  with empty pages_inspected. Exact paragraph/chapter plan LF hashes match.
- Source tests: `C:/Python314/python.exe -m unittest discover -s
  build-scripts/content/book-2/221 -p test_source.py -v`: ten PASS.
- Existing R6 check_render.inspect rerun read-only with Path.read_text JSON
  remapping in memory from book2-221-production-20260905 to the QC pair:
  PASS. No manifest/file was rewritten, no --rebuild or --output option used.
  Exact target/goals/points/answers, HTML exercise identity, fresh hashes,
  minimum 12pt body/footer and 12.221pt placed image text all PASS.
- Independent rational arithmetic: eight complete Ev chains, two Start
  percentages and two closing percentages PASS. All ten SVG bars have exact
  origin/length; ink/blue contrast on white 14.528/8.358.
- Direct visual inspection: all twenty current R6 individual pages and all
  three PNG assets, plus all SVG sources. PASS; no older-page transfer used.
- The actual full paragraph_221_review R2 report at root commit
  406e0b0af719d4b1720f19e0fb63c2516881955f was read before canonical records.
- Post-write `validate-paragraph.js --mode part-a --profile student-web`
  and `--profile publisher-print` for the QC paragraph: both PASS, zero
  errors. Publisher-print's inventory mentions existing companion-plan asset
  declarations; that does not constitute companion review or acceptance.
- JSON parsing, three inspection-record/page-array bindings and all 43 source
  hashes rerun after writes: PASS. No authored source/output or manifest drift.
- Legacy flat quality-ref migration is classified as **partA only** by
  changedQualityRefBlocks. Paragraph/title/chapter identity retained exactly;
  no companion block existed or was added/altered. June-specific Part A
  approval/content assertions were replaced rather than reused.
- Paired-change checkLaneScope API against actual working-tree file paths and
  actual before/after YAML blocks: textbook PASS without exception, with one
  Part A review and supporting evidence. No shared, companion or unknown path.
- Both git diff --check checks PASS. Worktree safety --check for both pairs
  PASS with expected owned-dirty warnings before commit.

## Diagnostic caveats, not hidden passes

An initial CLI scope invocation used --base HEAD before commit and correctly
reported no committed changed paths. The checker does not inspect uncommitted
files. The subsequent paired API check used actual pending paths and YAML
content; committed lesson scope is checked again before final publication.
The platform-only QC commit consists solely of supporting review evidence;
it cannot independently satisfy the textbook CLI's requirement for a lesson
Part A change. Root must assess it with the paired lesson review or its
combined integration delta. No fake scope exception or shared code edit was
introduced to force a platform-only PASS.

A guessed worktree-checker path and an invocation missing --check failed at
startup; corrected npm --check invocations then passed. Neither failed command
mutated worktrees or constituted a claimed validation result.

## Scope of acceptance and remaining work

Independent specialist verdict PASS WITH FLAGS, required content revisions 0.
Teacher rubric 14/14, student 12/12, scoped visual 10/10; detailed rationale is
in BOOK2-TEXTBOOK-PRODUCTION-1-221-specialist-review.md. All twenty current
page observations and hashes are separately bound in new inspection.json
records; generated manifests remain honestly PENDING.

The 48.5-minute core and guided ten minutes outside it remain estimates,
not observed timing or attainment. Optional Inspectie mapping is omitted
following the mandatory freshness check; protected reference update is a
separate task. Full digital accessibility, companion, chapter/book assembly,
full repository suite, remote CI and PR/merge are not claimed here.

Only platform QC evidence and lesson review/Part A quality fields were changed.
Root retains final paired integration, handoff and combined lead/CI/PR gates.
Exact publication commits and remote-match status are reported after normal
push; this file deliberately does not self-pin its own enclosing commit.
