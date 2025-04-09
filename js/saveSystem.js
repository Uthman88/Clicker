import { diamonds, items } from './gameState.js';

export function saveGame() {
    const gameData = {
        diamonds,
        items
    };
    localStorage.setItem('diamondMinerSave', JSON.stringify(gameData));
}

export function loadGame() {
    const savedData = localStorage.getItem('diamondMinerSave');
    if (savedData) {
        const { diamonds: savedDiamonds, items: savedItems } = JSON.parse(savedData);
        diamonds = savedDiamonds;
        Object.assign(items, savedItems);
    }
}