// The Play state and its methods
var Play = function(game) {var score;};
Play.prototype = {

	create: function() {
		game.stage.setBackgroundColor('#fff');
		// create new Tilemap objects - when using Tiled, you only need to pass the key
		this.map = game.add.tilemap('level');
		// add an image to the maps to be used as a tileset (tileset, key)
    // the tileset name is specified w/in the .json file (or in Tiled)
    // a single map may use multiple tilesets
    this.map.addTilesetImage('level1artA', 'sheetA');
		this.map.addTilesetImage('level1ArtB', 'sheetB');
		this.map.addTilesetImage('level1ArtC', 'sheetC');
		this.map.addTilesetImage('level1ArtD', 'sheetD');
		this.map.addTilesetImage('level1ArtE', 'sheetE');
    // set ALL tiles to collide *except* those passed in the array
    this.map.setCollisionByExclusion([]);
    // create new TilemapLayer object
    // A Tilemap Layer is a set of map data combined with a tileset
		this.map.createLayer('behind1');
    this.mapLayer = this.map.createLayer('Platform1');
		this.map.createLayer('infront1');
    // set the world size to match the size of the Tilemap layer
    this.mapLayer.resizeWorld();

		// Turn on the Physics engine
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.TILE_BIAS = 32;

		// Box the player can move around for future use
		this.box = game.add.sprite(300, 2000, 'birb');
		this.box.inputEnabled = true;
		this.box.input.enableDrag(true);
		game.physics.arcade.enable(this.box);
		this.box.body.gravity.y = 1200;
		this.box.body.bounce.y = 0.1;
		this.box.body.collideWorldBounds = true;
		// Make sure box doesnt freak out while picked up
		this.box.events.onDragStart.add(startDrag, this);
    this.box.events.onDragStop.add(stopDrag, this);

		// Create mask to fade out far away parts of the level
		this.mask = game.add.sprite(0, 720, 'mask');
		this.mask.anchor.setTo(0.5, 0.5);

		// Insert background
		game.add.tileSprite(0,0, game.world.width, game.world.height, 'background');

		// Create the player
		this.player = game.add.sprite(200, 2000, 'birb');
		game.physics.arcade.enable(this.player); // Enable physics
		this.player.body.collideWorldBounds = true; // Make it so the player can't move off screen
		this.player.body.gravity.y = 1200;
		this.player.body.bounce.y = 0.1;
		this.player.anchor.setTo(0.5,0.5); // Make mirroring clean
		game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 1, 1);

		// 1 = Right, -1 = left
		this.facing = 1;

		// Star for player to click on to win the game
		this.star = game.add.sprite(game.world.width - 400, 2200, 'star');
		this.star.inputEnabled = true;
		this.star.input.enableDrag(true);
		this.star.events.onDragStart.add(getStar, this);

		// Grab the arrowkey inputs
		cursors = game.input.keyboard.createCursorKeys();

		// Add the audio
		this.jump = game.add.audio('jump');
		this.pickup = game.add.audio('pickup');


		// timers
		this.jumpTimer = 0;
		this.jumpState = 0;
	},

	update: function() {
		// Check if player is touching platform. Returns boolean
		game.physics.arcade.collide(this.player, this.box);
		game.physics.arcade.collide(this.player, this.mapLayer);
		game.physics.arcade.collide(this.box, this.mapLayer);

		if (cursors.left.isDown)
		{ // If left key down, move player left
			this.player.body.velocity.x = -300;
			// Enable mirroring
			if (this.player.scale.x > 0)
			{
				this.facing = -1;
				this.player.scale.x *= -1;
			}
		}
		else if (cursors.right.isDown)
		{ // If right key down, move playerr right
			this.player.body.velocity.x = 300;
			// disable mirroring
			if (this.player.scale.x < 0)
			{
				this.facing = 1;
				this.player.scale.x *= -1;
			}
		}
		else
		{ // Else stop the player and face them front
			this.player.body.velocity.x = 0;
		}

		// If up is down, move up
		if (cursors.up.isDown && (this.player.body.blocked.down || this.player.body.touching.down))
		{
			// Start jump animation
			this.jumpState = 1;
			this.jumpTimer = 0;
			// Begin moving upwards immediately
			this.player.body.velocity.y = -650;
			this.jump.play();
		}

		// Shorten birb
		if (this.jumpState == 1) {
			// Increase timer by time elapsed * 8
			this.jumpTimer += game.time.physicsElapsed * 4;
			// this.jumpTimer = magnitude, this.facing = direction
			this.player.scale.y -= this.jumpTimer;
			if (this.jumpTimer > 0.2) {
				// Move to phase 3
				this.jumpState = 2;
				this.jumpTimer = 0;
			}
		}

		// Widen birb
		if (this.jumpState == 2) {
			// Increase timer by time elapsed * 2
			this.jumpTimer += game.time.physicsElapsed;
			// this.jumpTimer = magnitude, this.facing = direction
			this.player.scale.x += this.jumpTimer * this.facing;
			if (this.jumpTimer > 0.05) {
				// Move to phase 2
				this.jumpState = 3;
				this.jumpTimer = 0;
			}
		}

		// Normalize birb
		if (this.jumpState == 3) {
			// Increase timer by time elapsed * 8
			this.jumpTimer += game.time.physicsElapsed;
			// this.jumpTimer = magnitude, this.facing = direction
			this.player.scale.x -= this.jumpTimer * this.facing;
			// this.jumpTimer = magnitude, this.facing = direction
			this.player.scale.y += this.jumpTimer * 2;
			if (this.jumpTimer > 0.05) {
				// Normalize and end jump
				this.jumpState = 0;
				this.jumpTimer = 0;
				this.player.scale.y = 1;
				this.player.scale.x = this.facing;
			}
		}

		//update mask
		this.mask.position.x = this.player.position.x;
		this.mask.position.y = this.player.position.y;
	}
}

// While dragging box, turn off physics
function startDrag() {
	this.box.body.moves = false;
}

// Once player lets go of box, re-engage physics
function stopDrag() {
	this.box.body.moves = true;
}

// When player clicks on star, end the game
function getStar() {
	this.pickup.play();
	game.state.start('GameOver');
}
