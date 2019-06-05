// The MainMenu state and its methods
var MainMenu = function(game) {};
MainMenu.prototype = {

	///////////
	//PRELOAD//
	///////////

	preload() {
		// console.log('MainMenu: Preload');

		// preload assets
		game.load.image('background', 'assets/img/background.png');
		game.load.spritesheet('birb', 'assets/img/birb_walk_cycle.png', 75, 95);
		game.load.image('mask', 'assets/img/mask.png');
		game.load.image('BGIMG', 'assets/img/pageLifeMap.png');
		game.load.spritesheet('noCollusion', 'assets/img/collision.PNG', 32, 32);
		game.load.image('feather', 'assets/img/smolFeather.png');
		game.load.image('LFeather', 'assets/img/feather.png');
		game.load.image('star', 'assets/img/star.png');

		//ATLAS AND TILEMAP
		game.load.atlas('sprites', 'assets/img/sprites.png', 'assets/img/sprites.json', Phaser.Loader.TEXTURE_ATLAS_JSON_TP_HASH);
		game.load.tilemap('level', 'assets/img/pageLifeMap.json', null, Phaser.Tilemap.TILED_JSON);

		// Load audio
		game.load.audio('jump', 'assets/audio/BirbJump.wav');
		game.load.audio('pickup', 'assets/audio/BirbPickup.wav');
		game.load.audio('backgroundSong', 'assets/audio/WorldMap.mp3');
	},

	//////////
	//CREATE//
	//////////

	create() {

		///////////
		//SCALING//
		///////////

		//Code taken from scaling lecture
		//set scale
		// show entire game display while maintaining aspect ratio
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		//Full Screen
		// set scaling for fullscreen
		game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

		// add button if fullscreen is supported
		if(game.scale.compatibility.supportsFullScreen) {
			//var star = game.add.sprite(32,32,'sprites', 'star');
			this.button = game.add.button(32, 32, 'star', scale, this);
			this.button.anchor.setTo(0.5, 0.5);
		}

		emitter = game.add.emitter(game.world.centerX, 0, 100);

    emitter.makeParticles('LFeather');

    emitter.minParticleSpeed.setTo(-300, 30);
    emitter.maxParticleSpeed.setTo(300, 100);
    emitter.minParticleScale = 0.1;
    emitter.maxParticleScale = 0.5;
    emitter.gravity = 100;

    //  This will emit a quantity of 5 particles every 500ms. Each particle will live for 2000ms.
    //  The -1 means "run forever"
    emitter.flow(3000, 500, 3, -1);

		////////////
		//GRAPHICS//
		////////////

		// Add the background and make it properly cover the canvas
		var sky = game.add.tileSprite(0,0, game.world.width, game.world.height, 'background');

		game.stage.setBackgroundColor('#fff');

		/////////////////
		//MAINMENU TEXT//
		/////////////////

		// Add instruction text
		this.text = game.add.text(450,100, 'Page Life\n\n' +
			'Drag the egg with the mouse.\n' +
			'Drop it off the side.', { fontSize: '32px', fill: '#000'});
		this.egg = game.add.sprite(140, game.world.height - 250, 'sprites', 'egg');
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

		this.nest = game.add.sprite(-100, game.world.height - 150, 'sprites', 'nest');
		game.physics.arcade.enable(this.nest);
		this.nest.body.immovable = true;


		/////////////////////////
		//CREATE PARTICLES TEST//
		/////////////////////////

		emitter = game.add.emitter(0, 0, 100);

		emitter.makeParticles('feather');
		emitter.gravity = 200;


		game.input.onDown.add(particleBurst, this);

	},

	//////////
	//UPDATE//
	//////////

	update() {

		//Physics
		game.physics.arcade.collide(this.egg, this.nest);
		game.physics.arcade.collide(this.player, this.nest);

		//Egg
		if (this.egg.position.y > game.world.height + 100)
		{
			this.egg.position.y = -200;
			this.egg.body.gravity.y = 0;
			this.egg.body.velocity.y = 0;

			this.player.body.position.x = 170;
			this.player.body.gravity.y = 1200;
			this.player.body.bounce.y = 0.1;

			//Text
			this.text.setText('Page Life\n\n' +
				'Drag the egg with the mouse.\n' +
				'Drop it off the side.\n\n' +
				'WASD or arrow keys to move.\n' +
				'Space or W to jump.\nGo save your egg!');
		}

		//Prep song for play state
		if (this.player.position.y > game.world.height + 100) {
			if(this.cache.isSoundDecoded('backgroundSong')){
				this.state.start('Play');
			}
		}

		this.button.rotation += .1;

		////////////
		//MOVEMENT//
		////////////

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

		////////
		//JUMP//
		////////

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


		////////////////////
		//EMITTER PRACTICE//
		////////////////////

		// wide emitter with snow
		// emitter = game.add.emitter(game.world.centerX, game.world.centerY);
		// emitter.makeParticles(['feather'], 0, 1);
		// emitter.start(true, 1000, 1);
		// //emitter.setYSpeed(1000, 1000);
		// let gravity = new Phaser.Point(0,0);
		// emitter.gravity = gravity;
		// emitter.setAlpha(0.25, 1);



	}
}

/////////////
//FUNCTIONS//
/////////////

function startDragMenu() {
	this.egg.body.moves = false;
}

// Once player lets go of egg, re-engage physics
function stopDragMenu() {
	this.egg.body.moves = true;
}
