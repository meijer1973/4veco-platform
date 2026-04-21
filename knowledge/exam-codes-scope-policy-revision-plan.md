# Plan — Revised `exam_codes` Scope Policy

## Context

The current policy (see "Current policy" section below) excludes domain A (Vaardigheden) from the `syllabus-eindtermen.json` register on the grounds that CvTE doesn't number A-domain the way it numbers D1.1, D1.2, etc., and that the `aspects` field (`verbaal` / `grafisch` / `rekenen`) captures the same signal.

Both arguments are wrong:

1. **CvTE does describe A-domain** — section 3.1 of the 2026 syllabus PDF has DOMEIN A VAARDIGHEDEN with subsections A1 Vaktaal, A2 Rekenkundig onderbouwen, A3 Grafisch onderbouwen, A4 Verbaal onderbouwen, A5 Argumenteren en schrijven, each populated with bullet-pointed skills. The content is there; only the format (bullets instead of numbered leaves) differs. That's a parsing problem.
2. **`aspects` is not equivalent to `exam_codes`** — `aspects` is a 3-value routing signal ("this unit needs graphical training"). `exam_codes` is the syllabus-traceability signal ("this unit addresses CvTE skill X"). They're complementary, not interchangeable. Using `aspects` as a stand-in hides real A-domain coverage in the exam-coverage reports.
3. **Direct contradiction with existing didactics** — `references/authored/didactiek-principes.md` §5.7 "Grafiekvaardigheid — opbouw in lagen" prescribes five explicit graph-skill layers that must be taught. Those ARE A3-domain content. Excluding A from the register puts the policy at odds with our own didactic doctrine.
4. **Exercise-first principle trumps syllabus structure** — the catalog's primary source of truth is real exam questions and target exercises. The syllabus register exists to **mirror** what CvTE describes; it should not **gate** what the catalog covers. If an exercise requires a skill, that skill belongs in the catalog *and* in the register when CvTE has named it (however it's formatted).

The fix: extend the register to include A-domain, schoolexam-domain skills are a separate question (keep out of the CE-focused register).

## Revised policy (to become the new canonical text)

### Scope of `syllabus-eindtermen.json`

The register is a faithful machine-readable mirror of the CvTE 2026 syllabus **central-exam content it names** — covering domains **A, D, E, F, G, H, I**. The register exists to enable eindterm-level traceability from catalog units and from real exam questions.

- **Included:** any skill the CvTE syllabus names under a content-domain heading in the spec section (chapters 3.1–3.9), including A-domain bullet-pointed vaardigheden.
- **Excluded:** school-exam-only domains B (Schaarste), C (Ruil), J (Onderzoek en experiment), and K (Keuzeonderwerpen). These can be added if a future central-exam revision brings them in or if a paragraph explicitly targets a school-exam module; for now the register is CE-focused.

### Scope of `exam_codes` on micro-teaching units

- `exam_codes` is optional.
- Populated when the unit addresses one or more eindtermen from the register (now including A-codes).
- Empty is legitimate — it signals either (a) a valid catalog unit for a skill CvTE hasn't codified (e.g. E07 koop-vs-huur existed before reclassification; these are real exam skills the syllabus under-describes), or (b) backlog awaiting wiring.
- The residual empty rows in exam-questions reports are diagnostic, not gaps: they surface units that are either genuine exercise-first discoveries (keep) or unwired backlog (wire).

### Relationship to `aspects`

`aspects` (`verbaal` / `grafisch` / `rekenen`) and `exam_codes` are complementary:

- `aspects` answers "what kind of training does this unit need?" — routes units to downstream games and exercise formats.
- `exam_codes` answers "what eindtermen does this unit address?" — enables coverage reports and syllabus traceability.

An A-unit like A10 "Oppervlakte driehoek" naturally carries `aspects: [grafisch, rekenen]` AND `exam_codes: [A3.2]` once A-codes exist. Neither replaces the other.

### Policy governance

- The register is machine-extracted from `references/external/syllabus-economie-vwo-2026-versie-2.pdf`. Re-extraction is the canonical refresh path; no hand-editing.
- Scope changes (adding/removing domains) require a committed update to the scope statement at the top of `syllabus-eindtermen.md` and the extract-eindtermen.js emitter, so the policy and its implementation stay in sync.

## Revised-policy implementation plan

### Phase 1 — Extend extractor to parse A-domain

**Critical file:** `build-scripts/references/extract-eindtermen.js`

Current extractor looks for `N.M` numbered eindtermen under subdomain headers like `G1:`. A-domain uses bullet lists like:

```
A1 Vaktaal
De kandidaat kan …
• Vakspecifieke begrippen correct gebruiken
• …
A2 Rekenkundig onderbouwen
De kandidaat kan …
• Berekeningen uitvoeren
• …
```

1. Add a parser branch that, when `currentDomain.letter === 'A'`, switches to bullet-list mode.
2. Inside A-subdomain, each bullet (`•` or `-`) becomes an eindterm with code `A<n>.<bulletIndex>` starting at 1. First bullet under A1 becomes A1.1, second A1.2, etc.
3. Preserve the existing fields: `code`, `domein`, `subdomein`, `subdomein_title`, `tekst` (the bullet text), `verbs` (body-scanned), `implied_bloom`, `examen: centraal`, `year: 2026`.
4. Update `DOMAIN_NAMES` / scope statement to include A.

Expected: 20–30 new A-prefixed entries across A1–A5.

### Phase 2 — Update all 5 policy touchpoints

Rewrite the scope statement in:
- `build-scripts/references/extract-eindtermen.js` (hardcoded scope line)
- `references/external/syllabus-eindtermen.md` (regenerated from the above)
- `references/machine/micro-teaching-units.md` schema comment
- `knowledge/micro-teaching-units-plan.md` §3, §110, §124
- `knowledge/syllabus-eindtermen-plan.md` §122 (mark as superseded; link to this plan)

New wording (replace all instances of the old D-I-only text):

> This register mirrors the CvTE central-exam syllabus for domains **A, D, E, F, G, H, I**. Domain A (Vaardigheden) is included because its skills are teaching units in their own right (see `didactiek-principes.md` §5.7 on explicit graph-skill training); the bullet-pointed A-codes are minted by bullet position from the syllabus spec section. School-exam-only domains (B, C, J, K) are excluded pending a future revision that brings them into central-exam scope.

### Phase 3 — Wire A-domain units to new codes

**Critical files:** `references/machine/micro-teaching-units.md/.json`

Each of the 37 A-units gets `exam_codes` populated. Candidate mapping (draft — subagent to refine):

- A01–A14 (functies, vergelijkingen, afgeleiden, omschrijven) → mostly A2 (Rekenkundig onderbouwen).
- A05, A10, A19, A25–A27, A30–A34 (graph-heavy skills) → A3 (Grafisch onderbouwen) or A3 + A2.
- A18, A25–A27 with verbale interpretatie → optionally A4 (Verbaal onderbouwen).
- Graph-construction skills → A3 explicitly.

Apply via the same `unit-update` pattern used in the non-A pass. Validator rejects unknown A-codes automatically.

### Phase 4 — Re-derive question `exam_codes`

Run `node build-scripts/references/derive-exam-codes.js`. The 73 A-only empty rows should drop to near zero as A-units propagate their new A-codes into questions.

Expected final question coverage: ~345/349 populated (residual only = questions whose cited skills genuinely don't map to any CvTE eindterm, e.g. exercise-first-discovered skills like koop-vs-huur before reclassification).

### Phase 5 — Update aspects-coverage report framing

`reports/aspects-coverage.md` currently treats `aspects` as the dominant routing signal. Revise the narrative to reflect the complementarity:

- `aspects` = per-unit training-mode routing (games, exercise formats).
- `exam_codes` including A-codes = syllabus traceability + coverage reports.

### Phase 6 — Add scope-evolution log

Document the policy change in `knowledge/exam-codes-scope-policy-revision-plan.md` (this file) so future readers can trace why the scope expanded. The prior `syllabus-eindtermen-plan.md` Position 1 decision is superseded; link back to this plan from there.

## Expected deltas

| Metric | Before | After |
|---|---:|---:|
| Canonical eindterm register entries | 126 | 145–155 (new A-codes) |
| A-domain catalog units wired to `exam_codes` | 0/37 | 37/37 |
| Question rows with non-empty `exam_codes` | 259/349 | ~345/349 |
| A-only questions flagged as "no CvTE coverage" | 73 | 0 |
| Didactic policy ↔ register scope contradiction | present | resolved |

## Out of scope for this plan

- Schoolexam domains B/C/J/K. Position: stay excluded from the CE register. Revisit only when an exercise-first discovery surfaces a B/C/J/K need.
- Machine parsing of exam-paper bron sections (separate register, separate extractor, not part of the CE syllabus register).
- The `aspects` field itself — it stays exactly as it is; the policy revision only clarifies its role relative to `exam_codes`.

## Verification

After implementation:

1. `node build-scripts/references/extract-eindtermen.js` — expect 145–155 entries, domain distribution `{A: ~25, D: 39, E: 12, F: 16, G: 15, H: 21, I: 23}`.
2. `node build-scripts/references/build-unit-index.js` — expect 145 unit(s) validated (144 live + 1 deprecated), 0 validation errors.
3. `node build-scripts/references/derive-exam-codes.js` — expect "filled exam_codes on ~80 questions", residual near zero.
4. `npx jest engines/tests/micro-teaching-units.test.js` — expect 65/65 passing.
5. Manual spot-check: `ha-1022-a-23-1-o:q2` (cites only A04) should now carry A-prefix exam_codes.
6. Grep verifies all 5 old policy touchpoints have been rewritten with the new scope statement.
