//Particles.js

function featherClick(){
/////////////////////////
//CREATE PARTICLES TEST//
/////////////////////////

emitter = game.add.emitter(0, 0, 100);

emitter.makeParticles('feather');
emitter.gravity = 200;


game.input.onDown.add(particleBurst, this);
this.canvas = game.add.sprite(0,0, 'cover');
this.title = game.add.sprite(0, -400, 'title');
this.title.scale.x = 0.5;
this.title.scale.y = 0.5;
game.add.tween(this.title).to({alpha: 0}, 5000, Phaser.Easing.Linear.None, true);
game.add.tween(this.canvas).to({alpha: 0}, 5000, Phaser.Easing.Linear.None, true);

}

//Code taken from https://phaser.io/examples/v2/particles/click-burst
function particleBurst(pointer) {

  //  Position the emitter where the mouse/touch event was
  emitter.x = pointer.x;
  emitter.y = pointer.y;

  //  The first parameter sets the effect to "explode" which means all particles are emitted at once
  //  The second gives each particle a 2000ms lifespan
  //  The third is ignored when using burst/explode mode
  //  The final parameter (10) is how many particles will be emitted in this single burst
  emitter.start(true, 2000, null, 10);

}

function starParticle(){

//////////////////
//STAR PARTICLES//
//////////////////

//	Emitters have a center point and a width/height, which extends from their center point to the left/right and up/down
stars = game.add.emitter(game.world.centerX, 200, 200);

//	This emitter will have a width of 800px, so a particle can emit from anywhere in the range emitter.x += emitter.width / 2
stars.width = 800;
stars.height = 800;

stars.makeParticles('star');

stars.minParticleSpeed.set(0, .1);
stars.maxParticleSpeed.set(0, .1);

stars.setRotation(0, 0);
stars.setAlpha(0.1, 0.8);
stars.setScale(1, 1, 1, 1);
stars.gravity = 3;

//	false means don't explode all the sprites at once, but instead release at a rate of one particle per 100ms
//	The 5000 value is the lifespan of each particle before it's killed
stars.start(false, 10000, 700);
}

function leafParticles(){

///////////////////////
//LEAF PARTICLES FLOW//
///////////////////////

emitter = game.add.emitter(game.world.centerX, 0, 100);

emitter.makeParticles('LFeather');

emitter.minParticleSpeed.setTo(-300, 30);
emitter.maxParticleSpeed.setTo(300, 100);
emitter.minParticleScale = 0.1;
emitter.maxParticleScale = 0.5;
emitter.gravity = 100;

//  This will emit a quantity of 5 particles every 500ms. Each particle will live for 2000ms.
//  The -1 means "run forever"
emitter.flow(3000, 500, 3, -1);

}

function waterfallParticles(){

  ///////////////////////////
  //WATERFALL TWEEN ATTEMPT//
  ///////////////////////////

  //SOURCE CODE: https://phaser.io/examples/v2/particles/tweened-emitter
  emitter = game.add.emitter(game.world.centerX, 32, 250);

  emitter.width = 800;

  emitter.makeParticles('line');

  emitter.setXSpeed(0, 0);
  emitter.setYSpeed(200, 200);

  emitter.bringToTop = true;
  emitter.setRotation(0, 0);
  emitter.setAlpha(0.1, 1, 5000);
  emitter.setScale(0.1, 2, 0.1, 2, 4000);
  emitter.gravity = 1000;



  emitter.start(false, 5000, 50);

  emitter.emitX = 200;

  //game.add.tween(emitter).to( { emitX: 700 }, 2000, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.MAX_VALUE, true);
  game.add.tween(emitter).to( { emitX: 600 }, 2000, Phaser.Easing.Back.InOut, true, 0, Number.MAX_VALUE, true);

}

function seagullParticles(){

////////////
//SEAGULLS//
////////////

emitter = game.add.emitter(game.world.centerX, 200, 200);

//	This emitter will have a width of 800px, so a particle can emit from anywhere in the range emitter.x += emitter.width / 2
emitter.width = 1200;

emitter.makeParticles(['seagull' , 'seagull2']);

emitter.minParticleSpeed.set(0, 300);
emitter.maxParticleSpeed.set(0, 400);

emitter.setRotation(0, 0);
emitter.setAlpha(0.3, 0.8);
emitter.setScale(0.5, 0.5, 1, 1);
emitter.gravity = -200;

//	false means don't explode all the sprites at once, but instead release at a rate of one particle per 100ms
//	The 5000 value is the lifespan of each particle before it's killed
emitter.start(false, 5000, 2500);

}

function noParticles(){

  		//////////////////
  		//"No" Particles//
  		//////////////////


}

//Code taken from https://phaser.io/examples/v2/particles/click-burst
//FOR USE IN NEST SAVING
function pNestBurst(otherBody, otherData, nestShape, otherShape) {

  //  Position the emitter where the mouse/touch event was
  emitter.x = nestShape.body.parent.x;
  emitter.y = nestShape.body.parent.y;

  emitter.start(true, 2000, null, 10);

  //  And 2 seconds later we'll destroy the emitter
  //game.time.events.add(20000, destroyEmitter, this);

}


function destroyEmitter() {

    emitter.destroy();

}
