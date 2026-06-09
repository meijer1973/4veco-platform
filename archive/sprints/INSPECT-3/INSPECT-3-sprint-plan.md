# INSPECT-3 Sprint Plan

Status: closed
Date: 2026-06-08
Roadmap: `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
Ledger: `docs/roadmaps/quality-standards/sprint-ledger.md`
Branch: `codex/quality-standards-20260608`
Authorising review: `archive/sprints/INSPECT-3/INSPECT-3-human-authorization.md`

## Purpose

INSPECT-3 designs the first inspection-evidence schema as a report-only and
diagnostic object contract.

The sprint turns the accepted INSPECT-2A distinctions into schema structure:

- evidence state separate from evidence finality;
- target-equivalent proof status separate from target-exercise presence;
- source pointers with source-type distinctions;
- subject-material OP0 boundary;
- mandatory product/school boundary per category;
- diagnostic policy that blocks accidental gate semantics.

## Quality Floor

The schema must include this wording:

```text
This schema is report-only and diagnostic. It does not create a quality gate, compliance claim, or generated-output mutation path.
```

The sprint must not create a build-failing validator, generated evidence pack,
teacher inspection pack, dashboard gate, quality-ref integration, Scale Gate
integration, country overlay, generated lesson-output change, legal compliance
claim, inspectorate approval claim, or complete OP0/basic-skills claim.

## Pilot Scope

Design against Book 1 Chapter 1.1:

```text
1.1.1 Schaarste en economisch denken
1.1.2 Percentages en indexcijfers
1.1.3 Grafieken en tabellen
```

The schema must require title/source reconciliation.

## Allowed Outputs

```text
references/schemas/inspection-evidence.schema.json
docs/inspection-standards/report-only-schema-design.md
references/data/inspection-standards/schema-notes.md
archive/sprints/INSPECT-3/
generated indexes/reports when path references require refresh
```

## Operational Procedure

1. Record INSPECT-2A Head of Strategy review as PASS.
2. Create INSPECT-3 sprint plan and planning review.
3. Add the report-only schema.
4. Add schema design documentation and schema notes with pilot examples.
5. Update roadmap, ledger, profile metadata, evidence model, and data README so
   future agents see INSPECT-3 as report-only and diagnostic.
6. Refresh URL index, agent index, and dashboard reports if repository surfaces
   changed.
7. Run JSON/schema syntax checks, focused schema-structure checks, roadmap
   checks, URL-index checks, forbidden-scope checks, branch safety checks, and
   full platform validation.
8. Run lead-review round 1, correction pass, and lead-review round 2.
9. Close, commit, push, and report the next operational step.

## Acceptance Criteria

- INSPECT-2A is recorded as PASS.
- INSPECT-3 schema exists at
  `references/schemas/inspection-evidence.schema.json`.
- Schema is draft 2020-12 JSON Schema and parses as valid JSON.
- Schema includes report-only diagnostic policy constants.
- Schema separates `evidence_state` from `evidence_finality`.
- Schema requires product/school boundary fields per category record.
- Schema distinguishes source pointer types.
- Schema requires target-equivalent proof status for
  `assessment_and_closure`.
- Schema requires OP0 boundary fields for `basic_skills`.
- Schema notes include a pilot evidence-object example.
- No validator script or build gate is added.
- No generated lesson material is changed.
- Full platform validation passes.
- Lead review confirms no forbidden implementation occurred.

## Stop Conditions

Stop and report if:

- schema design requires build-failing validator behaviour;
- pilot examples would require generated lesson-output mutation;
- schema structure would require compliance or school-owned evidence claims;
- validation fails and cannot be repaired inside report-only scope;
- branch/worktree safety fails.

## Required Next Action

Create the diagnostic schema design packet and send it for human review. Do not
create validators or evidence packs in INSPECT-3.
