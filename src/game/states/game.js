var gameState = {

    // parameters
    tilemapName: 'level',
    tilesetImageName: 'tiles',
    startPoint: {x: 32, y: 32},

    // objects
    map: undefined,
    layer: undefined,
    climbLayer: undefined,
    player: undefined,
    cursors: undefined,
    jumpButton: undefined,

    // not parameters
    facing: 'left',
    jumpTimer: 0,
    canClimb: false,
    isClimbing: false,
    justClimbed: false,
    climbTimer: 0,
    resizeTO: 0,

    create: function () {

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = 500;

        this.map = game.add.tilemap('level');
        this.map.addTilesetImage('tiles');

        this.map.setCollisionByExclusion([]);

        this.layer = this.map.createLayer('platformlayer');
        //this.layer.debug = true;
        this.layer.resizeWorld();

        //this.climbLayer = this.map.createLayer('climblayer');
        //this.climbLayer.debug = true;
        //this.climbLayer.resizeWorld();

        this.player = game.add.sprite(this.startPoint.x, this.startPoint.y, 'player');

        game.physics.enable(this.player, Phaser.Physics.ARCADE);
        //this.player.body.bounce.y = 0.2;
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(48, 48, 0, 0); // will need tweaking when we have a graphic

        this.player.animations.add('idle-left', [0], 12, true);
        this.player.animations.add('idle-right', [0], 12, true);
        this.player.animations.add('run-left', [0], 12, true);
        this.player.animations.add('run-right', [0], 12, true);
        this.player.animations.add('jump-left', [0], 12, true);
        this.player.animations.add('jump-right', [0], 12, true);
        this.player.animations.add('float-left', [0], 12, true);
        this.player.animations.add('float-right', [0], 12, true);
        this.player.animations.add('climb', [0], 12, true);

        game.camera.follow(this.player);

        this.cursors = game.input.keyboard.createCursorKeys();
        this.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    },

    update: function () {

        this.canClimb = false;
        //var climbTiles = this.climbLayer.getTiles(this.player.body.x, this.player.body.y, this.player.body.width, this.player.body.height, false, false);
        climbTiles = []; // tmp disable climbing
        for (var c = 0; c < climbTiles.length; c++) {
            if (climbTiles[c].index > -1) {
                this.canClimb = true;
            }
        }

        if (this.isClimbing && !this.canClimb) {
            this.isClimbing = false;
            this.player.body.allowGravity = true;
        }

        if (this.cursors.up.isDown && game.time.now > this.climbTimer) {
            if (this.canClimb && !this.isClimbing) {
                this.isClimbing = true;
                this.justClimbed = true;
                this.player.body.allowGravity = false;
                this.player.body.checkCollision.left = false;
                this.player.body.checkCollision.right = false;
                this.player.body.checkCollision.up = false;
                this.climbTimer = game.time.now + 750;
            }
        }

        if (!this.isClimbing && this.justClimbed && this.player.body.velocity.y > 0) {
            this.justClimbed = false;
            this.player.body.checkCollision.left = true;
            this.player.body.checkCollision.right = true;
            this.player.body.checkCollision.up = true;
        }

        game.physics.arcade.collide(this.player, this.layer);

        if (this.jumpButton.isDown && (this.player.body.onFloor() || this.isClimbing) && game.time.now > this.jumpTimer) {
            this.player.body.velocity.y = -300;
            this.jumpTimer = game.time.now + 750;
            if (this.isClimbing) {
                this.climbTimer = game.time.now + 750;
                this.isClimbing = false;
                this.player.body.allowGravity = true;
            }
        }


        if (this.isClimbing) {

            this.player.animations.play('climb');

            if (this.cursors.up.isDown) {
                this.player.body.velocity.x = 0;
                this.player.body.velocity.y = -50;
            } else if (this.cursors.down.isDown) {
                this.player.body.velocity.x = 0;
                this.player.body.velocity.y = 50;
            } else if (this.cursors.left.isDown) {
                this.player.body.velocity.x = -50;
                this.player.body.velocity.y = 0;
            } else if (this.cursors.right.isDown) {
                this.player.body.velocity.x = 50;
                this.player.body.velocity.y = 0;
            } else {
                this.player.animations.stop();
                this.player.body.velocity.x = 0;
                this.player.body.velocity.y = 0;
            }

        } else {
            // not climbing
            this.player.body.velocity.x = 0;

            if (this.cursors.left.isDown) {
                this.player.body.velocity.x = -125;

                this.facing = 'left';
                if (this.player.body.onFloor()) {
                    this.player.animations.play('run-left');
                } else {
                    this.player.animations.play('jump-left');
                }

            } else if (this.cursors.right.isDown) {
                this.player.body.velocity.x = 125;

                this.facing = 'right';
                if (this.player.body.onFloor()) {
                    this.player.animations.play('run-right');
                } else {
                    this.player.animations.play('jump-right');
                }

            } else {

                if (this.player.body.onFloor()) {
                    if (this.facing == 'left') {
                        this.player.animations.play('idle-left');
                    } else {
                        this.player.animations.play('idle-right');
                    }
                } else {
                    if (this.facing == 'left') {
                        this.player.animations.play('jump-left');
                    } else {
                        this.player.animations.play('jump-right');
                    }
                }
            }
        }
    },

    resize: function () {

        var that = this;
        clearTimeout(this.resizeTO);
        this.resizeTO = setTimeout(function () {
            that.layer.resize(game.camera.width, game.camera.height);
            //that.climbLayer.resize(game.camera.width, game.camera.height);
        }, 1000);

    },

    shutdown: function () {

        this.map = undefined;
        this.layer = undefined;
        this.climbLayer = undefined;
        this.player = undefined;
        this.cursors = undefined;
        this.jumpButton = undefined;

    }

};
