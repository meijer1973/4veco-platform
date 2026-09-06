"""Owned inspection views, not acceptance. Preserve original PENDING manifests.

HOW TO ADAPT: explicit immutable native run path. Gray images are exact RGB
captures converted to grayscale, not altered pupil PDFs or patched figures.
"""
import json
import hashlib
from pathlib import Path
from PIL import Image
import fitz

P=Path(__file__).resolve().parents[2]
L=P.parent/"4veco-lessen"
N="BOOK2-TEXTBOOK-PRODUCTION-1-214-BUILD-CURRENT"
runroot=P/"reports/sprints"/(N+"-r42-full")
views=P/"reports/sprints"/(N+"-r42-views")
run=json.loads((runroot/"author-run.json").read_bytes())
sha=lambda b:hashlib.sha256(b).hexdigest()
assert not views.exists()
for row in run["native"]:assert sha((L/row["path"]).read_bytes())==row["sha256"]
views.mkdir()
result={"status":"CAPTURED_FOR_PERSONAL_REVIEW_NOT_ACCEPTANCE","run_sha256":sha((runroot/"author-run.json").read_bytes()),"pages":[],"figures":[],"pdf_placed_image_geometry":[]}
for proof in run["proofs"]:
    edition="antwoorden" if "antwoorden" in proof["artifact_id"] else "opgaven"
    folder=views/edition;folder.mkdir()
    for i,relative in enumerate(proof["rendered_pages"],1):
        color=runroot/proof["artifact_id"]/relative
        assert sha(color.read_bytes())==proof["page_sha256"][color.name]
        gray=folder/f"page-{i:03d}-gray.png"
        with Image.open(color) as im:
            rgb=im.convert("RGB");g=rgb.convert("L").convert("RGB");g.save(gray)
            result["pages"].append({"edition":edition,"page":i,"color":str(color),"gray":str(gray),"size":rgb.size,"color_file_sha256":sha(color.read_bytes()),"color_RGB_sha256":sha(rgb.tobytes()),"gray_file_sha256":sha(gray.read_bytes()),"gray_RGB_sha256":sha(g.tobytes())})
    doc=fitz.open(proof["source_pdf"])
    for i,page in enumerate(doc,1):
        for block in page.get_text("dict")["blocks"]:
            if block["type"]==1:
                x0,y0,x1,y1=block["bbox"]
                result["pdf_placed_image_geometry"].append({"edition":edition,"page":i,"bbox":block["bbox"],"width_mm":(x1-x0)*25.4/72,"height_mm":(y1-y0)*25.4/72,"actual_40px_text_pt":(x1-x0)*40/1200})
assetrows=[r for r in run["native"] if "/_assets/" in r["path"] and r["path"].endswith(".png")]
for row in assetrows:
    color=L/row["path"];gray=views/(color.stem+"-gray.png")
    with Image.open(color) as im:
        rgb=im.convert("RGB");g=rgb.convert("L").convert("RGB");g.save(gray)
        result["figures"].append({"name":color.name,"color":str(color),"gray":str(gray),"color_file_sha256":sha(color.read_bytes()),"gray_file_sha256":sha(gray.read_bytes()),"color_RGB_sha256":sha(rgb.tobytes()),"gray_RGB_sha256":sha(g.tobytes())})
with (P/"reports/sprints"/(N+"-r42-views.json")).open("x",encoding="utf-8",newline="\n") as stream:json.dump(result,stream,ensure_ascii=False,indent=2);stream.write("\n")
print(json.dumps({"pages":len(result["pages"]),"figures":len(result["figures"]),"actual_placed_geometry":result["pdf_placed_image_geometry"],"status":result["status"]}))
