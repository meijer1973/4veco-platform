# Codex Review — Zero-Needs Teaching Units

Date: 2026-04-21

Scope: review of [references/machine/micro-teaching-units.md](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md) from two lenses:

- teacher lens: can a teacher teach a `needs: []` unit to a 15-year-old with zero economics prior knowledge in 3–7 minutes?
- student lens: would that student understand a short explainer for the unit without hidden prerequisite teaching first?

This review treats `needs` as a real comprehension dependency tree, not just a curriculum-order hint.

## Backbone Rule

This is the didactic rule that should govern the platform:

- `needs: []` must mean a true entry unit.
- A true entry unit can be taught from zero economics prior knowledge in a 3–7 minute explainer.
- `prior_learning` does not replace `needs`. It is timing metadata, not permission to hide prerequisites.
- If a teacher must first define multiple concepts, import another model, or silently teach another unit inline, then the unit is not a true root and needs either prerequisites or a split.

## Findings

1. Critical: the current tree does not consistently honor the zero-needs contract.

   The problem is broader than the examples you named. I found 37 non-A units with `needs: []`, and 8 of them are already `apply` / `analyze` / `evaluate`. That is a strong structural warning sign by itself: root nodes are being used for second-order reasoning, not just first-contact ideas.

2. Critical: some zero-needs units explicitly reveal hidden dependencies in their own procedure.

   This is the clearest contract breach in the file:

   - [D10 Vraag/aanbod-verschuiving bij conjunctuurschok](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:917) says `needs: []`, but step 3 explicitly uses the equilibrium method from `A06` at [line 928](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:928).
   - [D13 Kostenstijging en aanbodverschuiving](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:962) does the same at [line 973](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:973).
   - [H14 Minimumuurloon: vraagkanaal naar bbp-groei](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1660) says `needs: []`, but step 3 explicitly points to `I14` at [line 1671](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1671).

   A teacher reading the tree would infer “I can teach this cold,” but the unit itself says otherwise.

3. High: all five highlighted example units fail the root-unit test.

   - [I06 Deflatiespiraal](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1864)
     Teacher lens: this is a multi-link macro chain, not one bite-sized first idea.
     Student lens: “falling prices -> delayed spending -> lower investment -> deeper downturn” is too much hidden background for one short explainer.

   - [I04 CAO-looptijd en loonrigiditeit](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1841)
     Teacher lens: assumes CAO, wage adjustment, labor-market flexibility, and policy effectiveness.
     Student lens: the listed `terms` understate the true load; the student would not know the nouns before the explanation even starts.

   - [I01 Anticyclisch begrotingsbeleid](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1814)
     Teacher lens: presupposes conjuncture states, why stabilization is needed, and how government spending/taxes affect demand.
     Student lens: this is a mini-system, not an entry concept.

   - [H24 Wisselkoers en depreciatie](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1774)
     Teacher lens: bundles exchange-rate notation, depreciation, currency conversion, import/export interpretation, and real-income effects.
     Student lens: the procedure is operational, but the concept load is too high for a first-contact unit.

   - [H21 Staatsschuldquote berekenen](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1735)
     Teacher lens: “staatsschuld / bbp” might be one unit, but “duurzaamheid” and dynamic interpretation are extra units.
     Student lens: the current version jams concept introduction, ratio calculation, and policy interpretation together.

4. High: the deeper, less-obvious failures are concentrated in macro, policy, and evaluative roots.

   These are also not genuine entry units:

   - [I10 Loonrigiditeit en helling GA-curve](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1919)
   - [I14 Multiplier en lekkages](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1969)
   - [H01 AOW-leeftijd als houdbaarheidsinstrument](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1506)
   - [H13 Minimumuurloon: kostenkanaal naar concurrentiepositie](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1645)
   - [D14 Marktfalen en overheidsinterventie beoordelen](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:977)
   - [D24 Drie voorwaarden prijsdiscriminatie](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1087)
   - [E02 Intertemporele ruil in pensioenstelsels](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1177)
   - [F07 Overproductie bij negatieve externe effecten](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1309)
   - [D02 Constante kosten en winst](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:821)
   - [D16 Minimumprijs en werkloosheid](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1001)

   Common pattern: they are not first concepts, but compressed outputs of earlier concepts.

5. Medium: the terms field often under-reports prerequisite load.

   The best example is [I04](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1841), where the registered `terms` are much lighter than the real teaching burden in the `kern`. This makes the dependency tree look cleaner than the teaching reality. The same pattern appears in several macro and policy roots.

## Unit Classification

Clearly not valid as zero-needs:

- [I01](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1814), [I04](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1841), [I06](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1864), [I10](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1919), [I14](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1969)
- [H01](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1506), [H13](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1645), [H14](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1660), [H21](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1735), [H24](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1774)
- [D10](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:917), [D13](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:962), [D14](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:977), [D16](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1001), [D24](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1087), [D02](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:821)
- [E02](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1177), [F07](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1309)

Borderline, but maybe salvageable as zero-needs if simplified and kept concrete:

- [D15](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:992)
- [F02](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1258)
- [G08](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1470)
- [G10](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1488)
- [G11](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1497)

Genuine or near-genuine entry units:

- [D09](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:908)
- [D27](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1114)
- [E06](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1225)
- [F03](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1267)
- [F15](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1393)

## Practical Conclusion

The current registry still mixes two different meanings of “root”:

- true conceptual entry point
- earlier-in-the-course but still prerequisite-heavy concept

For this platform, that distinction cannot stay fuzzy. If the dependency tree is supposed to govern explainability, planning, and cognitive load, then `needs: []` has to mean “a teacher can step into this cold with a novice student and succeed in 3–7 minutes.” A substantial slice of the current non-A root layer does not meet that standard.

## Assumption

This review interpreted “zero prior knowledge” as zero economics prior knowledge, not zero general secondary-school math. That is why the main focus is the non-A root layer.
