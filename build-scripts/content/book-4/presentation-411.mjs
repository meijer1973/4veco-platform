// HOW TO ADAPT: use the current paragraph manifest, replace the authored model,
// and retain question-before-answer order, shared overviews and final validation.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Presentation,PresentationFile,finalizePresentation,applyPresentationChartFont,PYTHON,SKILL,TOOLS,workspace} from '../../presentations/runtime.mjs';
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('411');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const title='Toetreding, uittreding en langetermijnevenwicht';
const origin='https://github.com/meijer1973/4veco-lessen/blob/e734532a42b27732ac25ce990fc9448b12309d28/edities/books34-v3/books/book-4/';
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',red:'#A53737',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial',tables=[],charts=[],slides=[],graphs=[],overviews=[];
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const z=s.shapes.add({geometry:'textbox',name:name||str.slice(0,60),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 z.text=str;z.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return z;
}
function rule(s,x,y,w){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:C.line,width:2}});}
function slide(t,kind='example'){
 const s=p.slides.add();s.background.fill='#FFFFFF';
 text(s,t,60,40,1480,91,t.startsWith('Deze les')?37:50,{bold:true});rule(s,60,146,1480);
 text(s,kind==='example'?'Uitlegvoorbeeld — niet uit het boek':kind==='target'?'§4.1.1 · Opgave 7 · Boekpagina 14':'§4.1.1 · Hoe lang blijft de winst?',60,848,1400,32,21,{color:C.muted});
 text(s,String(p.slides.items.length),1470,848,70,32,22,{align:'right',color:C.muted});slides.push({number:p.slides.items.length,title:t,kind});return s;
}
function notes(s,page,explanation,question,pitfall,transition,authored=true){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 4 v3, gedrukte volledige-boekpagina ${page}. ${origin}output/Boek_4_Compleet_v3.pdf\nBrontekst: ${origin}chapters/4.1/4.1.1%20manuscript.md\nAntwoordmodel: ${origin}chapters/4.1/Antwoorden.md\n${authored?'Uitlegvoorbeeld — niet uit het boek. Cellulosekorrels, functies en getallen zijn speciaal voor deze uitleg gemaakt. De boekbron onderbouwt de methode, niet deze voorbeeldgegevens.':''}`);
}
function table(s,values,x,y,w,h,widths,size=34){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});t.borders.assign({fill:C.line,width:1,style:'solid'});
 values.forEach((r,i)=>{t.rows[i].height=h/values.length;r.forEach((_,j)=>{const c=t.getCell(i,j);c.fill=i===0?C.ink:(i%2?'#FFFFFF':C.pale);c.text.style={typeface:FONT,fontSize:size,color:i===0?'#FFFFFF':C.ink,bold:i===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};});});tables.push(p.slides.items.length);
}
function lines(s,rows,{top=225,gap=135,size=42}={}){rows.forEach((r,i)=>text(s,r,60,top+i*gap,1480,gap-15,size,{bold:i===rows.length-1,color:i===rows.length-1?C.blue:C.ink}));}
const route=['Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.','Maak de startopdracht.','Uitleg bij de lesdoelen.','Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.','Klaar? Werk aan een ander vak. Geen devices.','Bespreken van de doelopgave: opgave 7.','Zet je huiswerk in je agenda.'];
function overview(phase,active){
 const s=slide('Deze les: §4.1.1 '+title,'overview');overviews.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1450,38,30,{bold:true,color:C.blue,name:'phase'});text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const color=active===i+1?C.blue:C.ink;text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color,name:'route-number-'+i});text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color,name:'route-'+i});});
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});text(s,'Toe- en uittreding verklaren.\nMarkt en bedrijf tekenen.\nNulwinst berekenen en uitleggen.',972,244,565,122,30,{name:'overview-goals'});rule(s,972,374,568);
 text(s,'Startopdracht',972,403,565,45,35,{bold:true});text(s,'Pagina 11 · Opgaven 1 en 2\n2: verkennen, theorie p. 7',972,459,565,95,30,{name:'overview-start'});rule(s,972,570,568);
 text(s,'Huiswerk',972,598,565,45,35,{bold:true});text(s,'§4.1.1 · Opgaven 3 t/m 7\nBasis: 3 en 4\nZelfstandig: 5 en 6\nDoelopgave: 7\nMaken en nakijken',972,654,565,178,30,{name:'overview-homework'});
 notes(s,'7–14',`Laat dit overzicht staan tijdens ${phase.toLowerCase()}. Start 1–2: p. 11. Basis 3: p. 11 en 4: p. 12. Zelfstandig 5–6: p. 13. Doel 7: p. 14. Huiswerk 3, 4, 5, 6 en 7 maken en nakijken. Bonus 8 en herhaling 9–10 zijn extra. Opgave 1 herhaalt MK afleiden, MO=MK met capaciteitscontrole, TO, TK, winst en GTK uit §§3.2.2–3.2.3. Geef zo nodig de geheugensteun MK=2aq+b, MO=P, TO=Pq en GTK=TK/q zonder de opgave voor te rekenen. Opgave 2 is een eerste verkenning van economische winst en normale beloning: lees daarvoor p. 7, zoek welke kosten in TK zitten en noteer twijfel. Verwacht nog geen beheerste nieuwe begrippen. Bij terugkeer vóór basiswerk laat leerlingen opgave 2 opnieuw verklaren en bespreek de betekenis. De docenteninformatie adviseert voorlopig twee lessen van 55 minuten; dit is niet gemeten. Rond de hele route zo nodig later of als huiswerk af.`, 'Welke bewerking herken je, en waarvoor gebruik je de theorie?', 'Hoofdstukpagina 7 is complete-boekpagina 11. Nul economische winst is nieuwe leerstof.',active===7?'Noteer het huiswerk en verbeter ontbrekende stappen.':'Volg de lesfase en bied begeleiding bij het basiswerk.',false);return s;
}
function series(name,xs,ys,color,{label,idx=xs.length-1,pos='top',width=4,dash=false}={}){
 const clean=v=>Number(v.toFixed(10));return {name,xValues:xs.map(clean),values:ys.map(clean),line:{fill:color,width,...(dash?{style:'dashed'}:{})},marker:{symbol:'none'},...(label?{dataLabelOverrides:[{idx,text:label,position:pos,showValue:false,textStyle:{typeface:FONT,fontSize:27,fill:color,bold:true}}]}:{})};
}
function chart(s,ss,{maxX,maxY,stepX,stepY=4,xTitle,yTitle,tag,model}){
 const ch=s.charts.add('scatter',{position:{left:60,top:240,width:1050,height:565},series:ss,scatterOptions:{style:'line'},hasLegend:false,dataLabels:{showValue:false,showSeriesName:false},xAxis:{min:0,max:maxX,majorUnit:stepX,numberFormatCode:'0',title:{text:xTitle,textStyle:{typeface:FONT,fontSize:27,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},line:{fill:C.ink,width:1.5}},yAxis:{min:0,max:maxY,majorUnit:stepY,numberFormatCode:'0',title:{text:yTitle,textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},line:{fill:C.ink,width:1.5},majorGridlines:{fill:C.line,width:1}},chartFill:'#FFFFFF',plotAreaFill:'#FFFFFF'});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);graphs.push({slide:p.slides.items.length,tag,model,series:ss});
}
function market(s,{target=false,after=false,exit=false,question=false}={}){
 const d=target?16:15,k=target?.4:.1,b=target?4:1,oldSlope=target?.4:exit?.04:.25,newSlope=target?.2:.075,maxX=target?40:120,maxY=target?20:16;
 const Q0=(d-b)/(k+oldSlope),P0=d-k*Q0,Q1=(d-b)/(k+newSlope),P1=d-k*Q1;
 const end0=Math.min(maxX,(maxY-b)/oldSlope),ss=[series('V',[0,maxX*.92,maxX],[d,d-k*maxX*.92,d-k*maxX],C.blue,{label:'V',idx:1,pos:'top'}),series('A₀',[0,end0*(exit?.5:.85),end0],[b,b+oldSlope*end0*(exit?.5:.85),b+oldSlope*end0],after?C.muted:C.green,{label:question?'A':'A₀',idx:1,dash:after})];
 if(after)ss.push(series('A₁',[0,maxX*.88,maxX],[b,b+newSlope*maxX*.88,b+newSlope*maxX],C.orange,{label:'A₁',idx:1}));
 for(const [q,price,name,color] of (question?[]:[[Q0,P0,'E₀',C.muted],...(after?[[Q1,P1,'E₁',C.orange]]:[])])){
  ss.push(series(name+' hulplijn',[0,q,q],[price,price,0],color,{width:2,dash:true}));
  ss.push(series(name+' label',[q+(name==='E₁'?maxX*.04:0)],[price-(name==='E₁'?maxY*.025:0)],color,{label:name,idx:0,pos:name==='E₁'?'bottom':'top',width:0}));
 }
 chart(s,ss,{maxX,maxY,stepX:target?10:20,xTitle:target?'Q (× 1.000 kg per week)':'Q (× 1.000 kg per week)',yTitle:'P (€ per kg)',tag:'market',model:{d,k,b,oldSlope,newSlope,after,exit,target,question,Q0,P0,Q1,P1}});
}
const EX={a:.1,b:1,c:90,cap:80,maxY:20,initial:11,final:7,low:5};
const TG={a:.02,b:4,c:200,cap:250,maxY:20,initial:10,final:8};
function firm(s,m,{after=false,exit=false,question=false}={}){
 const P0=exit?m.low:m.initial,P1=m.final,q0=(P0-m.b)/(2*m.a),q1=(P1-m.b)/(2*m.a);
 const lo=((m.maxY-m.b)-Math.sqrt((m.maxY-m.b)**2-4*m.a*m.c))/(2*m.a);
 const xs=[...new Set([lo,...Array.from({length:131},(_,i)=>lo+(m.cap-lo)*i/130),q0,q1])].sort((a,b)=>a-b);
 const ss=[series('MK',[0,m.cap*.86,m.cap],[m.b,2*m.a*m.cap*.86+m.b,2*m.a*m.cap+m.b],C.orange,{label:'MK',idx:1}),series('GTK',xs,xs.map(q=>m.a*q+m.b+m.c/q),C.red,{label:'GTK',idx:xs.findIndex(q=>q>=m.cap*.99),pos:'bottom'}),series('P₀ = GO = MO',[0,m.cap*(after?.21:.38),m.cap],[P0,P0,P0],after?C.muted:C.blue,{label:after?'P₀':'P = GO = MO',idx:1,dash:after})];
 if(after)ss.push(series('P₁ = GO = MO',[0,m.cap*.64,m.cap],[P1,P1,P1],C.blue,{label:'P₁ = GO = MO',idx:1,pos:'bottom'}));
 if(!question){const q=after?q1:q0,price=after?P1:P0;ss.push(series('gekozen q',[q,q],[0,price],C.muted,{width:2,dash:true}));ss.push(series('q label',[q],[1.8],C.muted,{label:'q = '+q,idx:0,pos:'right',width:0}));}
 chart(s,ss,{maxX:m.cap,maxY:m.maxY,stepX:m===TG?50:20,xTitle:'q (kg per week)',yTitle:'P, MK en GTK (€ per kg)',tag:'firm',model:{...m,after,exit,question}});
}
function side(s,heading,body,end=''){text(s,heading,1150,235,390,90,35,{bold:true,color:C.blue});text(s,body,1150,360,390,285,34);if(end)text(s,end,1150,686,390,137,32,{bold:true,color:C.green});}

overview('Startopdracht',2);
{
 const s=slide('Economische winst en normale beloning','theory');
 text(s,'Economische winst = TO − TK',60,211,1480,88,52,{bold:true,color:C.blue});
 table(s,[['In TK opgenomen','Na aftrek van TK'],['Alle productiekosten, inclusief normale ondernemersbeloning','Economische winst: extra boven de normale beloning']],60,350,1480,269,[820,660],36);
 text(s,'TO = TK: normale beloning betaald, extra winst nul',60,700,1480,92,43,{bold:true});
 notes(s,'7, 10','Introduceer dit onderscheid hier. De normale vergoeding voor werk en eigen geld zit al in TK. Economische winst is het restant. Laat leerlingen bij opgave 2 de zin over de normale vergoeding terugzoeken. De doelen: de aanpassing verklaren, beide grafieken tekenen en nulwinst berekenen én interpreteren.','Welk bedrag ontvangt de ondernemer al vóór we economische winst berekenen?','Nul economische winst betekent niet nul omzet of gratis werken.','Stel vast wanneer het aantal bedrijven kan veranderen.',false);
}
{
 const s=slide('Korte en lange termijn','theory');
 table(s,[['Korte termijn','Lange termijn'],['Aantal bedrijven kan zich nog niet aanpassen','Bedrijven kunnen toe- of uittreden']],60,224,1480,241,[740,740],38);
 text(s,'Aannames voor ons langetermijnmodel',60,523,1480,60,38,{bold:true,color:C.blue});
 text(s,'Vrije toe- en uittreding\nDezelfde, onveranderde kosten per bedrijf\nGelijkblijvende marktvraag, technologie en inputprijzen',60,620,1480,178,36);
 notes(s,'7–10','Het onderscheid gaat over aanpassingsmogelijkheden, niet een vast aantal maanden. Voor nulwinst moet de normale beloning in de kosten zitten. We werken met prijsnemende ondernemingen en dezelfde techniek voor nieuwkomers en bestaande bedrijven.','Wat kan op lange termijn veranderen dat deze week nog vastligt?','Toetreding maakt niet vanzelf de kostencurve van één bedrijf goedkoper.','Gebruik een eigen markt om de aanpassing te volgen.',false);
}
{
 const s=slide('Cellulosekorrels: één prijsnemend bedrijf');
 table(s,[['Gegeven','Onderwijsmodel'],['Beginprijs','P = € 11 per kg'],['Totale kosten','TK = 0,10q² + q + 90'],['Productie en capaciteit','q in kg per week, maximaal 80 kg'],['Kosten en lange termijn','Inclusief normale beloning; minimum GTK = € 7 bij q = 30']],60,210,1480,479,[535,945],34);
 text(s,'Vrije toe- en uittreding. Vraag en kosten blijven gelijk.',60,742,1480,65,35,{bold:true});
 notes(s,'7–10','Afzonderlijk uitlegvoorbeeld. Alle geproduceerde kg worden verkocht. Kg zijn deelbaar. Houd steeds één week als periode. Minimum GTK is gegeven, zoals in de doelopgave. Laat dit minimum niet zonder uitleg zelf differentiëren.','Welke gegevens gaan over één onderneming?','Dit zijn geen getallen van een toegewezen boekopgave.','Fris de marginale keuze uit Boek 3 op.');
}
{
 const s=slide('De beginproductie bepalen');
 lines(s,['TK = 0,10q² + q + 90     ⇒     MK = 0,20q + 1','MO = P = 11     ⇒     11 = 0,20q + 1','10 = 0,20q     ⇒     q = 50 kg per week','50 ≤ 80; MK stijgt door MO heen'],{gap:140});
 notes(s,'7–10','Herhaal de methode uit Boek 3 §3.2.2 p. 63 en §3.2.3 p. 70: verdubbel de coefficient van q², neem de coefficient van q over, de constante verdwijnt uit MK. Bij 40 is MK 9 < MO 11, bij 60 is MK 13 > MO 11. De winst stijgt vóór 50 en daalt erna. q=50 is haalbaar.','Waarom is 90 wel in TK maar niet in MK nodig?','MO=MK zonder capaciteits- en richtingscontrole is onvoldoende.','Bereken wat bij deze productie overblijft.');
}
{
 const s=slide('De economische winst bij de beginprijs');
 lines(s,['TO = 11 × 50 = € 550 per week','TK = 0,10 × 50² + 50 + 90 = € 390 per week','Economische winst = 550 − 390 = € 160 per week','GTK = 390 / 50 = € 7,80 per kg'],{gap:141,size:42});
 notes(s,'7–10','Controleer de kwadratische term: 0,10×2500=250. Bij q=0 is het verlies 90, als die kosten deze week onvermijdbaar zijn. Produceren is hier beter. P=11 ligt boven GTK=7,80. De normale beloning is al betaald binnen TK.','Is de 160 euro de normale vergoeding of extra winst?','De constante term blijft in TK staan.','Bekijk waarom deze extra winst nieuwe bedrijven aantrekt.');
}
{
 const s=slide('De markt vóór toetreding');market(s);side(s,'Beginpunt E₀','P = € 11 per kg\nQ = 40.000 kg\nper week','Q: alle bedrijven samen');
 notes(s,'8','Nieuw geconstrueerde markt: V: P=15−0,10Q en A₀: P=1+0,25Q, met Q in duizend kg per week. Evenwicht Q=40, P=11. Deze prijs wordt door het kleine bedrijf overgenomen.','Waar lees je de prijs af die het bedrijf ontvangt?','De horizontale as is duizenden kg, niet q van één bedrijf.','Voeg het grotere aanbod bij dezelfde vraag toe.');
}
{
 const s=slide('Toetreding vergroot het marktaanbod');market(s,{after:true});side(s,'Overwinst trekt\nbedrijven aan','A₁ ligt rechts\nvan A₀.\n\nP daalt: 11 → 7\nQ stijgt: 40 → 80','Q: × 1.000 kg\nper week');
 notes(s,'8, 10','Nieuwe bedrijven bieden bij elke prijs meer aan. V blijft staan. De voorbeeldlijn A₁: P=1+0,075Q geeft E₁ bij Q=80 en P=7. De marktcurven tellen individuele aanbiedingen horizontaal op: bij N identieke actieve bedrijven is P=1+(200/N)Q. Toetreding verlaagt de helling; het prijsintercept blijft 1, hetzelfde als bij MK. Laat bij P=11 zien dat A₁ rechts van A₀ ligt. Door meer aanbod daalt de marktprijs, waardoor overwinst kleiner wordt.','Welke lijn verschuift en welke lijn blijft staan?','Prijsdaling is een beweging langs V, geen verschuiving van V.','Volg dezelfde prijsverandering bij één bedrijf.');
}
{
 const s=slide('Eén bedrijf bij de beginprijs');firm(s,EX);side(s,'P₀ = € 11 per kg','MO = MK\nq = 50 kg\nper week\n\nP₀ > GTK','Economische winst:\n€ 160 per week');
 notes(s,'8, 10','De verticale as geeft bedragen per kg. De horizontale MO-lijn kruist stijgende MK bij 50. GTK bij 50 is 7,80, lager dan de prijs. De kostencurven horen bij onze vaste TK-functie.','Waarom is de prijslijn horizontaal?','De individuele onderneming is prijsnemer; dit is niet de marktvraag.','Verlaag nu de prijslijn, met dezelfde kosten en assen.');
}
{
 const s=slide('Meer bedrijven, minder productie per bedrijf');firm(s,EX,{after:true});side(s,'P₁ = € 7 per kg','7 = 0,20q + 1\nq = 30 kg\nper week\n\nMK en GTK blijven.','Markt Q stijgt.\nBedrijfs-q daalt.');
 notes(s,'8, 10','Teken alleen de nieuwe prijslijn lager. De ongewijzigde MK geeft q=30. GTK bereikt daar zijn gegeven minimum 7. Samen produceren meer bedrijven 80.000 kg, terwijl één bedrijf minder produceert. De marktgrootheden zijn een continu onderwijsmodel; het precieze gehele aantal bedrijven is geen gevraagde uitkomst.','Waarom verschuift GTK niet als er bedrijven bijkomen?','Meer marktaanbod betekent niet dat ieder bedrijf meer maakt.','Controleer de nulwinst met totale bedragen.');
}
{
 const s=slide('Het langetermijnevenwicht controleren');
 lines(s,['P = MO = MK = minimum GTK = € 7 per kg','TO = 7 × 30 = € 210 per week','TK = 0,10 × 30² + 30 + 90 = € 210 per week','Economische winst = € 0; normale beloning in TK'],{gap:141,size:41});
 notes(s,'10','De gegeven minimum- GTK-uitkomst combineert de marginale keuze met volledige kostendekking. TO en TK zijn beide positief. Onder de aannames ontbreekt een prikkel voor verdere toetreding vanwege extra winst.','Waarom trekt deze uitkomst geen nieuwe bedrijven aan voor overwinst?','Nulwinst is niet nul opbrengst. Buiten de genoemde aannames volgt nulwinst niet vanzelf.','Herstart hetzelfde kostenmodel vanuit een verliesprijs.');
}
{
 const s=slide('Een andere beginsituatie: aanhoudend verlies');
 lines(s,['Dezelfde TK; nu P = € 5 per kg','5 = 0,20q + 1     ⇒     q = 20 kg per week','TO = 5 × 20 = 100; TK = 40 + 20 + 90 = 150','Economisch verlies = € 50 per week'],{gap:140,size:42});
 notes(s,'9','Expliciete scenariowissel: dit is een alternatieve beginmarkt, niet de volgende stap na evenwicht. Kosten blijven gelijk. q=20 past in capaciteit en MK stijgt door MO. Bij aanhoudend verlies treden op lange termijn sommige bedrijven uit. Deze week is stoppen niet automatisch beter: bij onvermijdbare 90 is verlies bij q=0 groter.','Wat verandert er op langere termijn als verlies aanhoudt?','Economisch verlies is zonder extra informatie geen opdracht om vandaag stil te leggen.','Laat de verandering van het totale aanbod zien.');
}
{
 const s=slide('Uittreding verkleint het marktaanbod');market(s,{exit:true,after:true});side(s,'Een deel stopt','A₁ ligt links\nvan A₀.\n\nP stijgt: 5 → 7\nQ daalt: 100 → 80','Q: × 1.000 kg\nper week');
 notes(s,'9','Alternatief begin: A₀ P=1+0,04Q en dezelfde V P=15−0,10Q. E₀ ligt bij Q=100 en P=5. Uittreding geeft A₁ P=1+0,075Q; E₁ Q=80, P=7. Het aanbod bij iedere prijs neemt af. Niet alle bedrijven verdwijnen.','Waarom kan de prijs stijgen zonder een grotere vraag?','Vraag blijft gelijk; het aantal aanbieders neemt af.','Volg de hogere prijs bij een overblijvend bedrijf.');
}
{
 const s=slide('Een overblijvend bedrijf produceert meer');firm(s,EX,{after:true,exit:true});side(s,'P stijgt: 5 → 7','q stijgt: 20 → 30\nkg per week\n\nTO = TK = € 210\nper week','Minder bedrijven,\nmeer q per blijver');
 notes(s,'9–10','De lagere oude prijs gaf q=20. De nieuwe prijs geeft q=30. De kostenfunctie en minimum GTK veranderen niet. Nulwinst is hetzelfde eindpunt als bij toetreding, benaderd vanuit de andere richting.','Wat daalt op marktniveau terwijl q per blijver stijgt?','Verschuif niet automatisch MK of GTK door uittreding.','Controleer de betekenis en ga dan naar het basiswerk.');
}
{
 const s=slide('Controle: wat betekent nul economische winst?','theory');
 text(s,'Een bedrijf heeft TO = TK.',60,230,1480,70,45,{bold:true,color:C.blue});
 text(s,'“De omzet is nul en de ondernemer krijgt niets.”',60,375,1480,137,49,{bold:true});
 text(s,'Welke twee fouten staan in deze uitspraak?',60,608,1480,88,41);
 notes(s,'7, 10','Laat leerlingen eerst zonder antwoord praten. TO en TK kunnen gelijke positieve bedragen zijn, zoals 210 en 210 in ons uitlegvoorbeeld. Normale beloning zit al in TK. Laat hen vervolgens hun eerste antwoord op startopgave 2 opnieuw bekijken en verbeteren, vóór het basiswerk.','Waar zit de normale ondernemersbeloning in het model?','Winst is een verschil van totalen. Een nul voor het verschil maakt niet beide totalen nul.','Laat hetzelfde lesoverzicht staan tijdens oefenen.',false);
}
overview('Zelfstandig werken',4);
{
 const s=slide('Opgave 7 · Standaard koffiebonen','target');
 text(s,'Alle bedrijven: TK = 0,02q² + 4q + 200',60,207,1480,76,47,{bold:true,color:C.blue});
 table(s,[['Gegeven','Brongegevens'],['Productie en capaciteit','q in kg per week; maximaal 250 kg'],['Totale kosten','Inclusief € 120 normale ondernemersbeloning per week'],['Marktvoorwaarden','Vrije toetreding; marktvraag, technologie en inputprijzen blijven gelijk'],['Minimum GTK','€ 8 per kg bij q = 100 kg per week']],60,324,1480,458,[490,990],34);
 notes(s,'14','Volledige oorspronkelijke context en gegevens van doelopgave 7. Bespreek pas na de eigen poging. De volgende dia’s tonen de beide grafiekpanelen en alle deelvragen zonder oplossingen. Minimum GTK is brongegeven, geen onthuld antwoord van onszelf.','Welke gegevens betreffen alle bedrijven?','De normale beloning moet niet nog eens bij TK worden opgeteld.','Toon de originele marktgegevens als bewerkbare grafiek.',false);
}
{
 const s=slide('Opgave 7 · De marktgrafiek','target');market(s,{target:true,question:true});side(s,'De hele markt','Q is × 1.000 kg\nper week.\n\nP is € per kg.','Bron: figuur 7\nop pagina 14');
 notes(s,'14','Bewaar de oorspronkelijke schaal en lijnen uit figuur 7: V van (0,16) naar (40,0), A van (0,4) naar (40,20). Er is nog geen nieuwe A₁ of oplossing zichtbaar. Er staan geen extra evenwichtsmarkeringen of hulplijnen op deze vragendia. Beperk de interpretatie tot de relevante prijzen 8–10. De bron tekent A door tot P20; met 100 aanvankelijk actieve identieke bedrijven en capaciteit250 kg per bedrijf geldt de stijgende aanbodtak slechts tot Q25 duizend en P14. Boven die grens is de doorgetrokken bronlijn geen haalbaar aanbod. De gevraagde evenwichten liggen wel binnen de capaciteit.','Welke prijs hoort bij het bestaande marktevenwicht?','Q is duizend kg. De firma-as op de volgende dia gebruikt kg.','Toon de bijbehorende onderneming zonder oplossingslijnen.',false);
}
{
 const s=slide('Opgave 7 · De ondernemingsgrafiek','target');firm(s,TG,{question:true});side(s,'Eén onderneming','q is kg per week.\n\nP, MK en GTK\nzijn € per kg.','Dezelfde marktprijs\nals links in het boek');
 notes(s,'14','Reconstructie van het tweede oorspronkelijke grafiekpaneel met native XY-series: MK=0,04q+4, GTK=0,02q+4+200/q en de bestaande prijslijn. Geen nieuwe prijslijn of gekozen-q-hulplijn toegevoegd. Assen 0–250 en 0–20 behouden. GTK is niet gedefinieerd bij q=0; zichtbaar vanaf de bovenrand.','Welke curven horen bij de onveranderde kostenfunctie?','Een prijsnemer kiest niet zelf een andere prijs.','Maak eerst alle deelvragen beschikbaar.',false);
}
{
 const s=slide('Opgave 7 · Deelvragen a, b en c','target');
 lines(s,['a. (3p) Lees de beginprijs af. Stel MK op, bepaal q en bereken de economische winst van één bedrijf.','b. (2p) Leg uit waarom er bedrijven toetreden en hoe dit de prijs beïnvloedt.','c. (2p) Teken in de marktgrafiek een passende A₁ voor de langetermijnprijs. Teken rechts de bijbehorende P = GO = MO-lijn. Laat de kostencurven staan.'],{top:211,gap:199,size:36});
 notes(s,'14','Alle deelvragen worden onverkort aangeboden vóór de oplossingen. Dit zijn a–c. De grafiekpanelen staan op de twee voorafgaande dia’s en in het boek.','Welke grootheid kies je eerst bij deelvraag a?','Een berekening van alleen q beantwoordt a niet volledig.','Toon ook d en e voordat een antwoord wordt onthuld.',false);
}
{
 const s=slide('Opgave 7 · Deelvragen d en e','target');
 text(s,'d. (3p) Bepaal de langetermijnprijs en q. Bereken TO en TK en controleer de economische winst.',60,220,1480,168,40);
 rule(s,60,454,1480);
 text(s,'e. (2p) Een leerling zegt: “Met nul winst verdient de ondernemer niets en is de omzet verdwenen.” Weerleg beide delen met de gegevens.',60,523,1480,236,40);
 notes(s,'14','Nu zijn alle vijf deelvragen zichtbaar geweest zonder oplossingen. Laat leerlingen hun eigen berekeningen en tekeningen erbij pakken. Deelvraag e vraagt twee weerleggingen met brongetallen.','Welke twee gegevens heb je nodig voor e?','Een algemene zin over nulwinst mist de gevraagde toepassing.','Begin de bespreking met de beginprijs en productie.',false);
}
{
 const s=slide('Opgave 7a · Beginprijs en productie','target');
 lines(s,['Afgelezen: P = € 10 per kg','TK = 0,02q² + 4q + 200     ⇒     MK = 0,04q + 4','MO = MK: 10 = 0,04q + 4     ⇒     q = 150 kg/week','150 ≤ 250; MK stijgt door MO heen'],{gap:139,size:41});
 notes(s,'14','Lees de prijs bij het snijpunt van V en A. Differentieer term voor term. Los 6=0,04q op. Bij 100 is MK 8<10, bij 200 is MK 12>10. De maximumkandidaat is haalbaar. Het constante bedrag 200 verdwijnt alleen uit MK.','Waar komt de 10 in MO=MK vandaan?','De vraaglijn van de hele markt is niet de marginale opbrengstlijn van het kleine bedrijf.','Bereken opbrengst, kosten en winst bij 150.',false);
}
{
 const s=slide('Opgave 7a · Economische winst','target');
 lines(s,['TO = 10 × 150 = € 1.500 per week','TK = 0,02 × 150² + 4 × 150 + 200','TK = 450 + 600 + 200 = € 1.250 per week','Economische winst = 1.500 − 1.250 = € 250/week'],{gap:139,size:42});
 notes(s,'14','Volledige substitutie en tussenstappen uit antwoord 7a. Bij q=0 zijn de vaste kosten 200 en is de winst −200 als deze onvermijdbaar zijn; 150 produceren is hier beter. De 120 normale beloning zit al in de totale kosten 1250.','Moet je de 120 normale beloning nogmaals aftrekken?','Dubbel aftrekken geeft een verkeerde economische winst.','Verklaar wat deze overwinst met de markt doet.',false);
}
{
 const s=slide('Opgave 7b · Waarom daalt de prijs?','target');
 table(s,[['Stap','Redenering'],['€ 250 overwinst per bedrijf','Dezelfde techniek is aantrekkelijk voor nieuwkomers.'],['Vrije toetreding','Meer bedrijven bieden bij elke prijs samen meer aan.'],['Marktvraag blijft gelijk','Het grotere aanbod verlaagt de marktprijs.']],60,229,1480,481,[525,955],35);
 notes(s,'14','Noem prikkel, mogelijkheid en marktgevolg: overwinst lokt nieuwkomers, vrije toetreding maakt dit mogelijk, aanbod bij iedere prijs stijgt, waardoor de prijs langs de gelijkblijvende vraag daalt.','Welke bronvoorwaarde maakt toetreding mogelijk?','Niet alleen zeggen dat concurrentie stijgt; leg het aanbod en de prijs uit.','Teken de passende nieuwe aanbodlijn.',false);
}
{
 const s=slide('Opgave 7c · Het nieuwe marktaanbod','target');market(s,{target:true,after:true});side(s,'A₁ rechts van A₀','V blijft staan.\nA₁ snijdt V\nbij P = € 8/kg.\n\nQ = 20.000 kg\nper week','Een passende A₁;\nde lijn is niet uniek.');
 notes(s,'14','Een passend antwoord is A₁: P=4+0,20Q, met Q in duizend kg. V geeft bij P8 de hoeveelheid20. Dit is een gekozen passende lijn, niet een extra formulegegeven uit de opgave. Ze ligt rechts van A₀ bij relevante prijzen boven4. De opgave eist een passende lijn door het langetermijnevenwicht, niet deze unieke helling. Interpreteer de oude A₀ niet voorbij de gezamenlijke capaciteit Q25 duizend bij P14; de bron tekent die lijn daar zonder capaciteitsknik door. De besproken evenwichten zijn haalbaar.','Welke eis bepaalt het nieuwe snijpunt?','Marktvraag en kostencurven verschuiven niet.','Neem dezelfde prijs over in de onderneming.',false);
}
{
 const s=slide('Opgave 7c · De nieuwe prijslijn','target');firm(s,TG,{after:true});side(s,'P = GO = MO = 8','MK en GTK blijven\nop hun plaats.\n\nBij minimum GTK:\nq = 100 kg/week','Markt Q stijgt,\nfirmaproductie q daalt.');
 notes(s,'14','Teken P=GO=MO horizontaal op8. Bij q100 vallen P, MK en minimum GTK samen. De gegeven technologie en inputprijzen houden de kosten gelijk. De oude prijs10 blijft als stippellijn ter vergelijking.','Waarom teken je geen nieuwe GTK?','Meer marktaanbod betekent hier een kleinere q per bedrijf.','Controleer de langetermijnuitkomst in euro per week.',false);
}
{
 const s=slide('Opgave 7d · Nul economische winst controleren','target');
 lines(s,['P = minimum GTK = € 8 per kg','8 = 0,04q + 4     ⇒     q = 100 kg/week ≤ 250','TO = 8 × 100 = € 800 per week','TK = 0,02 × 100² + 4 × 100 + 200 = € 800/week','Economische winst = TO − TK = € 0 per week'],{top:196,gap:123,size:40});
 notes(s,'14','Gegeven minimum GTK bepaalt de prijs8. De marginale vergelijking bevestigt q100. TK bevat200+400+200=800. MO kruist stijgende MK en de capaciteit wordt niet overschreden. Controleer TO=TK. Onder de bronvoorwaarden is de extra winst verdwenen.','Waarom blijft bij de nieuwe prijs geen overwinst over?','P=8 is euro per kg, TO=800 is euro per week.','Weerleg nu beide delen van de uitspraak.',false);
}
{
 const s=slide('Opgave 7e · Beloning en omzet blijven bestaan','target');
 table(s,[['Uitspraak','Weerlegging met de gegevens'],['“De ondernemer verdient niets.”','TK bevat € 120 normale ondernemersbeloning per week.'],['“De omzet is verdwenen.”','TO = € 800 per week. Alleen TO − TK is nul.']],60,227,1480,387,[650,830],36);
 text(s,'Nul economische winst: geen extra winst boven normale beloning',60,701,1480,107,42,{bold:true,color:C.blue});
 notes(s,'14','Beantwoord beide delen afzonderlijk. 120 euro zit in de kosten800. Omzet is de opbrengst800. Nul economische winst is niet hetzelfde als nul ondernemersinkomen. Laat leerlingen één ontbrekende onderbouwing of eenheid in hun eigen werk verbeteren.','Welk brongetal weerlegt welk deel van de uitspraak?','Tel 120 niet boven op de berekende nul economische winst als nieuwe winst.','Keer terug naar het overzicht voor afsluiting en huiswerk.',false);
}
overview('Afsluiting / huiswerk',7);
await fs.writeFile(path.join(BUILD,'slides.json'),JSON.stringify({slides,overviews,tables,charts,graphs},null,2));
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const draft=path.join(BUILD,'candidate.pptx');await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);execFileSync(PYTHON,[path.join(TOOLS,'straight-scatter.py'),draft]);
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,'4.1.1 '+title+' – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(n=>['--require-native-table-slide',String(n)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:slides.length,overviews,finalPath:result.finalPath,integrity:result.packageIntegrity.status,layout:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
