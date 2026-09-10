from pathlib import Path
from fractions import Fraction
import xml.etree.ElementTree as ET
import json
import cairosvg

OUT = Path(__file__).resolve().parent
X0, Y0, SX, SY = 110, 660, 6, 7
def xy(q, p):
    return X0 + SX * q, Y0 - SY * p
def points(values):
    return ' '.join(f'{x:.8f},{y:.8f}' for x, y in (xy(q,p) for q,p in values))
def line(id, a, b, attrs=''):
    x1,y1=xy(*a); x2,y2=xy(*b)
    return f'<line id="{id}" x1="{x1:.8f}" y1="{y1:.8f}" x2="{x2:.8f}" y2="{y2:.8f}" {attrs}/>'
def text(x,y,s,attrs=''):
    return f'<text x="{x}" y="{y}" {attrs}>{s}</text>'

P = Fraction(150,5)
Q = 120 - 2*P
CS = Q*(60-P)/2
PS = Q*(P-10)/2
assert Q == 3*P-30 and (Q,P,CS,PS)==(60,30,900,600)

svg = ['<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="800" viewBox="0 0 1000 800" role="img" aria-labelledby="title desc">',
 '<title id="title">De appelmarkt: evenwicht en surplus</title>',
 '<desc id="desc">Vraag Qv = 120 min 2P en aanbod Qa = 3P min 30. Evenwicht bij 60 kilogram per week en 30 euro per kilogram. Het blauwe gebied CS bedraagt 900 euro per week en het groene gebied PS 600 euro per week. Alleen niet-negatieve prijzen en hoeveelheden worden getoond.</desc>',
 '<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6" fill="#2D3748"/></marker></defs>',
 '<rect width="1000" height="800" fill="#F7FAFC"/>',
 '<g font-family="Arial, sans-serif" font-size="18" fill="#2D3748">',
 text(45,43,'De appelmarkt: evenwicht en surplus','font-size="29" font-weight="700" fill="#1E2761"'),
 text(45,80,'Vraag: Qᵥ = 120 − 2P    |    Aanbod: Qₐ = 3P − 30','font-size="21"'),
 f'<polygon id="cs" points="{points([(0,P),(0,60),(Q,P)])}" fill="#85C1E9"/>',
 f'<polygon id="ps" points="{points([(0,10),(0,P),(Q,P)])}" fill="#82E0AA"/>',
 line('q-guide',(Q,0),(Q,P),'stroke="#718096" stroke-width="1.8" stroke-dasharray="6 5"'),
 line('p-guide',(0,P),(Q,P),'stroke="#718096" stroke-width="1.8" stroke-dasharray="6 5"'),
 line('demand',(0,60),(120,0),'stroke="#1A5276" stroke-width="3.5"'),
 line('supply',(0,10),(130,Fraction(160,3)),'stroke="#1E8449" stroke-width="3.5"'),
 '<path d="M110,140 V660 H928" fill="none" stroke="#2D3748" stroke-width="2" marker-end="url(#arrow)"/>',
 '<path d="M110,660 V140" fill="none" stroke="#2D3748" stroke-width="2" marker-end="url(#arrow)"/>',
 text(110,120,'P (€ per kilogram)','font-size="20"'),
 text(930,721,'Q (kilogram per week)','font-size="20" text-anchor="end"')]
for q in range(0,131,20):
    x,y=xy(q,0)
    svg += [f'<path d="M{x},{y} v7" stroke="#2D3748"/>',text(x,688,str(q),'text-anchor="middle"'+(' font-weight="700"' if q==60 else ''))]
for p in range(10,71,10):
    x,y=xy(0,p)
    svg += [f'<path d="M{x},{y} h-7" stroke="#2D3748"/>',text(95,y+6,str(p),'text-anchor="end"'+(' font-weight="700"' if p==30 else ''))]
x,y=xy(Q,P)
svg += [f'<circle id="equilibrium" cx="{x}" cy="{y}" r="6" fill="#2D3748" stroke="#F7FAFC" stroke-width="2"/>',
 text(480,390,'E (60; 30)','font-size="20" font-weight="700"'),
 text(765,584,'V','font-size="25" font-weight="700" fill="#1A5276"'),
 text(801,293,'A','font-size="25" font-weight="700" fill="#1E8449"'),
 text(230,366,'CS','text-anchor="middle" font-size="23" font-weight="700"'),
 text(230,392,'€ 900','text-anchor="middle" font-size="20"'),
 text(230,486,'PS','text-anchor="middle" font-size="23" font-weight="700"'),
 text(230,512,'€ 600','text-anchor="middle" font-size="20"'),
 '<rect x="45" y="748" width="18" height="18" fill="#85C1E9"/>',
 text(73,763,'CS: consumentensurplus — € 900 per week','font-size="18"'),
 '<rect x="537" y="748" width="18" height="18" fill="#82E0AA"/>',
 text(565,763,'PS: producentensurplus — € 600 per week','font-size="18"'),
 '</g></svg>']
path=OUT/'appelmarkt.svg'
path.write_text('\n'.join(svg),encoding='utf-8',newline='\n')

# Verify coordinates parsed back from the actual delivered SVG, independently
# against the supplied equations, including clipped endpoints and shaded areas.
root=ET.parse(path).getroot()
elements={e.attrib['id']:e for e in root.iter() if 'id' in e.attrib}
def economic(x,y): return ((float(x)-X0)/SX,(Y0-float(y))/SY)
def segment(id):
    e=elements[id]
    return [economic(e.attrib[f'x{i}'],e.attrib[f'y{i}']) for i in (1,2)]
def close(a,b): assert abs(a-b)<1e-7,(a,b)
for id,equation,expected in [('demand',lambda p:120-2*p,[(0,60),(120,0)]),('supply',lambda p:3*p-30,[(0,10),(130,160/3)])]:
    ends=segment(id)
    for (q,p),(qe,pe) in zip(ends,expected):
        close(q,qe); close(p,pe); close(q,equation(p)); assert q>=0 and p>=0
    for t in (0,.25,.5,.75,1):
        q,p=[ends[0][i]*(1-t)+ends[1][i]*t for i in (0,1)]
        close(q,equation(p))
eq=elements['equilibrium']
q,p=economic(eq.attrib['cx'],eq.attrib['cy'])
close(q,120-2*p); close(q,3*p-30); close(q,60);close(p,30)
for id,expected in [('q-guide',[(60,0),(60,30)]),('p-guide',[(0,30),(60,30)])]:
    for actual,wanted in zip(segment(id),expected):
        for a,b in zip(actual,wanted): close(a,b)
areas={}
for id,expected,wanted_area in [('cs',[(0,30),(0,60),(60,30)],900),('ps',[(0,10),(0,30),(60,30)],600)]:
    coords=[economic(*s.split(',')) for s in elements[id].attrib['points'].split()]
    for actual,wanted in zip(coords,expected):
        for a,b in zip(actual,wanted): close(a,b)
    areas[id]=abs(sum(coords[i][0]*coords[(i+1)%3][1]-coords[(i+1)%3][0]*coords[i][1] for i in range(3)))/2
    close(areas[id],wanted_area)
result={'geometry':'PASS: actual SVG endpoints, 5 samples per curve, equilibrium, guides, triangle vertices and areas', 'tolerance_economic_units':1e-7,'quantity_kg_per_week':int(Q),'price_eur_per_kg':int(P),'consumer_surplus_eur_per_week':areas['cs'],'producer_surplus_eur_per_week':areas['ps'],'numerical_check':'120 − 2 × 30 = 60 = 3 × 30 − 30; CS = 0.5 × 60 × (60 − 30) = 900; PS = 0.5 × 60 × (30 − 10) = 600','visible_range':'Q: 0–130 kg/week; P: 0–70 EUR/kg','final_size_pixels':[1000,800]}
(OUT/'numerical-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8',newline='\n')
cairosvg.svg2png(url=str(path),write_to=str(OUT/'appelmarkt.png'),output_width=1000,output_height=800)
print(json.dumps(result,ensure_ascii=True,indent=2))
print('Rendered: '+str(OUT/'appelmarkt.png'))
