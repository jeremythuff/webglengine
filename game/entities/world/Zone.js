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

		console.log(zone);

		var chunkWidth = zone.meta.chunk.size.x * zone.meta.voxel.size;
		var chunkHeight = zone.meta.chunk.size.z * zone.meta.voxel.size;

		console.log(chunkWidth);
		console.log(chunkHeight);

		var zoneWidth = zone.meta.zone.size.x * chunkWidth;
		var zoneHeight = zone.meta.zone.size.y * chunkHeight;

		console.log(zoneWidth);
		console.log(zoneWidth);

		var xStart = 0 - (zoneWidth/zone.meta.zone.size.x);
		var yStart = 0 + (zoneHeight/zone.meta.zone.size.y);

		console.log(xStart);
		console.log(yStart);

		var xPos = xStart;
		var yPos = yStart;

		for(var i=0; i<numberOfChunks; i++) {

			var location = {
				x: xPos,
				y: yPos
			}

			zone.chunks[i] = new Chunk(zone.url+"/"+(i+1)+".json", location);
			console.log(location);
			
			if(i == zone.meta.playerStart.chunk-1) zone.currentChunk = zone.chunks[i];

			(function (i) {
				
				engine.utils.xhr(zone.chunks[i].url, function(chunkData) {				

					zone.chunks[i].init(zone, chunkData);

					if(i == numberOfChunks-1) {
						zone.currentChunk.reify(function() {
							zone.initialized = true;
							cb();
						});
						
					}	
				});

			})(i);

			xPos += chunkWidth;
			var count = (i+1);
			if(count%zone.meta.zone.size.x==0) {
				xPos = xStart;
				yPos -= chunkWidth;
			}
			
			
		}

	};

	return Zone;
};