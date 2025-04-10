import { player } from './core/core.js';
import { producers, getTotalDPS, buyProducer } from './features/autoProduction.js';
import { boosts, unlockBoost, getCurrentMultiplier } from './features/boostPickaxe.js';
import { updateUI } from './system/display.js';
import { saveGame, loadGame } from './system/save.js';

// Debug : Vérifie le chargement des données
console.log("DEBUG - Données chargées :", { producers, boosts });

function init() {
    if (!loadGame()) {
        console.log("Nouvelle partie initialisée");
        boosts.woodenPickaxe.unlocked = true;
        player.diamondsPerClick = getCurrentMultiplier();
    }
    updateUI();
    setInterval(() => saveGame(), 30000);
}

// Gestion du clic principal
document.getElementById('click-btn').addEventListener('click', () => {
    player.diamonds += player.diamondsPerClick;
    player.totalClicks++;
    updateUI();
});

// Gestion des achats
document.addEventListener('click', (e) => {
    const producerId = e.target.closest('[data-producer]')?.dataset.producer;
    const boostId = e.target.closest('[data-boost]')?.dataset.boost;

    if (producerId && buyProducer(producerId)) {
        updateUI();
        saveGame();
    }

    if (boostId && unlockBoost(boostId)) {
        document.getElementById('pickaxe-img').src = `assets/images/pickaxe_${boostId.replace('Pickaxe', '').toLowerCase()}.png`;
        updateUI();
        saveGame();
    }
});

// Boucle de jeu
function gameLoop() {
    player.diamonds += getTotalDPS() / 60;
    updateUI();
    requestAnimationFrame(gameLoop);
}

init();
gameLoop();