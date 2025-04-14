// Variables du jeu
let diamonds = 0;
let diamondsPerClick = 1;
let diamondsPerSecond = 0;

// Items de la boutique
const items = {
  miner: {
    name: "Mineur",
    cost: 10,
    production: 0.1,
    count: 0,
    element: {
      cost: document.getElementById("miner-cost"),
      count: document.getElementById("miner-count"),
      production: document.getElementById("miner-production"),
      button: document.getElementById("buy-miner"),
    },
  },
  mine: {
    name: "Mine",
    cost: 50,
    production: 1,
    count: 0,
    element: {
      cost: document.getElementById("mine-cost"),
      count: document.getElementById("mine-count"),
      production: document.getElementById("mine-production"),
      button: document.getElementById("buy-mine"),
    },
  },
};

// Bonus
const upgrades = {
  pickaxe: {
    name: "Pioche en diamant",
    cost: 200,
    multiplier: 2,
    bought: false,
    element: {
      cost: document.getElementById("pickaxe-upgrade-cost"),
      button: document.getElementById("buy-pickaxe-upgrade"),
    },
  },
};

// Sauvegarde
function saveGame() {
  const gameData = {
    diamonds,
    diamondsPerClick,
    diamondsPerSecond,
    items: {
      miner: { count: items.miner.count },
      mine: { count: items.mine.count },
    },
    upgrades: {
      pickaxe: { bought: upgrades.pickaxe.bought },
    },
  };
  localStorage.setItem("diamondMinerSave", JSON.stringify(gameData));
}

// Chargement
function loadGame() {
  const savedData = localStorage.getItem("diamondMinerSave");
  if (savedData) {
    const gameData = JSON.parse(savedData);
    diamonds = gameData.diamonds;
    diamondsPerClick = gameData.diamondsPerClick;
    diamondsPerSecond = gameData.diamondsPerSecond;
    items.miner.count = gameData.items.miner.count;
    items.mine.count = gameData.items.mine.count;
    upgrades.pickaxe.bought = gameData.upgrades.pickaxe.bought;
    updateUI();
  }
}

// Mise à jour de l'interface
function updateUI() {
  document.getElementById("diamonds").textContent = Math.floor(diamonds);
  document.getElementById("diamonds-per-click").textContent = diamondsPerClick;
  document.getElementById("diamonds-per-second").textContent = diamondsPerSecond.toFixed(1);

  // Boutique
  for (const itemKey in items) {
    const item = items[itemKey];
    item.element.cost.textContent = Math.floor(item.cost);
    item.element.count.textContent = item.count;
    item.element.production.textContent = (item.production * item.count).toFixed(1);
  }

  // Bonus
  if (upgrades.pickaxe.bought) {
    upgrades.pickaxe.element.button.disabled = true;
    upgrades.pickaxe.element.button.textContent = "Déjà acheté";
  } else {
    upgrades.pickaxe.element.cost.textContent = Math.floor(upgrades.pickaxe.cost);
  }
}

// Gain de diamants (clic)
document.getElementById("clicker").addEventListener("click", () => {
  diamonds += diamondsPerClick;
  updateUI();
  saveGame();

  // Animation de gain
  const gainText = document.createElement("div");
  gainText.className = "diamond-gain";
  gainText.textContent = `+${diamondsPerClick}`;
  gainText.style.left = `${Math.random() * 100}%`;
  document.getElementById("clicker").appendChild(gainText);
  setTimeout(() => gainText.remove(), 1000);
});

// Achat d'items
for (const itemKey in items) {
  const item = items[itemKey];
  item.element.button.addEventListener("click", () => {
    if (diamonds >= item.cost) {
      diamonds -= item.cost;
      item.count++;
      item.cost = Math.floor(item.cost * 1.15); // Prix augmente
      diamondsPerSecond += item.production;
      updateUI();
      saveGame();
    }
  });
}

// Achat de bonus
upgrades.pickaxe.element.button.addEventListener("click", () => {
  if (!upgrades.pickaxe.bought && diamonds >= upgrades.pickaxe.cost) {
    diamonds -= upgrades.pickaxe.cost;
    diamondsPerClick *= upgrades.pickaxe.multiplier;
    upgrades.pickaxe.bought = true;
    updateUI();
    saveGame();
  }
});

// Boucle de jeu (production automatique)
setInterval(() => {
  diamonds += diamondsPerSecond / 10; // 10 fois par seconde pour un effet fluide
  updateUI();
  saveGame();
}, 100);

// Charger la sauvegarde au démarrage
loadGame();