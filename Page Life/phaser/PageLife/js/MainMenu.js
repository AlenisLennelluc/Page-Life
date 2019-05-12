// The MainMenu state and its methods
var MainMenu = function(game) {};
MainMenu.prototype = {

	preload() {
		console.log('MainMenu: Preload');

		// preload assets
		game.load.image('background', 'assets/img/background.png');
		game.load.image('ground', 'assets/img/platform.png');
		game.load.image('birb', 'assets/img/birb.png');
		game.load.image('mask', 'assets/img/mask.png');

	},

	create() {
		// Add the background and make it properly cover the canvas
		var sky = game.add.tileSprite(0,0, game.world.width, game.world.height, 'background');

		// Set up the background music
		var bg = game.add.audio('funk');
		//bg.loopFull();

		// Add instruction text
		game.add.text(400,200, 'Page Life\n\n' +
			'Use the arrow keys to move\nleft, right, up and down.\n' +
			'Press Space To Start', { fontSize: '32px', fill: '#000'});
		game.add.sprite(0, 0, 'mask');
	},

	update() {
		// Check for spacebar to move to Play
		if (game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR))
			game.state.start('Play');
	}
}
