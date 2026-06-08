# Inspection Standards Data Overlay

Status: governed overlay for authorised inspection-standards research/data work.
Roadmap: `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`

This directory is the governed data surface for future inspection-standards
source registers, evidence profiles, and country/region overlays.

INSPECT-0 is authorised as research/data-only. It adds a source register and
Dutch evidence-profile draft. It does not authorise schemas, validators, country
overlays, generated reports, lesson-output writes, or compliance claims.

INSPECT-1A is authorised as a corrections-only packet after human review. It
adds Dutch curriculum/assessment source provenance, corrects source hygiene, and
tightens safe/forbidden claims. It does not accept the profile or authorise
schemas, validators, overlays, generated reports, evidence packs, lesson-output
writes, quality-ref integration, dashboard gates, Scale Gate work, or compliance
claims.

## Intended future contents

Current authorised INSPECT-0 contents:

- `source-register.json`
- `nl-vo-evidence-profile.v0.json`

Future authorised phases may add:

- `international-common-quality.v0.json`
- `schema-notes.md`
- `overlays/*.json`

## Guardrails

- Use this directory for governed inspection-evidence overlays only.
- Do not hand-edit `references/machine/` or `references/external/` from this
  project.
- Do not treat inspection standards as a source for minting MTUs, exercises,
  procedures, or learning goals.
- Do not claim legal compliance, approval, accreditation, or inspection
  judgement.
- Treat `../4veco-lessen/` as read-only evidence unless a later sprint
  explicitly authorises mutation through the platform workflow.

## Safe wording

Allowed claims should stay evidence-supporting, for example:

```text
4veco is designed to expose product evidence relevant to Dutch VO inspection preparation.
4veco can help teachers and schools organise product-side evidence for curriculum coherence, subject-relevant basic-skills support, didactic design, assessment alignment, student support, accessibility, and product quality assurance.
4veco's Dutch evidence profile maps product evidence to inspection-relevant categories without claiming inspection approval, legal compliance, or complete school-level evidence.
```

Forbidden claims include:

```text
4veco is compliant with Dutch inspection standards.
4veco is compliant with European inspection standards.
This material set is approved for country X.
4veco provides complete OP0/basic-skills evidence for a school or department.
```
