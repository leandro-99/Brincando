// Estado do jogo
let gameState = {
    money: 0,
    clickValue: 1,
    moneyPerSecond: 0,
    totalClicks: 0,
    totalMoneyEarned: 0,
    upgrades: {},
    achievements: {},
    lastSave: Date.now()
};

// Configuração dos upgrades
const upgrades = [
    {
        id: 'clickUpgrade',
        name: '🖱️ Melhor Mouse',
        description: 'Aumenta o valor por clique em 1',
        baseCost: 10,
        costMultiplier: 1.15,
        effect: (owned) => ({ clickValue: owned }),
        type: 'click'
    },
    {
        id: 'autoClicker',
        name: '⚡ Auto Clicker',
        description: 'Gera 1 dinheiro por segundo automaticamente',
        baseCost: 50,
        costMultiplier: 1.15,
        effect: (owned) => ({ moneyPerSecond: owned }),
        type: 'passive'
    },
    {
        id: 'doubleClick',
        name: '🎯 Clique Duplo',
        description: 'Dobra o valor por clique',
        baseCost: 100,
        costMultiplier: 2,
        effect: (owned) => ({ clickValue: owned * 2 }),
        type: 'click'
    },
    {
        id: 'megaClicker',
        name: '🚀 Mega Clicker',
        description: 'Gera 5 dinheiro por segundo',
        baseCost: 500,
        costMultiplier: 1.2,
        effect: (owned) => ({ moneyPerSecond: owned * 5 }),
        type: 'passive'
    },
    {
        id: 'goldenClick',
        name: '💰 Clique Dourado',
        description: 'Triplica o valor por clique',
        baseCost: 1000,
        costMultiplier: 2.5,
        effect: (owned) => ({ clickValue: owned * 3 }),
        type: 'click'
    },
    {
        id: 'factory',
        name: '🏭 Fábrica',
        description: 'Gera 25 dinheiro por segundo',
        baseCost: 5000,
        costMultiplier: 1.3,
        effect: (owned) => ({ moneyPerSecond: owned * 25 }),
        type: 'passive'
    },
    {
        id: 'empire',
        name: '🏢 Império',
        description: 'Gera 100 dinheiro por segundo',
        baseCost: 25000,
        costMultiplier: 1.4,
        effect: (owned) => ({ moneyPerSecond: owned * 100 }),
        type: 'passive'
    },
    {
        id: 'universe',
        name: '🌌 Universo',
        description: 'Gera 1000 dinheiro por segundo',
        baseCost: 100000,
        costMultiplier: 1.5,
        effect: (owned) => ({ moneyPerSecond: owned * 1000 }),
        type: 'passive'
    }
];

// Configuração dos achievements
const achievements = [
    {
        id: 'firstClick',
        name: '🎯 Primeiro Clique',
        description: 'Faça seu primeiro clique',
        condition: () => gameState.totalClicks >= 1,
        reward: 10
    },
    {
        id: 'hundredClicks',
        name: '💯 Cem Cliques',
        description: 'Faça 100 cliques',
        condition: () => gameState.totalClicks >= 100,
        reward: 50
    },
    {
        id: 'thousandClicks',
        name: '🏆 Mil Cliques',
        description: 'Faça 1000 cliques',
        condition: () => gameState.totalClicks >= 1000,
        reward: 200
    },
    {
        id: 'firstUpgrade',
        name: '🛒 Primeira Compra',
        description: 'Compre seu primeiro upgrade',
        condition: () => Object.values(gameState.upgrades).some(count => count > 0),
        reward: 25
    },
    {
        id: 'rich',
        name: '💰 Rico',
        description: 'Tenha $1000',
        condition: () => gameState.money >= 1000,
        reward: 100
    },
    {
        id: 'millionaire',
        name: '💎 Milionário',
        description: 'Tenha $1000000',
        condition: () => gameState.money >= 1000000,
        reward: 10000
    },
    {
        id: 'passiveIncome',
        name: '⚡ Renda Passiva',
        description: 'Gere $10 por segundo',
        condition: () => gameState.moneyPerSecond >= 10,
        reward: 500
    },
    {
        id: 'tycoon',
        name: '🏢 Magnata',
        description: 'Gere $1000 por segundo',
        condition: () => gameState.moneyPerSecond >= 1000,
        reward: 5000
    }
];

// Elementos do DOM
const moneyElement = document.getElementById('money');
const moneyPerSecondElement = document.getElementById('moneyPerSecond');
const clickValueElement = document.getElementById('clickValue');
const clickButton = document.getElementById('clickButton');
const upgradesGrid = document.getElementById('upgradesGrid');
const achievementsGrid = document.getElementById('achievementsGrid');
const saveButton = document.getElementById('saveButton');
const resetButton = document.getElementById('resetButton');

// Inicialização
function init() {
    loadGame();
    renderUpgrades();
    renderAchievements();
    updateDisplay();
    startGameLoop();
    setupEventListeners();
}

// Loop principal do jogo
function startGameLoop() {
    setInterval(() => {
        // Gera dinheiro passivo
        if (gameState.moneyPerSecond > 0) {
            gameState.money += gameState.moneyPerSecond;
            gameState.totalMoneyEarned += gameState.moneyPerSecond;
        }
        
        updateDisplay();
        checkAchievements();
        
        // Auto-save a cada 30 segundos
        if (Date.now() - gameState.lastSave > 30000) {
            saveGame();
        }
    }, 1000);
}

// Event listeners
function setupEventListeners() {
    clickButton.addEventListener('click', handleClick);
    saveButton.addEventListener('click', saveGame);
    resetButton.addEventListener('click', resetGame);
}

// Manipulador de clique
function handleClick() {
    gameState.money += gameState.clickValue;
    gameState.totalClicks++;
    gameState.totalMoneyEarned += gameState.clickValue;
    
    createParticle();
    updateDisplay();
    checkAchievements();
}

// Criar partícula de clique
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.textContent = `+$${gameState.clickValue}`;
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    clickButton.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 1000);
}

// Renderizar upgrades
function renderUpgrades() {
    upgradesGrid.innerHTML = '';
    
    upgrades.forEach(upgrade => {
        const owned = gameState.upgrades[upgrade.id] || 0;
        const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, owned));
        const canAfford = gameState.money >= cost;
        
        const upgradeElement = document.createElement('div');
        upgradeElement.className = `upgrade-item ${canAfford ? '' : 'disabled'}`;
        upgradeElement.innerHTML = `
            <div class="upgrade-name">${upgrade.name}</div>
            <div class="upgrade-description">${upgrade.description}</div>
            <div class="upgrade-cost">Custo: $${formatNumber(cost)}</div>
            ${owned > 0 ? `<div class="upgrade-owned">${owned}</div>` : ''}
        `;
        
        if (canAfford) {
            upgradeElement.addEventListener('click', () => buyUpgrade(upgrade.id));
        }
        
        upgradesGrid.appendChild(upgradeElement);
    });
}

// Comprar upgrade
function buyUpgrade(upgradeId) {
    const upgrade = upgrades.find(u => u.id === upgradeId);
    const owned = gameState.upgrades[upgradeId] || 0;
    const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, owned));
    
    if (gameState.money >= cost) {
        gameState.money -= cost;
        gameState.upgrades[upgradeId] = (gameState.upgrades[upgradeId] || 0) + 1;
        
        // Recalcular efeitos
        recalculateEffects();
        
        renderUpgrades();
        updateDisplay();
        checkAchievements();
    }
}

// Recalcular efeitos dos upgrades
function recalculateEffects() {
    let totalClickValue = 1;
    let totalMoneyPerSecond = 0;
    
    upgrades.forEach(upgrade => {
        const owned = gameState.upgrades[upgrade.id] || 0;
        if (owned > 0) {
            const effect = upgrade.effect(owned);
            if (effect.clickValue) totalClickValue += effect.clickValue;
            if (effect.moneyPerSecond) totalMoneyPerSecond += effect.moneyPerSecond;
        }
    });
    
    gameState.clickValue = totalClickValue;
    gameState.moneyPerSecond = totalMoneyPerSecond;
}

// Renderizar achievements
function renderAchievements() {
    achievementsGrid.innerHTML = '';
    
    achievements.forEach(achievement => {
        const unlocked = gameState.achievements[achievement.id] || false;
        const conditionMet = achievement.condition();
        
        const achievementElement = document.createElement('div');
        achievementElement.className = `achievement-item ${unlocked ? 'unlocked' : conditionMet ? '' : 'locked'}`;
        achievementElement.innerHTML = `
            <div class="upgrade-name">${achievement.name}</div>
            <div class="upgrade-description">${achievement.description}</div>
            ${unlocked ? '<div class="upgrade-cost">✅ Desbloqueado!</div>' : ''}
        `;
        
        achievementsGrid.appendChild(achievementElement);
    });
}

// Verificar achievements
function checkAchievements() {
    achievements.forEach(achievement => {
        if (!gameState.achievements[achievement.id] && achievement.condition()) {
            unlockAchievement(achievement.id);
        }
    });
}

// Desbloquear achievement
function unlockAchievement(achievementId) {
    const achievement = achievements.find(a => a.id === achievementId);
    gameState.achievements[achievementId] = true;
    gameState.money += achievement.reward;
    
    // Mostrar notificação
    showNotification(`🏆 ${achievement.name} desbloqueado! +$${achievement.reward}`);
    
    renderAchievements();
    updateDisplay();
}

// Mostrar notificação
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #43e97b, #38f9d7);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.5s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-in';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Atualizar display
function updateDisplay() {
    moneyElement.textContent = `$${formatNumber(gameState.money)}`;
    moneyPerSecondElement.textContent = `$${formatNumber(gameState.moneyPerSecond)}`;
    clickValueElement.textContent = formatNumber(gameState.clickValue);
}

// Formatar números
function formatNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return Math.floor(num).toString();
}

// Salvar jogo
function saveGame() {
    gameState.lastSave = Date.now();
    localStorage.setItem('idleClickerSave', JSON.stringify(gameState));
    showNotification('💾 Jogo salvo!');
}

// Carregar jogo
function loadGame() {
    const saved = localStorage.getItem('idleClickerSave');
    if (saved) {
        try {
            const savedState = JSON.parse(saved);
            gameState = { ...gameState, ...savedState };
            recalculateEffects();
        } catch (e) {
            console.error('Erro ao carregar jogo:', e);
        }
    }
}

// Resetar jogo
function resetGame() {
    if (confirm('Tem certeza que deseja resetar o jogo? Todo o progresso será perdido!')) {
        gameState = {
            money: 0,
            clickValue: 1,
            moneyPerSecond: 0,
            totalClicks: 0,
            totalMoneyEarned: 0,
            upgrades: {},
            achievements: {},
            lastSave: Date.now()
        };
        
        localStorage.removeItem('idleClickerSave');
        renderUpgrades();
        renderAchievements();
        updateDisplay();
        showNotification('🔄 Jogo resetado!');
    }
}

// Adicionar estilos CSS para animações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Inicializar o jogo quando a página carregar
document.addEventListener('DOMContentLoaded', init);