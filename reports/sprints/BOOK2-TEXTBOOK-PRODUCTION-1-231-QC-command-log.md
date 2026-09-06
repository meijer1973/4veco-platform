# Sprint BOOK2-TEXTBOOK-PRODUCTION-1-231-QC: Command Log

## npm.cmd ci --ignore-scripts

- cwd: `C:\wt\book2-231-qc-20260906\4veco-platform`
- started_at: `2026-09-06T00:18:00.513Z`
- finished_at: `2026-09-06T00:18:06.719Z`
- duration_ms: `6206`
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
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-QC-run.cjs snapshot

- cwd: `C:\wt\book2-231-qc-20260906\4veco-platform`
- started_at: `2026-09-06T00:26:42.395Z`
- finished_at: `2026-09-06T00:26:54.055Z`
- duration_ms: `11660`
- exit_code: `0`
- stdout_sha256: `20c78998677b595eca1edfb4b1f95459550b247131b6b12954893d501a434ba4`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "highest": 16,
  "reserved": [
    "r17",
    "r18",
    "r19"
  ],
  "registered_roots": 200,
  "revision_rows": 3404,
  "baseline_lesson_files": 45,
  "historical_files": 7852,
  "pending": 45,
  "relocated66": "IDENTICAL"
}

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-QC-run.cjs pre

- cwd: `C:\wt\book2-231-qc-20260906\4veco-platform`
- started_at: `2026-09-06T00:27:21.841Z`
- finished_at: `2026-09-06T00:27:25.791Z`
- duration_ms: `3950`
- exit_code: `0`
- stdout_sha256: `2696b3d5ffd52d8f06591dbee38869a44c2f78e59202762eaa3f19caccee2051`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "name": "currentness-pre",
  "command": "node",
  "args": [
    "build-scripts/workflows/check-book-outline-currentness.js",
    "--require-approved",
    "--action",
    "specialist_review",
    "--paragraph",
    "2.3.1"
  ],
  "cwd": "C:\\wt\\book2-231-qc-20260906\\4veco-platform",
  "started_at": "2026-09-06T00:27:21.904Z",
  "finished_at": "2026-09-06T00:27:23.538Z",
  "exit_code": 0,
  "signal": null,
  "stdout": "Book 2 outline currentness: PASS\n- outline: references/authored/book-outlines/book-2-outline.md\n- target pins: 12\n- mode: approved-use\n- paragraph scope: 2.3.1\n",
  "stderr": ""
}
{
  "name": "durable-pre",
  "command": "node",
  "args": [
    "build-scripts/workflows/check-book2-target-authority-remediation.js",
    "--durable"
  ],
  "cwd": "C:\\wt\\book2-231-qc-20260906\\4veco-platform",
  "started_at": "2026-09-06T00:27:23.539Z",
  "finished_at": "2026-09-06T00:27:24.062Z",
  "exit_code": 0,
  "signal": null,
  "stdout": "Book 2 target authority remediation: PASS\n- mode: durable frozen-package and lifecycle invariant\n- exact candidate records: 12\n- goal/question alignment and workload budgets: complete\n- unrelated-record scope checks: delegated to the PR-scoped sprint guard\n",
  "stderr": ""
}
{
  "name": "source-tests",
  "command": "C:/Python314/python.exe",
  "args": [
    "build-scripts/content/book-2/231/test_source.py",
    "--lesson-root",
    "C:\\wt\\book2-231-qc-20260906\\4veco-lessen"
  ],
  "cwd": "C:\\wt\\book2-231-qc-20260906\\4veco-platform",
  "started_at": "2026-09-06T00:27:24.063Z",
  "finished_at": "2026-09-06T00:27:25.674Z",
  "exit_code": 0,
  "signal": null,
  "stdout": "",
  "stderr": "test_actual_native_name_regex_all30 (__main__.SourceTests.test_actual_native_name_regex_all30) ... ok\r\ntest_actual_svg_economic_geometry_and_roles (__main__.SourceTests.test_actual_svg_economic_geometry_and_roles) ... ok\r\ntest_actual_svg_labels_canvas_all_ink_boxes (__main__.SourceTests.test_actual_svg_labels_canvas_all_ink_boxes) ... ok\r\ntest_all_model_calculations_independent_fractions (__main__.SourceTests.test_all_model_calculations_independent_fractions) ... ok\r\ntest_all_task_numbers_and_no_device_or_time_metadata (__main__.SourceTests.test_all_task_numbers_and_no_device_or_time_metadata) ... ok\r\ntest_authority_guard_rejects_each_changed_pin_before_processes (__main__.SourceTests.test_authority_guard_rejects_each_changed_pin_before_processes) ... ok\r\ntest_bonus_model_then_exact_three_criteria_and_negative_fixtures (__main__.SourceTests.test_bonus_model_then_exact_three_criteria_and_negative_fixtures) ... ok\r\ntest_discrete_and_model_boundary (__main__.SourceTests.test_discrete_and_model_boundary) ... ok\r\ntest_every_actual_alt_caption_and_union (__main__.SourceTests.test_every_actual_alt_caption_and_union) ... ok\r\ntest_exact_headings_route_and_recap (__main__.SourceTests.test_exact_headings_route_and_recap) ... ok\r\ntest_fading_and_independent_surfaces (__main__.SourceTests.test_fading_and_independent_surfaces) ... ok\r\ntest_fresh_revision_and_immutable_attempt_guards (__main__.SourceTests.test_fresh_revision_and_immutable_attempt_guards) ... ok\r\ntest_frozen_goals_target_and_scoring (__main__.SourceTests.test_frozen_goals_target_and_scoring) ... ok\r\ntest_no_false_predecessor_acceptance_or_changed_plan (__main__.SourceTests.test_no_false_predecessor_acceptance_or_changed_plan) ... ok\r\ntest_print_margin_guard_rejects_body_in_footer_and_false_footer (__main__.SourceTests.test_print_margin_guard_rejects_body_in_footer_and_false_footer) ... ok\r\n\r\n----------------------------------------------------------------------\r\nRan 15 tests in 1.070s\r\n\r\nOK\r\n"
}
{
  "name": "pre-student-web",
  "command": "node",
  "args": [
    "scripts/validate-paragraph.js",
    "--mode",
    "part-a",
    "--profile",
    "student-web",
    "C:\\wt\\book2-231-qc-20260906\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.3 Hoofdstuk Surplus en welvaart\\2.3.
...[truncated 3067 chars]
```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-QC-run.cjs full

- cwd: `C:\wt\book2-231-qc-20260906\4veco-platform`
- started_at: `2026-09-06T00:27:31.693Z`
- finished_at: `2026-09-06T00:27:52.548Z`
- duration_ms: `20855`
- exit_code: `0`
- stdout_sha256: `6ca8c71598107debd87d76a135a6acdb5d67659eef4b6f9444d3d486937280cf`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "name": "full",
  "command": "C:/Python314/python.exe",
  "args": [
    "build-scripts/content/book-2/b2_231.py",
    "--lesson-root",
    "C:\\wt\\book2-231-qc-20260906\\4veco-lessen",
    "--proof-root",
    "C:\\wt\\book2-231-qc-20260906\\4veco-platform\\reports\\rendered-proof\\BOOK2-TEXTBOOK-PRODUCTION-1",
    "--proof-suffix",
    "r17",
    "--manifest",
    "C:\\wt\\book2-231-qc-20260906\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-231-build-manifest-r17.json"
  ],
  "cwd": "C:\\wt\\book2-231-qc-20260906\\4veco-platform",
  "started_at": "2026-09-06T00:27:31.779Z",
  "finished_at": "2026-09-06T00:27:52.538Z",
  "exit_code": 0,
  "signal": null,
  "stdout": "Book 2 outline currentness: PASS\n- outline: references/authored/book-outlines/book-2-outline.md\n- target pins: 12\n- mode: approved-use\n- paragraph scope: 2.3.1\nBook 2 target authority remediation: PASS\n- mode: durable frozen-package and lifecycle invariant\n- exact candidate records: 12\n- goal/question alignment and workload budgets: complete\n- unrelated-record scope checks: delegated to the PR-scoped sprint guard\n{\"assets\":[\"2.3.1_fig_1\",\"2.3.1_fig_2\",\"2.3.1_fig_3\",\"2.3.1_fig_4\",\"2.3.1_we_1\",\"2.3.1_ex_1\",\"2.3.1_ex_2\",\"2.3.1_ex_3\",\"2.3.1_ex_4\",\"2.3.1_ex_5\",\"2.3.1_ex_6\",\"2.3.1_ex_7\",\"2.3.1_ex_8\",\"2.3.1_ex_9\",\"2.3.1_ex_10\"],\"pairs\":15,\"canvas\":[1200,900],\"png\":[2400,1800],\"font\":\"Arial regular 30pt\",\"visual_acceptance\":\"NOT_ASSERTED\"}\n{\r\n  \"paragraph\": \"2.3.1\",\r\n  \"revision\": \"r17\",\r\n  \"manifest\": \"C:\\\\wt\\\\book2-231-qc-20260906\\\\4veco-platform\\\\reports\\\\sprints\\\\BOOK2-TEXTBOOK-PRODUCTION-1-231-build-manifest-r17.json\",\r\n  \"packet_files\": 42,\r\n  \"inspection_status\": \"PENDING\"\r\n}\r\n",
  "stderr": ""
}

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-QC-run.cjs verify

- cwd: `C:\wt\book2-231-qc-20260906\4veco-platform`
- started_at: `2026-09-06T00:27:58.207Z`
- finished_at: `2026-09-06T00:28:57.437Z`
- duration_ms: `59230`
- exit_code: `0`
- stdout_sha256: `af81e7e663592a745eb88339d956c628d957b9ddadc9d6a14a7092c5a91fce68`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "name": "render-check",
  "command": "C:/Python314/python.exe",
  "args": [
    "build-scripts/content/book-2/231/check_render.py",
    "--lesson-root",
    "C:\\wt\\book2-231-qc-20260906\\4veco-lessen",
    "--manifest",
    "C:\\wt\\book2-231-qc-20260906\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-231-build-manifest-r17.json"
  ],
  "cwd": "C:\\wt\\book2-231-qc-20260906\\4veco-platform",
  "started_at": "2026-09-06T00:27:58.317Z",
  "finished_at": "2026-09-06T00:28:04.482Z",
  "exit_code": 0,
  "signal": null,
  "stdout": "{\r\n  \"paragraph\": \"2.3.1\",\r\n  \"manifest\": \"C:\\\\wt\\\\book2-231-qc-20260906\\\\4veco-platform\\\\reports\\\\sprints\\\\BOOK2-TEXTBOOK-PRODUCTION-1-231-build-manifest-r17.json\",\r\n  \"manifest_raw_sha256\": \"ddb1a19810e263ab8af5e5457d8906b91332da5b6e3fcb66e7f5747ed41f862f\",\r\n  \"status\": \"PASS\",\r\n  \"documents\": [\r\n    {\r\n      \"kind\": \"paragraaf\",\r\n      \"pages\": [\r\n        {\r\n          \"page\": 1,\r\n          \"text_characters\": 1503,\r\n          \"minimum_text_pt\": 12.0,\r\n          \"fonts\": [\r\n            \"Arial\",\r\n            \"Arial-Bold\"\r\n          ],\r\n          \"maximum_body_bottom_pt\": 709.3497314453125,\r\n          \"body_print_bottom_limit_pt\": 782.3622114526944,\r\n          \"all_body_inside_native_print_margins\": true\r\n        },\r\n        {\r\n          \"page\": 2,\r\n          \"text_characters\": 1221,\r\n          \"minimum_text_pt\": 12.0,\r\n          \"fonts\": [\r\n            \"Arial\",\r\n            \"Arial-Bold\"\r\n          ],\r\n          \"maximum_body_bottom_pt\": 777.3871459960938,\r\n          \"body_print_bottom_limit_pt\": 782.3622114526944,\r\n          \"all_body_inside_native_print_margins\": true\r\n        },\r\n        {\r\n          \"page\": 3,\r\n          \"text_characters\": 817,\r\n          \"minimum_text_pt\": 12.0,\r\n          \"fonts\": [\r\n            \"Arial\",\r\n            \"Arial-Bold\"\r\n          ],\r\n          \"maximum_body_bottom_pt\": 653.4474487304688,\r\n          \"body_print_bottom_limit_pt\": 782.3622114526944,\r\n          \"all_body_inside_native_print_margins\": true\r\n        },\r\n        {\r\n          \"page\": 4,\r\n          \"text_characters\": 771,\r\n          \"minimum_text_pt\": 12.0,\r\n          \"fonts\": [\r\n            \"Arial\",\r\n            \"Arial-Bold\"\r\n          ],\r\n          \"maximum_body_bottom_pt\": 662.4365844726562,\r\n          \"body_print_bottom_limit_pt\": 782.3622114526944,\r\n          \"all_body_inside_native_print_margins\": true\r\n        },\r\n        {\r\n          \"page\": 5,\r\n          \"text_characters\": 839,\r\n          \"minimum_text_pt\": 12.0,\r\n          \"fonts\": [\r\n            \"Arial\",\r\n            \"Arial-Bold\"\r\n          ],\r\n          \"maximum_body_bottom_pt\": 768.01220703125,\r\n          \"body_print_bottom_limit_pt\": 782.3622114526944,\r\n          \"all_body_inside_native_print_margins\": true\r\n        },\r\n        {\r\n          \"page\": 6,\r\n          \"text_characters\": 1700,\r\n          \"minimum_text_pt\": 12.0,\r\n          \"fonts\": [\r\n            \"Arial\",\r\n            \"Arial-Bold\"\r\n          ],\r\n          \"maximum_body_bottom_pt\": 605.0375366210938,\r\n          \"body_print_bottom_limit_pt\": 782.3622114526944,\r\n          \"all_body_inside_native_print_margins\": true\r\n        },\r\n        {\r\n          \"page\": 7,\r\n          \"text_characters\": 737,\r\n          \"minimum_text_pt\": 12.0,\r\n          \"fonts\": [\r\n            \"Arial\",\r\n            \"Arial-Bold\",\r\n            \"Arial-Italic\"\r\n          ],\r\n          \"maximum_body_bottom_pt\": 664.8607177734375,\r\n          \"body_print_bottom_limit_pt\": 782.3622114526944,\r\n          \"all_body_inside_native_print_margins\": true\r\n        },\r\n        {\r\n          \"page\": 8,\r\n          \"text_characters\": 1525,\r\n          \"minimum_text_pt\
...[truncated 41227 chars]
```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-QC-probes.py

- cwd: `C:\wt\book2-231-qc-20260906\4veco-platform`
- started_at: `2026-09-06T00:38:59.867Z`
- finished_at: `2026-09-06T00:40:27.973Z`
- duration_ms: `88106`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `0f6e3d5c050c5e4783d31743b95b406715a5b2bc3c665f020356205dfe1956a1`

### stdout excerpt

```text

```

### stderr excerpt

```text
Traceback (most recent call last):
  File "C:\wt\book2-231-qc-20260906\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-231-QC-probes.py", line 176, in <module>
    if __name__=='__main__': execute()
                             ~~~~~~~^^
  File "C:\wt\book2-231-qc-20260906\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-231-QC-probes.py", line 47, in execute
    packet=manifests[17]['packet_hashes'];assert len(packet)==42
           ~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^
KeyError: 'packet_hashes'

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-QC-probes.py

- cwd: `C:\wt\book2-231-qc-20260906\4veco-platform`
- started_at: `2026-09-06T00:41:22.730Z`
- finished_at: `2026-09-06T00:41:23.375Z`
- duration_ms: `645`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `138ebf1c03160a279f55fccc328c7aa754e2ff95319e8382c9ef2015c7693d5b`

### stdout excerpt

```text

```

### stderr excerpt

```text
Traceback (most recent call last):
  File "C:\wt\book2-231-qc-20260906\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-231-QC-probes.py", line 176, in <module>
    if __name__=='__main__': execute()
                             ~~~~~~~^^
  File "C:\wt\book2-231-qc-20260906\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-231-QC-probes.py", line 59, in execute
    assert im.convert('L').tobytes()==gm.convert('L').tobytes()
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-QC-probes.py

- cwd: `C:\wt\book2-231-qc-20260906\4veco-platform`
- started_at: `2026-09-06T00:41:53.310Z`
- finished_at: `2026-09-06T00:41:56.654Z`
- duration_ms: `3344`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `2c9a79d08e1e5560efc64a3b05a5f69947340ee005a0e36870fda34b9788931a`

### stdout excerpt

```text

```

### stderr excerpt

```text
Traceback (most recent call last):
  File "C:\wt\book2-231-qc-20260906\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-231-QC-probes.py", line 182, in <module>
    if __name__=='__main__': execute()
                             ~~~~~~~^^
  File "C:\wt\book2-231-qc-20260906\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-231-QC-probes.py", line 77, in execute
    assert len(names)==expected
           ^^^^^^^^^^^^^^^^^^^^
AssertionError

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-QC-probes.py

- cwd: `C:\wt\book2-231-qc-20260906\4veco-platform`
- started_at: `2026-09-06T00:42:20.575Z`
- finished_at: `2026-09-06T00:42:24.025Z`
- duration_ms: `3450`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `2c7b5c2cb636a0f918a1c1b589021a04dabb0978044a6ca10c4d36c6fb10e0a2`

### stdout excerpt

```text

```

### stderr excerpt

```text
Traceback (most recent call last):
  File "C:\wt\book2-231-qc-20260906\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-231-QC-probes.py", line 182, in <module>
    if __name__=='__main__': execute()
                             ~~~~~~~^^
  File "C:\wt\book2-231-qc-20260906\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-231-QC-probes.py", line 118, in execute
    assert block.strip()==expected
           ^^^^^^^^^^^^^^^^^^^^^^^
AssertionError

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-QC-probes.py

- cwd: `C:\wt\book2-231-qc-20260906\4veco-platform`
- started_at: `2026-09-06T00:42:45.101Z`
- finished_at: `2026-09-06T00:42:48.745Z`
- duration_ms: `3644`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `95ea3144ac0cb30c8c27afb350eda34485b7ee5bf4763c1facdd4c90029e4660`

### stdout excerpt

```text

```

### stderr excerpt

```text
Traceback (most recent call last):
  File "C:\wt\book2-231-qc-20260906\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-231-QC-probes.py", line 182, in <module>
    if __name__=='__main__': execute()
                             ~~~~~~~^^
  File "C:\wt\book2-231-qc-20260906\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-231-QC-probes.py", line 150, in execute
    assert abs(float(ids['quantity-projection'].get('x1'))-xq)<1e-8
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-QC-probes.py

- cwd: `C:\wt\book2-231-qc-20260906\4veco-platform`
- started_at: `2026-09-06T00:43:21.230Z`
- finished_at: `2026-09-06T00:43:25.496Z`
- duration_ms: `4266`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `22ac174b1b30438c9437c45338ca2ebcb6f17a1dd5db0dd8baac67f7bacab590`

### stdout excerpt

```text

```

### stderr excerpt

```text
Traceback (most recent call last):
  File "C:\wt\book2-231-qc-20260906\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-231-QC-probes.py", line 185, in <module>
    if __name__=='__main__': execute()
                             ~~~~~~~^^
  File "C:\wt\book2-231-qc-20260906\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-231-QC-probes.py", line 170, in execute
    assert min(contrasts.values())>=4.5
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-QC-probes.py

- cwd: `C:\wt\book2-231-qc-20260906\4veco-platform`
- started_at: `2026-09-06T00:43:58.838Z`
- finished_at: `2026-09-06T00:44:04.723Z`
- duration_ms: `5885`
- exit_code: `0`
- stdout_sha256: `6a302ae56f0f119a8876bb845404835e22255ac0e0757dcd42836df8b61a7bbe`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
All artifact/math/guard checks complete; verifying unchanged historical bytes...
{
  "status": "PASS",
  "old_source_report_files_unchanged": 7852,
  "manifest_hashes": {
    "r14": "290cfbe085c80007becd08d704ef9b3e73cfa7b427aaca16f137a077c500d9af",
    "r17": "ddb1a19810e263ab8af5e5457d8906b91332da5b6e3fcb66e7f5747ed41f862f",
    "r18": "da1ae39fb83f81f2ec89210e5471bbce213bba1fb7100eeb6087e72711923d9e",
    "r19": "eb0f92382f07ded6ba0f7574cde525e5750f272fe138ac1f32cb1328a62e8cde"
  },
  "essential_contrasts": {
    "#2D3748 on #F7FAFC": 11.437770260954183,
    "#2D3748 on #FFFFFF": 11.98884062340556,
    "#2D3748 on #CBD5E0": 8.068698458033163,
    "#2D3748 on #C4E0F3": 8.73679752026608,
    "#2D3748 on #ACCCE4": 7.142816928887221,
    "#2D3748 on #DFE6ED": 9.52211139889793,
    "#1A5276 on #F7FAFC": 7.9742091306560505,
    "#1A5276 on #FFFFFF": 8.358405544435664,
    "#1A5276 on #CBD5E0": 5.625352446202292,
    "#1A5276 on #C4E0F3": 6.091139179166102,
    "#1A5276 on #ACCCE4": 4.979844381678061,
    "#1A5276 on #DFE6ED": 6.6386459884954405
  }
}
PASS: 42 packet bytes; 33 raw+RGB parity; ZIP19/11/17; 16 real guard negatives; 15 SVG/PNG figures; source/history preserved.

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-QC-observations.cjs

- cwd: `C:\wt\book2-231-qc-20260906\4veco-platform`
- started_at: `2026-09-06T00:46:31.137Z`
- finished_at: `2026-09-06T00:46:31.427Z`
- duration_ms: `290`
- exit_code: `0`
- stdout_sha256: `31f8aac70bf2c6b1e6fc4a05a1b2e4cbae2311964ceee232d310586b626fe7e8`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "verdict": "PASS WITH FLAGS",
  "personally_inspected_images": 96,
  "raw_sha256": "0617dd369111e6174bfd50854dbef3dd781f6e9b99cb5e2d45a6971a1f460339",
  "native_manifests_preserved": "PENDING"
}

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-QC-run.cjs post

- cwd: `C:\wt\book2-231-qc-20260906\4veco-platform`
- started_at: `2026-09-06T00:51:25.906Z`
- finished_at: `2026-09-06T00:51:28.995Z`
- duration_ms: `3089`
- exit_code: `0`
- stdout_sha256: `c71538e64613fb76b7a97d52d299cf239be6d2d594e6accdf7c5832aca38a296`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "name": "currentness-post",
  "command": "node",
  "args": [
    "build-scripts/workflows/check-book-outline-currentness.js",
    "--require-approved",
    "--action",
    "specialist_review",
    "--paragraph",
    "2.3.1"
  ],
  "cwd": "C:\\wt\\book2-231-qc-20260906\\4veco-platform",
  "started_at": "2026-09-06T00:51:25.975Z",
  "finished_at": "2026-09-06T00:51:28.023Z",
  "exit_code": 0,
  "signal": null,
  "stdout": "Book 2 outline currentness: PASS\n- outline: references/authored/book-outlines/book-2-outline.md\n- target pins: 12\n- mode: approved-use\n- paragraph scope: 2.3.1\n",
  "stderr": ""
}
{
  "name": "durable-post",
  "command": "node",
  "args": [
    "build-scripts/workflows/check-book2-target-authority-remediation.js",
    "--durable"
  ],
  "cwd": "C:\\wt\\book2-231-qc-20260906\\4veco-platform",
  "started_at": "2026-09-06T00:51:28.024Z",
  "finished_at": "2026-09-06T00:51:28.664Z",
  "exit_code": 0,
  "signal": null,
  "stdout": "Book 2 target authority remediation: PASS\n- mode: durable frozen-package and lifecycle invariant\n- exact candidate records: 12\n- goal/question alignment and workload budgets: complete\n- unrelated-record scope checks: delegated to the PR-scoped sprint guard\n",
  "stderr": ""
}
{
  "name": "post-student-web",
  "command": "node",
  "args": [
    "scripts/validate-paragraph.js",
    "--mode",
    "part-a",
    "--profile",
    "student-web",
    "C:\\wt\\book2-231-qc-20260906\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.3 Hoofdstuk Surplus en welvaart\\2.3.1 Consumentensurplus"
  ],
  "cwd": "C:\\wt\\book2-231-qc-20260906\\4veco-platform",
  "started_at": "2026-09-06T00:51:28.664Z",
  "finished_at": "2026-09-06T00:51:28.715Z",
  "exit_code": 0,
  "signal": null,
  "stdout": "\nValidating paragraph 2.3.1 \"Consumentensurplus\"\nPath: C:\\wt\\book2-231-qc-20260906\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.3 Hoofdstuk Surplus en welvaart\\2.3.1 Consumentensurplus\nMode: part-a\nProfile: student-web\n\n-- Part A textbook files --\n  OK Paragraph type: theory\n  OK paragraaf.md: 2.3.1 Consumentensurplus – paragraaf.md\n  OK opgaven.md: 2.3.1 Consumentensurplus – opgaven.md\n  OK antwoorden.md: 2.3.1 Consumentensurplus – antwoorden.md\n  OK 2.3.1 Consumentensurplus – paragraaf.html (1895.9 KB)\n  OK 2.3.1 Consumentensurplus – opgaven.html (988.6 KB)\n  OK 2.3.1 Consumentensurplus – antwoorden.html (1765.1 KB)\n  OK 2.3.1 Consumentensurplus – paragraaf.pdf (1116 KB)\n  OK 2.3.1 Consumentensurplus – opgaven.pdf (617 KB)\n  OK 2.3.1 Consumentensurplus – antwoorden.pdf (1102 KB)\n  OK build_pdf.py\n\n-- Asset integrity --\n  OK 15 image refs all resolve\n  OK _assets/: 15 SVGs, 15 PNGs\n\n-- Part A QC artifacts --\n  OK Part A review: 2.3.1-review.md (verdict PASS WITH FLAGS)\n  OK Quality ref: 2.3.1-quality-ref.yaml (valid)\n\n==========================================\nOK Paragraph 2.3.1 \"Consumentensurplus\" PASSED all checks.\n\n",
  "stderr": ""
}
{
  "name": "post-publisher-print",
  "command": "node",
  "args": [
    "scripts/validate-paragraph.js",
    "--mode",
    "part-a",
    "--profile",
    "publisher-print",
    "C:\\wt\\book2-231-qc-20260906\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.3 Hoofdstuk Surplus en welvaart\\2.3.1 Consumentensurplus"
  ],
  "cwd": "C:\\wt\\book2-231-qc-20260906\\4veco-platform",
  "started_at": "2026-09-06T00:51:28.715Z",
  "finished_at": "2026-09-06T00:51:28.760Z",
  "exit_code": 0,
  "signal": null,
  "stdout": "\nValidating paragraph 2.3.1 \"Consumentensurplus\"\nPath: C:\\wt\\book2-231-qc-20260906\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.3 Hoofdstuk Surplus en welvaart\\2.3.1 Consumentensurplus\nMode: part-a\nProfile: publisher-print\n\n-- Part A textbook files --\n  OK Paragraph type: theory\n  OK paragraaf.md: 2.3.1 Consumentensurplus – paragraaf.md\n  OK opgaven.md: 2.3.1 Consumentensurplus – opgaven.md\n  OK antwoorden.md:
...[truncated 1031 chars]
```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-QC-publish.cjs prepare

- cwd: `C:\wt\book2-231-qc-20260906\4veco-platform`
- started_at: `2026-09-06T00:54:01.635Z`
- finished_at: `2026-09-06T00:54:01.752Z`
- duration_ms: `117`
- exit_code: `1`
- stdout_sha256: `cb60bb69c5329d0249ed9014e9899f0b91da718bca78788d9bafb32edc6add0f`
- stderr_sha256: `c6e39b0a701a52d5fb9745f54d84ca905ac49ad9f29963e11bb13008d590d15b`

### stdout excerpt

```text
{
  "name": "platform-claim",
  "cwd": "C:\\wt\\book2-231-qc-20260906\\4veco-platform",
  "command": "node",
  "args": [
    "C:\\wt\\book2-231-qc-20260906\\4veco-platform\\build-scripts\\ci\\check-agent-worktree-safety.js",
    "--task",
    "BOOK2-TEXTBOOK-PRODUCTION-1-231-QC",
    "--agent",
    "paragraph_231_specialist_qc",
    "--require-prefix",
    "codex/,agent/"
  ],
  "started_at": "2026-09-06T00:54:01.698Z",
  "finished_at": "2026-09-06T00:54:01.744Z",
  "exit_code": 2,
  "stdout": "",
  "stderr": "Agent worktree-safety check failed: missing mode: pass --claim, --check, or --release\n"
}

```

### stderr excerpt

```text
node:internal/assert/utils:77
    throw err;
    ^

AssertionError [ERR_ASSERTION]: platform-claim unexpected status
    at run (C:\wt\book2-231-qc-20260906\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-231-QC-publish.cjs:18:40)
    at checks (C:\wt\book2-231-qc-20260906\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-231-QC-publish.cjs:26:3)
    at Object.<anonymous> (C:\wt\book2-231-qc-20260906\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-231-QC-publish.cjs:30:2)
    at Module._compile (node:internal/modules/cjs/loader:1804:14)
    at Object..js (node:internal/modules/cjs/loader:1936:10)
    at Module.load (node:internal/modules/cjs/loader:1525:32)
    at Module._load (node:internal/modules/cjs/loader:1327:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5) {
  generatedMessage: false,
  code: 'ERR_ASSERTION',
  actual: false,
  expected: true,
  operator: '==',
  diff: 'simple'
}

Node.js v24.13.1

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-QC-publish.cjs prepare

- cwd: `C:\wt\book2-231-qc-20260906\4veco-platform`
- started_at: `2026-09-06T00:54:27.298Z`
- finished_at: `2026-09-06T00:54:30.750Z`
- duration_ms: `3452`
- exit_code: `0`
- stdout_sha256: `9418247d16773b74bdebb3561841ccfc19bb7e485f165c8b5293b9878e184f21`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "name": "platform-claim-v2",
  "cwd": "C:\\wt\\book2-231-qc-20260906\\4veco-platform",
  "command": "node",
  "args": [
    "C:\\wt\\book2-231-qc-20260906\\4veco-platform\\build-scripts\\ci\\check-agent-worktree-safety.js",
    "--check",
    "--task",
    "BOOK2-TEXTBOOK-PRODUCTION-1-231-QC",
    "--agent",
    "paragraph_231_specialist_qc",
    "--require-prefix",
    "codex/,agent/"
  ],
  "started_at": "2026-09-06T00:54:27.372Z",
  "finished_at": "2026-09-06T00:54:27.637Z",
  "exit_code": 0,
  "stdout": "{\n  \"ok\": true,\n  \"mode\": \"check\",\n  \"repository\": \"4veco-platform\",\n  \"worktree_path\": \"C:/wt/book2-231-qc-20260906/4veco-platform\",\n  \"git_dir\": \"C:\\\\Projects\\\\4veco\\\\4veco-platform\\\\.git\\\\worktrees\\\\4veco-platform165\",\n  \"anchor_clone\": false,\n  \"task_id\": \"BOOK2-TEXTBOOK-PRODUCTION-1-231-QC\",\n  \"agent_id\": \"paragraph_231_specialist_qc\",\n  \"lock\": {\n    \"present\": true,\n    \"same_owner\": true,\n    \"same_task\": true,\n    \"stale\": false,\n    \"path\": \"C:\\\\Projects\\\\4veco\\\\4veco-platform\\\\.git\\\\worktrees\\\\4veco-platform165\\\\4veco-agent-worktree-lock.json\",\n    \"owner\": \"paragraph_231_specialist_qc\",\n    \"task_id\": \"BOOK2-TEXTBOOK-PRODUCTION-1-231-QC\"\n  },\n  \"branch\": \"agent/book2-231-qc-20260906\",\n  \"head_sha\": \"651df6307a4ffab02e104897b3a699842524290f\",\n  \"on_main\": false,\n  \"detached_head\": false,\n  \"dirty\": true,\n  \"dirty_count\": 42,\n  \"ahead\": 0,\n  \"behind\": 0,\n  \"diverged\": false,\n  \"prefix_ok\": true,\n  \"required_prefixes\": [\n    \"codex/\",\n    \"agent/\"\n  ],\n  \"warnings\": [\n    \"working tree is dirty (42 items)\"\n  ],\n  \"failures\": []\n}\n",
  "stderr": ""
}
{
  "name": "lessons-claim-v2",
  "cwd": "C:\\wt\\book2-231-qc-20260906\\4veco-lessen",
  "command": "node",
  "args": [
    "C:\\wt\\book2-231-qc-20260906\\4veco-platform\\build-scripts\\ci\\check-agent-worktree-safety.js",
    "--check",
    "--task",
    "BOOK2-TEXTBOOK-PRODUCTION-1-231-QC",
    "--agent",
    "paragraph_231_specialist_qc",
    "--require-prefix",
    "codex/,agent/"
  ],
  "started_at": "2026-09-06T00:54:27.638Z",
  "finished_at": "2026-09-06T00:54:27.836Z",
  "exit_code": 0,
  "stdout": "{\n  \"ok\": true,\n  \"mode\": \"check\",\n  \"repository\": \"4veco-lessen\",\n  \"worktree_path\": \"C:/wt/book2-231-qc-20260906/4veco-lessen\",\n  \"git_dir\": \"C:\\\\Projects\\\\4veco\\\\4veco-lessen\\\\.git\\\\worktrees\\\\4veco-lessen110\",\n  \"anchor_clone\": false,\n  \"task_id\": \"BOOK2-TEXTBOOK-PRODUCTION-1-231-QC\",\n  \"agent_id\": \"paragraph_231_specialist_qc\",\n  \"lock\": {\n    \"present\": true,\n    \"same_owner\": true,\n    \"same_task\": true,\n    \"stale\": false,\n    \"path\": \"C:\\\\Projects\\\\4veco\\\\4veco-lessen\\\\.git\\\\worktrees\\\\4veco-lessen110\\\\4veco-agent-worktree-lock.json\",\n    \"owner\": \"paragraph_231_specialist_qc\",\n    \"task_id\": \"BOOK2-TEXTBOOK-PRODUCTION-1-231-QC\"\n  },\n  \"branch\": \"agent/book2-231-qc-20260906\",\n  \"head_sha\": \"219a977e495abe43c17949e7d8996aab4176faa0\",\n  \"on_main\": false,\n  \"detached_head\": false,\n  \"dirty\": true,\n  \"dirty_count\": 1,\n  \"ahead\": 0,\n  \"behind\": 0,\n  \"diverged\": false,\n  \"prefix_ok\": true,\n  \"required_prefixes\": [\n    \"codex/\",\n    \"agent/\"\n  ],\n  \"warnings\": [\n    \"working tree is dirty (1 item)\"\n  ],\n  \"failures\": []\n}\n",
  "stderr": ""
}
{
  "name": "governance-final",
  "cwd": "C:\\wt\\book2-231-qc-20260906\\4veco-platform",
  "command": "node",
  "args": [
    "build-scripts/review-gates/check-governance-freshness.js"
  ],
  "started_at": "2026-09-06T00:54:27.837Z",
  "finished_at": "2026-09-06T00:54:28.898Z",
  "exit_code": 0,
  "stdout": "{\n  \"ok\": true,\n  \"remote\": \"origin\",\n  \"remote_ref\": \"origin/main\",\n  \"origin_main_sha\": \"96416b6b5bd57094576e9aba0a42d682584ec479\",\n  \"head_sha\": \"651df6307a4ffab02e104897b3a699842524290f\",\n  \"all
...[truncated 2540 chars]
```

### stderr excerpt

```text

```
