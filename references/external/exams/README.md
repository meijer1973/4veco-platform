# references/external/exams/

CvTE examination papers. The primary ground-truth source for the exercise-first unit catalog: every unit in `references/machine/micro-teaching-units.md` should trace back to a real exam question or a target exercise.

## Policy

- **Never hand-edit PDFs.** These are verbatim CvTE-published exam papers, downloaded and committed as-is for reproducibility.
- File naming convention: `<level>-<year>-tijdvak-<n>.pdf`, e.g. `havo-2025-tijdvak-1.pdf`.
- Source: download from CvTE / cito.nl / examenblad.nl as each cohort's exams are released.

## Expected initial contents

| File | Source |
|---|---|
| `havo-2025-tijdvak-1.pdf` | CvTE havo economie exam 2025, first tijdvak |
| `havo-2025-tijdvak-2.pdf` | CvTE havo economie exam 2025, second tijdvak |
| `vwo-2025-tijdvak-1.pdf` | CvTE vwo economie exam 2025, first tijdvak |
| `vwo-2025-tijdvak-2.pdf` | CvTE vwo economie exam 2025, second tijdvak |

Earlier years (2020–2024) may be added later for trend analysis; defer unless the 2025 audit reveals a need.

## How these are used

During the **exam audit pass** (see `knowledge/micro-teaching-units-plan.md` §9 pass 2), each question in each PDF is analysed and recorded in `reports/exam-question-audit.md` with:

- **Required skills** — which cognitive operations / procedures / concepts the student must execute. Each maps to a unit ID (existing or newly minted via `unit-add`).
- **Question type** — from the canonical taxonomy in `references/authored/vraagtypen-en-opgaveontwerp.md` (rekenen, grafisch, uitleg, casus, multiple choice, etc.).
- **Referenced eindtermen** — which CvTE syllabus codes the question plausibly tests.

These rows feed three diagnostic reports that together make the exam-program vs. exam-reality drift mechanically visible:

- `reports/exam-question-type-distribution.md`
- `reports/exam-vs-program-gaps.md`
- `reports/blueprint-vs-exam-gaps.md`

## Why exam papers live in the platform at all

They are the strongest signal of "what students must actually be able to do." The exam program text implies skills the exam may never test; real exam questions are the ground truth. Keeping the PDFs committed (not just referenced by URL) makes the audit reproducible — anyone rebuilding the reports uses the exact same source material.
