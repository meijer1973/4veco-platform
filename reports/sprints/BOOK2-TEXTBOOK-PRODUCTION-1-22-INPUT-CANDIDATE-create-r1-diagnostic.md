# Candidate creation r1 — incorrect legacy-asset assumption rejected

Actual command `node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-22-INPUT-CANDIDATE-check.cjs create`
ran at committed controllerfc8a1702ec6b37834c3ef3399f395d568c390ae6 and
unchanged lesson3bc9e81828dcc57932dc871825aaa4cf4a975fe1. It exited1 in
inventory() before writing inputs.json. Its baseline.json was already written
exclusively and is preserved unchanged. No source/native/lesson write occurred.
The original actual tool stream contains the complete assertion/stack; this
authored diagnostic does not pretend to be an original process capture.

The first old aggregatePNG had rawd5ad1641cf6a2ed820a1a99b706179d3791802eeda1ab790cf752d4921cd820e,
but current accepted221 fig1PNG is6f4009fe29fb88f442257e658fe6433809020ba824d17ee275a08701f37d0704.
The prior preparation proved a four-name subset, not equality of old aggregate
bytes to the current accepted source. Root incorrectly strengthened that into
byte parity in this phase's initial plan/predicate. The exception is legitimate
stale aggregate output, not a current paragraph-source or authority defect.

Fresh read-only actual four-file comparison:

| Name | Legacy chapter asset SHA256 | Current accepted paragraph asset SHA256 |
|---|---|---|
| 2.2.1_fig_1.png | d5ad1641cf6a2ed820a1a99b706179d3791802eeda1ab790cf752d4921cd820e | 6f4009fe29fb88f442257e658fe6433809020ba824d17ee275a08701f37d0704 |
| 2.2.1_fig_1.svg | b5d47e4c86a086bb0a0eeff78eee7a2559ec665a1d0393575800fc12cf7b2a3a | 1abc7cc2a150318a84341bf89886543cd94e5fc63dd120cf18244e62032536b2 |
| 2.2.1_fig_2.png | ced74a95d5c8bee308c33ee874d326be46b162ac4ef0a9488a3b2962363b292b | 589af699b6e024488be654185cfbf39b4a0d957cb59c11ecb452968a252164c0 |
| 2.2.1_fig_2.svg | d33683660e9bf551d5f6263368a7bb1c71719df89946f7cff34b0604d54db700 | 872bbd68352e746cb6637aa4dc5c806475fd7430a5957ee4bf9f08d6b1b5afbc |

Correct contract: bind each existing legacy byte to actual baseline Git, bind
each selected accepted source byte separately, and declare four future output
replacements plus26 additions, zero deletions. All30 assets still derive exact
accepted paragraph sources. No old/new equivalence, pixel identity or visual
acceptance is claimed. The later gated assembly, not this candidate phase,
performs replacements as normal generated output with unchanged historical Git.

Retry must verify the existing baseline record equals a fresh readonly baseline,
not overwrite it. Own recorder will capture subsequent complete commands and
streams. Root's original failed source/plan remain in Git; no fake pass or
cleanup hides them. Inputs, independent review and production release are pending.
