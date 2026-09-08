# Coding-agent handoff: first light cleanup of 4veco

**Date:** 8 September 2026
**Primary repository:** `meijer1973/4veco-platform`
**Related repository:** `meijer1973/4veco-lessen`
**Assignment:** implement a small, reversible cleanup of the existing instruction and routine textbook-review workflow. Do not redesign the platform.

## 1. Owner intent and deliverable

Keep the familiar repositories and keep production usable. Retain valuable information, teaching preferences, authoritative sources, working tools, and quality requirements. Reduce universal instruction overhead and overlapping model-based reviews.

Implement two separately reversible changes:

1. Shorten and clarify the platform `AGENTS.md`, with task-specific routing to existing detailed instructions.
2. Make one independent substantive content reviewer the default for ordinary Part A textbook production, without dropping required review dimensions or publication safeguards.

Deliver the implementation as a reviewed, remotely inspectable PR, plus a narrowly scoped paired documentation PR only if the lesson repository needs a consistency fix. Include a small before/after production comparison. Stop for owner review before merging.

This assignment permits implementation and isolated evaluation of the candidate workflow. It does **not** authorise merging, public deployment, student use of comparison artifacts, bypassing source-authority holds, or using the proposed lighter rules to approve this governance-changing PR.

The desired result is less process around an equally good or better textbook product. Token savings and quality improvement are hypotheses to test, not results to claim in advance.

## 2. Baseline and preflight

The platform `main` observed when preparing this handoff was:

`96416b6b5bd57094576e9aba0a42d682584ec479`

Refresh both repositories before starting. Record the actual base commits; do not force an obsolete base or overwrite intervening work. Read both `RESEARCH_AGENT_MAP.md` files and the current operating instructions. Report unavailable maps, unexpectedly stale remote information, or local/remote divergence rather than assuming the handoff reflects unpushed work.

Follow the currently approved branch, worktree, planning, and governance preflight. Suggested branch: `codex/light-authoring-cleanup-20260908`; use an available task-specific name if it already exists. Preserve the required planning/evidence records, but reuse existing formats and avoid creating an additional reporting system.

Inspect the effective instruction chain for the agent that will run the comparison: applicable global, parent, repository, and scoped instruction files, plus relevant local mirrors if present. Record sources, not secrets or unrelated personal configuration. Do not change global configuration. If it is inaccessible, record that limitation.

Relevant starting surfaces, beyond the root instructions:

- `docs/workflows/textbook-paragraph-lane.md`, `BUILD-PARAGRAPH.md`, and `BUILD-CHAPTER.md` for affected reading/review references.
- `agents/README.md`, `agents/lead-reviewer-agent.md`, and `skills/econ-paragraph-review.md` for substantive review routing.
- `skills/econ-textbook-paragraph.md` and directly relevant callers for contradictory requirements.
- Existing PR-readiness/integration policies, schemas, and checkers for preserving release governance.
- The applicable product specifications, authoritative teaching inputs, and relevant source-file consumers/tests.

Use targeted inspection. Do not audit every skill, reopen historical sprints, or turn this into a repository-wide architecture review.

## 3. Change A — simplify the starting instructions

### Intended behaviour

An agent can identify the task, obtain the right teaching information, and follow the relevant workflow without first reading unrelated companion, platform, or integration material.

### Edit `AGENTS.md`

Aim for approximately **1,000–1,500 words**, without hiding essential safeguards. This is an editing target, not a new enforced quota.

Keep in the root:

- A short project purpose, repository boundaries, and task-sensitive role. Textbook authors need the economics/teaching context; engineering work needs its engineering discipline. Remove the universal requirement to approach every task as a software developer.
- Clear pointers to authoritative curriculum, targets, terminology, precision rules, and approved teaching preferences. Do not substitute vague instructions such as “make it good” for these sources.
- Task routing: ordinary printed paragraphs use the existing Part A runbook; chapter assembly also uses the relevant chapter guidance; companion and platform work use their own applicable instructions.
- Essential branch/worktree safety, protected-source boundaries, source/generator/output ownership, truthful validation reporting, and the requirement to follow the authorised publication process before publishing or merging.
- One concise quality principle and one nonduplicated final reporting requirement.

Consolidate repeated professionalism/quality reminders and repeated status-reporting lists. Move unique operational detail out of the root only when an appropriate, discoverable home retains it. Prefer existing policy documents; create a small scoped reference only when necessary. Preserve requirements such as worktree locks, exact-head evidence, authorisation, and no admin bypass.

Detailed publication procedures remain mandatory **when undertaking publication**. Companion-specific reading applies to companion work. Keep relevant product direction and authority accessible; do not delete product requirements because their full explanation is no longer universally loaded.

Do not replace the long root with a short root that mandates reading the same long collection on every task. Do not hide the old file behind a new always-read manual. Measure the effective mandatory reading path as well as root length.

### Repair direct callers, not the whole repository

Update affected reading instructions at their source. Replace conflicting clauses; do not append an override that leaves two contradictory directions active.

A confirmed cross-repository issue is that `4veco-lessen/AGENTS.md` also assigns a senior-developer role and requires broad reading of the platform's complete paragraph/chapter/build documentation. Inspect this entry point and make only the necessary role/routing consistency edits. Preserve all unrelated lesson-repository safeguards and ownership rules. Use coordinated branches/worktrees and the existing paired-PR process if a lesson-side edit is necessary.

Keep a brief old-section-to-new-location/deletion-reason summary in existing PR evidence. Distinguish deleted duplication from relocated requirements. Do not introduce a permanent mapping registry.

## 4. Change B — consolidate ordinary Part A content reviews

### Eligibility

The lighter default applies to routine Part A paragraph/chapter content authoring or revision using existing approved teaching authority, existing production tools, and existing output contracts.

It does not replace review required for platform/generator changes, companion interaction work, protected-source or curriculum changes, changes to governance or review policy, or an explicitly required specialist/human gate. Mixed tasks retain the review required by their consequential changes.

This cleanup PR itself is governance/review-policy work and is outside the lighter default.

### Normal content-review route

Use the existing `econ-paragraph-review` as **one independent substantive content-review assignment** after author self-checks and applicable mechanical validation. The reviewer must be separate from the author.

Preserve its didactic and precision review, and explicitly cover the relevant teacher/student/rendered-output dimensions that would otherwise trigger overlapping reviewers:

- Economic reasoning, calculations, formulas, terminology, and graph/text numerical agreement.
- Goals, target operations, prerequisite assumptions, worked examples, exercise progression, and answer completeness.
- Comprehensibility and instructions for a typical 4 vwo student, including task order, visual support, readability, and paper-only completeness.
- Final rendered-page quality, not only Markdown, SVG source, or isolated figure crops.

Keep the existing paragraph review reports, quality records, plans, and handoffs. Preserve required verdicts and unresolved findings. One reviewer can cover a manageable chapter batch, but each paragraph still needs identifiable coverage/findings and the required record. Include chapter continuity and final assembly inspection; do not substitute a generic chapter PASS for actual review.

For eligible routine work, teacher, student-experience, visual, accessibility, and testing perspectives do **not** automatically require separate model instances. The reviewer may consult relevant specialist guidance without spawning additional agents. Running a validator is not itself a model-based testing review.

Retain specialist agents as available resources. Invoke an additional reviewer for a concrete unresolved issue, a failed check needing specialist judgement, an explicit owner request, or an applicable specialist gate. State the reason briefly in the existing review record. No recursive reviewer team or extra summariser is needed by default.

Update the actual routing conditions and automatic blockers in `agents/README.md`, `agents/lead-reviewer-agent.md`, relevant Part A callers, and the paragraph-review instructions. In particular, the ordinary Part A exception must recognise genuine consolidated teacher/student coverage rather than still failing solely because two separate specialist reports are absent. Preserve the old requirements outside this exception.

After repairs, recheck the affected material and its dependencies. Widen the recheck when changed values affect calculations/graphs/answers or pagination affects other pages. Do not automatically restart every review; do not assume a small source diff has only local consequences.

### Preserve publication responsibilities

“One content reviewer” is not a cap on all agents involved in a PR. Retain required structural lead review, independent PR-readiness routing, current-head CI, human authorisation, and authorised integration.

Required release reviewers may consume the substantive content report instead of repeating it unnecessarily, but do not merge roles that current governance requires to be independent. Do not fabricate separate specialist approvals from a consolidated review. Do not relabel an author self-check as independent review.

Leave PR-readiness/integration policy semantics and schemas unchanged. If broader changes would be needed to realise additional savings, report that boundary and defer them.

## 5. Scope exclusions

Do not change curriculum, approved learning goals, target exercises, prerequisite classifications, terminology or mathematical standards, the canonical seven-section exercise structure, paper-first completeness, or frozen Book 1 material. Keep existing textbook-plan, source-authority, timing, quality-record, and handoff requirements.

Do not rewrite rendering tools, move content folders, migrate repositories, alter student-facing outputs in production, redesign the website, weaken branch protection, or remove required CI checks.

**Do not delete, shorten, or make `economic-graph` optional in this change.** Its procedures, required loading, verification tools, and current graph standards remain unchanged. The graph-skill trial is a later, separately authorised step. Likewise, do not undertake a general skill cleanup or silently remove other mandatory authoring skills.

The permitted test/checker changes are narrowly limited to following relocated instructions and accurately testing the intended routine-review exception while retaining protection elsewhere. Do not disable safeguards to obtain green tests.

## 6. Implementation and validation

### Reversible delivery

Use two logical, independently reversible changes: A for entry-point cleanup, B for review consolidation. Keep necessary caller/test changes with the change they implement. Small evidence/index follow-up commits are acceptable; this is not an exact commit-count quota. Make paired lesson documentation changes traceable to A.

Use the existing commands and CI. Relevant existing scripts to confirm against current `package.json` include:

```text
npm.cmd run check:active-governance-wording
npm.cmd run check:paragraph-workflow-wording
npm.cmd run check:part-a-exercise-authoring-contract
npm.cmd run check:pr-readiness
```

Run the subset required by changed surfaces and all required CI; these commands are not a substitute for the current repository's validation requirements. Verify links, caller consistency, and applicable lesson-side checks. Refresh maps/indexes using existing generators where the changes require it.

Where existing tests cover these behaviours, extend them narrowly. Otherwise record focused inspection without inventing a new policy-testing framework. Check that routine Part A gets consolidated content review, author self-review remains insufficient, explicit specialist review still applies, companion/platform/governance work retains its route, authority holds remain effective, and unresolved failures still block completion.

### One representative before/after comparison

Choose a representative paragraph with currently approved sources and no hold blocking the exact test action. Run the baseline and candidate in separate clean sessions and isolated output/worktree locations. Use the same prompt, teaching-source snapshot, examples, deliverables, model, reasoning settings, and other settings where controllable; the intended difference is the instruction/review workflow. Do not pass the baseline answer into the candidate run.

A valid recorded baseline may be reused only when those conditions are documented. Otherwise run a fresh baseline. Keep both outputs outside published lessons and preserve Book 1 unchanged. Exercise candidate instructions only in the isolated experiment, not to approve this PR.

Record a compact comparison in existing task evidence:

| Observation | Baseline | Candidate |
|---|---|---|
| Root size and effective mandatory reading path | Measured | Measured |
| Model-based content reviews / release reviews | Separately counted | Separately counted |
| Total token usage, including subagents where reported | Actual or unavailable | Actual or unavailable |
| Wall-clock time for the same measured stages | Actual | Actual |
| Required checks, substantive defects, repair rounds | Evidence | Evidence |
| Human assessment/correction effort | Actual or pending | Actual or pending |

Distinguish tokens from credits/allowance percentages. Do not invent unavailable metrics, infer exact savings from elapsed time, or estimate owner correction effort as if observed. Present the outputs without origin labels for owner comparison when practical; retain traceability in the evidence.

Acceptance requires materially lighter instructions/routing, preserved required review coverage and safeguards, functioning production, and no unresolved material defect in the candidate. One comparison is preliminary evidence, not proof of general quality improvement. If a dependency or authority blocker prevents the trial, complete independently safe changes and report the trial as outstanding; do not call the cleanup production-validated.

## 7. Closure and rollback

Use the currently approved governance process for this policy-changing task. Publish the necessary review evidence and PR(s), perform the existing independent reviews and exact-head CI checks, and return for owner authorisation. Do not merge or deploy based on this handoff.

The final handoff should contain the PR(s), branches/worktrees, base and reviewed head SHAs, push state, applicable CI results, what was removed versus relocated, the actual reviewer-count change, comparison artifacts/results, unresolved limitations, and rollback commits. Reuse existing required evidence; no new dashboard, gate taxonomy, or recurring report family.

If B reduces review effectiveness, revert B and retain A if A independently works. If A obscures important information, repair its routing or revert A and any dependent consistency changes. Do not reset published history or unrelated work. Document dependencies where a paired revert is necessary.

**Finish at owner review with the graph-skill trial explicitly deferred. Do not start a second cleanup round automatically.**

## Source basis and limits

This handoff implements the owner's agreed light-cleanup direction, not the earlier proposal for a new repository. Repository observations were checked against the two access maps and these source files: platform `AGENTS.md`, `agents/README.md`, `agents/lead-reviewer-agent.md`, and `docs/workflows/textbook-paragraph-lane.md`; lesson `AGENTS.md`. The preceding discussion also inspected `skills/econ-paragraph-review.md`, `skills/econ-textbook-paragraph.md`, `skills/economic-graph.md`, PR-readiness instructions, and `package.json`. Revalidate the relevant current files before editing.

The lesson `AGENTS.md` blob observed was `edb6377aa26712574f025ff79286c9ffced2102e`; this is a file hash, not a lesson-repository commit. Desktop-local instruction loading, actual review counts, token usage, and quality effects have not been measured by this handoff. Both repository maps were accessible. No repository changes, tests, production comparisons, or approvals were performed while preparing this document.
