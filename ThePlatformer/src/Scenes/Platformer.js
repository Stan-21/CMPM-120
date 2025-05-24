class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 4000;
        this.DRAG = 1200;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -400;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;
    }

    create() {
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("platformer-level-1", 16, 16, 80, 20);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("monochrome_tilemap_packed", "tilemap_tiles");

        // Create a layer
        this.groundLayer = this.map.createLayer("Floors-N-Platforms", this.tileset, 0, 0);
        this.lConveyorLayer = this.map.createLayer("Left Belt", this.tileset, 0, 0);
        this.rConveyorLayer = this.map.createLayer("Right Belt", this.tileset, 0, 0);
        this.signLayer = this.map.createLayer("Signs and Extras", this.tileset, 0, 0);
        this.spikeLayer = this.map.createLayer("Spikes", this.tileset, 0, 0);

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true,
        });

        this.spikeLayer.setCollisionByProperty({
            collides: true,
            overlapOnly: true,
        });
        this.lConveyorLayer.setCollisionByProperty({
            collides: true
        });
        this.rConveyorLayer.setCollisionByProperty({
            collides: true
        });

        this.gems = this.map.createFromObjects("Gems", {
            name: "gem",
            key: "tilemap_sheet",
            frame: 62
        });

        this.physics.world.enable(this.gems, Phaser.Physics.Arcade.STATIC_BODY);
        this.gemGroup = this.add.group(this.gems);



        // set up player avatar
        my.sprite.player = this.physics.add.sprite(30, 300, "platformer_characters", "idle1.png");
        my.sprite.player.setScale(1.5);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        this.physics.add.collider(my.sprite.player, this.spikeLayer, (obj1, obj2) => {
            this.scene.restart();
        });
        this.physics.add.collider(my.sprite.player, this.lConveyorLayer, (obj1, obj2) => {
            my.sprite.player.body.setVelocityX(-50);
        });
        this.physics.add.collider(my.sprite.player, this.rConveyorLayer, (obj1, obj2) => {
            my.sprite.player.body.setVelocityX(50);
        });

        // Coin collision handler
        this.physics.add.overlap(my.sprite.player, this.gemGroup, (obj1, obj2) => {
            this.sound.play("gemSound");
            obj2.destroy(); // remove coin on overlap
        });

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        // TODO: Add movement vfx here

        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_03.png', 'smoke_09.png'],
            // TODO: Try: add random: true
            random: true,
            scale: {start: 0.03, end: 0.1},
            // TODO: Try: maxAliveParticles: 8,
            maxAliveParticles: 8,
            lifespan: 350,
            // TODO: Try: gravityY: -400,
            gravityY: -400,
            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.jumping = this.add.particles(0, 0, "kenny-particles",
            {
            frame: ['smoke_03.png', 'smoke_09.png'],
            scale: { start: 0.1, end: 0 },
            x: { min: 0, max: 0 },
            y: { start: 0, end: 0, ease: 'bounce.out' },
            lifespan: 350,
            emitting: false,
            alpha: {start: 1, end: 0.1}, 
        });
        

        // Simple camera to follow player
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);

        my.sprite.player.setMaxVelocity(250,1300);
    }

    update() {
        
        if(cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            // TODO: add particle following code here
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            my.vfx.walking.start();
        } else if(cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(false, false);
            my.sprite.player.anims.play('walk', true);
            // TODO: add particle following code here
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            my.vfx.walking.start();

        } else {
            // Set acceleration to 0 and have DRAG take over
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle', true);
            // TODO: have the vfx stop playing
            my.vfx.walking.stop();
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            //my.sprite.player.anims.play('jump');
            my.vfx.walking.stop();
        }

        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            this.sound.play("jumpSound");
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            my.vfx.jumping.setPosition(my.sprite.player.x, my.sprite.player.y + 15);
            my.vfx.jumping.explode(16);
        }

        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }
        if (my.sprite.player.x <= 0) {
            my.sprite.player.x = 0;
        }

        if (my.sprite.player.x >= this.map.widthInPixels) {
            this.sound.play("finishSound");
            this.scene.start("endScene");
        }

        if (my.sprite.player.y >= this.map.heightInPixels) {
            this.scene.restart();
        }
    }
}