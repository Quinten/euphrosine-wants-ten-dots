var gameState = {

    // parameters
    // ...

    // objects
    map: undefined,
    layer: undefined,
    player: undefined,

    // not parameters
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

        this.player = game.add.sprite(32, 32, 'player');

        game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.bounce.y = 0.2;
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(48, 48, 0, 0); // will need tweaking when we have a graphic

        this.player.animations.add('run-left', [0], 12, true);
        this.player.animations.add('run-right', [0], 12, true);
        this.player.animations.add('jump-left', [0], 12, true);
        this.player.animations.add('jump-right', [0], 12, true);

        game.camera.follow(this.player);

    },

    update: function () {

        game.physics.arcade.collide(this.player, this.layer);

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

    }

};
