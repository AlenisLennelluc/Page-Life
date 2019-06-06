// The GameOver state and its methods
var GameOver = function(game) {};
GameOver.prototype = {
	init: function(score) {
		// Add the background and make it properly cover the canvas
		//game.add.tileSprite(0,0, game.world.width, game.world.height, 'background');

		// Add GameOver text
		game.add.text(16,16, 'You Won!' + '\nPress Space To Restart', { fontSize: '32px', fill: '#000'});
	},
	update: function() {
		// Check for spacebar to go back to Play state
		if (game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR))
			game.state.start('Play');
	}
}
