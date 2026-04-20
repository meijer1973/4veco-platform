# references/external/exams/

CvTE examination papers. The primary ground-truth source for the exercise-first unit catalog: every unit in `references/machine/micro-teaching-units.md` should trace back to a real exam question or a target exercise.

## Policy

- **Never hand-edit PDFs.** These are verbatim CvTE-published exam papers, downloaded and committed as-is for reproducibility.
- File naming follows CvTE's official code: `<prefix>-<vak>-a-<yy>-<tijdvak>-<suffix>.pdf` where `prefix ∈ {vw, ha}`, `vak=1022` for economie, `yy` is the two-digit year, and `suffix ∈ {o, c}` (opgaven or correctievoorschrift). Example: `vw-1022-a-25-1-o.pdf` = VWO economie 2025 tijdvak 1 opgaven.
- Source: https://www.examenblad.nl (via wrapper URLs that redirect to the PDF CDN).

## Machine-refresh

`build-scripts/references/download-exams.js` fetches the current cohort's papers automatically. Runs idempotently — existing files are skipped unless `--force` is passed.

```
node build-scripts/references/download-exams.js --year 2025
```

The script resolves examenblad's wrapper URLs (e.g. `/2025/vwo/documenten/cse-1/vw-1022-a-25-1-o`) via 303-redirect to the underlying PDF CDN path (e.g. `/system/files/exam-document/2025-05/vw-1022-a-25-1-o.pdf`).

## Current contents (2025 cohort)

| File | Description |
|---|---|
| `vw-1022-a-25-1-o.pdf` | VWO 2025 tijdvak 1 — opgaven |
| `vw-1022-a-25-1-c.pdf` | VWO 2025 tijdvak 1 — correctievoorschrift |
| `vw-1022-a-25-2-o.pdf` | VWO 2025 tijdvak 2 — opgaven |
| `vw-1022-a-25-2-c.pdf` | VWO 2025 tijdvak 2 — correctievoorschrift |
| `ha-1022-a-25-1-o.pdf` | HAVO 2025 tijdvak 1 — opgaven |
| `ha-1022-a-25-1-c.pdf` | HAVO 2025 tijdvak 1 — correctievoorschrift |
| `ha-1022-a-25-2-o.pdf` | HAVO 2025 tijdvak 2 — opgaven |
| `ha-1022-a-25-2-c.pdf` | HAVO 2025 tijdvak 2 — correctievoorschrift |

Earlier years (2020–2024) may be added for trend analysis; call the script with `--year 2024` etc.

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
