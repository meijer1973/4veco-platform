# Reviewer diagnostic history

First exact-probes invocation exited 1 in its reviewer-owned DOM transformation
helper: it incorrectly expected both Schaatsbaan and Badmintonhal percentage
pairs in one native text node. The first bold Ev ratio splits those nodes.
The assertion reported missing `Badmintonhal:` in the Schaatsbaan node; native
source and HTML had not changed. The helper was corrected to apply each exact
named replacement to the node containing that pair. It still compares the
entire normalized DOM, every attribute and all caption punctuation. No content,
renderer, validator or tolerance was modified. Subsequent result and command
output are retained separately, not relabelled as a first-run PASS.

The initial repository search also used a PowerShell-incompatible path glob
and returned rg error 123. Explicit-file discovery/read followed. This affected
only discovery, not a lesson or gate. Locked npm installation reported eight
existing vulnerabilities; no dependency/lockfile fix was made in review scope.
