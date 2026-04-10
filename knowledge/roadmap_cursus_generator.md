# Roadmap: Automated Course Blueprint Generator
## Claude Code plan for repeatable production of economics course material

---

## Architecture overview

The system has three layers:

**Layer 1: Skills** — Reusable knowledge files that Claude Code reads before generating. These contain the design philosophy, templates, and domain knowledge.

**Layer 2: Input specification** — A structured input file that the user fills in to define a specific course year (domains, level, number of lessons, assessment structure, etc.)

**Layer 3: Generator scripts** — Python scripts that Claude Code executes to generate the actual products (blueprint markdown, PDF, eventually lesson materials).

---

## Layer 1: Skills to build

### Skill 1: `course-blueprint-design` (SKILL.md)

Contains the design philosophy from the design process. This is the "how to think" file that Claude Code reads before generating a blueprint.

**Contents:**
- Exercise-first design principle (each paragraph starts with a target exercise)
- Lean paragraphs / rich consolidation principle
- The even-difficulty requirement (no paragraph > 1 lesson)
- Building-block sequencing rules (never introduce X before Y)
- Difficulty rating system (⬜/🟨/🟥 with definitions)
- The assessment rhythm (small test halfway through book, large test end of book)
- Differentiate-before-mathematics approach
- Context and motivation guidelines
- The paragraph structure template (target exercise -> learning objectives -> difficulty notes)
- Rules for consolidation paragraphs (exam-style sources, no new theory)
- Buffer strategy (lighter final book)

### Skill 2: `economics-domain-knowledge` (SKILL.md)

Contains what each domain of the Dutch economics exam programme actually entails, how difficult each topic is, and prerequisite chains.

**Contents:**
- Complete domain map (D through I) with sub-domains and attainment targets
- Difficulty ratings per topic based on the analysis (e.g. "monopoly profit maximisation is the hardest individual lesson")
- Prerequisite chains (which topics require which prior knowledge)
- Common misconceptions per topic (shift vs. movement, index points vs. percentages, etc.)
- Required skills per topic (verbal, graphical, computational — from the syllabus)
- Typical number of lessons per topic at VWO vs. HAVO level
- Key formulas and when they are first introduced
- Differentiation requirements per topic

### Skill 3: `course-output-templates` (SKILL.md)

Templates for the actual output documents.

**Contents:**
- Blueprint markdown template (the structure we used)
- Design considerations template (the introductory section)
- Paragraph template (target exercise + learning objectives + difficulty notes)
- Consolidation paragraph template
- Test preparation chapter template
- Recommendations section template
- PDF formatting specifications (colors, banners, fonts)

---

## Layer 2: Input specification

A YAML file that the user fills in. Claude Code reads this as the "assignment."

```yaml
# course-spec.yaml
course_name: "Economie VWO 5"
level: "vwo"  # or "havo"
year: "5"

# Structure
books: 4
chapters_per_book: 5  # 4 theory + 1 test preparation
paragraphs_per_chapter: 4  # 3 theory + 1 consolidation
exceptions: 
  - book: 1
    chapter: 4
    extra_theory_paragraphs: 1
    reason: "marginal analysis split"

# Timing
lessons_per_week: 2
school_weeks: 36
lesson_duration_minutes: 60
homework_minutes: 30

# Assessments
test_structure:
  small_test:
    duration_minutes: 45
    placement: "after chapter 2"
    count_per_book: 1
  large_test:
    duration_minutes: 120
    placement: "end of book"
    count_per_book: 1

# Content — which domains are covered
domains:
  - id: "D"
    name: "Markt"
    weight: "heavy"  # how many books to allocate
    subdomeinen:
      - "D1: Vraag en aanbod"
      - "D2: Marktstructuur"
      - "D3: Welvaart en economische politiek"
  - id: "H_partial"
    name: "Welvaart en groei (deels)"
    weight: "light"
    subdomeinen:
      - "H5: Arbeidsmarkt en werkloosheid"
  - id: "I_partial"
    name: "Goede tijden, slechte tijden (deels)"
    weight: "light"
    subdomeinen:
      - "Inflatie en koopkracht"

# What to include/exclude
include:
  - "comparatief voordeel en handel"
  - "basisinflatie en prijsindexcijfers"
  - "wisselkoersen licht"
exclude:
  - "volledige financiële markten"
  - "volledige valutamarkten"
  - "IS-MB-GA model"
  - "Keynesiaans kruis"

# Foundations to build in
foundations:
  - "procentberekeningen"
  - "indexcijfers"
  - "grafieken lezen en tekenen"
  - "basisdifferentiëren (alleen kwadratisch)"

# Level adjustments (compared to reference VWO course)
level_adjustments:
  # For HAVO adaptation:
  # - "simplify elasticity to price elasticity only"
  # - "drop algebraic demand function aggregation"
  # - "provide formulas instead of deriving them"
  # - "limit monopoly calculation to graphical only"

# Design overrides
design_overrides:
  - "elasticiteit: alleen eenvoudige formule (%ΔQ / %ΔP)"
  - "differentiëren: alleen machtsregel op kwadratische functies"
  - "prijsdiscriminatie: gecombineerde vraagcurve wordt gegeven"

# Output language
language: "nl"
```

---

## Layer 3: Generator scripts

### Script 1: `generate_blueprint.py`

**Input:** course-spec.yaml + skills
**Output:** Complete blueprint markdown

**What it does:**
1. Reads the course specification
2. Reads the domain knowledge skill to determine topic ordering and difficulty
3. Reads the design principles skill
4. Calls the Claude API to generate the blueprint in stages:
   - Stage 1: Book-level overview (which topics in which book)
   - Stage 2: Chapter-level overview (which topics in which chapter)
   - Stage 3: Paragraph-level detail (target exercises, learning objectives, difficulty notes)
   - Stage 4: Consolidation paragraphs and test preparation chapters
   - Stage 5: Recommendations section
   - Stage 6: Design considerations intro
5. Assembles into a single markdown file

**Why staged:** A single prompt producing 1300+ lines loses coherence. Staged generation with the spec and previous stages as context keeps each call focused.

### Script 2: `generate_pdf.py`

**Input:** Blueprint markdown
**Output:** Formatted PDF

**What it does:**
- Parses the markdown structure
- Applies the formatting template (banners, difficulty bars, exercise blocks)
- Generates paginated A4 PDF with page numbering
- This is essentially the script we already wrote, parameterised for language and formatting

### Script 3: `validate_blueprint.py`

**Input:** Blueprint markdown + course-spec.yaml
**Output:** Validation report

**What it checks:**
- Total number of lessons fits within available weeks
- No paragraph is rated 🟥 without a mitigation note
- All prerequisite chains are respected (topic X comes before topic Y)
- Every theory paragraph has: target exercise, learning objectives, difficulty notes
- Every consolidation paragraph mentions exam-style source material
- Assessment timing is consistent with spec
- No concept is used before it has been introduced

### Script 4: `adapt_blueprint.py`

**Input:** Existing blueprint + adaptation spec
**Output:** Adapted blueprint for different level/year

**What it does:**
- Takes a VWO blueprint and generates a HAVO version, or
- Takes a year-5 blueprint and generates a year-6 blueprint
- Applies level adjustments from the spec (simplify calculations, drop algebraic derivations, add scaffolding)
- Recalculates difficulty ratings
- Adapts target exercises to the appropriate level

---

## Build order

### Phase 1: Foundation (build skills)

| Step | Task | Output |
|------|------|--------|
| 1 | Create `course-blueprint-design/SKILL.md` | Design principles extracted from the design process |
| 2 | Create `economics-domain-knowledge/SKILL.md` | Domain knowledge encoded from research |
| 3 | Create `course-output-templates/SKILL.md` | Markdown/PDF templates formalised |

### Phase 2: Core generator

| Step | Task | Output |
|------|------|--------|
| 4 | Create YAML input specification schema with documented example | `course-spec-template.yaml` |
| 5 | Build `generate_blueprint.py` with staged Claude API calls | Working blueprint generator script |
| 6 | Build `generate_pdf.py` (adapt from existing script) | Working PDF generator script |
| 7 | End-to-end test: spec -> blueprint -> PDF for the manually built course | Validation that output matches manual product |

### Phase 3: Quality assurance

| Step | Task | Output |
|------|------|--------|
| 8 | Build `validate_blueprint.py` | Working validation script |
| 9 | Run validation on manually built blueprint to calibrate | Calibrated validation rules |
| 10 | Fix any issues the validator finds | Improved blueprint + validator |

### Phase 4: Adaptation

| Step | Task | Output |
|------|------|--------|
| 11 | Build `adapt_blueprint.py` | Working adaptation script |
| 12 | Test: generate HAVO adaptation from VWO blueprint | HAVO blueprint |
| 13 | Test: generate year-6 blueprint with different domains | Year-6 blueprint |

### Phase 5: Workflow integration

| Step | Task | Output |
|------|------|--------|
| 14 | Create master script `build_course.sh` that chains everything: spec -> blueprint -> validation -> PDF | Single-command workflow |
| 15 | Document complete workflow in README | User documentation |

---

## User workflow

```
1. User copies course-spec-template.yaml
2. User fills in: level, domains, include/exclude, adjustments
3. User runs: claude-code build_course.sh course-spec.yaml
4. Claude Code:
   - Reads skills
   - Reads spec
   - Generates blueprint (staged)
   - Validates
   - Generates PDF
   - Presents output + validation report
5. User reviews, provides feedback
6. User re-runs with adjustments or edits the blueprint directly
```

---

## Key decision: How much intelligence lives in skills vs. generator

The skills should contain **all domain knowledge and design rules**. The generator script should contain **only the orchestration logic** (read spec, call Claude in stages, assemble output). This means:

| Change | What gets updated |
|--------|-------------------|
| New syllabus year | Domain knowledge skill |
| Different design philosophy | Design principles skill |
| New output format | New template + generator script |
| Generator scripts themselves | Change rarely |

This separation means that a teacher can update the domain knowledge skill themselves (it is just a markdown file describing topics and their difficulty) without touching code.

---

## Directory structure

```
/mnt/skills/user/
├── course-blueprint-design/
│   └── SKILL.md
├── economics-domain-knowledge/
│   └── SKILL.md
└── course-output-templates/
    └── SKILL.md

/home/claude/course-generator/
├── README.md
├── build_course.sh
├── templates/
│   └── course-spec-template.yaml
├── scripts/
│   ├── generate_blueprint.py
│   ├── generate_pdf.py
│   ├── validate_blueprint.py
│   └── adapt_blueprint.py
├── output/
│   ├── blauwdruk_economie_vwo5.md
│   └── blauwdruk_economie_vwo5.pdf
└── specs/
    ├── economie_vwo5.yaml
    ├── economie_vwo6.yaml
    └── economie_havo5.yaml
```

---

## Relationship to existing skills

This system builds on and works alongside the existing skills:

- **`econ-didactiek`**: Contains didactic principles -> is supplemented by `course-blueprint-design` with specific blueprint design rules
- **`econ-word-templates`**: Produces Word lesson materials -> can in the future be driven by the blueprint (blueprint defines WHAT, Word templates produce HOW)
- **`econ-pptx-templates`**: Same for presentations
- **`economic-graph`**: Produces graphs -> can be called from lesson materials specified by the blueprint

The blueprint is the "what" (which content, in which order, at which level); the existing skills are the "how" (what the content looks like as concrete lesson materials).
