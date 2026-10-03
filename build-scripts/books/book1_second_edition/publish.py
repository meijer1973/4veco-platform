"""Generate the second-edition entry points; keep legacy chapter URLs historical."""
from pathlib import Path
import argparse, json, shutil, html
from urllib.parse import quote

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--lessons',type=Path,required=True)
    args=parser.parse_args();root=args.lessons.resolve()/'Boek 1 - Grondslagen, vraag en aanbod'
    edition=root/'edities/tweede-editie-2026'
    manifest=json.loads((edition/'manifest.json').read_text(encoding='utf8'))
    assembly=json.loads((edition/'qa/assembly_manifest.json').read_text(encoding='utf8'))
    def a(file,label):return f'<a href="{quote(file,safe="/")}">{html.escape(label)}</a>'
    css='body{font:18px/1.6 system-ui,sans-serif;color:#16364a;background:#f5f8fa;margin:0}main{max-width:980px;margin:auto;padding:3rem 1.5rem}h1{font-size:2.4rem;line-height:1.2}h2{margin-top:2.5rem}a{color:#125b83}nav,article{background:white;border:1px solid #d4e2e9;border-radius:12px;padding:1.2rem;margin:1rem 0}li{margin:.5rem 0}small{color:#425d6c}table{border-collapse:collapse;width:100%}td,th{text-align:left;padding:.6rem;border-bottom:1px solid #dae3e8}'
    def page(title,body):return '<!doctype html><html lang="nl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+html.escape(title)+'</title><style>'+css+'</style><main>'+body+'</main></html>\n'
    downloads='<nav aria-label="Complete boeken"><ul>'+''.join('<li>'+a('boek/'+manifest['files'][kind],label+f' · {out["pages"]} pagina’s')+'</li>' for kind,label,out in zip(['student','answers','teacher'],['Leerlingboek','Antwoordenboek','Docentenhandleiding'],assembly['outputs']))+'</ul></nav>'
    body='<small>ECONOMIE · 4 VWO · TWEEDE EDITIE · 2026</small><h1>Grondslagen, vraag en aanbod</h1><p>Drie hoofdstukken om economisch te leren denken, rekenen en redeneren.</p>'+downloads
    for chapter in manifest['chapters']:
        n=chapter['nr'];body+=f'<article><h2>{chapter["id"]} · {html.escape(chapter["title"])}</h2><p>'+a(chapter['student'],'Leerlinghoofdstuk')+' · '+a(chapter['answers'],'Antwoorden')+' · '+a(chapter['teacher'],'Docenteninformatie')+'</p><ul>'
        exports=json.loads((edition/f'bronnen/H{n}/QA/paragraph_exports.json').read_text(encoding='utf8'))
        for paragraph in chapter['paragraphs']:
            code=paragraph['title'].split()[0];records={r['kind']:r for r in exports if r['paragraph']==code}
            body+='<li>'+a(records['student']['file'],paragraph['title'])+' · '+a(records['answers']['file'],'antwoorden')+'</li>'
        body+='</ul></article>'
    body+='<p>Begeleide inoefening hoort bij de normale route. Beide routes leiden naar dezelfde doeloefening; de bonus hoort bij de uitdagende route. Herhaling is aanvullend bij beide routes.</p><p>'+a('../../eerste-editie.html','Eerste editie en bijbehorend lesmateriaal')+'</p>'
    (edition/'index.html').write_text(page('Boek 1 · tweede editie',body),encoding='utf8',newline='\n')
    mainbody=body.replace('href="','href="edities/tweede-editie-2026/')
    (root/'index.html').write_text(page('Boek 1 · tweede editie',mainbody),encoding='utf8',newline='\n')
    legacy='<small>HISTORISCHE EERSTE EDITIE</small><h1>Boek 1 · eerste editie</h1><p>Deze hoofdstukken en hun presentaties, quizzen en andere companionmaterialen horen bij de eerste editie. Gelijke paragraafnummers betekenen geen gelijke inhoud in de tweede editie.</p><p>'+a('index.html','Naar de actuele tweede editie')+'</p><ul>'
    for folder in sorted(root.glob('1.* Hoofdstuk*')):
        if (folder/'index.html').exists():legacy+='<li>'+a(folder.name+'/index.html',folder.name)+'</li>'
    legacy+='</ul><p>'+a('historisch/eerste-editie-20261002.zip','Volledig oorspronkelijk bron- en uitvoerarchief')+' · '+a('historisch/eerste-editie-inventaris.json','Bestandsinventaris en hashes')+'</p>'
    (root/'eerste-editie.html').write_text(page('Boek 1 · historische eerste editie',legacy),encoding='utf8',newline='\n')
    stem='Boek 1 Grondslagen, vraag en aanbod – boek'
    shutil.copy2(edition/'boek'/manifest['files']['student'],root/(stem+'.pdf'))
    (root/(stem+'.html')).write_text(page('Boek 1 · tweede editie','<h1>Boek 1 · tweede editie</h1><p>'+a('index.html','Open het actuele boek, antwoorden en hoofdstukken')+'</p>'),encoding='utf8',newline='\n')
    (root/(stem+'.md')).write_text('# Boek 1 · tweede editie\n\nDe bewerkbare hoofdstukken staan in `edities/tweede-editie-2026/bronnen/`.\n\n[Actuele editie](edities/tweede-editie-2026/README.md) · [Leerlingboek](edities/tweede-editie-2026/boek/Boek_1_Compleet_Tweede_editie.pdf).\n\nDe eerste editie is ongewijzigd gearchiveerd in `historisch/eerste-editie-20261002.zip`.\n',encoding='utf8',newline='\n')
    print('Generated current edition entries, real PDF compatibility URL and explicit first-edition navigation.')

if __name__=='__main__':main()
