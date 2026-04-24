# Platform Team Roadmap

Generated: 2026-04-23  
Updated: 2026-04-24 after completing Sprint P1.2 companion scaling, clearing the 1.1.2 probe materials, and reprioritizing companion layout/UI  
Source: split from `knowledge/three-month-roadmap.md` after Sprint 0.5 sign-off

Detailed bootstrap plan for the first Book 1 companion MVP:

- `knowledge/platform-team-companion-bootstrap-plan.md`

Active companion scaling triage:

- `knowledge/platform-team-sprint-p1.2-companion-scaling.md`

Companion quality-gate review:

- `knowledge/platform-team-companion-quality-gate-review.md`

## Mission

Own the platform guardrails that make material production trustworthy:

- validators
- deploy/config plumbing
- generators
- reference quality
- architecture quality
- CI and repeatable health checks
- internal developer-facing project oversight

## Current Status

Sprint 0.5 is signed off for Part A textbook/book production, Sprint P1.1 has proven the first Book 1 companion paragraph path, and Sprint P1.2 has technically proven the pattern on a second Book 1 companion paragraph.

The temporary Green Gate deployment/output freeze is lifted as of 2026-04-24. Controlled production in `../4veco-lessen` may resume under the normal build/validation workflow. The legacy Module 3 target remains separately frozen until September 2026.

The companion pilot is still open. The technical pipeline now repeats, but the 1.1.2 probe materials were testing material only and have been removed from both `4veco-lessen` and the platform build inputs. That paragraph must be recreated by an agent explicitly instructed for teaching and didactic design.

The next platform-owned priority is companion layout and front-end usability. Layout/UI changes must be integrated through platform-owned templates, shared CSS/JS, converters, generators, or validators, not by hand-editing generated files in `4veco-lessen`.

Verified:

- `npm.cmd run check:platform` passes.
- `npm.cmd run check:book -- "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"` passes.
- `node scripts\validate-paragraph.js --mode complete "<1.1.1-folder>"` passes.
- `node scripts\deploy.js "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"` runs cleanly, including link checks and data tests.

Important boundary:

- Part A textbook/chapter/book delivery is green.
- The Part B companion pipeline is technically proven end-to-end for `1.1.1 Schaarste en economisch denken`.
- The companion pattern was technically repeated for `1.1.2 Percentages en indexcijfers`; those test materials are now cleared and are not approved lesson content.
- Bulk repetition across many paragraphs is still not proven and should wait for the quality-gate backlog and layout/front-end usability work to be tightened.

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

## Sprint Ledger

| Sprint | Name | Completed | Current State |
|--------|------|-----------|---------------|
| 0.5 | Phase 0 Green Gate | yes | Signed off for Part A textbook/book production. |
| P1.1 | Book 1 Companion Proof Sprint | yes | `1.1.1` companion path proven end-to-end. |
| P1.2 | Companion Scaling And Handoff Sprint | yes | `1.1.2` passed as a technical probe; its test materials were removed for didactic rebuild. |
| P1.3 | Internal Review Dashboard Sprint | no | Planned; developer-facing HTML overview for project health and open quality issues. |
| P1.4 | Reference Data Quality Sprint | no | Planned; clean unit/term/exam-link backlog. |
| P1.5 | CI And Health Check Routine Sprint | no | Planned; make routine health checks harder to skip. |
| P1.6 | Companion Layout And Front-End Integration Sprint | no | Current companion priority; improve layout/usability through platform-owned code paths before bulk scaling. |

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

### Sprint P1.6: Companion Layout And Front-End Integration Sprint

Completed: no.

Goal:

Improve the companion material layout and front-end usability before bulk companion production. The technical companion path is proven, but the current generated pages are not yet the design end state.

Reference input:

Use the improved legacy/rewire voorkennis page as a comparison point, not as a copy target:

```text
file:///C:/Projects/4veco/3-Module-3-rewire-test/3.1%20Hoofdstuk%201%20-%20Markten/3.1.1%20Paragraaf%201%20-%20Markt%20en%20marktstructuur/1.%20Voorbereiden/3.1.1%20Markt%20en%20marktstructuur%20%E2%80%93%20uitleg%20voorkennis.html
```

Useful patterns to evaluate:

- sidebar navigation by section
- mobile menu toggle and overlay
- hero section with section cards
- domain badges and domain-colored section headers
- clearer callouts, formula boxes, summary tables, and checklist

Platform-owned work:

- Define the companion HTML layout standard for voorkennis, vaardigheden, begeleide inoefening, paragraph landing pages, and any weak game-shell framing.
- Implement reusable UI changes in platform-owned templates, shared CSS/JS, converters, generators, or validators.
- Avoid direct hand-edits to generated `4veco-lessen` HTML as the source of truth.
- Regenerate pilot output from the platform after changes.
- Add or document browser smoke checks for desktop and mobile widths.

Exit criteria:

- `1.1.1` and a didactically rebuilt `1.1.2` can be regenerated with the improved platform-owned companion layout.
- Complete-mode validation still passes after regeneration.
- Link/reachability checks pass.
- Browser smoke checks confirm the main companion pages render and navigate correctly.
- The lessen team can treat the improved layout as the repeatable companion direction.

### Sprint P1.3: Internal Review Dashboard Sprint

Completed: no.

Goal:

Create a developer-facing internal HTML dashboard that gives humans a compact overview of where the platform is going, which quality issues are open, and which sprint/report areas need attention.

Boundary:

- This dashboard is internal and developer-facing.
- It must live in the platform/reporting workflow, not in public or student-facing lesson output.
- It must not expose technical quality categories on any public-facing site.
- Dashboard work may generate internal reports inside the platform/reporting tree, but it must not write dashboard output into public or student-facing lesson material.

Issue categories:

- bronprobleem: the underlying source is missing, stale, contradictory, or unsuitable
- extractieprobleem: the source exists but the extraction/parsing layer produced bad or incomplete data
- claimprobleem: a generated or authored claim is unsupported, too broad, or conflicts with evidence
- interpretatieprobleem: the data is present but interpreted incorrectly in planning, reports, or material logic
- tekstprobleem: wording, clarity, terminology, or student/teacher explanation quality needs work

Dashboard scope:

- sprint status from this roadmap
- open validator/report issues by category
- green-gate command status and last known evidence
- companion pipeline status by paragraph
- reference-data backlog summary
- links to source reports, roadmap sections, and escalation notes

Implementation direction:

- Prefer a static internal HTML report generated from structured JSON/Markdown inputs.
- Keep the dashboard source under `build-scripts/` or `scripts/` if it becomes reusable.
- Keep generated dashboard output under an internal report path such as `reports/internal-dashboard/`, not in `../4veco-lessen`.
- Make the data model explicit before styling the page.

Next action:

- Inventory existing report files and decide which structured inputs should feed the first dashboard version.

Exit criteria:

- A first internal HTML dashboard can be generated locally.
- It shows sprint completion status and open issues by the five categories above.
- It clearly labels itself as internal/developer-facing.
- The dashboard generation path is documented and does not touch student-facing output.

### Sprint P1.4: Reference Data Quality Sprint

Completed: no.

Goal:

Improve trust in machine/reference data by cleaning known unit, term, and exam-link drift.

Work:

- Regenerate stale reports when needed.
- Clean unit-term drift between `micro-teaching-units.json` and `begrippen.json`.
- Triage `missing_units_flagged` into:
  - minted
  - duplicate
  - still needed
  - defer
  - reject
- Improve exam-question coverage:
  - missing required-skill links
  - missing exam-code links
  - deprecated `D23` cleanup

Next action:

- Identify the current authoritative report for each backlog class before editing any machine reference.

Exit criteria:

- The main reference backlog report separates true blockers from deferred/non-actionable items.
- Machine references are changed only through the intended CLI scripts.
- Any remaining drift is recorded with owner and reason.

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
- Record non-blocking residual risks in `knowledge/current-state-detailed-analysis.md` or the internal dashboard once Sprint P1.3 exists.

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
- Treat companion layout and front-end usability as platform-integrated work. Shared UI improvements belong in platform templates, converters, shared CSS/JS, generators, or validators.
- Do not make generated `4veco-lessen` HTML the source of truth for UI changes.
- Keep internal review/reporting dashboards separate from public/student-facing output.

## Platform Team Deliverables

### Next 1 Week

- Sprint P1.2 has proven the next representative companion paragraph.
- Sprint P1.6 starts as the current companion priority: improve layout/front-end usability through platform-owned code.
- Green gate stays green.
- Lessen team can continue one real companion paragraph without platform ambiguity.

### Next 2-4 Weeks

- At least two representative paragraphs pass `--mode complete`. Technically observed for `1.1.1` and `1.1.2`; 1.1.2 must be recreated didactically before it counts as approved material.
- Reusable Book 1 companion build scripts exist under `build-scripts/content/book-1/` only for approved content; the temporary 1.1.2 probe scripts have been removed.
- Deploy/config assumptions for flat Book output are stable enough to repeat.
- Improved companion layout direction is implemented in the platform and regenerated into the pilot paragraphs.
- Sprint P1.3 has a first internal dashboard shape or input inventory.

### Months 1-3

- Reference backlog is cleaner and better trusted.
- Companion pipeline is proven on repeated real work, not just documented.
- Internal dashboard gives developers a reliable overview of sprint state and open quality issues.
- Platform quality is better than merely "green".

## What The Platform Team Does Not Own

- Teacher-facing content judgment on Book 1 polish.
- The actual educational writing for Book 2 Part A.
- Bulk companion production across many paragraphs before the MVP is proven.
- Public presentation of internal quality categories such as bronprobleem, extractieprobleem, claimprobleem, interpretatieprobleem, and tekstprobleem.

## Escalation Triggers

Bring issues back to shared planning immediately if:

- `check:platform` regresses.
- `check:book` regresses because of validator/platform behavior rather than content edits.
- `scripts/deploy.js` cannot target Book 1 cleanly after config/plumbing is added.
- The first companion MVP reveals a structural mismatch between `BUILD-PARAGRAPH.md` and the real toolchain.
- The internal dashboard starts duplicating generated student-facing output instead of summarizing internal platform/report state.
