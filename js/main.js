import { updateDiamondState } from './diamondAnimation.js';
import { loadShop } from './shop.js';
import { showDiamondFlash } from './effects.js';

let score = 0;
let currentMultiplier = 1;

const scoreDisplay = document.getElementById("diamond-count");
const diamond = document.getElementById("diamond");
const pickaxe = document.getElementById("pickaxe");
const log = document.getElementById("log");
const shopItemsContainer = document.getElementById("producers-container");

function updateScore(points) {
    score += points * currentMultiplier;
    scoreDisplay.textContent = score;
    log.textContent = `+${points * currentMultiplier} éclat${points * currentMultiplier > 1 ? 's' : ''}`;
    localStorage.setItem("score", score);

    // Afficher la boutique après 15 clics
    if (score >= 15 && shopItemsContainer.classList.contains("hidden")) {
        shopItemsContainer.classList.remove("hidden");
    }
}

function breakDiamond() {
    diamond.classList.add("break");
    setTimeout(() => {
        diamond.classList.remove("break");
    }, 500);
}

diamond.addEventListener("click", () => {
    updateScore(1);
    updateDiamondState();
    showDiamondFlash(1);
});

pickaxe.addEventListener("click", () => {
    updateScore(2); // La pioche donne plus d'éclats
    breakDiamond();
});

window.addEventListener("load", () => {
    const saved = localStorage.getItem("score");
    if (saved) {
        score = parseInt(saved);
        scoreDisplay.textContent = score;
    }
    loadShop();
});