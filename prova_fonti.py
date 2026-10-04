#!/usr/bin/env python3

import json
from pathlib import Path

BASE = Path(__file__).resolve().parent
FONTI = BASE / "fonti_birra.json"

print("========================================")
print("     BirraRoma - TEST DELLE FONTI")
print("========================================")
print()

with open(FONTI, encoding="utf-8") as f:
    fonti = json.load(f)

print("Fonti configurate:", len(fonti))
print()

for fonte in fonti:
    print("•", fonte["supermercato"])
    print("  URL:", fonte["url"])
    print("  Tipo:", fonte["tipo"])
    print()

print("========================================")
print("✅ CONFIGURAZIONE FONTI VALIDA")
print("========================================")
print()
print("⚠️ Nessun prezzo è stato modificato.")
print("⚠️ prezzi.json non è stato modificato.")
