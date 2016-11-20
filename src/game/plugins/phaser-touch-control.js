(function(window, Phaser) {
    'use strict';
    /**
      * TouchControl Plugin for Phaser
      * Loosely based on https://github.com/Gamegur-us/phaser-touch-control-plugin
      */
    Phaser.Plugin.TouchControl = function (game, parent) {

        Phaser.Plugin.call(this, game, parent);
        this.input = this.game.input;

        this.imageGroup = [];

        this.imageGroup.push(this.game.add.sprite(0, 0, 'dpad'));
        this.imageGroup.push(this.game.add.sprite(0, 0, 'touchsegment'));
        this.imageGroup.push(this.game.add.sprite(0, 0, 'touchsegment'));
        this.imageGroup.push(this.game.add.sprite(0, 0, 'touch'));

        this.imageGroup.forEach(function (e) {
            e.anchor.set(0.5);
            e.visible = false;
            e.fixedToCamera = true;
        });

        this.spaceSprite = this.game.add.sprite(0, 0, 'touch');
        this.spaceSprite.anchor.set(0.5);
        this.spaceSprite.visible = false;
        this.spaceSprite.fixedToCamera = true;

    };

    Phaser.Plugin.TouchControl.prototype = Object.create(Phaser.Plugin.prototype);
    Phaser.Plugin.TouchControl.prototype.constructor = Phaser.Plugin.TouchControl;

    Phaser.Plugin.TouchControl.prototype.settings = {
        // max distance from initial touch
        maxDistanceInPixels: 200,
        singleDirection: false
    };

    Phaser.Plugin.TouchControl.prototype.cursors = {
        up: false, down: false, left: false, right: false, space: false
    };

    Phaser.Plugin.TouchControl.prototype.speed = {
        x:0, y:0
    };

    Phaser.Plugin.TouchControl.prototype.inputEnable = function() {
        this.input.onDown.add(createCompass, this);
        //this.input.onUp.add(removeCompass, this);
    };

    Phaser.Plugin.TouchControl.prototype.inputDisable = function() {
        this.input.onDown.remove(createCompass, this);
        //this.input.onUp.remove(removeCompass, this);
    };

    var initialPoint;
    var compassActive = false;
    var createCompass = function () {

        if (!this.compassActive && this.input.pointer1.isDown) {

            this.compassActive = true;

            this.imageGroup.forEach(function (e) {

                e.visible = true;
                e.bringToTop();

                //e.cameraOffset.x = this.input.pointer1.worldX;
                //e.cameraOffset.y = this.input.pointer1.worldY;

            }, this);

            this.spaceSprite.bringToTop();

            this.preUpdate = setDirection.bind(this);

            initialPoint = this.input.pointer1.position.clone();

        }

    };

    var removeCompass = function (that) {

        that.imageGroup.forEach(function(e){
            e.visible = false;
        });

        that.spaceSprite.visible = false;

        that.cursors.up = false;
        that.cursors.down = false;
        that.cursors.left = false;
        that.cursors.right = false;
        that.cursors.space = false;

        that.speed.x = 0;
        that.speed.y = 0;

        that.preUpdate = empty;

        that.compassActive = false;

    };

    var empty = function() { };

    var setDirection = function() {

        if (!this.input.pointer1.isDown) {
            removeCompass(this);
            return;
        }

        var d = initialPoint.distance(this.input.pointer1.position);
        var maxDistanceInPixels = this.settings.maxDistanceInPixels;

        var deltaX = this.input.pointer1.position.x - initialPoint.x;
        var deltaY = this.input.pointer1.position.y - initialPoint.y;

        if (this.settings.singleDirection) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                deltaY = 0;
                this.input.pointer1.position.y = initialPoint.y;
            } else {
                deltaX = 0;
                this.input.pointer1.position.x = initialPoint.x;
            }
        }
        var angle = initialPoint.angle(this.input.pointer1.position);


        if (d > maxDistanceInPixels) {
            deltaX = (deltaX === 0) ? 0 : Math.cos(angle) * maxDistanceInPixels;
            deltaY = (deltaY === 0) ? 0 : Math.sin(angle) * maxDistanceInPixels;
        }

        this.speed.x = parseInt((deltaX / maxDistanceInPixels) * 100 * -1, 10);
        this.speed.y = parseInt((deltaY / maxDistanceInPixels) * 100 * -1, 10);

        this.cursors.up = (deltaY < -8);
        this.cursors.down = (deltaY > 8);
        this.cursors.left = (deltaX < -8);
        this.cursors.right = (deltaX > 8);
        this.cursors.space = this.input.pointer2.isDown;

        if (this.cursors.space) {
            this.spaceSprite.visible = true;
            this.spaceSprite.cameraOffset.x = this.input.pointer2.screenX;
            this.spaceSprite.cameraOffset.y = this.input.pointer2.screenY;
        } else {
            this.spaceSprite.visible = false;
        }

        this.imageGroup.forEach(function(e,i){
            e.cameraOffset.x = initialPoint.x + (deltaX) * i / 3;
            e.cameraOffset.y = initialPoint.y + (deltaY) * i / 3;
        }, this);

    };
    Phaser.Plugin.TouchControl.prototype.preUpdate = empty;

}(window, Phaser));
