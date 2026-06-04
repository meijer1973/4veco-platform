# Sprint CI-REMOTE-1: Lead Review Corrections

## Round-1 Verdict

Round 1 returned PASS WITH FLAGS.

## Correction Record

| Finding | Disposition | Evidence |
|---|---|---|
| No blocking findings in round 1. | No implementation correction required. | `reports/sprints/CI-REMOTE-1-lead-review-round1.md` records PASS WITH FLAGS. |
| `CI-RUNNER-LABEL-1`: GitHub notes `windows-latest` runner requests are being redirected to a newer Windows image by June 15, 2026. | Accepted non-blocking follow-up. Current run `26953558150` passes; future runner drift should be monitored if CI later fails before code changes. | GitHub Actions annotation on run `26953558150`. |
| `CI-URL-INDEX-EOL-1`: closure-maintenance run `26953928228` failed because Windows checkout stored `reports/url-index.md` with CRLF while `emit-url-index.js --check` compares against LF output. | Corrected by adding `.gitattributes` for `reports/url-index.md text eol=lf` and by forcing that file through `git -c core.autocrlf=false checkout-index -f -- reports/url-index.md` during workflow normalization. | Failed run `26953928228`, downloaded artifact line-ending inspection, and local wrapped checks for URL-index freshness and diff hygiene on 2026-06-04. |

## Round-2 Readiness

Round 2 should recheck workflow triggers, sibling checkout, validator coverage,
remote run success, artifact upload, branch protection, command-log evidence,
roadmap state, URL-index LF normalization, and forbidden-surface boundaries.
Expected verdict: PASS WITH FLAGS carrying only `CI-RUNNER-LABEL-1` if the
fresh remote run passes.
