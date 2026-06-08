# Inspection Standards Compatibility Roadmap

Status: proposed
Repository: `4veco-platform`
Primary target path: `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
Secondary evidence target: `../4veco-lessen/`
Roadmap ID: `inspection-standards-compatibility`
Roadmap version: `v0.1-setup-roadmap`
Sprint status: `INSPECT-0 Source Register + Dutch Profile Design` authorised as research/data-only; no tooling or production sprints authorised
Human owner: HCS / Marcel
Team mode: isolated worktree, roadmap and evidence design first, no broad production

Companion quality-standards docs:

- `docs/roadmaps/quality-standards/README.md`
- `docs/roadmaps/quality-standards/sprint-ledger.md`
- `docs/roadmaps/quality-standards/quality-standards-end-state.md`

## 0. Purpose

This roadmap defines how 4veco will become inspection-legible.

The hard baseline is Dutch secondary-education inspection support. The secondary
strategic goal is an international compatibility layer that makes 4veco easier
to adapt to the inspection-quality expectations used in major systems,
especially:

- Netherlands
- Belgium, starting with Flanders
- England / UK where relevant, but do not treat the UK as one inspection system
- Germany
- France
- Italy
- Spain
- Poland
- United States, where inspection is usually replaced by state/local standards,
  accountability, and accreditation mechanisms

The intended endpoint is not a legal claim that one book is compliant in every
country. The intended endpoint is:

> 4veco demonstrably supports Dutch inspection-relevant evidence first, and then
> exposes a reusable inspection-evidence architecture that can be mapped to the
> common quality expectations of major international systems through local
> overlays.

The project belongs primarily in `4veco-platform`, because that repository owns
generators, reference layers, validators, reports, skills, and roadmap
infrastructure. `4veco-lessen` is the generated student-facing target and must be
inspected only as evidence unless a later sprint explicitly authorises mutation.

This roadmap must preserve the 4veco product north star:

- `../4veco-lessen/specifications/product-vision.md` is the strategic product
  baseline.
- `../4veco-lessen/specifications/product-end-state.md` is the operational
  product baseline.
- 4veco remains exercise-first: real CvTE-style target exercises and reviewed
  target exercises stay stronger than inspection prose for lesson/unit creation.

## 1. Worktree setup instructions

This project must start in its own worktree. Do not reuse another active
agent's worktree. Do not switch branches inside a worktree used by another
agent.

Recommended branch pattern/example:

```bash
codex/inspection-standards-roadmap
```

The setup packet for this roadmap was implemented on the existing isolated task
branch `codex/quality-standards-20260608`. Future INSPECT work may continue on a
reviewed task branch or use a more specific `codex/inspection-standards-*`
branch, but the branch name must be recorded in the sprint audit.

Recommended platform worktree:

```bash
../4veco-platform-inspection-standards
```

### 1.1 Preflight from the existing platform repository

Run from the normal `4veco-platform` checkout:

```bash
git fetch --prune origin
git status --short
git branch --show-current
git worktree list --porcelain
```

Stop if:

- the current worktree has unrelated dirty files;
- the current branch is not the expected branch;
- another agent is already working in the intended inspection-standards worktree
  path;
- the remote is behind/diverged and cannot be reconciled by fast-forward.

### 1.2 Create isolated platform worktree

```bash
git fetch --prune origin
git worktree add -b codex/inspection-standards-roadmap ../4veco-platform-inspection-standards origin/main
cd ../4veco-platform-inspection-standards
git status --short
git branch --show-current
git rev-parse --show-toplevel
```

Expected result:

```text
branch: codex/inspection-standards-roadmap
root:   .../4veco-platform-inspection-standards
status: clean
```

### 1.3 Lessen repository access

For the first roadmap phase, treat `4veco-lessen` as a read-only evidence target
unless the roadmap explicitly authorises a small pointer file or a later sprint
authorises generated evidence output.

Do not hand-edit generated lesson artifacts in `4veco-lessen`.

If a later phase requires mutation in `4veco-lessen`, create a separate lessen
worktree:

```bash
cd ../4veco-lessen
git fetch --prune origin
git worktree add -b codex/inspection-standards-evidence ../4veco-lessen-inspection-standards origin/main
```

Do not create this second worktree unless a sprint plan explicitly needs it.

If a coordinated `4veco-lessen` worktree already exists for the task, record it
as read-only evidence and do not use it for mutation unless a later sprint plan
explicitly authorises generated lesson-output work.

## 2. Required reading before implementation

Read these files before changing anything:

```text
4veco-platform/RESEARCH_AGENT_MAP.md
4veco-lessen/RESEARCH_AGENT_MAP.md
4veco-platform/AGENTS.md
4veco-platform/CLAUDE.md
4veco-lessen/specifications/product-vision.md
4veco-lessen/specifications/product-end-state.md
4veco-platform/references/SOURCE_OF_TRUTH.md
4veco-platform/references/reference-team-roadmap.md
4veco-platform/docs/roadmaps/roadmap-version-index.json
4veco-lessen/lessen-team-roadmap.md
```

If any raw GitHub fetch fails, verify the file locally and through the GitHub
connector before concluding the file is absent. Report stale or unfetchable
repository maps explicitly.

## 3. Operating constraints

This roadmap follows current repository principles.

### 3.1 Exercise-first principle

Do not mint micro-teaching units, procedures, exercises, or learning goals from
inspection standards alone.

Inspection standards may identify evidence categories and quality requirements.
They are not the source of truth for economics lesson units.

The source hierarchy remains:

1. real CvTE exam questions and official correction models;
2. reviewed target exercises;
3. built paragraph target exercises;
4. consolidation/proeftoets material;
5. syllabus/programme text for grouping and coverage reporting only.

### 3.2 No hand edits to protected or generated surfaces

Do not hand-edit:

```text
references/machine/
references/external/
generated reports as if they were source
generated student-facing artifacts in 4veco-lessen
shared engine copies inside 4veco-lessen
```

If this project needs persistent structured data, start with a governed overlay:

```text
references/data/inspection-standards/
```

Use machine-editing pipelines only after a later phase defines validators and
CLI mutation routes.

### 3.3 No false compliance claims

Do not write:

```text
4veco is compliant with Dutch inspection standards.
4veco is compliant with European inspection standards.
4veco meets US standards.
This book is approved for country X.
```

Allowed wording:

```text
4veco is designed to support Dutch inspection-relevant evidence.
4veco exposes inspection evidence that helps schools demonstrate curriculum coherence, didactic quality, assessment alignment, support, and quality assurance.
4veco includes an international compatibility layer that can be mapped to local standards through country or region overlays.
```

### 3.4 No broad production

This roadmap is a foundation project. It must not trigger broad paragraph
production, companion scaling, or generated-output rebuilds. Any pilot evidence
must be bounded to already stabilised paragraphs unless a later human-approved
sprint says otherwise.

## 4. Core strategic analysis

### 4.1 Commonalities across inspection systems

Most systems expect evidence for:

| Common quality area | 4veco evidence target |
|---|---|
| Curriculum coherence | Book/chapter/paragraph progression maps, target-exercise sequence, concept/skill dependencies |
| Clear learning goals | Paragraph target exercise, learning-goal table, MTU/operation links |
| Subject depth | Upper-secondary economics reasoning, calculation, graph/table/source use, transfer tasks |
| Pedagogical-didactic quality | Explanation, worked example, guided practice, independent practice, check |
| Assessment alignment | Target exercises, exit tickets, answer models, rubrics, correction-model decomposition |
| Student support | Prerequisites, diagnostics, remediation, differentiated routes, extension |
| Basic skills | Language reasoning, calculation, graph interpretation, data/source reading, citizenship/economic participation |
| Accessibility and inclusion | Readable structure, alt text, keyboard/focus, contrast, mobile checks |
| Evidence of learning | Short checks, target-equivalent exit tickets, summative practice, validation logs |
| Internal quality assurance | Review records, quality-ref YAML, generated reports, proof artifacts, closure logs |
| Improvement cycle | Issue logs, correction logs, rechecks, pass-with-flags semantics |

These commonalities are strong enough to justify a generic
inspection-evidence architecture.

### 4.2 Differences across systems

Differences are too large for one static book to be fully compliant everywhere.

| Difference | Consequence for 4veco |
|---|---|
| National vs federal/regional governance | Use country/region overlays, not one global standard file |
| Curriculum and exam specifications | Dutch vwo remains canonical; foreign mappings require local crosswalks |
| Inspection object | Inspectors inspect schools/providers, not a textbook alone |
| Subject structure | Economics may be separate, integrated, exam-board-specific, state-specific, or school-plan-specific |
| Accountability model | Some systems inspect directly, others use standards/testing/accreditation |
| Language and legal terminology | Translation is not enough; terminology must be locally mapped |
| Evidence expectations | Some systems need school self-evaluation packs, others need standards/curriculum crosswalks |

Implementation consequence:

> Build one Dutch canonical evidence model, one international common-quality
> model, and local overlays. Do not fork the whole book per country unless a
> later product decision requires it.

## 5. Endpoint definition

The endpoint of this roadmap is reached when 4veco has the capabilities below.

### 5.1 Dutch Inspection Evidence Profile

A Dutch profile exists that maps 4veco materials to inspection-relevant evidence
categories.

Minimum categories:

```yaml
dutch_inspection_profile:
  curriculum_offer:
    evidence:
      - official exam/curriculum coverage
      - paragraph target exercises
      - chapter/book progression
  basic_skills:
    evidence:
      - language/economic reasoning
      - calculation
      - graph/table/source interpretation
      - citizenship/economic participation contexts where relevant
  didactic_quality:
    evidence:
      - explanations
      - worked examples
      - guided practice
      - independent practice
      - dual-coded visuals
      - consistent procedures
  student_development_and_support:
    evidence:
      - prerequisite checks
      - remediation
      - differentiated practice
      - extension/enrichment
  assessment_and_closure:
    evidence:
      - short checks
      - target-equivalent exit tickets
      - answer models
      - rubrics or correction guidance
  accessibility_and_inclusion:
    evidence:
      - readable layout
      - alt text
      - keyboard/focus
      - contrast
      - mobile usability
  quality_assurance:
    evidence:
      - review records
      - quality-ref YAML
      - validators
      - generated reports
      - proof artifacts
      - correction logs
```

This profile must be a 4veco support model, not a legal compliance certificate.

### 5.2 International Common-Quality Profile

A generic profile exists for common inspection-quality expectations.

Minimum categories:

```yaml
international_common_quality_profile:
  curriculum_coherence: true
  explicit_learning_goals: true
  progression: true
  subject_depth: true
  teaching_quality: true
  assessment_alignment: true
  differentiation_and_support: true
  accessibility_and_inclusion: true
  student_evidence: true
  internal_quality_assurance: true
  improvement_cycle: true
```

This profile supports country overlays but does not replace them.

### 5.3 Country/region overlay model

The repository has a documented overlay mechanism for local mappings.

Start overlays:

```text
nl-vo-vwo-economie
be-flanders-upper-secondary
england-upper-secondary-economics-or-economics-business
```

Later overlays:

```text
germany-by-land
france-lycee
italy-upper-secondary
spain-autonomous-community
poland-upper-secondary
us-state-or-ap-economics
```

Each overlay must include:

```yaml
overlay:
  jurisdiction:
  authority_sources:
  curriculum_or_inspection_terms:
  local_subject_mapping:
  assessment_model:
  evidence_crosswalk:
  gaps:
  safe_claims:
  forbidden_claims:
  review_status:
```

### 5.4 Teacher / school inspection pack generator

The desired mature product can generate a book-level inspection evidence pack.

Minimum generated pack:

```text
Book inspection evidence pack
|-- curriculum coverage map
|-- progression map
|-- basic-skills map
|-- assessment blueprint
|-- differentiation/support map
|-- accessibility evidence
|-- quality-assurance evidence
|-- known flags and correction log
`-- safe claims / forbidden claims note
```

This pack should be useful for a school leader or teacher preparing evidence,
but must clearly state that final inspection judgement belongs to the
school/provider and competent authority.

## 6. Roadmap phases

Only `INSPECT-0 Source Register + Dutch Profile Design` is authorised as a
research/data-only sprint. Later phases remain planning phases until a later
human review explicitly authorises them.

### Phase 0 - Project setup and current-state audit

Goal: create the roadmap and record the current repository state.

Outputs:

```text
docs/roadmaps/quality-standards/inspection-standards-roadmap.md
references/data/inspection-standards/README.md
archive/sprints/INSPECT-0/INSPECT-0-current-state-audit.md
```

Tasks:

1. Create or verify isolated platform worktree.
2. Read required repo maps and operating rules.
3. Confirm whether `references/data/inspection-standards/` exists.
4. Confirm current roadmap state and avoid conflict with active L1.7/L2.0 work.
5. Add this roadmap file.
6. Add a short README for the future inspection-standards data overlay.
7. Do not implement schemas, validators, profiles, or reports yet unless
   explicitly authorised.

Acceptance criteria:

- roadmap file exists;
- source/evidence paths are stated;
- no generated lesson artifacts are edited;
- no protected references are edited;
- repository maps/indexes are refreshed if required;
- remote branch is pushed.

Stop conditions:

- repo maps are stale or unfetchable;
- current roadmap has already introduced an overlapping inspection track;
- worktree is dirty with unrelated files;
- team cannot prove it is alone in the worktree.

### Phase 1 - Authority source register

Goal: collect authoritative inspection/curriculum-quality sources without yet
turning them into gates.

Target path:

```text
references/data/inspection-standards/source-register.json
```

Minimum source coverage:

```text
Netherlands: Inspectie van het Onderwijs, VO onderzoekskader, OP0 basisvaardigheden
Belgium/Flanders: Onderwijsinspectie Vlaanderen, Referentiekader Onderwijskwaliteit
England: Ofsted education inspection framework / school inspection toolkit
Germany: KMK/common references plus note that Laender differ
France: Ministere / inspection / school evaluation references
Italy: Sistema Nazionale di Valutazione / RAV / INVALSI where relevant
Spain: state law and autonomous-community inspection/evaluation model
Poland: pedagogical supervision / school inspection model
United States: state standards/accountability model, plus AP/MCEE/C3 only as non-inspection comparators where relevant
```

Minimum JSON shape:

```json
{
  "source_id": "nl-inspectie-onderzoekskader-vo-2025",
  "jurisdiction": "Netherlands",
  "authority": "Inspectie van het Onderwijs",
  "source_type": "inspection_framework",
  "title": "",
  "url": "",
  "retrieved_date": "",
  "status": "active | superseded | uncertain",
  "scope": "secondary | upper-secondary | all-school | subject-specific | accountability",
  "why_it_matters_for_4veco": "",
  "citation_policy": "public",
  "notes": ""
}
```

Acceptance criteria:

- every source has authority, jurisdiction, status, scope, and retrieval date;
- uncertain sources are explicitly marked uncertain;
- no source is treated as curriculum authority unless it actually is;
- no country overlay is created before the common model is reviewed.

### Phase 2 - Dutch Inspection Evidence Profile v0

Goal: define the Dutch baseline evidence model.

Target outputs:

```text
references/data/inspection-standards/nl-vo-evidence-profile.v0.json
docs/inspection-standards/nl-vo-evidence-model.md
```

The Dutch profile must answer:

1. What evidence should a 4veco book expose for Dutch inspection-relevant
   curriculum coherence?
2. Where does 4veco already store or generate that evidence?
3. Which evidence is missing, weak, or only implicit?
4. Which parts belong to the school's implementation rather than the book?
5. Which claims are safe and which are forbidden?

Required mapping categories:

```text
curriculum offer
basic skills
didactic quality
student development/support
assessment/closure
accessibility/inclusion
quality assurance
improvement cycle
```

Acceptance criteria:

- Dutch profile is evidence-supporting, not compliance-claiming;
- OP0/basic-skills evidence is explicit;
- economics-specific evidence includes reasoning, calculation,
  graph/table/source interpretation, and answer construction;
- exercise-first principle is preserved;
- official-exam evidence remains stronger than inspection prose for MTU
  creation.

### Phase 3 - Inspection evidence schema

Goal: create a schema for paragraph/book evidence without yet making it a hard
quality gate.

Possible target paths:

```text
references/schemas/inspection-evidence.schema.json
references/data/inspection-standards/schema-notes.md
build-scripts/inspection/validate-inspection-evidence.js
```

Start report-only. Do not fail existing builds yet.

Candidate evidence object:

```yaml
inspection_evidence:
  profile_version: "nl-vo-v0"
  paragraph_id: "1.1.3"
  learning_goals:
    target_exercise_id:
    official_exam_links:
    mtu_or_operation_links:
  basic_skills:
    language_reasoning:
    calculation:
    graph_table_source:
    citizenship_context:
  didactic_route:
    explanation:
    worked_example:
    guided_practice:
    independent_practice:
    feedback:
    exit_ticket:
  differentiation:
    prerequisite_support:
    remediation:
    standard_route:
    enrichment:
  accessibility:
    alt_text:
    keyboard_focus:
    contrast:
    mobile:
    readable_layout:
  qa:
    review_files:
    quality_ref:
    validators:
    proof_artifacts:
    known_flags:
```

Design decision required:

- Either extend existing `${parNr}-quality-ref.yaml` with an `inspection:`
  block;
- or keep inspection evidence as separate report-side files until the schema
  stabilises.

Default recommendation:

> Start separate and report-only. Integrate into `quality-ref.yaml` only after
> one pilot proves the evidence model is stable.

Acceptance criteria:

- schema validates a pilot object;
- missing fields are warnings, not hard failures;
- validation report distinguishes "not applicable", "missing", "implicit",
  "present", and "present but weak";
- schema does not force every country's evidence into Dutch labels.

### Phase 4 - Pilot evidence audit on stabilised paragraphs

Goal: test the model on already stabilised material before scaling.

Pilot scope:

```text
Book 1, Chapter 1.1
1.1.1 Schaarste en economisch denken
1.1.2 Ruilen en rekenen
1.1.3 Grafieken en tabellen
```

Do not rewrite paragraph content during this phase unless the sprint explicitly
authorises one bounded correction.

Outputs:

```text
reports/inspection-standards/pilot-1.1-evidence-audit.md
reports/inspection-standards/pilot-1.1-evidence-audit.json
archive/sprints/INSPECT-PILOT-1/...
```

Audit questions:

1. Can the model find evidence in paragraph markdown?
2. Can it find evidence in companion artifacts?
3. Can it find evidence in quality-ref/review records?
4. Does it distinguish textbook completeness from companion-pilot status?
5. Does it avoid false defects caused by generated-output staleness?
6. Does it produce a usable teacher-facing evidence summary?

Acceptance criteria:

- pilot report covers all three paragraphs;
- evidence paths are cited;
- missing evidence is classified by severity;
- generated vs source artifacts are not confused;
- no broad scaling recommendation is made from only three paragraphs.

### Phase 5 - Report and dashboard integration

Goal: make inspection evidence visible to agents and reviewers.

Potential outputs:

```text
reports/inspection-standards/nl-vo-summary.md
reports/inspection-standards/nl-vo-summary.json
reports/inspection-standards/common-quality-summary.md
reports/internal-dashboard/dashboard-data.json update if appropriate
```

Required report dimensions:

```text
coverage
basic skills
assessment alignment
differentiation/support
accessibility
quality assurance
missing evidence
unsafe claims
international overlay readiness
```

Acceptance criteria:

- report is generated from structured evidence, not hand-written claims;
- report distinguishes source evidence from generated reports;
- dashboard integration is diagnostic, not authority;
- no existing validator becomes a hard gate without human approval.

### Phase 6 - International common-quality profile

Goal: create the generic cross-system inspection-quality model.

Target outputs:

```text
references/data/inspection-standards/international-common-quality.v0.json
docs/inspection-standards/international-common-quality-model.md
```

Core categories:

```text
curriculum coherence
explicit learning goals
progression
subject depth
teaching quality
assessment alignment
differentiation/support
accessibility/inclusion
evidence of learning
internal quality assurance
improvement cycle
```

Explicit differences to preserve:

```text
jurisdictional authority
regional curriculum variation
subject structure
assessment model
inspection vs accountability model
language/legal terminology
school-implementation evidence
```

Acceptance criteria:

- common model is not presented as a European standard;
- differences are documented as first-class fields;
- every country/region overlay can say "not applicable", "requires local
  review", or "local evidence needed";
- safe-claim wording is included.

### Phase 7 - First country overlays

Goal: prove the overlay approach with close and explicit systems before harder
cases.

Recommended order:

1. Netherlands, because it is the hard baseline.
2. Flanders, because it is linguistically and educationally closest.
3. England, because Ofsted vocabulary is explicit and useful for international
   quality comparison.

Target paths:

```text
references/data/inspection-standards/overlays/nl-vo-vwo-economie.v0.json
references/data/inspection-standards/overlays/be-flanders-upper-secondary.v0.json
references/data/inspection-standards/overlays/england-upper-secondary.v0.json
```

Do not start Germany, Spain, US, or Belgium-wide overlays until the first three
overlays have been reviewed. These systems require more regionalisation.

Acceptance criteria:

- overlay maps local terms to common-quality categories;
- overlay records what cannot be mapped;
- overlay contains safe and forbidden claims;
- overlay has review status and reviewer/date fields;
- no overlay claims legal compliance.

### Phase 8 - Teacher inspection pack generator

Goal: generate usable book-level evidence packs.

Target outputs:

```text
build-scripts/inspection/build-inspection-pack.js
reports/inspection-standards/book-1-inspection-pack.md
reports/inspection-standards/book-1-inspection-pack.json
```

Pack sections:

```text
1. Scope and safe-use note
2. Curriculum coverage
3. Progression map
4. Basic-skills evidence
5. Assessment and answer-model alignment
6. Differentiation/support evidence
7. Accessibility evidence
8. Quality-assurance evidence
9. Known flags and improvement log
10. International compatibility notes
```

Acceptance criteria:

- pack is generated from structured evidence;
- every major claim points to evidence paths;
- pack says what belongs to the school's implementation rather than the book;
- pack is useful to a teacher/school leader without overclaiming inspection
  approval.

### Phase 9 - Gate integration

Goal: decide whether inspection evidence becomes part of Scale Gate / paragraph
closure.

Possible future gates:

```text
INSPECT-G1 Dutch Evidence Profile Review
INSPECT-G2 Pilot Evidence Audit Review
INSPECT-G3 Report-Only Validator Acceptance
INSPECT-G4 Teacher Pack Review
INSPECT-G5 Country Overlay Review
```

Do not make inspection validation a hard blocker for paragraph production until:

- Dutch evidence profile is reviewed;
- pilot audit is accepted;
- report-only validator has run without major false positives;
- human owner approves gate integration.

Default position:

> Until approved, inspection evidence is diagnostic. It informs quality work but
> does not block existing foundation-hardening work.

## 7. Quality log requirements

Maintain a quality log during all phases.

Each issue must include:

```yaml
title:
quality_category:
evidence_path_or_url:
affected_surface:
severity: low | medium | high | blocker
next_action:
platform_handoff_required: yes | no
proof_required_to_close:
```

Suggested quality categories:

```text
external-source-gap
dutch-profile-gap
international-overlay-gap
schema-gap
validator-gap
reporting-gap
unsafe-claim-risk
lesson-evidence-gap
generated-artifact-staleness
quality-ref-integration-risk
school-implementation-boundary
```

## 8. Review and closure rules

For any non-trivial sprint created from this roadmap:

1. planning/review subagent checks baseline, scope, required logs, stop
   conditions, and evidence;
2. main agent executes;
3. specialist subagents may review pedagogy, evidence, accessibility, or code;
4. verification subagent checks required files and validators;
5. lead-review cycle happens before closure;
6. human-review packet is required before a gate changes product policy.

Closure must report:

```text
local commit hash
remote push status
files changed
validators run
reports generated
maps/indexes refreshed
known flags
recommended next action
```

Refresh repository maps and indexes when paths, roadmaps, generated reports,
agents, skills, or review surfaces change.

Minimum likely commands after roadmap/report changes:

```bash
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
git status --short
git add ...
git commit -m "Add inspection standards compatibility roadmap"
git push -u origin <task-branch>
```

Only run dashboard refresh if dashboard or roadmap state is affected.

## 9. Initial definition of done for the setup project

This setup project is done when:

- `docs/roadmaps/quality-standards/inspection-standards-roadmap.md` exists;
- `references/data/inspection-standards/README.md` exists or a clear reason is
  recorded for deferring it;
- no generated student-facing artifacts were hand-edited;
- no protected reference surfaces were hand-edited;
- repository maps/indexes are refreshed if the new roadmap path requires it;
- branch is pushed;
- a PR or review packet explains that no implementation sprints are authorised
  yet;
- the team recommends the first real sprint as `INSPECT-0 Source Register +
  Dutch Profile Design`, not broad implementation.

## 10. First authorised research/data sprint after setup

Name:

```text
INSPECT-0 Source Register + Dutch Profile Design
```

Authorisation status:

```text
authorised after setup review as bounded research/data work
```

Scope:

```text
research and structured source register only
Dutch evidence-profile draft
no validators yet
no generated lesson changes
no country overlays except source inventory
```

Expected outputs:

```text
references/data/inspection-standards/source-register.json
references/data/inspection-standards/nl-vo-evidence-profile.v0.json
docs/inspection-standards/nl-vo-evidence-model.md
archive/sprints/INSPECT-0/INSPECT-0-validation-log.md
archive/sprints/INSPECT-0/INSPECT-0-closure-log.md
```

Decision after INSPECT-0:

```text
Proceed to schema design, or pause if the Dutch profile cannot be made evidence-based without first improving existing target-exercise / quality-ref / report structures.
```

## 11. Setup recommendation

Keep the first team task narrow: add the roadmap, set up the source/evidence
folder, and stop. The current lesson roadmap still says broad companion scaling
is not allowed until several foundation contracts and gates are complete.

This inspection-standards project should therefore begin as a
reference/reporting/governance track, not as a new production track.
