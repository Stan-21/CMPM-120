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
        this.CPU = true;
        this.altServe = 1;
    }

    init() {
        let my = this.my;

        // Create text for score
        my.text.p1Score = this.add.bitmapText(game.config.width/3, game.config.height/6, "rocketSquare", "0").setOrigin(0.5, 0.5).setScale(3);
        my.text.p2Score = this.add.bitmapText(game.config.width/3 * 2, game.config.height/6, "rocketSquare", "0").setOrigin(0.5, 0.5).setScale(3);

        // Create Player 1 and controls
        this.p1Up = this.input.keyboard.addKey("W");
        this.p1Down = this.input.keyboard.addKey("S");
        my.sprite.player1 = new Player(this, game.config.width/8, game.config.height/2, "character", null,
            this.p1Up, this.p1Down, 10, 100);
        my.sprite.player1.angle = 90;
        my.sprite.player1.setScale(2);
        
        // Create Player 2 and controls
        this.arrowKey = this.input.keyboard.createCursorKeys();
        this.p2Up = this.arrowKey.up;
        this.p2Down = this.arrowKey.down;
        my.sprite.player2 = new Player(this, game.config.width/8*7, game.config.height/2, "character", null,
            this.p2Up, this.p2Down, 10, 100);
        my.sprite.player2.angle = 90;
        my.sprite.player2.setScale(2);
        // Create center line
        var graphics = this.add.graphics();
        graphics.fillStyle(0xFFFFFF, 1);
        this.centerLine = new Phaser.Geom.Rectangle(game.config.width/2 - 2.5, 0, 5, game.config.height);
        graphics.fillRectShape(this.centerLine);

        my.sprite.ball = new Ball(this, game.config.width / 2, game.config.height / 2, "ball", null, 5); // Create ball
    }

    preload() {

    }

    create() {
        let my = this.my;   // create an alias to this.my for readability

        // Define key colors
        var WHITE = 0xFFFFFF;
        var GREY = 0xA9A9A9;
        var optionGraphics = this.add.graphics();
        optionGraphics.fillStyle(WHITE, 1);

        // Create optionGraphics
        var pvp = new Phaser.Geom.Rectangle(game.config.width/8 * 3 - 75, game.config.height / 2 - 100, 150, 175);
        var pvpText1 = this.add.text(pvp.x + 75, pvp.y, 'PVP', {fill: '#fff', fontSize: 30}).setOrigin(0.5, 0.0);
        var pvpText2 = this.add.text(pvp.x + 75, pvp.y + 40, 'Play against \n another player \n(arrow keys)', {fill: '#fff', fontSize: 16, align: 'center'}).setOrigin(0.5, 0.0);
        var playCPU = new Phaser.Geom.Rectangle(game.config.width/8 * 5 - 75, game.config.height / 2 - 100, 150, 175);
        var CPUText1 = this.add.text(playCPU.x + 75, playCPU.y, 'CPU', {fill: '#fff', fontSize: 30}).setOrigin(0.5, 0.0);
        var CPUText2 = this.add.text(playCPU.x + 75, playCPU.y + 40, 'Play against CPU', {fill: '#fff', fontSize: 16, align: 'center'}).setOrigin(0.5, 0.0);
        var slot1Zone = this.add.zone(pvp.x + 75, pvp.y + 87.5, 150, 175).setInteractive();
        var slot2Zone = this.add.zone(playCPU.x + 75, playCPU.y + 87.5, 150, 175).setInteractive();

        // Handle input handlers
        slot1Zone.on('pointerover', () => {
            optionGraphics.lineStyle(5, WHITE, 1);
            optionGraphics.strokeRectShape(pvp);
        });

        slot1Zone.on('pointerout', () => {
            optionGraphics.lineStyle(5, GREY, 1);
            optionGraphics.strokeRectShape(pvp);
        });

        slot1Zone.on('pointerdown', () => {
            this.CPU = false;
            optionGraphics.destroy();
            pvpText1.destroy();
            pvpText2.destroy();
            CPUText1.destroy();
            CPUText2.destroy();
            pvpText1 = null;

            if (!this.running) {
                sleep(2000).then(() => {
                    this.running = true;
                });
            }
        });

        slot2Zone.on('pointerover', () => {
            optionGraphics.lineStyle(5, WHITE, 1);
            optionGraphics.strokeRectShape(playCPU);
        });

        slot2Zone.on('pointerout', () => {
            optionGraphics.lineStyle(5, GREY, 1);
            optionGraphics.strokeRectShape(playCPU);
        });

        slot2Zone.on('pointerdown', () => {
            optionGraphics.destroy();
            pvpText1.destroy();
            pvpText2.destroy();
            CPUText1.destroy();
            CPUText2.destroy();
            pvpText1 = null;

            if (!this.running) {
                sleep(2000).then(() => {
                    this.running = true;
                });
            }
        });

        optionGraphics.fillStyle(WHITE, 1);
        optionGraphics.fillStyle(GREY, 1);
        optionGraphics.fillRectShape(pvp);
        optionGraphics.fillRectShape(playCPU);


        this.input.on('pointerdown', () => {
            if (pvpText1) {
                console.log("optionGraphics are still here");
                return;
            }
            if (!this.running) {
                console.log("waiting");
                sleep(2000).then(() => {
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

        // Create particles
        this.vfx = this.add.particles(0, 0, "ball", { // Ball trail
            alpha: 0.5,
            follow: my.sprite.ball,
            followOffset: {x: -1, y: -1},
            lifespan: 500,
            angle: { min: -80, max: -100 },
            scale: { start: 0.5, end: 0, ease: 'sine.in' },
            speed: { min: 250, max: 350 },
            advance: 2000
        });

        this.p1vfx = this.add.particles(0, 0, "ball", { // Plays when player 2 scores
            alpha: {start: 1, end: 0, ease: 'sine.in'},
            lifespan: 1000,
            y: {min: 0, max: 100},
            angle: { min: -90, max: 90 },
            scale: { start: 0.25 , end: 0, ease: 'sine.in' },
            speed: { min: 500, max: 1000 },
            stopAfter: 100,
            emitting: false
        });

        this.p2vfx = this.add.particles(game.config.width, 0, "ball", { // Players when player 1 scores
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
        // Update player and ball
        my.sprite.player1.update();
        my.sprite.player2.update();
        if (this.CPU) {
            if (Math.abs(my.sprite.player2.y - my.sprite.ball.y) > 40) {
                if (my.sprite.player2.y < my.sprite.ball.y) {
                    my.sprite.player2.down.isDown = true;
                    my.sprite.player2.up.isDown = false;
                } else if (my.sprite.player2.y > my.sprite.ball.y) {
                    my.sprite.player2.down.isDown = false;
                    my.sprite.player2.up.isDown = true;
                }
            }
        }

        if (this.running) {
            my.sprite.ball.update();
        }


        if (my.sprite.ball.velocityX < 0) { // Check collision of player 1, but only if moving left
            if (this.collides(my.sprite.player1, my.sprite.ball)) {
                this.calculateAngle(my.sprite.player1, my.sprite.ball);
                this.sound.play("hit");
                if (my.sprite.ball.velocityX < 0) {
                    my.sprite.ball.velocityX *= -1;
                }
            }
        }

        if (my.sprite.ball.velocityX > 0) { // Check collision of player 2, but only if moving right
            if (this.collides(my.sprite.player2, my.sprite.ball)) {
                this.calculateAngle(my.sprite.player2, my.sprite.ball);
                this.sound.play("hit");
                if (my.sprite.ball.velocityX > 0) {
                    my.sprite.ball.velocityX *= -1;
                }
            }
        }

        for (let bumper of this.my.bumpers) { // Check collision of bumpers if any
            if (this.collides(bumper, my.sprite.ball)) {
                this.calculateAngle(bumper, my.sprite.ball);
                this.sound.play("hit");
            }
        }

        if (this.running) { // Check if a player has scored
            if ((my.sprite.ball.x <= -10) || (my.sprite.ball.x > game.config.width + 10)) {
                this.updateScore(my.sprite.ball.x > game.config.width);
                this.running = false;
                sleep(1000).then(() => {
                    if ((my.sprite.player1.score >= 7) || (my.sprite.player2.score >= 7)) {
                        this.scene.start('endScene', {p1Wins: my.sprite.player1.score >= 7});
                        return;
                    }
                    this.scene.launch('upgradeScene', {p1Wins: my.sprite.ball.x > game.config.width, upgrades: this.upgrade_data,
                        player1: my.sprite.player1, player2: my.sprite.player2, cpuON: this.CPU
                    });
                    this.scene.pause();
                    my.sprite.ball.x = game.config.width / 2;
                    my.sprite.ball.y = my.sprite.player1.y = my.sprite.player2.y = game.config.height / 2;
                    this.altServe *= -1;
                    my.sprite.ball.velocityX = 5 * this.altServe;
                    my.sprite.ball.velocityY = 5;
                    my.sprite.ball.MAXSPEED = 10;
                    my.sprite.player1.displayWidth = my.sprite.player1.MAXWIDTH;
                    my.sprite.player2.displayWidth = my.sprite.player2.MAXWIDTH;
                });
            }
        }
    }

    collides(a, b) { // Check for collisions
        if (Math.abs(a.x - b.x) > (a.displayHeight/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayWidth/2 + b.displayHeight/2)) return false;
        return true;
    }

    calculateAngle(a, b) { // Calculate angle when ball collides with paddle
        var relativeIntersectY = a.y - b.y;
        var normalizedRelativeIntersectionY = (relativeIntersectY/(a.displayWidth/2));
        var bounceAngle = normalizedRelativeIntersectionY * (Math.PI/3);
        b.velocityX = b.MAXSPEED*Math.cos(bounceAngle);
        b.velocityY = b.MAXSPEED*-Math.sin(bounceAngle);
        b.MAXSPEED *= 1.02;
    }

    updateScore(p1Win) { // Update score depending on who scored
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

    createUpgrades() { // Creates upgrades which would be sent to the upgrade scene
        // Upgrade name, description, function call, whether it's one time
        this.plus_speed = ['Move +', 'Increase paddle\nmovement speed', 'this.buffTarget.speedFunction()', false];
        this.plus_size = ['Size +', 'Increase size\n of paddle', 'this.buffTarget.sizeFunction()', false];
        this.plus_score = ['Score +', 'Increase player\n score', 'this.buffTarget.scoreFunction()', false];
        this.add_bumper = ['Bumper + ', 'Add a bumper \n onto the board', 'this.buffTarget.addBumper()', false];
        this.add_decay = ['Decay -', 'Gives decay to \nthe opponent.  \nPaddle size is \nincreased, but \nslowly shrinks \nover time', 'this.debuffTarget.setDecay()', true]

        this.upgrade_data = [this.plus_speed, this.plus_size, this.plus_score, this.add_bumper, this.add_decay];
    }

    createBumper(minX, maxX) { // Creates a bumper at a certain x range
        let bump = new Player(this, randomInt(minX, maxX), randomInt(20, game.config.height - 20), "bumper", null,
            this.p2Up, this.p2Down, 10);
        bump.displayHeight = 25;
        bump.displayWidth = 25;

        this.my.bumpers.push(bump);
        
    }
}