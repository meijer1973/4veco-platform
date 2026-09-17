"""Render a source/figure-aware consumer preview from the 31 JSON records only.

This reads no manuscript and is a consumer smoke test, not a replacement book.
It intentionally uses context_html and subquestions, never the raw full source
as a workaround for missing context. All figures are embedded for inspection.
"""
from pathlib import Path
import json, html, base64, hashlib
from bs4 import BeautifulSoup
ROOT=Path(__file__).resolve().parents[1]


def preview_record(record, root=ROOT):
    t=record['target_exercise']
    if t.get('context_html_base')!='package_root':
        raise ValueError('Unsupported context HTML base')
    soup=BeautifulSoup(t['context_html'],'html.parser')
    figure_map={row['path']:row for row in t['figures']}
    used=[]
    for img in soup.find_all('img'):
        name=img['src'];f=(root/name).resolve()
        if not f.is_relative_to(root.resolve()) or name not in figure_map:
            raise ValueError('Unregistered context asset '+name)
        content=f.read_bytes()
        if hashlib.sha256(content).hexdigest()!=figure_map[name]['sha256']:
            raise ValueError('Asset identity mismatch '+name)
        typ={'svg':'image/svg+xml','png':'image/png'}[f.suffix[1:]]
        img['src']='data:'+typ+';base64,'+base64.b64encode(content).decode('ascii')
        img['data-package-path']=name;used.append(name)
    if set(used)!=set(figure_map):
        raise ValueError(record['id']+': some required source figures were not consumed')
    qs='\n'.join('<p data-question="'+html.escape(q['source_question_id'])+'"><strong>'+q['label']+'.</strong> '+html.escape(q['prompt'])+'</p>' for q in t['subquestions'])
    return '<article id="p'+record['id']+'"><h1>'+record['id']+' — '+html.escape(record['paragraph_title'])+'</h1><div class="context">'+str(soup)+'</div><div class="questions">'+qs+'</div></article>',used


def main():
    module=json.loads((ROOT/'curriculum/course-target-exercises-books34-v3.json').read_text(encoding='utf-8'))
    pages=[];report=[]
    for record in module['records']:
        body,figs=preview_record(record)
        pages.append(body);report.append({'id':record['id'],'questions':len(record['target_exercise']['subquestions']),'figures_consumed':figs,'tables_consumed':len(BeautifulSoup(body,'html.parser').find_all('table'))})
    css='body{font:17px/1.5 sans-serif;max-width:1000px;margin:auto;padding:30px;color:#193347}article{border-top:3px solid #b6cbd7;padding:30px 0}img{max-width:100%;height:auto}table{border-collapse:collapse}td,th{border:1px solid #ccc;padding:7px}h1{font-size:25px}.source,.formula{padding:12px;background:#f1f5f7}.questions{border-left:4px solid #16728d;padding-left:20px}'
    doc='<!DOCTYPE html><html lang="nl"><meta charset="utf-8"><title>Doelopgaven uit JSON — afnemercontrole</title><style>'+css+'</style><body><p>Technische controleweergave, geen nieuwe leerlingeditie. Alle inhoud komt uit de doelopgaverecords.</p>'+''.join(pages)+'</body></html>'
    (ROOT/'checks/target-consumer-preview.html').write_text(doc,encoding='utf-8',newline='\n')
    (ROOT/'checks/target-consumer-check.json').write_text(json.dumps({'source':'31 JSON records only, no manuscript fallback','records':report,'count':len(report)},ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
    print('Record-only preview:',len(report),'targets;',sum(len(x['figures_consumed']) for x in report),'source-figure uses')

if __name__=='__main__':main()
