"""Attach this QC reviewer's actual full-page observations to exact files.

Not an automatic visual approval: OBSERVATIONS were authored only after this
distinct specialist personally viewed every listed full page and figure.
"""
import hashlib
import json
import math
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[2]
LESSONS = ROOT.parent/'4veco-lessen'
sys.path.insert(0, str(ROOT/'build-scripts/content/book-2'))
import b2_221
PREFIX = ROOT/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-QC-r7'
OBSERVATIONS = {
    'paragraaf': [
        'Four goals, old-base explanation and full old/new table are legible. Dense first page still has intact rows, margins and footer separation.',
        'Signed common-zero percentage bars, caption and positive-base/nonzero-change condition box are all readable; minus signs, units and paired calculations agree.',
        'Wrong/correct sign-versus-magnitude warning is prominent. Both magnitude panels show threshold1 and classifications, with the bottom caption and footer distinct.',
        'Local-observation and causal-proof limits lead coherently to the worked context. Bowlplein steps1-2 and signed calculations finish before the next-page figure.',
        'Bowlplein computed/given-only figure, steps3-5 and all five recap bullets are intact. The placed labels, including Klimhal caveat, remain readable.',
        'Start page visibly gives the short route and optional support instruction; both numbered tasks and all1a-c prompts are intact. No timing label remains.',
        'Neutral extra-help/continuation/skip note, repair table and printed four-step reminder stay with3a-c; formulas and final prompt are unclipped.',
        'Arcade/pool comparison table and4a-d retain one fading cue. Independent5a-d is complete; its final two-line prompt clears the footer and has no time label.',
        'Exact Nova/StreamNow context and6a-d are together with9total and3/2/2/2points. No diagram or added scaffold; nine-minute instruction absent.',
        'Bonus7 and both closing tasks8-9 remain readable with short-route/homework notes. Conditional substitute and ceteris-paribus wording is complete.',
    ],
    'opgaven': [
        'Worked-example context and steps1-3, full two-part figure and caption fit. Given-only Klimhal warning is readable; continuation to step4 is coherent.',
        'Worked steps4-5 lead to complete five-point recap, then Start heading and1-2. Task2 remains above the footer; Start timing is absent.',
        'The extra-help note, old/new table, printed reminder and3a-c are grouped. Skip and continuation instructions are clear and nonnumeric.',
        'Full task4 table/contrast and full independent5 fit, including final5d above footer. Independent instruction requests work without time pressure.',
        'Target6 shows all source observations, a-d and9points intact. No numeric timing or additional help has entered the frozen target.',
        'Bonus7 and closing8-9 preserve every instruction and question, including both separate demand-factor cases. Notes use korte route and homework without time labels.',
    ],
    'antwoorden': [
        'Answer-after-attempt note and1a-c/2 are clear. Guided3 steps1-4 remain intact; step5 continues as a whole next-page paragraph.',
        'Guided3 meaning, all arcade/pool calculations and explanations, then independent5 steps1-3 are legible with signed ratios and footers intact.',
        'Independent5 classification/meaning/context and target6a-c marking steps are complete. Frozen compact answer line wraps visibly after slash without lost symbols.',
        'Target6d causal-limit scoring is one intact block. Bonus model and three criteria, reversal arithmetic and both umbrella answers remain readable above footer.',
    ],
}
FIGURE_OBSERVATIONS = {
    '2.2.1_fig_1': 'Personally viewed full PNG. Price bars share +10% and solid fill; quantity bars are hatched -5%/-20%, with common zero and scale. Direct labels carry meaning without colour.',
    '2.2.1_fig_2': 'Personally viewed full PNG. Two equally scaled panels explicitly distinguish signed Ev from nonnegative magnitude. Bars .5 and2 agree with dashed1 thresholds and text.',
    '2.2.1_we_1': 'Personally viewed full PNG. Top signed percentages25/-10 are distinct from bottom magnitudes.4/1.5; given-only Klimhal warning avoids invented percentages. No collisions.',
}

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def pin(path):
    raw = path.read_bytes()
    return {'path':str(path.relative_to(ROOT.parent)).replace('\\','/'),
            'raw_sha256':digest(path),
            'lf_sha256':hashlib.sha256(raw.decode('utf-8-sig').replace('\r\n','\n').replace('\r','\n').encode()).hexdigest()}

def luminance(color):
    channels = [int(color[i:i+2],16)/255 for i in (1,3,5)]
    channels = [v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in channels]
    return sum(a*b for a,b in zip(channels,[.2126,.7152,.0722]))

def main():
    manifest = json.loads(Path(str(PREFIX)+'-diagnostic-manifest.json').read_text(encoding='utf-8'))
    render = json.loads(Path(str(PREFIX)+'-render-check.json').read_text(encoding='utf-8'))
    probes = json.loads(Path(str(PREFIX)+'-probes.json').read_text(encoding='utf-8'))
    assert render['byte_identical_rebuild'] and probes['status']=='PASS'
    folder = LESSONS/b2_221.LESSON_REL
    documents=[]
    for rec in manifest['documents']:
        kind = Path(rec['source_pdf']).stem.rsplit(' – ',1)[1]
        proofdir = Path(rec['proof_directory'])
        pm = json.loads((proofdir/'manifest.json').read_text(encoding='utf-8'))
        assert pm['inspection_status']=='PENDING' and pm['pages_inspected']==[]
        assert pm['pdf_sha256']==rec['pdf_sha256']==digest(Path(rec['source_pdf']))
        assert len(OBSERVATIONS[kind])==len(pm['rendered_pages'])
        pages=[]
        for n,(relative,observation) in enumerate(zip(pm['rendered_pages'],OBSERVATIONS[kind]),1):
            page=proofdir/relative
            assert digest(page)==pm['page_sha256'][page.name]
            pages.append({'page':n,'path':str(page.relative_to(ROOT)).replace('\\','/'),
                'raw_sha256':digest(page),'view_method':'individual full-page view_image, not contact sheet or inherited claim',
                'status':'PASS','observation':observation})
        documents.append({'kind':kind,'pdf_raw_sha256':rec['pdf_sha256'],
            'manifest_raw_sha256':digest(proofdir/'manifest.json'),
            'original_manifest_status':'PENDING, unchanged','pages':pages})
    figures=[]
    for name,observation in FIGURE_OBSERVATIONS.items():
        svg=folder/'_assets'/f'{name}.svg'
        png=svg.with_suffix('.png')
        tree=ET.fromstring(svg.read_text(encoding='utf-8'))
        title=next(e.text for e in tree.iter() if e.tag.endswith('title'))
        assert 0<len(title)<=120
        bars=[]
        for element in tree.iter():
            a=element.attrib
            if 'data-value' in a:
                value,scale,zero=(float(a[k]) for k in ('data-value','data-scale','data-zero'))
                assert math.isclose(float(a['width']),abs(value)*scale)
                assert math.isclose(float(a['x']),zero+min(0,value)*scale)
                bars.append({'value':value,'scale':scale,'zero':zero,'x':float(a['x']),'width':float(a['width'])})
        figures.append({'name':name,'svg_raw_sha256':digest(svg),'png_raw_sha256':digest(png),
            'visible_status':'PASS','observation':observation,'exact_bars':bars,
            'accessible_title':title,'accessible_title_length':len(title),
            'short_description_status':'REVISE: imperative title' if name=='2.2.1_fig_1' else 'PASS'})
    assert sum(len(f['exact_bars']) for f in figures)==10
    contrasts=[]
    for label,fg,bg in [('ink on white','#182b3a','#ffffff'),('ink on callout','#182b3a','#eef4f7'),
                       ('ink on table header','#182b3a','#eaf1f5'),('blue heading and bar','#1A5276','#ffffff'),
                       ('footer','#555555','#ffffff'),('caption','#304958','#ffffff')]:
        values=sorted([luminance(fg),luminance(bg)])
        ratio=(values[1]+.05)/(values[0]+.05)
        assert ratio>=4.5
        contrasts.append({'role':label,'foreground':fg,'background':bg,'ratio':round(ratio,3),'minimum':4.5,'status':'PASS'})
    grayscale=[]
    for n in (2,3,5):
        path=ROOT/f'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-QC-r7-grayscale-page-{n:03}.png'
        grayscale.append({'page':n,'path':str(path.relative_to(ROOT)).replace('\\','/'),'raw_sha256':digest(path),
            'source_pdf_raw_sha256':documents[0]['pdf_raw_sha256'],'render':'fresh Poppler pdftoppm -gray -png -r150 -singlefile',
            'status':'PASS','observation':'Personally viewed whole grayscale page. Figure labels, signs, zero/threshold, bars, text/callout and footer remain readable; hue is not required.'})
    html=[]
    for kind in OBSERVATIONS:
        path=folder/f'{b2_221.STEM} – {kind}.html'
        soup=BeautifulSoup(path.read_text(encoding='utf-8'),'html.parser')
        alts=[im.get('alt','') for im in soup.find_all('img')]
        assert all(0<len(alt)<=120 for alt in alts)
        assert all(table.find('thead') and table.find('th') for table in soup.find_all('table'))
        html.append({'kind':kind,'alt_texts':alts,'semantic_tables':len(soup.find_all('table')),
            'semantic_headings':len(soup.find_all(re.compile('^h[1-6]$'))),
            'structure_status':'PASS; adjacent prose supplies full numerical and conceptual figure descriptions',
            'short_description_status':'REVISE: figure1 imperative is not noun-first' if kind=='paragraaf' else 'PASS'})
    assert html[0]['alt_texts'][0]=='Vergelijk de procentuele reacties op dezelfde schaal.'
    assert figures[0]['accessible_title']=='Vergelijk de procentuele prijs- en hoeveelheidsveranderingen met teken'
    evidence={'schema_version':1,'task':'BOOK2-TEXTBOOK-PRODUCTION-1-221-R7-QC','reviewer':'paragraph_221_r7_specialist_qc',
        'date':'2026-09-05','verdict':'REVISE','unresolved_blockers':1,
        'separation':'Distinct from R7 builder and paragraph reviewer. One specialist personally applied teacher, student, visual/accessibility and testing lenses; no separately staffed role claim.',
        'platform_base':'298c9e359e27d63c8950c4fc7e93491173c2b0fd','lessons_base':'73e552fb83bc3a79b9bec1f15bd3919af2a5ea0b',
        'paragraph_review':pin(folder/'2.2.1-review.md'),
        'paragraph_plan':pin(folder/'2.2.1-textbook-plan.md'),'chapter_plan':pin(folder.parent/'_chapter-plan.md'),
        'historical_handoff_unchanged':pin(folder/'2.2.1-textbook-handoff.md'),
        'target_record_sha256':b2_221.TARGET_HASH,
        'findings':[{'id':'B2-221-R7-ALT-01','classification':'required_revision',
            'requirement':'agents/accessibility-agent.md:63-72 noun-first functional short alt text',
            'source_locations':['build-scripts/content/book-2/221/theory.md:48','build-scripts/content/book-2/b2_221.py:158'],
            'actual_descriptions':['Vergelijk de procentuele reacties op dezelfde schaal.',
                                   'Vergelijk de procentuele prijs- en hoeveelheidsveranderingen met teken'],
            'defect':'Both start with imperative Vergelijk rather than a noun-phrase description of the visual.',
            'blocks':'Fresh R7 specialist quality acceptance and quality-ref promotion',
            'does_not_block':'Passing frozen target, teaching route, visible mathematics/layout and reproducibility evidence; no source edit by QC',
            'proof_to_close':'Builder supplies a noun-first explicit Markdown alt attribute while retaining the visible caption, updates the figure1 SVG title to a descriptive noun phrase, regenerates affected output, and receives renewed independent paragraph and specialist acceptance.'}],
        'sources_and_invariants':probes,'render_and_rebuild':render,'documents':documents,'figures':figures,
        'grayscale':grayscale,'contrasts':contrasts,'html_semantics':html,
        'native_pdf_text':'Text extracted and verified without OCR; no fabricated OCR-confidence score.',
        'digital_boundary':'No interactive controls in Part A; keyboard/Part B and full PDF/UA certification not claimed.',
        'timing':{'core':48.5,'with_support':58.5,'with_all_optional':71.5,'observed':False},
        'optional_inspectie_mapping':'omitted; protected reference refresh is separate governed follow-up',
        'role_reports':'BOOK2-TEXTBOOK-PRODUCTION-1-221-QC-r7-report.md'}
    Path(str(PREFIX)+'-inspection.json').write_text(json.dumps(evidence,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
    print(json.dumps({'overall_verdict':'REVISE','finding':'B2-221-R7-ALT-01','visible_page_checks':'PASS','personally_viewed_full_pages':20,'figures':3,'fresh_grayscale_pages':3,'exact_bars':10,'contrasts':contrasts,'paragraph_review':evidence['paragraph_review']},ensure_ascii=False,indent=2))

if __name__=='__main__':
    main()
