// ---------------------------------------------------------------------------
// Dialogue data
// Each entry: speaker, emotion label, dialogue text, sprite key, tween type
// Sprite keys map to:
//   ki1  → assets/sprites/ki/Subject.png
//   ki2  → assets/sprites/ki/Subject_2.png
//   ki3  → assets/sprites/ki/Subject_3.png
//   ki4  → assets/sprites/ki/Subject_4.png
//   bayu1 → assets/sprites/bayu/Subject.png
//   bayu2 → assets/sprites/bayu/Subject_2.png
//   bayu3 → assets/sprites/bayu/Subject_3.png
// ---------------------------------------------------------------------------
const DIALOGUES = [
    {
        speaker: 'Ki Mangun',
        emotion: 'serius',
        text: 'Bayu, dengar baik-baik. Wayang bukan sekadar kulit dan bambu.',
        sprite: 'ki1',
        tween: 'raise'          // angkat tangan — bob naik sekali
    },
    {
        speaker: 'Bayu',
        emotion: 'bingung',
        text: 'Ki, aku hanya anak desa. Kenapa aku?',
        sprite: 'bayu1',
        tween: 'stepback'       // langkah mundur — geser kanan lalu kembali
    },
    {
        speaker: 'Ki Mangun',
        emotion: 'lembut',
        text: 'Karena suara dan cerita akan memilih yang berani memikulnya.\nKau dipanggil bukan oleh darah, tapi oleh hati.',
        sprite: 'ki2',
        tween: 'lean'           // tepuk bahu — condong maju sedikit
    },
    {
        speaker: 'Bayu',
        emotion: 'cemas',
        text: 'Apa yang harus kulakukan, Ki?',
        sprite: 'bayu2',
        tween: 'bow'            // menunduk — turun sedikit
    },
    {
        speaker: 'Ki Mangun',
        emotion: 'berwibawa',
        text: 'Pelajari tiap lakon, dan hidupkan tokoh-tokoh itu kembali.\nJadikan mereka suara nenek moyang kita.',
        sprite: 'ki3',
        tween: 'gesture'        // isyarat luas — ayun kiri-kanan
    },
    {
        speaker: 'Bayu',
        emotion: 'tekad',
        text: 'Aku akan berusaha, Ki.',
        sprite: 'bayu3',
        tween: 'pulse'          // kepal ke dada — denyut ganda
    },
    {
        speaker: 'Ki Mangun',
        emotion: 'peringatan',
        text: 'Ingat... Ketika wayang bercerita, raga kita\nmendengar sejarah. Jagalah.',
        sprite: 'ki4',
        tween: 'drift'          // serahkan kotak — meluncur maju perlahan
    }
];

// ---------------------------------------------------------------------------
export class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
        this.dialogueIndex = 0;
        this.isTyping = false;
        this.typingTimer = null;
    }

    preload() {
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
        this.load.image('bg',    'assets/sprites/bg.png');
        this.load.image('ki1',   'assets/sprites/ki/Subject.png');
        this.load.image('ki2',   'assets/sprites/ki/Subject_2.png');
        this.load.image('ki3',   'assets/sprites/ki/Subject_3.png');
        this.load.image('ki4',   'assets/sprites/ki/Subject_4.png');
        this.load.image('bayu1', 'assets/sprites/bayu/Subject.png');
        this.load.image('bayu2', 'assets/sprites/bayu/Subject_2.png');
        this.load.image('bayu3', 'assets/sprites/bayu/Subject_3.png');
    }

    create() {
        const W = this.sys.game.config.width;   // 964
        const H = this.sys.game.config.height;  // 1074

        // -- Background --
        this.add.image(0, 0, 'bg').setOrigin(0, 0).setDisplaySize(W, H);
        // Warm dark overlay — simulates depth-of-field softness
        this.add.rectangle(0, 0, W, H, 0x1a0010, 0.55).setOrigin(0);

        // -- Sparkle particle texture (programmatic white dot) --
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0xffffff, 1);
        g.fillCircle(4, 4, 4);
        g.generateTexture('sparkle', 8, 8);
        g.destroy();

        // -- Character sprite --
        const charX = W / 2;
        const charY = H - 185;   // bottom of character, 195 px above screen base
        this.charImage = this.add.image(charX, charY, 'ki1')
            .setOrigin(0.5, 1)
            .setScale(0.2)
            .setAlpha(1);
        // this.tweens.add({ targets: this.charImage, alpha: 1, duration: 500, ease: 'Power2' });

        // -- Sparkle emitter (glowing stars around character) --
        this.add.particles(charX, charY, 'sparkle', {
            x:         { min: -115, max: 115 },
            y:         { min: -430, max: -20 },
            speed:     { min: 15, max: 55 },
            angle:     { min: 0, max: 360 },
            scale:     { start: 1, end: 0 },
            alpha:     { start: 0.9, end: 0 },
            lifespan:  1400,
            quantity:  1,
            frequency: 100,
            tint:      [0xffd700, 0xffddaa, 0xffffff, 0xffd9e8],
            blendMode: 'ADD'
        });

        // -- Dialogue box (bottom-center) --
        const boxH   = 165;
        const boxY   = H - boxH - 20;
        const boxX   = 40;
        const boxW   = W - 80;
        const boxPad = 28;

        const dialogBox = this.add.graphics();
        dialogBox.fillStyle(0x0d0620, 0.8);
        dialogBox.lineStyle(2, 0xf8d77c, 0.8);
        dialogBox.fillRoundedRect(boxX, boxY, boxW, boxH, 14);
        dialogBox.strokeRoundedRect(boxX, boxY, boxW, boxH, 14);

        // Speaker name
        this.speakerText = this.add.text(boxX + boxPad, boxY + 18, '', {
            fontFamily: 'AriW9500, serif',
            fontSize: '22px',
            color: '#f8d77c',
            stroke: '#0d0620',
            strokeThickness: 4
        });

        // Dialogue body (typewriter)
        this.dialogueText = this.add.text(boxX + boxPad, boxY + 54, '', {
            fontFamily: 'AriW9500, serif',
            fontSize: '19px',
            color: '#ffffff',
            stroke: '#0d0620',
            strokeThickness: 3,
            wordWrap: { width: boxW - boxPad * 2 - 72 },
            lineSpacing: 6
        });

        // -- Next button — circular green, bottom-right of dialogue box --
        this._btnX = boxX + boxW - 38;
        this._btnY = boxY + boxH - 38;
        this.btnGfx = this.add.graphics();
        this._drawBtn(false);

        this.add.text(this._btnX, this._btnY, '▶', {
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const btnZone = this.add.zone(this._btnX, this._btnY, 56, 56)
            .setInteractive({ useHandCursor: true });
        btnZone.on('pointerover',  () => this._drawBtn(true));
        btnZone.on('pointerout',   () => this._drawBtn(false));
        btnZone.on('pointerdown',  () => this.advanceDialogue());

        // Keyboard shortcuts
        this.input.keyboard.on('keydown-SPACE', () => this.advanceDialogue());
        this.input.keyboard.on('keydown-ENTER', () => this.advanceDialogue());

        // -- Wait for custom font, then start --
        WebFont.load({
            custom: {
                families: ['AriW9500'],
                urls: ['assets/fonts/ari_w9500/ari-w9500.ttf']
            },
            active:   () => this._beginDialogue(),
            inactive: () => this._beginDialogue()
        });
    }

    // -------------------------------------------------------------------------
    // Internal helpers
    // -------------------------------------------------------------------------

    _drawBtn(hover) {
        this.btnGfx.clear();
        this.btnGfx.fillStyle(hover ? 0x27ae60 : 0x2ecc71, 1);
        this.btnGfx.fillCircle(this._btnX, this._btnY, 26);
        this.btnGfx.lineStyle(2, 0xffffff, 0.7);
        this.btnGfx.strokeCircle(this._btnX, this._btnY, 26);
    }

    _beginDialogue() {
        // Re-apply font family after webfont load confirms availability
        this.speakerText.setFontFamily('AriW9500');
        this.dialogueText.setFontFamily('AriW9500');
        this.showDialogue(0);
    }

    // -------------------------------------------------------------------------
    // Dialogue flow
    // -------------------------------------------------------------------------

    showDialogue(index) {
        const d = DIALOGUES[index];
        // if ki talking scale 0.2, if bayu talking scale 0.22 (slightly larger to differentiate)
        if (d.speaker === 'Ki Mangun') {
            this.charImage.setScale(0.28);
        } else {
            this.charImage.setScale(0.27);
        }
        this.charImage.setTexture(d.sprite);
        this.tweens.add({ targets: this.charImage, alpha: 1, duration: 300 });
        this._playTween(d.tween);

        // Speaker name
        this.speakerText.setText(d.speaker);

        // Typewriter body text
        this._typeText(d.text);
    }

    _typeText(full) {
        if (this.typingTimer) this.typingTimer.remove();
        this.dialogueText.setText('');
        this.isTyping = true;
        let i = 0;
        this.typingTimer = this.time.addEvent({
            delay: 26,
            loop: true,
            callback: () => {
                this.dialogueText.setText(full.slice(0, ++i));
                if (i >= full.length) {
                    this.typingTimer.remove();
                    this.isTyping = false;
                }
            }
        });
    }

    // -------------------------------------------------------------------------
    // Character animation tweens — express emotion through movement
    // -------------------------------------------------------------------------

    _playTween(type) {
        const img = this.charImage;
        this.tweens.killTweensOf(img);
        const bx = img.x;
        const by = img.y;
        const sx = img.scaleX;
        const sy = img.scaleY;

        switch (type) {
            case 'raise':
                // serius — angkat tangan: bob naik sekali
                this.tweens.add({ targets: img, y: by - 14, duration: 320, yoyo: true, ease: 'Sine.easeInOut' });
                break;

            case 'stepback':
                // bingung — langkah mundur: geser ke kanan lalu kembali
                this.tweens.add({ targets: img, x: bx + 22, duration: 260, yoyo: true, ease: 'Power1' });
                break;

            case 'lean':
                // lembut — menepuk bahu: condong maju (scale naik) lalu kembali
                this.tweens.add({
                    targets: img,
                    scaleX: sx * 1.05, scaleY: sy * 1.05,
                    duration: 340, yoyo: true, ease: 'Sine.easeInOut'
                });
                break;

            case 'bow':
                // cemas — menunduk: turun sedikit lalu naik kembali
                this.tweens.add({ targets: img, y: by + 18, duration: 300, yoyo: true, ease: 'Power1' });
                break;

            case 'gesture':
                // berwibawa — isyarat luas tangan: ayun kiri lalu kanan lalu kembali
                this.tweens.add({
                    targets: img, x: bx - 18, duration: 220, ease: 'Sine.easeInOut',
                    onComplete: () => {
                        this.tweens.add({
                            targets: img, x: bx + 18, duration: 220, ease: 'Sine.easeInOut',
                            onComplete: () => {
                                this.tweens.add({ targets: img, x: bx, duration: 200, ease: 'Sine.easeInOut' });
                            }
                        });
                    }
                });
                break;

            case 'pulse':
                // tekad — kepal ke dada: denyut skala dua kali
                this.tweens.add({
                    targets: img,
                    scaleX: sx * 1.07, scaleY: sy * 1.07,
                    duration: 180, yoyo: true, repeat: 1, ease: 'Power2'
                });
                break;

            case 'drift':
                // peringatan — serahkan kotak: meluncur maju perlahan, linggal sejenak
                this.tweens.add({
                    targets: img,
                    scaleX: sx * 1.04, scaleY: sy * 1.04,
                    duration: 700, yoyo: true, ease: 'Sine.easeInOut'
                });
                break;
        }
    }

    // -------------------------------------------------------------------------
    // Advance / skip
    // -------------------------------------------------------------------------

    advanceDialogue() {
        // First press skips typewriter to full text
        if (this.isTyping) {
            if (this.typingTimer) this.typingTimer.remove();
            this.isTyping = false;
            this.dialogueText.setText(DIALOGUES[this.dialogueIndex].text);
            return;
        }

        this.dialogueIndex++;
        if (this.dialogueIndex >= DIALOGUES.length) {
            // Fade to black then start game
            this.cameras.main.fadeOut(600, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('GameScene');
            });
        } else {
            this.showDialogue(this.dialogueIndex);
        }
    }
}
