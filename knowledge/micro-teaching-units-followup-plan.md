# Plan — Micro-teaching Units Follow-up Quality Pass

Response to `knowledge/micro-teaching-units-quality-followup-review.md` (2026-04-20).

## TL;DR

The review lands cleanly on the gap I already expected to see: the first pass fixed the *document-level* hygiene (stale intro, inconsistent spec, placeholder procedures, voice drift) but left the *didactic core* — procedures, sequencing, naming abstraction, terms — for the exercise-first backlog. The reviewer is right to call that out; some of it is genuinely mechanical and should be done now, the rest is curriculum work that cannot be scripted.

I re-ran a read-only parse and the reviewer's numbers check out:
- 60 apply+ units without a procedure (3 with) — matches `reports/procedure-coverage.md`
- 115/144 units with empty `needs` — matches `reports/needs-coverage.md`
- 144/144 with empty `terms` — matches `reports/terms-coverage.md`
- **7 conjugation-tail bugs** of the "Bereken en interpreteert" form (I introduced these in the voice-normalization pass — regex only rewrote the first verb)
- 53 non-imperative kerns (propositional / declarative)
- 5 units with graph markers in name/kern but no `grafisch` aspect; 5 with explicit calculation verbs but no `rekenen` aspect

Findings split into three classes:

- **Mechanical** (Findings 4 conjugation half, 5) — script fixes, can land immediately.
- **Semi-mechanical** (Findings 3, 4 propositional half) — needs a subagent-assisted rewrite pass with light human review; one domain at a time.
- **Pedagogical** (Findings 1, 2, 6) — genuine curriculum work; cannot be scripted; should be scheduled, not deferred indefinitely.

The previous plan treated pedagogical work as "driven by paragraph builds, not bulk backfill." That principle still stands, but the reviewer's critique makes clear that *under-specified didactic core* is the registry's single biggest remaining problem. Pushing it all to "next time we build a paragraph" is a way to never do it. The plan below sets a lower bar: do it *per domain*, not per paragraph, and make the apply-level procedure writing explicit scheduled work rather than an ambient expectation.

---

## Finding-by-finding evaluation

### Finding 1 — missing procedures on 60/63 apply+ units (High) — **merit: yes, full**

Raw numbers match the report exactly. The reviewer is right that a registry claiming to be the canonical source for voorkennis / vaardigheden / answer-model step sequences cannot simultaneously carry no step sequences for 95% of its apply+ units. The cosmetic half of this was already fixed (placeholders stripped, validator relaxed to warn, coverage report created); the content half needs real pedagogical work.

**Fix strategy:** schedule per-domain procedure-writing sprints.

- Batch 1: D-domain apply+ units without procedures (10 units). D is the densest content domain and the nearest to current paragraph builds, so payoff per unit is highest.
- Batch 2: H-domain (9 units). Macro is the next highest-value cluster.
- Batch 3: remaining non-A (I, F, G — 7 units combined).
- Batch 4 (optional, low priority): A-domain (34 units). These have `GEN_*` as executable recipe; written procedures are lower-value here but would still help voorkennis authors.

Each batch = one subagent-assisted session with the user reviewing. Procedures are written as imperative step lists, 3–7 steps, citing unit dependencies where relevant. Use existing A-domain procedures (`A02`, `A06`, `A29`) as the style template.

**Effort:** ~30 minutes per unit with assistance; batches of 5–10 units per session. Realistic: 3–4 focused sessions clear the non-A backlog. Not scriptable.

### Finding 2 — 115/144 units have no prerequisite edges (High) — **merit: yes, full**

The reviewer's spotted clusters are accurate targets:
- **D18 / D21 / D23 / D24** (prijsdiscriminatie): D18 "Monopolie met prijsdiscriminatie" is the concept unit; D24 "Drie voorwaarden prijsdiscriminatie" refines it; D21 "Prijsdifferentiatie en welvaartsanalyse" is downstream (welvaart requires the concept); D23 is a specific-case application. Sequence is obvious in hindsight.
- **F05–F11** (externe effecten): concept → intervention → application ordering is a real didactic progression.
- **H13 / H14** (minimumloon): H13 "Minimumloon en werkgelegenheid" and H14 "Minimumloon en werkloosheid" are two sides of the same mechanism; they should either share a parent or one should depend on the other.
- **I12 / I19** (monetair beleid via wisselkoers): refinement relationship.

**Fix strategy:** schedule per-domain sequencing sprints, same cadence as Finding 1. For each topical cluster, identify the foundational concept unit(s) and wire the refinements / applications via `unit-add-dep`. Once one domain is wired, the `dag-integrity.md` and `needs-coverage.md` reports make the shape immediately visible.

Suggested order: D first (most affected by downstream paragraph builds), then H, F, G, I, E. This order roughly matches curriculum priority and exam-frequency.

**Effort:** ~20 minutes per cluster with assistance. D-domain has ~5 clusters worth sequencing, so ~100 minutes for D; similar for H. Not scriptable — requires domain judgment.

### Finding 3 — exam-context propositions instead of transferable units (High) — **merit: yes, full**

The reviewer's examples are well-chosen. `D06 Gasverbruik en prijselasticiteit`, `G03 Broodfonds: informatie en risicovermindering`, `H01 AOW-betaalbaarheid en vergrijzing`, `H26 Woonlastafweging koop vs huur`, `I04 CAO-looptijd en arbeidsmarktrigiditeit` are all named after their source exam context rather than the underlying teaching move. The `kern` in each case also preserves the context instead of abstracting the skill.

This is the deepest structural issue the review raises. It is also the one the exercise-first principle actively pushes against if applied too literally: if "units exist because an exercise requires a skill," then naming a unit after the exercise it was minted from is the path of least resistance. The plan's original language around "units exist to serve exercises" should not have meant "unit names should look like their source exam scenario."

**Fix strategy:** a one-pass name/kern rewrite, by domain, with subagent assistance. Rule: after rewrite, the unit name and kern should describe a skill a student could apply to *any* exam question, not just the one that minted it.

- `D06 Gasverbruik en prijselasticiteit` → `D06 Prijselasticiteit toepassen op inelastische vraag` (kern: imperative, names the move).
- `G03 Broodfonds: informatie en risicovermindering` → `G03 Informatieasymmetrie reduceren via groepsrisicodeling`.
- `H01 AOW-betaalbaarheid en vergrijzing` → `H01 Demografische druk op omslagstelsel analyseren`.
- `H26 Woonlastafweging koop vs huur` → `H26 Vermogensopbouw vs cashflow vergelijken (woonbeslissing)`.
- `I04 CAO-looptijd en arbeidsmarktrigiditeit` → `I04 Institutionele loonrigiditeit herkennen`.

Not every non-A unit needs this — some are already abstract enough. Estimate: ~40 of the 107 non-A units need rework. A subagent can propose new names+kerns per domain, user reviews in batches of 10.

Renames are cheap (ID stays permanent, only display changes). `unit-rename` handles display-name updates; `unit-update` changes `kern`.

**Effort:** ~15 minutes per unit. ~10 hours of total effort with subagent assistance, spread across 4 domain-sized sessions.

### Finding 4 — voice/style inconsistency (Medium-High) — **merit: split**

Two distinct issues inside this finding:

**4a — Conjugation tail bugs (7 units): my fault, mechanical fix.**

My voice-normalization regex only caught the first verb. "Student berekent X en interpreteert Y" became "Bereken X en interpreteert Y" — the second verb stayed in 3rd-person-singular conjugation. The fix is trivial: a second pass that rewrites the tail verb to imperative when the sentence already starts imperative. Specific cases to fix:
- `D11`: "Bereken en interpreteert" → "Bereken en interpreteer"
- `D12`: "Bepaal ... en analyseert" → "... en analyseer"
- `D22`: "Herken ... en analyseert" → "... en analyseer"
- `G07`: "Bereken en interpreteert" → "... en interpreteer"
- `H03`: "Bereken ... en analyseert" → "... en analyseer"
- `H18`: "Bereken ... en analyseert" → "... en analyseer"
- `H24`: "Bereken ... en legt uit" → "... en leg uit"

Fixable in one script pass. Effort: 10 minutes.

**4b — 53 non-imperative kerns (declarative / propositional): partial merit.**

The reviewer frames these as style drift. Some of them genuinely are — "Constante kosten beinvloeden break-even analyse..." describes a fact instead of a student action. But others are legitimate for `remember` / `understand`-level units where the mastery goal is to *know that X holds*, not to *do something*. The schema's "kern is a mastery statement, imperative" was actually over-stated in my Finding-2 rewrite; for remember/understand units, a declarative kern may be the right shape ("de speler begrijpt dat ...", or just "X veroorzaakt Y, omdat ...").

Fix: don't bulk-rewrite. Instead:
- For apply+ units with declarative kerns, rewrite to imperative (these are the ones the reviewer's point actually applies to — `D11`, etc., which are already fixed in 4a).
- For remember/understand units, tighten the schema to allow declarative "mastery statement" framing explicitly, and audit for any that are ambiguously framed.
- Accept that kern will not be 100% imperative; the hard rule is "for apply+, imperative."

Effort: ~15 minutes schema-doc tweak + one targeted pass over the remaining apply+ declaratives (if any survive the 4a fix).

### Finding 5 — aspect misclassifications (Medium) — **merit: yes, partial on cause**

The reviewer identifies units where the auto-inferred aspects are narrower than the skill actually requires. The cause is my backfill script: 122 units were inferred from the `question_type` of the exam questions that cited them, and for many of those questions, the CvTE question-type field undersells the cognitive load (an `uitleg_dat` question may still require a calculation to arrive at the claim being explained). Pure exam-type inference is therefore a *floor*, not a *ceiling*.

Specific confirmed issues (verified by read-only parse):
- Graph markers in name/kern, missing `grafisch`: `A31`, `D01`, `H15`, `I07`, `I10` (5 units)
- Explicit calculation verb in kern, missing `rekenen`: `A19`, `A25`, `A26`, `A27`, `D11` (5 units)

Plus the reviewer-flagged `I05`, `I11` (apply/analyze decision-rule / model units with verbaal-only tagging — debatable; their kerns don't literally say Bereken but modelling IS-MB-GA is arguably grafisch+verbaal).

**Fix strategy:** augment the backfill so name/kern markers are *additive* on top of the exam-inference floor. Rules:
- Name or kern contains `grafiek` / `curve` / `uit grafiek` / `oppervlakte` / `driehoek in ... grafiek` → add `grafisch`.
- Kern starts with `Bereken` / `Los op` / `Pas toe` → add `rekenen`.
- Kern starts with `Leg uit` / `Beschrijf` / `Noem` / `Herken` / `Classificeer` → add `verbaal`.
- `mastery_target: analyze` with a model in the name (IS-MB-GA, vraag/aanbod) → add `grafisch` unless the kern explicitly rules it out.

Run the augmentation pass once; spot-check results. Effort: ~45 minutes for the script + review.

**What this does not fix:** `I05 Centrale bank rentebeleid` and similar decision-rule units where the reviewer's verbaal-only-is-too-narrow critique requires human judgment. These should get manual review during the next domain-sequencing sprint (Finding 2 work).

### Finding 6 — no `terms` links anywhere (Medium) — **merit: yes, full**

144/144 with empty terms is exactly what the previous plan scheduled as "wired as paragraph plans cite units." The reviewer is correct that the current state is zero, and if term-linking only happens when a paragraph happens to build, the backlog never clears.

**Fix strategy:** two-step, neither of them "do nothing until next paragraph."

Step 1 — automated suggestion pass. Scan each unit's `kern` + `name` against the canonical term list in `economie-terminologie.md`. Any canonical term that appears literally in the unit text gets proposed as a `terms` entry via a batch `unit-update` script, reviewed en masse before commit. This is close to free once the scanner runs and should cover 50–80% of units. Effort: ~1 hour for scanner + review.

Step 2 — residual hand-wiring during domain-sequencing sprints (Finding 2). When sequencing a domain, also fill in the terms that the scanner missed. Pairs naturally with the procedure-writing + sequencing work.

---

## Recommended execution order

Grouped so each step leaves the registry measurably more didactically useful than the previous one.

1. **Mechanical fixes, one commit.** (~1 hour)
   - Fix the 7 conjugation-tail bugs (4a).
   - Run the aspects augmentation pass for the known graph / calculation markers (Finding 5 rule-based fixes).
   - Run the automated terms-suggestion scan and land the confidently-matched ones (Finding 6, step 1).
   - Schema note about declarative kern being acceptable for remember/understand (4b, doc-only).

2. **Pilot one domain end-to-end, one commit.** (~2 hours)
   - Pick D — highest curriculum impact. Use subagent assistance. Tasks for D:
     - Write canonical procedures for D-domain apply+ units (~10 units, Finding 1).
     - Sequence D-domain topical clusters (price discrimination, elasticity, welfare) via `unit-add-dep` (Finding 2).
     - Rewrite the exam-context-named D units to abstracted names + kerns (Finding 3, ~8 units).
     - Hand-wire residual D-domain terms (Finding 6, step 2).
   - Tests + reports stay green.
   - Proves the per-domain cadence works and produces a template for subsequent domains.

3. **Roll out to remaining domains, one commit per domain.** (~2 hours each)
   - H (macro) → F (samenwerken) → G (risico) → I (conjunctuur) → E (ruilen over tijd).
   - Same four tasks per domain (procedures, sequencing, naming abstraction, residual terms).
   - B / C / J / K stay empty until exercises drive them (exercise-first principle holds).

4. **Post-rollout consolidation, one commit.** (~30 minutes)
   - Re-run all reports; expect `procedure-coverage.md` to drop non-A missing procedures from 26 to near 0, `needs-coverage.md` to drop from 115 toward <40, `terms-coverage.md` to drop from 144 toward <30, `aspects-coverage.md` graph/rekenen counts to climb.
   - Update `knowledge/micro-teaching-units-plan.md` §9 with the per-domain cadence as the new norm (replacing the "wait for paragraph build" language).

Step 1 is safe to execute immediately and lands before any larger work. Steps 2–4 are scheduled work that should be proposed per domain rather than launched autonomously; each per-domain sprint is a scope the user approves separately.

---

## What the review misses or understates

- **Declarative kerns for remember/understand units are fine.** The review flags 50 non-imperative kerns as style drift, but not all of them are wrong. A unit whose mastery target is to *know that a fact holds* naturally has a declarative kern. The schema should explicitly allow this rather than pretending every kern is imperative.
- **Aspect classification's real floor is the exam-type field.** The review frames aspect misclassifications as mistakes; they are actually the known limitation of inferring from CvTE question-type tags. The fix is to treat exam-inference as a minimum and layer rule-based augmentation on top, not to redo aspects from scratch.
- **A-domain has its own procedure gap.** 34 of 37 A-units have no written procedure because the generator *is* their executable procedure. The review mentions `A02`/`A03`/`A06` as exemplars but doesn't address whether the other A-units should get written procedures too. My answer: low priority — the generator serves voorkennis/vaardigheden authors via test runs, and written procedures for math skills risk drifting from the generator output. Keep A-procedures optional.

## What the review gets right that's worth emphasizing

- **The didactic gap *is* the most important remaining issue.** Document-level coherence (which my first pass addressed) is table stakes for a canonical registry; actual usefulness for lesson design depends on procedures, sequencing, naming, and terms — all of which are still thin.
- **"Paragraph-driven backfill" as the only discipline is too slack.** It was right for the first pass because building validation and mutation infra has to come before curriculum work. Now that the infra is solid, scheduling explicit per-domain didactic sprints is the correct next cadence.
- **Pilot the pattern on one domain first.** This is the review's implicit ask — showing the per-domain outcome for D before scaling.

---

## Open items

- **Whether to ship the automated terms suggestion pass (Finding 6, step 1) in the mechanical commit or defer until D-domain sprint.** My current read: ship it in the mechanical commit. Even imperfect term links are better than zero, and the review already has enough material to land an improvement.
- **Subagent briefing template for the per-domain sprints.** Needs writing before Step 2. Should prescribe: imperative procedures, 3–7 steps, citing dependency unit IDs, using canonical Dutch terms.
- **Whether `aspects` misclassification for judgment calls (I05, I07, I11) should be fixed during the rule-based augmentation or manually per-domain.** Default to manual per-domain — automation for judgment cases produces false confidence.
