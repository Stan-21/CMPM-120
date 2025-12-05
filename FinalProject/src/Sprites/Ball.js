class Ball extends Phaser.GameObjects.Sprite {

    // x,y - starting sprite location
    // spriteKey - key for the sprite image asset
    // upKey - key for moving up
    // downKey - key for moving down
    constructor(scene, x, y, texture, frame, ballSpeed) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);

        this.velocityX = ballSpeed;
        this.velocityY = ballSpeed;

        this.ballSpeed = ballSpeed;

        this.MAXSPEED = 10;

        return this;
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;

        if (this.y <= 0) {
            this.velocityY = Math.abs(this.velocityY);
        }
        if (this.y >= game.config.height) {
            this.velocityY = -this.velocityY;
        }
    }

}