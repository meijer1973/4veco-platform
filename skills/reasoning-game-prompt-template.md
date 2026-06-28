---
name: reasoning-game-prompt-template
description: Template for asking an agent or reviewer to build or repair an economics reasoning game from paragraph reasoning grammar.
pipeline: "shared infrastructure"
---

# Reasoning Game Prompt Template

Use this when asking an agent or reviewer to build or repair an economics reasoning game.

```markdown
Use `skills/econ-reasoning-game.md`.

Paragraph:
Source material:
Target exercise:

Reasoning target:
Central misconception:
Source/evidence type:
Required answer form:
Prior knowledge:
What the game must not test:

Selected archetype:
Selected golden exemplar(s):
Why this exemplar product grammar fits:
How the paragraph reasoning grammar is re-derived:

Task loop:
1. student action / response shape / local repair / evaluator / feedback
2. student action / response shape / local repair / evaluator / feedback
3. student action / response shape / local repair / evaluator / feedback

Required shared task actions:
Required new shared capability, if any:
Negative fixtures:
Rendered proof states:
Specialist reviews:
Authority boundary:
```

Reject the task if it asks to copy an exemplar mechanic without deriving the paragraph reasoning grammar.
