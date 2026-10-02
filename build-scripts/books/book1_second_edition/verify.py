"""Bounded source, history and saved-output verification for Book 1 edition 2."""
from pathlib import Path
import argparse,hashlib,json,re,zipfile,sys,subprocess,unicodedata
from bs4 import BeautifulSoup
from markdown_it import MarkdownIt
import fitz

ROOT=Path(__file__).resolve().parents[3]
RECEIVED=ROOT/'references/owned/book1-second-edition-2026/received'
SOURCE_HASH='511d95fdbba6185594a74f183e66f4777f32dd3824739a8924510e0bb2499a0b'
NORMAL='Normale route: Startopgaven → Begeleide inoefening → Zelfstandige oefening → Doeloefening.'
CHALLENGE='Uitdagende route: Startopgaven → Zelfstandige oefening → Doeloefening → Denkertje / Bonusopgave.'
INTRO='Begeleide inoefening hoort bij leren: je oefent met denkstappen en doet steeds meer zelf.'
ROUTE=NORMAL+' '+CHALLENGE+' Herhaling is aanvullend bij beide routes.'
NOTE='Begeleide inoefening is voor de meeste leerlingen de normale route. Heb je minder tussenstappen nodig en zoek je extra uitdaging, dan kun je de uitdagende route volgen. Beide routes leiden naar dezelfde doeloefening.'
ASSUMPTION=' Neem aan dat de nieuwe vraaglijn recht blijft tot de gevraagde hoeveelheid nul is.'
DOMAIN_SENTENCES=['Daardoor vragen kopers bij elke onderzochte prijs 12 wraps extra.','Volgens de bron willen zij daardoor bij elke onderzochte prijs 12 lessen extra.','Hierdoor worden bij Lumi bij elke onderzochte prijs 20 bezoeken extra gevraagd.']
def sha(b):return hashlib.sha256(b).hexdigest()
def lf(b):return b.decode('utf8').replace('\r\n','\n') if isinstance(b,bytes) else b.replace('\r\n','\n')
def revised_student(text,name):
    s=lf(text).replace('Korte route: Startopgaven → Zelfstandige oefening → Doeloefening. Extra hulp nodig? Maak eerst Begeleide inoefening.',ROUTE)
    s=s.replace('Heb je deze hulp niet nodig? Ga dan verder met Zelfstandige oefening.',INTRO)
    s=s.replace('De begeleide inoefening geeft extra hulp; zelfstandige oefening bereidt voor op de doeloefening. De denkertjes zijn extra.',NOTE)
    s=s.replace('De berekende 64 kilo is aangeboden kaas','De berekende hoeveelheid is aangeboden kaas')
    s=s.replace('Herhaling / Herhaling en interleaving','Herhaling en combineren')
    for old in DOMAIN_SENTENCES:s=s.replace(old,old+ASSUMPTION)
    if name=='Voorblad.md' and 'Begeleide inoefening is voor de meeste' not in s:s+='\n<p class="note">'+NOTE+' Herhaling is aanvullend bij beide routes.</p>\n'
    return s
def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--lessons',type=Path,required=True);parser.add_argument('--report',type=Path);args=parser.parse_args()
    lessons=args.lessons.resolve();book=lessons/'Boek 1 - Grondslagen, vraag en aanbod';edition=book/'edities/tweede-editie-2026'
    checks=[]
    def check(name,ok):
        checks.append({'check':name,'pass':bool(ok)})
    package=RECEIVED/'Boek_1_Compleet_Tweede_editie_Bronpakket(1).zip'
    check('immutable original source receipt',sha(package.read_bytes())==SOURCE_HASH)
    with zipfile.ZipFile(package) as archive:
        prefix=next(n.split('/source_chapters/')[0] for n in archive.namelist() if '/source_chapters/' in n)
        for n in range(1,4):
            root=edition/'bronnen'/f'H{n}';old=prefix+f'/source_chapters/Boek_1_H{n}_Tweede_editie_bronpakket/'
            order=json.loads((root/'chapter-order.json').read_text(encoding='utf8'))
            for file in order:
                check(f'H{n}/{file}: only prescribed manuscript changes',lf((root/file).read_bytes())==revised_student(archive.read(old+file),file))
            check(f'H{n}: all original answer source preserved',lf((root/'Antwoorden.md').read_bytes())==lf(archive.read(old+'Antwoorden.md')))
            for file in (root/'_assets').iterdir():
                check(f'H{n}/{file.name}: exact original figure',file.read_bytes()==archive.read(old+'_assets/'+file.name))
            for i,file in enumerate(order[1:4],1):
                text=(root/file).read_text(encoding='utf8')
                check(f'1.{n}.{i}: complete normal/challenging route',all(t in text for t in [NORMAL,CHALLENGE,INTRO]))
                check(f'1.{n}.{i}: no optional-guidance contradiction',not re.search(r'Korte route|Extra hulp nodig|Heb je deze hulp niet nodig',text))
            plans=json.loads((root/'QA/lesson_minutes.json').read_text(encoding='utf8'))
            for row in plans:
                c=row['components'];check(row['paragraph']+': complete normal arithmetic',row['total']==sum(c.values()))
                if row['normal_route']:
                    check(row['paragraph']+': supported budget',c['begeleid']>0 and c['motivatie']>0 and c['samenvatting']>0)
                    check(row['paragraph']+': challenge includes bonus',row['bonus_minutes']>0 and row['challenging_total']==row['total']-c['begeleid']+row['bonus_minutes'])
            exports=json.loads((root/'QA/paragraph_exports.json').read_text(encoding='utf8'))
            md=MarkdownIt('commonmark',{'html':True}).enable('table')
            def norm(s):return re.sub(r'\s+','',unicodedata.normalize('NFKC',BeautifulSoup(md.render(s),'html.parser').get_text(' ')).replace('\u00ad',''))
            exercises=json.loads((root/'QA/exercises.json').read_text(encoding='utf8'))
            check(f'H{n}: eight paragraph exports',len(exports)==8)
            for export in exports:
                with fitz.open(edition/export['file']) as pdf,fitz.open(edition/export['source']) as source:
                    start,end=export['pages_in_source'];check(export['file']+': exact slice',len(pdf)==end-start+1 and all(p.get_text()==source[start+i-1].get_text() for i,p in enumerate(pdf)))
                    text=norm(' '.join(p.get_text() for p in pdf))
                    members=[e for e in exercises if e['section']==export['paragraph']]
                    if export['kind']=='answers':
                        check(export['file']+': every answer and continuation',all(norm(s) in text for e in members for pair in e['answers'] for s in ([pair] if isinstance(pair,str) else pair) if s.strip()))
            check(f'H{n}: every exercise retained',len(exercises)==38)
    inventory=json.loads((book/'historisch/eerste-editie-inventaris.json').read_text(encoding='utf8'))
    oldzip=book/'historisch/eerste-editie-20261002.zip'
    check('first edition archive exact SHA',sha(oldzip.read_bytes())==inventory['archive_sha256'])
    baseline='e734532a42b27732ac25ce990fc9448b12309d28'
    check('first edition original Git baseline',inventory['repository_commit']==baseline)
    tree=subprocess.check_output(['git','ls-tree','-rz',baseline,'--',book.name],cwd=lessons).decode('utf8')
    blobs={entry.split('\t',1)[1]:entry.split('\t',1)[0].split()[2] for entry in tree.split('\0') if entry}
    with zipfile.ZipFile(oldzip) as archive:
        check('first edition complete 1102-file inventory',len(inventory['files'])==1102 and sorted(r['path'] for r in inventory['files'])==sorted(n for n in archive.namelist() if not n.endswith('/')))
        check('first edition inventory equals original Git tree',set(blobs)==set(r['path'] for r in inventory['files']))
        for row in inventory['files']:
            data=archive.read(row['path'])
            check('first edition exact bytes: '+row['path'],sha(data)==row['sha256'])
            check('first edition original Git blob: '+row['path'],hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()==blobs.get(row['path']))
    manifest=json.loads((edition/'manifest.json').read_text(encoding='utf8'))
    for kind,pages in [('student',132),('answers',66),('teacher',28)]:
        with fitz.open(edition/'boek'/manifest['files'][kind]) as pdf:
            check(kind+': full page count',len(pdf)==pages)
            check(kind+': links resolve',all(l['kind']==fitz.LINK_GOTO and 0<=l['page']<len(pdf) for p in pdf for l in p.get_links()))
    check('legacy complete PDF URL serves current PDF',(book/'Boek 1 Grondslagen, vraag en aanbod – boek.pdf').read_bytes()==(edition/'boek'/manifest['files']['student']).read_bytes())
    data=json.loads((edition/'bronnen/omslag/data.json').read_text(encoding='utf8'))
    check('cover prices and indexes agree',all(abs(r['index']-r['price']/data['index'][0]['price']*100)<1e-8 for r in data['index']))
    check('cover equilibrium',data['market']==dict(demand_intercept=60,demand_slope=-10,supply_intercept=0,supply_slope=10,price=3,quantity=30))
    report={'checks':len(checks),'passed':sum(x['pass'] for x in checks),'failed':[x['check'] for x in checks if not x['pass']],'items':checks}
    if args.report:args.report.parent.mkdir(parents=True,exist_ok=True);args.report.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf8', newline='\n')
    print(json.dumps({k:v for k,v in report.items() if k!='items'},ensure_ascii=False,indent=2))
    if report['failed']:raise SystemExit(1)
if __name__=='__main__':main()
