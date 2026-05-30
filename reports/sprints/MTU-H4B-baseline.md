# Sprint MTU-H4B: Baseline

Date: 2026-05-30

## Plan reference

This baseline supports `reports/sprints/MTU-H4B-plan.md`.

## Baseline snapshot

| Surface | State |
|---|---|
| Live MTU count | 250 |
| `A71` | absent, held by prior graphical-foundation review |
| `A80` | absent |
| `A81` | absent |
| `A96` | absent |
| `A97` | absent |
| `A98` | absent |
| `A99` | absent |
| `A100` | absent and invalid under `^[A-L][0-9][0-9]$` ID policy |
| Target exercise records | 54 |
| Target records with `question_type` | 0 |
| Target records with `answer_form` | 0 |
| Answer-skill candidate storage | absent |
| Exam-code registry check | `A2.1`, `A1.7`, `A4.2`, `A1.3`, `A1.9`, `A1.1`, and `A1.5` are present in `references/external/syllabus-eindtermen.json` |

## Gate baseline

GATE-MTU-H4A closed as PASS WITH CONDITIONS for CLI-mutation planning only. It
authorized MTU-H4B to prepare a later bounded execution packet for accepted
lanes only and authorized no execution, storage creation, field mutation,
projection refresh, lesson output, or product use.

## Data integrity notes

Protected reference data in `references/machine/` and `references/external/`
must not be hand-edited during this sprint. H4B may read those surfaces and may
simulate validation against them, but it must not mutate the MTU catalog,
syllabus registry, generated projections, target-exercise mappings, candidate
storage, or lesson output.

## Baseline command

```bash
node -e "const fs=require('fs'); const units=JSON.parse(fs.readFileSync('references/machine/micro-teaching-units.json','utf8')); const targets=JSON.parse(fs.readFileSync('references/authored/course-target-exercises.json','utf8')); const unitRows=Array.isArray(units)?units:(units.units||[]); const ids=['A71','A80','A81','A96','A97','A98','A99','A100']; const byId=new Map(unitRows.map(u=>[u.id,u])); const targetRecords=Array.isArray(targets)?targets:(targets.target_exercises||targets.exercises||[]); const qType=targetRecords.filter(r=>Object.prototype.hasOwnProperty.call(r,'question_type')).length; const ansForm=targetRecords.filter(r=>Object.prototype.hasOwnProperty.call(r,'answer_form')).length; const candidatePath='references/data/exam-ingestion/answer-skill-candidates.json'; const eind=JSON.parse(fs.readFileSync('references/external/syllabus-eindtermen.json','utf8')); const eindRows=Array.isArray(eind)?eind:(eind.eindtermen||eind.items||[]); const eindCodes=new Set(eindRows.map(x=>x.code||x.id).filter(Boolean)); const codes=['A2.1','A1.7','A4.2','A1.3','A1.9','A1.1','A1.5']; console.log(JSON.stringify({unit_count:unitRows.length,id_presence:Object.fromEntries(ids.map(id=>[id,byId.has(id)])),target_record_count:targetRecords.length,target_question_type_fields:qType,target_answer_form_fields:ansForm,candidate_storage_exists:fs.existsSync(candidatePath),exam_code_validation:Object.fromEntries(codes.map(c=>[c,eindCodes.has(c)]))},null,2));"
```

## Baseline JSON

```json
{
  "unit_count": 250,
  "id_presence": {
    "A71": false,
    "A80": false,
    "A81": false,
    "A96": false,
    "A97": false,
    "A98": false,
    "A99": false,
    "A100": false
  },
  "target_record_count": 54,
  "target_question_type_fields": 0,
  "target_answer_form_fields": 0,
  "candidate_storage_exists": false,
  "exam_code_validation": {
    "A2.1": true,
    "A1.7": true,
    "A4.2": true,
    "A1.3": true,
    "A1.9": true,
    "A1.1": true,
    "A1.5": true
  }
}
```
