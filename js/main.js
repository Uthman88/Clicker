import { initGame } from './gameState.js';
import { setupClicker } from './clickSystem.js';
import { setupShop } from './shopSystem.js';
import { loadGame } from './saveSystem.js';

// Initialisation
function startGame() {
    initGame();
    setupClicker();
    setupShop();
    loadGame();
}

document.addEventListener('DOMContentLoaded', startGame);