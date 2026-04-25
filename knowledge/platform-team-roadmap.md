# Platform Team Roadmap

Generated: 2026-04-23  
Updated: 2026-04-25 after splitting reference planning into `references/reference-team-roadmap.md`  
Source: split from `knowledge/three-month-roadmap.md` after Sprint 0.5 sign-off

## Sprint Ledger

Open items are listed first; completed items are kept below them.

| Sprint | Name | Completed | Current State |
|--------|------|-----------|---------------|
| P1.4 | Platform Issue Catalog And Improvement Plan | no | Current platform priority; create the non-reference platform issue log by quality category and turn it into the next-period improvement plan. |
| P1.5 | CI And Health Check Routine Sprint | no | Planned; make routine health checks harder to skip. |
| 0.5 | Phase 0 Green Gate | yes | Signed off for Part A textbook/book production. |
| P1.1 | Book 1 Companion Proof Sprint | yes | `1.1.1` companion path proven end-to-end. |
| P1.2 | Companion Scaling And Handoff Sprint | yes | `1.1.2` passed as a technical probe; its test materials were removed for didactic rebuild. |
| P1.3 | Internal Review Dashboard Sprint | yes | Internal three-team dashboard MVP generates from team roadmap sources and quality-gate issues. |

Detailed bootstrap plan for the first Book 1 companion MVP:

- `knowledge/platform-team-companion-bootstrap-plan.md`

Active companion scaling triage:

- `knowledge/platform-team-sprint-p1.2-companion-scaling.md`

Companion quality-gate review:

- `knowledge/platform-team-companion-quality-gate-review.md`

Reference roadmap:

- `references/reference-team-roadmap.md`

## Mission

Own the platform guardrails that make material production trustworthy:

- validators
- deploy/config plumbing
- generators
- architecture quality
- CI and repeatable health checks
- internal developer-facing project oversight

## Current Status

Sprint 0.5 is signed off for Part A textbook/book production, Sprint P1.1 has proven the first Book 1 companion paragraph path, and Sprint P1.2 has technically proven the pattern on a second Book 1 companion paragraph.

The temporary Green Gate deployment/output freeze is lifted as of 2026-04-24. Controlled production in `../4veco-lessen` may resume under the normal build/validation workflow. The legacy Module 3 target remains separately frozen until September 2026.

The companion pilot is still open. The technical pipeline now repeats, but the 1.1.2 probe materials were testing material only and have been removed from both `4veco-lessen` and the platform build inputs. That paragraph must be recreated by an agent explicitly instructed for teaching and didactic design.

Companion layout/front-end improvement has been handed off to the lessen team. Reference planning has been split into `references/reference-team-roadmap.md`. The next platform-owned priority is the non-reference platform issue catalog and next-period improvement plan, using the internal dashboard as the control surface.

Verified:

- `npm.cmd run check:platform` passes.
- `npm.cmd run check:book -- "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"` passes.
- `node scripts\validate-paragraph.js --mode complete "<1.1.1-folder>"` passes.
- `node scripts\deploy.js "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"` runs cleanly, including link checks and data tests.

Important boundary:

- Part A textbook/chapter/book delivery is green.
- The Part B companion pipeline is technically proven end-to-end for `1.1.1 Schaarste en economisch denken`.
- The companion pattern was technically repeated for `1.1.2 Percentages en indexcijfers`; those test materials are now cleared and are not approved lesson content.
- Bulk repetition across many paragraphs is still not proven and should wait for the quality-gate backlog and lessen-team companion handoff to be tightened.

Companion bootstrap status:

- `BUILD-PARAGRAPH.md` has been patched for the Book 1 flat-layout Part B flow.
- Book 1 now has a book-root `deploy-config.json`.
- Book 1 now has a book-root `shared/` structure.
- `build-scripts/content/book-1/` now exists.
- `source-data/book-1/reasoning/` now exists.
- `validate-paragraph.js --mode part-b` and `--mode complete` for `1.1.1` now run against the real flat-layout Book 1 flow.
- `scripts/deploy.js` now supports the Book 1 MVP flow cleanly, including shared reasoning metadata and flat-layout converter/deploy behavior.

## Sprint Status Standard Procedure

Every platform plan update must keep sprint state explicit. This is now standard procedure for this roadmap and related platform planning docs.

Required on every roadmap update:

- Update the `Updated:` line with the date and reason.
- Keep every sprint under `Sprint Ledger` marked with `Completed: yes` or `Completed: no`.
- For every completed sprint, record evidence: commands run, files changed, or a short decision note.
- For every incomplete sprint, keep a concrete next action and an exit condition.
- Do not mark a sprint complete from intention alone. Completion requires verified exit criteria.
- If a sprint changes scope, add a note under that sprint instead of silently rewriting history.
- If a new sprint is added, assign it an owner track, a completion status, and public/private boundary notes when relevant.

Definition of complete:

- The sprint exit criteria are met.
- Relevant checks have run or the reason for not running them is written down.
- Any remaining risks are either resolved, moved to a later sprint, or recorded as escalation triggers.

## Program Phase: Platform Issue Catalog And Improvement Planning

This phase starts after the internal dashboard MVP. The first order of business is not fixing every visible platform problem immediately; it is making a good log of non-reference platform improvement issues per quality category, with enough evidence and ownership that the next period can be planned intelligently. Reference-specific cataloging lives in `references/reference-team-roadmap.md`.

Purpose:

- Build one authoritative issue log for non-reference platform-facing quality work.
- Use the dashboard categories as the first taxonomy, but allow the categories to change while cataloging if the real issue set shows a better structure.
- Distinguish proof problems from production problems: can we prove generated material is ready to scale, are validators/reporting checks trustworthy, are deploy/generator assumptions stable, and are platform risks visible before they block teams?
- Convert the issue log into a practical improvement plan for the next period instead of treating every issue as equally urgent.

Issue log fields:

- issue id
- title
- quality category
- owner team
- source/evidence link
- affected scope
- severity
- status
- next action
- target sprint or defer/reject decision
- proof required to close

Category governance:

- The current eight dashboard categories are a starting point, not a permanent law.
- Category changes must be recorded in this roadmap and in the dashboard generator.
- When a category changes, old issues should be migrated or explicitly left as historical evidence.
- The category set should remain small enough for humans to scan during planning.

Exit output for the phase:

- An internal issue log visible through the dashboard.
- A next-period improvement plan ordered by quality risk, educational value, and platform leverage.
- Clear separation between platform-owned fixes, reference-team fixes, lessen-team teaching/material fixes, and innovation experiments.

## Sprint Details

### Sprint 0.5: Phase 0 Green Gate

Completed: yes.

Purpose:

- get the platform green before material production resumes
- establish platform/book validation as the baseline gate
- separate platform readiness from bulk content generation

Evidence:

- Phase 0 green gate is signed off for Part A textbook/book production.
- `check:platform` and `check:book` are part of the active routine.

Exit criteria:

- platform tests green
- validators aligned with the flat layout
- `validate-paragraph.js` active and required
- book health checks runnable
- stale blocking reports resolved or explicitly excluded

### Sprint P1.1: Book 1 Companion Proof Sprint

Completed: yes.

Goal:

Prove that `1.1.1 Schaarste en economisch denken` has no remaining platform-owned blockers and that the Book 1 companion path is stable enough for the lessen team to keep moving.

Executed work:

1. Kept the green gate routine active:
   - `npm.cmd run check:platform`
   - `npm.cmd run check:book -- "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"`
2. Re-ran the MVP proof checks for `1.1.1`:
   - `node scripts\validate-paragraph.js --mode complete "<paragraph-folder>"`
3. Verified `scripts/deploy.js` is repeatable against Book 1 without path/layout surprises.
4. Fixed the platform-owned blockers surfaced by the proof run:
   - `check-book.js` now defaults to `part-a` so book health stays stable while companion pilots are in progress
   - chapter/paragraph validators now distinguish Part A asset checks from companion-only extra assets
   - flat-layout converters now support Book 1 root-level companion files
   - deploy now copies shared reasoning metadata needed by the flat Book 1 flow
   - link checking now measures actual interactive reachability rather than textbook export noise
   - procedure-data tests were aligned with the canonical unit registry rather than a stale last-step assumption
5. Updated the roadmap/docs to match the real post-proof state.

Exit criteria:

- `check:platform` stays green
- `check:book` stays green
- Book 1 deploy/generator behavior is stable for the MVP paragraph
- `1.1.1` passes `validate-paragraph.js --mode complete`
- no remaining `1.1.1` platform blockers were found during the proof run

### Sprint P1.2: Companion Scaling And Handoff Sprint

Completed: yes.

Started: 2026-04-24.
Completed on: 2026-04-24.

Goal:

Prove that the Book 1 companion pattern scales beyond one paragraph without the lessen team inventing platform structure on the fly.

Current probe:

- Selected paragraph: `1.1.2 Percentages en indexcijfers`.
- Detailed triage note: `knowledge/platform-team-sprint-p1.2-companion-scaling.md`.
- Reason: it is the next registered Book 1 paragraph in the proven chapter, has complete Part A outputs, and exposes Part B repeatability without adding a new chapter/layout variable.
- Baseline result: `1.1.1` still passes `validate-paragraph.js --mode complete`.
- Initial probe result: `1.1.2` passed its Part A checks but failed `--mode complete`/`--mode part-b` with 29 Part B errors.
- Completion result: `1.1.2` passed `validate-paragraph.js --mode complete` during the technical probe after companion production and deploy.
- Cleanup result: the generated 1.1.2 lesson artifacts, shared data, source CSV, and temporary platform build scripts were removed after the probe because the paragraph must be rebuilt by a didactically instructed agent.

Probe-created pieces that were later cleared:

- `_paragraph-plan.md`
- all 24 required Part B root files
- `shared/questions/1.1.2.js`
- `shared/newsdetective/1.1.2.js`
- `shared/reasoning/1.1.2.js`
- `shared/procedure/1.1.2.js`
- `shared/skilltree/1.1.2.js`
- temporary production scripts under `build-scripts/content/book-1/`:
  - `b1-112-game-data.js`
  - `b1-112-companions.js`

Initial ownership read:

- No new platform-owned layout/deploy blocker was proven by the `1.1.2` build.
- The flat Book 1 path repeats cleanly once content/data inputs exist.
- `deploy.js` must not be used as a read-only probe because it writes to the target book.

Evidence:

- `node scripts\deploy.js "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"` completed successfully.
- `node scripts\validate-paragraph.js --mode complete "<1.1.2-folder>"` passed.
- `node scripts\validate-paragraph.js --mode complete "<1.1.1-folder>"` still passed after deploy.
- `npm.cmd run check:book -- "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"` passed 26/26.
- `npm.cmd run check:platform` passed.

Next action:

- Move companion platform work to quality-gate hardening before bulk companion production.
- Sprint P1.3 dashboard work may use the historical 1.1.2 technical-probe evidence, but must not treat the cleared 1.1.2 testing material as approved content.
- A didactically instructed build agent must recreate the 1.1.2 companion materials before that paragraph is considered lesson-ready.

Work:

- Keep the Book 1 bootstrap layer stable.
- Verify `scripts/deploy.js` runs cleanly against Book 1 under repeat use.
- Verify generated/shared files land where the flat layout expects them.
- Triage any Part B validation failures into platform-owned vs content-owned work.
- Support at least one additional complete companion paragraph until it passes:

```powershell
node scripts\validate-paragraph.js --mode complete "<paragraph-folder>"
```

Exit criteria:

- At least two Book 1 companion paragraphs pass `validate-paragraph.js --mode complete`. Observed during the technical probe for `1.1.1` and `1.1.2`; the 1.1.2 test materials were then removed.
- Any repeated manual setup step is documented, scripted, or explicitly assigned to content work. The temporary 1.1.2 scripts proved the setup path, then were removed so the paragraph can be recreated from didactic instructions.
- The lessen team has a clear handoff note for what is platform-owned and what is content-owned. Done in `knowledge/platform-team-sprint-p1.2-companion-scaling.md`.

### Sprint P1.3: Internal Review Dashboard Sprint

Completed: yes.

Completed on: 2026-04-24.

Goal:

Create a developer-facing internal HTML dashboard that gives humans a compact overview of where the three teams are going, which quality issues are open, and which sprint/report areas need attention.

Boundary:

- This dashboard is internal and developer-facing.
- It must live in the platform/reporting workflow, not in public or student-facing lesson output.
- It must not expose technical quality categories on any public-facing site.
- Dashboard work may generate internal reports inside the platform/reporting tree, but it must not write dashboard output into public or student-facing lesson material.

Issue categories:

- Inspection And Accountability: evidence, traceability, coverage, and proof that materials meet school, inspection, and exam-program expectations.
- Reference Quality: correctness, freshness, deduplication, source validity, unit quality, term quality, and exam-code links.
- Didactic Quality: whether the right skills, complexes, goals, sequence, cognitive load, and misconceptions are handled efficiently.
- Assessment And Exam Fit: alignment with CvTE-style demands, question types, answer models, target skills, and exam realism.
- Student And Teacher Experience: readability, navigation, visuals, games, differentiation, teacher readiness, and classroom usability.
- Platform Reliability: repeatability and trustworthiness of generators, validators, deploys, links, tests, and reporting routines.
- Production Readiness: release and scaling blockers, including incomplete artifacts, unresolved flags, manual steps, rebuild gaps, and known risks.
- Innovation Transfer: whether collab experiments are accepted, rejected, revised, or migrated into production workflows.

Dashboard scope:

- sprint status from each team roadmap
- open validator/report issues by category
- green-gate command status and last known evidence
- companion pipeline status by paragraph
- reference roadmap summary and links
- links to source reports, roadmap sections, and escalation notes

Team tabs:

- Platform / Control Center: owns platform guardrails, validator/deploy health, architecture quality, year and multi-year planning, reporting, and cross-team visibility.
- References / Knowledge Control: owns reference quality, inspection/accountability evidence, exam alignment, skill/goal efficiency, and the question of exactly which skills, complexes, and goals should be taught versus omitted as unnecessary.
- Lessen / Effective Teaching: owns front-end quality, lesson usability, differentiation, games, visuals, companion material quality, and turning technically valid material into effective teaching.
- Innovation / Collab Experiments: owns controlled experiments in the collab worktrees, where riskier presentation, web-native, narration, and future product ideas can be tried before adoption into production workflows.

Baseline roadmap sources:

- Platform tab: `knowledge/platform-team-roadmap.md`
- References tab: `references/reference-team-roadmap.md`
- Lessen tab: `../4veco-lessen/lessen-team-roadmap.md`
- Innovation tab, platform side: `../4veco-platform-collab/knowledge/innovation-team-roadmap.md`
- Innovation tab, lesson-output side: `../4veco-lessen-collab/innovation-team-roadmap.md`

Implementation direction:

- Prefer a static internal HTML report generated from structured JSON/Markdown inputs.
- Start with the roadmap files above as the first structured source inventory.
- Keep the dashboard source under `build-scripts/` or `scripts/` if it becomes reusable.
- Keep generated dashboard output under an internal report path such as `reports/internal-dashboard/`, not in `../4veco-lessen`.
- Make the data model explicit before styling the page.

Next action:

- Use the dashboard as the visible control surface for Sprint P1.4 platform issue cataloging and improvement planning.

Evidence:

- `build-scripts/reports/internal-dashboard.js` generates the dashboard.
- `reports/internal-dashboard/index.html` is the internal developer-facing dashboard.
- `reports/internal-dashboard/dashboard-data.json` stores the parsed source data.
- `npm.cmd run dashboard:internal` completed successfully.
- `node --check build-scripts\reports\internal-dashboard.js` passed.
- Dashboard data verification passed: 3 teams, all roadmap sources found, 33 sprint rows, and 6 parsed quality-gate issues across the dashboard quality categories.

Exit criteria:

- A first internal HTML dashboard can be generated locally. Done.
- It has separate tabs for Platform, Lessen, and Innovation. Done.
- It shows sprint completion status and open issues by the eight categories above. Done.
- It lists each tab's source roadmap and last known status. Done.
- It clearly labels itself as internal/developer-facing. Done.
- The dashboard generation path is documented and does not touch student-facing output. Done; output stays under `reports/internal-dashboard/`.

### Sprint P1.4: Platform Issue Catalog And Improvement Plan

Completed: no.

Goal:

Create the authoritative non-reference platform issue log by category, then turn that log into a next-period improvement plan.

Work:

- Inventory issues from:
  - `knowledge/platform-team-companion-quality-gate-review.md`
  - existing `reports/`
  - platform roadmap residual risks
  - lessen roadmap handoff items
  - innovation roadmap transfer risks
- Route reference-specific issues to `references/reference-team-roadmap.md` instead of keeping them in the platform backlog.
- Record each issue with category, owner, evidence, severity, status, next action, and proof required to close.
- Treat the current quality categories as provisional during cataloging.
- Propose category changes if the real issue set shows that the taxonomy is wrong or too broad.
- Separate issues into:
  - fix now
  - plan this period
  - defer
  - reject/not actionable
  - belongs to lessen team
  - belongs to innovation team
- Produce a next-period improvement plan from the issue log.

Next action:

- Define the first issue-log schema and seed it from the known quality-gate review.

Exit criteria:

- The dashboard has a real issue log, not only parsed headings.
- Every issue has a quality category, owner team, source/evidence, status, and next action.
- Category changes, if any, are documented and reflected in the dashboard generator.
- The next-period improvement plan is written and ordered by quality risk, educational value, and platform leverage.

### Sprint P1.5: CI And Health Check Routine Sprint

Completed: no.

Goal:

Make the green-gate routine repeatable enough that platform health is visible before material teams are blocked.

Work:

- Keep these as the standard pre/post-change checks:

```powershell
npm.cmd run check:platform
npm.cmd run check:book -- "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"
```

- Make book/chapter/paragraph validation practical to run during active work.
- Add small tests around reference CLI scripts where risk is high.
- Keep validator docs and roadmap status aligned with real behavior.
- Record non-blocking residual risks in the internal dashboard or `knowledge/current-state-detailed-analysis.md`.

Next action:

- Decide which health checks should run locally only, which should be CI candidates, and which need target-path parameters.

Exit criteria:

- The routine checks are documented in one place.
- The checks are easy to run without remembering hidden target paths.
- Known failures are surfaced as explicit status, not tribal knowledge.

## Team Guardrails

- Keep `check:platform` green.
- Keep `check:book` green while the lessen team edits Book 1 and builds Book 2 Part A.
- Do not reopen Phase 0 unless one of the green-gate commands regresses.
- Treat companion work as a pilot scaling track: two paragraphs have passed the technical complete gate historically, but current approved companion content should not count the cleared 1.1.2 test materials.
- Keep internal review/reporting dashboards separate from public/student-facing output.

## Platform Team Deliverables

### Next 1 Week

- Sprint P1.2 has proven the next representative companion paragraph.
- Sprint P1.3 is complete: internal dashboard and quality-gate visibility now have a first generated surface.
- Sprint P1.4 starts as the current platform priority: non-reference platform issue catalog and next-period improvement planning.
- Reference quality planning continues in `references/reference-team-roadmap.md`.
- Green gate stays green.
- Lessen team can continue one real companion paragraph without platform ambiguity.

### Next 2-4 Weeks

- At least two representative paragraphs pass `--mode complete`. Technically observed for `1.1.1` and `1.1.2`; 1.1.2 must be recreated didactically before it counts as approved material.
- Reusable Book 1 companion build scripts exist under `build-scripts/content/book-1/` only for approved content; the temporary 1.1.2 probe scripts have been removed.
- Deploy/config assumptions for flat Book output are stable enough to repeat.
- Sprint P1.4 produces the platform issue log and next-period improvement plan.
- Sprint P1.3 dashboard can be extended with richer issue-log and report inputs as Sprint P1.4 discovers the real work.

### Months 1-3

- Platform issue categories are stable enough to guide planning, or category changes are documented with migrations.
- Reference backlog is cleaner and better trusted through the references roadmap.
- Companion pipeline is proven on repeated real work, not just documented.
- Internal dashboard gives developers a reliable overview of sprint state and open quality issues.
- Platform quality is better than merely "green".

## What The Platform Team Does Not Own

- Teacher-facing content judgment on Book 1 polish.
- The actual educational writing for Book 2 Part A.
- Companion layout/front-end direction after handoff to the lessen team.
- Bulk companion production across many paragraphs before the MVP is proven.
- Public presentation of internal quality categories and issue status from the developer-facing dashboard.

## Escalation Triggers

Bring issues back to shared planning immediately if:

- `check:platform` regresses.
- `check:book` regresses because of validator/platform behavior rather than content edits.
- `scripts/deploy.js` cannot target Book 1 cleanly after config/plumbing is added.
- The first companion MVP reveals a structural mismatch between `BUILD-PARAGRAPH.md` and the real toolchain.
- The internal dashboard starts duplicating generated student-facing output instead of summarizing internal platform/report state.
