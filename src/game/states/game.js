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

        this.map = game.add.tilemap('level');
        this.map.addTilesetImage('tiles');

        this.layer = this.map.createLayer('platformlayer');
        //this.layer.debug = true;
        this.layer.resizeWorld();

        this.player = game.add.sprite(32, 32, 'player');

        this.player.animations.add('run-left', [0], 12, true);
        this.player.animations.add('run-right', [0], 12, true);
        this.player.animations.add('jump-left', [0], 12, true);
        this.player.animations.add('jump-right', [0], 12, true);

        game.camera.follow(this.player);

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
