import json
import re

with open("prezzi_online_test.json", encoding="utf-8") as f:
    dati = json.load(f)

risultati = []

for p in dati:
    formato = p["formato"].lower().replace(",", ".")

    # Esempio: "Conf. 6 pezzi 330 ml Cad."
    m = re.search(
        r"(\d+)\s*(?:pezzi|x)\s*(\d+(?:\.\d+)?)\s*(cl|ml|l)",
        formato
    )

    if m:
        quantita = int(m.group(1))
        volume = float(m.group(2))
        unita = m.group(3)

        volume_totale = quantita * volume

    else:
        # Esempio: "330 ml", "66 cl", "1 l"
        m = re.search(
            r"(\d+(?:\.\d+)?)\s*(cl|ml|l)",
            formato
        )

        if m:
            volume_totale = float(m.group(1))
            unita = m.group(2)
        else:
            volume_totale = None
            unita = None

    if volume_totale is None:
        prezzo_litro = None
    else:
        if unita == "cl":
            litri = volume_totale / 100
        elif unita == "ml":
            litri = volume_totale / 1000
        else:
            litri = volume_totale

        prezzo_litro = round(p["prezzo"] / litri, 2)

    risultati.append({
        **p,
        "prezzoLitro": prezzo_litro
    })

with open("prezzi_online_calcolati.json", "w", encoding="utf-8") as f:
    json.dump(risultati, f, ensure_ascii=False, indent=2)

print("✅ RICALCOLO COMPLETATO")
print("✅ Prodotti:", len(risultati))

for p in risultati:
    if "Moretti" in p["nome"]:
        print("🍺 Moretti:", p["formato"], "→ €" + format(p["prezzoLitro"], ".2f") + "/L")
