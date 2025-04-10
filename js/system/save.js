import { player, game } from '../core/core.js';
import { producers } from '../features/autoProduction.js';
import { boosts } from '../features/boostPickaxe.js';

export function saveGame() {
    const saveData = {
        version: game.version,
        player: {
            diamonds: player.diamonds,
            diamondsPerClick: player.diamondsPerClick,
            totalClicks: player.totalClicks
        },
        producers: Object.fromEntries(
            Object.entries(producers).map(([id, p]) => [id, p.owned])
        ),
        boosts: Object.fromEntries(
            Object.entries(boosts).map(([id, b]) => [id, b.unlocked])
        ),
        timestamp: Date.now()
    };
    localStorage.setItem('diamondMinerSave', JSON.stringify(saveData));
    game.lastSave = Date.now();
}

export function loadGame() {
    const save = localStorage.getItem('diamondMinerSave');
    if (!save) return false;

    const data = JSON.parse(save);
    if (data.version !== game.version) return false;

    // Load player data
    Object.assign(player, data.player);

    // Load producers
    Object.entries(data.producers || {}).forEach(([id, owned]) => {
        if (producers[id]) producers[id].owned = owned;
    });

    // Load boosts
    Object.entries(data.boosts || {}).forEach(([id, unlocked]) => {
        if (boosts[id]) boosts[id].unlocked = unlocked;
    });

    return true;
}