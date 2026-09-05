"""Fresh specialist diagnostics; no generated record claims personal inspection."""
from pathlib import Path
import hashlib, json, shutil, subprocess, sys
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[3]
assert ROOT.parent.name == 'book2-213-r5-qc-20260905'
sys.path.insert(0, str(ROOT/'build-scripts/content/book-2'))
import b2_213 as b
DEST = Path('\\\\?\\'+str(ROOT.parent/'4veco-lessen'))/b.LESSON_REL
OUT = ROOT/'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-specialist-r5'
assert not OUT.exists(), 'Fresh proof directory required'
OUT.mkdir(parents=True)
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
records = []
alts = []
for kind, count in [('paragraaf',14),('opgaven',9),('antwoorden',6)]:
    original = DEST/f'{b.STEM} – {kind}.pdf'
    short = OUT/f'{kind}.pdf'
    shutil.copyfile(original, short)
    assert sha(original)==sha(short)
    folder = OUT/kind
    folder.mkdir()
    subprocess.run(['pdftoppm','-r','150','-png',str(short),str(folder/'page')],check=True)
    pages=sorted(folder.glob('page-*.png'))
    assert len(pages)==count
    records.append({'kind':kind,'pdf_sha256':sha(original),'pages':{str(p.relative_to(ROOT)):sha(p) for p in pages}})
    soup=BeautifulSoup((DEST/f'{b.STEM} – {kind}.html').read_text(encoding='utf-8'),'html.parser')
    for img in soup.find_all('img'):
        figure=img.find_parent('figure')
        caption=figure.find('figcaption').get_text(' ',strip=True) if figure else None
        alt=img.get('alt','')
        alts.append({'kind':kind,'src':img.get('src'),'alt':alt,'characters':len(alt),'caption':caption,'alt_equals_caption':alt==caption,'exceeds_120':len(alt)>120})
for page in (2,3,5,7,10):
    subprocess.run(['pdftoppm','-r','150','-f',str(page),'-l',str(page),'-gray','-png',str(OUT/'paragraaf.pdf'),str(OUT/f'gray-{page}')],check=True)
def luminance(hexcolor):
    values=[int(hexcolor[i:i+2],16)/255 for i in (1,3,5)]
    lin=[c/12.92 if c<=.04045 else ((c+.055)/1.055)**2.4 for c in values]
    return .2126*lin[0]+.7152*lin[1]+.0722*lin[2]
contrasts=[]
for foreground in ('#1F2937','#1A5276','#2D3748'):
    for background in ('#F7FAFC','#FFFFFF'):
        ratio=(luminance(background)+.05)/(luminance(foreground)+.05)
        contrasts.append({'foreground':foreground,'background':background,'ratio':ratio,'passes_4_5':ratio>=4.5})
result={'reviewer':'paragraph_213_r5_specialist_qc','render_engine':'pdftoppm 150 DPI','inspection_status':'PENDING_PERSONAL_VIEW','documents':records,'grayscale':{str(p.relative_to(ROOT)):sha(p) for p in sorted(OUT.glob('gray-*.png'))},'alts':alts,'contrast':contrasts}
output=ROOT/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-evidence/specialist-media-manifest-r5.json'
assert not output.exists()
output.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps({'pages':sum(len(r['pages']) for r in records),'grayscale_pages':5,'alt_violations':[a for a in alts if a['exceeds_120']],'contrast':contrasts},ensure_ascii=True,indent=2))
