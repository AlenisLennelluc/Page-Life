// //player.js
// function player(game, key) {
//
// player.prototype = Object.create(Phaser.Sprite.prototype);
// player.prototype.constructor = player;
//
// player.prototype.update = function() {
// ////////////
// //MOVEMENT//
// ////////////
//
// if (cursors.left.isDown || game.input.keyboard.isDown(Phaser.KeyCode.A))
// { // If left key down, move player left
//   this.player.body.moveLeft(300);
//   if (!this.playerJumping && checkIfCanJump(this.player))
//   {
//     this.player.animations.play('walk');
//   }
//   // Enable mirroring
//   if (this.player.scale.x > 0)
//   {
//     this.facing = -1;
//     this.player.scale.x *= -1;
//   }
// }
// else if (cursors.right.isDown || game.input.keyboard.isDown(Phaser.KeyCode.D))
// { // If right key down, move playerr right
//   this.player.body.moveRight(300);
//   if (!this.playerJumping && checkIfCanJump(this.player))
//   {
//     this.player.animations.play('walk');
//   }
//   // disable mirroring
//   if (this.player.scale.x < 0)
//   {
//     this.facing = 1;
//     this.player.scale.x *= -1;
//   }
// }
// else
// { // Else stop the player
//   this.player.body.velocity.x = 0;
//   if (!this.playerJumping && checkIfCanJump(this.player))
//   {
//     this.player.animations.stop();
//     this.player.frame = 0;
//   }
// }
//
// ///////////
// //JUMPING//
// ///////////
//
// if (this.iKey.justDown) {
//   if (this.playerJump == 700) {
//     this.playerJump = 2500;
//   }
//   else {
//     this.playerJump = 700;
//   }
// }
//
// // If up is down, move up
// if ((cursors.up.isDown || game.input.keyboard.isDown(Phaser.KeyCode.W) ||
//   game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) && this.playerJumpTimer < 0 &&
//   checkIfCanJump(this.player))
// {
//   // Start jump animation
//   this.jumpState = 1;
//   this.jumpTimer = 0;
//   // this.eggOnHead = false;
//   // Begin moving upwards immediately
//   this.player.body.moveUp(this.playerJump);
//   this.player.animations.play('jump');
//   this.playerJumpTimer = 0.5;
//   this.playerJumping = true;
//   //this.jump.play();
// }
//
// // Shorten birb
// if (this.jumpState == 1) {
//   // Increase timer by time elapsed * 8
//   this.jumpTimer += game.time.physicsElapsed * 4;
//   // this.jumpTimer = magnitude, this.facing = direction
//   this.player.scale.y -= this.jumpTimer;
//   if (this.jumpTimer > 0.2) {
//     // Move to phase 3
//     this.jumpState = 2;
//     this.jumpTimer = 0;
//   }
// }
//
// // Widen birb
// if (this.jumpState == 2) {
//   // Increase timer by time elapsed * 2
//   this.jumpTimer += game.time.physicsElapsed;
//   // this.jumpTimer = magnitude, this.facing = direction
//   this.player.scale.x += this.jumpTimer * this.facing;
//   if (this.jumpTimer > 0.05) {
//     // Move to phase 2
//     this.jumpState = 3;
//     this.jumpTimer = 0;
//   }
// }
//
// // Normalize birb
// if (this.jumpState == 3) {
//   // Increase timer by time elapsed * 8
//   this.jumpTimer += game.time.physicsElapsed;
//   // this.jumpTimer = magnitude, this.facing = direction
//   this.player.scale.x -= this.jumpTimer * this.facing;
//   // this.jumpTimer = magnitude, this.facing = direction
//   this.player.scale.y += this.jumpTimer * 2;
//   if (this.jumpTimer > 0.05) {
//     // Normalize and end jump
//     this.jumpState = 0;
//     this.jumpTimer = 0;
//     this.player.scale.y = 1;
//     this.player.scale.x = this.facing;
//     this.playerJumping = false;
//   }
// }
//
// this.playerJumpTimer -= game.time.physicsElapsed;
//
//   }
//
// }
