// Game Configuration
let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play]
}

let game = new Phaser.Game(config);

// Set UI Sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
let starSpeed = 4;

// reserve some keyboard bindings
let keyF, keyR, keyLEFT, keyRIGHT, keyA, keyD, keyE ; 

// POINT BREAKDOWN FOR MODS
// ----------------------------
// Redesign the game's artwork, UI, and sound to change its theme/aesthetic (to something other than sci-fi) (60)
// Add your own (copyright-free) background music to the Play scene (5)
// Allow the player to control the Rocket after it's fired (5)
// Display the time remaining (in seconds) on the screen (10)
// Allow mouse movement and Fire(20)
