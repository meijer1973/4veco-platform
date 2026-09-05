
### 2026-09-05T20:14:51.632Z: baseline

Command: ["C:/Python314/python.exe","reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-ALT-evidence.py","baseline"]

Exit: 0. Expected: 0. Matched expected outcome.

### 2026-09-05T20:14:54.620Z: baseline

Command: ["node","build-scripts/workflows/check-book-outline-currentness.js"]

Exit: 0. Expected: 0. Matched expected outcome.

### 2026-09-05T20:14:56.405Z: baseline

Command: ["node","build-scripts/workflows/check-book-outline-currentness.js","--require-approved","--action","paragraph_production","--paragraph","2.1.2"]

Exit: 0. Expected: 0. Matched expected outcome.

### 2026-09-05T20:14:58.102Z: baseline

Command: ["node","build-scripts/workflows/check-book2-target-authority-remediation.js","--durable"]

Exit: 0. Expected: 0. Matched expected outcome.

### 2026-09-05T20:14:58.640Z: baseline

Command: ["node","build-scripts/sprints/check-sprint-bundle.js","BOOK2-TEXTBOOK-PRODUCTION-1"]

Exit: 0. Expected: 0. Matched expected outcome.

### 2026-09-05T20:14:58.892Z: baseline

Command: ["C:/Python314/python.exe","build-scripts/content/book-2/212/test_source.py"]

Exit: 0. Expected: 0. Matched expected outcome.

### 2026-09-05T20:14:59.191Z: baseline

Command: ["C:/Python314/python.exe","build-scripts/content/book-2/212/check_render.py","reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-ALT-baseline-render-r5.json"]

Exit: 0. Expected: 0. Matched expected outcome.

### 2026-09-05T20:15:00.842Z: baseline

Command: ["C:/Python314/python.exe","build-scripts/content/book-2/212/test_metadata.py"]

Exit: 1. Expected: 1. Matched expected outcome.

### 2026-09-05T20:16:19.534Z: build

Command: ["C:/Python314/python.exe","build-scripts/content/book-2/b2_212.py","--lesson-root","../4veco-lessen","--proof-root","reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1","--proof-suffix","r6","--manifest","reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-ALT-build-r6.json"]

Exit: 0. Expected: 0. Matched expected outcome.

### 2026-09-05T20:19:38.552Z: verify

Command: ["C:/Python314/python.exe","build-scripts/content/book-2/212/test_source.py"]

Exit: 0. Expected: 0. Matched expected outcome.

### 2026-09-05T20:19:39.322Z: verify

Command: ["C:/Python314/python.exe","build-scripts/content/book-2/212/test_metadata.py"]

Exit: 0. Expected: 0. Matched expected outcome.

### 2026-09-05T20:19:39.913Z: verify

Command: ["C:/Python314/python.exe","build-scripts/content/book-2/212/check_render.py","reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-ALT-render-check-r6.json"]

Exit: 0. Expected: 0. Matched expected outcome.

### 2026-09-05T20:19:42.554Z: verify

Command: ["C:/Python314/python.exe","reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-ALT-evidence.py","verify"]

Exit: 0. Expected: 0. Matched expected outcome.

### 2026-09-05T20:19:52.800Z: verify

Command: ["C:/Python314/python.exe","reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-ALT-evidence.py","print_rebuild"]

Exit: 0. Expected: 0. Matched expected outcome.

### 2026-09-05T20:19:57.042Z: verify

Command: ["C:/Python314/python.exe","reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-ALT-evidence.py","grayscale"]

Exit: 0. Expected: 0. Matched expected outcome.

### 2026-09-05T20:19:59.708Z: verify

Command: ["node","scripts/validate-paragraph.js","--mode","part-a","--profile","student-web","C:\\wt\\book2-212-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.2 Opbrengsten, winst en break-even"]

Exit: 0. Expected: 0. Matched expected outcome.

### 2026-09-05T20:19:59.811Z: verify

Command: ["node","scripts/validate-paragraph.js","--mode","part-a","--profile","publisher-print","C:\\wt\\book2-212-alt-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.2 Opbrengsten, winst en break-even"]

Exit: 0. Expected: 0. Matched expected outcome.

### 2026-09-05T20:19:59.861Z: verify

Command: ["node","build-scripts/workflows/check-book-outline-currentness.js","--require-approved","--action","paragraph_production","--paragraph","2.1.2"]

Exit: 0. Expected: 0. Matched expected outcome.

### 2026-09-05T20:20:02.089Z: verify

Command: ["node","build-scripts/workflows/check-book2-target-authority-remediation.js","--durable"]

Exit: 0. Expected: 0. Matched expected outcome.

### 2026-09-05T20:20:02.698Z: verify

Command: ["node","build-scripts/sprints/check-sprint-bundle.js","BOOK2-TEXTBOOK-PRODUCTION-1"]

Exit: 0. Expected: 0. Matched expected outcome.

### 2026-09-05T20:26:42.354Z: prepublish

Command: ["git","fetch","--prune","origin"]

Exit: 0. Expected: 0. Matched expected outcome.

### 2026-09-05T20:26:42.977Z: prepublish

Command: ["git","fetch","--prune","origin"]

Exit: 0. Expected: 0. Matched expected outcome.

### 2026-09-05T20:26:43.536Z: prepublish

Command: ["node","build-scripts/review-gates/check-governance-freshness.js"]

Exit: 0. Expected: 0. Matched expected outcome.

### 2026-09-05T20:26:44.500Z: prepublish

Command: ["node","build-scripts/ci/check-agent-worktree-safety.js","--check","--task","book2-212-alt-correction-20260905","--agent","paragraph_212_alt_builder","--require-prefix","codex/,agent/"]

Exit: 0. Expected: 0. Matched expected outcome.

### 2026-09-05T20:26:44.695Z: prepublish

Command: ["node","C:\\wt\\book2-212-alt-correction-20260905\\4veco-platform\\build-scripts\\ci\\check-agent-worktree-safety.js","--check","--task","book2-212-alt-correction-20260905","--agent","paragraph_212_alt_builder","--require-prefix","codex/,agent/"]

Exit: 0. Expected: 0. Matched expected outcome.

### 2026-09-05T20:26:44.861Z: prepublish

Command: ["git","diff","--check"]

Exit: 0. Expected: 0. Matched expected outcome.

### 2026-09-05T20:26:44.901Z: prepublish

Command: ["git","diff","--check"]

Exit: 0. Expected: 0. Matched expected outcome.

### 2026-09-05T20:27:23.113Z: scope

Command: ["node","build-scripts/workflows/check-paragraph-lane-scope.js","--lane","shared","--base","798cacfeeb40e4e0ba54d26f2b040cbdeec327a9","--head","89a8fc34f7c017b10af86d6b058bf6ba21328367"]

Exit: 0. Expected: 0. Matched expected outcome.

### 2026-09-05T20:27:23.181Z: scope

Command: ["node","build-scripts/workflows/check-paragraph-lane-scope.js","--cwd","../4veco-lessen","--lane","textbook","--base","a2bb4bcf199b8871eef21426f329efb6795e7dd8","--head","901e18aaf8179b37daafd5fd2e45ed92db444a49"]

Exit: 0. Expected: 0. Matched expected outcome.
