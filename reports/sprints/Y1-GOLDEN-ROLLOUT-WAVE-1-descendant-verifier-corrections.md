# Descendant verifier: implementation review corrections

Date: 2026-09-08. Reviewer: `entry_rule_review`.

Round-1 P1 is addressed by parsing the complete workflow with safe YAML loading,
rejecting duplicate keys, and comparing all protected job settings, protected
steps, and top-level settings independently of property ordering. New regressions
cover job conditions and ignored errors after the steps, permission escalation,
duplicate jobs/steps and altered command/checkout arguments.

Round-1 P2 is addressed by removing the textual alias ban. The verifier compares
parsed structure and allows unrelated steps containing ampersands and YAML aliases.
Unrelated package scripts and dependency/lock entries are also accepted. The YAML
parser is now an explicit exact 3.14.2 dependency, already present in the baseline
lock; its root declaration and reviewed lock subrecord remain bound.

The new certificate moved from `reports/json` into the sprint review-evidence
directory. The generic paragraph scope classifier cannot classify the former
location, even with a scope exception. The classifier is unchanged and no waiver
is used. The source certificate is regenerated after the corrected source commit.

Validation so far: the targeted workflow/CLI regression selection passes (34
tests; 25 other current-verifier cases excluded from that selection). The earlier
full focused run was stopped when these source corrections became necessary;
it is not counted as a passing test run. Full focused and exact-head validation
must now run on the corrected payload. Round-2 review must independently close
both findings; this disposition is not a self-issued review PASS.

Round-2 structural review passed at `78527ac1`, and the complete local suite
passed 111 suites / 1,927 tests (6 suites / 8 tests retained baseline skips).
CI 34246429382 also passed Jest but failed the strict runtime checkout comparison
for the successor verifier. CRLF retention is a hypothesis, not an observed byte
diagnosis; isolated reset fixtures normalized LF successfully.

Independent amendment review accepted extending the existing platform forced
checkout to all tracked files. The full normalization step and its order after
checkouts/before Y1 are now protected. A real isolated Git regression verifies LF
text restoration and binary preservation. Runtime content changes, CRLF-only
differences and missing files still fail; hash/CRLF diagnostics do not grant an
exception. Historical blobs and lesson checkout policy remain unchanged. A new
source payload/certificate and complete exact-head CI/review are required.

CI 34249630523 passed the full Jest suite but again rejected current.js, now with
diagnostics proving exact LF-to-CRLF equivalence. Independent investigation
reproduced aged stat-clean CRLF retention through reset and forced checkout: Git
skips unchanged index entries before its force handling. The earlier rapid
fixture did not cover this state.

The corrected checkout contract adds 34 exact LF rules for the 42 bound text
paths. Historical blob content is unchanged. `.gitattributes` has source
provenance and strict runtime binding; effective committed rules are checked in
an isolated bare object-backed context that cannot inherit info/global/system
attributes. Tests reject missing/overridden rules and external masking, reproduce
aged-index retention, and prove fresh autocrlf checkout preserves LF text and
binary bytes. A fourth bound source script checks and reports all 90 runtime
paths before dependencies/tests without rewriting anything. Its unique command,
initial workflow position and the final strict verifier remain mandatory.

Targeted workflow/runtime/attribute/CLI tests pass: 51 tests, with 26 other cases
excluded from that selection. New exact-head full tests, CI and independent
implementation review remain required after sealing the corrected source.
