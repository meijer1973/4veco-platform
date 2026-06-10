# INSPECT-8 Sprint Plan

Status: planning review passed, implementation authorised within planning/audit scope
Date: 2026-06-10
Branch: `codex/inspect-8-dutch-evidence-scale-readiness-20260610`
Worktree: `C:\wt\INSPECT-8-20260610\4veco-platform`
Roadmap: `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
Ledger: `docs/roadmaps/quality-standards/sprint-ledger.md`
Handoff: `archive/sprints/INSPECT-8/INSPECT-8-coding-agent-handoff.md`

## Purpose

INSPECT-8 decides which Dutch scopes are ready for additional evidence-pack
work and where the evidence base is still weak. It is a Dutch-only
readiness audit across existing product, review, target-exercise,
exam-linkage, accessibility, support, and quality-assurance evidence.

This sprint is planning/audit only. It must not generate new evidence packs,
implement a generator, add package scripts, integrate with CI/build,
dashboards, quality-ref, or Scale Gate, mutate generated lesson output,
process personal data, start non-Dutch standards work, or make compliance,
approval, inspection-ready, complete OP0, school-obligation, PTA-validity,
summative-validity, classroom-implementation, or school-SKA claims.

## Quality Floor

- The audit must keep weak, missing, stale, and school-owned evidence visible.
- The recommended next Dutch scope must be conservative and evidence-based.
- No source claim may be strengthened without reviewed evidence for that exact
  claim.
- Paragraph and chapter inventory must distinguish artifact presence from
  reviewed quality, target-exercise finality, exam-code linkage, and
  target-equivalent proof.
- OP0/basic-skills wording must remain subject-material economics evidence
  only.
- `../4veco-lessen` is read-only evidence for this sprint.
- The sibling lesson-evidence checkout at `../4veco-lessen` must exist before
  readiness findings are created. If it is absent, stop before the audit and
  either set up an explicitly authorised read-only evidence checkout under the
  INSPECT-8 worktree or record the missing evidence path as a blocker.

## Specification Requirements

INSPECT-8 must fulfill the roadmap requirement to produce:

```text
archive/sprints/INSPECT-8/
reports/inspection-standards/dutch-evidence-scale-readiness.md
reports/inspection-standards/dutch-evidence-scale-readiness.json
```

Required audit dimensions:

- paragraph and chapter scope inventory;
- target-exercise finality;
- exam-code linkage gaps;
- target-equivalent proof gaps;
- review evidence status;
- generated artifact evidence status;
- accessibility evidence status;
- differentiation/support evidence status;
- school-owned evidence still needed;
- unsafe-claim risks;
- recommended next Dutch scope.

## Evidence Needed To Prove Fulfilment

The audit must cite concrete read-only evidence paths for every readiness
judgement. Preferred starting evidence:

- `reports/inspection-standards/inspect-7-book-1-1-evidence-pack.md`;
- `reports/inspection-standards/inspect-7-book-1-1-evidence-pack.json`;
- `references/data/inspection-standards/prototypes/inspect-7-book-1-1.source.json`;
- `references/data/inspection-standards/fixtures/pilot-1.1-inspection-evidence.sample.json`;
- `references/authored/course-target-exercises.json`;
- `references/external/exam-questions.json`;
- `references/external/syllabus-eindtermen.json`;
- `references/data/alignment-graph.json`;
- `reports/review-gates/`;
- `reports/internal-dashboard/dashboard-data.json`;
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`.

If a path contains legacy wording, treat it as a path token only. Do not copy
that wording into active INSPECT-8 prose except inside exact path literals.

## Allowed Outputs

```text
archive/sprints/INSPECT-8/INSPECT-8-coding-agent-handoff.md
archive/sprints/INSPECT-8/INSPECT-8-sprint-plan.md
archive/sprints/INSPECT-8/INSPECT-8-planning-review.md
archive/sprints/INSPECT-8/INSPECT-8-correction-log.md
archive/sprints/INSPECT-8/INSPECT-8-validation-log.md
archive/sprints/INSPECT-8/INSPECT-8-lead-review-assignment.md
archive/sprints/INSPECT-8/INSPECT-8-lead-review-round1.md
archive/sprints/INSPECT-8/INSPECT-8-lead-review-round2.md
archive/sprints/INSPECT-8/INSPECT-8-closure-log.md
reports/inspection-standards/dutch-evidence-scale-readiness.md
reports/inspection-standards/dutch-evidence-scale-readiness.json
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

## Audit Procedure

1. Confirm branch/worktree safety and record baseline status.
2. Complete planning review before creating readiness findings.
3. Verify that `../4veco-lessen` exists and is clean/read-only for this
   sprint. If it is absent, stop before audit findings and resolve the evidence
   path or record a blocker.
4. Read the accepted Dutch quality-control baseline:
   - roadmap and ledger;
   - Dutch evidence profile;
   - INSPECT-7 bounded pack outputs;
   - QS-DUTCH-ROADMAP-1B closure boundaries.
5. Inventory Dutch scope candidates from existing records only:
   - Book 1 chapter and paragraph folders in the lesson target;
   - target-exercise registry entries;
   - dashboard and review-gate records;
   - INSPECT-7 accepted bounded chapter 1.1 baseline.
6. For each candidate scope, classify evidence across the required audit
   dimensions:
   - target-exercise finality;
   - exam-code linkage;
   - target-equivalent proof;
   - review evidence;
   - generated artifact evidence;
   - accessibility evidence;
   - differentiation/support evidence;
   - school-owned evidence still needed;
   - unsafe-claim risks.
7. Separate evidence states:
   - missing;
   - present but weak;
   - present with flags;
   - reviewed local evidence;
   - not applicable.
8. Record specific blockers, proof gaps, and next proof required to close each
   gap.
9. Recommend the next Dutch scope only if the evidence supports a conservative
   next step. If no additional scope is strong enough, recommend deferring
   scale work and using INSPECT-9 to close named gaps.
10. Create the Markdown and JSON readiness audit reports from the same factual
   findings.
11. Validate structure, claims, paths, and no-lesson-mutation boundaries.
12. Run focused specialist review if the audit makes judgement-heavy claims
    about evidence quality, learning quality, accessibility, privacy,
    teacher-facing use, or inspection relevance.
13. Run lead review before closure. Correct blockers, validate again, and
    record a round-2 recheck if needed.
14. Update the sprint ledger and closure log after validation and lead review.

## Readiness Decision Rules

- A scope with missing target exercises cannot be recommended for additional
  evidence-pack work.
- A scope with target exercises but no exam-code linkage remains weak
  curriculum-alignment evidence.
- Target-exercise presence is not target-equivalent closure proof.
- Answer-model presence is not reviewed exit-ticket proof.
- Generated artifact presence is not reviewed lesson quality.
- PASS WITH FLAGS remains flagged evidence, not an unconditional pass.
- Accessibility screenshots or route-local checks are not full accessibility
  proof.
- Practice routes and short checks are not school-owned monitoring or support
  evidence.
- Product QA records are not school SKA evidence.
- The recommendation may be "do not scale yet" if the conservative evidence
  threshold is not met.

## Report Shape

The JSON report must include at minimum:

```text
schema_version
report_id
sprint_id
generated_date
status
scope_inventory
audit_dimensions
candidate_scope_summary
recommended_next_dutch_scope
evidence_gaps
school_owned_evidence_still_needed
unsafe_claim_risks
validation_notes
```

The Markdown report must include at minimum:

```text
Scope and safe-use note
Executive finding
Recommended next Dutch scope
Scope inventory
Readiness matrix
Evidence gaps by dimension
School-owned evidence still needed
Unsafe-claim risks
Validation summary
Next action
```

## Review Gate

Planning review must pass before implementation starts.

Lead review is required before closure, with assignment, round-1 review,
correction log if needed, and round-2 recheck if blockers are found.

The three-reviewer external gate is not required for INSPECT-8 if the sprint
stays planning/audit only. Stop and require a fresh plan if the work starts
preparing a generator, evidence packs, teacher/school-facing summaries, public
claims, dashboard/report surfaces beyond the named readiness reports,
quality-ref integration, Scale Gate integration, or generated-output changes.

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

Additional INSPECT-8 checks:

- JSON parse check for
  `reports/inspection-standards/dutch-evidence-scale-readiness.json`.
- Markdown required-section check for
  `reports/inspection-standards/dutch-evidence-scale-readiness.md`.
- Diff review confirming no new evidence-pack files, generator
  implementation, package scripts, dashboard gates, quality-ref integration,
  Scale Gate integration, or lesson-target mutations were added.
- Forbidden-claim phrase scan for the readiness report and sprint closure
  records.

If generated indexes or dashboard records change, stage the INSPECT-8 sprint
and report files before regenerating so the new records are included.

## Stop Conditions

Stop and record the blocker if:

- planning review returns `REVISE`;
- the sibling lesson-evidence checkout at `../4veco-lessen` is absent and no
  explicit replacement evidence path is authorised;
- the sibling lesson-evidence checkout is dirty or cannot be treated as
  read-only evidence;
- the audit cannot cite concrete evidence for a readiness judgement;
- a recommendation would require strengthening an unreviewed claim;
- personal data appears or would be needed;
- OP0, SKA, assessment, accessibility, or support wording blurs into
  school-owned proof;
- the work requires a generator, package script, CI/build gate, dashboard
  gate, quality-ref integration, Scale Gate integration, or lesson-output
  mutation;
- the next scope cannot be recommended without hiding weak or missing
  evidence;
- non-Dutch standards work appears in scope.

## Omitted Work And Follow-Up

INSPECT-8 does not close evidence gaps. It names gaps and recommends whether
INSPECT-9 should design a correction plan before any additional evidence-pack
work.

INSPECT-8 does not implement the report-only generator, broaden evidence-pack
generation, or create teacher/school-facing summary surfaces. Those remain
later roadmap decisions after readiness evidence and required review gates.

## Required Next Action

Have a planning/review agent check this INSPECT-8 plan against the roadmap,
ledger, handoff, INSPECT-7 closure, Dutch evidence profile, required outputs,
audit dimensions, stop conditions, language hygiene, and validation plan.
Only after planning review passes may the main agent begin the Dutch Evidence
Scale Readiness audit.
