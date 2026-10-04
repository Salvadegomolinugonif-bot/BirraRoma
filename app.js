let birre = [];

async function caricaPrezzi() {
    const results = document.getElementById("results");

    try {
        results.innerHTML = "<p>Caricamento birre...</p>";

        const risposta = await fetch("./prezzi.json?t=" + Date.now(), {
            cache: "no-store"
        });

        if (!risposta.ok) {
            throw new Error("Errore HTTP " + risposta.status);
        }

        birre = await risposta.json();

        if (!Array.isArray(birre)) {
            throw new Error("prezzi.json non contiene un array");
        }

        popolaSupermercati(birre);
        mostraBirre(birre);

    } catch (errore) {
        console.error("Errore caricamento prezzi:", errore);
        results.innerHTML =
            "<p>Errore nel caricamento dei prezzi.</p>";
    }
}

function popolaSupermercati(dati) {
    const filtro = document.getElementById("supermarketFilter");

    if (!filtro) return;

    const supermercati = [...new Set(
        dati.map(b => b.supermercato).filter(Boolean)
    )].sort();

    filtro.innerHTML = '<option value="">Tutti i supermercati</option>';

    supermercati.forEach(supermercato => {
        const option = document.createElement("option");
        option.value = supermercato;
        option.textContent = supermercato;
        filtro.appendChild(option);
    });
}

function mostraBirre(dati) {
    const results = document.getElementById("results");

    if (!results) return;

    if (!dati.length) {
        results.innerHTML = "<p>Nessuna birra trovata.</p>";
        return;
    }

    const ordinati = [...dati].sort(
        (a, b) => Number(a.prezzoLitro) - Number(b.prezzoLitro)
    );

    results.innerHTML = ordinati.map((birra, indice) => `
        <article class="beer-card">
            <div class="beer-name">
                ${birra.nome || ""}
            </div>

            <div class="format">
                ${birra.formato || ""}
            </div>

            <div class="supermarket">
                🛒 ${birra.supermercato || ""}
            </div>

            <div class="price">
                €${Number(birra.prezzo).toFixed(2)}
            </div>

            <div class="price-liter">
                €${Number(birra.prezzoLitro).toFixed(2)} / litro
            </div>

            ${
                birra.offerta
                ? `<div class="offer">🔥 OFFERTA</div>`
                : ""
            }

            ${
                indice === 0
                ? `<div class="best-price">⭐ MIGLIOR PREZZO</div>`
                : ""
            }
        </article>
    `).join("");
}

function applicaFiltri() {
    const testo = document
        .getElementById("searchInput")
        ?.value
        .toLowerCase()
        .trim() || "";

    const supermercato =
        document.getElementById("supermarketFilter")?.value || "";

    let risultati = birre;

    if (testo) {
        risultati = risultati.filter(b =>
            String(b.nome || "").toLowerCase().includes(testo)
        );
    }

    if (supermercato) {
        risultati = risultati.filter(b =>
            b.supermercato === supermercato
        );
    }

    mostraBirre(risultati);
}

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const supermarketFilter =
        document.getElementById("supermarketFilter");

    if (searchInput) {
        searchInput.addEventListener("input", applicaFiltri);

        searchInput.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                applicaFiltri();
            }
        });
    }

    if (supermarketFilter) {
        supermarketFilter.addEventListener("change", applicaFiltri);
    }

    caricaPrezzi();
});

setInterval(caricaPrezzi, 30 * 60 * 1000);
