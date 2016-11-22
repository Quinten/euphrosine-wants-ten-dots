var loadState = {

    nFontChecks: 0,

    preload: function () {

        // do preloading
        game.load.json('gameData', 'assets/data/game.json');
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
        //game.load.image('square', 'assets/sprites/square.png');
        game.load.audio('sfx', ['assets/audio/fx_mixdown.mp3','assets/audio/fx_mixdown.ogg']);
        game.load.tilemap('level', 'assets/tilemaps/data/level.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'assets/tilemaps/tiles/tiles.png');
        game.load.image('levelflat', 'assets/sprites/level.png');
        game.load.spritesheet('player', 'assets/sprites/player.png', 32, 32);
        game.load.spritesheet('enemy', 'assets/sprites/enemy.png', 32, 32);
        game.load.image('arrow', 'assets/sprites/arrow.png');
        game.load.image('clouds', 'assets/sprites/clouds.png');
        game.load.spritesheet('particles', 'assets/sprites/particles.png', 16, 16);
        game.load.audio('ambient', ['assets/audio/ambient_mixdown.mp3', 'assets/audio/ambient_mixdown.ogg']);
        game.load.image('dpad', 'assets/controls/dpad.png');
        game.load.image('touchsegment', 'assets/controls/touchsegment.png');
        game.load.image('touch', 'assets/controls/touch.png')

        for (var p = 0; p <= 10; p++) {
            game.load.spritesheet('player-' + p, 'assets/sprites/player-' + p + '.png', 32, 32);
        }

    },

    create: function () {

        fx = game.add.audio('sfx');
        fx.allowMultiple = true;
        fx.addMarker('powerup', 2, 1);
        fx.addMarker('hit', 4, 1);
        fx.addMarker('jump', 6, 1);
        fx.addMarker('coin', 8, 1);
        fx.addMarker('reward', 10, 4);
        // ...

        gameData = game.cache.getJSON('gameData');
        //console.log(gameData);
        this.checkFontLoaded();

    },

    checkFontLoaded: function () {

        loadState.nFontChecks++;
        if ((fontName == googleFontName) || (loadState.nFontChecks >= 6)) {
            game.state.start('splash');
        } else {
            setTimeout(loadState.checkFontLoaded, 500);
        }

    }

};
