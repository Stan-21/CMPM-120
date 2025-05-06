class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, hp, points) {        
        super(scene, x, y, texture, frame);
        this.hp = hp;
        this.points = points;
        scene.add.existing(this);
        return this;
    }

    update() {
        if (this.active) {
            this.y += 2;
            if (this.y > game.config.height/5 * 4) { // (-this.displayHeight/2)
                this.scene.updateLives(-1);
                this.active = false;
                this.destroy();
            }
        }
    }

    takeDamage(dmg) {
        this.hp -= dmg;
        if (this.hp <= 0) {
            this.scene.updateScore(this.points);
            this.active = false;
            this.destroy();
        }
    }

}