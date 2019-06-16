//Particles.js

function featherClick(){
/////////////////////////
//CREATE PARTICLES TEST//
/////////////////////////

this.fclick = game.add.emitter(0, 0, 200);

this.fclick.makeParticles('feather');
this.fclick.gravity = 200;

game.input.onDown.add(particleBurst, this);

}

//Code taken from https://phaser.io/examples/v2/particles/click-burst
function particleBurst(pointer) {

  //  Position the emitter where the mouse/touch event was
  this.fclick.x = pointer.x + game.camera.x;
  this.fclick.y = pointer.y + game.camera.y;

  //  The first parameter sets the effect to "explode" which means all particles are emitted at once
  //  The second gives each particle a 2000ms lifespan
  //  The third is ignored when using burst/explode mode
  //  The final parameter (10) is how many particles will be emitted in this single burst
  this.fclick.start(true, 2000, null, 10);
  this.fclick.forEach(zeroAlpha, this, true);
}

function featherBirdArea(){
  this.bArea = game.add.emitter(1640, 6930, 1600);

  this.bArea.makeParticles('LFeather');
  this.bArea.minParticleSpeed.setTo(-300, 30);
  this.bArea.maxParticleSpeed.setTo(300, 100);
  this.bArea.setXSpeed(1000, 0);
  this.bArea.setYSpeed(-700, 0);
  this.bArea.setAlpha(0.1, 0.4);
  this.bArea.minParticleScale = 0.1;
  this.bArea.maxParticleScale = 0.5;
  this.bArea.gravity = 250;

  //  This will emit a quantity of 5 particles every 500ms. Each particle will live for 2000ms.
  //  The -1 means "run forever"
  this.bArea.flow(6000, 500, 15, -1);
}

function featherBirdArea2(){
  this.bArea2 = game.add.emitter(2145, 5170, 1600);

  this.bArea2.makeParticles('LFeather');
  this.bArea2.minParticleSpeed.setTo(-300, -300);
  this.bArea2.maxParticleSpeed.setTo(300, 300);
  this.bArea2.setXSpeed(1200, 0);
  this.bArea2.setYSpeed(-700, 0);
  this.bArea2.setAlpha(0.1, 0.4);
  this.bArea2.minParticleScale = 0.1;
  this.bArea2.maxParticleScale = 0.5;
  this.bArea2.gravity = 250;

  //  This will emit a quantity of 5 particles every 500ms. Each particle will live for 2000ms.
  //  The -1 means "run forever"
  this.bArea2.flow(6000, 500, 15, -1);
}

function featherBirdArea3(){
  this.bArea3 = game.add.emitter(2050, 1600, 1600);

  this.bArea3.makeParticles('LFeather');
  this.bArea3.minParticleSpeed.setTo(-300, -300);
  this.bArea3.maxParticleSpeed.setTo(300, 300);
  this.bArea3.setRotation(-180, 90)
  this.bArea3.minRotation = 0;
  this.bArea3.maxRotation = 0;
  this.bArea3.setXSpeed(1200, 0);
  this.bArea3.setYSpeed(-700, 0);
  this.bArea3.setAlpha(0.1, 0.4);
  this.bArea3.minParticleScale = 0.1;
  this.bArea3.maxParticleScale = 0.5;
  this.bArea3.gravity = 250;

  //  This will emit a quantity of 5 particles every 500ms. Each particle will live for 2000ms.
  //  The -1 means "run forever"
  this.bArea3.flow(6000, 500, 15, -1);
}

function featherBirdArea4(){
  this.bArea4 = game.add.emitter(2050, 1600, 1600);

  this.bArea4.makeParticles('LFeather');
  this.bArea4.minParticleSpeed.setTo(-300, -300);
  this.bArea4.maxParticleSpeed.setTo(300, 300);
  this.bArea4.setRotation(-180, 90)
  this.bArea4.setXSpeed(-1200, 0);
  this.bArea4.setYSpeed(700, 0);
  this.bArea4.setAlpha(0.1, 0.4);
  this.bArea4.minParticleScale = 0.1;
  this.bArea4.maxParticleScale = 0.5;
  this.bArea4.gravity = 250;

  //  This will emit a quantity of 5 particles every 500ms. Each particle will live for 2000ms.
  //  The -1 means "run forever"
  this.bArea4.flow(6000, 500, 5, -1);
}

function starParticle(){

//////////////////
//STAR PARTICLES//
//////////////////

//	Emitters have a center point and a width/height, which extends from their center point to the left/right and up/down
this.stars = game.add.emitter(game.world.centerX, 200, 200);

//	This emitter will have a width of 800px, so a particle can emit from anywhere in the range emitter.x += emitter.width / 2
this.stars.width = 800;
this.stars.height = 800;

this.stars.makeParticles('star');

this.stars.minParticleSpeed.set(0, .1);
this.stars.maxParticleSpeed.set(0, .1);

this.stars.setRotation(0, 0);
this.stars.setAlpha(0.1, 0.8);
this.stars.setScale(1, 1, 1, 1);
this.stars.gravity = 3;

//	false means don't explode all the sprites at once, but instead release at a rate of one particle per 100ms
//	The 5000 value is the lifespan of each particle before it's killed
this.stars.start(false, 10000, 700);
}

function starParticleEND(){

//////////////////
//STAR PARTICLES//
//////////////////

//	Emitters have a center point and a width/height, which extends from their center point to the left/right and up/down
this.starsE = game.add.emitter(8880, 370, 600);

//	This emitter will have a width of 800px, so a particle can emit from anywhere in the range emitter.x += emitter.width / 2
this.starsE.width = 5000;
this.starsE.height = 1500;

this.starsE.makeParticles('star');

this.starsE.minParticleSpeed.set(0, .1);
this.starsE.maxParticleSpeed.set(0, .1);

this.starsE.setRotation(0, 0);
this.starsE.setAlpha(0.1, 0.5);
this.starsE.setScale(1, 1, 1, 1);
this.starsE.gravity = 3;

//	false means don't explode all the sprites at once, but instead release at a rate of one particle per 100ms
//	The 5000 value is the lifespan of each particle before it's killed
this.starsE.start(false, 20000, 400);
}

function leafParticles(){

///////////////////////
//LEAF PARTICLES FLOW//
///////////////////////

this.emitter = game.add.emitter(500, 13500, 1500);

this.emitter.makeParticles('LFeather');
this.emitter.minParticleSpeed.setTo(-300, 30);
this.emitter.maxParticleSpeed.setTo(300, 100);
this.emitter.setAlpha(0.1, 0.4);
this.emitter.minParticleScale = 0.1;
this.emitter.maxParticleScale = 0.5;
this.emitter.gravity = 100;

//  This will emit a quantity of 5 particles every 500ms. Each particle will live for 2000ms.
//  The -1 means "run forever"
this.emitter.flow(6000, 500, 3, -1);

}

function mindParticles(){
  this.mind = game.add.emitter(4815, 350, 200);

  //  Here we're passing an array of image keys. It will pick one at random when emitting a new particle.
  this.mind.makeParticles(['charA', 'charB']);
  this.mind.setAlpha(0.1, 0.4);


  //  This will emit a quantity of 5 particles every 500ms. Each particle will live for 2000ms.
  //  The -1 means "run forever"
  this.mind.flow(6000, 500, 3, -1);
}

function waterfallParticles(){

  ///////////////////////////
  //WATERFALL TWEEN ATTEMPT//
  ///////////////////////////

  //SOURCE CODE: https://phaser.io/examples/v2/particles/tweened-emitter
  this.fall = game.add.emitter(5600, 10730, 250);

  this.fall.width = 800;

  this.fall.makeParticles('line');

  this.fall.setXSpeed(50, 0);
  this.fall.setYSpeed(200, 200);

  this.fall.bringToTop = true;
  this.fall.setRotation(0, 0);
  this.fall.setAlpha(0.1, 1, 5000);
  this.fall.setScale(0.1, 2, 0.1, 2, 4000);
  this.fall.gravity = 1000;



  this.fall.start(false, 5000, 50);

  this.fall.emitX = 200;

  //game.add.tween(emitter).to( { emitX: 700 }, 2000, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.MAX_VALUE, true);
  game.add.tween(this.fall).to( { emitX: 600 }, 2000, Phaser.Easing.Back.InOut, true, 0, Number.MAX_VALUE, true);

}

function seagullParticles(){

////////////
//SEAGULLS//
////////////

this.gull = game.add.emitter(2500, 12200, 2000);

//	This emitter will have a width of 800px, so a particle can emit from anywhere in the range emitter.x += emitter.width / 2
this.gull.width = 1200;

this.gull.makeParticles(['gull1' , 'gull2']);

this.gull.minParticleSpeed.set(0, 300);
this.gull.maxParticleSpeed.set(0, 400);

this.gull.setRotation(0, 0);
this.gull.setAlpha(0.3, 0.5);
this.gull.setScale(0.5, 0.5, 1, 1);
this.gull.gravity = -200;

//	false means don't explode all the sprites at once, but instead release at a rate of one particle per 100ms
//	The 5000 value is the lifespan of each particle before it's killed
this.gull.start(false, 5000, 2500);

}

function galleryParticles(){

  this.gallery = game.add.emitter(7236, 3100, 7);

  //2500, 12200
  //	This emitter will have a width of 800px, so a particle can emit from anywhere in the range emitter.x += emitter.width / 2
  this.gallery.width = 800;

  this.gallery.makeParticles(['Nice' , 'Lovely', 'Incredible', 'Emotional', 'Deep', 'Great', 'Relateable']);

  this.gallery.minParticleSpeed.set(0, 0);
  this.gallery.maxParticleSpeed.set(0, 0);

  this.gallery.setRotation(0, 0);
  this.gallery.setAlpha(0.5, 1);
  this.gallery.setScale(0.5, 0.5, 0.5, 0.5);
  this.gallery.gravity = 0;

  //	false means don't explode all the sprites at once, but instead release at a rate of one particle per 100ms
  //	The 5000 value is the lifespan of each particle before it's killed
  this.gallery.start(false, 4000, 1500);

}

function rainDropParticles(){
	this.rain = game.add.emitter(6412, 5704, 1000);
  //this.rain = game.add.emitter(540, 550, 1000);
	this.rain.width = 2080;

	this.rain.makeParticles(['line']);

  this.rain.setRotation(30, 45);
	this.rain.setScale(0.4, 0.4);
	this.rain.setAlpha(0.01, 0.1);
	//this.rain.frequency = 1;

	this.rain.minParticleSpeed.set(0,300);
	this.rain.maxParticleSpeed.set(0,1000);
	this.rain.setYSpeed(-50, -250);
  //this.rain.setXSpeed(500, 1000);


	this.rain.setRotation(0,0);
	this.rain.gravity = -500;

	this.rain.flow(2000, 1, 5);
  //this.rain.frequency = 0.01;
}

function noParticles(){

   //	Emitters have a center point and a width/height, which extends from their center point to the left/right and up/down
   this.no = game.add.emitter(4650, 11150, 10);

   //	This emitter will have a width of 800px, so a particle can emit from anywhere in the range emitter.x += emitter.width / 2
   // emitter.width = 800;

   this.no.makeParticles('No');

   // emitter.minParticleSpeed.set(0, 300);
   // emitter.maxParticleSpeed.set(0, 600);

   this.no.setRotation(0, 0);
   this.no.setXSpeed(700, 0);
   this.no.setYSpeed(250, 0);

   this.no.setAlpha(0.1, 0.3, 3000);
   this.no.setScale(0.1, 1, 0.1, 1, 6000, Phaser.Easing.Quintic.Out);
   this.no.gravity = -200;

   this.no.start(false, 5000, 10);
}


function NoUPDATE(){

  this.no.customSort(scaleSort, this);

}

//Code taken from https://phaser.io/examples/v2/particles/click-burst
//FOR USE IN NEST SAVING
function pNestBurst(otherBody, otherData, nestShape, otherShape) {

  //  Position the emitter where the mouse/touch event was
  this.fclick.x = nestShape.body.parent.x;
  this.fclick.y = nestShape.body.parent.y;

  this.fclick.start(true, 2000, null, 10);
  //function, context, run particles on alive only
  this.fclick.forEach(zeroAlpha, this, true);

  //  And 2 seconds later we'll destroy the emitter
  //game.time.events.add(20000, destroyEmitter, this);

}

function endPS(){
  
}

function destroyEmitter() {

    emitter.destroy();

}

function particleUpdate() {
  //emitterCheck(this.fclick);
  emitterCheck(this.no);
  galleryCheck.call(this);
  emitterCheck(this.gull);
  emitterCheck(this.fall);
  emitterCheck(this.emitter);
  emitterCheck(this.starsE);
  emitterCheck(this.stars);

  if (this.gallery != null) {
    this.gallery.emitX = this.player.x;
    this.gallery.emitY = this.player.y;
  }
  rainCheck.call(this);
}

function emitterCheck(emitter) {
  if (emitter != null) {
    if (
      emitter.y > game.camera.y + game.camera.height ||
      emitter.y + 3000 < game.camera.y ||
      emitter.x - 2000 > game.camera.x + game.camera.width ||
      emitter.x + 2000 < game.camera.x
    ) {
      emitter.on = false;
    }
    else {
      emitter.on = true;
    }
  }
}

function galleryCheck() {
  if (this.gallery != null) {
    if (
      this.player.y > 3900 ||
      this.player.x > 7200 ||
      this.player.x < 3600 ||
      this.player.y < 2000
    ) {
      this.gallery.on = false;
    }
    else {
      this.gallery.on = true;
    }
  }
}

function rainCheck() {
  if (this.rain != null) {
    if (
      this.player.y > 5150 ||
      this.player.x > 8450 ||
      this.player.x < 8350 ||
      this.player.y < 2900
    ) {
      this.rain.on = false;
    }
    else {
      this.rain.on = true;
      this.rain.emitX = this.player.x;
      this.rain.emitY = this.player.y + 550;
    }
  }
}
