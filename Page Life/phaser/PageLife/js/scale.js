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

// function ckptCREATE(){
//   console.log('ckptCREATE is being run');
//
//   ckptTimer = game.time.create();
//   ckptTimerEnd = game.time.create();
//
//   this.checkpoint = game.add.sprite(1045, 32, 'ckpt');
//   this.checkpoint.anchor.setTo(0.5, 0.5);
//   this.checkpoint.scale.setTo(0.5, 0.5);
//   this.checkpoint.alpha = 0;
//
//   //one-shot event(delay,callback,context,arguements)
//   ckptTimer.add(8000, function(){
//   ckptTWEEN = game.add.tween(checkpoint).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
//   ckptTimerEnd.start();
//   console.log('ckptTIMER is being run');
//   });
//
//   ckptTimerEnd.add(2000, function(){
//     this.ckptTWEEN.end();
//     console.log('ckptTimerEnd is being run');
//   })
//
//
//   ckptTimer.start();
// }
//
// function ckptUPDATE(){
//   		this.checkpoint.angle -= 10;
// }

// function ckptTIME(){
//   ckptTimer.start();
// }
