// The Play state and its methods
var Play = function(game) {var score;};
Play.prototype = {

	create: function() {

		/////////////
		// SCALING //
		/////////////

		//Code taken from scaling lecture
		//set scale
		// show entire game display while maintaining aspect ratio
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

		//Full Screen
		// set scaling for fullscreen
		game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

		// add button if fullscreen is supported
		if(game.scale.compatibility.supportsFullScreen) {
			this.button = game.add.button(32, 32, 'star', buttonClick, this);
			this.button.fixedToCamera = true;
		}

		//SET WORLD COLOR
		game.stage.setBackgroundColor('#fff');
		game.add.sprite(0, 0, 'BGIMG');

		///////////
		//TILEMAP//
		///////////

		// create new Tilemap objects - when using Tiled, you only need to pass the key
		this.map = game.add.tilemap('level');

		// add an image to the maps to be used as a tileset (tileset, key)
    // the tileset name is specified w/in the .json file (or in Tiled)
    // a single map may use multiple tilesets
    this.map.addTilesetImage('collision', 'noCollusion');


    // set ALL tiles to collide *except* those passed in the array
    this.map.setCollisionByExclusion([]);

    // create new TilemapLayer object
    // A Tilemap Layer is a set of map data combined with a tileset
    this.mapLayer = this.map.createLayer('collision');
		this.map.layers[0].visible = false;

    // set the world size to match the size of the Tilemap layer
    this.mapLayer.resizeWorld();


		/////////////
		// PHYSICS //
		/////////////

		// Turn on the Physics engine
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.p2.gravity.y = 1200;
		game.physics.p2.restitution = 0.1;

		game.physics.p2.convertTilemap(this.map, this.mapLayer);
		game.physics.p2.setBoundsToWorld(true, true, true, true, false);

		// Egg of the player, bring to star to win
		this.egg = game.add.sprite(200, game.world.height - 400, 'egg'); // debug
		game.physics.p2.enable(this.egg);
		this.egg.body.setCircle(20);

		///////////////////
		// SPRING EFFECT //
		///////////////////

		this.mouse = game.add.sprite(200,game.world.height - 450, 'star');
		game.physics.p2.enable(this.mouse);
		this.mouse.body.static = true;
		this.mouse.body.setCircle(10);
		this.mouse.body.data.shapes[0].sensor = true;
		this.mouse.alpha = 0;

		this.spring = new Phaser.Line(this.egg.x, this.egg.y, this.mouse.x, this.mouse.y);

		game.input.onDown.add(startDrag, this);
		game.input.onUp.add(stopDrag, this);
		game.input.addMoveCallback(move, this);

		///////////
		// TEARS //
		///////////

		this.tears = game.add.group();
		this.tears.physicsBodyType = Phaser.Physics.P2JS;
		this.tears.enableBody = true;
		for (var i = 0; i < 100; i ++) {
			var tear = this.tears.create(8400, 5200 - i * 300, 'tear');
			tear.body.static = true;
			tear.body.clearShapes();
			tear.body.addRectangle(64, 64, 0, 29);
			tear.body.velocity.y = -100;
		}

		this.eggDragged = false;

		///////////
		// NESTS //
		///////////

		this.nests = game.add.group();
		this.nests.physicsBodyType = Phaser.Physics.P2JS;
		this.nests.enableBody = true;
		this.nests.create(400, game.world.height - 200, 'sNest');
		this.nests.create(2400, game.world.height - 200, 'sNest');
		this.nests.create(3776, 9436, 'sNest');
		this.nests.create(4960, 4572, 'sNest');
		this.nests.create(7072, 2396, 'sNest');
		this.nests.create(1440, 988, 'sNest');
		this.nests.create(4000, 1436, 'sNest');

		this.nests.forEach(setupNest, this);

		this.saveX = 400;
		this.saveY = game.world.height - 400;

		//this.saveX = 8562;
		//this.saveY = 5044;

		///////////
		// MASKS //
		///////////

		// Create mask to fade out far away parts of the level
		this.mask = game.add.sprite(0, 720, 'mask');
		this.mask.anchor.setTo(0.5, 0.5);

		// Insert background
		game.add.tileSprite(0,0, game.world.width, game.world.height, 'background');

		//////////
		//PLAYER//
		//////////

		// Create the player
		//this.player = game.add.sprite(200, game.world.height - 400, 'birb');
		this.player = game.add.sprite(200, game.world.sprite - 400, 'birb'); //debug
		game.physics.p2.enable(this.player); // Enable physics
		this.player.body.fixedRotation = true;
		this.player.body.clearShapes();
		//PLAYER PHYSISCS
		this.player.body.addRectangle(45, 90, 0, -1);
		this.player.body.addCircle(45 / 2, 0, -45);
		this.player.body.data.shapes[1].sensor = true;
		this.player.body.onBeginContact.add(eggEnteredHead, this);
		this.player.body.onEndContact.add(eggLeftHead, this);
		//PLAYER JUMP
		this.playerJumpTimer = 0;
		this.playerJumping = false;
		game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, .1, .1);
		//PLAYER ANIMATION
		this.player.animations.add('walk', [ 0, 1, 2, 3], 10, true);
		this.player.animations.add('jump', [4,5], 10, true);
		// 1 = Right, -1 = left, used for mirroring player animation
		this.facing = 1;

		////////////////////////
		//END OF GAME SEQUENCE//
		////////////////////////

		// Star for player to touch and win the game
		this.star = game.add.sprite(game.world.width - 400, 400, 'star');
		game.physics.p2.enable(this.star);
		this.star.body.data.shapes[0].sensor = true;
		this.star.body.static = true;
		this.star.body.onBeginContact.add(getStar, this);


		// Grab the arrowkey inputs
		cursors = game.input.keyboard.createCursorKeys();

		/////////
		//AUDIO//
		/////////

		// Add the audio
		this.jump = game.add.audio('jump');
		this.pickup = game.add.audio('pickup');
		this.song = game.add.audio('backgroundSong');

		this.song.play('', 0, 0.10, true);

		//Camera Position
		game.camera.position = this.player.position;


		// timers
		this.jumpTimer = 0;
		this.jumpState = 0;
	},

	//////////
	//UPDATE//
	//////////

	update: function() {

		////////////
		//MOVEMENT//
		////////////

		if (cursors.left.isDown || game.input.keyboard.isDown(Phaser.KeyCode.A))
		{ // If left key down, move player left
			this.player.body.moveLeft(300);
			if (!this.playerJumping && checkIfCanJump(this.player))
			{
				this.player.animations.play('walk');
			}
			// Enable mirroring
			if (this.player.scale.x > 0)
			{
				this.facing = -1;
				this.player.scale.x *= -1;
			}
		}
		else if (cursors.right.isDown || game.input.keyboard.isDown(Phaser.KeyCode.D))
		{ // If right key down, move playerr right
			this.player.body.moveRight(300);
			if (!this.playerJumping && checkIfCanJump(this.player))
			{
				this.player.animations.play('walk');
			}
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
			if (!this.playerJumping && checkIfCanJump(this.player))
			{
				this.player.animations.stop();
				this.player.frame = 0;
			}
		}

		///////////
		//JUMPING//
		///////////

		// If up is down, move up
		if ((cursors.up.isDown || game.input.keyboard.isDown(Phaser.KeyCode.W) ||
			game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) && this.playerJumpTimer < 0 &&
			checkIfCanJump(this.player))
		{
			// Start jump animation
			this.jumpState = 1;
			this.jumpTimer = 0;
			// this.eggOnHead = false;
			// Begin moving upwards immediately
			this.player.body.moveUp(650);
			this.player.animations.play('jump');
			this.playerJumpTimer = 0.5;
			this.playerJumping = true;
			//this.jump.play();
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
				this.playerJumping = false;
			}
		}

		//update mask
		this.mask.position = this.player.position;

		/////////////
		//BIRD MATH//
		/////////////

		// Calculate distance from birb to egg
		var birbEggDistX = (this.egg.position.x - this.player.position.x);
		var birbEggDistY = (this.egg.position.y - this.player.position.y);

		//console.log('Dist x: ' + birbEggDistX + ' y: ' + birbEggDistY);

		var birbEggDist = Math.sqrt(Math.pow(birbEggDistX, 2) + Math.pow(birbEggDistY, 2));

		//console.log('Total Dist: ' + birbEggDist + ' Being Dragged: ' + this.eggDragged);

		if (!this.eggDragged && (birbEggDist > 1000 || !this.egg.inCamera))
		{
			// console.log(this.saveX + " " + this.saveY);
			this.egg.body.x = this.saveX;
			this.egg.body.y = this.saveY - 45;
			this.egg.body.setZeroVelocity();
			this.player.body.x = this.saveX;
			this.player.body.y = this.saveY;
		}
		this.playerJumpTimer -= game.time.physicsElapsed;
		this.tears.forEach(resetTears, this);
	}
}

//////////////////
// END OF UPDATE//
//////////////////

/////////////
//FUNCTIONS//
/////////////

// Reset tears
function resetTears(tear) {
	if (tear.position.y < 2950) {
		tear.body.y = 5200;
	}
}

// While dragging box, turn off physics
function startDrag(pointer) {
	var position = Phaser.Point.add(pointer.position, game.camera.position);
	var eggPosition = this.egg.position;
	var bodies = game.physics.p2.hitTest(position, [this.egg.body]);

	if (bodies.length)
	{
		this.mouseSpring = game.physics.p2.createLockConstraint(
		this.mouse, bodies[0],[0,0],0, 1000);
		this.eggDragged = true;
		game.camera.follow(null);
		if (this.eggHead) {
			disconnectEgg(this);
		}
	}
}

// Once player lets go of box, re-engage physics
function stopDrag() {
	if (this.eggDragged)
	{
		game.physics.p2.removeConstraint(this.mouseSpring);
		this.eggDragged = false;
		game.camera.follow(this.player, 0, 0.1, 0.1);
		game.camera.deadzone = new Phaser.Rectangle(0, 0, game.camera.width, game.camera.height);
		if (this.eggOnHead) {
			connectEggToHead(this);
		}
	}
}

// Keep egg on head
function eggEnteredHead(eggBody, eggData, playerShape, eggShape) {
	if (eggBody === this.egg.body && playerShape.sensor)
	{
		this.eggOnHead = true;
		connectEggToHead(this);
	}
}

// if egg falls off head
function eggLeftHead(eggBody, eggData, playerShape, eggShape) {
	if (playerShape.sensor && eggData != null && this.egg.body.data != null && eggData === this.egg.body.data)
	{
		disconnectEgg(this, this.player.body);
		this.eggOnHead = false;
	}
}

function connectEggToHead(play) {
	if (play.eggHead == null && !play.eggDragged) {
		play.eggHead = game.physics.p2.createLockConstraint(
			play.player, play.egg, [0,0], 0, 10);
		game.camera.deadzone = new Phaser.Rectangle(game.camera.width / 2, game.camera.height / 2, 0, 0);
		play.egg.body.mass = 0.1;
	}
}

function disconnectEgg(play, playerBody) {
	if ((playerBody == null || playerBody === play.eggHead.bodyA) && play.eggHead != null) {
		game.physics.p2.removeConstraint(play.eggHead);
		play.eggHead = null;
		game.camera.deadzone = new Phaser.Rectangle(0, 0, game.camera.width, game.camera.height);
		play.egg.body.mass = 1;
	}
}

function connectEggToNest(eggBody, eggData, nestShape, eggShape) {
	if (eggData === this.egg.body.data) {
		//console.log("touched a save");
		this.saveX = nestShape.body.parent.x;
		this.saveY = nestShape.body.parent.y;
		//console.log("set save to: " + this.saveX + ", " + this.saveY);
		if (!this.eggDragged) {
			disconnectEgg(this);
			this.eggHead = game.physics.p2.createLockConstraint(
				nestShape.body.parent, this.egg, [0, 0], 0, 100);
			game.camera.deadzone = new Phaser.Rectangle(0, 0, game.camera.width, game.camera.height);
			this.egg.body.mass = 0.1;
		}
	}
}

// When player steps on star, end the game
function getStar(star, egg, starShape, eggShape) {
	this.pickup.play();
	game.state.start('GameOver');
}

// set nests as savepoints
function setupNest(nest) {
	nest.body.static = true;
	nest.body.data.shapes[0].sensor = true;
	nest.body.onBeginContact.add(connectEggToNest, this);
	//console.log("setup a nest");
}

// When player touches a nest, log the save Point
function setSave(nest, egg) {
	if (egg === this.egg.body.data) {
		//console.log("touched a save");
		this.saveX = nest.x;
		this.saveY = nest.y;
		//console.log("set save to: " + this.saveX + ", " + this.saveY);
	}
}

// Mouse movement
function move(pointer, x, y, isDown) {
	this.mouse.body.x = x + game.camera.x;
	this.mouse.body.y = y + game.camera.y;
}


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

///////////////////
// END OF PLAY.js//
///////////////////
