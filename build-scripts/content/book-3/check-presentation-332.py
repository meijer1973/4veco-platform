# HOW TO ADAPT: inspect exported native chart points, axes, repeated overviews and notes.
# Run after the authoring script and render-powerpoint.ps1. Requires the presentation runtime.
from pathlib import Path
from lxml import etree as E
import json,zipfile,re
import sys
if len(sys.argv) != 2:
 raise SystemExit('Usage: check-presentation-332.py <presentation-workspace>')
root=Path(sys.argv[1]).resolve()
p=next((root/'final').glob('*.pptx'))
ns={'p':'http://schemas.openxmlformats.org/presentationml/2006/main','a':'http://schemas.openxmlformats.org/drawingml/2006/main','c':'http://schemas.openxmlformats.org/drawingml/2006/chart'}
gs=json.loads((root/'build/slides.json').read_text('utf-8'))['graphSpecs']
with zipfile.ZipFile(p) as z:
 charts=sorted([x for x in z.namelist() if re.fullmatch(r'ppt/slides/charts/chart\d+.xml',x)],key=lambda s:int(re.search(r'chart(\d+)',s)[1]))
 assert len(charts)==len(gs)==6, 'Expected all six declared native graphs'
 for f,spec in zip(charts,gs):
  r=E.fromstring(z.read(f)); m=spec['model']; series=r.findall('.//c:ser',ns)
  assert len(series)==len(spec['series'])
  for ser,expect in zip(series,spec['series']):
   actual=[]
   for tag in ['xVal','yVal']:
    actual.append([float(v.text) for v in ser.findall(f'.//c:{tag}//c:pt/c:v',ns)])
   assert actual==[expect['xValues'],expect['values']], (f,expect['name'],actual)
   if expect['name'] in ['A','V']:
    a,b=(m['aIntercept'],m['aSlope']) if expect['name']=='A' else (m['dIntercept'],m['dSlope'])
    assert all(abs(y-a-b*x)<1e-9 for x,y in zip(*actual))
   if expect['name']=='Productie': assert abs(actual[0][0]-(spec['price']-m['aIntercept'])/m['aSlope'])<1e-9
   if expect['name']=='Verbruik': assert abs(actual[0][0]-(spec['price']-m['dIntercept'])/m['dSlope'])<1e-9
  axes=r.findall('.//c:valAx',ns)
  assert {a.find('c:axPos',ns).get('val'):float(a.find('c:scaling/c:max',ns).get('val')) for a in axes}=={'b':m['qMax'],'l':m['pMax']}
  assert all(float(a.find('c:scaling/c:min',ns).get('val'))==0 for a in axes)
  assert {a.find('c:axPos',ns).get('val'):float(a.find('c:majorUnit',ns).get('val')) for a in axes}=={'b':m['qStep'],'l':m['pStep']}
  print('graph coordinates and axes PASS',spec['slide'],m['id'])
 over=[]
 for n in [1,14,25]:
  r=E.fromstring(z.read(f'ppt/slides/slide{n}.xml')); rows=[]
  for sh in r.findall('.//p:sp',ns):
   name=sh.find('.//p:cNvPr',ns).get('name')
   if name in ['phase','slide-number']: continue
   txt='|'.join(sh.xpath('.//a:t/text()',namespaces=ns)); xf=sh.find('.//a:xfrm',ns)
   geom=E.tostring(xf).decode() if xf is not None else None
   rows.append((name,txt,geom))
  over.append(rows)
 assert over[0]==over[1]==over[2]
 notes=[x for x in z.namelist() if re.fullmatch(r'ppt/notesSlides/notesSlide\d+.xml',x)]
 assert len(notes)==25
 for f in notes:
  r=E.fromstring(z.read(f)); text=' '.join(r.xpath('//a:t/text()',namespaces=ns))
  assert all(x in text for x in ['Vraag:','Uitleg:','Misvatting:','Overgang:','Bron:'])
  assert all(int(x)>=1400 for x in r.xpath('//@sz'))
 print('PASS 3 overview copies, 25 structured notes, 14 pt notes floor')
geo=json.loads((root/'render/text-geometry.json').read_text('utf-8-sig'))
issues=[{'slide':r['slide'],'name':r['name'],'height':r['height'],'boundHeight':r['boundHeight']} for r in geo if r['boundHeight']>r['height']+5 or r['boundWidth']>r['width']+5]
assert not issues, issues
print('PASS PowerPoint text geometry')
