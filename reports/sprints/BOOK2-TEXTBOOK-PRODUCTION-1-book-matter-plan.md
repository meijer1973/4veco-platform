# Book 2 front/back matter production plan

Date: 2026-09-05. Author: codex-root. Scope: existing approved Part A book plan,
not chapter production, target mutation or premature assembled-book approval.

## Quality floor and contract

Prepare the required student/answer cover, colophon, concise Dutch use preface
and complete contents while paragraph QC proceeds. Keep all explanations honest
about how the actual paper lesson route works. No digital dependency, answers
in the student edition, unverified school/publisher endorsement, claim of pupil
attainment or fixed classroom timing. Use 12pt minimum including all front/back
matter and footers; simplify rather than shrink. No new illustrations needed.

The full econ-book-builder skill is applied with econ-chapter-assembler and
econ-pdf-builder already read for this task. The newer approved root/sprint
contract expressly overrides legacy website-only answers and eleven-point
preface advice: there are two separate paper books and a twelve-point floor.
Actual assembly remains blocked on accepted chapters, not on this drafting.
Root plan LF hash is
`b6ae8e07e05337838dc38b2838a6e5db43b2e153569fa5bc490cf4bfeb8d7a76`;
its historical pending wording is controlled by separate actual release evidence.

## Sources and scope

Use actual root book/chapter plans, the frozen twelve records and approved
boundary/terminology sources. Preface accurately describes goals → teaching →
worked example → recap → Start → optional guided support → independent task →
target → optional enrichment / closing retrieval. Mixed paragraphs combine prior
teaching. Do not copy Book 1 preface's stale target-first or website-only claims.

The repository LICENSE records Copyright (c) 2026 M. Meijer and MIT License.
Preserve its full permission/warranty notice in each book's eventual back matter
instead of asserting additional permissions. This is reproduction of the
repository notice, not a newly granted content licence or legal analysis.
Cover carries no author, no module eyebrow, no invented institution/endorsement.
Colophon identifies the same material and edition; learning questions go to the
reader's economics teacher, without inventing personal contact details.

Allowed new authored sources under build-scripts/books/book-manifests:

- `book-2-voorwoord.md`: complete student front matter.
- `book-2-antwoorden-voorwoord.md`: complete answer front matter.
- Later, after all paragraphs/chapters are accepted: `book-2-nawerk.md` and
  `book-2-antwoorden-nawerk.md` for reviewed terminology/formula references and
  exact licence notice. No placeholder educational back matter now.

The future four source pins go into the already reviewed book2-frozen-part-a
profile. **Do not create book-2.json now:** all six final chapter source hashes,
exact edition-specific asset maps and approved front/back matter must exist first.

## Procedure, evidence and gates

1. Draft both fronts with separate explicit IDs, page breaks, an under-300-word
   use preface, and all three chapters / twelve paragraphs in exact order.
   TOC links use existing book profile stable chapter/paragraph anchors.
2. Check no external image/script/URL/answer dependency, duplicate IDs, missing
   entries, wrong edition links, student target solutions, or new economics
   claims. Validate Pandoc structure. Compare cover/title/contents to root plan.
3. Independent non-author content/structural review is required before front
   source acceptance. This draft is not its own review. Carry exact commit/hash
   forward; any later change must be re-reviewed.
4. After accepted chapter outputs, derive only already taught terms and formulas
   from actual sources, preserving all model bounds and frozen Ei semantics.
   Review alphabetized glossary and chapter-ordered reference matter for
   completeness, no new teaching and no conceptual drift. Book formulas must not
   turn finite changes into unsupported local/general rules.
5. Assemble only with all exact pins and action currentness/durable checks.
   Actual final HTML must resolve every TOC ID/link uniquely. Validate both PDF
   editions, inspect every front/back page at normal scale with the whole book,
   record raw source/output/page hashes and independent actual findings.
6. Publish candidate evidence normally; finish independent book/lead reviews
   and paired CI/readiness with the full package. No future merge authorization.

## Stop conditions and named omissions

Missing chapter approval, stale source/hash, missing required term/formula,
unresolved navigation, tiny/clipped layout, student-answer leakage or inaccurate
route claims stop assembly/acceptance. Repair owned source and regenerate.
Unfinished chapters are expected pending work, not a reason to fake pins or
promote fixtures. Empirical classroom timing/attainment and digital companions
remain separate named follow-ups. School-branded publication identity is not
invented from a historical school-fit overlay; this internal paper package uses
neutral course/edition identification. Next: draft fronts, then independent
review and later actual chapter-derived back matter.
