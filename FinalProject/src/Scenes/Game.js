class Game extends Phaser.Scene {
    constructor() {
        super("gameScene");
        this.my = {sprite: {}, text: {}};

        this.my.sprite.bullet = [];
        this.my.sprite.enemy = [];
        this.my.sprite.enemyBullet = [];
        this.my.spawnPoints = [];
        this.maxBullets = 10;

    }

    init() {
    }

    preload() {
    }

    create() {
        let my = this.my;   // create an alias to this.my for readability

        my.text.p1Score = this.add.bitmapText(game.config.width/3, game.config.height/6, "rocketSquare", "0").setOrigin(0.5, 0.5).setScale(3);
        my.text.p2Score = this.add.bitmapText(game.config.width/3 * 2, game.config.height/6, "rocketSquare", "0").setOrigin(0.5, 0.5).setScale(3);

        console.log(my.text.p1Score);

        // Create Player 1 and controls
        this.p1Up = this.input.keyboard.addKey("W");
        this.p1Down = this.input.keyboard.addKey("S");
        my.sprite.player1 = new Player(this, game.config.width/8, game.config.height/2, "character", null,
            this.p1Up, this.p1Down, 10);
        my.sprite.player1.angle = 90;
        my.sprite.player1.setScale(2);

        // Create Player 2 and controls
        this.arrowKey = this.input.keyboard.createCursorKeys();
        this.p2Up = this.arrowKey.up;
        this.p2Down = this.arrowKey.down;
        my.sprite.player2 = new Player(this, game.config.width/8*7, game.config.height/2, "character", null,
            this.p2Up, this.p2Down, 10);
        my.sprite.player2.angle = 90;
        my.sprite.player2.setScale(2);

        my.sprite.ball = new Ball(this, game.config.width / 2, game.config.height / 2, "image", null, 5); // Create ball

    }

    update() {
        let my = this.my;    // create an alias to this.my for readability
        my.sprite.player1.update();
        my.sprite.player2.update();
        my.sprite.ball.update();

        if ((this.collides(my.sprite.player1, my.sprite.ball) && (my.sprite.ball.velocityX < 0)) || 
        (this.collides(my.sprite.player2, my.sprite.ball) && (my.sprite.ball.velocityX > 0))) {
            my.sprite.ball.velocityX *= -1;
        }

        if ((my.sprite.ball.x <= 0) || (my.sprite.ball.x > game.config.width)) {
            this.updateScore(my.sprite.ball.x <= 0);
            my.sprite.ball.x = game.config.width / 2;
            my.sprite.ball.y = game.config.height / 2;
        }
    }

    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayHeight/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayWidth/2 + b.displayHeight/2)) return false;
        return true;
    }

    updateScore(p1Win) {
        if (p1Win) {
            my.text.p1Score.text = toString(this.my.sprite.player1.score);
        } else {
            my.text.p2Score.text = toString(this.my.sprite.player2.score);
        }
        
    }
}