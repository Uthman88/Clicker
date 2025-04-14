// Variables du jeu
let diamonds = 0;
let totalProduced = 0;
let clickValue = 1;
let productionRate = 0;
let globalMultiplier = 1;
let upgrades = [];
let boosts = [];
let ownedUpgrades = {};
let ownedBoosts = {};

// Éléments DOM
const elements = {
    diamondCounter: document.getElementById('diamond-counter'),
    totalProduced: document.getElementById('total-produced'),
    productionRate: document.getElementById('production-rate'),
    globalMultiplier: document.getElementById('global-multiplier'),
    clickValue: document.getElementById('click-value'),
    upgradesContainer: document.getElementById('upgrades-container'),
    boostsContainer: document.getElementById('boosts-container'),
    ownedUpgrades: document.getElementById('owned-upgrades'),
    ownedBoosts: document.getElementById('owned-boosts'),
    diamond: document.getElementById('diamond'),
    clickSound: document.getElementById('click-sound'),
    buySound: document.getElementById('buy-sound')
};

// Initialisation du jeu
async function initGame() {
    await loadGameData();
    loadSave();
    setupEventListeners();
    renderGame();
    startGameLoop();
    setInterval(saveGame, 30000);
}

// Chargement des données JSON
async function loadGameData() {
    try {
        const response = await fetch('json/data.json');
        const data = await response.json();
        
        upgrades = data.ameliorations.map(upgrade => ({
            ...upgrade,
            basePrix: upgrade.prix
        }));
        
        boosts = data.boosts.map(boost => ({
            ...boost,
            // Convertit les multiplicateurs en valeurs additives
            bonus: boost.multiplicateur - 1
        }));
        
        upgrades.forEach(upgrade => {
            ownedUpgrades[upgrade.id] = ownedUpgrades[upgrade.id] || 0;
        });
        
        boosts.forEach(boost => {
            ownedBoosts[boost.id] = ownedBoosts[boost.id] || false;
        });
    } catch (error) {
        console.error("Erreur de chargement des données:", error);
    }
}

// Calcul du prix avec augmentation exponentielle (15% par achat)
function getUpgradePrice(id, ownedCount) {
    const upgrade = upgrades.find(u => u.id === id);
    return Math.floor(upgrade.basePrix * Math.pow(1.15, ownedCount));
}

// Sauvegarde du jeu
function saveGame() {
    const gameData = {
        diamonds,
        totalProduced,
        clickValue,
        productionRate,
        globalMultiplier,
        ownedUpgrades,
        ownedBoosts,
        lastSave: Date.now()
    };
    localStorage.setItem('diamondMinerSave', JSON.stringify(gameData));
}

// Chargement de la sauvegarde
function loadSave() {
    const savedData = localStorage.getItem('diamondMinerSave');
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            diamonds = parsedData.diamonds || 0;
            totalProduced = parsedData.totalProduced || 0;
            clickValue = parsedData.clickValue || 1;
            productionRate = parsedData.productionRate || 0;
            globalMultiplier = parsedData.globalMultiplier || 1;
            ownedUpgrades = parsedData.ownedUpgrades || {};
            ownedBoosts = parsedData.ownedBoosts || {};
        } catch (e) {
            console.error("Erreur de chargement de la sauvegarde:", e);
        }
    }
}

// Calcul de la production (avec limite à x10)
function calculateProduction() {
    let baseProduction = 0;
    upgrades.forEach(upgrade => {
        baseProduction += upgrade.production_sec * (ownedUpgrades[upgrade.id] || 0);
    });
    return baseProduction * Math.min(globalMultiplier, 10);
}

// Valeur du clic (avec limite à x10)
function calculateClickValue() {
    return clickValue * Math.min(globalMultiplier, 10);
}

// Affichage de la boutique
function renderShop() {
    elements.upgradesContainer.innerHTML = '';
    upgrades.forEach(upgrade => {
        const owned = ownedUpgrades[upgrade.id] || 0;
        const currentPrice = getUpgradePrice(upgrade.id, owned);
        
        const upgradeElement = document.createElement('div');
        upgradeElement.className = 'shop-item';
        upgradeElement.innerHTML = `
            <img src="${upgrade.image}" alt="${upgrade.nom}">
            <div class="shop-item-info">
                <h3>${upgrade.nom}</h3>
                <p>${upgrade.production_sec.toFixed(1)}/s | Possédés: ${owned}</p>
                <p>Prix: ${currentPrice} diamants</p>
            </div>
            <button onclick="buyUpgrade(${upgrade.id})" ${diamonds < currentPrice ? 'disabled' : ''}>
                Acheter
            </button>
        `;
        elements.upgradesContainer.appendChild(upgradeElement);
    });
    
    elements.boostsContainer.innerHTML = '';
    boosts.forEach(boost => {
        const boostElement = document.createElement('div');
        boostElement.className = 'shop-item';
        boostElement.innerHTML = `
            <img src="${boost.image}" alt="${boost.nom}">
            <div class="shop-item-info">
                <h3>${boost.nom}</h3>
                <p>Bonus: +${boost.bonus} au multiplicateur</p>
                <p>Prix: ${boost.prix} diamants</p>
            </div>
            <button onclick="buyBoost(${boost.id})" ${ownedBoosts[boost.id] || diamonds < boost.prix ? 'disabled' : ''}>
                ${ownedBoosts[boost.id] ? 'Acheté' : 'Acheter'}
            </button>
        `;
        elements.boostsContainer.appendChild(boostElement);
    });
}

// Affichage des possessions
function renderOwnedItems() {
    elements.ownedUpgrades.innerHTML = '';
    upgrades.forEach(upgrade => {
        const owned = ownedUpgrades[upgrade.id] || 0;
        if (owned > 0) {
            const itemElement = document.createElement('div');
            itemElement.className = 'owned-item';
            itemElement.innerHTML = `
                <img src="${upgrade.image}" alt="${upgrade.nom}">
                <span>${upgrade.nom} (x${owned})</span>
            `;
            elements.ownedUpgrades.appendChild(itemElement);
        }
    });
    
    elements.ownedBoosts.innerHTML = '';
    boosts.forEach(boost => {
        if (ownedBoosts[boost.id]) {
            const itemElement = document.createElement('div');
            itemElement.className = 'owned-item';
            itemElement.innerHTML = `
                <img src="${boost.image}" alt="${boost.nom}">
                <span>${boost.nom} (+${boost.bonus})</span>
            `;
            elements.ownedBoosts.appendChild(itemElement);
        }
    });
}

// Achat d'amélioration
function buyUpgrade(id) {
    const owned = ownedUpgrades[id] || 0;
    const currentPrice = getUpgradePrice(id, owned);
    
    if (diamonds >= currentPrice) {
        diamonds -= currentPrice;
        ownedUpgrades[id] = owned + 1;
        
        updateGameStats();
        renderShop();
        renderOwnedItems();
        
        elements.buySound.currentTime = 0;
        elements.buySound.play();
        saveGame();
    }
}

// Achat de boost
function buyBoost(id) {
    const boost = boosts.find(b => b.id === id);
    if (!ownedBoosts[boost.id] && diamonds >= boost.prix) {
        diamonds -= boost.prix;
        ownedBoosts[boost.id] = true;
        globalMultiplier += boost.bonus; // Addition au lieu de multiplication
        
        updateGameStats();
        renderShop();
        renderOwnedItems();
        
        elements.buySound.currentTime = 0;
        elements.buySound.play();
        saveGame();
    }
}

// Mise à jour de l'interface
function updateGameStats() {
    productionRate = calculateProduction();
    clickValue = calculateClickValue();
    
    elements.diamondCounter.textContent = `${Math.floor(diamonds)} Diamants`;
    elements.totalProduced.textContent = Math.floor(totalProduced);
    elements.productionRate.textContent = productionRate.toFixed(1);
    elements.globalMultiplier.textContent = globalMultiplier.toFixed(1);
    elements.clickValue.textContent = clickValue.toFixed(1);
}

// Boucle de jeu principale (10 fois par seconde pour fluidité)
function startGameLoop() {
    setInterval(() => {
        const production = calculateProduction() / 10;
        diamonds += production;
        totalProduced += production;
        updateGameStats();
    }, 100);
}

// Gestion des événements
function setupEventListeners() {
    elements.diamond.addEventListener('click', () => {
        diamonds += clickValue;
        totalProduced += clickValue;
        updateGameStats();
        
        elements.clickSound.currentTime = 0;
        elements.clickSound.play();
    });
    
    window.addEventListener('beforeunload', saveGame);
}

// Rendu initial
function renderGame() {
    renderShop();
    renderOwnedItems();
    updateGameStats();
}

// Démarrer le jeu
initGame();