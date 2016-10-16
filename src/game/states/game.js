var gameState = {

    text: undefined,

    create: function () {

        var text = gameState.text = game.add.text(game.world.centerX, game.world.centerY, "The game will start\nthe 4th of november!");
        text.anchor.setTo(0.5);
        text.font = fontName;
        text.fontSize = 20;
        text.fill = colors.normalStroke;
        text.align = 'center';

    },

    resize: function () {

        var text = gameState.text;
        text.x = game.world.centerX;
        text.y = game.world.centerY;

    },

    shutdown: function () {

        gameState.text = undefined;

    }

};
