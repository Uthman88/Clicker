import { diamonds, items } from './gameState.js';

export function updateUI() {
    // Mise à jour du compteur
    document.getElementById('diamond-count').textContent = diamonds;
    
    // Mise à jour de la boutique
    document.querySelector('[data-item="miner"]').textContent = 
        `Mineur (${items.miner.cost}💎) x${items.miner.count}`;
    
    document.querySelector('[data-item="mine"]').textContent = 
        `Mine (${items.mine.cost}💎) x${items.mine.count}`;
}