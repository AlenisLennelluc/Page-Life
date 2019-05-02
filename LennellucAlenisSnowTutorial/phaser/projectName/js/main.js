//Github is cool.

var game = new Phaser.Game(600, 800, Phaser.AUTO);


// The MainMenu state and its methods
var MainMenu = function(game) {};
MainMenu.prototype = {
	preload: function() {
		console.log('MainMenu: Preload');

		// preload assets
		game.load.image('sky', 'assets/img/sky.png');
		game.load.image('ground', 'assets/img/platform.png');
		game.load.image('star', 'assets/img/star.png');
		game.load.spritesheet('dude', 'assets/img/dude.png', 32, 48);
		game.load.image('diamond', 'assets/img/diamond.png');
		game.load.spritesheet('doggo', 'assets/img/baddie.png', 32, 32);
		game.load.audio('pop', 'assets/audio/pop01.mp3');
		game.load.image('snow', 'assets/img/Nathan.png');
	},
	create: function() {
		// Add the background and make it properly cover the canvas
		var sky = game.add.sprite(0,0, 'sky');
		sky.scale.setTo(1, 2);

		// Add instruction text
		game.add.text(16,16, 'The Snowstorm\n' +
			'Use the arrow keys to move\nleft and right and jump\n' +
			'Collect all the stars to win\n' +
			'Press Space To Start', { fontSize: '32px', fill: '#000'});
	},
	update: function() {
		// Check for spacebar to move to Play
		if (game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR))
			game.state.start('Play');
	}
}


// The Play state and its methods
var Play = function(game) {var score;};
Play.prototype = {
	create: function() {
		// Turn on the Physics engine
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// Add the background and make it properly cover the canvas
		var sky = game.add.sprite(0,0, 'sky');
		sky.scale.setTo(1, 2);

		// Make a group for platforms and enable physics for them
		platforms = game.add.group();
		platforms.enableBody = true;

		// Create the ground, scale it for the canvas and make it immovable for the player to jump on
		var ground = platforms.create(0, game.world.height - 64, 'ground');
		ground.scale.setTo(2, 2);
		ground.body.immovable = true;

		// Create the ledges, and make them immovable as well
		var ledge = platforms.create(-200, 150, 'ground');
		ledge.body.immovable = true;
		ledge = platforms.create(450, 300, 'ground');
		ledge.body.immovable = true;
		ledge = platforms.create(-100, 450, 'ground');
		ledge.body.immovable = true;
		ledge = platforms.create(400, 650, 'ground');
		ledge.body.immovable = true;

		// Create the player
		player = game.add.sprite(32, game.world.height - 150, 'dude');
		game.physics.arcade.enable(player); // Enable physics
		player.body.bounce.y = 0.2;	// Add a bounce effect
		player.body.gravity.y = 300; // Add gravity
		player.body.collideWorldBounds = true; // Make it so the player can't move off screen

		// Set up the player walking animations
		player.animations.add('left', [0,1,2,3], 10, true);
		player.animations.add('right', [5,6,7,8], 10, true);

		// Grab the arrowkey inputs
		cursors = game.input.keyboard.createCursorKeys();

		// Create a group for the stars and enable physics for them
		stars = game.add.group();
		stars.enableBody = true;

		// Create 12 stars, and enable gravity and bounce on them
		for (var i = 0; i < 12; i ++)
		{
			var star = stars.create(i * 50, 0, 'star');

			star.body.gravity.y = 100;

			star.body.bounce.y = 0.7 + Math.random() * 0.2;
		}

		// Created a group to add the diamond too because I was getting bugs other ways
		diamonds = game.add.group();
		diamonds.enableBody = true; // Added physics for collisions
		diamonds.create(Math.random() * 568, Math.random() * 600 + 100, 'diamond'); // Place the diamond semi-randomly

		// Create a group for the cute doggos
		doggos = game.add.group();
		doggos.enableBody = true; //Enable physics for gravity + collisions

		// Create left doggo
		doggo = doggos.create(500, 250, 'doggo');
		doggo.animations.add('left', [0,1], 10, true); // Add left animation
		doggo.animations.play('left'); // Play left animation
		doggo.body.gravity.y = 300; // Set up gravity and bounce
		doggo.body.bounce.y = 0.3;

		// Create right doggo
		doggo = doggos.create(50, 400, 'doggo');
		doggo.animations.add('right', [2,3], 10, true); // Add right animation
		doggo.animations.play('right'); // Play right animation
		doggo.body.gravity.y = 300; // Set up gravity and bounce
		doggo.body.bounce.y = 0.3;

		// Creating Snowflakes
		snowflakes = game.add.group();
		snowflakes.enableBody = true;
		for (var i = 0; i < 100; i ++) {
			var flake = new SnowStorm(game, 'snow');

			game.add.existing(flake);
		}

		// Add the score text in the upper left corner
		scoreText = game.add.text(16,16, 'score: 0', { fontSize: '32px', fill: '#000'});
		this.score = 0;

		// Add audio
		pickupSound = game.add.audio('pop');
	},
	update: function() {
		// Check if player is touching platform. Returns boolean
		var hitPlatform = game.physics.arcade.collide(player, platforms);

		// Reset player speed
		player.body.velocity.x = 0;

		if (cursors.left.isDown)
		{ // If left key down, move player left
			player.body.velocity.x = -150;
			player.animations.play('left'); // Play animation
		}
		else if (cursors.right.isDown)
		{ // If right key down, move playerr right
			player.body.velocity.x = 150;
			player.animations.play('right'); // Play animation
		}
		else
		{ // Else stop the player and face them front
			player.animations.stop();
			player.frame = 4;
		}

		// If up is down, and player is touching a platform then jump the player
		if (cursors.up.isDown && player.body.touching.down && hitPlatform)
		{
			player.body.velocity.y = -350;
		}

		// Check for collisions between (stars and doggos) and platforms
		game.physics.arcade.collide(stars, platforms);
		game.physics.arcade.collide(doggos, platforms);

		// If the player is overlapping something, call the respective function
		game.physics.arcade.overlap(player, stars, collectStar, null, this);
		game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this);
		game.physics.arcade.overlap(player, doggos, collectDoggos, null, this);
	}
}


// The GameOver state and its methods
var GameOver = function(game) {};
GameOver.prototype = {
	init: function(score) {
		// Add the background and make it properly cover the canvas
		var sky = game.add.sprite(0,0, 'sky');
		sky.scale.setTo(1, 2);

		// Add GameOver text
		game.add.text(16,16, 'Game Over!\nFinal Score: ' + score + '\nPress Space To Restart', { fontSize: '32px', fill: '#000'});
	},
	update: function() {
		// Check for spacebar to go back to Play state
		if (game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR))
			game.state.start('Play');
	}
}


// Global Variables
var platforms;
var player;
var cursors;
var stars;
var diamonds;
var scoreText;
var doggos;
var pickupSound;
var snowflakes;

// Setup game states
game.state.add('MainMenu', MainMenu);
game.state.add('Play', Play);
game.state.add('GameOver', GameOver);
game.state.start('MainMenu');


// If player overlaps star, remove star and give player 10 more points
function collectStar (player, star) {
	star.kill();

	this.score += 10;
	scoreText.text = 'Score: ' + this.score;
	pickupSound.play();

	// If there are no living stars, end the game
	if (stars.countLiving() == 0)
	{
		game.state.start('GameOver', true, false, this.score);
	}
}


// If player overlaps diamond, remove diamond and give player 50 more points
function collectDiamond (player, diamond) {
	diamond.kill();

	this.score += 50;
	scoreText.text = 'Score: ' + this.score;
	pickupSound.play();
}


// If player kicks a doggo, call animal control to rescue doggo and eject player from game
function collectDoggos (player, doggo) {
	this.score -= 25;
	game.state.start('GameOver', true, false, this.score);
}
