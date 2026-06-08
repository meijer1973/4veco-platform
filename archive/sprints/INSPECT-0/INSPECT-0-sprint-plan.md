# INSPECT-0 Sprint Plan - Source Register + Dutch Profile Design

Status: approved bounded research/data sprint
Date: 2026-06-08
Roadmap: `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
Branch: `codex/quality-standards-20260608`

## Review Basis

Human feedback gave the setup branch a PASS WITH MINOR FLAGS and authorised only
the next bounded work packet:

```text
INSPECT-0 Source Register + Dutch Profile Design
```

The same feedback explicitly did not authorise validators, country overlays
beyond source inventory, generated lesson changes, dashboard gates,
quality-ref integration, Scale Gate integration, teacher inspection packs, or
compliance claims.

## Scope

Authorised outputs:

```text
references/data/inspection-standards/source-register.json
references/data/inspection-standards/nl-vo-evidence-profile.v0.json
docs/inspection-standards/nl-vo-evidence-model.md
archive/sprints/INSPECT-0/INSPECT-0-validation-log.md
archive/sprints/INSPECT-0/INSPECT-0-closure-log.md
```

Process output added by repo operating rules:

```text
archive/sprints/INSPECT-0/INSPECT-0-sprint-plan.md
```

## Quality Floor

- Use official authority sources where possible.
- Distinguish inspection authority, curriculum authority, accountability, and
  non-inspection comparators.
- Keep Dutch VO inspection evidence as the hard baseline.
- Preserve exercise-first 4veco product logic.
- Keep all evidence profile language support-oriented, not compliance-claiming.
- Do not mutate generated student-facing lesson artifacts.

## Stop Conditions

- A required authority source cannot be verified from an official or primary
  source.
- The work would require validators, schemas, generated lesson changes, or
  quality-gate integration.
- A source implies local school implementation rather than textbook/product
  evidence and the boundary cannot be stated safely.
- The profile would need to claim legal compliance or inspection approval.

## Implementation Steps

1. Patch setup hygiene flags from review feedback.
2. Build `source-register.json` from official sources, with `retrieved_date`
   and explicit authority-boundary notes.
3. Draft `nl-vo-evidence-profile.v0.json` as an evidence-support model.
4. Draft `docs/inspection-standards/nl-vo-evidence-model.md`.
5. Add validation and closure logs.
6. Refresh repository maps/indexes.
7. Run JSON and roadmap/index validation.

## Out Of Scope

- Validators or schemas.
- Report/dashboard gates.
- Country overlays.
- Teacher inspection pack generator.
- Generated lesson-output changes.
- `quality-ref.yaml` integration.
- Scale Gate integration.
- Dutch, European, US, or international compliance claims.
