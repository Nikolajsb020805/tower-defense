import fjende from "./fjende.js";
import Tower from "./Tower.js";
import StartGame from "./StartGame.js";
import underspil from "./underspil.js";
import slutspil from "./slutspil.js";

let tower; 

// Konfiguration af spillet
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'gameCanvas',
    scene: [StartGame, underspil, slutspil],
};

const game = new Phaser.Game(config);

/* 
   Bemærk: Funktionerne nedenfor er pt. uden for Phaser-scenerne. 
   Hvis de skal bruges, skal de ligge inde i f.eks. 'underspil.js' 
*/

// function update() {
//    if (tower) {
//        tower.update(this.input.activePointer);
//    }
// }
