#!/usr/bin/env python3

import json
from pathlib import Path
from datetime import datetime

BASE = Path(__file__).resolve().parent
DATABASE = BASE / "prezzi.json"

def carica_database():
    with open(DATABASE, encoding="utf-8") as f:
        return json.load(f)

def controlla_database(dati):
    obbligatori = [
        "nome",
        "formato",
        "supermercato",
        "prezzo",
        "prezzoLitro"
    ]

    errori = []

    for i, prodotto in enumerate(dati, 1):
        for campo in obbligatori:
            if campo not in prodotto:
                errori.append(
                    f"Prodotto {i}: manca il campo '{campo}'"
                )

    return errori

def main():
    oggi = datetime.now().strftime("%d/%m/%Y")

    print("========================================")
    print("        BirraRoma - AGGIORNAMENTO")
    print("========================================")
    print("Data:", oggi)
    print()

    dati = carica_database()

    print("Prodotti presenti:", len(dati))

    errori = controlla_database(dati)

    if errori:
        print()
        print("❌ ERRORI NEL DATABASE:")
        for errore in errori:
            print(" -", errore)
        raise SystemExit(1)

    supermercati = sorted(
        set(p["supermercato"] for p in dati)
    )

    print()
    print("Supermercati:")
    for supermercato in supermercati:
        totale = sum(
            1 for p in dati
            if p["supermercato"] == supermercato
        )
        print(f" - {supermercato}: {totale}")

    print()
    print("✅ DATABASE CONTROLLATO")
    print()
    print("ℹ️  Raccolta automatica dei nuovi prezzi")
    print("    verrà aggiunta nei prossimi passaggi.")

if __name__ == "__main__":
    main()
