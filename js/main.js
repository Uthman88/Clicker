let score = 0;
let tools = [];
let currentMultiplier = 1;

const scoreDisplay = document.getElementById("diamond-count");
const diamond = document.getElementById("diamond");
const pickaxe = document.getElementById("pickaxe");
const log = document.getElementById("log");
const shop = document.querySelector(".shop-section");
const shopItemsContainer = document.getElementById("producers-container");

function updateScore(points) {
    score += points * currentMultiplier;
    scoreDisplay.textContent = score;
    log.textContent = `+${points * currentMultiplier} éclat${points * currentMultiplier > 1 ? 's' : ''}`;
    localStorage.setItem("score", score);

    // Afficher la boutique après 15 clics
    if (score >= 15 && shop.classList.contains("hidden")) {
        shop.classList.remove("hidden");
    }
}

function breakDiamond() {
    diamond.classList.add("break");
    setTimeout(() => {
        diamond.classList.remove("break");
    }, 500);
}

function loadShop() {
    fetch('./data/shop.json')
        .then(response => response.json())
        .then(data => {
            tools = data.tools;
            renderShop();
        })
        .catch(error => console.error('Erreur lors du chargement de la boutique:', error));
}

function renderShop() {
    shopItemsContainer.innerHTML = '';
    tools.forEach(tool => {
        const item = document.createElement('div');
        item.className = 'shop-item';
        item.innerHTML = `
            <span>${tool.name} - ${tool.cost} éclats</span>
            <button id="buy-${tool.id}" ${score < tool.cost ? 'disabled' : ''}>Acheter</button>
        `;
        shopItemsContainer.appendChild(item);

        document.getElementById(`buy-${tool.id}`).addEventListener('click', () => {
            if (score >= tool.cost) {
                score -= tool.cost;
                currentMultiplier = tool.multiplier;
                scoreDisplay.textContent = score;
                log.textContent = `${tool.name} acheté !`;
                renderShop(); // Mettre à jour les boutons
            } else {
                log.textContent = "Pas assez d'éclats pour acheter.";
            }
        });
    });
}

diamond.addEventListener("click", () => {
    updateScore(1);
    breakDiamond();
});

pickaxe.addEventListener("click", () => {
    updateScore(2); // La pioche donne plus d'éclats
    breakDiamond();
});

window.addEventListener("load", () => {
    const saved = localStorage.getItem("score");
    if (saved) {
        score = parseInt(saved);
        scoreDisplay.textContent = score;
    }
    loadShop();
});