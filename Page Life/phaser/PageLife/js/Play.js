// The Play state and its methods
var Play = function(game) {var score;};
Play.prototype = {

	//////////
	//CREATE//
	//////////

	create: function() {

		//scaleWindow located in scale.js
		scaleWindow();

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
		this.mapLayer.alpha = 0;

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


		this.sword = game.physics.p2.createBody(7194, 8840, 0); //, null, [-851, -781, 851, 781]);
		this.sword.addRectangle(2285, 10);
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

		this.handle = game.physics.p2.createBody(2862, 6018, 0);
		this.handle.addRectangle(1500, 10);
		this.handle.angle = -42.1844;
		this.handle.debug = false;
		game.physics.p2.addBody(this.handle);

		//x2400, y6432
		//x3424, y5504

		//x1024, y-928

		//midX2912 midY5968

		//length: 1382
		//rotation: -42.1844

		this.wing = game.physics.p2.createBody(5632, 7653, 0);
		this.wing.addRectangle(1176, 10);
		this.wing.angle = 45;
		this.wing.debug = false;
		game.physics.p2.addBody(this.wing);

		//x5216, y7232
		//x6048, y8064

		//x832	y832

		//midpoints
		//x5632, y7648

		//length: 1176
		//rotation: 45

		///////////
		// NESTS //
		///////////

		this.nests = game.add.group();
		this.nests.physicsBodyType = Phaser.Physics.P2JS;
		this.nests.enableBody = true;
		this.nests.create(2670, 14160, 'sprites', 'sNest'); //first nest
		this.nests.create(1700,13233, 'sprites', 'sNest');  //above the first steps
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

		this.saveX = 2670;
		this.saveY = 14159;

		this.saveX = game.world.width - 800;
		this.saveY = 400;

		////////////////////////
		//END OF GAME SEQUENCE//
		////////////////////////

		// Star for player to touch and win the game
		this.home = game.add.sprite(game.world.width - 650, 450, 'sprites', 'nest');
		this.home.anchor.setTo(0.5, 0.5);

		this.endStar = game.add.sprite(game.world.width - 650, 300, 'star');
		game.physics.p2.enable(this.endStar);
		this.endStar.body.data.shapes[0].sensor = true;
		this.endStar.body.static = true;
		this.endStar.body.onBeginContact.add(getHome, this);

		/////////
		// EGG //
		/////////

		// Egg of the player, bring to star to win
		this.egg = game.add.sprite(400, game.world.height - 250, 'sprites', 'egg'); // debug
		game.physics.p2.enable(this.egg, false);
		this.egg.body.setCircle(25);

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

		// Insert blue lines background
		game.add.tileSprite(0,0, game.world.width, game.world.height, 'background');

		//////////
		//PLAYER//
		//////////

		// Create the player
		//this.player = game.add.sprite(200, game.world.height - 400, 'birb');
		this.player = game.add.sprite(400, game.world.height - 700, 'birb'); //debug
		game.physics.p2.enable(this.player, false); // Enable physics
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
		this.playerJump = 700;

		// Insert end game fadeout
		this.endMask = game.add.sprite(game.camera.x, game.camera.y, 'cover');
		this.endMask.alpha = 0;

		// Grab the arrowkey inputs
		cursors = game.input.keyboard.createCursorKeys();
		this.jKey = game.input.keyboard.addKey(Phaser.KeyCode.J);
		this.numbers = game.input.keyboard.addKeys({'one': Phaser.KeyCode.ONE, 'two': Phaser.KeyCode.TWO,
			'thr': Phaser.KeyCode.THREE, 'fou': Phaser.KeyCode.FOUR,'fiv': Phaser.KeyCode.FIVE, 'six': Phaser.KeyCode.SIX,
			'sev': Phaser.KeyCode.SEVEN, 'eig': Phaser.KeyCode.EIGHT,'nin': Phaser.KeyCode.NINE, 'zer': Phaser.KeyCode.ZERO,});
			this.mKey = game.input.keyboard.addKey(Phaser.KeyCode.M);

		/////////
		//AUDIO//
		/////////

		// Add the audio
		this.jump = game.add.audio('jump');
		this.pickup = game.add.audio('pickup', 0.1);
		this.song = game.add.audio('backgroundSong');
		this.checkPointAudio = game.add.audio('checkpoint', 0.2);

		this.song.play('', 0, 0.10, true);

		// timers
		this.jumpTimer = 0;
		this.jumpState = 0;
		this.endTimer = 0;

		this.checkFunction = startCheck;
		this.updateFunc = normalUpdate;

		/////////////
		//PARTICLES//
		/////////////



	},

	//////////
	//UPDATE//
	//////////

	update: function() {

		scaleUPDATE();

		this.updateFunc.call(this);

	}
}

//////////////////
// END OF UPDATE//
//////////////////

/////////////
//FUNCTIONS//
/////////////



function normalUpdate() {
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

	if (this.jKey.justDown) {
		if (this.playerJump == 700) {
			this.playerJump = 2500;
		}
		else {
			this.playerJump = 700;
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

	if (this.mKey.justDown) {
		if (this.mapLayer.alpha == 0) {
			this.mapLayer.alpha = 1;;
		}
		else {
			this.mapLayer.alpha = 0;
		}
	}
}

function endUpdate() {
	this.endTimer += game.time.physicsElapsed;

	if (this.endTimer > 10) {
		game.state.start('GameOver');
	}
}

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
		play.player.body.setZeroVelocity();
		play.player.body.x = play.saveX;
		play.player.body.y = play.saveY - 50;
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
	if (this.saveX != nestShape.body.parent.x || this.saveY != nestShape.body.parent.y) {
		console.log("playing tune");
		this.saveX = nestShape.body.parent.x;
		this.saveY = nestShape.body.parent.y;
		this.checkPointAudio.play();
	}

	if (!this.eggDragged && eggData === this.egg.body.data) {
		disconnectEgg(this);
		this.eggHead = game.physics.p2.createLockConstraint(
			nestShape.body.parent, this.egg, [0, 0], 0, 100);

		this.egg.body.mass = 0.1;
	}
}

// When egg touches star, end the game
function getHome(eggBody, eggData, nestShape, eggShape) {
	if (eggBody === this.egg.body)
	{
		this.pickup.play();
		this.updateFunc = endUpdate;

		this.endMask.position = game.camera.position;

		game.add.tween(this.endMask).to({alpha: 1}, 7000, Phaser.Easing.Linear.None, true);

		game.input.onDown.removeAll();
		stopDrag.call(this);
		this.eggHead = game.physics.p2.createLockConstraint(
			nestShape.body.parent, this.egg, [0, 0], 0, 100);

		this.endStar.body.onBeginContact.removeAll();

		this.fadeMusic = game.add.tween(this.song).to({volume: 0}, 7000, Phaser.Easing.Linear.None, true);
    this.fadeMusic.onComplete.add(fadeComplete, this.song);
	}
}

function fadeComplete(song) {
	song.volume = 0;
	song.stop();
}

// set nests as savepoints
function setupNest(nest) {
	nest.body.static = true;
	nest.body.data.shapes[0].sensor = true;
	nest.body.onBeginContact.add(connectEggToNest, this);
	nest.body.onBeginContact.add(pNestBurst, this);
	//console.log("setup a nest");
}

function setSave(nest, egg) {
	if (egg === this.egg.body.data) {
		this.saveX = nest.x;
		this.saveY = nest.y;
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
