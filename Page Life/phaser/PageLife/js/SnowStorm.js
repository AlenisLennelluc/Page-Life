function SnowStorm(game, key, frame) {
	// Calling out Phaser.Sprite
	// New Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, game.rnd.integerInRange(0, game.world.width),
		game.rnd.integerInRange(0, game.world.height), key, frame);

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
	// Horiizontal screen wrapping
if (this.position.x > game.world.width + 16) {
		this.position.x = -16;
	}

	// Vertical screen wrapping
	if (this.position.y > game.world.height + 22) {
		this.position.y = -22;
	}
}
