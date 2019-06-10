// The MainMenu state and its methods
var MainMenu = function(game) {};
MainMenu.prototype = {

	preload(){},

	//////////
	//CREATE//
	//////////

	create() {

	//Fullscreen, code located in scale.js
	scaleWindow.call(this);

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

		this.smallTitle = game.add.sprite(450, 100, 'miniTitle');
		// this.smallTitle.scale.x = .3;
		// this.smallTitle.scale.y = .3;

		// Add instruction text
		game.add.text(450, 200, 'Drag the egg with the mouse.\n' +
			'Drop it off the side.', { fontSize: '32px', fill: '#000'});

		this.nest = game.add.sprite(-100, 400, 'sprites', 'nest');
		game.physics.arcade.enable(this.nest);
		this.nest.body.immovable = true;
		this.nest.body.setSize(400, 300, 0, 25);

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

		//Click to blow up feathers, located in particles.js
		featherClick.call(this);
		creditsSetup.call(this);

		this.canvas = game.add.sprite(0,0, 'cover');
		this.title = game.add.sprite(0, 0, 'loadTitle');
		// this.title.scale.x = 0.5;
		// this.title.scale.y = 0.5;
		var tween = game.add.tween(this.title).to({alpha: 0}, 5000, Phaser.Easing.Linear.None, true, 500);
		tween.onComplete.add(backTween, this);

		//ckptCREATE in scale.js
		//ckptCREATE();
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
				var tween = game.add.tween(this.canvas).to({alpha: 1}, 5000, Phaser.Easing.Linear.None, true);
				tween.onComplete.add(goPlay, this);

				this.player.position.y = -200;
				this.player.body.gravity.y = 0;
				this.player.body.velocity.y = 0;
			}
		}

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

function goPlay() {
	game.state.start('Play');
}
