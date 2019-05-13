// The Play state and its methods
var Play = function(game) {var score;};
Play.prototype = {

	create: function() {
		game.stage.setBackgroundColor('#fff');
		// create new Tilemap object - when using Tiled, you only need to pass the key
		this.map = game.add.tilemap('level');
		// add an image to the map to be used as a tileset (tileset, key)
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
    this.mapLayer = this.map.createLayer('Tile Layer 1');

    // set the world size to match the size of the Tilemap layer
    this.mapLayer.resizeWorld();

		// Turn on the Physics engine
		game.physics.startSystem(Phaser.Physics.ARCADE);

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

		// Set up player animations
		//this.player.animations.add('left', [0, 1, 2, 3], 10, true);
		//this.player.animations.add('right', [5, 6, 7, 8], 10, true);

		// Grab the arrowkey inputs
		cursors = game.input.keyboard.createCursorKeys();

		this.platforms = game.add.group();
		this.platforms.enableBody = true;

		var ground = this.platforms.create(0, game.world.height - 64, 'ground');
		ground.scale.setTo(10, 2);
		ground.body.immovable = true;

		// Create the ledges, and make them immovable as well
		var ledge = this.platforms.create(0, 1350, 'ground');
		ledge.body.immovable = true;
		ledge = this.platforms.create(650, 1500, 'ground');
		ledge.body.immovable = true;
		ledge = this.platforms.create(100, 1800, 'ground');
		ledge.body.immovable = true;
		ledge = this.platforms.create(600, 1650, 'ground');
		ledge.body.immovable = true;

		// Creating Snowflakes
		// snowflakes = game.add.group();
		// snowflakes.enableBody = true;
		// for (var i = 0; i < 1000; i ++) {
		// 	var flake = new SnowStorm(game, 'space', 'Nathan');
		//
		// 	game.add.existing(flake);
		// }

		// Create the score
		this.score = 0;
		this.scoreText = game.add.text(16,16, 'Score: 0', { fontSize: '32px', fill: '#FFF'});

		// Create a couple timers for the score and the powerups
		this.scoreTimer = 1;

		// Add the collision audio
		this.pop = game.add.audio('pop');

		// timers
		this.jumpTimer = 0;
		this.jumpState = 0;

		this.mask = game.add.sprite(0, 720, 'mask');
		this.mask.anchor.setTo(0.5, 0.5);

	},

	update: function() {
		// Check if player is touching platform. Returns boolean
		var hitPlatform = game.physics.arcade.collide(this.player, this.platforms);
		game.physics.arcade.collide(this.player, this.mapLayer);

		if (cursors.left.isDown)
		{ // If left key down, move player left
			this.player.body.velocity.x = -300;
			// Enable mirroring
			if (this.player.scale.x > 0)
			{
				this.facing = -1;
				this.player.scale.x *= -1;
			}

			//this.player.animations.play('right', 10, true); // Play animation
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

			//this.player.animations.play('right', 10, true); // Play animation
		}
		else
		{ // Else stop the player and face them front
			this.player.body.velocity.x = 0;
			//this.player.animations.frame = 5;
			//this.sky.tilePosition.x -= 10;
		}

		// If up is down, move up
		if (cursors.up.isDown && this.player.body.blocked.down) // && hitPlatform)
		{
			// Start jump animation
			this.jumpState = 1;
			this.jumpTimer = 0;
			// Begin moving upwards immediately
			this.player.body.velocity.y = -1250;
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

		// Scroll the background
		//this.sky.tilePosition.y += 5;

		//update mask
		this.mask.position.x = this.player.position.x;
		this.mask.position.y = this.player.position.y;
	},
	render: function() {
		// Debug info
		// game.debug.bodyInfo(this.player, 32, 128);
		// game.debug.body(this.player);
		// game.debug.physicsGroup(this.enemies);
		// game.debug.physicsGroup(this.enemies.bullets);
		// game.debug.text('Ang. Velocity: ' + this.player.body.angularVelocity, 32, 232, 'yellow');
	}
}


// If player touches a enemy/bullet, brutally murder them with lots of blood
function killPlayer (player, enemy) {
	game.state.start('GameOver', true, false, this.score);
}
