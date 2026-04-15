// objects/Player.js
export class Player extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        this.setOrigin(0.5, 1);
        this.setDisplaySize(736 / 2.5, 723 / 2.5);
    }
}