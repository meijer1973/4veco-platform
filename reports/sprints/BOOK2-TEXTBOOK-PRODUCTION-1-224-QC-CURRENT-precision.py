"""Read-only specialist DOM/geometry and separately attested personal evidence.

No native generation, source repair or automatic visual verdict. Personal notes
are the actual actor's completed view_image observations, not script inference.
"""
import argparse, base64, importlib.util, json, re, sys, xml.etree.ElementTree as ET
from pathlib import Path
from bs4 import BeautifulSoup
P=Path(__file__).resolve().parents[2];L=P.parent/'4veco-lessen'
PREFIX='BOOK2-TEXTBOOK-PRODUCTION-1-224-QC-CURRENT'
spec=importlib.util.spec_from_file_location('qc224',P/'reports/sprints'/(PREFIX+'-controller.py'))
c=importlib.util.module_from_spec(spec);spec.loader.exec_module(c);E=c.E
N='{http://www.w3.org/2000/svg}'

OBSERVATIONS=[
 'Four goals, notebook answer construction, prior retrieval and complete paper route are clear; no internal architecture/device dependency.',
 'Source A, figure1/full caption and question1 together. Old20/100 and new22/80 readable on common zero scales; no Ev or revenue-answer labels.',
 'Source B, figure2/full caption and question2 together. 10/100 to15/60 with supplied interval Ev; no joined demand line. Owner claim and requested qualification complete.',
 'Income and named separate telescope/filter sources fit; boundary cases0/1 explicit. Deliberate lower whitespace preserves next source E block, not a blank page.',
 'Annual-income/monthly-quantity function and reset question clear. Four-direction table remains unanswered; two-source advice and costs caveat present.',
 'Optional help starts with worked percentage and blanks, reduces to conceptual/named-denominator/reset cues, then ends before question6/target. Neutral framing.',
 'Frozen sourceA exact table and target1–3 readable; given Ev and unchanged appscore retained, no unsupported monthly revenue period.',
 'Frozen sourcesB/C exact tables and combined four-point question4 fit. Long competitor label stays in its cell; no answer leak.',
 'Frozen sourceD annualY/monthlyQ and target5/6 kept together. Sparse lower page is source-grouping rhythm, not clipped or missing content.',
 'Bonus four scenarios200/220/204/224 and evaluative prompt complete; two retrieval tasks and self-correction end the pupil edition. Wrapped table header legible.',
 'Answer1 has full signed percentages, Ev−2 and TO2000→1760/−12%, units, excluded rating and four assessment criteria.',
 'Answer figure3 has old/new rectangles, amount/change annotation and full P×Q-not-slope caption on one page; self-explaining reinforcement after full calculation.',
 'Answer2 fully explains exact factors1.5×0.6=0.9, whole interval versus conditional local rule and absence of a universal small threshold; four criteria clear.',
 'Answer figure4 visibly matches sourceB and1000→900/factor0.9; full caption denies an inferred local elasticity between observations. All labels and leader endpoints clear.',
 'Answers3/4 give strict Ei0/1 exclusion and signed named-goods Ek with correct separate price24, not sourceA22. Complete criteria and readable paragraphs.',
 'Answer5 shows termwise annualY substitution,200→220 and reset204 versus200, fixed variables and all six criteria. Dense page remains readable and unclipped.',
 'Answer6 four local directions, cautious two-source example, alternative admissible sources and cost limit all visible. Optional-help answer notes complete, not hidden below footer.',
 'Target answers1–4 complete,14-point heading correct, no unasked calculation award in1, signed Budget and named competitor denominator explicit. Dense but legible.',
 'Target answers5/6 show14200→14400/month with annualY, no extra Ei/Ek/Pc operation; exactly two unsupported claims and actual two-source use required.',
 'Bonus has four distinct criteria including controlled comparison and model limit. Closing answers use old25 and undefined Ei at zero denominator; no new theory.',
 'Native figure1: aligned common-zero panels; old dashed and new hatching meaningful in gray.22/80/100 leaders clear; no revenue result, demand curve or axis arrows.',
 'Native figure2: old10×100/new15×60 rectangles exact; 60 tick is clear without duplicate label. Gray patterns distinguish states; no invented connecting line.',
 'Native figure3: same sourceA geometry with answer-only2000→1760/−12% annotation; top right annotation has visible outer margin, not clipped.',
 'Native figure4: same sourceB geometry with1000→900 and1.5×0.6=0.9 answer annotation; full width text, leaders and hatching legible in gray.'
]

def personal():
    original=c.read(E/'224-view-inventory.json');rows=[]
    assert len(original['views'])==len(OBSERVATIONS)==24
    for row,note in zip(original['views'],OBSERVATIONS):
        assert c.digest(row['path'])==row['raw_sha256'] and c.digest(row['gray_path'])==row['gray_sha256']
        rows.append({**row,'personal_observation':note,'color_personally_inspected':True,'grayscale_personally_inspected':True,'visible_student_defects':0})
    c.save(E/'224-personal-inspection.json',{'actor':c.ACTOR,'role':'independent224specialistQC','created':c.now(),'native_manifest_sha256':original['manifest_sha256'],'initial_inventory_sha256':c.digest(E/'224-view-inventory.json'),'actual_independent_views':48,'all_pages_color_and_gray':20,'all_native_figures_color_and_gray':4,'display_limit':'Full-page PNG1241x1754 displayed with detail original. Native2400x1800 full PNG requested original; tool downscaled display to1824x1368, not a crop. Native geometry/font measurements separately verify original pixels and placed scale. No physical print or learner observation.','native_PENDING_manifests_untouched':True,'transferred_prior_views':0,'views':rows})

def precision(commit,manifest):
    c.guard(commit);c.release_guard();c.native_guard();b=c.builder();folder=L/b.LESSON_REL;record=b.target_record();rows=[];neg=[]
    normalize=lambda s:' '.join(s.split())
    def required(text,clauses,counts=None):
        for clause in clauses:
            if normalize(clause) not in normalize(text):raise ValueError('Missing/misleading required clause: '+clause)
            if counts is not None and normalize(text).count(normalize(clause))!=counts[clause]:raise ValueError('Changed required occurrence count: '+clause)
    source=c.raw(P/'build-scripts/content/book-2/224/exercises.md').decode()
    answers=c.raw(P/'build-scripts/content/book-2/224/answers.md').decode()
    targetanswers=c.raw(P/'build-scripts/content/book-2/224/target-answers.md').decode()
    groups=[('pupil',source,[
      'Iedere bron is een eigen vergelijking, geen volgende stap in één tijdlijn.',
      'geen getekende vraaglijn tussen de punten.',
      'de gemeten elasticiteit over het hele interval',
      'een goed met Ei = 0 en een goed met Ei = 1.',
      'De eigen prijs van de filterverhuringen',
      'Y is het gemiddelde **jaarinkomen** in euro.',
      'Begin vervolgens opnieuw bij de beginsituatie.',
      'kleine lokale prijsverandering',
      'Geef Sterrenplek vervolgens een voorzichtig omzetadvies met bron A **of** B én bron D **of** E.',
      'Gebruik daadwerkelijk een uitkomst of verband uit beide bronnen.',
      'Deze hulp verandert de vragen en hun punten niet.',
      'Bij vraag 6 en de volgende doeloefening kies je zelf de aanpak.',
      'Gebruik ook de uitkomst 204 in je uitleg.',
      'Bij gelijkblijvend inkomen stijgt de prijs met 10%']),
      ('answers',answers,['geen universeel percentage','geen categorie','Vergelijk met **200**, niet met 220','vier afzonderlijke criteria','0%']),
      ('target answers',targetanswers,['geen maand- of jaartotaal','geen extra Ei- of Ek-berekening','minstens twee bronnen','Een bron alleen noemen'])]
    # Fixed semantic-clause tests complement, not replace, the complete reading.
    # Mutations are in-memory actual source copies, never live pupil files.
    for name,text,clauses in groups:
        required(text,clauses)
        counts={clause:normalize(text).count(normalize(clause)) for clause in clauses}
        for clause in clauses:
            # Work on normalized actual text, so wrapping is not mistaken for semantics.
            for replacement in ('','ONJUISTE ALGEMENE GARANTIE'):
                altered=normalize(text).replace(normalize(clause),replacement,1)
                try:required(altered,clauses,counts)
                except ValueError:neg.append({'source':name,'clause':clause,'mutation':replacement or 'missing','rejected':True})
                else:raise AssertionError('Semantic fixture escaped')
    for kind in ('opgaven','antwoorden'):
        md=folder/f'{b.STEM} – {kind}.md';soup=BeautifulSoup(c.raw(md.with_suffix('.html')).decode(),'html.parser')
        assert c.raw(md)==(b.documents(record)[kind].rstrip()+'\n').encode()
        text=soup.get_text(' ',strip=True)
        if kind=='opgaven':
            t=record['target_exercise'];required(text,[*record['lesson_goals'],t['context'],*[q['prompt'] for q in t['subquestions']],*[s['content'] for s in t['sources']]])
            actualtables=[[[cell.get_text(' ',strip=True) for cell in row.find_all(['td','th'])] for row in table.find_all('tr')] for table in soup.find_all('table')]
            for s in t['sources']:
                if s.get('type')=='table':assert [s['columns'],*[[str(v) for v in row] for row in s['rows']]] in actualtables
            assert [q['points'] for q in t['subquestions']]==[2,2,2,4,2,2]
        figures=[]
        for f in soup.find_all('figure'):
            img=f.find('img');cap=f.find('figcaption');alt=img.get('alt','');caption=cap.get_text(' ',strip=True)
            assert alt.startswith('Omzet') and 0<len(alt)<=120 and caption.startswith('Figuur ')
            assert alt!=caption and cap.get('aria-hidden')!='true'
            png=base64.b64decode(img['src'].split(',',1)[1]);found=[]
            for n in range(1,5):
                svg=folder/'_assets'/f'2.2.4_ex_{n}.svg'
                if c.sha(png)==c.digest(svg.with_suffix('.png')):
                    assert ET.fromstring(c.raw(svg)).find(N+'title').text==alt;found.append(n)
            assert len(found)==1 and found[0] in ((1,2) if kind=='opgaven' else (3,4))
            figures.append({'figure':found[0],'actual_alt':alt,'alt_characters':len(alt),'actual_full_caption':caption,'embedded_png_sha256':c.sha(png)})
        assert len(figures)==2
        rows.append({'edition':kind,'actual_HTML_sha256':c.digest(md.with_suffix('.html')),'figures':figures,'tables':len(soup.find_all('table'))})
    geometry=[]
    for n in range(1,5):
        tree=ET.fromstring(c.raw(folder/'_assets'/f'2.2.4_ex_{n}.svg'))
        rects=[[float(node.attrib[k]) for k in ('x','y','width','height')] for node in tree.findall(N+'rect') if node.attrib.get('data-role')=='revenue']
        expected=[[100,310,300,320],[700,278,240,352]] if n in (1,3) else [[100,470,300,160],[700,390,180,240]]
        assert rects==expected
        assert all(node.attrib['font-size']=='40' for node in tree.findall(N+'text'))
        assert all('marker-end' not in node.attrib for node in tree.iter())
        geometry.append({'figure':n,'actual_revenue_rectangles':rects,'Q_scale_px_per_unit':3,'P_scale_px_per_unit':16,'font_source_px':40,'font_source_pt':30,'placed_width_mm':166,'placed_label_pt':40*166*72/25.4/1200})
    def lum(hexcolor):
        channel=[int(hexcolor[i:i+2],16)/255 for i in (1,3,5)]
        channel=[x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in channel]
        return sum(x*w for x,w in zip(channel,[.2126,.7152,.0722]))
    contrasts=[]
    for fg,bg in [('#2D3748','#FFFFFF'),('#7B2D8E','#FFFFFF'),('#7B2D8E','#F3EBF5')]:
        a,d=sorted([lum(fg),lum(bg)]);ratio=(d+.05)/(a+.05);assert ratio>=4.5
        contrasts.append({'foreground':fg,'background':bg,'ratio':ratio})
    crspec=importlib.util.spec_from_file_location('native224check',P/'build-scripts/content/book-2/224/check_render.py');cr=importlib.util.module_from_spec(crspec);crspec.loader.exec_module(cr)
    actual=cr.check(L,manifest,rebuild=False)
    c.save(E/'224-precision.json',{'status':'PASS','actor':c.ACTOR,'own_helper_sha256':c.digest(__file__),'actual_source_HTML':rows,'independent_rectangles_font_and_contrast':geometry,'contrasts':contrasts,'actual_semantic_clause_negatives':neg,'frozen_target_exact_sources_prompts_tables_goals':True,'native_checker_attribution':'Unchanged source-bound checker freshly executed read-only; all font ink, segment clearances, PDF text/margins, actual HTML placement records follow. It does not supply personal judgment.','native_readonly_measurements':actual})
    print(json.dumps({'status':'PASS','semantic_negatives':len(neg),'DOM_figures':sum(len(r['figures']) for r in rows),'native_checker_pages':sum(len(d['pages']) for d in actual['documents'])}))

def parity():
    old=c.read(P/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-224-REVIEW-evidence/224-parity.json');routes=[]
    normalize=lambda rows:[{k:v for k,v in row.items() if k!='path'} for row in rows]
    for label,revision in [('full','r10'),('thin','r11'),('direct','r12'),('checker','r13')]:
        path=E/f'224-{label}-{revision}-finished.json';row=c.read(path)
        assert row['status']=='PASS' and row['native_files']==c.native_expected()
        assert normalize(row['pages'])==normalize(old['page_sets'][0])
        assert row['figure_pixels']==old['actual_figure_pixels_per_route']
        routes.append({'label':label,'revision':revision,'finished_sha256':c.digest(path),'manifest_sha256':row['manifest_sha256'],'native_files':15,'raw_and_RGB_pages':20,'raw_and_RGB_figures':4})
    c.save(E/'224-four-route-parity.json',{'status':'PASS','published_comparator_sha256':c.digest(P/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-224-REVIEW-evidence/224-parity.json'),'routes':routes,'manual_restore_or_copy':False,'new_checker_native_route_is_additional':True})

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('action',choices=['personal','precision','parity']);ap.add_argument('--controller-commit',required=True);ap.add_argument('--manifest',type=Path);a=ap.parse_args();c.guard(a.controller_commit)
    if a.action=='personal':personal()
    elif a.action=='precision':precision(a.controller_commit,a.manifest)
    else:parity()
