# Ordinary Part A review and closure

This is the canonical review rule for ordinary textbook paragraph and chapter
authoring or revision, including consolidation and test preparation, using
approved teaching authority, existing production tools and output contracts.
It governs staffing and closure even when the work appears in a named roadmap
sprint. Platform/generator changes, companion interactions, protected sources,
curriculum authority and review-policy changes use their applicable routes;
mixed tasks retain the checks and decisions required by those changes.

## Build, review and repair

1. The author builds and renders the material, checks the inventory and runs
   relevant validators. Record commands, exit codes and final output paths.
   Parallel authoring is optional; running validators needs no testing agent.
2. One reviewer, independent of every author of the material being reviewed,
   applies [econ-paragraph-review](../../skills/econ-paragraph-review.md).
   Cover integrity, economics and calculations, teaching sequence, teacher and
   typical-student perspectives, clarity, accessibility and final rendered pages.
   Didactic and mathematical passes are review dimensions within this assignment.
3. The author fixes findings. The same reviewer checks the fixes and affected
   dependencies: changed values can affect calculations, graphs and answers;
   changed pagination can affect neighbouring pages. Widen the check when needed.
   Reuse completed checks of unchanged material, with their evidence and scope,
   including checks made before a dependent paragraph was written.
4. Save an identifiable `X.Y.Z-review.md` for each paragraph with evidence,
   findings and their disposition, and an explicit `## 2. Verdict` containing
   PASS, PASS WITH FLAGS or FAIL. No unresolved failure or missing required
   coverage permits a passing verdict. Keep resolved findings as history; do not
   count every occurrence of the word FAIL as a current failure. Report useful
   observations without a quota of strengths or verified examples.

The same reviewer can cover a manageable chapter batch, continuity and final
chapter/answer-booklet assembly. Record coverage per paragraph; a chapter-wide
PASS alone is insufficient. Reuse earlier checks and inspect the remaining
coverage and changed assembly instead of restarting every paragraph review.

Teacher, student, visual and accessibility perspectives do not automatically
require separate agents. Consult their protocols when useful. Add a specialist
for a concrete unresolved problem or an expressly required specialist decision,
including an explicit owner request, and record that reason in the review.
Never invent separate approvals or label author self-checks independent review.

## Records and PR closure

The author or a tool can generate the Part A quality record from the completed
review and actual inventory using [econ-quality-control](../../skills/econ-quality-control.md).
This is transcription of evidence, not another reviewer assignment. Preserve the
reviewer's verdict, gaps and evidence, the [lane-separated schema](paragraph-quality-ref-schema-v2.md),
the other lane's block, and required plans and handoffs. Record the approved
reference version used; standards maintenance is a separate activity.

Reuse this completed independent content review for substantive PR closure.
There is no automatic planning/verification subagent, separate structural lead
report, two-round lead review, or independent readiness assignment for this
scope. This rule takes precedence over that staffing and packet machinery in
AGENTS and the legacy throughput/readiness/integration policies. The author
checks the inspectable PR, applicable CI and unresolved findings and marks it
ready when complete. Recheck subsequent substantive changes and dependencies
with the existing reviewer.

Actual source approvals, Book foundation/action holds, explicit human gates,
publication and student-use decisions remain required where applicable. A
content PASS is evidence, not permission to publish, deploy or merge. Once the
owner/task grants integration authority for the reviewed scope, use the
[maintenance workflow's exact-head merge procedure](../review/maintenance-workflow.md)
with required CI and branch protection, without admin bypass. Protected or
runtime-coupled changes that require the gated/bundle lane still use it.
Ordinary content retains its applicable content and rendering CI; the lighter
CI allowance for instruction maintenance does not apply to student material.

## Current-file evidence

Before review, generate `X.Y.Z-textbook-review-manifest.json` with
`paragraph-records.js snapshot <paragraph-folder>`. The reviewer checks its
inventory and records exactly one line in `X.Y.Z-review.md`:

```text
Review manifest SHA256: `<digest printed by the snapshot command>`
```

The manifest binds available Part A Markdown/HTML/PDF, build wrapper, target
contract, plan/foundation and owned or locally referenced rendering inputs.
Text uses UTF-8 with LF normalization; PDFs and other binaries use exact bytes.
Review/quality/handoff records are excluded to avoid circular hashes. Changes,
additions and deletions invalidate evidence. Regenerating the manifest alone
cannot renew the review. The reviewer binds a new digest only after checking
repairs and affected dependencies. Preserve explicit coverage and evidence; a
hash verifies freshness, not reviewer independence or content quality.

The current manifest supports static textbook HTML/SVG and local render inputs,
including nested CSS imports, image candidates and Markdown image references.
Scripted/embedded documents and external render resources are rejected instead
of being silently omitted. Use local assets or the applicable interactive lane.
Percent-encode parentheses in Markdown image URLs. This bounded inventory is
not a browser execution trace.

Paragraph and chapter validators require one explicit final verdict and a
matching manifest. Old records with no verdict/binding no longer prove current
closure. Do not retrofit frozen Book 1 content or manufacture retrospective
PASS evidence; archived reports remain historical evidence. A new closure claim
requires a real review of the applicable current material.

## Reproducing an existing edition

The current-review contract is a breaking change for paragraph/chapter closure:
an old PASS without a manifest no longer passes those validators. It does not
require migrating the back catalogue. To retrieve an existing paragraph PDF
edition, use this compatibility command from the platform checkout:

```text
node scripts/reproduce-paragraph-edition.js <lesson-repo> <40-character-edition-sha> "<paragraph-path>" "<new-output-directory>"
```

The paragraph path is repository-relative, using forward slashes. The output
directory must be new, outside both repositories, with an existing parent.
The command exports the paragraph type's required PDFs directly from that
commit and reports their Git blob IDs and SHA256 hashes. It preserves their
exact bytes, ignores local modifications and leaves historical reviews and
frozen Book 1 untouched. Its result explicitly says `current_review:
NOT_PERFORMED`; it gives no current-content PASS or publication permission.

This route copies an existing edition; it does not rebuild missing PDFs from
source or reassemble a chapter/book. Rebuilding a historical edition needs its
applicable historical toolchain. A PDF absent from the commit cannot be supplied
by an ignored local file. New or changed material, and any new current-review
claim, must use the normal snapshot, substantive review and validation route
above. Never generate bindings for historical reports to make them pass.
