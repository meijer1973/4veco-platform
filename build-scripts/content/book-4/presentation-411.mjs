// HOW TO ADAPT: keep the classroom sequence and shared overview. Re-derive the
// source assignment, printed pages, authored model and native chart series for
// another paragraph. Runtime locations are supplied through environment vars.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation, applyPresentationChartFont,
  PYTHON, SKILL, TOOLS, PLATFORM, workspace} from '../../presentations/runtime.mjs';
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('411');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',purple:'#7B2D8E',red:'#A93232',muted:'#445B6B',line:'#C6D2DB',pale:'#EFF4F7'};
const FONT='Arial', title='Toetreding, uittreding en langetermijnevenwicht';
const lessonCommit='0356afb6cac2dd43adbe9f63b872aaf423efc914';
const base=`https://github.com/meijer1973/4veco-lessen/blob/${lessonCommit}/edities/books34-v3/books/`;
const lessonRoot=path.resolve(PLATFORM,'../4veco-lessen/edities/books34-v3/books');
const tables=[],charts=[],slides=[],overviewSlides=[],graphContracts=[];
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,65),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(t,footer='§4.1.1 · Hoe lang blijft de winst?'){
 const s=p.slides.add();s.background.fill='#FFFFFF';
 text(s,t,60,40,1480,92,48,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1400,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,848,70,30,21,{color:C.muted,align:'right',name:'slide-number'});
 slides.push({number:p.slides.items.length,title:t});return s;
}
function notes(s,page,explanation,question,pitfall,transition,{example=false,extra=''}={}){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 4, editie books34-v3, gedrukte complete-boekpagina ${page}. ${base}book-4/output/Boek_4_Compleet_v3.pdf\nManuscript en antwoordmodel: ${base}book-4/chapters/4.1/4.1.1%20manuscript.md en ${base}book-4/chapters/4.1/Antwoorden.md\n${example?'Uitlegvoorbeeld — niet uit het boek. Vezelkorrels: eigen context en gegevens; de boekpagina onderbouwt uitsluitend de methode. ':''}${extra}`);
}
function table(s,values,x,y,w,h,widths,size=32){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});
 t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){
  const cell=t.getCell(r,c);cell.fill=r===0?C.ink:(r%2?'#FFFFFF':C.pale);
  cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};
 }}tables.push(p.slides.items.length);return t;
}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.',
 'Maak de startopdracht.',
 'Uitleg bij de lesdoelen.',
 'Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.',
 'Bespreken van de doelopgave: opgave 7.',
 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=slide('Deze les: §4.1.1 Hoe lang blijft de winst?');overviewSlides.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,107,1470,38,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,180,835,45,35,{bold:true});
 const ys=[239,330,384,438,623,704,767],hs=[82,47,47,181,74,55,56];
 route.forEach((r,i)=>{const col=active===i+1?C.blue:C.ink;
  text(s,`${i+1}.`,60,ys[i],48,hs[i],30,{bold:true,color:col,name:'route-number-'+i});
  text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color:col,name:'route-'+i});
 });
 text(s,'Lesdoelen',972,180,565,45,35,{bold:true});
 text(s,'Toe- en uittreding verklaren.\nMarkt Q en bedrijfs-q tekenen.\nNulwinst berekenen en uitleggen.',972,239,568,119,30,{name:'overview-goals'});rule(s,972,370,568);
 text(s,'Startopdracht',972,392,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 11 · Opgaven 1 en 2\n2: verkennen met theorie p. 7',972,445,568,86,30,{bold:active===2,name:'overview-start'});rule(s,972,551,568);
 text(s,'Huiswerk',972,572,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§4.1.1 Hoe lang blijft de winst?\nBasis: 3 en 4\nZelfstandig: 5 en 6\nDoelopgave: 7\nMaken en nakijken',972,631,568,197,30,{bold:active===7,name:'overview-homework'});
 notes(s,'7, 11–14',`Laat de dia staan tijdens ${phase.toLowerCase()}. Start: 1 en 2 op p. 11. Basis 3 op p. 11 en 4 op p. 12. Zelfstandig 5 en 6 op p. 13. Doel 7 op p. 14. Huiswerk: 3, 4, 5, 6 en 7 maken en nakijken. Bonus 8 en herhaling 9–10 zijn extra. De docentenhandleiding adviseert voorlopig twee lessen van 55 minuten, zonder gemeten tijdsbewijs. Laat huiswerk of een volgende les de route afmaken; schrap geen basiswerk.\n\nStart 1 haalt de firmaberekening op. Geef bij vastlopen de aanpak: TK differentiëren, P = MO met MK vergelijken, capaciteit controleren, TO en TK invullen, GTK = TK/q. Dit is eerder onderwezen in Boek 3 p. 63 en 70–72. Start 2 bevat nieuwe leerstof: normale ondernemersbeloning zit al in TK. Laat leerlingen eerst de afspraak over winst op p. 7 lezen, benoemen welk bedrag in TK zit en een voorlopige uitleg schrijven. Beoordeel deze eerste poging als verkenning. ${active===4?'Keer NU vóór de basisopgaven terug naar start 2: laat leerlingen hun antwoord opnieuw formuleren en de normale beloning in de kosten aanwijzen. Bespreek hun uitleg, geef zo nodig steun.':'Keer vóór de basisopgaven na de uitleg terug naar start 2.'}`,
 'Welke stap lukt al, en waar heb je steun nodig?','Economische winst is een nieuwe interpretatie, geen al beheerste voorkennis.','Laat leerlingen gericht verdergaan met de aangegeven fase.',{extra:`Voorkennis: ${base}book-3/output/Boek_3_Compleet_v3.pdf, gedrukte p. 63, 70–72. Startantwoorden alleen voor feedback na eigen poging: 1a MK=0,20q+2; q=30. 1b TO=240, TK=190, winst=50 euro/week, GTK=6,333… euro/kg. 2a economische winst=0; 2b normale vergoeding=180 euro/week.`});
}
const exLabel='Uitlegvoorbeeld — niet uit het boek';
function exHeading(s,str='Vezelkorrels'){text(s,`${str} · ${exLabel}`,60,178,1480,53,31,{bold:true,color:C.blue});}
function rows(s,items,start=300,gap=135){items.forEach((r,i)=>{text(s,r[0],60,start+i*gap,520,85,35,{bold:true,color:C.blue});text(s,r[1],630,start+i*gap,910,105,39);});}
function series(name,xs,ys,color,opts={}){
 // Native workbook cells retain ten decimals; far below subpixel tolerance.
 const out={name,xValues:xs.map(x=>Number(x.toFixed(10))),values:ys.map(y=>Number(y.toFixed(10))),line:{fill:color,width:opts.width||3.5,...(opts.dashed?{style:'dashed'}:{})},marker:{symbol:opts.point?'circle':'none',size:opts.point?8:3}};
 if(opts.label!==undefined)out.dataLabelOverrides=[{idx:opts.idx??xs.length-1,text:opts.label,position:opts.pos||'top',showValue:false,textStyle:{typeface:FONT,fontSize:24,fill:color,bold:true}}];
 return out;
}
function chart(s,ss,{xMax,yMax,xStep,yStep,xTitle,yTitle,left=60,top=249,width=970,height=550,model}={}){
 const axis=(max,step,title)=>({min:0,max,majorUnit:step,numberFormatCode:'0',title:{text:title,textStyle:{typeface:FONT,fontSize:26,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},line:{fill:C.ink,width:1.5}});
 const ch=s.charts.add('scatter',{position:{left,top,width,height},series:ss,scatterOptions:{style:'line'},hasLegend:false,dataLabels:{showValue:false,showSeriesName:false},xAxis:axis(xMax,xStep,xTitle),yAxis:{...axis(yMax,yStep,yTitle),majorGridlines:{fill:C.line,width:1}},chartFill:'#FFFFFF',plotAreaFill:'#FFFFFF'});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);
 graphContracts.push({slide:p.slides.items.length,model,xMax,yMax,series:ss.map(a=>({name:a.name,x:a.xValues,y:a.values}))});return ch;
}
function guide(q,v,color=C.muted){return series('Hulplijn',[0,q,q],[v,v,0],color,{dashed:true,width:1.5});}
function firm(s,{target=false,prices=[9],chosen=60,showMin=false}={}){
 const a=target?.02:.05,b=target?4:3,c=target?200:45,cap=target?250:100,ym=target?20:16;
 const qs=Array.from({length:cap*2},(_,i)=>(i+1)/2).filter(q=>a*q+b+c/q<=ym);
 const ss=[series('MK',[0,cap],[b,2*a*cap+b],C.green,{label:'MK',pos:'top'}),series('GTK',qs,qs.map(q=>a*q+b+c/q),C.orange,{label:'GTK',idx:qs.length-10,pos:'bottom'})];
 text(s,'Elke prijslijn: P = GO = MO',60,224,970,36,26,{color:C.muted});
 prices.forEach((v,i)=>ss.push(series(i===prices.length-1?'P = GO = MO':'Oude prijs',[0,cap*.85,cap],[v,v,v],i===prices.length-1?C.blue:C.muted,{label:prices.length===1?`P = ${v}`:`P${i===0?'₀':'₁'} = ${v}`,idx:1,pos:prices.length>1&&v===Math.min(...prices)?'bottom':'top',dashed:i<prices.length-1})));
 const price=prices.at(-1);ss.push(guide(chosen,price));
 ss.push(series('Keuze',[chosen],[price],C.ink,{point:true}));
 chart(s,ss,{xMax:cap,yMax:ym,xStep:target?50:20,yStep:target?4:2,xTitle:'q (kg per week)',yTitle:'P, MK en GTK (€ per kg)',model:{kind:'firm',a,b,c,capacity:cap,chosen,price,showMin}});
}
function market(s,{target=false,exit=false,after=false}={}){
 // Q uses thousands of kg. Aggregate supply follows Q = n*(P-b)/(2a)/1000.
 const intercept=target?4:3,d0=target?16:exit?9:15,ds=target?.4:1;
 const slope0=target?.4:exit?.5:1,slope1=target?.2:exit?1:1/3;
 const xmax=target?40:exit?9:15,ymax=target?20:16;
 const q0=(d0-intercept)/(ds+slope0),price0=d0-ds*q0,q1=(d0-intercept)/(ds+slope1),price1=d0-ds*q1;
 const ss=[series('V',[0,d0/ds],[d0,0],C.blue,{label:'V',pos:'top'})];
 const capacity=target?250:100,n0=target?100:exit?200:100,n1=target?200:exit?100:300;
 const max0=Math.min(xmax,(ymax-intercept)/slope0,n0*capacity/1000);
 ss.push(series('A₀',[0,max0],[intercept,intercept+slope0*max0],after?C.muted:C.green,{label:after?'A₀':'A',pos:'top',dashed:after}));
 if(after){const max1=Math.min(xmax,(ymax-intercept)/slope1,n1*capacity/1000);ss.push(series('A₁',[0,max1],[intercept,intercept+slope1*max1],C.orange,{label:'A₁',pos:'top'}));}
 ss.push(guide(q0,price0));if(after)ss.push(guide(q1,price1));
 ss.push(series('E₀',[q0],[price0],C.ink,{point:true,label:after?'E₀':'E',pos:'top'}));
 if(after)ss.push(series('E₁',[q1],[price1],C.ink,{point:true,label:'E₁',pos:'top'}));
 chart(s,ss,{xMax:xmax,yMax:ymax,xStep:target?10:3,yStep:target?4:2,xTitle:'Q (× 1.000 kg per week)',yTitle:'P (€ per kg)',model:{kind:'market',intercept,d0,ds,slope0,slope1,after,q0,price0,q1,price1,firmA:target?.02:.05,n0:target?100:exit?200:100,n1:target?200:exit?100:300}});
}
overview('Startopdracht',2);
{
 const s=slide('Economische winst en normale beloning');
 text(s,'Economische winst = TO − TK',60,235,1480,90,54,{bold:true,color:C.blue});
 table(s,[['In TK opgenomen','Wat daarna overblijft'],['Alle kosten, ook de normale\nbeloning van de ondernemer','Positief: overwinst\nNul: geen extra winst']],60,388,1480,246,[790,690],38);
 text(s,'Nul economische winst: de normale beloning blijft betaald.',60,717,1480,105,42,{bold:true});
 notes(s,'7','Introduceer economische winst expliciet. De normale vergoeding voor arbeid en eigen vermogen van de ondernemer is al een kostenpost. Een positieve rest is overwinst. Bij nul blijft de normale vergoeding bestaan. Laat leerlingen bij start 2 alleen aanwijzen waar zij dit lezen; werk de opgave hier niet uit.','Welke beloning kan er al in de kosten zitten?','TO = TK betekent niet TO = 0 of gratis ondernemerswerk.','Onderzoek met een apart voorbeeld waarom overwinst kan verdwijnen.');
}
{
 const s=slide('Een markt met vrije toetreding');exHeading(s);
 text(s,'Veel identieke prijsnemers verkopen vezelkorrels.',60,270,1480,70,43,{bold:true});
 table(s,[['Gegeven voor één onderneming','Betekenis'],['TK = 0,05q² + 3q + 45','€ per week, inclusief normale beloning'],['q: kg per week; capaciteit: 100 kg','Alle productie wordt verkocht'],['Beginprijs P = € 9 per kg','Vraag en kosten blijven gelijk']],60,372,1480,340,[800,680],32);
 text(s,'Nieuwe bedrijven mogen dezelfde productiemethode gebruiken.',60,757,1480,65,35,{bold:true,color:C.blue});
 notes(s,'7–10','Eigen voorbeeld. In de constante 45 euro zit 30 euro normale ondernemersbeloning. De overige kosten en beloning zijn volledig in TK opgenomen. Er zijn aanvankelijk 100 bedrijven. Vrije toetreding, dezelfde technologie, vaste inputprijzen en ongewijzigde vraag. Deze aannamen blijven in de volgende dia’s gelden.','Wat maakt winst op deze markt aantrekkelijk voor anderen?','Eén prijsnemer bepaalt de marktprijs niet. Toetreding verandert het aantal aanbieders.','Herhaal eerst de keuze van één onderneming.',{example:true});
}
{
 const s=slide('De productie van één prijsnemer');exHeading(s);
 table(s,[['TK-term','Bijdrage aan MK'],['0,05q²','0,10q'],['3q','3'],['45','0']],60,267,640,341,[350,290],36);
 text(s,'MK = 0,10q + 3',785,281,755,63,43,{bold:true,color:C.green});
 text(s,'MO = P = 9\n9 = 0,10q + 3\n6 = 0,10q\nq = 60 kg per week',785,379,755,258,44,{bold:true});
 text(s,'MK stijgt door MO heen. 60 kg past binnen de capaciteit.',60,724,1480,90,38,{bold:true,color:C.blue});
 notes(s,'8–10','Herstel de bekende firmaberekening kort. Verdubbel de coëfficiënt van q², houd de coefficient van q en laat de constante bij het differentiëren weg. Bij q=50 is MK=8<MO=9, bij q=70 is MK=10>MO=9. Dus uitbreiden helpt eerst en schaadt daarna. 60≤100. Bij q=0 is winst −45, zodat produceren beter is.','Waarom blijven de 45 euro wel nodig bij TK?','Een MO/MK-snijpunt is pas bruikbaar na controle van verloop en capaciteit.','Bereken het winstbedrag bij deze q.',{example:true,extra:`Voorkennis met uitleg: Boek 3 p. 63, 70–72. ${base}book-3/output/Boek_3_Compleet_v3.pdf`});
}
{
 const s=slide('Overwinst bij de beginprijs');exHeading(s);firm(s);
 text(s,'Bij q = 60 kg',1070,276,465,55,36,{bold:true});
 text(s,'TO = 9 × 60 = € 540\nTK = 180 + 180 + 45\n     = € 405 per week',1070,371,465,191,31);
 text(s,'Winst = € 135\nper week',1070,622,465,126,43,{bold:true,color:C.orange});
 notes(s,'8–10','Lees q=60 waar de horizontale MO de stijgende MK snijdt. TO=9×60=540. TK=0,05×60²+3×60+45=405. Economische winst=135 euro/week. GTK=405/60=6,75 euro/kg, dus P>GTK. De grafiek is per kg, de bedragen rechts zijn per week.','Welke afstand in de grafiek laat winst per kg zien?','Marginale kosten zijn niet de totale kosten. Trek niet MK van TO af.','Kijk nu naar alle bedrijven samen.',{example:true});
}
{
 const s=slide('De markt vóór toetreding');exHeading(s);market(s);
 text(s,'100 bedrijven',1070,276,465,60,40,{bold:true,color:C.green});
 text(s,'Elk 60 kg per week\n\nQ = 100 × 60\n   = 6.000 kg per week',1070,378,465,244,35);
 text(s,'P = € 9 per kg',1070,705,465,64,41,{bold:true,color:C.blue});
 notes(s,'8','Eigen markt: inverse vraag P=15−Q en aanbod P=3+Q, met Q in duizend kg per week. Hun snijpunt is Q=6, P=9. Dit aanbod is precies de som van 100 identieke ondernemingen met q=10(P−3), op het afgebeelde domein tot 100 kg capaciteit per bedrijf. De zichtbare A is tot Q=10 getekend; grotere hoeveelheden zijn met 100 bedrijven niet uitvoerbaar.','Wat betekent Q=6 op deze as?','De markt-as gebruikt duizenden kg; de bedrijfsas losse kg.','Voeg toetreding toe terwijl de vraag gelijk blijft.',{example:true});
}
{
 const s=slide('Toetreding vergroot het marktaanbod');exHeading(s);market(s,{after:true});
 text(s,'Overwinst lokt\nnieuwe bedrijven',1070,266,465,112,38,{bold:true,color:C.orange});
 text(s,'Bij elke prijs méér aanbod\nA₁ ligt rechts van A₀\n\nP: € 9 naar € 6 per kg\nQ: 6.000 naar 9.000 kg',1070,435,465,270,32);
 text(s,'De vraag blijft gelijk.',1070,757,465,48,31,{bold:true});
 notes(s,'8, 10','Toon eerst de oude lijnen en vervolgens A₁. Bij P=9 stijgt het aangeboden Q van 6 naar 18 duizend kg als het aantal bedrijven van 100 naar 300 gaat. Binnen het getoonde domein zie je bij P=6 de toename van 3 naar 9 duizend kg. Het nieuwe evenwicht is Q=9, P=6. A₁: P=3+Q/3. Het snijpunt volgt door de onveranderde V met A₁ te combineren. De aanboddraaiing is een rechtsverschuiving: vergelijk horizontaal bij dezelfde prijs.','Waarom verschuift de vraaglijn hier niet?','De lagere prijs is een gevolg van meer aanbieders. De vraaglijn blijft staan; het evenwicht beweegt erlangs.','Neem deze lagere marktprijs over in de ondernemingsgrafiek.',{example:true});
}
{
 const s=slide('Dezelfde lagere prijs bij één onderneming');exHeading(s);firm(s,{prices:[9,6],chosen:30,showMin:true});
 text(s,'P = GO = MO daalt',1070,266,465,95,37,{bold:true,color:C.blue});
 text(s,'6 = 0,10q + 3\nq = 30 kg per week\n\nMK en GTK blijven staan.',1070,410,465,235,36);
 text(s,'Markt Q stijgt.\nBedrijfs-q daalt.',1070,708,465,110,36,{bold:true});
 notes(s,'8, 10','De prijsnemer neemt de lagere marktprijs over. Teken een nieuwe horizontale lijn op 6. Het snijpunt met MK geeft q=30. De kostenfunctie is niet veranderd, dus MK en GTK blijven exact dezelfde curven. Bij deze hoeveelheid is GTK minimaal en gelijk aan 6. Op de markt leveren 300 bedrijven ieder 30 kg: samen 9000 kg.','Hoe kan Q stijgen terwijl q daalt?','Marktaanbod is niet dezelfde curve als MK of GTK van één bedrijf.','Controleer of de overwinst verdwenen is.',{example:true});
}
{
 const s=slide('Het langetermijnevenwicht');exHeading(s);
 text(s,'Gegeven minimum GTK: € 6 per kg bij q = 30',60,266,1480,66,39,{bold:true,color:C.blue});
 rows(s,[['Totale opbrengst','TO = 6 × 30 = € 180 per week'],['Totale kosten','TK = 0,05 × 30² + 3 × 30 + 45\n     = 45 + 90 + 45 = € 180 per week'],['Economische winst','180 − 180 = € 0 per week']],377,133);
 text(s,'P = MO = MK = minimum GTK',60,790,1480,50,39,{bold:true,color:C.orange});
 notes(s,'10','Het minimum GTK is voor dit eigen voorbeeld gegeven, zoals in de doelopgave; leerlingen hoeven geen nieuwe minimumprocedure af te leiden. De gelijke positieve bedragen TO en TK laten nul economische winst zien. De 30 euro normale beloning blijft in de kosten betaald. Met dezelfde techniek levert toetreden nu geen extra winst op.','Waarom stopt het winstmotief voor verdere toetreding?','De omzet verdwijnt niet wanneer de winst nul wordt.','Benoem de voorwaarden waaronder we deze uitkomst mogen gebruiken.',{example:true});
}
{
 const s=slide('Voorwaarden voor nul economische winst');
 table(s,[['Aannamen','Gevolg voor het model'],['Vrije toe- en uittreding','Het aantal bedrijven kan zich aanpassen.'],['Dezelfde, onveranderde kosten','Bestaande en nieuwe bedrijven hebben dezelfde GTK.'],['Vraag en inputprijzen blijven gelijk','De aanpassing komt door het aantal aanbieders.']],60,211,1480,398,[640,840],32);
 text(s,'Korte termijn: aantal bedrijven ligt nog vast.\nLange termijn: bedrijven kunnen toe- of uittreden.',60,670,1480,134,40,{bold:true,color:C.blue});
 notes(s,'7–10','Leg de scope van het model vast. De korte en lange termijn gaan over aanpassingsmogelijkheden, niet over een voorgeschreven aantal maanden. Bij verschillende kosten, toetredingsbarrières of veranderde inputprijzen volgt niet automatisch nul winst voor iedere onderneming.','Welke aanname zorgt dat nieuwe bedrijven hetzelfde kunnen verdienen?','Nulwinst is een uitkomst onder voorwaarden, geen universele wet.','Onderzoek de omgekeerde richting bij aanhoudend verlies.');
}
{
 const s=slide('Aanhoudend verlies');exHeading(s,'Vezelkorrels · een andere beginsituatie');firm(s,{prices:[5],chosen:20});
 text(s,'Dezelfde kosten\nP = € 5 per kg',1070,265,465,112,37,{bold:true});
 text(s,'5 = 0,10q + 3\nq = 20 kg per week\nTO = € 100 per week\nTK = 20 + 60 + 45\n     = € 125 per week',1070,419,465,263,32);
 text(s,'Verlies: € 25 per week',1070,750,465,60,35,{bold:true,color:C.red});
 notes(s,'9','Nieuwe beginsituatie, geen vervolgschok op de vorige markt. Zelfde TK, nu P=5 en 200 actieve bedrijven. Marktvraag is in deze aparte markt P=9−Q (Q in duizend kg); zij blijft gedurende de uittreding gelijk. Het bedrijf kiest q=20 en verliest 25 euro per week. Bij q=0 is het verlies 45 euro, dus onmiddellijke stillegging is in dit voorbeeld slechter.','Waarom bewijst dit verlies niet dat vandaag stoppen beter is?','Economisch verlies is niet automatisch een advies om meteen stil te leggen.','Laat zien hoe minder bedrijven de marktprijs veranderen.',{example:true});
}
{
 const s=slide('Uittreding verkleint het marktaanbod');exHeading(s,'Vezelkorrels · verliesvariant');market(s,{exit:true,after:true});
 text(s,'Aanhoudend verlies\nEen deel treedt uit',1070,266,465,114,37,{bold:true,color:C.red});
 text(s,'Bij elke prijs minder aanbod\nA₁ ligt links van A₀\n\nP: € 5 naar € 6 per kg\nQ: 4.000 naar 3.000 kg',1070,429,465,265,32);
 text(s,'Vraag en kosten blijven gelijk.',1070,757,465,62,31,{bold:true});
 notes(s,'9','De aparte verliesmarkt heeft V: P=9−Q, A₀: P=3+0,5Q (200 bedrijven), A₁: P=3+Q (100 bedrijven). De oude uitkomst is Q=4, P=5, de nieuwe Q=3, P=6. Vergelijk bij P=6: 6 duizend kg aanbod vóór en 3 duizend kg na uittreding. De vraag en de kosten van actieve bedrijven veranderen niet.','Welke kant verschuift A bij dezelfde prijs?','Niet alle bedrijven hoeven te verdwijnen. De overblijvers krijgen een hogere prijs.','Lees de gevolgen voor één overblijvend bedrijf af.',{example:true});
}
{
 const s=slide('Een overblijvend bedrijf produceert meer');exHeading(s,'Vezelkorrels · verliesvariant');firm(s,{prices:[5,6],chosen:30,showMin:true});
 text(s,'q: 20 naar 30 kg',1070,266,465,65,39,{bold:true,color:C.blue});
 text(s,'TO = 6 × 30 = € 180\nTK = 45 + 90 + 45\n     = € 180 per week\n\nEconomische winst = 0',1070,397,465,269,32);
 text(s,'Markt Q daalt.\nBedrijfs-q stijgt.',1070,716,465,103,36,{bold:true});
 notes(s,'9–10','Bij de hogere P=6 snijdt MO de ongewijzigde MK bij q=30. Het verlies verdwijnt: TO=TK=180. Het aantal bedrijven halveert van 200 naar 100, terwijl de overblijvende bedrijven elk meer produceren. Het totale Q daalt van 4000 naar 3000.','Waarom verschuift GTK ook bij uittreding niet?','Minder bedrijven betekent niet minder productie per overblijvend bedrijf.','Controleer het onderscheid tussen markt en onderneming.',{example:true});
}
for(const reveal of [false,true]){
 const s=slide(reveal?'Controle: markt en onderneming':'Korte controle');exHeading(s);
 if(!reveal){text(s,'Na toetreding leveren méér bedrijven samen méér.',60,283,1480,98,45,{bold:true});text(s,'1. Moet elk bedrijf dan ook meer produceren?\n\n2. Is bij nul economische winst de beloning verdwenen?',60,460,1480,266,44);}
 else{table(s,[['Toetreding in ons voorbeeld','Begin','Lange termijn'],['Aantal bedrijven','100','300'],['q per bedrijf (kg per week)','60','30'],['Q voor de markt (kg per week)','6.000','9.000']],60,267,1480,364,[840,320,320],34);text(s,'Normale beloning blijft in TK. Alleen de overwinst verdwijnt.',60,717,1480,99,40,{bold:true,color:C.blue});}
 notes(s,'7–10',reveal?'Q=n×q. De stijging van n kan samengaan met een daling van q. In dit voorbeeld 100×60=6000 en 300×30=9000. De normale beloning van 30 euro blijft onderdeel van TK.':'Laat leerlingen beide vragen eerst mondeling verklaren zonder direct de antwoorden te tonen. Dit is een begripscontrole op het eigen uitlegvoorbeeld, geen extra huiswerk.', 'Welke twee grootheden moet je uit elkaar houden?','Een juist getal zonder verklaring van het aantal bedrijven is nog onvolledig.',reveal?'Ga terug naar start 2 en laat daarna het overzicht staan voor oefenen.':'Bespreek de antwoorden op de volgende dia.',{example:true});
}
overview('Zelfstandig werken',4);
const targetFooter='§4.1.1 · Doelopgave 7 · Boekpagina 14';
{
 const s=slide('Opgave 7 · Standaard koffiebonen',targetFooter);
 text(s,'In deze oefenmarkt gebruiken alle bedrijven:',60,202,1480,60,38);
 text(s,'TK = 0,02q² + 4q + 200',60,289,1480,76,51,{bold:true,color:C.blue});
 table(s,[['Grootheid / voorwaarde','Gegeven'],['q en capaciteit','kg per week; maximaal 250 kg'],['TK bevat alle kosten','Inclusief € 120 normale ondernemersbeloning per week'],['Toetreding is vrij','Marktvraag, technologie en inputprijzen blijven gelijk'],['Minimum GTK','€ 8 per kg bij q = 100']],60,414,1480,369,[640,840],31);
 notes(s,'14','Dit is de volledige context van de echte doeloefening, inclusief normale beloning en alle modelvoorwaarden. Begin deze bespreking na de eigen poging van leerlingen. De volgende dia toont de oorspronkelijke bronfiguur, daarna volgen alle vijf deelvragen zonder uitkomsten.','Welke gegevens begrenzen de conclusie?','De 120 euro is al in TK opgenomen; tel dat bedrag niet opnieuw bij TK op.','Bekijk eerst de gegeven figuur.');
}
{
 const s=slide('Opgave 7 · De gegeven figuur',targetFooter);
 const require=createRequire(path.join(process.env.RUNTIME_NODE_MODULES,'_loader.cjs'));
 const blob=await require('sharp')(path.join(lessonRoot,'book-4/chapters/4.1/_assets/3.2.3_target.svg')).resize(1800,830).png().toBuffer();
 s.images.add({blob,contentType:'image/png',alt:'Oorspronkelijke figuur 7: markt met V en A en één onderneming met MK, GTK en P = GO = MO.',fit:'contain',position:{left:60,top:184,width:1480,height:620}});
 notes(s,'14','Actuele bronfiguur uit het boek, begrensd op de capaciteit van de oorspronkelijke groep bedrijven, met historische assetnaam 3.2.3_target.svg. Alle labels, schalen en gegevens blijven zichtbaar. Links staat Q in duizend kg per week; rechts q in kg per week. Geef hier nog geen oplossingen.','Welke grootheid staat op elke horizontale as?','Een waarde 15 links betekent 15.000 kg, niet 15 kg.','Toon eerst deelvragen a, b en c.');
}
{
 const s=slide('Opgave 7 · Deelvragen a, b en c',targetFooter);
 text(s,'a. (3p) Lees de beginprijs af. Stel MK op, bepaal q en bereken de economische winst van één bedrijf.',60,212,1480,130,39);rule(s,60,376,1480);
 text(s,'b. (2p) Leg uit waarom er bedrijven toetreden en hoe dit de prijs beïnvloedt.',60,419,1480,121,39);rule(s,60,578,1480);
 text(s,'c. (2p) Teken in de marktgrafiek een passende A₁ voor de langetermijnprijs. Teken rechts de bijbehorende P = GO = MO-lijn. Laat de kostencurven staan.',60,622,1480,177,39);
 notes(s,'14','Deelvragen a–c zijn volledig overgenomen uit het huidige manuscript. Wacht met oplossingen tot ook d en e zijn getoond. Leerlingen houden hun eigen poging en de bronfiguur erbij.','Wat vraagt c in de markt en wat bij de onderneming?','De vraag naar een passende lijn geeft geen vrijheid om de gegeven kosten of vraag te veranderen.','Toon ook d en e voordat de uitwerking begint.');
}
{
 const s=slide('Opgave 7 · Deelvragen d en e',targetFooter);
 text(s,'d. (3p) Bepaal de langetermijnprijs en q. Bereken TO en TK en controleer de economische winst.',60,248,1480,149,42);rule(s,60,447,1480);
 text(s,'e. (2p) Een leerling zegt: “Met nul winst verdient de ondernemer niets en is de omzet verdwenen.”\n\nWeerleg beide delen met de gegevens.',60,511,1480,263,42);
 notes(s,'14','Nu zijn de volledige context, oorspronkelijke figuur en alle vijf deelvragen beschikbaar zonder oplossingen. Laat leerlingen zo nodig aanvullen welke stappen hun antwoord nog moet bevatten.','Welke twee beweringen moet je afzonderlijk weerleggen?','Een algemene zin over nul winst beantwoordt e niet volledig zonder omzet en beloning te noemen.','Begin de uitwerking bij de beginprijs en de productie.');
}
{
 const s=slide('Opgave 7a · Prijs en productie',targetFooter);
 rows(s,[['Aflezen uit de figuur','P = € 10 per kg'],['TK differentiëren','MK = 0,04q + 4'],['MO = MK oplossen','10 = 0,04q + 4\n6 = 0,04q  ⇒  q = 150 kg per week']],230,165);
 text(s,'150 ≤ 250 kg. MK stijgt door MO heen.',60,770,1480,64,39,{bold:true,color:C.blue});
 notes(s,'14','De gegeven marktfiguur levert P=10. De afgeleide is MK=0,04q+4. Als prijsnemer heeft het bedrijf MO=10. Invullen geeft q=150. Bij 100 kg is MK=8<10, bij 200 kg is MK=12>10. Capaciteit 250 begrenst dit optimum niet. Dit is economische productie per week, geen markthoeveelheid.','Welke controle maakt het snijpunt hier een maximum?','Gebruik niet het gegeven minimum-GTK-punt voor de beginproductie: eerst MO en MK vergelijken.','Bereken de totale opbrengst en alle kosten.');
}
{
 const s=slide('Opgave 7a · Economische winst',targetFooter);
 rows(s,[['Totale opbrengst','TO = 10 × 150 = € 1.500 per week'],['Totale kosten','TK = 0,02 × 150² + 4 × 150 + 200\n     = 450 + 600 + 200 = € 1.250 per week'],['Economische winst','1.500 − 1.250 = € 250 per week']],228,174);
 text(s,'De € 120 normale ondernemersbeloning zit al in TK.',60,789,1480,50,36,{bold:true,color:C.orange});
 notes(s,'14','Reken met de volledige TK. GTK=1250/150=8,333… euro/kg, lager dan P=10. De 250 euro is boven de normale beloning. Controle met (10−8,333…)×150=250; rond GTK niet eerst af. Bij niet produceren is winst −200, dus produceren is beter.','Waar vind je de normale beloning in deze berekening?','120 euro opnieuw aftrekken zou de beloning dubbel tellen.','Verbind deze overwinst met toetreding.');
}
{
 const s=slide('Opgave 7b · Waarom de prijs daalt',targetFooter);
 rows(s,[['€ 250 overwinst','Nieuwe bedrijven kunnen dezelfde techniek gebruiken.'],['Vrije toetreding','Meer aanbod bij elke prijs.'],['Vraag blijft gelijk','Het nieuwe evenwicht heeft een lagere prijs.']],233,174);
 notes(s,'14','Noem alle causale schakels. Positieve economische winst maakt toetreden aantrekkelijk, en de bron staat dat toe. Identieke techniek en inputprijzen betekenen dezelfde kosten. Meer bedrijven verschuiven het marktaanbod rechts. Bij de gegeven dalende, ongewijzigde vraag daalt de prijs.','Welke bronaanname verbindt de overwinst met nieuwe bedrijven?','Alleen “meer concurrentie” noemen slaat de stap via het marktaanbod over.','Teken dit in de marktgrafiek.');
}
{
 const s=slide('Opgave 7c · Het marktaanbod verschuift',targetFooter);market(s,{target:true,after:true});
 text(s,'Minimum GTK = € 8',1070,221,465,62,36,{bold:true,color:C.blue});
 text(s,'A₁ ligt rechts van A₀\nE₁ ligt op V bij P = 8\n\nQ: 15.000 naar\n     20.000 kg per week',1070,350,465,267,34);
 text(s,'Vraaglijn V blijft staan.',1070,732,465,82,34,{bold:true});
 notes(s,'14','Lees de langetermijnprijs 8 uit het gegeven minimum GTK. Teken A₁ door het punt op V met P=8: Q=20 duizend kg/week. De oorspronkelijke grafiek bevat V: P=16−0,4Q en A₀: P=4+0,4Q. Met MK=0,04q+4 geeft dit 100 bedrijven aanvankelijk. In de eindsituatie zijn 200 bedrijven met q=100 nodig. Hun gezamenlijke aanbod is A₁: P=4+0,2Q, op het getoonde domein binnen capaciteit. Deze afleiding controleert de getekende lijn; leerlingen hoeven het aantal bedrijven niet te berekenen. Bij P=8 neemt aanbod toe van 10.000 naar 20.000 kg. De beginlijn in het boek en deze presentatie eindigt bij de totale capaciteit van 25.000 kg voor de oorspronkelijke 100 bedrijven. Beide benodigde evenwichten liggen eronder. Na toetreding geldt de gezamenlijke capaciteit van de nieuwe groep bedrijven.','Waar op de bestaande vraaglijn moet E₁ liggen?','A₁ parallel verschuiven zou hier bij identieke bedrijven de aggregatie veranderen. Kies de getoonde kosten-consistente lijn.','Neem de prijs 8 over in de rechtergrafiek.');
}
{
 const s=slide('Opgave 7c–d · De onderneming volgt de prijs',targetFooter);firm(s,{target:true,prices:[10,8],chosen:100,showMin:true});
 text(s,'Nieuwe prijslijn\nP = GO = MO = 8',1070,221,465,109,36,{bold:true,color:C.blue});
 text(s,'MK en GTK blijven staan.\n\n8 = 0,04q + 4\nq = 100 kg per week',1070,401,465,242,34);
 text(s,'P = MK = minimum GTK',1070,751,465,68,33,{bold:true});
 notes(s,'14','Teken de nieuwe prijslijn op 8 en laat beide kostencurven ongewijzigd. Het snijpunt geeft 100 kg, tevens het gegeven minimum GTK. Dat is binnen 250 kg capaciteit. De markt groeit naar 20.000 kg, maar de individuele productie daalt van 150 naar 100 kg.','Waarom beweegt de prijslijn wel en de GTK-lijn niet?','Nieuwe bedrijven veranderen hier het marktaanbod, niet de technologie van een bestaand bedrijf.','Controleer de nulwinst met totale bedragen.');
}
{
 const s=slide('Opgave 7d · De nulwinst controleren',targetFooter);
 text(s,'P = € 8 per kg en q = 100 kg per week',60,211,1480,66,41,{bold:true,color:C.blue});
 rows(s,[['Totale opbrengst','TO = 8 × 100 = € 800 per week'],['Totale kosten','TK = 0,02 × 100² + 4 × 100 + 200\n     = 200 + 400 + 200 = € 800 per week'],['Economische winst','800 − 800 = € 0 per week']],332,157);
 text(s,'Controle: GTK = 800 / 100 = € 8 per kg = P',60,796,1480,45,35,{bold:true});
 notes(s,'14','Werk setup, invullen, resultaat en eenheid af. De gelijke totalen bewijzen nul economische winst. GTK=8 komt overeen met het gegeven minimum en de getekende prijslijn.','Welke twee positieve totalen zijn hier gelijk?','Een nul als resultaat betekent niet dat alle andere grootheden nul zijn.','Weerleg beide onderdelen van de uitspraak.');
}
{
 const s=slide('Opgave 7e · Omzet en beloning blijven',targetFooter);
 table(s,[['Bewering','Weerlegging met de gegevens'],['“De ondernemer verdient niets.”','€ 120 normale beloning per week zit in TK.\nDeze beloning wordt nog betaald.'],['“De omzet is verdwenen.”','TO = 8 × 100 = € 800 per week.\nEr worden nog koffiebonen verkocht.']],60,249,1480,364,[655,825],35);
 text(s,'Alleen de extra economische winst is nul.',60,725,1480,87,47,{bold:true,color:C.blue});
 notes(s,'14','Beantwoord beide delen expliciet. De 120 euro normale beloning is een van de kosten die de 800 euro omzet dekt. De ondernemer werkt niet gratis. De omzet bedraagt 800 euro per week en is dus niet verdwenen. Alleen TO−TK is nul. Laat leerlingen hun eigen antwoorden bij a–e verbeteren: formule, eenheid, causaliteit en beide grafieken.','Welk bedrag weerlegt welk deel van de uitspraak?','Normale ondernemersbeloning en economische winst zijn verschillende begrippen.','Laat het overzicht staan voor afsluiting en huiswerk.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'slides.json'),JSON.stringify({slides,overviewSlides,tables,charts,graphContracts},null,2));
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const draft=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
execFileSync(PYTHON,[path.join(TOOLS,'straight-scatter.py'),draft]);
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,`4.1.1 ${title} – presentatie.pptx`),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:[...new Set(charts)],materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation.json')});
console.log(JSON.stringify({finalPath:result.finalPath,slides:slides.length,overviews:overviewSlides,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
