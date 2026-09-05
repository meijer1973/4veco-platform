"""Independent R6 diagnostics. Not a substitute for personal visual inspection."""
from pathlib import Path
from fractions import Fraction
from io import BytesIO
from zipfile import ZipFile
import base64, copy, hashlib, json, re, subprocess, sys
from bs4 import BeautifulSoup
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[3]
assert ROOT.parent.name == 'book2-213-r6-review-20260905'
OUT = Path(__file__).parent
LESSONS = ROOT.parent/'4veco-lessen'
sys.path.insert(0, str(ROOT/'build-scripts/content/book-2'))
import b2_213 as b
DEST = LESSONS/b.LESSON_REL
OLD_P = '199772e2aa586fce0f71b647ed5188e568dba2e5'
OLD_L = '4c4cd7d0c1d2e5242c818399a96dce3e26013e9c'

def sha(data): return hashlib.sha256(data).hexdigest()
def digest(path): return sha(path.read_bytes())
def emit(name, obj):
    p = OUT/name
    assert not p.exists(), p
    p.write_text(json.dumps(obj, ensure_ascii=False, indent=2)+'\n', encoding='utf-8', newline='\n')
    print(json.dumps({'evidence':name,'result':obj.get('result','recorded')}, ensure_ascii=True))
def old(repo, ref, rel):
    return subprocess.run(['git','show',f'{ref}:{rel.as_posix()}'], cwd=repo, check=True, capture_output=True).stdout

def pass0():
    refs = []
    files = [DEST/f'{b.STEM} – {k}{e}' for k in ('paragraaf','opgaven','antwoorden') for e in ('.md','.html','.pdf','.zip')]
    files += [DEST/'build_pdf.py']
    for f in files:
        assert f.is_file() and f.stat().st_size, f
    for f in files:
        if f.suffix != '.md': continue
        for ref in re.findall(r'!\[[^\]]*\]\(([^)]+)\)', f.read_text(encoding='utf-8')):
            p = (f.parent/ref).resolve()
            assert p.is_relative_to((DEST/'_assets').resolve()) and p.is_file(), ref
            refs.append(p.stem)
    assets = list((DEST/'_assets').iterdir())
    assert len(assets)==12
    for p in assets:
        assert re.fullmatch(r'2\.1\.3_(fig|we|ex)_\d+\.(svg|png)',p.name), p
        assert p.with_suffix('.png' if p.suffix=='.svg' else '.svg').is_file()
        assert p.stem in refs, ('orphan',p)
    emit('pass0.json', {'result':'PASS','missing':[],'unpaired':[],'orphans':[], 'references':refs,
        'required_files':{p.name:digest(p) for p in files},'assets':{p.name:digest(p) for p in assets}})

def relocate():
    original = ROOT/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-alt-build-r6.json'
    m = json.loads(original.read_text(encoding='utf-8'))
    def relocate_path(value):
        norm=value.replace('\\','/')
        for repo,new in [('4veco-platform',ROOT),('4veco-lessen',LESSONS)]:
            marker='/'+repo+'/'
            if marker in norm: return str(new/norm.split(marker,1)[1])
        raise AssertionError(value)
    checks=[]
    for item in m['input_sources']+m['prerequisites']:
        item['path']=relocate_path(item['path']); p=Path(item['path'])
        raw=p.read_bytes()
        pin=item.get('sha256',item.get('canonical_lf_sha256'))
        actual=sha(raw if 'sha256' in item else raw.replace(b'\r\n',b'\n'))
        assert actual==pin,(p,actual,pin)
        checks.append({'path':str(p),'hash':actual})
    for d in m['documents']:
        for field,pin in [('source_md','source_sha256'),('source_html','html_sha256'),('source_pdf','pdf_sha256')]:
            d[field]=relocate_path(d[field]); assert digest(Path(d[field]))==d[pin]
        for item in d['assets']+[d['zip']]:
            item['path']=relocate_path(item['path']); assert digest(Path(item['path']))==item['sha256']
        d['proof_directory']=relocate_path(d['proof_directory'])
        proof=Path(d['proof_directory']); pm=json.loads((proof/'manifest.json').read_text(encoding='utf-8'))
        assert pm['inspection_status']=='PENDING' and pm['pages_inspected']==[]
        actual={p.name:digest(p) for p in (proof/'pages').glob('page-*.png')}
        assert actual==pm['page_sha256']
        oldproof=proof.with_name(proof.name[:-2]+'r5')
        assert {p.name:digest(p) for p in (oldproof/'pages').glob('page-*.png')}==actual
        checks.append({'proof':str(proof),'manifest_sha256':digest(proof/'manifest.json'),'pages':actual,
          'r5_page_byte_parity':'PASS','pending_manifest_unchanged':True})
    prior=DEST.parent/'2.1.2 Opbrengsten, winst en break-even'/'2.1.2 Opbrengsten, winst en break-even – paragraaf.md'
    assert digest(prior)==m['prior_paragraph_md_raw_sha256']
    assert b.target_record() and b.prerequisite_pins(DEST)
    emit('relocated-build.json',m)
    emit('bindings.json',{'result':'PASS','original_manifest':str(original),'original_manifest_sha256':digest(original),'checks':checks,
        'prior_212_source_raw_sha256':digest(prior),'visual_inspection':'NOT_SUPPLIED_BY_THIS_SCRIPT'})

def delta():
    inventory=[]; changed=[]; alts=[]; titles=[]; zips=[]
    permitted=set()
    for k in ('paragraaf','opgaven'):
        permitted.update(f'{b.STEM} – {k}{e}' for e in ('.md','.html','.zip'))
    permitted.add('_assets/2.1.3_we_1.svg')
    assets={digest(DEST/'_assets'/f'{n}.png'):n for n in b.ASSETS}
    for p in [DEST/f'{b.STEM} – {k}{e}' for k in ('paragraaf','opgaven','antwoorden') for e in ('.md','.html','.pdf','.zip')]+list((DEST/'_assets').iterdir()):
        before=old(LESSONS,OLD_L,p.relative_to(LESSONS)); after=p.read_bytes(); rel=p.relative_to(DEST).as_posix()
        inventory.append({'path':rel,'r5':sha(before),'r6':sha(after)})
        if before!=after: changed.append(rel)
        if p.suffix=='.html':
            os=BeautifulSoup(before,'html.parser'); ns=BeautifulSoup(after,'html.parser')
            oi=os.find_all('img'); ni=ns.find_all('img'); assert len(oi)==len(ni)
            oc=os.find_all('figcaption'); nc=ns.find_all('figcaption'); assert len(oc)==len(nc)
            for index,(a,z) in enumerate(zip(oi,ni)):
                data=base64.b64decode(z['src'].split(',',1)[1]); name=assets[sha(data)]
                text=z['alt']; assert len(text)<=120 and text
                aa,zz=oc[index],nc[index]
                assert ' '.join(aa.get_text().split())==' '.join(zz.get_text().split()),'caption word/punctuation drift'
                attrs=copy.deepcopy(aa.attrs)
                if a['alt']!=text:
                    assert name in ('2.1.3_fig_3','2.1.3_fig_4','2.1.3_we_1')
                    assert attrs.pop('aria-hidden')=='true'
                assert attrs==zz.attrs,(name,attrs,zz.attrs)
                alts.append({'edition':p.stem,'index':index,'asset':name,'alt':text,'length':len(text),
                    'old_alt':a['alt'],'caption':' '.join(zz.get_text().split()),'old_caption_attributes':dict(aa.attrs),'new_caption_attributes':dict(zz.attrs)})
                # Normalize ONLY verified changed alt and exactly its aria-hidden removal.
                a['alt']=text
                aa.attrs=attrs
            for soup in (os,ns):
                for node in list(soup.find_all(string=True)): node.replace_with(re.sub(r'\s+',' ',str(node)))
            assert str(os)==str(ns), ('extra DOM delta',rel)
        if p.suffix=='.svg':
            ot=ET.fromstring(before); nt=ET.fromstring(after); tag='{http://www.w3.org/2000/svg}title'
            title=nt.find(tag).text
            assert len(title)<=120 and nt.attrib['role']=='img' and nt.attrib['aria-labelledby']==nt.find(tag).attrib['id']
            oldtitle=ot.find(tag).text
            assert before.replace(oldtitle.encode(),title.encode(),1)==after,rel
            titles.append({'asset':p.stem,'title':title,'length':len(title),'old_title':oldtitle,'raw_sha256':sha(after),'all_other_svg_bytes_equal':True})
        if p.suffix=='.zip':
            with ZipFile(BytesIO(before)) as oz,ZipFile(BytesIO(after)) as nz:
                assert oz.namelist()==nz.namelist() and nz.testzip() is None
                changes=[]
                for name in nz.namelist():
                    info=nz.getinfo(name); assert info.date_time==(1980,1,1,0,0,0)
                    if oz.read(name)!=nz.read(name): changes.append(name)
                    else: assert oz.getinfo(name).CRC==info.CRC
                expected=set() if 'antwoorden' in p.name else {p.with_suffix('.md').name,p.with_suffix('.html').name,'_assets/2.1.3_we_1.svg'}
                assert set(changes)==expected,(rel,changes)
                zips.append({'file':rel,'members':nz.namelist(),'changed_members':changes,'CRC':'PASS'})
    assert set(changed)==permitted and len(inventory)==24
    assert sum(a['old_alt']!=a['alt'] for a in alts)==4 and len(alts)==8 and len(titles)==6
    source=[]
    for rel in ('build-scripts/content/book-2/213/theory.md','build-scripts/content/book-2/213/exercises.md','build-scripts/content/book-2/b2_213.py'):
        p=ROOT/rel; before=old(ROOT,OLD_P,Path(rel)).decode().replace('\r\n','\n'); after=p.read_text(encoding='utf-8')
        if p.suffix=='.md': normalized=re.sub(r'(?<=\.svg\))\{alt="[^"]*"\}','',after)
        else: normalized=after.replace('Drie eindpuntrijen van Lus en Bout; constante en stijgende MK','Vergelijk de drie eindpuntrijen van Lus en Bout; constante en stijgende MK')
        assert normalized==before,(rel,'unauthorized source delta')
        source.append({'path':rel,'metadata_only':'PASS'})
    emit('independent-delta.json',{'result':'PASS','old_platform':OLD_P,'old_lessons':OLD_L,'inventory':inventory,'changed':changed,
       'all_actual_alts':alts,'all_svg_titles':titles,'zip_checks':zips,'source_checks':source,'normalized_DOM':'equal after exactly four independently checked alts/aria-hidden removals and whitespace normalization'})

def arithmetic():
    # Independently entered from actual printed source tables, not generator CASES.
    cases={'fotohouders':([0,10,20],[20,50,100],[0,80,160]),'Lus':([0,2,4,6],[12,16,20,24],[0,12,24,36]),
      'Bout':([0,2,4,6],[8,12,24,44],[0,24,48,72]),'flessen':([0,2,4],[8,12,20],[0,12,24]),
      'patches':([0,3,6],[9,15,21],[0,15,30]),'onderzetters':([0,2,6],[10,14,38],[0,16,48]),
      'Draad':([0,4,8,12],[20,24,28,32],[0,20,40,60]),'Kaft':([0,4,8,12],[12,28,76,156],[0,96,192,288]),
      'Linea':([0,10,20,30],[200,230,260,290],[0,80,160,240]),'Curva':([0,5,10,15],[100,125,200,325],[0,150,300,450]),
      'organizers_basis':([2,6],[14,22],[12,36]),'organizers_A':([2,6],[24,32],[12,36]),
      'organizers_B':([2,6],[14,22],[14,42]),'organizers_beide':([2,6],[24,32],[14,42])}
    results={}
    for name,(q,tk,to) in cases.items():
        profits=[r-c for c,r in zip(tk,to)]; intervals=[]
        for i in range(1,len(q)):
            dq=q[i]-q[i-1]; assert dq>0
            mk=Fraction(tk[i]-tk[i-1],dq); mo=Fraction(to[i]-to[i-1],dq)
            bridge=Fraction(profits[i]-profits[i-1],dq); assert bridge==mo-mk
            intervals.append({'from':q[i-1],'right_endpoint':q[i],'delta_Q':dq,'MK':str(mk),'MO':str(mo),'delta_profit_per_extra':str(bridge)})
        results[name]={'profits':profits,'intervals':intervals}
    bonus={name:[str(Fraction(t[1]-t[0],4)),str(Fraction(t[2]-t[1],8))] for name,t in [('K',[20,32,56]),('L',[20,40,56])]}
    emit('arithmetic.json',{'result':'PASS','cases':results,'bonus':bonus,
       'Start1':{'TK':18+2*4,'TO':5*4,'winst':5*4-(18+2*4),'GTK':str(Fraction(18+2*4,4))},
       'Closing':{q:{'TK':15+2*q,'TO':7*q,'winst':7*q-(15+2*q),'GTK':str(Fraction(15+2*q,q))} for q in [3,6]},
       'target_points':[4,3,2,4,2],'target_total':sum([4,3,2,4,2]),'visual_inspection':'NOT_SUPPLIED_BY_THIS_SCRIPT'})

def protected():
    pins=[]
    files=[p for p,_ in b.prerequisite_pins(DEST)]
    files += [DEST.parent.parent/'_book-plan.md',DEST/'build_pdf.py']
    files += [p for p in DEST.glob('*') if p.name.endswith(('-quality-ref.yaml','-textbook-handoff.md','-plan-review.md'))]
    files += [DEST.parent/'2.1.2 Opbrengsten, winst en break-even'/'2.1.2 Opbrengsten, winst en break-even – paragraaf.md']
    for p in files:
        actual=p.read_bytes(); before=old(LESSONS,'56f43382946a079fdc5ff6f6e67d3d246b4e4e01',p.relative_to(LESSONS))
        assert actual.replace(b'\r\n',b'\n')==before.replace(b'\r\n',b'\n'),p
        pins.append({'path':str(p),'raw_sha256':sha(actual),'canonical_lf_sha256':sha(actual.replace(b'\r\n',b'\n')),'unchanged_from_published_base':True})
    for rel in ['references/authored/course-target-exercises.json','references/authored/book-outlines/book-2-outline.md',
      'references/authored/book-outlines/book-2-outline.meta.json','build-scripts/content/book-2/b2_213.py','build-scripts/content/book-2/print_pipeline.py']:
        p=ROOT/rel; actual=p.read_bytes(); before=old(ROOT,'2ee27510e342ed8acbb1fd3a1acf825f618a09f3',Path(rel))
        assert actual.replace(b'\r\n',b'\n')==before.replace(b'\r\n',b'\n'),p
        pins.append({'path':str(p),'raw_sha256':sha(actual),'unchanged_from_published_base':True})
    target=b.target_record()
    emit('protected-and-target.json',{'result':'PASS','pins':pins,'frozen_target':target,'frozen_target_record_sha256':b.TARGET_HASH})

if __name__=='__main__':
    {'pass0':pass0,'bindings':relocate,'delta':delta,'arithmetic':arithmetic,'protected':protected}[sys.argv[1]]()
