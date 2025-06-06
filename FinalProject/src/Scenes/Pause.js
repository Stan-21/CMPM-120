class Pause extends Phaser.Scene {
    constructor() {
        super("pauseScene");
        this.my = {sprite: {}, text: {}};
    }

    preload() {
    }

    create() {
        let my = this.my;
        my.text.gameName = this.add.bitmapText(game.config.width/2, game.config.height/4, "rocketSquare", "Paused!").setOrigin(0.5, 0.5);
        my.resumeButton = this.add.text(game.config.width/2, game.config.height/2.5, 'Resume', {fill: '#0f0', fontSize: 30}).setOrigin(0.5, 0.5);
        my.resumeButton.setInteractive();

        my.resumeButton.on('pointerdown', () => { 
            this.scene.resume("gameScene");
            this.scene.stop(); 
        });
        my.resumeButton.on('pointerout', () => { my.resumeButton.setStyle({fill: '#0f0' }) });
        my.resumeButton.on('pointerover', () => { my.resumeButton.setStyle({fill: '#ff0' }) });

        my.quitButton = this.add.text(game.config.width/2, game.config.height/2, 'Quit', {fill: '#0f0', fontSize: 30}).setOrigin(0.5, 0.5);
        my.quitButton.setInteractive();

        my.quitButton.on('pointerdown', () => { 
            this.scene.stop("gameScene");
            this.scene.start("startScene"); 
        });
        my.quitButton.on('pointerout', () => { my.quitButton.setStyle({fill: '#0f0' }) });
        my.quitButton.on('pointerover', () => { my.quitButton.setStyle({fill: '#ff0' }) });

        let pKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        pKey.on('down', (key, event) => {
            this.scene.resume("gameScene");
            this.scene.stop();
        });
        
    }
}