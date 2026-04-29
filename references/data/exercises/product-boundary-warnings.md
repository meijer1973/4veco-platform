# Product Boundary Warnings

Warning ID: `PRODUCT-BOUNDARY-WARNING-V1`

Mandatory warning label:

```text
Internal overlay metadata only - no diagnostics, adaptive routing, student-facing AI, mastery, summative use, or automatic sequencing.
```

`instructional_role: diagnostic` means an authored exercise role only. It does not authorize a diagnostic product layer.

Blocked product uses:

- student diagnostics
- adaptive routing
- student-facing AI
- automatic mastery decisions
- summative assessment use
- automatic lesson sequencing

Every overlay record must keep the product-boundary authorization flags set to `false`.
