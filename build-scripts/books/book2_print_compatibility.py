"""HOW TO ADAPT: audit source PAGE anchors and separately versioned slide maps.

No slide source, economic value, timing or published classroom file is edited.
"""
import argparse,hashlib,json,re,subprocess
from collections import defaultdict
from pathlib import Path
from build_book2_chat import EDITION

ROOT=Path(__file__).resolve().parents[2]
ORIGINAL='d53080f38ebbdbba319e6d9b89dcba86067a72be'
NAMES={'2.1.2/3':'SokkenShop','2.1.4/5':'SmoothBox','2.2.4/5':'StreamPlus','2.3.2/8':'Concertkaartjes',
       '2.3.3/6':'Concertkaartjes met boekingsgrens','2.3.4/2':'Plantenmarkt','2.3.4/3':'Huurfietsen'}
IMPACT='notation-print-impact.json'
COMPAT='presentation-page-compatibility.json'
GUIDE='PRESENTATIES-PAGINAVERWIJZINGEN.md'

def page_exercises(text):
    headings=re.findall(r'(?:<b>|\*\*)Opgave (\d+)\b',text)
    figures=re.findall(r'<figcaption>\s*(?:Bij|Bron bij) opgave (\d+)\b',text)
    return sorted(set(headings+figures),key=int)

def source_pages(lessons,commit=None):
    def read(relative):
        if commit:return subprocess.check_output(['git','show',commit+':'+relative],cwd=lessons).decode('utf8')
        return (lessons/relative).read_text(encoding='utf8')
    base=EDITION.as_posix();config=json.loads(read(base+'/assembly.json'))
    counts=next(b['page_counts']for b in config['bundles']if b['kind']=='student')
    result=defaultdict(list);start=1
    for h,count in enumerate(counts,1):
        folder=base+f'/bronnen/H{h}';page=start
        for name in json.loads(read(folder+'/chapter-order.json')):
            file=folder+'/'+name;pieces=re.split(r'<!-- PAGE (.*?) -->',read(file),flags=re.S)
            for meta,body in zip(pieces[1::2],pieces[2::2]):
                anchor=json.loads(meta)
                for exercise in page_exercises(body):
                    result[anchor['section']+'/'+exercise].append({'page':page,'source':file,'anchor':anchor['title']})
                page+=1
        if page-start!=count:raise ValueError('Source allocation differs for chapter '+str(h))
        start=page
    return dict(result)

def facing(pages):
    if len(pages)!=2 or pages[1]!=pages[0]+1:raise ValueError('Expected adjacent source/question pages')
    return pages[0]%2==0

def print_impact(lessons):
    before=source_pages(lessons,ORIGINAL);after=source_pages(lessons)
    if before.keys()!=after.keys() or len(after)!=114:raise ValueError('Exercise heading inventory changed')
    pairs=[]
    for key,anchors in after.items():
        if len(anchors)==1:continue
        old=[a['page']for a in before[key]];new=[a['page']for a in anchors]
        pairs.append({'exercise':key,'name':NAMES.get(key,key),'previous_pages':old,'current_pages':new,
                      'previous_facing':facing(old),'current_facing':facing(new),'anchors':anchors})
    lost=[r['exercise']for r in pairs if r['previous_facing'] and not r['current_facing']]
    if set(r['exercise']for r in pairs)!=set(NAMES):raise ValueError('Split-exercise inventory needs review')
    if lost!=['2.1.4/5','2.2.4/5','2.3.2/8','2.3.4/2','2.3.4/3']:raise ValueError('Changed facing-page impact needs review')
    return {'baseline':ORIGINAL,'printing':'A4 duplex, long edge; cover first recto; two front-matter pages',
            'exercise_identities':len(after),'split_exercises':pairs,'lost_facing_pairs':lost}

def current_pages(value):
    if isinstance(value,int):return value+(value>=23)
    if isinstance(value,list):return [current_pages(x)for x in value]
    return value

def presentation_audit(lessons):
    rows=[];anchors=source_pages(lessons)
    for file in sorted((ROOT/'build-scripts/content/book-2').glob('presentation-2??.manifest.json')):
        m=json.loads(file.read_text(encoding='utf8'));pid=m.get('paragraph')or'.'.join(file.name.split('-')[1][:3])
        old={k:v for k,v in (m.get('sourcePrintedPages')or m['printedPages']).items()if isinstance(v,(int,list))}
        new={k:current_pages(v)for k,v in old.items()}
        if pid=='2.1.3':new['theory']=[19,20,21,22,23]
        for role in ('start','target'):
            ids=m.get('assignment',{}).get(role,[])
            if isinstance(ids,int):ids=[ids]
            actual=sorted({a['page']for i in ids for a in anchors[pid+'/'+str(i)]})
            mapped=new.get(role,[]);mapped=[mapped]if isinstance(mapped,int)else mapped
            if ids and mapped!=actual:raise ValueError('Presentation mapping does not match exercise anchors '+pid+'/'+role)
        rows.append({'paragraph':pid,'manifest':file.relative_to(ROOT).as_posix(),
                     'manifest_sha256':hashlib.sha256(file.read_bytes()).hexdigest(),
                     'recorded_pages':old,'current_pages':new,
                     'status':'OPEN: page references need repair'if old!=new else'No pagination change; no new slide-content acceptance'})
    if len(rows)!=12:raise ValueError('Expected all twelve existing presentations')
    return {'followup':'BOOK2-PRESENTATION-PAGE-REFERENCES','status':'OPEN',
            'scope':'Separately authorize source, manifest, overview text, speaker-note page references, PPTX and matching PDF repair. Check internal theory references by named example: old page 22 splits Linoprint/Atelier Boog across 22/23; do not apply a blanket shift. Audit cross-paragraph references in notes too. Preserve economics, exercise IDs and timing. Rebuild and independently review changed slides before closing.',
            'presentations':rows}

def warning(pid):
    return (f'# {pid} — presentaties en boekeditie\n\n'
            '> **Let op: verouderde boekpaginaverwijzingen in de presentatie.** De PPTX en presentatie-PDF in deze map horen bij de eerdere paginering. Vanaf §2.1.3 sluiten de paginaverwijzingen niet aan op het herziene leerlingenboek van 111 pagina’s.\n\n'
            'Gebruik vóór de les de [omzettabel en open vervolgtaak](../../../../'+GUIDE+'). De dia’s en sprekersnotities zijn nog niet hersteld; neem hun boekpaginanummers niet rechtstreeks over. Opgavenummers blijven gelijk.\n\n'
            'De paragraaf- en opgaven-PDF’s volgen wel de actuele boekpaginering. Zie [bron- en bouwinformatie](LEESMIJ.md).\n')

def guide(audit):
    text=('# Presentaties: controleer de boekpaginaverwijzingen\n\n'
          '**Waarschuwing voor de herziene editie met 111 leerlingpagina’s:** de bestaande presentaties vanaf §2.1.3 gebruiken nog de eerdere paginering. Dit geldt ook voor hun sprekersnotities en presentatie-PDF’s. Gebruik onderstaande omzettabel vóór de les. De eerste twee presentaties hebben geen paginaverschuiving; dat is geen nieuwe inhoudelijke beoordeling.\n\n'
          'Open vervolgtaak: **BOOK2-PRESENTATION-PAGE-REFERENCES**. Na afzonderlijke opdracht: pas uitsluitend boekpaginaverwijzingen aan in bron, manifest, herhaalde overzichtsdia’s en sprekersnotities; bouw PPTX en PDF opnieuw en laat de gewijzigde dia’s onafhankelijk controleren. Opgavenummers, economische gegevens en tijdschattingen blijven behouden. Tot die afronding blijft deze waarschuwing staan.\n\n'
          'Controleer interne theorieverwijzingen per voorbeeld: de oude pagina 22 is gesplitst over Linoprint op 22 en Atelier Boog op 23. Een algemene verschuiving met één pagina volstaat daar niet. Controleer ook verwijzingen naar andere paragrafen in de sprekersnotities.\n\n'
          'Alle twaalf actuele manifesten zijn gecontroleerd. De tabel komt uit de bestaande manifesten en de actuele manuscriptpagina’s; de oorspronkelijke presentaties en hun bewijsstukken blijven ongewijzigd. Dit dossier staat apart van de printcorrectie van het leerboek.\n\n'
          '| Paragraaf | Onderdeel | In bestaande presentatie | In huidig boek |\n|---|---|---|---|\n')
    labels={'theory':'Theorie','workedExample':'Uitgewerkt voorbeeld','start':'Start','basis':'Begeleid/basis','independent':'Zelfstandig','target':'Doeloefening','practice':'Oefenen','bonusAndReview':'Bonus/herhaling','bonus':'Bonus','extra':'Extra','chapterCheck':'Hoofdstukcheck'}
    fmt=lambda v:', '.join(map(str,v))if isinstance(v,list)else str(v)
    for row in audit['presentations']:
        for role,old in row['recorded_pages'].items():text+=f"| {row['paragraph']} | {labels.get(role,role)} | {fmt(old)} | {fmt(row['current_pages'][role])} |\n"
    return text

def records(lessons):
    root=lessons/EDITION;audit=presentation_audit(lessons)
    expected={root/IMPACT:json.dumps(print_impact(lessons),ensure_ascii=False,indent=2)+'\n',
              root/COMPAT:json.dumps(audit,ensure_ascii=False,indent=2)+'\n',root/GUIDE:guide(audit)}
    for row in audit['presentations']:
        if row['recorded_pages']==row['current_pages']:continue
        pid=row['paragraph'];folders=list((root/f'bronnen/H{pid[2]}/paragrafen').glob(pid+' *'))
        if len(folders)!=1:raise ValueError('Missing/ambiguous paragraph folder '+pid)
        expected[folders[0]/'README.md']=warning(pid)
    return expected

def verify(lessons):
    for file,text in records(lessons).items():
        if not file.is_file() or file.read_text(encoding='utf8')!=text:raise ValueError('Missing/stale compatibility evidence '+str(file))
    return {'split_exercises':7,'lost_facing_pairs':5,'presentations_audited':12,'presentation_warnings':10,'presentation_repair':'OPEN'}

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--write',action='store_true')
    parser.add_argument('--lesson-root',type=Path,default=ROOT.parent/'4veco-lessen');args=parser.parse_args()
    if args.write:
        for file,text in records(args.lesson_root).items():file.write_text(text,encoding='utf8',newline='\n')
    print(json.dumps(verify(args.lesson_root),indent=2))
