// Estado do jogo
let gameState = {
    crypto: 0,
    cryptoPerSecond: 0,
    clickPower: 1,
    
    // Upgrades
    upgrades: {
        clickPower: {
            level: 0,
            baseCost: 10,
            costMultiplier: 1.5,
            effect: 1
        },
        gpu: {
            count: 0,
            baseCost: 15,
            costMultiplier: 1.15,
            production: 0.1
        },
        asic: {
            count: 0,
            baseCost: 100,
            costMultiplier: 1.15,
            production: 1
        },
        farm: {
            count: 0,
            baseCost: 1000,
            costMultiplier: 1.15,
            production: 10
        },
        datacenter: {
            count: 0,
            baseCost: 10000,
            costMultiplier: 1.15,
            production: 100
        },
        quantum: {
            count: 0,
            baseCost: 100000,
            costMultiplier: 1.15,
            production: 1000
        }
    }
};

// Elementos DOM
const cryptoAmountEl = document.getElementById('cryptoAmount');
const cryptoPerSecondEl = document.getElementById('cryptoPerSecond');
const mineButton = document.getElementById('mineButton');
const clickPowerEl = document.getElementById('clickPower');

// Formatar números grandes
function formatNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return Math.floor(num).toString();
}

// Atualizar display
function updateDisplay() {
    cryptoAmountEl.textContent = formatNumber(gameState.crypto);
    cryptoPerSecondEl.textContent = formatNumber(gameState.cryptoPerSecond);
    clickPowerEl.textContent = formatNumber(gameState.clickPower);
    
    // Atualizar custos e contadores
    updateUpgradeCost('clickPower');
    updateUpgradeCount('clickPower');
    
    ['gpu', 'asic', 'farm', 'datacenter', 'quantum'].forEach(upgrade => {
        updateUpgradeCost(upgrade);
        updateUpgradeCount(upgrade);
    });
    
    // Desabilitar botões se não tiver crypto suficiente
    updateBuyButtons();
}

// Calcular custo do upgrade
function getUpgradeCost(upgradeName) {
    const upgrade = gameState.upgrades[upgradeName];
    if (upgradeName === 'clickPower') {
        return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level));
    } else {
        return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.count));
    }
}

// Atualizar custo do upgrade no display
function updateUpgradeCost(upgradeName) {
    const costEl = document.getElementById(upgradeName + 'Cost');
    if (costEl) {
        costEl.textContent = formatNumber(getUpgradeCost(upgradeName));
    }
}

// Atualizar contador do upgrade
function updateUpgradeCount(upgradeName) {
    if (upgradeName === 'clickPower') {
        const levelEl = document.getElementById('clickPowerLevel');
        if (levelEl) {
            levelEl.textContent = gameState.upgrades.clickPower.level;
        }
    } else {
        const countEl = document.getElementById(upgradeName + 'Count');
        if (countEl) {
            countEl.textContent = gameState.upgrades[upgradeName].count;
        }
    }
}

// Atualizar estado dos botões de compra
function updateBuyButtons() {
    document.querySelectorAll('.buy-button').forEach(button => {
        const upgradeEl = button.closest('.upgrade-item');
        const upgradeName = upgradeEl.dataset.upgrade;
        const cost = getUpgradeCost(upgradeName);
        button.disabled = gameState.crypto < cost;
    });
}

// Minerar (click)
mineButton.addEventListener('click', (e) => {
    gameState.crypto += gameState.clickPower;
    
    // Criar número flutuante
    createFloatingNumber(e.pageX, e.pageY, '+' + formatNumber(gameState.clickPower));
    
    updateDisplay();
});

// Criar número flutuante
function createFloatingNumber(x, y, text) {
    const floatingNum = document.createElement('div');
    floatingNum.className = 'floating-number';
    floatingNum.textContent = text;
    floatingNum.style.left = x + 'px';
    floatingNum.style.top = y + 'px';
    document.body.appendChild(floatingNum);
    
    setTimeout(() => floatingNum.remove(), 1000);
}

// Comprar upgrade
function buyUpgrade(upgradeName) {
    const cost = getUpgradeCost(upgradeName);
    
    if (gameState.crypto >= cost) {
        gameState.crypto -= cost;
        
        if (upgradeName === 'clickPower') {
            gameState.upgrades.clickPower.level++;
            gameState.clickPower += gameState.upgrades.clickPower.effect;
        } else {
            gameState.upgrades[upgradeName].count++;
            calculateCryptoPerSecond();
        }
        
        updateDisplay();
        saveGame();
    }
}

// Calcular produção por segundo
function calculateCryptoPerSecond() {
    gameState.cryptoPerSecond = 0;
    
    ['gpu', 'asic', 'farm', 'datacenter', 'quantum'].forEach(upgradeName => {
        const upgrade = gameState.upgrades[upgradeName];
        gameState.cryptoPerSecond += upgrade.count * upgrade.production;
    });
}

// Loop de produção automática
function productionLoop() {
    if (gameState.cryptoPerSecond > 0) {
        gameState.crypto += gameState.cryptoPerSecond / 10; // Dividido por 10 porque roda 10x por segundo
        updateDisplay();
    }
}

// Salvar jogo
function saveGame() {
    localStorage.setItem('cryptoMinerSave', JSON.stringify(gameState));
}

// Carregar jogo
function loadGame() {
    const save = localStorage.getItem('cryptoMinerSave');
    if (save) {
        gameState = JSON.parse(save);
        calculateCryptoPerSecond();
        updateDisplay();
    }
}

// Resetar jogo
function resetGame() {
    if (confirm('Tem certeza que deseja resetar o jogo? Todo progresso será perdido!')) {
        localStorage.removeItem('cryptoMinerSave');
        location.reload();
    }
}

// Criar partículas de fundo
function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = Math.random() * 5 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = Math.random() * 10 + 10 + 's';
        particlesContainer.appendChild(particle);
    }
}

// Inicializar jogo
window.addEventListener('load', () => {
    loadGame();
    createParticles();
    
    // Loop de produção (10x por segundo)
    setInterval(productionLoop, 100);
    
    // Auto-save a cada 30 segundos
    setInterval(saveGame, 30000);
});

// Salvar ao fechar a página
window.addEventListener('beforeunload', saveGame);

// Adicionar efeito de som (opcional)
function playClickSound() {
    // Pode adicionar um som de clique aqui se desejar
}

// Sistema de conquistas (futuro)
const achievements = {
    firstClick: {
        name: "Primeiro Click",
        description: "Faça seu primeiro click",
        condition: () => gameState.crypto >= 1,
        unlocked: false
    },
    hundred: {
        name: "Centenário",
        description: "Acumule 100 Bitcoins",
        condition: () => gameState.crypto >= 100,
        unlocked: false
    },
    // Adicione mais conquistas aqui
};

// Verificar conquistas
function checkAchievements() {
    for (let key in achievements) {
        const achievement = achievements[key];
        if (!achievement.unlocked && achievement.condition()) {
            achievement.unlocked = true;
            showAchievement(achievement);
        }
    }
}

// Mostrar notificação de conquista
function showAchievement(achievement) {
    // Implementar notificação visual de conquista
    console.log(`Conquista desbloqueada: ${achievement.name}`);
}