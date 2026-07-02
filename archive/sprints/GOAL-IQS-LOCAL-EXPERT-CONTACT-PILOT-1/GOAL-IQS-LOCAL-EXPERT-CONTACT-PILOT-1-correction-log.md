# GOAL-IQS-LOCAL-EXPERT-CONTACT-PILOT-1 Correction Log

| issue | status | correction | proof_required_to_close |
|---|---|---|---|
| Contact-stage artifacts absent | closed | Added deterministic generator, checker, contact text, consent schema, intake schema, simulations, fixtures, and sprint records | Generator currentness, checker, and focused Jest PASS |
| Unauthorized dispatch risk | closed | Added owner_authorization_required, contact_dispatch_performed false, stop code, negative fixture, and checker refusal | Checker PASS |
| Personal-data intake risk | closed | Added consent/storage/no-personal-data boundary, forbidden intake fields, negative fixture, and checker refusal | Focused Jest PASS |
| Authority-overclaim risk | closed | Added legal/compliance/localized/support/accommodation/accessibility/individual-adjustment sufficiency refusals and specialist review records | Specialist reviews and checker PASS |
| Specialist finding: response intake schema was metadata-only for response records | closed | Inlined strict response-item JSON Schema with required response fields and additionalProperties false; checker verifies standard schema constraints | Generator currentness, checker, and focused Jest PASS |
| Specialist finding: response_received without consent could pass | closed | Reversed the consent gate so response_received true requires consent_confirmed true, updated fixture, and added Jest probe | Focused Jest PASS |
| Specialist finding: response jurisdiction could conflict with intake jurisdiction | closed | Added STOP_JURISDICTION_MISMATCH checker refusal, fixture, CLI flag, and Jest probe | Focused Jest PASS |
| Specialist finding: personal/student data could pass inside allowed text fields | closed | Added free-text scanning for email, phone, named student/person, student/support records, contact details, personal data, and school-specific evidence markers | Focused Jest PASS |
| Specialist finding: legal/compliance variants were too narrow | closed | Broadened refusal matcher for compliant, inspection ready, approved, legally sufficient, legal sufficiency, accreditation, OP0, PTA, and summative validity variants | Focused Jest PASS |
| Specialist finding: individual-adjustment sufficiency was absent | closed | Added individual-adjustment sufficiency to generated boundaries, schema forbidden metadata, checker fields, CLI flags, fixture, simulation, and Jest coverage | Focused Jest PASS |
| Specialist rerun finding: named student/learner free text could pass | closed | Added name-like student/learner/pupil text refusal and direct Jest probes | Focused Jest PASS |
| Specialist rerun finding: named-school implementation-log wording could pass | closed | Added named-school, implementation-log, and implementation-record refusal patterns plus generated fixture coverage | Focused Jest PASS |
| Specialist rerun finding: ready for inspection variants could pass | closed | Added ready-for-inspection, ready for inspection, and inspection-ready refusal variants plus direct Jest probes | Focused Jest PASS |
