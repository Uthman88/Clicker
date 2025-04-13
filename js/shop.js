export function loadShop() {
    fetch('./data/shop.json')
        .then(response => response.json())
        .then(data => {
            renderShop(data.tools);
        })
        .catch(error => console.error("Erreur lors du chargement de la boutique :", error));
}

function renderShop(tools) {
    const shopItemsContainer = document.getElementById("producers-container");
    shopItemsContainer.innerHTML = "";

    tools.forEach(tool => {
        const item = document.createElement("div");
        item.className = "shop-item";
        item.innerHTML = `
            <span>${tool.name} - ${tool.cost} éclats</span>
            <button class="buy-btn" data-id="${tool.id}" ${score < tool.cost ? "disabled" : ""}>Acheter</button>
        `;
        shopItemsContainer.appendChild(item);
    });

    // Ajouter des événements aux boutons
    document.querySelectorAll(".buy-btn").forEach(button => {
        button.addEventListener("click", () => {
            const toolId = button.dataset.id;
            buyTool(toolId, tools);
        });
    });
}

function buyTool(toolId, tools) {
    const tool = tools.find(t => t.id === toolId);
    if (score >= tool.cost) {
        score -= tool.cost;
        currentMultiplier = tool.multiplier;
        updateScore(0); // Mettre à jour l'affichage
        loadShop(); // Réactualiser la boutique
        log.textContent = `${tool.name} acheté !`;
    } else {
        log.textContent = "Pas assez d'éclats pour acheter.";
    }
}