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
| `L0` | Mechanical auto-merge candidate | Pure mechanical maintenance with no authority change and no generated lesson output. | Non-empty string-only `changed_paths`, commit-specific CI proof including required protected context, checker proof, `proof.lead_review` path/result/reviewed commit proof, no escalation triggers, `human_decision_required: false`. |
| `L1` | Lead-review autonomous | Normal sprint work can close on lead-review judgment when no high-authority surface is touched. | Non-empty string-only `changed_paths`, commit-specific CI proof including required protected context, checker proof, `proof.lead_review.result` of PASS or PASS WITH FLAGS, no escalation triggers, `human_decision_required: false`. |
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
  "changed_paths": [
    "reports/sprints/EXAMPLE-result.md"
  ],
  "review_autonomy": {
    "level": "L1"
  },
  "human_decision_required": false,
  "paired_prs": [],
  "auto_merge_allowed_after_ci": false,
  "escalation_triggers": [],
  "proof": {
    "ci": {
      "reviewed_commit_sha": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "conclusion": "success",
      "required_contexts": ["validate-platform"],
      "checks": [
        {
          "name": "validate-platform",
          "conclusion": "SUCCESS"
        }
      ]
    },
    "checkers": [
      {
        "command": "npm.cmd run check:platform",
        "status": "passed"
      }
    ],
    "lead_review": {
      "path": "reports/sprints/EXAMPLE-lead-review-round2.md",
      "result": "PASS",
      "reviewed_commit_sha": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    }
  }
}
```

Use `bundle_id: null` when the PR is not bundled. Use an empty array for
`paired_prs` when no paired PR exists. Do not omit the fields.

Recommended additional fields:

- `pr_throughput_class`: one of the five PR throughput classes above.
- `changed_paths`: repository paths changed by the PR. Autonomous packets must
  provide this as a present, non-empty array of strings. When available, run
  the checker with `--changed-paths-file <path>` generated from
  `git diff --name-only origin/main...HEAD` so the packet is checked against
  the actual PR diff.
- `proof.ci`: reviewed commit SHA, success conclusion, and required protected
  `validate-platform` context evidence. Workflow, run ID, or job name are
  useful metadata but do not prove CI for an autonomous packet without a
  reviewed commit SHA and the required context. L0/L1/L2 packets may add
  stricter contexts, but they must not remove `validate-platform`.
- `proof.checkers`: passed checker commands.
- `proof.lead_review`: path, PASS or PASS WITH FLAGS result, and reviewed
  commit SHA. `review_autonomy.lead_review_result` alone is not proof.
- `authority_claims`: booleans for product authority, diagnostics, mastery,
  PV, student use, and student/product use.

The schema companion is `docs/review/review-packet-throughput.schema.json`.

## Generator Adoption

Review-packet generators should use
`build-scripts/review-gates/review-throughput-fields.js` for the shared
machine-readable envelope instead of hand-copying the field set. Human-gated
packets should emit `L3` or `L4`, set `human_decision_required: true`, keep
`auto_merge_allowed_after_ci: false`, and list the generated packet surface in
`changed_paths`.

The helper also provides L0, L1, and L2 convenience constructors for
mechanical, lead-review autonomous, and exact owner-preapproved autonomous
lanes. These constructors require explicit proof objects; they do not
manufacture CI success, checker pass, or lead-review PASS. They also default
`auto_merge_allowed_after_ci` to false unless a precise autonomous lane
explicitly enables it. Autonomous packets still need changed-path evidence,
commit-specific CI proof, checker proof, `proof.lead_review`, and empty
escalation triggers.

Draft-to-review routing is governed by
`docs/review/pr-readiness-routing-policy.md`. The read-only command is
`npm.cmd run review:pr-readiness`; the mutating command is the explicit second
step `npm.cmd run apply:pr-readiness`.

In this repository's single-account GitHub model, approval count is not the
human-review signal. Branch protection keeps pull-request workflow and strict
status checks, but the expected approving-review count is `0`. The live required
context is `validate-platform` only. `integration-authorized` remains optional
audit evidence after the activation pilot failed closed.
L0-L2 merge authority comes from exact-head CI/checker/lead-review/readiness proof;
L3-L4 and governance/self-modification work still require an explicit owner
merge decision tied to the PR number, `reviewed_payload_head_sha`, base SHA at
review when required by the schema, and decision scope.

The serialized integration lane separates the human-reviewed payload from the
later integration head. Owner decisions for L3/L4 work must record the reviewed
payload SHA and base SHA at review. If `main` advances, the lane may inherit the
decision only through conflict-free base-sync merges or allowlisted deterministic
evidence refreshes. Substantive overlap requires integration-delta lead review;
changed effective payload or authority scope returns to human review.
The trusted lane recomputes exact-head PR readiness, posts the full
machine-readable decision with a canonical digest, and verifies post-merge
`main` CI; a pre-existing marker-only readiness comment is not merge authority.
Agents must not call `gh pr merge` directly for normal PRs. Use
`authorized-pr-integration` or `authorized-bundle-integration`, and allow
`integration-authorized` to be minted only as optional audit evidence by trusted
`main` integration code.

Do not add a repository-wide CI gate over all historical review packets until
the archived packet surface is either migrated or an allowlist exists. Focused
packet checkers may validate packets that have adopted the envelope.

## Escalation Triggers

The checker must reject autonomous classification when any of these are true:

1. Changed-path evidence is missing, empty, not string-only, or does not match
   `--changed-paths-file` when supplied.
2. Protected references are touched.
3. `references/machine/` or `references/external/` is touched.
4. Generated lesson output claims product authority.
5. Diagnostics, mastery, PV, or student-use authority is claimed.
6. Commit-specific CI proof or checker proof is missing.
7. `proof.lead_review` path/result/reviewed commit proof is missing.
8. `escalation_triggers` is non-empty.
9. `ci_waiver` or `checkers_required: false` is used for an L0, L1, or L2
   lane.

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
- Record exact platform and lesson PR numbers plus exact reviewed payload SHAs.
- Classify the bundle by the highest authority class and highest ladder level
  required by any PR in the bundle.
- Keep generated lesson output in the lesson repo and source/checker/proof in
  the platform repo unless a human explicitly authorizes another shape.
- Treat the platform repository as the controller for generators, CI,
  validators, governance, and integration tooling. Lesson PRs consume delegated
  bundle proof from the controller.
- Required platform `validate-platform` always checks platform candidate plus
  lesson `main`; it does not substitute a matching lesson branch. If a platform
  PR needs a lesson candidate to pass, it must be a cross-repo bundle.
- Run the explicit bundle compatibility workflow for three exact-ref states:
  `platform-first`, `lesson-first`, and `bundle-final`.
- Do not merge either PR unless `bundle-final` is green and at least one
  intermediate state is green. Select only a proven merge order.
- Record canonical bundle authorization with
  `<!-- 4veco-human-bundle-authorization:<bundle-id> -->` JSON. Prose-only
  approval is not sufficient for coordinated bundle integration.
- Use the authorized bundle integration lane or
  `npm.cmd run integrate:authorized-bundle`; do not merge one member
  independently merely because the final combined state passed.

## Non-Authority Rule

A lead-review autonomous closure proves only that the PR may close under this
policy. It does not grant product authority, student-use authority, target
finality, diagnostics, mastery, PV, or generated-output approval beyond the
exact PR packet.
