// The GameOver state and its methods
var GameOver = function(game) {};
GameOver.prototype = {
	init: function(score) {
		// Add the background and make it properly cover the canvas
		var sky = game.add.sprite(0,0, 'background');

		// Add GameOver text
		game.add.text(16,16, 'Game Over!\nFinal Score: ' + score + '\nPress Space To Restart', { fontSize: '32px', fill: '#FFF'});
	},
	update: function() {
		// Check for spacebar to go back to Play state
		if (game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR))
			game.state.start('Play');
	}
}
