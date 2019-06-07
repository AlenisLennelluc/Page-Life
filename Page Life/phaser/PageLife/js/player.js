//player.js
function Player(game, key, x, y, egg, play) {

  Phaser.Sprite.call(this, game, x, y, key);
  //PLAYER PHYSICS
  game.physics.p2.enable(this, false); // Enable physics
  this.body.fixedRotation = true;
  this.body.clearShapes();
  this.body.addRectangle(45, 90, 0, -1);
  this.body.addCircle(45 / 2, 0, -45);
  this.body.data.shapes[1].sensor = true;
  this.body.onBeginContact.add(eggEnteredHead, this);
  this.body.onEndContact.add(eggLeftHead, this);
  //PLAYER ANIMATION
  this.animations.add('walk', [ 0, 1, 2, 3], 10, true);
  this.animations.add('jump', [4,5], 10, true);

  //PLAYER VARIABLES/REFERENCES
  // 1 = Right, -1 = left, used for mirroring player animation
  this.facing = 1;
  this.playerJump = 700;
  this.playerJumpTimer = 0;
  this.playerJumping = false;
  this.game = game;
  this.egg = egg;
  this.play = play;
  this.jumpTimer = 0;
  this.jumpState = 0;

  //HOTKEYS
  this.jKey = game.input.keyboard.addKey(Phaser.KeyCode.J);
  this.cursors = game.input.keyboard.createCursorKeys();
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;


Player.prototype.update = function() {
////////////
//MOVEMENT//
////////////

  if (this.cursors.left.isDown || this.game.input.keyboard.isDown(Phaser.KeyCode.A))
  { // If left key down, move player left
    this.body.moveLeft(300);
    // Enable mirroring
    if (this.scale.x > 0)
    {
      this.facing = -1;
      this.scale.x *= -1;
    }
  }
  else if (this.cursors.right.isDown || this.game.input.keyboard.isDown(Phaser.KeyCode.D))
  { // If right key down, move playerr right
    this.body.moveRight(300);
    // disable mirroring
    if (this.scale.x < 0)
    {
      this.facing = 1;
      this.scale.x *= -1;
    }
  }
  else
  { // Else stop the player
    this.body.velocity.x = 0;
  }

  /////////////
  //ANIMATION//
  /////////////

  if (checkIfCanJump(this)) {
    if (this.body.velocity.x == 0) {
      this.animations.stop();
      this.frame = 0;
    }
    else {
      this.animations.play('walk');
    }
  }
  else {
    this.animations.play('jump');
  }

  ///////////
  //JUMPING//
  ///////////

  if (this.jKey.justDown) {
    if (this.playerJump == 700) {
      this.playerJump = 2500;
    }
    else {
      this.playerJump = 700;
    }
  }

  // If up is down, move up
  if ((this.cursors.up.isDown || this.game.input.keyboard.isDown(Phaser.KeyCode.W) ||
    this.game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) && this.playerJumpTimer < 0 &&
    checkIfCanJump(this))
  {
    // Start jump animation
    this.jumpState = 1;
    this.jumpTimer = 0;
    // this.eggOnHead = false;
    // Begin moving upwards immediately
    this.body.moveUp(this.playerJump);
    this.playerJumpTimer = 0.5;
    this.playerJumping = true;
    //Jump audio
    this.jump = game.add.audio('jump');
    this.jump.play('', 0, 1, false);
  }

  // Shorten birb
  if (this.jumpState == 1) {
    // Increase timer by time elapsed * 8
    this.jumpTimer += this.game.time.physicsElapsed * 4;
    // this.jumpTimer = magnitude, this.facing = direction
    this.scale.y -= this.jumpTimer;
    if (this.jumpTimer > 0.2) {
      // Move to phase 3
      this.jumpState = 2;
      this.jumpTimer = 0;
    }
  }

  // Widen birb
  if (this.jumpState == 2) {
    // Increase timer by time elapsed * 2
    this.jumpTimer += this.game.time.physicsElapsed;
    // this.jumpTimer = magnitude, this.facing = direction
    this.scale.x += this.jumpTimer * this.facing;
    if (this.jumpTimer > 0.05) {
      // Move to phase 2
      this.jumpState = 3;
      this.jumpTimer = 0;
    }
  }

  // Normalize birb
  if (this.jumpState == 3) {
    // Increase timer by time elapsed * 8
    this.jumpTimer += this.game.time.physicsElapsed;
    // this.jumpTimer = magnitude, this.facing = direction
    this.scale.x -= this.jumpTimer * this.facing;
    // this.jumpTimer = magnitude, this.facing = direction
    this.scale.y += this.jumpTimer * 2;
    if (this.jumpTimer > 0.05) {
      // Normalize and end jump
      this.jumpState = 0;
      this.jumpTimer = 0;
      this.scale.y = 1;
      this.scale.x = this.facing;
      this.playerJumping = false;
    }
  }

  this.playerJumpTimer -= this.game.time.physicsElapsed;

}

// Egg Touching Head Sensor
function eggEnteredHead(eggBody, eggData, playerShape, eggShape) {
	if (eggBody === this.egg.body && playerShape.sensor)
	{
		this.eggOnHead = true;
		connectEggToHead.call(this);
	}
}

// Egg Left Head Sensor
function eggLeftHead(eggBody, eggData, playerShape, eggShape) {
	if (playerShape.sensor && eggData != null && this.egg.body != null && eggData === this.egg.body.data)
	{
		disconnectEgg.call(this.play, this.body.data);
		this.eggOnHead = false;
	}
}

// Bind Egg To Head
function connectEggToHead() {
	if (this.play.eggHead == null && !this.egg.dragged) {
		this.play.eggHead = this.game.physics.p2.createLockConstraint(
			this, this.egg, [0,0], 0, 10);
		//game.camera.deadzone = new Phaser.Rectangle(game.camera.width / 2, game.camera.height / 2, 0, 0);
		this.egg.body.mass = 0.1;
	}
}

// Unbind Egg From Head
function disconnectEgg(playerData) {
	if (this.eggHead != null && (playerData == null || playerData === this.eggHead.bodyA)) {
		game.physics.p2.removeConstraint(this.eggHead);
		this.eggHead = null;
		this.egg.body.mass = 1;
	}
}

// Check if player can jump
// http://phaser.io/examples/v2/p2-physics/tilemap-gravity
function checkIfCanJump(player) {

    var yAxis = p2.vec2.fromValues(0, 1);
    var result = false;

    for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++)
    {
        var c = game.physics.p2.world.narrowphase.contactEquations[i];

        if (c.bodyA === player.body.data || c.bodyB === player.body.data)
        {
            var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
            if (c.bodyA === player.body.data) d *= -1;
            if (d > 0.5) result = true;
        }
    }
    return result;
}

////////////////////
//END OF PLAYER.JS//
////////////////////
