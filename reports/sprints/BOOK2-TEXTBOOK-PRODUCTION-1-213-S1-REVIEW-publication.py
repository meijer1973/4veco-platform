"""Own evidence binding and actual publication scopes; never repairs input files."""
from pathlib import Path
import argparse, importlib.util, json, re, subprocess

spec=importlib.util.spec_from_file_location('review',Path(__file__).with_name('BOOK2-TEXTBOOK-PRODUCTION-1-213-S1-REVIEW-check.py'))
d=importlib.util.module_from_spec(spec); spec.loader.exec_module(d)

def bind():
    base=d.check(); pages=[]
    for kind,hash12,numbers in [('paragraaf','534177c8280e',[2,5]),('opgaven','d12487671bd2',[8,9]),('antwoorden','d96f21c3abed',[3,6])]:
        for number in numbers:
            path=d.PROOF/f'213-{kind}-{hash12}-r31/pages/page-{number:03d}.png'
            pages.append(dict(path=path.relative_to(d.ROOT).as_posix(),raw_sha256=d.sha(d.raw(path)),personally_viewed=True))
    assert len(pages)==6
    proof=[]
    for path in sorted(d.PROOF.rglob('manifest.json')):
        value=json.loads(d.raw(path)); assert value['inspection_status']=='PENDING' and value['pages_inspected']==[]
        proof.append(dict(path=path.relative_to(d.ROOT).as_posix(),raw_sha256=d.sha(d.raw(path))))
    assert len(proof)==9
    validation=json.loads(d.raw(d.OUT/'final-native-checker.json'))
    assert validation['exit_code']==0
    native=json.loads(d.raw(d.OUT/'final-native-result-utf8.json')); assert native['automated_result']=='PASS'
    assert json.loads(validation['stdout'])['automated_result']=='PASS'
    assert len(native['raster_checks'])==6
    assert all(r['reraster_changed_pixels']==0 for r in native['raster_checks'])
    d.save('personal-binding.json',dict(actor='paragraph_214_builder',role='independent213S1DeltaReviewer',
       personal_report_sha256=d.sha(d.raw(d.ROOT/'reports/sprints'/f'{d.PREFIX}-personal.md')),
       fresh_personal_full_page_views=6,pages=pages,all_pages_fresh_personally_viewed=False,
       prior_full_review_actor='paragraph_213_r7_independent_review',prior_full_review_sha256=d.sha(d.raw(d.FOLDER/'2.1.3-review.md')),
       attribution='Prior full30-page/six-figure/five-gray observations belong to the named R7 reviewer, not this reviewer.',
       immutable_pending_manifests=proof,native=d.d.native(),full_thin_print_reproduction=[dict(path=p.name,raw_sha256=d.sha(d.raw(p))) for p in sorted(d.OUT.glob('*-reproduction.json'))],
       minimum_type=[{k:v for k,v in row.items() if k in ('kind','minimum_text_pt_including_footer','minimum_placed_figure_font_pt','pages')} for row in native['documents']],
       current_canonical_review_unchanged=True,stale_qc_unchanged=True,handoff_absent=True))
    evidence={p.relative_to(d.ROOT).as_posix():d.sha(d.raw(p)) for p in sorted(d.OUT.rglob('*')) if p.is_file()}
    d.save('final-integrity.json',dict(result='PASS',source=d.source_contract(),native=d.d.native(),archives=d.d.archives(),
       prior_files_unchanged={k:len(v) for k,v in base['inherited'].items()},evidence=evidence,
       report_sha256=d.sha(d.raw(d.ROOT/'reports/sprints'/f'{d.PREFIX}-result.md')),
       current_review_sha256=d.sha(d.raw(d.FOLDER/'2.1.3-review.md')),stale_qc_sha256=d.sha(d.raw(d.FOLDER/'2.1.3-quality-ref.yaml')),
       handoff_absent=True,root_acceptance='NOT_PERFORMED',specialist_qc='NOT_PERFORMED',timing='54/66/78 UNOBSERVED'))
    print('Bound personal6, native90 page comparisons, immutable9 PENDING manifests and final custody')

def scope(head,label,indexes=False,write=True):
    base=d.check(indexes=indexes); allrows=[]
    changes=lambda root,a,z:[n.decode('utf-8') for n in d.git(root,'diff','--name-only','-z',a,z).split(b'\0') if n]
    own=changes(d.ROOT,d.PBASE,head)
    assert all(n.startswith('reports/sprints/'+d.PREFIX+'-') or (indexes and n in d.INDEXES) for n in own)
    assert changes(d.LESSONS,d.LBASE,d.LBASE)==[]
    for repo,root,lane,ownbase,main,ref in [('platform',d.ROOT,'shared',d.PBASE,'96416b6b5bd57094576e9aba0a42d682584ec479',head),('lessons',d.LESSONS,'textbook',d.LBASE,'f09fd6e88edc5049b026b16b0158e7e188091d2d',d.LBASE)]:
        for kind,comparison in [('owned',ownbase),('complete',main)]:
            argv=['node','build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',str(root),'--lane',lane,'--base',comparison,'--head',ref,'--json']
            if write: result=d.command(argv,label+'-'+repo+'-'+kind+'.json',allow_failure=True)
            else:
                run=subprocess.run(argv,cwd=d.ROOT,capture_output=True);result=dict(exit_code=run.returncode,stdout=run.stdout.decode('utf-8'))
            parsed=json.loads(result['stdout']); assert parsed['categories']['unknown']==[]
            if kind=='complete': assert result['exit_code']==0 and parsed['ok']
            else: assert result['exit_code']==1 and not parsed['ok']
            allrows.append(dict(repository=repo,kind=kind,base=comparison,head=ref,exit_code=result['exit_code'],native_verdict='PASS' if parsed['ok'] else 'FAIL',counts={k:len(v) for k,v in parsed['categories'].items()},unknown=0,failures=parsed['failures']))
    whitespace=[]
    for mode,argv in [('native',['git','diff','--check',d.PBASE,head]),('cr-at-eol',['git','-c','core.whitespace=cr-at-eol','diff','--check',d.PBASE,head])]:
        if write: result=d.command(argv,label+'-whitespace-'+mode+'.json',allow_failure=True)
        else:
            run=subprocess.run(argv,cwd=d.ROOT,capture_output=True); result=dict(exit_code=run.returncode,stdout=run.stdout.decode('utf-8'))
        if mode=='cr-at-eol': assert result['exit_code']==0
        whitespace.append(dict(mode=mode,exit_code=result['exit_code']))
    rows=[]
    for name in own:
        raw=d.raw(d.ROOT/name); committed=d.blob(d.ROOT,head,name)
        assert raw==committed or d.lf(raw)==committed
        rows.append(dict(path=name,raw_sha256=d.sha(raw),git_sha256=d.sha(committed)))
    value=dict(result='PASS',strict_owned_unknown=0,owned_paths=rows,actual_native_scopes=allrows,whitespace=whitespace,
       platform_base=d.PBASE,platform_head=head,lesson_head=d.LBASE,inherited_counts={k:len(v) for k,v in base['inherited'].items()},
       original_raw_preserved=True,index_tail_allowed=indexes,native=d.d.native(),no_canonical_review_qc_handoff_change=True)
    if write: d.save(label+'-scope.json',value)
    print(json.dumps({k:v for k,v in value.items() if k not in ('owned_paths','native')},ensure_ascii=True))

def prepublish():
    for repo,root in [('platform',d.ROOT),('lessons',d.LESSONS)]:
        d.command(['git','fetch','--prune','origin'],'publication-'+repo+'-fetch.json',cwd=root)
    d.command(['npm.cmd','run','check:governance-freshness'],'publication-governance.json')
    for repo,root in [('platform',d.ROOT),('lessons',d.LESSONS)]:
        d.command(['npm.cmd','run','check:agent-worktree-safety','--','--check','--worktree',root,'--task','BOOK2-TEXTBOOK-PRODUCTION-1-213-S1-REVIEW','--agent','paragraph_214_builder','--require-prefix','codex/,agent/'],'publication-'+repo+'-claim.json')

def claims():
    # Original prepublish missing-mode failure is immutable. Only read-check
    # the existing same actor/task claims under fresh result names; no reclaim.
    for repo,root in [('platform',d.ROOT),('lessons',d.LESSONS)]:
        d.command(['npm.cmd','run','check:agent-worktree-safety','--','--check','--worktree',root,'--task','BOOK2-TEXTBOOK-PRODUCTION-1-213-S1-REVIEW','--agent','paragraph_214_builder','--require-prefix','codex/,agent/'],
                  'publication-'+repo+'-claim-check-corrected.json')
    d.save('publication-claim-invocation-note.json',dict(
        original='publication-platform-claim.json',original_exit_code=2,
        cause='Own prepublish helper omitted required --check mode; CLI rejected before reading or changing ownership.',
        correction='Added explicit --check; fresh named read-only checks verify existing actor/task on both owned branches. No --claim, override or release.',
        historical_failure_preserved=True,result='PASS'))

def native_file():
    # Preserve the earlier cp1252 console transcript. The unchanged checker
    # already supports a native UTF-8 result file; no environment/source edit.
    d.check()
    destination=d.OUT/'final-native-result-utf8.json'
    assert not destination.exists()
    d.command([d.PYTHON,d.ROOT/'build-scripts/content/book-2/213/check_render.py',destination],
              'final-native-result-file-command.json')
    value=json.loads(d.raw(destination)); assert value['automated_result']=='PASS'
    d.check()
    d.save('final-native-result-encoding-note.json',dict(
        original_command='final-native-checker.json',original_preserved=True,
        diagnostic='Original inherited Python stdout cp1252 was decoded as UTF-8 with replacement by own command wrapper; only the displayed non-ASCII transcript is lossy.',
        authoritative_result=destination.name,raw_sha256=d.sha(d.raw(destination)),
        mechanism='Unchanged checker supported UTF-8 result file; identical inherited PATH, no environment override, no PDF generation or source edit.',
        result='PASS'))

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('mode');p.add_argument('--head');p.add_argument('--label',default='actual-payload');p.add_argument('--indexes',action='store_true');p.add_argument('--no-write',action='store_true');a=p.parse_args()
    if a.mode=='bind': bind()
    elif a.mode=='prepublish': prepublish()
    elif a.mode=='claims': claims()
    elif a.mode=='native-file': native_file()
    else: scope(a.head,a.label,a.indexes,not a.no_write)
