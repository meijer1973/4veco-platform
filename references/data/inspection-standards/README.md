# Inspection Standards Data Overlay

Status: placeholder overlay for future authorised inspection-standards work.
Roadmap: `docs/roadmaps/inspection-standards-roadmap.md`

This directory is the governed data surface for future inspection-standards
source registers, evidence profiles, and country/region overlays.

It is intentionally empty apart from this README during the setup phase. The
setup phase does not authorise schemas, validators, country overlays, generated
reports, lesson-output writes, or compliance claims.

## Intended future contents

Future authorised phases may add:

- `source-register.json`
- `nl-vo-evidence-profile.v0.json`
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
4veco is designed to support Dutch inspection-relevant evidence.
4veco exposes evidence that helps schools demonstrate curriculum coherence, didactic quality, assessment alignment, student support, accessibility, and internal quality assurance.
```

Forbidden claims include:

```text
4veco is compliant with Dutch inspection standards.
4veco is compliant with European inspection standards.
This book is approved for country X.
```
