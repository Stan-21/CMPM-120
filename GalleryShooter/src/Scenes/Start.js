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
        this.load.image("character", "pieceBlue_single00.png");
        // dice atlas
        this.load.atlasXML("diceNum", "diceWhite_border.png", "diceWhite_border.xml");
        // enemy atlas
        this.load.atlasXML("cards", "cardsLarge_tilemap_packed.png", "cardsLarge_tilemap_packed.xml");

        this.load.audio("shoot", "dieThrow1.ogg");

        const asyncLoader = () => new Promise(() => {
            setTimeout(() => {
            }, 2000)
        });
    
        const doStuff = async () => {
            await asyncLoader();
            
        };
    
        this.load.image('image', 'item_sword.png');
        doStuff();
        this.load.image('image3', 'item_sword.png');
    }

    create() {
        let my = this.my;
        my.text.gameName = this.add.bitmapText(game.config.width/2, game.config.height/4, "rocketSquare", "Poker Gallery Shooter!").setOrigin(0.5, 0.5);
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
        
    }
}