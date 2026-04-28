# CP-1 Vocabulary Decision Table

Generated: 2026-04-28T21:18:06.045Z

| Field | Meaning | Decision Needed |
|---|---|---|
| `required_units` | Micro-teaching-unit IDs required by an exercise or exam question | Approve as canonical successor to current `required_skills` usage |
| `exercise_operations` | Fine-grained learner actions inside an exercise | Approve |
| `skill_tags` or `skill_category_tags` | Broader taxonomy labels | Choose one name |
| `instructional_role` | What the exercise is for in authored learning flow | Approve separate field |
| `assessment_role` | How the exercise relates to the exam/evidence graph | Approve separate field and decide nullability |
| `scaffolding.verbal_level` | Verbal support level, integer 0-5 | Approve |
| `scaffolding.visual_stage` | Visual support stage, integer 1-4 | Approve |
| `scaffolding.fading_position` | Position in fading sequence | Approve |
| `scaffolding.dual_coding_present` | Whether dual coding is present | Approve |

## Recommendation

Approve the naming triple:

```text
required_units
exercise_operations
skill_tags
```

Keep `required_skills` as a legacy/source field until an explicit migration is approved.
