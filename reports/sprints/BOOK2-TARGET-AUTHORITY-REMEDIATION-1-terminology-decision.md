# Book 2 `Ei` Terminology Decision

Date: 2026-09-04
Decision status: Issue #229 candidate rule; owner approval pending

## Decision

Book 2 candidate targets use exactly three student-facing `Ei` categories:

- `Ei < 0`: inferieur goed;
- `0 < Ei < 1`: normaal goed;
- `Ei > 1`: luxegoed.

`Ei = 0` and `Ei = 1` are explicit boundary values. The current authority set
does not assign them unambiguously to one of the three open intervals, so the
candidate checker must not invent a category. `Noodzakelijk goed` is not used
as an `Ei` category in the Book 2 candidate route.

## Evidence chain

1. CvTE VWO 2026 D1.7–D1.9 names `inkomenselasticiteit`, `inferieure
   goederen`, `normale goederen`, and `luxe goederen` as the examination route.
2. `references/authored/economie-terminologie.md` is the repository's
   student-facing terminology authority and records those same three terms.
3. `references/machine/begrippen.json#inkomenselasticiteit` gives the same
   three-way numerical route.
4. MTU `D11` already uses the same route.
5. MTU `A17` was the isolated machine outlier and has been updated through
   `build-scripts/references/unit-update.js`; no machine file was hand-edited.

## Approved-outline conflict and governance

The approved Book 2 semantic outline still contains two stale statements: the
§2.2.3 row says normal/inferior precedes a necessity/luxury subdivision, and
the misconception map says necessity/luxury applies within positive `Ei`.
Those approved semantics are preserved as historical owner-approved evidence,
not silently rewritten. Open hold `H-229-EI-SUPERSESSION` identifies the exact
conflict and blocks approved target use, target integration, paragraph/lesson
production, and merge for §2.2.3. It permits candidate design, repair, and
specialist review. Only an exact owner decision may release that hold.

## Verification contract

Focused tests reject `noodzakelijk` only in current student-facing Book 2
candidate fields, so historical evidence may quote the rejected wording. They
also assert the three open intervals and include explicit `Ei=0` and `Ei=1`
boundary fixtures. The protected-reference diff must prove that every machine
unit other than `A17` is unchanged.
