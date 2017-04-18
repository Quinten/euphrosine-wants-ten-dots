var bootState = {

    create: function () {

        // do settings
        game.stage.backgroundColor = colors.normalBG;
        game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;

        stageMask = new PIXI.Graphics();
        stageMask.beginFill(0x00FF00);
        stageMask.drawRect(0,0,2048,2048);
        game.stage.mask = stageMask;

        game.stage.smoothed = false; // none pixelated effect
        game.input.mouse.capture = true;

        // at first do not pause game when browser window loses focus
        game.stage.disableVisibilityChange = true;

        game.input.gamepad.start();
        pad1 = game.input.gamepad.pad1;

        // go on to preloading
        game.state.start('load');
    }
};
