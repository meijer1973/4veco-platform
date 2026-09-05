# Sprint BOOK2-TEXTBOOK-PRODUCTION-1-212-S1: Command Log

## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-run.py snapshot

- cwd: `C:\wt\book2-212-succession-20260906\4veco-platform`
- started_at: `2026-09-05T23:20:48.405Z`
- finished_at: `2026-09-05T23:20:50.206Z`
- duration_ms: `1801`
- exit_code: `0`
- stdout_sha256: `2afa004989f7fab8a6c0b196526224c9a84d97245f3acc83d0790eea5ffc42f9`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Baseline:34 native, all archive members, protected inputs and old212 proof files captured.

```

### stderr excerpt

```text

```
## C:/Python314/python.exe -m unittest discover -s build-scripts/content/book-2/212 -p "test_*.py" -v

- cwd: `C:\wt\book2-212-succession-20260906\4veco-platform`
- started_at: `2026-09-05T23:22:34.462Z`
- finished_at: `2026-09-05T23:22:37.216Z`
- duration_ms: `2754`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `ef9f84b4f5f9a81342a4983dc120341901597dba5377e6a94ac2290265a29255`

### stdout excerpt

```text

```

### stderr excerpt

```text
test_current_exact_full_source_and_three_criteria (test_bonus.BonusTests.test_current_exact_full_source_and_three_criteria) ... ok
test_missing_extra_and_misplaced_criteria_rejected (test_bonus.BonusTests.test_missing_extra_and_misplaced_criteria_rejected) ... ok
test_model_answer_and_unrelated_source_drift_rejected (test_bonus.BonusTests.test_model_answer_and_unrelated_source_drift_rejected) ... ok
test_five_context_titles_and_old_negative_fixtures (test_metadata.MetadataTests.test_five_context_titles_and_old_negative_fixtures) ... ok
test_nine_exact_native_insertions_and_unchanged_full_sources (test_metadata.MetadataTests.test_nine_exact_native_insertions_and_unchanged_full_sources) ... ok
test_original_failing_alt_fixtures_remain_negative (test_metadata.MetadataTests.test_original_failing_alt_fixtures_remain_negative) ... ok
test_short_alts_functional_and_bounded (test_metadata.MetadataTests.test_short_alts_functional_and_bounded) ... ok
test_unchanged_generator_outside_title_loop (test_metadata.MetadataTests.test_unchanged_generator_outside_title_loop) ... ok
test_eleven_assets_and_no_answer_leakage (test_source.SourceTests.test_eleven_assets_and_no_answer_leakage) ... ok
test_exact_arithmetic_geometry (test_source.SourceTests.test_exact_arithmetic_geometry) ... ok
test_font_and_contrast (test_source.SourceTests.test_font_and_contrast) ... ok
test_frozen_target_goals_points_answers (test_source.SourceTests.test_frozen_target_goals_points_answers) ... ok
test_no_letter_drift_or_online_dependencies (test_source.SourceTests.test_no_letter_drift_or_online_dependencies) ... ok
test_other_arithmetic_and_timing (test_source.SourceTests.test_other_arithmetic_and_timing) ... ok
test_progressive_graphs (test_source.SourceTests.test_progressive_graphs) ... ok
test_repeatable (test_source.SourceTests.test_repeatable) ... ok
test_single_exercise_source_and_headings (test_source.SourceTests.test_single_exercise_source_and_headings) ... ok
test_unsafe_proof_suffix_before_write (test_source.SourceTests.test_unsafe_proof_suffix_before_write) ... ok
test_each_missing_or_unknown_input_rejected_before_process_mkdir_write (test_succession.SuccessionTests.test_each_missing_or_unknown_input_rejected_before_process_mkdir_write) ... ok
test_exact_complete_generator_from_both_immutable_baselines (test_succession.SuccessionTests.test_exact_complete_generator_from_both_immutable_baselines) ... ok
test_exact_original_tests_and_other_metadata_methods (test_succession.SuccessionTests.test_exact_original_tests_and_other_metadata_methods) ... ok
test_four_whole_sources_and_unrelated_source_rejection (test_succession.SuccessionTests.test_four_whole_sources_and_unrelated_source_rejection) ... ok
test_old_partial_unknown_and_unrelated_generators_rejected (test_succession.SuccessionTests.test_old_partial_unknown_and_unrelated_generators_rejected) ... ok
test_successor_files_are_exact_published_accepted_predecessor (test_succession.SuccessionTests.test_successor_files_are_exact_published_accepted_predecessor) ... ok
test_valid_actual_inputs_reach_first_governance_process_only (test_succession.SuccessionTests.test_valid_actual_inputs_reach_first_governance_process_only) ... ok

----------------------------------------------------------------------
Ran 25 tests in 2.192s

OK

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-run.py full

- cwd: `C:\wt\book2-212-succession-20260906\4veco-platform`
- started_at: `2026-09-05T23:22:56.029Z`
- finished_at: `2026-09-05T23:23:14.012Z`
- duration_ms: `17983`
- exit_code: `1`
- stdout_sha256: `27e268571099d87479b1b3591ea61464d910aa708bf160a7edfc59a8029bac9a`
- stderr_sha256: `65b1612c7bb97e8cd2ab6f8ffe2fe7fc0b58ad11cc0703ae33e5d39936593d3c`

### stdout excerpt

```text
full-r7-command.json exit 0

```

### stderr excerpt

```text
Traceback (most recent call last):
  File "C:\wt\book2-212-succession-20260906\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-run.py", line 216, in <module>
    else: build_mode(args.mode)
          ~~~~~~~~~~^^^^^^^^^^^
  File "C:\wt\book2-212-succession-20260906\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-run.py", line 185, in build_mode
    pages=compare_pages(current),protected_unchanged=True,old_proofs_unchanged=True,
          ~~~~~~~~~~~~~^^^^^^^^^
  File "C:\wt\book2-212-succession-20260906\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-run.py", line 149, in compare_pages
    previous=json.loads((old_dir/'manifest.json').read_text(encoding='utf-8'))
                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^
  File "C:\Python314\Lib\pathlib\__init__.py", line 787, in read_text
    with self.open(mode='r', encoding=encoding, errors=errors, newline=newline) as f:
         ~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Python314\Lib\pathlib\__init__.py", line 771, in open
    return io.open(self, mode, buffering, encoding, errors, newline)
           ~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
FileNotFoundError: [Errno 2] No such file or directory: 'C:\\wt\\book2-212-succession-20260906\\4veco-platform\\reports\\rendered-proof\\BOOK2-TEXTBOOK-PRODUCTION-1\\212-paragraaf-e94d42f66ab9-r9\\manifest.json'

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-run.py supplement

- cwd: `C:\wt\book2-212-succession-20260906\4veco-platform`
- started_at: `2026-09-05T23:28:40.753Z`
- finished_at: `2026-09-05T23:28:45.622Z`
- duration_ms: `4869`
- exit_code: `0`
- stdout_sha256: `9d5aaea1b860acfb9d09e829cc8001c3752baec0e3592ae7305b2bb23015d7c5`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Immutable PBASE supplemental proof binding: 171 files.

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-run.py full

- cwd: `C:\wt\book2-212-succession-20260906\4veco-platform`
- started_at: `2026-09-05T23:28:54.725Z`
- finished_at: `2026-09-05T23:29:48.743Z`
- duration_ms: `54018`
- exit_code: `0`
- stdout_sha256: `e113afbcf9c2de7146fe877c42326add5360f6109070b9c2eb8a188e1446ee75`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
full-r10-command.json exit 0
full r10:34 raw-identical native files, ZIP19/11/9,27 byte/pixel-identical pages.

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-run.py thin

- cwd: `C:\wt\book2-212-succession-20260906\4veco-platform`
- started_at: `2026-09-05T23:30:08.043Z`
- finished_at: `2026-09-05T23:30:33.276Z`
- duration_ms: `25233`
- exit_code: `0`
- stdout_sha256: `30a6dfed34cf3aa7bf70c62a3502b90819f62f85d3230c0a118eb055d4fcfc24`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
thin-r11-command.json exit 0
thin r11:34 raw-identical native files, ZIP19/11/9,27 byte/pixel-identical pages.

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-run.py validate

- cwd: `C:\wt\book2-212-succession-20260906\4veco-platform`
- started_at: `2026-09-05T23:30:53.965Z`
- finished_at: `2026-09-05T23:31:01.005Z`
- duration_ms: `7040`
- exit_code: `0`
- stdout_sha256: `c5bfd18eb474183ba50ab15f9c4d4e113ad41d247aac940839446bdea6685a0e`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
validation-focused-tests.json exit 0
validation-native-checker.json exit 0
validation-student-web.json exit 0
validation-publisher-print.json exit 0
validation-currentness.json exit 0
validation-durable-authority.json exit 0
validation-active-bundle.json exit 0
Focused tests, native checker, both Part A profiles, currentness, durable authority and active bundle PASS. Not independent acceptance.

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-run.py print

- cwd: `C:\wt\book2-212-succession-20260906\4veco-platform`
- started_at: `2026-09-05T23:31:09.731Z`
- finished_at: `2026-09-05T23:31:31.307Z`
- duration_ms: `21576`
- exit_code: `0`
- stdout_sha256: `622b75a59ae26c9c3c17c1ce60f647d87680c3bf33c154a6ddccfbfdc0a44839`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
print-r12-command.json exit 0
print r12:34 raw-identical native files, ZIP19/11/9,27 byte/pixel-identical pages.

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-run.py audit --name pre-payload-audit

- cwd: `C:\wt\book2-212-succession-20260906\4veco-platform`
- started_at: `2026-09-05T23:34:56.383Z`
- finished_at: `2026-09-05T23:34:59.642Z`
- duration_ms: `3259`
- exit_code: `0`
- stdout_sha256: `f7f5d126363cd92a92639ed564995f075480ac0224254a7fb5589fb0805432be`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
pre-payload-audit-tests.json exit 0
pre-payload-audit: strict whole owned delta and all25 source/test guards PASS.

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-run.py check

- cwd: `C:\wt\book2-212-succession-20260906\4veco-platform`
- started_at: `2026-09-05T23:36:51.055Z`
- finished_at: `2026-09-05T23:36:51.354Z`
- duration_ms: `299`
- exit_code: `0`
- stdout_sha256: `46adac3d3e4c8709b14a23bf08a66d82942a509bb2f489aff7b88176260930fb`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
All34 native/archives/protected/old proofs unchanged.

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base 572d1ea2ededaffd28afc44eeeca223252a58ec5 --head HEAD

- cwd: `C:\wt\book2-212-succession-20260906\4veco-platform`
- started_at: `2026-09-05T23:37:24.109Z`
- finished_at: `2026-09-05T23:37:24.238Z`
- duration_ms: `129`
- exit_code: `0`
- stdout_sha256: `927066048da4d681ea01845ab2759368efdbac109ddd11e86fc24c37ce462dd2`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (shared)
- shared platform: 3
  - build-scripts/content/book-2/212/test_metadata.py
  - build-scripts/content/book-2/212/test_succession.py
  - build-scripts/content/book-2/b2_212.py
- review evidence: 163
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-antwoorden-d55f1da66723-r7/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-antwoorden-d55f1da66723-r7/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-antwoorden-d55f1da66723-r7/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-antwoorden-d55f1da66723-r7/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-antwoorden-d55f1da66723-r7/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-antwoorden-d55f1da66723-r7/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-antwoorden-d55f1da66723-r7/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-antwoorden-d55f1da66723-r7/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r7/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r7/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r7/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r7/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r7/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r7/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r7/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r7/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r7/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r7/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r7/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r7/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r7/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r7/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r7/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r7/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r7/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r7/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r7/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r7/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r7/pages/page-010.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r7/pages/page-011.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r7/pages/page-012.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r7/pages/page-013.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r7/pages/page-014.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-command-log.jsonl
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-command-log.md
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-evidence/attempt-r10.json
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-evidence/attempt-r11.json
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-evi
...[truncated 14157 chars]
```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base origin/main --head HEAD

- cwd: `C:\wt\book2-212-succession-20260906\4veco-platform`
- started_at: `2026-09-05T23:37:25.160Z`
- finished_at: `2026-09-05T23:37:25.328Z`
- duration_ms: `168`
- exit_code: `0`
- stdout_sha256: `7e67d2dd126a56b6830fbdd3228254e8ba3ab7cdd4370c4d34117e1cd3e8dfda`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (shared)
- shared platform: 70
  - build-scripts/books/book-manifests/book-2-antwoorden-voorwoord.md
  - build-scripts/books/book-manifests/book-2-voorwoord.md
  - build-scripts/books/lib_book.py
  - build-scripts/content/book-2/211/answers.md
  - build-scripts/content/book-2/211/check_render.py
  - build-scripts/content/book-2/211/exercises.md
  - build-scripts/content/book-2/211/target-answers.md
  - build-scripts/content/book-2/211/test_bonus.py
  - build-scripts/content/book-2/211/test_source.py
  - build-scripts/content/book-2/211/theory.md
  - build-scripts/content/book-2/212/answers.md
  - build-scripts/content/book-2/212/check_render.py
  - build-scripts/content/book-2/212/exercises.md
  - build-scripts/content/book-2/212/target-answers.md
  - build-scripts/content/book-2/212/test_bonus.py
  - build-scripts/content/book-2/212/test_metadata.py
  - build-scripts/content/book-2/212/test_source.py
  - build-scripts/content/book-2/212/test_succession.py
  - build-scripts/content/book-2/212/theory.md
  - build-scripts/content/book-2/213/alt_contract.py
  - build-scripts/content/book-2/213/answers.md
  - build-scripts/content/book-2/213/check_render.py
  - build-scripts/content/book-2/213/exercises.md
  - build-scripts/content/book-2/213/target-answers.md
  - build-scripts/content/book-2/213/test_bonus_contract.py
  - build-scripts/content/book-2/213/test_source.py
  - build-scripts/content/book-2/213/theory.md
  - build-scripts/content/book-2/213/verify_alt_delta.py
  - build-scripts/content/book-2/213/verify_rebuild.py
  - build-scripts/content/book-2/221/answers.md
  - build-scripts/content/book-2/221/check_render.py
  - build-scripts/content/book-2/221/exercises.md
  - build-scripts/content/book-2/221/target-answers.md
  - build-scripts/content/book-2/221/test_source.py
  - build-scripts/content/book-2/221/theory.md
  - build-scripts/content/book-2/222/answers.md
  - build-scripts/content/book-2/222/check_render.py
  - build-scripts/content/book-2/222/exercises.md
  - build-scripts/content/book-2/222/target-answers.md
  - build-scripts/content/book-2/222/test_source.py
  - build-scripts/content/book-2/222/theory.md
  - build-scripts/content/book-2/223/answers.md
  - build-scripts/content/book-2/223/check_render.py
  - build-scripts/content/book-2/223/exercises.md
  - build-scripts/content/book-2/223/target-answers.md
  - build-scripts/content/book-2/223/test_source.py
  - build-scripts/content/book-2/223/theory.md
  - build-scripts/content/book-2/README.md
  - build-scripts/content/book-2/b2_211.py
  - build-scripts/content/book-2/b2_212.py
  - build-scripts/content/book-2/b2_213.py
  - build-scripts/content/book-2/b2_221.py
  - build-scripts/content/book-2/b2_222.py
  - build-scripts/content/book-2/b2_223.py
  - build-scripts/content/book-2/book_pipeline.py
  - build-scripts/content/book-2/chapter_pipeline.py
  - build-scripts/content/book-2/print_pipeline.py
  - build-scripts/content/book-2/test_book_pipeline.py
  - build-scripts/content/book-2/test_chapter_pipeline.py
  - build-scripts/content/book-2/test_print_pipeline.py
  - build-scripts/workflows/check-paragraph-lane-scope.js
  - build-scripts/workflows/check-paragraph-lane-scope.test.js
  - docs/roadmaps/outdated/textbook-production-roadmap-v1.20-gate0b1-owner-approved-transition.md
  - docs/roadmaps/roadmap-version-index.json
  - docs/roadmaps/roadmap-version-index.md
  - docs/roadmaps/textbook/sprint-ledger.md
  - docs/roadmaps/textbook/textbook-production-roadmap.md
  - references/authored/book-outlines/book-2-outline.md
  - references/authored/book-outlines/book-2-outline.meta.json
  - references/data/sprints/BOOK2-TEXTBOOK-PRODUCTION-1.plan.json
- generated index/report: 6
  - reports/github-agent-index-lessen.json
  - reports/github-agent-index-lessen.md
  - reports/github-agent-index-platform.json
  - reports/github-agent-index-platform.md
  - reports/internal-dashboard/dashboard-data.json
  - reports/internal-dashboard/index.html
...[truncated 214227 chars]
```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-run.py audit --name committed-payload-audit --head 8fc9957a8118079888f0503bcd066aec820aa315

- cwd: `C:\wt\book2-212-succession-20260906\4veco-platform`
- started_at: `2026-09-05T23:37:48.328Z`
- finished_at: `2026-09-05T23:37:51.348Z`
- duration_ms: `3020`
- exit_code: `0`
- stdout_sha256: `88c76787294244d210c5e75400f8cf87810c2d4efc37d468dfbd3e9456de51a4`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
committed-payload-audit-tests.json exit 0
committed-payload-audit: strict whole owned delta and all25 source/test guards PASS.

```

### stderr excerpt

```text

```
## git diff --check 572d1ea2ededaffd28afc44eeeca223252a58ec5 8fc9957a8118079888f0503bcd066aec820aa315

- cwd: `C:\wt\book2-212-succession-20260906\4veco-platform`
- started_at: `2026-09-05T23:37:52.123Z`
- finished_at: `2026-09-05T23:37:52.304Z`
- duration_ms: `181`
- exit_code: `2`
- stdout_sha256: `cf923a1bca2d88f364da9e0ea46baa46e7a09ce97d3447fa52d28aaa25400464`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-command-log.md:16: trailing whitespace.
+Baseline:34 native, all archive members, protected inputs and old212 proof files captured.
reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-command-log.md:44: trailing whitespace.
+test_current_exact_full_source_and_three_criteria (test_bonus.BonusTests.test_current_exact_full_source_and_three_criteria) ... ok
reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-command-log.md:45: trailing whitespace.
+test_missing_extra_and_misplaced_criteria_rejected (test_bonus.BonusTests.test_missing_extra_and_misplaced_criteria_rejected) ... ok
reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-command-log.md:46: trailing whitespace.
+test_model_answer_and_unrelated_source_drift_rejected (test_bonus.BonusTests.test_model_answer_and_unrelated_source_drift_rejected) ... ok
reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-command-log.md:47: trailing whitespace.
+test_five_context_titles_and_old_negative_fixtures (test_metadata.MetadataTests.test_five_context_titles_and_old_negative_fixtures) ... ok
reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-command-log.md:48: trailing whitespace.
+test_nine_exact_native_insertions_and_unchanged_full_sources (test_metadata.MetadataTests.test_nine_exact_native_insertions_and_unchanged_full_sources) ... ok
reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-command-log.md:49: trailing whitespace.
+test_original_failing_alt_fixtures_remain_negative (test_metadata.MetadataTests.test_original_failing_alt_fixtures_remain_negative) ... ok
reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-command-log.md:50: trailing whitespace.
+test_short_alts_functional_and_bounded (test_metadata.MetadataTests.test_short_alts_functional_and_bounded) ... ok
reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-command-log.md:51: trailing whitespace.
+test_unchanged_generator_outside_title_loop (test_metadata.MetadataTests.test_unchanged_generator_outside_title_loop) ... ok
reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-command-log.md:52: trailing whitespace.
+test_eleven_assets_and_no_answer_leakage (test_source.SourceTests.test_eleven_assets_and_no_answer_leakage) ... ok
reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-command-log.md:53: trailing whitespace.
+test_exact_arithmetic_geometry (test_source.SourceTests.test_exact_arithmetic_geometry) ... ok
reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-command-log.md:54: trailing whitespace.
+test_font_and_contrast (test_source.SourceTests.test_font_and_contrast) ... ok
reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-command-log.md:55: trailing whitespace.
+test_frozen_target_goals_points_answers (test_source.SourceTests.test_frozen_target_goals_points_answers) ... ok
reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-command-log.md:56: trailing whitespace.
+test_no_letter_drift_or_online_dependencies (test_source.SourceTests.test_no_letter_drift_or_online_dependencies) ... ok
reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-command-log.md:57: trailing whitespace.
+test_other_arithmetic_and_timing (test_source.SourceTests.test_other_arithmetic_and_timing) ... ok
reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-command-log.md:58: trailing whitespace.
+test_progressive_graphs (test_source.SourceTests.test_progressive_graphs) ... ok
reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-command-log.md:59: trailing whitespace.
+test_repeatable (test_source.SourceTests.test_repeatable) ... ok
reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-command-log.md:60: trailing whitespace.
+test_single_exercise_source_and_headings (test_source.SourceTests.test_single_exercise_source_and_headings) ... ok
reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-command-log.md:61: trailing whitespace.
+test_unsafe_proof_suffix_before_write (test_source.SourceTests.test_unsafe_proof_suffix_before_write) ... ok
reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-command-log.md:62: 
...[truncated 8093 chars]
```

### stderr excerpt

```text

```
## git -c core.whitespace=cr-at-eol diff --check 572d1ea2ededaffd28afc44eeeca223252a58ec5 8fc9957a8118079888f0503bcd066aec820aa315

- cwd: `C:\wt\book2-212-succession-20260906\4veco-platform`
- started_at: `2026-09-05T23:37:52.973Z`
- finished_at: `2026-09-05T23:37:53.153Z`
- duration_ms: `180`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-scope.py

- cwd: `C:\wt\book2-212-succession-20260906\4veco-platform`
- started_at: `2026-09-05T23:40:10.812Z`
- finished_at: `2026-09-05T23:40:11.624Z`
- duration_ms: `812`
- exit_code: `0`
- stdout_sha256: `cb3a3ac017e9ae0c69c9340f68409a46214a94d175688d2262ce54f1a3e45e24`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
complete-scope-owned.json exit 0
complete-scope-whole-candidate.json exit 0
payload-cr-at-eol-whitespace.json exit 0
payload-source-whitespace.json exit 0
Complete exact committed scope output preserved; native/protected/lesson tree unchanged.

```

### stderr excerpt

```text

```
