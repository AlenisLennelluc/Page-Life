// The Play state and its methods
var Play = function(game) {var score;};
Play.prototype = {

	//////////
	//CREATE//
	//////////

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
			this.button = game.add.button(32, 32, 'star', scale, this);
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

		game.camera.x = 0;
		game.camera.y = game.world.height - game.camera.height;

		/////////////
		// PHYSICS //
		/////////////

		// Turn on the Physics engine
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.p2.gravity.y = 1200;
		game.physics.p2.restitution = 0.1;

		game.physics.p2.convertTilemap(this.map, this.mapLayer);
		game.physics.p2.setBoundsToWorld(true, true, true, true, false);


		this.sword = game.physics.p2.createBody(7194, 8834, 0); //, null, [-851, -781, 851, 781]);
		this.sword.addRectangle(2311, 10);
		this.sword.angle = 42.5455;
		this.sword.debug = false;
		game.physics.p2.addBody(this.sword);
		// game.physics.p2.enable(this.background, true);
		// this.background.body.static = true;
		// this.background.body.removeShape();
		// this.background.body.addLine(2311, 7194, 8834, -0.742559)

		// 6343 - 8046 = 1703
		// 8053 - 9616 = 1563
		//
		// length: 2311
		// midX: 7194
		// midY: 8834
		// rotation: -0.742559

		///////////
		// NESTS //
		///////////

		this.nests = game.add.group();
		this.nests.physicsBodyType = Phaser.Physics.P2JS;
		this.nests.enableBody = true;
		this.nests.create(2670, 14160, 'sprites', 'sNest'); //first nest
		this.nests.create(1700,13235, 'sprites', 'sNest');  //above the first steps
		this.nests.create(4760, 12755, 'sprites', 'sNest'); //above B block
		this.nests.create(3810, 9564, 'sprites', 'sNest');	//Start of preschool block section
		this.nests.create(8777, 9727, 'sprites', 'sNest');	//End of preschool block section
		this.nests.create(3600, 11100, 'sprites', 'sNest'); //Start of high school climb
		this.nests.create(4960, 4600, 'sprites', 'sNest');  //Start of the gallery
		this.nests.create(5330, 2840, 'sprites', 'sNest');  //In the gallery corner
		this.nests.create(3060, 7150, 'sprites', 'sNest');	//
		this.nests.create(3475, 5160, 'sprites', 'sNest');	//
		this.nests.create(7072, 2396, 'sprites', 'sNest');	//
		this.nests.create(5585, 5025, 'sprites', 'sNest');	//
		this.nests.create(7970, 2910, 'sprites', 'sNest');	//
		this.nests.create(5260, 2750, 'sprites', 'sNest');	//
		this.nests.create(980, 2470, 'sprites', 'sNest');		//
		this.nests.create(3810, 9564, 'sprites', 'sNest');	//
		this.nests.create(2230, 783, 'sprites', 'sNest');		//
		this.nests.create(4054, 1410, 'sprites', 'sNest');	//
		this.nests.create(6020, 670, 'sprites', 'sNest');		//

		emitter = game.add.emitter(0, 0, 100);

		emitter.makeParticles('feather');
		emitter.gravity = 200;

		this.nests.forEach(setupNest, this);

		//this.saveX = 2670;
		//this.saveY = 14160;

		//this.saveX = game.world.width - 800;
		//this.saveY = 400;

		// Egg of the player, bring to star to win
		this.egg = game.add.sprite(400, game.world.height - 250, 'sprites', 'egg'); // debug
		game.physics.p2.enable(this.egg);
		this.egg.body.setCircle(20);

		///////////////////
		// SPRING EFFECT //
		///////////////////

		this.mouse = game.add.sprite(200,game.world.height - 450, 'sprites', 'star');
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
			var tear = this.tears.create(8400, 5200 - i * 300, 'sprites', 'tear');
			tear.body.static = true;
			tear.body.clearShapes();
			tear.body.addRectangle(64, 64, 0, 29);
			tear.body.velocity.y = -100;
		}

		this.eggDragged = false;

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
		this.player = game.add.sprite(400, game.world.height - 700, 'birb'); //debug
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
		//PLAYER ANIMATION
		this.player.animations.add('walk', [ 0, 1, 2, 3], 10, true);
		this.player.animations.add('jump', [4,5], 10, true);
		// 1 = Right, -1 = left, used for mirroring player animation
		this.facing = 1;
		this.playerJump = 650;

		////////////////////////
		//END OF GAME SEQUENCE//
		////////////////////////

		// Star for player to touch and win the game
		this.home = game.add.sprite(game.world.width - 400, 400, 'sprites', 'nest');
		game.physics.p2.enable(this.home);
		this.home.body.data.shapes[0].sensor = true;
		this.home.body.static = true;
		this.home.body.onBeginContact.add(getHome, this);


		// Grab the arrowkey inputs
		cursors = game.input.keyboard.createCursorKeys();
		this.iKey = game.input.keyboard.addKey(Phaser.KeyCode.I);
		this.numbers = game.input.keyboard.addKeys({'one': Phaser.KeyCode.ONE, 'two': Phaser.KeyCode.TWO,
			'thr': Phaser.KeyCode.THREE, 'fou': Phaser.KeyCode.FOUR,'fiv': Phaser.KeyCode.FIVE, 'six': Phaser.KeyCode.SIX,
			'sev': Phaser.KeyCode.SEVEN, 'eig': Phaser.KeyCode.EIGHT,'nin': Phaser.KeyCode.NINE, 'zer': Phaser.KeyCode.ZERO,});

		/////////
		//AUDIO//
		/////////

		// Add the audio
		this.jump = game.add.audio('jump');
		this.pickup = game.add.audio('pickup');
		this.song = game.add.audio('backgroundSong');

		this.song.play('', 0, 0.10, true);

		// timers
		this.jumpTimer = 0;
		this.jumpState = 0;

		this.checkFunction = startCheck;

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

		if (this.iKey.justDown) {
			if (this.playerJump == 650) {
				this.playerJump = 2500;
			}
			else {
				this.playerJump = 650;
			}
		}

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
			this.player.body.moveUp(this.playerJump);
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

		if (!this.eggDragged) {
			cameraFollowing(this);
		}

		this.checkFunction(this);


		this.playerJumpTimer -= game.time.physicsElapsed;
		this.tears.forEach(resetTears, this);

		/////////
		//DEBUG//
		/////////

		if (this.numbers.one.justDown) {
			setSave.call(this, this.nests.children[0], this.egg.body.data);
			game.camera.x = this.saveX;
			game.camera.y = this.saveY;
		}
		else if (this.numbers.two.justDown) {
			setSave.call(this, this.nests.children[1], this.egg.body.data);
			game.camera.x = this.saveX;
			game.camera.y = this.saveY;
		}
		else if (this.numbers.thr.justDown) {
			setSave.call(this, this.nests.children[2], this.egg.body.data);
			game.camera.x = this.saveX;
			game.camera.y = this.saveY;
		}
		else if (this.numbers.fou.justDown) {
			setSave.call(this, this.nests.children[3], this.egg.body.data);
			game.camera.x = this.saveX;
			game.camera.y = this.saveY;
		}
		else if (this.numbers.fiv.justDown) {
			setSave.call(this, this.nests.children[4], this.egg.body.data);
			game.camera.x = this.saveX;
			game.camera.y = this.saveY;
		}
		else if (this.numbers.six.justDown) {
			setSave.call(this, this.nests.children[5], this.egg.body.data);
			game.camera.x = this.saveX;
			game.camera.y = this.saveY;
		}
		else if (this.numbers.sev.justDown) {
			setSave.call(this, this.nests.children[6], this.egg.body.data);
			game.camera.x = this.saveX;
			game.camera.y = this.saveY;
		}
		else if (this.numbers.eig.justDown) {
			setSave.call(this, this.nests.children[7], this.egg.body.data);
			game.camera.x = this.saveX;
			game.camera.y = this.saveY;
		}
		else if (this.numbers.nin.justDown) {
			setSave.call(this, this.nests.children[8], this.egg.body.data);
			game.camera.x = this.saveX;
			game.camera.y = this.saveY;
		}
		else if (this.numbers.zer.justDown) {
			setSave.call(this, this.nests.children[9], this.egg.body.data);
			game.camera.x = this.saveX;
			game.camera.y = this.saveY;
		}
	}
}

//////////////////
// END OF UPDATE//
//////////////////

/////////////
//FUNCTIONS//
/////////////



function startCheck(play) {
	play.checkFunction = checkForReset;
}

function checkForReset(play) {
	if (!play.egg.inCamera)
	{
		console.log('Player resetting');
		play.egg.body.x = play.saveX;
		play.egg.body.y = play.saveY;
		play.egg.body.setZeroVelocity();
		play.player.body.x = play.saveX;
		play.player.body.y = play.saveY - 50;
		play.player.body.velocity.x = 0;
		play.player.body.velocity.y = 0;
		play.egg.body.velocity.x = 0;
		play.egg.body.velocity.y = 0;
	}
}

function cameraFollowing(play) {
	var destX = (play.player.x - play.egg.x) / -2 + play.player.x - game.camera.width / 2;
	var destY = (play.player.y - play.egg.y) / -2 + play.player.y - game.camera.height / 2;

	var diffX = destX - game.camera.x;
	var diffY = destY - game.camera.y;

	if (Math.abs(diffX) > 2) {
		destX -= diffX * 0.9;
	}

	if (Math.abs(diffY) > 2) {
		destY -= diffY * 0.9;
	}

	game.camera.x = destX;
	game.camera.y = destY;
}

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
		//game.camera.follow(null);
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
		//game.camera.follow(this.player, 0, 0.1, 0.1);
		//game.camera.deadzone = new Phaser.Rectangle(0, 0, game.camera.width, game.camera.height);
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
	if (playerShape.sensor && eggData != null && this.egg.body != null && eggData === this.egg.body.data)
	{
		disconnectEgg(this, this.player.body.data);
		this.eggOnHead = false;
	}
}

function connectEggToHead(play) {
	if (play.eggHead == null && !play.eggDragged) {
		play.eggHead = game.physics.p2.createLockConstraint(
			play.player, play.egg, [0,0], 0, 10);
		//game.camera.deadzone = new Phaser.Rectangle(game.camera.width / 2, game.camera.height / 2, 0, 0);
		play.egg.body.mass = 0.1;
	}
}

function disconnectEgg(play, playerBody) {
	if (play.eggHead != null && (playerBody == null || playerBody === play.eggHead.bodyA)) {
		game.physics.p2.removeConstraint(play.eggHead);
		play.eggHead = null;
		//game.camera.deadzone = new Phaser.Rectangle(0, 0, game.camera.width, game.camera.height);
		play.egg.body.mass = 1;
	}
}

function connectEggToNest(eggBody, eggData, nestShape, eggShape) {
	this.saveX = nestShape.body.parent.x;
	this.saveY = nestShape.body.parent.y;

	if (!this.eggDragged && eggData === this.egg.body.data) {
		disconnectEgg(this);
		this.eggHead = game.physics.p2.createLockConstraint(
			nestShape.body.parent, this.egg, [0, 0], 0, 100);

		this.egg.body.mass = 0.1;
	}
}

// When player steps on star, end the game
function getHome(eggBody, eggData, nestShape, eggShape) {
	if (eggBody === this.egg.body)
	{
		this.pickup.play();
		game.state.start('GameOver');
	}
}

// set nests as savepoints
function setupNest(nest) {
	nest.body.static = true;
	nest.body.data.shapes[0].sensor = true;
	nest.body.onBeginContact.add(connectEggToNest, this);
	nest.body.onBeginContact.add(pNestBurst, this);
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
