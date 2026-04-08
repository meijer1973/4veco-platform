# Exercise-First Platform Architecture

## Context

The 4veco-platform currently generates interactive economics websites. The key insight: **exercises are the ground truth**. The platform should evolve into an exercise-first content platform where structured exercise data feeds multiple outputs: books, websites, and tests.

## Decision: Monorepo (all in this repo)

All outputs consume the same exercise data using the same tech stack (Node.js, docx, sharp) by the same team. Separate repos would create fragile cross-repo dependencies for zero benefit.

## Architecture Overview

```
                    ┌─────────────────────────────┐
                    │     EXERCISES (ground truth) │
                    │  exercises/module-3/         │
                    │  per paragraph .js files     │
                    └──────────┬──────────────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                 ▼
        ┌───────────┐  ┌────────────┐  ┌──────────────┐
        │   BOOK    │  │  WEBSITE   │  │    TESTS     │
        │  (print)  │  │(interactive)│  │  (gradable)  │
        └───────────┘  └────────────┘  └──────────────┘
```

## The Exercise Schema

Each paragraph gets one file in `exercises/module-3/`. The schema has a **common envelope** with **type-specific content sections**, because the 6 exercise types have fundamentally different structures.

### File: `exercises/module-3/3.1.1-markt-en-marktstructuur.js`

```js
module.exports = {
  // ── Common metadata ──────────────────────────────────
  paragraph: "3.1.1",
  title: "Markt en marktstructuur",
  chapter: { nr: "3.1", title: "Markten" },
  module: 3,
  domain: "markt",                    // → color: blue

  // ── Explainer content (voorkennis + vaardigheden) ────
  explainers: {
    voorkennis: [
      {
        domain: "wiskunde",           // wiskunde|economisch|grafisch
        title: "Lineaire functies",
        uitleg: "...",                // 2-4 paragraphs
        formules: ["Qv = a - bP"],
        voorbeeld: { ... },          // worked example
        tip: "...",
        controle: "Kun je...?"
      }
    ],
    vaardigheden: [
      {
        domain: "markt",              // markt|bedrijf|arbeid
        title: "Evenwichtsprijs berekenen",
        waarom: "...",
        hoeWerktHet: ["Step 1", "Step 2", ...],
        formules: ["Qv = Qa"],
        voorbeeld: { ... },
        tip: "...",
        controle: "Kun je...?"
      }
    ]
  },

  // ── Opgaven (3 difficulty levels) ────────────────────
  opgaven: {
    basis: [                          // 10 exercises
      {
        nr: 1,
        bloom: "onthouden",           // onthouden|begrijpen|toepassen|analyseren|evalueren|creëren
        domain: "markt",
        question: "Noem de vier marktvormen.",
        subQuestions: [
          {
            label: "a",
            text: "Noem de vier marktvormen.",
            answerLines: 4,
            answer: "1. Volkomen concurrentie\n2. Monopolistische concurrentie\n3. Oligopolie\n4. Monopolie",
            hints: [],                // empty = no scaffolding (basis level)
          }
        ]
      }
    ],
    midden: [ ... ],                  // 8 exercises
    verrijking: [ ... ]               // 6 exercises
  },

  // ── Begeleide inoefening (guided practice) ───────────
  guidedPractice: [
    {
      nr: 1,
      title: "Marktvorm herkennen",
      domain: "markt",
      introText: "...",
      formules: ["Qv = a - bP"],
      deelvragen: [
        {
          label: "Vraag 1a — Kenmerken",
          vraagText: "Benoem de vier kenmerken...",
          denkstappen: ["Stap 1: ...", "Stap 2: ..."],
          hint: "Kijk naar het aantal aanbieders",
          formuleHerinnering: ["MK = TK'"],
          invulformaat: "Marktvorm: ........",
          answerLines: 5,
          antwoord: ["1. Veel aanbieders", "2. Homogeen product"],
          uitleg: "Dit is volkomen concurrentie omdat..."
        }
      ]
    }
  ],

  // ── Quiz (instapquiz multiple choice) ────────────────
  quiz: {
    categories: {
      marktvormen: { name: "Marktvormen", colors: { bg: "#EBF5FB", text: "#1A5276", bar: "#2E86C1" } }
    },
    questions: [
      {
        category: "marktvormen",
        difficulty: 1,                // 1|2|3
        q: "Hoeveel aanbieders heeft een monopolie?",
        options: ["Eén", "Twee", "Veel", "Oneindig"],
        answer: 0,
        rationale: "Een monopolie heeft per definitie één aanbieder."
      }
    ]
  },

  // ── Reasoning game (5-mode problems) ─────────────────
  reasoning: {
    domain: "economics",              // economics|math-economics|arithmetic
    problems: [
      {
        id: 1,
        structureType: "A",
        structureLabel: "Kenmerk → markt → gevolg",
        problemText: "Op de markt voor tarwe...",
        steps: [
          { label: "Herken kenmerk", detail: "Homogeen product", formula: null }
        ],
        distractorSteps: [
          { label: "Fout kenmerk", detail: "Heterogeen product", formula: null }
        ],
        subQuestions: { correct: ["subq1", "subq2", "subq3"], distractors: ["d1", "d2"] },
        errorInfo: { errorIdx: 1, wrong: { label: "...", detail: "...", formula: null } },
        flowSlots: [
          { type: "cause", text: "Veel aanbieders" },
          { type: "reasoning", text: "Geen individuele marktmacht" },
          { type: "effect", text: "Prijsnemers" }
        ]
      }
    ]
  },

  // ── News detective (4-round game) ────────────────────
  newsDetective: {
    article: {
      headline: "...",
      body: "...",
      source: "NOS",
      sourceUrl: "https://...",
      sourceDate: "2026-01-15"
    },
    rounds: [
      { type: "concept", question: "...", options: [{ text: "...", correct: true, feedback: "..." }] },
      { type: "consequence", question: "...", chain: [...], distractors: [...] },
      { type: "model", question: "...", options: [...] },
      { type: "error", fakeAnalysis: "...", errorPhrase: "...", errorExplanation: "...", distractorPhrases: [...] }
    ]
  },

  // ── Skilltree config (which skills active for this paragraph) ──
  skilltree: {
    activeSkills: ["F1", "F2", "B1", "B2"],  // IDs from base-elements.js
    highlight: ["B1"]                          // newly introduced this paragraph
  }
};
```

### What each output builder reads:

| Output | Sections consumed |
|--------|-------------------|
| **Book** | `explainers` + `opgaven` + `guidedPractice` (print-formatted) |
| **Website** | All sections (interactive games + docx/HTML documents) |
| **Tests** | `opgaven` (filtered by bloom/difficulty) + new test-specific exercises |

## Repository Structure

```
4veco-platform/
├── exercises/                          ← NEW: GROUND TRUTH
│   ├── schema.md                       ← schema documentation
│   ├── module-3/
│   │   ├── 3.1.1-markt-en-marktstructuur.js
│   │   ├── 3.1.2-vraag-en-aanbod.js
│   │   └── ...
│   └── (future: module-4/, module-5/)
│
├── build-book/                         ← NEW: book builder
│   ├── lib-book.js                     ← compilation library
│   └── book-module-3.js                ← Module 3 book script
│
├── build-scripts/                      ← EXISTING: website builders (evolve to read from exercises/)
├── engines/                            ← EXISTING: game engines (unchanged)
├── scripts/deploy.js                   ← EXISTING: extended
│
├── skills/
│   ├── econ-exercise-schema.md         ← NEW: schema skill
│   ├── econ-book-builder.md            ← NEW: book building recipe
│   └── ...existing skills...
│
└── source-data/                        ← EXISTING: migrates into exercises/ over time
```

## Implementation Phases

### Phase 1: Schema + First Exercises (start here)
1. Create `exercises/schema.md` — document the schema (the contract)
2. Create `skills/econ-exercise-schema.md` — skill for producing exercises
3. Create first exercise file: `exercises/module-3/3.1.1-markt-en-marktstructuur.js`
4. Validate: write a Jest test that validates exercise files against the schema

### Phase 2: Book Builder
5. Create `build-book/lib-book.js` — shared library (TOC, chapter pages, page layout, numbering)
6. Create `build-book/book-module-3.js` — reads from `exercises/module-3/`, produces compiled .docx
7. Create `skills/econ-book-builder.md` — recipe skill
8. Verify: open .docx in Word, print test

### Phase 3: Wire Website to Exercises
9. Adapt existing build scripts to optionally read from `exercises/` files
10. Keep backward compatibility (existing inline scripts still work during migration)
11. Migrate paragraphs one at a time

### Phase 4: Test Builder (future)
12. Create `build-tests/` — reads exercises marked for testing, produces formal assessments

## Critical Files to Reuse

| File | Reuse for |
|------|-----------|
| `build-scripts/lib-begeleide-inoefening.js` | Library structure pattern, scaffolding components |
| `build-scripts/opgaven-351-afsluiting.js` | Exercise document patterns (question/answer formatting) |
| `build-scripts/build-landing-page.js` | `ALL_PARAGRAAF_DATA` registry, `MODULE_ROOT` pattern |
| `skills/econ-word-templates.md` | All docx components (domainBanner, formulaBox, tipBox, etc.) |
| `skills/econ-didactiek.md` | Bloom taxonomy, difficulty rules, scaffolding spectrum |
| `engines/skilltree/base-elements.js` | Skilltree skill IDs and structure |
