class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        // Load required assets
        this.load.setPath("./assets/");
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");

        this.load.setPath("./assets/");
        // body
        this.load.image("character", "paddle.png");

        this.load.image("ball", "ball.png");

        this.load.image("bumper", "bumper.png");

        this.load.audio("hit", "/audio/hit.ogg");
        this.load.audio("score", "/audio/score.ogg");

        this.load.audio("music", "/audio/bgMusic.mp3");
    }

    create() {

        // I did make background music, but didn't really feel like it fit that well which is why this is commented out
        /*let bg = this.sound.add("music");
        bg.loop = true;
        bg.play();*/
        this.scene.start("startScene"); 
    }
}