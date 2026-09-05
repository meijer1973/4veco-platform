"""Bind the builder's personally observed R6 pages/figures to immutable hashes.

These observations were authored after opening every listed full page/figure;
this script records hashes and checks inventory only. It is not a visual judge.
"""
import importlib.util
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('alt_evidence', HERE/'BOOK2-TEXTBOOK-PRODUCTION-1-212-ALT-evidence.py')
e = importlib.util.module_from_spec(spec)
spec.loader.exec_module(e)

PAGE_NOTES = {
    'paragraaf': [
        'Opening context, four goals, printed prerequisite box and model conditions are readable; footer clear.',
        'TO table and fig1 share a page; complete caption and GO definition fit without clipping.',
        'GO table, conditional explanation and signed-profit table readable; whitespace intentional.',
        'Fig2 dashed TK and solid TO distinguishable; complete caption, misconception box and equality calculation fit.',
        'Fig3 break-even point, zones and unchanged scales legible; full caption adjacent; same-Q explanation readable.',
        'Fig4 30-euro vertical bracket clear, no filled profit area; full caption and continuous/whole-unit paragraph complete.',
        'Whole-unit comparison table and kayak steps1-4 readable; fractional result and neighboring-integer checks preserved.',
        'Kayak steps5-6 and we1 remain together; 16-euro gap, axes, labels, zones and complete caption readable.',
        'Recap and Start1-2 readable; recap model/range reminder remains the inherited nonblocking flag, not silently repaired.',
        'Soap prompts and ex1 full-support graph readable; complete caption and vertical-not-area question fit.',
        'Flowerpot reduced-support source contains axes/TK only; complete caption and dance context readable.',
        'Dance comparison table and unsupported minigolf exercise readable; no answer graph leaks into questions.',
        'Frozen bakery target a-d and 2/2/3/4 points clear; intentional space below, no target answer leakage.',
        'Both equal-height bonus panels readable at placement, scales150/300 and both 30-euro brackets distinct; full caption and retrieval complete.',
    ],
    'opgaven': [
        'Wrapped title and kayak steps1-5/table fit; units, fractional solution and integer checks readable.',
        'Kayak step6, graph and complete caption readable; recap remains on page without collision.',
        'Start1-2 and optional guidance/soap prompts readable; continuation at page boundary has no lost text.',
        'Soap figure/full caption and follow-up visible; flowerpot questions precede source on facing continuation.',
        'Flowerpot TK-only figure and full caption legible; dance table and questions a-b fit.',
        'Dance c-d continuation, minigolf questions and frozen bakery target a-d readable; no answer diagrams.',
        'Bonus scales150/300 and same30-euro gaps legible at smallest placement; full caption and retrieval complete.',
    ],
    'antwoorden': [
        'Answers1-3 readable with units, signed profit, conditional GO and whole-unit checks; no footer collision.',
        'Flowerpot full answer graph and complete caption readable; BE(5,20) and nine-euro vertical gap clear.',
        'Dance answer table and minigolf calculations readable; minigolf partd continues naturally to its graph.',
        'Minigolf full caption and graph clear; bakery exact answer a-d preserves 714/715 checks and points.',
        'Bakery graph/full caption and full 11-point allocation table readable; 200-euro bracket is vertical, no area.',
        'Bonus comparison answer and prior-cost retrieval readable, including units/periods; whitespace intentional.',
    ],
}
FIGURE_NOTES = {
    '2.1.2_fig_1': 'TO-only origin-to(30,150) graph; axes/units/direct label clear, no clipping.',
    '2.1.2_fig_2': 'Same theatre frame with dashed TK intercept60 and solid TO; crossing at20/100 visually clear.',
    '2.1.2_fig_3': 'BE leader/point and left-loss/right-profit labels clear on same axes; no label collisions.',
    '2.1.2_fig_4': 'Same frame plus vertical120-to150 bracket labeled30 euro; no profit-area shading.',
    '2.1.2_we_1': 'Kayak0-6 rentals/day, BE near3.33 and 16-euro gap; complete direct labeling and unclipped bracket.',
    '2.1.2_ex_1': 'Soap0-6 pieces/day, fractional BE and eight-euro gap; dashed/solid functions and labels clear.',
    '2.1.2_ex_2': 'Flowerpot source intentionally contains axes and TK only; no TO/BE/zones/gap answer leakage.',
    '2.1.2_ex_3': 'Flowerpot answer contains TO, BE(5,20), zones and nine-euro gap; labels legible.',
    '2.1.2_ex_4': 'Minigolf0-20 visitors/day, fractional BE and20-euro vertical gap; readable unclipped axes.',
    '2.1.2_ex_5': 'Bakery0-1000 broden/month; BE near714.29, TK500 intercept and200-euro vertical gap; labels unclipped.',
    '2.1.2_ex_6': 'Stacked equal-height panels show vertical scales150/300; both30-euro brackets and all labels clear.',
}
GRAY_NOTES = {
    'paragraaf': 'At p5, dashed TK and solid TO remain distinguishable through crossing; BE, zones and caption readable without colour.',
    'opgaven': 'At p7, smallest placed bonus panels retain distinct dashed TK and solid TO, both30-euro brackets and150/300 scale labels.',
    'antwoorden': 'At p5, bakery curves, BE and200-euro bracket remain distinct; full caption and11-point table readable without colour.',
}

build=json.loads((HERE/(e.PREFIX+'build-r6.json')).read_text(encoding='utf-8'))
pages=[]
for doc in build['documents']:
    kind=Path(doc['source_md']).stem.split(' – ')[-1]
    proof=Path(doc['proof_directory'])
    manifest=json.loads((proof/'manifest.json').read_text(encoding='utf-8'))
    assert len(PAGE_NOTES[kind])==len(manifest['rendered_pages'])
    for number,(relative,note) in enumerate(zip(manifest['rendered_pages'],PAGE_NOTES[kind]),1):
        pages.append({'edition':kind,'page':number,'path':str(proof/relative),'sha256':e.b.digest(proof/relative),'personally_opened':True,'observation':note})
figures=[{'asset':name,'path':str(e.FOLDER/'_assets'/(name+'.png')),'sha256':e.b.digest(e.FOLDER/'_assets'/(name+'.png')),'personally_opened':True,'observation':note} for name,note in FIGURE_NOTES.items()]
gray=json.loads((HERE/(e.PREFIX+'grayscale-r6.json')).read_text(encoding='utf-8'))['captures']
for capture in gray:
    assert e.b.digest(Path(capture['path']))==capture['sha256']
    capture.update({'personally_opened':True,'observation':GRAY_NOTES[capture['edition']]})
assert len(pages)==27 and len(figures)==11 and len(gray)==3
e.save('builder-inspection-r6',{
    'inspector':'paragraph_212_alt_builder',
    'role':'BUILDER_SELF_INSPECTION_ONLY',
    'date':'2026-09-05',
    'method':'Each final full page and standalone PNG opened using view_image; own native pdftoppm grayscale captures also opened. Not contact-sheet-only inspection.',
    'display_note':'PNG originals requested; tool display resized2000x1260 figures slightly and3000x1660 bonus to2048x1133. Final placed bonus reviewed on full pages too.',
    'result':'No new visible defect observed; unchanged inherited recap/model-range flag retained.',
    'pages':pages,'figures':figures,'own_grayscale':gray,
    'minimum_body_and_footer_pt':12.0,
    'minimum_placed_figure_pt':12.548030598958333,
    'full_captions':'All full words/punctuation retained mechanically and complete captions personally inspected at placement.',
    'timing':'54/67/77 minutes remain design estimates, unobserved.',
    'acceptance':'Independent paragraph review, distinct specialist QC and root acceptance PENDING; canonical review/quality/handoff and native PENDING fields untouched.',
})
