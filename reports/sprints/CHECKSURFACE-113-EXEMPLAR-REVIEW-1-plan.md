# Sprint CHECKSURFACE-113-EXEMPLAR-REVIEW-1: Exemplar Review

Generated: 2026-06-07

## Goal

Perform the required specialist review sequence for the `1.1.3 Grafieken en
tabellen` excellent exit-ticket exemplar produced by
`CHECKSURFACE-113-EXEMPLAR-EXIT-1`.

The sprint must turn the pending review placeholders into inspectable
teacher-learning, student-experience, visual/interaction, accessibility,
testing/regression, and lead-synthesis review records. It must use the
generated Book 1 route and sprint proof already produced by the implementation
sprint, add fresh rendered screenshot proof where needed, and decide whether
the exemplar is ready for later human-facing preparation or must remain held.

This sprint is review-led. It may perform the one bounded blocker repair
discovered during rendered inspection: binding the existing exit-ticket
light/dark toggle so the visible control works. It may not rewrite the v3
source design, hand-edit generated output, add completion language, approve
target readiness, authorize diagnostics, authorize mastery/sequencing,
authorize PV/Scale Gate claims, or authorize broad product/student use.

## Context

`CHECKSURFACE-113-EXEMPLAR-EXIT-1` implemented the packaged v3 excellent
exit-ticket candidate and intentionally ended in `hold_for_exemplar_review`.
The pending review placeholders live under
`references/exemplars/product-excellence/check-surfaces/1.1.3-exit-ticket/reviews/`.
The implementation evidence includes focused Jest, generated Book 1 deploy,
custom checker proof, policy-regression proof, and browser proof.

The canonical baselines remain `../4veco-lessen/specifications/product-vision.md`,
`../4veco-lessen/specifications/product-end-state.md`,
`../4veco-lessen/specifications/companion-core-specifications.md`, `AGENTS.md`,
`BUILD-PARAGRAPH.md`, and `build-scripts/README.md`.

Review agent standards used in this sprint:

- `agents/teacher-learning-quality-review-agent.md`
- `agents/student-experience-review-agent.md`
- `agents/visual-qa-agent.md`
- `agents/accessibility-agent.md`
- `agents/testing-agent.md`
- `agents/lead-reviewer-agent.md`

## Quality Standard

Quality floor: the rendered output, review artifacts, and proof logs must show
whether the v3 exemplar satisfies its original specification as a student-facing
independent exit ticket. Passing implementation tests or having files present
is not enough. The review must inspect the generated route, source/generator
boundaries, student-facing task sequence, visual interaction, learning design,
accessibility risks, regression evidence, held authority, and named follow-up
flags.

Required quality floor:

- every pending review placeholder is replaced by an actual review record with
  verdict, evidence inspected, findings, blockers, and next action;
- the generated route is inspected through rendered output, including desktop
  light-mode and mobile dark-mode proof;
- the review preserves independent-work requirements: source/table first, no
  pre-attempt formula/procedure leakage, graph construction before reading,
  interval-before-read ordering, formula construction before calculation, and
  explicit calculation work;
- any student-facing weakness is carried as a flag or blocker instead of being
  hidden behind test success;
- no review claims classroom readiness, student readiness, target-equivalence,
  completion eligibility, diagnostics, mastery/sequencing, summative use, PV,
  Scale Gate 1, or product-wide use without a later explicit gate;
- proof includes review files, browser screenshot/proof JSON, custom checker
  proof, command log entries with exit codes, lead-review round 1/correction/
  round 2 records, result metadata, and refreshed repository maps/indexes;
- if rendered inspection exposes a student-facing interaction blocker, the
  sprint either fixes that exact blocker through platform source plus deploy or
  records REVISE with a named implementation follow-up;
- omitted requirements are named follow-up work or explicit blockers.

Proof standard: the specialist reviews and lead synthesis must cite concrete
paths, generated route evidence, command names, and exit-code-backed checks.
The lead review must return PASS, PASS WITH FLAGS, REVISE, FAIL, or PAUSE using
the lead-reviewer standard; PASS WITH FLAGS must preserve structured flags in
result JSON.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Review must judge the original v3 package specification, not a narrowed file-exists standard. | Implementation handoff, source data, generated route proof, prior custom checker. | Lead review pass 0.5 and specialist findings. | planned |
| Teacher-learning quality must assess learning-goal fit, didactic sequence, prior knowledge, transfer, and classroom-readiness limits. | Generated route, source task sequence, quality brief, route feedback. | Teacher-learning-quality review. | planned |
| Student-experience review must assess orientation, next action, cognitive load, affordance, motivation, and graph/table understandability. | Rendered route screenshots plus source/generator proof. | Student-experience review. | planned |
| Visual/interaction and accessibility review must inspect the rendered route, including responsive/dark-mode evidence. | Desktop light and mobile dark screenshots, browser proof JSON, generated route DOM evidence. | Visual QA plus accessibility review. | planned |
| Testing/regression review must cite current command/exit-code evidence and source-output boundary checks. | Focused Jest, custom checker, policy checker, book/platform checks, command log. | Testing-agent review and custom review checker. | planned |
| Visible exit-ticket theme toggle must work if it is shown in the generated shell. | Bounded `exit-ticket-ui.js` repair, focused UI test, generated shared runtime copied through deploy, browser DOM proof. | Visual/accessibility review and lead-review correction log. | planned |
| Lead synthesis must preserve flags and held authority. | Specialist review records, result JSON, authority booleans, roadmap row. | Lead-review round 1, corrections, and round 2. | planned |
| Remote-facing repository maps must be current for off-site inspection. | Agent index, URL index, internal dashboard. | Final validators and clean git status. | planned |

## Quality Improvement Candidates

| Candidate | Classification | Disposition |
|---|---|---|
| Add desktop light and mobile dark screenshots for the generated exit ticket. | include_now | Required for rendered proof and accessibility/visual review. |
| Add a review-only checker that verifies every specialist review exists and no authority was promoted. | include_now | Prevents accidental placeholder closure or target-readiness claims. |
| Add a fresh browser proof JSON for the review sprint. | include_now | Keeps the evidence separate from implementation proof. |
| Bind the existing exit-ticket theme toggle discovered as inert during rendered inspection. | include_now | A visible non-working control is a student-facing interaction blocker and the fix is narrow. |
| Add a full automated click-through of every correct and retry path. | defer_named_follow_up | Useful, but the current sprint is bounded to specialist review and rendered-state proof. |
| Promote the exemplar into a reusable production pattern. | reject_scope_creep | A later explicit gate must decide adoption and authority. |
| Rewrite task copy based on review flags. | defer_named_follow_up | This review sprint records findings; source/output changes need a new implementation plan. |

## Allowed paths

- `reports/sprints/CHECKSURFACE-113-EXEMPLAR-REVIEW-1-*`
- `reports/json/checksurface-113-exemplar-review1-proof.json`
- `reports/json/checksurface-113-exemplar-review1-browser-proof.json`
- `build-scripts/sprints/check-checksurface-113-exemplar-review1.js`
- `build-scripts/sprints/capture-checksurface-113-exemplar-review1-screenshots.js`
- `engines/exit-ticket-ui.js`
- `engines/tests/exit-ticket-ui.test.js`
- generated Book 1 output under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/` produced by deploy only
- `references/data/sprints/CHECKSURFACE-113-EXEMPLAR-REVIEW-1.plan.json`
- `references/data/sprints/CHECKSURFACE-113-EXEMPLAR-REVIEW-1.result.json`
- `references/exemplars/product-excellence/check-surfaces/1.1.3-exit-ticket/reviews/`
- `references/reference-team-roadmap.md`
- generated repository-map, URL-index, and internal-dashboard artifacts

## Forbidden paths

- No edits under `references/machine/` or `references/external/`.
- No edits to `references/authored/course-target-exercises.json`.
- No edits to `source-data/book-1/exit-ticket/1.1.3-exit-ticket.json`.
- No engine, UI, CSS, test, or deploy-pipeline implementation changes except
  the bounded exit-ticket theme-toggle repair and its focused test.
- No hand edits to generated lesson output.
- No generated Book 1 deploy except to copy the bounded theme-toggle repair
  through the platform deploy path.
- No legacy Module 3 target work.
- No protected reference mutation, machine reference mutation, external-source
  mutation, unit minting, unit update, unit split, or unit deprecation.
- No completion-language approval, target-readiness approval, diagnostics,
  adaptive routing, mastery/sequencing, student-facing AI, summative use, PV
  projection, PV machine promotion, CP-6/Year-1 promotion, Scale Gate 1, broad
  product use, or student/product use.

## Inputs

- `reports/sprints/CHECKSURFACE-113-EXEMPLAR-EXIT-1-plan.md`
- `reports/sprints/CHECKSURFACE-113-EXEMPLAR-EXIT-1-result.md`
- `references/data/sprints/CHECKSURFACE-113-EXEMPLAR-EXIT-1.result.json`
- `reports/json/checksurface-113-exemplar-exit1-proof.json`
- `reports/json/checksurface-113-exemplar-exit1-browser-proof.json`
- `references/exemplars/product-excellence/check-surfaces/1.1.3-exit-ticket/`
- `source-data/book-1/exit-ticket/1.1.3-exit-ticket.json`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/exit-ticket/data/1.1.3-exit-ticket.js`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1.3-grafieken-en-tabellen/exit-ticket.html`
- `agents/teacher-learning-quality-review-agent.md`
- `agents/student-experience-review-agent.md`
- `agents/visual-qa-agent.md`
- `agents/accessibility-agent.md`
- `agents/testing-agent.md`
- `agents/lead-reviewer-agent.md`

## Outputs

- Completed specialist review files under
  `references/exemplars/product-excellence/check-surfaces/1.1.3-exit-ticket/reviews/`.
- Desktop light and mobile dark screenshot evidence under
  `reports/sprints/CHECKSURFACE-113-EXEMPLAR-REVIEW-1-screenshots/`.
- Browser proof JSON at
  `reports/json/checksurface-113-exemplar-review1-browser-proof.json`.
- Review checker at `build-scripts/sprints/check-checksurface-113-exemplar-review1.js`.
- Screenshot capture helper at
  `build-scripts/sprints/capture-checksurface-113-exemplar-review1-screenshots.js`.
- Review proof JSON at `reports/json/checksurface-113-exemplar-review1-proof.json`.
- Sprint plan, baseline, planning review, command log, lead-review assignment,
  round 1, corrections, round 2, result, diff summary, and JSON metadata.
- Updated roadmap/index/dashboard artifacts.

## Operationalized sprint procedure

1. Confirm branch, remote tracking, and clean working-tree status in platform
   and lesson repos.
2. Record baseline from implementation sprint result, generated route, pending
   review placeholders, prior proof JSON, and current authority booleans.
3. Run planning review before specialist review. Stop if the plan allows source
   rewrites, generated-output hand edits, or authority promotion.
4. Start a temporary local static server for the generated Book 1 output, open
   the generated `1.1.3` exit-ticket route in the in-app browser, and capture:
   - desktop light-mode initial route screenshot;
   - mobile dark-mode initial route screenshot;
   - DOM proof for task families, theme, graph workspace, formula context
     absence, placeholder safety, and held authority.
5. Replace pending placeholder review files with actual teacher-learning,
   student-experience, visual/interaction, accessibility, testing/regression,
   and lead-synthesis reviews. Reviews may return PASS WITH FLAGS; any hard
   failure must block closure and direct a later implementation sprint.
6. If rendered inspection finds the existing theme toggle inert, bind it in the
   platform exit-ticket UI, add focused test coverage, and redeploy generated
   Book 1 output through `node scripts/deploy.js`.
7. Add a review-only checker that verifies review files exist, placeholders are
   gone, proof artifacts exist, and authority remains held.
8. Run focused implementation regression checks from the prior sprint plus the
   new review checker.
9. Run broad validators, repository-map refresh, URL-index refresh, dashboard
   refresh, sprint result/bundle checks, and diff checks.
10. Record lead-review assignment, round 1, correction log, and round 2. Round
   2 must return PASS or PASS WITH FLAGS to close this sprint.
11. Fetch/prune before final commit. Commit and push platform and lesson
    artifacts if validation passes.

Decision points:

- If rendered route proof cannot be captured, mark the sprint PAUSE until proof
  exists.
- If a specialist review finds a core specification failure beyond the bounded
  theme-toggle blocker, mark the sprint REVISE and create a named implementation
  follow-up instead of widening source edits.
- If a review flag only blocks target-readiness or product-route adoption, keep
  it as a non-blocking flag and do not broaden the claim it blocks.
- If command evidence is stale or missing, rerun the command or mark the test
  as not passed.

Stop conditions:

- Stop if the generated route is not inspectable.
- Stop if any review file still says `PENDING_REVIEW`.
- Stop if screenshots or browser proof are missing.
- Stop if any output requires hand editing.
- Stop if any authority boolean is promoted.
- Stop if completion language, diagnostics, mastery/sequencing, summative use,
  PV, Scale Gate 1, or broad product/student use is claimed.

Review and validator details:

- Planning review must pass before specialist review.
- Custom review checker must pass before lead review.
- Lead-review round 2 must return PASS or PASS WITH FLAGS before closure.
- Human review is not required in this sprint. The required next action after
  closure is either a later human-facing preparation sprint or a named source
  repair sprint, depending on the lead synthesis verdict.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/CHECKSURFACE-113-EXEMPLAR-REVIEW-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js CHECKSURFACE-113-EXEMPLAR-REVIEW-1
npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-engine.test.js engines/tests/exit-ticket-ui.test.js engines/tests/exit-ticket-metadata-alignment.test.js
node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/sprints/check-checksurface-113-exemplar-exit1.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/sprints/check-checksurface-policy-regression1.js
node build-scripts/sprints/capture-checksurface-113-exemplar-review1-screenshots.js
node build-scripts/sprints/check-checksurface-113-exemplar-review1.js
npm.cmd run check:platform
npm.cmd run check:book -- "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/check-sprint-result.js reports/sprints/CHECKSURFACE-113-EXEMPLAR-REVIEW-1-result.md
node build-scripts/sprints/check-sprint-bundle.js CHECKSURFACE-113-EXEMPLAR-REVIEW-1 --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
```

## Proof Required to Close

Proof required to close: the implementation sprint remains generated-output
complete; the existing exit-ticket theme toggle works after the bounded repair;
the rendered `1.1.3` exit-ticket route has desktop and mobile/dark proof; every
specialist review placeholder is replaced by an evidence-backed review; the
review checker passes; focused and broad validators pass; command log evidence
records exit codes; lead-review round 2 returns PASS or PASS WITH FLAGS with
structured flags; roadmap/index/dashboard artifacts are refreshed; and all
authority boundaries remain false or held.

## Rollback plan

Before commit, revert only this sprint's review artifacts, screenshots, checker,
proof JSON, roadmap/index/dashboard updates, and sprint metadata. After commit,
revert the sprint commit if the review evidence is found invalid.

Do not revert implementation sprint code/output, unrelated user work, protected
references, generated lesson output from earlier sprints, or unrelated
workspace files.

## Human review required

No human review gate is required or allowed to close inside this sprint. This
sprint produces specialist and lead-review evidence only. Later human-facing
preparation remains separate and must not be inferred from this review sprint.
