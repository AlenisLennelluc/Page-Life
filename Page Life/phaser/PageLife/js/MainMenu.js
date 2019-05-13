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

		// load tilemap data (key, url, data, format)
    game.load.tilemap('level', 'assets/img/PrototypeLevelBackground.json', null, Phaser.Tilemap.TILED_JSON);
    // load tilemap spritesheet (key, url, frameWidth, frameHeight)
    game.load.spritesheet('sheetA', 'assets/img/level1ArtA.png', 32, 32);
		game.load.spritesheet('sheetB', 'assets/img/level1ArtB.png', 32, 32);
		game.load.spritesheet('sheetC', 'assets/img/level1ArtC.png', 32, 32);
		game.load.spritesheet('sheetD', 'assets/img/level1ArtD.png', 32, 32);
		game.load.spritesheet('sheetE', 'assets/img/level1ArtE.png', 32, 32);
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
