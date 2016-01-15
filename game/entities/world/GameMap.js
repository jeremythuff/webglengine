var GameMapScope = function() {

	include("game/entities/world/Zone.js", "Zone", this);

	var engine = appContext.getSingleton("engine");

	var GameMap = function(baseUrl) {

		var gameMap = this;

		gameMap.baseUrl = baseUrl;
		gameMap.initialized = false;
		gameMap.currentZone = null;
		gameMap.terrain;
		gameMap.zones = {};

		return  this;

	}

	GameMap.prototype = {
		init: function(terrain, cb) {

			var gameMap = this;
			gameMap.terrain = terrain;

			engine.utils.xhr(gameMap.baseUrl+"/meta.json", function(meta) {
				gameMap.meta = JSON.parse(meta);
				buildZones(gameMap, function() {
					GameMap.initialized = true;
					cb();	
				});
				
			});
		}
	}

	var buildZones = function(gameMap, cb) {

		var numberOfZones = gameMap.meta.zone.size.x * gameMap.meta.zone.size.y;

		for(var i=0; i<numberOfZones; i++) {
			
			gameMap.zones[i] = new Zone(gameMap.baseUrl+"/"+(i+1));
			var thisZone = gameMap.zones[i];

			if(i == gameMap.meta.playerStart.zone-1) {
				gameMap.currentZone = thisZone;
				gameMap.currentZone.init(gameMap, function() {
					gameMap.initialized = true;
					cb();
				});
			}
		} 

	}

	return GameMap;

}