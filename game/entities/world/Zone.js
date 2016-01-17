var ZoneScope = function() {

	include("game/entities/world/Chunk.js", "Chunk", this);

	var engine = appContext.getSingleton("engine");

	var Zone = function(baseUrl) {

		var zone = this;

		var urlArray = baseUrl.split("/");

		zone.id = urlArray[urlArray.length-1];
		zone.meta;
		zone.url = baseUrl;
		zone.currentChunk;
		zone.archetypes = {};
		zone.chunks = {};
		zone.initialized = false;

		zone.terrain;

		return this;
	};

	Zone.prototype = {
		init: function(gameMap, cb) {

			var zone = this;

			zone.meta = gameMap.meta;
			zone.terrain = gameMap.terrain;

			buildChunks(zone, cb);	
			
		}
	};

	var buildChunks = function(zone, cb) {

		var numberOfChunks = zone.meta.zone.size.x * zone.meta.zone.size.y;

		var xStart = 0;

		var location = {
			x: 0,
			z: 0
		}

		var loaded = 0;
		for(var i=0; i<numberOfChunks; i++) {

			zone.chunks[i] = new Chunk(zone.url+"/"+(i+1)+".json", location);

			location.x += zone.meta.chunk.size.x;
			if(location.x == zone.meta.chunk.size.x * zone.meta.zone.size.x) {
				location.x = xStart;
				location.z += zone.meta.chunk.size.z;
			}

			if(i == zone.meta.playerStart.chunk-1) zone.currentChunk = zone.chunks[i];

			(function(i){

				engine.utils.xhr(zone.chunks[i].url, function(chunkData) {	

					zone.chunks[i].init(zone, chunkData);
					loaded++;
					if(loaded == numberOfChunks) {
						zone.currentChunk.reify(function() {
							zone.initialized = true;
							cb();
						});
					}			
				});

			})(i)

		}

	};

	return Zone;
};