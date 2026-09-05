# Honest diagnostic history — §222 R13 specialist QC

Actor paragraph_221_r8_independent_review, 2026-09-05. This records reviewer
diagnostics, not new pupil-source defects. Actual test/build/gate commands,
timestamps, exact cwd/inherited PATH, overrides, exit codes and complete output
are append-only in commands.jsonl. Failed probes remain in that log.

- Read/preflight before the logger: complete instruction-read calls whose
  combined output was truncated were repaired with bounded complete-range
  reads. No partial instruction read was treated as complete.
- A discovery `rg` call passed a PowerShell glob as a literal path and returned
  error123. The successful rerun used `rg reports/sprints -g ...`; no source
  or scope conclusion relied on the failed discovery.
- An initial guessed §212 handoff folder omitted “, winst en break-even” and
  Get-Content failed. `rg --files` resolved the actual path, then the full
  handoff was read. A silent attempt at nonexistent222-stage-2-plan.md produced
  no content; actual222-stage-2.md was subsequently discovered/read in full.
- The first owned exact-probes run exited1 because it expected the answer
  Bonus heading in a `<section>` wrapper. Actual native answers HTML has a
  direct `<h2 id="denkertje-bonusopgave">` followed by sibling paragraphs/list.
  Only the review helper was corrected to select that exact heading and its
  following siblings up to the next h2. The model-response/four-bullet
  requirements were not weakened. The unchanged actual source/PDF was already
  personally read; the corrected complete probe exited0. Failed stdout/stderr
  and raw hashes are retained; no canonical acceptance was written before it.
- Locked npm ci --ignore-scripts succeeded with eight existing reported
  vulnerabilities; no package/lockfile changed. Native renderer's existing
  deprecation warning is retained in command output. Neither establishes a
  fresh whole-project security review or authorizes unrelated dependency work.

All14 source tests, native full build and unchanged --rebuild, both actual
PartA profiles, currentness and durable authority passed. Test output does
not stand in for the separately recorded personal29-image inspection.
No false visual suspicion or source correction was issued in this review.
