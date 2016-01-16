var ChunkScope = function() {

	include("game/entities/world/Voxel.js", "Voxel", this);

	var Chunk = function(url, location) {

		var chunk = this;

		var urlArray = url.replace(".json", "").split("/");

		chunk.id = urlArray[urlArray.length-1];

		chunk.url = url;
		chunk.meta = {};
		chunk.data = [];
		chunk.live = false;
		chunk.initialized = false;
		chunk.worldLocation = {
			x: location.x,
			z: location.z
		}

		return this;
	}

	Chunk.prototype = {
		init: function(zone, chunkData) {

			var chunk = this;

			var chunkDataObj = JSON.parse(chunkData);

			chunk.data = chunkDataObj;
			chunk.meta = zone.meta.chunk;
			chunk.parentZone = zone;
			
			chunk.build(function() {
				chunk.initialized = true;
			});

		}, 
		reify: function(cb) {

			var chunk = this;

			chunk.live = true;


			chunk.build(function() {
				chunk.initialized = true;
				cb();
			});

			
		},
		build: function(cb) {

			var chunk = this;

			var xstart = chunk.worldLocation.x;
			var ystart = chunk.meta.size.y;
			var zstart = chunk.worldLocation.z;

			var location = {
				x: xstart,
				y: ystart,
				z: zstart
			}

			var xpos = xstart;

			var xlength = chunk.meta.size.x;
			var ylength = chunk.meta.size.y;
			var zlength = chunk.meta.size.z;

			var surface =  false;
			var subLevel = 0;

			var xCount = 0;
			var zCount = 0;

			buildWorld:
			for(var index = chunk.data.length-1; index >= 0; index--) {

				var voxType = chunk.data[index];
				if(voxType != 0) {
					
					var voxelMesh = chunk.addVoxel(location, voxType, index);
					
				} else {
					surface == true;
				}

				location.x++;
				xCount++;
				if(xCount%chunk.meta.size.x == 0) {
					location.x = xstart;
					zCount++;
					location.z++;
					if(zCount%chunk.meta.size.z == 0) {
						location.z = zstart;
						location.y--;
						if(surface == false) {
							subLevel++
							if(subLevel > 2) break buildWorld;
						}
						surface = false;
					}					
				}
			}

			if(cb) cb();

		},
		addVoxel: function(location, type, name) {

			var chunk = this;

			var sides = [];

			if(chunk.findNeighbor(name, "front").type == 0 || location.x+1 >= chunk.meta.size.x + chunk.worldLocation.x) {
				sides.push("front");
			}
			if(chunk.findNeighbor(name, "back").type == 0 || location.x-1 < 0 + chunk.worldLocation.x) {
				sides.push("back");
			}

			if(chunk.findNeighbor(name, "right").type == 0 || location.z+1 >= chunk.meta.size.z + chunk.worldLocation.z) {
				sides.push("right");
			}
			if(chunk.findNeighbor(name, "left").type == 0 || location.z-1 < 0 + chunk.worldLocation.z) {
				sides.push("left");
			}

			if(chunk.findNeighbor(name, "top").type == 0 || location.y == chunk.meta.size.y) {
				sides.push("top");
			}
			if(chunk.findNeighbor(name, "bottom").type == 0 || location.y == 1) {
				sides.push("bottom");
			}

			var adjustedLocation = {
				x: location.x - (chunk.meta.size.x/2),
				y: location.y - chunk.meta.size.y,
				z: location.z - (chunk.meta.size.z/2)
			}
			
			var voxel = new Voxel(adjustedLocation, type);
			voxel.mesh.name = name.toString();
				if(sides.length > 0) {
				for(var i in sides)  {
					voxel.show(sides[i]);
				}
			}

			chunk.parentZone.terrain.add(voxel.mesh);
			
			
		},
		removeVoxel: function(voxel) {
			var chunk = this;

			chunk.parentZone.terrain.remove(voxel.mesh);

			var neighborsObj = chunk.findNeighbors(voxel.mesh.name);

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

			var chunk = this;
			var neighbor = {}
			neighbor.name = -1;

			switch(side) {
				case "front":
					var index = parseInt(index)-1;
					neighbor.name = index.toString()
					neighbor.type = chunk.data[neighbor.name];
					break
				case "back":
					var index = parseInt(index)+1;
					neighbor.name = index.toString()
					neighbor.type = chunk.data[neighbor.name];
					break
				case "right":
					var index = parseInt(index)-chunk.meta.size.x;
					neighbor.name = index.toString()
					neighbor.type = chunk.data[neighbor.name];
					break
				case "left":
					var index = parseInt(index)+chunk.meta.size.x;
					neighbor.name = index.toString()
					neighbor.type = chunk.data[neighbor.name];
					break
				case "top":
					var index = parseInt(index)+(chunk.meta.size.x*chunk.meta.size.z);
					neighbor.name = index.toString()
					neighbor.type = chunk.data[neighbor.name];
					break
				case "bottom":
					var index = parseInt(index)-(chunk.meta.size.x*chunk.meta.size.z);
					neighbor.name = index.toString()
					neighbor.type = chunk.data[neighbor.name];
					break
				default: 
					neighbor.type = 0;
			}

			if(neighbor.name < 0 || neighbor.name >= chunk.data.length) neighbor.name = undefined;

			return neighbor;
		},
		findNeighbors: function(index) {

			var chunk = this;
			var neighbors = {
				front: {},
				back: {},
				right: {},
				left: {},
				top: {},
				bottom: {},
			};

			var front = chunk.findNeighbor(index, "front");
			neighbors.front.name = front.name;
			neighbors.front.type = front.type;

			var back = chunk.findNeighbor(index, "back");
			neighbors.back.name = back.name;
			neighbors.back.type = back.type;

			var right = chunk.findNeighbor(index, "right");
			neighbors.right.name = right.name;
			neighbors.right.type = right.type;

			var left = chunk.findNeighbor(index, "left");
			neighbors.left.name = left.name;
			neighbors.left.type = left.type;

			var top = chunk.findNeighbor(top, "top");
			neighbors.top.name = top.name;
			neighbors.top.type = top.type;

			var bottom = chunk.findNeighbor(index, "bottom");
			neighbors.bottom.name = bottom.name;
			neighbors.bottom.type = bottom.type;

			chunk.terrain.traverse (function (object) {
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
	};

	return Chunk;
}