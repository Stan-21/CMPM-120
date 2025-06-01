class Game extends Phaser.Scene {
    constructor() {
        super("gameScene");
        this.my = {sprite: {}, text: {}};

        this.my.sprite.bullet = [];
        this.my.sprite.enemy = [];
        this.my.sprite.enemyBullet = [];
        this.my.spawnPoints = [];
        this.maxBullets = 10;

        this.running = false;

    }

    init() {
    }

    preload() {
    }

    create() {
        let my = this.my;   // create an alias to this.my for readability

        my.text.p1Score = this.add.bitmapText(game.config.width/3, game.config.height/6, "rocketSquare", "0").setOrigin(0.5, 0.5).setScale(3);
        my.text.p2Score = this.add.bitmapText(game.config.width/3 * 2, game.config.height/6, "rocketSquare", "0").setOrigin(0.5, 0.5).setScale(3);

        // Create Player 1 and controls
        this.p1Up = this.input.keyboard.addKey("W");
        this.p1Down = this.input.keyboard.addKey("S");
        my.sprite.player1 = new Player(this, game.config.width/8, game.config.height/2, "character", null,
            this.p1Up, this.p1Down, 10);
        my.sprite.player1.angle = 90;
        my.sprite.player1.setScale(2);
        my.sprite.player1.displayWidth = 100;
        
        // Create Player 2 and controls
        this.arrowKey = this.input.keyboard.createCursorKeys();
        this.p2Up = this.arrowKey.up;
        this.p2Down = this.arrowKey.down;
        my.sprite.player2 = new Player(this, game.config.width/8*7, game.config.height/2, "character", null,
            this.p2Up, this.p2Down, 10);
        my.sprite.player2.angle = 90;
        my.sprite.player2.setScale(2);
        my.sprite.player2.displayWidth = 100;

        my.sprite.ball = new Ball(this, game.config.width / 2, game.config.height / 2, "image", null, 5); // Create ball

        // Start the game on click
        this.input.on('pointerdown', () => {
            this.running = true;
        });

        let pKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        pKey.on('down', (key, event) => {
            this.scene.launch('pauseScene')
            this.scene.pause();
        });

        this.createUpgrades();
    }

    update() {
        let my = this.my;    // create an alias to this.my for readability
        my.sprite.player1.update();
        my.sprite.player2.update();
        if (this.running) {
            my.sprite.ball.update();
        }

        if (my.sprite.ball.velocityX < 0) {
            if (this.collides(my.sprite.player1, my.sprite.ball)) {
                this.calculateAngle(my.sprite.player1, my.sprite.ball);
                if (my.sprite.ball.velocityX < 0) {
                    my.sprite.ball.velocityX *= -1;
                }
            }
        }

        if (my.sprite.ball.velocityX > 0) {
            if (this.collides(my.sprite.player2, my.sprite.ball)) {
                this.calculateAngle(my.sprite.player2, my.sprite.ball);
                if (my.sprite.ball.velocityX > 0) {
                    my.sprite.ball.velocityX *= -1;
                }
            }
        }

        if ((my.sprite.ball.x <= 0) || (my.sprite.ball.x > game.config.width)) {
            this.updateScore(my.sprite.ball.x > game.config.width);
            console.log(this.upgrade_data);
            this.scene.launch('upgradeScene', {p1Wins: my.sprite.ball.x > game.config.width, upgrades: this.upgrade_data,
                player1: my.sprite.player1, player2: my.sprite.player2
            });
            this.scene.pause();
            my.sprite.ball.x = game.config.width / 2;
            my.sprite.ball.y = my.sprite.player1.y = my.sprite.player2.y = game.config.height / 2;
            my.sprite.ball.velocityX *= -1;
            this.running = false;
            this.sleep(1000).then(() => {
                this.running = true;
            });
        }
    }

    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayHeight/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayWidth/2 + b.displayHeight/2)) return false;
        return true;
    }

    calculateAngle(a, b) {
        var relativeIntersectY = a.y - b.y;
        var normalizedRelativeIntersectionY = (relativeIntersectY/(a.displayWidth/2));
        var bounceAngle = normalizedRelativeIntersectionY * (5*Math.PI/12);
        b.velocityX = 10*Math.cos(bounceAngle);
        b.velocityY = 10*-Math.sin(bounceAngle);
    }

    updateScore(p1Win) {
        let my = this.my
        if (p1Win) {
            my.sprite.player1.score += 1;
            my.text.p1Score.text = this.my.sprite.player1.score.toString();
        } else {
            my.sprite.player2.score += 1;
            my.text.p2Score.text = this.my.sprite.player2.score.toString();
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    createUpgrades() {
    
        this.plus_speed = ['Move +', 'Increase movement speed', 'speedFunction()'];
        this.plus_size = ['Size +', 'Increase size', 'sizeFunction()'];
        this.plus_score = ['Score +', 'Increase score', 'scoreFunction()'];

        this.upgrade_data = [this.plus_speed, this.plus_size, this.plus_score];
        console.log(this.upgrade_data);
    }
}