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
    emitter: undefined,
    gameCompleteText: undefined,
    playAgainText: undefined,

    // not parameters
    facing: 'left',
    jumpTimer: 0,
    canClimb: false,
    isClimbing: false,
    justClimbed: false,
    climbTimer: 0,
    enemyDirection: 'left',
    enemyTurnTimer: 0,
    score: 0,
    gameComplete: false,
    canPlayAgain: false,
    blinkCount: 0,
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

        this.emitter = game.add.emitter(this.player.position.x, this.player.position.y, 200);
        this.emitter.makeParticles('particles', [0,1,2], 200, true, false);
        this.emitter.minParticleSpeed.setTo(-200, -300);
        this.emitter.maxParticleSpeed.setTo(200, -400);
        this.emitter.gravity = 150;
        this.emitter.bounce.setTo(0.5, 0.5);
        this.emitter.minRotation = 0;
        this.emitter.maxRotation = 0;

        this.gameCompleteText = this.createText(game.camera.width / 2, game.camera.height / 2 - 100, 'Euphrosine has ten dots', colors.normalStroke, 69);
        this.gameCompleteText.visible = false;
        this.playAgainText = this.createText(game.camera.width / 2, game.camera.height / 2 + 100, 'Hit spacebar to play again', colors.normalStroke, 42);
        this.playAgainText.visible = false;

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

        if (!this.gameComplete && this.jumpButton.isDown && (this.player.body.onFloor() || this.isClimbing) && game.time.now > this.jumpTimer) {
            this.player.body.velocity.y = -384;
            this.jumpTimer = game.time.now + 750;
            if (this.isClimbing) {
                this.climbTimer = game.time.now + 750;
                this.isClimbing = false;
                this.player.body.allowGravity = true;
            }
        }

        if (!this.gameComplete && this.isClimbing) {

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

            if (!this.gameComplete && this.cursors.left.isDown) {
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

            } else if (!this.gameComplete && this.cursors.right.isDown) {
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
                    if (!this.gameComplete && this.cursors.up.isDown) {
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

        // enemy movement
        game.physics.arcade.collide(this.enemy, this.layer);

        this.enemy.body.velocity.x = 0;

        if (this.enemy.body.onFloor()) {

            if (game.time.now > this.enemyTurnTimer) {

                this.enemyTurnTimer = game.time.now + 1500;

                if (this.enemy.body.x < 1024) {
                    if (this.enemy.body.x > this.player.body.x) {
                        this.enemyDirection = 'right';
                    } else if (this.player.body.x >= 1536) {
                        this.enemyDirection = 'right';
                    } else {
                        this.enemyDirection = 'left';
                    }
                } else {
                    if (this.enemy.body.x < this.player.body.x) {
                        this.enemyDirection = 'left';
                    } else if (this.player.body.x <= 512) {
                        this.enemyDirection = 'left';
                    } else {
                        this.enemyDirection = 'right';
                    }
                }
            }

            if (this.enemyDirection === 'left') {
                this.enemy.body.velocity.x = -180;
                this.enemy.animations.play('roll-left');
            } else {
                this.enemy.body.velocity.x = 180;
                this.enemy.animations.play('roll-right');
            }

        } else {
            this.enemy.animations.play('idle');
            this.enemyTurnTimer = game.time.now;
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

        game.physics.arcade.overlap(this.player, this.enemy, this.playerEnemyOverlapped, null, this);

        game.physics.arcade.collide(this.emitter, this.layer);
        this.emitter.forEachExists(game.world.wrap, game.world);

        clouds.tilePosition.x -= 1;

        if (this.gameComplete && this.canPlayAgain) {

            this.blinkCount++;
            if (this.blinkCount > 15) {
                this.blinkCount = 0;
                this.playAgainText.visible = !this.playAgainText.visible;
            }

            if (this.jumpButton.isDown) {
                this.restartGame();
            }
        }

    },

    playerEnemyOverlapped: function (player, enemy) {

        // fx
        game.camera.shake(0.05, 500);
        this.emitter.x = this.player.x;
        this.emitter.y = this.player.y;
        this.emitter.start(true, 8000, null, 40);

        // move enemy
        this.enemy.body.x += 1024;
        if (this.enemy.body.x > 2048) {
            this.enemy.body.x -= 2048;
        }
        this.enemy.body.y = -32;
        this.enemy.body.velocity.x = 0;
        this.enemy.body.velocity.y = 0;

        // update score
        this.score++;
        if (this.score >= 10) {
            //console.log('You won!');
            this.score = 10;
            this.gameComplete = true;
            this.gameCompleteText.visible = true;
            game.time.events.add(Phaser.Timer.SECOND * 3, function () {
                this.canPlayAgain = true;
                this.playAgainText.visible = true;
            }, this);
            fx.play('reward');
        } else {
            fx.play('powerup');
        }
        this.player.loadTexture('player-' + this.score);

    },

    restartGame: function () {

        this.player.loadTexture('player');
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        this.player.body.x = this.startPoint.x;
        this.player.body.y = this.startPoint.y;
        this.gameComplete = false;
        this.gameCompleteText.visible = false;
        this.canPlayAgain = false;
        this.playAgainText.visible = false;
        this.score = 0;
        fx.play('coin');

    },

    createText: function (x, y, text, color, size) {

        var textSprite = game.add.text(x, y, text);
        textSprite.fixedToCamera = true;
        textSprite.cameraOffset.x = x;
        textSprite.cameraOffset.y = y;
        textSprite.anchor.setTo(0.5);
        textSprite.font = fontName;
        textSprite.fontSize = size;
        textSprite.fill = color;
        textSprite.align = 'center';

        return textSprite;

    },

    resize: function () {

        var that = this;
        clearTimeout(this.resizeTO);
        this.resizeTO = setTimeout(function () {
            that.layer.resize(game.camera.width, game.camera.height);
            that.climbLayer.resize(game.camera.width, game.camera.height);
        }, 1000);

        clouds.x = 0;
        clouds.y = 0;
        clouds.width = game.width;
        clouds.height = game.height;

        this.gameCompleteText.cameraOffset.x = game.camera.width / 2;
        this.gameCompleteText.cameraOffset.y = game.camera.height / 2 - 100;
        this.playAgainText.cameraOffset.x = game.camera.width / 2;
        this.playAgainText.cameraOffset.y = game.camera.height / 2 + 100;

    },

    shutdown: function () {

        this.map = undefined;
        this.layer = undefined;
        this.climbLayer = undefined;
        this.player = undefined;
        this.cursors = undefined;
        this.jumpButton = undefined;
        this.enemy = undefined;
        this.emitter = undefined;
        this.gameCompleteText = undefined;
        this.playAgainText = undefined;

    },

    render: function () {

        game.debug.text('FPS: ' + game.time.fps, 32, 32, "#ffffff");
        //game.debug.spriteInfo(this.player, 32, 64);
        //game.debug.spriteInfo(this.enemy, 496, 64);

    }

};
