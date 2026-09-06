# Final read-only runtime diagnostic — no candidate change

After the first clean four-index tail49728cb9, an additional direct PowerShell
invocation ran the checker without the task helper's explicit UTF-8 environment:

```text
C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-232-PLAN-F1-check.py | Select-Object -First 7
git status --short --branch
```

The checker completed its assertions but failed while printing its Unicode
JSON result through inherited cp1252. The original terminal trace states
UnicodeEncodeError for U+2192 at print(json.dumps(...)), check.py line205.
The following git-status command returned0, so the compound shell status is
not proof that Python passed. The original combined trace remains in the task
tool history; this note describes it and does not fabricate a separate native
process JSON for that first call. No source/candidate/evidence bytes changed.

The normal task helper explicitly sets PYTHONIOENCODING=utf-8 and
PYTHONDONTWRITEBYTECODE=1 on every captured command. Use that reproducible
entrypoint on this Windows host, rather than the unqualified shorthand in
the earlier author report:

```text
node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-232-PLAN-F1-tools.cjs command checks-final-utf8 C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-232-PLAN-F1-check.py
```

Its new exclusive checks-final-utf8-process.json records the actual fresh
Python exit/stdout/stderr. The original checks-r1 failure and checks-r2 PASS
remain unchanged. This note does not assert a checker implementation change,
source correction, independent approval or native/student acceptance.

This follow-up adds only runtime-note.md and the actual UTF-8 process record.
Root should import its substantive evidence commit but exclude both historical
49728cb9 four-index tail and the final regenerated four-index tail. The same
canonical L266881cb and raw/LFd0781ffb remain the correction for re-review.
