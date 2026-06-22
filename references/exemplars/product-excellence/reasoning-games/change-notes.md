# Reasoning Game Golden Family Change Notes

Status: stable policy ledger for `reasoning-game-golden-family-v1`.

## 2026-06-22 - Diff Hygiene Normalization

`GOAL-REASONING-GOLDEN-FAMILY-1-REBASE-CI-READINESS` normalizes trailing
whitespace in copied exemplar evidence files for PR-diff hygiene and refreshes
the `manifest.json` bytes and hashes as library version `1.0.1`.

This does not change product grammar, reasoning grammar, authority, fixtures,
candidate data, or rendered student behavior. The governing rule remains:
copy product grammar and re-derive reasoning grammar.

## 2026-06-20 - Initial Adoption

`GOAL-REASONING-GOLDEN-FAMILY-1` adopts the four package exemplars as a
versioned golden-reference library and turns their shared product grammar into
repository capability.

Adopted policy:

- preserve package prototypes as evidence, with hashes in `manifest.json`;
- copy product grammar and re-derive reasoning grammar for every new target;
- route new `redeneer-spel` work through `skills/econ-reasoning-game.md`;
- use shared task-shell primitives and `engines/reasoning-composer.js` rather
  than adding another mode-overloaded reasoning engine;
- require negative fixtures for recurring defects;
- require rendered interaction-state proof before human gate review.

Authority boundary:

- no student product adoption;
- no target-equivalent proof;
- no diagnostics, mastery, sequencing, summative use, PV projection, Scale Gate
  claim, or broad rollout.

Change-control rule:

- changes to prototype evidence, candidate data, exemplar fixtures, or quality
  files require a manifest version bump and an added change-note entry;
- changes to reusable task families or composer policy require focused tests,
  negative fixtures, rendered proof refresh, and lead review;
- generated lesson output must not be hand-edited as part of this policy
  adoption.
