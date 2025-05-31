class End extends Phaser.Scene {
    constructor() {
        super("endScene");
        this.my = {sprite: {}, text: {}};
    }

    init(data) {
        this.status = data.status; // win or lose
        this.finalScore = data.score;
        console.log(data);
    }

    preload() {
    }

    create() {
        let my = this.my;
        my.text.gameName = this.add.bitmapText(game.config.width/2, game.config.height/4, "rocketSquare", "You " + this.status + "!").setOrigin(0.5, 0.5);
        my.score = this.add.text(game.config.width/2, game.config.height/2.5, "Final score: " + this.finalScore, 
            {fill: '#0f0', fontSize: 30}).setOrigin(0.5, 0.5);
        my.retryButton = this.add.text(game.config.width/2, game.config.height/2, "Try again?", {fill: '#0f0', fontSize: 30}).setOrigin(0.5, 0.5);
        my.quitButton = this.add.text(game.config.width/2, game.config.height/6 * 3.5, "Quit", {fill: '#0f0', fontSize: 30}).setOrigin(0.5, 0.5);

        my.retryButton.setInteractive();
        my.quitButton.setInteractive();

        my.retryButton.on('pointerdown', () => { this.scene.start("gameScene") });
        my.retryButton.on('pointerout', () => { my.retryButton.setStyle({fill: '#0f0' }) });
        my.retryButton.on('pointerover', () => { my.retryButton.setStyle({fill: '#ff0' }) });

        my.quitButton.on('pointerdown', () => { this.scene.start("startScene") });
        my.quitButton.on('pointerout', () => { my.quitButton.setStyle({fill: '#0f0' }) });
        my.quitButton.on('pointerover', () => { my.quitButton.setStyle({fill: '#ff0' }) });
    }
}