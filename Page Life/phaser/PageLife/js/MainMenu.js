// The MainMenu state and its methods
var MainMenu = function(game) {};
MainMenu.prototype = {

	preload() {
		console.log('MainMenu: Preload');

		// preload assets
		game.load.image('background', 'assets/img/background.png');
		game.load.image('birb', 'assets/img/grey_birb.png');
		game.load.image('mask', 'assets/img/mask.png');
		game.load.image('star', 'assets/img/star.png');
		game.load.image('egg', 'assets/img/egg.png');
		game.load.image('nest', 'assets/img/boat_body.png');

		// load tilemap data (key, url, data, format)
    game.load.tilemap('level', 'assets/img/page_life_map.json', null, Phaser.Tilemap.TILED_JSON);
    // load tilemap spritesheet (key, url, frameWidth, frameHeight)
    game.load.spritesheet('sheetA', 'assets/img/level1ArtA.png', 32, 32);
		game.load.spritesheet('sheetB', 'assets/img/level1ArtB.png', 32, 32);
		game.load.spritesheet('sheetC', 'assets/img/level1ArtC.png', 32, 32);
		game.load.spritesheet('sheetD', 'assets/img/level1ArtD.png', 32, 32);
		game.load.spritesheet('sheetE', 'assets/img/level1ArtE.png', 32, 32);

		// Load audio
		game.load.audio('jump', 'assets/audio/BirbJump.wav');
		game.load.audio('pickup', 'assets/audio/BirbPickup.wav');
	},

	create() {
		// Add the background and make it properly cover the canvas
		var sky = game.add.tileSprite(0,0, game.world.width, game.world.height, 'background');

		game.stage.setBackgroundColor('#fff');

		// Set up the background music
		var bg = game.add.audio('funk');
		//bg.loopFull();

		// Add instruction text
		game.add.text(400,200, 'Page Life\n\n' +
			'Use the arrow keys to move\nleft, right, up and down.\n' +
			'Find the star and click it to win!\n' +
			'You can also drag the friend birb around.\n' +
			'Press Space To Start', { fontSize: '32px', fill: '#000'});
		game.add.sprite(-1 * game.world.width, -1 * game.world.height, 'mask');
	},

	update() {
		// Check for spacebar to move to Play
		if (game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR))
			game.state.start('Play');
	}
}
