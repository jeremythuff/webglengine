function VoxelScope() {

	include("game/entities/world/voxelMaterials/dirtMaterial.js", "DirtMaterial", this);
	include("game/entities/world/voxelMaterials/grassMaterial.js", "GrassMaterial", this);
	include("game/entities/world/voxelMaterials/rockMaterial.js", "RockMaterial", this);
	include("game/entities/world/voxelMaterials/sandMaterial.js", "SandMaterial", this);
	include("game/entities/world/voxelMaterials/clayMaterial.js", "ClayMaterial", this);
	include("game/entities/world/voxelMaterials/waterMaterial.js", "WaterMaterial", this);

	var game = appContext.getSingleton("game");

	var voxelSize = 10;
	var cubeGeo = new THREE.BoxGeometry( voxelSize, voxelSize, voxelSize );
	 
	var Voxel = function(position, type) {

		var material;

		switch(type) {
			case 2:
				// Grass
				material =  new GrassMaterial(); 
				break;
			case 3:
				// Rock
				material =  new RockMaterial();
				break;
			case 4:
				// Sand
				material =  new SandMaterial();
				break;
			case 5:
				// Clay
				material =  new ClayMaterial();
				break;
			case 6:
				//water
				material =  new WaterMaterial();
				break;
			default:
				//dirt
				material =  new DirtMaterial();
		}

		this.materialArray = material.materialArray;
		this.mesh = new THREE.Mesh( cubeGeo, material.face );
		this.mesh.position.x = position.x * voxelSize;
		this.mesh.position.y = position.y * voxelSize;
		this.mesh.position.z = position.z * voxelSize;
		
		this.mesh.castShadow = true;
		this.mesh.receiveShadow = true;
		
		return this;
	}

	Voxel.prototype = {
		show: function(face) {

			var voxel = this;
			var index;

			switch(face) {
				case "front":
					voxel.materialArray[0].visible = true;
					break;
				case "back":
					voxel.materialArray[1].visible = true;
					break;
				case "top":
					voxel.materialArray[2].visible = true;
					break;
				case "bottom":
					voxel.materialArray[3].visible = true;
					break;
				case "right":
					voxel.materialArray[4].visible = true;
					break;
				case "left":
					voxel.materialArray[5].visible = true;
					break;
				default:
					for(var index in voxel.materialArray) {
						var face = voxel.materialArray[index];
						face.visible = true;
					}
			}

		},
		hide: function(face) {

			var voxel = this;
			var index;

			switch(face) {
				case "front":
					voxel.materialArray[0].visible = false;
					break;
				case "back":
					voxel.materialArray[1].visible = false;
					break;
				case "top":
					voxel.materialArray[2].visible = false;
					break;
				case "bottom":
					voxel.materialArray[3].visible = false;
					break;
				case "right":
					voxel.materialArray[4].visible = false;
					break;
				case "left":
					voxel.materialArray[5].visible = false;
					break;
				default:
					for(var index in voxel.materialArray) {
						var face = voxel.materialArray[index];
						face.visible = false;
					}
			}

		}
	}

	return Voxel;

}