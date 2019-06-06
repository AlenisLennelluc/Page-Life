//scale.js

function scaleWindow(){
		/////////////
		// SCALING //
		/////////////

		//Code taken from scaling lecture
		//set scale
		// show entire game display while maintaining aspect ratio
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

		//Full Screen
		// set scaling for fullscreen
		game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

		// add button if fullscreen is supported
		if(game.scale.compatibility.supportsFullScreen) {
			this.button = game.add.button(32, 32, 'star', scale, this);
			this.button.fixedToCamera = true;
		}
  }
