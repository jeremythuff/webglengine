var GameMapScope = function() {

	var engine = appContext.getSingleton("engine");

	var GameMap = function(url) {

		var gameMap = this;

		gameMap.url = url;
		gameMap.data;
		gameMap.terrain;
		gameMap.meta

		return this;
	}

	GameMap.prototype = {
		init: function(terrain, cb) {

			var gameMap = this;
			gameMap.terrain = terrain;

			engine.utils.xhr(gameMap.url, function(map) {
				
				var mapObj = JSON.parse(map)

				gameMap.data = mapObj.data;
				gameMap.meta = mapObj.meta;
				
				var xstart = 0;
				var ystart = gameMap.meta.size.y-1;
				var zstart = 0;

				var location = {
					x: xstart,
					y: ystart,
					z: zstart
				}

				var xpos = xstart;
				// var ypos = ystart;
				// var zpos = zstart;

				var xlength = gameMap.meta.size.x;
				var ylength = gameMap.meta.size.y;
				var zlength = gameMap.meta.size.z;

				var surface =  false;
				var subLevel = 0;

				buildWorld:
				for(var index = gameMap.data.length-1; index > 0; index--) {

					var voxType = gameMap.data[index];

					if(voxType != 0) {
						gameMap.addVoxel(location, voxType, index);
					} else {
						surface == true;
					}

					location.x++;
					if(location.x == xlength) {
						location.x = xstart;
						location.z++;
						if(location.z == zlength) {
							location.z = zstart;
							location.y--;
							if(surface == false) {
								subLevel++
								console.log(subLevel);
								if(subLevel > 2) break buildWorld;
							}
							surface = false;
						}					
					}
				}
				
				if(cb) cb();
			
			});

			

		},
		addVoxel: function(location, type, name) {

			var gameMap = this;

			var sides = [];

			if(gameMap.findNeighbor(name, "front").type == 0 || location.x+1 >= gameMap.meta.size.x) {
				sides.push("front");
			}
			if(gameMap.findNeighbor(name, "back").type == 0 || location.x-1 < 0) {
				sides.push("back");
			}

			if(gameMap.findNeighbor(name, "right").type == 0 || location.z+1 >= gameMap.meta.size.z) {
				sides.push("right");
			}
			if(gameMap.findNeighbor(name, "left").type == 0 || location.z-1 < 0) {
				sides.push("left");
			}

			if(gameMap.findNeighbor(name, "top").type == 0 || location.y+1 >= gameMap.meta.size.y) {
				sides.push("top");
			}

			if(gameMap.findNeighbor(name, "bottom").type == 0 || location.y-1 < 0) {
				sides.push("bottom");
			}

			

				var adjustedLocation = {
					x: location.x - (gameMap.meta.size.x/2),
					y: location.y - gameMap.meta.size.y,
					z: location.z - (gameMap.meta.size.z/2)
				}
				
				var voxel = new Voxel(adjustedLocation, type);
				voxel.mesh.name = name.toString();
					if(sides.length > 0) {
					for(var i in sides)  {
						voxel.show(sides[i]);
					}
				}

				gameMap.terrain.add(voxel.mesh);
			
			
		},
		removeVoxel: function(voxel) {
			var gameMap = this;

			gameMap.terrain.remove(voxel.mesh);

			var neighborsObj = gameMap.findNeighbors(voxel.mesh.name);

			for(var side in neighborsObj) {
				
				var neighborObj = neighborsObj[side];

				if(neighborObj.mesh) {
					if(side == "front") neighborObj.mesh.userData.voxel.show("back");
					if(side == "back") neighborObj.mesh.userData.voxel.show("front");

					if(side == "right") neighborObj.mesh.userData.voxel.show("left");
					if(side == "left") neighborObj.mesh.userData.voxel.show("right");

					if(side == "top") neighborObj.mesh.userData.voxel.show("bottom");
					if(side == "bottom") neighborObj.mesh.userData.voxel.show("top");
				}	
			}

			//if it did not find a neighbor object check to see if it should be on the map and create it if it should


		},
		findNeighbor: function(index, side) {

			var gameMap = this;
			var neighbor = {}
			neighbor.name = -1;

			switch(side) {
				case "front":
					var index = parseInt(index)-1;
					neighbor.name = index.toString()
					neighbor.type = gameMap.data[neighbor.name];
					break
				case "back":
					var index = parseInt(index)+1;
					neighbor.name = index.toString()
					neighbor.type = gameMap.data[neighbor.name];
					break
				case "right":
					var index = parseInt(index)-gameMap.meta.size.x;
					neighbor.name = index.toString()
					neighbor.type = gameMap.data[neighbor.name];
					break
				case "left":
					var index = parseInt(index)+gameMap.meta.size.x;
					neighbor.name = index.toString()
					neighbor.type = gameMap.data[neighbor.name];
					break
				case "top":
					var index = parseInt(index)+(gameMap.meta.size.x*gameMap.meta.size.z);
					neighbor.name = index.toString()
					neighbor.type = gameMap.data[neighbor.name];
					break
				case "bottom":
					var index = parseInt(index)-(gameMap.meta.size.x*gameMap.meta.size.z);
					neighbor.name = index.toString()
					neighbor.type = gameMap.data[neighbor.name];
					break
				default: 
					neighbor.type = 0;
			}

			if(neighbor.name < 0 || neighbor.name >= gameMap.data.length) neighbor.name = undefined;

			return neighbor;
		},
		findNeighbors: function(index) {

			var gameMap = this;
			var neighbors = {
				front: {},
				back: {},
				right: {},
				left: {},
				top: {},
				bottom: {},
			};

			var front = gameMap.findNeighbor(index, "front");
			neighbors.front.name = front.name;
			neighbors.front.type = front.type;

			var back = gameMap.findNeighbor(index, "back");
			neighbors.back.name = back.name;
			neighbors.back.type = back.type;

			var right = gameMap.findNeighbor(index, "right");
			neighbors.right.name = right.name;
			neighbors.right.type = right.type;

			var left = gameMap.findNeighbor(index, "left");
			neighbors.left.name = left.name;
			neighbors.left.type = left.type;

			var top = gameMap.findNeighbor(top, "top");
			neighbors.top.name = top.name;
			neighbors.top.type = top.type;

			var bottom = gameMap.findNeighbor(index, "bottom");
			neighbors.bottom.name = bottom.name;
			neighbors.bottom.type = bottom.type;

			gameMap.terrain.traverse (function (object) {
				if(object.name == neighbors.front.name) {
					neighbors.front.mesh = object;
				}
				if(object.name == neighbors.back.name) {
					neighbors.back.mesh = object;
				}

				if(object.name == neighbors.right.name) {
					neighbors.right.mesh = object;
				}
				if(object.name == neighbors.left.name) {
					neighbors.left.mesh = object;
				}

				if(object.name == neighbors.top.name) {
					neighbors.bottom.mesh = object;
				}
				if(object.name == neighbors.bottom.name) {
					neighbors.bottom.mesh = object;
				}
			});


			return neighbors;
		}
	}


	return GameMap;
}