# CP.6e Focused 1.1.3 Part A Re-Review

Generated: 2026-05-21

Status: failed_clearance

Part A flag cleared: false

CP-6 closed: false

Year 1 closed: false

## Decision

Current paragraaf.md still references Figuur 3 before Figuur 2, so the Part A figure-numbering flag is not cleared.

CP.6e does not mutate lesson output, lesson review files, lesson quality refs, protected references, target exercises, placeholders, or machine registries. It does not close CP-6 or Year 1.

## Focused Evidence

| Check | Result |
|---|---|
| Required files present | true |
| Quality-ref Part A verdict | FLAG |
| Previous review overall verdict | FLAG |
| Figure first-use sequence | 1 -> 3 -> 2 |
| Figure first-use sequential | false |
| Opgaven repeats worked example | true |
| Repeated worked example accepted as non-blocking | true |

## Figure Numbering

The current Part A paragraph first mentions figures in this order:

```text
1 -> 3 -> 2
```

Expected first-use order:

```text
1 -> 2 -> 3
```

The existing figure-numbering flag is therefore still open.

## Worked Example Repetition

Current `opgaven.md` does include the worked example before the exercises.

CP.6e treats this as accepted standalone-exercise scaffolding, not a CP-6 closure blocker by itself.

## Closure Consequence

- CP-6 unconditioned closure blocked by `1.1.3` Part A: true
- CP-6 closure allowed now: false
- Year 1 closure allowed now: false

## Next Action

Route lesson-side remediation/regeneration for the remaining 1.1.3 Part A figure-numbering flag before any unconditioned CP-6 closure proposal.
