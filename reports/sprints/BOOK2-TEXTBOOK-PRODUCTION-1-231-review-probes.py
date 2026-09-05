"""Independent review-only actual-artifact probes; mutations stay in memory.
HOW TO ADAPT: this is a bounded §231 evidence script, not a shared validator.
It deliberately does not import the builder or its test helpers.
"""
from pathlib import Path
from fractions import Fraction as F
from html.parser import HTMLParser
import base64, copy, hashlib, io, json, re, subprocess, zipfile
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
LESSON = ROOT.parent / '4veco-lessen'
REL = Path('Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.1 Consumentensurplus')
DEST = LESSON / REL
PREFIX = 'BOOK2-TEXTBOOK-PRODUCTION-1-231-review'
SUBJECT = '85fa4910a7e6bcac69b36c38bffdf6c0d10d0c68'
KINDS = ['paragraaf', 'opgaven', 'antwoorden']
sha = lambda b: hashlib.sha256(b).hexdigest()
read = lambda p: p.read_text(encoding='utf-8-sig')
docpath = lambda k, e: DEST / f'2.3.1 Consumentensurplus – {k}.{e}'
docs = {k: read(docpath(k, 'md')) for k in KINDS}
record = next(x for x in json.loads(read(ROOT / 'references/authored/course-target-exercises.json'))['exercises'] if x['id'] == '2.3.1')
assert sha(json.dumps(record,ensure_ascii=False,separators=(',',':')).encode()) == 'a385e00b2fffea168089c32f796668e51ae45cb325504644392f79b20bde8571'
results = []

def reject(name, action):
    try: action()
    except (AssertionError, ValueError, KeyError): results.append({'probe':name,'result':'REJECTED_AS_REQUIRED'})
    else: raise AssertionError('Mutation incorrectly accepted: '+name)

def target_contract(md, goals=False):
    if goals:
        assert len(re.findall(r'(?m)^\d\. Je kunt ', md)) == 4
        assert all(md.count(g) == 1 for g in record['lesson_goals'])
    target = md.split('## Doeloefening\n')[1].split('## Denkertje / Bonusopgave\n')[0]
    assert '![' not in target and '<img' not in target
    assert record['target_exercise']['context'] in target
    assert [int(n) for n in re.findall(r'\*\*\((\d+) punten\)\*\*',target)] == [2,3,2,3,2]
    for q in record['target_exercise']['subquestions']:
        assert f"{q['label']}\\) **({q['points']} punten)** {q['prompt']}" in target
    assert len(re.findall(r'(?m)^[a-e]\\\)',target)) == 5
for k in KINDS[:2]: target_contract(docs[k],k=='paragraaf')
reject('missing frozen goal',lambda: target_contract(docs['paragraaf'].replace(record['lesson_goals'][0],''),True))
reject('extra fifth goal',lambda: target_contract(docs['paragraaf']+'\n5. Je kunt een extra doel.\n',True))
reject('forged target points',lambda: target_contract(docs['opgaven'].replace('**(3 punten)**','**(4 punten)**',1)))
reject('missing target construction prompt',lambda: target_contract(docs['opgaven'].replace(record['target_exercise']['subquestions'][1]['prompt'],'')))
reject('supplied graph inserted into unsupported target',lambda: target_contract(docs['opgaven'].replace('## Doeloefening\n','## Doeloefening\n![spoiler](_assets/2.3.1_ex_10.png)\n')))

class Figures(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.images=[]; self.captions=[]; self.cap=None; self.feed(text)
    def handle_starttag(self,tag,attrs):
        if tag=='img': self.images.append(dict(attrs))
        if tag=='figcaption': self.cap=''
    def handle_data(self,data):
        if self.cap is not None: self.cap+=data
    def handle_endtag(self,tag):
        if tag=='figcaption': self.captions.append(self.cap); self.cap=None

image_inventory=[]
def image_contract(k, text):
    parsed=Figures(text)
    refs=re.findall(r'!\[([^\]]+)\]\((_assets/[^)]+)\)\{alt="([^"]+)" width=166mm\}',docs[k])
    assert len(parsed.images)==len(refs)==len(parsed.captions)>0
    for (caption,src,alt),img,actual_caption in zip(refs,parsed.images,parsed.captions):
        assert img['alt']==alt and 0<len(alt)<=120
        assert re.match(r'^(Betalingsbereidheid|Assen|Vraaglijn|Consumentensurplus)\b',alt)
        assert ' '.join(caption.split()) == ' '.join(actual_caption.split())
        assert img['src'].startswith('data:image/png;base64,')
        assert base64.b64decode(img['src'].split(',',1)[1]) == (DEST/src).with_suffix('.png').read_bytes()
    return [{'edition':k,'asset':src,'alt':alt,'caption':caption} for caption,src,alt in refs]
for k in KINDS: image_inventory+=image_contract(k,read(docpath(k,'html')))
html=read(docpath('opgaven','html'))
reject('actual HTML alt altered',lambda: image_contract('opgaven',re.sub(r'alt="[^"]+"','alt="wrong"',html,count=1)))
reject('actual caption dropped',lambda: image_contract('opgaven',re.sub(r'<figcaption>.*?</figcaption>','',html,count=1,flags=re.S)))
reject('actual embedded PNG corrupted',lambda: image_contract('opgaven',html.replace('data:image/png;base64,','data:image/png;base64,AAAA',1)))

NS={'s':'http://www.w3.org/2000/svg'}
cases={'fig_4':(40,F(1,2),10,60,900),'we_1':(30,F(1),10,20,200),'ex_2':(30,F(1,2),10,40,400),'ex_4':(24,F(1,2),8,32,256),'ex_5':(30,F(1,2),10,40,400),'ex_6':(24,F(1,2),12,24,144),'ex_7':(20,F(1,2),5,30,225),'ex_8':(36,F(1,2),12,48,576),'ex_9':(28,F(1,2),14,28,196),'ex_10':(50,F(1,2),20,60,900)}
svgs={p.stem.removeprefix('2.3.1_'):read(p) for p in (DEST/'_assets').glob('*.svg')}
def svg_contract(text, stem):
    tree=ET.fromstring(text)
    assert tree.get('viewBox')=='0 0 1200 900' and tree.get('aria-labelledby')=='title desc'
    for tag in ['title','desc']:
        node=tree.find('s:'+tag,NS); assert node is not None and node.text and len(node.text)>10
    for t in tree.findall('.//s:text',NS):
        assert t.get('font-size')=='30pt' and t.get('font-family')=='Arial'
    nodes={n.get('id'):n for n in tree.iter() if n.get('id')}
    if stem=='fig_2': assert all(x not in nodes for x in ['demand','price','cs-fill'])
    if stem=='ex_1': assert 'price' in nodes and 'cs-fill' not in nodes
    if stem=='ex_3': assert 'demand' in nodes and 'price' not in nodes and 'cs-fill' not in nodes
    if stem in cases:
        intercept,slope,price,q,cs=cases[stem]; qmax=F(intercept)/slope
        assert (F(intercept)-price)/slope==q and F(q)*(intercept-price)/2==cs
        raw=[tuple(F(v) for v in pair.split(',')) for pair in nodes['cs-fill'].get('points').split()]
        econ=[((x-160)*qmax/880,(650-y)*intercept/450) for x,y in raw]
        # Actual SVG serializes non-terminating pixel coordinates to six decimals.
        # Keep exact model arithmetic and a sub-millionth model-unit geometry tolerance.
        assert all(abs(a-b)<F(1,1000000) for point,wanted in zip(econ,[(0,intercept),(0,price),(q,price)]) for a,b in zip(point,wanted))
        area=abs(sum(econ[i][0]*econ[(i+1)%3][1]-econ[(i+1)%3][0]*econ[i][1] for i in range(3)))/2
        assert abs(area-cs)<F(1,100000) and nodes['cs-hatch'].get('points')==nodes['cs-fill'].get('points')
        point=nodes['price-intersection']; assert abs((F(point.get('cx'))-160)*qmax/880-q)<F(1,1000000)
        assert abs((650-F(point.get('cy')))*intercept/450-price)<F(1,1000000)
        assert nodes['price'].get('stroke-dasharray')=='16 10'
        assert nodes['quantity-projection'].get('stroke-dasharray')=='6 8'
for s,text in svgs.items(): svg_contract(text,s)
reject('actual SVG title removed',lambda: svg_contract(re.sub(r'<title[^>]*>.*?</title>','',svgs['ex_10']),'ex_10'))
reject('wrong CS polygon geometry',lambda: svg_contract(svgs['ex_10'].replace('160,200 160,470 688,470','160,200 160,480 688,480'),'ex_10'))
reject('wrong actual graph font',lambda: svg_contract(svgs['ex_10'].replace('30pt','18pt',1),'ex_10'))
reject('unshaded supplied graph leaks CS',lambda: svg_contract(svgs['ex_1'].replace('</svg>','<polygon id="cs-fill"/></svg>'),'ex_1'))
reject('line-only faded graph leaks price',lambda: svg_contract(svgs['ex_3'].replace('</svg>','<line id="price"/></svg>'),'ex_3'))

def archive_contract(data,expected):
    with zipfile.ZipFile(io.BytesIO(data)) as z:
        names=z.namelist(); assert len(names)==len(set(names)) and set(names)==set(expected)
        assert z.testzip() is None
        for n in names:
            assert not n.startswith(('/','\\')) and '..' not in n.split('/') and '\\' not in n
            assert z.getinfo(n).date_time==(1980,1,1,0,0,0) and z.read(n)==expected[n]
    return len(names)
zip_counts={}
for k in KINDS:
    refs={src for _,src,_ in re.findall(r'!\[([^\]]+)\]\((_assets/[^)]+)\)\{alt="([^"]+)" width=166mm\}',docs[k])}
    names=[docpath(k,e).name for e in ['md','html','pdf']]+[str(Path(s).with_suffix(e)).replace('\\','/') for s in refs for e in ['.svg','.png']]
    expected={n:(DEST/n).read_bytes() for n in names}
    zip_counts[k]=archive_contract(docpath(k,'zip').read_bytes(),expected)
def mutated_zip(mode):
    out=io.BytesIO()
    with zipfile.ZipFile(out,'w') as z:
        for n,b in expected.items():
            info=zipfile.ZipInfo(n,(1980,1,1,0,0,0)); z.writestr(info,b if mode!='bytes' or n!=next(iter(expected)) else b+b'x')
        if mode in ['traversal','extra']: z.writestr('../outside' if mode=='traversal' else 'extra.txt',b'x')
        if mode=='duplicate': z.writestr(next(iter(expected)),b'x')
    return out.getvalue()
for mode in ['bytes','traversal','extra','duplicate']:
    reject('ZIP '+mode,lambda mode=mode:archive_contract(mutated_zip(mode),expected))

proofroot=ROOT/'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1'
def proof_contract(m, directory):
    assert m['inspection_status']=='PENDING' and m['pages_inspected']==[]
    assert m['visible_student_defects'] is None and m['inspected_at_normal_reading_scale'] is False
    assert sha(Path(m['source_pdf']).read_bytes())==m['pdf_sha256']
    for p in m['rendered_pages']: assert sha((directory/p).read_bytes())==m['page_sha256'][Path(p).name]
proofs=[]
for directory in proofroot.glob('231-*-r11'):
    m=json.loads(read(directory/'manifest.json')); proof_contract(m,directory); proofs.append((m,directory))
assert len(proofs)==3
m,directory=proofs[0]
bad=copy.deepcopy(m); bad['inspection_status']='PASS'
reject('native PENDING status forged',lambda:proof_contract(bad,directory))
bad=copy.deepcopy(m); bad['page_sha256'][Path(bad['rendered_pages'][0]).name]='0'*64
reject('native rendered page hash drift',lambda:proof_contract(bad,directory))

baseline=json.loads(read(ROOT/f'reports/sprints/{PREFIX}-baseline.json'))
for item in baseline['lesson_files']: assert sha((LESSON/item['path']).read_bytes())==item['sha256']
assert len(baseline['lesson_files'])==44
for p in [ROOT/'build-scripts/content/book-2/b2_231.py',*(ROOT/'build-scripts/content/book-2/231').glob('*')]:
    if p.is_file(): assert p.read_bytes()==subprocess.check_output(['git','show',SUBJECT+':'+p.relative_to(ROOT).as_posix()],cwd=ROOT)
assessment=json.loads(read(ROOT/f'reports/sprints/{PREFIX}-scope-assessment.json'))
for item in assessment['native_manifests']: assert sha((ROOT/item['path']).read_bytes())==item['sha256']
assert sum(max(w-10,0) for w in [18,14,10])==12
assert sum(w-6 for w in [14,10,6])==12 and sum(w-6 for w in [18,14,10])==24
assert sum(w>=9 for w in [12,9,5])==2 and sum(max(w-9,0) for w in [12,9,5])==3
assert (18-6)/.5==24 and (24-8)==16 and F(8*6,2)==24
output={'status':'PASS','independent_mutations_rejected':len(results),'probes':results,'actual_image_occurrences':image_inventory,'actual_svg_count':len(svgs),'independent_exact_CS_polygon_checks':len(cases),'zip_member_counts':zip_counts,'all_44_baseline_lesson_files_unchanged':True,'nine_platform_source_files_unchanged':True,'all_27_historical_native_manifests_unchanged':True,'limitations':'Review-only independent probes; not shared-policy or full-CI certification. No pupil or authority files modified.'}
destination=ROOT/f'reports/sprints/{PREFIX}-probes-result.json'
with destination.open('x',encoding='utf-8') as f: json.dump(output,f,ensure_ascii=False,indent=2); f.write('\n')
print(json.dumps({k:v for k,v in output.items() if k not in ['actual_image_occurrences','probes']},indent=2))
