# §2.2.1 R8 — builder payload mapping and scope verification

Builder: book2_short_alt_correction_builder. Date: 2026-09-05.
Candidate only; independent paragraph review and distinct specialist QC pending.

Paired branch agent/book2-short-alt-correction-20260905, owned directories
C:/wt/book2-short-alt-correction-20260905/{4veco-platform,4veco-lessen}.

| Payload | Exact commit | Scope |
|---|---|---|
| Platform source/test/proof/self-QA | aeb2d39e82094fc6c5693a8cbdde2a1fd5622446 | Three §221 source/test files;38 evidence files, no other paragraph |
| Lessons generated metadata | 8a71fa62e0894b06afde946292f9d71123699504 | Exactly paragraph MD/HTML and fig1 SVG; all PDF/PNG bytes unchanged |

The subsequent verification-evidence commit includes this map and final actual
scope logs plus Markdown-log LF normalization. The later generated-index tail
is separate and is not lesson/correction payload. Exact final heads and normal
push results are reported to root after they exist, not predicted in this file.

Actual committed-base checks both PASS, recorded in SHORT-ALT command log:

```text
node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base 199772e2aa586fce0f71b647ed5188e568dba2e5 --head HEAD
node build-scripts/workflows/check-paragraph-lane-scope.js --lane textbook --cwd ../4veco-lessen --base 4c4cd7d0c1d2e5242c818399a96dce3e26013e9c --head HEAD
```

Platform HEAD at these checks was aeb2d39e82094fc6c5693a8cbdde2a1fd5622446,
lesson HEAD8a71fa62e0894b06afde946292f9d71123699504. Checks classified all actual
changes, not synthetic fixtures or selected path subsets. Both original owned
claims still matched; both origin fetches succeeded immediately before commits.
No target, protected reference, plan, hold, canonical review/QC/handoff, helper,
guard or other paragraph change appears in the payload. Generator/rebuild,
12source tests, exact HTML/native-alt/caption effects, all3PDF/all20page byte
identity, zero-delta3PNG rerasterization and normal PartA profiles are in the
separate builder execution and mechanical records. All26 fresh visual checks
(20full pages,3full figures,3gray pages) are personally attributed builder QA.

One publication diagnostic is retained explicitly: the initial staged diff check
reported CR characters as trailing whitespace inside the runner-generated Markdown
command excerpts; the sequential shell continued to commit. The actual command
JSONL retains escaped original outputs, original SHA-256 values and exit codes.
Only the Markdown presentation was mechanically normalized CRLF/CR→LF, without
changing its diagnostic words. Repeated actual-base git diff --check then passed.
This is an evidence-format repair, not a removed failure or changed test result.

Use the platform payload plus its verification-evidence follow-up and the lesson
payload for root adoption. Do not adopt the generated index tail wholesale.
No PR, merge, successor pin, independent acceptance, full-suite, remote CI or
classroom timing/attainment claim is made by this publication record.
