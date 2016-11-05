var gameState = {

    map: undefined,
    layer: undefined,
    resizeTO: 0,

    create: function () {

        this.map = game.add.tilemap('level');
        this.map.addTilesetImage('tiles');

        this.layer = this.map.createLayer('platformlayer');
        //this.layer.debug = true;
        this.layer.resizeWorld();

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

    }

};
