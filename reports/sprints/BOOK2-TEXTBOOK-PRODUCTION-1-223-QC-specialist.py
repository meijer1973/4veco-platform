"""HOW TO ADAPT: use a new prefix and independently inspect the actual images.

This file binds this actor's completed personal observations; it does not infer
inspection from rendering. Mathematical probes are independently derived from
the four current authored sources, not copied from the native test functions.
"""
import argparse
from fractions import Fraction as F
import importlib.util
import json
from pathlib import Path
import re
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
PREFIX = 'BOOK2-TEXTBOOK-PRODUCTION-1-223-QC'
spec = importlib.util.spec_from_file_location('qc223', Path(__file__).with_name(PREFIX + '-check.py'))
qc = importlib.util.module_from_spec(spec)
spec.loader.exec_module(qc)
n = qc.native

OBSERVATIONS = {
 'paragraaf': [
  'Two-line title, hook, four goals and printed retrieval fit; income heading includes introduction, not stranded.',
  'Income table and signed common-zero bars readable; hatching distinguishes Q from Y; signs and full caption survive grayscale.',
  'Three definitions, open zero/one boundaries, strict inequalities and Ev contrast readable; visible full caption remains useful, separate HTML alt defect.',
  'Named cross-elasticity definition and table fit; cell wrapping contained; complete pre-figure explanation.',
  'Two labeled fraction panels, fixed own prices and warning readable; function introduction with units fits below.',
  'Annual-income coefficient is not Ei and no divide-by-twelve warning clear; substitution recall and complete income examples fit.',
  'Worked cross ratios and function steps one/two plus whole three-row table fit; unit headers wrap inside cells.',
  'Scenario reset figure shows 200/230/204 and fixed/changed labels; steps three-five and reset warning fit without collision.',
  'Five-item recap immediately precedes Start; six short parts and neutral feedback route complete.',
  'Optional help and exercise three fade from supplied first calculation to named-goods cue; all four parts readable.',
  'Exercise four partial terms and percent frames then faded exercise five complete; annual and monthly units preserved.',
  'Independent exercise six whole four-row controlled table and all questions fit; supplied combined 215 not an inferred observation.',
  'Independent seven two Ei/two Ek and complete function eight all together; no omitted givens or clipping.',
  'Exact target nine, three sources and five questions 3/2/4/4/3 fit on one page; income reset and 16-point label clear.',
  'Evaluative bonus and two closing retrieval questions complete and separated; no extra theory or compulsory-device route.'
 ],
 'opgaven': [
  'Worked examples one/two complete; example-three givens end cleanly; title/footer fit.',
  'Worked function steps one/two, three-row table and full reset figure fit; 200/230/204 correspondence and fixed/changed labels readable.',
  'Worked steps three-five, reset warning and complete five-item recap fit; summary is not misplaced.',
  'Start one/two all six parts, neutral short route and feedback complete; intentional lower whitespace, not a blank page.',
  'Optional help banner and exercise three complete; sign reminder and faded named-goods cues readable in grayscale.',
  'Exercises four/five full givens and reset questions fit; partial arithmetic scaffold fades; no footer collision.',
  'Independent six full four-row table and four questions fit; header units and combined row remain distinct in grayscale.',
  'Independent seven/eight complete with controlled conditions, units and reset; normal text size and comfortable separation.',
  'Whole 16-point target and all sources/a-e fit; no answer leakage or clipped final fixed-input instruction.',
  'Bonus and closing eleven/twelve fully readable; optional/homework labels and separation preserved.'
 ],
 'antwoorden': [
  'Rounding/units opening and all Start one/two answers fit; signed percentages, multiplication order and named goods explicit.',
  'All exercise-three ratios and exercise-four 160/180/162 model fit; .625 to .63 and fixed-input reset legible.',
  'Exercise-five 200/220/205 and exercise-six controlled/combined explanations complete; no bottom clipping despite dense page.',
  'Exercise-seven named Ek goods and exercise-eight 180/200/184 with exact 5/9 are readable; no premature rounding.',
  'Target a-c models and criteria fit; 3+2+4 scoring and bold numerator/denominator goods readable.',
  'Target d-e complete: 390/420/392, 100/13 percent and 10/13 Ei; reset, unchanged inputs and 4+3 criteria visible.',
  'Bonus strong model and all four substantive criteria present; closing Ev=-.5/Ei undefined and 40/42 answers fit.'
 ],
 'figure': [
  'Full native common-zero bars show +10 income, +15/-5/+5 quantity on one linear scale; Y/Q labels and hatching preserve meaning in grayscale.',
  'Full native signed Ei axis has correctly placed -.5/.5/1.5, open 0/1 and strict categories; not an absolute-Ev axis; all glyphs and labels readable.',
  'Full native two fraction panels name quantity and other-price goods; +.5 substitute and -.2 complement, own prices fixed; no color-only relationship.',
  'Full native three scenario panels correctly show 200/230/204 and reset Y=30000; fixed/changed words, annual/monthly units and all ink fit.'
 ]
}


def inspection():
    binding = n.read('grayscale-binding')
    assert binding['generated_only'] and binding['personal_inspection'] == 'PENDING'
    rows, counts = [], {k: 0 for k in OBSERVATIONS}
    for row in binding['rows']:
        kind = row['kind']
        i = counts[kind]
        source = Path(row['source']) if kind == 'figure' else ROOT / row['source']
        gray = ROOT / row['grayscale']
        assert n.sha(source.read_bytes()) == row['source_sha256']
        assert n.sha(gray.read_bytes()) == row['grayscale_sha256']
        rows.append({**row, 'page_or_figure': i + 1, 'color_personally_inspected': True,
                     'grayscale_personally_inspected': True, 'reviewer_observation': OBSERVATIONS[kind][i],
                     'printed_visual_verdict': 'PASS'})
        counts[kind] += 1
    assert counts == {'paragraaf': 15, 'opgaven': 10, 'antwoorden': 7, 'figure': 4}
    n.save('personal-inspection', {
        'actor': 'paragraph_214_builder', 'role': 'independent223specialistQC', 'date': '2026-09-06',
        'method': 'Personally opened all full native PNG files with view_image(detail=original), color and grayscale separately; no contact sheets or inferred inspection.',
        'presentation_limit': 'Viewer resampled the full figure canvases 1/3/4 slightly for display; no content cropped. Raw and decoded native pixels were separately checked mechanically.',
        'counts': counts, 'page_views': 64, 'figure_views': 8, 'rows': rows,
        'native_manifests': 'Unmodified PENDING with pages_inspected=[]; personal inspection is this separate record.',
        'printed_visual_verdict': 'PASS', 'html_accessibility_verdict': 'REVISE B223-ALT-01',
        'root_validation': 'PENDING', 'root_acceptance': 'PENDING'})


def mathematics():
    rows = []
    def check(label, value, expected, meaning):
        assert value == F(expected), (label, value, expected)
        rows.append({'case': label, 'exact': str(value), 'decimal': float(value), 'meaning': meaning})
    for label, numerator, denominator, expected, meaning in [
        ('theory Ei picknick; W1',15,10,'3/2','luxury; positive >1'),
        ('theory Ei lunch; W1',-5,10,'-1/2','inferior; signed negative'),
        ('theory Ei notebooks',5,10,'1/2','normal; 0<Ei<1'),
        ('theory Ek digital film',10,20,'1/2','Q digital film / P disc rental; substitutes'),
        ('theory Ek fitted covers',-4,20,'-1/5','Q covers / P disc rental; complements'),
        ('W2 Ek digital books',10,20,'1/2','Q digital / P paper books; substitutes'),
        ('W2 Ek fitted covers',-5,20,'-1/4','Q covers / P paper books; complements'),
        ('Start1 Ev',-10,20,'-1/2','own price denominator; opposite direction'),
        ('Start2 Ei',-2,10,'-1/5','inferior'),
        ('Start2 Ek',5,10,'1/2','Q subscription / P loose puzzle; substitutes'),
        ('G3 premium Ei',12,8,'3/2','luxury'),('G3 budget Ei',-4,8,'-1/2','inferior'),
        ('G3 portable Ek',10,20,'1/2','Q portable / P console; substitutes'),
        ('G3 controller Ek',-8,20,'-2/5','Q fitted controller / P console; complements'),
        ('I7 walk Ei',8,5,'8/5','luxury'),('I7 paper route Ei',-2,5,'-2/5','inferior'),
        ('I7 rechargeable Ek',3,10,'3/10','Q rechargeable / P battery lantern; substitutes'),
        ('I7 battery Ek',-4,10,'-2/5','Q fitted batteries / P lantern; complements'),
        ('T9a meal Ei',8,5,'8/5','luxury'),('T9a noodle Ei',-3,5,'-3/5','inferior'),
        ('T9c tea Ek',4,10,'2/5','Q tea / P coffee; substitutes'),
        ('T9c filter Ek',-6,10,'-3/5','Q filter / P coffee; complements'),
        ('Closing11 Ev',-5,10,'-1/2','Ei unavailable because income denominator is zero')]:
        check(label, F(numerator, denominator), expected, meaning)
    for label, constant, price, cross, ycoef, px, pz, y, yn, pzn, expected in [
        ('W3',80,-2,'1','.005',20,10,30000,36000,14,(200,230,204,'3/4')),
        ('G4',90,-2,'.5','.005',20,20,20000,24000,24,(160,180,162,'5/8')),
        ('G5',120,-2,'1','.004',15,10,25000,30000,15,(200,220,205,'1/2')),
        ('I8',90,-2,'1','.005',10,10,20000,24000,14,(180,200,184,'5/9')),
        ('T9de',100,-2,'.5','.01',10,20,30000,33000,24,(390,420,392,'10/13'))]:
        def q(z, income): return F(constant) + price*px + F(cross)*z + F(ycoef)*income
        old, income, other = q(pz,y), q(pz,yn), q(pzn,y)
        qpct, ypct = (income-old)/old*100, F(yn-y,y)*100
        for suffix,value,target in [('base',old,expected[0]),('income',income,expected[1]),('reset_other_price',other,expected[2]),('Ei',qpct/ypct,expected[3])]:
            check(label+' '+suffix,value,target,'Separate comparisons against original baseline; annual Y remains annual, Px fixed.')
        rows.append({'case': label+' percentage bases', 'quantity_percent_exact':str(qpct),'income_percent_exact':str(ypct),
                     'income_delta':str(income-old),'other_price_delta':str(other-old),'coefficient_is_not_Ei':True})
    check('Start1 substitution',F(60-2*8),44,'Multiply before subtraction; units per week.')
    check('Closing12 baseline',F(40-2*5+10),40,'Reservations per week; Px=5 fixed.')
    check('Closing12 new',F(40-2*5+12),42,'Only other price changes.')
    check('I6 income isolated delta',F(210-200),10,'Pz=20 and Px fixed; supplied controlled table.')
    check('I6 other price isolated delta',F(205-200),5,'Y=30000 and Px fixed.')
    check('I6 combined supplied delta',F(215-200),15,'Both Y/Pz changed; cannot attribute whole result to Y or assert general causality.')
    check('Target points',F(sum([3,2,4,4,3])),16,'All five frozen prompts, with method, classification, named goods, resets and reasons.')
    check('Core minutes',F(sum([2,11,8,2,6,14,11])),54,'Design estimate only, unobserved; one minute below 55.')
    check('Core plus support',F(54+15),69,'Continuation/homework needed; not a 55-minute claim.')
    check('All optional work',F(54+15+8+4),81,'Includes bonus and retrieval; unobserved.')
    inputs = {str(p.relative_to(ROOT)): n.sha(p.read_bytes()) for p in (ROOT/'build-scripts/content/book-2/223').glob('*.md')}
    assert len(inputs) == 4
    n.save('independent-mathematics', {'pass':True,'actor':'paragraph_214_builder','role':'independent223specialistQC',
        'method':'Independent rational recomputation from complete four-source reading; result matching against rendered/source models is personal semantic review.',
        'source_sha256': inputs, 'rows':rows, 'Ei_boundaries':'Ei<0 inferior; 0<Ei<1 normal; Ei>1 luxury; exactly 0 and 1 left unclassified; no necessity judgment.',
        'bonus_four_criteria':['Bound model/observation validity, not universal future elasticity','No necessity/value category from Ei','Hold own and other price fixed for income comparison','Explain why simultaneous changes do not isolate income'],
        'zero_denominator':'Percent input change must be nonzero; closing11 Ei undefined, not zero.',
        'no_new_extension':'No MO=MK optimum, no compulsory function-derived Ek in target e, no dividing annual Y by twelve.',
        'classroom_observed':False})


def finding():
    from bs4 import BeautifulSoup
    rows=[]
    for kind in n.KINDS:
        path=n.DEST/f'{n.builder.STEM} – {kind}.html'
        data=path.read_text(encoding='utf-8')
        soup=BeautifulSoup(data,'html.parser')
        for img in soup.find_all('img'):
            alt=img.get('alt','')
            if not any(x in alt for x in ['Zoek eerst','Vergelijk afzonderlijke']): continue
            figure=img.find_parent('figure')
            rows.append({'repository':'4veco-lessen','path':(n.builder.LESSON_REL/path.name).as_posix(),
                'line':next(i for i,line in enumerate(data.splitlines(),1) if f'alt="{alt}"' in line),
                'sha256':n.sha(path.read_bytes()),'image_source':img['src'],'actual_alt':alt,
                'caption_exact_text':figure.find('figcaption').get_text(), 'alt_length':len(alt)})
    assert len(rows)==3
    source_rows=[]
    for rel in ['build-scripts/content/book-2/223/theory.md','build-scripts/content/book-2/223/exercises.md']:
        path=ROOT/rel
        for i,line in enumerate(path.read_text(encoding='utf-8').splitlines(),1):
            if line.startswith('![') and ('Figuur 2:' in line or 'Figuur 4:' in line):
                source_rows.append({'repository':'4veco-platform','path':rel,'line':i,'exact':line,'sha256':n.sha(path.read_bytes())})
    svgs=[]
    for i in range(1,5):
        path=n.DEST/f'_assets/2.2.3_fig_{i}.svg'
        root=ET.fromstring(path.read_bytes())
        svgs.append({'figure':i,'sha256':n.sha(path.read_bytes()),'title':root.find('{http://www.w3.org/2000/svg}title').text,
                     'viewBox':root.attrib['viewBox']})
    n.save('blocking-finding',{'id':'B223-ALT-01','verdict':'REVISE','occurrences':rows,'source_occurrences':source_rows,'svg_records':svgs,
        'why':'Actual img alternatives 2 and 4 tell the reader to search/compare but do not identify the figure representation. Shortness and a valid SVG title do not repair the actual external-image HTML alternative.',
        'required_semantics':{'figure2':'Concise noun-first functional description of signed Ei scale, strict categories and open 0/1 boundaries.',
                              'figure4':'Concise noun-first functional description of three separate input scenarios returning to the same baseline.'},
        'preserve':'Keep full visible captions, all printed teaching/target/answers, geometry, fonts and figure semantics. Author explicit source alternatives and regenerate native outputs; independently verify exact delta.',
        'other_alts':'Figures1/3 describe income-response comparison and named cross-ratios; no additional blocking defect identified. Metadata boolean was a narrow imperative screen, not an automated semantic accessibility certification.',
        'reviewer_did_not_repair':True})


def print_invocation():
    n.save('print-invocation', {'record_type':'Post-execution transcription of actual tool invocation; no fabricated timestamps or captured streams.',
        'command':['C:/Python314/python.exe','reports/sprints/'+PREFIX+'-check.py','print'], 'cwd':str(ROOT),
        'path_first':'C:/msys64/mingw64/bin','exit_code_observed':0,
        'implementation':'File-backed Python entrypoint calls native.reproduce(print), shared build_document, deterministic_zip and render_proof directly in process; no inline node -e.',
        'reservation':{'file':PREFIX+'-print-reservation.json','sha256':n.sha((n.OUT/(PREFIX+'-print-reservation.json')).read_bytes())},
        'manifest':{'file':PREFIX+'-print-manifest.json','sha256':n.sha((n.OUT/(PREFIX+'-print-manifest.json')).read_bytes())},
        'parity':{'file':PREFIX+'-print-parity.json','sha256':n.sha((n.OUT/(PREFIX+'-print-parity.json')).read_bytes())},
        'limit':'Outer stdout was delivered in the tool transcript, not captured as a subprocess stream; function results and full command are durably bound here.'})


def post_qc():
    original=n.read('baseline')
    actual=n.folder()
    changes=[p for p in actual if actual[p]!=original['paragraph_files'].get(p)]
    assert set(actual)==set(original['paragraph_files']) and changes==['2.2.3-quality-ref.yaml']
    assert n.sources()==original['source_binding']
    for rec in original['imports']:
        assert n.sha((ROOT/rec['path']).read_bytes())==rec['sha256']
    for mode in ['full','thin','print']:
        for rec in n.read(mode+'-parity')['documents']:
            m=ROOT/rec['directory']/'manifest.json'
            assert n.sha(m.read_bytes())==rec['manifest_sha256']
            value=json.loads(m.read_text(encoding='utf-8'))
            assert value['inspection_status']=='PENDING' and value['pages_inspected']==[]
    assert actual['2.2.3-review.md']=='793c8460e7d20e8a2e40d7e8912c969c94a091e67fa25566c812264c8769539e'
    n.save('post-qc-integrity',{'pass':True,'unchanged_non_qc_lesson_files':24,'only_changed':changes,
        'qc_sha256':actual[changes[0]],'all288_imports_exact':True,'old_and_new_native_manifests':'PENDING unchanged',
        'canonical_review_sha256':actual['2.2.3-review.md'],'handoff':'ABSENT','root_acceptance':'PENDING'})
    for profile in ['student-web','publisher-print']:
        n.command('post-qc-'+profile,['node','scripts/validate-paragraph.js','--mode','part-a','--profile',profile,str(n.DEST)])


def custody():
    manifests=[]
    for path in sorted(n.PROOF.glob('223-*-r*/manifest.json')):
        data=json.loads(path.read_text(encoding='utf-8'))
        assert data['inspection_status']=='PENDING' and data['pages_inspected']==[]
        for filename,digest in data['page_sha256'].items():
            assert n.sha((path.parent/'pages'/filename).read_bytes())==digest
        manifests.append({'path':path.relative_to(ROOT).as_posix(),'sha256':n.sha(path.read_bytes()),'pages':len(data['page_sha256'])})
    assert len(manifests)==12 and sum(r['pages'] for r in manifests)==128
    parity=n.read('print-log2-print-parity')
    assert parity['pass'] and parity['native_files']==20 and parity['pages']==32
    assert n.read('print-complete-process-r2')['exit_code']==0
    assert n.read('print-complete-process')['exit_code']==1
    assert n.read('print-log-print-reservation')['suffix']=='r17'
    assert n.read('print-log2-print-reservation')['suffix']=='r18'
    prior=[]
    for pattern,start,end in [('1.1.2*paragraaf.md',1,54),('1.2.3*paragraaf.md',126,154)]:
        paths=list(n.LONG.glob('Boek 1*/*/*/'+pattern))
        assert len(paths)==1
        prior.append({'path':paths[0].relative_to(n.LONG).as_posix(),'sha256':n.sha(paths[0].read_bytes()),'personally_read_lines':[start,end]})
    files={p.relative_to(ROOT).as_posix():n.sha(p.read_bytes()) for p in n.OUT.glob(PREFIX+'*') if p.is_file()}
    n.save('custody',{'pass':True,'native_manifests':manifests,'pending_manifests':12,'immutable_generated_pages':128,
        'personally_inspected_pages':'Only all32 r14 pages, each in color and grayscale; later identical pages are parity evidence, not extra claimed personal views.',
        'prior_source_checks':prior,'own_evidence_files':files,
        'qc_sha256':n.sha((n.DEST/'2.2.3-quality-ref.yaml').read_bytes()),
        'report_sha256':n.sha((n.OUT/(PREFIX+'-report.md')).read_bytes()),
        'source_binding':n.sources(),'specialist_verdict':'REVISE','root_acceptance':'PENDING'})


if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('mode',choices=['inspection','math','finding','print-invocation','post-qc','print-logged','print-logged-inner','custody'])
    mode=p.parse_args().mode
    if mode=='print-logged':
        n.command('print-complete-process-r2',[sys.executable,'reports/sprints/'+PREFIX+'-specialist.py','print-logged-inner'])
    elif mode=='print-logged-inner':
        # Own baseline remains the original file; only the fresh print outputs get
        # a distinct label. No overwritten reservation, log or proof manifest.
        n.PREFIX=PREFIX+'-print-log2'
        n.read=lambda label: json.loads((n.OUT/f'{PREFIX}-{label}.json').read_text(encoding='utf-8'))
        n.reproduce('print')
    else:
        {'inspection':inspection,'math':mathematics,'finding':finding,'print-invocation':print_invocation,'post-qc':post_qc,'custody':custody}[mode]()
