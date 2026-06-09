# Evidence Pack Validation And Dispatch Plan

Status: INSPECT-6 planning-only validation and dispatch plan
Date: 2026-06-09

## Purpose

This document defines how a future evidence-pack generator plan and prototype
should be validated and reviewed.

It is not a generator, validator implementation, or evidence pack.

## Official Boundary Anchors

INSPECT-6 and future INSPECT-7 review packets must cite:

- Inspectie OP0 Basisvaardigheden:
  <https://www.onderwijsinspectie.nl/onderwerpen/onderzoekskader-2021-wat-is-er-veranderd/bijstelling-2025/info/op0>
- Inspectie bijgestelde onderzoekskaders 2025:
  <https://www.onderwijsinspectie.nl/onderwerpen/onderzoekskader-2021-wat-is-er-veranderd/bijstelling-2025>
- Autoriteit Persoonsgegevens verantwoordingsplicht:
  <https://autoriteitpersoonsgegevens.nl/themas/basis-avg/avg-algemeen/verantwoordingsplicht>
- Autoriteit Persoonsgegevens DPIA:
  <https://autoriteitpersoonsgegevens.nl/themas/basis-avg/praktisch-avg/data-protection-impact-assessment-dpia>

These anchors define boundaries. They do not prove compliance, inspection
approval, or legal advice.

## Future Validation Layers

| Layer | Purpose | Blocking in INSPECT-6? |
|---|---|---|
| Source-contract parse | Verify structured source object can be parsed. | planning only |
| Evidence citation check | Verify every claim points to concrete evidence. | planning only |
| Boundary check | Verify product/school and OP0 boundaries exist per category. | planning only |
| Privacy check | Verify personal data is absent by default. | planning only |
| Claim-template check | Verify claim IDs and exact wording are approved. | planning only |
| Known forbidden phrase check | Catch known unsafe phrases. | planning only |
| Semantic overclaiming review | External reviewers judge paraphrases and implied claims. | required review |
| Teacher first-screen review | Teacher reviewer checks 5-10 minute usability. | required review |

INSPECT-6 plans these layers. It does not implement them.

## Review Packet Contract

Every INSPECT-6/7 review packet must include:

```text
calibration checks
role-specific review questions
evidence links
official boundary anchors
stop conditions
direct comment prompts
final pushed commit
remote push status
validation proof
CI proof or explicit CI waiver
correction-log pointer
lead-review round-2 pointer
required next action
```

## External Reviewer Questions

Teacher reviewer:

```text
Can a Dutch vwo economics teacher or school leader understand the planned
future output in 5-10 minutes, including what evidence exists, what is weak,
what the school must still supply, and what action is recommended?
```

Legal/privacy reviewer:

```text
Does the plan prevent personal-data processing by default, require a later
privacy/DPIA/data-processing gate when needed, and block legal/compliance,
approval, certification, inspection-ready, PTA, summative, and
school-obligation overclaims?
```

Dutch quality-inspection reviewer:

```text
Does the plan keep OP0 subject-material, preserve OP1/OP2/OP3/OP6/OP0/SKA
boundaries, and keep product evidence separate from school-owned evidence and
competent-authority judgement?
```

## Dispatch Metadata

Before external review, record:

```text
final_reviewed_commit_sha
remote_branch
remote_push_status
platform_ci_validate_platform_status_or_waiver
local_validation_log
lead_review_round2
correction_log
```

If GitHub Actions has no run for the branch, record an explicit CI waiver and
cite local validation evidence. Do not imply a CI pass when no run exists.

## INSPECT-7 Readiness Checklist

INSPECT-7 may start only when all are true:

- INSPECT-6 planning packet exists and is pushed;
- lead-review round 2 has no blockers;
- teacher reviewer returns `MORE_THAN_SATISFIED`;
- legal/privacy reviewer returns `MORE_THAN_SATISFIED`;
- Dutch quality-inspection reviewer returns `MORE_THAN_SATISFIED`;
- correction log maps every reviewer request;
- owner explicitly authorises one bounded prototype;
- prototype scope is named;
- no personal data is required;
- no generator/package/CI/dashboard/quality-ref/Scale Gate integration is
  implied beyond the prototype.

## Stop Conditions

Stop if:

- a reviewer returns `REVISE` or `PASS`;
- the future generator would need personal data;
- a teacher-readable output cannot be planned without overclaiming;
- a product claim lacks concrete evidence citations;
- OP0 or SKA boundaries blur into school-owned proof;
- INSPECT-7 scope is unbounded;
- CI proof/waiver or remote-push proof is missing.

## Required Next Action

Use this dispatch plan in the INSPECT-6 planning packet and lead-review cycle.
Do not start INSPECT-7 until all INSPECT-7 readiness checklist items are
satisfied.
