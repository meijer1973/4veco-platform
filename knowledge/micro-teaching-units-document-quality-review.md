# Micro-Teaching Units Document Quality Review

Date: 2026-04-20

Scope: review of the document quality of [micro-teaching-units.md](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md), focusing on whether it works as a trustworthy canonical registry for humans.

## Findings

### 1. Critical: the document still contains plan-era status text that is now factually false

- The file presents itself as the canonical registry, but the `## Units` intro still says the registry is "currently empty" and that future migration "will populate `A01`-`A37`" and later add D/E/H/etc. units ([micro-teaching-units.md](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:106), [micro-teaching-units.md](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:108)).
- That is no longer true in the same file: the registry already contains populated A-domain units starting at [A01](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:112) and extends through later D/E/F/G/H/I domains to [I19](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1508).
- In a canonical document, stale state-of-the-world text is especially damaging because it makes readers doubt whether the rest of the file is current or generated from an outdated phase of the project.

### 2. High: the spec section has drifted away from the actual registry shape

- The schema says "Each unit entry uses this format" and includes `layer`, `duration_min`, `exam_codes`, `terms`, and optionally `procedure`, `pitfalls`, etc. ([micro-teaching-units.md](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:41), [micro-teaching-units.md](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:46), [micro-teaching-units.md](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:47), [micro-teaching-units.md](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:51), [micro-teaching-units.md](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:54), [micro-teaching-units.md](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:55)).
- The same section also says `layer` is derived and "Not human-set" ([micro-teaching-units.md](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:70)), but the canonical markdown example still presents `layer` as part of every entry.
- In the actual registry, only A-domain entries visibly carry `layer` and `duration_min` ([A01](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:112)), while later non-A entries such as [D01](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:635) and [I01-I05](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1359) omit them entirely.
- A read-only parse during this review found:
  - 144 total units
  - 37/144 with `layer`
  - 37/144 with `duration_min`
  - 27 non-A units with no `exam_codes` field at all
- That makes the spec unreliable as a description of the document readers actually have.

### 3. High: most of the promised canonical cross-linking is still empty, so the registry is much thinner than the intro claims

- The intro promises each unit has prerequisite links forming a DAG, links to the exam program, and links to canonical terminology ([micro-teaching-units.md](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:13)).
- In practice, the cross-link density is still very low outside the A-domain slice:
  - A read-only parse found 115/144 units with `needs: []`
  - All 144/144 units currently have `terms: []`
  - No non-A unit currently has a non-empty `needs` list
- Representative examples:
  - [D01](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:635) has `needs: []` and `terms: []`
  - [D02](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:644) has `needs: []` and `terms: []`
  - [I01](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1359) has `needs: []` and `terms: []`
  - [I05](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1388) has `needs: []` and `terms: []`
- As written, the file reads like a partially linked concept list, not yet like the fully connected canonical registry its front matter describes.

### 4. High: most `procedure` blocks are placeholders, not genuine canonical procedures

- The document claims units can carry a canonical procedure, and the schema makes `procedure` mandatory for `apply` / `analyze` / `evaluate` ([micro-teaching-units.md](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:55), [micro-teaching-units.md](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:73)).
- In many actual entries, the `procedure` is just a one-line restatement of the `kern`, not a reusable step sequence:
  - [A01](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:115) repeats as a one-step procedure at [120-121](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:120)
  - [D01](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:636) repeats as a one-step procedure at [641-642](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:641)
  - [I05](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1389) repeats as a one-step procedure at [1394-1395](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1394)
  - [I07](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1406) repeats as a one-step procedure at [1412-1413](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1412)
- A read-only parse found 63 units with a `procedure` block, and 60 of those 63 are exactly one numbered step identical to the `kern`.
- That means the field often satisfies schema compliance without adding much pedagogical or canonical value.

### 5. Medium: wording and terminology consistency are not yet at “canonical reference” quality

- The registry mixes authorial styles in `kern` statements: some use direct imperatives such as [A01](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:115) and [D01](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:636), while many others use third-person student framing such as [D05](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:669), [H02](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1148), and [I05](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:1389).
- A read-only pass found 55 `kern` lines starting with `Student ...` and 38 starting with imperative verbs. That mixed voice makes the registry feel compiled from multiple passes rather than intentionally normalized.
- There are also visible wording-quality slips, for example `consumers betalen meer` in [D03](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:652), which breaks the otherwise Dutch register.
- Terminology is also not fully normalized in headings and descriptions around price discrimination, for example [D18 Monopolie met prijsdifferentiatie](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:772) versus nearby units using `prijsdiscriminatie` ([D21](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:796), [D22](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:806), [D23](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:814)).

## Assumptions

- This review treats the file as a human-facing canonical reference, not just a machine-generated dump. If the intended audience is only CLI validation, some readability findings matter less.
- I did not modify the registry or run write-path generators. The statistics above come from read-only inspection of the committed file.

## Overall Assessment

The document is structurally substantial and already useful as a raw inventory, but it is not yet strong enough as a canonical human reference. The biggest issues are trust and drift: stale intro text, a spec that no longer matches most entries, mostly-empty cross-links, and placeholder procedures that make the registry look more complete than it really is.
