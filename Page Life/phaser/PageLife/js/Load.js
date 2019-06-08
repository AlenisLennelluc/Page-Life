//Load.js
//Local storage code gained from Paddle Parkour Redux

var Load = function(game) {};
Load.prototype = {
	preload: function() {
		game.stage.setBackgroundColor('#fff');
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		// load graphics assets
		game.load.path = 'assets/img/';
		game.load.image('loadTitle', 'BigTITLE.png');
		// preload assets
    game.load.image('miniTitle', 'smolTITLE.png');
		game.load.image('background', 'background.png');
		game.load.spritesheet('birb', 'birb_walk_cycle.png', 75, 95);
		game.load.image('mask', 'mask.png');
		game.load.image('BGIMG', 'pageLifeMap.png');
		game.load.spritesheet('noCollusion', 'collision.PNG', 32, 32);
		game.load.image('feather', 'smolFeather.png');
		game.load.image('LFeather', 'feather.png');
		game.load.image('scale', 'FS.PNG');
		game.load.image('ckpt','checkpoint.PNG');
    game.load.image('star', 'star.png');
		game.load.image('cover', 'EndMask.png');
		game.load.image('endImg', 'Sleeping_bird.png');
		game.load.image('gull1','Seagull1.PNG');
		game.load.image('gull2','Seagull2.PNG');
		game.load.image('line', 'Line1.PNG');
		game.load.image('credits', 'credits.png');
		game.load.image('creditsButton', 'creditsBUTTON.png');

    //ATLAS AND TILEMAP
    game.load.atlas('sprites', 'sprites.png', 'sprites.json', Phaser.Loader.TEXTURE_ATLAS_JSON_TP_HASH);
    game.load.tilemap('level', 'pageLifeMap.json', null, Phaser.Tilemap.TILED_JSON);
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
		if(this.cache.isSoundDecoded('backgroundSong')){
			console.log('Background is decoded');
			if(this.cache.isSoundDecoded('end')){
				console.log('end is decoded');
				this.state.start('MainMenu');
			}
		}
	},

	loadUpdate: function(game) {
		 	this.title = game.add.sprite(0, 0, 'loadTitle');
			// set the preloadBar sprite as a loader sprite.
		 	this.load.setPreloadSprite(this.title);
	 }
};
