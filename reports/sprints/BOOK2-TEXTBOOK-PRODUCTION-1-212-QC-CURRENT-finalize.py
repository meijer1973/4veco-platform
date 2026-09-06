"""Bind actual personal observations; never infer inspection from rendering.

HOW TO ADAPT: a new reviewer must personally inspect the new outputs, write
their own observations, and use exclusive new paths before binding them.
"""
from pathlib import Path
import argparse
import importlib.util

PREFIX='BOOK2-TEXTBOOK-PRODUCTION-1-212-QC-CURRENT'
spec=importlib.util.spec_from_file_location('qc212',Path(__file__).with_name(PREFIX+'-check.py'))
q=importlib.util.module_from_spec(spec);spec.loader.exec_module(q)

def proofs():
    rows=[]
    for mode in ('full','full-r2','thin','print','rebuild'):
        manifest=q.read(q.E/(mode+'-manifest.json'))
        for doc,count in zip(manifest['documents'],q.COUNTS):
            directory=Path(doc['proof_directory']); p=directory/'manifest.json'; m=q.read(p)
            assert m['inspection_status']=='PENDING' and m['pages_inspected']==[]
            assert len(m['page_sha256'])==count
            for name,h in m['page_sha256'].items(): assert q.raw(directory/'pages'/name)==h
            rows.append({'mode':mode,'path':p.relative_to(q.P).as_posix(),'sha256':q.raw(p),
                'page_count':count,'page_sha256':m['page_sha256'],
                'original_output_parity':mode!='full','inspection_status':'PENDING','pages_inspected':[]})
    assert len(rows)==15 and sum(r['page_count'] for r in rows)==135
    return rows

def personal():
    before=q.preserve()
    pages=q.read(q.E/'personal-page-observations.json');figures=q.read(q.E/'personal-figure-observations.json')
    gray=q.read(q.E/'grayscale-binding.json'); native=q.read(q.E/'full-r2-parity.json')
    assert len(pages['observations'])==len(gray['pages'])==27
    assert len(figures['observations'])==len(gray['figures'])==11
    page_notes={(n['kind'],n['page']):n for n in pages['observations']}
    assert len(page_notes)==27
    for rec in gray['pages']:
        note=page_notes[(rec['kind'],int(Path(rec['original']).stem.split('-')[1]))]
        assert q.raw(q.P/rec['original'])==rec['original_sha256']
        assert q.raw(q.P/rec['gray'])==rec['gray_sha256']
        rec['personal_color_and_grayscale_observation']=note['observation']
    for rec,note in zip(gray['figures'],figures['observations']):
        assert Path(rec['original']).name==note['asset']
        assert q.raw(q.L/rec['original'])==rec['original_sha256']
        assert q.raw(q.P/rec['gray'])==rec['gray_sha256']
        rec['personal_color_and_grayscale_observation']=note['observation']
    q.save('personal-inspection.json',{'actor':q.ACTOR,'role':q.ROLE,'date':'2026-09-06',
        'verdict':'PASS WITH FLAGS','hard_fails_open':0,
        'actual_inspection':'All 27 r20 full color pages and all 27 grayscale conversions personally viewed at normal reading scale; all 11 full native PNGs and their 11 grayscale conversions personally viewed. Observations were authored after actual views, not generated from parity.',
        'display_limit':figures['basis'],'actual_views':76,
        'platform_base':q.PBASE,'lesson_base':q.LBASE,
        'canonical_review_sha256':q.raw(q.D/'2.1.2-review.md'),
        'generator_sha256':q.raw(q.P/q.GEN),'platform_inputs':before['platform_inputs'],
        'native34':native['native34'],'documents':native['documents'],
        'all_color_and_grayscale_pages':gray['pages'],'all_color_and_grayscale_figures':gray['figures'],
        'observation_file_hashes':{n:q.raw(q.E/n) for n in ('personal-page-observations.json','personal-figure-observations.json','grayscale-binding.json')},
        'all_new_immutable_native_pending_manifests':proofs(),
        'flags':['212-R5-TIME: 54/67/77 unobserved','212-R5-RECAP: model qualification taught in body, not repeated in recap','212-QC-INSPECTIE-FRESHNESS: optional current framework mapping omitted'],
        'root_validation':'PENDING','root_acceptance':'PENDING','handoff_renewal':'PENDING','production_ready':False})

def final():
    before=q.preserve(allow_qc=True)
    qc=(q.D/'2.1.2-quality-ref.yaml').read_bytes()
    old=q.blob(q.LBASE,(q.REL/'2.1.2-quality-ref.yaml').as_posix(),q.L)
    assert qc.split(b'partA:',1)[0]==old.split(b'partA:',1)[0]
    assert b'\ncompanion:' not in qc and b'\ncompanion:' not in old
    personal=q.read(q.E/'personal-inspection.json'); rows=proofs()
    assert rows==personal['all_new_immutable_native_pending_manifests']
    for name,h in personal['observation_file_hashes'].items(): assert q.raw(q.E/name)==h
    for doc in personal['documents']:
        assert q.raw(q.P/doc['manifest_path'])==doc['manifest_sha256']
    evidence={p.relative_to(q.E).as_posix():q.raw(p) for p in sorted(q.E.rglob('*')) if p.is_file()}
    q.save('final-integrity.json',{'pass':True,'actor':q.ACTOR,'role':q.ROLE,
       'qc_sha256':q.raw(q.D/'2.1.2-quality-ref.yaml'),
       'canonical_review_sha256':q.raw(q.D/'2.1.2-review.md'),
       'unchanged_handoff_sha256':q.raw(q.D/'2.1.2-textbook-handoff.md'),
       'historical212files_byte_exact':len(before['historical212files']),
       'other_original_lesson_files_byte_exact':len(before['all_initial_lesson_files'])-1,
       'native_files_original_byte_exact':34,'folder_count':40,
       'all_new_pending_manifests':rows,'passing_new_manifests':12,'passing_new_pages':108,
       'failed_r19_preserved_manifests':3,'failed_r19_preserved_pages':27,
       'evidence_raw_hashes':evidence,'root_validation':'PENDING','root_acceptance':'PENDING',
       'handoff_renewal':'PENDING','production_ready':False})

if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('mode',choices=['personal','post-qc-gates','final']);a=p.parse_args()
    if a.mode=='personal':personal()
    elif a.mode=='post-qc-gates':q.gates('post-qc-')
    else:final()
