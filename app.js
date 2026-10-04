let birre = [];

async function caricaPrezzi() {
    const results = document.getElementById("results");
    if (!results) return;

    try {
        const risposta = await fetch("./prezzi.json?t=" + Date.now(), {
            cache: "no-store"
        });

        if (!risposta.ok) {
            throw new Error("HTTP " + risposta.status);
        }

        const dati = await risposta.json();

        if (!Array.isArray(dati)) {
            throw new Error("Formato prezzi.json non valido");
        }

        birre = dati;
        mostraBirre(birre);
    } catch (errore) {
        console.error(errore);
        results.innerHTML = '<div class="error-box">⚠️ Impossibile caricare i prezzi.</div>';
    }
}

function mostraBirre(lista) {
    const results = document.getElementById("results");
    if (!results) return;

    if (!lista.length) {
        results.innerHTML = '<div class="empty-box">🔎 Nessun prodotto trovato.</div>';
        return;
    }

    const ordinata = [...lista].sort(
        (a, b) => Number(a.prezzo) - Number(b.prezzo)
    );

    const migliorPrezzo = Number(ordinata[0].prezzo);

    results.innerHTML = ordinata.map(birra => {
        const prezzo = Number(birra.prezzo);
        const prezzoLitro = Number(birra.prezzoLitro);
        const migliore = prezzo === migliorPrezzo;

        return `
            <article class="beer-card ${migliore ? "best-price" : ""}">
                ${migliore ? '<div class="best-badge">🏆 MIGLIOR PREZZO</div>' : ""}
                <div class="beer-icon">🍺</div>
                <h3>${birra.nome || ""}</h3>
                <div class="format">${birra.formato || ""}</div>
                <div class="supermarket">🛒 ${birra.supermercato || ""}</div>
                <div class="price">€${prezzo.toFixed(2)}</div>
                <div class="price-liter">€${prezzoLitro.toFixed(2)} / litro</div>
                ${birra.offerta ? '<div class="offer">🔥 OFFERTA</div>' : ""}
                ${birra.validita ? `<div class="validity">⏳ ${birra.validita}</div>` : ""}
                ${birra.dataRilevazione ? `<div class="date">📅 Rilevato il ${birra.dataRilevazione}</div>` : ""}
            </article>
        `;
    }).join("");
}

function filtraBirre() {
    const testo = (document.getElementById("searchInput")?.value || "")
        .toLowerCase()
        .trim();

    const supermercato = document.getElementById("supermarketFilter")?.value || "Tutti";

    const risultati = birre.filter(birra => {
        const nomeOK = !testo || String(birra.nome || "").toLowerCase().includes(testo);
        const supermercatoOK =
            supermercato === "Tutti" || birra.supermercato === supermercato;
        return nomeOK && supermercatoOK;
    });

    mostraBirre(risultati);

    const back = document.getElementById("backButton");
    if (back) {
        back.style.display = (testo || supermercato !== "Tutti") ? "inline-block" : "none";
    }
}

function cercaBirra() {
    filtraBirre();
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("searchInput")?.addEventListener("input", filtraBirre);
    document.getElementById("supermarketFilter")?.addEventListener("change", filtraBirre);

    document.getElementById("searchInput")?.addEventListener("keydown", event => {
        if (event.key === "Enter") filtraBirre();
    });

    document.getElementById("backButton")?.addEventListener("click", () => {
        const input = document.getElementById("searchInput");
        const filtro = document.getElementById("supermarketFilter");

        if (input) input.value = "";
        if (filtro) filtro.value = "Tutti";

        mostraBirre(birre);

        const back = document.getElementById("backButton");
        if (back) back.style.display = "none";
    });

    caricaPrezzi();
});

setInterval(caricaPrezzi, 30 * 60 * 1000);
