# INSPECT-7 Authorisation

Status: authorised for sprint planning and one bounded no-personal-data prototype
Date: 2026-06-09
Branch: `codex/quality-standards-20260608`
Authorising basis: persistent owner objective plus INSPECT-6 tri-agent
`MORE_THAN_SATISFIED` closure

## Authorising Evidence

The owner asked to continue the quality-standards roadmap through INSPECT-7,
adding extra steps where necessary and requiring teacher, legal/privacy, and
quality-inspection external-agent review until all three are more than
satisfied.

INSPECT-6 closed at commit `0c0fefe4015992526f554c9dff9e8fe4453493b6` with:

- lead review round 2 `PASS` and no blockers;
- teacher reviewer `MORE_THAN_SATISFIED`;
- legal/privacy reviewer `MORE_THAN_SATISFIED`;
- Dutch quality-inspection reviewer `MORE_THAN_SATISFIED`;
- explicit CI waiver because GitHub Actions returned no branch runs;
- no generator implementation, no evidence pack, no personal data, and no
  compliance/approval claim.

## Authorised Sprint

INSPECT-7 is authorised only as:

```text
Dutch Scoped Evidence-Pack Prototype
```

Bounded scope:

```text
Book 1 - Grondslagen, vraag en aanbod
Chapter 1.1 - Economisch denken en rekenen
Paragraphs:
- 1.1.1 Schaarste en economisch denken
- 1.1.2 Percentages en indexcijfers
- 1.1.3 Grafieken en tabellen
```

## Authorised Work

INSPECT-7 may create:

- a sprint plan and correction/review logs;
- a structured source object that follows the INSPECT-6 source contract;
- one archive-local bounded prototype assembler, if needed, that accepts only
  the named INSPECT-7 source object and writes only the named INSPECT-7 report
  files;
- one report-only Markdown evidence pack;
- one report-only JSON evidence pack;
- validation logs, lead-review artifacts, external tri-agent review results,
  closure logs, roadmap/ledger/profile metadata updates, and regenerated
  indexes/reports.

The prototype assembler, if added, is not a reusable generator. It must not be
wired into package scripts, CI, dashboards, quality-ref, Scale Gate, or lesson
production.

## Forbidden Work

INSPECT-7 must not add:

```text
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
school SKA compliance claim
```

INSPECT-7 must not edit the lesson repository. Evidence paths in
`../4veco-lessen/` are read-only citations.

## Review Gate

After implementation and lead review, INSPECT-7 must go to:

- teacher reviewer;
- legal/privacy reviewer;
- Dutch quality-inspection reviewer.

The sprint can close only if all three return:

```text
MORE_THAN_SATISFIED
```

Any `REVISE` or `PASS` blocks closure and requires correction, validation,
lead-review recheck, push, and re-review.

## Required Next Action

Create `archive/sprints/INSPECT-7/INSPECT-7-sprint-plan.md`, have it reviewed
before implementation, then build only the bounded prototype authorised here.
