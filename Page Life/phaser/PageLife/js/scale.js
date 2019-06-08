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

function ckptCREATE(){
  console.log('ckptCREATE is being run');

  this.ckpt = game.add.sprite(1045, 32, 'ckpt');
	this.ckpt.anchor.setTo(0.5, 0.5);
	this.ckpt.scale.x = 0.5;
	this.ckpt.scale.y = 0.5;
	this.ckpt.fixedToCamera = true;
  this.ckpt.alpha = 0;
	game.physics.p2.enable(this.ckpt);
	this.ckpt.body.static = true;
	this.ckpt.body.data.shapes[0].sensor = true;
	this.ckpt.body.angularVelocity = -5;
}

// create .to({properties}, <duration>, <ease>, <autoStart>, <delay>, <repeat>, <yoyo>)
// -1 repeat = infinite
// setting yoyo to true makes it loop back and forth
function ckptActivate() {
	var ckptTween = game.add.tween(this.ckpt);
	ckptTween.to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 4, true);
}

//Function from particles example in phaser directory
function scaleSort(a, b) {

    if (a.scale.x < b.scale.x)
    {
        return -1;
    }
    else if (a.scale.x > b.scale.x)
    {
        return 1;
    }
    else
    {
        return 0;
    }

}
