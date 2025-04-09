import { diamonds, items } from './gameState.js';
import { updateUI } from './uiSystem.js';
import { saveGame } from './saveSystem.js';

export function setupShop() {
    document.querySelectorAll('.shop-item').forEach(button => {
        button.addEventListener('click', () => {
            const itemType = button.dataset.item;
            const item = items[itemType];
            
            if (diamonds >= item.cost) {
                diamonds -= item.cost;
                item.count++;
                item.cost = Math.floor(item.cost * 1.15); // Inflation
                updateUI();
                saveGame();
            }
        });
    });
}