"""Supplementary independent CLI/common dispatch and native junction-retarget probe."""
from __future__ import annotations
import contextlib, importlib.util, io, json, runpy, subprocess, sys
from pathlib import Path
from unittest.mock import patch
P=Path(__file__).resolve().parents[2]
spec=importlib.util.spec_from_file_location('review_probes',Path(__file__).with_name('BOOK2-TEXTBOOK-PRODUCTION-1-BOOK-PROOF-REVIEW-probes.py'))
review=importlib.util.module_from_spec(spec);spec.loader.exec_module(review)
bp,lib_book=review.bp,review.lib_book
rows=[]
with review.fixture() as f:
    cli=P/'build-scripts/books/build-book.py'
    root=review.dest(f,'cli-explicit')
    argv=[str(cli),'--book','2','--platform-root',str(f.platform),'--lessen-root',str(f.lessons)]
    for options in [[],['--proof-root',str(root)]]:
        with patch.object(sys,'argv',argv+options),patch.object(lib_book,'build_book',return_value=[]) as delegated:
            runpy.run_path(str(cli),run_name='__main__')
            delegated.assert_called_once_with(f.manifest,f.lessons,f.platform,**({'proof_root':root} if options else {}))
        rows.append({'case':'CLI explicit forwarding' if options else 'CLI default exact three-positional call','status':'PASS'})
    for book,profile in [(1,None),(2,'wrong-profile'),(1,bp.PROFILE)]:
        f.spec['book']['nr']=book
        if profile is None:f.spec.pop('print_profile',None)
        else:f.spec['print_profile']=profile
        f.save()
        before=review.snapshot(Path(f.temp.name))
        with patch.object(lib_book,'detect_toolchain_versions') as legacy,patch.object(bp,'build_book') as native:
            error=review.rejection(lambda:lib_book.build_book(f.manifest,f.lessons,f.platform,proof_root=root));legacy.assert_not_called();native.assert_not_called()
        review.need(review.snapshot(Path(f.temp.name))==before,'Unsupported common dispatch wrote')
        rows.append({'case':f'Unsupported explicit common dispatch {book}/{profile}','status':'PASS','error':error})
    f.spec['book']['nr']=2;f.spec['print_profile']=bp.PROFILE;f.save()
    for suffix in ['missing-lessons','missing-platform']:
        args=argv.copy();args[args.index('--lessen-root' if suffix=='missing-lessons' else '--platform-root')+1]=str(Path(f.temp.name)/suffix)
        errorio=io.StringIO()
        with patch.object(sys,'argv',args+['--proof-root',str(root)]),patch.object(lib_book,'build_book') as delegated,contextlib.redirect_stderr(errorio):
            try:runpy.run_path(str(cli),run_name='__main__')
            except SystemExit as error:review.need('not found' in str(error),str(error))
            else:raise AssertionError('Missing CLI root did not reject')
            delegated.assert_not_called()
        rows.append({'case':'CLI '+suffix+' rejected before dispatch','status':'PASS'})

with review.fixture() as f:
    proofbase=review.dest(f,'unused').parent
    old=proofbase/'old-target';new=proofbase/'new-target';old.mkdir(parents=True);new.mkdir()
    alias=proofbase/'alias'
    def link(target):return subprocess.run(['cmd.exe','/c','mklink','/J',str(alias),str(target)],check=True,capture_output=True,text=True)
    link(old);review.need(alias.is_junction(),'Native junction not available')
    before=review.snapshot(f.book);calls=[]
    def retarget(args,**kwargs):
        if args[0]=='node':
            calls.append(args)
            if len(calls)==1:
                review.need(alias.is_junction(),'Only this owned junction may be removed')
                # Non-recursive removal of the explicitly verified owned junction;
                # both targets stay inside this TemporaryDirectory fixture.
                alias.rmdir();link(new)
            return subprocess.CompletedProcess(args,0)
        return review.real_run(args,**kwargs)
    with patch.object(bp.subprocess,'run',side_effect=retarget),patch.object(bp,'build_document') as render:
        error=review.rejection(lambda:bp.build_book(f.manifest,f.lessons,f.platform,proof_root=alias/'r1'),'changed during input preflight');render.assert_not_called()
    review.need(review.snapshot(f.book)==before and not(old/'r1').exists() and not(new/'r1').exists(),'Retarget collision wrote output or reserved either destination')
    rows.append({'case':'Native junction retarget within permitted scope during authority is rejected','status':'PASS','error':error,'actual_gate_slots':calls})
review.save('dispatch-race-result',{'status':'PASS','reviewed_payload':review.PAYLOAD,'probes':rows,'count':len(rows),'real_lesson_edits':0,'filesystem_transaction_claim':False})
print(json.dumps({'status':'PASS','count':len(rows),'probes':rows},indent=2))
