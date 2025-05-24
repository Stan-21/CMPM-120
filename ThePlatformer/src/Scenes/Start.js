class Start extends Phaser.Scene {
    constructor() {
        super("startScene");
        this.my = {sprite: {}, text: {}};
    }

    preload() {
    }

    create() {
        let my = this.my;
        my.text.gameName = this.add.text(game.config.width/2, game.config.height/4, 'Platformer Demo!', {fill: '#0f0', fontSize: 30}).setOrigin(0.5, 0.5);
        my.startButton = this.add.text(game.config.width/2, game.config.height/2.5, 'Start', {fill: '#0f0', fontSize: 30}).setOrigin(0.5, 0.5);
        my.startButton.setInteractive();

        my.startButton.on('pointerdown', () => { this.scene.start("platformerScene") });
        my.startButton.on('pointerout', () => { my.startButton.setStyle({fill: '#0f0' }) });
        my.startButton.on('pointerover', () => { my.startButton.setStyle({fill: '#ff0' }) });

        /*my.controlButton = this.add.text(game.config.width/2, game.config.height/2.1, 'Controls', {fill: '#0f0', fontSize: 30}).setOrigin(0.5, 0.5);
        my.controlButton.setInteractive();

        my.controlButton.on('pointerdown', () => { this.scene.start("controlScene") });
        my.controlButton.on('pointerout', () => { my.controlButton.setStyle({fill: '#0f0' }) });
        my.controlButton.on('pointerover', () => { my.controlButton.setStyle({fill: '#ff0' }) });

        my.creditButton = this.add.text(game.config.width/2, game.config.height/1.8, 'Credits', {fill: '#0f0', fontSize: 30}).setOrigin(0.5, 0.5);
        my.creditButton.setInteractive();

        my.creditButton.on('pointerdown', () => { this.scene.start("creditsScene") });
        my.creditButton.on('pointerout', () => { my.creditButton.setStyle({fill: '#0f0' }) });
        my.creditButton.on('pointerover', () => { my.creditButton.setStyle({fill: '#ff0' }) });
        */
    }
}