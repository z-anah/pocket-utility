export class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
    }

    preload() {
        // Optionally load any assets here
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        this.text = this.add.text(centerX, centerY - 100, '', {
            fontFamily: 'AriW9500',
            fontSize: '96px',
            color: '#fff',
            align: 'center'
        }).setOrigin(0.5);

        this.fullText = 'WELCOME';
        this.currentChar = 0;
        this.typingTimer = this.time.addEvent({
            delay: 200,
            callback: this.typeLetter,
            callbackScope: this,
            loop: true
        });
    }

    typeLetter() {
        if (this.currentChar < this.fullText.length) {
            this.text.text += this.fullText[this.currentChar];
            this.currentChar++;
        } else {
            this.typingTimer.remove();
            this.showButton();
        }
    }

    showButton() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        this.button = this.add.text(centerX, centerY + 100, 'Catch Object', {
            fontFamily: 'AriW9500',
            fontSize: '48px',
            color: '#222',
            backgroundColor: '#fff',
            padding: { left: 30, right: 30, top: 15, bottom: 15 },
            align: 'center',
            borderRadius: 10
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.button.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}
