// The GameOver state and its methods
var GameOver = function(game) {};
GameOver.prototype = {
	init: function(score) {
		// Add the background and make it properly cover the canvas
		//game.add.tileSprite(0,0, game.world.width, game.world.height, 'background');

		// Add GameOver text
		this.endText = game.add.text(16,16, 'Fin' + '\nPress Space To Restart', { fontSize: '32px', fill: '#000'});
		this.endText.alpha = 0;
	},
	create: function() {
		this.end = game.add.sprite(200, 0, 'endImg');
		this.end.scale.x = 0.3;
		this.end.scale.y = 0.3;
		this.end.alpha = 0;
		game.add.tween(this.end).to({alpha: 1}, 5000, Phaser.Easing.Linear.None, true);
		game.add.tween(this.endText).to({alpha: 1}, 5000, Phaser.Easing.Linear.None, true);
	},
	update: function() {
		// Check for spacebar to go back to Play state
		if (game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR))
			game.state.start('Play');
	}
}
