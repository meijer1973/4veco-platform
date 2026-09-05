# Sprint BOOK2-TEXTBOOK-PRODUCTION-1-221-QC-r7: Command Log

## C:/Python314/python.exe build-scripts/content/book-2/221/test_source.py

- cwd: `C:\wt\book2-221-r7-qc-20260905\4veco-platform`
- started_at: `2026-09-05T18:54:28.136Z`
- finished_at: `2026-09-05T18:54:28.570Z`
- duration_ms: `434`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `4f50c63366efd9f20a1470ff2979f90a5584c86f35fc30c0530a192c172a2ca9`

### stdout excerpt

```text

```

### stderr excerpt

```text
..........
----------------------------------------------------------------------
Ran 10 tests in 0.012s

OK

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-QC-r7-probes.py

- cwd: `C:\wt\book2-221-r7-qc-20260905\4veco-platform`
- started_at: `2026-09-05T18:54:29.260Z`
- finished_at: `2026-09-05T18:54:30.839Z`
- duration_ms: `1579`
- exit_code: `0`
- stdout_sha256: `350e3cb1ca96d447b35fd8d3f0535110df07c66794cf13216085a83de90be2ad`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
PASS 0: all document sets, thin builder, references and exactly three paired assets
PASS: exact six replacements; 55 raw hashes; protected inputs; 8 rational cases; all page hashes

```

### stderr excerpt

```text

```
## C:/Python314/python.exe build-scripts/content/book-2/221/check_render.py --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-QC-r7-diagnostic-manifest.json --rebuild --output reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-QC-r7-render-check.json

- cwd: `C:\wt\book2-221-r7-qc-20260905\4veco-platform`
- started_at: `2026-09-05T18:54:31.608Z`
- finished_at: `2026-09-05T18:54:37.523Z`
- duration_ms: `5915`
- exit_code: `0`
- stdout_sha256: `65d612cab66c399f456766d73665dbb2aa982f5f756667558bf3591a2bc911a4`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.2.1
Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard
{
  "paragraph": "2.2.1",
  "visual_acceptance": "NOT_SUPPLIED_BY_THIS_SCRIPT",
  "automated_status": "PASS",
  "documents": [
    {
      "kind": "paragraaf",
      "pdf_sha256": "98bf4923b4e3b8e49fa3b9d1b7daf71392c6c76ef8cea63aab12c44749cda1a6",
      "pages": 10,
      "minimum_printed_text_pt_including_footer": 12.0,
      "minimum_placed_figure_label_pt": 12.221,
      "proof_directory": "C:\\wt\\book2-221-r7-qc-20260905\\4veco-platform\\reports\\rendered-proof\\BOOK2-TEXTBOOK-PRODUCTION-1\\221-paragraaf-98bf4923b4e3-r7",
      "all_page_hashes_match": true
    },
    {
      "kind": "opgaven",
      "pdf_sha256": "a8119cc769c8f4d91a0d45c9ab2f25abc3875e57835d13c056adf6d35c6297af",
      "pages": 6,
      "minimum_printed_text_pt_including_footer": 12.0,
      "minimum_placed_figure_label_pt": 12.221,
      "proof_directory": "C:\\wt\\book2-221-r7-qc-20260905\\4veco-platform\\reports\\rendered-proof\\BOOK2-TEXTBOOK-PRODUCTION-1\\221-opgaven-a8119cc769c8-r7",
      "all_page_hashes_match": true
    },
    {
      "kind": "antwoorden",
      "pdf_sha256": "d4a7c139d49276e80c23f4eda1cfab7841d063b204d7a9bb70cd225a796e5b5d",
      "pages": 4,
      "minimum_printed_text_pt_including_footer": 12.0,
      "minimum_placed_figure_label_pt": null,
      "proof_directory": "C:\\wt\\book2-221-r7-qc-20260905\\4veco-platform\\reports\\rendered-proof\\BOOK2-TEXTBOOK-PRODUCTION-1\\221-antwoorden-d4a7c139d492-r7",
      "all_page_hashes_match": true
    }
  ],
  "byte_identical_rebuild": true,
  "checks": [
    "exact frozen goals/context/a-d/3+2+2+2points/short answers",
    "one exercise HTML definition in both editions",
    "no leaked fences or active resources",
    "every printed text/font and placed figure label meets12pt floor",
    "all assets and all rendered page hashes fresh; manifests honestly pending"
  ]
}


```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action specialist_review --paragraph 2.2.1

- cwd: `C:\wt\book2-221-r7-qc-20260905\4veco-platform`
- started_at: `2026-09-05T18:54:38.308Z`
- finished_at: `2026-09-05T18:54:40.167Z`
- duration_ms: `1859`
- exit_code: `0`
- stdout_sha256: `22e6d7011adc86ff0a4c90a5788d18f685df79c7a434e74f5bebe4f4bac25692`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.2.1

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action paragraph_production --paragraph 2.2.1

- cwd: `C:\wt\book2-221-r7-qc-20260905\4veco-platform`
- started_at: `2026-09-05T18:54:40.928Z`
- finished_at: `2026-09-05T18:54:42.665Z`
- duration_ms: `1737`
- exit_code: `0`
- stdout_sha256: `22e6d7011adc86ff0a4c90a5788d18f685df79c7a434e74f5bebe4f4bac25692`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.2.1

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book2-target-authority-remediation.js --durable

- cwd: `C:\wt\book2-221-r7-qc-20260905\4veco-platform`
- started_at: `2026-09-05T18:54:43.319Z`
- finished_at: `2026-09-05T18:54:43.913Z`
- duration_ms: `594`
- exit_code: `0`
- stdout_sha256: `ca7764da243c9b491670418ecc8585edfb9d1edc93a3f5078e1bf8cade732ebc`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-QC-r7-inspection.py

- cwd: `C:\wt\book2-221-r7-qc-20260905\4veco-platform`
- started_at: `2026-09-05T18:54:44.626Z`
- finished_at: `2026-09-05T18:54:44.951Z`
- duration_ms: `325`
- exit_code: `0`
- stdout_sha256: `e7f9cf7f4da537e8d6528f9d100266532f3e9fef60d02f3b68e529d85a7f2a03`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "overall_verdict": "REVISE",
  "finding": "B2-221-R7-ALT-01",
  "visible_page_checks": "PASS",
  "personally_viewed_full_pages": 20,
  "figures": 3,
  "fresh_grayscale_pages": 3,
  "exact_bars": 10,
  "contrasts": [
    {
      "role": "ink on white",
      "foreground": "#182b3a",
      "background": "#ffffff",
      "ratio": 14.528,
      "minimum": 4.5,
      "status": "PASS"
    },
    {
      "role": "ink on callout",
      "foreground": "#182b3a",
      "background": "#eef4f7",
      "ratio": 13.088,
      "minimum": 4.5,
      "status": "PASS"
    },
    {
      "role": "ink on table header",
      "foreground": "#182b3a",
      "background": "#eaf1f5",
      "ratio": 12.729,
      "minimum": 4.5,
      "status": "PASS"
    },
    {
      "role": "blue heading and bar",
      "foreground": "#1A5276",
      "background": "#ffffff",
      "ratio": 8.358,
      "minimum": 4.5,
      "status": "PASS"
    },
    {
      "role": "footer",
      "foreground": "#555555",
      "background": "#ffffff",
      "ratio": 7.455,
      "minimum": 4.5,
      "status": "PASS"
    },
    {
      "role": "caption",
      "foreground": "#304958",
      "background": "#ffffff",
      "ratio": 9.461,
      "minimum": 4.5,
      "status": "PASS"
    }
  ],
  "paragraph_review": {
    "path": "4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1-review.md",
    "raw_sha256": "36db8a721edf9bfbbc976a66411b611a723588e54ac211f67097a8a01221ee13",
    "lf_sha256": "36db8a721edf9bfbbc976a66411b611a723588e54ac211f67097a8a01221ee13"
  }
}

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-QC-r7-gates.js

- cwd: `C:\wt\book2-221-r7-qc-20260905\4veco-platform`
- started_at: `2026-09-05T18:54:45.701Z`
- finished_at: `2026-09-05T18:54:46.221Z`
- duration_ms: `520`
- exit_code: `0`
- stdout_sha256: `3c767056eb661ae9cdeaa39e5a767ce1ffd9687f27ab5fbcf3fe5ef56153cf81`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.2.1 "Prijselasticiteit"
Path: C:\wt\book2-221-r7-qc-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.2 Hoofdstuk Elasticiteit\2.2.1 Prijselasticiteit
Mode: part-a
Profile: student-web

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.2.1 Prijselasticiteit – paragraaf.md
  OK opgaven.md: 2.2.1 Prijselasticiteit – opgaven.md
  OK antwoorden.md: 2.2.1 Prijselasticiteit – antwoorden.md
  OK 2.2.1 Prijselasticiteit – paragraaf.html (302.2 KB)
  OK 2.2.1 Prijselasticiteit – opgaven.html (120.1 KB)
  OK 2.2.1 Prijselasticiteit – antwoorden.html (12.8 KB)
  OK 2.2.1 Prijselasticiteit – paragraaf.pdf (241 KB)
  OK 2.2.1 Prijselasticiteit – opgaven.pdf (104 KB)
  OK 2.2.1 Prijselasticiteit – antwoorden.pdf (23 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 3 image refs all resolve
  OK _assets/: 3 SVGs, 3 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.2.1-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.2.1-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.2.1 "Prijselasticiteit" PASSED all checks.


Validating paragraph 2.2.1 "Prijselasticiteit"
Path: C:\wt\book2-221-r7-qc-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.2 Hoofdstuk Elasticiteit\2.2.1 Prijselasticiteit
Mode: part-a
Profile: publisher-print

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.2.1 Prijselasticiteit – paragraaf.md
  OK opgaven.md: 2.2.1 Prijselasticiteit – opgaven.md
  OK antwoorden.md: 2.2.1 Prijselasticiteit – antwoorden.md
  OK 2.2.1 Prijselasticiteit – paragraaf.pdf (241 KB)
  OK 2.2.1 Prijselasticiteit – opgaven.pdf (104 KB)
  OK 2.2.1 Prijselasticiteit – antwoorden.pdf (23 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 3 image refs all resolve
  OK 2 companion asset(s) declared in _paragraph-plan.md
  OK _assets/: 3 SVGs, 3 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.2.1-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.2.1-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.2.1 "Prijselasticiteit" PASSED all checks.

Paragraph lane scope: PASS (shared)
- shared platform: 1
  - build-scripts/content/book-2/221/exercises.md
- generated index/report: 4
  - reports/github-agent-index-lessen.json
  - reports/github-agent-index-lessen.md
  - reports/github-agent-index-platform.json
  - reports/github-agent-index-platform.md
- review evidence: 60
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98
...[truncated 4851 chars]
```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-QC-r7-inspection.py

- cwd: `C:\wt\book2-221-r7-qc-20260905\4veco-platform`
- started_at: `2026-09-05T18:56:05.164Z`
- finished_at: `2026-09-05T18:56:05.554Z`
- duration_ms: `390`
- exit_code: `0`
- stdout_sha256: `e7f9cf7f4da537e8d6528f9d100266532f3e9fef60d02f3b68e529d85a7f2a03`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "overall_verdict": "REVISE",
  "finding": "B2-221-R7-ALT-01",
  "visible_page_checks": "PASS",
  "personally_viewed_full_pages": 20,
  "figures": 3,
  "fresh_grayscale_pages": 3,
  "exact_bars": 10,
  "contrasts": [
    {
      "role": "ink on white",
      "foreground": "#182b3a",
      "background": "#ffffff",
      "ratio": 14.528,
      "minimum": 4.5,
      "status": "PASS"
    },
    {
      "role": "ink on callout",
      "foreground": "#182b3a",
      "background": "#eef4f7",
      "ratio": 13.088,
      "minimum": 4.5,
      "status": "PASS"
    },
    {
      "role": "ink on table header",
      "foreground": "#182b3a",
      "background": "#eaf1f5",
      "ratio": 12.729,
      "minimum": 4.5,
      "status": "PASS"
    },
    {
      "role": "blue heading and bar",
      "foreground": "#1A5276",
      "background": "#ffffff",
      "ratio": 8.358,
      "minimum": 4.5,
      "status": "PASS"
    },
    {
      "role": "footer",
      "foreground": "#555555",
      "background": "#ffffff",
      "ratio": 7.455,
      "minimum": 4.5,
      "status": "PASS"
    },
    {
      "role": "caption",
      "foreground": "#304958",
      "background": "#ffffff",
      "ratio": 9.461,
      "minimum": 4.5,
      "status": "PASS"
    }
  ],
  "paragraph_review": {
    "path": "4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1-review.md",
    "raw_sha256": "36db8a721edf9bfbbc976a66411b611a723588e54ac211f67097a8a01221ee13",
    "lf_sha256": "36db8a721edf9bfbbc976a66411b611a723588e54ac211f67097a8a01221ee13"
  }
}

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-QC-r7-gates.js

- cwd: `C:\wt\book2-221-r7-qc-20260905\4veco-platform`
- started_at: `2026-09-05T18:56:05.598Z`
- finished_at: `2026-09-05T18:56:06.084Z`
- duration_ms: `486`
- exit_code: `0`
- stdout_sha256: `7438bd13500f0b5e522059c196d1b6830921ffe81271ed646e81969fdbaa7785`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.2.1 "Prijselasticiteit"
Path: C:\wt\book2-221-r7-qc-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.2 Hoofdstuk Elasticiteit\2.2.1 Prijselasticiteit
Mode: part-a
Profile: student-web

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.2.1 Prijselasticiteit – paragraaf.md
  OK opgaven.md: 2.2.1 Prijselasticiteit – opgaven.md
  OK antwoorden.md: 2.2.1 Prijselasticiteit – antwoorden.md
  OK 2.2.1 Prijselasticiteit – paragraaf.html (302.2 KB)
  OK 2.2.1 Prijselasticiteit – opgaven.html (120.1 KB)
  OK 2.2.1 Prijselasticiteit – antwoorden.html (12.8 KB)
  OK 2.2.1 Prijselasticiteit – paragraaf.pdf (241 KB)
  OK 2.2.1 Prijselasticiteit – opgaven.pdf (104 KB)
  OK 2.2.1 Prijselasticiteit – antwoorden.pdf (23 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 3 image refs all resolve
  OK _assets/: 3 SVGs, 3 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.2.1-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.2.1-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.2.1 "Prijselasticiteit" PASSED all checks.


Validating paragraph 2.2.1 "Prijselasticiteit"
Path: C:\wt\book2-221-r7-qc-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.2 Hoofdstuk Elasticiteit\2.2.1 Prijselasticiteit
Mode: part-a
Profile: publisher-print

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.2.1 Prijselasticiteit – paragraaf.md
  OK opgaven.md: 2.2.1 Prijselasticiteit – opgaven.md
  OK antwoorden.md: 2.2.1 Prijselasticiteit – antwoorden.md
  OK 2.2.1 Prijselasticiteit – paragraaf.pdf (241 KB)
  OK 2.2.1 Prijselasticiteit – opgaven.pdf (104 KB)
  OK 2.2.1 Prijselasticiteit – antwoorden.pdf (23 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 3 image refs all resolve
  OK 2 companion asset(s) declared in _paragraph-plan.md
  OK _assets/: 3 SVGs, 3 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.2.1-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.2.1-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.2.1 "Prijselasticiteit" PASSED all checks.

Paragraph lane scope: PASS (shared)
- shared platform: 1
  - build-scripts/content/book-2/221/exercises.md
- generated index/report: 4
  - reports/github-agent-index-lessen.json
  - reports/github-agent-index-lessen.md
  - reports/github-agent-index-platform.json
  - reports/github-agent-index-platform.md
- review evidence: 61
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98
...[truncated 4922 chars]
```

### stderr excerpt

```text

```
