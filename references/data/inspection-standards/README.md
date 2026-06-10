# Dutch Quality-Control Data Surface

Status: governed data surface for authorised Dutch inspection-standards
research, profile, readiness, validator, and report-only evidence work.
Roadmap: `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`

This directory is the governed data surface for Dutch quality-control source
registers, evidence profiles, fixtures, prototypes, readiness evidence, and
report-only evidence-pack inputs.

Non-Dutch source-register entries, if present, are historical source inventory
only. They are inactive for the Dutch quality-control roadmap and must not be
expanded into mappings, claims, reports, or implementation until a
separate non-Dutch worktree and roadmap are explicitly authorised.

INSPECT-0 is authorised as research/data-only. It adds a source register and
Dutch evidence-profile draft. It does not authorise schemas, validators,
non-Dutch standards work, generated reports, lesson-output writes, or
compliance claims.

INSPECT-1A is authorised as a corrections-only packet after human review. It
adds Dutch curriculum/assessment source provenance, corrects source hygiene, and
tightens safe/forbidden claims. It does not accept the profile or authorise
schemas, validators, non-Dutch standards work, generated reports, evidence
packs, lesson-output writes, quality-ref integration, dashboard gates, Scale
Gate work, or compliance claims.

INSPECT-1A passed human correction review. INSPECT-2 was authorised as a
bounded read-only pilot evidence audit of Book 1 Chapter 1.1. It proved that
the Dutch v0 categories can locate real evidence, but it closed as
`pass_with_required_profile_adjustment`.

INSPECT-2A is authorised as a corrections-only profile-adjustment sprint before
schema design. It adds language for evidence finality, target-equivalent proof,
subject-material OP0 wording, title/source reconciliation, diagnostic-report
status, and product/school boundaries. It does not authorise schemas,
validators, generated evidence packs, lesson-output writes, quality-ref
integration, dashboard gates, Scale Gate work, non-Dutch standards work, or
compliance claims.

INSPECT-2A passed Head of Strategy review. INSPECT-3 is authorised as
report-only schema design. It may add
`references/schemas/inspection-evidence.schema.json`,
`docs/inspection-standards/report-only-schema-design.md`,
`references/data/inspection-standards/schema-notes.md`, and the INSPECT-3
sprint packet. The schema must remain diagnostic and report-only; it must not
become a build-failing validator, dashboard gate, quality-ref integration,
Scale Gate integration, generated evidence pack, teacher inspection pack,
non-Dutch standards work, generated lesson-output mutation path, or compliance
claim.

INSPECT-3 passed Head of Strategy review with minor guardrails. INSPECT-4 is
authorised as report-only validator design. It may add
`build-scripts/inspection/validate-inspection-evidence.js`,
`docs/inspection-standards/report-only-validator-design.md`,
`references/data/inspection-standards/validator-notes.md`,
`archive/sprints/INSPECT-4/`, and a sample report-only evidence object if
needed. The validator must remain manual, diagnostic, and non-blocking. It must
not be integrated into CI, builds, dashboards, quality-ref, Scale Gate,
generated lesson output, non-Dutch standards work, teacher inspection packs,
generated evidence packs, or compliance claims.

INSPECT-4 passed Head of Strategy review with required refinement. INSPECT-5 is
authorised as strictly non-blocking validator refinement. It may refine
validator wording or schema-backed behaviour, add negative fixtures, clarify
`SCHEMA_INVALID_REPORT_ONLY`, and update validation logs, lead review records,
URL indexes, roadmaps, and the ledger. It must not start report-only generator
planning, generated evidence packs, teacher inspection packs, dashboard gates,
quality-ref integration, Scale Gate integration, non-Dutch standards work, generated
lesson-output changes, CI/build integration, legal compliance claims,
inspectorate approval claims, or complete OP0/basic-skills claims.

INSPECT-5 completed strictly non-blocking validator refinement. Initial
teacher, legal/privacy, and Dutch quality-inspection external reviews after
INSPECT-5 returned `REVISE`. INSPECT-5R is authorised as a guardrail sprint
only. It may add external-review protocol, privacy/no-personal-data defaults,
safe-claim templates, teacher-facing evidence-pack template, stale-next-step
cleanup, roadmap/ledger updates, and INSPECT-5R review artifacts. It must not
start report-only generator planning, generated evidence packs, teacher
inspection packs, dashboard gates, quality-ref integration, Scale Gate
integration, non-Dutch standards work, generated lesson-output changes,
personal-data processing, CI/build integration, legal compliance claims, inspectorate
approval claims, or complete OP0/basic-skills claims.

INSPECT-5R closed with teacher, legal/privacy, and Dutch quality-inspection
reviewers each `MORE_THAN_SATISFIED`. INSPECT-6 is authorised as report-only
generator planning. It may add planning documents and privacy boundary source
anchors for no-personal-data and later DPIA/data-processing gates. It must not
implement a generator, generate evidence packs, integrate dashboards,
quality-ref, Scale Gate, CI/build gates, or lesson output, process personal
data, or make compliance/approval claims.

INSPECT-6 closed with teacher, legal/privacy, and Dutch quality-inspection
reviewers each `MORE_THAN_SATISFIED`. INSPECT-7 then created one bounded
no-personal-data Book 1 Chapter 1.1 report-only evidence-pack prototype.

INSPECT-7 closed with lead review `PASS` in round 4 and teacher,
legal/privacy, and Dutch quality-inspection reviewers each
`MORE_THAN_SATISFIED`. It accepted the bounded source object and Markdown/JSON
prototype only. It did not authorise package scripts, CI/build gates,
dashboard gates, quality-ref integration, Scale Gate integration,
lesson-output mutation, non-Dutch standards work, personal-data processing, or
compliance/approval claims.

## Intended Future Contents

Current authorised contents:

- `source-register.json`
- `nl-vo-evidence-profile.v0.json`
- `schema-notes.md`
- `validator-notes.md`
- `fixtures/pilot-1.1-inspection-evidence.sample.json`
- `fixtures/negative/*.sample.json`

Future authorised Dutch-only phases may add:

- `dutch-evidence-scale-readiness.json`
- `dutch-evidence-gap-plan.json`
- additional Dutch report-only source objects under `prototypes/`
- additional Dutch report-only fixtures under `fixtures/`

## Guardrails

- Use this directory for governed Dutch quality-control evidence data only.
- Do not hand-edit `references/machine/` or `references/external/` from this
  project.
- Do not treat inspection standards as a source for minting MTUs, exercises,
  procedures, or learning goals.
- Do not claim legal compliance, approval, accreditation, or inspection
  judgement.
- Do not claim AVG/GDPR compliance from privacy boundary sources.
- Do not present migrated target exercises, answer models, diagnostic reports,
  screenshots, or product QA records as final-reviewed school evidence unless a
  reviewed source/review artifact supports that exact claim.
- Do not start non-Dutch standards work from this directory during the Dutch
  quality-control roadmap.
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
4veco is approved by the Dutch Inspectorate of Education.
4veco materials by themselves satisfy a school's inspection obligations.
4veco provides complete OP0/basic-skills evidence for a school or department.
```
