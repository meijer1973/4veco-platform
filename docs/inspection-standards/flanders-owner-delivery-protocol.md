# Flanders Owner Delivery Protocol

Sprint: `GOAL-IQS-OWNER-DELIVERY-PROTOCOL-REPAIR-1`

This contract defines an owner-controlled delivery protocol. It does not dispatch, store private contact details, analyze responses, generate localized output, generate answer models, or create product/school/public authority.

## Boundary

Flanders only; not all Belgium, not the French Community, not the German-speaking Community, and not all school networks.

Permitted internal use: later internal Book 1 Chapter 1.2/1.3 interpretation only.

## Required Proof Format

- `jurisdiction`
- `approved_request_packet_id`
- `approved_contact_text_hash`
- `delivery_channel_class`
- `owner_delivery_reference`
- `delivery_timestamp`
- `materials_sent`
- `materials_not_sent`
- `no_personal_data_confirmation`
- `no_localized_output_confirmation`
- `response_expected`
- `response_storage_boundary`

## Forbidden

- localized output or country edition material
- answer models, answer keys, or worked-answer packets
- student data
- personal data
- school-owned evidence request
- legal or compliance claim request
- inspection-readiness, exam-approval, or product-approval claim request
- support, accommodation, accessibility, legal, or individual-adjustment sufficiency claim request
- expert-as-official-authority wording
