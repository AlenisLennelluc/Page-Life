var game = new Phaser.Game(1280, 720, Phaser.AUTO);

// Global Variables
var cursors;
var snowflakes;

// Setup game states
game.state.add('MainMenu', MainMenu);
game.state.add('Play', Play);
game.state.add('GameOver', GameOver);
game.state.start('MainMenu');
