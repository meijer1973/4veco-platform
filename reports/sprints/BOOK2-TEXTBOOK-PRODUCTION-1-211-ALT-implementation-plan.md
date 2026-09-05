# §2.1.1 bounded short-alternative correction — implementation plan

Builder: paragraph_211_alt_builder. Task: BOOK2-TEXTBOOK-PRODUCTION-1-211-ALT.
Date: 2026-09-05. This plan precedes source changes. Umbrella #229; milestone #223.

## Owned payload and boundary

Paired branch: agent/book2-211-alt-correction-20260905.
Platform base: 441b7e7013c74fb80da55d88f84223d233bac6a8.
Lessons base: e1170dfc450400040339f96d18e43c0b60bd029d.
Both worktrees are claimed by this builder. Governance freshness and clean
worktree preflight passed. The root assigned this correction independently
of ongoing corrections to other paragraphs.

Only two authored student-source metadata edits are permitted:

1. Give the worked bicycle image a concise noun-first native Pandoc `alt`
   attribute, retaining every original visible caption/body word and punctuation.
2. Change only fig_3's SVG accessible title from its adverb-first wording to a
   descriptive noun-first title. Preserve every drawing/visible-label byte.

No target, four goals, five target parts, 17-point allocation, answer, geometry,
plan, hold, renderer, CSS, sanitizer, suffix guard, prerequisite pin or canonical
review/QC/handoff changes. Historical R3 judgments remain historical; this
candidate's aggregate gate is reopened. Independent paragraph review and QC
are pending and cannot be supplied by this builder. No PR merge is authorized.

## Personally read basis

Both AGENTS files; product vision/end-state/companion boundary specifications;
BUILD-PARAGRAPH, BUILD-CHAPTER, build-scripts README, lane vocabulary/workflow;
active sprint/continuation plans; approved §2.1.1 and Chapter 2.1 plans with
their review bindings; outline and complete lifecycle companion; prior R3
correction, paragraph review, specialist QC and handoff; actual source,
generator, print pipeline, tests and thin lesson entrypoint.

Applied builder skills: econ-textbook-paragraph, econ-exercise-builder,
econ-didactiek, economic-graph, econ-pdf-builder and installed PDF skill.
Read econ-paragraph-review/econ-quality-control to preserve independence and
evidence obligations, not to issue their verdicts. Read accessibility-agent,
didactiek-principes, economic/mathematical precision, Dutch terminology,
pedagogical boundaries and school-quality references. The existing root PDF
operation marker covers this work. Optional stale Inspectie mapping is omitted.

## Implementation and verification sequence

1. Capture original six HTML alternatives/titles, source/artifact bindings and
   failing old-metadata diagnostics. Retain failed checks in command evidence.
2. Make the two source metadata edits and add narrow positive/old-negative
   regression coverage while retaining all eleven existing source tests.
3. Build using C:/Python314/python.exe with inherited PATH, unchanged native
   pipeline, and the next unused proof suffix r4 (collision checked). Rebuild
   deterministically and exercise the actual print-only/ZIP contract where
   supported, without inventing entrypoint flags.
4. Audit all six actual HTML alternatives and SVG titles. Enumerate native DOM
   deltas (including any figcaption aria-hidden removal and soft wrapping).
   Prove full visible caption/body preservation; compare SVG drawing bytes,
   six PNG bytes/pixels, three PDFs, and all 31 R3/R4 page bytes/pixels. Verify
   actual placed labels and the 12 pt printed body/footer floor.
5. Personally inspect all 31 final full pages, six figures and grayscale views.
   Record attributed builder observations outside immutable native manifests;
   never turn generated PENDING fields into approval.
6. Run normal student-web and publisher-print Part A profiles, scoped approved
   paragraph-production currentness, durable twelve-record frozen authority,
   and active sprint-bundle checks. Preserve failures without masking them.
7. Commit paired candidate payloads before actual-base shared/textbook scope
   checks. Record scope results in a later evidence tail, refresh URL/agent
   indices in a separate tail, publish clean paired branches and report exact
   commits/bindings to root for distinct review and QC.

## Carried limits

The 54/66/78-minute routes remain unobserved design estimates. The historical
orange-stroke contrast flag remains bounded and is not a blanket accessibility
claim. No Q=0 averages, formal output choice, companion work or chapter/book
acceptance is added. All §2.1.2/§2.1.3 prerequisite pins remain unchanged.
