var bootState = {

    create: function () {

        // do settings
        game.stage.backgroundColor = colors.normalBG;
        game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        game.stage.smoothed = false; // none pixelated effect
        game.input.mouse.capture = true;

        game.input.gamepad.start();
        pad1 = game.input.gamepad.pad1;

        // go on to preloading
        game.state.start('load');
    }
};
