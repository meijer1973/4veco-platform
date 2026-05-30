# GATE-MTU-H4B Human Review Record

Recorded: 2026-05-30

Reviewed remote commit: `f59c83a7067678aa3ff2c4bab4455ab9d90d72af`

Verdict: **PASS WITH CONDITIONS for authorizing a later bounded H4B execution sprint.**

The H4B packet may move from execution-packet review to a narrowly scoped
execution sprint for `A80`, `A81`, and `A96`-`A99`, provided the sprint
preserves generator-blocked/non-interactive status and does not write
target-exercise fields, candidate storage, projections, lesson output, or
product-facing routes.

## Calibration Answers

| Calibration | Answer |
|---|---|
| This gate reviews H4B execution only and does not itself authorize mutation/product use. | Yes. |
| The H4B packet, review packet, sprint logs, checker, and cited evidence have been pushed before review starts. | Yes, based on remote fetchability. Closure should record the reviewed remote commit/hash. |
| `A100` remains invalid, `A71` remains held, candidate storage remains absent, and proposed answer-form IDs are not live until later execution authorization. | Yes. The remote packet shows `A96`/`A97`/`A98`/`A99`/`A80`/`A81` absent, `A71` absent/held, `A100` rejected by the two-digit ID regex, and candidate storage absent. |

## Review Answers

| Question | Decision | Rationale |
|---|---|---|
| Q1 - Remote evidence and baseline | Accept. | H4A closed with accepted IDs and carried-forward conditions; H4B confirms the accepted lanes, held lanes, and baseline state. |
| Q2 - ID allocation and future policy | Approve this bounded allocation. | `A80`, `A81`, and `A96`-`A99` are acceptable for this sprint. `A100` remains invalid, `A71` remains held, and future A-domain growth requires ID-policy or namespace review. |
| Q3 - A96 bereken command | Approve. | `A96` cleanly encodes the calculation answer form: read requested quantity/unit, show formula, substitute values, show intermediate steps, answer with unit/notation, and conclude in context. |
| Q4 - A97/A98/A99 explanation commands | Approve all three as separate lanes. | `uitleg_dat`, `uitleg_of`, and `leg uit met voorbeeld` require different answer structures and should not be collapsed into one generic explanation unit. |
| Q5 - A80 noem/geef aan | Approve with split-if-needed condition. | `A80` is acceptable as concise identification. A future split remains required if reviewed evidence shows `geef aan` requires a different answer procedure from `noem`. |
| Q6 - A81 bron modifier | Approve. | `A81` is a source-use modifier, not a complete answer form. It must combine with an underlying answer form such as calculation, explanation, classification, or graph response. |
| Q7 - Generator exposure | Approve with non-exposure proof. | The planned units declare generators but do not yet have implementations. H4B requires generator implementation or generator-blocked/non-interactive status before student-facing exposure. Current blocked interactive leak count is zero. |
| Q8 - Held lanes and EX overlays | Approve. | Graph/draw/shade, Type 4 motiveer/classificatie, and analysis/evaluation remain held. q3/q15 EX overlays remain visible; candidate storage is absent and writes are unauthorized. |
| Q9 - Validation and rollback | Accept. | Simulated catalog validation passed for all six units, exam-code validation passed, and the later execution stack includes H4B checker, build index, schema validation, course-target validation, generator-readiness rebuild/check, report JSON validation, Jest, and `git diff --check`. |
| Q10 - Next sprint and authority | Authorize a bounded execution sprint only. | The next sprint may execute the six reviewed `unit-add` commands. It must not create candidate storage, write target-exercise fields, refresh generated projections beyond required validation outputs, mutate lesson output, or expose student-facing routes. |

## Conditions For The Later Execution Sprint

1. Record the reviewed remote commit/hash.
2. Run final preflight: `A80`, `A81`, `A96`, `A97`, `A98`, and `A99` absent; `A71` still held/unconsumed; `A100` still rejected as invalid; `answer-skill-candidates.json` absent; and no target-exercise `question_type` or `answer_form` fields written.
3. Print each exact unit spec before execution and verify it matches the reviewed command hash.
4. Accept the `unit-add` no-dry-run limitation only with simulated catalog validation and exact command review.
5. After minting, rebuild generator readiness and mark `GEN_A80`, `GEN_A81`, and `GEN_A96`-`GEN_A99` as implemented or generator-blocked/not-yet-interactive. No student-facing skill-tree route may expose them until that status is safe.
6. Do not write target-exercise fields. `question_type` and `answer_form` fields are out of scope for H4B execution.
7. Do not create or write EX candidate storage. q3/q15 EX overlay needs remain visible only.
8. Do not refresh generated projections as a source mutation side effect. Only validation/report outputs required by the execution sprint should change; target-exercise field mapping and product-facing routes remain separate gates.

## Main Risk

The main risk is premature exposure. These units will be live MTUs after
execution but likely generator-blocked. The sprint must prove they cannot leak
into student-facing skill-tree, PV, lesson, diagnostic, or adaptive routes
until generator readiness and product gates are separately satisfied.

## Quality Log

| Issue | Severity | Next action | Proof required |
|---|---:|---|---|
| A-domain ID exhaustion after H4B | High for future work | Execute only this bounded allocation; require later ID-policy/namespace review. | Closure states future A-domain growth needs policy. |
| `unit-add` no dry-run | Medium | Use simulated validation and exact command logging. | Execution log includes specs and command hashes. |
| Missing generators | High if exposed | Mark generator-blocked or implement. | Generator-readiness report shows no exposed missing generators. |
| `A81` modifier could be misused | Medium-high | Keep explicit modifier boundary. | No mapping treats `A81` as standalone answer form. |
| EX overlays could be hidden | High | Keep q3/q15 visible; no candidate writes. | No `answer-skill-candidates.json` created. |
| Target-exercise field writes out of scope | Medium | Separate authored-reference packet only. | No `question_type` or `answer_form` diffs. |
