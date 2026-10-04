let birre = [];

async function caricaPrezzi() {
    try {
        const risposta = await fetch(`prezzi.json?t=${Date.now()}`, { cache: "no-store" });

        if (!risposta.ok) {
            throw new Error("Database non disponibile");
        }

        birre = await risposta.json();

        applicaFiltri();

    } catch (errore) {
        console.error(errore);

        document.getElementById("results").innerHTML = `
            <div class="error-box">
                ⚠️ Impossibile caricare i prezzi.
                <br><br>
                Avvia BirraRoma tramite il server locale.
            </div>
        `;
    }
}

function applicaFiltri() {
    const testo = document
        .getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();

    const supermercato =
        document.getElementById("supermarketFilter").value;

    let risultati = [...birre];

    if (supermercato !== "Tutti") {
        risultati = risultati.filter(
            birra => birra.supermercato === supermercato
        );
    }

    if (testo) {
        risultati = risultati.filter(
            birra => birra.nome.toLowerCase().includes(testo)
        );
    }

    mostraBirre(risultati);
}

function mostraBirre(lista) {
    const results = document.getElementById("results");

    if (lista.length === 0) {
        results.innerHTML = `
            <div class="empty-box">
                🔎 Nessuna birra trovata.
            </div>
        `;
        return;
    }

    const ordinata = [...lista].sort(
        (a, b) => a.prezzo - b.prezzo
    );

    const migliorPrezzo = ordinata[0].prezzo;

    results.innerHTML = ordinata.map(birra => {

        const migliore =
            birra.prezzo === migliorPrezzo;

        const prezzoLitro =
            birra.prezzoLitro != null
                ? `€${Number(birra.prezzoLitro).toFixed(2)} / litro`
                : "Prezzo al litro non disponibile";

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
                    €${Number(birra.prezzo).toFixed(2)}
                </div>

                <div class="price-liter">
                    ${prezzoLitro}
                </div>

                ${birra.offerta ? `
                    <div class="offer">
                        🔥 OFFERTA
                    </div>
                ` : ""}

                ${birra.validita ? `
                    <div class="validity">
                        ⏳ ${birra.validita}
                    </div>
                ` : ""}

                <div class="date">
                    📅 Rilevato il ${birra.dataRilevazione}
                </div>

            </article>
        `;

    }).join("");
}

function cercaBirra() {
    applicaFiltri();
}

document
    .getElementById("searchInput")
    .addEventListener("keyup", function(event) {

        if (event.key === "Enter") {
            cercaBirra();
        }

    });

document
    .getElementById("searchInput")
    .addEventListener("input", applicaFiltri);

document
    .getElementById("supermarketFilter")
    .addEventListener("change", applicaFiltri);

document
    .getElementById("backButton")
    .addEventListener("click", function() {

        document.getElementById("searchInput").value = "";
        document.getElementById("supermarketFilter").value = "Tutti";
        this.style.display = "none";

        mostraBirre(birre);
    });

document
    .getElementById("searchInput")
    .addEventListener("input", function() {

        document.getElementById("backButton").style.display =
            this.value.trim() ? "inline-block" : "none";

    });

caricaPrezzi();


/* Aggiornamento automatico ogni 30 minuti */
setInterval(() => {
    caricaPrezzi();
}, 30 * 60 * 1000);
