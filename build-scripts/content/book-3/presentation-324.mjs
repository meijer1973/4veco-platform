// HOW TO ADAPT: derive assignments, prerequisite support and target from the current edition.
// Native scatter series carry curves, guides and hatching in economic coordinates.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {Presentation,PresentationFile,finalizePresentation,applyPresentationChartFont,PYTHON,SKILL,TOOLS,workspace} from '../../presentations/runtime.mjs';
const HERE=path.dirname(fileURLToPath(import.meta.url));
const M=JSON.parse(await fs.readFile(path.join(HERE,'presentation-324.manifest.json'),'utf8'));
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('324');
const p=Presentation.create({slideSize:{width:1600,height:900}}), FONT='Arial';
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',red:'#A63735',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const slides=[],tables=[],charts=[],overviewSlides=[];
const source='https://github.com/meijer1973/4veco-lessen/blob/'+M.sourceCommit+'/'+M.sourceEditionPath+'/';
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const t=s.shapes.add({geometry:'textbox',name:name||str.slice(0,70),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 t.text=str;t.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return t;
}
function rule(s,x,y,w){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:C.line,width:2}});}
function slide(title,role='recap',page=''){
 const s=p.slides.add();s.background.fill='#FFFFFF';
 text(s,title,60,40,1480,95,48,{bold:true});rule(s,60,146,1480);
 text(s,'§3.2.4 Gemengde opgaven'+(page?' · Boekpagina '+page:''),60,848,1390,32,21,{color:C.muted});
 text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted,name:'slide-number'});
 slides.push({number:p.slides.items.length,title,role});return s;
}
function notes(s,page,explanation,question,pitfall,transition,{authored=false,extra=''}={}){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 3, books34-v3, gedrukte boekpagina ${page}. ${source}output/Boek_3_Compleet_v3.pdf\nManuscript en antwoordmodel: ${source}chapters/3.2/3.2.4%20manuscript.md en ${source}chapters/3.2/Antwoorden.md\n${authored?'Eigen context en gegevens: glasgranulaat, één week. Uitlegvoorbeeld, niet uit het boek. De genoemde boekpagina’s onderbouwen alleen de methoden. Constante kosten zijn deze week onvermijdbaar, kg zijn deelbaar, de kleine prijsnemer kan alle productie verkopen.':''}\n${extra}`);
}
function table(s,values,x,y,w,h,widths,size=32){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});
 t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){
  const cell=t.getCell(r,c);cell.fill=r===0?C.ink:r%2?'#FFFFFF':C.pale;
  cell.text.style={typeface:FONT,fontSize:size,bold:r===0,color:r===0?'#FFFFFF':C.ink,verticalAlignment:'middle',insets:{left:16,right:14,top:10,bottom:10}};
 }} tables.push(p.slides.items.length);return t;
}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.',
 'Maak de startopdracht.', 'Korte herhaling en aanpak.',
 'Werk verder aan de gemengde opgaven, stel vragen en kijk je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.',
 'Bespreken van opgave 35.', 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=slide('Deze les: §3.2.4 Gemengde opgaven','overview');overviewSlides.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1450,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,594,688,774],hs=[80,45,45,122,75,60,50];
 route.forEach((r,i)=>{const color=active===i+1?C.blue:C.ink;text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color,name:'route-number-'+i});text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color,name:'route-'+i});});
 text(s,'Lesdoelen',972,185,568,45,35,{bold:true});
 text(s,'Marktprijs en productie bepalen.\nKeuze en winst onderbouwen.\nQ en q onderscheiden.',972,244,568,122,30,{name:'overview-goals'});rule(s,972,374,568);
 text(s,'Startopdracht',972,401,568,45,35,{bold:true});
 text(s,'Pagina 79 · Opgave 31\nSteun: uitleg p. 54–56',972,457,568,95,30,{name:'overview-start'});rule(s,972,570,568);
 text(s,'Huiswerk',972,593,568,45,35,{bold:true});
 text(s,'§3.2.4 · Maken en nakijken\n31–34: voorbereiding\n35: doeloefening\n36: bonus · 37: herhaling',972,650,568,176,30,{name:'overview-homework'});
 notes(s,'54–56, 79–84',`Laat het overzicht staan tijdens ${phase.toLowerCase()}. Start: de eerste echte opgave, 31 op p.79. Zij herhaalt het evenwicht berekenen uit Boek 1 §1.3.2, prijsnemerschap, TO en P=GO=MO uit §3.2.1. Bij moeite: laat leerlingen p.54–56 en de evenwichtsaanpak erbij nemen. Geef nog geen uitgewerkte antwoorden. Bespreek na de korte herhaling welke bron bij Q en q hoort. Werk verder aan 32–34 en doel35. Dit is een gemengde paragraaf zonder aparte basis- of zelfstandige sectie. Huiswerk volgens de classroom-route: alle opgaven 31,32,33,34,35,36 (bonus),37 (herhaling) maken en nakijken. Het boek presenteert bonus/herhaling als aanvullende onderdelen; deze lesroute neemt ze expliciet in het huiswerk op. Geen aangetoonde 55-minutenfit.`, 'Welke gegevens gaan over alle bedrijven samen?', 'Een marktprijs geeft nog geen productieadvies voor één onderneming zonder haar kosten.',phase==='Afsluiting / huiswerk'?'Laat de volledige huiswerkreeks noteren.':'Ga naar de volgende lesfase.');
}
function example(s){text(s,'Uitlegvoorbeeld — niet uit het boek',60,175,1480,46,30,{bold:true,color:C.blue});}
function series(name,xValues,values,color,style='solid',width=3){return {name,xValues,values,line:{fill:color,width,style},marker:{symbol:'none'}};}
function label(name,x,y,color=C.ink,position='t',dot=false){return {name,xValues:[x],values:[y],line:{fill:'none',width:0},marker:{symbol:dot?'circle':'none',size:8,fill:color,line:{fill:color,width:1}},dataLabelOverrides:[{idx:0,text:name,position,showValue:false,textStyle:{typeface:FONT,fontSize:26,fill:color,bold:true}}]};}
function chart(s,data,{xmax,ymax,xstep,ystep,xlabel,ylabel,pos={left:60,top:230,width:1000,height:570}}){
 for(const a of data){a.xValues=a.xValues.map(v=>Number(v.toFixed(8)));a.values=a.values.map(v=>Number(v.toFixed(8)));}
 const ch=s.charts.add('scatter',{position:pos,series:data,scatterOptions:{style:'line'},hasLegend:false,
  xAxis:{min:0,max:xmax,majorUnit:xstep,numberFormatCode:'0',title:{text:xlabel,textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},line:{fill:C.ink,width:1.5}},
  yAxis:{min:0,max:ymax,majorUnit:ystep,numberFormatCode:'0',title:{text:ylabel,textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},majorGridlines:{fill:C.line,width:1},line:{fill:C.ink,width:1.5}},chartFill:'#FFFFFF',plotAreaFill:'#FFFFFF'});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);return ch;
}
function profitSeries(q,gtk,price){
 const a=[series('Winstrechthoek',[0,q,q,0,0],[gtk,gtk,price,price,gtk],C.green,'solid',2)];
 // Diagonal hatching in data coordinates; each segment lies inside the rectangle.
 for(let u=-.8;u<1;u+=.10){let l=Math.max(0,u),r=Math.min(1,u+1);a.push(series('Arcering',[l*q,r*q],[gtk+(l-u)*(price-gtk),gtk+(r-u)*(price-gtk)],'#9BC7B6','solid',1));}
 return a;
}
function firm(s,stage,{authored=false}={}){
 const a=authored?.025:.02,b=authored?2:4,c=authored?90:200,cap=authored?100:250,ymax=authored?12:24;
 const q=authored?80:200,price=authored?6:12,gtk=authored?5.125:9;
 const cut=((ymax-b)-Math.sqrt((ymax-b)**2-4*a*c))/(2*a);
 const xx=[cut];for(let x=Math.ceil(cut);x<=cap;x++)xx.push(x);if(xx.at(-1)!==cap)xx.push(cap);
 const data=[];
 if(stage==='profit')data.push(...profitSeries(q,gtk,price));
 data.push(series('MK',[0,cap],[b,2*a*cap+b],C.orange));
 data.push(label('MK',cap*.86,2*a*cap*.86+b+ymax*.065,C.orange,'t'));
 if(stage==='base'||stage==='profit'){data.push(series('GTK',xx,xx.map(x=>a*x+b+c/x),C.red));data.push(label('GTK',cap*.86,a*cap*.86+b+c/(cap*.86)-ymax*.045,C.red,'b'));}
 if(stage!=='base'){
  data.push(series('P = GO = MO',[0,cap],[price,price],C.blue));
  data.push(label('P = GO = MO',cap*.42,price+ymax*.055,C.blue,'t'));
  data.push(series('q gekozen',[q,q],[0,price],C.muted,'dashed',2));
  data.push(label('q = '+q,q,ymax*.055,C.ink,'t'));
 }
 if(stage==='profit')data.push(label(authored?'winst':'€ 600',q*.45,(gtk+price)/2,C.green,'r'));
 chart(s,data,{xmax:cap,ymax,xstep:authored?20:50,ystep:authored?2:4,xlabel:'q (kg per week)',ylabel:stage==='choice'?'P en MK (€ per kg)':'P, MK en GTK (€ per kg)'});
}
function market(s,stage){
 const data=[series('V₀',[0,30],[12,0],C.blue,'dashed'),series('V₁',[0,50],[20,0],C.blue),series('A₀',[0,50],[4,24],C.green)];
 data.push(label('V₀',24,1.3,C.blue,'b'),label('V₁',42,4.8,C.blue,'t'),label('A₀',42,19.6,C.green,'t'));
 if(stage==='new'){
  data.push(series('E1 hulplijnen',[0,20,20],[12,12,0],C.muted,'dashed',2));
  data.push({...label('',20,12,C.ink,'r',true),name:'E1 punt',dataLabelOverrides:[]});
  data.push(label('E₁',23.5,12,C.ink,'r'));
 }
 chart(s,data,{xmax:50,ymax:24,xstep:10,ystep:4,xlabel:'Q (× 1.000 kg per week)',ylabel:'P (€ per kg)'});
}
function target(title,role='target-answer'){return slide(title,role,'82–83');}
overview('Startopdracht',2);
{
 const s=slide('Herhaling: de prijs op de markt');example(s);
 text(s,'Glasgranulaat · veel kleine aanbieders, gelijke kwaliteit, bekende prijzen',60,240,1480,55,34,{bold:true});
 table(s,[['Markt per week','Functie'],['Vraag','Qv = 9.000 − 500P'],['Aanbod','Qa = 1.000P']],60,323,1480,228,[650,830],35);
 text(s,'9.000 − 500P = 1.000P     dus     9.000 = 1.500P',60,598,1480,65,39,{bold:true});
 text(s,'P = € 6 per kg                 Q = 1.000 × 6 = 6.000 kg per week',60,691,1480,64,37,{bold:true,color:C.blue});
 text(s,'Bij procentuele verandering: (nieuw − oud) / oud × 100%',60,784,1480,48,30);
 notes(s,'55–56, 79', 'Eigen voorbeeld. Stel de hoeveelheden aan elkaar gelijk en los eerst P op. Controleer de vraag: 9.000−500×6=6.000, gelijk aan Qa. Q omvat de hele markt. Eén kleine aanbieder neemt alleen P=6 over. Herhaal als methodecue de procentuele verandering met de oude waarde als noemer, straks voor elke grootheid afzonderlijk. Dit is de bekende algebra, geen nieuwe markttheorie.', 'Welke waarde kan één kleine aanbieder overnemen?', 'Vul Q=6.000 straks niet in de kostenfunctie van één bedrijf.', 'Bekijk de kosten van één aanbieder.',{authored:true,extra:'Algebra-anker: Boek 1 §1.3.2, Het evenwicht berekenen.'});
}
{
 const s=slide('Herhaling: de productie van één bedrijf');example(s);
 text(s,'TK = 0,025q² + 2q + 90       P = € 6 per kg       Capaciteit: 100 kg/week',60,241,1480,80,35,{bold:true});
 text(s,'MK = 0,05q + 2       6 = 0,05q + 2       q = 80 kg/week',60,345,1480,70,40,{bold:true,color:C.orange});
 table(s,[['Rond de gekozen q','MO (€ per kg)','MK (€ per kg)','Winst bij uitbreiding'],['q = 60','6','5','Stijgt'],['q = 90','6','6,50','Daalt']],60,468,1480,245,[400,290,300,490],32);
 text(s,'80 ≤ 100: haalbaar. De stijgende MK gaat door MO.',60,770,1480,61,38,{bold:true});
 notes(s,'62–64, 70–72','Differentieer term voor term: 0,025q² wordt 0,05q; 2q wordt2;90 wordt0. q is deelbaar. MK is een puntwaarde per kg, niet het exacte bedrag voor een hele eindige stap. MO=MK geeft de kandidaat80. Omdat MK stijgt door MO en de capaciteit100 is, is dit hier het maximum. Dezelfde onvermijdbare90 blijft bij q=0 bestaan. Volgende dia toont winst70, beter dan−90 bij nul. Bij een tabelstap zoals opgave37 gebruik je ΔTK/Δq.', 'Waarom is alleen 6 = MK nog geen volledig bewijs?', 'Het minimum van GTK bepaalt niet vanzelf de maximale totale winst.', 'Bereken winst en GTK op dezezelfde q.',{authored:true});
}
{
 const s=slide('Herhaling: de winst bij dezelfde q');example(s);firm(s,'profit',{authored:true});
 text(s,'Bij q = 80',1100,247,440,56,38,{bold:true});
 text(s,'TO = 6 × 80 = € 480\nTK = 160 + 160 + 90\nTK = € 410 per week',1100,329,440,161,32);
 text(s,'GTK = 410 / 80\n= € 5,125 per kg',1100,523,440,100,33,{bold:true,color:C.red});
 text(s,'Winst = (6 − 5,125) × 80\n= € 70 per week',1100,671,440,114,33,{bold:true,color:C.green});
 notes(s,'71–72','TK bij80: 0,025×80²+2×80+90=410. Winst480−410=70. De rechthoek loopt van q0 tot80 en van GTK5,125 tot P6. Breedte kg/week maal hoogte euro/kg geeft euro/week. GTK is bij80 genomen, niet bij zijn minimum. Alle grafiekelementen horen bij hetzelfde bedrijf en dezelfde week. De winst bij nul is−90, dus produceren is hier beter.', 'Welke eenheid krijgt de oppervlakte?', 'In een grafiek met bedragen per kg is winst een oppervlak. Bij totale bedragen op de verticale as zou winst een afstand zijn.', 'Controleer hoe een lagere capaciteit de keuze verandert.',{authored:true});
}
{
 const s=slide('Herhaling: als de capaciteit eerder stopt');example(s);
 text(s,'Zelfde bedrijf en prijs · alleen capaciteit verandert naar 70 kg/week',60,251,1480,84,39,{bold:true});
 table(s,[['Controle','Uitkomst'],['Snijpunt MO = MK','q = 80: niet haalbaar'],['Aan de grens q = 70','MK = 0,05 × 70 + 2 = € 5,50 per kg'],['Marginale vergelijking','MO = € 6 > MK tot aan de grens']],60,390,1480,295,[630,850],34);
 text(s,'Beste haalbare q = 70 kg per week',60,757,1480,68,45,{bold:true,color:C.blue});
 notes(s,'70, 76','De capaciteit is in deze variant70, alle andere gegevens blijven gelijk. MK stijgt en is zelfs bij de grens5,50, onder MO6. Uitbreiden blijft dus gunstig tot70;80 is onmogelijk. Alleen wanneer die marginale vergelijking dat onderbouwt kies je de capaciteitsgrens. Vraag of leerlingen het bewijs in eigen woorden kunnen geven. Dit geeft een aanpak voor33 zonder diens gegevens of antwoord uit te werken.', 'Waarom hoeven we niet naar een ander snijpunt te zoeken?', 'Een onhaalbaar snijpunt betekent niet dat een winstmaximum ontbreekt.', 'Laat leerlingen de start redenering controleren en verder oefenen.',{authored:true});
}
overview('Zelf werken',4);
{
 const s=target('Opgave 35: kweekkorrels op twee momenten','target-source');
 text(s,'Bron A · De markt',60,187,1480,60,40,{bold:true,color:C.blue});
 text(s,'Veel kleine bedrijven verkopen dezelfde kwaliteit kweekkorrels.\nKopers kennen de prijzen.',60,273,1480,111,38);
 table(s,[['Beginsituatie','Direct na nieuwe toepassing'],['Qv₀ = 30.000 − 2.500P','Qv₁ = 50.000 − 2.500P'],['Qa₀ = 2.500P − 10.000','Qa₀ blijft gelden']],60,415,1480,247,[740,740],34);
 text(s,'In deze korte periode verandert het aantal bedrijven niet.',60,706,1480,60,38,{bold:true});
 text(s,'Q: kg per week. P: euro per kg.',60,787,1480,46,32);
 notes(s,'82','Lees de volledige marktbron. Door een nieuwe toepassing neemt de vraag toe. De onderzochte korte periode houdt het aantal bedrijven gelijk en gebruikt hetzelfde aanbod Qa0. Nog geen evenwichtswaarden geven. De gekozen doelopgave combineert alle technieken en is daarom representatief voor deze gemengde paragraaf.', 'Welke functie verandert en welke blijft gelden?', 'Geen toetreding of langetermijnprijs toevoegen aan deze bron.', 'Bekijk bronB en vervolgens beide basisgrafieken.');
}
{
 const s=target('Opgave 35: één onderneming','target-source');
 text(s,'Bron B · Voor iedere onderneming',60,193,1480,66,41,{bold:true,color:C.blue});
 text(s,'TK = 0,02q² + 4q + 200',60,326,1480,100,60,{bold:true});
 table(s,[['Grootheid / voorwaarde','Gegeven'],['q','kg per week'],['TK','euro per week'],['Capaciteit','250 kg per week'],['Afzet','Alle productie wordt verkocht']],60,480,1480,334,[630,850],34);
 notes(s,'82','Dit is de volledige ondernemingsbron met expliciete eenheid TK. Iedere onderneming heeft deze functie. De techniek blijft in beide situaties hetzelfde. Neem de uit de markt berekende prijs over naar deze onderneming, niet de markthoeveelheid.', 'Waarvoor heb je TK straks nodig?', 'De marktvergelijking alleen geeft nog geen winst of productieadvies voor één bedrijf.', 'Lees de twee grafieken zonder nieuwe markeringen.');
}
{
 const s=target('Opgave 35: basisgrafiek van de markt','target-figure');market(s,'base');
 text(s,'Figuur 1 · Markt',1100,255,440,66,37,{bold:true});
 text(s,'V₀ en V₁: vraag\nA₀: ongewijzigd aanbod',1100,371,440,136,35);
 text(s,'Q-as: × 1.000\nEen aswaarde van 10\nbetekent 10.000 kg/week.',1100,571,440,171,34,{bold:true,color:C.blue});
 notes(s,'82','De marktgrafiek uit figuur1 is als bewerkbare XY-grafiek herbouwd met dezelfde grenzen0–50 duizend en P0–24. Formules: V0 P12−0,4X, V1 P20−0,4X, A0 P4+0,4X met X=Q/1000. Er zijn nog geen antwoordpunten of hulplijnen toegevoegd.', 'Welke schaal staat onder deze grafiek?', '10 op deze as is niet10kg.', 'Bekijk de andere helft van figuur1.');
}
{
 const s=target('Opgave 35: basisgrafiek van de onderneming','target-figure');firm(s,'base');
 text(s,'Figuur 1 · Onderneming',1100,255,440,98,36,{bold:true});
 text(s,'Gegeven: MK en GTK\n\nNog toe te voegen:\nP = GO = MO\nen de winstrechthoek',1100,393,440,243,34);
 text(s,'q-as: kg per week\nCapaciteit: 250 kg/week',1100,704,440,100,33,{bold:true,color:C.blue});
 notes(s,'82','Dit is de ondernemingshelft van figuur1 met dezelfde assen: q0–250, bedragen per kg0–24. GTK is voor q>0, de stijging bij kleine q wordt netjes aan de bovenrand afgekapt. De bron toont MK al, maar vraagt de leerling die ook algebraïsch op te stellen. Geen prijslijn of winstarcering vóór de volledige vragen.', 'Waarom verschillen de twee hoeveelheidsassen?', 'q is één bedrijf, Q de hele markt.', 'Geef nu alle deelvragen, nog zonder uitwerking.');
}
{
 const s=target('Opgave 35: vragen a–c','target-questions');
 const qs=[['a · 3p','Bereken in de beginsituatie P₀ en Q₀. Eén onderneming kiest dan q = 100. Controleer met TO en TK dat haar winst nul is.'],['b · 2p','Bereken direct na de vraagstijging, bij het gegeven ongewijzigde aanbod, P₁ en Q₁. Markeer het nieuwe evenwicht E₁ in de marktgrafiek.'],['c · 3p','Stel MK op. Bepaal bij P₁ de winstmaximale q van één onderneming. Controleer de capaciteit en het verloop van MO en MK.']];
 qs.forEach(([a,t],i)=>{let y=216+i*198;text(s,a,60,y,165,60,38,{bold:true,color:C.blue});text(s,t,249,y,1285,151,37);if(i<2)rule(s,60,y+166,1480);});
 notes(s,'83','Lees deelvragen a,b,c volledig. Leerlingen gebruiken bronnenA/B en figuur1 op p.82. Laat tussenuitkomsten staan. Wacht nog met uitwerken tot ook d/e zichtbaar zijn geweest.', 'Welke vraag gaat over de markt en welke over één onderneming?', 'De q100 in a is gegeven; Q0 moet je berekenen.', 'Toon d en e vóór de eerste oplossing.');
}
{
 const s=target('Opgave 35: vragen d–e','target-questions');
 text(s,'d · 3p',60,231,165,60,38,{bold:true,color:C.blue});
 text(s,'Bereken de winst en GTK bij die q. Teken rechts de nieuwe\nP = GO = MO-lijn en arceer de winstrechthoek.',249,231,1285,163,38);rule(s,60,425,1480);
 text(s,'e · 2p',60,478,165,60,38,{bold:true,color:C.blue});
 text(s,'Vergelijk de procentuele stijging van Q met die van q.\nWaarom zijn Q en q ondanks die vergelijking niet dezelfde grootheid?',249,478,1285,167,38);
 text(s,'Reken met ongeronde tussenuitkomsten. Benoem markt of onderneming.',60,755,1480,75,34,{bold:true});
 notes(s,'83','Alle deelvragen zijn nu beschikbaar. BronA/B en de twee grafieken zijn vooraf getoond. Laat eigen pogingen vergelijken voordat de antwoordreeks begint. Het afrondingsvoorschrift en onderscheid Q/q blijven gelden.', 'Bij welke gekozen hoeveelheid moet je GTK nemen?', 'Een juist getal zonder eenheid of onderbouwing is niet het volledige antwoord.', 'Begin met de beginsituatie.');
}
{
 const s=target('35a: het eerste marktevenwicht');
 text(s,'Qv₀ = Qa₀',60,207,1480,68,45,{bold:true,color:C.blue});
 text(s,'30.000 − 2.500P = 2.500P − 10.000\n40.000 = 5.000P\nP₀ = € 8 per kg',60,314,1480,226,44);
 text(s,'Q₀ = 2.500 × 8 − 10.000 = 10.000 kg per week',60,592,1480,80,43,{bold:true});
 text(s,'Controle vraag: 30.000 − 2.500 × 8 = 10.000',60,750,1480,70,35,{color:C.green});
 notes(s,'82–83','Gelijkstellen geeft40.000=5.000P. Delen geeft8. Invullen geeft10.000 en de andere functie bevestigt dat. P8 gaat straks naar de onderneming. Q10.000 blijft op de markt-as.', 'Waarom is dit een evenwicht?', 'q100 uit deelvraag a is niet de markthoeveelheid.', 'Controleer de nulwinst van één bedrijf.');
}
{
 const s=target('35a: de gegeven q = 100 is kostendekkend');
 table(s,[['Bij P₀ = € 8 en q = 100','Berekening (€ per week)'],['TO = P × q','8 × 100 = 800'],['TK = 0,02q² + 4q + 200','200 + 400 + 200 = 800'],['Winst = TO − TK','800 − 800 = 0']],60,240,1480,359,[680,800],35);
 text(s,'De berekende winst is € 0 per week.',60,694,1480,80,45,{bold:true,color:C.blue});
 notes(s,'82–83','Vul eerst q100 in beide totalen in. q²=10.000;0,02×10.000=200. Dit toont kostendekking. Het is de uitkomst van deze gegevens, geen nieuw langetermijnresultaat. q100 is gegeven, niet uit Q0 afgeleid.', 'Welke twee totale bedragen vergelijk je?', 'TO=TK bewijst op zichzelf niet dat q het winstmaximum is; daarvoor is de marginale keuze nodig.', 'Bereken het evenwicht direct na de vraagtoename.');
}
{
 const s=target('35b: het evenwicht na de vraagstijging');
 text(s,'Qv₁ = Qa₀',60,207,1480,68,45,{bold:true,color:C.blue});
 text(s,'50.000 − 2.500P = 2.500P − 10.000\n60.000 = 5.000P\nP₁ = € 12 per kg',60,314,1480,226,44);
 text(s,'Q₁ = 2.500 × 12 − 10.000 = 20.000 kg per week',60,592,1480,80,43,{bold:true});
 text(s,'Controle vraag: 50.000 − 2.500 × 12 = 20.000',60,750,1480,70,35,{color:C.green});
 notes(s,'82–83','Alleen de vraagfunctie verandert. Gebruik nog steeds Qa0, omdat de bron het aantal bedrijven en dit aanbod vast houdt. Invullen in de vraag bevestigt20.000. Een vraagtoename veroorzaakt een hogere prijs en meer aangeboden hoeveelheid langs A0.', 'Waarom gebruiken we Qa₀ en niet een nieuwe aanbodfunctie?', 'De hogere aangeboden hoeveelheid is geen verschuiving van A0.', 'Zet het nieuwe evenwicht op de marktgrafiek.');
}
{
 const s=target('35b: E₁ in de marktgrafiek');market(s,'new');
 text(s,'E₁ = (20.000; 12)',1100,276,440,90,38,{bold:true,color:C.blue});
 text(s,'Op de getekende Q-as:\n20 betekent 20.000\nkg per week.',1100,424,440,161,35);
 text(s,'Zelfde A₀\nHogere vraag V₁',1100,670,440,119,35,{bold:true});
 notes(s,'82–83','De stip en hulplijnen staan exact bij X20 en P12. V1 en A0 leveren beide12 op die x. Het labelE1 staat naast het punt zodat de lijnen het niet doorsnijden. De oude vraag V0 blijft gestreept zichtbaar; de assen zijn gelijk aan de basisgrafiek.', 'Waar komt 20 op de horizontale as vandaan?', 'Een coördinaat in duizendtallen vraagt dezelfde schaal in beide grafieken van deze markt.', 'Neem alleen de prijs12 over naar één onderneming.');
}
{
 const s=target('35c: de winstmaximale productie');
 text(s,'TK = 0,02q² + 4q + 200',60,203,1480,73,42,{bold:true});
 table(s,[['Term','Afgeleide'],['0,02q²','0,04q'],['4q','4'],['200','0']],60,315,620,352,[310,310],36);
 text(s,'MK = 0,04q + 4\nMO = P₁ = 12\n12 = 0,04q + 4\n8 = 0,04q',790,315,750,287,41);
 text(s,'q = 200 kg per week',790,650,750,74,45,{bold:true,color:C.orange});
 text(s,'Capaciteit: 200 ≤ 250',790,753,750,63,37,{bold:true});
 notes(s,'82–83','Differentieer term voor term. De constante200 verdwijnt alleen uit MK, niet uit de totale kosten. Stel vervolgens MO12 gelijk aan MK. De kandidaat200 is haalbaar. Dat bewijst nog niet op zichzelf het verloop rond de kandidaat.', 'Waarom staat de constante200 niet in MK?', 'Een snijpunt is niet zelf een winstbedrag.', 'Onderbouw het verloop vóór en na200.');
}
{
 const s=target('35c: controle links en rechts van q = 200');firm(s,'choice');
 text(s,'MO = € 12 per kg',1100,246,440,65,37,{bold:true,color:C.blue});
 text(s,'q = 150: MK = € 10\nMO > MK\nWinst stijgt bij uitbreiding.',1100,362,440,167,32);
 text(s,'q = 250: MK = € 14\nMO < MK\nWinst daalt bij uitbreiding.',1100,577,440,167,32);
 text(s,'MK stijgt door MO.',1100,777,440,49,32,{bold:true});
 notes(s,'82–83','MK stijgt lineair. Onder200 is MK lager dan12 en boven200 hoger. Alle haalbare uitbreidingen onder200 verbeteren de winst, boven200 verlagen ze de winst. De capaciteit250 ligt rechts van het maximum. Bij q0 is winst−200; de volgende berekening600 bevestigt produceren. Geen noodzaak om buiten de capaciteit een keuze te zoeken.', 'Wat verandert er in de winst wanneer je iets minder dan250 produceert?', 'Meer totale winst op een gegeven q betekent niet dat elke verdere stap gunstig is.', 'Bereken nu de totalen en GTK bij200.');
}
{
 const s=target('35d: winst en GTK bij q = 200');
 table(s,[['Grootheid','Invullen bij q = 200','Uitkomst'],['TO','12 × 200','€ 2.400 per week'],['TK','0,02 × 200² + 4 × 200 + 200','€ 1.800 per week'],['Winst','2.400 − 1.800','€ 600 per week'],['GTK','1.800 / 200','€ 9 per kg']],60,254,1480,408,[300,700,480],33);
 text(s,'Controle: (P − GTK) × q = (12 − 9) × 200 = € 600 per week',60,728,1480,97,38,{bold:true,color:C.green});
 notes(s,'82–83','Eerst200²=40.000, dan0,02×40.000=800. TK800+800+200=1.800. Bereken alle grootheden bij dezelfde q200. GTK9 euro/kg; winst600 euro/week. Het product van hoeveelheid en marge controleert TO−TK. De nulproductie zou−200 geven.', 'Welke eenheid hoort bij GTK en welke bij winst?', 'GTK9 is niet het totale kostenbedrag en niet de minimumwaarde van de curve.', 'Teken de prijs en de bijbehorende winst.');
}
{
 const s=target('35d: de nieuwe prijslijn en winstrechthoek');firm(s,'profit');
 text(s,'P = GO = MO = 12',1100,251,440,68,36,{bold:true,color:C.blue});
 text(s,'Breedte: 200 kg/week\nHoogte: 12 − 9 = € 3/kg',1100,396,440,145,34);
 text(s,'Winst = 200 × 3\n= € 600 per week',1100,620,440,125,39,{bold:true,color:C.green});
 notes(s,'82–83','De prijs ligt horizontaal op12 tot capaciteit250. De rechthoek loopt van q0 tot200 en van y9 tot12, exact GTK bij200 tot P. De arcering staat volledig binnen deze grenzen. GTK is geen horizontale kostencurve; de onderrand gebruikt slechts GTK op de gekozen q. De oppervlakte is600, het MO/MK-snijpunt op zichzelf geen winstbedrag.', 'Waarom ligt de onderrand op9?', 'Arceer niet vanaf de minimumwaarde8 van GTK en ook niet onder de MK-lijn.', 'Vergelijk nu de twee procentuele veranderingen.');
}
{
 const s=target('35e: dezelfde procentuele stijging');
 table(s,[['Grootheid','Oud','Nieuw','Procentuele verandering'],['Q: alle bedrijven','10.000','20.000','(20.000 − 10.000) / 10.000 × 100% = 100%'],['q: één bedrijf','100','200','(200 − 100) / 100 × 100% = 100%']],60,236,1480,319,[380,220,220,660],32);
 text(s,'Alle hoeveelheden: kg per week',60,594,1480,60,33);
 text(s,'Q en q beschrijven verschillende economische grootheden.',60,697,1480,77,41,{bold:true,color:C.blue});
 notes(s,'82–83','Q en q verdubbelen allebei, dus100% stijging. De noemer is telkens de eigen oude hoeveelheid. Het niveau en object verschillen: hele markt versus één bedrijf. Bij deze gelijke ondernemingen en gelijkblijvend aantal bedrijven passen Q0/q0=100 en Q1/q1=100. Die verhouding is een controle van deze bron, geen algemeen bewijs dat een individueel bedrijf altijd hetzelfde groeipercentage als de markt heeft.', 'Waarom betekent twee keer100% niet dat Q=q?', 'Een verdubbeling is100% stijging, niet200% stijging.', 'Laat leerlingen hun eigen onderbouwing en grafiek verbeteren.');
}
overview('Afsluiting / huiswerk',7);
await fs.writeFile(path.join(BUILD,'slides.json'),JSON.stringify({slides,tables,charts,overviewSlides,sourceManifest:M},null,2));
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const draft=path.join(BUILD,'candidate.pptx');await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft],{stdio:'inherit'});
execFileSync(PYTHON,[path.join(TOOLS,'straight-scatter.py'),draft],{stdio:'inherit'});
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,'3.2.4 Gemengde opgaven – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...Array.from(new Set(tables)).flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:[...new Set(tables)],requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:slides.length,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
