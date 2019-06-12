// The Play state and its methods
var Play = function(game) {var score;};
Play.prototype = {

	//////////
	//CREATE//
	//////////

	create: function() {

		//scaleWindow located in scale.js
		scaleWindow.call(this);

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
		//this.sword.debug = true;
		game.physics.p2.addBody(this.sword);

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
		//this.handle.debug = true;
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
		//this.wing.debug = true;
		game.physics.p2.addBody(this.wing);

		//x5216, y7232
		//x6048, y8064

		//x832	y832

		//midpoints
		//x5632, y7648

		//length: 1176
		//rotation: 45

		this.hilt = game.physics.p2.createBody(6534, 7739, 0);
		this.hilt.addRectangle(200, 10);
		this.hilt.angle = 32;
		//this.hilt.debug = true;
		game.physics.p2.addBody(this.hilt);

		// 6615 - 6454 = 161 = 80 = 6534
		// 7786 - 7668 = 118 = 59 = 7727

		// length: 200
		// rotation: 53.76

		this.tearHS = game.physics.p2.createBody(5380, 11340, 0);
		this.tearHS.addRectangle(300, 300);
		this.tearHS.data.shapes[0].sensor = true;
		game.physics.p2.addBody(this.tearHS);
		this.tearHS.onBeginContact.add(hsAudioCheck, this);
		this.tearHS.onBeginContact.add(noParticles, this);


		this.tearAudio = game.physics.p2.createBody(8400, 4000, 0);
		this.tearAudio.addRectangle(300, 300);
		this.tearAudio.data.shapes[0].sensor = true;
		game.physics.p2.addBody(this.tearAudio);
		this.tearAudio.onBeginContact.add(tearAudioCheck, this);


		  ///////////
		  // NESTS //
		  ///////////

		  this.nests = game.add.group();
		  this.nests.physicsBodyType = Phaser.Physics.P2JS;
		  this.nests.enableBody = true;
		  this.nests.create(2670, 14161, 'sprites', 'sNest'); // first nest
		  this.nests.create(1700,13232, 'sprites', 'sNest');  // above the first steps
		  this.nests.create(4760, 12754, 'sprites', 'sNest'); // above B block
		  this.nests.create(3810, 9551, 'sprites', 'sNest');	// Start of preschool block section
		  this.nests.create(8747, 9714, 'sprites', 'sNest');	// End of preschool block section
		  this.nests.create(3630, 11087, 'sprites', 'sNest'); // Start of high school climb
		  this.nests.create(5010, 4680, 'sprites', 'sNest');  // Start of the gallery
		  this.nests.create(5580, 2745, 'sprites', 'sNest');  // In the gallery corner
			this.nests.create(4485, 6223, 'sprites', 'sNest');	// At peak of bird feather trail
		  this.nests.create(3060, 7121, 'sprites', 'sNest');	// On bird leg
		  this.nests.create(5585, 5011, 'sprites', 'sNest');	//
		  this.nests.create(7970, 2890, 'sprites', 'sNest');	//
		  this.nests.create(980, 2460, 'sprites', 'sNest');		//
		  this.nests.create(2210, 773, 'sprites', 'sNest');		//
		  this.nests.create(4054, 1570, 'sprites', 'sNest');	//
		  this.nests.create(5930, 615, 'sprites', 'sNest');		//

		emitter = game.add.emitter(0, 0, 100);

		emitter.makeParticles('feather');
		emitter.gravity = 200;

		this.nests.forEach(setupNest, this);

		// this.saveX = 5930;
		// this.saveY = 615;

		this.saveX = 2670;
		this.saveY = 14159;

		// this.cacheX = null;
		// this.cacheY = null;

		var startX = 400;
		var startY = game.world.height - 250;

		// if (checkCache(this.cacheX, this.cacheY)) {
		// 	this.saveX = this.cacheX;
		// 	this.saveY = this.cacheY;
		//
		// 	startX = this.cacheX;
		// 	startY = this.cacheY;
		// }



		// this.saveX = game.world.width - 1000;
		// this.saveY = 400;

		////////////////////////
		//END OF GAME SEQUENCE//
		////////////////////////

		// Star for player to touch and win the game
		this.home = game.add.sprite(game.world.width - 650, 450, 'sprites', 'nest');
		game.physics.p2.enable(this.home, false);
		this.home.body.setRectangle(400, 160, -15, 15)
		this.home.body.static = true;

		this.endStar = game.add.sprite(game.world.width - 650, 300, 'star');
		game.physics.p2.enable(this.endStar);
		this.endStar.body.data.shapes[0].sensor = true;
		this.endStar.body.static = true;
		this.endStar.body.onBeginContact.add(getHome, this);
		this.endStar.body.angularVelocity = 5;

		/////////
		// EGG //
		/////////

		// Egg of the player, bring to star to win
		this.egg = game.add.sprite(startX, startY, 'sprites', 'egg'); // debug
		game.physics.p2.enable(this.egg, false);
		this.egg.body.setCircle(25);

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
		for (var i = 0; i < 10; i ++) {
			var tear = this.tears.create(8400, 5200 - i * 300, 'tear');
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
		this.player = new Player(game, 'birb', startX, startY - 300, this.egg, this);
		game.add.existing(this.player);

		// Insert end game fadeout
		this.endMask = game.add.sprite(game.camera.x, game.camera.y, 'cover');
		this.endMask.alpha = 0;

		this.numbers = game.input.keyboard.addKeys({'one': Phaser.KeyCode.ONE, 'two': Phaser.KeyCode.TWO,
			'thr': Phaser.KeyCode.THREE, 'fou': Phaser.KeyCode.FOUR,'fiv': Phaser.KeyCode.FIVE, 'six': Phaser.KeyCode.SIX,
			'sev': Phaser.KeyCode.SEVEN, 'eig': Phaser.KeyCode.EIGHT,'nin': Phaser.KeyCode.NINE, 'zer': Phaser.KeyCode.ZERO,});
			this.mKey = game.input.keyboard.addKey(Phaser.KeyCode.M);

		/////////
		//AUDIO//
		/////////

		// Add the audio
		this.pickup = game.add.audio('pickup', 0.1);
		this.song = game.add.audio('backgroundSong');
		this.checkPointAudio = game.add.audio('checkpoint', 0.2);
		this.amb1Birbs = game.add.audio('amb1Birbs', 0.2);
		this.galleryAmbient = game.add.audio('galleryAudio', 0.2);
		this.hsAmbient = game.add.audio('hsAmbient', 0.2);

		this.song.play('', 0, 0.10, true);
		this.amb1Birbs.play('', 0, 0.10, false)

		// timers
		this.endTimer = 0;

		this.checkFunction = startCheck;
		this.updateFunc = normalUpdate;

		ckptCREATE.call(this);

		/////////////
		//PARTICLES//
		/////////////

		featherClick.call(this);
		leafParticles.call(this);
		seagullParticles.call(this);
		//waterfallParticles();
		starParticleEND.call(this);

	},

	//////////
	//UPDATE//
	//////////

	update: function() {
		particleUpdate.call(this);
		this.updateFunc.call(this);
		//console.log(Phaser.Input.worldX + ' / ' + Phaser.Input.worldY);
	}
}

//////////////////
// END OF UPDATE//
//////////////////

/////////////
//FUNCTIONS//
/////////////



function normalUpdate() {
	//update mask
	this.mask.x = game.camera.centerX;
	this.mask.y = game.camera.centerY;

	/////////////
	//BIRD MATH//
	/////////////

	if (!this.eggDragged) {
		cameraFollowing(this);
	}

	this.checkFunction(this);

	this.tears.forEach(resetTears, this);

	/////////
	//DEBUG//
	/////////

	// if (this.numbers.one.justDown) {
	// 	setSave.call(this, this.nests.children[0], this.egg.body.data);
	// }
	// else if (this.numbers.two.justDown) {
	// 	setSave.call(this, this.nests.children[1], this.egg.body.data);
	// }
	// else if (this.numbers.thr.justDown) {
	// 	setSave.call(this, this.nests.children[2], this.egg.body.data);
	// }
	// else if (this.numbers.fou.justDown) {
	// 	setSave.call(this, this.nests.children[3], this.egg.body.data);
	// }
	// else if (this.numbers.fiv.justDown) {
	// 	setSave.call(this, this.nests.children[4], this.egg.body.data);
	// }
	// else if (this.numbers.six.justDown) {
	// 	setSave.call(this, this.nests.children[5], this.egg.body.data);
	// }
	// else if (this.numbers.sev.justDown) {
	// 	setSave.call(this, this.nests.children[6], this.egg.body.data);
	// }
	// else if (this.numbers.eig.justDown) {
	// 	setSave.call(this, this.nests.children[7], this.egg.body.data);
	// }
	// else if (this.numbers.nin.justDown) {
	// 	setSave.call(this, this.nests.children[8], this.egg.body.data);
	// }
	// else if (this.numbers.zer.justDown) {
	// 	setSave.call(this, this.nests.children[9], this.egg.body.data);
	// }

	// if (this.mKey.justDown) {
	// 	if (this.mapLayer.alpha == 0) {
	// 		this.mapLayer.alpha = 0.5;
	// 	}
	// 	else {
	// 		this.mapLayer.alpha = 0;
	// 	}
	// }
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
			disconnectEgg.call(this);
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
			connectEggToHead.call(this.player);
		}
	}
}

// Something touched a checkpoint nest
function connectEggToNest(eggBody, eggData, nestShape, eggShape) {
	if (this.saveX != nestShape.body.parent.x || this.saveY != nestShape.body.parent.y) {
		console.log("playing tune");
		this.saveX = nestShape.body.parent.x;
		this.saveY = nestShape.body.parent.y;
		this.checkPointAudio.play('', 0, 0.10, false);

		ckptActivate.call(this);
	}

	if (!this.eggDragged && eggData === this.egg.body.data) {
		disconnectEgg.call(this);
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
		this.player.canMove = false;

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
		// localStorage.setItem('pointX', this.saveX.toString());
		// localStorage.setItem('pointY', this.saveY.toString());
	}
}

// Mouse movement
function move(pointer, x, y, isDown) {
	this.mouse.body.x = x + game.camera.x;
	this.mouse.body.y = y + game.camera.y;
}


function tearAudioCheck(otherBody, otherData, thisShape, otherShape) {
	if (otherBody === this.player.body) {
		this.galleryAmbient.play();
		thisShape.enabled = false;
	}
}

function hsAudioCheck(otherBody, otherData, thisShape, otherShape) {
	if (otherBody === this.player.body) {
		this.hsAmbient.play();
		this.hsAmbient.volume = 0;
		this.fadeMusic = game.add.tween(this.hsAmbient).to({volume: 1}, 5000, Phaser.Easing.Linear.None, true);

		thisShape.enabled = false;
	}
}

// function checkCache(cacheX, cacheY) {
// 	// check for save points in local storage
//         if(localStorage.getItem('pointX') != null && localStorage.getItem('pointY') != null) {
//             cacheX = parseInt(localStorage.getItem('pointX'));
//             console.log('storedX: ' + cacheX);
// 						cacheY = parseInt(localStorage.getItem('pointY'));
// 						console.log('storedY: ' + cacheY);
//
// 						return true;
//             }
//         // create local storage is none exists
//         else {
//             console.log('No save state stored. Saving new birb.');
// 						return false;
//         }
// }


///////////////////
// END OF PLAY.js//
///////////////////
