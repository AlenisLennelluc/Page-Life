// The MainMenu state and its methods
var MainMenu = function(game) {};
MainMenu.prototype = {

	preload() {
		console.log('MainMenu: Preload');

		// preload assets
		game.load.spritesheet('player', 'assets/img/dude.png', 288 / 9, 48);
		game.load.atlas('space', 'assets/img/space.png', 'assets/img/space.json');
		game.load.image('background', 'assets/img/background.png');
		game.load.image('ground', 'assets/img/platform.png');
		game.load.image('birb', 'assets/img/birb.png');

		// Preload audio
		game.load.audio('pop', 'assets/audio/pop01.mp3');
		game.load.audio('funk', 'assets/audio/funk.wav');
	},

	create() {
		// Add the background and make it properly cover the canvas
		var sky = game.add.sprite(0, 0, 'background');

		// Set up the background music
		var bg = game.add.audio('funk');
		//bg.loopFull();

		// Add instruction text
		game.add.text(16,16, 'Page Life\n\n' +
			'Use the arrow keys to move\nleft, right, up and down.\n' +
			'Press Space To Start', { fontSize: '32px', fill: '#FFF'});

		// Add instructional sprites
		game.add.sprite(250, 275, 'space', 'enemy');
		game.add.sprite(250, 360, 'space', 'powerup');
	},

	update() {
		// Check for spacebar to move to Play
		if (game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR))
			game.state.start('Play');
	}
}
