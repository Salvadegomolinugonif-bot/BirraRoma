#!/usr/bin/env python3

import json
import urllib.request
from pathlib import Path

BASE = Path(__file__).resolve().parent
FONTI = BASE / "fonti_birra.json"

with open(FONTI, encoding="utf-8") as f:
    fonti = json.load(f)

print("========================================")
print("   BirraRoma - TEST CONNESSIONI WEB")
print("========================================")
print()

for fonte in fonti:
    nome = fonte["supermercato"]
    url = fonte["url"]

    print(f"🔎 {nome}")
    print(f"   {url}")

    try:
        richiesta = urllib.request.Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X)"
            }
        )

        with urllib.request.urlopen(richiesta, timeout=15) as risposta:
            codice = risposta.status
            contenuto = risposta.read()

        print(f"   ✅ HTTP {codice}")
        print(f"   📄 Dati ricevuti: {len(contenuto):,} byte")

    except Exception as e:
        print(f"   ❌ ERRORE: {e}")

    print()

print("========================================")
print("✅ TEST TERMINATO")
print("========================================")
print()
print("⚠️ prezzi.json NON è stato modificato.")
