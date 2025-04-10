import { player } from '../core/core.js';
import { producers } from '../feautures/autoProduction.js';
import { boosts } from '../feautures/boostPickaxe.js';

export function updateUI() {
    console.log("Mise à jour UI - Diamants:", player.diamonds);

    // Diamants
    document.getElementById('diamond-count').textContent = Math.floor(player.diamonds);

    // Producteurs
    document.getElementById('producers-container').innerHTML = Object.entries(producers).map(([id, p]) => `
        <div class="producer-card">
            <h3>${p.name} (${p.owned})</h3>
            <p>${p.description} | ${(p.baseProduction * p.owned).toFixed(1)} 💎/sec</p>
            <button class="buy-btn" data-producer="${id}" ${player.diamonds < p.currentCost ? 'disabled' : ''}>
                Acheter (${Math.floor(p.currentCost)} 💎)
            </button>
        </div>
    `).join('');

    // Boosts
    document.getElementById('boosts-container').innerHTML = Object.entries(boosts).map(([id, b]) => `
        <div class="boost-card ${b.unlocked ? 'unlocked' : 'locked'}">
            <h3>${b.name}</h3>
            <p>${b.description}</p>
            ${!b.unlocked ? `
                <button class="buy-btn" data-boost="${id}" ${player.diamonds < b.cost ? 'disabled' : ''}>
                    Débloquer (${b.cost} 💎)
                </button>
            ` : '✅ Débloqué'}
        </div>
    `).join('');
}