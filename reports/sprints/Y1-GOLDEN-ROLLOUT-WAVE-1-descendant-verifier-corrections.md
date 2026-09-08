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
