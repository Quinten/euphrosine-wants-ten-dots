var game;

var gameData;

var fontName = 'monospace';
var googleFontName = 'Inconsolata';

var fx;
window.PhaserGlobal = { disableWebAudio: true };

var colors = {normalBG: '#2c3e50'};
var tints = {normalBG: 0x2c3e50};

WebFontConfig = {
    active: function() { fontName = googleFontName; },
    google: {
        families: [googleFontName]
    }
};

window.onload = function() {

    game = new Phaser.Game("100%", "100%", Phaser.CANVAS, '');

    game.state.add('boot', bootState);
    game.state.add('load', loadState);
    //game.state.add('splash', splashState);
    //game.state.add('menu', menuState);
    //game.state.add('game', gameState);

    game.state.start('boot');

};
