var GameMapScope = function() {

	var engine = appContext.getSingleton("engine");

	var GameMap = function(url) {

		var gameMap = this;

		gameMap.url = url;
		gameMap.data;
		gameMap.meta

		return this;
	}

	GameMap.prototype = {
		init: function(terrain) {

			var gameMap = this;

			engine.utils.xhr(gameMap.url, function(map) {
				var mapObj = JSON.parse(map)
				gameMap.data = mapObj.data;
				gameMap.meta = mapObj.meta;
				
				var xstart = 0;
				var ystart = gameMap.meta.size.y-1;
				var zstart = 0;

				var xpos = xstart;
				var ypos = ystart;
				var zpos = zstart;

				var xlength = gameMap.meta.size.x;
				var ylength = gameMap.meta.size.y;
				var zlength = gameMap.meta.size.z;

				var surface =  false;
				var subLevel = 0;

				buildWorld:
				for(var index = gameMap.data.length-1; index > 0; index--) {

					var voxType = gameMap.data[index];

					if(voxType != 0) {

						var sides = [];

						if(gameMap.data[parseInt(index)-1] == 0 || xpos+1 >= gameMap.meta.size.x) {
							sides.push("front");
						}
						if(gameMap.data[parseInt(index)+1] == 0 || xpos-1 < 0) {
							sides.push("back");
						}

						if(gameMap.data[parseInt(index)-gameMap.meta.size.x] == 0 || zpos+1 >= gameMap.meta.size.z) {
							sides.push("right");
						}
						if(gameMap.data[parseInt(index)+gameMap.meta.size.x] == 0 || zpos-1 < 0) {
							sides.push("left");
						}

						if(gameMap.data[parseInt(index)+(gameMap.meta.size.x*gameMap.meta.size.z)] == 0 || ypos+1 >= gameMap.meta.size.y) {
							sides.push("top");
						}

						if(gameMap.data[parseInt(index)-(gameMap.meta.size.x*gameMap.meta.size.z)] == 0 || ypos-1 < 0) {
							sides.push("bottom");
						}

						if(sides.length > 0) {
							var position = new THREE.Vector3(xpos-(xlength/2),ypos-ylength,zpos-(zlength/2));
							var voxel = new Voxel(position, voxType);
							voxel.mesh.name = index;

							for(var i in sides)  {
								voxel.show(sides[i]);
							}

							terrain.add(voxel.mesh);
						}

					} else {
						surface == true;
					}

					xpos++;
					if(xpos == xlength) {
						xpos = xstart;
						zpos++;
						if(zpos == zlength) {
							zpos = zstart;
							ypos--;
							if(surface == false) {
								subLevel++
								console.log(subLevel);
								if(subLevel > 2) break buildWorld;
							}
							surface = false;
						}					
					}
				}

			});

		},
		findNeighbor: function(index, side) {

			var neighbor = {}

			switch(side) {
				case "front":


					var eighbor
					var type = gameMap.data[parseInt(index)-1]

					break
				case "back":
					break
				case "left":
					break
				case "right":
					break
				case "top":
					break
				case "bottom":
					break
				default:
			}

		}
	}


	return GameMap;
}