# Quality Standards End State

Status: first attempt
Date: 2026-06-08
Repository: `4veco-platform`

## Purpose

This document describes the intended mature state of the quality-standards
layer after it has been implemented.

It is not a description of the final textbooks themselves. The textbooks and
student route remain governed by the 4veco product vision, product end-state,
course blueprint, target exercises, generated lesson artifacts, and review
gates. This document describes the standards layer that should sit beside that
product and make its quality evidence visible.

## End-State Sentence

At full maturity, 4veco has a governed quality-standards layer that can show,
for every completed course segment, which official sources and internal review
evidence support curriculum coherence, didactic quality, assessment alignment,
basic-skills support, accessibility, differentiation, and quality assurance,
while clearly separating evidence support from compliance or approval claims.

## What Exists At Maturity

### 1. Authoritative Source Register

The platform keeps a reviewed register of official and primary sources used for
quality-standards evidence. Each source records:

- jurisdiction and competent authority;
- source type, such as inspection framework, curriculum standard,
  accountability source, or comparator;
- retrieval date and freshness status;
- citation policy;
- authority boundary;
- why it matters for 4veco evidence.

The register distinguishes official inspection authority from curriculum,
exam, accountability, accreditation, and non-inspection comparator sources.

### 2. Evidence Profiles And Overlays

The platform has a reviewed Dutch VO evidence profile first. Later overlays are
added only when separately authorised.

The Dutch profile maps 4veco evidence to categories such as:

- curriculum offer and progression;
- basic skills;
- didactic quality;
- student development and support;
- assessment and closure;
- accessibility and inclusion;
- internal quality assurance;
- improvement cycle.

International overlays may reuse the evidence architecture, but they must not
pretend that different countries share one inspection regime.

### 3. Traceable Evidence Model

Every standards claim points to concrete evidence rather than prose alone.
Evidence may include:

- official CvTE questions and correction models;
- reviewed target exercises;
- paragraph plans and course blueprint records;
- generated lesson artifacts in `4veco-lessen`;
- MTU and operation dependencies;
- accessibility and student-experience reviews;
- teacher-learning-quality review records;
- generated coverage, dashboard, and validation reports;
- sprint plans, validation logs, closure logs, and human-review packets.

Planning documents are weaker evidence than generated and reviewed product
artifacts. Reports are projections, not sources of truth by themselves.

### 4. Generated Evidence Packs

When implementation is mature, the platform can generate evidence packs at
multiple levels:

- paragraph evidence pack;
- chapter evidence pack;
- book evidence pack;
- year-level evidence pack;
- full three-year course evidence pack.

Each pack should expose:

- curriculum and exam coverage;
- progression and prerequisite structure;
- target-exercise and exit-ticket alignment;
- basic-skills support;
- didactic sequence and practice design;
- differentiation and support evidence;
- accessibility evidence;
- assessment and answer-model evidence;
- known gaps, weak evidence, stale sources, and unresolved flags;
- safe-claim and forbidden-claim notes.

The pack is for school, teacher, reviewer, and agent use. It is not an
inspection certificate.

### 5. Validators, Reports, And Dashboard Surfaces

The implemented layer has validators and reports that can detect:

- missing source IDs;
- stale retrieved dates;
- profile categories without evidence;
- generated artifacts that lack required evidence anchors;
- unsafe claims;
- broken links to lesson output;
- gap records without owner or next action;
- evidence packs generated from unreviewed sources.

Dashboards may summarize readiness, but they may not turn weak evidence into a
compliance claim.

### 6. Review And Gate Protocol

Quality-standards implementation uses explicit gates:

- source-profile review before evidence profiles become authoritative;
- schema review before validators are enforced;
- pilot evidence-pack review before book-level reporting scales;
- human review before any public-facing claims change;
- separate approval before integration with Scale Gate or production release
  decisions.

## Full Course View

When the full three-year economics course exists, the standards layer should be
able to answer these questions without manual reconstruction:

- Which official curriculum, exam, and inspection-relevant sources support the
  course design?
- Which books, chapters, and paragraphs are generated, reviewed, and still
  flagged?
- Where do target exercises prove the intended operation chain?
- Where do explanations, practice, visuals, checks, and answer models support
  the target exercise?
- Where are basic skills, graph/table/source use, reasoning, calculation, and
  answer-writing demands visible?
- Which evidence is Dutch-specific, which evidence is generic quality evidence,
  and which evidence belongs to a later international overlay?
- What gaps remain before a school-facing evidence pack can be used
  responsibly?

## Safe Claims At Maturity

The mature standards layer may support claims such as:

- 4veco exposes Dutch inspection-relevant evidence for curriculum coherence,
  didactic quality, assessment alignment, accessibility, support, and internal
  quality assurance.
- 4veco maps generated course materials to reviewed evidence categories and
  records known gaps.
- 4veco can generate school-facing evidence packs that support preparation and
  review.

## Forbidden Claims

The standards layer must not claim:

- 4veco is compliant with Dutch inspection standards.
- 4veco is approved by the Dutch Inspectorate of Education or any other
  authority.
- A 4veco book or course by itself satisfies a school's inspection obligations.
- Inspection prose authorises new economics lesson units, target exercises, or
  MTUs.
- Dashboard readiness is the same as school quality, legal compliance,
  summative assessment, diagnostics, or mastery.

## Maturity Levels

| Level | Name | Meaning |
| --- | --- | --- |
| `L0` | Setup | Roadmap, folder, ledger, and initial evidence boundaries exist. |
| `L1` | Source/profile design | Source register and Dutch VO draft profile exist and pass human review. |
| `L2` | Evidence schema | Evidence records, validators, and report contracts are reviewed. |
| `L3` | Pilot pack | One bounded book or chapter evidence pack is generated and reviewed. |
| `L4` | Multi-book scale | Evidence packs work across multiple books with known gaps visible. |
| `L5` | Three-year course layer | The full three-year course can produce governed standards evidence without unsafe claims. |

## Open Questions

- Which source freshness interval is acceptable for official inspection and
  curriculum sources?
- Which evidence categories must be mandatory before a school-facing pack can
  be generated?
- Should standards evidence live only in platform reports, or should selected
  summaries also be generated into `4veco-lessen` as teacher-facing artifacts?
- What human review role owns approval of safe public claims?
