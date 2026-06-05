# CHECK-ROUTE-COPY-1 Baseline

Generated: 2026-06-05

## Current Blocker

The human review found that landing pages may show both `Korte check` and
`Exit ticket`, but that existence is not enough. The landing route must make
the difference between advisory repair and target-equivalent proof visually
and behaviorally obvious.

## Current Generated Copy

The first-three paragraph landing pages currently render the Check cards as:

```text
Korte check
Kies wat je nog wilt oefenen

Exit ticket
Maak de volledige paragraaf-check
```

This copy is technically safe, but too generic. It does not clearly explain
why a student would choose one route over the other.

## Current Generator Baseline

`build-scripts/platform/build-landing-page.js` builds the Check section with
generic `resourceCard(...)` calls:

```text
Korte check -> Kies wat je nog wilt oefenen
Exit ticket -> Maak de volledige paragraaf-check
```

There is no check-specific data attribute, badge, action label, or visual
differentiation beyond the link target and title.

## Authority Baseline

- `1.1.2` remains the only locally approved completion-language case.
- `1.1.1` and `1.1.3` exit-ticket completion language remains held.
- `Korte check` surfaces remain advisory and may not claim target-equivalent
  proof.
- No product-route adoption, diagnostics, mastery/sequencing, PV, Scale Gate
  1, or student/product use is authorized.
