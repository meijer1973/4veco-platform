"""Read-only native-output drift diagnosis; never restores lesson artifacts."""
from pathlib import Path
from datetime import datetime, timezone
import argparse, ctypes, importlib.util, io, json, os, re, subprocess, sys

spec=importlib.util.spec_from_file_location('qc',Path(__file__).with_name('BOOK2-TEXTBOOK-PRODUCTION-1-212-QC-CURRENT-check.py'))
q=importlib.util.module_from_spec(spec); spec.loader.exec_module(q)

def pixels(a,b):
    from PIL import Image, ImageChops
    with Image.open(io.BytesIO(a)) as x, Image.open(io.BytesIO(b)) as y:
        same=x.mode==y.mode and x.size==y.size and x.tobytes()==y.tobytes()
        diff=ImageChops.difference(x.convert('RGBA'),y.convert('RGBA')) if x.size==y.size else None
        return {'old_mode':x.mode,'new_mode':y.mode,'old_size':x.size,'new_size':y.size,
          'decoded_equal':same,'old_pixels_sha256':q.h(x.tobytes()),'new_pixels_sha256':q.h(y.tobytes()),
          'difference_rgb_bounds':diff.convert('RGB').getbbox() if diff else None}

def inventory():
    before=q.read(q.E/'baseline.json');rows=[]
    for name in before['folder40']:
        new=(q.D/name).read_bytes();old=q.blob(q.LBASE,(q.REL/name).as_posix(),q.L)
        assert q.h(old)==before['folder40'][name],name
        rec={'path':(q.REL/name).as_posix(),'old_sha256':q.h(old),'new_sha256':q.h(new),'old_bytes':len(old),'new_bytes':len(new),'equal':old==new}
        if name.endswith('.png'): rec['pixels']=pixels(old,new)
        if name.endswith('.html'):
            scrub=lambda b:re.sub(rb'data:image/png;base64,[A-Za-z0-9+/=]+',b'[NATIVE_PNG_BASE64]',b)
            rec['equal_after_png_data_uri_redaction']=scrub(old)==scrub(new)
        rows.append(rec)
    inputs={n:{'expected':v,'actual':q.raw(q.P/n)} for n,v in before['platform_inputs'].items()}
    manifest=q.read(q.E/'full-manifest.json');proofs=[]
    for doc in manifest['documents']:
        m=q.read(Path(doc['proof_directory'])/'manifest.json')
        assert m['inspection_status']=='PENDING' and m['pages_inspected']==[]
        proofs.append({'kind':Path(doc['source_pdf']).stem,'pdf_sha256':doc['pdf_sha256'],'proof_directory':doc['proof_directory'],
           'manifest_sha256':q.raw(Path(doc['proof_directory'])/'manifest.json'),'page_count':len(m['page_sha256'])})
    q.save('full-r19-reproduction-failure.json',{'verdict':'FAIL','native_process_exit':0,
      'outer_failure':'AssertionError from preserve(): first differing tracked lesson file was antwoorden.html; not a native subprocess failure.',
      'runtime_request':'process-only MSYS-FIRST Python314; original sources unchanged',
      'changed_count':sum(not r['equal'] for r in rows),'folder40':rows,'platform_inputs':inputs,
      'lesson_git_status':q.git('status','--porcelain',cwd=q.L).decode(),'proofs':proofs,
      'root_action':'Reported; no hand restoration, source repair or acceptance.', 'personal_inspection':'NOT_YET_PERFORMED'})

def loaded_modules():
    psapi=ctypes.WinDLL('psapi');kernel=ctypes.WinDLL('kernel32',use_last_error=True)
    kernel.GetCurrentProcess.restype=ctypes.c_void_p
    handle=kernel.GetCurrentProcess();mods=(ctypes.c_void_p*2048)();needed=ctypes.c_ulong()
    psapi.EnumProcessModules.argtypes=[ctypes.c_void_p,ctypes.c_void_p,ctypes.c_ulong,ctypes.POINTER(ctypes.c_ulong)]
    psapi.GetModuleFileNameExW.argtypes=[ctypes.c_void_p,ctypes.c_void_p,ctypes.c_wchar_p,ctypes.c_ulong]
    assert psapi.EnumProcessModules(handle,mods,ctypes.sizeof(mods),ctypes.byref(needed))
    result=[]
    for mod in mods[:needed.value//ctypes.sizeof(ctypes.c_void_p)]:
        buf=ctypes.create_unicode_buffer(32768)
        if psapi.GetModuleFileNameExW(handle,mod,buf,len(buf)) and re.search('cairo|pango|freetype|fontconfig|harfbuzz|pixman|png',buf.value,re.I):
            result.append({'path':buf.value,'raw_sha256':q.raw(buf.value)})
    return result

def worker(label):
    import cairosvg, cairocffi
    svg=q.D/'_assets/2.1.2_fig_1.svg';out=q.E/'runtime-diagnostic'/f'{label}-fig1.png'
    out.parent.mkdir(exist_ok=True);assert not out.exists()
    cairosvg.svg2png(url=str(svg),write_to=str(out),scale=2)
    old=q.blob(q.LBASE,(q.REL/'_assets/2.1.2_fig_1.png').as_posix(),q.L)
    q.save(f'runtime-diagnostic/{label}-result.json',{'label':label,'argv':sys.argv,'process_path':os.environ['PATH'],
      'python':sys.version,'cairosvg':cairosvg.__version__,'cairocffi':cairocffi.__version__,
      'cairo_version':cairocffi.cairo_version_string(),'loaded_render_modules':loaded_modules(),
      'svg_sha256':q.raw(svg),'png_sha256':q.raw(out),'expected_png_sha256':q.h(old),
      'matches_current_r19_png':out.read_bytes()==svg.with_suffix('.png').read_bytes(),
      'matches_published_png':out.read_bytes()==old,'pixels':pixels(old,out.read_bytes())})

def diagnose():
    for label,env in [('inherited',dict(os.environ)),('msys-first',{**os.environ,'PATH':'C:/msys64/mingw64/bin;'+os.environ['PATH']})]:
        env['PYTHONIOENCODING']='utf-8';argv=[q.PY,__file__,'worker','--label',label]
        started=datetime.now(timezone.utc).isoformat()
        result=subprocess.run(argv,cwd=q.P,env=env,capture_output=True)
        q.save(f'runtime-diagnostic/{label}-process.json',{'argv':argv,'cwd':str(q.P),'process_path':env['PATH'],
          'started':started,'finished':datetime.now(timezone.utc).isoformat(),'exit_code':result.returncode,
          'stdout':result.stdout.decode('utf-8',errors='replace'),'stderr':result.stderr.decode('utf-8',errors='replace'),
          'stdout_sha256':q.h(result.stdout),'stderr_sha256':q.h(result.stderr)})
        assert result.returncode==0,(label,result.returncode)

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('mode',choices=['inventory','diagnose','worker']);parser.add_argument('--label');args=parser.parse_args()
    {'inventory':inventory,'diagnose':diagnose,'worker':lambda:worker(args.label)}[args.mode]()
