# S9a D04 Stale-Reference Audit

Sprint: S9a  
Gate: GATE-CP5-D04-resolution  
Status: completed

## Summary

- Active authored target-exercise citations: `0`
- Protected external exam-question citations: `1`
- Protected machine deprecated-unit records: `2`
- Term reverse-index mentions: `2`
- Active source cleanup required after audit: `false`

## Active Source Findings

`references/authored/course-target-exercises.json` no longer cites `D04` in target exercise `2.1.3` fields `required_skills` or `new_skills_introduced`.

The cleanup is narrow: target exercise `2.1.3` already included `A16`, `A17`, `D11`, `D12`, and `D27`, so removing the retired standalone D04 record does not remove successor coverage.

## Protected External Finding

`references/external/exam-questions.json` still contains one D04 citation. This is intentionally preserved because external exam extraction is machine-refreshed input and is not hand-mutated in S9a.

## Protected Machine Findings

`references/machine/micro-teaching-units.md` and `.json` intentionally retain D04 as a deprecated catalog record with replacement pointers.

`references/machine/begrippen.md` and `.json` may continue to mention D04 through the derived teaching-unit reverse index. That mention is not an active promotion dependency.

## Historical And Generated Mentions

S9/S9a sprint artifacts, CP-5 gate artifacts, earlier R2/R5 provenance records, roadmap snapshots, generated reports, and RAG chunks may mention D04 as historical, generated, deprecated, or non-authoritative provenance.

## Conclusion

D04 no longer remains as an active target-exercise dependency. No `D04 -> A15` edge was added. No exercise promotion or student-facing use is authorized.
