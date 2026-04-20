# Plan — Micro-teaching Units Document Quality

Response to `knowledge/micro-teaching-units-document-quality-review.md` (2026-04-20).

## TL;DR

All five findings in the review have merit. I re-ran a read-only parse on `references/machine/micro-teaching-units.md` and the numbers match (145 total units; 38 with `layer`, 60 of 63 `procedure` blocks are one-line restatements of `kern`; `prijsdifferentiatie` appears once versus `prijsdiscriminatie` 8 times, and `economie-terminologie.md:400` explicitly deprecates "prijsdifferentiatie").

Findings split cleanly into two classes:

- **Drift/hygiene** (Findings 1, 2, 5, and the placeholder half of 4) — the document overclaims or contradicts itself; fixable mechanically with small scripted passes and does not require pedagogical work.
- **Coverage** (Finding 3 and the canonical-procedure half of 4) — the registry really is thinner than the intro implies. Fixing this is genuine curriculum work, not a rewrite. Treat it as an ongoing workstream, not a one-shot repair.

The hygiene class is worth doing immediately — it's cheap, removes false signals of completeness, and stops the registry from damaging the reader's trust. The coverage class is worth making *visible* now (honest intro, explicit backlog) and *filled in* incrementally as paragraph plans and exercises drive demand — which is exactly what the exercise-first principle already says.

---

## Finding-by-finding evaluation

### Finding 1 — stale intro text (Critical) — **merit: yes, full**

Line 108 still says "The registry is currently empty. The math migration ... will populate `A01`-`A37`" — patently false; the file contains 145 populated units. A canonical reference that lies about its own state is actively harmful to reader trust.

**Fix:** trivial. One-line delete + replacement sentence stating the current scope (e.g. "145 units across domains A, D, E, F, G, H, I as of <date>; B/C/J/K awaiting exercise-first minting").

**Effort:** 5 minutes. Should be done via the CLI — the header block is managed by `build-unit-index.js`. Add a tiny pass that regenerates the `## Units` intro from the current catalog stats on every save.

### Finding 2 — spec drift from actual shape (High) — **merit: yes, with a correction**

The review is right that the schema template shows `layer` and `duration_min` on every unit but only 38/145 carry them. It is also right that the spec's line "`layer` is derived: `max(needs.layer) + 1`. Not human-set." contradicts the template, which writes `layer` on every entry.

**Correction to the review:** `layer` is not purely derived in the current validator. Per the earlier session work, the validator was relaxed to require `layer >= max(needs.layer) + 1` so curated A-domain layer values from the legacy skilltree survive. The spec claim "Not human-set" is therefore wrong twice — it's stored for A-units and it's only a *lower-bound* constraint. That line needs correcting regardless of anything else.

**Fix:** rewrite the schema section so it matches reality:
- `layer` — stored, required for A-domain units (seeded from the legacy skilltree), optional elsewhere; validator enforces `layer >= max(needs.layer) + 1`.
- `duration_min` — optional; present on A-domain units (seeded) and on units where pedagogical timing has been deliberately set.
- `generator` — A-domain only.
- `exam_codes` — optional; empty list allowed for pure-prerequisite units.
- `terms` — optional; lookup against `economie-terminologie.md`.
- `procedure` — expected for `mastery_target >= apply`; see Finding 4 for the tightening.

**Effort:** 15 minutes to rewrite the spec section in the markdown + validator doc-string. No code change needed; this is documentation catching up to code.

### Finding 3 — low cross-link density (High) — **merit: partial, but intro overclaims**

The raw numbers (115/145 `needs: []`, 145/145 `terms: []`) are accurate. But this is not *drift* — this is the state the plan always expected: `needs` and `terms` get populated as paragraphs and exercises cite units, not during the initial exam audit. The audit's job was to mint units; wiring them together is a later workstream.

Where the review lands a real punch is the intro (line 13) which claims each unit has "prerequisite links forming a DAG ... links to canonical terminology". That describes the *intended* shape, not the *current* shape. Readers encountering that sentence and then browsing non-A units will feel misled.

**Fix:** two parts.
1. **Honesty pass on the intro** (cheap). Reword line 13 from a descriptive claim ("each unit has X") to an architectural claim ("each unit *can carry* X; current coverage is printed by the `needs-coverage` and `terms-coverage` reports"). Add those two reports to the build.
2. **Coverage backfill** (ongoing). Create `reports/needs-coverage.md` and `reports/terms-coverage.md` that list units with empty `needs` / `terms`. These become the backlog for future paragraph-plan work. Do not bulk-backfill by hand — wire `needs` when a paragraph plan cites the unit and the prerequisite becomes concrete; wire `terms` when the unit's `kern` mentions a term already in `economie-terminologie.md`. A lightweight auto-pass for `terms` is feasible: scan each unit's `kern` against the canonical term list and propose matches through `unit-update`. Treat it as a helper, not a batch job.

**Effort:** honesty pass is 15 minutes. Backfill is weeks of diffuse work spread across paragraph-build passes — explicitly *not* a one-shot task.

### Finding 4 — placeholder procedures (High) — **merit: yes, full on the cosmetic half, open on the content half**

The review is right: 60 of 63 `procedure` blocks are a single numbered step identical to the unit's `kern`. This is traceable to `build-scripts/references/apply-audit.js:131-136`, which by design seeds placeholder one-step procedures for apply-level units so the schema's "procedure mandatory for `apply`" rule passes:

```js
if (['apply', 'analyze', 'evaluate'].includes(unit.mastery_target)) {
  // Apply-level unit without an abstract procedure — seed with the kern
  // as a single-step placeholder; refinement via unit-update later.
  unit.procedure = [u.kern];
}
```

That comment admits the workaround explicitly. The cost is the one the review names: the registry looks more complete than it is, because a reader scanning for real canonical procedures sees only restatements.

**Fix — cosmetic half (strip the lie):**

Change the seeding rule. Two options:

- **Option A — drop the placeholders.** Remove the seeding block in `apply-audit.js`. Relax the validator from "procedure mandatory for `apply`" to "procedure recommended for `apply`; fails CI only if count of apply-units without procedure climbs above a threshold, or optionally warns." Then mechanically strip existing single-step-equals-kern procedures from the markdown in one pass. Net effect: apply-units either carry a real procedure or carry none (honest).

- **Option B — mark them placeholders.** Keep the procedure field but add `procedure_status: placeholder | draft | canonical` on each unit. Rename existing one-liners to `procedure_status: placeholder`.

Recommendation: **Option A**. It's simpler, and `procedure_status` is an extra field the registry doesn't currently need. The validator-warning-threshold is the honest signal.

**Fix — content half (write real procedures):**

This is genuine pedagogical work and should not be scripted. Identify units whose procedures are load-bearing (voorkennis / vaardigheden / answer-model writers will cite them) and author canonical procedures per unit. Drive the priority by upcoming paragraph builds, not by alphabetical order. Track progress via a simple `reports/procedure-coverage.md` (units with apply+ mastery and no procedure).

**Effort:** cosmetic half ~1 hour (script + one run + regenerate). Content half is ongoing.

### Finding 5 — wording and terminology drift (Medium) — **merit: yes, full**

- Mixed voice: 55 `kern` lines start with `Student berekent/analyseert ...`, 36 start with imperatives. That's not a style preference, it's a regression: imperative `kern` (e.g. `A01` "Stel een lineaire functie op") is the canonical voice in the math seed and the schema example. The subagent-generated D/E/F/G/H/I units drifted into third-person framing.

- `consumers` typo in D03 (`consumers betalen meer`) — two hits total across the file; other entries use `consumenten` correctly. Trivial fix.

- `D18 Monopolie met prijsdifferentiatie` vs 8 uses of `prijsdiscriminatie` elsewhere. Canonical is `prijsdiscriminatie` — `references/authored/economie-terminologie.md:400` explicitly calls out "prijsdifferentiatie" as non-canonical and discouraged. This is not a style call; it's a terminology violation.

**Fix:**
1. **Normalize voice.** One-shot rewrite pass: rewrite any `kern` starting with `Student <verb>t` to imperative second-person (`<Verb> ...`). This can be done mechanically for most cases, with a short review pass for edge cases. Run via `unit-update` per unit so the catalog validator runs on each.
2. **Terminology sweep.** Script compares every unit's `kern` + `name` against `economie-terminologie.md`, flagging non-canonical forms. Start with the known pair (differentiatie → discriminatie) plus obvious English leaks (`consumers`, etc.). Run the resulting list through `unit-update` / `unit-rename`. `reports/terminology-drift.md` already exists (per the compacted summary) — extend its scan to the unit markdown's `kern` and `name` fields.

**Effort:** voice normalization ~30 minutes (script + review). Terminology sweep ~1 hour (extend the report, fix flagged entries).

---

## Recommended execution order

Grouped so each step leaves the registry in a strictly more honest state than the previous one. Each step is a single commit.

1. **Kill the lies** (Findings 1 + cosmetic half of 4). Quick, high-trust-impact.
   - Replace the "currently empty" paragraph with a generated stats line driven from `build-unit-index.js`.
   - Drop the `apply-audit.js` placeholder-procedure seed; strip existing one-line-equals-kern procedures; relax the validator rule to a warning.
   - Rerun the catalog pipeline; expect `procCount` to drop from 63 → ~3.

2. **Fix the spec** (Finding 2). Quick, eliminates contradiction.
   - Rewrite the Unit schema section to match reality (`layer`/`duration_min`/`generator` as A-or-optional; correct the "derived / not human-set" claim to "stored, validator enforces lower bound").

3. **Normalize voice and terminology** (Finding 5). One scripted pass + short review.
   - Imperative rewrite of "Student …" kerns.
   - Terminology sweep (differentiatie → discriminatie; `consumers` → `consumenten`; any other flagged English leaks).
   - Extend `reports/terminology-drift.md` to cover `kern` + `name` fields so this kind of drift gets caught going forward.

4. **Honesty pass on the intro + coverage reports** (Finding 3). Small code addition, no pedagogical work.
   - Reword line 13 to describe the intended shape, not a false claim about current state.
   - Add `reports/needs-coverage.md`, `reports/terms-coverage.md`, `reports/procedure-coverage.md` as the visible backlog.

5. **Backfill, ongoing, driven by paragraph builds** (content half of Findings 3 + 4).
   - Every time a paragraph plan cites a unit, take the opportunity to fill in that unit's `needs`, `terms`, and (for apply units) write the canonical `procedure`.
   - Do not schedule a one-shot backfill pass. The exercise-first principle says cross-links should be motivated by concrete use.

Steps 1–4 can all land before the next paragraph build cycle; they are mechanical or documentation-only. Step 5 is the quiet long game.

---

## What the review misses or understates

- **Layer semantics.** The review says `layer` is "derived" per the spec and finds it inconsistently applied. It's actually stored-with-lower-bound, not derived. The spec is the thing that's wrong, not the data.
- **Placeholder procedures were intentional**, not drift. They were added by `apply-audit.js` as a schema-passing measure because the audit subagents didn't always propose abstract procedures. The review frames this as quality loss; it's better framed as technical debt that was explicitly booked at minting time and is now due.
- **`needs`/`terms` emptiness is expected in the current phase.** The plan (§9 of `micro-teaching-units-plan.md`) never said the exam audit would populate these. The review reads the gap as drift; it's actually schedule. That said, the intro sentence in the file *does* overclaim, and that is a genuine drift issue — but it's the documentation that drifted, not the data.

## What the review gets right that's easy to miss

- Stale state-of-the-world text corrodes trust in a canonical document faster than missing content does. A reader who catches one lie starts hunting for others. Fixing Finding 1 first is the correct prioritization.
- The voice/terminology drift is a regression specifically introduced by the subagent audit passes (2023–2025). The math seed and the schema example are in imperative voice; the audit-minted D/E/F/G/H/I units are not. That's a data point about how to brief audit subagents next time.

---

## Open items

- Should `procedure_status: placeholder | draft | canonical` get added after all, if future audit passes will re-introduce the "need to pass schema without pedagogical work yet" problem? My current read is no — relaxing the validator rule (warn not fail) handles it more cleanly. Revisit only if we see the same placeholder inflation reappear.
- Who normalizes voice — a script with a regex or a subagent with a briefing? For kerns this short, a scripted imperative rewrite plus 10-minute review is faster than briefing a subagent. Default to script.
- Domain A eindtermen backfill is already noted as deferred elsewhere (compacted summary). Flag here only so it doesn't get rediscovered as a "Finding 6" later.
