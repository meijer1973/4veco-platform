# MTU-H2G A20 Split And Affected-Mapping Packet

Generated: 2026-05-28

Status: packet ready, no mutation authorized.

No protected reference mutation, external-source mutation, machine-reference
mutation, unit minting, unit update execution, unit split execution, unit
deprecation, target-exercise mutation, candidate writes, lesson-output
mutation, target-exercise promotion, PV projection, or student/product use is
authorized by this packet.

## Scope

This packet resolves the held `A20` planning question left after MTU-H2F.
It asks whether the platform should prepare a later governed split or
replacement route for `A20`, because active records use `A20` for different
answer-model operations.

## Live Baseline

Current `A20` is named `MO = MK oplossen` and has:

```text
needs: A12, A13, A02
generator: GEN_A20
```

That dependency chain implies the full derived route: determine `MO` from `TO`,
determine `MK` from `TK`, then solve `MO = MK`.

MTU-H2C already minted `A91 MO = gegeven MK oplossen`, so given constant/value
`MK` no longer needs to hide inside `A20`.

## Active Target-Exercise Usage Audit

| Record | Current `A20` use | Classification | Problem | Recommended route |
|---|---|---|---|---|
| `3.2.2` | required and prior | given MO / price-taker plus derived MK | `A20` over-triggers `A12`; MO is direct as `P`, only MK is derived | review `A94` or equivalent |
| `3.3.3` | required and prior | derived MO and derived MK | `A20` is valid only if narrowed/renamed away from generic coverage | keep/update `A20` for full derived route |
| `4.1.2` | required and prior | given constant MK | `A20` is stale now that `A91` exists | replace with `A91` in a later mapping update |

## Generator Impact

`GEN.A20` exists, but its prompt gives both `MO` and `MK` functions directly:

```text
MO = a - bQ and MK = c + dQ
```

That generator does not teach the full derived `A20` route. If `A20` is
narrowed to the derived-MO/derived-MK route, a later execution packet must
either update `GEN.A20`, move this generator behavior to a separate unit such
as `A95`, or block stale student-facing exposure.

## Proposed Later Lanes

These are planning candidates only.

| Lane | Type | Purpose |
|---|---|---|
| `A20` update | unit update | Keep `A20` for the full route where both `MO` and `MK` are derived. |
| `A94` | unit add | Represent price-taker/given-MO plus derived-MK cases such as `3.2.2`. |
| `A95` | unit add | Represent given MK-function cases, distinct from `A91` given constant MK. |
| mapping updates | authored-reference route | Move `3.2.2` and `4.1.2` away from stale `A20` use if the unit route is accepted; no target-exercise promotion is authorized or implied. |

## Proposed A20 Update Direction

```text
Name: MO = afgeleide MO en afgeleide MK oplossen
Needs: A12, A13, A02
Purpose: solve Q* after deriving MO from TO and MK from TK
Condition: update only if affected mappings and GEN.A20 are handled
```

## Proposed A94 Direction

```text
Name: MO = gegeven MO en afgeleide MK oplossen
Needs: A13, A02
Purpose: price-taker or otherwise given-MO cases where MK must be derived
Generator: GEN_A94, blocked until implemented or explicitly non-interactive
```

## Proposed A95 Direction

```text
Name: MO = gegeven MK-functie oplossen
Needs: A02
Purpose: cases where MK is a given function, not a constant and not derived
Generator: GEN_A95, blocked until implemented or explicitly non-interactive
```

## Recommended Review Route

Run `GATE-MTU-H2G-a20-split-replacement` before any A20 mutation, A94/A95
minting, target-exercise mapping write, generator change, or student-facing
exposure.

## Not Authorized

This packet does not authorize `A20` mutation, `A94` or `A95` unit minting,
target-exercise mapping writes, generator implementation changes, PV
projection, lesson output, candidate writes, or student/product use.

## Stop Conditions

- Stop if any answer authorizes direct `A20` mutation from this packet.
- Stop if any answer keeps `A20` generic while also accepting `A91` as the
  given-MK route.
- Stop if any answer mutates `A20` without handling `3.2.2`, `4.1.2`, and
  `GEN.A20`.
- Stop if any answer authorizes hand edits to `references/machine/` or
  `references/external/`.
- Stop if any answer authorizes candidate writes, lesson-output mutation,
  target-exercise promotion, diagnostics, adaptive routing, mastery,
  sequencing, student-facing AI, summative use, PV projection, PV machine
  promotion, or student/product use.

## Recommended Next Action

Commit and push this packet and its review packet, then run the formal
GATE-MTU-H2G human review before any CLI mutation or mapping update.
