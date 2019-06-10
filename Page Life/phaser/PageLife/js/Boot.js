//Boot.js
var Boot = function(game) {};
Boot.prototype = {

	preload: function() {
		game.load.path = 'assets/img/';
		//Title needs to be loaded first
		game.load.image('loadTitle', 'bigTITLE.png');
	},

	create: function(){
		this.state.start('Load');
	}
}
