"""Verify saved textbook repairs, economic geometry, identity and navigation.

Rendering is separately compared with a same-environment rebuild. These checks
read the saved publications and sources and never renew an earlier review.
"""
from pathlib import Path
import argparse, copy, hashlib, json, math, re, subprocess, sys
from xml.etree import ElementTree as ET
from bs4 import BeautifulSoup
import fitz

BASE = '99c5eb4127bebfd9892b19dc0d35789d05b6344b'
B1 = 'Boek 1 - Grondslagen, vraag en aanbod/edities/tweede-editie-2026'
B34 = 'edities/books34-v3'
P = Path(__file__).resolve().parents[2]

def graph_check(root, stem, xmax, ymax, domain, equations):
    """Read actual output coordinates, invert axes, test the source equations."""
    tree = ET.parse(root/(stem+'.svg'))
    curves = {el.get('data-curve'): el for el in tree.iter() if el.get('data-curve')}
    assert set(curves) == set(equations), 'Missing/extra labour model line: '+stem
    for name,(a,b) in equations.items():
        line=curves[name]; wages=[]
        for i in (1,2):
            q=(float(line.get('x'+str(i)))-82)*xmax/495
            w=(275-float(line.get('y'+str(i))))*ymax/218
            assert abs(q-(a+b*w)) < .002, (stem,name,'off equation',q,w)
            assert domain[0]-.001 <= w <= domain[1]+.001 and q>=-.001, (stem,name,'outside domain')
            wages.append(w)
        assert all(abs(a-b)<.001 for a,b in zip(sorted(wages),domain)), (stem,name,'missing endpoint')

def main():
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--lessons',type=Path,required=True);ap.add_argument('--report',type=Path)
    args=ap.parse_args();lessons=args.lessons.resolve();checks=[]
    def old(rel):return subprocess.check_output(['git','show',BASE+':'+rel],cwd=lessons)
    def text(rel):return (lessons/rel).read_text(encoding='utf8')
    def passed(name):checks.append(name)
    labour=lessons/B34/'books/book-4/chapters/4.3/_assets'
    specs=[(['eq_target','eq_target_answer'],240,28,(4,24),{'arbeidsvraag':(240,-10),'arbeidsaanbod':(-40,10)}),
           (['shift_target','shift_target_answer'],180,30,(2,24),{'arbeidsvraag':(180,-6),'arbeidsaanbod':(-12,6),'vraag nieuw':(144,-6)}),
           (['floor_target','floor_target_answer'],220,24,(2,22),{'arbeidsvraag':(220,-10),'arbeidsaanbod':(-20,10)}),
           (['mixed_base','mixed_answer'],280,32,(4,24),{'arbeidsvraag':(240,-10),'arbeidsaanbod':(-40,10),'vraag nieuw':(280,-10)})]
    for stems,xmax,ymax,domain,equations in specs:
        for stem in stems:graph_check(labour,stem,xmax,ymax,domain,equations);passed('actual SVG model/domain: '+stem)
    market=lessons/B34/'books/book-4/chapters/4.1/_assets'
    for stem,name in [('3.2.3_target','A'),('3.2.3_ans_2','A₀')]:
        tree=ET.parse(market/(stem+'.svg'))
        line=next(el for el in tree.iter() if el.get('data-curve')==name and el.get('data-panel')=='p0')
        points=[tuple(map(float,p.split(','))) for p in line.get('points').split()]
        for x,y in points:
            q=(x-67)/8.25;p=(310-y)/11.6
            assert 0<=q<=25.00001 and abs(p-(4+.4*q))<.0001, 'Invalid initial supply'
        assert points[-1]==(273.25,147.6), 'Initial capacity endpoint'
        # The original 100 firms' cap must not truncate new entrants' supply.
        if stem.endswith('ans_2'):
            after=next(el for el in tree.iter() if el.get('data-curve')=='A₁')
            before=ET.fromstring(old((market/(stem+'.svg')).relative_to(lessons).as_posix()))
            original=next(el for el in before.iter() if el.get('data-curve')=='A₁')
            assert after.attrib==original.attrib, 'Post-entry supply changed'
        passed('initial capacity and post-entry preservation: '+stem)
    answers=text(B34+'/books/book-4/chapters/4.3/Antwoorden.md')
    soup=BeautifulSoup(answers,'html.parser');blocks=soup.select('.answer-block')
    ids=[]
    for block in blocks:
        n=block['data-answer-exercise'];ids.append(n)
        assert block.find('h3')['id']=='antwoord'+n
        assert re.match(r'Opgave '+n+r'\b',block.find('h3').get_text())
        assert all(re.match(re.escape(n)+r'[a-z]$',item['data-answer']) for item in block.select('.answer-item'))
    assert sorted(map(int,ids))==list(range(1,42)) and len(ids)==len(set(ids))
    assert 'Herhaal bij moeite §4.1.3.' in soup.select_one('[data-answer="27a"]').get_text()
    assert 'loonminimumloonregel' not in answers
    # Check every explicit answer href against actual anchors, including exports.
    for f in (lessons/B34/'books/book-4/chapters/4.3').glob('output/*.html'):
        html=BeautifulSoup(f.read_text(encoding='utf8'),'html.parser');anchors={x.get('id') for x in html.select('[id]')}
        for link in html.select('a[href^="#antwoord"]'):assert link['href'][1:] in anchors,(f,link)
    passed('all 41 answer containers/headings/subanswers and internal references agree')
    # Every exercise and every target question/answer remains the same. The
    # separately explained maintenance never releases existing target holds.
    for rel in subprocess.check_output(['git','ls-tree','-r','--name-only',BASE,'--',B1+'/bronnen',B34+'/books'],cwd=lessons,text=True).splitlines():
        if not rel.endswith('.md') or '/historical-' in rel:continue
        before=BeautifulSoup(old(rel).decode('utf8'),'html.parser');after=BeautifulSoup(text(rel),'html.parser')
        a=[str(x) for x in before.select('.exercise')];b=[str(x) for x in after.select('.exercise')]
        assert a==b,'Exercise content changed: '+rel
        if a:passed('exercise identities and complete blocks: '+rel)
    records=[]
    for file in sorted((lessons/B34/'curriculum/targets').glob('*.json')):
        rel=file.relative_to(lessons).as_posix();a=json.loads(old(rel));b=json.loads(file.read_text(encoding='utf8'))
        for key in ['student_manuscript_sha256','answer_file_sha256']:
            a['source_pin'].pop(key,None);b['source_pin'].pop(key,None)
        for doc in [a,b]:
            doc.pop('target_payload_sha256',None)
            for fig in doc.get('answer_figures',[])+doc['target_exercise'].get('figures',[]):fig.pop('sha256',None)
        assert a==b,'Target meaning/authority changed: '+file.name
        current=json.loads(file.read_text(encoding='utf8'));pin=current['source_pin']
        for source,hashkey in [('student_file','student_manuscript_sha256'),('answer_file','answer_file_sha256')]:
            assert hashlib.sha256((lessons/B34/pin[source]).read_bytes()).hexdigest()==pin[hashkey]
        for fig in current.get('answer_figures',[])+current['target_exercise'].get('figures',[]):
            # Paths in the owned records are relative to the edition root.
            assert hashlib.sha256((lessons/B34/fig['path']).read_bytes()).hexdigest()==fig['sha256']
        records.append(current);passed('target identity, authority and current source hashes: '+current['id'])
    assert len(records)==31
    combined=json.loads(text(B34+'/curriculum/course-target-exercises-books34-v3.json'))
    actual=combined if isinstance(combined,list) else combined['records']
    assert actual==records,'Combined target projection stale'
    source=text(B1+'/bronnen/H3/1.3.3 Verschuivingen en nieuw evenwicht – paragraaf.md')
    assert source.index('Uitgewerkt voorbeeld · Minder vraag én minder aanbod')<source.index('id="ex27"')
    assert 'De vraaglijn is dalend en de aanbodlijn is stijgend' in source
    assert 'de prijs stijgen, dalen of gelijk blijven' in source
    totals=[]
    for n in (1,2,3):
        for row in json.loads(text(B1+f'/bronnen/H{n}/QA/lesson_minutes.json')):
            assert sum(row['components'].values())==row['total'];totals.append(row['total'])
    assert sum(totals)==1386 and math.ceil(sum(totals)/55)==26
    passed('separate worked example and complete supported-route estimate')
    books=[(B1+'/boek/Boek_1_Compleet_Tweede_editie.pdf',132),
           (B1+'/boek/Boek_1_Compleet_Antwoorden_Tweede_editie.pdf',66),
           (B1+'/boek/Boek_1_Compleet_Docenteninformatie_Tweede_editie.pdf',28)]
    for n,sizes in [(3,(132,74,22)),(4,(166,68,28))]:
        for suffix,pages in zip(['','_Antwoorden','_Docenteninformatie'],sizes):books.append((f'{B34}/books/book-{n}/output/Boek_{n}_Compleet{suffix}_v3.pdf',pages))
    navigation=[]
    def links(page):
        return [{k:(list(v) if isinstance(v,(fitz.Rect,fitz.Point)) else v) for k,v in item.items() if k not in ['xref','id']} for item in page.get_links()]
    for rel,pages in books:
        with fitz.open(lessons/rel) as current,fitz.open(stream=old(rel)) as before:
            assert len(current)==len(before)==pages
            assert current.get_toc()==before.get_toc(),'Changed bookmarks '+rel
            for a,b in zip(before,current):assert links(a)==links(b),'Changed link rectangles/destinations '+rel
            navigation.append({'path':rel,'pages':pages,'links':sum(len(p.get_links()) for p in current)})
            if rel.endswith('Boek_1_Compleet_Tweede_editie.pdf'):
                for sourcepage,question in [(40,36),(80,37),(120,37)]:
                    assert 'Bron A' in current[sourcepage-1].get_text() and f'Opgave {question}' in current[sourcepage].get_text()
                assert 'Uitgewerkt voorbeeld' in current[113].get_text() and 'Opgave 28' in current[113].get_text()
            if rel.endswith('Boek_3_Compleet_v3.pdf'):
                assert '###' not in ''.join(p.get_text() for p in current)
                glossary=current[126].get_text();assert all(s in glossary for s in ['externe effecten','subsidie','betalingsbereidheid','overheidsontvangsten'])
        passed('complete PDF contents, page count, links, bookmarks: '+rel)
    report={'passed':True,'checks':len(checks),'items':checks,'complete_publications':navigation,
            'curriculum_authority_changed':False,'lesson_timing':'Design estimate; classroom measurement remains separate.'}
    if args.report:args.report.parent.mkdir(parents=True,exist_ok=True);args.report.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf8',newline='\n')
    print(json.dumps({k:v for k,v in report.items() if k!='items'},ensure_ascii=False,indent=2))

if __name__=='__main__':main()
