import { player } from '../core/core.js';
import prodData from '../../json/autoProduction.json';

export const producers = {};

// Initialize producers
Object.entries(prodData).forEach(([id, data]) => {
    producers[id] = {
        ...data,
        owned: 0,
        currentCost: data.baseCost
    };
});

export function getTotalDPS() {
    return Object.values(producers).reduce((total, p) => {
        return total + (p.baseProduction * p.owned);
    }, 0);
}

export function buyProducer(producerId) {
    const prod = producers[producerId];
    if (player.diamonds >= prod.currentCost) {
        player.diamonds -= prod.currentCost;
        prod.owned++;
        prod.currentCost = Math.floor(prod.baseCost * 1.15 ** prod.owned);
        return true;
    }
    return false;
}