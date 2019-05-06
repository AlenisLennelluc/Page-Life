var game = new Phaser.Game(600, 800, Phaser.AUTO);

// Global Variables
var platforms;
var player;
var cursors;
var stars;
var diamonds;
var scoreText;
var doggos;
var pickupSound;
var snowflakes;

// Setup game states
game.state.add('MainMenu', MainMenu);
game.state.add('Play', Play);
game.state.add('GameOver', GameOver);
game.state.start('MainMenu');


// If player overlaps star, remove star and give player 10 more points
function collectStar (player, star) {
	star.kill();

	this.score += 10;
	scoreText.text = 'Score: ' + this.score;
	pickupSound.play();

	// If there are no living stars, end the game
	if (stars.countLiving() == 0)
	{
		game.state.start('GameOver', true, false, this.score);
	}
}


// If player overlaps diamond, remove diamond and give player 50 more points
function collectDiamond (player, diamond) {
	diamond.kill();

	this.score += 50;
	scoreText.text = 'Score: ' + this.score;
	pickupSound.play();
}


// If player kicks a doggo, call animal control to rescue doggo and eject player from game
function collectDoggos (player, doggo) {
	this.score -= 25;
	game.state.start('GameOver', true, false, this.score);
}
