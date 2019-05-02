function SnowStorm(game, key) {
	// Calling out Phaser.Sprite
	// New Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, game.rnd.integerInRange(0, game.width),
		game.rnd.integerInRange(0, game.height), key);

	// Set up movement of snowflakes
	this.anchor.set(0.5, 0.5);
	game.physics.enable(this);
	this.body.angularVelocity = Math.random() * Math.PI * 100;
	this.body.velocity.x = Math.random() * 100;
	this.body.velocity.y = Math.random() * 100;

	// Drop transparency to half
	this.alpha = 0.5;
}
// Defining prototype and constructor
SnowStorm.prototype = Object.create(Phaser.Sprite.prototype);
SnowStorm.prototype.constructor = SnowStorm;

// Writing separate update function
SnowStorm.prototype.update = function() {
	// Reversing if R pressed
	if (game.input.keyboard.isDown(Phaser.KeyCode.R))
	{
		this.body.velocity.x *= -1;
	}

	// Horiizontal screen wrapping
	if (this.body.velocity.x < 0 && this.position.x < -16) {
		this.position.x = game.width + 16;
	}
	else if (this.body.velocity.x > 0 && this.position.x > game.width + 16) {
		this.position.x = -16;
	}

	// Vertical screen wrapping
	if (this.position.y > game.height + 22) {
		this.position.y = -22;
	}
}