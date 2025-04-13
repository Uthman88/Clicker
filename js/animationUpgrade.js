class AnimationController {
    static diamondExplosion(x, y) {
        const particlesCount = 15;
        for (let i = 0; i < particlesCount; i++) {
            const particle = document.createElement("div");
            particle.className = "diamond-particle";
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            document.body.appendChild(particle);

            const angle = (Math.PI * 2 * i) / particlesCount;
            const speed = Math.random() * 50 + 50;
            setTimeout(() => {
                particle.style.transform = `translate(
                    ${Math.cos(angle) * speed}px, 
                    ${Math.sin(angle) * speed}px
                )`;
                particle.style.opacity = '0';
            }, 10);

            setTimeout(() => particle.remove(), 1000);
        }
    }

    static upgradeBounce(element) {
        element.classList.add("bounce-upgrade");
        setTimeout(() => element.classList.remove("bounce-upgrade"), 500);
    }
}