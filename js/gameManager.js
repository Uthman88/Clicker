class GameManager {
    constructor() {
        this.diamonds = 0;
        this.upgrades = {
            pickaxe: { level: 1, baseCost: 50, currentCost: 50, production: 1 },
            autoClicker: { level: 0, baseCost: 100, currentCost: 100, production: 0.1 }
        };

        this.load();
        this.initHandlers();
        this.startGameLoop();
    }

    initHandlers() {
        document.getElementById("diamond").addEventListener("click", (e) => {
            const rect = e.target.getBoundingClientRect();
            AnimationController.diamondExplosion(
                e.clientX - rect.left,
                e.clientY - rect.top
            );
            this.addDiamonds(this.getClickPower());
        });
    }

    getClickPower() {
        return this.upgrades.pickaxe.level * this.upgrades.pickaxe.production;
    }

    addDiamonds(amount) {
        this.diamonds += amount;
        document.getElementById("diamond-count").textContent = Math.floor(this.diamonds);
    }

    startGameLoop() {
        setInterval(() => {
            this.addDiamonds(this.upgrades.autoClicker.level * this.upgrades.autoClicker.production);
        }, 1000);
    }

    save() {
        localStorage.setItem('desertMinerSave', JSON.stringify({
            diamonds: this.diamonds,
            upgrades: this.upgrades
        }));
    }

    load() {
        const save = JSON.parse(localStorage.getItem('desertMinerSave'));
        if (save) {
            this.diamonds = save.diamonds || 0;
            this.upgrades = save.upgrades || this.upgrades;
        }
    }
}