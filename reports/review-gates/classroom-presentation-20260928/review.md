# Classroom PowerPoint workflow integration

The current §2.1.4 teaching revision is recorded under Follow-up C below.
Earlier cold-run hashes and verdicts remain historical evidence of their
then-current instructions, not the current FietsWas artifact identity.

Owner request: retain the useful instructions and accepted §2.1.1 presentation
in the repositories, then test a fresh agent with only a §2.1.2 build request.
Prepare paired pull requests after content/visual satisfaction; no merge requested.

## Scope and sources

Platform owns the classroom recipe, skill/entry routing, portable paragraph
source and rendering helpers. Lessons owns final editable PPTX, matching slide
PDF and scoped provenance beside the paragraph's textbook exports. Existing
web-first policy remains for explicit web work. Book 1 and the Part A textbook
sources/PDFs are unchanged. These decks do not attest the full companion route.

Base commits: platform `1761cb96ef25da67b7830fade96e17d7a4db53ac`, lessons
`794cd54fe68f9b9a1bb413462373a133a459345c`. Main worktrees are the paired
`4veco-platform` / `4veco-lessen` checkouts under the task folder, branch
`codex/ppt-20260927`, ownership `ppt-20260927` / `codex-ppt`.

The accepted §2.1.1 outputs are byte-preserved. The manifest and lesson evidence
record their SHA-256 hashes, source commit/paths/hashes, assignments and printed
pages. The portable source rebuilt with the current installed artifact-tool
runtime: all 23 PowerPoint-rendered PNGs match the accepted reference byte for
byte. Package, layout, native charts/tables and reimport checks pass.

## Independent workflow review

A separate reviewer, with no authorship role, reviewed candidate platform
`825cab04` plus the renderer repair and lessons `ba79232`. Source/artifact hashes,
29 lane-scope tests, policy/wording checks, syntax and diff hygiene passed.

The reviewer found one P1 risk: PowerPoint COM can share the teacher's existing
application session, so unconditional Quit could close it. The repair detects
an existing process, restores DisplayAlerts, closes only its own presentation,
and quits only a newly started application with no other presentations open.
Both fresh-process export and export with a pre-existing test presentation were
exercised. The existing presentation and alert setting survive; a newly started
PowerPoint exits after COM cleanup. The reviewer inspected the fix and found no
remaining actionable workflow issues. Its review did not substitute for the
separate §2.1.2 content/visual acceptance below.

Lesson instructions use the existing shared platform-guide entry, avoiding an
unnecessary lesson AGENTS change. Platform diff is shared scope; lesson diff
is companion scope, including `– presentatie.pdf`. A focused test verifies
that ordinary textbook PDFs and arbitrary PDFs are not admitted by this suffix.

## Cold test protocol

An ephemeral agent process starts in an isolated platform worktree with an
adjacent lessons worktree. No parent conversation, prior §2.1.2 output, hidden
answer plan or follow-up coaching is supplied. Exact user prompt:

> Build the PowerPoint for paragraph 2.1.2.

The installed app's current agent executable is used with normal model settings;
an older CLI failed before generation because it could not run the configured
model, so that startup is not counted as a completed workflow test. No model,
user configuration or dependency installation was changed to repair it.

First test baseline: platform `825cab04`, lessons `ba79232`. The cold author
finished on platform `927129a1434c249bb81d7951c8e765b37a418272` and lessons
`85c1b5c0b5480f833d2b61b6bb3caa258fd34037`. The result is integrated into the
main task branch without changing the delivered PPTX/PDF bytes.

## Cold test outcome: PASS

The first completed cold run produced a proper 28-slide deck from the one-line
request. It discovered printed start page 14, start 1–2, basis 3–5, independent
6–7, target 8 and homework 3–8 from the current book. It used WafelWagen to teach
the target operations, then presented the full target context and a–d before
answers. It generated three shared overviews, 28 teacher-note parts, six native
tables, six native scatter charts and six embedded workbooks.

The author performed its own build/render/review loop. Its first export lacked
curve labels; a subsequent native-label export introduced unintended origin
labels. Without parent coaching, it corrected both, plus two text wraps, and
delivered revision 3. These are internal iterations of one cold run, not extra
prompts. No repository-instruction repair or second cold run was needed to
reach an acceptable presentation.

Parent acceptance checked the book and answers independently, inspected all
28 rendered draft slides, then all six changed final chart slides. The other
22 final PNGs are byte-identical to the inspected draft. All final chart
coordinates, numeric scales, intersections, capacity endpoints and vertical
profit/loss segments were checked from the saved PPTX. The repeated overviews,
note structure, units and complete question/answer ordering pass.

The saved PPTX opens and exports in actual Microsoft PowerPoint. All 28 PDF
pages were rendered; automated image comparison against corresponding PPTX
renders gives mean RGB differences below 1.78/255 per page. Parent visual
inspection of the dense overview, full question, whole-product calculation
and final target graph in the PDF found no divergence. The author additionally
recorded individual inspection of every PDF page. Neither review claims a
measured classroom time or learning-effectiveness trial.

Key target checks: TO = 1.50Q; Q=500 gives −150 euro/month; Q=1000 gives 200;
continuous break-even Q=500/0.70≈714.29 with total≈1071.43; 714 gives −0.20,
715 gives +0.50, so the first feasible no-loss quantity is 715 within capacity.
The final plot displays the 200-euro vertical distance at Q=1000, not an area.

| Final cold artifact | SHA-256 |
|---|---|
| PPTX | `a680e3fcd05c107318a2a22c231f204b919325bcf25d01fa461da814899d6e8f` |
| PDF | `133eff11cc9a8e27ec6f47da9aa53581e3623b0e2c5c9abe7bec6194992c6fbd` |

The cold author's reviewer service was unavailable. The parent supplied a
separate independent review after the run, without contacting the cold author.
That reviewer confirmed source accuracy, target coverage, notes, native objects,
printed pages, portability and individual slides 9–11 and 15–27. Its only P2
finding was a checker gap: missing break-even/loss series could evade coordinate
checks that only inspected existing series. The parent checker now requires
the exact series set per stage. Tests removing either required series fail,
while the unchanged delivered deck passes. This changes validation only.

## Final verification and publication scope

- 29 lane-scope Jest tests pass, including the bounded slide-PDF classification.
- Presentation policy, golden §1.1.1 package, PPTX skill mirror, workflow wording
  and active-governance wording checks pass.
- New JavaScript syntax, source/artifact hashes and diff hygiene pass.
- §2.1.2 saved-deck checks and the missing-series mutation checks pass.
- Platform shared scope and lesson companion scope pass without an exception.
- The independent renderer/checker findings are repaired and checked; final
  presentation bytes remain those of the accepted reference and cold result.

Publish paired PRs on the task branch. PR/CI status is reported in the PRs and
task completion rather than duplicated into this evidence with stale commit IDs.
No merge, deployment, textbook revision or full companion acceptance is included.

## Repository integration repair

The first full CI run exposed an existing Windows checkout problem in the
signed-edition predecessor check: an unmarked JSON pin was converted to CRLF.
An isolated checkout reproduced the failure despite the workflow's normalization.
Exact `-text` attributes for the two historical pins and held PV file preserve
their committed bytes; no pin, manifest or protected source was changed.

Checking the actual paired lesson checkout also exposed that the closed
historical receipt rejects additional companion files. The current
`check-classroom-edition.js` adapter preserves all 1,477 signed files, original
manifest/pin, predecessor, source, platform-input and staged-byte checks. It
admits only new, correctly named presentation/PDF/evidence files in an existing
Book 2 paragraph folder, plus the lesson navigation map. It does not certify
slide quality or amend the signed book. The sealed import verifier remains
unchanged for historical audits; the current npm structure command and test
use the adapter.

Both unchanged lessons at `794cd54fe68f9b9a1bb413462373a133a459345c` and the
paired lesson branch pass with `requireTracked`, the latter admitting exactly
six new classroom files. Eighteen adapter tests cover preservation, changed
or missing textbook files, attempted repinning, unknown additions, staged
drift, unrelated historical failures and exact Windows checkout bytes.
The existing signed-inventory and structural tests also pass. An independent
review found no remaining issue and independently reproduced all three exact
checkout-byte checks. Presentation source and final artifact bytes are unchanged;
this repair concerns repository integration after the successful cold build.

## Follow-up A: embedded chart workbook consistency

The external review requested validation hardening, without claiming that any
existing graph was incorrect. `build-scripts/presentations/chart_workbooks.py`
now follows each native chart's workbook relationship and A1 references, then
compares saved numeric/text cache values with the embedded XLSX cells. It
checks range lengths, missing/duplicate points, worksheet resolution and used
chart declarations. External sources, unsupported references and formula cells
fail explicitly; the checker does not evaluate workbook formulas or establish
economic/visual correctness. The §2.1.2 saved-deck checker invokes it too.

- Accepted §2.1.1: two workbooks, ten references, forty compared cells, PASS.
- Accepted §2.1.2: six workbooks, thirty-four references, sixty cells, PASS.
- For each actual deck, a temporary copy with only workbook cell B2 changed
  fails. A separate copy with only the corresponding chart cache changed fails.
  Original PPTX bytes and previously recorded hashes remain unchanged.
- Fourteen Python tests cover both mutations and malformed/unsupported data,
  shared text categories, references, missing values and declarations. The
  Jest bridge runs the portable fixture checks in normal CI; actual-deck tests
  run with `test_chart_workbooks.py --pptx <file>` against paired lesson files.
- Independent review passed the real-deck mutations, §2.1.2 integration and
  inline-text consistency checks without an actionable finding.

## Follow-up B: held-out mixed-exercise cold test

The second major lesson route was tested with exactly:

> Build the PowerPoint for paragraph 2.1.4.

One fresh ephemeral CLI agent started in isolated paired worktrees under
`C:/wt/ppt/.cold-214-1/`, with platform baseline
`8271c1fcbcf1b10c35dabad790bdbb6a619cba28` and lessons baseline
`08d7fd27830b5c42d1dbebc7fcb73b882b4d67a4`. Its thread was
`01a0e78c-24de-7503-8b1c-542d2dabf7a5`. It received no conversation history,
previous §2.1.4 presentation, answer plan or follow-up coaching. The task's
local `protocol.json`, `events.jsonl` and `final.txt` retain the prompt and run.
The author independently revised its first render to remove unwanted chart
labels and improve two crowded text areas. Revision 2 passed; there was no
second cold run or instruction change prompted by this test.

The parent accepted the resulting 24-slide deck against the current manuscript,
answer model and visually checked printed book pages 29, 32 and 33. The cold
author and independent reviewers also checked the supplementary page 34.

| Mixed-route requirement | Observed result |
|---|---|
| Start with exercise 1 | All three overviews say opgave 1, printed page 29. |
| Assign the complete actual set | Exercises 1–7, making and checking; bonus 6 and review 7 retain their source labels. |
| No invented basis/core split | Mixed practice 1–4 and existing target 5 are identified from the book; no guided/basis assignment is introduced. |
| Brief recap | One approach slide, feedback on the attempted start exercise, one marginal calculation and one graph-reading example; existing operations only. |
| Representative exercise after practice | Overview 8 starts independent practice; SmoothBox's sources and questions follow on slides 9–14, then solutions on 15–23. |

The recap's scope is appropriately bounded; this is a content judgment, not a
slide quota or a measured classroom duration. The teacher-confirmed normal
Book 2 Startopgaven/Begeleide inoefening mapping remains explicit and unchanged.

SmoothBox includes sources A–C and all six original questions before solutions.
Friday uses TK = 1,200 + 2Q and TO = 5Q, with capacity 1,000 per day. Break-even
is (400, 2,000), profit at 700 is EUR 900/day and GTK is about EUR 3.71/box.
Saturday retains only the four supplied table points. MK is 3/3.50/4 and MO is
5 per extra box; the three additional profits are 200/150/100 per day. The
positive Friday interval and whole-product quantities are distinguished, and
profit is shown as a vertical total difference. No unsupported extrapolation
or optimum is claimed.

Parent inspection covered every one of the 24 final PowerPoint-rendered PNGs.
Independent reviewer `/root/review_workflow` separately inspected all 24, the
sources, notes, new source/checker code and mixed-route requirements: PASS,
no actionable findings. The cold author's own independent reviewer also
reported PASS. These are artifact/source reviews, not learning-effectiveness
trials. The parent reviewer did not independently rebuild or reopen PowerPoint;
the cold author opened, rendered and exported the final file in native
Microsoft PowerPoint, and tested chart/table editability in a disposable copy.

The final saved-deck checker passes: 24 slides, 24 linked note sections,
10 native tables, 4 native charts, matching overview text/geometry and all
6 complete source questions. Workbook consistency passes across 38 references
and 84 cells. The parent rendered every PDF page and compared it with its
PowerPoint PNG: maximum mean RGB difference is 2.13/255. Separate visual PDF
checks of the overview, full questions, dense marginal table and final graph
found no divergence. The independent reviewer verified every slide text run
appears on its corresponding PDF page.

| Final mixed cold artifact | SHA-256 |
|---|---|
| PPTX | `8602a82f03bf2216dd16cb815db413ece238fff26998fc7715232850976b3896` |
| PDF | `4b5a5662019313003575e1c4897e69c6168a102ff5963225a8ae622f4625973b` |

Cold source commit `88f22292` and lesson commit `f93c57a` were incorporated
into the existing paired task PRs, retaining these reviewed artifact bytes.
The cold agent's draft PRs #262 (platform) and #61 (lessons) served as transfer
records; the active delivery remains platform #260 and lessons #59. Both
focused follow-ups pass without redesigning or lengthening the teaching recipe.

## Follow-up C: separate explanation from assigned work

The teacher's next source-level review accepted the technical work but clarified
the teaching contract: the default explanation must not work out assigned
practice answers, including non-target exercises. Feedback on an already
attempted start assignment can be teacher-selected and separate. The previous
cold run correctly followed its then-current recipe; it did not establish this
new distinction. Its historical PASS and artifacts above are retained as such.

The recipe now distinguishes a short authored teaching example from the actual
post-practice textbook discussion. It requires the visible label
`Uitlegvoorbeeld — niet uit het boek`, honest note provenance and a small
manifest role distinction. The prohibition concerns fabricated textbook sources
and page references; it does not prohibit legitimate teaching examples. Content
review checks whether assigned answers are exposed, without banning repeated
numbers or business names. Mixed recall stays brief without a slide quota.

The delivered §2.1.4 source replaces the five pre-practice worked slides with
the teacher-proposed FietsWas example. Fixed costs are EUR 36/day, variable costs
EUR 2/bicycle and price EUR 5/bicycle, with capacity 40/day and every washed
bicycle paid for. At 20 bicycles, TK = 76, TO = 100, profit = EUR 24/day and
GTK = EUR 3.80/bicycle. The 20-to-25 step gives MK = 10/5 = 2 and MO = 25/5 = 5
per extra bicycle. Notes explicitly distinguish this constant MK from intervals
in other cost tables. Break-even is (12, 60); the native graph has correct guides,
capacity endpoints and the vertical 76-to-100 profit segment at Q = 20.

Every example slide identifies authored data and has no book exercise/page
attribution. The other 19 slides, including all homework, SmoothBox sources,
complete questions and answers after practice, have unchanged content/geometry.
Only notes 2–7 change. Their source and source-hash checks remain intact.

The saved checker now verifies the example's role, disclosure, provenance,
calculations and graph, while retaining the existing question-order, overview,
source, note and SmoothBox checks. The revised file passes; the old deck fails
the new disclosure check, as does a copy with the authored label removed. This
does not automate the semantic judgment about revealing assigned answers.

The revised saved PPTX opened and rendered all 24 slides in native Microsoft
PowerPoint; PDF was exported from that same file. Parent and independent
reviewer `/root/review_workflow` each inspected all five changed slides and
their PDF pages. The other 19 PDF pages are pixel-identical to the previously
inspected version. Saved slide trees match there after ignoring generated
creation/relationship IDs; all three SmoothBox charts retain identical semantic
content and geometry. The reviewer verified every slide text run in the PDF.
All 24 PDF pages were rendered/compared against PowerPoint PNGs; maximum mean
RGB difference is 2.13/255. No clipping, arithmetic or graph findings remain.

Saved-file checks pass: 24 slides and notes, 10 native tables, 4 native charts,
44 workbook references and 94 compared cells. All 14 workbook tests pass,
including separate real-deck workbook-only and cache-only mutations. Independent
review: PASS, no actionable findings. Classroom timing remains unmeasured.

| Current §2.1.4 artifact | SHA-256 |
|---|---|
| PPTX | `7731c6d7a1840431404dd967e6515c88cf9d3a7c121dce9be2bcd960abf9bae7` |
| PDF | `b32ae5f042ccd580ec5206ab48bf5657c60d00b95062069645ac4020dff3b09e` |

### Compatibility with the newly merged book follow-up

During this revision, main gained the accepted Books 3/4 follow-up (#261/#60).
Both task branches incorporate it; the one scope-test conflict retains both
independent tests. The classroom adapter now authenticates the new 1,480-file
receipt using its existing history, file, source, target and staged-byte checks.
It excludes only the same bounded Book 2 classroom additions and navigation
from the exact changed-path comparison. Historical verifiers, pins and receipts
remain unmodified by this task.

The new receipt also seals the scope checker before the classroom slide-PDF
rule. The adapter permits only the exact anchored `presentatie.pdf` insertion
between the existing PPTX and HTML suffixes; reversing that insertion must
reproduce the authenticated full-file hash. All other tool changes fail.
Sixty-two focused tests pass. Independent mutations rejected additional,
moved, duplicated and broadened scope rules, changes to all 15 unrelated pinned
inputs, protected-source edits, coordinated source/manifest/pin repinning and
unstaged slide bytes. The real paired checkout passes with 1,480 protected
files and nine classroom additions; the final staged check is part of delivery.

### Fresh regression cold-test protocol

The revised generic recipe is also tested without the FietsWas implementation.
An isolated pair under `C:/wt/ppt/.cold-214-2/` starts from platform seed
`9162bd0599733ceaa2a6aaeb8aadac841988b28c` and lessons
`08d7fd27830b5c42d1dbebc7fcb73b882b4d67a4`. The seed is the original pre-§2.1.4
baseline `8271c1fc` plus only the revised classroom recipe. It contains neither
prior §2.1.4 output nor FietsWas source/data. This isolates the teaching rule
from the unrelated newly merged Books 3/4 follow-up. Root released the seed
worktree claim before starting the author.

Fresh ephemeral thread `01a0e806-07d0-7272-98d9-ac8fb7496987` receives exactly
`Build the PowerPoint for paragraph 2.1.4.` with no parent conversation or
follow-up coaching. Local `protocol.json`, `events.jsonl` and the final handoff
retain the run. Its output is a regression artifact, separate from the requested
FietsWas revision. The completed outcome, artifact hashes and available CI are
recorded in the active platform PR #260 rather than adding status-only commits
to this report. Passing requires a separate honest teaching example, no worked
assigned answers before practice, the full mixed assignment, complete later
SmoothBox discussion and the existing saved-file/render review.
