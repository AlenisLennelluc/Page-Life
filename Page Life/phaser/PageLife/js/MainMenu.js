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
		game.load.image('no3', 'assets/img/No3.png');
		game.load.image('no4', 'assets/img/No4.png');
		game.load.image('no5', 'assets/img/No5.png');


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
		// Add the background and make it properly cover the canvas
		var sky = game.add.tileSprite(0,0, game.world.width, game.world.height, 'background');

		game.stage.setBackgroundColor('#fff');

		// Set up the background music
		var bg = game.add.audio('funk');
		//bg.loopFull();

		// Add instruction text
		game.add.text(400,200, 'Page Life\n\n' +
			'Use the arrow keys to move\nleft, right, up and down.\n' +
			'Find the star and click it to win!\n' +
			'You can also drag the egg around.\n' +
			'Drop the egg to start.', { fontSize: '32px', fill: '#000'});
		this.egg = game.add.sprite(170, game.world.height - 250, 'egg');
		this.egg.inputEnabled = true;
		this.egg.input.enableDrag(true);
		game.physics.arcade.enable(this.egg);
		this.egg.body.gravity.y = 1200;
		this.egg.body.bounce.y = 0.1;
		this.egg.events.onDragStart.add(startDragMenu, this);
    this.egg.events.onDragStop.add(stopDragMenu, this);

		this.nest = game.add.sprite(100, game.world.height - 200, 'nest');
		game.physics.arcade.enable(this.nest);
		this.nest.body.immovable = true;
	},

	update() {

		game.physics.arcade.collide(this.egg, this.nest);

		if (this.egg.position.y > game.world.height + 100)
		{
			// Nate's decoding code from audio slide
			if(this.cache.isSoundDecoded('backgroundSong')){
				this.state.start('Play');
			}
		}

		this.button.rotation += .1;

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
