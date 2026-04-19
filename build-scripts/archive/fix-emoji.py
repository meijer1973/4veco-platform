"""
Fix emoji rendering in Word documents.
Replaces supplementary-plane emoji (U+10000+) with BMP-safe alternatives.
"""
import sys, os, re, zipfile, shutil, tempfile
sys.stdout.reconfigure(encoding='utf-8')

# Map problematic emoji to BMP-safe replacements
REPLACEMENTS = {
    # Supplementary plane emoji → BMP symbols
    '\U0001F4A1': '\u25B6',   # 💡 → ▶
    '\U0001F50D': '\u25B6',   # 🔍 → ▶
    '\U0001F4DD': '\u25B6',   # 📝 → ▶
    '\U0001F4D6': '\u25B6',   # 📖 → ▶
    '\U0001F4CB': '\u25A0',   # 📋 → ■
    '\U0001F680': '\u25B6',   # 🚀 → ▶
    '\U0001F4DA': '\u25B6',   # 📚 → ▶
    '\U0001F4F0': '\u25B6',   # 📰 → ▶
    '\U0001F3A5': '\u25B6',   # 🎥 → ▶
    '\U0001F4CA': '\u25B6',   # 📊 → ▶
    '\U0001F4C1': '\u25B6',   # 📁 → ▶
    '\U0001F4F1': '\u25B6',   # 📱 → ▶
    '\U0001F517': '\u25B6',   # 🔗 → ▶
    '\U0001F6A7': '\u25B6',   # 🚧 → ▶
    '\U0001F3EA': '\u25B6',   # 🏪 → ▶
    '\U0001F4E6': '\u25B6',   # 📦 → ▶
    '\U0001F511': '\u25B6',   # 🔑 → ▶
    '\u270D\uFE0F': '\u270E', # ✍️ → ✎
}

# Also handle XML numeric references (&#128161; etc.)
XML_REPLACEMENTS = {}
for emoji, replacement in REPLACEMENTS.items():
    for ch in emoji:
        code = ord(ch)
        if code > 0xFFFF:
            XML_REPLACEMENTS[f'&#{code};'] = replacement
            # Also handle surrogate pair references
            hi = 0xD800 + ((code - 0x10000) >> 10)
            lo = 0xDC00 + ((code - 0x10000) & 0x3FF)
            XML_REPLACEMENTS[f'&#{hi};&#{lo};'] = replacement


def fix_docx(filepath):
    """Fix emoji in a docx file by editing the XML directly."""
    changed = False

    with tempfile.TemporaryDirectory() as tmpdir:
        # Extract
        with zipfile.ZipFile(filepath, 'r') as zin:
            zin.extractall(tmpdir)

        # Process all XML files
        for root, dirs, files in os.walk(tmpdir):
            for fn in files:
                if fn.endswith('.xml') or fn.endswith('.rels'):
                    fpath = os.path.join(root, fn)
                    with open(fpath, 'r', encoding='utf-8') as f:
                        content = f.read()

                    new_content = content

                    # Replace XML numeric references
                    for old, new in XML_REPLACEMENTS.items():
                        if old in new_content:
                            new_content = new_content.replace(old, new)

                    # Replace actual emoji characters
                    for old, new in REPLACEMENTS.items():
                        if old in new_content:
                            new_content = new_content.replace(old, new)

                    # Also catch any remaining supplementary plane chars
                    def replace_high_unicode(m):
                        ch = m.group(0)
                        code = ord(ch)
                        if code > 0xFFFF:
                            return '\u25B6'  # Generic replacement
                        return ch

                    new_content = re.sub(r'[\U00010000-\U0010FFFF]', replace_high_unicode, new_content)

                    if new_content != content:
                        changed = True
                        with open(fpath, 'w', encoding='utf-8') as f:
                            f.write(new_content)

        if changed:
            # Repack
            with zipfile.ZipFile(filepath, 'w', zipfile.ZIP_DEFLATED) as zout:
                for root, dirs, files in os.walk(tmpdir):
                    for fn in files:
                        fpath = os.path.join(root, fn)
                        arcname = os.path.relpath(fpath, tmpdir)
                        zout.write(fpath, arcname)

    return changed


# ── Main ──
base = os.path.expandvars(r"${USERPROFILE}\documents\0. claude - under construction")
fixed_count = 0
total_count = 0

for root, dirs, files in os.walk(base):
    for fn in files:
        # Process begeleide inoefening, infographics, and lesaanpak
        if fn.endswith('.docx') and ('begeleide inoefening' in fn or 'samenvatting' in fn or 'Lees dit' in fn):
            filepath = os.path.join(root, fn)
            total_count += 1
            try:
                if fix_docx(filepath):
                    fixed_count += 1
                    print(f'  FIXED: {fn}')
                else:
                    print(f'  OK:    {fn}')
            except Exception as e:
                print(f'  ERROR: {fn} — {e}')

print(f'\nDone. Fixed {fixed_count}/{total_count} files.')
