# PR Throughput Policy

Status: active governance policy for future PR review packets.
Created: 2026-06-14.

## Purpose

This policy reduces avoidable PR overhead without weakening current safety
boundaries. It lets low-risk, well-proven PRs use lighter closure lanes while
keeping protected references, generated lesson output, product authority,
diagnostics, mastery, PV, and student/product use behind the right human gates.

This policy does not authorize any protected reference mutation, generated
lesson output, product-use claim, diagnostics, mastery, PV projection, or
student-facing deployment by itself.

## PR Throughput Classes

| Class | Definition | Default lane | Human decision |
|---|---|---|---|
| `micro_maintenance` | Mechanical or metadata-only maintenance: typo fixes, link/index refreshes, formatter-safe docs, generated repository maps, non-authoritative report projections, and checker fixture updates. It must not touch protected references, machine/external references, generated lesson output, product specs, or student-facing authority. | L0 or L1 | Not required after CI/checker proof and lead-review proof. |
| `normal_sprint` | A bounded sprint PR with source, docs, reports, tests, and sprint evidence for one authorized task. It may change platform implementation or governance docs, but it must not claim product authority or mutate protected references unless classified higher. | L1 | Not required when lead review is PASS or PASS WITH FLAGS and no escalation trigger fires. |
| `generated_output` | A PR containing generated lesson output, deployed lesson runtime assets, rendered textbook output, generated HTML/PDF/DOCX/PPTX, or generated lesson-side shared assets. The generated output is evidence or delivery output, not source authority. | L3 by default; L2 only for owner-preapproved repeat lanes | Required unless an owner-preapproved lane explicitly covers the exact generated-output surface and proof shape. |
| `high_authority` | A PR that changes or claims curriculum/product authority: protected reference data, target finality, product specs, inspection/school-facing evidence claims, review-gate closure, diagnostics, mastery, PV, summative use, adaptive routing, student-facing AI, or student/product use. | L4 | Required. |
| `cross_repo_bundle` | A coordinated platform/lesson pair or group where one PR carries source/checker/proof and another carries generated lesson output or lesson-side specs. Every PR in the bundle carries the same `bundle_id` and complete `paired_prs`. | Highest lane required by any paired PR | Required if any paired PR requires L3 or L4. |

## Review-Autonomy Ladder

| Level | Name | Meaning | Minimum proof |
|---|---|---|---|
| `L0` | Mechanical auto-merge candidate | Pure mechanical maintenance with no authority change and no generated lesson output. | Passing CI/checker proof, lead-review result, no escalation triggers, `human_decision_required: false`. |
| `L1` | Lead-review autonomous | Normal sprint work can close on lead-review judgment when no high-authority surface is touched. | Passing CI/checker proof, lead-review PASS or PASS WITH FLAGS, no escalation triggers, `human_decision_required: false`. |
| `L2` | Owner-preapproved lane | A repeatable lane that the owner has preapproved in writing for a precise class of changes. | Same as L1 plus owner preapproval evidence and exact lane name. |
| `L3` | Owner one-decision gate | The owner makes one bounded decision after reviewing a complete packet. Use for generated-output or product-adjacent changes that do not require a full multi-review gate. | Complete packet, CI/checker proof or explicit CI waiver, lead review before the owner decision, `human_decision_required: true`. |
| `L4` | Full human gate | Full human review is required. Use for protected references, product/spec authority, diagnostics, mastery, PV, student/product use, review-gate closure, or unresolved escalation. | Human-review packet, lead review before the human gate, passing CI/checker proof or explicit waiver, recorded decision and closure evidence. |

Autonomous means `L0`, `L1`, `L2`, `human_decision_required: false`, or
`auto_merge_allowed_after_ci: true`. Autonomous classification is rejected if
any escalation trigger below is present.

## Machine-Readable Packet Fields

Future review packets must include these top-level fields in their JSON
companion:

```json
{
  "bundle_id": "REVIEW-THROUGHPUT-EXAMPLE-1",
  "authority_class": "standard",
  "review_autonomy": {
    "level": "L1",
    "lead_review_result": "PASS"
  },
  "human_decision_required": false,
  "paired_prs": [],
  "auto_merge_allowed_after_ci": true,
  "escalation_triggers": []
}
```

Use `bundle_id: null` when the PR is not bundled. Use an empty array for
`paired_prs` when no paired PR exists. Do not omit the fields.

Recommended additional fields:

- `pr_throughput_class`: one of the five PR throughput classes above.
- `changed_paths`: repository paths changed by the PR.
- `proof.ci`: workflow/context, run ID, reviewed commit, and success
  conclusion.
- `proof.checkers`: passed checker commands.
- `proof.lead_review`: path and result.
- `authority_claims`: booleans for product authority, diagnostics, mastery,
  PV, student use, and student/product use.

The schema companion is `docs/review/review-packet-throughput.schema.json`.

## Escalation Triggers

The checker must reject autonomous classification when any of these are true:

1. Protected references are touched.
2. `references/machine/` or `references/external/` is touched.
3. Generated lesson output claims product authority.
4. Diagnostics, mastery, PV, or student-use authority is claimed.
5. CI/checker proof is missing.
6. Lead-review result is missing.
7. `escalation_triggers` is non-empty.

When any trigger fires, set `human_decision_required: true` and move the packet
to L3 or L4. Do not clear the trigger by changing wording alone; either remove
the unsafe claim/surface from the PR or route through the required human gate.

## Authority Classes

Use the lowest accurate authority class:

| `authority_class` | Meaning |
|---|---|
| `mechanical` | Non-authoritative maintenance only. |
| `standard` | Normal sprint authority; no protected or product-use authority. |
| `generated_output` | Generated lesson output or generated lesson-side runtime output is present, without product-authority claims. |
| `high_authority` | Product, curriculum, inspection/school-facing, or gate-closure authority is involved. |
| `protected_reference` | Protected reference data is touched. |
| `machine_external_reference` | `references/machine/` or `references/external/` is touched. |
| `product_authority` | Product authority is claimed or changed. |
| `diagnostics_mastery_pv_student_use` | Diagnostics, mastery, PV, student-use, student-facing AI, adaptive, summative, or student/product-use authority is claimed. |

`high_authority`, `protected_reference`, `machine_external_reference`,
`product_authority`, and `diagnostics_mastery_pv_student_use` are never
autonomous lanes.

## Cross-Repo Bundles

For platform/lesson pairs:

- Use the same `bundle_id` in every paired PR.
- List every paired PR in `paired_prs`.
- Classify the bundle by the highest authority class and highest ladder level
  required by any PR in the bundle.
- Keep generated lesson output in the lesson repo and source/checker/proof in
  the platform repo unless a human explicitly authorizes another shape.
- Do not merge the generated-output PR before the platform source/checker PR is
  green and the bundle decision is recorded.

## Non-Authority Rule

A lead-review autonomous closure proves only that the PR may close under this
policy. It does not grant product authority, student-use authority, target
finality, diagnostics, mastery, PV, or generated-output approval beyond the
exact PR packet.
