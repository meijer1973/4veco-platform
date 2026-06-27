# Belgium / Flanders Source Refresh Gate Simulation

Status: complete_internal_gate_simulation

## Simulation Cases

| Case | Source | Boundary Focus | Condition | Classification | Refresh Executed | Expert Substituted |
| --- | --- | --- | --- | --- | --- | --- |
| `valid_official_source_refresh_request` | `be-flanders-onderwijsdoelen-so3-doorstroom` | Onderwijsdoelen source boundary | `official_source_unchanged` | `CLASSIFY_FOR_BOUNDED_PACKET` | false | false |
| `stale_source_detected` | `be-flanders-ok-framework` | OK-framework source boundary | `official_source_updated` | `REQUIRES_HUMAN_REVIEW` | false | false |
| `source_gap` | `be-flanders-onderwijsdoelen-modernisatie` | dynamic Onderwijsdoelen route/source-gap boundary | `source_gap_discovered` | `BLOCK_SOURCE_GAP` | false | false |
| `non_official_source_proposed` | `be-federal-education-source` | Flanders-only / not all Belgium boundary | `source_outside_allowed_scope` | `STOP_NON_OFFICIAL_SOURCE` | false | false |
| `local_expert_uncertainty` | `be-flanders-education-quality-reference` | study-direction / school-network constraints | `official_source_unchanged` | `RECORD_UNCERTAINTY` | false | false |
| `attempted_compliance_claim` | `be-flanders-inspection-what-do-we-inspect` | OK/compliance and inspection-readiness refusal | `official_source_unchanged` | `STOP_COMPLIANCE_APPROVAL_CLAIM` | false | false |
| `attempted_localized_output` | `be-flanders-onderwijsdoelen-so3-doorstroom` | Onderwijsdoelen do not authorize localized output | `official_source_unchanged` | `STOP_LOCALIZED_OUTPUT` | false | false |
| `attempted_school_facing_output` | `be-flanders-ok-framework` | Flemish inclusion and learner-support evidence remains school-owned | `official_source_unchanged` | `STOP_TEACHER_SCHOOL_FACING_OUTPUT` | false | false |

## Accessibility/Inclusion Evidence Boundary

- ontwikkeling van lerenden: OK quality vocabulary can frame internal inclusion/accessibility context only; it does not define accommodations, care policy, or local legal duties. School/network-owned accommodations, support policy, learner-support records, and legal-duty evidence remain outside product proof.
- kwaliteitsontwikkeling: Quality-development term, not a compliance, sufficiency, or accessibility-support result. Product accessibility affordances remain separate from school/network accommodations and local legal duties.

## Finding Classification

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
| --- | --- | --- | --- | --- |
| Belgium / Flanders gate simulation covers official source, stale source, gap, non-official source, expert uncertainty, claim, localized-output, and school-output cases without executing refresh. | `core_requirement_met` | Nothing for internal gate design review. | Proceeding to combined gate decision after specialist review. | Checker PASS, negative fixtures PASS, source reviewer PASS, legal/privacy PASS, accessibility/inclusion PASS, final lead PASS, exact-head PR readiness, and human review. |
| Belgium / Flanders downstream use remains blocked. | `scale_blocker` | Source refresh execution, local expert substitution, localized/student/teacher/school/public output, evidence packs, product routes, Scale Gate, diagnostics/mastery/PV, personal data, compliance/approval/inspection-readiness/support/accommodation claims. | Internal no-output gate design and review. | Separate reviewed sprint and explicit owner authorization. |
