// game.js

import { IntroScene } from './scenes/IntroScene.js';
import { GameScene } from './scenes/GameScene.js';

const config = {
    type: Phaser.AUTO,
    width: 964,
    height: 1074,
    backgroundColor: '#222',
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [IntroScene, GameScene]
};

new Phaser.Game(config);
