# Dutch Quality Control Roadmap

Status: proposed Dutch-only roadmap
Repository: `4veco-platform`
Primary target path: `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
Secondary evidence target: `../4veco-lessen/`
Roadmap ID: `dutch-quality-control`
Roadmap version: `v2.10-inspect-11d-paired-repair-readiness-closure`
Sprint status: `QS-DUTCH-ROADMAP-1` closed / Dutch-only proposal ready for human review; `QS-DUTCH-ROADMAP-1A` closed / PR prep complete; `QS-DUTCH-ROADMAP-1B` closed / CI repair ready for PR validation; `INSPECT-8` closed / readiness audit complete; `INSPECT-9` closed / gap-closure plan complete; `INSPECT-9A` closed / Chapter 1.2 target and exam-linkage source remediation complete; `INSPECT-9B` closed / Chapter 1.2 target-equivalent and accessibility/support review complete; `INSPECT-9C` closed / Chapter 1.2 proof and support remediation complete; `INSPECT-10` closed / diagnostic-only generator planning accepted and merged; `INSPECT-10A` closed / implementation-plan packet accepted and merged; `INSPECT-10B` closed / merged internal diagnostic generator; `INSPECT-10C` closed / diagnostic generator stability hardening merged; `INSPECT-10D` closed / internal diagnostic tool operating procedure merged; `INSPECT-11` closed / internal diagnostic scope readiness audit merged; `INSPECT-11A` closed / Chapter 1.3 diagnostic readiness remediation plan merged; `INSPECT-11B` closed / Chapter 1.3 readiness remediation and diagnostic tool health repair merged; `INSPECT-11C` closed / Chapter 1.3 lesson-side reconciliation and proof remediation merged; `INSPECT-11D` in progress / Chapter 1.3 paired lesson repair and readiness closure
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
| `INSPECT-10A` | Diagnostic report generator implementation plan; names exact future source files, output files, refusal/stop conditions, and static output shape for a later internal generator. The three-reviewer gate returned `MORE_THAN_SATISFIED` from teacher, legal/privacy, and Dutch quality-inspection roles. It creates no generator code and no diagnostic report. |
| `INSPECT-10B` | Internal diagnostic report generator implementation; creates a manually invoked internal generator and a Chapter 1.2 diagnostic report pair from the exact INSPECT-10A source allowlist while preserving all blockers. PR #79 merged it as internal diagnostic only. |
| `INSPECT-10C` | Diagnostic generator review / stability hardening; checks the merged generator/report pair for Markdown/JSON alignment, source-hash stability, refusal coverage, blocker visibility, and stable post-merge owner action. It creates no evidence pack, teacher/school-facing pack, public/external output, package/CI/dashboard/quality-ref/Scale Gate integration, source-registry mutation, or generated lesson-output mutation. |
| `INSPECT-10D` | Internal diagnostic tool acceptance and operating procedure; defines when the manual generator may be run, required preconditions and post-run checks, changed-output semantics, byte-stable checkout expectations, and stop conditions before any broader use. It creates no new report output, generator behavior, integration, or downstream authority. |
| `INSPECT-11` | Internal diagnostic scope readiness audit; compares Chapter 1.1 control, current Chapter 1.2 diagnostic scope, Chapter 1.3 candidate evidence, and Chapter 1.4/1.5 controls before any new diagnostic report is generated. It creates no new diagnostic report, evidence pack, teacher/school-facing output, public/external output, integration, generated lesson-output mutation, protected-reference mutation, personal-data processing, or downstream authority. |

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

Current authority update after INSPECT-9C, INSPECT-10, INSPECT-10A,
INSPECT-10B, INSPECT-10C, and INSPECT-10D:

The original broad implementation goal remains blocked. INSPECT-10 exists as
accepted diagnostic-only generator planning with Chapter 1.2 blockers visible.
INSPECT-10A exists as accepted implementation planning for a narrow internal
diagnostic generator. INSPECT-10B implements only that narrow internal
diagnostic generator and generated Chapter 1.2 diagnostic report pair.
INSPECT-10C reviewed and hardened that manual internal tool's stability only.
INSPECT-10D is the permitted follow-up to decide the internal operating
procedure for invoking the tool without widening its audience, integration, or
authority. The relevant packets and generated outputs are:

```text
archive/sprints/INSPECT-10/
reports/inspection-standards/dutch-report-only-generator-diagnostic-planning.md
reports/inspection-standards/dutch-report-only-generator-diagnostic-planning.json
archive/sprints/INSPECT-10A/
reports/inspection-standards/dutch-diagnostic-report-generator-implementation-plan.md
reports/inspection-standards/dutch-diagnostic-report-generator-implementation-plan.json
archive/sprints/INSPECT-10B/
archive/sprints/INSPECT-10C/
archive/sprints/INSPECT-10D/
docs/inspection-standards/internal-diagnostic-tool-operating-procedure.md
build-scripts/inspection/build-dutch-diagnostic-report.js
build-scripts/inspection/check-dutch-diagnostic-report-stability.js
reports/inspection-standards/chapter-1-2-diagnostic-report.md
reports/inspection-standards/chapter-1-2-diagnostic-report.json
```

INSPECT-10 defines a future diagnostic generator contract. INSPECT-10A names
the exact source-file allowlist, exact future output-file allowlist,
blocker-visible output contract, refusal/stop conditions, and static sample
shape for a later internal diagnostic generator. INSPECT-10B creates
`build-scripts/inspection/build-dutch-diagnostic-report.js` and the Chapter 1.2
internal diagnostic report pair. It does not implement
`build-scripts/inspection/build-dutch-evidence-pack.js`, generate an evidence
pack, or authorise teacher/school-facing pack work, public/external-facing
output, package/CI/dashboard/quality-ref/Scale Gate integration, lesson-output
mutation, product-route adoption, diagnostics/mastery/PV, or student/product-
use work. INSPECT-10C may add only manual stability checks and narrow
alignment/staleness fixes for that internal diagnostic report pair. INSPECT-10D
may define only operating procedure, preconditions, post-run checks,
changed-output semantics, byte-stable checkout expectations, and stop
conditions for the existing internal tool.

Original broad expected outputs remain blocked:

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

### INSPECT-10D - Internal Diagnostic Tool Acceptance And Operating Procedure

Goal: decide whether the manual internal diagnostic generator may be kept as a
stable internal tool, and define exactly how agents may invoke it without
creating new authority.

Scope: operating procedure, byte-stable checkout repair, and review packet
only.

Expected outputs:

```text
archive/sprints/INSPECT-10D/
docs/inspection-standards/internal-diagnostic-tool-operating-procedure.md
```

Acceptance criteria:

- document when the manual generator may be run;
- document required preconditions before running it;
- document required post-run checks;
- document what changed output means;
- document that generated diagnostic output is internal-only;
- document that every broader use requires a new human-reviewed sprint;
- keep any report-pair refresh non-semantic and limited to reproducible
  byte-stability metadata;
- do not generate new scopes;
- do not change generator behavior;
- do not add package scripts, CI, dashboard gates, quality-ref, or Scale Gate
  integration;
- preserve blocks on evidence packs, teacher/school-facing output,
  public/external output, product-route adoption, diagnostics/mastery/PV,
  student/product-use, generated lesson-output mutation, protected-reference
  mutation, personal-data processing, and compliance/approval claims.

### INSPECT-11 - Internal Diagnostic Scope Readiness Audit

Goal: determine whether the internal diagnostic tool can safely be considered
for a Dutch scope beyond the current Chapter 1.2 report pair, and identify the
next candidate scope without generating any new diagnostic report.

This section supersedes the older INSPECT-11 evidence-pack implementation row
for this sprint only. The older multi-scope evidence-pack work remains
blocked until a later human-reviewed sprint explicitly authorises it.

Required candidate comparison:

1. Book 1 Chapter 1.1 first-three baseline as control scope;
2. Book 1 Chapter 1.2 as current internal diagnostic scope;
3. Book 1 Chapter 1.3 as candidate under test;
4. Book 1 Chapter 1.4 / 1.5 as not-ready controls.

Expected outputs:

```text
archive/sprints/INSPECT-11/
reports/inspection-standards/internal-diagnostic-scope-readiness.md
reports/inspection-standards/internal-diagnostic-scope-readiness.json
```

Acceptance criteria:

- no new diagnostic report is generated;
- no evidence pack is generated;
- every candidate has blockers listed with `blocks`, `does_not_block`, and
  `proof_required_to_close`;
- Chapter 1.2 remains internal diagnostic only;
- no scope is declared pack-strength;
- no teacher/school-facing, public/external, Scale Gate, product-route,
  diagnostics/mastery/PV, student-use, or product-use authority is unlocked;
- the recommendation names only a next planning/remediation step, not report
  generation;
- lead review and specialist reviews are complete before human review if the
  audit recommends considering a new diagnostic scope.

### INSPECT-11A - Chapter 1.3 Diagnostic Readiness Remediation Plan

Goal: convert the INSPECT-11 Chapter 1.3 recommendation into a concrete
planning/evidence-readiness remediation packet before any later diagnostic
report generation is considered.

Scope:

- inventory `1.3.1` through `1.3.4` source-registry target status;
- reconcile lesson-side quality-ref/review state, including stale
  `1.3.1-quality-ref.yaml` blocker language versus the later
  `1.3.1-review.md` correction;
- design per-target proof records for operation-chain match, answer-form
  match, scaffold/no-answer-before-attempt boundary, and local-only authority;
- record an explicit `1.3.4` integration/no-code decision route;
- design accessibility, support, companion/advisory, next-action, and
  product/school-boundary proof requirements;
- keep every blocker fielded with `blocks`, `does_not_block`, and
  `proof_required_to_close`.

Expected outputs:

```text
archive/sprints/INSPECT-11A/
reports/inspection-standards/chapter-1-3-diagnostic-readiness-remediation-plan.md
reports/inspection-standards/chapter-1-3-diagnostic-readiness-remediation-plan.json
```

Acceptance criteria:

- no new diagnostic report is generated;
- no evidence pack is generated;
- no generated lesson output, protected reference, or source-registry record is
  mutated;
- Chapter 1.3 is not declared diagnostic-ready, pack-strength, or
  teacher/school-facing ready;
- the remediation plan cites product end-state and original sprint/gate spec;
- all carried issues include `blocks`, `does_not_block`, and
  `proof_required_to_close`;
- lead review and specialist reviews are complete before human review;
- the recommendation names only a later bounded remediation/proof route, not
  report generation.

### INSPECT-11B - Chapter 1.3 Readiness Remediation And Diagnostic Tool Health Repair

Goal: produce the full post-INSPECT-11A remediation packet before any later
Chapter 1.3 diagnostic report implementation plan is considered.

Scope:

- repair or formally classify the existing Chapter 1.2 diagnostic
  byte-stability mismatch;
- reconcile current `1.3.1` through `1.3.4` lesson-side quality-ref/review
  status against source-registry target status;
- create route-local proof-record candidates for operation-chain match,
  answer-form match, scaffold/no-answer-before-attempt boundary, and
  local-only authority;
- decide the `1.3.4` integration/no-code/no-new-theory posture;
- create accessibility/support and companion/advisory evidence decisions;
- keep every blocker fielded with `blocks`, `does_not_block`, and
  `proof_required_to_close`.

Expected outputs:

```text
archive/sprints/INSPECT-11B/
reports/inspection-standards/chapter-1-3-readiness-remediation-results.md
reports/inspection-standards/chapter-1-3-readiness-remediation-results.json
```

Acceptance criteria:

- the existing Chapter 1.2 diagnostic report pair is byte-stable or the exact
  blocker remains explicit;
- no Chapter 1.3 diagnostic report is generated;
- no evidence pack is generated;
- no generated lesson output, protected reference, or source-registry record is
  mutated;
- Chapter 1.3 is not declared diagnostic-ready while any core requirement is
  missing;
- lead review and specialist reviews are complete before human review.

### INSPECT-11C - Chapter 1.3 Lesson-Side Reconciliation And Proof Remediation

Goal: decide whether Chapter 1.3 can move to a later internal diagnostic
implementation-plan sprint, must remain blocked with narrowed repairs, or should
be rejected as the next diagnostic candidate because lesson-side divergence is
too large.

Scope:

- reconcile current `1.3.1` through `1.3.4` quality-ref/review state;
- resolve or formally carry the `1.3.4` lesson-output / registry divergence;
- create exact route-local proof-record candidates with exercise IDs, line
  ranges, answer/model separation, and scaffold/no-answer-before-attempt
  boundaries;
- record accessibility/support and companion/advisory evidence as blockers
  where proof is missing;
- answer whether an INSPECT-11D internal diagnostic implementation-plan sprint
  is allowed or still blocked.

Expected outputs:

```text
archive/sprints/INSPECT-11C/
reports/inspection-standards/chapter-1-3-reconciliation-and-proof-remediation.md
reports/inspection-standards/chapter-1-3-reconciliation-and-proof-remediation.json
```

Acceptance criteria:

- no Chapter 1.3 diagnostic report is generated;
- no evidence pack is generated;
- no generated lesson output, protected reference, or source-registry record is
  mutated;
- missing proof is classified as a blocker and is not carried as PASS WITH
  FLAGS;
- all carried issues include `blocks`, `does_not_block`, and
  `proof_required_to_close`;
- lead review and specialist reviews are complete before human review;
- the recommendation does not authorise report generation, product-route
  adoption, Scale Gate, diagnostics/mastery/PV, or student/product-use work.

### INSPECT-11D - Chapter 1.3 Paired Lesson Repair And Readiness Closure

Goal: close the concrete Chapter 1.3 blockers narrowed by INSPECT-11C through
coordinated platform and lesson work, then return one readiness result for
human review.

Allowed readiness outcomes:

```text
A. Chapter 1.3 is ready for a later internal diagnostic implementation-plan sprint.
B. Chapter 1.3 remains blocked, but only by narrowly identified residual repairs.
C. Chapter 1.3 is excluded as the next diagnostic scope.
```

Scope:

- repair the `1.3.4` lesson-output/source-registry divergence through platform
  source/generator changes and regenerated lesson output;
- reconcile `1.3.1` through `1.3.4` quality-ref/review state;
- produce exact route-local proof records with exercise IDs, line ranges,
  operation-chain match, answer-form match, and no-answer-before-attempt
  boundary;
- produce rendered mobile/desktop accessibility and support evidence;
- resolve companion/advisory status through reviewed evidence or explicit
  not-applicable decision;
- formalise source traceability for authored-registry versus stale-blueprint
  ambiguity.

Expected outputs:

```text
archive/sprints/INSPECT-11D/
reports/inspection-standards/chapter-1-3-readiness-closure.md
reports/inspection-standards/chapter-1-3-readiness-closure.json
docs/inspection-standards/chapter-1-3-source-traceability.md
Platform PR first, lesson PR second
```

Acceptance criteria:

- platform source/generator changes drive any lesson output changes;
- paired platform and lesson PRs are open, mergeable, and green before human
  review;
- the packet uses REV-STD-1 and cites product end-state plus original
  sprint/gate spec;
- all core requirements are checked and missing core requirements block rather
  than appear as PASS WITH FLAGS;
- carried issues include `blocks`, `does_not_block`, and
  `proof_required_to_close`;
- lead and specialist subagent reviews are complete and corrections are logged;
- no Chapter 1.3 diagnostic report is generated;
- no evidence pack is generated;
- no product-route adoption, Scale Gate, diagnostics/mastery/PV, student-use,
  or product-use authority is unlocked.

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
Complete INSPECT-11D Chapter 1.3 paired lesson repair and readiness closure
```

Recommended posture after INSPECT-11C merge:

```text
accept or revise only INSPECT-11D paired repair/readiness closure output and its state A/B/C recommendation
do not generate a Chapter 1.3 diagnostic report during INSPECT-11D
do not generate a Chapter 1.3 evidence pack during INSPECT-11D
keep the older multi-scope evidence-pack INSPECT-11 row blocked
keep Chapter 1.3 implementation-plan and diagnostic report generation blocked unless INSPECT-11D core proof closes and renewed human review accepts that closure
keep Chapter 1.2 pack-strength, teacher/school-facing, and public/external work blocked
keep package/CI/dashboard/quality-ref/Scale Gate integration blocked
allow only the named paired Chapter 1.3 generated-output repair through platform source and regenerated lesson output
keep product-route adoption, diagnostics/mastery/PV, and student/product-use authority blocked
keep non-Dutch standards work out of this roadmap
keep personal-data processing and compliance/approval claims blocked
```

The practical product question carried forward from INSPECT-11C into
INSPECT-11D is:

> After the paired repair, is Chapter 1.3 ready for a later internal diagnostic
> implementation-plan sprint, still blocked only by narrow residual repairs, or
> excluded as the next diagnostic scope?

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
