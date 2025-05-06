class Start extends Phaser.Scene {
    constructor() {
        super("startScene");
        this.my = {sprite: {}, text: {}};
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");

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
        my.text.gameName = this.add.bitmapText(game.config.width/2, game.config.height/4, "rocketSquare", "*insert game name!*").setOrigin(0.5, 0.5);
        my.startButton = this.add.text(game.config.width/2, game.config.height/2.5, 'Start', {fill: '#0f0', fontSize: 30}).setOrigin(0.5, 0.5);
        my.startButton.setInteractive();

        my.startButton.on('pointerdown', () => { this.scene.start("gameScene") });
        my.startButton.on('pointerout', () => { my.startButton.setStyle({fill: '#0f0' }) });
        my.startButton.on('pointerover', () => { my.startButton.setStyle({fill: '#ff0' }) });
        
    }
}