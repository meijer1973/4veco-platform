# Dutch Quality Control Roadmap

Status: proposed Dutch-only roadmap
Repository: `4veco-platform`
Primary target path: `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
Secondary evidence target: `../4veco-lessen/`
Roadmap ID: `dutch-quality-control`
Roadmap version: `v2.2-inspect-10a-implementation-plan`
Sprint status: `QS-DUTCH-ROADMAP-1` closed / Dutch-only proposal ready for human review; `QS-DUTCH-ROADMAP-1A` closed / PR prep complete; `QS-DUTCH-ROADMAP-1B` closed / CI repair ready for PR validation; `INSPECT-8` closed / readiness audit complete; `INSPECT-9` closed / gap-closure plan complete; `INSPECT-9A` closed / Chapter 1.2 target and exam-linkage source remediation complete; `INSPECT-9B` closed / Chapter 1.2 target-equivalent and accessibility/support review complete; `INSPECT-9C` closed / Chapter 1.2 proof and support remediation complete; `INSPECT-10` closed / diagnostic-only generator planning accepted and merged; `INSPECT-10A` ready for human review / implementation-plan packet complete
Human owner: HCS / Marcel
Team mode: isolated worktree, Dutch quality-control package first, no broad production

Companion quality-standards docs:

- `docs/roadmaps/quality-standards/README.md`
- `docs/roadmaps/quality-standards/sprint-ledger.md`
- `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- `docs/inspection-standards/external-review-privacy-and-claim-guardrails.md`
- `docs/inspection-standards/teacher-facing-evidence-pack-template.md`

## 0. Purpose

This roadmap defines the active Dutch quality-control path for 4veco.

The goal is a complete Dutch VO/vwo-economie evidence-support package that can
show, per authorised scope, what 4veco product evidence exists for curriculum
coherence, didactic quality, assessment alignment, subject-material
basic-skills support, accessibility, differentiation/support, quality
assurance, and improvement work.

The endpoint is not a legal, compliance, approval, certification, inspection
readiness, PTA validity, summative validity, school-obligation, classroom-
implementation, school SKA, or complete OP0/basic-skills claim.

The endpoint is:

> 4veco has a Dutch-only, reviewed, report-only quality-control package that
> helps teachers, school leaders, reviewers, and agents see product-side
> evidence and known gaps without confusing product evidence with school-owned
> implementation or competent-authority judgement.

Non-Dutch standards work is not part of this roadmap. If the owner later wants
non-Dutch work, it must start in a separate worktree with a separate roadmap,
source policy, and review gate.

## 1. Ownership And Repository Boundary

This project belongs primarily in `4veco-platform`, because that repository
owns:

- roadmaps and sprint ledgers;
- source registers, evidence profiles, and governed reference data;
- schemas, validators, and report-only generators;
- generated reports and internal dashboards;
- review packets, closure logs, and agent-facing indexes.

`../4veco-lessen` is a generated student-facing evidence target for this
roadmap. Treat it as read-only unless a future sprint explicitly authorises a
separate generated-output workflow.

Do not hand-edit generated lesson artifacts in `../4veco-lessen`.

## 2. Product Principles

### 2.1 Exercise-First

Do not mint micro-teaching units, procedures, exercises, target exercises, or
learning goals from inspection standards alone.

The source hierarchy remains:

1. real CvTE exam questions and official correction models;
2. reviewed target exercises;
3. built paragraph target exercises;
4. consolidation/proeftoets material;
5. syllabus/programme text for grouping and coverage reporting only;
6. inspection-quality language for evidence categories and review support only.

### 2.2 Product/School Boundary

Every generated or reviewed evidence packet must separate:

- `4veco evidence`;
- school evidence still needed;
- weak or missing evidence;
- forbidden inference;
- owner next action.

4veco may expose product-side evidence. It does not prove school-wide
implementation, support/care practice, governance, PTA policy, summative
validity, classroom use, or inspection judgement.

### 2.3 OP0 Boundary

OP0/basic-skills wording must stay subject-material only.

Allowed:

```text
4veco exposes subject-material economics evidence relevant to reasoning,
calculation, graph/table/source use, and answer construction.
```

Forbidden:

```text
4veco provides OP0 evidence.
4veco proves complete OP0/basic-skills provision.
4veco proves school-wide Dutch language, rekenen-wiskunde, or citizenship implementation.
```

### 2.4 No Personal Data By Default

Evidence packs contain no student-level personal data by default.

Any future use of student-level or identifiable school/person data requires a
separate explicit privacy/DPIA/data-processing gate before implementation.

### 2.5 No False Claims

Do not write:

```text
4veco is compliant with Dutch inspection standards.
4veco is approved by the Dutch Inspectorate of Education.
4veco is inspection-ready.
4veco materials by themselves satisfy a school's inspection obligations.
4veco provides complete OP0/basic-skills evidence for a school or department.
```

Allowed evidence-support wording:

```text
4veco is designed to expose product evidence relevant to Dutch VO inspection preparation.
4veco can help teachers and schools organise product-side evidence for curriculum coherence, subject-relevant basic-skills support, didactic design, assessment alignment, student support, accessibility, and product quality assurance.
4veco's Dutch evidence profile maps product evidence to inspection-relevant categories without claiming inspection approval, legal compliance, or complete school-level evidence.
```

## 3. Current Baseline

PR #23 merged the Dutch quality-standards layer through INSPECT-7 into `main`.

Closed baseline:

| Sprint | Result |
|---|---|
| `QS-SETUP-0` | Created quality-standards roadmap folder and current-state audit. |
| `INSPECT-0` | Created source register and Dutch VO evidence-profile draft. |
| `INSPECT-1` / `INSPECT-1A` | Human review plus source/claim hygiene corrections. |
| `INSPECT-2` / `INSPECT-2A` | Bounded Book 1 Chapter 1.1 sample audit plus profile adjustment. |
| `INSPECT-3` | Report-only inspection-evidence schema design. |
| `INSPECT-4` | Manual report-only validator design. |
| `INSPECT-5` | Strictly non-blocking validator refinement. |
| `INSPECT-5R` | External review, privacy, teacher-usefulness, OP0, and claim guardrails. |
| `INSPECT-6` | Report-only generator planning. |
| `INSPECT-7` | Bounded no-personal-data Book 1 Chapter 1.1 evidence-pack sample. |
| `QS-MERGE-1` / `QS-MERGE-2` | Merge-prep and final PR refresh; PR #23 merged through GitHub. |
| `INSPECT-8` | Dutch readiness audit; recommends no additional evidence-pack generation yet and names Book 1 Chapter 1.2 as the INSPECT-9 gap-closure candidate. |
| `INSPECT-9` | Dutch gap-closure plan; defines proof requirements and correction routes for Chapter 1.2 before pack work and keeps Chapter 1.1 as a control scope only unless remediated. |
| `INSPECT-9A` | Chapter 1.2 target and exam-linkage source remediation; updates the authored target registry for `1.2.1`-`1.2.4`, keeps Chapter 1.1 control-only, and leaves target-equivalent plus accessibility/support proof as blockers before pack work. |
| `INSPECT-9B` | Chapter 1.2 target-equivalent and accessibility/support evidence review; finds useful route-local lesson evidence but no reviewed target-equivalent proof records or complete accessibility/support evidence, so Chapter 1.2 generator work remains blocked pending remediation. |
| `INSPECT-9C` | Chapter 1.2 proof and support remediation; records route-local proof status for `1.2.1`-`1.2.4`, carries `1.2.2` and `1.2.4` generated-output blockers, records minimum accessibility/support evidence, and recommends only diagnostic-only INSPECT-10 planning after human acceptance. |
| `INSPECT-10` | Dutch report-only generator diagnostic planning; defines the future diagnostic generator contract, status vocabulary, input eligibility, blocker display rules, and human-review questions. It creates no generator code and no evidence pack. |
| `INSPECT-10A` | Diagnostic report generator implementation plan; names exact future source files, output files, refusal/stop conditions, and static output shape for a later internal generator. It creates no generator code and no diagnostic report. |

INSPECT-7 reached maturity level `L3 Bounded pack`: one bounded generated
artifact set is mapped and reviewed.

Accepted INSPECT-7 scope:

```text
Book 1 - Grondslagen, vraag en aanbod
Chapter 1.1 - Economisch denken en rekenen
1.1.1 Schaarste en economisch denken
1.1.2 Percentages en indexcijfers
1.1.3 Grafieken en tabellen
```

Title reconciliation:

```text
The live title for 1.1.2 is Percentages en indexcijfers.
The stale review title Ruilen en rekenen must not be used as the live scope.
```

All three required external INSPECT-7 reviewers returned
`MORE_THAN_SATISFIED`:

- teacher reviewer;
- legal/privacy reviewer;
- Dutch quality-inspection reviewer.

## 4. Dutch Quality-Control Endpoint

The Dutch package is complete when the repository has these reviewed surfaces.

### 4.1 Dutch Source And Evidence Profile

The Dutch source register and Dutch VO evidence profile are reviewed and
freshness-managed for Dutch-only use.

Required source areas:

- Inspectie van het Onderwijs VO onderzoekskader and OP0 anchors;
- Dutch vwo-economie syllabus/programme sources;
- CvTE/Examenblad official exam questions and correction models;
- internal target-exercise, target-equivalent, review, accessibility, and
  quality-assurance records.

### 4.2 Dutch Evidence Readiness Matrix

A readiness matrix exists for authorised Dutch scopes. It records, per
paragraph/chapter/scope:

- target-exercise finality;
- exam-code linkage;
- target-equivalent proof status;
- generated artifact evidence;
- review evidence;
- accessibility evidence;
- differentiation/support evidence;
- quality-assurance evidence;
- weak/missing evidence;
- school-owned evidence still needed;
- owner next action.

### 4.3 Dutch Report-Only Evidence Pack Generator

The platform can generate scoped Dutch evidence packs from structured evidence.

The generator stays report-only unless a later human gate explicitly changes
that. It must not become a build blocker, dashboard gate, quality-ref
integration, Scale Gate integration, or generated lesson-output mutation path
without explicit authorisation.

### 4.4 Dutch Multi-Scope Evidence Packs

Evidence packs work across multiple authorised Dutch scopes. Scaling order must
be conservative:

1. Book 1 Chapter 1.1, using INSPECT-7 as baseline;
2. additional ready paragraphs in Book 1;
3. Book 1 published-paragraph status;
4. broader Dutch scope only after readiness evidence supports it.

Do not jump to all books.

### 4.5 Dutch Teacher/School Evidence Pack

A teacher/school-facing Dutch evidence pack can be reviewed in 5-10 minutes.
It opens with:

- scope;
- safe-use note;
- evidence summary;
- weak or missing evidence;
- school-owned evidence still needed;
- recommended next action.

It must remain clear that final inspection conversation and judgement belong
to the school/provider and competent authority.

### 4.6 Dutch Quality-Control Closure Packet

The final Dutch closure packet includes:

- source/profile status;
- readiness matrix;
- generated evidence packs;
- validation logs;
- external review results;
- known gaps;
- safe/forbidden claims;
- decision on whether any diagnostic dashboard/report surface is useful;
- explicit statement that no compliance/approval claim is made.

## 5. Required Review Gate

All non-trivial Dutch quality-control sprints must follow sprint protocol:

1. sprint plan;
2. planning review before implementation;
3. implementation by the main agent;
4. focused validation with testing evidence;
5. lead review before closure;
6. closure log with next operational step.

Any sprint that prepares generator planning, evidence packs,
teacher/school-facing summaries, public claims, dashboard/report surfaces,
quality-ref/Scale Gate integration, or generated-output changes must also use
the three-reviewer gate:

| Reviewer role | Required verdict |
|---|---|
| Teacher reviewer | `MORE_THAN_SATISFIED` |
| Legal/privacy reviewer | `MORE_THAN_SATISFIED` |
| Dutch quality-inspection reviewer | `MORE_THAN_SATISFIED` |

Verdict scale:

```text
REVISE
PASS
MORE_THAN_SATISFIED
```

Any `REVISE` or `PASS` blocks progression and requires correction,
validation, lead review, push, and re-review.

## 6. Dutch-Only Roadmap Sequence

No sprint below is authorised merely because it appears in this roadmap. Each
needs a fresh sprint plan, planning review, and applicable review gates.

### INSPECT-8 - Dutch Evidence Scale Readiness

Goal: decide which Dutch scopes are ready for additional evidence-pack work.

Scope: planning/audit only.

Outputs:

```text
archive/sprints/INSPECT-8/
reports/inspection-standards/dutch-evidence-scale-readiness.md
reports/inspection-standards/dutch-evidence-scale-readiness.json
```

Required audit dimensions:

- paragraph and chapter scope inventory;
- target-exercise finality;
- exam-code linkage gaps;
- target-equivalent proof gaps;
- review evidence status;
- generated artifact evidence status;
- accessibility evidence status;
- differentiation/support evidence status;
- school-owned evidence still needed;
- unsafe-claim risks;
- recommended next Dutch scope.

Acceptance criteria:

- no new evidence packs are generated;
- no source claim is strengthened without reviewed evidence;
- recommended next scope is conservative and evidence-based;
- weak/missing evidence remains visible.

### INSPECT-9 - Dutch Evidence Gap Closure Plan

Goal: convert the readiness audit into a correction plan for the evidence
basis.

Scope: planning and source-evidence hardening design only unless explicitly
authorised.

Focus areas:

- target-exercise finality route;
- exam-code linkage route;
- target-equivalent proof route;
- accessibility evidence rubric;
- support/differentiation evidence rubric;
- stale source freshness policy;
- product/school boundary wording.

Acceptance criteria:

- no generated lesson-output mutation;
- no quality-ref or Scale Gate integration;
- no closure claims for scopes whose evidence is still weak;
- corrections have proof requirements before they can close.

### INSPECT-9A - Chapter 1.2 Target And Exam-Linkage Remediation

Goal: close or explicitly defer the source-evidence prerequisites named by
INSPECT-9 before any Dutch evidence-pack generator implementation starts.

Scope: target-finality review, integration-target review, and exam-code
linkage decision planning/remediation for Book 1 Chapter 1.2, with a decision
on whether Chapter 1.1 control-scope records need remediation before re-use.

Acceptance criteria:

- no evidence-pack generation;
- no report-only generator implementation;
- no generated lesson-output mutation;
- target-record state changes, if authorised, cite exact review evidence;
- exam-code changes, if authorised, cite official source evidence and an
  operation-level comparison;
- weak or deferred evidence remains visible;
- no quality-ref, Scale Gate, dashboard gate, or CI/build integration.

### INSPECT-9B - Chapter 1.2 Target-Equivalent And Accessibility/Support Evidence Review

Goal: decide whether Chapter 1.2 has enough reviewed target-equivalent,
accessibility, and support/differentiation evidence for a later report-only
generator implementation, or whether those gaps must stay explicit blockers.

Scope: review/design packet only. It may inspect existing generated lesson
evidence read-only and create platform-side reports, but it must not generate
new lesson output, evidence packs, package scripts, CI/build gates, dashboard
gates, quality-ref integration, or Scale Gate integration.

Acceptance criteria:

- no evidence-pack generation;
- no report-only generator implementation;
- no generated lesson-output mutation;
- target-equivalent proof status is explicit per Chapter 1.2 target;
- accessibility/support evidence is recorded with route-local boundaries;
- weak or deferred evidence remains visible;
- Chapter 1.2 is either declared still blocked before INSPECT-10 or granted a
  tightly scoped report-only-generator implementation posture with named
  blockers;
- no compliance, approval, inspection-ready, complete OP0, PTA-validity,
  summative-validity, classroom-implementation, school-obligation, or
  school-SKA claim.

### INSPECT-9C - Chapter 1.2 Proof And Support Remediation

Goal: close or explicitly carry the blockers found by INSPECT-9B before any
Chapter 1.2 report-only generator work.

Scope: target-equivalent proof specification/review and minimum
accessibility/support evidence capture for Chapter 1.2. Lesson-output mutation,
quality-ref updates, and generated-output repair remain forbidden unless a
fresh plan explicitly authorises those exact files and validators.

Expected outputs:

```text
archive/sprints/INSPECT-9C/
reports/inspection-standards/chapter-1-2-proof-support-remediation.md
reports/inspection-standards/chapter-1-2-proof-support-remediation.json
```

Acceptance criteria:

- reviewed proof status exists for `1.2.1` through `1.2.4`, or each target has
  an explicit blocker/carry decision;
- accessibility evidence records mobile, contrast/theme, semantic/PDF, and
  keyboard/focus applicability or reviewed not-applicable decisions;
- support evidence records hints/repair, companion/advisory route state, and
  product/school support boundaries;
- generated-output flags from INSPECT-9B are either remediated under explicit
  authority or carried as blockers;
- no evidence-pack generation;
- no report-only generator implementation;
- no compliance, approval, inspection-ready, complete OP0, PTA-validity,
  summative-validity, classroom-implementation, school-obligation, or
  school-SKA claim.

### INSPECT-10 - Dutch Report-Only Generator First Implementation

Goal: implement a reusable Dutch report-only generator after the evidence
basis is ready enough.

Scope: generator/report-only implementation.

Current authority update after INSPECT-9C, INSPECT-10, and INSPECT-10A
planning:

The original implementation goal remains blocked. INSPECT-10 currently exists
only as accepted diagnostic-only generator planning with Chapter 1.2 blockers
visible. INSPECT-10A exists only as implementation planning for a possible
later internal diagnostic generator. The planning packets are:

```text
archive/sprints/INSPECT-10/
reports/inspection-standards/dutch-report-only-generator-diagnostic-planning.md
reports/inspection-standards/dutch-report-only-generator-diagnostic-planning.json
archive/sprints/INSPECT-10A/
reports/inspection-standards/dutch-diagnostic-report-generator-implementation-plan.md
reports/inspection-standards/dutch-diagnostic-report-generator-implementation-plan.json
```

INSPECT-10 defines a future diagnostic generator contract. INSPECT-10A names
the exact source-file allowlist, exact future output-file allowlist,
blocker-visible output contract, refusal/stop conditions, and static sample
shape for a later internal diagnostic generator. Neither packet implements
`build-scripts/inspection/build-dutch-evidence-pack.js`, creates
`build-scripts/inspection/build-dutch-diagnostic-report.js`, generates a
diagnostic report, generates an evidence pack, or authorises
teacher/school-facing pack work, public/external-facing output, package/CI/
dashboard/quality-ref/Scale Gate integration, lesson-output mutation, product-
route adoption, diagnostics/mastery/PV, or student/product-use work.

Expected outputs:

```text
build-scripts/inspection/build-dutch-evidence-pack.js
reports/inspection-standards/<scope>-evidence-pack.md
reports/inspection-standards/<scope>-evidence-pack.json
```

Acceptance criteria:

- every major claim cites concrete product/review evidence;
- school-owned evidence remains separate;
- weak/missing evidence remains visible;
- package/CI/dashboard/gate integration requires separate approval;
- three-reviewer gate returns `MORE_THAN_SATISFIED`.

### INSPECT-11 - Dutch Bounded Multi-Scope Evidence Packs

Goal: generate and review Dutch evidence packs for more than one authorised
scope.

Conservative scaling order:

1. INSPECT-7 baseline scope re-run;
2. next ready Chapter 1.1 scope if INSPECT-8/9 evidence supports it;
3. Book 1 published-paragraph status only if readiness is proven.

Acceptance criteria:

- no broad all-book generation;
- every scope has readiness evidence;
- differences between ready, weak, missing, and school-owned evidence are
  visible;
- teacher, legal/privacy, and Dutch quality-inspection reviewers return
  `MORE_THAN_SATISFIED`.

### INSPECT-12 - Dutch Teacher/School Evidence Pack

Goal: make the Dutch evidence pack useful as a school/teacher review artifact.

Scope: teacher/school-facing output shape and review.

Required first screen:

```text
Scope
Safe-use note
Evidence summary
Weak or missing evidence
School-owned evidence still needed
Recommended next action
```

Acceptance criteria:

- understandable in 5-10 minutes;
- no inspection approval or compliance claim;
- no personal data;
- school-owned implementation remains explicit;
- three-reviewer gate returns `MORE_THAN_SATISFIED`.

### INSPECT-13 - Dutch Diagnostic Report Surface Decision

Goal: decide whether Dutch quality-control evidence should appear in a
diagnostic report or internal dashboard.

Scope: decision packet first.

Allowed outcomes:

```text
do not integrate
diagnostic report only
internal dashboard summary only
defer pending stronger evidence
```

Forbidden without later explicit approval:

```text
hard CI/build gate
Scale Gate integration
quality-ref integration
generated lesson-output mutation
public-facing status
compliance/approval claim
```

### INSPECT-14 - Dutch Quality-Control Closure

Goal: close the Dutch quality-control package as a reviewed repository layer.

Required closure evidence:

- Dutch source/profile status;
- readiness matrix;
- generator/report outputs;
- teacher/school pack review;
- validation logs;
- lead review;
- teacher, legal/privacy, and Dutch quality-inspection
  `MORE_THAN_SATISFIED` review;
- final human-review packet;
- known gaps and next product decision.

Closure does not authorise non-Dutch work. Any non-Dutch project must start
after Dutch closure in a separate worktree with a separate roadmap.

## 7. Quality Log Requirements

Every future sprint must maintain a quality log when it finds issues.

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

Dutch quality categories:

```text
dutch-source-gap
dutch-profile-gap
target-exercise-finality-gap
exam-code-linkage-gap
target-equivalent-proof-gap
accessibility-evidence-gap
support-evidence-gap
unsafe-claim-risk
lesson-evidence-gap
generated-artifact-staleness
quality-ref-integration-risk
school-implementation-boundary
op0-boundary-risk
privacy-boundary-risk
```

## 8. Current Recommended Next Sprint

Recommended next operational step:

```text
Human review of INSPECT-10A Dutch Diagnostic Report Generator Implementation Plan
```

Recommended posture after human acceptance:

```text
Later INSPECT-10B follow-up only if internal, diagnostic-only, and blocker-visible
Dutch scope only
exact source-file allowlist only
exact output-file allowlist only
no pack-strength Chapter 1.2 generator work
no teacher/school-facing evidence-pack generation
no public-facing or external-facing generated output/report/sharing
no non-Dutch standards work
no dashboard/gate/quality-ref integration
no lesson-output mutation
no personal data
no compliance or approval claims
```

The practical product question carried forward from INSPECT-10A is:

> Are the exact source/output allowlists, refusal contract, and blocker-visible
> output shape safe enough to authorise a later internal INSPECT-10B
> diagnostic generator implementation, or must more Chapter 1.2 generated-
> output, accessibility, support, public/external, or check-surface authority
> remediation happen first?

## 9. Explicit Out-Of-Scope Work

The following work is not part of this roadmap:

```text
non-Dutch standards work
foreign inspection or accountability mappings
public-facing claims
legal compliance claims
inspectorate approval claims
complete OP0/basic-skills claims
student-level personal-data processing
generated lesson-output mutation
hard build/CI gates
Scale Gate integration
quality-ref integration
```

If non-Dutch work is later desired, start a separate worktree and a separate
roadmap after the Dutch quality-control package has reached clean closure.
