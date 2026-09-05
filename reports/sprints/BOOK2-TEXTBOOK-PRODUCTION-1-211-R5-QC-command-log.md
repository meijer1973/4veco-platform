# Sprint BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-QC: Command Log

## C:/Python314/python.exe -m py_compile reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-QC-run.py reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-QC-probes.py

- cwd: `C:\wt\book2-211-r5-qc-20260906\4veco-platform`
- started_at: `2026-09-05T22:31:35.046Z`
- finished_at: `2026-09-05T22:31:35.170Z`
- duration_ms: `124`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `a034a85c4227de486687c71d648e3eb2a2b18abafed6046e61f62c32b045b95a`

### stdout excerpt

```text

```

### stderr excerpt

```text
  File "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-QC-run.py", line 122
    match=re.search(r'-r([1-9][0-9]*)
                    ^
SyntaxError: unterminated string literal (detected at line 122)

```
## C:/Python314/python.exe -m py_compile reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-QC-run.py reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-QC-probes.py

- cwd: `C:\wt\book2-211-r5-qc-20260906\4veco-platform`
- started_at: `2026-09-05T22:32:43.808Z`
- finished_at: `2026-09-05T22:32:43.955Z`
- duration_ms: `147`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-QC-run.py pass0

- cwd: `C:\wt\book2-211-r5-qc-20260906\4veco-platform`
- started_at: `2026-09-05T22:32:54.650Z`
- finished_at: `2026-09-05T22:32:55.824Z`
- duration_ms: `1174`
- exit_code: `0`
- stdout_sha256: `d4c1d8243955d2bc48c1b42ad4692bbb62f8ea13b3c33f8c44d155d2fad86658`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{"argv": ["git", "show", "917115c8da631d65eefbdb1f15c13b2291cd9e1d:Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren \u2013 opgaven.zip"], "exit_code": 0}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-QC-run.py preserve

- cwd: `C:\wt\book2-211-r5-qc-20260906\4veco-platform`
- started_at: `2026-09-05T22:32:55.867Z`
- finished_at: `2026-09-05T22:32:56.163Z`
- duration_ms: `296`
- exit_code: `0`
- stdout_sha256: `77c114e950b55b68fc3f03173ba3f71753c8d7464dd3097ae9c65eff343ce79b`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{"argv": ["git", "show", "3ccd6f68c848d1ab33e5c33fcac754ffbd7c0d99:Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1-quality-ref.yaml"], "exit_code": 0}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-QC-run.py build

- cwd: `C:\wt\book2-211-r5-qc-20260906\4veco-platform`
- started_at: `2026-09-05T22:32:56.209Z`
- finished_at: `2026-09-05T22:33:25.862Z`
- duration_ms: `29653`
- exit_code: `0`
- stdout_sha256: `833166dc03d00a53bd316a1507e042159d62ceba2c7bbe7711531221b24d9aac`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{"argv": ["npm.cmd", "ci", "--ignore-scripts"], "exit_code": 0}
{"argv": ["C:/Python314/python.exe", "-m", "unittest", "discover", "-s", "build-scripts/content/book-2/211", "-p", "test_*.py", "-v"], "exit_code": 0}
{"argv": ["git", "worktree", "list", "--porcelain"], "exit_code": 0}
{"argv": ["C:/Python314/python.exe", "build-scripts/content/book-2/b2_211.py", "--lesson-root", "C:\\wt\\book2-211-r5-qc-20260906\\4veco-lessen", "--proof-root", "C:\\wt\\book2-211-r5-qc-20260906\\4veco-platform\\reports\\rendered-proof\\BOOK2-TEXTBOOK-PRODUCTION-1", "--proof-suffix", "r6", "--manifest", "C:\\wt\\book2-211-r5-qc-20260906\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-QC-evidence\\full-build.json"], "exit_code": 0}
{"argv": ["C:/Python314/python.exe", "build-scripts/content/book-2/211/check_render.py"], "exit_code": 0}
{"argv": ["C:/Python314/python.exe", "build-scripts/content/book-2/print_pipeline.py", "C:\\wt\\book2-211-r5-qc-20260906\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 paragraaf.md"], "exit_code": 0}
{"argv": ["C:/Python314/python.exe", "build-scripts/content/book-2/print_pipeline.py", "C:\\wt\\book2-211-r5-qc-20260906\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 opgaven.md"], "exit_code": 0}
{"argv": ["C:/Python314/python.exe", "build-scripts/content/book-2/print_pipeline.py", "C:\\wt\\book2-211-r5-qc-20260906\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 antwoorden.md"], "exit_code": 0}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-QC-run.py captures

- cwd: `C:\wt\book2-211-r5-qc-20260906\4veco-platform`
- started_at: `2026-09-05T22:34:02.946Z`
- finished_at: `2026-09-05T22:34:13.488Z`
- duration_ms: `10542`
- exit_code: `0`
- stdout_sha256: `389d8def09c9ab3fbd5a9ecb5432c6f523be92ba3c1c90679e3a09099a881b5f`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{"argv": ["pdftoppm", "-r", "150", "-png", "C:\\wt\\book2-211-r5-qc-20260906\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 paragraaf.pdf", "C:\\wt\\book2-211-r5-qc-20260906\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-QC-evidence\\paragraaf\\page"], "exit_code": 0}
{"argv": ["pdftoppm", "-r", "150", "-png", "C:\\wt\\book2-211-r5-qc-20260906\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 opgaven.pdf", "C:\\wt\\book2-211-r5-qc-20260906\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-QC-evidence\\opgaven\\page"], "exit_code": 0}
{"argv": ["pdftoppm", "-r", "150", "-png", "C:\\wt\\book2-211-r5-qc-20260906\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 antwoorden.pdf", "C:\\wt\\book2-211-r5-qc-20260906\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-QC-evidence\\antwoorden\\page"], "exit_code": 0}
{"argv": ["C:/Python314/python.exe", "-m", "cairosvg", "C:\\wt\\book2-211-r5-qc-20260906\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\_assets\\2.1.1_ex_1.svg", "-o", "C:\\wt\\book2-211-r5-qc-20260906\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-QC-evidence\\native\\2.1.1_ex_1.png", "-s", "2"], "exit_code": 0}
{"argv": ["C:/Python314/python.exe", "-m", "cairosvg", "C:\\wt\\book2-211-r5-qc-20260906\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\_assets\\2.1.1_fig_1.svg", "-o", "C:\\wt\\book2-211-r5-qc-20260906\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-QC-evidence\\native\\2.1.1_fig_1.png", "-s", "2"], "exit_code": 0}
{"argv": ["C:/Python314/python.exe", "-m", "cairosvg", "C:\\wt\\book2-211-r5-qc-20260906\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\_assets\\2.1.1_fig_2.svg", "-o", "C:\\wt\\book2-211-r5-qc-20260906\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-QC-evidence\\native\\2.1.1_fig_2.png", "-s", "2"], "exit_code": 0}
{"argv": ["C:/Python314/python.exe", "-m", "cairosvg", "C:\\wt\\book2-211-r5-qc-20260906\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\_assets\\2.1.1_fig_3.svg", "-o", "C:\\wt\\book2-211-r5-qc-20260906\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-QC-evidence\\native\\2.1.1_fig_3.png", "-s", "2"], "exit_code": 0}
{"argv": ["C:/Python314/python.exe", "-m", "cairosvg", "C:\\wt\\book2-211-r5-qc-20260906\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\_assets\\2.1.1_fig_4.svg", "-o", "C:\\wt\\book2-211-r5-qc-20260906\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-QC-evidence\\native\\2.1.1_fig_4.png", "-s", "2"], "exit_code": 0}
{"argv": ["C:/Python314/python.exe", "-m", "cairosvg", "C:\\wt\\book2-211-r5-qc-20260906\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\_assets\\2.1.1_we_1.svg", "-o", "C:\\wt\\book2-211-r5-qc-20260906\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-QC-evidence\\native\\2.1.1_we_1.png", "-s", "2"], "exit_code": 0}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-QC-run.py probes

- cwd: `C:\wt\book2-211-r5-qc-20260906\4veco-platform`
- started_at: `2026-09-05T22:34:13.543Z`
- finished_at: `2026-09-05T22:34:17.548Z`
- duration_ms: `4005`
- exit_code: `0`
- stdout_sha256: `2a190efb7ff69488bc2857dde581d4b919f2119dc1e82b909fb912c103975073`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{"argv": ["C:/Python314/python.exe", "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-QC-probes.py"], "exit_code": 0}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-QC-run.py gates

- cwd: `C:\wt\book2-211-r5-qc-20260906\4veco-platform`
- started_at: `2026-09-05T22:34:17.593Z`
- finished_at: `2026-09-05T22:34:22.387Z`
- duration_ms: `4794`
- exit_code: `0`
- stdout_sha256: `90d52d4310d2df3215912666f22e3cdd485710c5adc3af40bede7e58018a0abf`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{"argv": ["node", "scripts/validate-paragraph.js", "--mode", "part-a", "--profile", "student-web", "C:\\wt\\book2-211-r5-qc-20260906\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren"], "exit_code": 0}
{"argv": ["node", "scripts/validate-paragraph.js", "--mode", "part-a", "--profile", "publisher-print", "C:\\wt\\book2-211-r5-qc-20260906\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren"], "exit_code": 0}
{"argv": ["node", "build-scripts/workflows/check-book-outline-currentness.js", "--require-approved", "--action", "paragraph_production", "--paragraph", "2.1.1"], "exit_code": 0}
{"argv": ["node", "build-scripts/workflows/check-book-outline-currentness.js", "--require-approved", "--action", "specialist_review", "--paragraph", "2.1.1"], "exit_code": 0}
{"argv": ["node", "build-scripts/workflows/check-book2-target-authority-remediation.js", "--durable"], "exit_code": 0}
{"argv": ["node", "build-scripts/sprints/check-sprint-bundle.js", "BOOK2-TEXTBOOK-PRODUCTION-1"], "exit_code": 0}
{"argv": ["git", "diff", "--check"], "exit_code": 0}
{"argv": ["git", "diff", "--check"], "exit_code": 0}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-QC-run.py final_checks

- cwd: `C:\wt\book2-211-r5-qc-20260906\4veco-platform`
- started_at: `2026-09-05T22:41:55.366Z`
- finished_at: `2026-09-05T22:42:02.256Z`
- duration_ms: `6890`
- exit_code: `0`
- stdout_sha256: `d04af94eb096325b8f2debb80909bb5f63c502ecf5385e08e124e1ea7839942c`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{"argv": ["git", "fetch", "--prune", "origin"], "exit_code": 0}
{"argv": ["git", "fetch", "--prune", "origin"], "exit_code": 0}
{"argv": ["node", "build-scripts/review-gates/check-governance-freshness.js"], "exit_code": 0}
{"argv": ["node", "build-scripts/ci/check-agent-worktree-safety.js", "--check", "--task", "BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-QC", "--agent", "paragraph_211_r5_specialist_qc", "--require-prefix", "codex/,agent/"], "exit_code": 0}
{"argv": ["node", "build-scripts/ci/check-agent-worktree-safety.js", "--check", "--task", "BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-QC", "--agent", "paragraph_211_r5_specialist_qc", "--require-prefix", "codex/,agent/", "--worktree", "C:\\wt\\book2-211-r5-qc-20260906\\4veco-lessen"], "exit_code": 0}
{"argv": ["node", "scripts/validate-paragraph.js", "--mode", "part-a", "--profile", "student-web", "C:\\wt\\book2-211-r5-qc-20260906\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren"], "exit_code": 0}
{"argv": ["node", "scripts/validate-paragraph.js", "--mode", "part-a", "--profile", "publisher-print", "C:\\wt\\book2-211-r5-qc-20260906\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren"], "exit_code": 0}
{"argv": ["node", "build-scripts/workflows/check-book-outline-currentness.js", "--require-approved", "--action", "paragraph_production", "--paragraph", "2.1.1"], "exit_code": 0}
{"argv": ["node", "build-scripts/workflows/check-book-outline-currentness.js", "--require-approved", "--action", "specialist_review", "--paragraph", "2.1.1"], "exit_code": 0}
{"argv": ["node", "build-scripts/workflows/check-book2-target-authority-remediation.js", "--durable"], "exit_code": 0}
{"argv": ["node", "build-scripts/sprints/check-sprint-bundle.js", "BOOK2-TEXTBOOK-PRODUCTION-1"], "exit_code": 0}
{"argv": ["git", "diff", "--check"], "exit_code": 0}
{"argv": ["git", "diff", "--check"], "exit_code": 0}

```

### stderr excerpt

```text

```
