class Upgrade extends Phaser.Scene {
    constructor() {
        super("upgradeScene");
        this.my = {sprite: {}, text: {}};
    }

    init(data) {
        this.p1Wins = data.p1Wins;
        this.p1 = data.player1;
        this.p2 = data.player2;
        console.log(this.p1);
        this.upgrade_data = data.upgrades;

        this.buffTarget;
        if (this.p1Wins) {
            this.buffTarget = "this.p2.";
        } else {
            this.buffTarget = "this.p1.";
        }
    }

    preload() {
    }

    create() {
        let my = this.my;
        my.text.gameName = this.add.bitmapText(game.config.width/2, game.config.height/4, "rocketSquare", "Player" + this.buffTarget[6] + "!  Choose an upgrade!").setOrigin(0.5, 0.5);
        my.startButton = this.add.text(game.config.width/2, game.config.height/2.5, 'Resume', {fill: '#0f0', fontSize: 30}).setOrigin(0.5, 0.5);
        my.startButton.setInteractive();

        my.startButton.on('pointerdown', () => { 
            this.scene.resume("gameScene");
            this.scene.stop(); 
        });
        my.startButton.on('pointerout', () => { my.startButton.setStyle({fill: '#0f0' }) });
        my.startButton.on('pointerover', () => { my.startButton.setStyle({fill: '#ff0' }) });

        var WHITE = 0xFFFFFF;
        var RED = 0xFF0000;
        var graphics = this.add.graphics();
        graphics.fillStyle(WHITE, 1);

        var slot1 = new Phaser.Geom.Rectangle(game.config.width/8 * 2 - 50, game.config.height / 2 - 75, 100, 100);
        var slot1Zone = this.add.zone(slot1.x + 50, slot1.y + 50, 100, 100).setInteractive();
        var slot2 = new Phaser.Geom.Rectangle(game.config.width/8 * 4 - 50, game.config.height / 2 - 75, 100, 100);
        var slot2Zone = this.add.zone(slot2.x + 50, slot2.y + 50, 100, 100).setInteractive();
        var slot3 = new Phaser.Geom.Rectangle(game.config.width/8 * 6 - 50, game.config.height / 2 - 75, 100, 100);
        var slot3Zone = this.add.zone(slot3.x + 50, slot3.y + 50, 100, 100).setInteractive();

        slot1Zone.on('pointerdown', () => { eval(this.buffTarget+this.upgrade_data[0][2]);
            this.scene.resume("gameScene");
            this.scene.stop(); 
        });

        slot1Zone.on('pointerover', () => {
            graphics.lineStyle(5, WHITE, 1);
            graphics.strokeRectShape(slot1);
        });

        slot1Zone.on('pointerout', () => {
            graphics.lineStyle(5, RED, 1);
            graphics.strokeRectShape(slot1);
        });

        slot2Zone.on('pointerdown', () => { eval(this.buffTarget+this.upgrade_data[1][2]) 
            console.log(this.upgrade_data[1]);
            this.scene.resume("gameScene");
            this.scene.stop(); 
        });

        slot2Zone.on('pointerover', () => {
            graphics.lineStyle(5, WHITE, 1);
            graphics.strokeRectShape(slot2);
        });

        slot2Zone.on('pointerout', () => {
            graphics.lineStyle(5, RED, 1);
            graphics.strokeRectShape(slot2);
        });

        slot3Zone.on('pointerdown', () => { eval(this.buffTarget+this.upgrade_data[2][2]) 
            this.scene.resume("gameScene");
            this.scene.stop(); 
        });

        slot3Zone.on('pointerover', () => {
            graphics.lineStyle(5, WHITE, 1);
            graphics.strokeRectShape(slot3);
        });

        slot3Zone.on('pointerout', () => {
            graphics.lineStyle(5, RED, 1);
            graphics.strokeRectShape(slot3);
        });
        
        graphics.fillStyle(RED, 1);
        graphics.fillRectShape(slot1);
        graphics.fillRectShape(slot2);
        graphics.fillRectShape(slot3);

        this.upgrade1 = new Array(3);
        this.upgrade2 = new Array(3);
        this.upgrade3 = new Array(3);
        
    }
}