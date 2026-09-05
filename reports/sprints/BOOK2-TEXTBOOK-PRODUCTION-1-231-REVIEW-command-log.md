# Sprint BOOK2-TEXTBOOK-PRODUCTION-1-231-REVIEW: Command Log

## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-review-runner.cjs scope-assessment

- cwd: `C:\wt\book2-231-review-20260906\4veco-platform`
- started_at: `2026-09-05T23:17:42.816Z`
- finished_at: `2026-09-05T23:17:50.055Z`
- duration_ms: `7239`
- exit_code: `0`
- stdout_sha256: `72fada299a033bc2c673a208379ee4c0516fa3305acfec9bf3ac73abca9c9f06`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "status": "SUPPORTED_WITH_CONSTRAINTS",
  "originals": 66,
  "native_manifests": 27,
  "native_grayscale_references": 0,
  "reference_files": [
    "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-PRODUCTION-command-log.jsonl",
    "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-PRODUCTION-command-log.md",
    "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-builder-personal-inspection-r8.json",
    "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-production-audit.js",
    "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-production-candidate.md",
    "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-production-classifier-gap-r1.json",
    "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-production-scope-r1.json",
    "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-reproduction-r4.json",
    "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-reproduction-r8.json"
  ],
  "scope_baselines": {
    "owned_platform_base": "3abef1a17131e36aa7047e461900c014dca73642",
    "owned_lesson_base": "4fe0d742a3cd3c02ac1aaf6311dccc540970e2f5",
    "complete_platform_base": "96416b6b5bd57094576e9aba0a42d682584ec479",
    "complete_lesson_base": "f09fd6e88edc5049b026b16b0158e7e188091d2d"
  }
}

```

### stderr excerpt

```text

```
## npm.cmd ci --ignore-scripts

- cwd: `C:\wt\book2-231-review-20260906\4veco-platform`
- started_at: `2026-09-05T23:17:50.104Z`
- finished_at: `2026-09-05T23:17:55.431Z`
- duration_ms: `5327`
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
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-review-runner.cjs scope-correspondence

- cwd: `C:\wt\book2-231-review-20260906\4veco-platform`
- started_at: `2026-09-05T23:19:15.482Z`
- finished_at: `2026-09-05T23:19:15.593Z`
- duration_ms: `111`
- exit_code: `0`
- stdout_sha256: `254f81ac8b39cc645a11fcb9eef4587f1a521f36fe5f4df487ca30cad1522643`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  status: 'PASS',
  all66_reproduction_hashes_match: true,
  all66_original_UNKNOWN: true,
  all66_proposed_review_evidence: true
}

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-review-runner.cjs source-tests C:/Python314/python.exe build-scripts/content/book-2/231/test_source.py

- cwd: `C:\wt\book2-231-review-20260906\4veco-platform`
- started_at: `2026-09-05T23:19:15.651Z`
- finished_at: `2026-09-05T23:19:17.331Z`
- duration_ms: `1680`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `6207c71032106e6d0f93095b09cd8e63ec5fbac88b67f40bb8964266a5aa5d3a`

### stdout excerpt

```text

```

### stderr excerpt

```text
test_actual_native_name_regex_all30 (__main__.SourceTests.test_actual_native_name_regex_all30) ... ok
test_actual_svg_economic_geometry_and_roles (__main__.SourceTests.test_actual_svg_economic_geometry_and_roles) ... ok
test_actual_svg_labels_canvas_all_ink_boxes (__main__.SourceTests.test_actual_svg_labels_canvas_all_ink_boxes) ... ok
test_all_model_calculations_independent_fractions (__main__.SourceTests.test_all_model_calculations_independent_fractions) ... ok
test_all_task_numbers_and_no_device_or_time_metadata (__main__.SourceTests.test_all_task_numbers_and_no_device_or_time_metadata) ... ok
test_authority_guard_rejects_each_changed_pin_before_processes (__main__.SourceTests.test_authority_guard_rejects_each_changed_pin_before_processes) ... ok
test_bonus_model_then_exact_three_criteria_and_negative_fixtures (__main__.SourceTests.test_bonus_model_then_exact_three_criteria_and_negative_fixtures) ... ok
test_discrete_and_model_boundary (__main__.SourceTests.test_discrete_and_model_boundary) ... ok
test_every_actual_alt_caption_and_union (__main__.SourceTests.test_every_actual_alt_caption_and_union) ... ok
test_exact_headings_route_and_recap (__main__.SourceTests.test_exact_headings_route_and_recap) ... ok
test_fading_and_independent_surfaces (__main__.SourceTests.test_fading_and_independent_surfaces) ... ok
test_fresh_revision_and_immutable_attempt_guards (__main__.SourceTests.test_fresh_revision_and_immutable_attempt_guards) ... ok
test_frozen_goals_target_and_scoring (__main__.SourceTests.test_frozen_goals_target_and_scoring) ... ok
test_no_false_predecessor_acceptance_or_changed_plan (__main__.SourceTests.test_no_false_predecessor_acceptance_or_changed_plan) ... ok
test_print_margin_guard_rejects_body_in_footer_and_false_footer (__main__.SourceTests.test_print_margin_guard_rejects_body_in_footer_and_false_footer) ... ok

----------------------------------------------------------------------
Ran 15 tests in 0.971s

OK

```
## node build-scripts/workflows/check-book-outline-currentness.js --action specialist_review --paragraph 2.3.1 --require-approved

- cwd: `C:\wt\book2-231-review-20260906\4veco-platform`
- started_at: `2026-09-05T23:19:17.389Z`
- finished_at: `2026-09-05T23:19:19.334Z`
- duration_ms: `1945`
- exit_code: `0`
- stdout_sha256: `17c621a2434015110c4cb7717f5a302b74ab68762f2574dbcdd25e8895ecce87`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.3.1

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book2-durable-state.js

- cwd: `C:\wt\book2-231-review-20260906\4veco-platform`
- started_at: `2026-09-05T23:19:19.361Z`
- finished_at: `2026-09-05T23:19:19.414Z`
- duration_ms: `53`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `8b3e02d52f77df8eb07285134550bdf6b996e6bf68291b649d88bc9e7c2d56ee`

### stdout excerpt

```text

```

### stderr excerpt

```text
node:internal/modules/cjs/loader:1451
  throw err;
  ^

Error: Cannot find module 'C:\wt\book2-231-review-20260906\4veco-platform\build-scripts\workflows\check-book2-durable-state.js'
    at Module._resolveFilename (node:internal/modules/cjs/loader:1448:15)
    at defaultResolveImpl (node:internal/modules/cjs/loader:1059:19)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1064:22)
    at Module._load (node:internal/modules/cjs/loader:1234:25)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
    at node:internal/main/run_main_module:33:47 {
  code: 'MODULE_NOT_FOUND',
  requireStack: []
}

Node.js v24.13.1

```
## node build-scripts/workflows/check-book2-target-authority-remediation.js --durable

- cwd: `C:\wt\book2-231-review-20260906\4veco-platform`
- started_at: `2026-09-05T23:19:49.054Z`
- finished_at: `2026-09-05T23:19:49.793Z`
- duration_ms: `739`
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
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-review-runner.cjs baseline

- cwd: `C:\wt\book2-231-review-20260906\4veco-platform`
- started_at: `2026-09-05T23:19:49.847Z`
- finished_at: `2026-09-05T23:19:50.043Z`
- duration_ms: `196`
- exit_code: `0`
- stdout_sha256: `a71b27100497bcd25cdd7b4fb36ebdaa7a441b184e7b7ffcbc5c5f494e276889`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{ lesson_files: 44 }

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-review-runner.cjs build-r11 C:/Python314/python.exe build-scripts/content/book-2/b2_231.py --lesson-root ../4veco-lessen --proof-root reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1 --proof-suffix r11 --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-build-manifest-r11.json

- cwd: `C:\wt\book2-231-review-20260906\4veco-platform`
- started_at: `2026-09-05T23:19:50.097Z`
- finished_at: `2026-09-05T23:20:06.892Z`
- duration_ms: `16795`
- exit_code: `0`
- stdout_sha256: `1af2ebaf3b3af57e0a26f8ea2b043b5c1a91a3290641cdf514b5fe3970fbdb19`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.3.1
Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard
{"assets":["2.3.1_fig_1","2.3.1_fig_2","2.3.1_fig_3","2.3.1_fig_4","2.3.1_we_1","2.3.1_ex_1","2.3.1_ex_2","2.3.1_ex_3","2.3.1_ex_4","2.3.1_ex_5","2.3.1_ex_6","2.3.1_ex_7","2.3.1_ex_8","2.3.1_ex_9","2.3.1_ex_10"],"pairs":15,"canvas":[1200,900],"png":[2400,1800],"font":"Arial regular 30pt","visual_acceptance":"NOT_ASSERTED"}
{
  "paragraph": "2.3.1",
  "revision": "r11",
  "manifest": "reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-231-build-manifest-r11.json",
  "packet_files": 42,
  "inspection_status": "PENDING"
}

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-review-runner.cjs reproduction C:/Python314/python.exe build-scripts/content/book-2/231/verify_rebuild.py reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-build-manifest-r11.json reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-review-reproduction-result.json reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-review-evidence/grayscale-r11

- cwd: `C:\wt\book2-231-review-20260906\4veco-platform`
- started_at: `2026-09-05T23:20:37.831Z`
- finished_at: `2026-09-05T23:21:21.069Z`
- duration_ms: `43238`
- exit_code: `0`
- stdout_sha256: `5f8236b3860b3d803641e2898d94135fb3e3218492b423b8ee5b77e5bb17525e`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "paragraph": "2.3.1",
  "visual_inspection": "NOT_SUPPLIED_BY_THIS_SCRIPT",
  "status": "PASS",
  "all42_raw_rebuilds": "IDENTICAL"
}

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-review-runner.cjs render-check C:/Python314/python.exe build-scripts/content/book-2/231/check_render.py --lesson-root ../4veco-lessen --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-build-manifest-r11.json

- cwd: `C:\wt\book2-231-review-20260906\4veco-platform`
- started_at: `2026-09-05T23:23:05.429Z`
- finished_at: `2026-09-05T23:23:09.974Z`
- duration_ms: `4545`
- exit_code: `0`
- stdout_sha256: `ecf39404add2b7d2fee2b3f1efebbb6e407575c8f813e3cfa68140d3e6777315`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "paragraph": "2.3.1",
  "manifest": "C:\\wt\\book2-231-review-20260906\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-231-build-manifest-r11.json",
  "manifest_raw_sha256": "48adc24c1a4b31ae9c0edb20ff48764b2f2c498aa63e7df3c0e58141124ea0b3",
  "status": "PASS",
  "documents": [
    {
      "kind": "paragraaf",
      "pages": [
        {
          "page": 1,
          "text_characters": 1503,
          "minimum_text_pt": 12.0,
          "fonts": [
            "Arial",
            "Arial-Bold"
          ],
          "maximum_body_bottom_pt": 709.3497314453125,
          "body_print_bottom_limit_pt": 782.3622114526944,
          "all_body_inside_native_print_margins": true
        },
        {
          "page": 2,
          "text_characters": 1221,
          "minimum_text_pt": 12.0,
          "fonts": [
            "Arial",
            "Arial-Bold"
          ],
          "maximum_body_bottom_pt": 777.3871459960938,
          "body_print_bottom_limit_pt": 782.3622114526944,
          "all_body_inside_native_print_margins": true
        },
        {
          "page": 3,
          "text_characters": 817,
          "minimum_text_pt": 12.0,
          "fonts": [
            "Arial",
            "Arial-Bold"
          ],
          "maximum_body_bottom_pt": 653.4474487304688,
          "body_print_bottom_limit_pt": 782.3622114526944,
          "all_body_inside_native_print_margins": true
        },
        {
          "page": 4,
          "text_characters": 771,
          "minimum_text_pt": 12.0,
          "fonts": [
            "Arial",
            "Arial-Bold"
          ],
          "maximum_body_bottom_pt": 662.4365844726562,
          "body_print_bottom_limit_pt": 782.3622114526944,
          "all_body_inside_native_print_margins": true
        },
        {
          "page": 5,
          "text_characters": 839,
          "minimum_text_pt": 12.0,
          "fonts": [
            "Arial",
            "Arial-Bold"
          ],
          "maximum_body_bottom_pt": 768.01220703125,
          "body_print_bottom_limit_pt": 782.3622114526944,
          "all_body_inside_native_print_margins": true
        },
        {
          "page": 6,
          "text_characters": 1700,
          "minimum_text_pt": 12.0,
          "fonts": [
            "Arial",
            "Arial-Bold"
          ],
          "maximum_body_bottom_pt": 605.0375366210938,
          "body_print_bottom_limit_pt": 782.3622114526944,
          "all_body_inside_native_print_margins": true
        },
        {
          "page": 7,
          "text_characters": 737,
          "minimum_text_pt": 12.0,
          "fonts": [
            "Arial",
            "Arial-Bold",
            "Arial-Italic"
          ],
          "maximum_body_bottom_pt": 664.8607177734375,
          "body_print_bottom_limit_pt": 782.3622114526944,
          "all_body_inside_native_print_margins": true
        },
        {
          "page": 8,
          "text_characters": 1525,
          "minimum_text_pt": 12.0,
          "fonts": [
            "Arial",
            "Arial-Bold"
          ],
          "maximum_body_bottom_pt": 646.6614990234375,
          "body_print_bottom_limit_pt": 782.3622114526944,
          "all_body_inside_native_print_margins": true
        },
        {
          "page": 9,
          "text_characters": 812,
          "minimum_text_pt": 12.0,
          "fonts": [
            "Arial",
            "Arial-Bold"
          ],
          "maximum_body_bottom_pt": 707.2378540039062,
          "body_print_bottom_limit_pt": 782.3622114526944,
          "all_body_inside_native_print_margins": true
        },
        {
          "page": 10,
          "text_characters": 767,
          "minimum_text_pt": 12.0,
          "fonts": [
            "Arial",
            "Arial-Bold"
          ],
          "maximum_body_bottom_pt": 657.7740478515625,
          "body_pri
...[truncated 35459 chars]
```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-review-runner.cjs probes C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-review-probes.py

- cwd: `C:\wt\book2-231-review-20260906\4veco-platform`
- started_at: `2026-09-05T23:32:15.285Z`
- finished_at: `2026-09-05T23:32:15.500Z`
- duration_ms: `215`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `8a34f6ce16702ed8baea09c256ea8e1826a645ad6054c0bcfbce17f1aa662590`

### stdout excerpt

```text

```

### stderr excerpt

```text
Traceback (most recent call last):
  File "C:\wt\book2-231-review-20260906\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-231-review-probes.py", line 104, in <module>
    for s,text in svgs.items(): svg_contract(text,s)
                                ~~~~~~~~~~~~^^^^^^^^
  File "C:\wt\book2-231-review-20260906\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-231-review-probes.py", line 97, in svg_contract
    assert econ==[(0,intercept),(0,price),(q,price)]
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-review-runner.cjs probes-r2 C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-review-probes.py

- cwd: `C:\wt\book2-231-review-20260906\4veco-platform`
- started_at: `2026-09-05T23:32:38.996Z`
- finished_at: `2026-09-05T23:32:39.671Z`
- duration_ms: `675`
- exit_code: `0`
- stdout_sha256: `aa9b2508145a9fe867c8918714c03c0c81cc681b8c470dd7f2092557067e24e9`
- stderr_sha256: `0509d54e5d502fbb77695b016b9f8a6ce7c2226e42b742feb854675d42d653b8`

### stdout excerpt

```text
{
  "status": "PASS",
  "independent_mutations_rejected": 19,
  "actual_svg_count": 15,
  "independent_exact_CS_polygon_checks": 10,
  "zip_member_counts": {
    "paragraaf": 19,
    "opgaven": 11,
    "antwoorden": 17
  },
  "all_44_baseline_lesson_files_unchanged": true,
  "nine_platform_source_files_unchanged": true,
  "all_27_historical_native_manifests_unchanged": true,
  "limitations": "Review-only independent probes; not shared-policy or full-CI certification. No pupil or authority files modified."
}

```

### stderr excerpt

```text
C:\Python314\Lib\zipfile\__init__.py:1721: UserWarning: Duplicate name: '2.3.1 Consumentensurplus – antwoorden.md'
  return self._open_to_write(zinfo, force_zip64=force_zip64)

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-review-runner.cjs profiles-before

- cwd: `C:\wt\book2-231-review-20260906\4veco-platform`
- started_at: `2026-09-05T23:33:14.671Z`
- finished_at: `2026-09-05T23:33:14.835Z`
- duration_ms: `164`
- exit_code: `1`
- stdout_sha256: `41c0ab677510ff1db6ff312704bc042fc1b4152b558f23a412c4d7abe60bec72`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Profile student-web exit 1

Validating paragraph 2.3.1 "Consumentensurplus"
Path: C:\wt\book2-231-review-20260906\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.3 Hoofdstuk Surplus en welvaart\2.3.1 Consumentensurplus
Mode: part-a
Profile: student-web

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.3.1 Consumentensurplus – paragraaf.md
  OK opgaven.md: 2.3.1 Consumentensurplus – opgaven.md
  OK antwoorden.md: 2.3.1 Consumentensurplus – antwoorden.md
  OK 2.3.1 Consumentensurplus – paragraaf.html (1895.9 KB)
  OK 2.3.1 Consumentensurplus – opgaven.html (988.6 KB)
  OK 2.3.1 Consumentensurplus – antwoorden.html (1765.1 KB)
  OK 2.3.1 Consumentensurplus – paragraaf.pdf (1116 KB)
  OK 2.3.1 Consumentensurplus – opgaven.pdf (617 KB)
  OK 2.3.1 Consumentensurplus – antwoorden.pdf (1102 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 15 image refs all resolve
  OK _assets/: 15 SVGs, 15 PNGs

-- Part A QC artifacts --
  X MISSING Part A review report (2.3.1-review.md)
  X MISSING quality_ref (2.3.1-quality-ref.yaml)

==========================================
FAIL Paragraph 2.3.1 "Consumentensurplus" failed: 2 error(s), 0 warning(s).

Profile publisher-print exit 1

Validating paragraph 2.3.1 "Consumentensurplus"
Path: C:\wt\book2-231-review-20260906\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.3 Hoofdstuk Surplus en welvaart\2.3.1 Consumentensurplus
Mode: part-a
Profile: publisher-print

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.3.1 Consumentensurplus – paragraaf.md
  OK opgaven.md: 2.3.1 Consumentensurplus – opgaven.md
  OK antwoorden.md: 2.3.1 Consumentensurplus – antwoorden.md
  OK 2.3.1 Consumentensurplus – paragraaf.pdf (1116 KB)
  OK 2.3.1 Consumentensurplus – opgaven.pdf (617 KB)
  OK 2.3.1 Consumentensurplus – antwoorden.pdf (1102 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 15 image refs all resolve
  OK _assets/: 15 SVGs, 15 PNGs

-- Part A QC artifacts --
  X MISSING Part A review report (2.3.1-review.md)
  X MISSING quality_ref (2.3.1-quality-ref.yaml)

==========================================
FAIL Paragraph 2.3.1 "Consumentensurplus" failed: 2 error(s), 0 warning(s).


```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-review-runner.cjs inspection node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-review-inspection.cjs

- cwd: `C:\wt\book2-231-review-20260906\4veco-platform`
- started_at: `2026-09-05T23:34:55.476Z`
- finished_at: `2026-09-05T23:34:55.651Z`
- duration_ms: `175`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `2b82ba14c97bf9fadb42f62c8732802e4a97cd830da8ff3889bb92a9cb74546a`

### stdout excerpt

```text

```

### stderr excerpt

```text
node:fs:559
  return binding.open(
                 ^

Error: EEXIST: file already exists, open 'C:\wt\book2-231-review-20260906\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-231-review-inspection.json'
    at Object.openSync (node:fs:559:18)
    at Object.writeFileSync (node:fs:2426:35)
    at save (C:\wt\book2-231-review-20260906\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-231-review-runner.cjs:6:29)
    at Object.<anonymous> (C:\wt\book2-231-review-20260906\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-231-review-runner.cjs:48:2)
    at Module._compile (node:internal/modules/cjs/loader:1804:14)
    at Object..js (node:internal/modules/cjs/loader:1936:10)
    at Module.load (node:internal/modules/cjs/loader:1525:32)
    at Module._load (node:internal/modules/cjs/loader:1327:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24) {
  errno: -4075,
  code: 'EEXIST',
  syscall: 'open',
  path: 'C:\\wt\\book2-231-review-20260906\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-231-review-inspection.json'
}

Node.js v24.13.1

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-review-runner.cjs inspection-verification node -e "const fs=require('fs'),j=JSON.parse(fs.readFileSync('reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-review-inspection.json'));if(j.page_observations.length!==66||j.native_figure_observations.length!==15||j.additional_teaching_mutations.length!==4)throw Error('counts');console.log(JSON.stringify({status:j.status,counts:j.counts,all66pagesBound:j.page_observations.every(p=>p.sha256.length===64),all15nativeBound:j.native_figure_observations.every(p=>p.png_sha256.length===64),immutableEvidencePreserved:true}))"

- cwd: `C:\wt\book2-231-review-20260906\4veco-platform`
- started_at: `2026-09-05T23:37:52.595Z`
- finished_at: `2026-09-05T23:37:52.731Z`
- duration_ms: `136`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `69fe4ac5f748422f362cb5e2a4c732ee1f948b58ca48ffbf16582cb274387bb2`

### stdout excerpt

```text

```

### stderr excerpt

```text
[eval]:1
const
     
Unexpected token `<eof>`. Expected yield, an identifier, [ or {

SyntaxError: Unexpected end of input
    at makeContextifyScript (node:internal/vm:194:14)
    at compileScript (node:internal/process/execution:388:10)
    at evalTypeScript (node:internal/process/execution:260:22)
    at node:internal/main/eval_string:71:3

Node.js v24.13.1
'j.native_figure_observations.length!' is not recognized as an internal or external command,
operable program or batch file.
'j.additional_teaching_mutations.length!' is not recognized as an internal or external command,
operable program or batch file.

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-review-runner.cjs profiles-after

- cwd: `C:\wt\book2-231-review-20260906\4veco-platform`
- started_at: `2026-09-05T23:37:53.436Z`
- finished_at: `2026-09-05T23:37:53.573Z`
- duration_ms: `137`
- exit_code: `1`
- stdout_sha256: `fde35c72e1d304a3dae36c51161faa5689f021fd1e10084bb396960013ce1e0a`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Profile student-web exit 1

Validating paragraph 2.3.1 "Consumentensurplus"
Path: C:\wt\book2-231-review-20260906\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.3 Hoofdstuk Surplus en welvaart\2.3.1 Consumentensurplus
Mode: part-a
Profile: student-web

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.3.1 Consumentensurplus – paragraaf.md
  OK opgaven.md: 2.3.1 Consumentensurplus – opgaven.md
  OK antwoorden.md: 2.3.1 Consumentensurplus – antwoorden.md
  OK 2.3.1 Consumentensurplus – paragraaf.html (1895.9 KB)
  OK 2.3.1 Consumentensurplus – opgaven.html (988.6 KB)
  OK 2.3.1 Consumentensurplus – antwoorden.html (1765.1 KB)
  OK 2.3.1 Consumentensurplus – paragraaf.pdf (1116 KB)
  OK 2.3.1 Consumentensurplus – opgaven.pdf (617 KB)
  OK 2.3.1 Consumentensurplus – antwoorden.pdf (1102 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 15 image refs all resolve
  OK _assets/: 15 SVGs, 15 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.3.1-review.md (no explicit verdict, no FAIL markers)
  X MISSING quality_ref (2.3.1-quality-ref.yaml)

==========================================
FAIL Paragraph 2.3.1 "Consumentensurplus" failed: 1 error(s), 0 warning(s).

Profile publisher-print exit 1

Validating paragraph 2.3.1 "Consumentensurplus"
Path: C:\wt\book2-231-review-20260906\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.3 Hoofdstuk Surplus en welvaart\2.3.1 Consumentensurplus
Mode: part-a
Profile: publisher-print

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.3.1 Consumentensurplus – paragraaf.md
  OK opgaven.md: 2.3.1 Consumentensurplus – opgaven.md
  OK antwoorden.md: 2.3.1 Consumentensurplus – antwoorden.md
  OK 2.3.1 Consumentensurplus – paragraaf.pdf (1116 KB)
  OK 2.3.1 Consumentensurplus – opgaven.pdf (617 KB)
  OK 2.3.1 Consumentensurplus – antwoorden.pdf (1102 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 15 image refs all resolve
  OK _assets/: 15 SVGs, 15 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.3.1-review.md (no explicit verdict, no FAIL markers)
  X MISSING quality_ref (2.3.1-quality-ref.yaml)

==========================================
FAIL Paragraph 2.3.1 "Consumentensurplus" failed: 1 error(s), 0 warning(s).


```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-review-runner.cjs inspection-verified

- cwd: `C:\wt\book2-231-review-20260906\4veco-platform`
- started_at: `2026-09-05T23:38:31.968Z`
- finished_at: `2026-09-05T23:38:32.296Z`
- duration_ms: `328`
- exit_code: `0`
- stdout_sha256: `e0a187e454f7597e92d953b62407de0874d33712ab13f64ef5d2a1dc1c633370`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  status: 'PASS_SUBSTANTIVE_RENDER_REVIEW',
  counts: {
    color_pages: 33,
    grayscale_pages: 33,
    native_figures: 15,
    additional_negative_probes: 4
  },
  all66pagesAnd15NativeFiguresRehashed: true,
  record_sha256: 'd761966ebae2e5bb9310a40523a64f24b7c16b8d298be2edcff9aa0d53319a68'
}

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-review-runner.cjs profiles-final

- cwd: `C:\wt\book2-231-review-20260906\4veco-platform`
- started_at: `2026-09-05T23:38:44.832Z`
- finished_at: `2026-09-05T23:38:44.981Z`
- duration_ms: `149`
- exit_code: `1`
- stdout_sha256: `b653b90ca2d27763634e823ffedf42f52bca465372aaed08442e80580b8fc212`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Profile student-web exit 1

Validating paragraph 2.3.1 "Consumentensurplus"
Path: C:\wt\book2-231-review-20260906\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.3 Hoofdstuk Surplus en welvaart\2.3.1 Consumentensurplus
Mode: part-a
Profile: student-web

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.3.1 Consumentensurplus – paragraaf.md
  OK opgaven.md: 2.3.1 Consumentensurplus – opgaven.md
  OK antwoorden.md: 2.3.1 Consumentensurplus – antwoorden.md
  OK 2.3.1 Consumentensurplus – paragraaf.html (1895.9 KB)
  OK 2.3.1 Consumentensurplus – opgaven.html (988.6 KB)
  OK 2.3.1 Consumentensurplus – antwoorden.html (1765.1 KB)
  OK 2.3.1 Consumentensurplus – paragraaf.pdf (1116 KB)
  OK 2.3.1 Consumentensurplus – opgaven.pdf (617 KB)
  OK 2.3.1 Consumentensurplus – antwoorden.pdf (1102 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 15 image refs all resolve
  OK _assets/: 15 SVGs, 15 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.3.1-review.md (verdict PASS WITH FLAGS)
  X MISSING quality_ref (2.3.1-quality-ref.yaml)

==========================================
FAIL Paragraph 2.3.1 "Consumentensurplus" failed: 1 error(s), 0 warning(s).

Profile publisher-print exit 1

Validating paragraph 2.3.1 "Consumentensurplus"
Path: C:\wt\book2-231-review-20260906\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.3 Hoofdstuk Surplus en welvaart\2.3.1 Consumentensurplus
Mode: part-a
Profile: publisher-print

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.3.1 Consumentensurplus – paragraaf.md
  OK opgaven.md: 2.3.1 Consumentensurplus – opgaven.md
  OK antwoorden.md: 2.3.1 Consumentensurplus – antwoorden.md
  OK 2.3.1 Consumentensurplus – paragraaf.pdf (1116 KB)
  OK 2.3.1 Consumentensurplus – opgaven.pdf (617 KB)
  OK 2.3.1 Consumentensurplus – antwoorden.pdf (1102 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 15 image refs all resolve
  OK _assets/: 15 SVGs, 15 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.3.1-review.md (verdict PASS WITH FLAGS)
  X MISSING quality_ref (2.3.1-quality-ref.yaml)

==========================================
FAIL Paragraph 2.3.1 "Consumentensurplus" failed: 1 error(s), 0 warning(s).


```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-review-runner.cjs sprint-bundle node build-scripts/sprints/check-sprint-bundle.js BOOK2-TEXTBOOK-PRODUCTION-1

- cwd: `C:\wt\book2-231-review-20260906\4veco-platform`
- started_at: `2026-09-05T23:41:23.259Z`
- finished_at: `2026-09-05T23:41:23.559Z`
- duration_ms: `300`
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
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-review-runner.cjs preflight-command node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-review-close.cjs preflight

- cwd: `C:\wt\book2-231-review-20260906\4veco-platform`
- started_at: `2026-09-05T23:41:53.867Z`
- finished_at: `2026-09-05T23:41:54.273Z`
- duration_ms: `406`
- exit_code: `0`
- stdout_sha256: `954fc4d7e368fe1ba3deea3687aa479a5c3b2fb8a1535773e3d16b27d254fca1`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  status: 'PASS_STRICT_REVIEW_ONLY_PATHS',
  platform_paths: 182,
  lesson_paths: 1
}

```

### stderr excerpt

```text

```
