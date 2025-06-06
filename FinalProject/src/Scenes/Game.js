class Game extends Phaser.Scene {
    constructor() {
        super("gameScene");
        this.my = {sprite: {}, text: {}};

        this.my.sprite.bullet = [];
        this.my.sprite.enemy = [];
        this.my.sprite.enemyBullet = [];
        this.my.spawnPoints = [];
        this.maxBullets = 10;

        this.my.bumpers = [];

        this.running = false;
        this.altServe = 1;
    }

    init() {
        let my = this.my;
        
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

        var graphics = this.add.graphics();
        graphics.fillStyle(0xFFFFFF, 1);
        this.centerLine = new Phaser.Geom.Rectangle(game.config.width/2 - 2.5, 0, 5, game.config.height);
        graphics.fillRectShape(this.centerLine);

        my.sprite.ball = new Ball(this, game.config.width / 2, game.config.height / 2, "image", null, 5); // Create ball

        /*this.sleep(2000).then(() => {
            this.running = true;
        })*/
    }

    preload() {
    }

    create() {

        let my = this.my;   // create an alias to this.my for readability
        // Start the game on click
        this.input.on('pointerdown', () => {
            if (!this.running) {
                this.sleep(2000).then(() => {
                    this.running = true;
                });
            }
        });

        let pKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        pKey.on('down', (key, event) => {
            this.scene.launch('pauseScene')
            this.scene.pause();
        });

        this.createUpgrades();



        this.vfx = this.add.particles(0, 0, "image", {
            alpha: 0.5,
            follow: my.sprite.ball,
            followOffset: {x: -1, y: -1},
            lifespan: 500,
            angle: { min: -80, max: -100 },
            scale: { start: 0.5, end: 0, ease: 'sine.in' },
            speed: { min: 250, max: 350 },
            advance: 2000
        });

        this.p1vfx = this.add.particles(0, 0, "image", {
            alpha: {start: 1, end: 0, ease: 'sine.in'},
            lifespan: 1000,
            y: {min: 0, max: 100},
            angle: { min: -90, max: 90 },
            scale: { start: 0.25 , end: 0, ease: 'sine.in' },
            speed: { min: 500, max: 1000 },
            stopAfter: 100,
            emitting: false
        });

        this.p2vfx = this.add.particles(game.config.width, 0, "image", {
            alpha: {start: 1, end: 0, ease: 'sine.in'},
            lifespan: 1000,
            y: {min: 0, max: 100},
            angle: { min: 90, max: 270 },
            scale: { start: 0.25, end: 0, ease: 'sine.in' },
            speed: { min: 500, max: 1000 },
            stopAfter: 1000,
            emitting: false
        });
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
                this.sound.play("hit");
                if (my.sprite.ball.velocityX < 0) {
                    my.sprite.ball.velocityX *= -1;
                }
            }
        }

        if (my.sprite.ball.velocityX > 0) {
            if (this.collides(my.sprite.player2, my.sprite.ball)) {
                this.calculateAngle(my.sprite.player2, my.sprite.ball);
                this.sound.play("hit");
                if (my.sprite.ball.velocityX > 0) {
                    my.sprite.ball.velocityX *= -1;
                }
            }
        }

        for (let bumper of this.my.bumpers) {
            if (this.collides(bumper, my.sprite.ball)) {
                this.calculateAngle(bumper, my.sprite.ball);
            }
        }

        if (this.running) {
            if ((my.sprite.ball.x <= -10) || (my.sprite.ball.x > game.config.width + 10)) {
                this.updateScore(my.sprite.ball.x > game.config.width);
                this.running = false;
                this.sleep(1000).then(() => {
                    if ((my.sprite.player1.score >= 7) || (my.sprite.player2.score >= 7)) {
                        this.scene.start('endScene', {p1Wins: my.sprite.player1.score >= 7});
                        return;
                    }
                    this.scene.launch('upgradeScene', {p1Wins: my.sprite.ball.x > game.config.width, upgrades: this.upgrade_data,
                        player1: my.sprite.player1, player2: my.sprite.player2
                    });
                    this.scene.pause();
                    my.sprite.ball.x = game.config.width / 2;
                    my.sprite.ball.y = my.sprite.player1.y = my.sprite.player2.y = game.config.height / 2;
                    this.altServe *= -1;
                    my.sprite.ball.velocityX = 5 * this.altServe;
                    my.sprite.ball.velocityY = 5;
                    my.sprite.ball.MAXSPEED = 10;
                });
            }
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
        b.velocityX = b.MAXSPEED*Math.cos(bounceAngle);
        b.velocityY = b.MAXSPEED*-Math.sin(bounceAngle);
        b.MAXSPEED *= 1.05;
    }

    updateScore(p1Win) {
        let my = this.my
        this.sound.play("score");
        if (p1Win) {
            my.sprite.player1.score += 1;
            my.text.p1Score.text = this.my.sprite.player1.score.toString();
            this.p2vfx.y = my.sprite.ball.y;
            this.p2vfx.explode(1000)
        } else {
            my.sprite.player2.score += 1;
            my.text.p2Score.text = this.my.sprite.player2.score.toString();
            this.p1vfx.y = my.sprite.ball.y;
            this.p1vfx.explode(1000);
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    createUpgrades() {
        this.plus_speed = ['Move +', 'Increase paddle\nmovement speed', 'speedFunction()'];
        this.plus_size = ['Size +', 'Increase size\n of paddle', 'sizeFunction()'];
        this.plus_score = ['Score +', 'Increase player\n score', 'scoreFunction()'];
        this.add_bumper = ['Bumper + ', 'Add a bumper \n onto the board', 'addBumper()'];

        this.upgrade_data = [this.plus_speed, this.plus_size, this.plus_score, this.add_bumper];
    }

    createBumper(minX, maxX) {
        let bump = new Player(this, randomInt(minX, maxX), randomInt(0, game.config.height), "character", null,
            this.p2Up, this.p2Down, 10);
        bump.displayHeight = 25;
        bump.displayWidth = 25;

        this.my.bumpers.push(bump);
        
    }
}