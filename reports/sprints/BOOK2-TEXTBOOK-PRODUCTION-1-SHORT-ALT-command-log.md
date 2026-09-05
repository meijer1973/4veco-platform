# Sprint BOOK2-TEXTBOOK-PRODUCTION-1-SHORT-ALT: Command Log

## C:/Python314/python.exe build-scripts/content/book-2/221/test_source.py

- cwd: `C:\wt\book2-short-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:09:53.517Z`
- finished_at: `2026-09-05T19:09:54.176Z`
- duration_ms: `659`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `c4fc6c9680a579caabed6bcf39dd54275768e70149d2d93a8922f9a725a09b42`

### stdout excerpt

```text

```

### stderr excerpt

```text
F.....F.....
======================================================================
FAIL: test_accessible_svg_titles_are_functional_noun_phrases (__main__.Paragraph221Tests.test_accessible_svg_titles_are_functional_noun_phrases)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "C:\wt\book2-short-alt-correction-20260905\4veco-platform\build-scripts\content\book-2\221\test_source.py", line 163, in test_accessible_svg_titles_are_functional_noun_phrases
    self.assertEqual(ET.fromstring(self.assets[name]).find('{http://www.w3.org/2000/svg}title').text, title)
    ~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError: 'Vergelijk de procentuele prijs- en hoeveelheidsveranderingen met teken' != 'Procentuele prijs- en hoeveelheidsveranderingen met teken op ��n schaal'
- Vergelijk de procentuele prijs- en hoeveelheidsveranderingen met teken
? ^^^^^^^^^^^^^^
+ Procentuele prijs- en hoeveelheidsveranderingen met teken op ��n schaal
? ^                                                        ++++++++++++++


======================================================================
FAIL: test_native_short_alternatives_preserve_full_visible_captions (__main__.Paragraph221Tests.test_native_short_alternatives_preserve_full_visible_captions)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "C:\wt\book2-short-alt-correction-20260905\4veco-platform\build-scripts\content\book-2\221\test_source.py", line 148, in test_native_short_alternatives_preserve_full_visible_captions
    self.assertEqual(figure.img['alt'], alternative)
    ~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError: 'Vergelijk de procentuele reacties op dezelfde schaal.' != 'Procentuele prijs- en hoeveelheidsreacties op dezelfde schaal.'
- Vergelijk de procentuele reacties op dezelfde schaal.
+ Procentuele prijs- en hoeveelheidsreacties op dezelfde schaal.


----------------------------------------------------------------------
Ran 12 tests in 0.236s

FAILED (failures=2)

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-ALT-evidence.py baseline

- cwd: `C:\wt\book2-short-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:11:38.894Z`
- finished_at: `2026-09-05T19:11:39.838Z`
- duration_ms: `944`
- exit_code: `0`
- stdout_sha256: `29fb9ee090e4c4ec4cde75f39c93145778706f1d06169abcb7ba72d374eb913b`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "record": "C:\\wt\\book2-short-alt-correction-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-221-ALT-baseline-r8.json",
  "sha256": "5c8c96781bab34d0814e932792bfb143fe85d0967b317cacaff7abee873fdc5e"
}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe build-scripts/content/book-2/221/test_source.py

- cwd: `C:\wt\book2-short-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:11:57.392Z`
- finished_at: `2026-09-05T19:11:57.915Z`
- duration_ms: `523`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `c559e7d891d0281aa58b031d3d4329e6bf6ced5d276c3b295659c2d265832f69`

### stdout excerpt

```text

```

### stderr excerpt

```text
......F.....
======================================================================
FAIL: test_native_short_alternatives_preserve_full_visible_captions (__main__.Paragraph221Tests.test_native_short_alternatives_preserve_full_visible_captions)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "C:\wt\book2-short-alt-correction-20260905\4veco-platform\build-scripts\content\book-2\221\test_source.py", line 149, in test_native_short_alternatives_preserve_full_visible_captions
    self.assertEqual(figure.figcaption.get_text(' ', strip=True), caption)
    ~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError: 'Vergelijk de procentuele reacties op dezelfde\nschaal.' != 'Vergelijk de procentuele reacties op dezelfde schaal.'
- Vergelijk de procentuele reacties op dezelfde
+ Vergelijk de procentuele reacties op dezelfde schaal.
?                                              ++++++++
- schaal.


----------------------------------------------------------------------
Ran 12 tests in 0.108s

FAILED (failures=1)

```
## C:/Python314/python.exe build-scripts/content/book-2/b2_221.py --lesson-root C:/wt/book2-short-alt-correction-20260905/4veco-lessen --proof-root reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1 --proof-suffix r8 --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-ALT-build-r8.json

- cwd: `C:\wt\book2-short-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:11:57.966Z`
- finished_at: `2026-09-05T19:12:08.304Z`
- duration_ms: `10338`
- exit_code: `0`
- stdout_sha256: `7fc49456c885bc247dda7f2102de8698c90f987fe2add52b5c7e16f8dabb54a9`
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
  "target_record_sha256": "61b54bde03d60be241092479cfcea8820e8187220f8f454dc9fef5045c8ea288",
  "plan_sha256": "29096bdedced016376a5ddf8a22c973ec5d61e8ce4822f390c2b746becca3345",
  "chapter_sha256": "3a9db97518b1948eb0967d94653a10c693a0ca001e20b41503b864fd4cc7c2f7",
  "input_sources": [
    {
      "path": "C:\\wt\\book2-short-alt-correction-20260905\\4veco-platform\\build-scripts\\content\\book-2\\b2_221.py",
      "sha256": "da9dee7e7392c1ee880e9ea582ec94ecc5ff8a2a4b38694ecf7ee0eaa6ec70b2"
    },
    {
      "path": "C:\\wt\\book2-short-alt-correction-20260905\\4veco-platform\\build-scripts\\content\\book-2\\print_pipeline.py",
      "sha256": "51680fdffab6a62265857e19bce16a8c29010b7e1787a9c73c32ed7dcc5306e5"
    },
    {
      "path": "C:\\wt\\book2-short-alt-correction-20260905\\4veco-platform\\build-scripts\\content\\book-2\\221\\theory.md",
      "sha256": "2e5af204f2bb38226f793626d061b175527fe283808bcfa932a6883d19950ca4"
    },
    {
      "path": "C:\\wt\\book2-short-alt-correction-20260905\\4veco-platform\\build-scripts\\content\\book-2\\221\\exercises.md",
      "sha256": "d94e8f00ca51e6c33792216f6f59d60e95e4cdbf5d4ef10f918d030ef719fa8b"
    },
    {
      "path": "C:\\wt\\book2-short-alt-correction-20260905\\4veco-platform\\build-scripts\\content\\book-2\\221\\answers.md",
      "sha256": "583e083e66cfdbd14aee442da7fab1c19aa3fc999dcfe53f63d965e291198c1a"
    },
    {
      "path": "C:\\wt\\book2-short-alt-correction-20260905\\4veco-platform\\build-scripts\\content\\book-2\\221\\target-answers.md",
      "sha256": "59a17da108763172e5f590fca927a448fe12b07d5b5ff113b9ec7a82c80954b5"
    }
  ],
  "inspection_status": "PENDING",
  "documents": [
    {
      "source_md": "C:\\wt\\book2-short-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.1 Prijselasticiteit\\2.2.1 Prijselasticiteit \u2013 paragraaf.md",
      "source_sha256": "ae61910c6306ff6af9d52a57db060083ca64facadc4424f1d4a96708d71974db",
      "source_html": "C:\\wt\\book2-short-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.1 Prijselasticiteit\\2.2.1 Prijselasticiteit \u2013 paragraaf.html",
      "html_sha256": "ac568897e03adcc88aab6a8710771d189d1a6e4bb18b85e63fdc4b3d32a7140b",
      "source_pdf": "C:\\wt\\book2-short-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.1 Prijselasticiteit\\2.2.1 Prijselasticiteit \u2013 paragraaf.pdf",
      "pdf_sha256": "98bf4923b4e3b8e49fa3b9d1b7daf71392c6c76ef8cea63aab12c44749cda1a6",
      "assets": [
        {
          "path": "C:\\wt\\book2-short-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.1 Prijselasticiteit\\_assets\\2.2.1_fig_1.svg",
          "sha256": "1abc7cc2a150318a84341bf89886543cd94e5fc63dd120cf18244e62032536b2"
        },
        {
          "path": "C:\\wt\\book2-short-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.1 Prijselasticiteit\\_assets\\2.2.1_fig_1.png",
          "sha256": "6f4009fe29fb88f442257e658fe6433809020ba824d17ee275a08701f37d0704"
        },
        {
          "path": "C:\\wt\\book2-short-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.1 Prijselastic
...[truncated 4332 chars]
```

### stderr excerpt

```text

```
## C:/Python314/python.exe build-scripts/content/book-2/221/test_source.py

- cwd: `C:\wt\book2-short-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:12:41.156Z`
- finished_at: `2026-09-05T19:12:41.818Z`
- duration_ms: `662`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `639f89e0447e22e00be3a7c56d4184d6f4488b646eff4fbdec9fee5d8c9a4dbc`

### stdout excerpt

```text

```

### stderr excerpt

```text
............
----------------------------------------------------------------------
Ran 12 tests in 0.261s

OK

```
## C:/Python314/python.exe build-scripts/content/book-2/221/check_render.py --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-ALT-build-r8.json --rebuild --output reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-ALT-render-check-r8.json

- cwd: `C:\wt\book2-short-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:12:42.727Z`
- finished_at: `2026-09-05T19:12:48.571Z`
- duration_ms: `5844`
- exit_code: `0`
- stdout_sha256: `d032227520cfe6b83aa89ae0d3a936e63c42856fe4202cfaedb1566d118cbd81`
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
      "proof_directory": "C:\\wt\\book2-short-alt-correction-20260905\\4veco-platform\\reports\\rendered-proof\\BOOK2-TEXTBOOK-PRODUCTION-1\\221-paragraaf-98bf4923b4e3-r8",
      "all_page_hashes_match": true
    },
    {
      "kind": "opgaven",
      "pdf_sha256": "a8119cc769c8f4d91a0d45c9ab2f25abc3875e57835d13c056adf6d35c6297af",
      "pages": 6,
      "minimum_printed_text_pt_including_footer": 12.0,
      "minimum_placed_figure_label_pt": 12.221,
      "proof_directory": "C:\\wt\\book2-short-alt-correction-20260905\\4veco-platform\\reports\\rendered-proof\\BOOK2-TEXTBOOK-PRODUCTION-1\\221-opgaven-a8119cc769c8-r8",
      "all_page_hashes_match": true
    },
    {
      "kind": "antwoorden",
      "pdf_sha256": "d4a7c139d49276e80c23f4eda1cfab7841d063b204d7a9bb70cd225a796e5b5d",
      "pages": 4,
      "minimum_printed_text_pt_including_footer": 12.0,
      "minimum_placed_figure_label_pt": null,
      "proof_directory": "C:\\wt\\book2-short-alt-correction-20260905\\4veco-platform\\reports\\rendered-proof\\BOOK2-TEXTBOOK-PRODUCTION-1\\221-antwoorden-d4a7c139d492-r8",
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
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-ALT-evidence.py verify

- cwd: `C:\wt\book2-short-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:12:56.416Z`
- finished_at: `2026-09-05T19:12:56.837Z`
- duration_ms: `421`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `a0e9229ab8d78d388b98029d847c5b3a16440297c15b1d1237f7ed776c3f63d3`

### stdout excerpt

```text

```

### stderr excerpt

```text
Traceback (most recent call last):
  File "C:\wt\book2-short-alt-correction-20260905\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-221-ALT-evidence.py", line 163, in <module>
    globals()[parser.parse_args().mode]()
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^^
  File "C:\wt\book2-short-alt-correction-20260905\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-221-ALT-evidence.py", line 114, in verify
    assert previous.decode('utf-8').replace(a, b) == path.read_text(encoding='utf-8')
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-ALT-evidence.py verify

- cwd: `C:\wt\book2-short-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:13:44.966Z`
- finished_at: `2026-09-05T19:13:47.001Z`
- duration_ms: `2035`
- exit_code: `0`
- stdout_sha256: `bb2f7ff5f6b4d74d356a2406a6e6bcd8f8821dfe114bc4136e6f3be6107b58bf`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "record": "C:\\wt\\book2-short-alt-correction-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-221-ALT-mechanical-r8.json",
  "sha256": "9162d5d2db1bcc0667f297d174284ef2a94f448dd77f60bc034e848f1a2caf76"
}

```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile student-web "\"C:/wt/book2-short-alt-correction-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit\""

- cwd: `C:\wt\book2-short-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:14:58.233Z`
- finished_at: `2026-09-05T19:14:58.382Z`
- duration_ms: `149`
- exit_code: `0`
- stdout_sha256: `bbf61f3241040dbe2fd2749b050daac14800060f57c776900f0cf25b37d82148`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.2.1 "Prijselasticiteit"
Path: C:\wt\book2-short-alt-correction-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.2 Hoofdstuk Elasticiteit\2.2.1 Prijselasticiteit
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


```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile publisher-print "\"C:/wt/book2-short-alt-correction-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit\""

- cwd: `C:\wt\book2-short-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:14:58.428Z`
- finished_at: `2026-09-05T19:14:58.491Z`
- duration_ms: `63`
- exit_code: `0`
- stdout_sha256: `2956af5f2bfcc891d739856d06330e12309e6093bf34753060c00d14c9e5ac7f`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.2.1 "Prijselasticiteit"
Path: C:\wt\book2-short-alt-correction-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.2 Hoofdstuk Elasticiteit\2.2.1 Prijselasticiteit
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


```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action paragraph_production --paragraph 2.2.1

- cwd: `C:\wt\book2-short-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:18:09.583Z`
- finished_at: `2026-09-05T19:18:11.385Z`
- duration_ms: `1802`
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

- cwd: `C:\wt\book2-short-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:18:11.429Z`
- finished_at: `2026-09-05T19:18:11.978Z`
- duration_ms: `549`
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
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base 199772e2aa586fce0f71b647ed5188e568dba2e5 --head HEAD

- cwd: `C:\wt\book2-short-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:18:59.490Z`
- finished_at: `2026-09-05T19:18:59.578Z`
- duration_ms: `88`
- exit_code: `0`
- stdout_sha256: `5d556b4b3f049a37a89f65d3cdf4cae2a02351c8017f844cc740b737269dbe9b`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (shared)
- shared platform: 3
  - build-scripts/content/book-2/221/test_source.py
  - build-scripts/content/book-2/221/theory.md
  - build-scripts/content/book-2/b2_221.py
- review evidence: 38
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r8/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r8/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r8/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r8/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r8/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r8/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r8/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r8/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r8/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r8/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r8/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r8/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r8/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r8/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r8/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r8/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r8/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r8/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r8/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r8/pages/page-010.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-ALT-baseline-r8.json
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-ALT-build-r8.json
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-ALT-builder-execution-r8.md
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-ALT-builder-plan.md
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-ALT-evidence.py
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-ALT-gray-r8-p2.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-ALT-gray-r8-p3.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-ALT-gray-r8-p5.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-ALT-mechanical-r8.json
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-ALT-render-check-r8.json
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-SHORT-ALT-command-log.jsonl
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-SHORT-ALT-command-log.md

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane textbook --cwd ../4veco-lessen --base 4c4cd7d0c1d2e5242c818399a96dce3e26013e9c --head HEAD

- cwd: `C:\wt\book2-short-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:18:59.619Z`
- finished_at: `2026-09-05T19:18:59.699Z`
- duration_ms: `80`
- exit_code: `0`
- stdout_sha256: `7540fdcdc1b76b2046f6042a122b33ad854f937af3c1befedf83d8d368f03267`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (textbook)
- Part A textbook: 3
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – paragraaf.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – paragraaf.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/_assets/2.2.1_fig_1.svg

```

### stderr excerpt

```text

```
