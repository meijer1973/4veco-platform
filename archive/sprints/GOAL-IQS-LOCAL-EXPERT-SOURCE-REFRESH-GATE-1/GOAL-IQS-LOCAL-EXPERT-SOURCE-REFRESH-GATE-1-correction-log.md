# GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1 Correction Log

Status: specialist_blockers_closed

| Finding | Status | Correction | Proof |
| --- | --- | --- | --- |
| Strict schema did not model actual packet shapes | closed | Added concrete plan/simulation/decision schema definitions and schema-instance validation in the checker | Focused checker PASS |
| Required specialist/final review records were not enforced | closed | Checker now requires manual review records; specialist and final lead records are present | Focused checker PASS |
| England source allowlist was documented but not enforced | closed | Checker now compares exact source IDs, URLs, roles, access dates, allowed uses, and forbidden inferences against the deepening descriptor | Focused checker PASS; England re-review accepted repair |
| England simulation coverage leaned on a single Ofsted source | closed | Simulation boundary-focus rows now cover DfE, Ofsted, representative AQA, SEND/accessibility, not-all-awarding-bodies, and England-only/not-whole-UK cases | Focused checker PASS; England re-review accepted repair |
| Flanders inclusion and learner-support boundary was flattened | closed | Flanders gate now carries accessibility/inclusion and learner-support boundary language plus copied overlay accessibility/school-owned evidence records | Accessibility re-review accepted repair |
| Individual/reasonable-adjustment and learner/support-record claims were not first-class machine blocks | closed | Added authority flags, CLI refusals, negative fixtures, checker assertions, and focused Jest probes | Focused checker and Jest PASS |
