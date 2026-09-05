# Sprint BOOK2-TEXTBOOK-PRODUCTION-1-221-R8-REVIEW: Command Log

## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-R8-review-probes.py

- cwd: `C:\wt\book2-221-r8-review-20260905\4veco-platform`
- started_at: `2026-09-05T19:37:21.857Z`
- finished_at: `2026-09-05T19:37:30.950Z`
- duration_ms: `9093`
- exit_code: `0`
- stdout_sha256: `5179c9f79cfaf401eaf083d637062482ad52e85745c1551890df668cd400f263`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
PASS 0: all nine editions, build wrapper, image references, three named SVG/PNG pairs; no orphans.
PASS: exact native metadata/DOM/caption delta, all old tests retained, all20 fresh page bytes and three fresh PNG bytes equal, protected hashes and rational calculations.

```

### stderr excerpt

```text

```
## C:/Python314/python.exe build-scripts/content/book-2/221/test_source.py

- cwd: `C:\wt\book2-221-r8-review-20260905\4veco-platform`
- started_at: `2026-09-05T19:37:41.889Z`
- finished_at: `2026-09-05T19:37:42.506Z`
- duration_ms: `617`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `1a43b9cb17bb71d8a58e417db70896762fe88571372dd7dbb99285d6d01eb561`

### stdout excerpt

```text

```

### stderr excerpt

```text
............
----------------------------------------------------------------------
Ran 12 tests in 0.244s

OK

```
## npm.cmd ci

- cwd: `C:\wt\book2-221-r8-review-20260905\4veco-platform`
- started_at: `2026-09-05T19:37:42.687Z`
- finished_at: `2026-09-05T19:37:49.252Z`
- duration_ms: `6565`
- exit_code: `0`
- stdout_sha256: `61f1d23d75f65e6983dedd378128801bae9aca20b170a4b242451c6367b3fcdc`
- stderr_sha256: `17bbdc15786962d0f0bdc45d914959fab1ad11152e6302038c7dd846aeb5d476`

### stdout excerpt

```text

added 385 packages, and audited 386 packages in 6s

57 packages are looking for funding
  run `npm fund` for details

8 vulnerabilities (1 low, 1 moderate, 6 high)

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.

```

### stderr excerpt

```text
npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
npm warn deprecated glob@7.2.3: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me
npm warn deprecated whatwg-encoding@2.0.0: Use @exodus/bytes instead for a more spec-conformant and faster implementation
npm warn deprecated abab@2.0.6: Use your platform's native atob() and btoa() methods instead
npm warn deprecated domexception@4.0.0: Use your platform's native DOMException instead
npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me

```
## C:/Python314/python.exe build-scripts/content/book-2/221/check_render.py --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-R8-diagnostic-manifest.json --rebuild --output reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-R8-render-check.json

- cwd: `C:\wt\book2-221-r8-review-20260905\4veco-platform`
- started_at: `2026-09-05T19:37:42.316Z`
- finished_at: `2026-09-05T19:37:50.414Z`
- duration_ms: `8098`
- exit_code: `0`
- stdout_sha256: `68b783a56538653b65b708f412aa125f07fe2821669ed5771beb2db71b56ee73`
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
      "proof_directory": "C:\\wt\\book2-221-r8-review-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-221-R8-proof\\paragraaf",
      "all_page_hashes_match": true
    },
    {
      "kind": "opgaven",
      "pdf_sha256": "a8119cc769c8f4d91a0d45c9ab2f25abc3875e57835d13c056adf6d35c6297af",
      "pages": 6,
      "minimum_printed_text_pt_including_footer": 12.0,
      "minimum_placed_figure_label_pt": 12.221,
      "proof_directory": "C:\\wt\\book2-221-r8-review-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-221-R8-proof\\opgaven",
      "all_page_hashes_match": true
    },
    {
      "kind": "antwoorden",
      "pdf_sha256": "d4a7c139d49276e80c23f4eda1cfab7841d063b204d7a9bb70cd225a796e5b5d",
      "pages": 4,
      "minimum_printed_text_pt_including_footer": 12.0,
      "minimum_placed_figure_label_pt": null,
      "proof_directory": "C:\\wt\\book2-221-r8-review-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-221-R8-proof\\antwoorden",
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
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-R8-review-gates.js

- cwd: `C:\wt\book2-221-r8-review-20260905\4veco-platform`
- started_at: `2026-09-05T19:41:03.679Z`
- finished_at: `2026-09-05T19:41:08.699Z`
- duration_ms: `5020`
- exit_code: `0`
- stdout_sha256: `3bf0b54726942e63f5d498ee316a72daeef9ad858ee2fc6e85068e627accbb79`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.2.1 "Prijselasticiteit"
Path: C:\wt\book2-221-r8-review-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.2 Hoofdstuk Elasticiteit\2.2.1 Prijselasticiteit
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
Path: C:\wt\book2-221-r8-review-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.2 Hoofdstuk Elasticiteit\2.2.1 Prijselasticiteit
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

Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.2.1
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
Paragraph lane scope: PASS (shared)
- shared platform: 3
  - build-scripts/content/book-2/221/test_source.py
  - build-scripts/content/book-2/221/theory.md
  - build-scripts/content/book-2/b2_221.py
- generated index/report: 4
  - reports/github-agent-index-lessen.json
  - reports/github-agent-index-lessen.md
  - reports/github-agent-index-platform.json
  - reports/github-agent-index-platform.md
- review evidence: 39
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r8/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r8/manifest.json
  - re
...[truncated 3420 chars]
```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-R8-review-inspection.py

- cwd: `C:\wt\book2-221-r8-review-20260905\4veco-platform`
- started_at: `2026-09-05T19:41:08.753Z`
- finished_at: `2026-09-05T19:41:08.837Z`
- duration_ms: `84`
- exit_code: `0`
- stdout_sha256: `0b51b7bbf19650e121e54c31a095e4cf7675f17a77e6ebc5c0589f229e12d248`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Bound20 personal page observations,3 personally viewed figures and3 personally viewed grayscale pages to exact hashes.

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-R8-review-gates.js

- cwd: `C:\wt\book2-221-r8-review-20260905\4veco-platform`
- started_at: `2026-09-05T19:43:54.415Z`
- finished_at: `2026-09-05T19:43:58.636Z`
- duration_ms: `4221`
- exit_code: `0`
- stdout_sha256: `3bf0b54726942e63f5d498ee316a72daeef9ad858ee2fc6e85068e627accbb79`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.2.1 "Prijselasticiteit"
Path: C:\wt\book2-221-r8-review-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.2 Hoofdstuk Elasticiteit\2.2.1 Prijselasticiteit
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
Path: C:\wt\book2-221-r8-review-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.2 Hoofdstuk Elasticiteit\2.2.1 Prijselasticiteit
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

Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.2.1
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
Paragraph lane scope: PASS (shared)
- shared platform: 3
  - build-scripts/content/book-2/221/test_source.py
  - build-scripts/content/book-2/221/theory.md
  - build-scripts/content/book-2/b2_221.py
- generated index/report: 4
  - reports/github-agent-index-lessen.json
  - reports/github-agent-index-lessen.md
  - reports/github-agent-index-platform.json
  - reports/github-agent-index-platform.md
- review evidence: 39
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r8/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r8/manifest.json
  - re
...[truncated 3420 chars]
```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-R8-review-inspection.py

- cwd: `C:\wt\book2-221-r8-review-20260905\4veco-platform`
- started_at: `2026-09-05T19:44:50.313Z`
- finished_at: `2026-09-05T19:44:50.392Z`
- duration_ms: `79`
- exit_code: `0`
- stdout_sha256: `0b51b7bbf19650e121e54c31a095e4cf7675f17a77e6ebc5c0589f229e12d248`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Bound20 personal page observations,3 personally viewed figures and3 personally viewed grayscale pages to exact hashes.

```

### stderr excerpt

```text

```
## C:/Python314/python.exe --version

- cwd: `C:\wt\book2-221-r8-review-20260905\4veco-platform`
- started_at: `2026-09-05T19:44:50.434Z`
- finished_at: `2026-09-05T19:44:50.464Z`
- duration_ms: `30`
- exit_code: `0`
- stdout_sha256: `af5e1687e041a2cd8181e7a214ee103c7bdf12b2376ee17b5103fb23fe833c67`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Python 3.14.3

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-R8-review-gates.js

- cwd: `C:\wt\book2-221-r8-review-20260905\4veco-platform`
- started_at: `2026-09-05T19:45:45.197Z`
- finished_at: `2026-09-05T19:45:50.255Z`
- duration_ms: `5058`
- exit_code: `0`
- stdout_sha256: `f692312ad713344acb647b4eb08a564460ce5aceeb6dde631be59e847971143f`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.2.1 "Prijselasticiteit"
Path: C:\wt\book2-221-r8-review-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.2 Hoofdstuk Elasticiteit\2.2.1 Prijselasticiteit
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
Path: C:\wt\book2-221-r8-review-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.2 Hoofdstuk Elasticiteit\2.2.1 Prijselasticiteit
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

Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.2.1
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
Paragraph lane scope: PASS (shared)
- shared platform: 3
  - build-scripts/content/book-2/221/test_source.py
  - build-scripts/content/book-2/221/theory.md
  - build-scripts/content/book-2/b2_221.py
- generated index/report: 4
  - reports/github-agent-index-lessen.json
  - reports/github-agent-index-lessen.md
  - reports/github-agent-index-platform.json
  - reports/github-agent-index-platform.md
- review evidence: 39
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r8/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r8/manifest.json
  - re
...[truncated 3545 chars]
```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-R8-review-gates.js

- cwd: `C:\wt\book2-221-r8-review-20260905\4veco-platform`
- started_at: `2026-09-05T19:46:39.114Z`
- finished_at: `2026-09-05T19:46:43.370Z`
- duration_ms: `4256`
- exit_code: `0`
- stdout_sha256: `c5f91dedb8f1e35ce095ccb4e6a3eab564154a648c10d369c743d6b422d4aa5d`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.2.1 "Prijselasticiteit"
Path: C:\wt\book2-221-r8-review-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.2 Hoofdstuk Elasticiteit\2.2.1 Prijselasticiteit
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
Path: C:\wt\book2-221-r8-review-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.2 Hoofdstuk Elasticiteit\2.2.1 Prijselasticiteit
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

Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.2.1
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
Paragraph lane scope: PASS (shared)
- shared platform: 3
  - build-scripts/content/book-2/221/test_source.py
  - build-scripts/content/book-2/221/theory.md
  - build-scripts/content/book-2/b2_221.py
- generated index/report: 4
  - reports/github-agent-index-lessen.json
  - reports/github-agent-index-lessen.md
  - reports/github-agent-index-platform.json
  - reports/github-agent-index-platform.md
- review evidence: 80
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r8/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r8/manifest.json
  - re
...[truncated 6987 chars]
```

### stderr excerpt

```text

```
## node build-scripts/reports/check-agent-index-freshness.js

- cwd: `C:\wt\book2-221-r8-review-20260905\4veco-platform`
- started_at: `2026-09-05T19:49:36.223Z`
- finished_at: `2026-09-05T19:49:36.514Z`
- duration_ms: `291`
- exit_code: `0`
- stdout_sha256: `6d7b51019785b7544afecd25005fbe4407e7dfaf2514cbb5cd2e1dbf25d40fe8`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "ok": true,
  "checks": [
    {
      "label": "4veco-platform",
      "ok": true,
      "skipped": false,
      "failures": [],
      "warnings": [
        "4veco-platform index source_commit precedes generated-index-only ref beeab1b37cee0bc29a7248f2b9ca4f49f34e7319"
      ],
      "source_commit": "d4362705ce0c7f5e90d1e8a18e403f9e7e67a361",
      "head": "beeab1b37cee0bc29a7248f2b9ca4f49f34e7319",
      "source_ref": "HEAD",
      "target_commit": "beeab1b37cee0bc29a7248f2b9ca4f49f34e7319",
      "accepted_parent_generated_tail": true,
      "accepted_generated_index_tail_ref": "beeab1b37cee0bc29a7248f2b9ca4f49f34e7319"
    },
    {
      "label": "4veco-lessen",
      "ok": true,
      "skipped": false,
      "failures": [],
      "warnings": [],
      "source_commit": "144938f325d875b5ca055f5bb0951c450af59842",
      "head": "144938f325d875b5ca055f5bb0951c450af59842",
      "source_ref": "HEAD",
      "target_commit": "144938f325d875b5ca055f5bb0951c450af59842",
      "accepted_parent_generated_tail": false,
      "accepted_generated_index_tail_ref": null
    }
  ],
  "failures": [],
  "warnings": [
    "4veco-platform index source_commit precedes generated-index-only ref beeab1b37cee0bc29a7248f2b9ca4f49f34e7319"
  ]
}

```

### stderr excerpt

```text

```
