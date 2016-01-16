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

		// zone.chunks[0] = new Chunk(zone.url+"/1.json", {x:0, z:0});
		// engine.utils.xhr(zone.chunks[0].url, function(chunkData) {	
		// 	zone.chunks[0].init(zone, chunkData);
		// 	cb();
		// });

		// zone.chunks[1] = new Chunk(zone.url+"/2.json", {x:0, z:10});
		// engine.utils.xhr(zone.chunks[1].url, function(chunkData) {	
		// 	zone.chunks[1].init(zone, chunkData);
		// 	cb();
		// });
 

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

			console.log(zone.currentChunk);

			(function(i){

				engine.utils.xhr(zone.chunks[i].url, function(chunkData) {	

					zone.chunks[i].init(zone, chunkData);
					loaded++;
					if(loaded == numberOfChunks) {
						zone.currentChunk.reify(function() {
							zone.initialized = true;
							cb();
						});
						cb();
					}			
				});

			})(i)

		}


		// for(var i=0; i<numberOfChunks; i++) {

		// 	zone.chunks[i] = new Chunk(zone.url+"/"+(i+1)+".json", location);
			
		// 	if(i == zone.meta.playerStart.chunk-1) zone.currentChunk = zone.chunks[i];
		// 	var loaded = 0;
		// 	(function (i) {
				
				// engine.utils.xhr(zone.chunks[i].url, function(chunkData) {	

				// 	zone.chunks[i].init(zone, chunkData);
				// 	loaded++;
				// 	if(loaded == numberOfChunks) {
				// 		zone.currentChunk.reify(function() {
				// 			zone.initialized = true;
				// 			cb();
				// 		});
				// 	}

		// 		});

		// 	})(i);

		// 	location.x += zone.meta.chunk.size.x;
		// 	var count = (i+1);
		// 	if(count%zone.meta.zone.size.x==0) {
		// 		location.x = 0;
		// 		location.z -= zone.meta.chunk.z;
		// 	}
			
		// }

	};

	return Zone;
};