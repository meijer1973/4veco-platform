"""Bounded, non-mutating HTML accessibility evidence; not automatic approval."""
from pathlib import Path
import base64, hashlib, json, re, sys
from bs4 import BeautifulSoup

ROOT=Path(__file__).resolve().parents[3]
assert ROOT.parent.name=='book2-213-r5-qc-20260905'
sys.path.insert(0,str(ROOT/'build-scripts/content/book-2'))
import b2_213 as b
folder=Path('\\\\?\\'+str(ROOT.parent/'4veco-lessen'))/b.LESSON_REL
sha=lambda raw:hashlib.sha256(raw).hexdigest()
assets={sha(p.read_bytes()):p.name for p in (folder/'_assets').glob('*.png')}
normalize=lambda value:re.sub(r'\s+',' ',value).strip()
documents=[]
for kind in ('paragraaf','opgaven','antwoorden'):
    path=folder/f'{b.STEM} – {kind}.html'
    raw=path.read_bytes(); soup=BeautifulSoup(raw,'html.parser')
    figures=[]
    for img in soup.find_all('img'):
        src=img['src']; assert src.startswith('data:image/png;base64,')
        digest=sha(base64.b64decode(src.split(',',1)[1])); name=assets[digest]
        alt=img.get('alt',''); caption=normalize(img.find_parent('figure').find('figcaption').get_text(' ',strip=True))
        figures.append({'asset':name,'png_sha256':digest,'alt':alt,'characters':len(alt),'caption':caption,'alt_equals_normalized_caption':alt==caption,'over_120':len(alt)>120,'noun_first_manual_required':True})
    documents.append({'kind':kind,'html_sha256':sha(raw),'lang':soup.html.get('lang'),'title':soup.title.get_text(),'headings':[(h.name,h.get_text(' ',strip=True)) for h in soup.find_all(re.compile('^h[1-6]$'))],'native_tables':len(soup.find_all('table')),'interactive_controls':len(soup.find_all(['input','select','textarea','button'])),'figures':figures})
quality=(folder/'2.1.3-quality-ref.yaml').read_bytes()
record={'reviewer':'paragraph_213_r5_specialist_qc','finding':'REVISE: short alt must be noun-first and at most 120 characters; manual functional review recorded separately','documents':documents,'quality_unchanged_raw_sha256':sha(quality),'quality_unchanged_LF_sha256':sha(quality.replace(b'\r\n',b'\n')),'raw_media_manifest_note':'First media diagnostic retained embedded src and compared caption whitespace literally. Use this exact PNG hash mapping and normalized caption comparison for concise alt evidence; prior diagnostic remains unchanged.'}
out=Path(__file__).parent/'specialist-accessibility-r5.json'
assert not out.exists()
out.write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(record,ensure_ascii=True,indent=2))
