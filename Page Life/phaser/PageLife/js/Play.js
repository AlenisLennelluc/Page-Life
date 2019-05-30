// The Play state and its methods
var Play = function(game) {var score;};
Play.prototype = {

	create: function() {
		game.stage.setBackgroundColor('#fff');
		// create new Tilemap objects - when using Tiled, you only need to pass the key
		this.map = game.add.tilemap('level');
		// add an image to the maps to be used as a tileset (tileset, key)
    // the tileset name is specified w/in the .json file (or in Tiled)
    // a single map may use multiple tilesets
    this.map.addTilesetImage('level1artA', 'sheetA');
		//this.map.addTilesetImage('level1ArtB', 'sheetB');
		this.map.addTilesetImage('level1ArtC', 'sheetC');
		//this.map.addTilesetImage('level1ArtD', 'sheetD');
		this.map.addTilesetImage('level1ArtE', 'sheetE');
		// this.map.addTilesetImage('level1ArtF', 'sheetF');
		// this.map.addTilesetImage('levelArtG', 'sheetG');
		// this.map.addTilesetImage('levelArtH', 'sheetH');
		// this.map.addTilesetImage('levelArtJ', 'sheetJ');
		// this.map.addTilesetImage('levelArtK', 'sheetK');
    // set ALL tiles to collide *except* those passed in the array
    this.map.setCollisionByExclusion([]);
    // create new TilemapLayer object
    // A Tilemap Layer is a set of map data combined with a tileset
		//this.map.createLayer('behind');
    this.mapLayer = this.map.createLayer('platforms');
		//this.map.createLayer('ontop');
    // set the world size to match the size of the Tilemap layer
    this.mapLayer.resizeWorld();

		game.add.sprite(0, 0, 'BGIMG');

		// Turn on the Physics engine
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.p2.gravity.y = 1200;
		game.physics.p2.restitution = 0.1;

		game.physics.p2.convertTilemap(this.map, this.mapLayer);
		game.physics.p2.setBoundsToWorld(true, true, true, true, false);

		// Egg of the player, bring to star to win
		this.egg = game.add.sprite(400, game.world.height - 200, 'egg');
		// this.box.inputEnabled = true;
		// this.box.input.enableDrag(true);
		// this.box.anchor.setTo(0.5, 1);
		game.physics.p2.enable(this.egg, true);
		this.egg.body.setCircle(20);
		// this.box.body.gravity.y = 1200;
		// this.box.body.bounce.y = 0.1;
		// this.box.body.collideWorldBounds = true;
		// this.box.body.friction = new Phaser.Point(0.5, 1);
		// // Make sure box doesnt freak out while picked up
		// this.box.events.onDragStart.add(startDrag, this);
    // this.box.events.onDragStop.add(stopDrag, this);

		this.mouse = game.add.sprite(200,game.world.height - 200, 'star');
		game.physics.p2.enable(this.mouse, true);
		this.mouse.body.static = true;
		this.mouse.body.setCircle(10);
		this.mouse.body.data.shapes[0].sensor = true;
		this.mouse.alpha = 0;

		this.spring = new Phaser.Line(this.egg.x, this.egg.y, this.mouse.x, this.mouse.y);

		game.input.onDown.add(startDrag, this);
		game.input.onUp.add(stopDrag, this);
		game.input.addMoveCallback(move, this);

		// this.oldBoxX1 = this.box.position.x;
		// this.oldBoxY1 = this.box.position.y;
		// this.oldBoxX2 = this.box.position.x;
		// this.oldBoxY2 = this.box.position.y;
		// this.oldBoxX3 = this.box.position.x;
		// this.oldBoxY3 = this.box.position.y;
		// this.oldBoxX4 = this.box.position.x;
		// this.oldBoxY4 = this.box.position.y;
		// this.oldBoxX5 = this.box.position.x;
		// this.oldBoxY5 = this.box.position.y;

		this.eggDragged = false;

		this.nests = game.add.group();
		this.nests.physicsBodyType = Phaser.Physics.P2JS;
		this.nests.enableBody = true;
		this.nests.create(400, game.world.height - 200, 'nest');
		this.nests.create(2400, game.world.height - 200, 'nest');
		this.nests.create(3776, 9436, 'nest');
		this.nests.create(4960, 4572, 'nest');
		this.nests.create(7072, 2396, 'nest');
		this.nests.create(1440, 988, 'nest');
		this.nests.create(4000, 1436, 'nest');

		this.nests.forEach(setupNest, this);
		this.nests.setAll('body.static', true);
		this.nests.setAll('body.data.shapes[0].sensor', true);

		this.saveX = 400;
		this.saveY = game.world.height - 200;

		// Create mask to fade out far away parts of the level
		this.mask = game.add.sprite(0, 720, 'mask');
		this.mask.anchor.setTo(0.5, 0.5);

		// Insert background
		game.add.tileSprite(0,0, game.world.width, game.world.height, 'background');

		// Create the player
		this.player = game.add.sprite(200, game.world.height - 400, 'birb');
		game.physics.p2.enable(this.player, true); // Enable physics
		this.player.body.fixedRotation = true;
		this.player.body.clearShapes();
		this.player.body.addRectangle(45, 90, 0, -1);
		// this.player.body.collideWorldBounds = true; // Make it so the player can't move off screen
		// this.player.body.gravity.y = 1200;
		// this.player.body.bounce.y = 0.1;
		// this.player.anchor.setTo(0.5, 0); // Make mirroring clean
		// this.player.body.friction = new Phaser.Point(0.5, 1);
		// this.player.tint = 0xff0000;
		game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, .1, .1);

		// this.eggOnHead = false;

		this.player.animations.add('walk', [ 0, 1, 2, 3], 10, true);
		this.player.animations.add('jump', [4,5], 10, true);

		// 1 = Right, -1 = left
		this.facing = 1;

		// Star for player to touch and win the game
		this.star = game.add.sprite(game.world.width - 400, 400, 'star');
		game.physics.p2.enable(this.star);
		this.star.body.createBodyCallback(this.egg, getStar, this);

		// Grab the arrowkey inputs
		cursors = game.input.keyboard.createCursorKeys();

		// Add the audio
		this.jump = game.add.audio('jump');
		this.pickup = game.add.audio('pickup');


		// timers
		this.jumpTimer = 0;
		this.jumpState = 0;
	},

	update: function() {

		// Check pphysics
		// game.physics.arcade.collide(this.player, this.box, slideEgg, null, this);
		// game.physics.arcade.collide(this.player, this.mapLayer);
		// game.physics.arcade.collide(this.box, this.mapLayer);
		// game.physics.arcade.overlap(this.star, this.box, getStar, null, this);
		// game.physics.arcade.overlap(this.box, this.nests, setSave, null, this);

		if (cursors.left.isDown || game.input.keyboard.isDown(Phaser.KeyCode.A))
		{ // If left key down, move player left
			this.player.body.moveLeft(300);
			//if (this.player.body.blocked.down || this.player.body.touching.down)
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
			//if (this.player.body.blocked.down || this.player.body.touching.down)
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
			//if (this.player.body.blocked.down || this.player.body.touching.down)
			{
				this.player.animations.stop();
				this.player.frame = 0;
			}
		}
		// if (this.box.body.blocked.down || this.box.body.touching.down)
		// {
		// 	this.box.body.velocity.x *= .7;
		// }

		if (this.eggOnHead && !this.boxDragged) {
			this.egg.body.velocity.x = this.player.body.velocity.x;
		}

		// If up is down, move up
		if ((cursors.up.isDown || game.input.keyboard.isDown(Phaser.KeyCode.W) ||
			game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) && checkIfCanJump(this.player))
		{
			// Start jump animation
			this.jumpState = 1;
			this.jumpTimer = 0;
			this.eggOnHead = false;
			// Begin moving upwards immediately
			this.player.body.moveUp(650);
			this.player.animations.play('jump');
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
			}
		}

		//update mask
		this.mask.position.x = this.player.position.x;
		this.mask.position.y = this.player.position.y;


		// Keeping track of egg movement
		// this.oldBoxX5 = this.oldBoxX4;
		// this.oldBoxY5 = this.oldBoxY4;
		// this.oldBoxX4 = this.oldBoxX3;
		// this.oldBoxY4 = this.oldBoxY3;
		// this.oldBoxX3 = this.oldBoxX2;
		// this.oldBoxY3 = this.oldBoxY2;
		// this.oldBoxX2 = this.oldBoxX1;
		// this.oldBoxY2 = this.oldBoxY1;
		// this.oldBoxX1 = this.box.position.x;
		// this.oldBoxY1 = this.box.position.y;

		// Calculate distance from birb to egg
		var birbEggDistX = (this.egg.position.x - this.player.position.x);
		var birbEggDistY = (this.egg.position.y - this.player.position.y);

		//console.log('Dist x: ' + birbEggDistX + ' y: ' + birbEggDistY);

		var birbEggDist = Math.sqrt(Math.pow(birbEggDistX, 2) + Math.pow(birbEggDistY, 2));

		console.log('Total Dist: ' + birbEggDist + ' Being Dragged: ' + this.eggDragged);

		if (birbEggDist > 1000 && !this.eggDragged)
		{
			console.log(this.saveX + " " + this.saveY);
			this.egg.body.x = this.saveX;
			this.egg.body.y = this.saveY;
			this.player.body.x = this.saveX;
			this.player.body.y = this.saveY;
		}

		// Currently tints semirandomly. Should tint red.
		//this.player.tint = birbEggDist / 1000 * 0xff0000;
	},
	render: function() {
		game.debug.body(this.player);
		game.debug.body(this.mapLayer);
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
	}
}

// Once player lets go of box, re-engage physics
function stopDrag() {
	game.physics.p2.removeConstraint(this.mouseSpring);
	this.eggDragged = false;
}

// Keep egg on head
function slideEgg() {
	if (this.player.position.y >= this.box.position.y)
	{
		this.eggOnHead = true;
		// this.box.position.y = this.player.position.y;
		// this.box.body.velocity.y = 0;
		// this.box.position.x = this.player.position.x;
	}
}

// When player steps on star, end the game
function getStar() {
	this.pickup.play();
	game.state.start('GameOver');
}

// set nests as savepoints
function setupNest(nest) {
	nest.body.createBodyCallback(this.egg, setSave, this);
}

// When player touches a nest, log the save Point
function setSave(nest, egg) {
	this.saveX = nest.position.x;
	this.saveY = nest.position.y;
	console.log("set save to: " + this.saveX + ", " + this.saveY);
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
