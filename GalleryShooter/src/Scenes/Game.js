class Game extends Phaser.Scene {
    constructor() {
        super("gameScene");
        this.my = {sprite: {}, text: {}};

        this.my.sprite.bullet = [];
        this.my.sprite.enemy = [];
        this.my.sprite.enemyBullet = [];
        this.maxBullets = 10;

        // Keeping spawn locations as a class variable
        this.spawnY = 80;
        this.spawnX = game.config.width/4;

        this.myScore = 0;
        this.myLives = 3;

        this.deck = ["H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8", "H9", "H10", "H11", "H12", "H13",
            "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D12", "D13",
            "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10", "C11", "C12", "C13",
            "S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10", "S11", "S12", "S13",
            "rJ", "bJ"
        ];
        /*"H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8", "H9", "H10", "H11", "H12", "H13",
            "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D12", "D13",
            "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10", "C11", "C12", "C13",
            "S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10", "S11", "S12", "S13",*/
    }

    init() {
        this.deck = ["H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8", "H9", "H10", "H11", "H12", "H13",
            "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D12", "D13",
            "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10", "C11", "C12", "C13",
            "S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10", "S11", "S12", "S13",
            "rJ", "bJ"
        ];
        this.myScore = 0;
        this.myLives = 3;
    }

    preload() {
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
        this.add.rectangle(game.config.width/2, game.config.height, game.config.width, game.config.height/5 * 2, 0xff0000);
        this.add.rectangle(game.config.width/2, 0, game.config.width, game.config.height/8, 0xff0000);

        let my = this.my;   // create an alias to this.my for readability

        // Inputs to send to player
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // Shoot

        // Create the main body sprite
        my.sprite.player = new Player(this, game.config.width/2, game.config.height - 40, "character", null,
            this.left, this.right, 10);
        my.sprite.spawn1 = this.add.sprite(this.spawnX, this.spawnY, "cards", "blankFront.png");
        my.sprite.spawn1.setScale(1.25, 1.25);
        my.sprite.spawn2 = this.add.sprite(this.spawnX * 2, this.spawnY, "cards", "blankFront.png");
        my.sprite.spawn2.setScale(1.25, 1.25);
        my.sprite.spawn3 = this.add.sprite(this.spawnX * 3, this.spawnY, "cards", "blankFront.png");
        my.sprite.spawn3.setScale(1.25, 1.25);

        my.text.lives = this.add.bitmapText(20, 0, "rocketSquare", "Lives: " + this.myLives);
        my.text.score = this.add.bitmapText(580, 0, "rocketSquare", "Score: " + this.myScore);
        my.text.deck = this.add.bitmapText(game.config.width/2, 0, "rocketSquare", "Cards left: " + this.deck.length + " /54").setOrigin(0.5, 0);
        my.text.deck.setScale(0.75, 1.0);

        my.timedEvent = this.time.addEvent({ delay: 1500, callback: this.onEvent, callbackScope: this, loop: true });
        this.shuffle(this.deck);

        // Basic shapes
    }

    update() {
        let my = this.my;    // create an alias to this.my for readability

        if (Phaser.Input.Keyboard.JustDown(this.space)) { // Shooting
            let num = Math.floor(Math.random() * (6 - 1 + 1) + 1);
            let bullet = new Bullet(this, my.sprite.player.x, my.sprite.player.y, "diceNum", "dieWhite_border" + num + ".png", num);
            bullet.setScale(0.50);
            my.sprite.bullet.push(bullet);
            this.sound.play("shoot", {volume: 1});
        }

        // Collisions
        for (let bullet of my.sprite.bullet) {
            for (let enemy of my.sprite.enemy) {
                if (this.collides(bullet, enemy)) {
                    enemy.takeDamage(bullet.dmg);
                    //console.log("hit");
                    bullet.active = false;
                    bullet.destroy();
                }
            }
        }

        for (let bullet of my.sprite.enemyBullet) {
            if (bullet.path.points[1].y == bullet.y) {
                bullet.active = false;
                bullet.destroy();
            } else if (this.collides(bullet, my.sprite.player)) {
                //console.log(bullet.path.points[1]);
                bullet.active = false;
                bullet.destroy();
                this.updateLives(-1);
            }
        }
        // Update sprites
        my.sprite.player.update();
        for (let bullet of my.sprite.bullet) {
            bullet.update();
        }
        for (let enemy of my.sprite.enemy) {
            enemy.update();
        }
        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.active);
        my.sprite.enemy = my.sprite.enemy.filter((enemy) => enemy.active);
        my.sprite.enemyBullet = my.sprite.enemyBullet.filter((bullet) => bullet.active);
        //console.log(my.sprite.enemyBullet);

        // Check win
        if ((this.deck.length <= 0) && (my.sprite.enemy.length <= 0)) {
        }
    }

    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    updateLives(dmg) {
        let my = this.my;
        this.myLives += dmg;
        my.text.lives.setText("Lives: " + this.myLives);
        if (this.myLives <= 0) {
            this.scene.start("endScene", {score: this.myScore});
        }
    }

    updateScore(points) {
        let my = this.my;
        this.myScore += points;
        my.text.score.setText("Score: " + this.myScore);
    }

    onEvent() {
        let my = this.my;
        let spawn = Math.floor(Math.random() * (3 - 1 + 1) + 1);
        for (let i = 1; i <= spawn; i++) {
            if (this.deck.length > 0) {
                let card = this.deck.shift();
                if (card == "rJ" || card == "bJ") {
                    var enemy = new Joker(this, this.spawnX * i, 80, "cards", card + ".png", 1, 5);
                } else {
                    var enemy = new Enemy(this, this.spawnX * i, 80, "cards", card + ".png", 1, 5);
                }
                enemy.setScale(1);
                my.text.deck.setText("Cards left: " + this.deck.length + " /54");
                my.sprite.enemy.push(enemy);
            }
        }
    }
    shuffle(array) {
        let currentIndex = array.length;
      
        // While there remain elements to shuffle...
        while (currentIndex != 0) {
      
          // Pick a remaining element...
          let randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
    }

    jokerProjectile(x, y) {
        let my = this.my;
        this.points = [
            x, y,
            my.sprite.player.x, my.sprite.player.y
        ];
        this.curve = new Phaser.Curves.Spline(this.points);
        my.sprite.enemyShip = this.add.follower(this.curve, x, y, "cards", "blankBack.png");
        my.sprite.enemyShip.startFollow({
            from: 0,
            to: 1,
            delay: 0,
            duration: 2000,
            ease: 'Sine.easeInOut',
            repeat: 0,
            yoyo: false,
            rotateToPath: true,
            rotationOffset: -90,
        });
        my.sprite.enemyBullet.push(my.sprite.enemyShip);
    }
}