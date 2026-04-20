# Plan — Third Quality-Review Follow-up

Response to `knowledge/micro-teaching-units-quality-third-review.md` (2026-04-20).

## TL;DR

The third review confirms the registry is now "close to a strong canonical backbone" and points at four concrete remaining issues plus one observation that's a matter of policy. All six findings have merit; I re-ran a read-only parse and the numbers check out:

- **Finding 1 — stats-block duplication (CRITICAL trust bug).** Two contradictory stats lines in the preamble: `143 live units ... D=29` on line 111 and `144 live units ... D=30` on line 113. The 144/D=30 line is orphaned from before the D23→D24 merge.
- **Finding 2 — understand-tagged units with higher-order verbs:** 14 mismatches (not 16 as reported, but the diff is tiny and the issue is real).
- **Finding 3 — aspect under-classification:** 7 apply/analyze units with calc/graph cues still `[verbaal]`-only.
- **Finding 4 — oversized procedures:** 7 units with 6-7 step procedures (H04, I05, I07, I08, I09, I11, I15).
- **Finding 5 — A-domain procedure gap:** 3/37 A-units have procedures. Policy-driven: generators are the executable recipe. Not a bug but worth revisiting now that non-A work is done.
- **Finding 6 — gloss-style terms:** 3 entries (`arbeidsaanbod (= beroepsbevolking)`, `monetair beleid (rentebeleid)`, `Pareto efficient`) with gloss text or non-canonical casing/accent.

Findings split into:

- **Must-fix trust bugs** — Finding 1. Ships immediately.
- **Metadata corrections** — Findings 2, 3, 6. Scripted passes with rules I can apply autonomously.
- **Judgment calls** — Finding 4 (unit-splitting vs. accepting that model-level analyze units need more steps) and Finding 5 (A-domain procedure policy revisit).

---

## Finding-by-finding evaluation

### Finding 1 — Stats duplication (High trust bug) — **merit: full**

Root cause: the regex in `unit-lib.renderPreamble` is `<!-- STATS LINE -->\n?(?:\*.*\*\n)?`. It expects the stats line immediately after the marker. Earlier edits introduced a blank line between marker and stats line, which broke alignment: the regex matched only `<!-- STATS LINE -->\n` (empty stats group), replaced with `<!-- STATS LINE -->\n*new*\n`, and the old stats line below the blank survived.

**Fix:** widen the regex to consume any trailing italic-stats lines and blank lines, not just one:

```js
return preamble.replace(
  /<!-- STATS LINE -->(?:[ \t]*\n|[ \t]*\*[^*\n]+\*[ \t]*\n)+/,
  `<!-- STATS LINE -->\n${statsLine}\n`
);
```

Then trigger one catalog save to flush the duplicate. Effort: 5 minutes.

### Finding 2 — Mastery-target vs. kern-verb mismatch (High) — **merit: full**

14 units tagged `understand` whose kern starts with `Analyseer` / `Beoordeel` / `Vergelijk` / `Redeneer` / `Beargumenteer`. Full list from the parse: D08, D10, D13, D14, E01, E03, E05, F14, H09, H13, H14, H22, H26, I13.

**Fix choice:** bump `mastery_target`, don't rewrite kerns. Rationale: the kerns accurately describe what the student does. The unit minted as `understand` because the audit pass was conservative about mastery levels, but the actual cognitive demand is higher. Bumping matches the reality; rewriting kerns would understate what the unit teaches.

Mapping by verb:
- `Analyseer` → `analyze` (applies to D08, D10, D13, E01, E03, E05, F14, H22, I13)
- `Beoordeel`, `Beargumenteer` → `evaluate` (D14, H09)
- `Redeneer`, `Vergelijk` → `analyze` (H13, H14, H26)

Effort: one script pass. After bumping, run `procedure-coverage.md` — these units now become apply+ and will surface as missing-procedure. That's correct: an `analyze`-level unit really should carry a step sequence. Writing those 14 procedures is a follow-up domain-by-domain task (not part of this commit; flagged for next pass).

### Finding 3 — Aspect under-classification (High) — **merit: full**

7 apply/analyze units tagged `[verbaal]` only despite having calc/graph cues in kern or procedure. Fix: augment aspects rule-based, same pattern as last pass, tightened so it catches the cases the previous rule missed.

Confirmed targets + additions:
- `A25 Minimumprijs analyseren` — procedure calculates vraagoverschot + welvaartsverlies → add `rekenen`, and it's a graph interpretation → add `grafisch`.
- `A26 Maximumprijs analyseren` — same pattern → add `rekenen`, `grafisch`.
- `D03 Consumentensurplus en accijns` — procedure has 5 surplus-calculation steps → add `rekenen`, `grafisch` (surplus areas on graphs).
- `D21 Prijsdiscriminatie over inkomensgroepen` — procedure calculates prices/quantities/surplus per group → add `rekenen`.
- `I05 Rentebesluit van centrale bank` — apply decision rule with inflation/outputgap quantification → add `rekenen`; optionally `grafisch` if the procedure involves reading the outputgap graph.
- `I11 Monetair beleid: starr vs flexibel` — 7-step procedure builds and compares IS-MB-GA diagrams → add `grafisch`.
- `I15 Outputgap bij schokken` — procedure shifts curves in the model → add `grafisch`.

Rules to extend in the augmentation script:
- Procedure text contains `bereken` / `formule` / `%` / `=` arithmetic → `rekenen`.
- Procedure text contains `verschuif` / `teken` / `curve` / `oppervlakte` / `driehoek` / `as` / `lijn (stijgt|daalt)` → `grafisch`.
- kern or procedure mentions `IS-MB-GA` / `Keynesiaans kruis` / `GA-curve` / `IS-curve` / `MB-curve` → `grafisch`.

Effort: 15 minutes. Augmentative (additive), not destructive.

### Finding 4 — Oversized procedures (Medium-High) — **merit: partial**

The review flags 7 procedures with 6-7 steps. Target is "3-7 minutes of instruction." Three-to-seven-step procedures sit at the upper edge of that; it's not automatically a violation.

Case-by-case:
- **H04 (6 steps)** — Belastingschijven berekening. Each step is short; total execution is 3-5 minutes for a worked example. Accept as-is.
- **I05 (6 steps)** — Rentebesluit. Contains both outputgap assessment AND rente decision. Arguably two units. **Split candidate:** carve "Outputgap beoordelen" out of I05. But I15 "Outputgap bij schokken" already exists and overlaps. Recommendation: trim I05 from 6 to 4 steps by outsourcing the outputgap-quantification step to I15 (via a cross-reference).
- **I07 (7 steps)** — IS-MB-GA model setup + equilibrium + shifts + inflation effects + central-bank response. This genuinely is a sub-lesson. **Split candidate:** extract "Centrale-bank response in IS-MB-GA" as a separate apply unit (inherits from I07 + I05). Or trim by delegating the central-bank step to I05.
- **I08 (7 steps)** — Keynesiaans kruis: diagram + equilibrium + shocks + multiplier + interpretation. Same shape as I07. Similar split option: extract a "Multiplier-effect kwantificeren" unit (already covered in I14 actually — so I08 can trim step 5 via cross-ref to I14).
- **I09 (6 steps)** — Koopkrachtbehoud. Sequence feels linear; accept.
- **I11 (7 steps)** — Compares two model worlds. Genuinely a comparison sub-lesson. Could split into "Monetair beleid bij starre arbeidsmarkt" + "Monetair beleid bij flexibele arbeidsmarkt" + a comparison unit. But the comparison IS the teaching move. Accept with 7 steps; scope-pressure note in ambiguity section.
- **I15 (6 steps)** — Outputgap at edge; accept.

**Recommendation:** trim I05, I07, I08 by cross-referencing existing units (I05 → I15 for outputgap; I07 → I05 for central-bank response; I08 → I14 for multiplier). Don't split I11 — the comparison is the point. Don't touch H04, I09, I15 — they're appropriately sized for their tasks.

Effort: 20 minutes. Judgment-heavy; delegate to subagent for the three trim rewrites.

### Finding 5 — A-domain procedure gap (Medium) — **merit: policy call, not a bug**

3/37 A-units with procedures is by design. The generator (`GEN_A*`) is the executable procedure — it generates parameterized exercises, which is stronger than a static step list because it can vary the numbers.

**Counter-argument (reviewer's point):** a learner or paragraph-author reading the catalog can't see the steps; they have to open `engines/skilltree/generators.js` and run it mentally. A written procedure would be documentation even if redundant.

**Recommendation:** write procedures for the A-domain apply units incrementally, **drawing from `engines/skilltree/explanations.js`** where rich step-by-step content already exists per skill. The plan's earlier rationale ("risk of drift from generator") stands only if procedures are authored independently; extracting from the canonical explanations file minimizes drift risk.

Scope: not all 34. Focus on A-units cited by other catalog entries as `needs` (these are the math skills that downstream macro/market units lean on most). From the parse, high-citation A-units: A02, A06, A15, A16, A17, A23, A27, A30, A32, A36 — roughly 10 units where a written procedure genuinely helps downstream authors.

**Effort:** 60-90 minutes. Defer to a separate commit — not mechanical, shouldn't bundle with the other fixes.

### Finding 6 — Gloss-style terms (Medium) — **merit: full**

Three entries to fix:
- `arbeidsaanbod (= beroepsbevolking)` — parenthetical gloss. Canonical term is `arbeidsaanbod`; `beroepsbevolking` is a distinct canonical entry. Replace with `arbeidsaanbod` (appearances: H23, I16).
- `monetair beleid (rentebeleid)` — gloss. Canonical is `monetair beleid` OR `rentebeleid`; gloss form isn't canonical. Replace with `monetair beleid` (appearances: I05, I17, I12, I19).
- `Pareto efficient` — canonical form in `economie-terminologie.md` is `Pareto efficiënt` (with ë). Two appearances: D19, D20. Replace.

**Fix:** scripted find-replace across `terms` arrays; terminology-drift report will re-validate.

Effort: 10 minutes.

---

## Recommended execution order

All four mechanical fixes in one commit; A-procedures as a separate follow-up.

1. **Hygiene commit** (~45 min total, single commit):
   - Fix the stats regex (Finding 1). Trigger a save to clean the orphaned line.
   - Mastery-target bumps for 14 units (Finding 2).
   - Aspects augmentation (Finding 3).
   - Trim I05, I07, I08 procedures (Finding 4 partial).
   - Normalize 3 gloss terms (Finding 6).
   - Re-run all reports; expect drift still 0, procedure-coverage to show a few new "missing procedure" on the bumped analyze/evaluate units (correct — next pass handles).

2. **Follow-up: procedures for bumped units** (separate, ~30 min). The 14 units bumped from `understand` to `analyze`/`evaluate` will surface in `procedure-coverage.md` after Step 1. Write procedures for those using the subagent pattern from the domain sprints.

3. **Follow-up: A-domain procedures for the high-citation slice** (separate, ~60 min). Extract procedures from `engines/skilltree/explanations.js` for roughly 10 high-citation A-units.

Step 1 is fully scriptable and ready to execute. Steps 2-3 are follow-ups that should each be explicitly triggered; they're smaller-scope than the domain sprints were.

---

## What the review gets right that's easy to miss

- The stats duplication really is a trust bug, not a cosmetic issue. Anyone reading the file to understand "is this current?" sees two numbers and can't tell which is real. Fix first.
- Finding 5 is framed as a new problem, but it's actually a policy call the previous plan made explicit. Now that non-A work is done, revisiting the policy is legitimate — A-procedures ARE useful to paragraph-authors who don't want to mentally execute generators.
- The mastery-target mismatch (Finding 2) has a downstream effect: when those units get bumped to `analyze`, they'll inherit the "procedure recommended" warning. That's actually a useful forcing function — the next procedure-writing sprint becomes the concrete next step.

## What I'd push back on

- Finding 4's oversize concern is partially overstated. 7 steps for a model-comparison unit like I11 isn't bloat — it's inherent complexity. "3-7 minutes" is a rough target, not a hard cap, and I11's comparison move genuinely needs both worlds set up before contrasting. Don't force a split just to hit a step count.
- I05 and I07 do have room for trimming via cross-reference (that's Finding 4's real signal), but H04 at 6 steps is appropriately sized for a belastingschijven worked example and shouldn't be touched.
