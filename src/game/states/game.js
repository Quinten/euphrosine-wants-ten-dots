var gameState = {

    // parameters
    tilemapName: 'level',
    tilesetImageName: 'tiles',
    startPoint: {x: 880, y: 1920},

    // objects
    map: undefined,
    layer: undefined,
    climbLayer: undefined,
    player: undefined,
    cursors: undefined,
    jumpButton: undefined,
    enemy: undefined,

    // not parameters
    facing: 'left',
    jumpTimer: 0,
    canClimb: false,
    isClimbing: false,
    justClimbed: false,
    climbTimer: 0,
    resizeTO: 0,

    create: function () {

        game.time.advancedTiming = true; // for debuging the fps

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = 800;

        this.map = game.add.tilemap('level');
        this.map.addTilesetImage('tiles');

        this.map.setCollisionByExclusion([]);

        this.map.forEach(this.setCollisionDirectionOf, this, 0, 0, 128, 128);

        this.layer = this.map.createLayer('platformlayer');
        //this.layer.debug = true;
        this.layer.resizeWorld();

        this.climbLayer = this.map.createLayer('climblayer');
        //this.climbLayer.debug = true;
        //this.climbLayer.resizeWorld();

        this.player = game.add.sprite(this.startPoint.x, this.startPoint.y, 'player');

        game.physics.enable(this.player, Phaser.Physics.ARCADE);
        //this.player.body.bounce.y = 0.2;
        //this.player.body.collideWorldBounds = true;
        this.player.body.setSize(16, 20, 8, 12); // will need tweaking when we have a graphic

        this.player.animations.add('idle-left', [0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1], 8, true);
        this.player.animations.add('idle-right', [2,2,2,2,2,2,2,2,3,2,2,2,3,2,3,2,2,2,2,2,2,2,2,2,2,2,2,3], 8, true);
        this.player.animations.add('run-left', [4,5,6,7], 12, true);
        this.player.animations.add('run-right', [8,9,10,11], 12, true);
        this.player.animations.add('jump-left', [12], 12, true);
        this.player.animations.add('jump-right', [13], 12, true);
        this.player.animations.add('float', [18,19,20,21], 12, true);
        this.player.animations.add('climb', [14,15,16,17], 12, true);

        game.camera.follow(this.player);

        this.cursors = game.input.keyboard.createCursorKeys();
        this.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.enemy = game.add.sprite(960, 96, 'enemy');
        game.physics.enable(this.enemy, Phaser.Physics.ARCADE);
        this.enemy.body.setSize(20, 20, 6, 12);

        this.enemy.animations.add('idle', [0], 8, true);
        this.enemy.animations.add('roll-left', [0,2,1], 12, true);
        this.enemy.animations.add('roll-right', [0,1,2], 12, true);

    },

    setCollisionDirectionOf: function (tile) {
        tile.collideDown = false;
        tile.collideLeft = false;
        tile.collideRight = false;
        //tile.collideUp = false;
    },

    update: function () {

        this.canClimb = false;
        var climbTiles = this.climbLayer.getTiles(this.player.body.x, this.player.body.y, this.player.body.width, this.player.body.height, false, false);
        //climbTiles = []; // tmp disable climbing
        for (var c = 0; c < climbTiles.length; c++) {
            if (climbTiles[c].index > 143) {
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

        if (this.player.body.x > 2040) {
            this.player.body.x -= 2040;
        } else if (this.player.body.x < -0) {
            this.player.body.x += 2040;
        }

        if (this.player.body.y > 2048) {
            this.player.body.y -= 2048;
        } else if (this.player.body.y < 0) {
            this.player.body.y += 2044;
        }

        game.physics.arcade.collide(this.player, this.layer);

        if (this.jumpButton.isDown && (this.player.body.onFloor() || this.isClimbing) && game.time.now > this.jumpTimer) {
            this.player.body.velocity.y = -384;
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
                this.player.body.velocity.x = -200;

                this.facing = 'left';
                if (this.player.body.onFloor()) {
                    this.player.animations.play('run-left');
                } else {
                    if (this.cursors.up.isDown) {
                        // float
                        this.player.body.velocity.y = Math.min(40, this.player.body.velocity.y);
                        this.player.animations.play('float');
                    } else {
                        this.player.animations.play('jump-left');
                    }
                }

            } else if (this.cursors.right.isDown) {
                this.player.body.velocity.x = 200;

                this.facing = 'right';
                if (this.player.body.onFloor()) {
                    this.player.animations.play('run-right');
                } else {
                    if (this.cursors.up.isDown) {
                        // float
                        this.player.body.velocity.y = Math.min(40, this.player.body.velocity.y);
                        this.player.animations.play('float');
                    } else {
                        this.player.animations.play('jump-right');
                    }
                }

            } else {

                if (this.player.body.onFloor()) {
                    // idle
                    if (this.facing == 'left') {
                        this.player.animations.play('idle-left');
                    } else {
                        this.player.animations.play('idle-right');
                    }
                } else {
                    if (this.cursors.up.isDown) {
                        // float
                        this.player.body.velocity.y = Math.min(40, this.player.body.velocity.y);
                        this.player.animations.play('float');
                    } else {
                        // flail
                        if (this.facing == 'left') {
                            this.player.animations.play('jump-left');
                        } else {
                            this.player.animations.play('jump-right');
                        }
                    }
                }
            }
        }

        // enemy movment
        game.physics.arcade.collide(this.enemy, this.layer);

        this.enemy.body.velocity.x = 0;

        if (this.enemy.body.onFloor()) {
            if (this.enemy.body.x < 1024) {
                if (this.enemy.body.x > this.player.body.x) {
                    this.enemy.body.velocity.x = 180;
                    this.enemy.animations.play('roll-right');
                } else if (this.player.body.x >= 1536) {
                    this.enemy.body.velocity.x = 180;
                    this.enemy.animations.play('roll-right');
                } else {
                    this.enemy.body.velocity.x = -180;
                    this.enemy.animations.play('roll-left');
                }
            } else if (this.enemy.body.x >= 1024) {
                if (this.enemy.body.x < this.player.body.x) {
                    this.enemy.body.velocity.x = -180;
                    this.enemy.animations.play('roll-left');
                } else if (this.player.body.x <= 512) {
                    this.enemy.body.velocity.x = -180;
                    this.enemy.animations.play('roll-left');
                } else {
                    this.enemy.body.velocity.x = 180;
                    this.enemy.animations.play('roll-right');
                }
            }
        } else {
            this.enemy.animations.play('idle');
        }

        if (this.enemy.body.x > 2040) {
            this.enemy.body.x -= 2040;
        } else if (this.enemy.body.x < -0) {
            this.enemy.body.x += 2040;
        }

        if (this.enemy.body.y > 2048) {
            this.enemy.body.y -= 2048;
        }//else if (this.enemy.body.y < 0) {
            //this.enemy.body.y += 2044;
        //}

    },

    resize: function () {

        var that = this;
        clearTimeout(this.resizeTO);
        this.resizeTO = setTimeout(function () {
            that.layer.resize(game.camera.width, game.camera.height);
            that.climbLayer.resize(game.camera.width, game.camera.height);
        }, 1000);

    },

    shutdown: function () {

        this.map = undefined;
        this.layer = undefined;
        this.climbLayer = undefined;
        this.player = undefined;
        this.cursors = undefined;
        this.jumpButton = undefined;

    },

    render: function () {

        game.debug.text('FPS: ' + game.time.fps, 32, 32, "#ffffff");
        game.debug.spriteInfo(this.player, 32, 64);
        game.debug.spriteInfo(this.enemy, 496, 64);

    }

};
