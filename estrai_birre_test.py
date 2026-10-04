#!/usr/bin/env python3

import json
import urllib.request
import re
from datetime import datetime

PAROLE_BIRRA = [
    "birra",
    "heineken",
    "peroni",
    "moretti",
    "ichnusa",
    "tuborg",
    "corona",
    "leffe",
    "ceres",
    "bavaria",
    "bud",
    "beck",
    "tennent",
    "raffo",
    "menabrea",
    "munsterbräu",
    "best brau",
    "spoken beer",
    "dahlberg"
]

ESCLUSIONI = [
    "peperoni",
    "calici",
    "bicchieri",
    "set calici",
    "caponata",
    "sottobicchieri"
]

with open("fonti_birra.json", encoding="utf-8") as f:
    fonti = json.load(f)

pattern = r'\\"nome\\":\\"(.*?)\\",\\"prezzo\\":([0-9.]+).*?\\"categoria\\":\\"(.*?)\\",\\"formato\\":\\"(.*?)\\"'

oggi = datetime.now().strftime("%d/%m/%Y")

for fonte in fonti:

    supermercato = fonte["supermercato"]
    url = fonte["url"]

    print()
    print("========================================")
    print(supermercato)
    print("========================================")

    try:
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "Mozilla/5.0"}
        )

        with urllib.request.urlopen(req, timeout=20) as r:
            html = r.read().decode("utf-8", errors="ignore")

        prodotti = re.findall(pattern, html)

        trovati = 0

        for nome, prezzo, categoria, formato in prodotti:

            nome_lower = nome.lower()

            if any(esclusione in nome_lower for esclusione in ESCLUSIONI):
                continue

            if not any(parola in nome_lower for parola in PAROLE_BIRRA):
                continue

            trovati += 1

            print(f"🍺 {nome}")
            print(f"   Prezzo: €{prezzo}")
            print(f"   Formato: {formato}")
            print(f"   Supermercato: {supermercato}")
            print(f"   Rilevazione: {oggi}")
            print()

        print(f"Totale birre trovate: {trovati}")

    except Exception as e:
        print("❌ ERRORE:", e)

print()
print("========================================")
print("✅ TEST COMPLETATO")
print("========================================")
print()
print("⚠️ prezzi.json NON modificato.")
