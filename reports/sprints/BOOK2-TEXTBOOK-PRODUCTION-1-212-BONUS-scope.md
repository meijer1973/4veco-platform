# §2.1.2 R7 actual committed scope

2026-09-05; distinct builder `paragraph_212_bonus_correction_builder`.
Both actual committed scope checks returned exit0/PASS and their full path
inventories are recorded in `BOOK2-TEXTBOOK-PRODUCTION-1-command-log.jsonl`
and the readable log. Checks were run after both payload commits, not against
an assumed or uncommitted candidate.

| Repository | Base | Checked payload head | Result |
|---|---|---|---|
|platform|2bf6260c5d4d799c5408f898d0dab126eff9e5ac|95c8e20a603c31e813840ae9561266fe635b02d9|shared PASS:3 owned source/test files +56 evidence/log files|
|lessons|917115c8da631d65eefbdb1f15c13b2291cd9e1d|6139336793edd9e79037fbae1be1586a5cc3a2ba|textbook PASS:4 answer MD/HTML/PDF/ZIP files|

Commands: `node build-scripts/workflows/check-paragraph-lane-scope.js --lane
shared --base 2bf6260c5d4d799c5408f898d0dab126eff9e5ac --head
95c8e20a603c31e813840ae9561266fe635b02d9`; same checker with `--cwd
../4veco-lessen --lane textbook --base
917115c8da631d65eefbdb1f15c13b2291cd9e1d --head
6139336793edd9e79037fbae1be1586a5cc3a2ba`.

The platform source paths are exclusively `build-scripts/content/book-2/212/`
answers.md, test_bonus.py and test_metadata.py. All remaining changed paths are
the owned `BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-*` evidence packet or parent
sprint command-log additions. The four lesson paths are exclusively §2.1.2
answer derivatives. No target registry, plan, hold, predecessor pin, canonical
review/QC/handoff, unrelated paragraph or Part B output changed.

This file and its two recorded scope commands form a separate evidence-only
commit after the payload. Generated repository maps/indexes follow in a separate
deterministic tail so root can adopt the payload and scope evidence without
importing branch-specific index state. No PR/merge or new acceptance is performed
by this builder; independent paragraph review and specialist QC follow.
