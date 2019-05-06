// The MainMenu state and its methods
var MainMenu = function(game) {};
MainMenu.prototype = {

	preload() {
		console.log('MainMenu: Preload');

		// preload assets
		game.load.atlas('ship', 'assets/img/ship.png', 'assets/img/ship.json');
		game.load.atlas('space', 'assets/img/space.png', 'assets/img/space.json');
		game.load.image('background', 'assets/img/background.png');

		// Generate the animation frames
		Phaser.Animation.generateFrameNames('ship', 1, 7, 1);

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
		game.add.text(16,16, 'Space: Just Another Frontier\n\n' +
			'Use the arrow keys to move\nleft, right, up and down.\n' +
			'Hold Space to shoot.\n\n' +
			'Shoot these:\n\nCollect these:\n\n' +
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
