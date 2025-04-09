export function showFloatingText(text) {
    const clicker = document.getElementById('clicker');
    const floatingText = document.createElement('div');
    floatingText.className = 'diamond-gain';
    floatingText.textContent = text;
    floatingText.style.left = `${Math.random() * 80 + 10}%`;
    clicker.appendChild(floatingText);
    setTimeout(() => floatingText.remove(), 1000);
  }