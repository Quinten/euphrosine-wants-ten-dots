var gameState = {

    // parameters
    // ...

    // objects
    map: undefined,
    layer: undefined,
    player: undefined,
    wKey: undefined,
    zKey: undefined,
    oKey: undefined,
    dKey: undefined,
    kKey: undefined,

    // not parameters
    resizeTO: 0,
    facing: 'left',
    jumpTimer: 0,
    directionTimer: 0,

    create: function () {

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = 500;

        this.map = game.add.tilemap('level');
        this.map.addTilesetImage('tiles');

        this.map.setCollisionByExclusion([]);

        this.layer = this.map.createLayer('platformlayer');
        //this.layer.debug = true;
        this.layer.resizeWorld();

        this.player = game.add.sprite(32, 32, 'player');

        game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.bounce.y = 0;
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(48, 48, 0, 0); // will need tweaking when we have a graphic

        this.player.animations.add('run-left', [0], 12, true);
        this.player.animations.add('run-right', [0], 12, true);
        this.player.animations.add('jump-left', [0], 12, true);
        this.player.animations.add('jump-right', [0], 12, true);

        game.camera.follow(this.player);

        this.wKey = game.input.keyboard.addKey(Phaser.KeyCode.W);
        this.zKey = game.input.keyboard.addKey(Phaser.KeyCode.Z);
        this.oKey = game.input.keyboard.addKey(Phaser.KeyCode.O);
        this.dKey = game.input.keyboard.addKey(Phaser.KeyCode.D);
        this.kKey = game.input.keyboard.addKey(Phaser.KeyCode.K);

    },

    update: function () {

        game.physics.arcade.collide(this.player, this.layer);

        var directionKey = false;
        if (this.dKey.isDown || this.kKey.isDown) {
            directionKey = true;
        }

        if (directionKey && game.time.now > this.directionTimer) {
            this.facing = (this.facing === 'left') ? 'right' : 'left';
            this.directionTimer = game.time.now + 150;
        }

        if (this.facing === 'left') {
            this.player.body.velocity.x = -150;
        } else {
            this.player.body.velocity.x = 150;
        }

        var jumpKey = false;
        if (this.wKey.isDown || this.zKey.isDown || this.oKey.isDown) {
            jumpKey = true;
        }

        if (jumpKey && this.player.body.onFloor() && game.time.now > this.jumpTimer) {
            this.player.body.velocity.y = -400;
            this.jumpTimer = game.time.now + 750;
        }

    },

    resize: function () {

        var that = this;
        clearTimeout(this.resizeTO);
        this.resizeTO = setTimeout(function () {
            that.layer.resize(game.camera.width, game.camera.height);
        }, 1000);

    },

    shutdown: function () {

        this.map = undefined;
        this.layer = undefined;
        this.player = undefined;
        this.wKey = undefined;
        this.zKey = undefined;
        this.oKey = undefined;
        this.dKey = undefined;
        this.kKey = undefined;

    }

};
