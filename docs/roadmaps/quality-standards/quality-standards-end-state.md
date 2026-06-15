# Dutch Quality Control End State

Status: Dutch-only target state
Date: 2026-06-09
Repository: `4veco-platform`

## Purpose

This document describes the intended mature state of the Dutch
quality-control layer after it has been implemented.

This folder is not about writing student-facing content. It is about the
governed Dutch standards layer that sits beside generated product artifacts
and makes quality evidence visible, traceable, reviewable, and safe to
interpret.

## End-State Sentence

At full maturity, 4veco has a governed Dutch quality-control layer that can
show, for every authorised Dutch evidence scope, which official Dutch sources
and internal review records support curriculum coherence, didactic quality,
assessment alignment, subject-material basic-skills support, accessibility,
differentiation/support, and quality assurance, while clearly separating
evidence support from compliance, approval, school implementation, and
competent-authority judgement.

## What Exists At Maturity

### 1. Dutch Source Register

The platform keeps a reviewed Dutch source register for quality-control
evidence. It covers:

- Inspectie van het Onderwijs VO framework and OP0 anchors;
- Dutch vwo-economie syllabus/programme sources;
- CvTE/Examenblad official exam questions and correction models;
- internal review, target-exercise, target-equivalent, accessibility, and
  quality-assurance evidence.

Any non-Dutch source inventory is inactive for this roadmap and belongs to a
future separate worktree if the owner later authorises it.

### 2. Dutch Evidence Profile

The platform has a reviewed Dutch VO/vwo-economie evidence profile.

The profile maps 4veco evidence to:

- curriculum offer and progression;
- subject-material basic-skills support;
- didactic quality;
- student development and support;
- assessment and closure;
- accessibility and inclusion;
- internal quality assurance;
- improvement cycle.

The profile never turns product evidence into school-wide proof.

### 3. Dutch Evidence Readiness Matrix

The platform can show readiness per authorised Dutch scope:

- target-exercise finality;
- exam-code linkage;
- target-equivalent proof;
- generated artifact evidence;
- review evidence;
- accessibility evidence;
- differentiation/support evidence;
- weak or missing evidence;
- school-owned evidence still needed;
- owner next action.

### 4. Dutch Evidence Packs

The platform can generate report-only Dutch evidence packs for authorised
scopes.

Each pack exposes:

- scope and safe-use note;
- curriculum and exam coverage evidence;
- progression and prerequisite evidence;
- target-exercise and exit-ticket alignment;
- subject-material basic-skills support;
- didactic sequence and practice design;
- differentiation/support evidence;
- accessibility evidence;
- assessment and answer-model evidence;
- known gaps, weak evidence, stale sources, and unresolved flags;
- safe-claim and forbidden-claim notes.

The pack is for school, teacher, reviewer, and agent use. It is not an
inspection certificate. It contains no student-level personal data by default.

### 5. Dutch Teacher/School Pack

A teacher or school leader can read the first screen in 5-10 minutes and see:

- what the pack covers;
- what 4veco product evidence exists;
- what evidence is weak or missing;
- what evidence belongs to the school;
- what must not be inferred;
- what the next action is.

### 6. Validators And Diagnostic Reports

The layer has validators and reports that can detect:

- missing source IDs;
- stale source retrieval dates;
- missing evidence categories;
- generated artifacts that lack required evidence anchors;
- unsafe claims;
- broken links to evidence paths;
- gap records without owner or next action;
- evidence packs generated from unreviewed sources.

Diagnostics may summarize readiness, but they may not turn weak evidence into
a compliance claim.

### 7. Review And Gate Protocol

Quality-control implementation uses explicit gates:

- source/profile review before evidence profiles become authoritative;
- schema review before validators are enforced;
- bounded evidence-pack review before artifact-set reporting scales;
- human review before any public-facing claims change;
- separate approval before integration with Scale Gate, quality-ref, CI/build,
  or production release decisions.

For sprints that prepare generator planning, evidence packs,
teacher/school-facing summaries, diagnostic report surfaces, or public claims,
the mature gate includes teacher, legal/privacy, and Dutch quality-inspection
reviewers. All three must be `MORE_THAN_SATISFIED`; a merely passing review
leaves the gate closed.

## Maturity Levels

| Level | Name | Meaning |
| --- | --- | --- |
| `L0` | Setup | Roadmap, folder, ledger, and initial evidence boundaries exist. |
| `L1` | Source/profile design | Dutch source register and Dutch VO draft profile exist and pass review. |
| `L2` | Evidence schema | Evidence records, validators, and report contracts are reviewed. |
| `L3` | Bounded pack | One bounded generated artifact set is mapped and reviewed. |
| `L4` | Dutch multi-scope scale | Evidence packs work across multiple authorised Dutch scopes with known gaps visible. |
| `L5` | Dutch quality-control layer | Governed Dutch evidence can be generated across the authorised product scope without unsafe claims. |

## Safe Claims At Maturity

The mature Dutch quality-control layer may support claims such as:

- 4veco exposes Dutch inspection-relevant product evidence for curriculum
  coherence, didactic quality, assessment alignment, accessibility, support,
  and internal quality assurance.
- 4veco maps generated artifacts to reviewed Dutch evidence categories and
  records known gaps.
- 4veco can generate school-facing Dutch evidence packs that support
  preparation and review.

## Forbidden Claims

The standards layer must not claim:

- 4veco is compliant with Dutch inspection standards.
- 4veco is approved by the Dutch Inspectorate of Education or any other
  authority.
- 4veco materials by themselves satisfy a school's inspection obligations.
- Inspection prose authorises new economics lesson units, target exercises, or
  MTUs.
- Dashboard or report readiness is the same as school quality, legal
  compliance, summative assessment, diagnostics, mastery, OP0 completion, or
  school SKA compliance.

## Open Questions

- INSPECT-9A remediates Book 1 Chapter 1.2 source-registry target finality,
  the `1.2.4` integration target, and target-registry exam-code linkage.
  INSPECT-9B reviews target-equivalent and accessibility/support evidence and
  finds useful route-local lesson evidence, but no reviewed target-equivalent
  proof records or complete accessibility/support evidence. INSPECT-9C creates
  route-local proof status for `1.2.1` through `1.2.4`, carries `1.2.2` and
  `1.2.4` generated-output blockers, and records minimum accessibility/support
  evidence. Chapter 1.2 pack-strength generator work remains blocked; only
  diagnostic-only INSPECT-10 planning is recommended after human acceptance.
- Which source freshness interval is acceptable for Dutch inspection,
  curriculum, and exam sources? INSPECT-9 proposes a 180-day recheck trigger
  for later teacher/school-facing pack work, but this still needs adoption in
  a source/profile maintenance step.
- Which exact proof-record format should become reusable beyond the INSPECT-9C
  Chapter 1.2 route-local records?
- Which mobile, contrast/theme, semantic/PDF, hint/repair, companion, and
  advisory-route evidence must close before Chapter 1.2 can move beyond
  diagnostic-only generator posture?
- Should Dutch quality-control evidence stay in platform reports only, or
  should selected summaries also become teacher/school-facing artifacts after
  review?
