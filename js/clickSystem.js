import { diamonds, diamondsPerClick } from './gameState.js';
import { updateUI } from './uiSystem.js';
import { saveGame } from './saveSystem.js';

export function setupClicker() {
    document.getElementById('click-btn').addEventListener('click', () => {
        diamonds += diamondsPerClick;
        updateUI();
        saveGame();
    });
}