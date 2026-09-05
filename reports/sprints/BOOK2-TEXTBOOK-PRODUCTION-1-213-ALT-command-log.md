# Sprint BOOK2-TEXTBOOK-PRODUCTION-1-213-ALT: Command Log

## C:/Python314/python.exe build-scripts/content/book-2/213/verify_alt_delta.py r5 reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-alt-before-r5.json

- cwd: `C:\wt\book2-213-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:14:09.797Z`
- finished_at: `2026-09-05T19:14:10.977Z`
- duration_ms: `1180`
- exit_code: `0`
- stdout_sha256: `49eb9e2d0e98ab3ddc852390f2fdc2420faed436882830f42124e552986c05aa`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "snapshot": "reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-213-alt-before-r5.json",
  "artifacts": 24,
  "pages": 29
}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe build-scripts/content/book-2/213/verify_alt_delta.py r5 reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-alt-before-native-r5.json

- cwd: `C:\wt\book2-213-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:15:26.334Z`
- finished_at: `2026-09-05T19:15:26.739Z`
- duration_ms: `405`
- exit_code: `0`
- stdout_sha256: `d0eabdef7471dcfeb0ccaecf1a6ca7d9aa913a7c31a6efb49fa78a398f343fb9`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "snapshot": "reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-213-alt-before-native-r5.json",
  "artifacts": 24,
  "pages": 29
}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe build-scripts/content/book-2/213/test_source.py

- cwd: `C:\wt\book2-213-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:16:50.917Z`
- finished_at: `2026-09-05T19:16:52.321Z`
- duration_ms: `1404`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `8960c9c2a220ba601a6fd687212f0ce470dcf6e2ce210f536d75965b293566e3`

### stdout excerpt

```text

```

### stderr excerpt

```text
test_altered_target_fails_closed (__main__.SourceTests.test_altered_target_fails_closed) ... ok
test_bad_prerequisite_stops_before_process_or_output_write (__main__.SourceTests.test_bad_prerequisite_stops_before_process_or_output_write) ... ok
test_common_exercise_source_and_no_live_or_timing_copy (__main__.SourceTests.test_common_exercise_source_and_no_live_or_timing_copy) ... ok
test_discrete_arithmetic_all_cases (__main__.SourceTests.test_discrete_arithmetic_all_cases) ... ok
test_exact_seven_exercise_headings (__main__.SourceTests.test_exact_seven_exercise_headings) ... ok
test_formula_totals_independently (__main__.SourceTests.test_formula_totals_independently) ... ok
test_frozen_target_and_native_cells (__main__.SourceTests.test_frozen_target_and_native_cells) ... ok
test_initial_and_completed_tables_match_case_values (__main__.SourceTests.test_initial_and_completed_tables_match_case_values) ... ok
test_native_pandoc_short_alts_keep_full_captions (__main__.SourceTests.test_native_pandoc_short_alts_keep_full_captions) ... ok
test_original_long_alts_and_caption_loss_are_rejected (__main__.SourceTests.test_original_long_alts_and_caption_loss_are_rejected) ... ok
test_retrieval_combination_and_unequal_intervals (__main__.SourceTests.test_retrieval_combination_and_unequal_intervals) ... ok
test_six_assets_safe_geometry_large_type (__main__.SourceTests.test_six_assets_safe_geometry_large_type) ... ok
test_six_exact_noun_first_accessible_titles (__main__.SourceTests.test_six_exact_noun_first_accessible_titles) ... ok

----------------------------------------------------------------------
Ran 13 tests in 0.876s

OK

```
## npm ci

- cwd: `C:\wt\book2-213-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:16:59.889Z`
- finished_at: `2026-09-05T19:17:05.494Z`
- duration_ms: `5605`
- exit_code: `0`
- stdout_sha256: `a09f0a0856038d0eaa2388fa31fd25ff6464c0c116d2b1f147bb0e246655826b`
- stderr_sha256: `17bbdc15786962d0f0bdc45d914959fab1ad11152e6302038c7dd846aeb5d476`

### stdout excerpt

```text

added 385 packages, and audited 386 packages in 5s

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
## C:/Python314/python.exe build-scripts/content/book-2/b2_213.py --lesson-root "\\\\?\\C:\\wt\\book2-213-alt-correction-20260905\\4veco-lessen" --proof-root reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1 --proof-suffix r6 --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-alt-build-r6.json

- cwd: `C:\wt\book2-213-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:17:18.605Z`
- finished_at: `2026-09-05T19:17:33.884Z`
- duration_ms: `15279`
- exit_code: `0`
- stdout_sha256: `bac7b58b052ba4d79b35dcd1479447a79034ffb3feeeef106cfe905ff4319062`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.1.3
Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard
{
  "paragraph": "2.1.3",
  "target_record_sha256": "df4b7d7b0326445b386ae570b43eb50fc9fc431707e3992e44394323f959c3ef",
  "plan_sha256": "4cf29ff1e70953f6d1f8399a65d63ad37031e6a129804ad555442bfb98624234",
  "chapter_sha256": "ef3f872f5caa2de1359639983d8e4907a34cfcbc80a0309826cff07201e49116",
  "prerequisites": [
    {
      "path": "\\\\?\\C:\\wt\\book2-213-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.3 Marginale kosten en marginale opbrengsten\\2.1.3-textbook-plan.md",
      "canonical_lf_sha256": "4cf29ff1e70953f6d1f8399a65d63ad37031e6a129804ad555442bfb98624234"
    },
    {
      "path": "\\\\?\\C:\\wt\\book2-213-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\_chapter-plan.md",
      "canonical_lf_sha256": "ef3f872f5caa2de1359639983d8e4907a34cfcbc80a0309826cff07201e49116"
    },
    {
      "path": "\\\\?\\C:\\wt\\book2-213-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1-textbook-handoff.md",
      "canonical_lf_sha256": "724a080619f2f072151edf20980071b3bef18cd60d1904c78f4aa906be8917c8"
    },
    {
      "path": "\\\\?\\C:\\wt\\book2-213-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.2 Opbrengsten, winst en break-even\\2.1.2-textbook-handoff.md",
      "canonical_lf_sha256": "de2b8ed7dcc7a3c5c6eaac400892d2d37ac5212ccb3b9972fb004115a88c1fe2"
    },
    {
      "path": "\\\\?\\C:\\wt\\book2-213-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.2 Opbrengsten, winst en break-even\\2.1.2-review.md",
      "canonical_lf_sha256": "74ad2ed9c44d9aa05b6d6a680d5d273f2cad4b62e4bead5db303c006514238cd"
    },
    {
      "path": "\\\\?\\C:\\wt\\book2-213-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.2 Opbrengsten, winst en break-even\\2.1.2-quality-ref.yaml",
      "canonical_lf_sha256": "e168e3c2b8698d12b699fbf60e7691fbbc8a15d61bd46a7988704d3c896c805c"
    }
  ],
  "prior_paragraph_md_raw_sha256": "f53521ed8812a4c8b8c33c1d66b34e0afe8425c1dffb1723f37771372b2baa09",
  "input_sources": [
    {
      "path": "C:\\wt\\book2-213-alt-correction-20260905\\4veco-platform\\build-scripts\\content\\book-2\\b2_213.py",
      "sha256": "6a45771783de221c3d65b32d423c1f7e90c90e84a79d30c4e175bba8836b056a"
    },
    {
      "path": "C:\\wt\\book2-213-alt-correction-20260905\\4veco-platform\\build-scripts\\content\\book-2\\print_pipeline.py",
      "sha256": "51680fdffab6a62265857e19bce16a8c29010b7e1787a9c73c32ed7dcc5306e5"
    },
    {
      "path": "C:\\wt\\book2-213-alt-correction-20260905\\4veco-platform\\build-scripts\\content\\book-2\\213\\theory.md",
      "sha256": "df6e40009454bc43f4915fa3edbf8c613a888ebbd2d0b7b59414bd3f70b4d5e7"
    },
    {
      "path": "C:\\wt\\book2-213-alt-correction-20260905\\4veco-platform\\build-scripts\\content\\book-2\\213\\exercises.md",
      "sha256": "bd16efcc6ac0ef9c2713b61587c8613fa353e98cc696e8a172ea931e11c35b32"
    },
    {
      "path": "C:\\wt\\book2-213-alt-correction-20260905\\4veco-platform\\build-scripts\\content\\book-2\\213\\answers.md",
      "sha256": "d7a6960674cd09c8ac43782c0503351c2a42b3ac656c2e792c
...[truncated 11464 chars]
```

### stderr excerpt

```text

```
## C:/Python314/python.exe build-scripts/content/book-2/213/verify_alt_delta.py r6 reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-alt-delta-r6.json --before reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-alt-before-native-r5.json

- cwd: `C:\wt\book2-213-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:18:14.844Z`
- finished_at: `2026-09-05T19:18:15.296Z`
- duration_ms: `452`
- exit_code: `0`
- stdout_sha256: `826d3264bf719012a6c342317ef221a3c8d7331b05f1c1ed7c7ce69dec849730`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "result": "PASS",
  "changed_artifacts": [
    "2.1.3 Marginale kosten en marginale opbrengsten \u2013 paragraaf.md",
    "2.1.3 Marginale kosten en marginale opbrengsten \u2013 paragraaf.html",
    "2.1.3 Marginale kosten en marginale opbrengsten \u2013 paragraaf.zip",
    "2.1.3 Marginale kosten en marginale opbrengsten \u2013 opgaven.md",
    "2.1.3 Marginale kosten en marginale opbrengsten \u2013 opgaven.html",
    "2.1.3 Marginale kosten en marginale opbrengsten \u2013 opgaven.zip",
    "_assets/2.1.3_we_1.svg"
  ],
  "pdf_byte_identical": 3,
  "page_png_byte_identical": 29,
  "asset_png_byte_identical": 6,
  "svg_drawing_byte_identical": 6,
  "visible_html_and_full_captions": "exact normalized DOM and caption words in all three editions; only four alt occurrences and corresponding native aria-hidden removal, with whitespace reflow",
  "protected_inputs": "all exact raw SHA-256 equality",
  "zip_delta": "only two student MD/HTML pairs and their we1 SVG title; unchanged inventories/other CRC and member bytes",
  "visual_inspection": "NOT_SUPPLIED_BY_THIS_SCRIPT"
}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe build-scripts/content/book-2/213/check_render.py reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-alt-render-r6.json

- cwd: `C:\wt\book2-213-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:18:16.047Z`
- finished_at: `2026-09-05T19:18:25.030Z`
- duration_ms: `8983`
- exit_code: `0`
- stdout_sha256: `703907fa0e287d22d5dababc7e7e135af3f7f6c1ffa3d05461da84ee3000c572`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "paragraph": "2.1.3",
  "automated_result": "PASS",
  "inspection_status": "NOT_SUPPLIED_BY_THIS_SCRIPT",
  "documents": [
    {
      "kind": "paragraaf",
      "pages": 14,
      "minimum_text_pt_including_footer": 12.0,
      "minimum_placed_figure_font_pt": 15.685038248697916,
      "images": 6,
      "pdf_sha256": "534177c8280eddd4785dce1491856c33c96cd698ae558b5136bdb206a79c7024",
      "html_sha256": "2f8d85e29fa7e734269f92b68510a9e21f196807c5c105fe7157e70d17f09f5b",
      "zip_sha256": "15ffc25da00d0f3bfc84f93224191a08c9ab31387f7dc873a8df85dc7b76b499",
      "page_geometry_checks": [
        {
          "page": 1,
          "text_characters": 1437,
          "images": 0
        },
        {
          "page": 2,
          "text_characters": 990,
          "images": 2
        },
        {
          "page": 3,
          "text_characters": 1535,
          "images": 1
        },
        {
          "page": 4,
          "text_characters": 1604,
          "images": 0
        },
        {
          "page": 5,
          "text_characters": 988,
          "images": 1
        },
        {
          "page": 6,
          "text_characters": 1357,
          "images": 0
        },
        {
          "page": 7,
          "text_characters": 828,
          "images": 1
        },
        {
          "page": 8,
          "text_characters": 1434,
          "images": 0
        },
        {
          "page": 9,
          "text_characters": 757,
          "images": 0
        },
        {
          "page": 10,
          "text_characters": 969,
          "images": 1
        },
        {
          "page": 11,
          "text_characters": 1384,
          "images": 0
        },
        {
          "page": 12,
          "text_characters": 1058,
          "images": 0
        },
        {
          "page": 13,
          "text_characters": 1066,
          "images": 0
        },
        {
          "page": 14,
          "text_characters": 1496,
          "images": 0
        }
      ],
      "actual_html_alternatives": [
        {
          "asset": "2.1.3_fig_1",
          "alt": "Dezelfde dag: de tabelstappen van 0 naar 10 en van 10 naar 20 fotohouders, met TK 20, 50 en 100 euro.",
          "length": 101,
          "caption": "Dezelfde dag: de tabelstappen van 0 naar 10 en van 10 naar 20 fotohouders, met TK 20, 50 en 100 euro.",
          "caption_attributes": {
            "aria-hidden": "true"
          }
        },
        {
          "asset": "2.1.3_fig_2",
          "alt": "Dezelfde kostentabel met delta TK 30 en 50 euro, telkens delta Q 10, en MK 3 en 5 euro bij de rechter eindpunten.",
          "length": 113,
          "caption": "Dezelfde kostentabel met delta TK 30 en 50 euro, telkens delta Q 10, en MK 3 en 5 euro bij de rechter eindpunten.",
          "caption_attributes": {
            "aria-hidden": "true"
          }
        },
        {
          "asset": "2.1.3_fig_3",
          "alt": "MO bij vaste prijs: 80 euro extra opbrengst voor 10 extra fotohouders in beide intervallen, dus 8 euro per houder.",
          "length": 114,
          "caption": "Bij dezelfde hoeveelheden 0, 10 en 20 zijn de opbrengsten 0, 80 en 160 euro. Beide intervallen leveren 80 euro extra voor 10 extra producten: MO is telkens 8.",
          "caption_attributes": {}
        },
        {
          "asset": "2.1.3_fig_4",
          "alt": "Winsttoename per extra fotohouder: 5 euro in interval 0�10 en 3 euro in interval 10�20, telkens MO min MK.",
          "length": 106,
          "caption": "Twee intervalkaarten: winst van min 20 naar 30 geeft 50 gedeeld door 10 is 5; winst van 30 naar 60 geeft 30 gedeeld door 10 is 3. Dit is telkens MO min MK.",
          "caption_attributes": {}
        },
        {
          "asset": "2.1.3_we_1",
          "alt": "Eindpuntrijen van Lus en Bout: MK 2/2/2 tegenover 2/6/10; MO steeds 6 en 12 euro per extra
...[truncated 7849 chars]
```

### stderr excerpt

```text

```
## C:/Python314/python.exe build-scripts/content/book-2/213/verify_rebuild.py reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-alt-build-r6.json reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-alt-rebuild-r6.json reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-alt-grayscale-r6

- cwd: `C:\wt\book2-213-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:18:40.764Z`
- finished_at: `2026-09-05T19:18:53.621Z`
- duration_ms: `12857`
- exit_code: `0`
- stdout_sha256: `1c50e40394b005f05e8e961d4a011d505e33667c3ff113287797d96b6fa4a249`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.1.3
Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard
{
  "paragraph": "2.1.3",
  "source_manifest": "C:\\wt\\book2-213-alt-correction-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-213-alt-build-r6.json",
  "source_manifest_sha256": "c1eb06dc784f2e09c9b4996d970470b4a703151d2bdb88004e99461ad0ff8fde",
  "full_generator_rebuild": "PASS: all 24 artifact files byte identical",
  "print_only_rebuild": "PASS: all 24 artifact files byte identical",
  "grayscale_pdf_sha256": "534177c8280eddd4785dce1491856c33c96cd698ae558b5136bdb206a79c7024",
  "visual_inspection": "NOT_SUPPLIED_BY_THIS_SCRIPT"
}

```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile student-web "\"C:/wt/book2-213-alt-correction-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten\""

- cwd: `C:\wt\book2-213-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:20:53.820Z`
- finished_at: `2026-09-05T19:20:53.973Z`
- duration_ms: `153`
- exit_code: `0`
- stdout_sha256: `437ca13249042c97381098dac6fa4923725ddc9edc612e5e666994cd784342b3`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.1.3 "Marginale kosten en marginale opbrengsten"
Path: C:\wt\book2-213-alt-correction-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.1 Hoofdstuk Kosten en opbrengsten\2.1.3 Marginale kosten en marginale opbrengsten
Mode: part-a
Profile: student-web

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.md
  OK opgaven.md: 2.1.3 Marginale kosten en marginale opbrengsten – opgaven.md
  OK antwoorden.md: 2.1.3 Marginale kosten en marginale opbrengsten – antwoorden.md
  OK 2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.html (1263.7 KB)
  OK 2.1.3 Marginale kosten en marginale opbrengsten – opgaven.html (578.9 KB)
  OK 2.1.3 Marginale kosten en marginale opbrengsten – antwoorden.html (19.7 KB)
  OK 2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.pdf (948 KB)
  OK 2.1.3 Marginale kosten en marginale opbrengsten – opgaven.pdf (442 KB)
  OK 2.1.3 Marginale kosten en marginale opbrengsten – antwoorden.pdf (32 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 6 image refs all resolve
  OK _assets/: 6 SVGs, 6 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.1.3-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.1.3-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.1.3 "Marginale kosten en marginale opbrengsten" PASSED all checks.


```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile publisher-print "\"C:/wt/book2-213-alt-correction-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten\""

- cwd: `C:\wt\book2-213-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:20:54.032Z`
- finished_at: `2026-09-05T19:20:54.126Z`
- duration_ms: `94`
- exit_code: `0`
- stdout_sha256: `d294e627fd508b5791317ede8b54924a6191e9e1b77e3f80cbb9b7bc97ff75ab`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.1.3 "Marginale kosten en marginale opbrengsten"
Path: C:\wt\book2-213-alt-correction-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.1 Hoofdstuk Kosten en opbrengsten\2.1.3 Marginale kosten en marginale opbrengsten
Mode: part-a
Profile: publisher-print

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.md
  OK opgaven.md: 2.1.3 Marginale kosten en marginale opbrengsten – opgaven.md
  OK antwoorden.md: 2.1.3 Marginale kosten en marginale opbrengsten – antwoorden.md
  OK 2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.pdf (948 KB)
  OK 2.1.3 Marginale kosten en marginale opbrengsten – opgaven.pdf (442 KB)
  OK 2.1.3 Marginale kosten en marginale opbrengsten – antwoorden.pdf (32 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 6 image refs all resolve
  OK _assets/: 6 SVGs, 6 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.1.3-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.1.3-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.1.3 "Marginale kosten en marginale opbrengsten" PASSED all checks.


```

### stderr excerpt

```text

```
## C:/Python314/python.exe build-scripts/content/book-2/213/verify_alt_delta.py r6 reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-alt-final-delta-r6.json --before reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-alt-before-native-r5.json

- cwd: `C:\wt\book2-213-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:22:48.839Z`
- finished_at: `2026-09-05T19:22:49.489Z`
- duration_ms: `650`
- exit_code: `0`
- stdout_sha256: `826d3264bf719012a6c342317ef221a3c8d7331b05f1c1ed7c7ce69dec849730`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "result": "PASS",
  "changed_artifacts": [
    "2.1.3 Marginale kosten en marginale opbrengsten \u2013 paragraaf.md",
    "2.1.3 Marginale kosten en marginale opbrengsten \u2013 paragraaf.html",
    "2.1.3 Marginale kosten en marginale opbrengsten \u2013 paragraaf.zip",
    "2.1.3 Marginale kosten en marginale opbrengsten \u2013 opgaven.md",
    "2.1.3 Marginale kosten en marginale opbrengsten \u2013 opgaven.html",
    "2.1.3 Marginale kosten en marginale opbrengsten \u2013 opgaven.zip",
    "_assets/2.1.3_we_1.svg"
  ],
  "pdf_byte_identical": 3,
  "page_png_byte_identical": 29,
  "asset_png_byte_identical": 6,
  "svg_drawing_byte_identical": 6,
  "visible_html_and_full_captions": "exact normalized DOM and caption words in all three editions; only four alt occurrences and corresponding native aria-hidden removal, with whitespace reflow",
  "protected_inputs": "all exact raw SHA-256 equality",
  "zip_delta": "only two student MD/HTML pairs and their we1 SVG title; unchanged inventories/other CRC and member bytes",
  "visual_inspection": "NOT_SUPPLIED_BY_THIS_SCRIPT"
}

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action paragraph_production --paragraph 2.1.3

- cwd: `C:\wt\book2-213-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:22:49.547Z`
- finished_at: `2026-09-05T19:22:51.292Z`
- duration_ms: `1745`
- exit_code: `0`
- stdout_sha256: `48277b0f2fe486714ff2c591064559f0bbbbe9bb1bcfa1353c2feef3efe14b35`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.1.3

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book2-target-authority-remediation.js --durable

- cwd: `C:\wt\book2-213-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:22:51.324Z`
- finished_at: `2026-09-05T19:22:51.883Z`
- duration_ms: `559`
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

- cwd: `C:\wt\book2-213-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:26:02.699Z`
- finished_at: `2026-09-05T19:26:02.791Z`
- duration_ms: `92`
- exit_code: `0`
- stdout_sha256: `3760fea088a3cba1e01bde3f68af186ac2a66bff96c5a25b9565ea2ab4a1bb29`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (shared)
- shared platform: 7
  - build-scripts/content/book-2/213/alt_contract.py
  - build-scripts/content/book-2/213/check_render.py
  - build-scripts/content/book-2/213/exercises.md
  - build-scripts/content/book-2/213/test_source.py
  - build-scripts/content/book-2/213/theory.md
  - build-scripts/content/book-2/213/verify_alt_delta.py
  - build-scripts/content/book-2/b2_213.py
- review evidence: 51
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r6/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r6/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r6/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r6/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r6/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r6/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r6/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r6/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r6/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r6/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r6/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r6/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r6/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r6/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r6/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r6/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r6/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r6/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r6/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-010.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-011.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-012.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-013.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-par
...[truncated 1257 chars]
```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --cwd ../4veco-lessen --lane textbook --base 4c4cd7d0c1d2e5242c818399a96dce3e26013e9c --head HEAD

- cwd: `C:\wt\book2-213-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:26:02.834Z`
- finished_at: `2026-09-05T19:26:02.918Z`
- duration_ms: `84`
- exit_code: `0`
- stdout_sha256: `c4eae7238e1deff8d5966c97a310aea5a89465016001c71ae9c4dae7d361e474`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (textbook)
- Part A textbook: 7
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – opgaven.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – opgaven.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – opgaven.zip
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.zip
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/_assets/2.1.3_we_1.svg

```

### stderr excerpt

```text

```
