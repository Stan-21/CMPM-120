class Player extends Phaser.GameObjects.Sprite {

    // x,y - starting sprite location
    // spriteKey - key for the sprite image asset
    // upKey - key for moving up
    // downKey - key for moving down
    constructor(scene, x, y, texture, frame, upKey, downKey, playerSpeed) {
        super(scene, x, y, texture, frame);

        this.up = upKey;
        this.down = downKey;
        this.playerSpeed = playerSpeed;
        this.score = 0;

        scene.add.existing(this);

        return this;
    }

    update() {
        // Moving left
        if (this.up.isDown) {
            // Check to make sure the sprite can actually move up
            if (this.y > 0) {
                this.y -= this.playerSpeed;
            }
        }

        // Moving right
        if (this.down.isDown) {
            // Check to make sure the sprite can actually move right
            if (this.y < (game.config.height)) {
                this.y += this.playerSpeed;
            }
        }
    }

    speedFunction() {
        this.playerSpeed += 5;
        console.log("+speed");
    }

    sizeFunction() {
        this.displayWidth += 50;
        console.log("+size");
    }

    scoreFunction() {
        this.scene.updateScore(this.x < game.config.width / 2);
        console.log("+score");
    }

}