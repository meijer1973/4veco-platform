"""Focused R1–R5 checks, separate from the original 598 edition checks."""
from pathlib import Path
import ast, base64, hashlib, io, json, re, sys, xml.etree.ElementTree as ET
import fitz
from bs4 import BeautifulSoup
from PIL import Image
import cairosvg
from render import ROOT, render_md
from records import payload_hash


def norm(text):return re.sub(r'\s+',' ',text).strip()
def sha(file):return hashlib.sha256(file.read_bytes()).hexdigest()

def main():
    results=[]
    def ck(name,ok,detail=None):results.append({'name':name,'pass':bool(ok),'detail':detail})
    module=json.loads((ROOT/'curriculum/course-target-exercises-books34-v3.json').read_text(encoding='utf-8'))
    byid={r['id']:r for r in module['records']}
    allfigs=[]
    for row in json.loads((ROOT/'checks/figure-label-contract.json').read_text(encoding='utf-8')):
        svg=ROOT/row['svg'];s=svg.read_text(encoding='utf-8');number=byid[row['paragraph_id']]['target_exercise']['exercise_number']
        ck(row['svg']+' title number concordance',re.findall(r'Doeloefening (\d+) ·',s)==[number,number])
        png=Image.open(ROOT/row['png']).convert('RGBA')
        rerender=Image.open(io.BytesIO(cairosvg.svg2png(bytestring=svg.read_bytes(),output_width=png.width,output_height=png.height))).convert('RGBA')
        ck(row['png']+' current SVG raster match',png.size==tuple(row['png_size']) and png.tobytes()==rerender.tobytes())
        title=next(x.text for x in ET.fromstring(s).iter() if x.tag.endswith('title'))
        with fitz.open(ROOT/'books/book-4/output/Boek_4_Compleet_Antwoorden_v3.pdf') as d:
            ck('Book4 answer p'+str(row['complete_answer_page'])+' '+title,norm(title) in norm(d[row['complete_answer_page']-1].get_text()))
        allfigs.append(row['svg'])
    # Independently check that each non-question paragraph inside the target's
    # exercise container survives export. This is where the reported loss occurred.
    contexts=[]
    for pid,r in byid.items():
        t=r['target_exercise'];source=BeautifulSoup(render_md(t['sources'][0]['content']),'html.parser')
        kept=[]
        for ex in source.select('.exercise'):
            for p in ex.find_all('p'):
                label=p.find('b',recursive=False)
                if label and re.match(r'^[a-z]\.',label.get_text(strip=True)):continue
                # Some original HTML has a table and nested question <p>s inside
                # its unclosed context <p>. Exclude those descendant questions
                # before comparing the source context, without dropping the table.
                cp=BeautifulSoup(str(p),'html.parser')
                for child in list(cp.find_all('p')):
                    first=child.find('b',recursive=False)
                    if first and re.match(r'^[a-z]\.',first.get_text(strip=True)):child.decompose()
                text=norm(cp.get_text(' ',strip=True))
                if text:kept.append(text)
        missing=[p for p in kept if p not in norm(t['context'].replace('|',' '))]
        ck(pid+' inline context retained',not missing,missing)
        contexts.append({'paragraph':pid,'inline_context_paragraphs':len(kept),'context_characters':len(t['context'])})
        exported=BeautifulSoup(t['context_html'],'html.parser')
        ck(pid+' all source tables retained',len(source.find_all('table'))==len(exported.find_all('table')))
        ck(pid+' required source images retained',len(source.find_all('img'))==len(exported.find_all('img'))==len(t['figures']))
        ck(pid+' no subquestions duplicated in context',not exported.select('[data-question]'))
        ck(pid+' canonical source_ref',r['source_ref']==f'references/owned/course-blueprint-v5.md §{pid}')
        ck(pid+' current manuscript locator',(ROOT/r['source_pin']['student_file']).is_file())
        expected=payload_hash(t['sources'][0]['content'],t['context'],t['context_html'],t['subquestions'],r['short_answer_model'],r['answer_model_support_html'],t['figures'],r['answer_figures'])
        ck(pid+' full exported payload hash',r['target_payload_sha256']==expected)
        ck(pid+' combined and individual records agree',r==json.loads((ROOT/'curriculum/targets'/f'{pid}.json').read_text(encoding='utf-8')))
        for x in t['figures']+r['answer_figures']:
            ck(pid+' asset binding '+x['path'],(ROOT/x['path']).is_file() and sha(ROOT/x['path'])==x['sha256'])
    # These exact failures must not hide behind retained raw source content.
    for pid,phrases in {'3.2.2':['TK = 0,04q² + 4q + 400','200 kg','euro per week'],
                        '4.3.2':['5.000','3.000','500','1.500','Lᵥ = 240 − 10w','Lₐ = −40 + 10w']}.items():
        for phrase in phrases:ck(pid+' decisive context: '+phrase,phrase in byid[pid]['target_exercise']['context'])
    badio=[];open_calls=0
    for f in sorted(list((ROOT/'build').glob('*.py'))+list((ROOT/'tests').glob('*.py'))+[ROOT/'verify_manifest.py']):
        for node in ast.walk(ast.parse(f.read_text(encoding='utf-8'))):
            if not isinstance(node,ast.Call):continue
            fun=node.func
            if not isinstance(fun,ast.Attribute):continue
            if fun.attr in ('read_text','write_text'):
                open_calls+=1
                if not any(k.arg=='encoding' and isinstance(k.value,ast.Constant) and k.value.value in ('utf8','utf-8','utf-8-sig') for k in node.keywords):badio.append(f.name+':'+str(node.lineno))
            elif fun.attr=='open' and not (isinstance(fun.value,ast.Name) and fun.value.id in ('fitz','Image')):
                mode=node.args[0].value if node.args and isinstance(node.args[0],ast.Constant) else 'r'
                if isinstance(mode,str) and 'b' in mode:continue
                open_calls+=1
                if not any(k.arg=='encoding' for k in node.keywords):badio.append(f.name+':'+str(node.lineno))
    ck('All current explicit text-I/O calls name their encoding',not badio,{'calls':open_calls,'violations':badio})
    ck('No distributed font binaries',not any(f.suffix.lower() in ('.ttf','.otf','.woff','.woff2') for f in ROOT.rglob('*') if f.is_file()))
    # No manuscript/answer/teacher rewrites were part of these five repairs.
    original=json.loads((ROOT/'provenance/received-v3-manifest.json').read_text(encoding='utf-8'))
    selected=[r for r in original['files'] if r['path'].startswith('books/') and (
        re.search(r'/\d\.\d\.\d manuscript\.md$',r['path']) or r['path'].endswith('/Antwoorden.md') or r['path'].endswith('/Docenteninformatie.md') or r['path'].endswith('/book-matter/back.md'))]
    changed=[r['path'] for r in selected if sha(ROOT/r['path'])!=r['sha256']]
    ck('All 31 manuscripts, six answer sources, six teacher sources and two backmatter sources unchanged',not changed,{'files':len(selected),'changed':changed})
    failures=[r['name'] for r in results if not r['pass']]
    report={'scope':'Focused package-repair checks; no independent curriculum approval or Windows/repository-CI claim','checks':len(results),'failures':failures,'context_inventory':contexts,'results':results}
    (ROOT/'checks/repair-verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
    print('Repair checks:',len(results),'checks;',len(failures),'failures')
    if failures:print('\n'.join(failures));raise SystemExit(1)
if __name__=='__main__':main()
