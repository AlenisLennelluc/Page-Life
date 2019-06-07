//Boot.js

var Boot = function(game) {};
Boot.prototype = {
	preload: function() {
	},
	create: function() {
		game.state.start('Load');
	}
};
