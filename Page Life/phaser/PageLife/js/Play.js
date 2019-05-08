// The Play state and its methods
var Play = function(game) {var score;};
Play.prototype = {
	create: function() {
		game.world.setBounds(0,0,2000,2000);
		// Turn on the Physics engine
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// Add the background and make it properly cover the canvas
		this.sky = game.add.tileSprite(0,0, game.world.width, game.world.height, 'background');
		//sky.scale.setTo(1, 2);

		// Create the player
		this.player = game.add.sprite(32, game.world.height - 350, 'player');
		game.physics.arcade.enable(this.player); // Enable physics
		this.player.body.collideWorldBounds = true; // Make it so the player can't move off screen
		this.player.body.gravity.y = 300;
		this.player.body.bounce.y = 0.1;
		this.player.anchor.setTo(0.5,0.5); // Make mirroring clean
		game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 1, 1);

		// Set up player animations
		//this.player.animations.add('left', [0, 1, 2, 3], 10, true);
		this.player.animations.add('right', [5, 6, 7, 8], 10, true);

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
		ledge = this.platforms.create(100, 1850, 'ground');
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
	},
	update: function() {
		// Check if player is touching platform. Returns boolean
		var hitPlatform = game.physics.arcade.collide(this.player, this.platforms);

		if (cursors.left.isDown)
		{ // If left key down, move player left
			this.player.body.velocity.x = -150;
			// Enable mirroring
			this.player.scale.x = -1;

			this.player.animations.play('right', 10, true); // Play animation
		}
		else if (cursors.right.isDown)
		{ // If right key down, move playerr right
			this.player.body.velocity.x = 150;
			// disable mirroring
			this.player.scale.x = 1;

			this.player.animations.play('right', 10, true); // Play animation
		}
		else
		{ // Else stop the player and face them front
			this.player.body.velocity.x = 0;
			this.player.animations.frame = 5;
			//this.sky.tilePosition.x -= 10;
		}

		// If up is down, move up
		if (cursors.up.isDown && this.player.body.touching.down) // && hitPlatform)
		{
			this.player.body.velocity.y = -350;
		}

		// Scroll the background
		//this.sky.tilePosition.y += 5;
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
