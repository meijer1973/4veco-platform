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
