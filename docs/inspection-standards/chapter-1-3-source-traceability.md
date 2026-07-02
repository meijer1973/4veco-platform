# Chapter 1.3 Source Traceability Rule

Status: INSPECT-11D source-traceability record
Date: 2026-06-18

## Scope

This note resolves the INSPECT-11C ambiguity between authored source-registry
status and older blueprint prose for Book 1 Chapter 1.3 target status.

## Rule

For Chapter 1.3 readiness and proof packets, the controlling source for
reviewed-final target status is:

```text
references/authored/course-target-exercises.json
```

Older blueprint prose remains descriptive context only when it conflicts with
the authored JSON registry. A packet may cite blueprint prose for background,
but it may not use stale blueprint prose to overrule, weaken, or strengthen
the authored registry target status.

## Application In INSPECT-11D

- `1.3.1`, `1.3.2`, `1.3.3`, and `1.3.4` are treated through the source
  registry status cited in the INSPECT-11C and INSPECT-11D packets.
- Lesson-side quality-ref and review records may record local generated-output
  flags, but they do not supersede the authored registry.
- The `1.3.4` simultaneous-shift generated-output divergence was repaired in
  platform source and regenerated lesson output instead of changing registry
  authority.

## Boundaries

This rule does not mutate protected references, source-registry records,
machine references, or external references. It also does not authorise
diagnostic report generation, evidence-pack generation, product-route
adoption, Scale Gate integration, diagnostics/mastery/PV, student-use,
product-use, or compliance/approval claims.
