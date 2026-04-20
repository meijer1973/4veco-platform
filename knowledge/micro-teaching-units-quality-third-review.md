# Micro-Teaching Units Quality Review — Third Pass

Date: 2026-04-20

Scope: renewed review of [micro-teaching-units.md](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md), focused on:

- document coherence as a canonical registry
- didactic quality of the teaching units themselves

## Findings

### 1. High: the document still contains a direct coherence bug in its own live statistics block

- The stats header now shows two contradictory live-unit counts in the same document:
  - `143 live units ... D=29 ...` at [micro-teaching-units.md:111](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:111)
  - `144 live units ... D=30 ...` at [micro-teaching-units.md:113](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:113)
- A read-only parse during this review found 144 unit headings in the file, so the second line matches the actual content.
- Because this file presents itself as the canonical registry, contradictory self-reported totals are a trust problem, not just a cosmetic issue.

### 2. High: several units still have a didactic mismatch between `mastery_target` and the action the student is actually being asked to perform

- A read-only pass found 16 units labeled `understand` whose `kern` starts with higher-order or performance verbs such as `Analyseer`, `Beoordeel`, `Vergelijk`, `Redeneer`, or `Beargumenteer`.
- Representative examples:
  - `D14 Marktfalen en overheidsinterventie beoordelen` is tagged `understand`, but the task verb is explicitly evaluative: [micro-teaching-units.md:756](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:756)
  - `E01 Intergenerationele ruil` is tagged `understand`, but asks the student to `Analyseer ...`: [micro-teaching-units.md:862](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:862)
  - `H26 Koop- versus huurlasten vergelijken` is tagged `understand`, but asks the student to compare net housing costs systematically: [micro-teaching-units.md:1497](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1497)
  - `I13 Monetair trilemma` is tagged `understand`, but asks the student to `Analyseer waarom ...`: [micro-teaching-units.md:1646](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1646)
- This matters didactically because `mastery_target` is supposed to communicate the cognitive ceiling of the unit. If the action verb and the mastery label diverge, downstream materials will not know whether the unit is meant as explanation, application, or higher-order reasoning.

### 3. High: the new `aspects` layer is much better populated, but several important units are still under-classified in ways that weaken didactic routing

- The `aspects` field is now present across the registry and is clearly useful, but some classifications still do not match the actual student work described by the `kern` or `procedure`.
- Strong examples:
  - `A25 Minimumprijs analyseren` is `apply`, says "bereken het vraagoverschot en het welvaartsverlies", but is tagged only `[verbaal]` at [micro-teaching-units.md:443](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:443)
  - `A26 Maximumprijs analyseren` likewise asks for calculation but is verbal-only at [micro-teaching-units.md:452](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:452)
  - `D03 Consumentensurplus en accijns` has a five-step procedure with before/after surplus calculations, but remains `[verbaal]` at [micro-teaching-units.md:633](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:633)
  - `D21 Prijsdiscriminatie over inkomensgroepen` asks students to calculate prices, quantities, and surplus by group, but remains `[verbaal]` at [micro-teaching-units.md:820](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:820)
  - `I11 Monetair beleid: starre versus flexibele arbeidsmarkt` explicitly requires drawing and comparing IS-MB-GA diagrams, but is `[verbaal]` at [micro-teaching-units.md:1621](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1621)
  - `I15 Outputgap bij vraag- en aanbodschokken` asks students to calculate output gap and draw shifts in the model, but is `[verbaal]` at [micro-teaching-units.md:1664](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1664)
- Because `aspects` feeds downstream routing, these are not just descriptive imperfections. They can push a unit toward the wrong type of exercise or explanation format.

### 4. Medium-High: some units are now much richer, but a few have grown beyond plausible “micro-teaching unit” scope

- The target size is still “roughly 3–7 minutes of instruction” ([micro-teaching-units.md:9](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:9)).
- A read-only parse found several units with 6–7 step procedures:
  - `H04`
  - `I05`
  - `I07`
  - `I08`
  - `I09`
  - `I11`
  - `I15`
- The clearest scope-pressure examples are:
  - `I07 IS-MB-GA-model: outputgap en inflatie`, which combines model setup, equilibrium reading, curve shifts, inflation effects, and central-bank response in 7 steps ([micro-teaching-units.md:1562](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1562))
  - `I08 Keynesiaans kruis: verschuivingen analyseren`, which likewise combines diagram construction, equilibrium identification, shocks, multiplier logic, and interpretation in 7 steps ([micro-teaching-units.md:1579](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1579))
  - `I11 Monetair beleid: starre versus flexibele arbeidsmarkt`, which compares two model worlds and two effect channels in 7 steps ([micro-teaching-units.md:1621](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1621))
  - `H26 Koop- versus huurlasten vergelijken`, which implicitly bundles multiple cost components and a comparison framework into one unit ([micro-teaching-units.md:1497](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1497))
- These are good units in substance, but some now read more like short sub-lessons than atomic micro-units.

### 5. Medium: the A-domain is now the main didactic lagging slice

- This is a reversal from the previous state: the non-A domains improved sharply, but the foundational A-domain now stands out as comparatively under-specified.
- A read-only parse found:
  - 37 A-units total
  - 29 with non-empty `needs`
  - 18 with non-empty `terms`
  - only 3 with a `procedure`
- That means 34 A-domain `apply` units still have no explicit step list, even though this is the skill spine that many later economic units inherit from.
- The strongest A-domain exemplars remain `A02`, `A03`, and `A06`, which combine clear `needs`, procedural steps, and pitfalls ([micro-teaching-units.md:133](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:133), [micro-teaching-units.md:150](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:150), [micro-teaching-units.md:192](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:192)).
- By contrast, many later A-units such as `A25`, `A26`, `A32`, and `A34` are didactically meaningful but still rely on `kern` + `pitfalls` only, without a canonical step sequence.

### 6. Medium: the `terms` layer improved dramatically, but the vocabulary index is still not fully normalized in style and granularity

- This is a real improvement: a read-only parse found 124 of 144 units now have non-empty `terms`.
- The remaining quality issue is normalization. Some entries still look like glosses, explanatory labels, or mixed-granularity phrases rather than a clean canonical term index:
  - `Pareto efficient` at [micro-teaching-units.md:810](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:810) and [micro-teaching-units.md:818](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:818)
  - `totale surplus` at [micro-teaching-units.md:827](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:827)
  - `arbeidsaanbod (= beroepsbevolking)` at [micro-teaching-units.md:1471](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1471) and [micro-teaching-units.md:1536](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1536)
  - `monetair beleid (rentebeleid)` at [micro-teaching-units.md:1644](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1644), [micro-teaching-units.md:1653](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1653), [micro-teaching-units.md:1694](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1694), and [micro-teaching-units.md:1712](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1712)
- Didactically, this matters because `terms` is supposed to be the vocabulary glue across explanation, practice, and assessment.

## Verified Improvements

- The non-A structure is far better than in the prior pass. A read-only parse found:
  - 144 units total
  - 99 with non-empty `needs`
  - 124 with non-empty `terms`
  - 29 with `procedure`
- All `analyze` units now have procedures.
- All non-A `apply` / `analyze` units now have procedures; the remaining no-procedure `apply` units are all in domain `A`.
- Dependency coherence is much stronger in several clusters:
  - `D18` now depends on `D24` and `A36`
  - `D21` now depends on `D18` and `D28`
  - `F05` now depends on `F07` and `F10`
  - `I05` now depends on `I17` and `I07`
  - `I19` now depends on `I12` and `H24`
- The deprecated `D23` is now handled cleanly: it points to `D24`, and no active unit depends on the deprecated unit.

## Overall Assessment

This revision is substantially better than the previous one. The registry is no longer just “honest about backlog”; it now has real non-A sequencing, meaningful term coverage, and procedures for the non-A units where they matter most.

The remaining quality issues are now more concentrated and more subtle:

- one trust bug in the document header
- some metadata mismatches (`mastery_target`, `aspects`)
- a foundational A-domain that still lacks explicit procedures
- a few units that have grown a bit too large for the promised micro-unit size

So the document is now close to being a strong canonical registry, but it is not fully there yet as a didactically precise backbone.
