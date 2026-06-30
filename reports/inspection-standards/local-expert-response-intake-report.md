# Local Expert Response Intake Report

Status: `intake_schema_ready_no_real_responses`
No real responses stored: `true`

| intake_id | jurisdiction | response_received | validation_status | proof_required_to_use |
|---|---|---|---|---|
| `england-simulated-intake` | `england` | `false` | `accepted_simulation` | Owner-authorized contact, explicit consent confirmation, strict schema PASS, specialist review, and human review. |
| `flanders-simulated-intake` | `flanders` | `false` | `accepted_simulation` | Owner-authorized contact, explicit consent confirmation, strict schema PASS, specialist review, and human review. |

## Finding Classification

| finding | classification | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|
| Response intake schema is ready and contains only simulated non-authority placeholders. | `core_requirement_met` | Nothing for human review once validation and reviews pass. | Future owner-authorized intake of real schema-shaped responses. | Checker PASS and focused Jest PASS proving simulations are not treated as expert judgment. |
