// HOW TO ADAPT: read the current paragraph and answers, then change the shared
// overview, authored example and target sequence together. Runtime paths come
// from the installed presentation skill; the manifest pins the second edition.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Presentation,PresentationFile,finalizePresentation,applyPresentationChartFont,
  PYTHON,SKILL,TOOLS,workspace} from '../../presentations/runtime.mjs';
const provenance=JSON.parse(await fs.readFile(new URL('./presentation-134.tweede-editie-2026.manifest.json',import.meta.url),'utf8'));
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('134');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial',tables=[],charts=[],slides=[],graphSpecs=[],overviewSlides=[];
const source='https://github.com/meijer1973/4veco-lessen/blob/'+provenance.sourceCommit+'/'+provenance.sourceEdition.split('/').map(encodeURIComponent).join('/')+'/';
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,65),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(title,{target=false,authored=false}={}){
 const s=p.slides.add();s.background.fill=C.paper;text(s,title,60,42,1480,87,51,{bold:true});rule(s,60,146,1480);
 text(s,authored?'Uitlegvoorbeeld — niet uit het boek':target?'§1.3.4 Gemengde opgaven · Opgave 37 · Boekpagina 120–121':'§1.3.4 Gemengde opgaven · Boek 1, tweede editie 2026',60,848,1390,30,21,{color:C.muted,name:'footer'});
 text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted,name:'slide-number'});
 slides.push({number:p.slides.items.length,title,role:target?'target':authored?'authored-teaching':'recall-or-overview'});return s;
}
function notes(s,page,explanation,question,pitfall,transition,{authored=false,extra=''}={}){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 1, tweede editie 2026, gedrukte boekpagina ${page}. ${source}boek/Boek_1_Compleet_Tweede_editie.pdf\n${authored?'Uitlegvoorbeeld — niet uit het boek. Context en getallen vouwkrukjes zijn voor deze presentatie gemaakt. De boekpagina’s onderbouwen alleen de methode.':'Manuscript en antwoordmodel: '+source+'bronnen/H3/Antwoorden.md'}\n${extra}`);
}
function table(s,values,x,y,w,h,widths,size=33){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){const cell=t.getCell(r,c);cell.fill=r===0?C.ink:r%2?C.paper:C.pale;cell.text.style={typeface:FONT,fontSize:size,color:r===0?C.paper:C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};}}
 tables.push(p.slides.items.length);return t;
}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda,\nschrift, pen en rekenmachine.',
 'Maak de startopdracht.',
 'Korte herhaling en aanpak.',
 'Werk verder aan de gemengde opgaven,\nstel vragen en kijk je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.',
 'Bespreken van opgave 37.',
 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=slide('Deze les: §1.3.4 Gemengde opgaven');overviewSlides.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1450,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,340,404,468,608,698,768],hs=[82,49,50,108,76,53,53];
 route.forEach((r,i)=>{const col=active===i+1?C.blue:C.ink;text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color:col,name:'route-number-'+(i+1)});text(s,r,116,ys[i],791,hs[i],30,{bold:active===i+1,color:col,name:'route-'+(i+1)});});
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});
 text(s,'Bronnen kiezen. Evenwichten\nberekenen en tekenen.\nVeranderingen onderbouwen.',972,244,565,130,31,{name:'overview-goals'});
 rule(s,972,380,568);text(s,'Startopdracht',972,407,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 118 · Opgave 34\nBij twijfel: herneem p. 87–88',972,461,565,93,30,{bold:active===2,name:'overview-start'});
 rule(s,972,572,568);text(s,'Huiswerk',972,598,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§1.3.4 · Opgaven 34–38\nGemengd: 34–36 · Doel: 37\nTerugblik: 38 · Geen bonus\nPagina 118–122\nMaken en nakijken',972,657,565,179,30,{bold:active===7,name:'overview-homework'});
 notes(s,'118–122',`Laat deze dia staan tijdens ${phase.toLowerCase()}. Start is de eerste echte opgave, 34 op p.118. Gemengd 34–36 op p.118–119, doeloefening 37 met bronnen op p.120 en vragen op p.121, terugblik 38 op p.122. Er is geen afzonderlijk basisblok en geen bonus. Huiswerk is alle opgaven 34, 35, 36, 37 en 38 maken en nakijken. Opgave 37 is representatief omdat zij vier bronnen combineert en alle centrale marktvaardigheden vraagt. Plan deze volledige route over voldoende werkmomenten; afronden als huiswerk mag, een bewezen lesduur is er niet. Start 34 haalt eerder onderwezen q-invulling, techniekfactor en één-aanbiederbegrenzing op (p.86–89). Geef bij twijfel p.87–88 als steun, niet het antwoord. Bij terugkeer vóór het zelfstandig werk laat je leerlingen hun bronkeuze bij 34 kort controleren. Bij 38: per eenheid p.13 en 17, percentage/index p.14 en 16, oppervlakte p.28. Het extra bedrag moet bij het extra aantal horen; de hoogte van een vorm is een afstand. Geen nieuwe kosten- of surplusbegrippen.`,active===2?'Beschrijft opgave 34 één maker of de hele markt?':'Welke bron en functie horen bij jouw volgende vraag?','Een juiste rekenuitkomst bewijst nog niet dat de bron of de betekenis klopt.',active===7?'Laat alle vijf opgaven in de agenda noteren.':'Ga door zodra leerlingen klaar zijn voor de volgende fase.');return s;
}
overview('Startopdracht',2);
{
 const s=slide('De vraag bepaalt je aanpak');
 table(s,[['Wat vraagt de opgave?','Aanpak'],['Hoeveel bij deze prijs?','De gegeven prijs invullen in de juiste functie.'],['Waar passen marktpartijen bij elkaar?','Qᵥ = Qₐ oplossen en beide functies controleren.'],['Wat verandert er?','Eerst de factor, dan vergelijken bij dezelfde prijs.'],['Hoeveel wordt verkocht?','Vraag, aanbod én de afspraak over handel gebruiken.']],60,215,1480,493,[630,850],33);
 text(s,'Grafiek: twee punten per lijn, (Q; P), assen en eenheden.',60,755,1480,65,35,{bold:true,color:C.blue});
 notes(s,'87–88, 98–102, 110–111, 118–119','Koppel de tabel aan de lesdoelen. Leerlingen kiezen de bron en situatie, voeren de berekening uit en onderbouwen de betekenis. Een individuele aanbodfunctie geeft geen marktevenwicht zonder de andere marktkant. Voor een tekening haal je twee geldige punten uit elke formule en kies je assen met gelijke afstanden. Evenwicht betekent gelijke plannen bij één prijs. De eerder onderwezen algebra en grafiekmethode worden hier kort opgehaald.','Welke informatie heb je extra nodig voor een evenwicht?','Alleen een prijswaarneming vertelt niet welke lijn verschoof. Een aanbodplan is geen automatische verkoop.','Pas de aanpak toe op een afzonderlijk uitlegvoorbeeld.');
}
{
 const s=slide('Vouwkrukjes: de oorspronkelijke markt',{authored:true});
 text(s,'Qᵥ = 72 − 4P      Qₐ,₀ = 8P − 24',60,190,1480,65,43,{bold:true,color:C.blue});
 text(s,'Q: krukjes per week · P: euro per krukje\nVraag: 0 ≤ P ≤ 18 · Aanbod: 3 ≤ P ≤ 18',60,275,1480,94,30);
 text(s,'72 − 4P = 8P − 24\n72 = 12P − 24\n96 = 12P\nP₀ = € 8 per krukje',60,415,745,260,43,{bold:true});
 text(s,'Controle met beide functies',885,415,650,50,33,{bold:true,color:C.green});
 text(s,'Qᵥ = 72 − 4 × 8 = 40\nQₐ,₀ = 8 × 8 − 24 = 40',885,495,650,151,36);
 text(s,'Q₀ = 40 krukjes per week',60,741,1480,62,43,{bold:true,color:C.blue});
 notes(s,'98 en 101','Uitlegvoorbeeld — niet uit het boek. Veel kleine kopers en verkopers, één soort krukje, aanpasbare prijs en geen andere veranderingen. We vergelijken plannen op de hele markt. Tel aan beide kanten 4P op, vervolgens 24, en deel beide kanten door 12. Controleer Q in beide functies. P=8 past binnen beide domeinen.','Waarom moet je bij evenwicht beide plannen gebruiken?','De individuele q uit opgave 34 is een andere actoromvang dan dit markttotaal Q.','Verander nu alleen de techniek.',{authored:true});
}
{
 const s=slide('Betere techniek: eerst dezelfde prijs',{authored:true});
 text(s,'Nieuw aanbod: Qₐ,₁ = 8P − 12   (1,5 ≤ P ≤ 18)',60,194,1480,68,41,{bold:true,color:C.orange});
 text(s,'De vraag en de overige omstandigheden blijven gelijk.',60,283,1480,59,35);
 table(s,[['Bij de oude P = € 8','Berekening','Krukjes per week'],['Oud aanbod','8 × 8 − 24','40'],['Nieuw aanbod','8 × 8 − 12','52'],['Ongewijzigde vraag','72 − 4 × 8','40']],60,381,1480,339,[550,465,465],33);
 text(s,'A verschuift naar rechts. Aanbodoverschot: 52 − 40 = 12.',60,753,1480,69,37,{bold:true,color:C.orange});
 notes(s,'88, 100 en 110–111','De techniek maakt bij dezelfde prijs 12 extra krukjes aanbieden mogelijk. Verkopers concurreren om kopers: bij een aanpasbare prijs ontstaat neerwaartse druk. De gegeven vraagfunctie blijft geldig. We hebben de nieuwe evenwichtsprijs nog niet uitgerekend. Deze eigen gegevens behoren niet bij tentenopgave 36.','Waarom vergelijk je eerst bij € 8?','Een verschuiving van A en een latere beweging langs V zijn verschillende stappen.','Los de gelijkheid met het nieuwe aanbod op.',{authored:true});
}
{
 const s=slide('Het nieuwe evenwicht gebruikt de nieuwe functie',{authored:true});
 text(s,'72 − 4P = 8P − 12\n84 = 12P\nP₁ = € 7 per krukje',60,217,860,203,47,{bold:true});
 text(s,'Qᵥ = 72 − 4 × 7 = 44\nQₐ,₁ = 8 × 7 − 12 = 44',60,489,1480,142,41);
 text(s,'Q₁ = 44 krukjes per week',60,683,1480,60,42,{bold:true,color:C.blue});
 text(s,'De lagere prijs geeft een beweging langs V.',60,770,1480,56,35,{bold:true,color:C.green});
 notes(s,'98, 110–111; herhaling procenten p.14','Tel 4P en 12 op aan beide kanten, deel door 12. Beide functies geven 44. Prijs daalt en verhandelde hoeveelheid stijgt. Vraagfunctie en voorkeuren bleven gelijk, dus de reactie van kopers is een beweging langs V. Korte mondelinge check: prijsverandering is (7−8)/8 × 100% = −12,5%, hoeveelheid (44−40)/40 × 100% = +10%. Dit herhaalt de bekende procentenregel; gebruik voor elke grootheid haar eigen oude waarde. Dit zijn eigen uitleggegevens, geen antwoord op een toegewezen boekopgave.','Welke oude waarde hoort onder de deelstreep als je Q vergelijkt?','Gebruik het oude aanbod niet opnieuw om het nieuwe evenwicht te vinden.','Keer terug naar het overzicht en laat het gemengde werk zelfstandig maken.',{authored:true});
}
overview('Zelfstandig werken',4);
{
 const s=slide('Opgave 37: de linnen boodschappentas',{target:true});
 text(s,'Bron A · De oorspronkelijke markt',60,190,1480,64,41,{bold:true,color:C.blue});
 text(s,'Eén soort linnen boodschappentas. Veel kleine kopers en verkopers.\nDe prijs kan zich aanpassen.',60,292,1480,123,37);
 text(s,'Qᵥ = 180 − 10P       (0 ≤ P ≤ 18)\nQₐ,₀ = 10P − 20      (2 ≤ P ≤ 18)',60,469,1480,151,45,{bold:true});
 text(s,'Q: tassen per week · P: euro per tas',60,670,1480,61,36);
 text(s,'Vier bronnen met lesmodelgegevens. Niet alle informatie is nodig.',60,778,1480,49,30,{color:C.muted});
 notes(s,'120','Dit is de werkelijke doeloefening. Laat eigen werk erbij houden. Toon eerst alle vier bronnen en daarna alle zes deelvragen. Hier staan dezelfde marktafbakening, functies, domeinen en eenheden als in bron A. Alle gegevens zijn voor het lesmodel gemaakt; geen gemeten echte markt.','Welke bron beschrijft de beginsituatie?','Breng niet de vouwkrukjesfuncties uit het uitlegvoorbeeld mee.','Lees bron B zonder al uit te rekenen.');
}
{
 const s=slide('Bron B: linnen wordt duurder',{target:true});
 text(s,'Alleen de prijs van het linnen stijgt.',60,210,1480,75,45,{bold:true,color:C.orange});
 text(s,'De koopplannen van consumenten veranderen niet.',60,319,1480,75,38);
 text(s,'Voortaan geldt voor de aanbieders:',60,449,1480,59,36);
 text(s,'Qₐ,₁ = 10P − 60       (6 ≤ P ≤ 18)',60,548,1480,80,46,{bold:true});
 text(s,'Deze nieuwe situatie begint vanuit bron A.\nEr is geen andere vraag- of aanbodverandering.',60,713,1480,105,35);
 notes(s,'120','Behoud het scenario uit de bron. Linnen is een productiemiddel. De prijsverandering van linnen en die van een tas zijn verschillende prijzen. Geef de richting en de berekening nog niet prijs.','Welke omstandigheid verandert volgens deze bron?','De vraagfunctie verandert niet omdat de marktprijs later reageert.','Lees vervolgens de afzonderlijke prijsvergelijking.');
}
{
 const s=slide('Bron C: een afzonderlijke prijsvergelijking',{target:true});
 text(s,'Nieuwe situatie uit bron B · Verkoopprijs € 14',60,209,1480,80,43,{bold:true,color:C.blue});
 text(s,'Zolang deze prijs geldt, vindt iedere koper die volgens de\nvraagfunctie wil kopen een verkoper.',60,349,1480,137,38);
 text(s,'Er zijn geen andere belemmeringen.',60,541,1480,65,38);
 text(s,'Dit is een rekenvergelijking bij één prijs,\ngeen wettelijke prijsregel.',60,693,1480,108,37,{bold:true});
 notes(s,'120','Deze bron vraagt een afzonderlijke berekening bij 14 euro met de nieuwe aanbodfunctie. Ze beschrijft geen maximum- of minimumprijsbeleid. De transactieregel is essentieel voor de werkelijke verkoop. Geef nog geen getallen voor hoeveelheden.','Welke afspraak maakt de bron over kopers en verkopers?','Een gegeven prijs is niet automatisch de evenwichtsprijs.','Lees de uitspraak in bron D.');
}
{
 const s=slide('Bron D: een uitspraak',{target:true});
 text(s,'Een verkoper beweert:',60,196,1480,62,37,{bold:true,color:C.blue});
 text(s,'“Door de hogere marktprijs is de vraaglijn naar links\nverschoven. Het nieuwe evenwicht laat bovendien\nzien dat iedereen tevreden is.”',60,294,1480,237,44,{bold:true});
 text(s,'De vormgeving van de tassen kreeg in een enquête 4,6 uit 5 punten.\nDie beoordeling veranderde niet.',60,586,1480,126,36);
 text(s,'Schrijf bij elke berekening de situatie. Onderbouw conclusies met de bron.',60,769,1480,64,31);
 notes(s,'120','Toon de volledige uitspraak, inclusief beide afzonderlijk te beoordelen claims en de enquêtewaardering. De laatste zin herhaalt de werkinstructie van de bronpagina. Opgave 37 gebruikt de vier bronnen samen.','Hoeveel verschillende claims doet de verkoper?','De enquêtewaardering is nog geen bewijs over de marktuitkomst.','Toon nu alle deelvragen zonder oplossingen.');
}
const questions=[
 ['a','Bereken uit bron A de evenwichtsprijs en -hoeveelheid. Controleer de hoeveelheid met beide functies.'],
 ['b','Leg uit welke lijn door bron B verschuift en waarom. Bereken het nieuwe aanbod bij de oude evenwichtsprijs en vergelijk dit met de ongewijzigde vraag.'],
 ['c','Bereken het nieuwe evenwicht en controleer. Bereken de procentuele verandering van prijs én verhandelde hoeveelheid ten opzichte van bron A.'],
 ['d','Teken zelf V, A₀ en A₁ in één marktgrafiek. Geef assen, eenheden en schaal. Markeer E₀ en E₁ met coördinaten en hulplijnen. Laat ook een verschuiving bij de oude prijs en de beweging langs de ongewijzigde lijn zien.'],
 ['e','Gebruik nu uitsluitend de situatie van bron C. Bereken de vraag, het nieuwe aanbod, het type en de omvang van het overschot en de werkelijke verkoop volgens de gegeven afspraak.'],
 ['f','Beoordeel beide delen van de uitspraak in bron D. Gebruik je berekening en het model. Noem ook één gegeven uit bron D dat niet nodig was om de evenwichten te berekenen.']
];
function wrapQuestion(q){let lines=[],line='';for(const word of q.split(' ')){if((line+' '+word).trim().length>78){lines.push(line);line=word;}else line=(line+' '+word).trim();}lines.push(line);return lines.join('\n');}
for(let i=0;i<3;i++){
 const pair=questions.slice(i*2,i*2+2),s=slide(`Opgave 37: vragen ${pair[0][0]} en ${pair[1][0]}`,{target:true});
 text(s,'Gebruik bronnen A–D · Tassen per week en euro per tas',60,189,1480,57,33,{bold:true,color:C.blue});
 pair.forEach(([letter,q],j)=>{const y=j===0?291:538;text(s,letter+')',60,y,77,63,40,{bold:true,color:C.blue});text(s,wrapQuestion(q),157,y,1383,j===0?202:258,36);});
 notes(s,'121','De volledige deelvragen zijn overgenomen. Laat leerlingen bij hun eigen werk aanwijzen welke bron en situatie ze voor elke deelvraag gebruikten. Alle zes vragen staan vóór de eerste uitwerking.','Welke bron of afspraak heb je bij deze deelvraag nodig?','Een resultaat zonder de gevraagde controle, grafiek of redenering dekt de vraag niet.',i<2?'Bekijk ook de volgende twee deelvragen.':'Begin nu pas met de gezamenlijke uitwerking van a.');
}
{
 const s=slide('37a: het oorspronkelijke evenwicht',{target:true});
 text(s,'Bron A · Qᵥ = Qₐ,₀',60,190,1480,62,36,{bold:true,color:C.blue});
 text(s,'180 − 10P = 10P − 20\n180 = 20P − 20\n200 = 20P\nP₀ = € 10 per tas',60,292,830,279,47,{bold:true});
 text(s,'+10P aan beide kanten\n+20 aan beide kanten\nDelen door 20',1000,349,520,181,32,{color:C.muted});
 text(s,'Qᵥ = 180 − 10 × 10 = 80\nQₐ,₀ = 10 × 10 − 20 = 80',60,631,1480,132,40);
 text(s,'Q₀ = 80 tassen per week · Beide plannen passen bij € 10.',60,780,1480,53,34,{bold:true,color:C.blue});
 notes(s,'120–121','Bron A geeft de oude functies. Beide substituties zijn nodig, niet alleen eenmaal Q berekenen. P=10 valt binnen beide domeinen. Een evenwicht is één marktprijs en één transactiehoeveelheid.','Welke berekening is de controle?','80 gevraagd en 80 aangeboden zijn dezelfde 80 tassen, geen 160 transacties.','Houd de oude prijs vast en bekijk het nieuwe aanbod.');
}
{
 const s=slide('37b: duurdere linnenproductie',{target:true});
 text(s,'A verschuift naar links: minder aanbod bij dezelfde prijs.',60,204,1480,89,40,{bold:true,color:C.orange});
 table(s,[['Bij de oude P = € 10','Berekening','Tassen per week'],['Nieuw aanbod, bron B','10 × 10 − 60','40'],['Vraag blijft gelijk','180 − 10 × 10','80']],60,369,1480,293,[565,480,435],34);
 text(s,'Vraagoverschot: 80 − 40 = 40 tassen per week.',60,714,1480,83,40,{bold:true,color:C.blue});
 notes(s,'120–121','Linnen is een productiemiddel. De hogere linnenprijs verlaagt de verkoopplannen bij eenzelfde tasprijs. Aanbod is links verschoven. Vraagfunctie blijft gelijk. Bij 10 euro is nieuw aanbod 40 tegenover 80 gevraagde tassen; opwaartse prijsdruk. Onderscheid de factor, het aanvankelijke tekort en de daaropvolgende prijsreactie.','Welke twee plannen vergelijk je bij € 10?','De tasprijsstijging is de reactie; zij is niet de factor die A naar links verschuift.','Bereken het nieuwe snijpunt met Qₐ,₁.');
}
{
 const s=slide('37c: het nieuwe evenwicht',{target:true});
 text(s,'Bron B · Ongewijzigde vraag en nieuw aanbod',60,190,1480,62,36,{bold:true,color:C.blue});
 text(s,'180 − 10P = 10P − 60\n180 = 20P − 60\n240 = 20P\nP₁ = € 12 per tas',60,296,900,279,47,{bold:true});
 text(s,'+10P\n+60\nDelen door 20',1080,353,400,170,33,{color:C.muted});
 text(s,'Qᵥ = 180 − 10 × 12 = 60\nQₐ,₁ = 10 × 12 − 60 = 60',60,634,1480,134,40);
 text(s,'Q₁ = 60 tassen per week · Controle: beide plannen zijn gelijk.',60,781,1480,52,34,{bold:true,color:C.blue});
 notes(s,'120–121','Gebruik uitsluitend de nieuwe aanbodfunctie samen met de ongewijzigde vraagfunctie. Beide substituties geven 60. P=12 is geldig voor de beide gebruikte functies. De prijsstijging past bij het vraagoverschot uit b.','Waarom past het oude aanbod niet meer bij deze situatie?','Een gelijkheid met een verouderde functie vindt het oude snijpunt terug.','Vergelijk prijs en hoeveelheid met hun eigen oorspronkelijke waarde.');
}
{
 const s=slide('37c: procentuele veranderingen',{target:true});
 table(s,[['Grootheid','Oud, bron A','Nieuw, bron B'],['P (€ per tas)','10','12'],['Q (tassen per week)','80','60']],60,206,1480,273,[690,395,395],35);
 text(s,'Prijs: (12 − 10) / 10 × 100% = +20%',60,556,1480,77,45,{bold:true,color:C.orange});
 text(s,'Hoeveelheid: (60 − 80) / 80 × 100% = −25%',60,682,1480,81,45,{bold:true,color:C.blue});
 notes(s,'120–121; methode p.14','Prijs stijgt 20% ten opzichte van de oude 10 euro. De verhandelde hoeveelheid daalt 25% ten opzichte van de oude 80 tassen. Dezelfde rekenvorm, een andere noemer voor elke grootheid. Controleer de tekens: prijs omhoog, hoeveelheid omlaag.','Waarom is de noemer bij Q niet 60?','De twee procentuele veranderingen hoeven niet even groot te zijn.','Vertaal de drie functies naar tekenpunten.');
}
{
 const s=slide('37d: tekenpunten uit de functies',{target:true});
 table(s,[['Lijn','Punt bij Q = 0','Tweede geldig punt'],['V: Qᵥ = 180 − 10P','(0; 18)','(180; 0)'],['A₀: Qₐ,₀ = 10P − 20','(0; 2)','(160; 18)'],['A₁: Qₐ,₁ = 10P − 60','(0; 6)','(120; 18)']],60,235,1480,390,[660,410,410],35);
 text(s,'Horizontaal: Q, tassen per week · Verticaal: P, euro per tas',60,683,1480,78,36,{bold:true,color:C.blue});
 text(s,'Coördinaten: (Q; P). De lijnstukken blijven binnen de gegeven domeinen.',60,782,1480,47,30);
 notes(s,'120–121; tekenmethode p.101','Werk één punt hardop uit: voor V geeft Q=0 de vergelijking 0=180−10P en P=18. Voor A₀ geeft Q=0: 10P−20=0 en P=2. Voor A₁ wordt P=6. Vul P=18 in A₀ en A₁ voor de andere punten. Voor V geeft P=0 de hoeveelheid 180. Gebruik Q 0–180 en P 0–18, stapgrootten 20 tassen en 2 euro.','Waarom hoort (0; 6) bij A₁ en niet (6; 0)?','Negatief aanbod buiten het opgegeven domein teken je niet.','Teken eerst de oorspronkelijke markt.');
}
function series(name,x,y,color,width=4,label=null){return {name,xValues:x,values:y,line:{fill:color,width},marker:{symbol:'none'},...(label?{dataLabelOverrides:[{idx:x.length-1,text:label,position:'r',showValue:false,textStyle:{typeface:FONT,fontSize:29,fill:color,bold:true}}]}:{})};}
function label(name,x,y,color){return {...series(name,[x],[y],color,0,name),line:{fill:'none',width:0}};}
function graph(s,changed){
 const ss=[series('V',[0,180],[18,0],C.blue),series('A₀',[0,160],[2,18],changed?'#748590':C.green)];
 if(changed)ss.push(series('A₁',[0,120],[6,18],C.orange));
 ss.push(label('V',154,3.6,C.blue),label('A₀',137,14.5,changed?C.muted:C.green));
 if(changed)ss.push(label('A₁',108,15.2,C.orange));
 const point=(name,q,pr,color)=>{ss.push({...series(name,[q],[pr],color,0),marker:{symbol:'circle',size:10}});};
 ss.push({...series('Hulplijnen E₀',[0,80,80],[10,10,0],C.muted,1.8),line:{fill:C.muted,width:1.8,style:'dashed'}});point('E₀',80,10,C.ink);ss.push(label('E₀',84,8.0,C.ink));
 if(changed){
  ss.push({...series('Hulplijnen E₁',[0,60,60],[12,12,0],C.muted,1.8),line:{fill:C.muted,width:1.8,style:'dashed'}});point('E₁',60,12,C.orange);ss.push(label('E₁',57,14.2,C.orange));
  ss.push(series('Verschuiving bij P = 10',[80,40],[10,10],C.orange,4),series('Pijlpunt verschuiving',[44,40,44],[10.3,10,9.7],C.orange,3));
  // This arrow lies on V; its head is constructed in data coordinates.
  ss.push(series('Beweging langs V',[80,60],[10,12],C.blue,5),series('Pijlpunt beweging',[67,60,62],[11.8,12,11.2],C.blue,3));
 }
 const ax={textStyle:{typeface:FONT,fontSize:25,fill:C.ink},line:{fill:C.ink,width:1.5},numberFormatCode:'0'};
 const ch=s.charts.add('scatter',{position:{left:46,top:220,width:1105,height:608},series:ss,scatterOptions:{style:'lineWithMarkers'},hasLegend:false,dataLabels:{showValue:false,textStyle:{typeface:FONT,fontSize:29,fill:C.ink}},xAxis:{...ax,min:0,max:180,majorUnit:20,title:{text:'Q (tassen per week)',textStyle:{typeface:FONT,fontSize:26,fill:C.ink}}},yAxis:{...ax,min:0,max:18,majorUnit:2,title:{text:'P (€ per tas)',textStyle:{typeface:FONT,fontSize:26,fill:C.ink}},majorGridlines:{fill:C.line,width:1}},chartFill:C.paper,plotAreaFill:C.paper});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);graphSpecs.push({slide:p.slides.items.length,changed,series:ss});
}
{
 const s=slide('37d: de oorspronkelijke markt',{target:true});graph(s,false);
 text(s,'E₀ = (80; 10)',1188,245,345,110,40,{bold:true,color:C.blue});
 text(s,'V en A₀ snijden\nelkaar bij\n€ 10 per tas.\n\n80 tassen\nper week.',1188,398,345,320,34);
 notes(s,'120–121','Deze eerste grafiek toont alleen V, A₀ en E₀. Controleer de prijsasintercepten 18 en 2 en de nulhoeveelheid. Twee punten bepalen elk rechte lijnstuk. E₀=(80;10) ligt op beide functies, en de hulplijnen komen uit op 80 en 10.','Welke hulplijn lees je af voor de prijs?','Coördinaten staan in de volgorde hoeveelheid, prijs.','Voeg A₁ en het nieuwe evenwicht op dezelfde assen toe.');
}
{
 const s=slide('37d: verschuiving en beweging',{target:true});graph(s,true);
 text(s,'A₀ naar A₁',1188,222,345,67,39,{bold:true,color:C.orange});
 text(s,'Bij P = € 10:\n80 naar 40\ntassen aanbod.',1188,307,345,174,34);
 text(s,'Langs V',1188,510,345,64,39,{bold:true,color:C.blue});
 text(s,'E₀ = (80; 10)\nE₁ = (60; 12)',1188,592,345,132,35,{bold:true});
 text(s,'Q daalt als P stijgt.',1188,759,345,60,30);
 notes(s,'120–121','De assen hebben exact dezelfde schaal als op de vorige dia. A₁ begint bij (0;6), snijdt V bij (60;12) en loopt tot (120;18). De horizontale oranje pijl bij 10 euro van 80 naar 40 is de verandering van aanbodplannen bij gelijke prijs. De blauwe pijl van E₀ naar E₁ ligt op de ongewijzigde V en toont de reactie van kopers op de hogere tasprijs. Hulplijnen van beide evenwichten eindigen op hun berekende waarden.','Welke pijl toont de oorzaak en welke de reactie?','De beweging tussen E₀ en E₁ is geen verschuiving van de vraaglijn.','Begin voor deelvraag e afzonderlijk bij de prijs uit bron C.');
}
{
 const s=slide('37e: bron C bij € 14',{target:true});
 table(s,[['Nieuwe situatie bij P = € 14','Berekening','Tassen per week'],['Vraag','180 − 10 × 14','40'],['Nieuw aanbod','10 × 14 − 60','80'],['Aanbodoverschot','80 − 40','40']],60,218,1480,400,[590,470,420],34);
 text(s,'Werkelijke verkoop: 40 tassen per week.',60,688,1480,69,43,{bold:true,color:C.blue});
 text(s,'Volgens bron C vindt iedere koper een verkoper.',60,773,1480,58,36);
 notes(s,'120–121','Dit is geen derde evenwicht. Bij de afzonderlijke prijs 14 gebruiken we de ongewijzigde vraag en het nieuwe aanbod. De 40 is zowel het overschot als de verkoop, maar om verschillende redenen. Het verschil van 80 en 40 bepaalt het overschot. De afspraak dat iedere koper een verkoper vindt bepaalt verkoop 40. De overige 40 verkoopplannen worden niet uitgevoerd; ze zijn niet per definitie al geproduceerde voorraad.','Waarom is de verkoop hier 40 en niet 80?','Aanbod, overschot en verkoop kunnen toevallig gelijke getallen hebben zonder hetzelfde te betekenen.','Beoordeel nu de beide claims met functies en berekeningen.');
}
{
 const s=slide('37f: wat ondersteunen de bronnen?',{target:true});
 text(s,'“De vraaglijn is naar links verschoven.”',60,192,1480,71,41,{bold:true});
 text(s,'Onjuist: Qᵥ blijft 180 − 10P.\nDe prijs stijgt van € 10 naar € 12: langs V van 80 naar 60.',60,291,1480,122,37,{color:C.blue});
 rule(s,60,452,1480);
 text(s,'“Iedereen is tevreden.”',60,489,1480,63,41,{bold:true});
 text(s,'Niet bewezen: bij € 12 passen de plannen voor 60 tassen.\nHet model meet geen algemene tevredenheid.',60,577,1480,113,37,{color:C.blue});
 text(s,'De enquêtewaardering 4,6/5 was niet nodig voor de evenwichten.',60,763,1480,68,35,{bold:true});
 notes(s,'120–121','Beide claims moeten apart worden beoordeeld. De onveranderde vraagfunctie is het bewijs voor beweging langs V. De twee berekende evenwichten bevestigen de reactie van 80 naar 60 tassen. Marktevenwicht betekent dat koop- en verkoopplannen bij die prijs op elkaar passen; het bewijst niet dat behoeften vervuld zijn of dat iedereen de prijs kan betalen. De waardering van de vormgeving 4,6/5 is voor de berekening niet nodig. Laat leerlingen een ontbrekend bewijs in hun eigen antwoord aanvullen.','Welke berekening ondersteunt je oordeel over de eerste claim?','Een positief enquêtecijfer voor vormgeving meet iets anders dan tevredenheid met het marktevenwicht.','Ga terug naar het overzicht en laat het huiswerk vastleggen.');
}
overview('Afsluiting / huiswerk',7);
const manifest={...provenance,slides,overviewSlides,requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:charts,graphSpecs};
await fs.writeFile(path.join(BUILD,'manifest.json'),JSON.stringify(manifest,null,2));
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const draft=path.join(BUILD,'candidate.pptx');await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
execFileSync(PYTHON,[path.join(TOOLS,'straight-scatter.py'),draft]);
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,'1.3.4 Gemengde opgaven – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:SKILL+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:SKILL+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:BUILD+'/validation-final.json'});
console.log(JSON.stringify({slides:slides.length,overviewSlides,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
