"""Actual corrected direct run entry, technical namespace failures before effects.
Does not regenerate PDFs, alter shared code, or relabel historical r12.
"""
import argparse, importlib.util, json, tempfile
from pathlib import Path
from unittest.mock import patch
P=Path(__file__).resolve().parents[2]
pre='BOOK2-TEXTBOOK-PRODUCTION-1-224-QC-CURRENT'
s=importlib.util.spec_from_file_location('c224safe',P/'reports/sprints'/(pre+'-controller.py'))
c=importlib.util.module_from_spec(s);s.loader.exec_module(c)
ap=argparse.ArgumentParser();ap.add_argument('--controller-commit',required=True);a=ap.parse_args()
c.guard(a.controller_commit);c.release_guard();c.native_guard();b=c.builder();rows=[]
with tempfile.TemporaryDirectory(prefix='224-namespace-fixture-',dir=c.E) as td:
    evidence=Path(td);revision='r999';destination=evidence/'224-direct-r999'
    c.save(evidence/'224-reservation-direct-r999.json',{'revision':revision,'label':'direct','technical_fixture_not_native_revision':True})
    for kind in ['empty-directory','populated-directory','file']:
        if kind=='file':destination.write_bytes(b'occupied')
        else:
            destination.mkdir()
            if kind=='populated-directory':(destination/'sentinel').write_bytes(b'preserve me')
        with patch.object(c,'E',evidence),patch.object(c,'save',side_effect=AssertionError('premature evidence write')) as save,patch.object(c,'command',side_effect=AssertionError('premature command')) as command,patch.object(b,'documents',side_effect=AssertionError('premature source rendering')) as documents:
            try:c.run('direct',revision,'print',a.controller_commit)
            except ValueError as exc:
                assert 'already occupied' in str(exc);reason=str(exc)
            else:raise AssertionError('Occupied direct destination accepted')
            save.assert_not_called();command.assert_not_called();documents.assert_not_called()
        rows.append({'case':kind,'real_run_entry':True,'rejected':True,'reason':reason,'preflight_writes':0,'Node_or_worker_calls':0,'native_writes':0})
        # Only our just-created technical fixture is removed, never an attempted
        # native proof or the historical denied author's external directory.
        assert destination.resolve().parent==evidence.resolve()
        if kind=='file':destination.unlink()
        else:
            if kind=='populated-directory':(destination/'sentinel').unlink()
            destination.rmdir()
    with patch.object(c,'E',evidence):
        assert c.unused_direct_destination(revision)==destination and not destination.exists()
        for invalid in ['r0','../r1','r1/../../outside']:
            try:c.unused_direct_destination(invalid)
            except ValueError:rows.append({'case':'invalid syntax '+invalid,'rejected':True})
            else:raise AssertionError('Invalid namespace accepted')
c.guard(a.controller_commit);c.release_guard();c.native_guard()
c.save(c.E/'224-direct-safety.json',{'status':'PASS','actor':c.ACTOR,'controller_commit':a.controller_commit,'controller_raw_sha256':c.digest(P/c.SELF),'cases':rows,'positive_unused_namespace_preflight':True,'actual_current_and_committed_inputs':34,'native_bytes_preserved':15,'new_native_run':False,'historical_direct_r12_had_new_preflight':False,'shared_worker_is_ungated_primitive':True,'authorized_orchestration':'Current approved specialist/durable and complete source/current/committed input guards plus new pre-effect unused-destination check.','scope':'Own additive controller safety; no source, shared primitive, review, plan or target change.'})
print(json.dumps({'status':'PASS','namespace_negatives':len(rows),'native_run':False}))
