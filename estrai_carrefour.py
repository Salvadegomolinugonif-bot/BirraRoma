#!/usr/bin/env python3

import re
from pathlib import Path

FILE = Path("carrefour_test.html")
html = FILE.read_text(encoding="utf-8", errors="ignore")

pattern = r'\\"nome\\":\\"(.*?)\\",\\"prezzo\\":([0-9.]+).*?\\"categoria\\":\\"(.*?)\\",\\"formato\\":\\"(.*?)\\"'

prodotti = re.findall(pattern, html)

print("========================================")
print("   BirraRoma - ESTRAZIONE CARREFOUR")
print("========================================")
print()

trovati = 0

for nome, prezzo, categoria, formato in prodotti:

    if categoria.lower() != "vini e birre":
        continue

    if "birr" not in nome.lower():
        continue

    trovati += 1

    print(f"🍺 {nome}")
    print(f"   Prezzo: €{prezzo}")
    print(f"   Formato: {formato}")
    print()

print("========================================")
print(f"✅ Birre trovate: {trovati}")
print("========================================")
print()
print("⚠️ prezzi.json NON è stato modificato.")
