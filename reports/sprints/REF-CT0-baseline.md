# Sprint REF-CT0: Baseline

## Plan reference

`reports/sprints/REF-CT0-plan.md`

## Current state

REF-CT0 is the active references roadmap sprint at baseline. It follows SYNC-1 and S9a, and it precedes REF-CT1 / CP-6.

Git baseline: `513c4420ddfd6fcf616ba4b730a51d2e2e6e85c3`.

The active v5 curriculum-source baseline is `references/owned/course-blueprint-v5.md` plus `references/owned/course-blueprint-v5.meta.json`. The v5 metadata declares 54 count-bearing paragraphs: Book 1 has 12, Book 2 has 12, Book 3 has 14, and Book 4 has 16. Test preparation is web-only and not count-bearing.

The active target-exercise registry is `references/authored/course-target-exercises.json`. At baseline it has 54 records: 43 `migrated_from_v4_needs_v5_review` records and 11 `placeholder_needs_review` records. None of those migrated or placeholder records should be treated as final-reviewed target exercises.

Current v5 target-exercise coverage references 104 live MTU ids across required, introduced, or assumed skills: 39 A-domain, 2 B-domain, 29 D-domain, 9 F-domain, 21 L-domain, 2 H-domain, and 2 I-domain ids. The registry also has 44 records with missing-unit flags and 79 current v5 missing-flag entries.

The older generated `reports/json/blueprint-flag-triage.json` still reflects the v4 49-record target-exercise surface. It remains useful diagnostic context only: 84 raw flags, 68 still-needed, 11 deferred, 1 duplicate, and 4 existing-unit-match records.

## Data integrity notes

Protected reference data must not change in REF-CT0. `references/machine/` and `references/external/` are read-only inputs. The sprint may inspect `references/machine/micro-teaching-units.json` and reports generated from it, but it must not hand-edit or CLI-mutate protected reference surfaces.

`knowledge/three Year blue print.md` is a rough concept scaffold only. It must not be promoted into `references/owned/`, must not become curriculum source of truth, and must not drive automatic unit minting. Known drift includes the old 49-record assumption, unsafe proposed unit IDs that now conflict with live catalog history, a broader Book 4/inflation assumption that v5 parks later, and stale D04 cleanup language after S9a.

Generated reports under `reports/` are diagnostics. They can surface risks, but they cannot override real exam evidence, target-exercise evidence, machine registry facts, or v5 source boundaries.

## Baseline risks

- The rough blueprint uses confident language and proposed IDs; REF-CT0 must downgrade these to review candidates.
- The active v5 target-exercise registry includes placeholders; REF-CT0 must not label them reviewed final.
- The v4 blueprint-flag triage is useful but stale; CT0 must distinguish old diagnostic counts from current v5 counts.
- Without a custom read-only validator, the prototype could accidentally look authoritative to off-site reviewers.
- The existing sprint bundle checker needs a narrow update to recognize the official `REF-CT0` sprint id shape.

## Acceptance baseline

REF-CT0 closes only when the non-authoritative boundary note, v5-aware prototype, classification table, candidate-review packet, JSON mirror, validator, sprint result, diff summary, roadmap bookkeeping, and complete sprint bundle all validate. Remote state and repository maps must be refreshed and pushed before final closure.
