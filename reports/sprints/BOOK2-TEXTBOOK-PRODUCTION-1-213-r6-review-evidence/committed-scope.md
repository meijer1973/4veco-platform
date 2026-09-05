# Actual committed R6 review scope

Platform payload5765265dfa52e2bc4f938c835608095272bad463 and paired lesson
payload576c5f4bb919611466e4511d2b4938a8195f6972 were committed before these checks.
The concrete commands, exits and full native results are in command-log.jsonl
and committed-scope.json. This tail records evidence, not a new pupil payload.

| Actual committed comparison | Native result | Meaning |
|---|---|---|
| platform2ee27510… to5765265d…; shared | exit1 | All19 files correctly classify as review_evidence, zero unknown/other paths; generic shared lane additionally requires source changes |
| platform199772e2… to5765265d…; shared | exit0/PASS | Complete R6 candidate plus actual committed review evidence is in scope |
| lessons56f43382… to576c5f4…; textbook | exit0/PASS | Exactly the renewed canonical213-review.md |
| lessons4c4cd7d0… to576c5f4…; textbook | exit0/PASS | R6's7 artifact changes plus canonical review; no quality-ref or Part B change |

Explicit own-path audit also passes: only uniquely prefixed sprint evidence
and the one canonical review were added/changed. The native evidence-only
failure is not hidden, waived or called a standalone shared-lane PASS. No fake
source change was made to satisfy the generic source-presence requirement.
The complete-candidate checks use genuine pre-R6 bases, not fabricated fixtures.
Generated indexes will be a separate index-only tail; canonical quality-ref,
handoffs, plans, targets, holds and all prior211/212 pins remain untouched.
