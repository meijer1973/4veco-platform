# INSPECT-2A Correction Packet

Status: complete, pending human review
Date: 2026-06-08
Branch: `codex/quality-standards-20260608`

## Decision Implemented

INSPECT-2 is recorded as:

```text
pass_with_required_profile_adjustment
```

INSPECT-2A implements the approved corrections-only profile adjustment before
schema design.

## Profile Status

The Dutch profile remains:

```text
status: draft
```

The cautious review status is now:

```text
review_status: draft_adjusted_for_schema_design
```

This is not a final, accepted, compliant, inspection-ready, approved, or
authority-endorsed status.

## Corrections Added

| Required adjustment | Implemented location | Result |
|---|---|---|
| Evidence finality | `nl-vo-evidence-profile.v0.json`; `nl-vo-evidence-model.md` | Added states for artifact presence, reviewed quality, pass-with-flags, target-exercise finality, target-equivalent review, diagnostic-only reports, and school-owned implementation. |
| Target-equivalent proof | Profile and model | Added proof states from target-exercise presence through local/generalised reviewed proof; blocked inference from target exercise or answer model alone. |
| Subject-material OP0 wording | Profile and model | Added `subject_material_basic_skills_evidence`; preserved not-complete-OP0, not-school-wide, and not-citizenship-proof language. |
| Title/source reconciliation | Profile, model, roadmap | Required every pilot/report to cite the live blueprint title and flag mismatches. |
| Diagnostic-report status | Profile and model | Reports remain diagnostic unless they cite source or review artifacts. |
| Product/school boundary | Profile and model | Added per-category `4veco_evidence`, `school_owned_evidence`, and `forbidden_inference` boundaries. |

## Category Outcomes Preserved

| Category | INSPECT-2A profile status |
|---|---|
| `curriculum_offer` | `accepted_as_present_but_weak` |
| `basic_skills` | `accepted_as_present_when_bounded` |
| `didactic_quality` | `accepted_as_present` |
| `student_development_and_support` | `accepted_as_present_but_weak` |
| `assessment_and_closure` | `accepted_as_present_but_weak` |
| `accessibility_and_inclusion` | `accepted_as_present_but_weak` |
| `quality_assurance` | `accepted_as_present` |
| `improvement_cycle` | `accepted_as_present` |

## Forbidden Work Check

Not added or changed:

```text
schemas
validators
generated evidence packs
dashboard gates
quality-ref integration
Scale Gate integration
country overlays
generated lesson-output changes
legal compliance claims
inspectorate approval claims
complete OP0/basic-skills claims
```

## Files Changed By Design

```text
references/data/inspection-standards/nl-vo-evidence-profile.v0.json
docs/inspection-standards/nl-vo-evidence-model.md
references/data/inspection-standards/README.md
docs/roadmaps/quality-standards/inspection-standards-roadmap.md
docs/roadmaps/quality-standards/sprint-ledger.md
archive/sprints/INSPECT-2A/
build-scripts/sprints/emit-url-index.js
reports/url-index.md
reports/internal-dashboard/dashboard-data.json
reports/internal-dashboard/index.html
reports/github-agent-index-platform.md
reports/github-agent-index-platform.json
reports/github-agent-index-lessen.md
reports/github-agent-index-lessen.json
```

Generated indexes/reports changed only because roadmap and sprint-packet URL
surfaces changed.

## Required Human Review Question

Does the Head of Strategy accept the adjusted profile language as sufficient to
allow a later `INSPECT-3 Report-Only Schema Design` sprint?

## Required Next Action

Send this packet and the validation log for human review. Do not start schema
design unless the human review explicitly authorises it.
