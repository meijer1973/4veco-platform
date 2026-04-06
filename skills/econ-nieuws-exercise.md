---
name: econ-nieuws-exercise
description: "Template and guidelines for creating 'nieuws met visual' exercises — short, motivating introductory assignments based on recent Dutch news for economics VWO lessons. Each document is a 2-page printable handout: page 1 has a headline, visual, article, and questions; page 2 has the answer key. Use this skill whenever creating a nieuws met visual docx, a news-based exercise, or an introductory assignment for an economics lesson."
---

# Economics News Exercise Skill v1

Guidelines and template for building `nieuws met visual` documents — the lesson-opening exercise that connects economics theory to current events. These are the first thing students see in a lesson, so quality and motivation are critical.

---

## PART 1: PURPOSE & DESIGN PRINCIPLES

### What is it?
A short, printable handout (2 pages) that opens the lesson by connecting the paragraaf topic to a recent Dutch news event. It combines three expertises:
1. **Vakdidacticus economie** — correct economic reasoning at the right level
2. **Journalist voor jongeren** — accessible, engaging, minimal text
3. **Visual designer** — a clear explanatory graphic that teaches through seeing

### Design principles
- **Motivation first**: this is the lesson starter. It must grab attention.
- **Accessible level**: introductory, not advanced. Test basic understanding, not edge cases.
- **Anchored in news**: every question relates directly to the news article.
- **Visual teaches**: the visual is not decoration — it should explain a concept that's harder to convey in text.
- **Print-ready**: the document must work as a handout without any editing.

---

## PART 2: DOCUMENT STRUCTURE (2 PAGES)

### Page 1: Article + Visual + Questions

```
┌─────────────────────────────────┐
│  Headline (navy, 16pt bold)     │
│                                 │
│  ┌─────────────────────────────┐│
│  │     VISUAL / GRAPH          ││
│  │   (full content width)      ││
│  └─────────────────────────────┘│
│                                 │
│  Article text (2 short paras)   │
│  Source + date (italic, gray)   │
│                                 │
│  ┌─ Vragen ───────────────────┐│
│  │ (domain banner)            ││
│  └────────────────────────────┘│
│  a) Question 1                  │
│  b) Question 2                  │
│  c) ...                         │
│  d) ...                         │
│  e) ...                         │
│                                 │
│                       Pagina 1  │
└─────────────────────────────────┘

[PAGE BREAK]

┌─────────────────────────────────┐
│  ┌─ Antwoordmodel ────────────┐│
│  │ (domain banner)            ││
│  └────────────────────────────┘│
│  a) Answer 1                    │
│  b) Answer 2                    │
│  c) ...                         │
│                                 │
│                       Pagina 2  │
└─────────────────────────────────┘
```

### Priority rules
1. **First priority**: excellent visual that teaches
2. **Second priority**: everything fits on page 1
3. If the visual is large and valuable, questions MAY overflow to page 2 (before the answers). Never shrink a good visual to force a fit.

---

## PART 3: PAGE SETUP

Use tight margins (from econ-word-templates):

```javascript
const PAGE_TIGHT = {
  size: { width: 11906, height: 16838 },
  margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 },
};
const CW_TIGHT = 9638; // content width in DXA
```

**Image width**: always full content width = **482pt** (6.69 inches). Calculate height from SVG aspect ratio.

---

## PART 4: CONTENT GUIDELINES

### Headline
- Short, punchy, newspaper-style
- In Dutch
- Max ~10 words
- Should make a student curious

### Visual
- **Always included** — this is "nieuws met visual", the visual is mandatory
- Follow the `economic-graph` skill for technical specs
- Types of visuals (vary across documents):
  - Supply/demand graph with shift
  - Cost curves (MK/GTK)
  - Flowchart (cause → effect → response)
  - Comparison diagram (before/after)
  - Horizontal bar chart (ranking)
  - Stacked bar (price breakdown)
  - Two-column trade diagram
- Must be understandable in 5 seconds without explanation
- Use simple vocabulary in labels — avoid advanced terms students haven't learned
- Use the project color palette (see economic-graph skill)

### Article
- 60-120 words in 2 short paragraphs
- Simple, clear Dutch
- Only facts the student needs for the questions
- Make the link to the economic topic immediately clear
- End with source + date

### News selection criteria
- Recent (prefer last 30 days, accept last 12 months)
- Dutch or for-Netherlands-relevant context
- Clearly relevant to the paragraaf topic
- Concrete, not too abstract
- Not politically complex or requiring specialist knowledge
- From reliable Dutch sources (NOS, NRC, Volkskrant, RTL, CBS, CPB, ACM, etc.)

### Questions
- **4-8 questions** with ascending difficulty
- Types to include:
  - Fill-in: stijgt/daalt, meer/minder, hoger/lager
  - Cause-effect chain
  - One short explanation ("Leg uit...")
  - One simple calculation (if it fits naturally)
  - One concept application ("Gebruik het begrip...")
  - One reference to the visual ("Bekijk de grafiek/visual...")
- All questions anchored in the news article
- Avoid essay-length answers
- Avoid large difficulty jumps
- Avoid questions that require knowledge beyond the paragraaf topic

### Answer key
- Short, clear answers (1-2 sentences max)
- For closed questions: just the answer
- For calculations: show the work briefly
- For explanations: model answer in 1 sentence
- Match every question exactly

---

## PART 5: FORMATTING

### Typography (follows econ-word-templates)

| Element | Font | Size | Color |
|---------|------|------|-------|
| Headline | Arial Bold | 16pt (size 32 half-pts) | navy #1E2761 |
| Article text | Arial | 11pt (size 22) | dark #2D3748 |
| Source | Arial Italic | 9pt (size 18) | gray #718096 |
| Question label (a, b, c) | Arial Bold | 11pt (size 22) | domain color |
| Question text | Arial | 11pt (size 22) | dark #2D3748 |
| Answer label | Arial Bold | 11pt (size 22) | domain color |
| Answer text | Arial | 11pt (size 22) | dark #2D3748 |
| Domain banner title | Arial Bold | 12pt (size 24) | domain dark |

### Domain colors per chapter

| Chapter | Domain | Color | Light | Dark |
|---------|--------|-------|-------|------|
| H1 Markten | teal | #17A2B8 | #E8F8FB | #117A8B |
| H2 Marktvormen | blue | #1A5276 | #EBF5FB | #154360 |
| H3 Overheid | amber | #E67E22 | #FEF5E7 | #BA6A1C |
| H4 Internationale markten | green | #1E8449 | #E8F8F0 | #186A3B |

### Section banners
Use the domain banner from econ-word-templates for "Vragen" and "Antwoordmodel" sections:
- Left accent bar (12pt) in domain color
- Light domain background
- Bold title in domain dark color

### Headers and footers
- Header (right-aligned, gray): `X.Y.Z [Naam] – Nieuws met visual`
- Footer (centered, gray): `Pagina [number]`

---

## PART 6: BUILD TEMPLATE

```javascript
async function buildNieuws(config) {
  // config = {
  //   paragraafNr: "X.Y.Z",
  //   naam: "Monopolie",
  //   headline: "KPN verhoogt prijzen...",
  //   svg: "<svg ...>...</svg>",        // SVG string for the visual
  //   svgRenderWidth: 720,              // pixels to render SVG at
  //   article: ["paragraph 1", "paragraph 2"],
  //   source: "Bron: NOS, maart 2025",
  //   questions: ["vraag a", "vraag b", ...],
  //   answers: ["antwoord a", "antwoord b", ...],
  // }

  const ch = config.paragraafNr.substring(0, 3);
  const dc = CHAPTER_COLORS[ch];

  // 1. Render SVG → PNG
  const pngBuf = await svgToPng(config.svg, config.svgRenderWidth || 720);

  // 2. Build document:
  //    - Headline (16pt bold navy)
  //    - Image (full content width, 482pt)
  //    - Article paragraphs (11pt)
  //    - Source (9pt italic gray)
  //    - Domain banner "Vragen"
  //    - Questions (a, b, c... with domain-colored labels)
  //    - [PAGE BREAK]
  //    - Domain banner "Antwoordmodel"
  //    - Answers

  // Image dimensions:
  const IMG_WIDTH_PT = 482; // full CW_TIGHT
  const aspectRatio = svgHeight / svgWidth; // from viewBox
  const IMG_HEIGHT_PT = Math.round(IMG_WIDTH_PT * aspectRatio);
}
```

---

## PART 7: QA CHECKLIST

### Content
1. Is the news recent and relevant for the Netherlands?
2. Is the link to the economic topic immediately clear?
3. Is the visual understandable in 5 seconds?
4. Does the visual teach something (not just decorate)?
5. Are there 4-8 questions with ascending difficulty?
6. Does at least one question reference the visual?
7. Does the answer key match every question exactly?
8. Is the language accessible for VWO bovenbouw?

### Layout
9. Is the visual full content width (482pt / 6.69 inches)?
10. Does page 1 contain: headline + visual + article + questions?
11. Does page 2 contain only the answer key?
12. Are there exactly 1 page break (before antwoordmodel)?
13. Are domain banners used for "Vragen" and "Antwoordmodel"?
14. Is the domain color correct for the chapter?

### Visual quality (see economic-graph skill)
15. Are economic graphs correct? (curves, equilibria, labels)
16. Are all axis labels present?
17. Does the visual use only palette colors?
18. Is text in the visual at least font-size 10?

### Print quality
19. Would this work as a classroom handout without editing?
20. Is there enough whitespace? Not cramped?

**If any answer is "no", fix before delivering.**

---

## NEVER DO

- Create a nieuws document without a visual
- Make the visual smaller than the text width
- Use more than 120 words in the article
- Include questions that aren't anchored in the news article
- Use advanced economic terms students haven't learned in this paragraaf
- Put the answer key on page 1
- Skip the domain banner for Vragen/Antwoordmodel sections
- Use a headline longer than ~10 words
- Include political opinions or controversial framing
- Create questions requiring essay-length answers

---

Apply this skill to the following task: $ARGUMENTS
