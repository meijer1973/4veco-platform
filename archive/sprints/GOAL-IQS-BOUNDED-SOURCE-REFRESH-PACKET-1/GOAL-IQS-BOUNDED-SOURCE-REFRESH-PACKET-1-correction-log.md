# GOAL-IQS-BOUNDED-SOURCE-REFRESH-PACKET-1 Correction Log

Status: specialist_blockers_closed

| Finding | Status | Correction | Proof |
| --- | --- | --- | --- |
| Schema did not strictly encode report-type contracts | closed | Added schema `oneOf` report-type contracts, strict no-output, source inventory summary, jurisdiction coverage, decision/count definitions, and cardinality constraints | Schema/architecture focused re-review PASS; checker schema-instance validation added |
| Generator paths were cwd-dependent | closed | Anchored generator `repoPath()` to `REPO_ROOT` derived from `__dirname` | Generator `--check` passes from outside the repository root |
| Checker did not require jurisdiction-specific core IDs | closed | Added `england_packet_complete` and `flanders_packet_complete` to required core-ID enforcement | Focused Jest mutation coverage added |
| Checker did not directly assert all jurisdiction coverage fragments | closed | Added England and Flanders required-boundary assertions and source-binding checks | Focused Jest mutation coverage added |
| Flanders whole-UK simulation label looked jurisdiction-local | closed | Reworded cross-jurisdiction overclaim labels so Flanders output makes the whole-UK row an out-of-scope cross-jurisdiction refusal | Regenerated Flanders simulation |
| Specialist and final lead records were absent during first architecture review | closed_for_specialist_record | Combined specialist record added; final lead record is produced after final lead subagent review | Checker requires both before final validation |

