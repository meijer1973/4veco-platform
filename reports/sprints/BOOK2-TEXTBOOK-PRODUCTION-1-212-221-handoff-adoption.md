# §2.1.2 / §2.2.1 final internal Part A handoff adoption

Date: 2026-09-05. Accountable integrator: codex-root.
Preimplementation authority: combined production plan and accepted root,
chapter and paragraph plans; no new target or merge grant.

## Exact adopted payload

| Paragraph | QC platform commits | QC lesson commit |
|---|---|---|
| §2.1.2 R5 | 1493e3500fb7dcc36739e1769920a3bf0436dcb4; publication tail 6189e1c5fc6c0790140028fa7fa92350d3a2d8fe | c51f1777afc358a49e249dd599d29a8d5fd2607a |
| §2.2.1 R6 | e0b1f4bfeb79c16c63e85f5b55b96159febc0ac6 | d37870aea3b23fb80a0fe8dcbbc377b60ad83b1c |

Root cherry-picked only those new commits without conflict. Both actual
independent paragraph reviews were already published at root `406e0b0a`.
The separate specialists each returned PASS WITH FLAGS and no required
correction. Root read the final review/quality delta, QC execution/publication
records and inspected the new proof bindings. No student source/output,
approved plan, frozen target or immutable generation manifest changed.

Validated integrated heads before handoff creation:
platform `3e227401f369f190738a19d7b676d0dde3fc1902`,
lessons `83c7bde9bf87930b7fe04203cca4710ede2a3504`.

## Actual root post-adoption checks

- All four normal Part A validations: §212 and §221 × student-web and
  publisher-print PASS, explicit PASS WITH FLAGS recognized.
- `check-book-outline-currentness.js --require-approved --action
  paragraph_production --paragraph` for each paragraph: PASS.
- Durable twelve-target authority: PASS. These three action/authority commands
  were run through the sprint command logger.
- Full lesson delta against origin/main under textbook lane: PASS,
  87 Part A paths, no unknown paths or exception. Full inherited platform
  delta under shared lane: PASS, no exception. Evidence-only specialist
  platform deltas are not misrepresented as independently owning that lane.
- All six new inspection records bind the exact unchanged PENDING manifests,
  identical PDF hashes, exhaustive page path inventories and raw hashes of
  all 47 current page PNGs: PASS. This is root hash verification, not a claim
  to have performed the specialists' visual inspections.
- Root also personally inspected all these pages as recorded previously in
  `BOOK2-TEXTBOOK-PRODUCTION-1-212-221-root-verification.md`; §221 used four
  current changed pages and 16 independently verified raw-hash transfers from
  root's own prior R5 inspection.
- Root rechecked 45 §212 and 23 §221 current source/document/asset references
  against its published exact-output rebuild records: PASS. No output drift.
- Fresh review/quality raw hashes were recalculated and pinned in the new
  canonical lesson handoffs. §212 review hash matches its quality-ref field.

| Inspection file under rendered-proof sprint root | Raw SHA-256 |
|---|---|
| 212-paragraaf-e94d42f66ab9-r5/inspection.json | 885731ab6d4a2de1ed515bfc6b72a3ae2c8fd192f68ed171f697270be1a2c42d |
| 212-opgaven-94ebe5d35207-r5/inspection.json | 5f186d799d490ada3c0241f609504d5bc1837cc41995b4a05eb05622fc289935 |
| 212-antwoorden-07a75d7b5b69-r5/inspection.json | 54395793f75a37ccac72ed485d7ad4d3f250e23ead9d6eabfcf8e529098d2cd1 |
| 221-paragraaf-aafd07e6bb88-r6/inspection.json | 7e1dcca4cc221e1f9a3139e98a84ca98526a9a7b6c485b1b8b3a20db2735d724 |
| 221-opgaven-e9def67106ce-r6/inspection.json | e3099ac1ad24502e79a89764ab31397ba6e1fe0ae9c2c097278c480b26cb68f4 |
| 221-antwoorden-d4a7c139d492-r6/inspection.json | d799e2987b6100a93edcaa64c3d5c736d572e36a097eda2318a2300e48a9a179 |

## Full-suite checkpoint, kept separate from remote CI

Platform `fa8376a802b6147e87b2f017146b03aee579354e` with clean paired lessons
`7867b72a7829ef96cbd1aa451e89aebcec79da0b` stayed unchanged for the full run:
`npm.cmd test -- --runInBand`, exit 0, 455.386 seconds.
110 passed / 6 skipped suites; 1,872 passed / 8 skipped tests, 1,880 total.
Intentional negative-fixture warning output is not a production validation
failure. The command log was committed as `cbc0aaff`; only Markdown CR/trailing
whitespace was normalized, never JSONL content or hashes. This exact checkpoint
precedes evidence-only QC/plan/handoff adoption. It is not final remote CI or
an independent full-suite run by a paragraph reviewer.

## Decision and continuation

Root accepts the exact §212 R5 and §221 R6 Part A payloads with their stated
flags. New `2.1.2-textbook-handoff.md` and `2.2.1-textbook-handoff.md` record
source and PDF pins, concepts, procedures, exercise/visual maps, boundaries,
known flags and technical READY_FOR_COMPANION. That technical status does not
commission Part B. Legacy quality records are not reused as acceptance;
independent QC records remain historical snapshots of their authorship stage.

After normal publication of the handoffs and refreshed scoped action checks,
root may release §213 under its independently accepted plan, §222 under its
owner-approved plan, and §223 under its independently accepted plan. Later
prerequisite pins belong in stage-2 evidence rather than silently rewriting
the owner-approved plans. H-213-OPC2 remains outside agreed production scope.

Retain unobserved timing/attainment, §212's minor recap qualification omission,
and omitted optional current Inspectie mapping. Chapter/book assembly,
independent combined lead review, paired final CI/readiness and owner review
remain unfinished. No new PR or merge authority is supplied by this record.
