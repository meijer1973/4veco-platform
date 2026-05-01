# GATE-RX3a First-Lane Mutation Review: Review Packet

Sprint: `RX.3a`
Status: `prepared_for_human_review`

This packet prepares candidate specs and a CLI mutation plan for `A75`, `A76`, and `A79`.

No CLI mutation is authorized by this packet.

## Context

`GATE-RX3-producer-representation` closed as `pass_with_conditions`. HCS authorized first-lane mutation review for `A75`, `A76`, and `A79`; required `A76` to include `A14`, `A04`, and `A61`; kept `A77`/`A78` for a later graph-lane review; and held `A80`, `A81`, and graphical `MO=MK`.

## Candidate Scope

- `A75` Totale winst berekenen uit opbrengsten- en kostentabel
- `A76` Totale winst berekenen uit P, GTK en Q
- `A79` Maximale winst bepalen uit TO-TK-tabel

Required execution order: `A75` -> `A76` -> `A79`.

## Review Questions

### RX3A-Q1

Is RX.3a correctly limited to `A75`, `A76`, and `A79`?

Recommended answer: A. Yes, keep the scope limited to `A75`/`A76`/`A79`.

### RX3A-Q2

Is the `A75` draft spec acceptable with needs `A04` and `A61`?

Recommended answer: A. Yes.

### RX3A-Q3

Is the `A76` draft spec acceptable with needs `A14`, `A04`, and `A61`?

Recommended answer: A. Yes, preserve the HCS dependency decision.

### RX3A-Q4

Is the `A79` draft spec acceptable with needs `A75` and `A61`?

Recommended answer: A. Yes, provided `A75` is minted first.

### RX3A-Q5

Should the execution order remain `A75`, `A76`, `A79`?

Recommended answer: A. Yes.

### RX3A-Q6

Is missing generator implementation acceptable if all three remain generator-blocked and non-interactive?

Recommended answer: B. Yes, but hard-block student-facing use.

### RX3A-Q7

If the gate passes, authorize CLI-only unit mutation for all three candidates?

Recommended answer: A. Yes, after live numbering/dependency checks, if HCS accepts the specs.

### RX3A-Q8

What gate status should `GATE-RX3a-first-lane-mutation-review` receive?

Recommended answer: `pass_with_conditions`.

## Required Conditions If Gate Passes

- Run live numbering check immediately before mutation.
- Use only `unit-add.js`, in the order `A75`, `A76`, `A79`.
- `A76` must include `A14`, `A04`, and `A61` as needs.
- Do not mutate `A77`, `A78`, `A80`, `A81`, or held duplicate/overlap records.
- Mark `A75`, `A76`, and `A79` generator-blocked and non-interactive until generators exist and validate.
- Do not hand-edit `references/machine/`, `references/external/`, authored source files, or RAG chunks.
- Do not authorize diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, summative use, or student-facing PV projection.
