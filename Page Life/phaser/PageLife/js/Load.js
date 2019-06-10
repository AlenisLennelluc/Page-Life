//Load.js
//Local storage code gained from Paddle Parkour Redux

var Load = function(game) {};
Load.prototype = {

	preload: function() {

		game.stage.setBackgroundColor('#fff');
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

		// load graphics assets

		game.load.path = 'assets/img/';
		game.load.atlas('sprites', 'sprites.png', 'sprites.json', Phaser.Loader.TEXTURE_ATLAS_JSON_TP_HASH);
		game.load.tilemap('level', 'pageLifeMap.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.images(['BGIMG', 'endImg'], ['pageLifeMap.png', 'Sleeping_bird.PNG']);

		game.load.path = 'assets/img/charmask/';
    game.load.images(['miniTitle', 'background', 'mask', 'cover'], ['smolTITLE.png', 'background.png', 'mask.png', 'EndMask.png']);
		game.load.spritesheet('birb', 'birb_walk_cycle.png', 75, 95);

		game.load.path = 'assets/img/icons/';
		game.load.spritesheet('noCollusion', 'collision.PNG', 32, 32);
		game.load.images(['scale', 'ckpt', 'credits', 'creditsButton'], ['FS.PNG', 'checkpoint.PNG', 'credits.png', 'creditsBUTTON.png']);
		game.load.path = 'assets/img/particles/';
		game.load.images(['feather', 'LFeather', 'star', 'gull1', 'gull2', 'line', 'tear'], ['smolFeather.png', 'feather.png', 'star.png', 'Seagull1.PNG', 'Seagull2.PNG', 'Line1.PNG', 'tear.PNG']);


		// load audio assets
		game.load.path = 'assets/audio/';
    game.load.audio('jumpOld', 'BirbJump.wav');
    game.load.audio('pickup', 'BirbPickup.wav');
    game.load.audio('backgroundSong', ['background.mp3', 'background.ogg']);
    game.load.audio('checkpoint', ['checkpoint.mp3', 'checkpoint.ogg']);
    game.load.audio('jump', ['jump.mp3', 'jump.ogg']);
		game.load.audio('amb1Birbs', ['birds1.mp3', 'birds1.ogg']);
    game.load.audio('end', ['ending.mp3', 'ending.ogg']);
	},
	create: function() {
		// check for local storage browser support
		if(window.localStorage) {
			console.log('Local storage supported');
		} else {
			console.log('Local storage not supported');
		}
	},

	update: function() {
		//makes sure main song and end are decoded for best sound playing
		if(this.cache.isSoundDecoded('backgroundSong')){
			console.log('Background is decoded');
			if(this.cache.isSoundDecoded('end')){
				console.log('end is decoded');
				this.state.start('MainMenu');
			}
		}
	},

	loadUpdate: function(game) {
			//loadingBar
		 	this.title = game.add.sprite(0, 0, 'loadTitle');
			// set the preloadBar sprite as a loader sprite.
		 	this.load.setPreloadSprite(this.title);
	 }
};
