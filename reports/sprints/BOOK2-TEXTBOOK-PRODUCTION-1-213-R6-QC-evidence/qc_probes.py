"""Current specialist's diagnostics; never personal visual approval."""
from pathlib import Path
from fractions import Fraction as F
from zipfile import ZipFile
from io import BytesIO
import base64, copy, hashlib, json, os, re, subprocess, sys, datetime
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
ROOT = Path(__file__).resolve().parents[3]
assert ROOT.parent.name == 'book2-213-r6-qc-20260905'
OUT = Path(__file__).parent
LESSONS = ROOT.parent/'4veco-lessen'
sys.path.insert(0, str(ROOT/'build-scripts/content/book-2'))
import b2_213 as b
DEST = LESSONS/b.LESSON_REL
PBASE = '552fa94d6c42298c4856ecbf5abd6b586c876a94'
LBASE = '576c5f4bb919611466e4511d2b4938a8195f6972'
OLDP = '199772e2aa586fce0f71b647ed5188e568dba2e5'
OLDL = '4c4cd7d0c1d2e5242c818399a96dce3e26013e9c'
ACTOR = 'paragraph_221_r8_independent_review'
def sha(data): return hashlib.sha256(data).hexdigest()
def digest(path): return sha(path.read_bytes())
def emit(name, value):
    p=OUT/name
    assert not p.exists(), p
    p.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
    print(json.dumps({'evidence':name,'result':value.get('result','recorded')},ensure_ascii=True))
def blob(repo,ref,rel):
    return subprocess.run(['git','show',f'{ref}:{Path(rel).as_posix()}'],cwd=repo,check=True,capture_output=True).stdout
def run(label,argv,cwd=ROOT):
    start=datetime.datetime.now(datetime.timezone.utc).isoformat()
    result=subprocess.run(argv,cwd=cwd,capture_output=True)
    def decode(raw):
        try: return raw.decode('utf-8')
        except UnicodeDecodeError: return raw.decode('cp1252',errors='backslashreplace')
    entry={'actor':ACTOR,'role':'213 R6 distinct specialist QC','label':label,'argv':list(map(str,argv)),
      'cwd':str(cwd),'started_utc':start,'finished_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),
      'PATH_inherited':os.environ.get('PATH'),'exit_code':result.returncode,
      'stdout_sha256':sha(result.stdout),'stderr_sha256':sha(result.stderr),
      'stdout':decode(result.stdout),'stderr':decode(result.stderr)}
    with (OUT/'command-log.jsonl').open('a',encoding='utf-8',newline='\n') as f: f.write(json.dumps(entry,ensure_ascii=False)+'\n')
    print(json.dumps({k:entry[k] for k in ('label','exit_code','stdout','stderr')},ensure_ascii=True))
    return result.returncode
def pass0():
    files=[DEST/f'{b.STEM} – {k}{e}' for k in ('paragraaf','opgaven','antwoorden') for e in ('.md','.html','.pdf','.zip')]
    files += [DEST/'build_pdf.py']; refs=[]
    for p in files:
        assert p.is_file() and p.stat().st_size
        if p.suffix=='.md':
            for ref in re.findall(r'!\[[^\]]*\]\(([^)]+)\)',p.read_text(encoding='utf-8')):
                asset=(p.parent/ref).resolve(); assert asset.is_relative_to(DEST/'_assets') and asset.is_file()
                refs.append(asset.stem)
    assets=list((DEST/'_assets').iterdir()); assert len(assets)==12
    for p in assets:
        assert re.fullmatch(r'2\.1\.3_(fig|ex|we)_\d+\.(svg|png)',p.name)
        assert p.stem in refs and p.with_suffix('.png' if p.suffix=='.svg' else '.svg').is_file()
    emit('pass0.json',{'result':'PASS','missing':[],'orphans':[],'unpaired':[],
      'files':{p.name:digest(p) for p in files},'assets':{p.name:digest(p) for p in assets},'references':refs})
def bindings():
    original=ROOT/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-alt-build-r6.json'
    m=json.loads(original.read_text(encoding='utf-8')); checks=[]
    def loc(v):
        s=v.replace('\\','/')
        for repo,new in [('4veco-platform',ROOT),('4veco-lessen',LESSONS)]:
            if '/'+repo+'/' in s: return str(new/s.split('/'+repo+'/',1)[1])
        raise AssertionError(v)
    for item in m['input_sources']+m['prerequisites']:
        item['path']=loc(item['path']); p=Path(item['path']); raw=p.read_bytes()
        value=sha(raw if 'sha256' in item else raw.replace(b'\r\n',b'\n'))
        assert value==item.get('sha256',item.get('canonical_lf_sha256'))
        checks.append({'path':str(p),'hash':value})
    for d in m['documents']:
        for field,pin in [('source_md','source_sha256'),('source_html','html_sha256'),('source_pdf','pdf_sha256')]:
            d[field]=loc(d[field]); assert digest(Path(d[field]))==d[pin]
        for item in d['assets']+[d['zip']]:
            item['path']=loc(item['path']); assert digest(Path(item['path']))==item['sha256']
        d['proof_directory']=loc(d['proof_directory']); proof=Path(d['proof_directory'])
        pm=json.loads((proof/'manifest.json').read_text(encoding='utf-8'))
        assert pm['inspection_status']=='PENDING' and pm['pages_inspected']==[]
        pages={p.name:digest(p) for p in (proof/'pages').glob('page-*.png')}
        assert pages==pm['page_sha256']
        r5=proof.with_name(proof.name[:-2]+'r5')
        assert {p.name:digest(p) for p in (r5/'pages').glob('page-*.png')}==pages
        checks.append({'proof':str(proof),'manifest_sha256':digest(proof/'manifest.json'),'pages':pages,'r5_page_parity':True})
    emit('relocated-build.json',m)
    emit('bindings.json',{'result':'PASS','actor':ACTOR,'original_manifest_sha256':digest(original),'checks':checks})
def protected():
    files=[p for p,_ in b.prerequisite_pins(DEST)] + [DEST/'2.1.3-review.md',DEST/'2.1.3-quality-ref.yaml',DEST/'build_pdf.py',DEST.parent.parent/'_book-plan.md']
    files+=list(DEST.glob('*-textbook-handoff.md'))
    files+=[DEST.parent/'2.1.2 Opbrengsten, winst en break-even'/'2.1.2 Opbrengsten, winst en break-even – paragraaf.md']
    pins=[]
    for p in files:
        raw=p.read_bytes(); old=blob(LESSONS,LBASE,p.relative_to(LESSONS))
        assert raw.replace(b'\r\n',b'\n')==old.replace(b'\r\n',b'\n')
        pins.append({'path':str(p),'sha256':sha(raw)})
    for rel in ['references/authored/course-target-exercises.json','references/authored/book-outlines/book-2-outline.md','references/authored/book-outlines/book-2-outline.meta.json','build-scripts/content/book-2/b2_213.py','build-scripts/content/book-2/print_pipeline.py']:
        p=ROOT/rel; assert p.read_bytes().replace(b'\r\n',b'\n')==blob(ROOT,PBASE,rel).replace(b'\r\n',b'\n')
        pins.append({'path':str(p),'sha256':digest(p)})
    review=DEST/'2.1.3-review.md'; assert digest(review)=='a70fd9571cea3afc5861d1b91dc99c102757767e0fb9d66da211602a90c82d66'
    emit('protected-baseline.json',{'result':'PASS','pins':pins,'canonical_review_sha256':digest(review),
      'review_succession':{'historical_R5_raw_sha256':sha(blob(LESSONS,OLDL,review.relative_to(LESSONS))),
       'current_R6_raw_sha256':digest(review),'current_published_lesson':LBASE,'old_snapshots_modified':False},
      'frozen_target':b.target_record(),'target_record_sha256':b.TARGET_HASH})
def delta():
    inventory=[]; changes=[]; alts=[]; titles=[]; zips=[]
    pngs={digest(p):p.stem for p in (DEST/'_assets').glob('*.png')}
    files=[DEST/f'{b.STEM} – {k}{e}' for k in ('paragraaf','opgaven','antwoorden') for e in ('.md','.html','.pdf','.zip')]+list((DEST/'_assets').iterdir())
    for p in files:
        old=blob(LESSONS,OLDL,p.relative_to(LESSONS)); new=p.read_bytes(); rel=p.relative_to(DEST).as_posix()
        inventory.append({'path':rel,'r5':sha(old),'r6':sha(new)})
        if old!=new: changes.append(rel)
        if p.suffix=='.html':
            before=BeautifulSoup(old,'html.parser'); after=BeautifulSoup(new,'html.parser')
            assert len(before.find_all('img'))==len(after.find_all('img'))
            for oi,ni in zip(before.find_all('img'),after.find_all('img')):
                name=pngs[sha(base64.b64decode(ni['src'].split(',',1)[1]))]
                oc=oi.find_parent('figure').figcaption; nc=ni.find_parent('figure').figcaption
                assert ' '.join(oc.get_text().split())==' '.join(nc.get_text().split())
                attrs=copy.deepcopy(oc.attrs); oldalt=oi['alt']; alt=ni['alt']; assert 0<len(alt)<=120
                if oldalt!=alt:
                    assert name in ('2.1.3_fig_3','2.1.3_fig_4','2.1.3_we_1')
                    assert attrs.pop('aria-hidden')=='true'
                assert attrs==nc.attrs
                alts.append({'edition':p.stem,'asset':name,'old':oldalt,'alt':alt,'length':len(alt),'caption':' '.join(nc.get_text().split()),'new_caption_attributes':dict(nc.attrs)})
                oi['alt']=alt; oc.attrs=attrs
            for soup in (before,after):
                for n in list(soup.find_all(string=True)): n.replace_with(re.sub(r'\s+',' ',str(n)))
            assert str(before)==str(after),('nonenumerated DOM',rel)
        if p.suffix=='.svg':
            o=ET.fromstring(old); n=ET.fromstring(new); tag='{http://www.w3.org/2000/svg}title'; title=n.find(tag).text
            assert 0<len(title)<=120 and n.get('role')=='img' and n.get('aria-labelledby')==n.find(tag).get('id')
            assert old.replace(o.find(tag).text.encode(),title.encode(),1)==new
            titles.append({'asset':p.stem,'title':title,'length':len(title),'drawing_body_exact':True})
        if p.suffix=='.zip':
            with ZipFile(BytesIO(old)) as oz,ZipFile(BytesIO(new)) as nz:
                assert oz.namelist()==nz.namelist() and nz.testzip() is None
                changed=[n for n in nz.namelist() if oz.read(n)!=nz.read(n)]
                expected=set() if 'antwoorden' in p.name else {p.with_suffix('.md').name,p.with_suffix('.html').name,'_assets/2.1.3_we_1.svg'}
                assert set(changed)==expected
                for n in nz.namelist():
                    assert nz.read(n)==(DEST/n).read_bytes()
                    if n not in changed: assert oz.getinfo(n).CRC==nz.getinfo(n).CRC
                zips.append({'edition':p.stem,'members':nz.namelist(),'changed':changed,'CRC_member_parity':True})
    expected={f'{b.STEM} – {k}{e}' for k in ('paragraaf','opgaven') for e in ('.md','.html','.zip')}|{'_assets/2.1.3_we_1.svg'}
    assert set(changes)==expected and len(inventory)==24 and len(alts)==8 and len(titles)==6
    assert sum(a['old']!=a['alt'] for a in alts)==4
    source=[]
    for rel in ('build-scripts/content/book-2/213/theory.md','build-scripts/content/book-2/213/exercises.md','build-scripts/content/book-2/b2_213.py'):
        old=blob(ROOT,OLDP,rel).decode().replace('\r\n','\n'); new=(ROOT/rel).read_text(encoding='utf-8')
        normalized=re.sub(r'(?<=\.svg\))\{alt="[^"]*"\}','',new) if rel.endswith('.md') else new.replace('Drie eindpuntrijen van Lus en Bout; constante en stijgende MK','Vergelijk de drie eindpuntrijen van Lus en Bout; constante en stijgende MK')
        assert normalized==old
        source.append({'path':rel,'metadata_only':True})
    emit('delta.json',{'result':'PASS','inventory':inventory,'changes':changes,'actual_alts':alts,'actual_titles':titles,'zips':zips,'source':source,'normalized_DOM':'exact except enumerated four alts/four aria-hidden removals and whitespace'})
def arithmetic():
    # Recompute from actual HTML tables, independently of producer CASES or expected-answer routines.
    solved=[]
    for kind in ('paragraaf','opgaven','antwoorden'):
        soup=BeautifulSoup((DEST/f'{b.STEM} – {kind}.html').read_text(encoding='utf-8'),'html.parser')
        for index,t in enumerate(soup.find_all('table')):
            cells=[[c.get_text().strip() for c in r.find_all(['td','th'])] for r in t.find_all('tr')]
            if cells[0]!=['Q','TK','TO','winst','MK','MO']: continue
            def number(s): return None if s in ('','—') else F(s.replace('€','').replace(' ','').replace('−','-').replace(',','.'))
            rows=[[number(c) for c in r] for r in cells[1:]]; answers=[]
            for i,r in enumerate(rows):
                q,tk,to,profit,mk,mo=r; calcprofit=to-tk
                if profit is not None: assert profit==calcprofit
                if i:
                    pq,ptk,pto,*_=rows[i-1]; dq=q-pq; assert dq>0
                    cmk=(tk-ptk)/dq; cmo=(to-pto)/dq
                    if mk is not None: assert mk==cmk
                    if mo is not None: assert mo==cmo
                    bridge=(calcprofit-(pto-ptk))/dq; assert bridge==cmo-cmk
                else:
                    assert cells[1][-2:]==['—','—']; cmk=cmo=bridge=None
                answers.append({'Q':str(q),'profit':str(calcprofit),'MK':str(cmk),'MO':str(cmo),'profit_change_per_extra':str(bridge)})
            solved.append({'edition':kind,'table_index':index,'computed_rows':answers})
    holder=[(F(80-30,10),F(30-(-20),10)),(F(80-50,10),F(60-30,10))]; assert holder==[(5,5),(3,3)]
    organizers=[(F(c2-c1,4),F(r2-r1,4),r2-c2) for c1,c2,r1,r2 in [(14,22,12,36),(24,32,12,36),(14,22,14,42),(24,32,14,42)]]
    assert organizers==[(2,6,14),(2,6,4),(2,7,20),(2,7,10)]
    emit('arithmetic.json',{'result':'PASS','source':'actual current HTML tables; own finite-fraction implementation','tables':solved,
      'holder_bridge':[[str(x) for x in p] for p in holder], 'bottle_bridge':[str(F(12-4,2)),str(F(12-8,2))],
      'organizers':[[str(x) for x in p] for p in organizers],
      'bonus_K':[str(F(32-20,4)),str(F(56-32,8))],'bonus_L':[str(F(40-20,4)),str(F(56-40,8))],
      'Start1':[26,20,-6,str(F(26,4))],'closing':[[21,21,0,7],[27,42,15,str(F(27,6))]],'target_points':[4,3,2,4,2],'total':15})
def media():
    records=[]
    for kind in ('paragraaf','opgaven','antwoorden'):
        pdf=DEST/f'{b.STEM} – {kind}.pdf'; folder=OUT/'pages'/kind; folder.mkdir(parents=True)
        assert run('fresh-page-render-'+kind,['pdftoppm','-r','150','-png',str(pdf),str(folder/'page')])==0
        pages=sorted(folder.glob('*.png')); assert len(pages)=={'paragraaf':14,'opgaven':9,'antwoorden':6}[kind]
        proof=next((ROOT/'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1').glob(f'213-{kind}-*-r6'))
        for i,p in enumerate(pages,1):
            native=proof/'pages'/f'page-{i:03}.png'; assert digest(p)==digest(native)
        records.append({'edition':kind,'pdf_sha256':digest(pdf),'fresh_pages':[{'path':str(p),'sha256':digest(p)} for p in pages],'native_page_parity':True})
    emit('media.json',{'result':'PASS','documents':records,'personal_inspection':'NOT_SUPPLIED_BY_THIS_SCRIPT'})

def table_geometry():
    import fitz
    pdf=DEST/f'{b.STEM} – antwoorden.pdf'
    doc=fitz.open(pdf); page=doc[2]
    words=page.get_text('words')
    rows=[]
    for word in words:
        if 390 < word[1] < 540:
            rows.append({'bbox':list(word[:4]),'text':word[4],'block':word[5],'line':word[6]})
    crop=OUT/'draad-table-direct-pdf.png'
    page.get_pixmap(matrix=fitz.Matrix(3,3),clip=fitz.Rect(64,360,540,550),alpha=False).save(crop)
    source=DEST/f'{b.STEM} – antwoorden.html'
    soup=BeautifulSoup(source.read_text(encoding='utf-8'),'html.parser')
    title=soup.find('strong',string='Draad — ingevuld')
    table=title.find_next('table')
    emit('draad-table-geometry.json',{'result':'diagnostic, not a verdict','pdf_sha256':digest(pdf),
      'full_page_sha256':digest(OUT/'pages/antwoorden/page-3.png'),'direct_pdf_crop_sha256':digest(crop),
      'pdf_words':rows,'native_HTML_rows':[[c.get_text(' ',strip=True) for c in r.find_all(['th','td'])] for r in table.find_all('tr')]})

def accessibility():
    def luminance(h):
        rgb=[int(h[i:i+2],16)/255 for i in (1,3,5)]
        rgb=[x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in rgb]
        return sum(x*w for x,w in zip(rgb,(.2126,.7152,.0722)))
    figures=[]
    ns={'s':'http://www.w3.org/2000/svg'}
    for p in sorted((DEST/'_assets').glob('*.svg')):
        root=ET.fromstring(p.read_bytes()); title=root.find('s:title',ns); desc=root.find('s:desc',ns)
        assert root.attrib['aria-labelledby']==title.attrib['id']
        # Native HTML prose/tables provide the complete educational descriptions.
        # SVG sources use title/aria-labelledby, not an invented desc binding.
        assert 0<len(title.text)<=120
        text_colors=sorted({t.attrib.get('fill') for t in root.findall('.//s:text',ns)})
        ratios={c:(luminance('#F7FAFC')+.05)/(luminance(c)+.05) for c in text_colors}
        assert min(ratios.values())>=4.5
        figures.append({'name':p.name,'title':title.text,'SVG_desc_present':desc is not None,
            'long_description_location':'Full native prose, table and caption; personally evaluated in report',
            'contrast_on_actual_background':ratios})
    docs=[]
    for kind in ('paragraaf','opgaven','antwoorden'):
        soup=BeautifulSoup((DEST/f'{b.STEM} – {kind}.html').read_bytes(),'html.parser')
        assert soup.html['lang']=='nl' and len(soup.find_all('h1'))==1
        assert not soup.find_all(['input','button','iframe','script'])
        for table in soup.find_all('table'):
            assert table.find('thead') and table.find('tbody')
            width=len(table.find('tr').find_all(['th','td']))
            assert all(len(row.find_all(['th','td']))==width for row in table.find_all('tr'))
        docs.append({'edition':kind,'lang':'nl','h1_count':1,'semantic_tables':len(soup.find_all('table')),'consistent_column_counts':True,'interactive_controls':0})
    emit('accessibility.json',{'result':'PASS for scoped structural/contrast checks, not blanket compliance','figures':figures,'documents':docs,
      'excluded':['screen-reader execution','PDF/UA tagging','interactive browser/keyboard compliance','OCR; source is native text']})

def inspection_bindings():
    record=OUT/'personal-inspection.md'; assert record.is_file()
    documents=json.loads((OUT/'media.json').read_text(encoding='utf-8'))['documents']
    gray=[{'path':str(p),'sha256':digest(p)} for p in sorted((OUT/'grayscale').glob('*.png'))]
    figs=[{'path':str(p),'sha256':digest(p)} for p in sorted((DEST/'_assets').glob('*.png'))]
    assert sum(len(d['fresh_pages']) for d in documents)==29 and len(gray)==5 and len(figs)==6
    emit('personal-inspection-bindings.json',{'actor':ACTOR,'role':'distinct non-author specialist QC of 213 R6',
      'personal_record_sha256':digest(record),'documents':documents,'grayscale_personally_viewed':gray,'figures_personally_viewed':figs,
      'native_proof_manifests':'Still PENDING, never rewritten; own observations and bindings supplied separately',
      'diagnostic_retraction':'See personal-inspection.md and draad-table-geometry.json; no Draad defect exists.'})

def verification():
    import yaml
    qpath=DEST/'2.1.3-quality-ref.yaml'; original=blob(LESSONS,LBASE,qpath.relative_to(LESSONS))
    current=qpath.read_bytes(); old=yaml.safe_load(original); q=yaml.safe_load(current)
    assert current.replace(b'\r\n',b'\n').startswith(original.replace(b'\r\n',b'\n'))
    assert {k:v for k,v in q.items() if k not in ('schema_version','partA')}==old
    assert q['schema_version']==2 and 'companion' not in q
    part=q['partA']; assert part['specialist_reviewer']==ACTOR and part['hard_fails_open']==0
    assert part['specialist_verdict']=='PASS WITH FLAGS'
    assert part['review_sha256']==digest(DEST/'2.1.3-review.md')
    assert part['specialist_report_sha256']==digest(ROOT/part['specialist_report'])
    assert part['rendered_evidence']['personal_record_sha256']==digest(ROOT/part['rendered_evidence']['personal_record'])
    assert part['rendered_evidence']['viewed_hash_manifest_sha256']==digest(ROOT/part['rendered_evidence']['viewed_hash_manifest'])
    for d in part['rendered_evidence']['documents']:
        for ext in ('md','html','pdf','zip'):
            assert digest(DEST/f'{b.STEM} – {d["artifact"]}.{ext}')==d[ext+'_sha256']
    protected=json.loads((OUT/'protected-baseline.json').read_text(encoding='utf-8'))
    kept=[]
    for pin in protected['pins']:
        p=Path(pin['path'])
        if p==qpath: continue
        assert sha(p.read_bytes().replace(b'\r\n',b'\n'))==pin['sha256'],p
        kept.append(pin)
    assert not (DEST/'2.1.3-textbook-handoff.md').exists()
    passzero=json.loads((OUT/'pass0.json').read_text(encoding='utf-8'))
    for name,h in passzero['files'].items(): assert digest(DEST/name)==h
    for name,h in passzero['assets'].items(): assert digest(DEST/'_assets'/name)==h
    files=['pass0.json','bindings.json','protected-baseline.json','delta.json','arithmetic.json','render.json','rebuild.json',
      'media.json','personal-inspection.md','personal-inspection-bindings.json','accessibility.json','draad-table-geometry.json','draad-table-direct-pdf.png']
    emit('verification.json',{'result':'PASS WITH FLAGS','actor':ACTOR,'platform_base':PBASE,'lesson_base':LBASE,
      'quality_raw_sha256':digest(qpath),'legacy_quality_raw_sha256':sha(original),'legacy_bytes_and_fields_preserved':True,
      'current_review_sha256':digest(DEST/'2.1.3-review.md'),'specialist_report_sha256':digest(ROOT/part['specialist_report']),
      'evidence_sha256':{f:digest(OUT/f) for f in files},'unchanged_protected_pins':kept,
      'source_artifact_hashes_still_exact':True,'handoff':'absent, unchanged','companion':'absent, unchanged',
      'flags':[f['id'] for f in part['flags']],'scopes':'Actual committed candidates recorded separately after payload commit'})
if __name__=='__main__':
    command=sys.argv[1]
    if command=='run': sys.exit(run(sys.argv[2],sys.argv[3:]))
    {'pass0':pass0,'bindings':bindings,'protected':protected,'delta':delta,'arithmetic':arithmetic,'media':media,'table-geometry':table_geometry,
     'accessibility':accessibility,'inspection-bindings':inspection_bindings,'verification':verification}[command]()
