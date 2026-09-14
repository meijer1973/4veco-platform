import base64
import os
import re
import subprocess
import sys
from pathlib import Path

ASSET_DIR = Path(__file__).parent / "_assets"
FOOTER = Path(__file__).parent.name

CSS = f"""<style>
@page {{
  size: A4;
  margin: 2cm 2.2cm 2.2cm 3.2cm;
  @bottom-left {{ content: "{FOOTER}"; font-family: Arial, sans-serif; font-size: 9pt; color: #555; }}
  @bottom-center {{ content: counter(page) " / " counter(pages); font-family: Arial, sans-serif; font-size: 9pt; color: #555; }}
}}
body {{ font-family: Arial, 'DejaVu Sans', sans-serif; font-size: 11pt; line-height: 1.45; color: #1a1a1a; }}
h1 {{ font-size: 18pt; color: #1A5276; border-bottom: 1.5px solid #1A5276; padding-bottom: 5pt; margin-top: 0; }}
h2 {{ font-size: 14pt; color: #1A5276; border-bottom: 1px solid #999; padding-bottom: 4pt; margin-top: 22pt; }}
h3 {{ font-size: 12pt; color: #1a1a1a; margin-top: 16pt; }}
p {{ margin: 0 0 10pt 0; }}
table {{ border-collapse: collapse; width: 100%; margin: 12pt 0; font-size: 10.5pt; break-inside: avoid; }}
th {{ background: #EDF0F3; font-weight: bold; padding: 3pt 6pt; text-align: left; border: 1px solid #999; }}
td {{ border: 1px solid #999; padding: 2pt 6pt; border: 1px solid #999; }}
tr:nth-child(even) td {{ background: #FAFBFC; }}
img {{ max-width: 100%; width: 100%; display: block; margin: 14pt auto; break-inside: avoid; }}
blockquote {{ background: #F4F7FA; border-left: 3px solid #1A5276; padding: 8pt 12pt; margin: 12pt 0; }}
code {{ background: #EDF2F7; padding: 1pt 5pt; border-radius: 3px; font-family: Consolas, 'DejaVu Sans Mono', monospace; font-size: 10pt; }}
hr {{ border: none; border-top: 1px solid #BBB; margin: 18pt 0; }}
ul, ol {{ margin: 0 0 10pt 0; padding-left: 20pt; }}
li {{ margin-bottom: 4pt; }}
@media print {{
  /* Keep the summary compact so its label does not displace the next exercise. */
  .procedure-summary p {{ margin-bottom: 0; }}
  .procedure-summary table {{ margin: 0; }}
  .procedure-summary + hr {{ margin-top: 6pt; }}
}}
</style>"""


def embed_images(md):
    def replacer(match):
        alt = match.group(1)
        ref = match.group(2).replace(".svg", ".png")
        full = ASSET_DIR / Path(ref).name
        if full.exists():
            b64 = base64.b64encode(full.read_bytes()).decode()
            return f"![{alt}](data:image/png;base64,{b64})"
        print(f"Warning: missing image {full}")
        return match.group(0)

    return re.sub(r"!\[([^\]]*)\]\(([^)]+)\)", replacer, md)


def build_pdf(md_path, output_path):
    md = Path(md_path).read_text(encoding="utf-8")
    md = embed_images(md)
    result = subprocess.run(
        ["pandoc", "--from=markdown", "--to=html5", "--standalone"],
        input=md.encode("utf-8"),
        capture_output=True,
    )
    if result.returncode != 0:
        print(result.stderr.decode("utf-8", errors="replace"))
        sys.exit(result.returncode)
    html = result.stdout.decode("utf-8").replace("</head>", CSS + "</head>")
    html_path = output_path.replace(".pdf", ".html")
    # Avoid doubling Pandoc's CRLF line endings when writing on Windows.
    Path(html_path).write_text(html.replace("\r\n", "\n"), encoding="utf-8", newline="\n")
    import weasyprint

    weasyprint.HTML(string=html).write_pdf(output_path)
    print(f"PDF created: {output_path}")


if __name__ == "__main__":
    base = Path(__file__).parent
    for suffix in ["paragraaf", "opgaven", "antwoorden"]:
        matches = list(base.glob(f"* \u2013 {suffix}.md"))
        if not matches:
            print(f"Skipping {suffix}: no markdown found")
            continue
        md = matches[0]
        build_pdf(str(md), str(md).replace(".md", ".pdf"))
