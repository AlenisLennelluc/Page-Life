// The MainMenu state and its methods
var MainMenu = function(game) {};
MainMenu.prototype = {

	///////////
	//PRELOAD//
	///////////

	preload() {
		// console.log('MainMenu: Preload');
		game.load.image('title', 'assets/img/Title screen.png');
		// preload assets
		game.load.image('background', 'assets/img/background.png');
		game.load.spritesheet('birb', 'assets/img/birb_walk_cycle.png', 75, 95);
		game.load.image('mask', 'assets/img/mask.png');
		game.load.image('BGIMG', 'assets/img/pageLifeMap.png');
		game.load.spritesheet('noCollusion', 'assets/img/collision.PNG', 32, 32);
		game.load.image('feather', 'assets/img/smolFeather.png');
		game.load.image('LFeather', 'assets/img/feather.png');
		//game.load.image('line','assets/img/Line1.PNG');
		//game.load.image('seagull', 'assets/img/seagull1.png');
		//game.load.image('seagull2', 'assets/img/seagull2.png');
		//game.load.image('bat', 'assets/img/bat.png');
		game.load.image('star', 'assets/img/star.png');
		game.load.image('cover', 'assets/img/EndMask.png');
		game.load.image('endImg', 'assets/img/Sleeping_bird.png');

		//ATLAS AND TILEMAP
		game.load.atlas('sprites', 'assets/img/sprites.png', 'assets/img/sprites.json', Phaser.Loader.TEXTURE_ATLAS_JSON_TP_HASH);
		game.load.tilemap('level', 'assets/img/pageLifeMap.json', null, Phaser.Tilemap.TILED_JSON);

		// Load audio
		game.load.audio('jump', 'assets/audio/BirbJump.wav');
		game.load.audio('pickup', 'assets/audio/BirbPickup.wav');
		game.load.audio('backgroundSong', 'assets/audio/WorldMap.mp3');
		game.load.audio('checkpoint', ['assets/audio/checkpoint.mp3', 'assets/audio.checkpoint.ogg']);
	},

	//////////
	//CREATE//
	//////////

	create() {

		// ///////////
		// //SCALING//
		// ///////////
		//
		// //Code taken from scaling lecture
		// //set scale
		// // show entire game display while maintaining aspect ratio
		// game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		// //Full Screen
		// // set scaling for fullscreen
		// game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
		//
		// // add button if fullscreen is supported
		// if(game.scale.compatibility.supportsFullScreen) {
		// 	//var star = game.add.sprite(32,32,'sprites', 'star');
		// 	this.button = game.add.button(32, 32, 'star', scale, this);
		// 	this.button.anchor.setTo(0.5, 0.5);
		// }

	//Fullscreen, code located in scale.js
	scaleWindow();

	//Particles for stars, located in particles.js
	starParticle();

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
		game.add.text(450, 100, 'Page Life\n\n' +
			'Drag the egg with the mouse.\n' +
			'Drop it off the side.', { fontSize: '32px', fill: '#000'});

		this.egg = game.add.sprite(140, 200, 'sprites', 'egg');
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

		this.nest = game.add.sprite(-100, 400, 'sprites', 'nest');

		game.physics.arcade.enable(this.nest);
		this.nest.body.immovable = true;

		//Click to blow up feathers, located in particles.js
		featherClick();

		this.canvas = game.add.sprite(0,0, 'cover');
		this.title = game.add.sprite(0, -400, 'title');
		this.title.scale.x = 0.5;
		this.title.scale.y = 0.5;
		var tween = game.add.tween(this.title).to({alpha: 0}, 5000, Phaser.Easing.Linear.None, true);
		tween.onComplete.add(backTween, this);
	},

	//////////
	//UPDATE//
	//////////

	update() {

		//Physics
		game.physics.arcade.collide(this.egg, this.nest);
		game.physics.arcade.collide(this.player, this.nest);

		//Egg
		if (this.egg.position.y > 650)
		{
			this.egg.position.y = -200;
			this.egg.body.gravity.y = 0;
			this.egg.body.velocity.y = 0;

			this.player.body.position.x = 170;
			this.player.body.gravity.y = 1200;
			this.player.body.bounce.y = 0.1;

			//Text
			var text = game.add.text(450, 300, 'WASD or arrow keys to move.\n' +
				'Space or W to jump.\nGo save your egg!', { fontSize: '32px', fill: '#000'});

			text.alpha = 0;
			game.add.tween(text).to({alpha: 1}, 2000, Phaser.Easing.Linear.None, true);
		}

		//Prep song for play state
		if (this.player.position.y > 650) {
			if(this.cache.isSoundDecoded('backgroundSong')){
				this.state.start('Play');
			}
		}

		//this.button.rotation += .1;

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
	}
}

/////////////////////////////
//END OF PROTOTYPE FUNCTION//
/////////////////////////////

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

function backTween() {
	game.add.tween(this.canvas).to({alpha: 0}, 5000, Phaser.Easing.Linear.None, true);
}
