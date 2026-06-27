# AGENTS-MD-ENTRYPOINT-CLEANUP-1 CI Correction Log

## Remote CI Finding

Initial platform PR CI run `28287356122` failed at
`Validate active governance wording` because required `platform-ci` checks the
platform candidate against lesson `main`. That exposed the intended paired
bundle condition: platform-first is unsafe until lesson member #39 has landed.

The same run also exposed a bundle-proof gap: the
`cross-repo-bundle-compatibility` matrix did not run
`npm run check:active-governance-wording`, even though required platform CI
does. Without that check, compatibility proof could incorrectly mark the
platform-first state safe.

## Correction

- Added `npm run check:active-governance-wording` to
  `.github/workflows/cross-repo-bundle-compatibility.yml` for every exact-ref
  matrix state.
- Added a regression in
  `build-scripts/review-gates/cross-repo-bundle-workflow.test.js`.

This is a narrow bundle-safety correction discovered by the natural paired PR
run. It does not change the single-PR integration lane or branch protection.
