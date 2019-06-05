//Particles.js


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

//Code taken from https://phaser.io/examples/v2/particles/click-burst
//FOR USE IN NEST SAVING
function pNestBurst(nestShape) {

  //  Position the emitter where the mouse/touch event was
  emitter.x = nestShape.body.parent.x;
  emitter.y = nestShape.body.parent.y;

  emitter.start(true, 2000, null, 10);

  //  And 2 seconds later we'll destroy the emitter
  game.time.events.add(20000, destroyEmitter, this);

}


function destroyEmitter() {

    emitter.destroy();

}
