# INSPECT-5R Sprint Plan

Status: planned
Date: 2026-06-09
Roadmap: `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
Ledger: `docs/roadmaps/quality-standards/sprint-ledger.md`
Branch: `codex/quality-standards-20260608`
Authorising input: user instruction to continue the quality-standards roadmap through `INSPECT-7` with teacher, legal, and quality-inspection external-agent review; initial tri-agent reviews returned `REVISE`.

## Purpose

INSPECT-5R is a pre-INSPECT-6 review-gate refinement sprint.

It records the new mandatory external review rule for the quality-standards
roadmap: teacher, legal, and Dutch quality-inspection reviewers must each reach
`MORE_THAN_SATISFIED` before the work may proceed into report-only generator
planning, evidence-pack prototyping, or later quality-standards expansion.

This sprint also adds the minimum privacy, evidence-citation, OP0, teacher-use,
and claim-safety guardrails that the three reviewers identified as blockers.

## Quality Floor

The sprint must make the next gate operational, not symbolic:

- tri-agent review roles are named and mandatory;
- the verdict scale and stop rules are explicit;
- a `PASS` verdict is not enough to move past the gate;
- every review round records comments, corrections, re-review status, commit
  SHA, validation proof, and remote-push status;
- future teacher-facing packs must be understandable to a Dutch vwo economics
  teacher or school leader in 5-10 minutes;
- future evidence-pack claims must cite concrete product or review evidence,
  not planning documents alone;
- future pack defaults exclude student-level personal data and identifiable
  school/person data unless a later privacy/DPIA/data-processing gate
  explicitly authorises them;
- OP0 language remains subject-material and does not imply complete OP0,
  school-wide basic-skills, or citizenship-curriculum proof;
- product evidence remains separate from school-owned implementation,
  assessment, support, governance, and inspection-judgement evidence.

## Allowed Outputs

```text
archive/sprints/INSPECT-5R/INSPECT-5R-sprint-plan.md
archive/sprints/INSPECT-5R/INSPECT-5R-planning-review.md
archive/sprints/INSPECT-5R/INSPECT-5R-external-review-intake.md
archive/sprints/INSPECT-5R/INSPECT-5R-correction-log.md
archive/sprints/INSPECT-5R/INSPECT-5R-review-packet.md
archive/sprints/INSPECT-5R/INSPECT-5R-validation-log.md
archive/sprints/INSPECT-5R/INSPECT-5R-lead-review-assignment.md
archive/sprints/INSPECT-5R/INSPECT-5R-lead-review-round1.md
archive/sprints/INSPECT-5R/INSPECT-5R-lead-review-round2.md
archive/sprints/INSPECT-5R/INSPECT-5R-closure-log.md
docs/inspection-standards/external-review-privacy-and-claim-guardrails.md
docs/inspection-standards/teacher-facing-evidence-pack-template.md
docs/inspection-standards/nl-vo-evidence-model.md
docs/roadmaps/quality-standards/inspection-standards-roadmap.md
docs/roadmaps/quality-standards/sprint-ledger.md
docs/roadmaps/roadmap-version-index.json when version metadata changes
generated maps/reports when roadmap, archive, or review-packet URLs require refresh
```

## Forbidden Work

Do not add:

```text
report-only generator implementation
generated inspection evidence pack
package.json script integration
CI or check:platform integration
dashboard gate
Scale Gate integration
quality-ref integration
teacher inspection pack generator
country overlay
generated lesson-output mutation
student-level personal-data processing
legal compliance claim
AVG/GDPR compliance claim
inspectorate approval claim
inspection-ready claim
certification claim
complete OP0/basic-skills claim
school-obligation-satisfied claim
PTA validity claim
summative assessment validity claim
classroom implementation claim
```

## Operational Procedure

1. Record the three initial external-agent reviews as `REVISE` intake evidence:
   teacher, legal, and Dutch quality-inspection.
2. Create this sprint plan before implementation and have a planning/review
   agent check that the scope, outputs, stop conditions, and forbidden work are
   complete.
3. Add a quality-standards-specific external review protocol with the
   `REVISE` / `PASS` / `MORE_THAN_SATISFIED` scale and mandatory stop rule.
4. Add legal/privacy guardrails for INSPECT-6/7: repo-artifact evidence by
   default, no personal data by default, DPIA/data-processing decision before
   any personal data enters generated evidence packs.
5. Add a safe-claim contract for future generated prose: approved claim
   templates or claim IDs, concrete evidence citations, product/school
   boundary notes, and explicit forbidden paraphrase families.
6. Add a teacher-facing evidence-pack template for future INSPECT-6/7 planning
   review, including Dutch inspection terms, a boundary table, weak/missing
   evidence sections, safe wording, and citation expectations.
7. Update stale documentation so the current recommended next step is
   INSPECT-5/5R review and possible INSPECT-6 authorisation, not INSPECT-4.
8. Update the roadmap and sprint ledger to insert INSPECT-5R before INSPECT-6
   and keep INSPECT-6/7 non-executable until tri-agent `MORE_THAN_SATISFIED`
   review and owner acceptance are recorded.
9. Create the INSPECT-5R review packet for the three external reviewers.
   The packet must include calibration checks, planned review questions,
   evidence links, stop conditions, and direct comment prompts for teacher,
   legal, and Dutch quality-inspection reviewers.
10. Validate documentation, JSON, URL/index freshness, branch/worktree safety,
    and the existing report-only validator fixtures.
11. Before sending the review packet, record the reviewed commit SHA, remote
    push proof, and either passing `platform-ci / validate-platform` status or
    an explicit CI waiver.
12. Run lead-review round 1, record correction log, apply required fixes, and
    run lead-review round 2.
13. Commit and push before asking the three external reviewers to re-review
    the packet. Do not close the gate as passed until all three return
    `MORE_THAN_SATISFIED`.

## Acceptance Criteria

- Initial teacher, legal, and Dutch quality-inspection `REVISE` findings are
  recorded and each required change is mapped to an implemented artifact.
- The sprint ledger contains an INSPECT-5R row and the quality-standards
  tri-agent review rule.
- The roadmap inserts INSPECT-5R before INSPECT-6 and does not authorise
  generator planning or evidence-pack prototyping by implication.
- `docs/inspection-standards/nl-vo-evidence-model.md` no longer points to
  INSPECT-4 as the recommended next step.
- Privacy/AVG wording is cautious: no personal-data processing by default and
  no legal compliance claim.
- The teacher-facing template includes OP1, OP2, OP3, OP6, OP0, and SKA terms
  with plain-language boundaries.
- Every future pack-output claim requirement includes concrete evidence
  citations and product/school boundary notes.
- The INSPECT-5R review packet includes calibration checks, planned review
  questions, evidence links, stop conditions, and direct comment prompts for
  teacher, legal, and Dutch quality-inspection reviewers.
- The packet records reviewed commit SHA, remote push proof, and either passing
  `platform-ci / validate-platform` status or an explicit CI waiver.
- No lesson output, generator, dashboard, quality-ref, Scale Gate, CI gate, or
  country-overlay integration is added.
- Validation and lead-review records exist before the packet is sent.

## Stop Conditions

Stop and report if:

- any reviewer requirement would force generator implementation or generated
  evidence-pack creation during INSPECT-5R;
- a privacy guardrail would require legal advice beyond a cautious no-personal-
  data default;
- teacher-facing usefulness cannot be described without making school-level or
  inspectorate claims;
- OP0 wording cannot be kept subject-material and bounded;
- branch/worktree safety fails;
- lesson-output mutation would be required;
- the three external reviewers cannot all reach `MORE_THAN_SATISFIED` after
  corrections.

## Required Next Action

Have a planning/review agent check this INSPECT-5R plan, then implement only
the authorised protocol, privacy, claim-safety, teacher-template, roadmap, and
ledger updates. After validation and lead review, push the packet and send it
to the teacher, legal, and Dutch quality-inspection reviewers for
`MORE_THAN_SATISFIED` re-review.
