"""HOW TO ADAPT: independent QC evidence/analysis, never production edits.
Native guard negatives use in-memory read interception; PNG derivatives are
inspection-only grayscale conversions, not authored lesson figures.
"""
from pathlib import Path, PurePosixPath
from unittest.mock import patch
from datetime import datetime, timezone
from fractions import Fraction as F
import hashlib, json, sys, re, xml.etree.ElementTree as ET, zlib
from zipfile import ZipFile
from PIL import Image
from bs4 import BeautifulSoup

P = Path(__file__).resolve().parents[2]
L = P.parent / '4veco-lessen'
PREFIX = 'BOOK2-TEXTBOOK-PRODUCTION-1-231'
Q = P / 'reports/sprints' / (PREFIX + '-QC')
sys.path.insert(0, str(P / 'build-scripts/content/book-2'))
import b2_231 as native
D = L / native.LESSON_REL
def raw(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def save(suffix, value):
    with Path(str(Q) + '-' + suffix + '.json').open('x', encoding='utf-8', newline='\n') as f:
        json.dump(value, f, ensure_ascii=False, indent=2); f.write('\n')
def local(p):
    s = str(p).replace('\\', '/')
    for name, root in [('4veco-platform/', P), ('4veco-lessen/', L)]:
        if name in s: return root / s.split(name, 1)[1]
    raise ValueError(s)
def pixels(p):
    with Image.open(p) as im:
        return {'dimensions': list(im.size), 'rgb_sha256': hashlib.sha256(im.convert('RGB').tobytes()).hexdigest()}
def contrast(a,b):
    def lum(h):
        c=[int(h[i:i+2],16)/255 for i in (1,3,5)]
        c=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in c]
        return sum(v*w for v,w in zip(c,[.2126,.7152,.0722]))
    aa,bb=sorted([lum(a),lum(b)]);return (bb+.05)/(aa+.05)
def blend(fg,bg,alpha):
    return '#'+''.join(f'{round(alpha*int(fg[i:i+2],16)+(1-alpha)*int(bg[i:i+2],16)):02X}' for i in (1,3,5))

def execute():
    baseline=read(str(Q)+'-reservation-and-baseline.json')
    for r,h in baseline['native45'].items(): assert raw(L/r)==h, r
    assert raw(D/'2.3.1-review.md')=='8f86129b14ef508e16f41d918299da7af2422655ff14fc9ba91b68a9b66e8943'
    manifests={n:read(P/'reports/sprints'/f'{PREFIX}-build-manifest-r{n}.json') for n in (14,17,18,19)}
    packet=manifests[17]['packet'];assert len(packet)==42
    for m in manifests.values():
        assert m['packet']==packet
        assert m['inspection_status']=='PENDING'
    for r,h in packet.items(): assert raw(D/r)==h
    parity=[]
    native_grays=read(str(Q)+'-native-reproduction.json')['all_page_grayscale']
    for i,(kind,count) in enumerate(zip(native.KINDS,[14,9,10])):
        for n in range(1,count+1):
            paths=[local(manifests[r]['documents'][i]['proof_directory'])/'pages'/f'page-{n:03}.png' for r in (14,17,18,19)]
            raws=[raw(p) for p in paths]; pix=[pixels(p) for p in paths]
            assert len(set(raws))==1 and all(x==pix[0] for x in pix)
            gray=Path(str(Q)+'-grayscale-r17')/kind/f'page-{n:03}.png'
            # Poppler -gray rerenders the PDF; it is not Pillow RGB-to-L.
            native_gray=next(r for r in native_grays if r['kind']==kind and r['page']==n)
            assert raw(gray)==native_gray['sha256']
            assert native_gray['source_pdf_sha256']==manifests[17]['documents'][i]['pdf_sha256']
            with Image.open(paths[1]) as im, Image.open(gray) as gm:
                assert im.size==gm.size
                assert gm.convert('RGB').tobytes()==gm.convert('L').convert('RGB').tobytes()
            parity.append({'kind':kind,'page':n,'r14_r17_r18_r19_raw':raws[0],**pix[0],
                'color_r17':str(paths[1]),'gray_r17':str(gray),'gray_raw_sha256':raw(gray)})
    # Independently enumerate archive membership from actual HTML figure refs.
    archives=[]
    for kind,expected in zip(native.KINDS,[19,11,17]):
        base=D/f'{native.STEM} – {kind}'
        soup=BeautifulSoup(Path(str(base)+'.html').read_text(encoding='utf-8'),'html.parser')
        md=Path(str(base)+'.md').read_text(encoding='utf-8')
        stems=set(re.findall(r'_assets/(2\.3\.1_(?:fig|we|ex)_\d+)\.svg',md))
        names={base.name+e for e in ['.md','.html','.pdf']}
        names|={f'_assets/{stem}{e}' for stem in stems for e in ['.svg','.png']}
        assert len(names)==expected
        with ZipFile(Path(str(base)+'.zip')) as z:
            actual=z.namelist(); assert len(actual)==len(set(actual))==expected
            assert set(actual)==names and actual==sorted(actual)
            assert z.testzip() is None
            rows=[]
            for info in z.infolist():
                p=PurePosixPath(info.filename)
                assert not p.is_absolute() and '..' not in p.parts and '\\' not in info.filename
                assert info.date_time==(1980,1,1,0,0,0)
                data=z.read(info); assert data==(D/p).read_bytes()
                assert len(data)==info.file_size and zlib.crc32(data)&0xffffffff==info.CRC
                rows.append({'name':info.filename,'bytes':len(data),'crc32':info.CRC,'sha256':hashlib.sha256(data).hexdigest()})
            archives.append({'kind':kind,'members':rows,'zip_raw_sha256':raw(Path(str(base)+'.zip'))})
        assert soup.html.get('lang')=='nl'
        assert len(soup.find_all('h1'))==1
        assert not soup.find_all(['button','input','select','iframe','script'])
    # Actual authorize() negative paths; no disk changes, no subprocesses/writes.
    dest,pins,record=native.authorize(L)
    negatives=[]; original=Path.read_text
    for target,_,_ in pins:
        for corruption in ('missing','changed'):
            def guarded(self,*args,**kwargs):
                if self.resolve()==target.resolve():
                    if corruption=='missing': raise FileNotFoundError('QC in-memory missing authority')
                    return original(self,*args,**kwargs)+'\nQC in-memory authority drift\n'
                return original(self,*args,**kwargs)
            with patch.object(Path,'read_text',guarded), patch.object(native.subprocess,'run',side_effect=AssertionError('Unexpected subprocess')):
                try: native.authorize(L)
                except (ValueError,FileNotFoundError) as e: negatives.append({'path':str(target),'case':corruption,'rejected':type(e).__name__})
                else: raise AssertionError('Authority forgery accepted')
    # Target identity is independently tied to the actual canonical JSON bytes.
    registry=read(P/'references/authored/course-target-exercises.json')
    selected=[r for r in registry['exercises'] if r['id']=='2.3.1']; assert len(selected)==1
    record_bytes=json.dumps(selected[0],ensure_ascii=False,separators=(',',':')).encode()
    assert hashlib.sha256(record_bytes).hexdigest()=='a385e00b2fffea168089c32f796668e51ae45cb325504644392f79b20bde8571'
    t=selected[0]['target_exercise']; assert [q['points'] for q in t['subquestions']]==[2,3,2,3,2]
    for kind in ('paragraaf','opgaven'):
        md=(D/f'{native.STEM} – {kind}.md').read_text(encoding='utf-8')
        block=md.split('## Doeloefening\n',1)[1].split('## Denkertje / Bonusopgave',1)[0]
        expected='\n\n'.join(['**Opgave 8**',t['context']]+[f"{q['label']}\\) **({q['points']} punten)** {q['prompt']}" for q in t['subquestions']])
        assert block.strip()==expected+'\n\n:::'  # native keep-together div closes after exact target
        assert '_assets' not in block and '€900' not in block and '€ 900' not in block
    math=[]
    for context,a,b,price,qd,cs in [('bookfair',40,F(1,2),10,60,900),('museum',30,1,10,20,200),('startfilm',24,1,8,16,128),('aquarium',24,F(1,2),8,32,256),('garden',30,F(1,2),10,40,400),('climb',24,F(1,2),12,24,144),('boardgame',20,F(1,2),5,30,225),('skate',36,F(1,2),12,48,576),('cafe',28,F(1,2),14,28,196),('targetconcert',50,F(1,2),20,60,900),('closingphoto',18,F(1,2),6,24,144)]:
        q=F(a-price)/b; area=q*(a-price)/2
        assert q==qd and area==cs and a-b*q==price
        math.append({'context':context,'price':price,'q':int(q),'height':a-price,'cs':int(area),'payment':int(q*price),'total_wtp':int(area+q*price), 'cs_operation_required':context not in ('startfilm','closingphoto')})
    assert sum(w-10 for w in [18,14,10])==12
    assert sum(w-6 for w in [14,10,6])==12
    assert sum(w-6 for w in [18,14,10])==24
    assert sum(w-9 for w in [12,9])==3
    # Native SVG geometry, independent linear scaling and shoelace area.
    stages={'fig_2':(40,80,None,False),'fig_3':(40,80,10,False),'fig_4':(40,80,10,True),
        'we_1':(30,30,10,True),'ex_1':(24,48,8,False),'ex_2':(30,60,10,True),'ex_3':(24,48,None,False),
        'ex_4':(24,48,8,True),'ex_5':(30,60,10,True),'ex_6':(24,48,12,True),
        'ex_7':(20,40,5,True),'ex_8':(36,72,12,True),'ex_9':(28,56,14,True),'ex_10':(50,100,20,True)}
    figs=[]; graydir=Path(str(Q)+'-figure-grayscale-r17'); graydir.mkdir(exist_ok=True)
    for stem in native.ASSETS:
        svg=D/'_assets'/(stem+'.svg'); png=svg.with_suffix('.png'); tree=ET.parse(svg).getroot()
        assert tree.get('viewBox')=='0 0 1200 900' and tree.get('role')=='img'
        assert tree.find('{*}title').text and tree.find('{*}desc').text
        texts=tree.findall('.//{*}text');assert all(t.get('font-size')=='30pt' and t.get('font-family')=='Arial' and t.get('font-weight')=='400' for t in texts)
        ids={e.get('id'):e for e in tree.iter() if e.get('id')}
        geom={'stem':stem,'svg_raw_sha256':raw(svg),'png_raw_sha256':raw(png),'text_nodes':len(texts)}
        short=stem.removeprefix('2.3.1_')
        if short in stages:
            a,qmax,price,shaded=stages[short]
            assert ('cs-fill' in ids)==shaded and ('price' in ids)==(price is not None)
            assert ('demand' in ids)==(short!='fig_2')
            if price is not None:
                q=F(qmax)*(a-price)/a; yp=650-450*price/a; xq=160+880*float(q)/qmax
                assert float(ids['price'].get('y1'))==round(yp,6)
                assert float(ids['quantity-projection'].get('x1'))==round(xq,6)
                assert ids['price'].get('stroke-dasharray')=='16 10'
                assert ids['quantity-projection'].get('stroke-dasharray')=='6 8'
                if shaded:
                    pts=[tuple(map(float,x.split(','))) for x in ids['cs-fill'].get('points').split()]
                    assert pts==[(160.,200.),(160.,round(yp,6)),(round(xq,6),round(yp,6))]
                    assert ids['cs-hatch'].get('points')==ids['cs-fill'].get('points')
                    area=abs(sum(x*pts[(i+1)%3][1]-y*pts[(i+1)%3][0] for i,(x,y) in enumerate(pts)))/2
                    converted=area*qmax/880*a/450
                    assert abs(converted-float(q*(a-price)/2))<1e-5  # native SVG serializes six decimals
                    geom['polygon_area_euro']=converted
        with Image.open(png) as im:
            assert im.size==(2400,1800)
            gray=graydir/(stem+'.png')
            if gray.exists():
                with Image.open(gray) as old: assert old.mode=='L' and old.tobytes()==im.convert('L').tobytes()
            else: im.convert('L').save(gray)
        geom.update(pixels(png));geom['gray_path']=str(gray);geom['gray_raw_sha256']=raw(gray)
        figs.append(geom)
    # Actual SVG composites, not a fictitious fully opaque CS fill.
    backgrounds=['#F7FAFC','#FFFFFF','#CBD5E0',blend('#85C1E9','#F7FAFC',.45),blend('#85C1E9','#CBD5E0',.45),blend('#CBD5E0','#F7FAFC',.55)]
    contrasts={f'{fg} on {bg}':contrast(fg,bg) for fg in ['#2D3748','#1A5276'] for bg in backgrounds}
    assert min(contrasts.values())>=4.5
    print('All artifact/math/guard checks complete; verifying unchanged historical bytes...', flush=True)
    for r,h in baseline['native45'].items(): assert raw(L/r)==h
    for r,h in baseline['old_sources_and_history'].items(): assert raw(P/r)==h
    out={'status':'PASS','captured_at':datetime.now(timezone.utc).isoformat(), 'platform_baseline':'35e0bebb75cc3987c43dd8f480e1b444bd877f4a','lessons_baseline':'219a977e495abe43c17949e7d8996aab4176faa0',
        'baseline45_unchanged':True,'old_source_report_files_unchanged':len(baseline['old_sources_and_history']),
        'native_packet42':packet,'manifest_hashes':{f'r{n}':raw(P/'reports/sprints'/f'{PREFIX}-build-manifest-r{n}.json') for n in manifests},
        'raw_and_decoded_rgb_page_parity':parity,'exact_archives':archives,'guard_negatives':negatives,'independent_math':math,'figures':figs,'essential_contrasts':contrasts,
        'discrete_bonus':{'initial':12,'changed_buyers':12,'highest_three_counterfactual':24,'closing':3},
        'personal_inspection':'Not supplied by this automated helper; separate signed observations required.',
        'root_validation':'PENDING','root_acceptance':'PENDING','handoff_renewal':'PENDING','production_ready':False,'production_ready_with_flags':False}
    save('probes-result',out)
    print(json.dumps({k:v for k,v in out.items() if k in ['status','manifest_hashes','essential_contrasts','old_source_report_files_unchanged']},indent=2))
    print('PASS: 42 packet bytes; 33 raw+RGB parity; ZIP19/11/17; 16 real guard negatives; 15 SVG/PNG figures; source/history preserved.')

if __name__=='__main__': execute()
