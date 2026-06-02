# GATE-TASK-FAMILY-1 Usability-Agent Analysis

Generated: 2026-06-02

Status: analysis complete.

## Purpose

Analyze whether the independent usability agents could understand the playable
review lab without excessive trial-and-error, and whether their findings
should block or flag the gate packet.

## Round-1 Pattern

Both agents agreed the lab was substantially playable but not yet human-review
ready. The important issue was not whether the code could complete the tasks:
the issue was whether a reviewer could discover the completion path without
hidden answer evidence.

The strongest round-1 blocker was the sentence builder. A natural Dutch order
failed, and one agent needed committed checker evidence to finish. That is a
review-packet failure: it means the human reviewer would not be testing the
visible product alone.

The second blocker was next-action clarity. A correct answer did not clearly
tell the reviewer how to proceed to the next task inside the long proof page.

The third blocker was source-value staging. The task required both selecting a
source value and assigning a role, but the visible instruction did not make the
two-part action explicit enough.

## Corrections And Round-2 Pattern

The repair changed the review lab, not product routes:

- natural sentence order is accepted;
- sentence-builder prompt states oorzaak, context, gevolg;
- source-value prompt explicitly names click values plus choose roles;
- correct checks expose `Ga naar volgende taak`;
- playable proof records next-action/focus handoff.

The post-repair agent confirmed the earlier blockers were resolved enough for
direct-comment human review.

## Carried Flag

The small sequence repair controls remain terse. They should be tested again
in route-specific adoption sprints, especially on mobile and with keyboard
navigation, before any product-route reliance.

## Review Packet Implication

`GATE-TASK-FAMILY-1` may proceed to direct-comment human review only after all
cited playable proof and usability-agent artifacts are committed and pushed.
The packet must not claim product-route adoption, generated output,
target-equivalent proof, diagnostics, mastery, sequencing, Scale Gate 1, or
student/product use.
