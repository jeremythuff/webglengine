var GameMapScope = function() {

	include("game/entities/world/Zone.js", "Zone", this);
	include("game/entities/world/Voxel.js", "Voxel", this);

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
		},
		removeVoxel: function(voxel) {

			var gameMap = this;

			var voxelNameParts = voxel.mesh.name.split(".");
			var chunklID = voxelNameParts[0];
			var voxelID = voxelNameParts[1];

			var chunk = gameMap.currentZone.chunks[parseInt(chunklID)-1];

			chunk.removeVoxel(voxel);
						
		}
	}

	var buildZones = function(gameMap, cb) {

		var numberOfZones = gameMap.meta.zone.size.x * gameMap.meta.zone.size.y;

		for(var i=0; i<numberOfZones; i++) {
			
			gameMap.zones[i] = new Zone(gameMap.baseUrl+"/"+(i+1));
			var thisZone = gameMap.zones[i];

			for(var type in gameMap.meta.voxel.types) {
				thisZone.archetypes[gameMap.meta.voxel.types[type]] = new Voxel({x:0,y:0,z:0}, gameMap.meta.voxel.types[type]).mesh;
				delete thisZone.archetypes[gameMap.meta.voxel.types[type]].userData.voxel;
				console.log(thisZone.archetypes[gameMap.meta.voxel.types[type]].userData);
			}

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