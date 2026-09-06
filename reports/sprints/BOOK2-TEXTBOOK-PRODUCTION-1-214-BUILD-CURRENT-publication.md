# Exact author payload scope and normal publication procedure

Substantive author payload P ad5186e608637ccec881014f01c5b91e27bdbab4,
L84f821a3cde2e525c54593d7f36ea86b2c53dff9. Source epoch09e99f770b057d239e8d3d7c7e3185e830615cf7
and binder a62bc517c5c13b4f93bf836ad5bd37b9843e7c55 remain exact. All native
files remain raw-equal after r43/r44/r45/r46 to committed L and viewed r42.
The scope captures in this commit bind to that already committed payload, not
an invented anchor or future hash. This note does not assert a push already
occurred; the terminal verification supplies the actual remote heads.

## Actual payload scopes

All four native scope checks PASS with zero UNKNOWN. Against this task's exact
initial pair, P has10 shared source files and270 review/evidence paths; L has15
Part A native paths and no companion paths. Complete baseline scopes use
P96416b6b5bd57094576e9aba0a42d682584ec479 and
Lf09fd6e88edc5049b026b16b0158e7e188091d2d: P100 shared source,6 generated
index and7526 evidence paths; L240 Part A and7 review paths. These are real
whole baseline changes, including already integrated predecessor work, not
changes claimed as this author's own. Strict own-path and whole prior-raw
preservation are separately proven in post-native-final-custody.json.

Own P and L whitespace checks pass in native and CRLF-aware modes. Whole L
checks pass. Whole P whitespace checks fail on preserved historical evidence:
212-S1-command-log.md line519 (embedded original line62 whitespace) and
231-REVIEW-command-log.md line696. Their raw bytes are preserved; this author
does not repair foreign historical reports or suppress those genuine failures.

## Index transport and inventory

The actual standard read-only P ls-tree transport fails ENOBUFS at15,275 files
and1,268,606 unquoted bytes. Standard L transport completes at1,922 files and
202,193 unquoted bytes but quotes380 Unicode paths (P quotes12). The diagnostic
is preserved in index-transport-diagnostic-process.json. This is not evidence
that Git paths themselves begin with literal quotes.

The owned source-bound index-runtime.cjs changes only the exact explicit-ref
read-only ls-tree call:128MiB buffer and `-c core.quotepath=false`. The shared
index module remains raw44b235b2a65b36f28c316a7d9cee947e3ce049713ddcd53ced2321a7a9ec9b53.
Every invocation uses all six paired root/ref/branch environment variables,
this task branch and the actual current heads. Final verification compares
each grouped index to actual NUL-delimited Git filenames and checks all
Markdown entries; it does not compare Git-quoted line representations.

The normal final sequence is: preserve this actual scope/evidence commit;
generate and inspect exact paired indexes; commit their diagnostics as owned
evidence; regenerate if the new evidence changes the index source head; commit
only four index files as the terminal tail; normally push both task branches;
verify clean HEAD=tracking=remote and current paired indexes. The four-index
tail is excluded from root's substantive import chain. Existing URL map check
passes; no dashboard, roadmap or entrypoint changes are in this scope.

No PR is opened because root retains sole integration and the next required
steps are distinct paragraph review, distinct specialist QC and root rebuild/
acceptance. No fresh platform-ci/full-suite/merge or student-use grant is
claimed. Normal branch publication is not a review verdict. The author stops
after publishing exact remote-clean evidence and waits for the root's next
bounded assignment.
