# Micro-Teaching Units Quality Follow-up Review

Date: 2026-04-20

Scope: follow-up review of [micro-teaching-units.md](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md), focusing on:

- document coherence as a canonical registry
- didactic quality of the teaching units themselves

## Findings

### 1. High: the document-level coherence improved, but the didactic core is still missing for most teachable units

- The registry now describes the backlog honestly: optional cross-links are explicitly framed as incomplete, the stale "currently empty" text is gone, and live stats are printed in the document itself ([micro-teaching-units.md:13](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:13), [micro-teaching-units.md:43](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:43), [micro-teaching-units.md:108](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:108), [micro-teaching-units.md:110](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:110), [micro-teaching-units.md:113](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:113)).
- The didactic problem is that most `apply` / `analyze` units still do not carry an explicit recipe. The generated coverage report says there are 63 `apply+` units, only 3 with a `procedure`, and 60 without one ([procedure-coverage.md:4](/C:/Projects/4veco/4veco-platform/reports/procedure-coverage.md:4), [procedure-coverage.md:5](/C:/Projects/4veco/4veco-platform/reports/procedure-coverage.md:5), [procedure-coverage.md:6](/C:/Projects/4veco/4veco-platform/reports/procedure-coverage.md:6)).
- This is especially important because the report itself defines a canonical procedure as the step sequence every downstream material should cite verbatim ([procedure-coverage.md:10](/C:/Projects/4veco/4veco-platform/reports/procedure-coverage.md:10)).
- Strong counterexamples do exist in the A-domain. `A02`, `A03`, and `A06` show the intended pattern: clear mastery statement, explicit steps, and pitfalls ([micro-teaching-units.md:130](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:130), [micro-teaching-units.md:139](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:139), [micro-teaching-units.md:147](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:147), [micro-teaching-units.md:156](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:156), [micro-teaching-units.md:189](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:189), [micro-teaching-units.md:198](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:198)).
- Outside that slice, many high-value units such as `D01`, `D05`, `D18`, `H02`, `I05`, `I07`, and `I11` still have no step sequence even though they describe procedural mastery ([procedure-coverage.md:18](/C:/Projects/4veco/4veco-platform/reports/procedure-coverage.md:18), [procedure-coverage.md:20](/C:/Projects/4veco/4veco-platform/reports/procedure-coverage.md:20), [procedure-coverage.md:24](/C:/Projects/4veco/4veco-platform/reports/procedure-coverage.md:24), [procedure-coverage.md:40](/C:/Projects/4veco/4veco-platform/reports/procedure-coverage.md:40)).
- Bottom line: as a document, the registry is now more truthful; as a didactic backbone, it is still under-specified where it matters most.

### 2. High: coherence across units is still weak because nearly all non-A domains are unsequenced

- The file now openly tracks prerequisite coverage, but the current state is still very sparse: 115 of 144 live units have no `needs` links ([needs-coverage.md:4](/C:/Projects/4veco/4veco-platform/reports/needs-coverage.md:4), [needs-coverage.md:5](/C:/Projects/4veco/4veco-platform/reports/needs-coverage.md:5)).
- The whole D-domain is still listed as having empty `needs` ([needs-coverage.md:22](/C:/Projects/4veco/4veco-platform/reports/needs-coverage.md:22)), and the same is true for E, F, G, H, and I later in the report.
- That lack of sequencing is visible inside topical clusters that clearly want parent-child structure:
  - `D18` / `D21` / `D23` / `D24` are all price-discrimination units, but none depends on another ([micro-teaching-units.md:751](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:751), [micro-teaching-units.md:776](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:776), [micro-teaching-units.md:794](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:794), [micro-teaching-units.md:803](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:803)).
  - `F05` through `F11` all sit in the external-effects cluster with no visible progression from concept to intervention to application ([micro-teaching-units.md:951](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:951), [micro-teaching-units.md:960](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:960), [micro-teaching-units.md:996](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:996), [micro-teaching-units.md:1005](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1005)).
  - `H13` and `H14` are two opposite causal claims around minimum wages, again with no linking structure ([micro-teaching-units.md:1257](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1257), [micro-teaching-units.md:1266](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1266)).
  - `I12` and `I19` overlap strongly around monetary policy via the exchange rate, but neither is positioned as prerequisite, refinement, or special case ([micro-teaching-units.md:1475](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1475), [micro-teaching-units.md:1536](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1536)).
- The A-domain provides a clear contrast: `A06` depends on `A01` and `A02`, which is exactly the kind of didactic sequencing the rest of the registry mostly lacks ([micro-teaching-units.md:193](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:193)).

### 3. High: many non-A units are still exam-context propositions rather than transferable micro-teaching units

- A canonical micro-teaching unit should ideally name a reusable concept, operation, or reasoning move. Many non-A units still read as context-bound claims tied to a specific scenario:
  - `D06 Gasverbruik en prijselasticiteit` ([micro-teaching-units.md:650](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:650))
  - `G03 Broodfonds: informatie en risicovermindering` ([micro-teaching-units.md:1068](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1068))
  - `H01 AOW-betaalbaarheid en vergrijzing` ([micro-teaching-units.md:1149](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1149))
  - `H26 Woonlastafweging koop vs huur` ([micro-teaching-units.md:1373](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1373))
  - `I04 CAO-looptijd en arbeidsmarktrigiditeit` ([micro-teaching-units.md:1405](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1405))
- This is not just a naming issue. The `kern` lines often preserve the case framing instead of abstracting the teaching move:
  - `G03` explains why a broodfonds has less asymmetrische informatie ([micro-teaching-units.md:1069](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1069))
  - `H26` says a housing decision depends on several circumstances, but does not define the general economic comparison skill being taught ([micro-teaching-units.md:1374](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1374))
  - `I03` states a conjuncture claim about investment behavior instead of a student action or reasoning routine ([micro-teaching-units.md:1397](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1397))
- Didactically, this weakens transfer. Students need units that travel across contexts; these entries still feel too close to their source exam scenarios.

### 4. Medium-High: the `kern` layer is more consistent than before, but still not normalized to one didactic style

- The schema now says `kern` should be an imperative mastery statement ([micro-teaching-units.md:49](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:49)).
- A read-only parse during this review found that 94 of 144 `kern` lines begin in an imperative-like mastery voice, but 50 still do not.
- The non-imperative set is not random; many read as propositions or summary claims rather than teachable student outcomes:
  - `D02`: "Constante kosten beinvloeden..." ([micro-teaching-units.md:617](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:617))
  - `D25`: "Bij inelastische vraag leidt..." ([micro-teaching-units.md:812](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:812))
  - `H12`: "Het houdbaarheidssaldo geeft aan..." ([micro-teaching-units.md:1248](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1248))
  - `I16`: "Overheidssaldo kan veranderen..." ([micro-teaching-units.md:1511](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1511))
- There are also several copy-level grammar mismatches that make the registry read less curated than intended:
  - `D11`: "Bereken en interpreteert ..." ([micro-teaching-units.md:694](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:694))
  - `D12`: "Bepaal ... en analyseert ..." ([micro-teaching-units.md:702](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:702))
  - `D22`: "Herken ... en analyseert ..." ([micro-teaching-units.md:785](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:785))
  - `H03`: "Bereken ... en analyseert ..." ([micro-teaching-units.md:1167](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1167))
  - `H18`: "Bereken ... en analyseert ..." ([micro-teaching-units.md:1302](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1302))
  - `H24`: "Bereken ... en legt uit ..." ([micro-teaching-units.md:1355](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1355))
- These are not catastrophic, but they do matter in a canonical teaching registry because teachers and builders will treat the wording as normative.

### 5. Medium: the new `aspects` layer is useful, but some classifications still look pedagogically under-specified

- Adding `aspects` is a real improvement. The field is now part of the schema and is explicitly tied to downstream routing ([micro-teaching-units.md:54](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:54), [micro-teaching-units.md:75](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:75), [aspects-coverage.md:8](/C:/Projects/4veco/4veco-platform/reports/aspects-coverage.md:8)).
- The coverage report shows 112 units tagged `verbaal`, only 10 `grafisch`, and 53 `rekenen` ([aspects-coverage.md:14](/C:/Projects/4veco/4veco-platform/reports/aspects-coverage.md:14), [aspects-coverage.md:15](/C:/Projects/4veco/4veco-platform/reports/aspects-coverage.md:15), [aspects-coverage.md:16](/C:/Projects/4veco/4veco-platform/reports/aspects-coverage.md:16)).
- Some specific assignments look too narrow for the teaching move being described:
  - `D01 Accijnsopbrengst uit grafiek` is tagged `[verbaal]` even though the title and `kern` both imply graphical-quantitative work ([micro-teaching-units.md:609](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:609), [micro-teaching-units.md:614](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:614)).
  - `D11 Inkomenselasticiteit huurmarkt` is tagged `[verbaal]` despite being an `apply` unit whose `kern` says "Bereken en interpreteert ..." ([micro-teaching-units.md:694](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:694), [micro-teaching-units.md:699](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:699)).
  - `I05 Centrale bank rentebeleid` is tagged `[verbaal]` even though it is an `apply` decision rule ([micro-teaching-units.md:1414](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1414), [micro-teaching-units.md:1419](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1419)).
  - `I07 IS-MB-GA-model met outputgap` and `I11 Monetair beleid bij starre vs flexibele arbeidsmarkt` are analyze-level model units but still tagged verbal-only ([micro-teaching-units.md:1431](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1431), [micro-teaching-units.md:1437](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1437), [micro-teaching-units.md:1467](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1467), [micro-teaching-units.md:1472](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1472)).
- Because `aspects` feeds routing, these are not merely descriptive mistakes; they can send a unit to the wrong downstream format.

### 6. Medium: the vocabulary-coherence layer is still entirely absent

- The document is now honest that canonical term linking is backlog, but the current state is still total absence: the generated report says 144 live units and 144 with no `terms` ([terms-coverage.md:4](/C:/Projects/4veco/4veco-platform/reports/terms-coverage.md:4), [terms-coverage.md:5](/C:/Projects/4veco/4veco-platform/reports/terms-coverage.md:5)).
- That means the units may now have IDs, aspects, and some exam links, but they still do not anchor shared classroom vocabulary.
- Didactically, this matters because terminology consistency is one of the easiest ways to make explanations, exercises, and answer models feel like one coherent lesson sequence.

## Verified Improvements

- The document-level honesty is much better than in the previous version. The top matter now explicitly describes optional fields and backlog reports instead of pretending the registry is complete ([micro-teaching-units.md:13](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:13), [micro-teaching-units.md:43](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:43)).
- The schema is more coherent. It now documents `aspects`, clarifies stored-vs-derived `layer`, and aligns better with the actual file shape ([micro-teaching-units.md:47](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:47), [micro-teaching-units.md:54](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:54), [micro-teaching-units.md:70](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:70), [micro-teaching-units.md:75](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:75)).
- The A-domain remains the strongest didactic slice. It has real prerequisite wiring, all 37 units carry pitfalls, and a few foundational units already model the intended "teachable micro-unit" format well ([micro-teaching-units.md:126](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:126), [micro-teaching-units.md:143](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:143), [micro-teaching-units.md:159](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:159), [micro-teaching-units.md:202](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:202)).

## Overall Assessment

The document is now much more coherent as a living registry than it was before: the framing is honest, the schema is closer to reality, and the new coverage reports make incompleteness visible instead of hiding it.

The didactic quality, however, is still uneven. The A-domain behaves like a genuine teaching-unit system; most non-A domains still behave more like an exam-derived concept inventory. Until those units gain clearer sequencing, more abstracted naming, proper procedures, and vocabulary links, the registry is usable as an audit artifact but not yet consistently strong as the canonical backbone for lesson design.
