var menuState = {

    menuGroup: undefined,
    switched: false,

    create: function () {

        this.menuGroup = game.add.group();
        this.menuGroup.x = game.world.centerX;
        this.menuGroup.y = game.world.centerY;

        var textsprite = this.menuGroup.add(this.createText(0, -80, 'Ready?\nHit spacebar'));

        //  Register the key.
        this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        //  Stop the following key from propagating up to the browser
        game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

        this.switched = false;
    },

    update: function () {

        if (this.spaceKey.downDuration(1000) && !this.switched) {
            //console.log('switched');
            this.switched = true;
            game.state.start('game');
        }
    },

    resize: function () {

        this.menuGroup.x = game.world.centerX;
        this.menuGroup.y = game.world.centerY;

    },

    shutdown: function () {

        this.menuGroup = undefined;

    },

    createText: function (x, y, text) {

        var textSprite = game.add.text(x, y, text);
        textSprite.anchor.setTo(0.5);
        textSprite.font = fontName;
        textSprite.fontSize = 32;
        textSprite.fill = colors.normalStroke;
        textSprite.align = 'center';

        return textSprite;

    }
};
