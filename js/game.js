// Farm Clicker Game Logic
class FarmClickerGame {
    constructor() {
        this.gameState = {
            coins: 0,
            seeds: 0,
            clickPower: 1,
            productivity: 0,
            farmLevel: 1,
            totalClicks: 0,
            totalCoins: 0,
            playTime: 0,
            buildings: {
                greenhouse: { count: 0, cost: 10, production: 1 },
                tractor: { count: 0, cost: 100, production: 5 },
                factory: { count: 0, cost: 1000, production: 25 },
                robot: { count: 0, cost: 10000, production: 100 }
            },
            upgrades: {
                click: { purchased: false, cost: 50, multiplier: 2 },
                efficiency: { purchased: false, cost: 500, multiplier: 1.5 },
                automation: { purchased: false, cost: 5000, enabled: false }
            },
            achievements: {
                'first-click': false,
                'hundred-coins': false,
                'first-building': false,
                'farm-master': false
            }
        };

        this.farmIcons = ['🌱', '🌿', '🌾', '🌻', '🌳', '🍎', '🍊', '🍇', '🥕', '🎃'];
        this.startTime = Date.now();
        
        this.init();
    }

    init() {
        this.loadGame();
        this.bindEvents();
        this.startGameLoop();
        this.updateDisplay();
        this.updatePlayTime();
    }

    bindEvents() {
        // Main click area
        document.getElementById('clickArea').addEventListener('click', (e) => this.handleClick(e));

        // Building purchases
        document.getElementById('buy-greenhouse').addEventListener('click', () => this.buyBuilding('greenhouse'));
        document.getElementById('buy-tractor').addEventListener('click', () => this.buyBuilding('tractor'));
        document.getElementById('buy-factory').addEventListener('click', () => this.buyBuilding('factory'));
        document.getElementById('buy-robot').addEventListener('click', () => this.buyBuilding('robot'));

        // Upgrades
        document.getElementById('upgrade-click').addEventListener('click', () => this.buyUpgrade('click'));
        document.getElementById('upgrade-efficiency').addEventListener('click', () => this.buyUpgrade('efficiency'));
        document.getElementById('upgrade-automation').addEventListener('click', () => this.buyUpgrade('automation'));

        // Auto-save every 10 seconds
        setInterval(() => this.saveGame(), 10000);
    }

    handleClick(event) {
        const clickArea = event.currentTarget;
        const rect = clickArea.getBoundingClientRect();
        
        // Add coins based on click power
        this.gameState.coins += this.gameState.clickPower;
        this.gameState.totalClicks++;
        this.gameState.totalCoins += this.gameState.clickPower;

        // Create floating number effect
        this.createFloatingNumber(
            event.clientX - rect.left,
            event.clientY - rect.top,
            `+${this.gameState.clickPower}`
        );

        // Create click ripple effect
        this.createClickEffect(event.clientX - rect.left, event.clientY - rect.top);

        // Check for level up
        this.checkLevelUp();

        // Check achievements
        this.checkAchievements();

        // Update display
        this.updateDisplay();

        // Add animation to coin counter
        this.animateNumberChange('coins');
    }

    createFloatingNumber(x, y, text) {
        const floatingNumber = document.createElement('div');
        floatingNumber.className = 'floating-number';
        floatingNumber.textContent = text;
        floatingNumber.style.left = x + 'px';
        floatingNumber.style.top = y + 'px';

        document.getElementById('floatingNumbers').appendChild(floatingNumber);

        // Remove after animation
        setTimeout(() => {
            if (floatingNumber.parentNode) {
                floatingNumber.parentNode.removeChild(floatingNumber);
            }
        }, 2000);
    }

    createClickEffect(x, y) {
        const clickEffect = document.getElementById('clickEffect');
        clickEffect.style.left = x + 'px';
        clickEffect.style.top = y + 'px';
        clickEffect.style.animation = 'none';
        
        // Trigger reflow
        clickEffect.offsetHeight;
        
        clickEffect.style.animation = 'clickRipple 0.6s ease-out';
    }

    buyBuilding(type) {
        const building = this.gameState.buildings[type];
        
        if (this.gameState.coins >= building.cost) {
            this.gameState.coins -= building.cost;
            building.count++;
            
            // Increase cost by 15%
            building.cost = Math.ceil(building.cost * 1.15);
            
            // Update productivity
            this.updateProductivity();
            
            // Check achievements
            this.checkAchievements();
            
            // Update display
            this.updateDisplay();

            // Play success sound effect (visual feedback)
            this.animateNumberChange(`${type}-count`);
        }
    }

    buyUpgrade(type) {
        const upgrade = this.gameState.upgrades[type];
        
        if (!upgrade.purchased && this.gameState.coins >= upgrade.cost) {
            this.gameState.coins -= upgrade.cost;
            upgrade.purchased = true;
            
            // Apply upgrade effects
            this.applyUpgrade(type);
            
            // Update display
            this.updateDisplay();
            
            // Show notification
            this.showNotification(`Upgrade "${type}" comprado!`);
        }
    }

    applyUpgrade(type) {
        switch (type) {
            case 'click':
                this.gameState.clickPower *= this.gameState.upgrades.click.multiplier;
                break;
            case 'efficiency':
                this.updateProductivity();
                break;
            case 'automation':
                this.gameState.upgrades.automation.enabled = true;
                break;
        }
    }

    updateProductivity() {
        let baseProduction = 0;
        const buildings = this.gameState.buildings;
        
        baseProduction += buildings.greenhouse.count * buildings.greenhouse.production;
        baseProduction += buildings.tractor.count * buildings.tractor.production;
        baseProduction += buildings.factory.count * buildings.factory.production;
        baseProduction += buildings.robot.count * buildings.robot.production;

        // Apply efficiency upgrade
        if (this.gameState.upgrades.efficiency.purchased) {
            baseProduction *= this.gameState.upgrades.efficiency.multiplier;
        }

        this.gameState.productivity = baseProduction;
    }

    checkLevelUp() {
        const requiredCoins = this.gameState.farmLevel * 100;
        
        if (this.gameState.totalCoins >= requiredCoins) {
            this.gameState.farmLevel++;
            
            // Update farm icon
            const farmIcon = document.querySelector('.farm-icon');
            const iconIndex = Math.min(this.gameState.farmLevel - 1, this.farmIcons.length - 1);
            farmIcon.textContent = this.farmIcons[iconIndex];
            
            this.showNotification(`Nível ${this.gameState.farmLevel} alcançado!`);
        }
    }

    checkAchievements() {
        const achievements = this.gameState.achievements;
        
        // First click
        if (this.gameState.totalClicks >= 1 && !achievements['first-click']) {
            this.unlockAchievement('first-click');
        }
        
        // Hundred coins
        if (this.gameState.totalCoins >= 100 && !achievements['hundred-coins']) {
            this.unlockAchievement('hundred-coins');
        }
        
        // First building
        const totalBuildings = Object.values(this.gameState.buildings)
            .reduce((sum, building) => sum + building.count, 0);
        if (totalBuildings >= 1 && !achievements['first-building']) {
            this.unlockAchievement('first-building');
        }
        
        // Farm master
        if (this.gameState.farmLevel >= 10 && !achievements['farm-master']) {
            this.unlockAchievement('farm-master');
        }
    }

    unlockAchievement(id) {
        this.gameState.achievements[id] = true;
        
        const achievementElement = document.querySelector(`[data-achievement="${id}"]`);
        if (achievementElement) {
            achievementElement.classList.add('unlocked');
        }
        
        this.showNotification(`🏆 Conquista desbloqueada!`);
    }

    showNotification(message) {
        // Create a simple notification system
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #4CAF50, #8BC34A);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 1001;
            animation: slideIn 0.5s ease-out;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease-out forwards';
            setTimeout(() => document.body.removeChild(notification), 500);
        }, 3000);
    }

    animateNumberChange(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('number-change');
            setTimeout(() => element.classList.remove('number-change'), 300);
        }
    }

    updateDisplay() {
        // Update resources
        document.getElementById('coins').textContent = this.formatNumber(this.gameState.coins);
        document.getElementById('seeds').textContent = this.formatNumber(this.gameState.seeds);
        document.getElementById('productivity').textContent = this.formatNumber(this.gameState.productivity);

        // Update farm level
        document.getElementById('farmLevel').textContent = this.gameState.farmLevel;
        document.getElementById('nextUpgrade').textContent = this.formatNumber(this.gameState.farmLevel * 100);
        
        // Update progress bar
        const progress = (this.gameState.totalCoins % (this.gameState.farmLevel * 100)) / (this.gameState.farmLevel * 100) * 100;
        document.getElementById('progressBar').style.width = progress + '%';

        // Update building counts and costs
        Object.keys(this.gameState.buildings).forEach(type => {
            const building = this.gameState.buildings[type];
            document.getElementById(`${type}-count`).textContent = building.count;
            document.getElementById(`${type}-cost`).textContent = this.formatNumber(building.cost);
            
            // Disable button if can't afford
            const button = document.getElementById(`buy-${type}`);
            button.disabled = this.gameState.coins < building.cost;
        });

        // Update upgrades
        Object.keys(this.gameState.upgrades).forEach(type => {
            const upgrade = this.gameState.upgrades[type];
            const button = document.getElementById(`upgrade-${type}`);
            
            if (upgrade.purchased) {
                button.textContent = 'Comprado ✓';
                button.disabled = true;
                button.classList.remove('btn-warning');
                button.classList.add('btn-secondary');
            } else {
                button.disabled = this.gameState.coins < upgrade.cost;
            }
        });

        // Update stats
        document.getElementById('totalClicks').textContent = this.formatNumber(this.gameState.totalClicks);
        document.getElementById('totalCoins').textContent = this.formatNumber(this.gameState.totalCoins);
    }

    formatNumber(num) {
        if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return Math.floor(num).toString();
    }

    startGameLoop() {
        setInterval(() => {
            // Generate passive income
            if (this.gameState.productivity > 0) {
                const income = this.gameState.productivity / 10; // Per 100ms
                
                if (this.gameState.upgrades.automation.enabled) {
                    // Direct coin production
                    this.gameState.coins += income;
                    this.gameState.totalCoins += income;
                } else {
                    // Seed production that can be converted to coins
                    this.gameState.seeds += income;
                }
            }
            
            this.updateDisplay();
        }, 100);
    }

    updatePlayTime() {
        setInterval(() => {
            this.gameState.playTime = Math.floor((Date.now() - this.startTime) / 1000);
            document.getElementById('playTime').textContent = this.formatTime(this.gameState.playTime);
        }, 1000);
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}m ${remainingSeconds}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${remainingSeconds}s`;
        } else {
            return `${remainingSeconds}s`;
        }
    }

    saveGame() {
        localStorage.setItem('farmClickerSave', JSON.stringify(this.gameState));
    }

    loadGame() {
        const savedGame = localStorage.getItem('farmClickerSave');
        if (savedGame) {
            try {
                const loadedState = JSON.parse(savedGame);
                // Merge with default state to handle new features
                this.gameState = { ...this.gameState, ...loadedState };
                
                // Apply upgrades
                if (this.gameState.upgrades.click.purchased) {
                    this.gameState.clickPower = this.gameState.upgrades.click.multiplier;
                }
                
                this.updateProductivity();
                
                console.log('Game loaded successfully!');
            } catch (error) {
                console.log('Failed to load game:', error);
            }
        }
    }

    resetGame() {
        if (confirm('Tem certeza que deseja resetar o jogo? Todo o progresso será perdido!')) {
            localStorage.removeItem('farmClickerSave');
            location.reload();
        }
    }
}

// Global reset function
function resetGame() {
    if (window.game) {
        window.game.resetGame();
    }
}

// CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new FarmClickerGame();
});

// Convert seeds to coins
document.addEventListener('DOMContentLoaded', () => {
    const seedsElement = document.getElementById('seeds');
    if (seedsElement) {
        seedsElement.addEventListener('click', () => {
            if (window.game && window.game.gameState.seeds >= 1) {
                const seedsToConvert = Math.floor(window.game.gameState.seeds);
                window.game.gameState.seeds -= seedsToConvert;
                window.game.gameState.coins += seedsToConvert;
                window.game.gameState.totalCoins += seedsToConvert;
                
                window.game.createFloatingNumber(
                    seedsElement.offsetLeft,
                    seedsElement.offsetTop,
                    `+${seedsToConvert} moedas`
                );
                
                window.game.updateDisplay();
                window.game.animateNumberChange('coins');
            }
        });
    }
});