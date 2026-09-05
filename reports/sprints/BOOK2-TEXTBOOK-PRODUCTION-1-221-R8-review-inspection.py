"""Bind this reviewer's already completed personal full-page observations."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PREFIX = ROOT/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-R8-'
data = json.loads(Path(str(PREFIX)+'review-probes.json').read_text(encoding='utf-8'))
notes = {
    'paragraaf': [
        'Opening problem, four goals, old-base reminder and full four-row comparison table fit with clear footer separation.',
        'Signed common-scale bars, all percentages and full original caption readable; ratio box retains conditions and dimensionless-result explanation.',
        'Negative sign explanation, explicit wrong/correct warning, unit boundary and both classification panels legible; caption remains above footer.',
        'No-slope and bounded-mechanism teaching clear; worked example starts with observations then quantity-before-price percentages, without stranded heading.',
        'Complete worked figure and caption, steps3-5 and all five recap bullets fit; zero and threshold one, given-only Klimhal notice and footer distinct.',
        'Printed short route, attempt-before-answer check and fresh teacher follow-up legible; all Start1a-c and Start2 visible with no numeric timing.',
        'Neutral optional support, entire old/new table and four-step reminder stay together; first quantity calculation and three guided prompts intact.',
        'Arcade/pool table and reduced cue clear; independent5a-d complete and unscaffolded; final5d is close to bottom but remains fully above footer with no overlap.',
        'Exact Nova/StreamNow target occupies one page: context, four subquestions,3/2/2/2 points and total9 all visible; no inserted graph or hint.',
        'Bonus7 and closing8-9 complete; optional/homework boundaries visible; substitute assumption and final question not clipped.'
    ],
    'opgaven': [
        'Exercise edition begins full Bowlplein context and steps1-3; computed/given figure and full caption readable; bottom ratio explanation clear.',
        'Worked steps4-5 lead directly into five-bullet recap then Start; printed route and all Start1a-c/2 fit above footer.',
        'Guided task3 full table, reminder and quantity-first scaffold readable; neutral skip and continuation/homework directions present.',
        'Full arcade/pool comparison followed by independent5; last5d remains visible above footer without clipping or overlap.',
        'All frozen target context and four point-bearing prompts retained as one block; no timing label or student extra scaffold.',
        'Complete bonus and two accessible earlier-learning tasks with own-price versus substitute-price distinction; no loss at page end.'
    ],
    'antwoorden': [
        'Answer-after-attempt note, full Start answers, misconception correction and repair steps1-4 readable; continuation occurs between steps.',
        'Repair step5 then all arcade/pool calculations and explanations; independent steps1-3 reach page end with no missing ratio or glyph.',
        'Independent5b-d continue coherently; exact target6a-c and marking allocations intact, including explicit quantity-before-price route before frozen short answer.',
        'Target6d remains intact with two-point explanation; bonus evaluation criteria and both closing answers complete, including leftward umbrella demand shift.'
    ]
}
assert len(data['pages']) == sum(map(len, notes.values())) == 20
pages = []
for page in data['pages']:
    number = int(Path(page['page']).stem.rsplit('-',1)[1])
    assert hashlib.sha256(Path(page['fresh_path']).read_bytes()).hexdigest() == page['raw_sha256']
    pages.append({**page, 'page_number':number, 'personally_viewed_full_page':True,
                  'normal_reading_scale':True, 'visible_defects':[], 'observation':notes[page['edition']][number-1]})
fig_notes = {
    '2.2.1_fig_1':'Personally viewed whole PNG: positive price bars share zero and scale with hatched negative quantity bars; +10/-5 and +10/-20 labels, axis and full text are clear.',
    '2.2.1_fig_2':'Personally viewed whole PNG: equal0-2 magnitude scales and labelled threshold1 distinguish0.5 from2; sign is preserved in Ev labels, not misused for classification.',
    '2.2.1_we_1':'Personally viewed whole PNG: +25/-10 signed bars and ratio-0.4 coherent; lower0.4/1.5 comparison has clear zero/threshold and explicit no-invented-percentages Klimhal note.'
}
output = {'reviewer':'paragraph_221_r8_independent_review','date':'2026-09-05','revision':'R8',
          'status':'PASS','specialist_QC':'NOT_PERFORMED','method':'Personal full-page view of every fresh150dpi page, not inherited page acceptance or a contact-sheet-only check.',
          'pages':pages,'figures':[{**f,'personally_viewed':True,'observation':fig_notes[f['stem']]} for f in data['figures']],
          'documents':[{**r, 'proof_manifest_sha256':hashlib.sha256((Path(r['proof_directory'])/'manifest.json').read_bytes()).hexdigest()}
                       for r in data['bindings'] if 'source_pdf' in r],
          'grayscale':[{**g,'personally_viewed':True,'observation':'Whole grayscale page personally viewed. Direct labels, signs, zero/threshold ticks and hatching preserve every required distinction without colour alone; no illegibility or clipping.'} for g in data['grayscale']],
          'generation_manifests':'Remain PENDING and unmodified; this distinct observation record supplies only paragraph-review visual evidence.',
          'OCR':'Not applicable: native text PDFs; no confidence statistic fabricated.',
          'limits':['Classroom timing/attainment unobserved','Not specialist acceptance, root handoff, PDF/UA or screen-reader certification']}
Path(str(PREFIX)+'review-inspection.json').write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print('Bound20 personal page observations,3 personally viewed figures and3 personally viewed grayscale pages to exact hashes.')
