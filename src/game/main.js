var game;

var gameData;

var fontName = 'monospace';
var googleFontName = 'Sue Ellen Francisco';

var music;

var fx;
window.PhaserGlobal = { disableWebAudio: true };

var colors = {normalBG: '#91d2d9', normalStroke: '#c0392b'};
var tints = {normalBG: 0x91d2d9, normalStroke: 0xc0392b};

var clouds;

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
    game.state.add('splash', splashState);
    game.state.add('menu', menuState);
    game.state.add('game', gameState);

    game.state.start('boot');

    window.focus();
    document.body.addEventListener('click',function(e) {
        window.focus();
    },false);

};
