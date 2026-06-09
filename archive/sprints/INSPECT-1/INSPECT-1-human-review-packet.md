# INSPECT-1 Human Review Packet

Status: ready for human review
Date: 2026-06-08
Roadmap: `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
Sprint plan: `archive/sprints/INSPECT-1/INSPECT-1-sprint-plan.md`

## Review Target

Review these INSPECT-0 draft artifacts:

- `references/data/inspection-standards/source-register.json`
- `references/data/inspection-standards/nl-vo-evidence-profile.v0.json`
- `docs/inspection-standards/nl-vo-evidence-model.md`

## Current Baseline

The source register is a draft inventory with 23 sources across these
jurisdictions:

- Netherlands
- Belgium/Flanders
- England
- Germany
- France
- Italy
- Spain
- Poland
- United States

The Dutch VO profile is a draft profile for `vwo economie` with eight
categories:

- `curriculum_offer`
- `basic_skills`
- `didactic_quality`
- `student_development_and_support`
- `assessment_and_closure`
- `accessibility_and_inclusion`
- `quality_assurance`
- `improvement_cycle`

## Boundary Reminder

The human review decides whether the source register and Dutch profile are
acceptable as evidence-supporting drafts, need correction, or should be held.

The review does not approve:

- legal compliance claims;
- inspectorate approval claims;
- new MTUs, target exercises, or generated student-facing content;
- country overlays;
- schemas or validators;
- dashboard gates;
- quality-ref integration;
- Scale Gate integration.

## Review Questions

### 1. Source Register Authority Boundary

Does the source register sufficiently distinguish inspection frameworks,
curriculum/standards sources, accountability/evaluation sources, and
non-inspection comparators?

Answer:

```text
pass / pass_with_corrections / hold
```

Notes:

```text

```

### 2. Dutch Source Basis

Are the three Dutch sources enough for a v0 Dutch VO evidence-supporting
profile?

- `nl-inspectie-onderzoekskader-vo-2025`
- `nl-inspectie-op0-basisvaardigheden-2025`
- `nl-inspectie-bijgestelde-onderzoekskaders-2025`

Answer:

```text
pass / add_sources / hold
```

Sources or corrections requested:

```text

```

### 3. Evidence Categories

Are the eight Dutch profile categories the right v0 categories?

Answer:

```text
pass / revise_categories / hold
```

Requested category changes:

```text

```

### 4. OP0 Basic-Skills Interpretation

Is the OP0/basic-skills interpretation cautious enough? In particular, does it
avoid overstating economics calculation, language reasoning, graph/table/source
reading, or citizenship contexts as complete school-wide basic-skills evidence?

Answer:

```text
pass / needs_more_caution / hold
```

Required wording or evidence changes:

```text

```

### 5. Product Evidence Versus School Evidence

Does the profile clearly distinguish evidence 4veco can expose from evidence
the school/provider owns?

Answer:

```text
pass / needs_clearer_boundary / hold
```

Required boundary changes:

```text

```

### 6. Safe And Forbidden Claims

Are the safe and forbidden claims acceptable?

Safe claims currently include:

- 4veco is designed to support Dutch inspection-relevant evidence.
- 4veco exposes evidence that helps schools demonstrate curriculum coherence,
  didactic quality, assessment alignment, student support, accessibility, and
  internal quality assurance.
- 4veco's Dutch evidence profile maps product evidence to
  inspection-relevant categories without claiming inspection approval.

Forbidden claims currently include:

- 4veco is compliant with Dutch inspection standards.
- 4veco is approved by the Dutch Inspectorate of Education.
- 4veco materials by themselves satisfy a school's inspection obligations.
- Inspection prose authorises new economics lesson units or target exercises.

Answer:

```text
pass / revise_safe_claims / revise_forbidden_claims / hold
```

Required claim changes:

```text

```

### 7. Future Work Gate

If the v0 profile is accepted or accepted with corrections, what should the
next authorised step be?

Answer:

```text
corrections_only / report_only_schema_design / bounded_pilot_evidence_audit / stop
```

Notes:

```text

```

## Decision Record

Overall decision:

```text
pass / pass_with_corrections / hold / reject
```

Approved next action:

```text

```

Reviewer:

```text

```

Date:

```text

```

## Post-Review Instruction

After the human reviewer records the decision, create a follow-up sprint or
correction packet that implements only the approved next action. Do not infer
approval for schemas, validators, generated-output changes, overlays,
dashboard gates, quality-ref integration, Scale Gate integration, or compliance
claims.
