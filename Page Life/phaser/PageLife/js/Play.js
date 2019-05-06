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
		this.player = game.add.sprite(32, game.world.height - 150, 'ship');
		game.physics.arcade.enable(this.player); // Enable physics
		this.player.body.collideWorldBounds = true; // Make it so the player can't move off screen
		this.player.body.setSize(4, 7, 14, 23);
		this.player.anchor.set(0.5);
		game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 1, 1);

		// Set up player animations
		this.player.animations.add('base', [1, 2, 6], 10, true);
		var turn = this.player.animations.add('turn', [5, 0, 3, 4], 10, true);
		this.player.animations.add('turned', [0, 3, 4], 10, true);
		var righting = this.player.animations.add('righting', [5, 1, 2, 6], 10, true);
		this.player.animations.play('base');

		// Set up animation interactions
		turn.onComplete.add(function () {this.player.animations.play('turned', 10, true);}, this);
		righting.onComplete.add(function () {this.player.animations.play('base', 10, true);}, this);

		// Set up a group for the player's bullets
		this.playerBullets = game.add.group();
		this.playerBullets.enableBody = true;

		// Grab the arrowkey inputs
		cursors = game.input.keyboard.createCursorKeys();

		// Create the enemy unit generator
		this.enemies = new EnemyUnits(game, 'space', 'enemy', 'enemyBullet', this.player, this.playerBullets);

		// Creating Snowflakes
		snowflakes = game.add.group();
		snowflakes.enableBody = true;
		for (var i = 0; i < 1000; i ++) {
			var flake = new SnowStorm(game, 'space', 'Nathan');

			game.add.existing(flake);
		}

		// Set up the player firing speed
		this.bulletTimer = 0;
		this.bulletReload = 0.1;

		// Create the score
		this.score = 0;
		this.scoreText = game.add.text(16,16, 'Score: 0', { fontSize: '32px', fill: '#FFF'});

		// Create a couple timers for the score and the powerups
		this.scoreTimer = 1;
		this.powerupTimer = 30;
		this.powerups = game.add.group();

		// Add the collision audio
		this.pop = game.add.audio('pop');
	},
	update: function() {

		if (cursors.left.isDown)
		{ // If left key down, move player left
			this.player.body.velocity.x = -150;
			// mirroring
			if (this.player.scale.x > 0)
				this.player.scale.x *= -1;
			// If initially turning left, play the left turning animation
			if (this.player.animations.name == 'base')
				this.player.animations.play('turn', 10, false); // Play animation
		}
		else if (cursors.right.isDown)
		{ // If right key down, move playerr right
			this.player.body.velocity.x = 150;
			// mirroring
			if (this.player.scale.x < 0)
				this.player.scale.x *= -1;
			// if initially turning right, play the right turning animation
			if (this.player.animations.name == 'base')
				this.player.animations.play('turn', 10, false); // Play animation
		}
		else
		{ // Else stop the player and face them front
			this.player.body.velocity.x = 0;
			// mirroring
			if (this.player.scale.x < 0 && this.player.animations.name == 'base')
				this.player.scale.x *= -1;
			// If no longer turning, return to flat position
			if (this.player.animations.name == 'turned')
				this.player.animations.play('righting', 10, false);
		}

		// If up is down, move up
		if (cursors.up.isDown)
		{
			this.player.body.velocity.y = -150;
		}
		else if (cursors.down.isDown) // if down is down go down
		{
			this.player.body.velocity.y = 150;
		}
		else // else dont move
		{
			this.player.body.velocity.y = 0;
		}

		// If the player is holding spacebar fire the weapon every 10th of a second
		if (game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR) && this.bulletTimer < 0){
			var bullet = this.playerBullets.create(this.player.position.x - 7, this.player.position.y - 50, 'space', 'playerBullet');
			bullet.body.velocity.y = -250;
			bullet.autoCull = true;
			bullet.outOfCameraBoundsKill = true;

			this.bulletTimer += this.bulletReload;
		}

		// Cool down the player's weapon
		if (this.bulletTimer >= 0)
		{
			this.bulletTimer -= game.time.physicsElapsed;
		}

		// Physics overlap checking
		this.game.physics.arcade.overlap(this.player, this.enemies, killPlayer, null, this);
		this.game.physics.arcade.overlap(this.player, this.enemies.bullets, killPlayer, null, this);
		this.game.physics.arcade.overlap(this.playerBullets, this.enemies, killEnemy, null, this);
		this.game.physics.arcade.overlap(this.playerBullets, this.enemies.bullets, killBullet, null, this);
		this.game.physics.arcade.overlap(this.player, this.powerups, powerUp, null, this);

		// Increase the score by 1 every second
		this.scoreTimer -= game.time.physicsElapsed;
		if (this.scoreTimer < 0)
		{
			this.score += 1;
			this.scoreText.text = ("Score: " + this.score);
			this.scoreTimer += 1;
		}

		// Drop a powerup every 30 to 60 seconds
		this.powerupTimer -= game.time.physicsElapsed;
		if (this.powerupTimer < 0) {
			this.powerupTimer = Math.random() * 30 + 30;
			var powerup = this.powerups.create(Math.random() * game.width, -16, 'space', 'powerup');
			powerup.anchor.set(0.5);
			game.physics.arcade.enable(powerup);
			powerup.body.velocity.y = 50;
			powerup.body.angularVelocity = Math.PI * 25;
			powerup.autoCull = true;
			powerup.outOfCameraBoundsKill = true;
		}

		// Scroll the background
		this.sky.tilePosition.y += 5;
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


// If a bullet touches something, destroy them both
function killBullet (bullet, other) {
	this.pop.play();
	bullet.kill();
	other.kill();
}



// If player touches a enemy/bullet, brutally murder them with lots of blood
function killPlayer (player, enemy) {
	game.state.start('GameOver', true, false, this.score);
}


// If a bullet touches an enemy unit, score the kill and destroy both
function killEnemy(bullet, enemy){
	this.score = this.score + 10;
	this.scoreText.text = ("Score: " + this.score);
	this.pop.play();

	bullet.kill();
	enemy.kill();
}


// If the player picks up the powerup, permanently reduce reload by 10%
function powerUp(player, powerup) {
	powerup.kill();
	this.bulletReload *= .9;
}
