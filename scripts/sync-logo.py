#!/usr/bin/env python3
"""Copy the page's rosette geometry and palettes to the favicon and social card."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
page = (ROOT / 'index.html').read_text()
match = re.search(r'<symbol id="rosette" viewBox="([^"]+)">(.*?)</symbol>', page, re.S)
assert match, 'Missing rosette symbol'
viewbox, art = match.groups()
art = '\n'.join(line.strip() for line in art.strip().splitlines())
roots = re.findall(r':root\s*\{([^}]+)\}', page)
assert len(roots) >= 2, 'Expected light and dark palettes'
roles = re.findall(r'var\((--[^)]+)\)', art)
palettes = []
for root in roots[:2]:
    values = dict(re.findall(r'(--[\w-]+):\s*([^;]+);', root))
    palettes.append({role: values[role] for role in dict.fromkeys(roles)})

def declarations(palette):
    return ' '.join(f'{role}: {value};' for role, value in palette.items())

favicon = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}">
  <style>
    :root {{ {declarations(palettes[0])} }}
    @media (prefers-color-scheme: dark) {{
      :root {{ {declarations(palettes[1])} }}
    }}
  </style>
{art}
</svg>
'''
(ROOT / 'favicon.svg').write_text(favicon)
fixed = art
for role, value in palettes[0].items():
    fixed = fixed.replace(f'var({role})', value)
og = (ROOT / 'og.html').read_text()
og, count = re.subn(r'<svg viewBox="[^"]+">.*?</svg>', f'<svg viewBox="{viewbox}">\n{fixed}\n  </svg>', og, count=1, flags=re.S)
assert count == 1, 'Missing social-card logo'
(ROOT / 'og.html').write_text(og)
print('Synchronized favicon.svg and og.html from index.html')
