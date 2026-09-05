# Sprint BOOK2-TEXTBOOK-PRODUCTION-1-211-ALT: Command Log

## C:/Python314/python.exe -m unittest discover -s build-scripts/content/book-2/211 -p test_source.py -v

- cwd: `C:\wt\book2-211-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:49:25.184Z`
- finished_at: `2026-09-05T19:49:25.721Z`
- duration_ms: `537`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `dd6e45f823d01dc70061da32f58754313b80c92f17ed50d8be4f7fd5d36f7300`

### stdout excerpt

```text

```

### stderr excerpt

```text
test_accessible_svg_titles_are_concise_noun_first (test_source.SourceContractTests.test_accessible_svg_titles_are_concise_noun_first) ... FAIL
test_answer_coverage (test_source.SourceContractTests.test_answer_coverage) ... ok
test_canonical_exercise_source_shared (test_source.SourceContractTests.test_canonical_exercise_source_shared) ... ok
test_exact_four_goals (test_source.SourceContractTests.test_exact_four_goals) ... ok
test_figures_add_one_relationship_at_a_time (test_source.SourceContractTests.test_figures_add_one_relationship_at_a_time) ... ok
test_numeric_models_independently_recomputed (test_source.SourceContractTests.test_numeric_models_independently_recomputed) ... ok
test_proof_revision_rejects_path_components_before_any_write (test_source.SourceContractTests.test_proof_revision_rejects_path_components_before_any_write) ... ok
test_reproducible_sources_and_assets (test_source.SourceContractTests.test_reproducible_sources_and_assets) ... ok
test_six_assets_and_every_reference (test_source.SourceContractTests.test_six_assets_and_every_reference) ... ok
test_source_letters_are_not_pandoc_auto_lists (test_source.SourceContractTests.test_source_letters_are_not_pandoc_auto_lists) ... ok
test_target_exact_source_and_points (test_source.SourceContractTests.test_target_exact_source_and_points) ... ok
test_target_table_retains_every_frozen_cell (test_source.SourceContractTests.test_target_table_retains_every_frozen_cell) ... ok
test_worked_image_native_short_alt_keeps_entire_caption (test_source.SourceContractTests.test_worked_image_native_short_alt_keeps_entire_caption) ... FAIL

======================================================================
FAIL: test_accessible_svg_titles_are_concise_noun_first (test_source.SourceContractTests.test_accessible_svg_titles_are_concise_noun_first)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "C:\wt\book2-211-alt-correction-20260905\4veco-platform\build-scripts\content\book-2\211\test_source.py", line 42, in test_accessible_svg_titles_are_concise_noun_first
    self.assertEqual(title, expected[name])
    ~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^
AssertionError: 'Eerst TVK toevoegen en daarna TK op dezelfde schalen' != 'TVK en daarna TK toegevoegd op dezelfde schalen'
- Eerst TVK toevoegen en daarna TK op dezelfde schalen
+ TVK en daarna TK toegevoegd op dezelfde schalen


======================================================================
FAIL: test_worked_image_native_short_alt_keeps_entire_caption (test_source.SourceContractTests.test_worked_image_native_short_alt_keeps_entire_caption)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "C:\wt\book2-211-alt-correction-20260905\4veco-platform\build-scripts\content\book-2\211\test_source.py", line 22, in test_worked_image_native_short_alt_keeps_entire_caption
    self.assertEqual(line, f'![{caption}](_assets/2.1.1_we_1.svg){{alt="{expected_alt}"}}')
    ~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError: '![He[140 chars].svg)' != '![He[140 chars].svg){alt="Totalen en gemiddelden bij 100 en 2[46 chars]en"}'
- ![Hetzelfde constante maandbedrag wordt over meer reparaties verdeeld; totalen en gemiddelden houden verschillende eenheden.](_assets/2.1.1_we_1.svg)
+ ![Hetzelfde constante maandbedrag wordt over meer reparaties verdeeld; totalen en gemiddelden houden verschillende eenheden.](_assets/2.1.1_we_1.svg){alt="Totalen en gemiddelden bij 100 en 200 reparaties met dezelfde constante maandkosten"}
?                                                                                                                                                      +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


----------------------------------------------------------------------
Ran 13 tests i
...[truncated 33 chars]
```
## C:/Python314/python.exe -m unittest discover -s build-scripts/content/book-2/211 -p test_source.py -v

- cwd: `C:\wt\book2-211-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:50:16.756Z`
- finished_at: `2026-09-05T19:50:17.208Z`
- duration_ms: `452`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `f017c2207bffc1f79a441c4d368c7fb13abbe90235b3daea2148e4204b960fe5`

### stdout excerpt

```text

```

### stderr excerpt

```text
test_accessible_svg_titles_are_concise_noun_first (test_source.SourceContractTests.test_accessible_svg_titles_are_concise_noun_first) ... ok
test_answer_coverage (test_source.SourceContractTests.test_answer_coverage) ... ok
test_canonical_exercise_source_shared (test_source.SourceContractTests.test_canonical_exercise_source_shared) ... ok
test_exact_four_goals (test_source.SourceContractTests.test_exact_four_goals) ... ok
test_figures_add_one_relationship_at_a_time (test_source.SourceContractTests.test_figures_add_one_relationship_at_a_time) ... ok
test_numeric_models_independently_recomputed (test_source.SourceContractTests.test_numeric_models_independently_recomputed) ... ok
test_proof_revision_rejects_path_components_before_any_write (test_source.SourceContractTests.test_proof_revision_rejects_path_components_before_any_write) ... ok
test_reproducible_sources_and_assets (test_source.SourceContractTests.test_reproducible_sources_and_assets) ... ok
test_six_assets_and_every_reference (test_source.SourceContractTests.test_six_assets_and_every_reference) ... ok
test_source_letters_are_not_pandoc_auto_lists (test_source.SourceContractTests.test_source_letters_are_not_pandoc_auto_lists) ... ok
test_target_exact_source_and_points (test_source.SourceContractTests.test_target_exact_source_and_points) ... ok
test_target_table_retains_every_frozen_cell (test_source.SourceContractTests.test_target_table_retains_every_frozen_cell) ... ok
test_worked_image_native_short_alt_keeps_entire_caption (test_source.SourceContractTests.test_worked_image_native_short_alt_keeps_entire_caption) ... FAIL

======================================================================
FAIL: test_worked_image_native_short_alt_keeps_entire_caption (test_source.SourceContractTests.test_worked_image_native_short_alt_keeps_entire_caption)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "C:\wt\book2-211-alt-correction-20260905\4veco-platform\build-scripts\content\book-2\211\test_source.py", line 29, in test_worked_image_native_short_alt_keeps_entire_caption
    self.assertEqual(" ".join(figure.figcaption.stripped_strings), caption)
    ~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError: 'Hetz[49 chars]aties\nverdeeld; totalen en gemiddelden houden[21 chars]den.' != 'Hetz[49 chars]aties verdeeld; totalen en gemiddelden houden [19 chars]den.'
+ Hetzelfde constante maandbedrag wordt over meer reparaties verdeeld; totalen en gemiddelden houden verschillende eenheden.
- Hetzelfde constante maandbedrag wordt over meer reparaties
- verdeeld; totalen en gemiddelden houden verschillende
- eenheden.


----------------------------------------------------------------------
Ran 13 tests in 0.043s

FAILED (failures=1)

```
## C:/Python314/python.exe build-scripts/content/book-2/b2_211.py --lesson-root ../4veco-lessen --proof-root reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1 --proof-suffix r4 --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-ALT-build-r4.json

- cwd: `C:\wt\book2-211-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:50:18.069Z`
- finished_at: `2026-09-05T19:50:32.521Z`
- duration_ms: `14452`
- exit_code: `0`
- stdout_sha256: `70e4a7f93902696e110f645a6de4b8f33fa4682e16e049ba078d08633407f140`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.1.1
Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard
{
  "paragraph": "2.1.1",
  "target_record_sha256": "143f1053c98766b77d9d9ce573a5c8e976980f900387159312c3238288d71710",
  "plan_sha256": "f46c7aa444ba6fef1f6f885b34bd52963fccac3cdc7b13b898eb6665219c4cd0",
  "chapter_sha256": "ef3f872f5caa2de1359639983d8e4907a34cfcbc80a0309826cff07201e49116",
  "input_sources": [
    {
      "path": "C:\\wt\\book2-211-alt-correction-20260905\\4veco-platform\\build-scripts\\content\\book-2\\b2_211.py",
      "sha256": "621b68dea3e3e77608ae2b294dc6d6c47e01b525c2ca8b203e683b101e8e3d4f"
    },
    {
      "path": "C:\\wt\\book2-211-alt-correction-20260905\\4veco-platform\\build-scripts\\content\\book-2\\print_pipeline.py",
      "sha256": "51680fdffab6a62265857e19bce16a8c29010b7e1787a9c73c32ed7dcc5306e5"
    },
    {
      "path": "C:\\wt\\book2-211-alt-correction-20260905\\4veco-platform\\build-scripts\\content\\book-2\\211\\theory.md",
      "sha256": "c945ae6634ebbcd4b6411ccbaa8394c5abcc5a1a6b85326588a28a7629c79dfe"
    },
    {
      "path": "C:\\wt\\book2-211-alt-correction-20260905\\4veco-platform\\build-scripts\\content\\book-2\\211\\exercises.md",
      "sha256": "a5e82f2cf9d0b89b749dd7590d7023f9ce8a780ce48402365a7bef2c628dd4b9"
    },
    {
      "path": "C:\\wt\\book2-211-alt-correction-20260905\\4veco-platform\\build-scripts\\content\\book-2\\211\\answers.md",
      "sha256": "34f0a59bc3d80cd3165f632e79a87d729b10a10f545c5e1e0be384776e85c272"
    },
    {
      "path": "C:\\wt\\book2-211-alt-correction-20260905\\4veco-platform\\build-scripts\\content\\book-2\\211\\target-answers.md",
      "sha256": "e7ddb5385e91f18c24ca856e99a7bbd21a8de57b660be5335ef4cc4650280e94"
    }
  ],
  "inspection_status": "PENDING",
  "documents": [
    {
      "source_md": "C:\\wt\\book2-211-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 paragraaf.md",
      "source_sha256": "de7abc910f6ec940eb329abd003085921f32409956ec1e0450bcc4a5454eb6b5",
      "source_html": "C:\\wt\\book2-211-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 paragraaf.html",
      "html_sha256": "10721f1ad745b8e1358ba354c5ded64a74367f5081eaf1c676ecb88dbe10e44b",
      "source_pdf": "C:\\wt\\book2-211-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 paragraaf.pdf",
      "pdf_sha256": "9837e3a85f3129a5309a36b17fd1030702ba92fc7ef464af609cb878e4d2f8b0",
      "assets": [
        {
          "path": "C:\\wt\\book2-211-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\_assets\\2.1.1_fig_2.svg",
          "sha256": "bbf506bd1be95e272a9bd31a42143147f58dc545c5ff243ff8d026b0d4c6c66d"
        },
        {
          "path": "C:\\wt\\book2-211-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\_assets\\2.1.1_fig_2.png",
          "sha256": "74f1384715e922ca04d10aa2978b852a98511044c6478f40e4bb260f72e0f8a8"
        },
        {
          "path": "C:\\wt\\book2-211-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengst
...[truncated 7051 chars]
```

### stderr excerpt

```text

```
## C:/Python314/python.exe -m unittest discover -s build-scripts/content/book-2/211 -p test_source.py -v

- cwd: `C:\wt\book2-211-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:50:39.010Z`
- finished_at: `2026-09-05T19:50:39.392Z`
- duration_ms: `382`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `415274864cf68a5290c1f9b10ee18afe3ec8bf5f7dc906bec615b4ac142c57f2`

### stdout excerpt

```text

```

### stderr excerpt

```text
test_accessible_svg_titles_are_concise_noun_first (test_source.SourceContractTests.test_accessible_svg_titles_are_concise_noun_first) ... ok
test_answer_coverage (test_source.SourceContractTests.test_answer_coverage) ... ok
test_canonical_exercise_source_shared (test_source.SourceContractTests.test_canonical_exercise_source_shared) ... ok
test_exact_four_goals (test_source.SourceContractTests.test_exact_four_goals) ... ok
test_figures_add_one_relationship_at_a_time (test_source.SourceContractTests.test_figures_add_one_relationship_at_a_time) ... ok
test_numeric_models_independently_recomputed (test_source.SourceContractTests.test_numeric_models_independently_recomputed) ... ok
test_proof_revision_rejects_path_components_before_any_write (test_source.SourceContractTests.test_proof_revision_rejects_path_components_before_any_write) ... ok
test_reproducible_sources_and_assets (test_source.SourceContractTests.test_reproducible_sources_and_assets) ... ok
test_six_assets_and_every_reference (test_source.SourceContractTests.test_six_assets_and_every_reference) ... ok
test_source_letters_are_not_pandoc_auto_lists (test_source.SourceContractTests.test_source_letters_are_not_pandoc_auto_lists) ... ok
test_target_exact_source_and_points (test_source.SourceContractTests.test_target_exact_source_and_points) ... ok
test_target_table_retains_every_frozen_cell (test_source.SourceContractTests.test_target_table_retains_every_frozen_cell) ... ok
test_worked_image_native_short_alt_keeps_entire_caption (test_source.SourceContractTests.test_worked_image_native_short_alt_keeps_entire_caption) ... ok

----------------------------------------------------------------------
Ran 13 tests in 0.061s

OK

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-ALT-verify.py

- cwd: `C:\wt\book2-211-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:52:08.375Z`
- finished_at: `2026-09-05T19:52:09.429Z`
- duration_ms: `1054`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `0570e9e69aedc0700254f23bceb14c816fb68082701285562ab3a74a99796581`

### stdout excerpt

```text

```

### stderr excerpt

```text
Traceback (most recent call last):
  File "C:\wt\book2-211-alt-correction-20260905\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-211-ALT-verify.py", line 151, in <module>
    (rebuild if "--rebuild" in sys.argv else audit)()
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^^
  File "C:\wt\book2-211-alt-correction-20260905\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-211-ALT-verify.py", line 72, in audit
    verify_record_freshness(record)
    ~~~~~~~~~~~~~~~~~~~~~~~^^^^^^^^
  File "C:\wt\book2-211-alt-correction-20260905\4veco-platform\build-scripts\content\book-2\print_pipeline.py", line 249, in verify_record_freshness
    if digest(Path(record[path_field])) != record[hash_field]:
       ~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\wt\book2-211-alt-correction-20260905\4veco-platform\build-scripts\content\book-2\print_pipeline.py", line 69, in digest
    return hashlib.sha256(path.read_bytes()).hexdigest()
                          ~~~~~~~~~~~~~~~^^
  File "C:\Python314\Lib\pathlib\__init__.py", line 777, in read_bytes
    with self.open(mode='rb', buffering=0) as f:
         ~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Python314\Lib\pathlib\__init__.py", line 771, in open
    return io.open(self, mode, buffering, encoding, errors, newline)
           ~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
FileNotFoundError: [Errno 2] No such file or directory: 'C:\\wt\\book2-211-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren – paragraaf.md'

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-ALT-verify.py

- cwd: `C:\wt\book2-211-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:52:34.247Z`
- finished_at: `2026-09-05T19:52:37.254Z`
- duration_ms: `3007`
- exit_code: `0`
- stdout_sha256: `21bdaf97a283503419072fdaa5d41d77541e0c07541ee02bbab1aa0eadabe5d1`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "assets": 6,
  "pages": 31,
  "protected_files": 20,
  "legacy_zip": {
    "path": "C:\\wt\\book2-211-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren � opgaven.zip",
    "unchanged_from_base": true,
    "members": [
      "2.1.1 Kostenstructuren � antwoorden.html",
      "2.1.1 Kostenstructuren � antwoorden.md",
      "2.1.1 Kostenstructuren � antwoorden.pdf",
      "2.1.1 Kostenstructuren � opgaven.html",
      "2.1.1 Kostenstructuren � opgaven.md",
      "2.1.1 Kostenstructuren � opgaven.pdf",
      "2.1.1 Kostenstructuren � paragraaf.html",
      "2.1.1 Kostenstructuren � paragraaf.md",
      "2.1.1 Kostenstructuren � paragraaf.pdf",
      "2.1.1-quality-ref.yaml",
      "2.1.1-review.md",
      "build_pdf.py",
      "_assets/",
      "_assets/2.1.1_fig_1.png",
      "_assets/2.1.1_fig_1.svg"
    ],
    "CRC_error": null,
    "builder_contract": "211 native builder and thin entrypoint have no ZIP support; not rebuilt or claimed current"
  },
  "visual_approval": "NOT_SUPPLIED_BY_SCRIPT"
}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe build-scripts/content/book-2/211/check_render.py

- cwd: `C:\wt\book2-211-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:52:57.666Z`
- finished_at: `2026-09-05T19:52:58.522Z`
- duration_ms: `856`
- exit_code: `0`
- stdout_sha256: `7889867cbfea5292907ba549cf17b57a2165375757c9e82ec4ca1df9ab0fc14d`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "paragraph": "2.1.1",
  "automated_checks": [
    "all printed text including footer >=12pt",
    "all exercises present",
    "exact target context/prompts in HTML and PDF",
    "literal a-e plus4/3/3/3/4points",
    "exact supplied header/row cells",
    "four exact goals in paragraph PDF",
    "identical exercise HTML fragments"
  ],
  "documents": [
    {
      "kind": "paragraaf",
      "pages": 15,
      "minimum_printed_font_pt_including_footer": 12.0,
      "pdf_sha256": "9837e3a85f3129a5309a36b17fd1030702ba92fc7ef464af609cb878e4d2f8b0"
    },
    {
      "kind": "opgaven",
      "pages": 9,
      "minimum_printed_font_pt_including_footer": 12.0,
      "pdf_sha256": "97329415bacc150675a327ad31455b25b8e9e1b03012ef6b65dab10ab1f02953"
    },
    {
      "kind": "antwoorden",
      "pages": 7,
      "minimum_printed_font_pt_including_footer": 12.0,
      "pdf_sha256": "ffdf0905a980b6c89b64207e90873d79edbf192c86c2280f3394caa25693998a"
    }
  ],
  "visual_review_status": "NOT_SUPPLIED_BY_THIS_SCRIPT"
}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-ALT-verify.py --rebuild

- cwd: `C:\wt\book2-211-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:52:59.294Z`
- finished_at: `2026-09-05T19:53:09.209Z`
- duration_ms: `9915`
- exit_code: `0`
- stdout_sha256: `d664229a6edb72229bc6ab5c5c3b233baacc91868e63fef677ff99e7fc347383`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.1.1
Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard
{
  "full_rebuild_identical": true,
  "native_build_document_print_only_identical": true,
  "files": {
    "C:\\wt\\book2-211-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 paragraaf.md": "de7abc910f6ec940eb329abd003085921f32409956ec1e0450bcc4a5454eb6b5",
    "C:\\wt\\book2-211-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 paragraaf.html": "10721f1ad745b8e1358ba354c5ded64a74367f5081eaf1c676ecb88dbe10e44b",
    "C:\\wt\\book2-211-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 paragraaf.pdf": "9837e3a85f3129a5309a36b17fd1030702ba92fc7ef464af609cb878e4d2f8b0",
    "C:\\wt\\book2-211-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 opgaven.md": "bacccc1c9b063c4c786f2749d31993d94eb671fdc5bf0a899fb123d89bc0558b",
    "C:\\wt\\book2-211-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 opgaven.html": "9e27b80089dee95fa4ac61a3f07baaf95ff3650518943a730db122befec2a6f8",
    "C:\\wt\\book2-211-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 opgaven.pdf": "97329415bacc150675a327ad31455b25b8e9e1b03012ef6b65dab10ab1f02953",
    "C:\\wt\\book2-211-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 antwoorden.md": "57cc1ef3b5c5ae6d912291f9746a7f535906bb85207678bab8fc63dadf82ebfb",
    "C:\\wt\\book2-211-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 antwoorden.html": "d4d3db3265820003a45e71955b9f3f2188a6036860fdcdc8fbbc49b944bfd0ca",
    "C:\\wt\\book2-211-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 antwoorden.pdf": "ffdf0905a980b6c89b64207e90873d79edbf192c86c2280f3394caa25693998a",
    "C:\\wt\\book2-211-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\_assets\\2.1.1_ex_1.png": "fc76afb4f507cf8e09a62a9cf7a209ded71b93f87c72b97803d95afc6678f24f",
    "C:\\wt\\book2-211-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\_assets\\2.1.1_ex_1.svg": "c2854b76d42ee1a2654f4e13886e5184b17119786bff71b7b908bedf4aae83e3",
    "C:\\wt\\book2-211-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\_assets\\2.1.1_fig_1.png": "21ca603069ffa83d885befa21696b1b0c7ea4a0f6fba8ed49021458000c8ba45",
    "C:\\wt\\book2-211
...[truncated 2495 chars]
```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-ALT-verify.py

- cwd: `C:\wt\book2-211-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:56:05.360Z`
- finished_at: `2026-09-05T19:56:08.466Z`
- duration_ms: `3106`
- exit_code: `0`
- stdout_sha256: `75ee570a1d8b605fcb79b7f85fbc3818769f325bb95753f0bd5755897499871f`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "assets": 6,
  "pages": 31,
  "protected_files": 20,
  "legacy_zip": {
    "path": "C:\\wt\\book2-211-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren � opgaven.zip",
    "sha256": "bb951635865a5e7e321f562ef73c640c84948f99441385f217cf366d9e3e996d",
    "unchanged_from_base": true,
    "members": [
      "2.1.1 Kostenstructuren � antwoorden.html",
      "2.1.1 Kostenstructuren � antwoorden.md",
      "2.1.1 Kostenstructuren � antwoorden.pdf",
      "2.1.1 Kostenstructuren � opgaven.html",
      "2.1.1 Kostenstructuren � opgaven.md",
      "2.1.1 Kostenstructuren � opgaven.pdf",
      "2.1.1 Kostenstructuren � paragraaf.html",
      "2.1.1 Kostenstructuren � paragraaf.md",
      "2.1.1 Kostenstructuren � paragraaf.pdf",
      "2.1.1-quality-ref.yaml",
      "2.1.1-review.md",
      "build_pdf.py",
      "_assets/",
      "_assets/2.1.1_fig_1.png",
      "_assets/2.1.1_fig_1.svg"
    ],
    "CRC_error": null,
    "builder_contract": "211 native builder and thin entrypoint have no ZIP support; not rebuilt or claimed current"
  },
  "visual_approval": "NOT_SUPPLIED_BY_SCRIPT"
}

```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile student-web "\"C:/wt/book2-211-alt-correction-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren\""

- cwd: `C:\wt\book2-211-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:56:08.934Z`
- finished_at: `2026-09-05T19:56:09.073Z`
- duration_ms: `139`
- exit_code: `0`
- stdout_sha256: `d09b10f63b8234164d2e3ce76bcadeaa9a5561e1d54318af610deb075c4a3a55`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.1.1 "Kostenstructuren"
Path: C:\wt\book2-211-alt-correction-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.1 Hoofdstuk Kosten en opbrengsten\2.1.1 Kostenstructuren
Mode: part-a
Profile: student-web

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.1.1 Kostenstructuren – paragraaf.md
  OK opgaven.md: 2.1.1 Kostenstructuren – opgaven.md
  OK antwoorden.md: 2.1.1 Kostenstructuren – antwoorden.md
  OK 2.1.1 Kostenstructuren – paragraaf.html (710.4 KB)
  OK 2.1.1 Kostenstructuren – opgaven.html (245.1 KB)
  OK 2.1.1 Kostenstructuren – antwoorden.html (18.3 KB)
  OK 2.1.1 Kostenstructuren – paragraaf.pdf (518 KB)
  OK 2.1.1 Kostenstructuren – opgaven.pdf (188 KB)
  OK 2.1.1 Kostenstructuren – antwoorden.pdf (31 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 6 image refs all resolve
  OK _assets/: 6 SVGs, 6 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.1.1-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.1.1-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.1.1 "Kostenstructuren" PASSED all checks.


```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile publisher-print "\"C:/wt/book2-211-alt-correction-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren\""

- cwd: `C:\wt\book2-211-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:56:09.118Z`
- finished_at: `2026-09-05T19:56:09.178Z`
- duration_ms: `60`
- exit_code: `0`
- stdout_sha256: `95f95cdbd144c70b3fba8bd4db676db2a33a91adcf29f97fc07838d12d514779`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.1.1 "Kostenstructuren"
Path: C:\wt\book2-211-alt-correction-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.1 Hoofdstuk Kosten en opbrengsten\2.1.1 Kostenstructuren
Mode: part-a
Profile: publisher-print

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.1.1 Kostenstructuren – paragraaf.md
  OK opgaven.md: 2.1.1 Kostenstructuren – opgaven.md
  OK antwoorden.md: 2.1.1 Kostenstructuren – antwoorden.md
  OK 2.1.1 Kostenstructuren – paragraaf.pdf (518 KB)
  OK 2.1.1 Kostenstructuren – opgaven.pdf (188 KB)
  OK 2.1.1 Kostenstructuren – antwoorden.pdf (31 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 6 image refs all resolve
  OK _assets/: 6 SVGs, 6 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.1.1-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.1.1-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.1.1 "Kostenstructuren" PASSED all checks.


```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action paragraph_production --paragraph 2.1.1

- cwd: `C:\wt\book2-211-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:56:09.224Z`
- finished_at: `2026-09-05T19:56:10.980Z`
- duration_ms: `1756`
- exit_code: `0`
- stdout_sha256: `2588f67f1bb250f78fd94fc551099e1000c659528e8d3a89119566c3a55d52cd`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.1.1

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book2-target-authority-remediation.js --durable

- cwd: `C:\wt\book2-211-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:56:11.022Z`
- finished_at: `2026-09-05T19:56:11.590Z`
- duration_ms: `568`
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
## node build-scripts/sprints/check-sprint-bundle.js BOOK2-TEXTBOOK-PRODUCTION-1

- cwd: `C:\wt\book2-211-alt-correction-20260905\4veco-platform`
- started_at: `2026-09-05T19:56:11.631Z`
- finished_at: `2026-09-05T19:56:11.805Z`
- duration_ms: `174`
- exit_code: `0`
- stdout_sha256: `699bba7f2550eced00884bc621132de46fe5608c6b1baf7757bd06afbdbe896d`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: BOOK2-TEXTBOOK-PRODUCTION-1 planned/active

```

### stderr excerpt

```text

```
