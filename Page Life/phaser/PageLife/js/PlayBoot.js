//Boot.js
var PlayBoot = function(game) {};
PlayBoot.prototype = {

	create: function(){
		game.stage.setBackgroundColor('#fff');
		game.add.image(0, 0, 'BGIMG');

		///////////
		//TILEMAP//
		///////////

		// create new Tilemap objects - when using Tiled, you only need to pass the key
		this.map = game.add.tilemap('level');

		// add an image to the maps to be used as a tileset (tileset, key)
    // the tileset name is specified w/in the .json file (or in Tiled)
    // a single map may use multiple tilesets
    this.map.addTilesetImage('collision', 'noCollusion');


    // set ALL tiles to collide *except* those passed in the array
    this.map.setCollisionByExclusion([]);

    // create new TilemapLayer object
    // A Tilemap Layer is a set of map data combined with a tileset
    this.mapLayer = this.map.createLayer('collision');
		this.map.layers[0].visible = false;
		this.mapLayer.alpha = 0;

    // set the world size to match the size of the Tilemap layer
    this.mapLayer.resizeWorld();

		this.state.start('Play', false, false, this.map, this.mapLayer);
	}
}
