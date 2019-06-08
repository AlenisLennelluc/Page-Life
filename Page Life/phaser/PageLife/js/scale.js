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
			this.scaleButton = game.add.button(37, 32, 'scale', scale, this);
      this.scaleButton.alpha = 0.5;
			this.scaleButton.fixedToCamera = true;

      this.scaleButton.inputEnabled = true;
			this.scaleButton.onInputOver.add(scaleOver, this);
			this.scaleButton.onInputOut.add(scaleOut, this);
		}
  }

function scaleOver() {
  this.scaleButton.alpha = 1;
  this.scaleButton.scale.setTo(1.2, 1.2);
}

function scaleOut() {
  this.scaleButton.alpha = 0.5;
  this.scaleButton.scale.setTo(1, 1);
}

//fullscreen slides
function scale() {
		if(!game.scale.isFullScreen) {
			game.scale.startFullScreen();
		} else {
			game.scale.stopFullScreen();
		}
	}

function ckptCREATE() {
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
	ckptTween.onComplete.add(zeroAlpha, this, this.ckpt);
}

function zeroAlpha(sprite) {
	var tween = game.add.tween(sprite);
	tween.to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
}

function creditsSetup() {
	this.credits = game.add.sprite(0,0, 'credits');
	this.credits.alpha = 0;

	this.creditsButton = game.add.button(37, 100,'creditsButton', changeCredits, this);
	this.creditsButton.alpha = 0.5;
	this.creditsButton.inputEnabled = true;
	this.creditsButton.onInputOver.add(creditsOver, this);
	this.creditsButton.onInputOut.add(creditsOut, this);
}

function creditsOver() {
	this.creditsButton.alpha = 1;
	this.creditsButton.scale.setTo(1.2, 1.2);
}

function creditsOut() {
	this.creditsButton.alpha = 0.5;
	this.creditsButton.scale.setTo(1, 1);
}

function changeCredits() {
  if(this.credits.alpha == 0){
    this.credits.alpha = 1;
  }
	else {
  	this.credits.alpha = 0;
  }
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
