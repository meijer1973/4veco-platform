# Paragraph Landing V2 Rollback Policy

Rollback target for Paragraph Landing V2 is the approved fixture baseline, not
the historical failed branch or generated output from PR #45/#11.

## Approved Rollback Target

Use these files as the known-good visual baseline:

- `references/ui/paragraph-landing-v2/approved-light.html`
- `references/ui/paragraph-landing-v2/approved-dark.html`

Use platform PR #47 and lesson PR #12 as the implementation reference pair.

## Forbidden Rollback Targets

Never restore from:

- platform PR #45
- lesson PR #11
- branch `codex/paragraph-landing-page-20260610`

Those are superseded Frankenstein attempts. They implemented some route
inventory but retained too much of the old visual/shell model.

## Forbidden Rollback Markers

A rollback must not produce generated paragraph landing pages containing:

- `page-layout`
- `sidebar-toggle`
- `sidebar-overlay`
- `resource-card`
- `route-secondary-group`
- `landing-v2-`
- `data-layout="paragraaf-v2"`
- `../../shared/voorkennis.css`
- `href="#"`

## Required Proof

Every rollback or minor landing tweak must pass:

```text
npm run check:landing-v2
npm run check:platform
MODULE_ROOT=<Book 1 target> node scripts/check-links.js
```

Generated lesson output must be regenerated from the platform generator. Do not
hand-edit paragraph `index.html` files to satisfy this policy.
