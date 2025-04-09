// Variables exportées (modifiables)
export let diamonds = 0;
export let diamondsPerClick = 1;
export let diamondsPerSecond = 0;

// Items de la boutique
export const items = {
    miner: {
        cost: 10,
        production: 0.1,
        count: 0
    },
    mine: {
        cost: 50,
        production: 1,
        count: 0
    }
};

export function initGame() {
    console.log("Game initialized");
}