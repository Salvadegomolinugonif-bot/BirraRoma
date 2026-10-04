let birre = [];

async function caricaPrezzi() {
    try {
        const risposta = await fetch("prezzi.json");

        if (!risposta.ok) {
            throw new Error("Database non disponibile");
        }

        birre = await risposta.json();
        mostraBirre(birre);

    } catch (errore) {
        console.error(errore);

        document.getElementById("results").innerHTML = `
            <div class="error-box">
                ⚠️ Impossibile caricare i prezzi.
            </div>
        `;
    }
}

function mostraBirre(lista) {

    const results = document.getElementById("results");

    if (lista.length === 0) {
        results.innerHTML = `
            <div class="empty-box">
                🔎 Nessun prodotto trovato.
            </div>
        `;
        return;
    }

    const ordinata = [...lista].sort(
        (a, b) => a.prezzo - b.prezzo
    );

    const migliorPrezzo = ordinata[0].prezzo;

    results.innerHTML = ordinata.map((birra) => {

        const migliore = birra.prezzo === migliorPrezzo;

        return `
            <article class="beer-card ${migliore ? "best-price" : ""}">

                ${migliore ? `
                    <div class="best-badge">
                        🏆 MIGLIOR PREZZO
                    </div>
                ` : ""}

                <div class="beer-icon">🍺</div>

                <h3>${birra.nome}</h3>

                <div class="format">
                    ${birra.formato}
                </div>

                <div class="supermarket">
                    🛒 ${birra.supermercato}
                </div>

                <div class="price">
                    €${birra.prezzo.toFixed(2)}
                </div>

                <div class="price-liter">
                    €${birra.prezzoLitro.toFixed(2)} / litro
                </div>

                ${
                    birra.offerta
                    ? `<div class="offer">🔥 OFFERTA</div>`
                    : ""
                }

                ${
                    birra.validita
                    ? `<div class="validity">
                        ⏳ ${birra.validita}
                       </div>`
                    : ""
                }

                <div class="date">
                    📅 Rilevato il ${birra.dataRilevazione}
                </div>

            </article>
        `;

    }).join("");
}

function cercaBirra() {

    const testo = document
        .getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();

    if (!testo) {
        mostraBirre(birre);
        return;
    }

    const risultati = birre.filter(birra =>
        birra.nome.toLowerCase().includes(testo)
    );

    mostraBirre(risultati);
}

document
    .getElementById("searchInput")
    .addEventListener("keyup", function(event) {

        if (event.key === "Enter") {
            cercaBirra();
        }

    });

caricaPrezzi();


backButton.addEventListener("click", () => {
    searchInput.value = "";
    backButton.style.display = "none";
    renderResults(prezzi);
});

searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();

    if (query) {
        backButton.style.display = "inline-block";
    } else {
        backButton.style.display = "none";
    }
});


/* ===== FILTRO SUPERMERCATO ===== */

const supermarketFilter = document.getElementById("supermarketFilter");

if (supermarketFilter) {
    supermarketFilter.addEventListener("change", () => {
        const supermercato = supermarketFilter.value;

        const filtrate = supermercato === "Tutti"
            ? prezzi
            : prezzi.filter(p => p.supermercato === supermercato);

        renderResults(filtrate);
    });
}
