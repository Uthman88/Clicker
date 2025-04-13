let diamondState = 0; // État du diamant (0 = intact, 1 = fissuré, 2 = cassé)

export function updateDiamondState() {
    const diamond = document.getElementById("diamond");
    diamondState++;

    if (diamondState === 1) {
        diamond.src = "./assets/diamond_cracked1.png"; // Image fissurée 1
    } else if (diamondState === 2) {
        diamond.src = "./assets/diamond_cracked2.png"; // Image fissurée 2
    } else if (diamondState >= 3) {
        diamond.src = "./assets/diamond_broken.png"; // Image cassée
        diamond.classList.add("bounce"); // Animation de cassure
        setTimeout(() => {
            diamond.src = "../assets/diamond-clipart-design-illustration-free-png.png"; // Réinitialiser
            diamondState = 0;
        }, 1000);
    }
}