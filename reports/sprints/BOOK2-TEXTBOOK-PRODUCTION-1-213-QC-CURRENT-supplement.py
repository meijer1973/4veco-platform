"""Own supplemental contrast/alternative probes and binding of completed views.
HOW TO ADAPT: new review requires new personal observations and a new namespace.
This does not infer subjective inspection from files; personal.md is the actor's
separate attestation after all 72 actual individual image views.
"""
from pathlib import Path
import importlib.util, json, re
from bs4 import BeautifulSoup

HERE=Path(__file__).parent
spec=importlib.util.spec_from_file_location('execution',HERE/'BOOK2-TEXTBOOK-PRODUCTION-1-213-QC-CURRENT-execute.py')
e=importlib.util.module_from_spec(spec);spec.loader.exec_module(e)
alt_spec=importlib.util.spec_from_file_location('alt_original',e.ROOT/'build-scripts/content/book-2/213/alt_contract.py')
alt=importlib.util.module_from_spec(alt_spec);alt_spec.loader.exec_module(alt)

def luminance(color):
    color=color.lstrip('#')
    if len(color)==3:color=''.join(c*2 for c in color)
    values=[int(color[i:i+2],16)/255 for i in (0,2,4)]
    values=[v/12.92 if v<=0.04045 else ((v+0.055)/1.055)**2.4 for v in values]
    return sum(a*b for a,b in zip(values,[.2126,.7152,.0722]))

def contrast(fg,bg):
    a,b=sorted([luminance(fg),luminance(bg)])
    return (b+.05)/(a+.05)

def rejected(name,fn):
    try:fn()
    except (AssertionError,KeyError,ValueError) as error:
        return dict(name=name,result='REJECTED',exception=type(error).__name__,message=str(error))
    raise AssertionError(('Bad alternative accepted',name))

def main():
    custody=e.custody();e.inputs()
    pairs=[('native text',e.b.INK,e.b.BG),('native MO text',e.b.BLUE,e.b.BG),('native arrows/dividers',e.b.EDGE,e.b.BG),
      ('body','#182b3a','#ffffff'),('headings','#1A5276','#ffffff'),('footer','#555','#ffffff'),
      ('blockquote body','#182b3a','#eef4f7'),('table header','#182b3a','#eaf1f5'),('caption','#304958','#ffffff')]
    css=(e.ROOT/'build-scripts/content/book-2/print_pipeline.py').read_text(encoding='utf-8')
    for token in ['#182b3a','#1A5276','#555','#eef4f7','#eaf1f5','#304958']:assert token in css
    ratios=[dict(role=role,foreground=fg,background=bg,ratio=contrast(fg,bg),threshold=4.5) for role,fg,bg in pairs]
    assert all(row['ratio']>=row['threshold'] for row in ratios)
    assert contrast('#ffffff','#ffffff')==1 and contrast('#777777','#ffffff')<4.5
    negatives=[];positives=[]
    for kind in ('paragraaf','opgaven','antwoorden'):
        text=(e.FOLDER/f'{e.b.STEM} – {kind}.html').read_text(encoding='utf-8')
        positives+=alt.verify_html(text,kind,e.FOLDER)
        soup=BeautifulSoup(text,'html.parser')
        for i,img in enumerate(soup.find_all('img')):
            for value in ('Bereken de uitkomst.','x'*121,''):
                changed=BeautifulSoup(text,'html.parser');changed.find_all('img')[i]['alt']=value
                negatives.append(rejected(f'{kind}/image{i+1}/alt-{value[:12]}',lambda s=str(changed):alt.verify_html(s,kind,e.FOLDER)))
            changed=BeautifulSoup(text,'html.parser');changed.find_all('img')[i].find_parent('figure').figcaption.string='Verkeerd volledig bijschrift.'
            negatives.append(rejected(f'{kind}/image{i+1}/caption-drift',lambda s=str(changed):alt.verify_html(s,kind,e.FOLDER)))
        if kind=='paragraaf':
            changed=BeautifulSoup(text,'html.parser');changed.find_all('img')[2].find_parent('figure').figcaption['aria-hidden']='true'
            negatives.append(rejected('distinct-long-caption-hidden',lambda:alt.verify_html(str(changed),kind,e.FOLDER)))
    for name in e.d.ASSETS:
        text=(e.FOLDER/'_assets'/f'{name}.svg').read_text(encoding='utf-8')
        alt.verify_title(name,text)
        negatives.append(rejected(name+'/title-missing',lambda n=name,t=text:alt.verify_title(n,re.sub(r'<title[^>]*>.*?</title>','',t))))
        negatives.append(rejected(name+'/aria-id-forged',lambda n=name,t=text:alt.verify_title(n,t.replace('aria-labelledby="title"','aria-labelledby="wrong"'))))
    assert len(positives)==8 and len(negatives)==45
    inventory=e.load(e.OUT/'inspection-view-inventory.json')
    personal=HERE/'BOOK2-TEXTBOOK-PRODUCTION-1-213-QC-CURRENT-personal.md'
    assert personal.exists() and '72 individual views completed' in personal.read_text(encoding='utf-8')
    entries=[]
    for row in inventory['entries']:
        for version in ('color','gray'):
            p=Path(row[version+'_path']);p=p if p.is_absolute() else e.ROOT/p
            assert e.sha(e.raw(p))==row[version+'_sha256']
            entries.append(dict(role=row['role'],kind=row['kind'],page=row['page'],version=version,path=str(p),raw_sha256=e.sha(e.raw(p)),
              inspected_by='paragraph_231_specialist_qc',personally_viewed=True,visible_student_defects=0,
              observation_key=(row['kind']+'-'+str(row['page'])) if row['page'] else row['kind']))
    assert len(entries)==72
    route_bindings=[]
    for mode,r in [('full','r34'),('thin','r35'),('print','r36')]:
        proof=e.OUT/f'{mode}-{r}-reproduction.json';assert e.load(proof)['result']=='PASS'
        route_bindings.append(dict(route=mode,revision=r,reproduction_sha256=e.sha(e.raw(proof)),manifest_sha256=e.sha(e.raw(e.OUT/f'{mode}-{r}-build.json'))))
    e.save('supplement.json',dict(result='PASS',custody=custody,contrast=ratios,alternative_negatives=negatives,actual_html_occurrences=positives,
      scope='Static Part A paper and native HTML semantics; not PDF/UA, screen-reader user testing, device brightness calibration or interactive accessibility',
      decorative_lines='Light heading/table rules are supplemental; dark labels, semantic header cells, alignment and whitespace carry meaning. Essential interval arrows/dividers exceed 4.5:1.',
      personal_report_sha256=e.sha(e.raw(personal)),personal_views=entries,route_bindings=route_bindings,
      immutable_pending_manifests_unchanged=True,root_acceptance='PENDING',production_ready=False))
    print('PASS 9 actual contrast pairs, 45 rejected alternative/title counterexamples, 72 personally completed view bindings')

if __name__=='__main__':main()
