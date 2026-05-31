# Sprint CHECK-Q2-PLAN: Short-Check Boundary

Generated: 2026-05-31

## Purpose

Define the boundary between the retained advisory short check and the later
target-equivalent exit ticket.

This artifact is planning/preparation only. It does not implement checkpoint
output, create source data, regenerate lesson output, or authorize completion
language.

## Boundary Decision

The short check remains a useful companion surface.

It answers:

```text
How is this going, and what local next action is useful?
```

The target-equivalent exit ticket is a separate proof task.

It answers:

```text
Has the student locally demonstrated that they can complete the paragraph
target-exercise operation chain at the same level with matching answer forms?
```

These are different products even if they later reuse shared route panels,
task-shell families, or visual layout.

## Advisory Short Check

Allowed role:

- low-pressure local check during or near the end of a route;
- advice about a named practice route, game, or weak skill;
- recommendation to proceed to the target-equivalent exit ticket when local
  evidence looks strong enough;
- proceed-for-now advice when a weak skill should be revisited later.

Allowed examples:

```text
Je hebt deze korte check afgerond.
Oefen nog met [spel of vaardigheid].
Ga door naar de exit-ticket-check.
Je kunt voorlopig verder, maar herhaal [vaardigheid] later nog.
Je kunt voorlopig door naar de volgende paragraaf, maar oefen [vaardigheid] later nog.
```

The last two examples are route advice only. They are not permission,
sequencing, target-equivalent proof, or mastery claims.

Required state:

```json
{
  "surface": "advisory_short_check",
  "targetReadinessEvidence": false,
  "targetEquivalentProof": false,
  "completionLanguageEligible": false
}
```

Current `1.1.1` status:

- label: `Korte check`;
- source: `source-data/book-1/exit-ticket/1.1.1.json`;
- target skills sampled: `B01`, `B02`;
- target exercise skills required: `A43`, `B01`, `B02`;
- proof status: not target-equivalent.

## Target-Equivalent Exit Ticket

Allowed role after later implementation and review:

- same cognitive level as the paragraph target exercise;
- complete reviewed target-exercise operation chain;
- matching answer forms;
- shared task-shell families for calculation, graph/table, unit/notation,
  source use, and short response;
- neutral feedback and local non-summative result;
- completion copy only after `GATE-L1.7B-Q2`.

Future state shape:

```json
{
  "surface": "target_equivalent_exit_ticket",
  "targetReadinessEvidence": true,
  "targetEquivalentProof": true,
  "completionLanguageEligible": "gate_approved"
}
```

This state does not currently exist for `1.1.1`, `1.1.2`, or `1.1.3`.

## Forbidden Inferences

The advisory short check must not imply:

- the student has proven the target exercise;
- paragraph completion;
- a grade or cijfer;
- diagnostic classification;
- adaptive routing;
- automatic sequencing;
- permanent mastery;
- summative pass/fail;
- student-facing AI decision;
- PV projection or machine promotion;
- Scale Gate 1 evidence.

Forbidden examples before `GATE-L1.7B-Q2`:

```text
Je hebt laten zien dat je de eindopgave van deze paragraaf aankunt.
Je kunt nu door naar de eindopgave.
Je hebt deze paragraaf-check succesvol afgerond.
Je beheerst deze paragraaf.
```

## UI Rule

If advisory and target-equivalent surfaces later share a visual shell, the UI
must visibly distinguish:

- `Korte check`, `Oefencheck`, or `Adviescheck` for advisory advice;
- `Exit ticket` or reviewed equivalent for target-equivalent proof;
- separate result state and separate copy rules.

Merging UI components is allowed only if the two statuses remain visibly and
programmatically distinct.

## Validation Requirements

Future validators should fail if:

- an advisory short check sets `targetReadinessEvidence: true`;
- an advisory short check uses target-equivalent completion copy;
- a short-check result is stored as target-equivalent proof;
- a landing page labels a checkpoint as proof when only advisory evidence
  exists;
- route advice is phrased as automatic sequencing;
- target-equivalent status is inferred from skill stars, practice progress, or
  short-check completion.
