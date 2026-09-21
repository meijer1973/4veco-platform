# Independent CI dependency addendum — exercise routes

Reviewer: `review_book2`; author: `codex-root`; date: 2026-09-21. Read-only review of the five-line workflow repair after platform commit `2375fa4583f34e92b0198b015b8ddd60ebe7a460`. Lesson commit remains `b946cf04b128a374301e1998653f45583ec97057`.

## Finding and repair

I inspected the failed logs of [exact-pair CI run 35578024861](https://github.com/meijer1973/4veco-platform/actions/runs/35578024861). The importer stopped with `Cannot find module 'jsdom'` through `target-source-consumer.js` before substantive verification. The repository already declares jsdom and locks 22.1.0; the workflow had not installed its Node dependencies.

The change adds npm caching keyed by `4veco-platform/package-lock.json`, then runs `npm ci` in `4veco-platform` after Node setup and before the importer. Both checkout order and installation directory are correct. It preserves exact commit binding, permissions, tracked-manifest enforcement, PDF/content checks, independent-review binding checks and evidence publication. No lesson, PDF, builder or target changes are included.

## Binding and verification

Workflow: `.github/workflows/paired-exercise-route-ci.yml`.

- Previous exact SHA256: `abf6f8139a8286ba72024b33ed45b62fd1443cf46aceeffebe2a93a4de73bd32`.
- Reviewed repaired exact SHA256: `62ff7ce1d4b006733c77b00a3f747446bde085a28b75a9f582725141d3ffeff7`.
- All other 40 files in the original reviewed platform-source inventory still match their exact hashes.
- Whole-edition manifest remains `c96c8635607855a31a23920c9dd6aadfe764ba3c325545ea93d547b8cd43abe5`.

Independently parsed YAML and asserted installation precedes importer execution at the correct checkout. The current importer with `--require-tracked` passed all 1,291 file bindings, and `exercise-route-review.js --check` passed all 43 paragraph review bindings. These local checks use installed dependencies; a successful fresh remote rerun remains required to establish CI completion.

## Verdict

PASS

The narrow CI repair is correct. This addendum supersedes only the original workflow-file hash for this five-line change; it preserves original review history, scoped paragraph verdicts and all timing/approval limitations. It does not claim the pending remote rerun has succeeded.
