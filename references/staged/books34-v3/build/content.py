"""Read the chapter manuscripts without assuming one historical answer markup schema."""
from pathlib import Path
from bs4 import BeautifulSoup
from collections import Counter
import re,json,hashlib
from render import chunks,render_md,ROOT

def exercise_number(el):
    return el.get('data-exercise') or el.get('id','').removeprefix('opg')

def chapter_data(folder):
    folder=Path(folder); questions={}; targets={}; par={}; pages=[]; duplicates=[]
    for fn in json.loads((folder/'chapter-order.json').read_text(encoding='utf-8')):
        text=(folder/fn).read_text(encoding='utf-8'); cp=chunks(folder/fn)
        for pg in cp:
            pages.append({**pg,'file':fn,'local_page':len(pages)+1})
        if not re.match(r'\d\.\d\.\d manuscript',fn): continue
        pid=fn.split()[0]
        soup=BeautifulSoup(render_md(text),'html.parser')
        exercises=[]
        for el in soup.select('.exercise'):
            n=exercise_number(el)
            if not n: continue
            exercises.append(n)
            for p in el.find_all('p'):
                b=p.find('b',recursive=False); m=re.match(r'([a-z])\.',b.get_text() if b else '')
                if not m: continue
                key=n+m[1]
                if key in questions: duplicates.append(key)
                questions[key]={'paragraph':pid,'exercise':n,'label':m[1],'text':p.get_text(' ',strip=True),'html':str(p),'target':'target' in el.get('class',[])}
            if 'target' in el.get('class',[]):
                targets[pid]={'exercise':n,'html':str(el),'file':fn,'source_sha256':hashlib.sha256((folder/fn).read_bytes()).hexdigest()}
        par[pid]={'file':fn,'exercises':exercises,'goals':[x.get_text(' ',strip=True) for x in soup.select('.goals')]}
    at=(folder/'Antwoorden.md').read_text(encoding='utf-8'); sa=BeautifulSoup(render_md(at),'html.parser')
    answers={};dupa=[]
    # Explicit subquestion attributes.
    for el in sa.select('[data-answer-question], [data-answer]'):
        key=el.get('data-answer-question') or el.get('data-answer')
        if not re.fullmatch(r'\d+[A-Z]?[a-z]',key or ''): continue
        if key in answers: dupa.append(key)
        answers[key]={'text':el.get_text(' ',strip=True),'html':str(el)}
    # Original Book 3 H1: numbered blocks with adjacent explanation paragraphs.
    for block in sa.select('[id^="ans"]'):
        mnum=re.match(r'ans(\d+[A-Z]?)(?:v)?$',block['id'])
        if not mnum: continue
        n=mnum[1]
        current=None
        for el in block.children:
            if not getattr(el,'name',None): continue
            b=el.find('b'); m=re.match(r'([a-z])\.',b.get_text() if b else '')
            if el.name=='p' and m:
                current=n+m[1]
                if current in answers: dupa.append(current)
                answers[current]={'text':el.get_text(' ',strip=True),'html':str(el)}
            elif current and el.name!='h3':
                answers[current]['text']+=' '+el.get_text(' ',strip=True)
                answers[current]['html']+=str(el)
    assets=[]; missing=[]
    for pg in pages+chunks(folder/'Antwoorden.md'):
        for src in re.findall(r'<img[^>]*src="([^\"]+)"',pg['body']):
            assets.append(src)
            if not (folder/src).is_file(): missing.append(src)
    for pid,t in targets.items():
        tpages=[p for p in pages if p['section']==pid]
        # A target's sources can occupy the preceding facing page without a ## heading.
        hits=[i for i,p in enumerate(tpages) if re.search(r'class="[^"\n]*target[^"\n]*"',p['body']) and ('id="opg'+t['exercise']+'"' in p['body'])]
        if not hits: raise ValueError('No target page: '+pid)
        lo,hi=min(hits),max(hits)
        if lo and ('bron' in tpages[lo-1]['title'].lower() and 'doeloefening' in tpages[lo-1]['title'].lower()): lo-=1
        bodies=[];positions=[]
        for pg in tpages[lo:hi+1]:
            body=pg['body']
            heading=re.search(r'^## Doeloefening\b',body,re.M)
            if heading: body=body[heading.start():]
            # Never carry optional work on the same page into the target contract.
            stop=re.search(r'^## (?:Denkertje|Herhaling)',body,re.M)
            if stop:body=body[:stop.start()]
            bodies.append(body);positions.append(pg['local_page'])
        t['source_markdown']='\n\n'.join(bodies)
        t['pages']=positions
        t['question_ids']=[k for k,v in questions.items() if v['paragraph']==pid and v['target']]
    return {'paragraphs':par,'targets':targets,'questions':questions,'answers':answers,'pages':pages,
            'missing_answers':sorted(set(questions)-set(answers)),'extra_answers':sorted(set(answers)-set(questions)),
            'duplicate_questions':duplicates,'duplicate_answers':dupa,'missing_assets':sorted(set(missing)),
            'assets':sorted(set(assets))}

if __name__=='__main__':
    output={}; failures=[]
    for d in sorted((ROOT/'books').glob('*/chapters/*')):
        a=chapter_data(d)
        checks={k:a[k] for k in ['missing_answers','extra_answers','duplicate_questions','duplicate_answers','missing_assets']}
        if any(checks.values()):failures.append(d.name)
        output[d.name]={'paragraph_count':len(a['paragraphs']),'exercise_count':sum(len(x['exercises']) for x in a['paragraphs'].values()),'question_count':len(a['questions']),'answer_count':len(a['answers']),'target_exercises':{pid:t['exercise'] for pid,t in a['targets'].items()},'checks':checks}
        print(d.name,output[d.name])
    (ROOT/'checks/content-inventory.json').write_text(json.dumps(output,indent=2,ensure_ascii=False), encoding='utf-8', newline='\n')
    if failures:raise SystemExit('Coverage failures: '+', '.join(failures))
