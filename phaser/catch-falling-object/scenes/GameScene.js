// scenes/GameScene.js
import { Player } from '../objects/Player.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.score = 0;
        this.lives = 3;
        this.isGameOver = false;
        this.isPaused = false;
    }

    preload() {
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
        this.load.image('bg', 'assets/sprites/bg.png');
        this.load.image('player', 'assets/sprites/pupet-master.png');
        this.load.image('heart', 'assets/sprites/heart.png');

        this.okObjects = ['ok1', 'ok2', 'ok3', 'ok4'];
        this.load.image('ok1', 'assets/sprites/ok/Subject 1.png');
        this.load.image('ok2', 'assets/sprites/ok/Subject 2.png');
        this.load.image('ok3', 'assets/sprites/ok/Subject 3.png');
        this.load.image('ok4', 'assets/sprites/ok/Subject 4.png');

        this.koObjects = ['ko1', 'ko2'];
        this.load.image('ko1', 'assets/sprites/ko/Subject 1.png');
        this.load.image('ko2', 'assets/sprites/ko/Subject 2.png');
    }

    create() {
        const bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);
        bg.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

        this.player = new Player(this, this.sys.game.config.width / 2, this.sys.game.config.height + 200);
        this.add.existing(this.player);
        this.physics.add.existing(this.player);
        this.player.setCollideWorldBounds(true);
        this.player.body.allowGravity = false;

        this.cursors = this.input.keyboard.createCursorKeys();

        // Pause key (P)
        this.input.keyboard.on('keydown-P', () => {
            if (this.isGameOver) return;
            this.isPaused = !this.isPaused;
            this.physics.world.isPaused = this.isPaused;
            this.time.timeScale = this.isPaused ? 0 : 1;
            this.pauseText.setVisible(this.isPaused);
        });

        // Groups
        this.okGroup = this.physics.add.group();
        this.koGroup = this.physics.add.group();

        // Collisions
        this.physics.add.overlap(this.player, this.okGroup, this.catchOk, null, this);
        this.physics.add.overlap(this.player, this.koGroup, this.catchKo, null, this);

        // Spawn loop
        this.spawnEvent = this.time.addEvent({
            delay: 800,
            loop: true,
            callback: this.spawnObject,
            callbackScope: this
        });

        // Overlay (Game Over)
        this.overlay = this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, 0x000000, 0.6)
            .setOrigin(0)
            .setDepth(10)
            .setVisible(false);

        this.gameOverText = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'GAME OVER', {
            fontFamily: 'AriW9500',
            fontSize: '64px',
            color: '#ffffff'
        }).setOrigin(0.5).setDepth(11).setVisible(false);

        // Pause text
        this.pauseText = this.add.text(this.sys.game.config.width / 2, 200, 'PAUSED', {
            fontFamily: 'AriW9500',
            fontSize: '48px',
            color: '#ffffff'
        }).setOrigin(0.5).setDepth(11).setVisible(false);

        WebFont.load({
            custom: {
                families: ['AriW9500'],
                urls: ['assets/fonts/ari_w9500/ari-w9500.ttf']
            },
            active: () => {
                const baseTextStyle = {
                    fontFamily: 'AriW9500',
                    fontSize: '32px',
                    stroke: '#191434',
                    strokeThickness: 6,
                };

                this.add.text(30, 30, 'SCORE', {
                    ...baseTextStyle,
                    color: '#ee7c80'
                });

                this.scoreText = this.add.text(30, 70, '000', {
                    ...baseTextStyle,
                    color: '#f8d77c'
                });

                this.add.text(840, 30, 'LIVES', {
                    ...baseTextStyle,
                    color: '#7cc7ee'
                });

                this.hearts = [];
                const heartY = 80;
                const heartSpacing = 42;

                for (let i = 0; i < 3; i++) {
                    const heart = this.add.image(810 + i * heartSpacing, heartY, 'heart')
                        .setOrigin(0, 0)
                        .setDisplaySize(40, 40);
                    this.hearts.push(heart);
                }
            }
        });
    }

    spawnObject() {
        if (this.isGameOver || this.isPaused) return;

        const isOk = Math.random() > 0.4;
        const key = isOk
            ? Phaser.Utils.Array.GetRandom(this.okObjects)
            : Phaser.Utils.Array.GetRandom(this.koObjects);

        const x = Phaser.Math.Between(50, this.sys.game.config.width - 50);

        const obj = (isOk ? this.okGroup : this.koGroup).create(x, -50, key);
        obj.setVelocityY(200);
        obj.setData('type', isOk ? 'ok' : 'ko');
        obj.setCollideWorldBounds(false);
        obj.body.allowGravity = false;

        if (!isOk) {
            obj.setScale(0.3);
        } else {
            obj.setScale(0.5);
        }
    }

    catchOk(player, obj) {
        if (this.isGameOver) return;
        obj.destroy();
        this.score += 10;
        this.updateScore();
    }

    catchKo(player, obj) {
        if (this.isGameOver) return;

        obj.destroy();
        this.lives -= 1;
        this.updateLives();

        // Screen shake
        this.cameras.main.shake(200, 0.01);

        if (this.lives <= 0) {
            this.gameOver();
        }
    }

    gameOver() {
        this.isGameOver = true;
        this.physics.pause();
        this.spawnEvent.remove(false);

        this.overlay.setVisible(true);
        this.gameOverText.setVisible(true);
    }

    updateScore() {
        this.scoreText.setText(this.score.toString().padStart(3, '0'));
    }

    updateLives() {
        if (this.hearts[this.lives]) {
            this.hearts[this.lives].setVisible(false);
        }
    }

    update() {
        if (!this.player || !this.cursors || this.isPaused || this.isGameOver) return;

        const speed = 400;
        this.player.setVelocityX(0);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
        }

        this.okGroup.children.iterate(child => {
            if (child && child.y > this.sys.game.config.height + 50) {
                child.destroy();
            }
        });

        this.koGroup.children.iterate(child => {
            if (child && child.y > this.sys.game.config.height + 50) {
                child.destroy();
            }
        });
    }
}
