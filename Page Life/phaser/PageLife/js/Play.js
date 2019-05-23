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
		// this.map.createLayer('behind1');
    this.mapLayer = this.map.createLayer('Tile Layer 1');
		// this.map.createLayer('infront1');
    // set the world size to match the size of the Tilemap layer
    this.mapLayer.resizeWorld();

		// Turn on the Physics engine
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.TILE_BIAS = 32;

		// Box the player can move around for future use
		this.box = game.add.sprite(game.world.width - 1000, 500, 'egg');
		this.box.inputEnabled = true;
		this.box.input.enableDrag(true);
		game.physics.arcade.enable(this.box);
		this.box.body.gravity.y = 1200;
		this.box.body.bounce.y = 0.1;
		this.box.body.collideWorldBounds = true;
		this.box.body.friction = new Phaser.Point(0.5, 1);
		// Make sure box doesnt freak out while picked up
		this.box.events.onDragStart.add(startDrag, this);
    this.box.events.onDragStop.add(stopDrag, this);

		this.oldBoxX1 = this.box.position.x;
		this.oldBoxY1 = this.box.position.y;
		this.oldBoxX2 = this.box.position.x;
		this.oldBoxY2 = this.box.position.y;
		this.oldBoxX3 = this.box.position.x;
		this.oldBoxY3 = this.box.position.y;
		this.oldBoxX4 = this.box.position.x;
		this.oldBoxY4 = this.box.position.y;
		this.oldBoxX5 = this.box.position.x;
		this.oldBoxY5 = this.box.position.y;

		this.boxDragged = false;

		this.nests = game.add.group();
		this.nests.enableBody = true;
		this.nests.create(400, game.world.height - 200, 'nest');
		this.nests.create(2400, game.world.height - 200, 'nest');
		this.nests.create(3776, 9436, 'nest');
		this.nests.create(4960, 4572, 'nest');
		this.nests.create(7072, 2396, 'nest');
		this.nests.create(1440, 988, 'nest');
		this.nests.create(4000, 1436, 'nest');

		this.saveX = 400;
		this.saveY = game.world.height - 200;

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
		this.player.body.friction = new Phaser.Point(0.5, 1);
		this.player.tint = 0xff0000;
		game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, .1, .1);

		this.player.animations.add('walk', [ 0, 1, 2, 3], 10, true);
		this.player.animations.add('jump', [4], 10, true);

		// 1 = Right, -1 = left
		this.facing = 1;

		// Star for player to touch and win the game
		this.star = game.add.sprite(game.world.width - 400, 400, 'star');
		game.physics.arcade.enable(this.star);

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
		game.physics.arcade.overlap(this.star, this.box, getStar, null, this);
		game.physics.arcade.overlap(this.box, this.nests, setSave, null, this);

		if (cursors.left.isDown)
		{ // If left key down, move player left
			this.player.body.velocity.x = -300;
			this.player.animations.play('walk');
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
			this.player.animations.play('walk');
			// disable mirroring
			if (this.player.scale.x < 0)
			{
				this.facing = 1;
				this.player.scale.x *= -1;
			}
		}
		else
		{ // Else stop the player
			this.player.body.velocity.x = 0;
			this.player.animations.stop();
			if (this.player.body.blocked.down || this.player.body.touching.down)
			{
				this.player.frame = 0;
			}
		}
		if (this.box.body.blocked.down || this.box.body.touching.down)
		{
			this.box.body.velocity.x *= .7;
		}

		// If up is down, move up
		if (cursors.up.isDown && (this.player.body.blocked.down || this.player.body.touching.down))
		{
			// Start jump animation
			this.jumpState = 1;
			this.jumpTimer = 0;
			// Begin moving upwards immediately
			this.player.body.velocity.y = -650;
			this.player.animations.play('jump');
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


		// Keeping track of egg movement
		this.oldBoxX5 = this.oldBoxX4;
		this.oldBoxY5 = this.oldBoxY4;
		this.oldBoxX4 = this.oldBoxX3;
		this.oldBoxY4 = this.oldBoxY3;
		this.oldBoxX3 = this.oldBoxX2;
		this.oldBoxY3 = this.oldBoxY2;
		this.oldBoxX2 = this.oldBoxX1;
		this.oldBoxY2 = this.oldBoxY1;
		this.oldBoxX1 = this.box.position.x;
		this.oldBoxY1 = this.box.position.y;

		// Calculate distance from birb to egg
		var birbEggDistX = (this.box.position.x - this.player.position.x);
		var birbEggDistY = (this.box.position.y - this.player.position.y);

		//console.log('Dist x: ' + birbEggDistX + ' y: ' + birbEggDistY);

		var birbEggDist = Math.sqrt(Math.pow(birbEggDistX, 2) + Math.pow(birbEggDistY, 2));

		//console.log('Total Dist: ' + birbEggDist);

		if (birbEggDist > 1000 && !this.boxDragged)
		{
			console.log(this.saveX + " " + this.saveY);
			this.box.position.x = this.saveX;
			this.box.position.y = this.saveY;
			this.player.position.x = this.oldBoxX5;
			this.player.position.y = this.oldBoxY5;
		}

		// Currently tints semirandomly. Should tint red.
		this.player.tint = birbEggDist / 1000 * 0xff0000;
	}
}

// While dragging box, turn off physics
function startDrag() {
	this.box.body.moves = false;
	this.box.body.immovable = true;
	this.boxDragged = true;
	game.camera.follow(null);
}

// Once player lets go of box, re-engage physics
function stopDrag() {
	this.box.body.moves = true;
	this.box.body.immovable = false;
	this.boxDragged = false;
	game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, .1, .1);

	// Grab the last 5 x and y locations of the egg to calculate momentum
	var xMove = this.box.position.x - this.oldBoxX1;
	var yMove = this.box.position.y - this.oldBoxY1;
	xMove += this.oldBoxX1 - this.oldBoxX2;
	yMove += this.oldBoxY1 - this.oldBoxY2;
	xMove += this.oldBoxX2 - this.oldBoxX3;
	yMove += this.oldBoxY2 - this.oldBoxY3;
	xMove += this.oldBoxX3 - this.oldBoxX4;
	yMove += this.oldBoxY3 - this.oldBoxY4;
	xMove += this.oldBoxX4 - this.oldBoxX5;
	yMove += this.oldBoxY4 - this.oldBoxY5;
	this.box.body.velocity.x = xMove * 2;
	this.box.body.velocity.y = yMove * 2;

}

// When player steps on star, end the game
function getStar() {
	this.pickup.play();
	game.state.start('GameOver');
}

// When player touches a nest, log the save Point
function setSave(egg, nest) {
	this.saveX = nest.position.x;
	this.saveY = nest.position.y;
	console.log("set save to: " + this.saveX + ", " + this.saveY);
}
