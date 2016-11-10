var menuState = {

    menuGroup: undefined,
    switched: false,
    textstart: undefined,
    blinkCount: 0,

    create: function () {

        this.menuGroup = game.add.group();
        this.menuGroup.x = game.world.centerX;
        this.menuGroup.y = game.world.centerY;

        var textsprite = this.menuGroup.add(this.createText(0, -150, 'Euphrosine wants ten dots', colors.normalStroke, 69));
        var instructionsSprite = this.menuGroup.add(this.createText(0, 0, 'Catch dice to collect 10 dots\nUse left + right arrow keys to run + spacebar to jump\nUp arrow in the air to float\nUp + then other arrow keys in green area to climb', colors.normalStroke, 28));
        this.textstart = this.menuGroup.add(this.createText(0, 150, 'Hit spacebar to start', colors.normalStroke, 42));

        //var startimage = this.menuGroup.add(game.add.sprite(0, 0, 'startscreen'));
        //startimage.anchor.setTo(0.5);

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
            fx.play('coin');
            game.state.start('game');
        }

        this.blinkCount++;
        if (this.blinkCount > 15) {
            this.blinkCount = 0;
            this.textstart.visible = !this.textstart.visible;
        }

        clouds.tilePosition.x -= 1;

    },

    resize: function () {

        this.menuGroup.x = game.world.centerX;
        this.menuGroup.y = game.world.centerY;

        clouds.x = 0;
        clouds.y = 0;
        clouds.width = game.width;
        clouds.height = game.height;

    },

    shutdown: function () {

        this.menuGroup = undefined;
        this.textstart = undefined;

    },

    createText: function (x, y, text, color, size) {

        var textSprite = game.add.text(x, y, text);
        textSprite.anchor.setTo(0.5);
        textSprite.font = fontName;
        textSprite.fontSize = size;
        textSprite.fill = color;
        textSprite.align = 'center';

        return textSprite;

    }
};
