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
        my.startButton = this.add.text(game.config.width/2, game.config.height/2.5, 'Resume', {fill: '#0f0', fontSize: 30}).setOrigin(0.5, 0.5);
        my.startButton.setInteractive();

        my.startButton.on('pointerdown', () => { 
            this.scene.resume("gameScene");
            this.scene.stop(); 
        });
        my.startButton.on('pointerout', () => { my.startButton.setStyle({fill: '#0f0' }) });
        my.startButton.on('pointerover', () => { my.startButton.setStyle({fill: '#ff0' }) });
        
    }
}