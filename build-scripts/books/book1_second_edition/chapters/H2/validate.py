import os
"""Reproducible local checks; not a classroom trial or an official curriculum approval.
Run after build.py. Checks parsed output, not only intended graphic coordinates.
"""
from pathlib import Path
import ast, hashlib, json, math, re, sys, unicodedata
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
from markdown_it import MarkdownIt
import fitz

ROOT=Path(os.environ['BOOK1_CHAPTER_ROOT'])
QA=ROOT/'QA'
CHECKS=[]
NS={'s':'http://www.w3.org/2000/svg'}
MD=MarkdownIt('commonmark',{'html':True}).enable('table')
def check(label, condition, detail=''):
    CHECKS.append({'check':label,'pass':bool(condition),**({'detail':detail} if detail else {})})
def near(a,b,tol=0.0001): return abs(a-b)<=tol

def norm(t):
    t=BeautifulSoup(MD.render(t),'html.parser').get_text(' ')
    t=unicodedata.normalize('NFKC',t).replace('\u00ad','')
    return re.sub(r'\s+','',t)

def calculate(expr):
    """Allow only authored arithmetic expressions and max/min/abs, no file or code access."""
    node=ast.parse(expr,mode='eval')
    allowed=(ast.Expression,ast.BinOp,ast.UnaryOp,ast.Constant,ast.Add,ast.Sub,
             ast.Mult,ast.Div,ast.Pow,ast.USub,ast.UAdd,ast.Call,ast.Name,ast.Load)
    for part in ast.walk(node):
        if not isinstance(part,allowed): raise ValueError('Unsupported arithmetic syntax')
        if isinstance(part,ast.Name) and part.id not in ('max','min','abs'): raise ValueError('Unsupported name')
    return eval(compile(node,'<authored arithmetic>','eval'),{'__builtins__':{}},{'max':max,'min':min,'abs':abs})

def values(e,names):return tuple(float(e.get(n)) for n in names)
def xy(plot,q,p):
    return (plot['ox']+(plot['ex']-plot['ox'])*q/plot['xmax'],
            plot['by']-(plot['by']-plot['top'])*p/plot['ymax'])
def qp(plot,x,y):
    return ((x-plot['ox'])*plot['xmax']/(plot['ex']-plot['ox']),
            (plot['by']-y)*plot['ymax']/(plot['by']-plot['top']))

def graphs():
    reg=json.loads((QA/'figures.json').read_text(encoding='utf8'))
    check('33 registered SVG/PNG figures',len(reg)==33)
    for item in reg:
        name=item['file'];fn=ROOT/'_assets'/(name+'.svg')
        check(name+' SVG exists',fn.exists());check(name+' PNG exists',(fn.with_suffix('.png')).exists())
        tree=ET.parse(fn).getroot(); els=list(tree.iter()); text=' '.join(e.text or '' for e in tree.findall('s:text',NS))
        check(name+' labelled visual',bool(text))
        check(name+' viewport',tree.get('viewBox')==f"0 0 720 {item['height']}")
        if item['type']=='chart':
            pl=item['plot'];models={c['name']:c for c in item['curves']}
            for c in item['curves']:
                line=next((e for e in els if e.get('data-curve')==c['name']),None)
                check(name+'/'+c['name']+' drawn state',(line is not None)==c['drawn'])
                if line is not None:
                    x1,y1,x2,y2=values(line,['x1','y1','x2','y2'])
                    for k,(x,y) in enumerate([(x1,y1),(x2,y2)]):
                        q,p=qp(pl,x,y)
                        check(name+'/'+c['name']+f' actual endpoint {k} on model',near(q,c['a']-c['b']*p))
                        check(name+'/'+c['name']+f' endpoint {k} within intended interval',c['pmin']-1e-4<=p<=c['pmax']+1e-4 and q>=-1e-4)
            for dot in (e for e in els if e.get('data-on')):
                model=models[dot.get('data-on')];x,y=values(dot,['cx','cy']);q,p=qp(pl,x,y);qid=dot.get('id')
                check(name+'/'+qid+' actual point on function',near(q,model['a']-model['b']*p))
                check(name+'/'+qid+' intended coordinates match drawing',near(q,float(dot.get('data-q'))) and near(p,float(dot.get('data-p'))))
                check(name+'/'+qid+' point inside interval',model['pmin']-1e-4<=p<=model['pmax']+1e-4)
                for line in (e for e in els if e.get('data-for')==qid):
                    actual=values(line,['x1','y1','x2','y2'])
                    expected=(pl['ox'],y,x,y) if line.get('data-guide')=='h' else (x,y,x,pl['by'])
                    check(name+'/'+qid+'/'+line.get('data-guide')+' guide aligned',all(near(a,b) for a,b in zip(actual,expected)))
        elif item['type']=='aggregation':
            for i,pl in enumerate(item['panels']):
                line=next(e for e in els if e.get('data-panel-curve')==str(i))
                x1,y1,x2,y2=values(line,['x1','y1','x2','y2'])
                for k,(x,y) in enumerate([(x1,y1),(x2,y2)]):
                    q,p=qp(pl,x,y)
                    check(name+f'/panel{i}/endpoint{k}',near(q,pl['a']-pl['b']*p) and -1e-4<=p<=pl['pmax']+1e-4)
                dot=next(e for e in els if e.get('data-panel-dot')==str(i))
                x,y=values(dot,['cx','cy']);q,p=qp(pl,x,y)
                check(name+f'/panel{i}/point',near(p,pl['price']) and near(q,pl['a']-pl['b']*p))
                for key,expected in [('h',(pl['ox'],y,x,y)),('v',(x,y,x,pl['by']))]:
                    l=next(e for e in els if e.get('data-panel-'+key)==str(i))
                    check(name+f'/panel{i}/guide{key}',all(near(a,b) for a,b in zip(values(l,['x1','y1','x2','y2']),expected)))
            ps=item['panels'];check(name+' combined coefficients',ps[2]['a']==ps[0]['a']+ps[1]['a'] and ps[2]['b']==ps[0]['b']+ps[1]['b'])
            check(name+' common interval not extrapolated',near(ps[2]['pmax'],min(ps[0]['a']/ps[0]['b'],ps[1]['a']/ps[1]['b'])))
        elif item['type']=='dropout':
            pl=item['plot'];models=item['models'];fn=lambda p:sum(max(0,a-b*p) for a,b in models)
            line=next(e for e in els if e.get('data-poly')=='aggregate')
            pts=[tuple(map(float,p.split(','))) for p in line.get('points').split()]
            for i,(x,y) in enumerate(pts):
                q,p=qp(pl,x,y);check(name+f'/dropout endpoint{i}',near(q,fn(p)))
            for nameattr in ['data-cutoff','data-test']:
                e=next(e for e in els if e.get(nameattr));q,p=qp(pl,*values(e,['cx','cy']))
                check(name+'/'+nameattr,near(q,fn(p)))
        # Check labels do not lie outside the declared viewport; rotated labels checked visually.
        check(name+' text anchor coordinates within viewport',all(0<=float(e.get('x'))<=720 and 0<=float(e.get('y'))<=item['height'] for e in tree.findall('s:text',NS)))
    return reg

def main():
    exercises=json.loads((QA/'exercises.json').read_text(encoding='utf8'));targets=json.loads((QA/'target_exercises.json').read_text(encoding='utf8'))
    check('exercise numbers unique 1–38',sorted(e['number'] for e in exercises)==list(range(1,39)))
    check('90 subquestions',sum(len(e['questions']) for e in exercises)==90)
    check('4 target exercises from the new outline',[e['number'] for e in targets]==[8,19,30,37])
    for e in exercises:
        check(f"exercise {e['number']} complete answers",len(e['questions'])==len(e['answers']) and all(len(a)==2 and all(x.strip() for x in a) for a in e['answers']))
        if e['kind']=='bonus':check(f"exercise {e['number']} bonus criteria",bool(e['criteria']) and 2<=len(e['criteria'])<=4)
    expected_headings=['Uitgewerkt voorbeeld','Startopgaven','Begeleide inoefening','Zelfstandige oefening','Doeloefening','Denkertje / Bonusopgave','Herhaling en combineren']
    for fn in sorted(ROOT.glob('1.2.? *paragraaf.md')):
        t=fn.read_text(encoding='utf8');heads=re.findall(r'^## (.+)$',t,re.M)
        check(fn.name+' exact seven exercise headings',heads==expected_headings,str(heads))
        check(fn.name+' summary in correct interval','Samenvatting' in t[t.index('## Uitgewerkt voorbeeld'):t.index('## Startopgaven')])
        check(fn.name+' paper route',all(x in t for x in ['Normale route: Startopgaven → Begeleide inoefening → Zelfstandige oefening → Doeloefening.', 'Uitdagende route: Startopgaven → Zelfstandige oefening → Doeloefening → Denkertje / Bonusopgave.', 'Begeleide inoefening hoort bij leren: je oefent met denkstappen en doet steeds meer zelf.']))
    arithmetic=json.loads((QA/'numerical_cases.json').read_text(encoding='utf8'))
    for c in arithmetic:check('arithmetic: '+c['label'],near(calculate(c['expression']),c['expected']))
    # Independent target fixtures, not generated from graph inputs.
    fixtures=[('Iris: three prints',sum(v>=5 for v in [12,9,5,2]),3),
              ('Amir: inverse price', (20-6)/4,3.5),('Lumi net quantity',120-5*10,70),
              ('Lumi change',(120-5*10)-(100-5*8),10),
              ('Spellenclub common interval',min(18/3,24/2),6),
              ('Spellenclub dropout',max(0,18-3*8)+max(0,24-2*8),8),
              ('Club Noord old quantity',24-3*4+36-3*4,36),
              ('Club Noord after both changes',60-6*6+12,36),
              ('Sem counted once: purchases',sum(v>=6 for v in [7,6,4,2]),2)]
    for label,value,expected in fixtures:check('independent fixture: '+label,near(value,expected))
    figures=graphs()
    chapter=(ROOT/'1.2 Vraag – hoofdstuk.md').read_text(encoding='utf8');ans=(ROOT/'Antwoorden.md').read_text(encoding='utf8')
    def assets(t): return set(re.findall(r'_assets/([^"\s]+)\.svg',t))
    check('22 student instructional figures',len(assets(chapter))==22)
    check('11 answer figures',len(assets(ans))==11)
    for asset in assets(chapter)|assets(ans):
        check(asset+' referenced asset is registered',asset in {x['file'] for x in figures})
    check('chapter opener uses chapter goal label','Na dit hoofdstuk kun je' in (ROOT/'Voorblad.md').read_text(encoding='utf8'))
    p2={};fulltexts={}
    for kind,stem,count in [('student','Boek_1_H2_Vraag_Tweede_editie',40),('answer','Boek_1_H2_Antwoorden_Tweede_editie',22),('teacher','Boek_1_H2_Docenteninformatie_Tweede_editie',8)]:
        pdf=fitz.open((ROOT.parent.parent/'hoofdstukken'/ROOT.name)/(stem+'.pdf'));p2[kind]=len(pdf);fulltexts[kind]='\n'.join(p.get_text() for p in pdf)
        check(kind+' expected actual page count',len(pdf)==count)
        mapping=json.loads((QA/(stem+'_page_map.json')).read_text(encoding='utf8'))
        check(kind+' no pagination drift',all(m['designed_pages']==[m['pdf_page']] for m in mapping))
        for n,page in enumerate(pdf,1):
            check(f'{kind} p{n} A4',near(page.rect.width,595.2756,.05) and near(page.rect.height,841.8898,.05))
            t=page.get_text();check(f'{kind} p{n} text is selectable',len(t.strip())>60)
            check(f'{kind} p{n} no replacement glyph','\ufffd' not in t and '\x00' not in t)
            check(f'{kind} p{n} text within page',all(b[0]>=-1 and b[1]>=-1 and b[2]<=page.rect.width+1 and b[3]<=page.rect.height+1 for b in page.get_text('blocks') if b[6]==0))
            for l in page.get_links():check(f'{kind} p{n} link destination',{fitz.LINK_GOTO:lambda:0<=l.get('page',-1)<len(pdf),fitz.LINK_URI:lambda:True}.get(l['kind'],lambda:False)())
        for _,name,p in pdf.get_toc():check(kind+' bookmark '+name,1<=p<=count)
    st=norm(fulltexts['student']);ant=norm(fulltexts['answer'])
    for e in exercises:
        check(f"exercise {e['number']} visible in student PDF",norm(f"Opgave {e['number']} · {e['title']}") in st)
        check(f"exercise {e['number']} visible in answer PDF",norm(f"Opgave {e['number']} · {e['title']}") in ant)
        for i,q in enumerate(e['questions']):check(f"exercise {e['number']}{chr(97+i)} prompt preserved",norm(q) in st)
        for i,(a,w) in enumerate(e['answers']):
            check(f"exercise {e['number']}{chr(97+i)} answer preserved",norm(a) in ant)
            check(f"exercise {e['number']}{chr(97+i)} why preserved",norm(w) in ant)
    # Final target source and questions remain a left/right facing-page spread.
    with fitz.open((ROOT.parent.parent/'hoofdstukken'/ROOT.name)/'Boek_1_H2_Vraag_Tweede_editie.pdf') as pdf:
        check('mixed source page 36',all(x in pdf[35].get_text() for x in ['Bron A','Bron B','Bron C']))
        check('mixed questions page 37','Hoeveel halfuren' in pdf[36].get_text())
    failed=[c for c in CHECKS if not c['pass']]
    result={'scope':'Local content, arithmetic, parsed SVG geometry, coverage, navigation and page integrity. Not classroom or external specialist validation.','pass':not failed,'checks':len(CHECKS),'failed':failed,'counts':{'exercises':len(exercises),'subquestions':sum(len(e['questions']) for e in exercises),'targets':len(targets),'instructional_figures':22,'answer_figures':11,'pdf_pages':p2},'details':CHECKS}
    (QA/'validation.json').write_text(json.dumps(result,ensure_ascii=False,indent=2), encoding='utf8', newline='\n')
    print(json.dumps({k:v for k,v in result.items() if k!='details'},ensure_ascii=False,indent=2))
    if failed:raise SystemExit(1)
if __name__=='__main__':main()
