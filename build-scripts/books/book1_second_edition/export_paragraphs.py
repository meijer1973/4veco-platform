"""Export all twelve student paragraphs and their answers from rebuilt chapters."""
from pathlib import Path
import json, os, re, unicodedata
import fitz
from bs4 import BeautifulSoup
from markdown_it import MarkdownIt

root=Path(os.environ['BOOK1_CHAPTER_ROOT'])
edition=root.parent.parent
number=int(root.name[1:])
source=edition/'hoofdstukken'/root.name
dest=edition/'paragrafen'/root.name
dest.mkdir(parents=True,exist_ok=True)
starts={1:[2,9,20,34],2:[2,14,24,34],3:[2,12,24,34]}[number]
first_exercises={1:[1,10,22,34],2:[1,12,23,34],3:[1,12,23,34]}[number]
files=json.loads((root/'chapter-order.json').read_text(encoding='utf8'))[1:5]
records=[]
md=MarkdownIt('commonmark',{'html':True}).enable('table')
def norm(s):return re.sub(r'\s+','',unicodedata.normalize('NFKC',BeautifulSoup(md.render(s),'html.parser').get_text(' ')).replace('\u00ad',''))
exercises=json.loads((root/'QA/exercises.json').read_text(encoding='utf8'))
for kind in ['student','answers']:
    filename=next(source.glob('*_Antwoorden_*.pdf')) if kind=='answers' else next(p for p in source.glob('*.pdf') if not any(s in p.name for s in ['Antwoorden','Docenteninformatie']))
    with fitz.open(filename) as src:
        positions=starts if kind=='student' else [next(i+1 for i,p in enumerate(src) if re.search(r'^Opgave\s+'+str(n)+r'\b',p.get_text(),re.M)) for n in first_exercises]
        ends=positions[1:]+[39 if kind=='student' else len(src)+1]
        for i,(first,end,manuscript) in enumerate(zip(positions,ends,files),1):
            members=[e for e in exercises if e['section']==f'1.{number}.{i}']
            if kind=='answers':
                required=[norm(piece) for e in members for pair in e['answers'] for piece in ([pair] if isinstance(pair,str) else pair) if piece.strip()]
                # An answer page may serve two paragraphs. Keep it in both
                # extracts when needed; a start-page split can omit prior answers.
                while True:
                    available=norm(' '.join(src[p].get_text() for p in range(first-1,end-1)))
                    if all(s in available for s in required):break
                    end+=1
                    if end>len(src)+1:raise ValueError('Incomplete answer payload '+manuscript)
            title=Path(manuscript).stem.split(' – ')[0]
            suffix='antwoorden' if kind=='answers' else ('opgaven' if i==4 else 'paragraaf')
            output=dest/f'{title} – {suffix}.pdf'
            with fitz.open() as pdf:
                pdf.insert_pdf(src,from_page=first-1,to_page=end-2)
                pdf.set_metadata({'title':title+' – '+suffix+' · Tweede editie','subject':'Uitsnede met hoofdstukpaginanummers; Boek 1 tweede editie'})
                toc=[[1,title,1]]+[[2,t,p-first+1] for _,t,p in src.get_toc() if first<=p<end and t.startswith('Opgave')]
                pdf.set_toc(toc);pdf.save(output,garbage=4,deflate=True)
            with fitz.open(output) as pdf:
                assert len(pdf)==end-first
                for j,p in enumerate(pdf):
                    assert p.get_text()==src[first+j-1].get_text()
                    assert all(l['kind']==fitz.LINK_GOTO and 0<=l['page']<len(pdf) for l in p.get_links())
            records.append({'paragraph':f'1.{number}.{i}','kind':kind,'file':output.relative_to(edition).as_posix(),'source':filename.relative_to(edition).as_posix(),'pages_in_source':[first,end-1],'pages':end-first,'exact_text_preserved':True,'exercise_numbers':[e['number'] for e in members],'complete_answer_payload':kind=='answers','shared_boundary_page':kind=='answers' and i<4 and end>ends[i-1]})
(root/'QA/paragraph_exports.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n', encoding='utf8', newline='\n')
print(f'Exported {len(records)} verified paragraph PDFs for {root.name}.')
