EnemyUnits = function(game, atlas, doggo, bullet) {
	// overloading Phaser.Group
	Phaser.Group.call(this, game);

	// Grab copies of necessary parameters and set up timers and groups
	this.waveTimer = 15;
	this.bulletTimer = 0;
	this.summonTimer = 5;
	this.bullet = bullet;
	this.doggo = doggo;
	this.game = game;
	this.bullets = game.add.group();
	this.moveTimer = 0;
	this.movementLeft = true;
	this.startPos = game.width - 200;
	this.totalTimer = 0;
	this.difficulty = 0;
	this.atlas = atlas;

	// Testing enemy to evaluate bullets and hitboxes
	// var unit = this.create(game.width / 2, game.height / 2, this.doggo);
	// this.game.physics.arcade.enable(unit);
}

// Defining prototype and constructor
EnemyUnits.prototype = Object.create(Phaser.Group.prototype);
EnemyUnits.prototype.constructor = EnemyUnits;

// EnemyUnits update function
EnemyUnits.prototype.update = function() {
	// if it is time to summon an enemy
	if (this.summonTimer < 0) {
		var unit = this.create(this.startPos, -25, this.atlas, this.doggo);

		this.game.physics.arcade.enable(unit);
		unit.body.velocity.y = 50 + this.difficulty * 35;
		unit.autoCull = true;
		unit.outOfCameraBoundsKill = true;
		unit.body.angularVelocity = Math.PI * 25;
		unit.anchor.set(0.5);
		// Reset the summon timer
		this.summonTimer = 1 - this.difficulty / 10;
	}

	// if it is time to summon a new wave
	if (this.waveTimer < 0) {
		this.waveTimer = 15 - this.difficulty;
		this.summonTimer = 5 - this.difficulty;
		this.startPos = Math.random() * (game.width - 100 - this.difficulty * 20) + 50 + this.difficulty * 10;
	}

	// If it is time for enemies to fire bullets
	if (this.bulletTimer < 0) {
		this.forEachAlive(bulletSpread, this, this.bullet, this.game, this.bullets, this.atlas);
		this.bulletTimer = 2 - this.difficulty / 3;
	}

	// Moderate the enemie's left/right movement
	this.forEachAlive(setVelocity, this, this.moveTimer * 300 * (this.difficulty / 3 + 1));

	// Maintain the timers
	this.summonTimer -= game.time.physicsElapsed;
	this.waveTimer -= game.time.physicsElapsed;
	this.bulletTimer -= game.time.physicsElapsed;
	// Total timer is special, it maxes at ~10 minutes
	if (this.difficulty < 4.5) {
		this.totalTimer += game.time.physicsElapsed;
		this.difficulty = Math.log(this.totalTimer + 4) - 1.4;
	}

	// quick and dirty simulation of a sin function
	if (this.movementLeft) {
		this.moveTimer -= game.time.physicsElapsed;
	}
	else {
		this.moveTimer += game.time.physicsElapsed;
	}
	// Manage whether the enemies are going left or right
	if (this.moveTimer > .5 - this.difficulty / 100) {
		this.movementLeft = true;
	}
	else if (this.moveTimer < -.5 + this.difficulty / 100) {
		this.movementLeft = false;
	}
}



function setVelocity(unit, speed) {
	unit.body.velocity.x = speed;
}


// generated 8 bullets
// Each bullet has a specially positioned hitbox
function bulletSpread(unit, image, game, group, atlas) {
	// Bottom bullet
	var bullet = fireBullet(unit, image, game, group, atlas);
	bullet.body.velocity.y = 100;
	bullet.body.setSize(14, 14, 1, 18);
	// Lower right bullet
	bullet = fireBullet(unit, image, game, group, atlas);
	bullet.body.velocity.y = 70;
	bullet.body.velocity.x = 70;
	bullet.rotation = -45;
	bullet.body.setSize(13, 13, 18, -1);
	// Lower left bullet
	bullet = fireBullet(unit, image, game, group, atlas);
	bullet.body.velocity.y = 70;
	bullet.body.velocity.x = -70;
	bullet.rotation = 45;
	bullet.body.setSize(13, 13, -23, 13);
	// Top bullet
	var bullet = fireBullet(unit, image, game, group, atlas);
	bullet.body.velocity.y = -100;
	bullet.rotation = 135;
	bullet.body.setSize(13, 13, -17, -31);
	// Upper right bullet
	bullet = fireBullet(unit, image, game, group, atlas);
	bullet.body.velocity.y = -70;
	bullet.body.velocity.x = 70;
	bullet.rotation = 180;
	bullet.body.setSize(13, 13, 8, -27);
	// Upper left bullet
	bullet = fireBullet(unit, image, game, group, atlas);
	bullet.body.velocity.y = -70;
	bullet.body.velocity.x = -70;
	bullet.rotation = -180;
	bullet.body.setSize(13, 13, -29, -14);
	// Left bullet
	bullet = fireBullet(unit, image, game, group, atlas);
	bullet.body.velocity.x = -100;
	bullet.rotation = -135 / 2;
	bullet.body.setSize(13, 13, -30, 1);
	// Right bullet
	bullet = fireBullet(unit, image, game, group, atlas);
	bullet.body.velocity.x = 100;
	bullet.rotation = 135 / 2;
	bullet.body.setSize(13, 13, 17, -16);
}



// Create a bullet to be fired
function fireBullet(unit, image, game, group, atlas) {
	var bullet = game.add.sprite(unit.position.x + 25, unit.position.y + 20, atlas, image);
	// set up the bullet
	game.physics.arcade.enable(bullet);
	group.add(bullet);
	bullet.autoCull = true;
	bullet.outOfCameraBoundsKill = true;
	// Return the bullet to bulletSpread
	return bullet;
}
