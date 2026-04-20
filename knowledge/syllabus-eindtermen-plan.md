# Plan — `syllabus-eindtermen.json` Quality Pass

Response to `knowledge/syllabus-eindtermen-quality-review.md` (2026-04-20).

## TL;DR

All four findings have merit. I re-ran a read-only parse on `references/external/syllabus-eindtermen.json` and the numbers check out exactly:

- **F2.4** swallows 481 chars including the next-domain header "Domein G Risico en Informatie...".
- **I2.3** swallows 3371 chars including the full `I.3 Monetair beleid` section.
- **I4.6** swallows 8674 chars including I3 content, I4 exam text, BIJLAGE 1, BIJLAGE 2.
- **I3.\* entries: 0** in the JSON (swallowed into I2.3 / I4.6).
- **Verbs flattened**: 3 unique tokens across 117 entries (`toepassen` 114 ×, `herkennen` 114 ×, `analyseren` 3 ×); bloom: `apply` 114, `analyze` 3.
- **A-domain**: zero entries in the register; catalog documentation elsewhere treats `A4.1` as a valid exam_code.

All four issues trace to `build-scripts/references/extract-eindtermen.js`. Findings 1 and 2 share a root cause (subdomain-header recognition + continuation-termination). Finding 3 is a separate extractor design choice. Finding 4 is a scope-contract gap — either fix the extractor to cover A, or document the omission.

---

## Finding-by-finding evaluation

### Finding 1 — Extraction boundary errors (Critical) — **merit: full**

Root cause: `parseSubdomainHeader` (line 86 of the extractor) matches `^[A-K]\d+:?\s+...` — e.g. `I3:` or `I3 Title`. But the syllabus PDF uses `I.3 Monetair beleid en de centrale bank` (dot-separated, not concatenated) as the I3 subdomain header. The parser fails to recognize it, so I2.3 keeps accumulating continuation lines until the next recognized subdomain, eating the entire I3 content and then the I4 header and content.

Secondary leak: there's no stop-token for bijlagen, exam regulations, or inter-domain intro text. Once I4.6 starts accumulating, nothing ends it until EOF.

Tertiary leak: F2.4 absorbs "Domein G Risico en Informatie..." because the CvTE PDF omits the numbered `3.X DOMEIN G` spec-header before G (the extractor already has a workaround for this at line 162, triggering on subdomain-letter mismatch — but that only fires when a valid subdomain header is detected; the "Domein G Risico en Informatie..." intro paragraph slips through as continuation text because it doesn't match the header format).

**Fix (three small extractor changes):**

1. Extend `parseSubdomainHeader` to accept both `I3:` and `I.3 ` forms. Pattern: `^([A-K])\.?(\d+):?\s+(.+)$`. Currently it's `^([A-K])(\d+):?\s+(.+)$` — adding optional `\.` solves the I.3 case.
2. Add explicit stop tokens recognized as end-of-specification: `^4 HET CENTRAAL EXAMEN`, `^BIJLAGE \d+`, `^LITERATUUR`, `^\s*De examenstof\b`. When any of these is seen, flush current eindterm and set `inSpecSection = false`.
3. Recognize domain-intro paragraphs (`^Domein [A-K] `) as a hard flush signal even without a matching subdomain header — same `inSpecSection` toggle as (2), since these paragraphs are inter-section connective prose, not eindterm content.

Expected outcome after re-extraction:
- F2.4 text ends at "externe effecten." (length ~250 chars instead of 481).
- I2.3 text ends at "uitverdieneffecten." (length ~160 chars instead of 3371).
- I3.\* block appears with 3–5 entries.
- I4.6 ends cleanly before "4 HET CENTRAAL EXAMEN" (length ~3000 chars instead of 8674).

**Effort:** ~30 minutes plus a spot-check of 5–10 entries after re-extraction. Mechanical and localized; no behavior change in the downstream validator (already canonical-lookup-by-code).

### Finding 2 — `I3.*` block missing (High) — **merit: full, but downstream of Finding 1**

Confirmed by parse: zero `I3.*` entries. This is a consequence of Finding 1's root cause — the I.3 subdomain header isn't recognized, so the I3.1–I3.N eindtermen slide into I2.3's continuation buffer.

Fixing Finding 1 should automatically surface the I3 block. Verification plan: after re-extraction, check:
- I3.1 (ECB monetair beleid) present
- I3.2 (M1, M3 geldhoeveelheid) present
- I3.3 (monetair-transmissie kanalen) present
- Approximate count matches what the PDF actually contains (3–6 entries, peek at the PDF to confirm).

If the I3 block still doesn't appear cleanly, the fallback is to inspect the PDF text dump around the I3 section and add a targeted pattern. But the Finding-1 fix should do it.

### Finding 3 — Flattened verbs / bloom (Medium) — **merit: full**

Confirmed: only `toepassen` / `herkennen` / `analyseren` surface. Root cause: `verbsFromIntro` (line 90) scans only the subdomain-level intro line ("De kandidaat kan X en Y") for known verbs. Almost every subdomain intro uses the same two verbs, so the per-eindterm verb list is uniform.

The CvTE syllabus encodes genuine cognitive variation two ways:
1. **Per-eindterm action verbs in the tekst body** — e.g. "Bereken ...", "Analyseer ...", "Onderscheid ...", "Interpreteer ...". These are the real cognitive demands.
2. **Notation markers (1) / (2)** — `(1) alleen grafisch onderbouwen`, `(2) alleen rekenkundig onderbouwen`, no marker = both. This parallels the `aspects` field in the micro-teaching-units catalog (`grafisch` / `rekenen` / `verbaal`).

**Fix:** two-tier enrichment.

- **Tier A (mechanical):** scan each entry's `tekst` body for action verbs from the existing `VERB_TO_BLOOM` table (`berekenen`, `analyseren`, `onderscheiden`, `afleiden`, `uitleggen`, `beschrijven`, `beoordelen`, etc.). Merge into `verbs`, re-derive `implied_bloom` from the highest-level verb found.
- **Tier B (aspect-capture):** detect `(1)` / `(2)` / unmarked in the original PDF text and add an `aspects` field to each eindterm (`["grafisch"]` / `["rekenen"]` / `["grafisch", "rekenen"]`). This makes the register directly comparable to the catalog's `aspects` field. Note: the markers live in the source PDF, not in the current `tekst` field — requires keeping the parenthetical markers during extraction rather than stripping them.

Tier A is cheap (regex scan over existing text) and ships in the same commit as Finding 1/2. Tier B requires extractor changes to preserve markers; worth a follow-up.

**Effort:** Tier A ~20 minutes; Tier B ~30 minutes.

### Finding 4 — A-domain scope ambiguity (Medium) — **merit: full, needs policy call**

Confirmed: no `A*` entries. The CvTE syllabus does define domain A "Vaardigheden" (A1 Economische concepten toepassen, A2 Rekenkundig, A3 Grafisch, A4 Verbaal, A5 Argumenteren en schrijven), but:

- A-domain is structured differently in the PDF — bullet-pointed skills under each subdomain rather than numbered eindtermen `A1.1`, `A1.2`, ....
- The catalog's micro-teaching-units.md schema mentions `A4.1` as an example exam_code, implying the register SHOULD contain A-domain entries. But the register doesn't.

Two defensible positions:

**Position 1 — Register covers only CE content domains (D–I).** Document the omission explicitly in the extractor docstring and the syllabus-eindtermen.md frontmatter. A-domain skills are the "how" (math, graph, reasoning) that cross-cut content; they're already captured by the catalog's `aspects` field. Update the catalog schema example to not use `A4.1` as a sample exam_code.

**Position 2 — Extend register to include A-domain.** Write a second-path parser in `extract-eindtermen.js` that handles A-domain's bullet structure. Mint pseudo-codes (e.g. `A1.1`, `A1.2`, ...) from the bullet position. This adds ~20–30 entries to the register.

Recommendation: **Position 1** for now. Rationale:
- The catalog's `aspects` field already routes students to math vs. verbal vs. graph training; A-domain as exam_codes adds nothing the aspects field doesn't.
- CvTE itself treats A-domain as the vaardigheden substrate that every content eindterm exercises; there's no test question code-prefixed `A`.
- Position 2 pushes complexity into the extractor for marginal gain.

**Fix under Position 1:**
1. Update `extract-eindtermen.js:39` `DOMAIN_NAMES` comment to clarify A is deliberately excluded.
2. Update `build-scripts/references/README.md` to document scope = CE content domains D–I.
3. Update the catalog schema example in `references/machine/micro-teaching-units.md` to use `D3.2` instead of `A4.1` as a sample exam_code (already does — checked; only `knowledge/micro-teaching-units-plan.md` still shows `A4.1` as example).
4. Update `knowledge/micro-teaching-units-plan.md` to reflect the scope policy.

**Effort:** 15 minutes documentation-only.

---

## Recommended execution order

One commit, three changes to the extractor, one re-run, one docs pass.

1. **Extractor fixes** (Findings 1 + 2, ~30 min):
   - Extend `parseSubdomainHeader` to accept `I.3 ` form.
   - Add stop tokens for bijlagen / exam regulations / `Domein X` intros.
   - Flush current eindterm on any of these.

2. **Verb-body enrichment** (Finding 3 Tier A, ~20 min):
   - Add a `verbsFromTekstBody(tekst)` scan that merges found verbs into each entry's `verbs` list.
   - Re-derive `implied_bloom` from the merged verb set.

3. **Re-extract + spot-check** (~10 min):
   - Run `extract-eindtermen.js`.
   - Verify F2.4, I2.3 end at correct syllabus boundaries.
   - Verify I3.1–I3.N appear.
   - Verify I4.6 ends before BIJLAGE.
   - Check verb diversity — expect 6–8 unique verbs now.

4. **Scope documentation** (Finding 4, ~15 min):
   - Add a scope statement to `syllabus-eindtermen.md` frontmatter: "Covers CvTE central-exam content domains D–I. Domain A (Vaardigheden) is intentionally out of scope — vaardigheden are captured as `aspects` on the teaching units directly."
   - Correct the `A4.1` example in `knowledge/micro-teaching-units-plan.md`.

5. **Commit + verify downstream**:
   - Rebuild the unit-index JSON to confirm no `exam_codes` validation regressions (the re-extraction may drop or rename a code; unit-index will flag unresolved codes).
   - If any unit cites a code that the new register no longer contains, investigate per case (most likely a typo in the unit, not a regression in the register).

**Deferred** (Finding 3 Tier B): aspect-capture from notation markers `(1)` / `(2)`. Worth a follow-up commit after the extractor boundary work stabilizes.

---

## What the review gets right that's easy to miss

- Findings 1 and 2 *look* like two separate bugs but share one root cause. The fix is a single extractor patch; Finding 2 resolves automatically.
- Finding 3 isn't a data problem — it's an extractor-design choice (verb source = intro line only). Fixing it means adding a second verb source (body scan), not re-authoring the data.
- Finding 4's strongest argument is that the catalog schema example claims `A4.1` is a valid exam_code. That's a documentation claim the register doesn't back up. Either the register needs to cover A, or the schema example needs to stop pretending it does.

## What I'd push back on slightly

- The review frames Tier-A verb enrichment as "probably good enough for coarse validation, but not for strong claims about cognitive level." That understates the Tier-A gain: even a basic body scan would turn the uniform `toepassen/herkennen` into 6–10 distinguishable verb combinations, which is enough to tier exam coverage reports by cognitive level. Don't wait on Tier B to start getting value from Tier A.
- Finding 4 has a cleaner resolution than the review implies: the catalog's `aspects` field already serves the "vaardigheden routing" role that A-domain eindtermen would nominally fill. Absence is arguably correct; the fix is documenting that explicitly, not extending the extractor.
