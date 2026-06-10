# BLUEPRINT-3Y-RECONCILE-1 Quality Log

Status: non-mutating quality log

| Issue | Severity | Evidence | Why it matters | Next action |
|---|---:|---|---|---|
| v4 is partial Year 1, not a full three-year blueprint | High | `references/owned/course-blueprint-v4.meta.json` has `completion_status: partial_year_1_of_3` | Prevents agents from treating v4 as final-course authority | Keep v4 as historical evidence only. |
| v4 printed test-preparation architecture conflicts with v5 | High | v4 Chapter 5 test-preparation sections; v5 core decisions | Reintroducing printed test-prep chapters would contradict the active baseline | Preserve v5 web-only test-preparation policy. |
| v5 is active but only covers Books 1-4 | High | `course-blueprint-v5.md` and meta | v5 cannot by itself describe the full mature course | Embed v5 as Year 1 inside v6 draft. |
| Older three-year concept proposes 13 books | High | `knowledge/three Year blue print.md` | Conflicts with the requested 11-book / 4 + 4 + 3 model | Compress bridge/final-exam material into Books 8, 9, and 11. |
| Older concept has stale A45+ assumptions | Medium-high | `REF-CT0-source-authority-boundary.md`; `CP.6c-mtu-backfill-classification.md`; live MTU registry | It treats some A45+ labels as rough proposals even though current ids now have live registry history | Treat these as registry facts and review mappings; do not re-mint. |
| D04 treatment is stale in older concept | Medium | `REF-CT0-source-authority-boundary.md`; reference roadmap status text | The concept treats D04 as unresolved, while later work retired it through CLI-only mutation | Use successor records and do not revive D04. |
| v5 placeholders are visible but not reviewed-final | High | `course-blueprint-v5.md`; `REF-CT0-mtu-classification.md` lists 11 needs-evidence placeholder records | Final Year 1 coverage claims would be overstated if placeholders are counted as reviewed | Route placeholder consolidation paragraphs through target-exercise review. |
| Exam-ingestion north star is broader than current planning docs | High | `references/reference-team-roadmap.md`; `product-end-state.md` | The final blueprint must trace correction-model and answer-form operations, not only content headings | Use the v6 exam-operation spine as the central review table. |
| Year 2 Book 8 compression has overload risk | Medium-high | 13-book concept split growth/public finance into a bridge book; v6 compresses to 11 books | Game theory, public goods, redistribution, growth, and public finance could become too broad | Human review must check load and decide paragraph counts before production. |
| Book 11 final exam role could be mistaken for a separate twelfth/thirteenth book | Medium | 13-book concept had separate Book 12/13 integration/final exam training | Final exam training must fit the 4 + 4 + 3 calendar | Make Book 11 explicitly both integrated policy and final exam training. |
| Official exam anchors are not filled per operation yet | High | Roadmap says exam-ingestion repair/source authority work is still active | Paragraph-level production without official anchors can drift back into syllabus/content-first design | Fill operation rows from reviewed exam-ingestion records before production. |
| Machine-reference mutation is out of scope | High | `build-scripts/references/README.md`; `references/machine/README.md` | Hand edits break registry integrity and contradict repository policy | Use CLI-only mutation after human review; no mutation in this sprint. |

## Closure Boundary

This quality log records planning risks only. It does not authorize protected reference mutation, target-exercise promotion, placeholder closure, lesson-output generation, diagnostics, adaptive routing, mastery decisions, automatic sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or Scale Gate authority.
