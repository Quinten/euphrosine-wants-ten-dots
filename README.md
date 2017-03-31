### Because everyone loves dots...

# Euphrosine wants ten dots

[![Play Euphrosine wants ten dots][screenshot]][screenshotlink]

[screenshot]: https://github.com/Quinten/euphrosine-wants-ten-dots/blob/master/scratch/euphrosine-has-an-itch.gif?raw=true (Play Euphrosine wants ten dots)
[screenshotlink]: https://quinten.github.io/euphrosine-wants-ten-dots/

[Play the game](https://quinten.github.io/euphrosine-wants-ten-dots/)

### Briefing

A game for the [10th Anniversary] ★  Kongregate Game Jam

Theme: `The Number 10`

Game Jam Link: [Forum thread](http://www.kongregate.com/forums/1/topics/673084)

Optional modifiers

Modifier #1 - No Violence

Modifier #2 - Mouth Sounds

Modifier #3 - Two Buttons

Bonus Modifier - This Vine

I only used the No Violence modifier.

The game had to be made in `7 days`. But after the jam i fixed some bugs and added some extra features like support for touch devices and gamepads.

### Simple Final Concept

You play as the ladybug Euphrosine. She can run, jump, climb and float.

Euphrosine likes dice and wants to collect their dots. When she catches a dice, a dot will appear on her back. The game ends when she collected 10 dots.

### Where/how to play

You can play the sweet full browser version on https://quinten.github.io/euphrosine-wants-ten-dots/

The Kongregate link is http://www.kongregate.com/games/qubecity/euphrosine-wants-ten-dots

On a desktop computer use the arrow keys and the spacebar.

On a mobile device you can touch the screen with 2 fingers/thumbs.

There is also gamepad support.

### License

'Euphrosine wants ten dots' is released under the [MIT License](http://opensource.org/licenses/MIT).

### Getting started with the code

Make sure you have node and npm installed. See https://nodejs.org

If that is installed you must also install the grunt cli globally.

    npm install -g grunt-cli

Then clone or fork this repo.

To install development tools you must run these commands in the root of the project:

    npm install

To run the game on your local machine simply type:

    grunt

This will merge and minify all the js files, create a local webserver, open the page and continue watching for file changes in the js files and then merge and minfy these files again.

If you forked the repo you can use this handy command to deploy the pub folder to your gh-pages:

    git subtree push --prefix pub/ origin gh-pages

This will make only the pub folder available on gh-pages.

### Editing the tilemap

In the `scratch` folder you will find a file called `level.tmx`. To edit this file you can use a program called 'Tiled'. See http://www.mapeditor.org/

The map is split into two layers 'platformlayer' and 'climblayer'.

When you are done editing the map, you can export it as a json file to `pub/assets/tilemaps/data/level.json`

For better performance i also export the tilemap from Tiled as a flattened image to `pub/assets/sprites/level.png`



That's about! Have fun!
