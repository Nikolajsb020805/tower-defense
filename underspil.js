import Tower from './Tower.js';
import Enemy from './fjende.js';
import Tower2 from './Tower2.js';
import Tower3 from './Tower3.js';

 
export default class underspil extends Phaser.Scene{
    constructor() {
        super({
            key: "underspil",
            physics: {
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            }
        });
    }
    
    

    preload(){
        this.load.image('turret', 'assets/turret.png');
        this.load.image('fjende', 'assets/fjende.png');
        this.load.image('baggrund', 'assets/ban.png');
        this.load.image('shop', 'assets/shoppe.png');
        this.load.image('shotgun_Turret', 'assets/shotgun_Turret.png');
        this.load.image('rocket_Turret', 'assets/rocket_Turret.png');
        
    }


    create() {
        // Keep the same background as the splash screen.
        this.add.image(384, 384, 'baggrund').setDisplaySize(768, 768);
        this.add.image(898, 384, 'shop').setDisplaySize(260, 768);
        this.add.image(870, 150, 'turret').setDisplaySize(260, 128);
        this.add.text(870, 220, 'Towers = $100', { fontSize: '16px', fill: 'rgb(255, 255, 255)', fontStyle: 'bold', stroke: '#000', strokeThickness: 4 }).setOrigin(0.5);
        this.add.image(870, 300, 'shotgun_Turret').setDisplaySize(260, 128);
        this.add.text(890, 370, 'Shotguns Towers = $200', { fontSize: '16px', fill: 'rgb(255, 255, 255)', fontStyle: 'bold', stroke: '#000', strokeThickness: 4 }).setOrigin(0.5);
        this.add.image(890, 450, 'rocket_Turret').setDisplaySize(260, 128);
        this.add.text(890, 520, 'Rocket Towers = $500', { fontSize: '16px', fill: 'rgb(255, 255, 255)', fontStyle: 'bold', stroke: '#000', strokeThickness: 4 }).setOrigin(0.5);

        // Initialize money system
        this.money = 500;
        this.moneyText = this.add.text(16, 16, 'Money: $' + this.money, { fontSize: '24px', fill: '#fff', stroke: '#000', strokeThickness: 2 });

        // Base reward after finishing a wave
        this.waveReward = 100;

        // Initialize health system
        this.health = 10;
        this.healthText = this.add.text(16, 50, 'Health: 10', { fontSize: '24px', fill: '#ff0000', stroke: '#000', strokeThickness: 2 });

        // Initialize wave system
        this.currentWave = 1;
        this.maxWaves = 10; // Win after surviving this many waves
        this.enemiesPerWave = 3; // Start with 3 enemies
        this.waveText = this.add.text(16, 84, 'Wave: 1/' + this.maxWaves, { fontSize: '24px', fill: '#00ff00', stroke: '#000', strokeThickness: 2 });
        this.waveInProgress = false;

        // Create projectiles group for the tower using physics group
        this.projectiles = this.physics.add.group();

        this.tower = new Tower(this, -600, -4000, this.projectiles);
        this.tower2 = new Tower2(this, -2800, -2000, this.projectiles);
        this.tower3 = new Tower3(this, -2800, -6000, this.projectiles);

        this.towers = [this.tower, this.tower2, this.tower3];

        // Shop buttons (clickable zones over UI images)
        const basicTowerZone = this.add.zone(870, 190, 220, 100).setOrigin(0.5).setInteractive({ cursor: 'pointer' });
        const shotgunZone = this.add.zone(870, 310, 220, 100).setOrigin(0.5).setInteractive({ cursor: 'pointer' });
        const rocketZone = this.add.zone(870, 430, 220, 100).setOrigin(0.5).setInteractive({ cursor: 'pointer' });

        basicTowerZone.on('pointerdown', () => this.selectTower('basic'));
        shotgunZone.on('pointerdown', () => this.selectTower('shotgun'));
        rocketZone.on('pointerdown', () => this.selectTower('rocket'));

        // Mouse placement system
        this.input.on('pointermove', (pointer) => {
            if (this.placementPreview) {
                this.placementPreview.setPosition(pointer.x, pointer.y);
                const canPlace = this.canPlaceTower(pointer.x, pointer.y);
                this.placementPreview.setTint(canPlace ? 0x00ff00 : 0xff0000);
            }
        });

        this.input.on('pointerdown', (pointer) => {
            if (this.selectedTowerType && pointer.x < 768) { // Only place on game area, not shop
                this.placeTower(pointer.x, pointer.y);
            }
        });

        // Create enemies array
        this.enemies = [];
        this.enemySprites = [];

        // Start first wave
        this.startWave();
    }

    startWave() {
        // Clear previous wave enemies
        this.enemies = [];
        this.enemySprites = [];

        this.waveInProgress = true;
        const enemyCount = this.enemiesPerWave + Math.floor((this.currentWave - 1) / 2); // Increase enemies every 2 waves
        const spacing = 60;
        this.waveReward = 100 + Math.floor((this.currentWave - 1) / 5) * 5; // Increase reward every 5 waves

        for (let i = 0; i < enemyCount; i++) {
            const enemy = new Enemy();

            // Increase enemy speed and health based on wave
            enemy.speed = 2 + Math.floor((this.currentWave - 1) / 10) * 0.5; // Speed up every 3 waves
            enemy.health = 4 + Math.floor((this.currentWave - 1) / 6); // More health every 2 waves
            

            // offset the starting position along the path
            enemy.x -= i * spacing;
            enemy.y += i * 10;

            this.enemies.push(enemy);

            const enemySprite = this.physics.add.image(enemy.x, enemy.y, 'fjende').setDisplaySize(50, 50);
            enemySprite.body.setImmovable(true);
            this.enemySprites.push(enemySprite);
        }
    }



    update() {

        if (!this.enemies || this.enemies.length === 0) return;

        // Update each enemy and its sprite
        this.enemies.forEach((enemy, index) => {
            if (enemy.alive) {
                enemy.update();
                const sprite = this.enemySprites[index];
                sprite.setPosition(enemy.x, enemy.y);
            } else {
                // Hide dead enemy sprites
                const sprite = this.enemySprites[index];
                if (sprite.active) {
                    sprite.disableBody(true, true);
                }
            }
        });

        // Check if wave is complete (all enemies defeated)
        const aliveEnemies = this.enemies.filter(enemy => enemy.alive).length;
        if (aliveEnemies === 0 && this.waveInProgress) {
            this.waveInProgress = false;

            // Give reward for finishing wave
            this.money += this.waveReward;
            this.moneyText.setText('Money: $' + this.money);

            // Check for win condition
            if (this.currentWave >= this.maxWaves) {
                this.time.delayedCall(1000, () => {
                    this.scene.start('vundet');
                });
                return;
            }

            this.currentWave++;
            this.waveText.setText('Wave: ' + this.currentWave + '/' + this.maxWaves);

            // Start next wave after a short delay
            this.time.delayedCall(2000, () => {
                this.startWave();
            });
        }

        // Target the first alive enemy
        const target = this.enemies.find((e) => e.alive);
        if (target) {
            this.towers.forEach((tower) => tower.update(target));
        }

        // Check if any enemy reached the end of their path - lose health
        this.enemies.forEach((enemy, index) => {
            if (enemy.alive && enemy.currentPoint >= enemy.path.length - 1) {
                // Check if enemy is actually at the final position
                const finalPoint = enemy.path[enemy.path.length - 1];
                const distanceToEnd = Phaser.Math.Distance.Between(enemy.x, enemy.y, finalPoint.x, finalPoint.y);

                if (distanceToEnd < 10) { // Close enough to the end point
                    console.log('Enemy reached the end! Health before:', this.health);
                    this.health -= 1;
                    this.healthText.setText('Health: ' + this.health);
                    enemy.alive = false; // Remove the enemy
                    enemy.rewarded = true; // prevent money award for end reach

                    // Hide the enemy sprite
                    const sprite = this.enemySprites[index];
                    if (sprite.active) {
                        sprite.disableBody(true, true);
                    }

                    // Check for game over
                    if (this.health <= 0) {
                        console.log('Game Over! Health:', this.health);
                        this.scene.start('slutspil'); // Go to game over scene
                    }
                }
            }
        });

        // Check bullet collisions against all alive enemies
        this.projectiles.getChildren().forEach((projectile) => {
            if (!projectile.active) return;

            this.enemies.forEach((enemy, index) => {
                if (!enemy.alive) return;

                const dx = projectile.x - enemy.x;
                const dy = projectile.y - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 25) {
                    const died = enemy.takeDamage(projectile.damage || this.tower.damage);
                    projectile.destroy();

                    if (died && !enemy.rewarded) {
                        this.money += 10;
                        this.moneyText.setText('Money: $' + this.money);
                        enemy.rewarded = true;

                        const enemySprite = this.enemySprites[index];
                        if (enemySprite.active) {
                            enemySprite.disableBody(true, true);
                        }
                    }
                }
            });
        });
    }

    selectTower(type) {
        const prices = { basic: 100, shotgun: 200, rocket: 500 };
        const TowerClass = { basic: Tower, shotgun: Tower2, rocket: Tower3 }[type];

        if (!TowerClass) return;
        if (this.money < prices[type]) {
            console.log('Not enough money to buy', type);
            return;
        }

        this.selectedTowerType = type;

        // Create placement preview
        if (this.placementPreview) this.placementPreview.destroy();
        const spriteKey = { basic: 'turret', shotgun: 'shotgun_Turret', rocket: 'rocket_Turret' }[type];
        this.placementPreview = this.add.image(0, 0, spriteKey).setOrigin(0.5).setDisplaySize(192, 96).setAlpha(0.7);
    }

    canPlaceTower(x, y) {
        // Check if position is on enemy path (simplified check)
        const pathPoints = [
            {x: -100, y: 131.25}, {x: 165, y: 131.25}, {x: 165, y: 525},
            {x: 375, y: 525}, {x: 375, y: 135}, {x: 645, y: 135}, {x: 645, y: 800}
        ];

        for (let point of pathPoints) {
            const distance = Phaser.Math.Distance.Between(x, y, point.x, point.y);
            if (distance < 50) return false; // Too close to path
        }

        // Check if too close to existing towers
        for (let tower of this.towers) {
            const distance = Phaser.Math.Distance.Between(x, y, tower.player.x, tower.player.y);
            if (distance < 50) return false; // Too close to other towers
        }

        return true;
    }

    placeTower(x, y) {
        if (!this.selectedTowerType || !this.canPlaceTower(x, y)) return;

        const prices = { basic: 100, shotgun: 200, rocket: 500 };
        const TowerClass = { basic: Tower, shotgun: Tower2, rocket: Tower3 }[this.selectedTowerType];

        this.money -= prices[this.selectedTowerType];
        this.moneyText.setText('Money: $' + this.money);

        const newTower = new TowerClass(this, x, y, this.projectiles);
        this.towers.push(newTower);

        // Clean up placement mode
        this.selectedTowerType = null;
        if (this.placementPreview) {
            this.placementPreview.destroy();
            this.placementPreview = null;
        }
    }
}
