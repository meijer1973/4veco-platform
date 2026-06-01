# GATE-L1.7B-Q2 Human Interview Record

Interview date: 2026-06-01

Reviewed remote commit/hash: `ca2b10333d2006ebe6351b5cf649539f6f12a369`

Status: human answers recorded; closure confirmed as PASS WITH FLAGS.

## Evidence Confirmation

The reviewer rechecked the repository evidence directly before answering:

- implementation result;
- operation chain;
- answer model;
- source data;
- live-output evidence;
- screenshot manifest;
- lead-review round 2;
- implementation checker;
- generated lesson HTML;
- generated shared exit-ticket data;
- uploaded review packet.

The reviewer verified that the generated lesson output exists at the recorded
lesson commit, has the expected title, loads the shared route/task-shell and
exit-ticket assets, and that the landing page has a visible `Check` route with
an `Exit ticket` card.

## Calibration Answers

| Calibration | Answer |
|---|---|
| Gate authority | Yes. This gate reviews the exact `1.1.2` target-equivalent exit-ticket candidate only and does not itself authorize source-data mutation, generated-output mutation, engine implementation, completion-language enablement, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, Scale Gate 1, or product use. |
| Remote evidence | Yes. The evidence is not local-only or hypothetical. The packet was pushed at reviewed remote commit `ca2b10333d2006ebe6351b5cf649539f6f12a369`, and the gate evidence records implementation commits `31e035aaab656f8f64722ac62d26108f829d0f60` and lesson output commit `971bf68402e6071804c44d3aa67c67320a987e33`. |
| Advisory short-check boundary | Yes. The `1.1.1` short check remains advisory. The implementation checker fails if `1.1.1` becomes a target-equivalent exit ticket or target-readiness evidence becomes true. The `1.1.2` candidate keeps `gateApproved: false` and `completionLanguageEligible: false` until this gate authorizes a later exact step. |

## Binding Answers

### L1Q2-Q1: evidence baseline

Decision: accept the evidence baseline.

The implementation result, operation chain, answer model, live-output evidence,
screenshots, source data, lead review, implementation checker, and generated
lesson output are present. No additional screenshot hold is required before
deciding completion language.

### L1Q2-Q2: target-operation coverage

Decision: accept target-operation coverage.

The exit ticket covers the complete `1.1.2` target chain at the same level:

1. calculate percentage change from EUR 800 to EUR 920;
2. calculate a price index from EUR 162 and EUR 150;
3. calculate percentage change from index 108 to 112;
4. explain why 108 to 112 is 4 index points, not 4 percent.

The source implements exactly four tasks matching that chain: three
`calculation_work_capture` tasks and one `short_constructed_response` task.

### L1Q2-Q3: calculation proof criteria

Decision: accept the calculation proof criteria for this reviewed `1.1.2`
candidate.

The calculation tasks require visible work and final answers. The checker also
tests adversarial calculation work and fails if a correct final answer with
bogus work such as `ik gok` matches. Full symbolic parsing is not required for
this narrow target-equivalent candidate.

### L1Q2-Q4: D31 explanation criteria

Decision: accept the D31 criteria.

The answer model requires five criteria: 4 index points, not the same as
percent, old index 108 as denominator, about 3.7 percent, and the student's
4 percent claim being wrong or incomplete. The source data includes required
text groups and reject-text phrases, and the implementation checker rejects a
contradictory D31 answer.

### L1Q2-Q5: deterministic matcher limitation

Decision: accept deterministic matching for this reviewed local proof, with a
carried flag before broader use.

The reviewer accepted that the matcher is deterministic text-group matching,
not symbolic math parsing or semantic language understanding. That does not
block this exact `1.1.2` candidate, but broader use needs further proof.

### L1Q2-Q6: student-facing UI and feedback

Decision: accept the UI and feedback for this gate.

The generated page exists and includes the shared route, task shell,
exit-ticket data, exit-ticket engine, and exit-ticket UI. Live-output evidence
confirms the `Exit ticket` label, four tasks, no internal codes, no held proof
language, local non-claiming completion, mobile route visibility, and dark-mode
readability.

### L1Q2-Q7: advisory short-check boundary

Decision: boundary preserved.

The implementation checker enforces that `1.1.1` stays advisory. The `1.1.2`
candidate is a target-equivalent exit-ticket candidate, but its proof and
completion language remain gate-held before this closure.

### L1Q2-Q8: local completion language

Decision: approve the following local, non-summative completion language for a
later exact implementation step:

```text
Je hebt laten zien dat je de eindopgave van deze paragraaf aankunt.
```

Optional supporting sentence:

```text
Je kunt nu door naar de eindopgave.
```

Still prohibited:

```text
Je beheerst deze paragraaf.
Je krijgt een voldoende.
Je mag automatisch door.
```

### L1Q2-Q9: metadata and flags

Decision: only exact reviewed `1.1.2` flags/copy may change in a later bounded
implementation.

The later implementation must not write broader target-exercise fields, mutate
target-exercise registry records, promote CP-6/Year-1 evidence, or generalize
to other paragraphs.

### L1Q2-Q10: core-specification failures

Decision: no core-specification failure found; only carried flags remain.

The target chain is covered, the tasks are not recognition-only, D31 is
criterion-based and rejects contradictory wording, the student-facing surface
has no internal codes or unauthorized proof language, the advisory `1.1.1`
short check remains advisory, and generated output was produced through the
platform deploy/generator route.

### L1Q2-Q11: next authorized work

Decision: authorize only a later exact completion-language implementation
packet for reviewed `1.1.2`; no product use.

Recommended next sprint:

```text
L1.7B-Q2-COPY - Exact 1.1.2 Target-Equivalent Completion Copy Enablement
```

Scope:

- set only the reviewed `1.1.2` gate/copy flags or equivalent exact fields;
- enable only the reviewed completion copy;
- regenerate only affected `1.1.2` output through platform scripts;
- update evidence/checker so other paragraphs remain blocked;
- preserve no product-wide authority.

### L1Q2-Q12: product authority now

Decision: no.

This gate authorizes no mutation or product use. Closure may only name later
bounded work.

## Pattern Analysis

The answers form a coherent pattern:

- evidence baseline: accept;
- target-operation coverage: accept;
- calculation criteria: accept;
- D31 criteria: accept;
- deterministic matcher: accept locally, carry flag;
- UI/feedback: accept;
- advisory boundary: accept;
- completion language: approve exact local sentence for later implementation;
- metadata/flags: exact `1.1.2` only;
- core-spec failures: none found;
- next work: exact completion-language implementation packet only;
- authority now: no mutation or product authority.

## Closure Confirmation

The reviewer explicitly recommended:

```text
Close GATE-L1.7B-Q2 as PASS WITH FLAGS.
```

This is recorded as explicit human confirmation to write the closure record as
PASS WITH FLAGS and authorize only a later narrow implementation packet for the
reviewed `1.1.2` completion copy.
