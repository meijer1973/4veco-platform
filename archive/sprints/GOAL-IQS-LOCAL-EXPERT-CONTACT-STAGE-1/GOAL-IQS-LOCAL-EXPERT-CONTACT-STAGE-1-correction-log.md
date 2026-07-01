# GOAL-IQS-LOCAL-EXPERT-CONTACT-STAGE-1 Correction Log

| issue | status | correction | proof_required_to_close |
|---|---|---|---|
| Contact-stage records absent | closed | Added deterministic generator, dispatch records, intake report, quarantine report, decision report, fixtures, and checker | Generator currentness, checker, and focused Jest PASS |
| Named expert / contact-detail risk | closed | Added role-only candidate records, no-contact-detail boundary, stop codes, fixtures, and tests | Checker and focused Jest PASS |
| Approved payload drift risk | closed | Dispatch records reuse exact contact text from accepted contact-pilot packets and attach only accepted request packets | Checker equality proof PASS |
| Pre-dispatch review risk | closed | Added legal/privacy and jurisdiction-source pre-dispatch review requirements and stop codes | Specialist review and checker PASS |
| Response intake overreach risk | closed | Intake records remain schema-shaped, empty until consented real responses, and quarantine forbidden responses | Focused Jest PASS |
| External send ambiguity | closed | Decision and dispatch records state no repository delivery channel exists and no external dispatch is claimed | Final lead PASS |
| Accessibility HOLD: positive response helper triggered personal-data refusal | closed | Removed forbidden-boundary wording from the positive helper and added a consented positive response Jest proof | Accessibility rerun PASS |
| Accessibility HOLD: individual-adjustment CLI refusal absent | closed | Added `--individual-adjustment-sufficiency` refusal, standalone response-text probe, authority-fragment enforcement, and regenerated outputs | Accessibility rerun PASS |
| Architecture HOLD: non-REV-STD-1 finding classification used | closed | Replaced `human_authorization_required` with allowed `scale_blocker` classification across JSON and Markdown outputs | Architecture rerun PASS |
| Architecture HOLD: checker did not enforce finding classification enum | closed | Added allowed-classification validation for JSON `finding_classification` rows and generated Markdown review tables, with focused Jest mutation coverage | Architecture rerun PASS |
