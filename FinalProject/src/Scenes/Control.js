class Control extends Phaser.Scene {
    constructor() {
        super("controlScene");
        this.my = {sprite: {}, text: {}};
    }

    preload() { 
    }

    create() {
        // Creates all the text for the controls scene
        let my = this.my;
        my.text.gameName = this.add.bitmapText(game.config.width/4, game.config.height/8, "rocketSquare", "Pong!  \nWith upgrades!").setOrigin(0.5, 0.5);
        my.text.gameName.rotation = 25;

        my.text.controls = this.add.bitmapText(game.config.width/4*2.8, game.config.height/3.5, "rocketSquare", "P1 use W & S to move!").setOrigin(0.5, 0.5);
        my.text.controls.rotation = -25;
        my.text.controls1 = this.add.bitmapText(game.config.width/4*2.8, game.config.height/3, "rocketSquare", "P2 use up & down arrow to move!").setOrigin(0.5, 0.5);
        my.text.controls1.setScale(0.70, 0.70);
        my.text.controls1.rotation = -25;

        my.text.joker = this.add.bitmapText(game.config.width/3.5, game.config.height/2, "rocketSquare", "If you lose, get an upgrade!").setOrigin(0.5, 0.5);
        my.text.joker.setScale(0.65, 0.65);
        my.text.joker.rotation = 25;

        my.text.border = this.add.bitmapText(game.config.width/4*2.8, game.config.height/4*3.1, "rocketSquare", "First to 7 wins!").setOrigin(0.5, 0.5);
        my.text.border.setScale(0.5, 0.5);

        this.add.rectangle(game.config.width/2, game.config.height, game.config.width, game.config.height/5 * 2, 0xff0000);


        // Go directly to start or game scene
        my.backButton = this.add.text(game.config.width / 8, game.config.height/10 * 9, "Back", {fill: '#0f0', fontSize: 30}).setOrigin(0.5, 0.5);
        my.backButton.setInteractive();
        my.backButton.on('pointerdown', () => { this.scene.start("startScene") });
        my.backButton.on('pointerout', () => { my.backButton.setStyle({fill: '#0f0' }) });
        my.backButton.on('pointerover', () => { my.backButton.setStyle({fill: '#ff0' }) });

        my.startButton = this.add.text(game.config.width / 8 * 7, game.config.height/10 * 9, "Play!", {fill: '#0f0', fontSize: 30}).setOrigin(0.5, 0.5);
        my.startButton.setInteractive();
        my.startButton.on('pointerdown', () => { this.scene.start("gameScene") });
        my.startButton.on('pointerout', () => { my.startButton.setStyle({fill: '#0f0' }) });
        my.startButton.on('pointerover', () => { my.startButton.setStyle({fill: '#ff0' }) });
    }
}