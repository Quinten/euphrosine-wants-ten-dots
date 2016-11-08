var splashState = {

    text: undefined,

    create: function () {

        clouds = game.make.tileSprite(0, 0, game.width, game.height, 'clouds');
        game.stage.addChildAt(clouds, 0);

        var text = splashState.text = game.add.text(game.world.centerX, game.world.centerY, "Because everyone loves dots...");
        text.anchor.setTo(0.5);

        text.font = fontName;
        text.fontSize = 42;

        text.fill = colors.normalStroke;

        text.align = 'center';

        game.time.events.add(Phaser.Timer.SECOND * 3, function () {
            game.state.start('menu');
        }, this);

    },

    update: function () {

        clouds.tilePosition.x -= 1;

    },

    resize: function () {

        var text = splashState.text;
        text.x = game.world.centerX;
        text.y = game.world.centerY;

        clouds.x = 0;
        clouds.y = 0;
        clouds.width = game.width;
        clouds.height = game.height;

    },

    shutdown: function () {

        splashState.text = undefined;

    }

};
