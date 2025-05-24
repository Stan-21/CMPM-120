class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load characters spritesheet
        this.load.atlas("platformer_characters", "monochrome_tilemap_packed.png", "monochrome_tilemap_packed.json");
        //this.load.image("player", "pieceBlue_single00.png");

        // Load tilemap information
        this.load.image("tilemap_tiles", "monochrome_tilemap_packed.png");                         // Packed tilemap
        this.load.tilemapTiledJSON("platformer-level-1", "platformer-level-1.json");   // Tilemap in JSON

        // Load the tilemap as a spritesheet
        this.load.spritesheet("tilemap_sheet", "monochrome_tilemap_packed.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        // Load in audio
        this.load.audio("gemSound", "tone1.ogg");
        this.load.audio("jumpSound", "phaseJump5.ogg");
        this.load.audio("finishSound", "threeTone2.ogg");

        // Oooh, fancy. A multi atlas is a texture atlas which has the textures spread
        // across multiple png files, so as to keep their size small for use with
        // lower resource devices (like mobile phones).
        // kenny-particles.json internally has a list of the png files
        // The multiatlas was created using TexturePacker and the Kenny
        // Particle Pack asset pack.
        this.load.multiatlas("kenny-particles", "kenny-particles.json");
    }

    create() {
        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "idle",
                start: 0,
                end: 1,
                suffix: ".png",
                zeroPad: 1
            }),
            frameRate: 2,
            repeat: -1
        });

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "walk",
                start: 0,
                end: 3,
                suffix: ".png",
                zeroPad: 1
            }),
            frameRate: 15,
            repeat: -1
        });
         // ...and pass to the next Scene
         this.scene.start("startScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}