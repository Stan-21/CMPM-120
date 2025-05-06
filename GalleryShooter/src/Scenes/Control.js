class Control extends Phaser.Scene {
    constructor() {
        super("controlScene");
        this.my = {sprite: {}, text: {}};
    }

    preload() { // assets will be loaded in Start, delete later to not double load yknow
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
    }

    create() {
        let my = this.my;
        my.text.gameName = this.add.bitmapText(game.config.width/4, game.config.height/8, "rocketSquare", "Shoot the cards!").setOrigin(0.5, 0.5);
        my.text.gameName.rotation = 25;

        my.card1 = this.add.sprite(125, 175, "cards", "S1.png");
        my.card2 = this.add.sprite(175, 175, "cards", "D13.png");
        my.card3 = this.add.sprite(225, 175, "cards", "C5.png");
        my.card4 = this.add.sprite(275, 175, "cards", "H2.png");

        my.text.controls = this.add.bitmapText(game.config.width/4*3, game.config.height/3.5, "rocketSquare", "Use A & D to move! \n Space to shoot!").setOrigin(0.5, 0.5);
        my.text.controls.rotation = -25;

        my.demoPlayer = this.add.sprite(550, 300, "character");
        my.demoAttack = this.add.sprite(550, 240, "diceNum", "dieWhite_border6.png");
        my.demoAttack.setScale(0.5, 0.5);

        my.text.joker = this.add.bitmapText(game.config.width/3.5, game.config.height/2, "rocketSquare", "Watch out for Joker cards \n and their projectiles!").setOrigin(0.5, 0.5);
        my.text.joker.setScale(0.65, 0.65);
        my.text.joker.rotation = 25;

        my.jokerR = this.add.sprite(125, 400, "cards", "rJ.png");
        my.jokerB = this.add.sprite(175, 400, "cards", "bJ.png");
        my.jProjectile = this.add.sprite(240, 400, "cards", "blankFront.png");
        my.jProjectile.rotation = Math.PI / 2;

        my.text.border = this.add.bitmapText(game.config.width/4*2.8, game.config.height/4*3.1, "rocketSquare", "Don't let the cards pass the red border!").setOrigin(0.5, 0.5);
        my.text.border.setScale(0.5, 0.5);

        this.add.rectangle(game.config.width/2, game.config.height, game.config.width, game.config.height/5 * 2, 0xff0000);


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