# INSPECT-10A Dutch Diagnostic Report Generator Implementation Plan

Status: implementation-plan packet
Date: 2026-06-15
Sprint: `INSPECT-10A`

## Baselines

- Product end-state:
  `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- Operational product end-state:
  `../4veco-lessen/specifications/product-end-state.md`
- Strategic product vision:
  `../4veco-lessen/specifications/product-vision.md`
- Original sprint specification:
  `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
  section `INSPECT-10 - Dutch Report-Only Generator First Implementation`
- Accepted diagnostic-planning packet:
  `reports/inspection-standards/dutch-report-only-generator-diagnostic-planning.md`
- INSPECT-10R gate result:
  `archive/sprints/INSPECT-10/INSPECT-10R-three-reviewer-gate-results.md`
- Current controlling authority:
  `reports/inspection-standards/chapter-1-2-proof-support-remediation.md`
  section `INSPECT-10 Posture`
- Sprint plan:
  `archive/sprints/INSPECT-10A/INSPECT-10A-sprint-plan.md`
- REV-STD-1 disposition:
  `reports/sprints/REV-STD-1-flag-disposition.md`

## Safe-Use Note

This is a Dutch-only product-side implementation-plan packet. It is not a
generator implementation, generated diagnostic report, evidence pack,
teacher/school-facing evidence pack, public-facing or external-facing
generated report/output/sharing, inspection judgement, legal compliance claim,
approval, certificate, OP0 completion claim, school-obligation claim,
PTA-validity claim, summative-validity claim, classroom-implementation proof,
school-SKA claim, dashboard gate, quality-ref integration, Scale Gate
integration, product-route adoption gate, diagnostics/mastery/PV gate, or
student/product-use authority.

No personal data is used. No generated lesson output is changed. No
public-facing or external-facing generated diagnostic output, report, or
sharing is authorised without a later human review gate.

## Non-Negotiable Requirements

- Dutch scope only.
- Implementation-plan packet only.
- No generator implementation in INSPECT-10A.
- No generated diagnostic report in INSPECT-10A.
- No evidence-pack generation.
- No teacher/school-facing evidence-pack generation.
- No public-facing or external-facing generated output, report, or sharing
  without a later human review gate.
- No generated lesson-output mutation in `../4veco-lessen`.
- No source-registry mutation.
- No `references/machine/` or `references/external/` mutation.
- No package script, CI/build gate, dashboard gate, quality-ref integration, or
  Scale Gate integration.
- No product-route adoption, diagnostics, mastery/sequencing, PV, or
  student/product-use authority.
- No personal-data processing.
- No compliance, approval, inspection-ready, complete OP0, PTA-validity,
  summative-validity, classroom-implementation, school-obligation, or
  school-SKA claim.
- PASS WITH FLAGS may not carry a missing core requirement.

## Executive Decision

INSPECT-10A does not implement the generator.

The future internal diagnostic generator is implementation-reviewable only if
human review accepts this packet's exact source allowlist, exact output
allowlist, refusal contract, and blocker-visible output shape. The generator
must be a manually invoked internal report generator, not a package script, CI
gate, dashboard gate, quality-ref integration, Scale Gate integration,
teacher/school-facing pack generator, public/external report surface, or
lesson-output mutation path.

More remediation is still required before pack-strength Chapter 1.2 evidence
packs, teacher/school-facing evidence-pack work, public/external generated
reports, product-route adoption, diagnostics/mastery/PV, Scale Gate use, or
student/product-use work can proceed.

## Core-Requirement Checklist

| Core requirement | Status | Evidence |
|---|---|---|
| Product end-state cited | met | Baselines cites Dutch quality-control end state, operational product end state, and product vision |
| Original INSPECT-10 spec cited | met | Baselines cites original implementation row |
| INSPECT-10R gate result cited | met | Baselines cites three-reviewer gate result |
| Current authority limit cited | met | Baselines cites INSPECT-9C/INSPECT-10 posture |
| Non-negotiables named | met | Non-Negotiable Requirements section |
| No generator implementation | met | Safe-use note and decision state this packet is planning only |
| No generated diagnostic report | met | Safe-use note and validation boundary |
| Exact future source files named | met | Future Source-File Allowlist |
| Exact future output files named | met | Future Output-File Allowlist |
| Refusal/stop conditions defined | met | Refusal And Stop Conditions |
| Blocker-visible output contract defined | met | Output Contract For A Later Internal Generator |
| Static sample output shape included | met | Static Sample Diagnostic Output Shape |
| REV-STD-1 carry fields present | met | Finding Classification and Blocker-Carry Ledger |
| PASS WITH FLAGS rule preserved | met | Missing implementation and pack-strength requirements remain blockers, not flags |

## Future Source-File Allowlist

A later implementation sprint may propose a generator that reads only the
following exact files. Directory scans, globbed fallback inputs, generated
lesson-output reads, protected reference reads, and source substitution are
not authorised by this packet.

| Source file | Use allowed in later generator | Boundary |
|---|---|---|
| `reports/inspection-standards/dutch-report-only-generator-diagnostic-planning.json` | Canonical INSPECT-10 diagnostic status vocabulary, input eligibility, and blocker carry ledger | Planning authority only; not evidence-pack authority |
| `reports/inspection-standards/dutch-report-only-generator-diagnostic-planning.md` | Human-readable INSPECT-10 safe-use and review context | Context only; JSON remains canonical for structured fields |
| `archive/sprints/INSPECT-10/INSPECT-10R-three-reviewer-gate-results.md` | Confirms INSPECT-10R reviewer result and public/external correction | Does not authorise implementation by itself |
| `reports/inspection-standards/chapter-1-2-proof-support-remediation.json` | Canonical Chapter 1.2 route-local proof and active blockers | Diagnostic only; no pack-strength inference |
| `reports/inspection-standards/chapter-1-2-proof-support-remediation.md` | Human-readable proof/support context | Context only; no hidden blocker resolution |
| `reports/inspection-standards/chapter-1-2-target-equivalent-accessibility-support-review.json` | Accessibility/support and target-equivalent review inputs from INSPECT-9B | Diagnostic only; weak evidence remains visible |
| `reports/inspection-standards/chapter-1-2-target-equivalent-accessibility-support-review.md` | Human-readable INSPECT-9B context | Context only |
| `reports/inspection-standards/chapter-1-2-target-exam-linkage-remediation.json` | Chapter 1.2 target/exam-linkage source-remediation status from INSPECT-9A | Diagnostic only; no source-registry mutation |
| `reports/inspection-standards/chapter-1-2-target-exam-linkage-remediation.md` | Human-readable INSPECT-9A context | Context only |
| `reports/inspection-standards/dutch-evidence-scale-readiness.json` | INSPECT-8 readiness baseline and conservative next-scope context | Context only |
| `reports/inspection-standards/dutch-evidence-gap-closure-plan.json` | INSPECT-9 gap categories and proof requirements | Context only |
| `reports/inspection-standards/inspect-7-book-1-1-evidence-pack.json` | Historical bounded Chapter 1.1 control sample | Historical control only; no broad generator authority |
| `docs/roadmaps/quality-standards/quality-standards-end-state.md` | Safe/forbidden end-state claims | Claim boundary only |
| `../4veco-lessen/specifications/product-end-state.md` | Operational product boundary reference | Read-only specification; no lesson-output read |
| `../4veco-lessen/specifications/product-vision.md` | Strategic product boundary reference | Read-only specification; no lesson-output read |
| `docs/inspection-standards/report-only-generator-plan.md` | Prior generator planning constraints | Design context only |
| `docs/inspection-standards/evidence-pack-source-contract.md` | Prior source-contract guardrails | Design context only; not evidence-pack permission |
| `docs/inspection-standards/report-only-validator-design.md` | Prior report-only validation guardrails | Design context only |

Hard rule: if a later implementation needs any source outside this table, it
must stop and request a new human-reviewed plan update before reading it.

## Future Output-File Allowlist

A later implementation sprint may propose writing only these exact files. This
is a future implementation allowlist, not authority for INSPECT-10A to create
them.

| Future output file | Allowed purpose | Boundary |
|---|---|---|
| `archive/sprints/INSPECT-10B/INSPECT-10B-sprint-plan.md` | Later implementation sprint plan | Must cite this packet and preserve all blockers |
| `archive/sprints/INSPECT-10B/INSPECT-10B-planning-review.md` | Later planning review | Must verify no missing core requirement is carried as PASS WITH FLAGS |
| `archive/sprints/INSPECT-10B/INSPECT-10B-validation-log.md` | Later validation evidence | Must prove no forbidden surfaces changed |
| `archive/sprints/INSPECT-10B/INSPECT-10B-lead-review-assignment.md` | Later lead-review assignment | Must route source/output/refusal checks |
| `archive/sprints/INSPECT-10B/INSPECT-10B-lead-review-round1.md` | Later lead-review verdict | Must classify findings with REV-STD-1 fields |
| `archive/sprints/INSPECT-10B/INSPECT-10B-closure-log.md` | Later closure log | Must keep closure to internal diagnostic output only |
| `build-scripts/inspection/build-dutch-diagnostic-report.js` | Manually invoked internal diagnostic generator | No package script, CI/build gate, dashboard gate, quality-ref, Scale Gate, lesson output, public/external output, or teacher/school-facing pack integration |
| `reports/inspection-standards/chapter-1-2-diagnostic-report.md` | Internal generated diagnostic report for Chapter 1.2 | Must visibly display blockers and safe-use boundaries |
| `reports/inspection-standards/chapter-1-2-diagnostic-report.json` | Machine-readable internal diagnostic report for Chapter 1.2 | Must include the same blocker and refusal fields as Markdown |
| `docs/roadmaps/quality-standards/inspection-standards-roadmap.md` | Later roadmap status update | Must not mark pack-strength or teacher/school-facing work ready |
| `docs/roadmaps/quality-standards/sprint-ledger.md` | Later ledger status update | Must record implementation boundaries and validation |
| `docs/roadmaps/quality-standards/quality-standards-end-state.md` | Later open-question/status note | Must preserve safe/forbidden claims |
| `docs/roadmaps/roadmap-version-index.md` | Later version index update if roadmap version changes | Must preserve downstream gate blocks |
| `docs/roadmaps/roadmap-version-index.json` | Later canonical version index update if roadmap version changes | Must preserve downstream gate blocks |

Forbidden future outputs unless a later human review explicitly changes
authority:

- `reports/inspection-standards/*evidence-pack.*`;
- public-facing or external-facing report/share files;
- teacher/school-facing evidence-pack files;
- package scripts or CI/build workflows;
- dashboard gate integrations;
- quality-ref or Scale Gate integration files;
- generated lesson output in `../4veco-lessen`;
- `references/machine/`, `references/external/`, or source-registry mutation.

## Output Contract For A Later Internal Generator

Every generated diagnostic section must show these fields in visible Markdown
and in JSON:

```text
scope
source_files_used
evidence_status
4veco_product_evidence
weak_or_missing_evidence
blockers
school_owned_evidence_still_needed
forbidden_inference
public_external_sharing_status
owner_next_action
proof_required_to_close
refusal_status
```

Every claim-like sentence must cite at least one exact source path from the
source allowlist. Planning documents may explain context, but a future
generated diagnostic claim may not cite planning context as its only evidence.

The generator must not infer strength from file presence. It must derive each
status from explicit source fields or stop with a refusal code.

The Markdown output must show blockers near the relevant evidence line, not
only in a footnote, appendix, or JSON field.

## Refusal And Stop Conditions

| Code | Trigger | Required response | Owner next action | Proof required to close |
|---|---|---|---|---|
| `STOP_SOURCE_ALLOWLIST_MISMATCH` | Requested input is not in the source-file allowlist | Abort without reading the file | Open a reviewed plan update | Human-reviewed allowlist update |
| `STOP_OUTPUT_ALLOWLIST_MISMATCH` | Requested output is not in the output-file allowlist | Abort before writing | Open a reviewed plan update | Human-reviewed output expansion |
| `STOP_MISSING_SOURCE` | Required allowlisted source is absent or unparsable | Abort and report missing source in validation log | Restore source or update plan | Successful parse and validation |
| `STOP_HIDDEN_BLOCKER` | A blocker source exists but generated output would omit it or downgrade it to a flag | Abort generation | Fix generator mapping or source data | Lead review confirms blocker is visible |
| `STOP_PACK_STRENGTH_REQUEST` | Request asks for evidence-pack, pack-ready, teacher/school-facing, PTA, summative, compliance, OP0, school-obligation, or school-SKA output | Refuse request | Route to later evidence-pack/remediation review | Explicit human review unlocking that surface |
| `STOP_PUBLIC_EXTERNAL_REQUEST` | Request asks for public-facing or external-facing generated output/report/sharing | Refuse request | Route to later public/external human review gate | Three-reviewer acceptance explicitly naming the surface |
| `STOP_PERSONAL_DATA` | Input or request includes student-level or identifiable personal data | Refuse request and do not persist data | Route to privacy/DPIA/data-processing gate | Privacy gate approval and revised plan |
| `STOP_DOWNSTREAM_GATE_AUTHORITY` | Request implies Scale Gate, product-route, diagnostics/mastery/PV, or student/product-use authority | Refuse request | Route to the relevant downstream gate | Renewed human review closing that gate |
| `STOP_LESSON_OUTPUT_OR_PROTECTED_REFERENCE` | Request would read/write generated lesson output or protected reference surfaces | Refuse request | Route to separate generated-output or reference mutation sprint | Fresh authorised plan and validators |
| `STOP_UNCITED_CLAIM` | Output would contain a claim-like sentence without an exact source citation | Abort generation | Add source mapping or remove claim | Validation proves all claims are cited |

## Static Sample Diagnostic Output Shape

This static sample is not generated evidence. It exists only to show the
shape a later internal diagnostic report must use.

```json
{
  "scope": "Book 1 Chapter 1.2",
  "source_files_used": [
    "reports/inspection-standards/chapter-1-2-proof-support-remediation.json",
    "reports/inspection-standards/dutch-report-only-generator-diagnostic-planning.json"
  ],
  "evidence_status": "diagnostic_candidate_with_blocker",
  "4veco_product_evidence": [
    {
      "target": "1.2.2",
      "status": "diagnostic_candidate_with_blocker",
      "source": "reports/inspection-standards/chapter-1-2-proof-support-remediation.json"
    }
  ],
  "weak_or_missing_evidence": [
    "Chapter 1.2 accessibility/support evidence remains below pack-strength."
  ],
  "blockers": [
    "1.2.2 generated-output substitute-mechanism wording remains active.",
    "1.2.4 frozen-yoghurt and orphaned-asset blockers remain active.",
    "Check-surface gate authority remains outside this surface."
  ],
  "school_owned_evidence_still_needed": [
    "School implementation, support/care practice, PTA/summative use, and final inspection conversation remain school/provider-owned."
  ],
  "forbidden_inference": [
    "Do not infer compliance, approval, complete OP0, inspection readiness, pack-strength Chapter 1.2 evidence, diagnostics/mastery/PV, Scale Gate readiness, product-route adoption, or student/product-use authority."
  ],
  "public_external_sharing_status": "not_authorized_without_later_human_review",
  "owner_next_action": "Human review this implementation plan before INSPECT-10B implementation.",
  "proof_required_to_close": "Three-reviewer acceptance of INSPECT-10A, then INSPECT-10B implementation validation and lead review.",
  "refusal_status": "none_for_this_static_sample"
}
```

## Implementation Safety Decision

Implementation is not safe in INSPECT-10A.

A later INSPECT-10B internal diagnostic generator implementation is
reviewable, not automatically authorised, if all of these remain true:

- the three-reviewer gate accepts INSPECT-10A with
  `MORE_THAN_SATISFIED` from teacher, legal/privacy, and Dutch
  quality-inspection reviewers;
- implementation reads only the exact source allowlist;
- implementation writes only the exact output allowlist;
- generated output remains internal and diagnostic;
- blockers appear in visible Markdown and JSON;
- public/external, teacher/school-facing, pack-strength, downstream gate, and
  student/product-use surfaces remain refused;
- validation proves no lesson-output, protected-reference, package/CI,
  dashboard-gate, quality-ref, or Scale Gate mutation.

More remediation is still required before the original INSPECT-10 evidence-pack
implementation can proceed.

## Finding Classification

| Finding | Classification | Blocks | Does not block | Proof required to close |
|---|---|---|---|---|
| INSPECT-10A is an implementation-plan packet only. | `core_requirement_met` | Generator implementation, generated diagnostic output, evidence-pack generation, and teacher/school-facing or public/external output in this sprint | Creating the implementation-plan report and sending it for review | Validation and lead review confirm no generator code or generated diagnostic report was created |
| Source-file allowlist is exact and narrow. | `core_requirement_met` | Broad lesson-output reads, protected-reference reads, globbed source discovery, and source substitution | Later human review of a narrow internal generator proposal | Future implementation must abort on any source outside the allowlist |
| Output-file allowlist is exact and narrow. | `core_requirement_met` | Package/CI/dashboard/quality-ref/Scale Gate integration, teacher/school-facing pack output, public/external output, evidence-pack output, and lesson-output mutation | Later human review of an internal diagnostic generator proposal | Future implementation must abort on any output outside the allowlist |
| Original INSPECT-10 first implementation remains blocked. | `scale_blocker` | Evidence-pack generation, teacher/school-facing pack work, package/CI/dashboard/quality-ref/Scale Gate integration, and pack-strength Chapter 1.2 generator posture | INSPECT-10A implementation planning and possible later internal diagnostic-generator implementation after review | More remediation or a later human-reviewed implementation packet explicitly authorising those surfaces |
| `1.2.2` carries a generated-output substitute-mechanism blocker. | `scale_blocker` | Clean `1.2.2` proof closure, pack-strength reliance, and generated wording that hides the blocker | Internal diagnostic reporting that shows the blocker visibly | Corrected generated output or reviewed waiver/carry decision naming opgave 10b and allowed substitute-attractiveness wording |
| `1.2.4` carries frozen-yoghurt and orphaned-asset blockers. | `scale_blocker` | Clean integrated proof closure, pack-strength reliance, asset-cleanliness claims, and generated wording that hides the blockers | Internal diagnostic reporting that shows the blockers visibly | Corrected generated output or reviewed waiver/carry decision, plus corrected asset set or reviewed harmlessness decision |
| Chapter 1.2 accessibility/support evidence remains below pack-strength. | `scale_blocker` | Accessibility/support strength claims, teacher/school-facing pack reliance, and pack-strength generator posture | Internal diagnostic reporting with gaps visible | Reviewed accessibility/support proof packets or explicit not-required decisions |
| Check-surface gate authority remains outside INSPECT-10A. | `scale_blocker` | Scale Gate 1, product-route adoption, diagnostics/mastery/PV, and student/product-use work | Ordinary scoped diagnostic planning that does not reinterpret check-surface gate authority | Renewed human review confirming check-surface gate closure and explicitly naming any authority unlocked |
| Public/external-facing generated output remains blocked. | `scale_blocker` | Public-facing or external-facing generated diagnostic output, reports, or sharing | Internal diagnostic implementation planning and internal diagnostic output after review | Later human review gate explicitly authorising public/external output or sharing |

## Blocker-Carry Ledger

| ID | Owner surface | Blocks | Does not block | Proof required to close |
|---|---|---|---|---|
| `INSPECT10A-IMPLEMENTATION-NOT-AUTHORIZED` | INSPECT-10A scope | Generator code and generated diagnostic output in this sprint | Implementation-plan packet | INSPECT-10A validation and lead review showing no generator/report output |
| `INSPECT10A-SOURCE-ALLOWLIST` | Future generator input contract | Reading non-allowlisted files, generated lesson output, protected references, or substituted sources | Human review of exact source allowlist | Human-approved plan update or future implementation validation |
| `INSPECT10A-OUTPUT-ALLOWLIST` | Future generator output contract | Writing non-allowlisted files, package/CI/dashboard/quality-ref/Scale Gate integrations, lesson output, evidence packs, teacher/school-facing packs, public/external reports | Human review of exact output allowlist | Human-approved plan update or future implementation validation |
| `INSPECT10A-122-SUBSTITUTE` | `1.2.2` generated output | Clean proof closure and pack-strength reliance | Blocker-visible internal diagnostic reporting | Corrected output or reviewed carry/waiver |
| `INSPECT10A-124-FROZEN-YOGHURT` | `1.2.4` generated output | Clean integrated proof closure and pack-strength reliance | Blocker-visible internal diagnostic reporting | Corrected output or reviewed carry/waiver |
| `INSPECT10A-124-ASSET` | `1.2.4` asset set | Clean asset-strength/accessibility reliance | Route-local diagnostic candidate | Corrected asset set or reviewed harmlessness decision |
| `INSPECT10A-ACCESSIBILITY` | Chapter 1.2 accessibility evidence | Accessibility-strength and teacher/school-facing pack claims | Internal diagnostic reporting with gaps visible | Reviewed accessibility packet |
| `INSPECT10A-SUPPORT` | Chapter 1.2 support/advisory evidence | Support-strength, companion/advisory, next-action, and pack-ready claims | Internal diagnostic reporting with gaps visible | Reviewed support packet |
| `INSPECT10A-CHECK-SURFACE-AUTHORITY` | Downstream check-surface/product-proof gates | Scale Gate 1, product-route adoption, diagnostics/mastery/PV, student/product-use authority | INSPECT-10A implementation planning | Renewed human review closing check-surface gate authority |
| `INSPECT10A-PUBLIC-EXTERNAL` | Public/external output authority | Public-facing or external-facing generated output, reports, or sharing | Internal diagnostic implementation planning | Later human review gate explicitly authorising public/external output |

## Human Review Questions

The human review should decide:

1. Is the future source-file allowlist complete enough for a narrow internal
   Chapter 1.2 diagnostic generator?
2. Is the future output-file allowlist narrow enough to prevent accidental
   evidence-pack, public/external, teacher/school-facing, dashboard, quality-
   ref, Scale Gate, lesson-output, or product-use expansion?
3. Are the refusal and stop conditions strict enough to prevent hidden
   blockers and unsafe authority jumps?
4. Does the static sample output shape keep blockers, school-owned evidence,
   public/external sharing status, and forbidden inferences visible enough?
5. Should the next sprint be `INSPECT-10B` internal diagnostic generator
   implementation, more Chapter 1.2 remediation, or a revised implementation
   plan?

## Validation Boundary

INSPECT-10A creates no generator code, no generated diagnostic report, no
evidence pack, no teacher/school-facing pack, no package script, no CI/build
gate, no dashboard gate, no quality-ref integration, no Scale Gate
integration, no source-registry mutation, and no generated lesson-output
mutation. It also creates no public-facing or external-facing generated
output, report, or sharing.

No personal data is processed. No non-Dutch standards work is started.

## Next Action

Send this INSPECT-10A implementation-plan packet for human review. If teacher,
legal/privacy, and Dutch quality-inspection reviewers all return
`MORE_THAN_SATISFIED`, the next work may be `INSPECT-10B`, a narrow internal
diagnostic generator implementation sprint that follows this exact allowlist
and refusal contract. Do not start pack-strength Chapter 1.2 evidence-pack
generation, teacher/school-facing pack work, public/external-facing generated
report sharing, Scale Gate work, product-route adoption, diagnostics/mastery/
PV, or student/product-use work from this packet alone.
