# Independent CLI projection follow-up

Reviewer: `review_book2`; 2026-09-21. Read-only verification after application of the eight previously reviewed unit/term patches.

No blocking finding. Retaining the CLI-derived refresh is appropriate; hand-restoring stale machine output would make it disagree with the actual catalog.

I compared all 257 current unit records to platform baseline `37cc57bda5096b6b8cb455fe9cd27b20acacd3fe` plus exactly the four reviewed patches: complete equality. The current unit Markdown also exactly equals the owning renderer applied to the baseline Markdown plus those patches, including blank-line normalization and the stats-date refresh. There are still 254 live units.

For all 227 terms, I applied only the four reviewed authored-field patches in memory, then regenerated teaching_units using the **unchanged baseline unit catalog**, not merely the new one. After allowing the generated_at timestamp, the resulting complete term registry exactly equals the current CLI output. This independently proves the ten changed term reverse-link arrays reflect pre-existing unit/term relationships. No term identity, synonym, authored dependency or additional authored field changed. The removed D07→evenwichtsprijs reverse link and all added links are exactly the current derivation, not manual scope changes.

The ten refreshed terms are collectieve-aanbodlijn, collectieve-vraaglijn, evenwichtshoeveelheid, evenwichtsprijs, heffingen, marginale-kosten, prijselasticiteit-van-de-vraag, subsidies, variabele-kosten and winst. Term Markdown and coverage report exactly match their owning renderers; the one fewer missing pitfall is the reviewed addition to prijselasticiteit-en-to. Outline metadata and its hold records remain byte-identical to baseline.

Evidence: `independent-applied-reference-projection-check.json`, with complete before/after reverse-link arrays and hashes of all five generated files; read-only probe `check-applied-reference-projections.js`. This confirms the applied reference delta only; it does not certify the remaining lifecycle transition, artifacts or integration.
