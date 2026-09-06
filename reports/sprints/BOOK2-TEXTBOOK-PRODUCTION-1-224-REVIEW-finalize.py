"""HOW TO ADAPT: attributed reviewer observations and immutable review bindings.

This does not perform or invent visual inspection. The observations below were
written by the actual reviewer after viewing every listed color/gray image.
Generated evidence is exclusive-create; no source or generation proof is edited.
"""
import base64, importlib.util, json, re, sys, xml.etree.ElementTree as ET
from pathlib import Path
from bs4 import BeautifulSoup

P=Path(__file__).resolve().parents[2]; L=P.parent/'4veco-lessen'
PREFIX='BOOK2-TEXTBOOK-PRODUCTION-1-224-REVIEW'
E=P/'reports/sprints'/(PREFIX+'-evidence')
spec=importlib.util.spec_from_file_location('review_controller',P/'reports/sprints'/(PREFIX+'-controller.py'))
c=importlib.util.module_from_spec(spec);spec.loader.exec_module(c)
b=c.b

OBS=[
 'Title wraps cleanly; four goals, complete notebook answer route, old-base reminder, optional help, independent target and closing are readable. Dense but coherent orientation.',
 'Sterrenplek sources are separate comparisons. Figure1 old20/100 and new22/80 has matched week units; service score remains a source-selection distractor. Caption and complete question1 stay together; no computed answer is supplied.',
 'Figure2 old10/100 and new15/60 is legible. Given interval Ev=-0.8, full no-joined-curve caption and whole local-versus-finite question2 share the page.',
 'Income source and Ei0/1 boundaries pair with question3. Independent telescope-price20-to24 and filter quantities pair with complete question4; no accidental reuse of A22. Bottom space is intentional notebook format.',
 'Annual Y and monthly Q are explicit. Full original/reset question5 and four blank conditional direction rows plus two-source question6 remain complete; no answers prefilled.',
 'Printed help is neutrally optional. One Q percentage is worked for question1, followed by blanks; questions2-5 fade to shorter cues. Question4 explicitly requires percentage numerator and denominator. Question6 and target have no help frames.',
 'Exact StreamPlus context and sourceA cells, including unchanged appscore and supplied Ev, precede complete questions1-3. No missing source or answer leakage.',
 'Exact sourceB/C cells include Premium15, Budget-4, competitor8-to9 and Q+5. Target question4 is on this page with its sources, not orphaned.',
 'Annual-income function sourceD and complete target questions5/6 stay together. No extra Ei, reset or graph-production demand has been inserted. Large lower space does not hide content.',
 'All four bonus rows200/220/204/224 are visible. Evaluative controlled-versus-combined claim and model boundary, both closing tasks and self-check fit without overflow.',
 'A signed percentages, Ev=-2, classification, TO2000-to1760/-12% and four scoring criteria are together. The following-page answer figure is supplementary, not a missing calculation or isolated heading.',
 'Answer figure3 uses the same A geometry. Header A and 2000-to1760/week/-12% annotation are separated and readable; full caption matches the figure. Large figure continuation is intentional.',
 'B1000-to900/-10%, factor1.5 times0.6=0.9 and complete conditional local-versus-finite explanation plus all four criteria are readable together.',
 'Answer figure4 uses the same B geometry with readable1000-to900 and factor0.9 annotation. Caption correctly denies a local-elasticity inference from the two observations.',
 'C Ei0.5 is normal with strict0/1 exclusions. D names quantity-good and other-price-good and computes percent ratio-0.5/complements. Both complete two-point rubrics fit.',
 'E complete term substitutions yield200,220 and204. Annual Y is not divided by12; coefficient is not Ei. Original200 reset, fixed inputs, +20 subscriptions/month and all six criteria are clear.',
 'All four local direction rows, cautious two-source advice and cost/profit limitation are complete. Optional help feedback retains corrected percentage ratio. Dense page remains readable.',
 'Exact frozen answers1-4 and criteria are complete: TO500000-to516000 without invented period, Premium1.875, Budget-0.5 and Ek0.4. Magnitude versus signed classification remains distinct.',
 'Target5 retains annual Y, fixed prices and14200-to14400. Target6 gives actual sources and exactly two unsupported conclusions; the complete rubric is legible.',
 'Bonus model distinguishes controlled20 from combined24 and gives four explicit criteria plus model-not-causal-forecast boundary. Both closing models (-20% from old25; Ev-0.5 and undefined Ei) are readable.',
 'Native telescope figure: exact common zero scales, old20/100 dashed versus new22/80 solid/hatch. Guide values100/80 and22 do not collide with ticks. Complete axis nouns/units are readable; no solution values.',
 'Native binocular figure: exact common zero scales, old10/100 versus new15/60;15 guide and60 main tick are distinct. No invented connecting demand curve.',
 'Native answer A figure: original geometry is retained; header/amount band does not crowd the plot. Amounts2000-to1760/week/-12% are legible and consistent with widths/heights.',
 'Native answer B figure: original geometry is retained; amount/factor band1000-to900 and1.5 times0.6=0.9 is readable without axis collisions.'
]

def main():
    inventory=E/'224-view-inventory.json'; rows=json.loads(inventory.read_text(encoding='utf8'))['views']
    assert len(rows)==len(OBS)==24
    observations=[]
    for row,note in zip(rows,OBS):
        assert b.digest(Path(row['path']))==row['raw_sha256']
        assert b.digest(Path(row['gray_path']))==row['gray_sha256']
        observations.append({**row,'observation':note,'color_personally_inspected':True,'grayscale_personally_inspected':True,
          'grayscale_observation':'Same full content readable in grayscale; no clipping, overlap, glyph loss or color-only essential distinction. Dashed/solid/hatch and named states remain distinct where figures occur.',
          'visible_blocking_defects':0})
    personal={'actor':'paragraph_231_specialist_qc','role':'distinct paragraph reviewer, not author or specialist QC',
      'inspection_mode':'Actual view_image full-page and native-image calls; all48 views completed before this record; not contact-sheet inference.',
      'display_limit':'Pages1241x1754 viewed at useful full-page reading scale. Native2400x1800 images displayed1824x1368; not a1:1pixel or physical-printer claim.',
      'inventory_raw_sha256':b.digest(inventory),'generation_manifests':'Unchanged PENDING; this separate attributed record supplies actual observations.',
      'page_color_views':20,'page_grayscale_views':20,'native_color_views':4,'native_grayscale_views':4,'observations':observations}
    c.write_new(E/'224-personal-inspection.json',personal)
    # Preserve exact legacy bytes before any canonical edit, also against Git.
    legacy=L/b.LESSON_REL/'2.2.4-review.md'; raw=legacy.read_bytes()
    assert raw==c.git(L,'show',c.LBASE+':'+legacy.relative_to(L).as_posix())
    with (E/'224-legacy-review.md').open('xb') as stream:stream.write(raw)
    c.write_new(E/'224-legacy-review-binding.json',{'repository':'4veco-lessen','path':legacy.relative_to(L).as_posix(),
      'commit':c.LBASE,'raw_sha256':b.sha(raw),'bytes':len(raw),'raw_base64':base64.b64encode(raw).decode(),
      'supersession':'Historical target-form PASS preserved, not a current rendered paragraph acceptance.'})
    # Independent literal checks of all target fields against actual HTML/MD,
    # not merely calling the author's serialization routine.
    record=b.target_record(); serialized=json.dumps(record,ensure_ascii=False,separators=(',',':')).encode()
    assert b.sha(serialized)=='4e0840ddf202ce4906ee05cd4dde97c0f3577885c34f0b9613ea18760aad7519'
    folder=L/b.LESSON_REL; soups={k:BeautifulSoup((folder/f'{b.STEM} – {k}.html').read_text(encoding='utf8'),'html.parser') for k in ['opgaven','antwoorden']}
    texts={k:' '.join(s.get_text(' ',strip=True).split()) for k,s in soups.items()}
    norm=lambda t:' '.join(str(t).split())
    target=record['target_exercise']; fields=[*record['lesson_goals'],target['context']]
    fields += [s['content'] for s in target['sources']]
    fields += [q['prompt'] for q in target['subquestions']]
    assert len(record['lesson_goals'])==4 and [q['points'] for q in target['subquestions']]==[2,2,2,4,2,2]
    for value in fields:assert norm(value) in texts['opgaven'],value
    table_rows=[]
    for table in soups['opgaven'].find_all('table'):
        table_rows.append([[norm(cell.get_text(' ',strip=True)) for cell in row.find_all(['th','td'])] for row in table.find_all('tr')])
    for source in target['sources']:
        if source.get('type')=='table':
            expected=[[norm(x) for x in source['columns']],*[[norm(x) for x in row] for row in source['rows']]]
            assert expected in table_rows,source['id']
    for answer in record['short_answer_model'].values():assert norm(answer) in texts['antwoorden'],answer
    dom=[]
    for kind,soup in soups.items():
        for figure in soup.find_all('figure'):
            alt=figure.img['alt'];caption=norm(figure.figcaption.get_text(' ',strip=True))
            assert 0<len(alt)<=120 and not re.match(r'(?i)^(bekijk|bereken|vergelijk|lees|zie|let|gebruik)\b',alt)
            assert figure.figcaption.get('aria-hidden')!='true'
            dom.append({'edition':kind,'alt':alt,'alt_characters':len(alt),'complete_visible_caption':caption})
    svg=[]
    for number in range(1,5):
        path=folder/'_assets'/f'2.2.4_ex_{number}.svg'; tree=ET.fromstring(path.read_bytes())
        title=tree.find('{http://www.w3.org/2000/svg}title').text
        assert title==b.TITLES[number-1] and 0<len(title)<=120
        assert not re.match(r'(?i)^(bekijk|bereken|vergelijk|lees|zie|let|gebruik)\b',title)
        rectangles=[]
        prices,quantities=((20,22),(100,80)) if number in [1,3] else ((10,15),(100,60))
        for node,p,q,x in zip([n for n in tree.findall('{http://www.w3.org/2000/svg}rect') if n.get('data-role')=='revenue'],prices,quantities,[100,700]):
            values=[float(node.get(k)) for k in ['x','y','width','height']]
            assert values==[x,630-16*p,3*q,16*p]
            rectangles.append(values)
        assert len(rectangles)==2
        svg.append({'figure':number,'title':title,'rectangles':rectangles,'raw_sha256':b.digest(path)})
    def lum(color):
        channels=[int(color[i:i+2],16)/255 for i in [1,3,5]]
        linear=[x/12.92 if x<=0.04045 else ((x+0.055)/1.055)**2.4 for x in channels]
        return sum(x*w for x,w in zip(linear,[.2126,.7152,.0722]))
    contrast=[]
    for foreground,background in [('#2D3748','#FFFFFF'),('#7B2D8E','#FFFFFF'),('#7B2D8E','#F3EBF5')]:
        ratio=(max(lum(foreground),lum(background))+.05)/(min(lum(foreground),lum(background))+.05)
        assert ratio>=4.5
        contrast.append({'foreground':foreground,'background':background,'ratio':ratio})
    checks={'status':'PASS','target_sha256':b.sha(serialized),'entire_original_order_target':record,
      'literal_goals_context_sources_prompts_and_model_verified':True,'all_target_tables_exact_ordered_cells':True,
      'dom_figures':dom,'svg_geometry':svg,'essential_contrast':contrast,
      'pale_fill_limit':'The old pale fill alone has no claimed contrast compliance; dark boundary, names and dashed versus solid/hatch carry all essential distinctions.',
      'placed_label_pt':40*166/1200*72/25.4,'independent_native_pdf_ua_or_assistive_technology_test':False}
    c.write_new(E/'224-target-dom-geometry.json',checks)
    manifest=json.loads((E/'224-full-r7-manifest.json').read_text(encoding='utf8'))
    bindings={'actor':'paragraph_231_specialist_qc','input_pair':{'platform':c.PBASE,'lessons':c.LBASE},
      'source_payload':c.SOURCE_COMMIT,'source_files':c.source_guard(),'native_files':manifest['native_files'],
      'release_manifest_sha256':b.RELEASE_HASH,'release_commit':b.RELEASE_COMMIT,'target_sha256':b.TARGET_HASH,
      'plan_sha256':b.PLAN_HASH,'shared_print_pipeline_sha256':b.digest(P/'build-scripts/content/book-2/print_pipeline.py'),
      'evidence':[{ 'path':p.relative_to(P).as_posix(),'raw_sha256':b.digest(p)} for p in [E/'224-personal-inspection.json',E/'224-parity.json',E/'224-independent-probes.json',E/'224-target-dom-geometry.json',E/'224-legacy-review.md',E/'224-view-inventory.json',E/'224-command-native-checker.json']],
      'specialist_qc':'PENDING','root_validation':'PENDING','root_acceptance':'PENDING','handoff':'PENDING','production_ready':False}
    c.write_new(E/'224-review-bindings.json',bindings)
    print(json.dumps({'status':'PASS','contrast':contrast,'alts':dom,'hashes':{p.name:b.digest(p) for p in [E/'224-personal-inspection.json',E/'224-target-dom-geometry.json',E/'224-review-bindings.json',E/'224-legacy-review.md']}}))

if __name__=='__main__':main()
