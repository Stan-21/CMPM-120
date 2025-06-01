class Start extends Phaser.Scene {
    constructor() {
        super("startScene");
        this.my = {sprite: {}, text: {}};
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");

        this.load.setPath("./assets/");
        // body
        this.load.image("character", "paddle.png");

    
        this.load.image('image', 'ball.png');
    }

    create() {
        let my = this.my;
        my.text.gameName = this.add.bitmapText(game.config.width/2, game.config.height/4, "rocketSquare", "Pong!").setOrigin(0.5, 0.5);
        my.startButton = this.add.text(game.config.width/2, game.config.height/2.5, 'Start', {fill: '#0f0', fontSize: 30}).setOrigin(0.5, 0.5);
        my.startButton.setInteractive();

        my.startButton.on('pointerdown', () => { this.scene.start("gameScene") });
        my.startButton.on('pointerout', () => { my.startButton.setStyle({fill: '#0f0' }) });
        my.startButton.on('pointerover', () => { my.startButton.setStyle({fill: '#ff0' }) });

        my.controlButton = this.add.text(game.config.width/2, game.config.height/2.1, 'Controls', {fill: '#0f0', fontSize: 30}).setOrigin(0.5, 0.5);
        my.controlButton.setInteractive();

        my.controlButton.on('pointerdown', () => { this.scene.start("controlScene") });
        my.controlButton.on('pointerout', () => { my.controlButton.setStyle({fill: '#0f0' }) });
        my.controlButton.on('pointerover', () => { my.controlButton.setStyle({fill: '#ff0' }) });

        my.creditButton = this.add.text(game.config.width/2, game.config.height/1.8, 'Credits', {fill: '#0f0', fontSize: 30}).setOrigin(0.5, 0.5);
        my.creditButton.setInteractive();

        my.creditButton.on('pointerdown', () => { this.scene.start("creditsScene") });
        my.creditButton.on('pointerout', () => { my.creditButton.setStyle({fill: '#0f0' }) });
        my.creditButton.on('pointerover', () => { my.creditButton.setStyle({fill: '#ff0' }) });

        //this.scene.start("upgradeScene"); 
    }
}

function shuffle(array) {
    let currentIndex = array.length;

    while (currentIndex!=0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}