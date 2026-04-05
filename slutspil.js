export default class slutspil extends Phaser.Scene{
    constructor(){
        super({key: 'slutspil',
        physics: {
            arcade: {
                gravity: { y: 0 },
                debug: false
            },
            
        }});
    }

    preload(){
     this.load.image('Gameover', 'assets/game_over.png');
    }
    create() {
        this.add.text(384, 70, 'Game Over', { fontSize: '32px', fill: 'rgb(204, 0, 255)', fontStyle: 'bold', stroke: '#000', strokeThickness: 4 }).setOrigin(0.5);
         this.add.text(384, 150, 'Du har tabt! Prøv igen for at forsvare dit hus!', { fontSize: '20px', fill: 'rgb(255, 255, 255)', fontStyle: 'bold', stroke: '#000', strokeThickness: 4 }).setOrigin(0.5);
    this.add.image(512, 384, 'Gameover').setDisplaySize(1024, 768);
    
    }
    update() { 
    
    }
}