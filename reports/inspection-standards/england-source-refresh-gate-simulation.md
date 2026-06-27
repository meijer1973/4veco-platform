# England Source Refresh Gate Simulation

Status: complete_internal_gate_simulation

## Simulation Cases

| Case | Source | Boundary Focus | Condition | Classification | Refresh Executed | Expert Substituted |
| --- | --- | --- | --- | --- | --- | --- |
| `valid_official_source_refresh_request` | `england-dfe-a-level-economics-content` | DfE subject-content boundary | `official_source_unchanged` | `CLASSIFY_FOR_BOUNDED_PACKET` | false | false |
| `stale_source_detected` | `england-aqa-7136-subject-content` | selected AQA representative source boundary | `official_source_updated` | `REQUIRES_HUMAN_REVIEW` | false | false |
| `source_gap` | `england-aqa-7136-assessment-resources` | AQA assessment-resource source-gap boundary | `source_gap_discovered` | `BLOCK_SOURCE_GAP` | false | false |
| `non_official_source_proposed` | `scotland-curriculum-source` | England-only / not whole UK boundary | `source_outside_allowed_scope` | `STOP_NON_OFFICIAL_SOURCE` | false | false |
| `local_expert_uncertainty` | `england-aqa-economics-command-words` | AQA command words are representative only, not all awarding bodies | `official_source_unchanged` | `RECORD_UNCERTAINTY` | false | false |
| `attempted_compliance_claim` | `england-ofsted-eif-2025` | Ofsted inspection-readiness refusal | `official_source_unchanged` | `STOP_COMPLIANCE_APPROVAL_CLAIM` | false | false |
| `attempted_localized_output` | `england-ofsted-operating-guide-2025` | inspection evidence remains school-owned and no localized output is generated | `official_source_unchanged` | `STOP_LOCALIZED_OUTPUT` | false | false |
| `attempted_school_facing_output` | `england-send-code-practice` | SEND/accessibility support-sufficiency refusal | `official_source_unchanged` | `STOP_TEACHER_SCHOOL_FACING_OUTPUT` | false | false |

## Accessibility/Inclusion Evidence Boundary

- barriers to learning: Product may use accessibility-aware terminology and general affordance planning only; it may not define individual adjustments or school/local-authority duties. School-owned accommodations, reasonable-adjustment decisions, support plans, learner records, and local legal duties remain outside product proof.
- special educational needs: No individual learner data is processed and no support sufficiency is claimed. Product accessibility support is separate from school/local-authority accommodation evidence and legal-duty records.

## Finding Classification

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
| --- | --- | --- | --- | --- |
| England gate simulation covers official source, stale source, gap, non-official source, expert uncertainty, claim, localized-output, and school-output cases without executing refresh. | `core_requirement_met` | Nothing for internal gate design review. | Proceeding to combined gate decision after specialist review. | Checker PASS, negative fixtures PASS, source reviewer PASS, legal/privacy PASS, accessibility/inclusion PASS, final lead PASS, exact-head PR readiness, and human review. |
| England downstream use remains blocked. | `scale_blocker` | Source refresh execution, local expert substitution, localized/student/teacher/school/public output, evidence packs, product routes, Scale Gate, diagnostics/mastery/PV, personal data, compliance/approval/inspection-readiness/support/accommodation claims. | Internal no-output gate design and review. | Separate reviewed sprint and explicit owner authorization. |
