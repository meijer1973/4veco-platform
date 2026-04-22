# QC prompt — tree-integrity audit

**Test ID:** tree-integrity-audit
**Subagent role:** Economist who knows the CvTE syllabus eindtermen by code
**Catches:** Wrong exam_codes (e.g. H15→H5.2 should be H1.2), over-wired `needs` edges (e.g. H21→H15), and kern↔procedure drift.

This test was added after the I12 walk in 2026-04-21 surfaced exactly these three bug classes. A randomised audit catches them systematically.

---

## Prompt (verbatim — runner pastes this into the Agent call, with `<UNIT-DUMPS>` and `<OUTPUT-PATH>` substituted)

You are a Dutch academic economist with deep knowledge of the CvTE VWO economie examenprogramma 2026-versie. You can recite the meaning of each eindtermcode (D1.x markt, D2.x marktstructuur, D3.x welvaart, E1-3, F1-2, G1-2, H1-5, I1-3) without consulting the syllabus.

Your task: audit 5 randomly-selected catalog units. For each unit you receive its full text dump (id, name, kern, mastery_target, exam_codes, needs, procedure, terms). Evaluate three things and report findings:

**(a) exam_code correctness.** For each code in `exam_codes`, judge whether it points to the right CvTE eindterm given the unit's kern. Flag mismatches (e.g. an arbeidsmarkt-unit citing H1.2 instead of H5.x, or a monetair-beleid-unit citing I1.2 instead of I3.x).

**(b) `needs` edge justification.** For each prerequisite ID in `needs`, judge whether the kern of the unit *actually requires* the cited prereq's content to be mastered first. Flag over-wirings (the unit could be answered without that prereq) and under-wirings (the unit clearly needs a prereq that isn't listed).

**(c) kern ↔ procedure alignment.** If the unit has a procedure, does each step plausibly serve the kern's stated goal? Flag steps that go beyond the kern, or kern claims that the procedure doesn't actually deliver. (Skip this check for understand-tier units without a procedure.)

You receive only the unit text — do NOT request additional files (no syllabus PDF, no terminology, no other catalog units). Use your existing knowledge.

**Units to audit:**
<UNIT-DUMPS>

**Output format:** write to `<OUTPUT-PATH>`. Use a Markdown structure with one section per unit:

```markdown
## <unit-id> — <unit-name>

- **exam_codes verdict:** OK / FLAGGED — <one-sentence reason if flagged, with the corrected code if you can name it>
- **needs verdict:** OK / FLAGGED — <list each edge and judge it>
- **kern↔procedure verdict:** OK / N/A / FLAGGED — <one-sentence reason if flagged>
- **Confidence:** high / medium / low — explain in one sentence why
```

End with a short "## Summary" section noting how many units passed all three checks vs how many had ≥1 flag.

Report back in under 60 words: how many units audited, how many flagged, and the test ID `tree-integrity-audit`.

---

## Runner notes

- Sampling policy: pick 5 unit IDs from `references/machine/micro-teaching-units.json`. Weight toward units edited in the last ~10 commits (recent edits are most likely to harbour fresh bugs); fall back to uniform-random for the remaining slots if fewer than 3 recent edits exist.
- The `<UNIT-DUMPS>` placeholder is filled with the formatted plaintext blocks for the chosen 5 units (kern, exam_codes, needs, procedure, terms in a labelled format the agent can parse).
- After the agent completes, the runner records each FLAGGED finding as a row in the run report's "Recommended fixes" rollup.

## What good looks like

- All 5 units pass all three checks (high confidence).
- If flags exist, the agent names a concrete corrected exam_code or a specific edge to drop, not a vague concern.

## Failure signals

- ≥3 units flagged on exam_codes → the wiring policy needs revisiting (perhaps the extractor is mis-labelling).
- Pattern: same kind of flag across multiple units → systemic issue, not just per-unit drift.
- Low-confidence verdicts → the prompt may need to provide more context (e.g. permit reading the syllabus index).
