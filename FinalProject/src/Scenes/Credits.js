class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");
        this.my = {sprite: {}, text: {}};
    }

    create() {
        let my = this.my;
        my.text.gameName = this.add.bitmapText(game.config.width/2, game.config.height/4.5, "rocketSquare", "Credits!").setOrigin(0.5, 0.5);
        my.text.gameName.setScale(1.25, 1.25);
        const content = [
            'Game Design: Stanley Hung',
            '',
            '',
            '',
            '',
            'Programming: Stanley Hung',
            '',
            '',
            '',
            '',
            'Art: Kenney',
            '',
            '',
            '',
            '',
            'Sound effects: Kenney',
            '',
            '',
            '',
            '',
            '',
            'Developed for CMPM 120'
        ]

        const graphics = this.make.graphics();
        graphics.fillRect(game.config.width / 2 - 160, game.config.height / 2 - 125, 320, 350); // x, y, width, height

        my.mask = new Phaser.Display.Masks.GeometryMask(this, graphics);

        my.text = this.add.text(game.config.width / 2, game.config.height / 2 + 200, content, { fontFamily: 'Arial', color: '#00ff00', wordWrap: { width: 310 } }).setOrigin(0.5, 0.5);

        my.text.setMask(my.mask);

        my.backButton = this.add.text(game.config.width / 8, game.config.height/10 * 9, "Back", {fill: '#0f0', fontSize: 30}).setOrigin(0.5, 0.5);
        my.backButton.setInteractive();
        my.backButton.on('pointerdown', () => { this.scene.start("startScene") });
        my.backButton.on('pointerout', () => { my.backButton.setStyle({fill: '#0f0' }) });
        my.backButton.on('pointerover', () => { my.backButton.setStyle({fill: '#ff0' }) });


    }

    update() {
        this.my.text.y += -1.5;
        console.log(this.my.text.y);
        if (this.my.text.y <= -50) {
            this.my.text.y = game.config.height / 2 + 200;
        }
    }
    
}