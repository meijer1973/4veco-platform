"""Project targets from owned second-edition sources, never from reused legacy IDs."""
from pathlib import Path
import argparse,json,hashlib,re,unicodedata
from bs4 import BeautifulSoup
from markdown_it import MarkdownIt

REVISION='book1-second-edition-2026'
SOURCE='references/owned/book1-second-edition-2026/targets.json'

def build(lessons):
    base=lessons/'Boek 1 - Grondslagen, vraag en aanbod/edities/tweede-editie-2026'
    md=MarkdownIt('commonmark',{'html':True}).enable('table')
    sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
    records=[]
    def norm(s):return re.sub(r'\s+','',unicodedata.normalize('NFKC',BeautifulSoup(md.render(s),'html.parser').get_text(' ')).replace('\u00ad',''))
    for n in range(1,4):
        chapter=base/'bronnen'/f'H{n}'
        value=json.loads((chapter/'QA/target_exercises.json').read_text(encoding='utf8'))
        targets=value['targets'] if isinstance(value,dict) else value
        answer_soup=BeautifulSoup(md.render((chapter/'Antwoorden.md').read_text(encoding='utf8')),'html.parser')
        figures=json.loads((chapter/'QA/figures.json').read_text(encoding='utf8'))
        for target in targets:
            code=target['section'];manuscript=next(chapter.glob(code+' *.md'))
            soup=BeautifulSoup(md.render(manuscript.read_text(encoding='utf8')),'html.parser')
            block=soup.find(id='ex'+str(target['number']))
            if block is None:raise ValueError('Missing owned target block '+code)
            source_html=''
            if code.endswith('.4'):
                pages=re.split(r'<!-- PAGE .*? -->',manuscript.read_text(encoding='utf8'),flags=re.S)[1:]
                index=next(i for i,p in enumerate(pages) if f'id="ex{target["number"]}"' in p)
                source_html=md.render(pages[index-1])
                if 'Bron A' not in BeautifulSoup(source_html,'html.parser').get_text():raise ValueError('Missing preceding target sources '+code)
            context=BeautifulSoup(source_html+str(block),'html.parser')
            questions=[q.get_text(' ',strip=True) for q in block.select('.qbody')]
            if [norm(q) for q in questions]!=[norm(q) for q in target['questions']]:raise ValueError('Question snapshot/source mismatch '+code)
            answer_head=answer_soup.find(id='ans'+str(target['number']))
            if answer_head is None:answer_head=next((h for h in answer_soup.find_all('h3') if re.match(r'Opgave\s+'+str(target['number'])+r'\b',h.get_text())),None)
            if answer_head is None:raise ValueError('Missing answer heading '+code)
            answer_parts=[str(answer_head)]
            for sibling in answer_head.next_siblings:
                if getattr(sibling,'name',None) in ['h2','h3']:
                    found=re.match(r'Opgave\s+(\d+)\b',sibling.get_text())
                    if (sibling.name=='h2' and not found) or (found and int(found[1])!=target['number']):break
                answer_parts.append(str(sibling))
            answer_html=''.join(answer_parts)
            missing=[piece for pair in target['answers'] for piece in ([pair] if isinstance(pair,str) else pair) if piece.strip() and norm(piece) not in norm(answer_html)]
            if missing:raise ValueError('Answer snapshot/source mismatch '+code+': '+repr(missing))
            assets=[]
            for img in context.find_all('img'):
                file=(chapter/img['src']).resolve()
                if not file.is_relative_to(chapter.resolve()) or file.suffix!='.svg':raise ValueError('Unknown target asset')
                data=next((r for r in figures if r.get('file',r.get('name'))==file.stem),None)
                if data is None:raise ValueError('Missing target figure data '+code)
                assets.append({'path':file.relative_to(lessons).as_posix(),'sha256':sha(file),'alt':img.get('alt',''),'svg':file.read_text(encoding='utf8'),'geometry':data})
            for q in context.select('.question'):q.decompose()
            context_text=context.get_text(' ',strip=True)
            if assets:context_text+='\nFigure data from the source: '+json.dumps([{k:v for k,v in a.items() if k!='svg'} for a in assets],ensure_ascii=False)
            records.append({'id':code,'edition_id':REVISION,'record_id':REVISION+':'+code,
              'module':1,'chapter':n,'paragraph_title':manuscript.stem.split(' – ')[0][6:],
              'paragraph_kind':'gemengde_opgaven' if code.endswith('.4') else 'theory',
              'record_status':'candidate_review_ready','curriculum_authority':False,
              'approval_inherited':False,'required_skills':[],'exam_codes':[],
              'authority_note':'Owner-selected second-edition target; no old reviewed_final status, machine mapping or CvTE approval inherited.',
              'source_path':SOURCE,'source_locator':{'repository':'meijer1973/4veco-lessen','manuscript':manuscript.relative_to(lessons).as_posix(),'manuscript_sha256':sha(manuscript),'answers':(chapter/'Antwoorden.md').relative_to(lessons).as_posix(),'answers_sha256':sha(chapter/'Antwoorden.md'),'exercise_number':target['number']},
              'target_exercise':{'title':target['title'],'context':context_text,'context_html':str(context),'source_assets':assets,'answer_html':answer_html,'subquestions':[{'label':chr(97+i),'prompt':q,'answer':target['answers'][i]} for i,q in enumerate(questions)]},
              'review_scope':'Current-file Part A review is recorded separately; no curriculum-authority promotion.'})
    return {'edition_id':REVISION,'owner_authority':'2026-10-02: integrate the attached new Book 1 edition','legacy_registry':'references/authored/course-target-exercises.json','legacy_relation':'historical first-edition records; IDs do not establish equivalence','exercises':records}

def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--lessons',type=Path,required=True);parser.add_argument('--check',action='store_true');args=parser.parse_args()
    file=Path(__file__).resolve().parents[3]/SOURCE
    text=json.dumps(build(args.lessons.resolve()),ensure_ascii=False,indent=2)+'\n'
    if args.check:
        if file.read_text(encoding='utf8')!=text:raise SystemExit('Stale Book 1 edition target projection')
    else:file.write_text(text,encoding='utf8',newline='\n')
    print('12 edition-scoped Book 1 targets '+('verified' if args.check else 'projected')+'.')
if __name__=='__main__':main()
