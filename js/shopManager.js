class ShopManager {
    constructor(game) {
        this.game = game;
        this.loadShopItems();
    }

    async loadShopItems() {
        try {
            const response = await fetch('data/upgrades.json');
            const items = await response.json();
            this.renderShop(items);
        } catch (error) {
            console.error('Error loading shop items:', error);
        }
    }

    renderShop(items) {
        const shopContainer = document.querySelector('.shop-container');
        items.forEach(item => {
            const html = `
                <div class="shop-item" data-id="${item.id}">
                    <h3>${item.name}</h3>
                    <p>Cost: <span class="cost">${item.baseCost}</span></p>
                    <p>Level: <span class="level">${item.level}</span></p>
                    <button class="buy-btn">Buy</button>
                </div>
            `;
            shopContainer.insertAdjacentHTML('beforeend', html);
        });

        document.querySelectorAll('.buy-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemElement = e.target.closest('.shop-item');
                this.buyItem(itemElement.dataset.id);
            });
        });
    }

    buyItem(itemId) {
        const item = this.game.upgrades[itemId];
        if (this.game.diamonds >= item.currentCost) {
            this.game.diamonds -= item.currentCost;
            item.level++;
            item.currentCost = Math.floor(item.baseCost * Math.pow(1.15, item.level));

            this.updateUI(itemId);
            AnimationController.upgradeBounce(document.querySelector(`[data-id="${itemId}"]`));
            this.game.save();
        }
    }

    updateUI(itemId) {
        const item = this.game.upgrades[itemId];
        document.querySelector(`[data-id="${itemId}"] .level`).textContent = item.level;
        document.querySelector(`[data-id="${itemId}"] .cost`).textContent = item.currentCost;
    }
}