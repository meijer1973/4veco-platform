# COMPANION-WORKFLOW-GUARDRAILS-1 Sprint Plan

## Goal

Clean up the companion-material workflow and guardrails so active platform
documentation, authoring rules, review rules, and quality-control guidance agree
with the current profile-aware Part B validator.

This is a platform documentation and guardrail cleanup only. It must not mutate
generated lesson output, protected references, lesson-side quality records, or
student-facing artifacts.

## Trigger

The companion-material read-through found active workflow conflicts and cleanup
opportunities:

- `BUILD-PARAGRAPH.md` had stale default-Part-B wording around 27 required
  files even though `validate-paragraph.js` and its tests define default
  `student-web` as a 14-file Part B validator baseline.
- DOCX conversion was described as a default production phase even though
  `student-web` is HTML-first and Office exports are opt-in.
- `AGENTS.md`, `skills/econ-companion-artifacts.md`, and
  `agents/econ-companion-visual-review.md` listed only part of the current
  validator-baseline surface family, without distinguishing it from the wider
  product route.
- `docs/L1.5V/F-plan-part-a-b-separation.md` remains useful as design history
  but contains old 24-file wording that could be misread as current workflow.
- `skills/econ-quality-control.md` still carries old subfolder/DOCX-heavy
  guidance and an active "never do" bullet that conflicts with the current
  14-file student-web validation baseline.

## Quality Standard

- Active instructions must match executable validator behavior.
- Historical records may remain, but must be labelled as historical when they
  conflict with the active production contract.
- The authoring spec, review agent, and AGENTS entry must name the same 14-file
  Part B validator baseline and distinguish it from the wider product route.
- Quality-control guidance must preserve the `schema_version: 2` split between
  `partA:` and `companion:` and must not treat validator-required student-web
  surfaces as optional by default.
- The cleanup must be verified by focused tests and text consistency checks.
- Lead-review must return OK/PASS on the plan before execution and on the work
  before PR publication.

## Specification Fulfilment Matrix

| Requirement | Source of authority | Implementation evidence | Acceptance |
|---|---|---|---|
| Default Part B `student-web` has 14 required root files | `scripts/validate-paragraph.js`; `scripts/tests/validate-paragraph.test.js`; `BUILD-PARAGRAPH.md` B1 | `BUILD-PARAGRAPH.md` B-verify and validation sections say 14 for `student-web`, 27 only for `office`/`legacy-full` | Active docs no longer contain stale 27-file default wording |
| Office/DOCX exports are opt-in | `BUILD-PARAGRAPH.md` output profiles; validator profiles | Phase 5 says DOCX conversion is office/legacy only | `student-web` path does not require DOCX conversion |
| Companion authoring/review covers the validator baseline without overclaiming product completeness | `BUILD-PARAGRAPH.md` B1; product end-state; `AGENTS.md`; `econ-companion-artifacts`; `econ-companion-visual-review` | AGENTS, skill, and agent distinguish 14 baseline files, 13 opt-in DOCX files, and the short-check/exit-ticket route | No guardrail calls the 14 files the full product surface |
| Historical L1.5V proposal is not mistaken for current contract | `docs/L1.5V/F-plan-part-a-b-separation.md`; active `BUILD-PARAGRAPH.md` | Add historical note and active-contract pointer | Old 24-file wording is clearly historical |
| Quality-control guidance is profile-aware and schema-v2-aware | `skills/econ-quality-control.md`; validator review gates | Add current workflow override, schema-v2 note, flat-layout note, and remove conflicting optional-14 guidance | Quality-control skill no longer contradicts active profile behavior |

## Planned Edits

- `BUILD-PARAGRAPH.md`
  - Replace stale "all 27" default wording with profile-specific language.
  - Mark DOCX conversion as office/legacy only.
  - Align B-verify and validation text to 14 default / 27 office-legacy.
  - Fix the stale Phase 4c reference to Phase 4b.
- `AGENTS.md`
  - Expand the companion authoring sentence to the 14-file validator baseline
    and distinguish the full product route.
- `skills/econ-companion-artifacts.md`
  - Expand frontmatter and scope list to the validator baseline, wider product
    route, and opt-in exports.
  - Clarify intentional Office/PDF exports.
- `agents/econ-companion-visual-review.md`
  - Expand scope list and invocation text so closure review inspects required
    student-web companion surfaces plus intentional exports.
- `skills/econ-quality-control.md`
  - Add current workflow override, schema-v2 note, flat-layout note, and replace
    the conflicting "do not assume all 14" warning.
- `docs/L1.5V/F-plan-part-a-b-separation.md`
  - Mark as historical design proposal and point to active workflow.

## Review Procedure

1. Write this plan and a lead-review assignment.
2. Send the plan to a lead-reviewer subagent using
   `agents/lead-reviewer-agent.md`.
3. If the reviewer returns REVISE/FAIL/PAUSE or actionable findings, update the
   plan, record the response in
   `archive/sprints/COMPANION-WORKFLOW-GUARDRAILS-1/COMPANION-WORKFLOW-GUARDRAILS-1-correction-log.md`,
   and request another review. Repeat until the reviewer returns OK/PASS.
4. Execute the reviewed plan.
5. Record validation evidence.
6. Send the completed work to a lead-reviewer subagent for work review.
7. If the reviewer returns actionable findings, implement them and request
   another review. Record every correction pass in the correction log. Repeat
   until OK/PASS.
8. Follow the GitHub publish workflow: inspect diff, stage intended files,
   commit, push, open a draft PR, and run the PR-level lead-review loop before
   presenting the PR for human review.

## Lead-Review Artifacts

- Plan review round 1:
  `archive/sprints/COMPANION-WORKFLOW-GUARDRAILS-1/COMPANION-WORKFLOW-GUARDRAILS-1-plan-review-round1.md`
- Plan review round 2, if needed:
  `archive/sprints/COMPANION-WORKFLOW-GUARDRAILS-1/COMPANION-WORKFLOW-GUARDRAILS-1-plan-review-round2.md`
- Correction log:
  `archive/sprints/COMPANION-WORKFLOW-GUARDRAILS-1/COMPANION-WORKFLOW-GUARDRAILS-1-correction-log.md`
- Validation log:
  `archive/sprints/COMPANION-WORKFLOW-GUARDRAILS-1/COMPANION-WORKFLOW-GUARDRAILS-1-validation-log.md`
- Work review round 1:
  `archive/sprints/COMPANION-WORKFLOW-GUARDRAILS-1/COMPANION-WORKFLOW-GUARDRAILS-1-work-review-round1.md`
- Work review round 2, if needed:
  `archive/sprints/COMPANION-WORKFLOW-GUARDRAILS-1/COMPANION-WORKFLOW-GUARDRAILS-1-work-review-round2.md`
- PR workflow review round 1:
  `archive/sprints/COMPANION-WORKFLOW-GUARDRAILS-1/COMPANION-WORKFLOW-GUARDRAILS-1-pr-review-round1.md`
- PR workflow review round 2, if needed:
  `archive/sprints/COMPANION-WORKFLOW-GUARDRAILS-1/COMPANION-WORKFLOW-GUARDRAILS-1-pr-review-round2.md`
- Human-review handoff:
  `archive/sprints/COMPANION-WORKFLOW-GUARDRAILS-1/COMPANION-WORKFLOW-GUARDRAILS-1-human-review-handoff.md`

## Validation Plan

- `npm.cmd test -- scripts/tests/validate-paragraph.test.js`
- `npm.cmd run check:scope-language`
- `git diff --check`
- Text consistency check:
  `rg -n "File count: 27|required 27 Part B|validates the 27|required Part B root files listed|all 27 Part B|Phase 4c|Assume all paragraphs need all 14" BUILD-PARAGRAPH.md AGENTS.md skills agents build-scripts\README.md`
  must return no active stale matches.
- Historical proposal check:
  `rg -n "24 root|24-file|24 file|24 required" docs\L1.5V\F-plan-part-a-b-separation.md`
  may return old design-history lines only if the same file also contains a
  top-of-file historical note and active-contract pointer to
  `BUILD-PARAGRAPH.md` plus `scripts/validate-paragraph.js`.

## PR And Human-Review Workflow

Follow the GitHub publish workflow and the repo remote-publication rules:

1. Check `gh --version` and `gh auth status`.
2. Run branch preflight:
   - `git fetch --prune origin`
   - `git status --short --branch`
   - `git branch --show-current`
3. Run worktree safety preflight. Because this cleanup began in the supplied
   task worktree before the formal plan was written, record the in-progress
   state with:
   - `npm.cmd run check:agent-worktree-safety -- --check --task COMPANION-WORKFLOW-GUARDRAILS-1 --agent codex-main --require-prefix codex/,agent/`
   A future fresh mutating run should use the stricter pre-edit claim form:
   - `npm.cmd run check:agent-worktree-safety -- --claim --task COMPANION-WORKFLOW-GUARDRAILS-1 --agent codex-main --require-prefix codex/,agent/ --require-clean`
4. Run `git status -sb` and inspect the full diff.
5. Confirm all dirty files are in sprint scope before staging. Stage only the
   sprint files.
6. Decide branch strategy. If on default branch, create a
   `codex/companion-workflow-guardrails` branch; otherwise stay on the current
   work branch unless branch safety checks say otherwise.
7. Refresh repository maps/indexes if required by touched paths. For this
   sprint, docs/skills/agents/review artifacts are touched, so run
   `npm.cmd run agent:index`. Run `node build-scripts/sprints/emit-url-index.js`
   or `npm.cmd run dashboard:internal` only if the relevant scripts exist and
   the touched paths require URL/dashboard refresh; otherwise record why not.
8. Commit with a terse message, push with tracking, and record branch/commit SHA.
9. Open a draft PR through the GitHub connector when possible, falling back to
   `gh pr create --draft` if needed.
10. Create a PR workflow lead-review packet with branch, commit, PR URL, changed
   files, validation commands, and any CI state available at the time.
11. Run lead review on that PR packet. Implement suggestions and re-review until
    OK/PASS.
12. Request/present human review only after the PR review loop returns OK/PASS
    and the reviewed commit has a passing `platform-ci / validate-platform`
    result or an explicit CI waiver.
13. Record the passing `platform-ci / validate-platform` status or the explicit
    CI waiver in the final human-review handoff. Plain CI-pending status is not
    sufficient human-review proof.

## Stop Conditions

- Stop if lead review cannot reach PASS/OK without a broader product decision.
- Stop if tests fail for a reason not attributable to missing local dependencies.
- Stop if the worktree contains unrelated changes that cannot be safely excluded.
- Stop if GitHub authentication or push access is unavailable during PR creation.
- Stop if map/index refresh commands mutate unrelated generated reports beyond
  the authorized documentation/review-packet scope; ask for direction instead of
  sweeping in unrelated churn.

## Proof Required to Close

- Plan lead-review result: PASS/OK.
- Plan review and any correction pass recorded at the paths above.
- Work lead-review result: PASS/OK after validation.
- Work review and any correction pass recorded at the paths above.
- Passing focused validator tests.
- Passing scope-language check.
- Clean `git diff --check`.
- Stale active-text search reports no active matches.
- Historical 24-file wording is either absent or clearly marked historical with
  an active-contract pointer.
- Branch/worktree safety preflight recorded: `git fetch --prune origin`,
  `git status --short --branch`, `git branch --show-current`, and the applicable
  `check:agent-worktree-safety` claim/check command.
- Remote publication evidence: pushed branch and commit SHA.
- PR workflow lead-review result: PASS/OK.
- Draft PR opened and presented for human review.
- Passing `platform-ci / validate-platform` status for the reviewed commit, or
  explicit CI waiver, recorded in the human-review handoff.

## August 2026 Route-Consistency Repair

Owner review returned `HOLD_REVISE` for two remaining contract gaps. This
paired repair uses bundle id `COMPANION-ROUTE-CONSISTENCY-20260813-1` and keeps
both pull requests draft until exact-head review, platform CI, compatibility,
and coordinated PR Readiness all pass.

1. Verify the existing platform worktree claim and establish a clean dedicated
   lesson worktree claim under `COMPANION-WORKFLOW-GUARDRAILS-1`.
2. Classify flat `korte-check.html` and `exit-ticket.html` pages as Part B
   companion outputs. Prove companion-lane acceptance and prove that both stay
   outside the 14-file `student-web` validator baseline.
3. Correct lesson `AGENTS.md` to
   `Start -> Leer -> Check -> Oefen -> Exit ticket`.
4. Add an allowlisted cross-repository route-declaration check for platform
   `AGENTS.md`, the companion-lane workflow, lesson `AGENTS.md`, product vision,
   and product end-state. Parse only inline-code route declarations, normalize
   ASCII/Unicode arrows, permit repeated identical declarations, and reject
   missing, noncanonical, or conflicting distinct values with repository/file
   diagnostics.
5. Cover canonical order, ASCII/Unicode arrows, the known stale route, missing
   files/declarations, identical duplicates, and conflicting declarations.
6. Refresh indexes and evidence before exact-head review. Any later
   content-changing commit restarts that review.
7. Publish a paired lesson PR and bind both PRs to exact payload SHAs. Run
   platform synthetic-merge CI plus three-state cross-repository compatibility
   against those exact heads, then apply coordinated bundle readiness.
8. Do not merge. Present the aligned pair for human payload review.

Lead plan reviewer Rawls (`019ffaf1-c6b8-7152-88ff-d66366207ccb`) returned
`OK` after two revision rounds.
