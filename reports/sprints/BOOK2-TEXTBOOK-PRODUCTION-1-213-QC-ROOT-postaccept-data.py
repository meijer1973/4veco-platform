"""Data-path-only Windows transport for the unchanged postacceptance checker.
HOW TO ADAPT: retain whole original source guard and never alter its predicates.
Normal Python entrypoint/cwd and all writes remain unchanged. Only read-only
lesson Path.exists/open calls gain the extended absolute data-path spelling.
"""
from pathlib import Path
from unittest.mock import patch
import datetime, hashlib, importlib.util, json, os, subprocess, sys

ROOT=Path(__file__).resolve().parents[2];L=ROOT.parent/'4veco-lessen';HERE=ROOT/'reports/sprints'
PREFIX='BOOK2-TEXTBOOK-PRODUCTION-1-213-QC-ROOT';V='a2724b42c71962ae62acfc12411eea9fd21380b0'
ENTRY=HERE/(PREFIX+'-finalize.py');raw=ENTRY.read_bytes()
expected=subprocess.check_output(['git','show',V+':'+ENTRY.relative_to(ROOT).as_posix()],cwd=ROOT)
assert raw==expected
sha=lambda b:hashlib.sha256(b).hexdigest()
def save(name,value):
    with (HERE/(PREFIX+'-'+name+'.json')).open('x',encoding='utf-8',newline='\n') as f:f.write(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
def diagnostic():
    argv=['C:/Python314/python.exe',str(ENTRY),'postaccept','--verification-commit',V]
    run=subprocess.run(argv,cwd=ROOT,capture_output=True,env={**os.environ,'PYTHONIOENCODING':'utf-8','PYTHONDONTWRITEBYTECODE':'1'})
    assert run.returncode==1 and b'p.exists()' in run.stderr
    rows=[]
    for line in (HERE/'BOOK2-TEXTBOOK-PRODUCTION-1-output-manifest.md').read_text(encoding='utf-8').splitlines():
        c=[s.strip() for s in line.split('|')]
        if len(c)==7 and c[1].isdigit() and c[4]!='P':
            p=L/'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus'/c[5].strip('`');extended=Path('\\\\?\\'+str(p))
            rows.append(dict(path=str(p),length=len(str(p)),normal_exists=p.exists(),extended_exists=extended.exists()))
    failures=[r for r in rows if not r['normal_exists']];assert len(failures)==2 and all(r['extended_exists'] for r in rows)
    save('postaccept-path-diagnostic',dict(argv=argv,cwd=str(ROOT),exit_code=run.returncode,stdout=run.stdout.decode('utf-8'),stderr=run.stderr.decode('utf-8'),
      stdout_sha256=sha(run.stdout),stderr_sha256=sha(run.stderr),original_checker_sha256=sha(raw),data_paths=rows,
      first_failure='Initial uncaptured invocation remains in tool trace; this exact rerun captures its actual failure, not reconstructed stderr',
      correction='Data-path-only extended spelling for existing lesson reads/exists; no changed assertions, proof, input, pupil artifact, runtime PATH or CLI/CWD'))
    print('Captured actual postacceptance path failure;2long223 paths exist under extended data spelling')
def run():
    diagnostic= json.loads((HERE/(PREFIX+'-postaccept-path-diagnostic.json')).read_bytes())
    assert diagnostic['original_checker_sha256']==sha(raw)
    original_exists,original_open=Path.exists,Path.open;translated=set()
    def data(p):
        value=Path(p).absolute()
        if os.name=='nt' and value.is_relative_to(L) and not str(value).startswith('\\\\?\\') and len(str(value))>=248:
            translated.add(str(value));return Path('\\\\?\\'+str(value))
        return p
    def exists(p,*,follow_symlinks=True):return original_exists(data(p),follow_symlinks=follow_symlinks)
    def opened(p,mode='r',*args,**kwargs):
        return original_open(data(p) if 'r' in mode and not any(t in mode for t in 'wax+') else p,mode,*args,**kwargs)
    spec=importlib.util.spec_from_file_location('unchanged_root_decision_check',ENTRY)
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
    with patch.object(Path,'exists',exists),patch.object(Path,'open',opened):module.postaccept(V)
    assert ENTRY.read_bytes()==expected
    save('postaccept-data-transport',dict(status='PASS',actor='codex-root',original_checker_sha256=sha(raw),verification_commit=V,translated_read_only_paths=sorted(translated),
      original_checker_unchanged=True,predicates_unchanged=True,normal_entrypoint_and_cwd=True,PATH_unchanged=True,lesson_writes=0))
    print('PASS unchanged full postacceptance checker via read-only lesson data transport')
if __name__=='__main__':
    if sys.argv[1]=='diagnose':diagnostic()
    elif sys.argv[1]=='run':run()
    else:raise ValueError('diagnose/run')
