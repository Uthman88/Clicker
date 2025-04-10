import { player } from '../core/core.js';
import boostData from '../../json/boostPickaxe.json';

export const boosts = {};

// Initialize boosts
Object.entries(boostData).forEach(([id, data]) => {
    boosts[id] = {
        ...data,
        unlocked: data.unlockedByDefault || false
    };
});

export function getCurrentMultiplier() {
    return Math.max(
        ...Object.values(boosts)
            .filter(b => b.unlocked)
            .map(b => b.multiplier)
    );
}

export function unlockBoost(boostId) {
    const boost = boosts[boostId];
    if (!boost.unlocked && player.diamonds >= boost.cost) {
        player.diamonds -= boost.cost;
        boost.unlocked = true;
        player.diamondsPerClick = getCurrentMultiplier();
        return true;
    }
    return false;
}