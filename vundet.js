export default class vundet extends Phaser.Scene {
    constructor() {
        super({ key: 'vundet' });
    }

    preload() {
        this.load.image('baggrund', 'assets/ban.png');
        this.load.audio('winner_music', 'assets/winner.wav');
    }

    create() {
        this.add.image(512, 384, 'baggrund').setDisplaySize(1024, 768);

        this.add.text(512, 250, '🏆 Du vandt! 🏆', { fontSize: '48px', fill: 'rgb(255, 215, 0)', fontStyle: 'bold', stroke: '#000', strokeThickness: 6 }).setOrigin(0.5);
        this.add.text(512, 350, 'Tillykke! Du har forsvaret dit hus!', { fontSize: '24px', fill: 'rgb(255, 255, 255)', fontStyle: 'bold', stroke: '#000', strokeThickness: 4 }).setOrigin(0.5);
        this.add.text(512, 420, 'Du overlevede alle bølger!', { fontSize: '20px', fill: 'rgb(0, 255, 0)', fontStyle: 'bold', stroke: '#000', strokeThickness: 4 }).setOrigin(0.5);

        this.sound.stopAll();
        this.sound.play('winner_music');

        const restartText = this.add.text(512, 550, 'Klik for at spille igen', { fontSize: '28px', fill: 'rgb(204, 0, 255)', fontStyle: 'bold', stroke: '#000', strokeThickness: 4 }).setOrigin(0.5);
        restartText.setInteractive({ useHandCursor: true });

        this.input.once('pointerdown', () => {
            this.scene.start('StartGame');
        });
    }

    update() {}
}
