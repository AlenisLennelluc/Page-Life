//scale.js

function scaleWindow(){

		//Code taken from scaling lecture
		//set scale
		// show entire game display while maintaining aspect ratio
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

		//Full Screen
		// set scaling for fullscreen
		game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

		// add button if fullscreen is supported
		if(game.scale.compatibility.supportsFullScreen) {
			this.button = game.add.button(37, 32, 'scale', scale, this);
      this.button.alpha = 0.5;
			this.button.fixedToCamera = true;
      this.button.anchor.setTo(0.5, 0.5);

      this.button.inputEnabled = true;

		}
  }

function scaleUPDATE(){
  if(this.button.input.pointerOver())
  {
    this.button.alpha = 1;
    this.button.scale.setTo(1.2, 1.2);
  }
  else {
    this.button.alpha = 0.5;
    this.button.scale.setTo(1, 1);
  }
}
