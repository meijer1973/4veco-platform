# INSPECT-6 Authorisation

Status: authorised as planning-only
Date: 2026-06-09
Branch: `codex/quality-standards-20260608`

## Authorising Basis

The repository owner's active objective for this thread says to continue the
quality-standards roadmap until `INSPECT-7`, adding extra steps where needed,
and to use teacher, legal, and quality-inspection external-agent review
wherever human review is required.

INSPECT-5R was inserted as the required extra step before INSPECT-6. It closed
with teacher, legal/privacy, and Dutch quality-inspection reviewers each
returning `MORE_THAN_SATISFIED`.

Evidence:

```text
archive/sprints/INSPECT-5R/INSPECT-5R-external-review-results.md
archive/sprints/INSPECT-5R/INSPECT-5R-closure-log.md
docs/roadmaps/quality-standards/sprint-ledger.md
```

## Authorised Scope

INSPECT-6 is authorised only as:

```text
Report-Only Generator Planning
```

It may define:

- report-only generator purpose and architecture;
- structured source contract;
- evidence-source rules;
- stale-evidence handling;
- teacher-facing output shape;
- safe-claim and forbidden-claim contract;
- semantic overclaiming review requirement;
- validation strategy;
- stop conditions;
- INSPECT-7 prototype readiness criteria.

## Not Authorised

INSPECT-6 must not add:

```text
report-only generator implementation
generated evidence pack
teacher inspection pack generator
package.json script integration
CI or check:platform integration
dashboard gate
Scale Gate integration
quality-ref integration
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

## Required Next Action

Create the INSPECT-6 sprint plan, send it through planning review, implement
the planning documents only, validate, lead-review, and send the packet to the
teacher, legal/privacy, and Dutch quality-inspection reviewers. Do not start
INSPECT-7 unless all three return `MORE_THAN_SATISFIED` and the owner
authorises one bounded prototype.
