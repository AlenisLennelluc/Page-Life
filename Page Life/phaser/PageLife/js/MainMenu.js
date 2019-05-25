// The MainMenu state and its methods
var MainMenu = function(game) {};
MainMenu.prototype = {

	preload() {
		console.log('MainMenu: Preload');

		// preload assets
		game.load.image('background', 'assets/img/background.png');
		game.load.spritesheet('birb', 'assets/img/birb_walk_cycle.png', 100, 115);
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
			'You can also drag the egg around.\n' +
			'Drop the egg to start.', { fontSize: '32px', fill: '#000'});
		this.egg = game.add.sprite(170, game.world.height - 250, 'egg');
		this.egg.inputEnabled = true;
		this.egg.input.enableDrag(true);
		game.physics.arcade.enable(this.egg);
		this.egg.body.gravity.y = 1200;
		this.egg.body.bounce.y = 0.1;
		this.egg.events.onDragStart.add(startDragMenu, this);
    this.egg.events.onDragStop.add(stopDragMenu, this);

		this.nest = game.add.sprite(100, game.world.height - 200, 'nest');
		game.physics.arcade.enable(this.nest);
		this.nest.body.immovable = true;
	},

	update() {
		game.physics.arcade.collide(this.egg, this.nest);

		if (this.egg.position.y > game.world.height + 100)
		{
			game.state.start('Play');
		}
	}
}

function startDragMenu() {
	this.egg.body.moves = false;
}

// Once player lets go of box, re-engage physics
function stopDragMenu() {
	this.egg.body.moves = true;
}
