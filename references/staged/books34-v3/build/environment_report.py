"""Record the local Python/render/font environment without distributing fonts."""
from pathlib import Path
import argparse, ctypes, ctypes.util, hashlib, importlib.metadata as metadata, json, locale, platform, shutil, subprocess, sys
ROOT=Path(__file__).resolve().parents[1]
PACKAGES=['weasyprint','PyMuPDF','markdown-it-py','beautifulsoup4','cairosvg','Pillow','pydyf','cffi','cairocffi','tinycss2','tinyhtml5','cssselect2','pyphen','fonttools','soupsieve','webencodings','mdurl','defusedxml','pycparser','Brotli','zopfli','typing_extensions']
FONTS=['Lato','Lato:style=Bold','Lato:style=Italic','Lato:style=Black','DejaVu Sans','DejaVu Sans:style=Bold','DejaVu Sans Mono']

def command(args):
    try:
        p=subprocess.run(args,capture_output=True,text=True,encoding='utf-8',errors='replace',check=False,timeout=15)
        return {'exit_code':p.returncode,'stdout':p.stdout.strip(),'stderr':p.stderr.strip()}
    except (OSError,subprocess.TimeoutExpired) as exc:return {'unavailable':str(exc)}

def runtime_versions():
    result={}
    for name,func in [('pango-1.0','pango_version_string'),('cairo','cairo_version_string'),('harfbuzz','hb_version_string')]:
        try:
            lib=ctypes.CDLL(ctypes.util.find_library(name));fn=getattr(lib,func);fn.restype=ctypes.c_char_p
            result[name]=fn().decode('ascii')
        except (OSError,AttributeError,TypeError) as exc:result[name]={'unavailable':str(exc)}
    try:
        lib=ctypes.CDLL(ctypes.util.find_library('fontconfig'));lib.FcGetVersion.restype=ctypes.c_int
        result['fontconfig_version_number']=lib.FcGetVersion()
    except (OSError,AttributeError,TypeError) as exc:result['fontconfig']={'unavailable':str(exc)}
    return result

def embedded_fonts():
    import fitz
    names=set()
    for f in (ROOT/'books').glob('*/output/*.pdf'):
        with fitz.open(f) as doc:
            for page in doc:
                names.update(font[3].split('+')[-1] for font in page.get_fonts())
    return sorted(names)

def report():
    packages={}
    for name in PACKAGES:
        try:packages[name]=metadata.version(name)
        except metadata.PackageNotFoundError:packages[name]=None
    fonts=[]
    if shutil.which('fc-match'):
        from fontTools.ttLib import TTFont
        for pattern in FONTS:
            entry=command(['fc-match','-f','%{family}\n%{style}\n%{file}\n',pattern]);lines=entry.get('stdout','').splitlines()
            row={'requested':pattern,**entry}
            if len(lines)>=3 and Path(lines[2]).is_file():
                f=Path(lines[2]);row.update({'family':lines[0],'style':lines[1],'file_name':f.name,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()})
                font=TTFont(f);versions={n.toUnicode() for n in font['name'].names if n.nameID==5};font.close();row['version']=sorted(versions)
            fonts.append(row)
    else:fonts=[{'status':'Fontconfig unavailable. Inspect installed Lato/DejaVu faces and PDF embedded fonts on this platform; no match is assumed.'}]
    return {'python':sys.version,'platform':platform.platform(),'default_encoding':locale.getencoding(),'utf8_mode':sys.flags.utf8_mode,'python_packages':packages,'runtime_versions':runtime_versions(),'native_libraries':{p:command(['pkg-config','--modversion',p]) for p in ['pango','cairo','fontconfig','harfbuzz']},'embedded_pdf_font_names':embedded_fonts(),'font_matches':fonts,'weasyprint_info':command([sys.executable,'-m','weasyprint','--info']),'no_font_binaries_in_package':True,'windows_build_performed':False}

def main():
    p=argparse.ArgumentParser();p.add_argument('--output',type=Path,default=ROOT/'checks/render-environment.json');a=p.parse_args()
    a.output.write_text(json.dumps(report(),ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
    print('Recorded Python/render/font environment. No fonts copied.')
if __name__=='__main__':main()
