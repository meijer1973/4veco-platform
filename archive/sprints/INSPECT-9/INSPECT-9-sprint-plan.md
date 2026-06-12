# INSPECT-9 Sprint Plan

Status: planning review passed, implementation authorised within bounded INSPECT-9 scope
Date: 2026-06-10
Branch: `codex/inspect-9-dutch-evidence-gap-closure-plan-20260610`
Worktree: `C:\wt\INSPECT-9-20260610\4veco-platform`
Lesson evidence checkout: `C:\wt\INSPECT-9-20260610\4veco-lessen`
Roadmap: `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
Ledger: `docs/roadmaps/quality-standards/sprint-ledger.md`
Handoff: `archive/sprints/INSPECT-9/INSPECT-9-coding-agent-handoff.md`

## Purpose

INSPECT-9 converts the INSPECT-8 Dutch Evidence Scale Readiness audit into a
correction plan for the evidence basis. The sprint must define proof
requirements, correction routes, stop conditions, and reviewer needs before
Book 1 Chapter 1.2 `Vraag` or any other Dutch scope can become additional
evidence-pack work.

This sprint is planning and source-evidence hardening design only. It must not
generate evidence packs, implement a report generator, add package scripts,
integrate with CI/build, dashboards, quality-ref, or Scale Gate, mutate
generated lesson output, process personal data, start non-Dutch standards
work, or make compliance, approval, inspection-ready, complete OP0,
school-obligation, PTA-validity, summative-validity,
classroom-implementation, or school-SKA claims.

## Quality Floor

- The sprint must preserve the INSPECT-8 decision: no additional Dutch
  evidence-pack generation yet.
- Every proposed correction route must include proof required before the gap
  may be closed.
- Weak, missing, stale, flagged, route-local, school-owned, and forbidden
  evidence must remain visible.
- The plan must distinguish target-exercise presence, v5 target finality,
  exam-code linkage, target-equivalent proof, generated artifact presence,
  reviewed artifact quality, accessibility evidence, support evidence, and
  school-owned evidence.
- Book 1 Chapter 1.2 is the first gap-closure candidate; Book 1 Chapter 1.1
  first-three paragraphs remain a control scope only unless INSPECT-9 records
  explicit remediation requirements for re-use.
- OP0/basic-skills language must stay limited to subject-material economics
  evidence.
- `../4veco-lessen` is read-only evidence. It may be cited but not modified.

## Specification Requirements

INSPECT-9 must fulfill the roadmap requirement to produce a Dutch Evidence Gap
Closure Plan before further evidence-pack work.

Planned primary outputs after planning review passes:

```text
archive/sprints/INSPECT-9/
reports/inspection-standards/dutch-evidence-gap-closure-plan.md
reports/inspection-standards/dutch-evidence-gap-closure-plan.json
```

Required focus areas:

- v5 target finality route for `1.2.1`, `1.2.2`, and `1.2.3`;
- reviewed integration target route for `1.2.4`;
- exam-code linkage decision route for `1.2.1` and `1.2.4`;
- target-equivalent proof requirements for Chapter 1.2;
- accessibility evidence rubric for Chapter 1.2 candidate use;
- support/differentiation evidence rubric for Chapter 1.2 candidate use;
- stale source freshness policy;
- product/school boundary wording per relevant evidence category;
- Chapter 1.1 control-scope remediation decision before re-use.

## Evidence Needed To Prove Fulfilment

The gap-closure plan must cite concrete read-only evidence paths for every
proof requirement and correction route. Required starting evidence:

- `reports/inspection-standards/dutch-evidence-scale-readiness.md`;
- `reports/inspection-standards/dutch-evidence-scale-readiness.json`;
- `references/authored/course-target-exercises.json`;
- `references/external/exam-questions.json`;
- `references/external/syllabus-eindtermen.json`;
- `references/data/alignment-graph.json`;
- `reports/review-gates/GATE-L1.7B-Q2-exit-ticket-target-equivalent-proof/gate-closure.md`;
- `reports/json/exit-ticket-workbench-112-rendered-1-proof.json`;
- `reports/review-gates/GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review/review-packet.md`;
- `reports/review-gates/GATE-PV-G4-lesson-regression/gate-closure.md`;
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`.

Governance inputs already read before this draft plan:

- `AGENTS.md`;
- `CLAUDE.md` from the platform and anchor project context;
- `../4veco-lessen/specifications/product-vision.md`;
- `../4veco-lessen/specifications/product-end-state.md`;
- `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`;
- `docs/roadmaps/quality-standards/sprint-ledger.md`;
- `docs/roadmaps/quality-standards/quality-standards-end-state.md`;
- `references/data/inspection-standards/README.md`;
- `references/data/inspection-standards/nl-vo-evidence-profile.v0.json`;
- INSPECT-8 closure, activity, validation, and lead-review logs.

If a path contains legacy wording that is restricted by scope-language policy,
treat it as a path token only and do not copy that wording into active sprint
prose except inside exact path literals.

## Allowed Outputs

```text
archive/sprints/INSPECT-9/INSPECT-9-coding-agent-handoff.md
archive/sprints/INSPECT-9/INSPECT-9-sprint-plan.md
archive/sprints/INSPECT-9/INSPECT-9-planning-review.md
archive/sprints/INSPECT-9/INSPECT-9-correction-log.md
archive/sprints/INSPECT-9/INSPECT-9-validation-log.md
archive/sprints/INSPECT-9/INSPECT-9-lead-review-assignment.md
archive/sprints/INSPECT-9/INSPECT-9-lead-review-round1.md
archive/sprints/INSPECT-9/INSPECT-9-lead-review-round2.md
archive/sprints/INSPECT-9/INSPECT-9-closure-log.md
reports/inspection-standards/dutch-evidence-gap-closure-plan.md
reports/inspection-standards/dutch-evidence-gap-closure-plan.json
docs/roadmaps/quality-standards/sprint-ledger.md
generated repository indexes/reports when required by changed sprint/report paths
```

Only create round-2 lead-review or correction-log content if corrections are
needed. The ledger update belongs at closure unless a blocker requires an
earlier status note.

## Forbidden Paths And Work

Do not modify:

```text
package.json
package-lock.json
build-scripts/inspection/build-dutch-evidence-pack.js
build-scripts/inspection/build-inspection-pack.js
references/machine/
references/external/
../4veco-lessen/
```

Do not mutate source data as part of INSPECT-9 unless a planning review and a
fresh explicit authority expand the sprint. In the default INSPECT-9 scope,
`references/authored/course-target-exercises.json` is evidence and a future
correction target, not a file to edit.

Do not add:

```text
new evidence packs
new report-only generator implementation
package scripts
CI/build gates
dashboard gates
quality-ref integration
Scale Gate integration
generated lesson-output changes
student-level or personal-data processing
non-Dutch standards work
public-facing claims
```

Forbidden claims:

```text
legal compliance
AVG/GDPR compliance
inspectorate approval
inspection-ready status
certification
complete OP0/basic-skills evidence
school-obligation satisfaction
PTA validity
summative assessment validity
classroom implementation proof
school SKA compliance
```

## Gap-Closure Planning Procedure

1. Confirm branch/worktree safety and clean read-only lesson evidence status:
   - `git fetch --prune origin`;
   - `git status --short --branch`;
   - `git branch --show-current`;
   - `npm.cmd run check:agent-worktree-safety -- --check --task INSPECT-9-20260610 --agent codex --require-prefix codex/,agent/`.
2. Complete planning review before writing any gap-closure findings.
3. Re-read the accepted INSPECT-8 reports and required source evidence.
4. Build a Chapter 1.2 candidate matrix for `1.2.1` through `1.2.4` using
   existing records only:
   - target record status;
   - target exercise operation and answer-form chain;
   - exam-code links and missing-link decision needs;
   - paragraph review and quality-ref evidence;
   - generated artifact presence;
   - target-equivalent proof status;
   - accessibility and support evidence status;
   - product/school boundary risks.
5. Build a Chapter 1.1 control-scope remediation matrix for `1.1.1`,
   `1.1.2`, and `1.1.3`, focused on:
   - missing target-registry exam-code links;
   - migrated target record status;
   - local-only `1.1.2` target-equivalent proof;
   - rendered `1.1.2` proof authority boundaries;
   - whether remediation is required before re-use as a control scope.
6. Define proof requirements for target finality:
   - target-exercise review evidence required;
   - reviewer role or gate required;
   - source records that must be cited;
   - exact state transition allowed after proof.
7. Define proof requirements for exam-code linkage:
   - official exam or syllabus source required;
   - accepted outcomes such as link, no-code-with-rationale, or defer;
   - evidence needed before a link can appear in future source data.
8. Define proof requirements for target-equivalent proof:
   - target operation chain;
   - answer-form match;
   - route independence from advisory checks;
   - no answer-giving scaffold on proof surfaces;
   - local versus generalized authority wording;
   - review packet and proof artifact requirements.
9. Define accessibility and support/differentiation rubrics:
   - product-side sub-evidence labels;
   - minimum proof artifacts;
   - route-local limitations;
   - school-owned evidence exclusions.
10. Define stale source freshness policy:
   - source types covered;
   - freshness metadata required;
   - stale-source label and owner next action;
   - conditions for using a stale source as historical context only.
11. Define product/school boundary wording that can be reused in later
    reports without making school-owned or competent-authority claims.
12. Create the Markdown and JSON gap-closure plan reports from the same
    source analysis.
13. Validate structure, language, no-lesson-mutation boundaries, and JSON
    parseability.
14. Use focused specialist review if the plan makes judgement-heavy claims
    about evidence quality, learning quality, accessibility, privacy,
    teacher-facing use, or inspection relevance.
15. Run lead review before closure. Correct blockers, validate again, and
    record a round-2 recheck if needed.
16. Update the sprint ledger and closure log after validation and lead review.

## Correction Route Decision Rules

- A gap is not closed merely because a route is named. The route must name the
  proof required to close it.
- Target-exercise presence is not final-reviewed curriculum evidence.
- Migrated target records cannot become final without a review artifact for
  the exact record.
- `1.2.4` cannot become an integration target without a reviewed target
  exercise or explicit no-new-theory integration rationale.
- Exam-code linkage must cite official source evidence or explicitly record a
  no-code/defer decision with rationale.
- Target-equivalent proof must cover the target operation chain at the same
  cognitive level with matching answer forms.
- Local target-equivalent proof may not be generalized to other paragraphs or
  semantic scoring without explicit review.
- Rendered proof that is pending review does not authorize product use,
  completion-language enablement, broad rollout, diagnostics, mastery,
  automatic sequencing, summative use, PV, Scale Gate, or student/product use.
- Generated artifact presence is not reviewed lesson quality.
- PASS WITH FLAGS remains flagged evidence and must not be flattened into an
  unconditional pass.
- Accessibility screenshot or route-local proof is not full accessibility
  proof.
- Practice routes, hints, and short checks are product-side advisory support;
  they are not school monitoring, interventions, accommodations, or care-plan
  evidence.
- Product QA records are not school SKA evidence.

## Report Shape

The JSON report must include at minimum:

```text
schema_version
report_id
sprint_id
generated_date
status
diagnostic_only
compliance_claim
personal_data_present
scope
input_evidence
chapter_1_2_candidate_matrix
chapter_1_1_control_scope_remediation
proof_requirement_matrix
correction_routes
source_freshness_policy
product_school_boundary_wording
quality_log
school_owned_evidence_still_needed
unsafe_claim_risks
validation_notes
```

The Markdown report must include at minimum:

```text
Scope and safe-use note
Executive planning decision
Chapter 1.2 candidate matrix
Chapter 1.1 control-scope remediation decision
Proof requirements by gap type
Correction routes and owners
Accessibility evidence rubric
Support/differentiation evidence rubric
Stale source freshness policy
Product/school boundary wording
Quality log
School-owned evidence still needed
Unsafe-claim risks
Validation summary
Next action
```

## Review Gate

Planning review must pass before the main agent creates the gap-closure plan
findings or report outputs.

Lead review is required before closure, with assignment, round-1 review,
correction log if needed, and round-2 recheck if blockers are found.

The three-reviewer external gate is not required for INSPECT-9 if the sprint
stays internal, Dutch-only, planning/report-only, and does not prepare a
generator, evidence pack, teacher/school-facing summary, public claim,
dashboard/report surface beyond the named gap-closure reports,
quality-ref/Scale Gate integration, or generated-output change. Stop and
require a fresh plan plus the applicable review gate if the work crosses that
line.

## Validation Plan

Minimum closure validation:

```text
npm.cmd run check:scope-language
npm.cmd run check:platform
npm.cmd run agent:index
npm.cmd run dashboard:internal
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/references/check-roadmap-version-index.js
git diff --check
git -C ../4veco-lessen status --short --branch
git -C ../4veco-lessen diff --name-only
```

`npm.cmd run dashboard:internal` is only the AGENTS-required internal
dashboard/index refresh for repository maps. It is not dashboard integration,
a dashboard gate, or authority to expose Dutch quality-control evidence in a
new dashboard surface.

Additional INSPECT-9 checks:

- JSON parse check for
  `reports/inspection-standards/dutch-evidence-gap-closure-plan.json`.
- Markdown required-section check for
  `reports/inspection-standards/dutch-evidence-gap-closure-plan.md`.
- Diff review confirming no evidence-pack files, generator implementation,
  package scripts, dashboard gates, quality-ref integration, Scale Gate
  integration, source-data mutation, or lesson-target mutation were added.
- Positive forbidden-claim phrase scan for INSPECT-9 plan, reports, reviews,
  validation log, and closure log.
- Check that every quality-log item has category, evidence path, affected
  surface, severity, next action, platform handoff requirement, and proof
  required to close.

If generated indexes or dashboard records change, stage the INSPECT-9 sprint
and report files before regenerating so the new records are included.

## Stop Conditions

Stop and record the blocker if:

- planning review returns `REVISE`;
- the sibling lesson-evidence checkout at `../4veco-lessen` is absent, dirty,
  or cannot be treated as read-only evidence;
- a gap-closure route cannot cite concrete evidence for the underlying gap;
- a correction would require mutating `../4veco-lessen`;
- a correction would require source-data mutation instead of a future route;
- the work requires a generator, package script, CI/build gate, dashboard
  gate, quality-ref integration, Scale Gate integration, or lesson-output
  mutation;
- target-finality, exam-linkage, target-equivalent proof, accessibility, or
  support wording would strengthen an unreviewed claim;
- personal data appears or would be needed;
- OP0, SKA, assessment, accessibility, or support wording blurs into
  school-owned proof;
- a Chapter 1.2 recommendation would hide weak or missing evidence;
- non-Dutch standards work appears in scope.

## Omitted Work And Follow-Up

INSPECT-9 does not close evidence gaps. It defines the proof requirements and
correction routes that future sprints must satisfy before gaps can close.

INSPECT-9 does not update target records, add exam-code links, generate
target-equivalent proof artifacts, run accessibility audits, mutate generated
lesson output, implement a generator, broaden evidence-pack generation, or
create teacher/school-facing summary surfaces. Those remain later roadmap
decisions after the required review gates.

## Required Next Action

Have a planning/review agent check this INSPECT-9 plan against the roadmap,
ledger, handoff, INSPECT-8 readiness audit, Dutch evidence profile, required
outputs, stop conditions, language hygiene, and validation plan. Only after
planning review passes may the main agent begin the Dutch Evidence Gap Closure
Plan report.
