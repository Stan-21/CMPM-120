class Bullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, dmg) {        
        super(scene, x, y, texture, frame);
        this.dmg = dmg;
        scene.add.existing(this);
        return this;
    }

    update() {
        if (this.active) {
            this.y -= 10;
            if (this.y < -this.displayHeight/2) { // (-this.displayHeight/2)
                this.active = false;
                this.destroy();
            }
        }
    }

}