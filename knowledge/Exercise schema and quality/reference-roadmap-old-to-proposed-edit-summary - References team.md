# Roadmap Edit Summary: Old/Current Roadmap vs Handoff Proposal

Status: human-review aid, not a live roadmap update.

## What Changed Since The Handoff Snapshot

The handoff's roadmap snapshot is behind the repository by at least one major data sprint.

R4.5 has now completed:

- `schaarste` and `alternatieve-kosten` are canonical terms.
- 13 approved dependency edges were applied through CLI.
- 19 micro-units were minted through CLI.
- Current unit count is 211 total / 209 live, not 192 total / 190 live.
- Current open `needs` backlog is 39 live units, not 48.
- Current units without term links are 63, not 44, mostly because R4.5 added procedure/instrument units.
- The live roadmap already names R9.1 as next; the stale R7.4 immediate-next issue is fixed.

## Edits The Handoff Would Make To The Old Roadmap

| Old/current roadmap area | Handoff edit | Contextual correction |
|---|---|---|
| R9.1 Owned Source Registry | Promote and extend to concept blueprint | Keep; this is already next, but repair blueprint source refs and register active lesson surfaces |
| R9.2 Content Graph Projection | Extend with skill-to-exercise edges | Good idea later; first decide exercise schema and skill registry vocabulary |
| R7.6 RAG Quality Hardening | Expand evals and anchors | Keep; probably stronger after R9.1/R9.2, though label/weak-match fixes can happen earlier |
| R8.1 QC Issue Model | Keep scoped down | Correct |
| R14.1 Curriculum Versioning | Promote earlier | Accept before C-to-B promotion; not necessarily before R9.1 |
| Skill Registry Promotion | Add as new near-term sprint | Sound, but must follow vocabulary decision because current `required_skills` means unit IDs |
| Authority/Role/Scaffolding Exercise Schema | Add as new sprint | Sound, but current schemas are mismatched; run audit first |
| Operations/Composition Registries | Add as new sprint | Good later; too early before schema audit and skill registry decision |
| Concept Blueprint Passes | Add two new sprints | Good as `concept_draft`, but keep in `knowledge/` until reviewed and metadata is ready |
| C-to-B Promotion Workflow | Add later workflow | Good later; requires versioning, evals, authority metadata, and human gate |
| R10-R13 product surfaces | Defer | Correct and already aligned with live roadmap direction |

## Recommended Edits To Make Later, If Approved

1. Insert `Schema Audit + Exercise Object Grounding` before implementation of exercise schema work.
2. Keep `R9.1 Owned Source Registry` as immediate, but broaden it to include blueprint-source-reference repair and active lesson-source discovery.
3. Add a later `Exercise Schema Extension` sprint rather than merging schema work directly into R9.1.
4. Add a `Skill/Operation Registry MVP` only after deciding whether `required_skills` should become `required_units`.
5. Keep all diagnostics, adaptive routing, student-facing AI, and automatic mastery decisions blocked.

## One-Line Recommendation

Use the handoff as strategic direction, not as an executable roadmap patch. The immediate executable work is schema audit plus R9.1 owned-source grounding.
