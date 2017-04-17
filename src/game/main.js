var game;

var gameData;

var pad1;

var fontName = 'monospace';
var googleFontName = 'Sue Ellen Francisco';

var music;
var fx;
var audioFallback = (Phaser.Device.isAndroidStockBrowser()) ? true : false;
window.PhaserGlobal = { disableWebAudio: audioFallback };

var colors = {normalBG: '#91d2d9', normalStroke: '#c0392b'};
var tints = {normalBG: 0x91d2d9, normalStroke: 0xc0392b};

var clouds;

WebFontConfig = {
    active: function() { fontName = googleFontName; },
    google: {
        families: [googleFontName]
    }
};

var stageMask;

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

function checkReferrer(e) {
    if (e.key === 'r') {
        if (window.console) {
            console.log(document.referrer);
        }
        window.removeEventListener('keyup', checkReferrer);
    }
}
//window.addEventListener('keyup', checkReferrer);
