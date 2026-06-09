# INSPECT-4 Human Authorization

Status: recorded
Date: 2026-06-08
Reviewer: Head of Strategy
Source: user-provided human review for INSPECT-3

## Decision

```text
pass_with_minor_guardrails
```

Head of Strategy accepted the INSPECT-3 report-only schema design and
authorised a later non-blocking validator-design sprint.

## Approved Next Action

```text
INSPECT-4 Report-Only Validator Design
```

## Minor Guardrails

```text
The validator may check schema conformance and known forbidden phrases, but it must not claim complete semantic detection of unsafe compliance claims.
If the validator supports both pilot and full-report modes, only full-report mode may require all eight category records.
Schema validity and evidence strength are separate. Weak evidence can be valid evidence.
```

## Approved Outputs

```text
build-scripts/inspection/validate-inspection-evidence.js
docs/inspection-standards/report-only-validator-design.md
references/data/inspection-standards/validator-notes.md
archive/sprints/INSPECT-4/
sample or fixture report-only evidence object, if needed
generated indexes/reports only if roadmap or sprint-packet URLs require refresh
```

## Not Authorised

```text
build-failing validator integration
required CI gate
generated evidence packs
teacher inspection packs
dashboard gates
quality-ref integration
Scale Gate integration
country overlays
generated lesson-output changes
legal compliance claims
inspectorate approval claims
complete OP0/basic-skills claims
```

## Required Next Action

Execute INSPECT-4 as a manual diagnostic validator-design sprint. Do not wire
the validator into CI, builds, dashboard gates, Scale Gate, quality-ref,
generated output, evidence-pack generation, or compliance claims.
