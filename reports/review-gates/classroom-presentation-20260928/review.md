# Classroom PowerPoint workflow integration

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
