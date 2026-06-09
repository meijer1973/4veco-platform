# External Review, Privacy, And Claim Guardrails

Status: INSPECT-5R draft guardrail, mandatory before INSPECT-6/7
Date: 2026-06-09
Roadmap: `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
Sprint: `archive/sprints/INSPECT-5R/INSPECT-5R-sprint-plan.md`

## Purpose

This document makes the quality-standards review gate operational before any
report-only generator planning or evidence-pack prototype work starts.

It encodes the user-required external review team:

- teacher reviewer;
- legal/privacy reviewer;
- Dutch quality-inspection reviewer.

All three must return `MORE_THAN_SATISFIED` before INSPECT-6 or later
quality-standards work can be authorised. A `PASS` verdict is useful feedback
but is not enough to proceed.

This is not legal advice, a DPIA, a compliance certificate, or an
inspectorate-facing judgement. It is a product-governance guardrail for future
evidence reporting.

## External Source Anchors

Future INSPECT-6/7 packets must keep these official-source boundaries visible:

- Dutch Inspectorate OP0 framing:
  <https://www.onderwijsinspectie.nl/onderwerpen/onderzoekskader-2021-wat-is-er-veranderd/bijstelling-2025/info/op0>
- Autoriteit Persoonsgegevens accountability guidance:
  <https://autoriteitpersoonsgegevens.nl/themas/basis-avg/avg-algemeen/verantwoordingsplicht>
- Autoriteit Persoonsgegevens DPIA guidance:
  <https://autoriteitpersoonsgegevens.nl/themas/basis-avg/praktisch-avg/data-protection-impact-assessment-dpia>

OP0 is a school/department-level basic-skills standard. 4veco evidence may
only be described as subject-material support unless a later reviewed source
proves a narrower, stronger claim.

## Verdict Scale

| Verdict | Meaning | Roadmap effect |
|---|---|---|
| `REVISE` | Blocking issue or missing evidence. | Stop, implement corrections, re-review. |
| `PASS` | No blocker, but the reviewer is not yet more than satisfied. | Stop, improve or explicitly pause; do not proceed. |
| `MORE_THAN_SATISFIED` | Reviewer sees the packet as strong, safe, and operational for its scope. | Counts toward authorisation only if all three roles return this verdict. |

## Mandatory Stop Rule

Do not authorise INSPECT-6, INSPECT-7, generator planning, generated evidence
packs, teacher inspection packs, dashboard gates, quality-ref integration,
Scale Gate integration, lesson-output mutation, or public-facing claim changes
unless all are true:

1. the sprint plan exists and passed planning review;
2. the review packet passed lead review;
3. the reviewed commit is pushed to the remote branch;
4. the packet cites a passing `platform-ci / validate-platform` run for the
   reviewed commit, or records an explicit CI waiver;
5. teacher, legal/privacy, and Dutch quality-inspection reviewers each return
   `MORE_THAN_SATISFIED`;
6. all requested changes are mapped in a correction log and either implemented
   or explicitly rejected by the repository owner with rationale;
7. the repository owner accepts the gate and names the next authorised sprint.

If any reviewer returns `REVISE` or `PASS`, the gate remains closed.

## Review Packet Contract

Every INSPECT-5R/6/7 human or external-agent review packet must include:

- calibration checks that define the quality floor;
- planned review questions for each reviewer role;
- evidence links to source, product, review, validation, and roadmap artifacts;
- stop conditions;
- direct comment prompts the reviewer can answer on the packet;
- reviewed commit SHA;
- remote branch and push proof;
- validation commands and exit-code evidence;
- CI proof or explicit CI waiver;
- correction log pointer;
- required next action.

The packet must ask reviewers to judge the actual packet, not a paraphrased
status summary.

## Reviewer Responsibilities

| Role | Must judge | Must block when |
|---|---|---|
| Teacher reviewer | Teacher usefulness, plain-language output, classroom/school-leader readability, actionability, and whether weak evidence is visible. | A teacher cannot understand the pack in 5-10 minutes, or the pack hides what the school still has to supply. |
| Legal/privacy reviewer | Privacy boundary, AVG/GDPR risk posture, safe claims, forbidden paraphrases, and no legal/compliance overclaiming. | Personal data appears without a later privacy gate, or generated prose implies compliance, approval, certification, or school-obligation satisfaction. |
| Dutch quality-inspection reviewer | Dutch inspection terminology, OP0 boundary, product/school evidence boundary, and evidence finality. | OP0, OP1, OP2, OP3, OP6, SKA, or product/school evidence is misstated or overgeneralised. |

## Privacy And Data Boundary

Default allowed evidence for future packs:

- repository artifact paths;
- product artifact excerpts already present in the repository;
- review-record summaries;
- validation command results;
- source IDs and official URLs;
- evidence state, evidence strength, and known flags.

Forbidden by default:

- student names, initials, email addresses, identifiers, grades, answers,
  submissions, attendance, support files, accommodations, health data, care
  records, or behavioural records;
- identifiable teacher/person records unless the person is already an
  intentional public reviewer identity in the repository;
- identifiable school records beyond the repository/project identity;
- classroom photos, audio, video, screenshots with people, or other biometric
  or directly identifying material;
- retention of personal data inside generated evidence packs.

If future work encounters personal data, the evidence pack must omit it, record
a redaction flag, and stop. A later explicit privacy/DPIA/data-processing gate
is required before personal data can enter any generated evidence pack.

That later gate must name at least:

- processing purpose and lawful basis owner;
- data categories;
- controller/processor responsibility;
- retention policy;
- redaction/minimisation design;
- security controls;
- reviewer and privacy-owner approval;
- whether a DPIA is required and, if required, where the completed DPIA is
  recorded.

## Safe-Claim Contract

Future generated prose must use claim IDs or approved templates. Every claim
record must include:

```text
claim_id
exact_wording
inspection_category
evidence_citations
evidence_strength
product_school_boundary
forbidden_inference_check
review_round
```

Allowed claim templates:

| Claim ID | Template |
|---|---|
| `QS_PRODUCT_EVIDENCE_SUPPORT` | `4veco exposes product-side evidence that can support Dutch VO inspection preparation for this bounded scope.` |
| `QS_TEACHER_ORGANISATION_SUPPORT` | `This pack helps teachers and school leaders organise evidence and known gaps; it does not replace school-owned evidence.` |
| `QS_OP0_SUBJECT_MATERIAL_ONLY` | `The basic-skills evidence is subject-material evidence inside economics materials, not complete OP0 or school-wide basic-skills proof.` |
| `QS_AUTHORITY_BOUNDARY` | `Inspection judgement remains with the competent authority and school/provider; this pack is not an approval, certificate, or compliance statement.` |
| `QS_WEAK_EVIDENCE_VISIBLE` | `Weak or missing evidence is listed so the school and product team can decide the next responsible action.` |

Forbidden paraphrase families:

```text
compliant with Dutch inspection standards
approved by the Inspectorate
inspection-ready
certified
validated by the authority
complete OP0 evidence
complete basic-skills evidence
school obligations satisfied
PTA validity proven
summative assessment validity proven
classroom implementation proven
school SKA compliance
legal compliance
AVG/GDPR compliant
```

Exact forbidden phrase checks are not enough for generated prose. Future
INSPECT-6/7 plans must include reviewer-readable claim templates and a
semantic overclaiming check.

## INSPECT-6 Conditions

INSPECT-6 may be authorised only after INSPECT-5R passes this gate.

INSPECT-6 must remain planning-only. It may define a report-only generator
plan, structured inputs, evidence-source rules, stale-evidence handling,
teacher-facing output shape, safe-claim templates, validation strategy, and
stop conditions. It must not generate evidence packs.

## INSPECT-7 Conditions

INSPECT-7 may be authorised only after INSPECT-6 passes tri-agent review and
the repository owner explicitly authorises one bounded prototype.

INSPECT-7 must use one bounded Dutch VO generated-output slice. The current
candidate slice is Book 1, Chapter 1.1, but the accepted INSPECT-6 packet must
confirm the exact scope before any prototype is built.

Every INSPECT-7 claim must cite concrete product or review evidence. Planning
documents may explain context, but they cannot be the sole proof for a product
claim.

## Required Next Action

Use this guardrail in the INSPECT-5R review packet, then ask the teacher,
legal/privacy, and Dutch quality-inspection reviewers for direct
`MORE_THAN_SATISFIED` review before INSPECT-6 is authorised.
