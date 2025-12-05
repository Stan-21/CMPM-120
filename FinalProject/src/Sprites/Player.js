class Player extends Phaser.GameObjects.Sprite {

    // x,y - starting sprite location
    // spriteKey - key for the sprite image asset
    // upKey - key for moving up
    // downKey - key for moving down
    constructor(scene, x, y, texture, frame, upKey, downKey, playerSpeed, maxWidth) {
        super(scene, x, y, texture, frame);

        this.up = upKey;
        this.down = downKey;
        this.playerSpeed = playerSpeed;
        this.score = 0;
        this.decay = false;
        this.MAXWIDTH = maxWidth;

        this.displayWidth = maxWidth;

        scene.add.existing(this);

        return this;
    }

    update() {
        // Moving up
        if (this.up.isDown) {
            // Check to make sure the sprite can actually move up
            if (this.y > 0) {
                this.y -= this.playerSpeed;
            }
        }

        // Moving down
        if (this.down.isDown) {
            // Check to make sure the sprite can actually move down
            if (this.y < (game.config.height)) {
                this.y += this.playerSpeed;
            }
        }

        if (this.scene.running) {
            if (this.decay) {
                if (this.displayWidth >= 50) {
                    this.displayWidth -= 0.05;
                }
            }
        }
    }

    speedFunction() {
        this.playerSpeed += 5;
    }

    sizeFunction() {
        this.MAXWIDTH += 30;
        this.displayWidth += 30;
    }

    scoreFunction() {
        this.scene.updateScore(this.x < game.config.width / 2);
    }

    addBumper() {
        if (this.x < game.config.width / 2) {
            this.scene.createBumper(game.config.width / 2, game.config.width/8*7 - 20);
        } else {
            this.scene.createBumper(game.config.width/8 + 20, game.config.width / 2);
        }
    }

    setDecay() {
        this.MAXWIDTH += 100;
        this.displayWidth = this.MAXWIDTH;
        this.decay = true;
    }

}