export default class Tower3 {
    constructor(scene, x, y, projectiles) {
        this.scene = scene;
        // create the sprite for the tower/player
        this.player = scene.add.image(x, y, 'rocket_Turret').setOrigin(0.5).setDisplaySize(192, 96);
        this.range = 300;
        this.projectiles = projectiles;
        this.lastShot = 0;
        this.shootCooldown = 1000; 
        this.damage = 5; // Rocket turret does more damage
    }

    update(enemy) {
        if (!enemy) return; // Don't update if no enemy
        
        // Get the enemy's position (using the Enemy class's getPosition method for consistency)
        const enemyPos = enemy.getPosition();
        
        const distance = Phaser.Math.Distance.Between(
            this.player.x,
            this.player.y,
            enemyPos.x,
            enemyPos.y
        );

        if (distance <= this.range) {
            const angle = Phaser.Math.Angle.Between(
                this.player.x,
                this.player.y,
                enemyPos.x,
                enemyPos.y
            );

            this.player.rotation = angle;

            // Shoot if cooldown passed
            if (this.scene.time.now - this.lastShot > this.shootCooldown) {
                this.shoot(angle, enemy);
                this.lastShot = this.scene.time.now;
            }
        }
    }

    shoot(angle, enemy) {
        // Visual projectile
        const projectile = this.scene.add.circle(this.player.x, this.player.y, 10, 0xffff00);
        this.scene.physics.add.existing(projectile);
        projectile.damage = this.damage;
        this.projectiles.add(projectile);
        this.scene.physics.velocityFromRotation(angle, 1800, projectile.body.velocity);

        // Destroy projectile after a short duration so it's not infinite
        this.scene.time.delayedCall(600, () => {
            if (projectile && projectile.active) projectile.destroy();
        });
    }
}