"""HOW TO ADAPT: bounded saved-deck comparison for an authorized edition revision.

Compare every slide and note against the preceding reviewed deck, including
native tables/charts. Economic numbers and all non-reference text stay fixed.
"""
import argparse,hashlib,io,json,os,re,subprocess,sys,zipfile
from pathlib import Path
from xml.etree import ElementTree as ET
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'presentations'))
from chart_workbooks import check_presentation

ROOT=Path(__file__).resolve().parents[2]
CONTRACT=ROOT/'build-scripts/books/book2-presentation-contract.json'
BASE_PLATFORM='ac6f8e5320406aaf4906811b289ce98fcfa548c1'
BASE_LESSON='a8940a7a79e22857a3e306a91fe923c48c63e716'
CODES=('213','214','221','222','223','224','231','232','233','234')
NS={'a':'http://schemas.openxmlformats.org/drawingml/2006/main','c':'http://schemas.openxmlformats.org/drawingml/2006/chart'}
NUM=r'\d+(?:(?:[–\-/]\d+)|(?:,\s*\d+)|(?: en \d+))*'
REF=re.compile(r'(?i)(?<!\w)((?:boekpagina|pagina(?:’s|\x27s)?|pages?|p\.)\s*)('+NUM+r')')
def sha(data):return hashlib.sha256(data).hexdigest()
def read(file):
    file=Path(file).resolve()
    return Path('\\\\?\\'+str(file)).read_bytes() if os.name=='nt' else file.read_bytes()
def git(root,commit,file):return subprocess.check_output(['git','show',commit+':'+file],cwd=root)
def shift_page_tokens(value):return re.sub(r'\d+',lambda m:str(int(m[0])+(int(m[0])>=23)),value)
def expected_text(text,code):
    text=text.replace('21 september 2026','1 oktober 2026')
    text=REF.sub(lambda m:m[1]+shift_page_tokens(m[2]),text)
    if code=='213':
        text=text.replace('gedrukte pagina 19–22','gedrukte pagina 19–23')
        text=text.replace('gedrukte pagina 21–22','gedrukte pagina 21, 23')
    if code in ('233','234'):
        text=text.replace('Qd','Qv').replace('Qs','Qa')
        text=text.replace('Qv/Qa betekenen hetzelfde als Qv/Qa uit Boek 1.','Qv is de gevraagde hoeveelheid; Qa is de aangeboden hoeveelheid, net als in het boek.')
    if code=='224':text=text.replace('in het boek staan ze op de tegenoverliggende pagina','in het boek staan ze op de vorige pagina')
    # Every textbook citation points to the exact unchanged current book revision.
    text=re.sub(r'(https://github\.com/meijer1973/4veco-lessen/blob/)[a-f0-9]{40}/',r'\g<1>'+BASE_LESSON+'/',text)
    return text
def pptx_content(data):
    result={'slides':[],'notes':[],'charts':[],'tables':0}
    with zipfile.ZipFile(io.BytesIO(data)) as z:
        for kind,folder,pattern in [('slides','slides',r'slide(\d+)\.xml'),('notes','notesSlides',r'notesSlide(\d+)\.xml')]:
            names=[name for name in z.namelist()if re.fullmatch('ppt/'+folder+'/'+pattern,name)]
            names.sort(key=lambda name:int(re.search(pattern,name)[1]))
            for name in names:
                root=ET.fromstring(z.read(name))
                result[kind].append('\n'.join(e.text or ''for e in root.findall('.//a:t',NS)))
                if kind=='slides':result['tables']+=len(root.findall('.//a:tbl',NS))
        types=ET.fromstring(z.read('[Content_Types].xml'))
        chart_names=[e.get('PartName').lstrip('/') for e in types if e.get('ContentType')=='application/vnd.openxmlformats-officedocument.drawingml.chart+xml']
        for name in sorted(chart_names):
            root=ET.fromstring(z.read(name))
            # Chart caches and workbook ranges are the editable quantitative data.
            result['charts'].append([(e.tag.rsplit('}',1)[-1],e.text or '')for e in root.iter()if e.tag.rsplit('}',1)[-1]in ('f','v')])
    return result
def compare_content(before,after,code):
    for kind in ('slides','notes'):
        if len(before[kind])!=len(after[kind]):raise ValueError(f'{code}: {kind} count changed')
        for i,(a,b)in enumerate(zip(before[kind],after[kind]),1):
            if expected_text(a,code)!=b:raise ValueError(f'{code}: unexpected {kind} text change on slide {i}')
    if before['charts']!=after['charts'] or before['tables']!=after['tables']:
        raise ValueError(code+': native chart data or table count changed')
    return {'slides':len(after['slides']),'notes':len(after['notes']),'tables':after['tables'],'charts':len(after['charts'])}
def verify(lessons):
    lessons=Path(lessons)
    contract=json.loads(CONTRACT.read_text(encoding='utf8'))
    if contract['platform_baseline']!=BASE_PLATFORM or contract['lesson_baseline']!=BASE_LESSON:raise ValueError('Wrong presentation predecessor')
    if tuple(row['code']for row in contract['decks'])!=CODES:raise ValueError('Wrong presentation repair scope')
    if [row['path']for row in contract['source_edits']]!=[f'build-scripts/content/book-2/presentation-{code}.mjs'for code in CODES]:raise ValueError('Wrong owning source inventory')
    for row in contract['source_edits']:
        old=git(ROOT,BASE_PLATFORM,row['path']).replace(b'\r\n',b'\n')
        if sha(old)!=row['baseline_sha256_lf']:raise ValueError('False slide source ancestry')
        lines=old.decode('utf8').splitlines()
        for edit in row['replacements']:
            if lines[edit['line']-1]!=edit['before']:raise ValueError('False source replacement')
            lines[edit['line']-1]=edit['after']
        new=('\n'.join(lines)+'\n').encode()
        if sha(new)!=row['proposed_sha256_lf'] or new!=read(ROOT/row['path']).replace(b'\r\n',b'\n'):raise ValueError('Unexpected owning source edit')
    rows=[]
    for row in contract['decks']:
        code=row['code'];baseline=pptx_content(git(lessons,BASE_LESSON,row['pptx']))
        actual=read(lessons/row['pptx'])
        for key in ('pptx','pdf'):
            if sha(read(lessons/row[key]))!=row[key+'_sha256']:raise ValueError('Unreviewed presentation '+row[key])
        for file in row['inputs']:
            if sha(read(ROOT/file['path']).replace(b'\r\n',b'\n'))!=file['sha256_lf']:raise ValueError('Stale slide source '+file['path'])
        result=compare_content(baseline,pptx_content(actual),code)
        result['editable_charts']=check_presentation(io.BytesIO(actual))
        import fitz
        with fitz.open(stream=read(lessons/row['pdf']),filetype='pdf') as pdf:
            if len(pdf)!=result['slides']:raise ValueError('PDF/slide count mismatch '+code)
            # Native PowerPoint PDF text, normalized for layout/run boundaries.
            def tokens(value):return re.sub(r'\s+','',value).replace('\u00ad','')
            for i,(page,slide)in enumerate(zip(pdf,pptx_content(actual)['slides']),1):
                # Chart labels are emitted separately; all authored slide text
                # must survive export, including table cell text and footers.
                printed=tokens(page.get_text())
                for line in slide.splitlines():
                    if tokens(line) not in printed:raise ValueError(f'{code}: PPTX text missing from PDF slide {i}: {line}')
        if result['slides']!=row['slides']:raise ValueError('Wrong saved slide count '+code)
        m=json.loads(read(ROOT/row['manifest']))
        if m.get('sourceCommit',m.get('lessonCommit'))!=BASE_LESSON:raise ValueError('Unbound textbook citation '+code)
        edition=lessons/contract['edition']
        bindings=m.get('sourceFiles',{})
        for file,digest in bindings.items():
            actual_path=lessons/file if file.startswith(('Boek ','edities/'))else edition/file
            if sha(read(actual_path))!=digest:raise ValueError('Stale lesson source '+file)
        for source in m.get('sources',[]):
            if sha(read(lessons/source['path']))!=source['sha256']:raise ValueError('Stale source '+source['path'])
        rows.append({'paragraph':'.'.join(code),**result})
    # Historical slide evidence and the two unaffected decks are still immutable.
    for file in contract['preserved_classroom_paths']:
        if read(lessons/file)!=git(lessons,BASE_LESSON,file):raise ValueError('Preserved classroom file changed '+file)
    # The book and its editable manuscripts were already reviewed. This
    # successor only changes classroom delivery and its finite evidence/docs.
    changes=subprocess.check_output(['git','diff','--name-only','-z',BASE_LESSON],cwd=lessons).decode().split('\0')
    changes+=subprocess.check_output(['git','ls-files','--others','--exclude-standard','-z'],cwd=lessons).decode().split('\0')
    allowed=set(contract['lesson_revision_paths'])
    if set(filter(None,changes))-allowed:raise ValueError('Change outside presentation successor')
    return {'status':'PASS','decks_rebuilt':len(rows),'slides':sum(r['slides']for r in rows),'notes':sum(r['notes']for r in rows),'decks':rows}

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--lesson-root',type=Path,default=ROOT.parent/'4veco-lessen')
    parser.add_argument('--report',type=Path)
    args=parser.parse_args();result=verify(args.lesson_root)
    output=json.dumps(result,ensure_ascii=False,indent=2)+'\n'
    if args.report:args.report.write_text(output,encoding='utf8',newline='\n')
    print(output)
