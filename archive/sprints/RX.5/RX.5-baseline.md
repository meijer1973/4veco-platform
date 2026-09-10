# Sprint RX.5: Baseline

## Plan reference

Plan: `docs/sprints/RX.5-plan.md`

## Current state

S7 has a provisional `references/data/skill-operation-registry.json` overlay with 33 operation rows. CP-4 keeps those rows provisional and explicitly blocks machine-registry promotion, bulk backfill, and student-facing use.

Later RX sprints added live representation-sensitive units through CLI mutation:

- RX.2: `A61`, `A66`, `A67`, `A70`, `A72`, `A74`
- RX.2b: `A62`, `A63`, `A64`, `A65`, `A68`, `A69`, `A73`
- RX.3a/RX.3b: `A75`, `A76`, `A77`, `A78`, `A79`
- RX.4: `A82`, `A83`, `A84`

The S7 operation overlay intentionally still preserves older source statuses for several of those later live units. RX.5 starts from that mismatch and must report it clearly instead of silently promoting or rewriting operation authority.

PV.3/PV.4 provide pilot links for `A61`, `A82`, `A83`, `A84`, `A07`, and `B02`, but student-facing PV projection remains blocked.

## Data integrity notes

No protected reference data changes are allowed in RX.5. The sprint must not hand-edit `references/machine/` or `references/external/`, must not create new `references/machine/` operation/PV registries, and must not mutate authored source files or RAG chunks.

## Baseline risks

- The provisional S7 registry can look stale after RX.3/RX.4 live-unit mutations.
- Existing aspect coverage alone does not prove representation-transfer coverage.
- Graphical and representation-sensitive units remain generator-blocked, so report coverage must not imply student-facing readiness.
- PV links exist only for a small pilot set and must remain blocked from publication.
