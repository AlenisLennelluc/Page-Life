// The MainMenu state and its methods
var MainMenu = function(game) {};
MainMenu.prototype = {

	preload() {
		// console.log('MainMenu: Preload');

		// preload assets
		game.load.image('background', 'assets/img/background.png');
		game.load.spritesheet('birb', 'assets/img/birb_walk_cycle.png', 75, 95);
		game.load.image('mask', 'assets/img/mask.png');
		game.load.image('star', 'assets/img/star.png');
		game.load.image('egg', 'assets/img/egg.png');
		game.load.image('nest', 'assets/img/nest.png');
		game.load.image('BGIMG', 'assets/img/pageLifeMap.png');
		game.load.image('tear', 'assets/img/Tear.png');
		game.load.image('sNest', 'assets/img/nest-copy.png');
		game.load.spritesheet('noCollusion', 'assets/img/collision.PNG', 32, 32);


		// load tilemap data (key, url, data, format)
    game.load.tilemap('level', 'assets/img/pageLifeMap.json', null, Phaser.Tilemap.TILED_JSON);
    // // load tilemap spritesheet (key, url, frameWidth, frameHeight)
    // game.load.spritesheet('sheetA', 'assets/img/pageLifeMap.png', 32, 32);

		// Load audio
		game.load.audio('jump', 'assets/audio/BirbJump.wav');
		game.load.audio('pickup', 'assets/audio/BirbPickup.wav');
		game.load.audio('backgroundSong', 'assets/audio/WorldMap.mp3');
	},

	create() {

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
			this.button.anchor.setTo(0.5, 0.5);
		}

		///////////////////////
		//LEAF PARTICLES FLOW//
		///////////////////////

		// emitter = game.add.emitter(game.world.centerX, 0, 100);
		//
    // emitter.makeParticles('LFeather');
		//
    // emitter.minParticleSpeed.setTo(-300, 30);
    // emitter.maxParticleSpeed.setTo(300, 100);
    // emitter.minParticleScale = 0.1;
    // emitter.maxParticleScale = 0.5;
    // emitter.gravity = 100;
		//
    // //  This will emit a quantity of 5 particles every 500ms. Each particle will live for 2000ms.
    // //  The -1 means "run forever"
    // emitter.flow(3000, 500, 3, -1);

		//////////////////
		//STAR PARTICLES//
		//////////////////

		//	Emitters have a center point and a width/height, which extends from their center point to the left/right and up/down
    emitter = game.add.emitter(game.world.centerX, 200, 200);

    //	This emitter will have a width of 800px, so a particle can emit from anywhere in the range emitter.x += emitter.width / 2
    emitter.width = 800;
		emitter.height = 800;

    emitter.makeParticles('star');

    emitter.minParticleSpeed.set(0, .1);
    emitter.maxParticleSpeed.set(0, .1);

    emitter.setRotation(0, 0);
    emitter.setAlpha(0.1, 0.8);
    emitter.setScale(1, 1, 1, 1);
    emitter.gravity = 3;

    //	false means don't explode all the sprites at once, but instead release at a rate of one particle per 100ms
    //	The 5000 value is the lifespan of each particle before it's killed
    emitter.start(false, 10000, 700);

		///////////////////////////
		//WATERFALL TWEEN ATTEMPT//
		///////////////////////////

		//SOURCE CODE: https://phaser.io/examples/v2/particles/tweened-emitter
		// emitter = game.add.emitter(game.world.centerX, 32, 250);
		//
	  // emitter.width = 800;
		//
    // emitter.makeParticles('line');
		//
    // emitter.setXSpeed(0, 0);
    // emitter.setYSpeed(200, 200);
		//
    // emitter.bringToTop = true;
    // emitter.setRotation(0, 0);
    // emitter.setAlpha(0.1, 1, 5000);
    // emitter.setScale(0.1, 2, 0.1, 2, 4000);
    // emitter.gravity = 1000;
		//
		//
		//
    // emitter.start(false, 5000, 50);
		//
    // emitter.emitX = 200;
		//
    // //game.add.tween(emitter).to( { emitX: 700 }, 2000, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.MAX_VALUE, true);
    // game.add.tween(emitter).to( { emitX: 600 }, 2000, Phaser.Easing.Back.InOut, true, 0, Number.MAX_VALUE, true);

		////////////
		//SEAGULLS//
		////////////

		// emitter = game.add.emitter(game.world.centerX, 200, 200);
		//
    // //	This emitter will have a width of 800px, so a particle can emit from anywhere in the range emitter.x += emitter.width / 2
    // emitter.width = 1200;
		//
    // emitter.makeParticles(['seagull' , 'seagull2']);
		//
    // emitter.minParticleSpeed.set(0, 300);
    // emitter.maxParticleSpeed.set(0, 400);
		//
    // emitter.setRotation(0, 0);
    // emitter.setAlpha(0.3, 0.8);
    // emitter.setScale(0.5, 0.5, 1, 1);
    // emitter.gravity = -200;
		//
    // //	false means don't explode all the sprites at once, but instead release at a rate of one particle per 100ms
    // //	The 5000 value is the lifespan of each particle before it's killed
    // emitter.start(false, 5000, 2500);


		//////////////////
		//"No" Particles//
		//////////////////



		////////////
		//GRAPHICS//
		////////////

		// Add the background and make it properly cover the canvas
		var sky = game.add.tileSprite(0,0, game.world.width, game.world.height, 'background');

		game.stage.setBackgroundColor('#fff');

		// Set up the background music
		var bg = game.add.audio('funk');
		//bg.loopFull();

		// Add instruction text
		this.text = game.add.text(600,100, 'Page Life\n\n' +
			'Drag the egg with the mouse.\n' +
			'Drop it off the side.', { fontSize: '32px', fill: '#000'});
		this.egg = game.add.sprite(170, game.world.height - 250, 'egg');
		this.egg.inputEnabled = true;
		this.egg.input.enableDrag(true);
		game.physics.arcade.enable(this.egg);
		this.egg.body.gravity.y = 1200;
		this.egg.body.bounce.y = 0.1;
		this.egg.events.onDragStart.add(startDragMenu, this);
    this.egg.events.onDragStop.add(stopDragMenu, this);

		this.player = game.add.sprite(0, -300, 'birb');
		game.physics.arcade.enable(this.player);
		this.player.animations.add('walk', [ 0, 1, 2, 3], 10, true);
		this.player.animations.add('jump', [4,5], 10, true);
		this.player.anchor.setTo(0.5, 0.5);

		this.nest = game.add.sprite(0, game.world.height - 200, 'nest');
		game.physics.arcade.enable(this.nest);
		this.nest.body.immovable = true;
	},

	update() {

		game.physics.arcade.collide(this.egg, this.nest);
		game.physics.arcade.collide(this.player, this.nest);

		if (this.egg.position.y > game.world.height + 100)
		{
			this.egg.position.y = -200;
			this.egg.body.gravity.y = 0;
			this.egg.body.velocity.y = 0;

			this.player.body.position.x = 170;
			this.player.body.gravity.y = 1200;
			this.player.body.bounce.y = 0.1;

			this.text.setText('Page Life\n\n' +
				'Drag the egg with the mouse.\n' +
				'Drop it off the side.\n\n' +
				'WASD or arrow keys to move.\n' +
				'Space or W to jump.\nGo save your egg!');
		}

		if (this.player.position.y > game.world.height + 100) {
			if(this.cache.isSoundDecoded('backgroundSong')){
				this.state.start('Play');
			}
		}

		this.button.rotation += .1;

		if (game.input.keyboard.isDown(Phaser.KeyCode.A) || game.input.keyboard.isDown(Phaser.KeyCode.LEFT))
		{
			this.player.body.velocity.x = -300;
			this.player.scale.x = -1;
		}
		else if (game.input.keyboard.isDown(Phaser.KeyCode.D) || game.input.keyboard.isDown(Phaser.KeyCode.RIGHT))
		{
			this.player.body.velocity.x = 300;
			this.player.scale.x = 1;
		}
		else {
			this.player.body.velocity.x = 0;
		}

		if ((game.input.keyboard.isDown(Phaser.KeyCode.UP) || game.input.keyboard.isDown(Phaser.KeyCode.W) ||
			game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) && this.player.body.touching.down)
		{
			this.player.body.velocity.y = -650;
		}

		if (!this.player.body.touching.down) {
			this.player.animations.play('jump');
		}
		else if (this.player.body.velocity.x != 0) {
			this.player.animations.play('walk');
		}
		else {
			this.player.animations.stop();
			this.player.frame = 0;
		}

		// wide emitter with snow
		// emitter = game.add.emitter(game.world.centerX, game.world.centerY);
		// emitter.makeParticles(['star'], 0, 1);
		// emitter.start(false, 1000000, 1);
		// //emitter.setYSpeed(1000, 1000);
		// let gravity = new Phaser.Point(0,0);
		// emitter.gravity = gravity;
		// emitter.setAlpha(0.25, 1);
		// let area = new Phaser.Rectangle(game.world.centerX, 0, 500, 1);
		// emitter.area = area;

	}
}

function startDragMenu() {
	this.egg.body.moves = false;
}

// Once player lets go of box, re-engage physics
function stopDragMenu() {
	this.egg.body.moves = true;
}

//fullscreen slides
function buttonClick() {
		if(!game.scale.isFullScreen) {
			game.scale.startFullScreen();
		} else {
			game.scale.stopFullScreen();
		}
	}
