function VoxelScope() {

	var game = appContext.getSingleton("game");

	var voxelSize = 10;
	var cubeGeo = new THREE.BoxGeometry( voxelSize, voxelSize, voxelSize );
	
	var dirtMaterial =  new THREE.MeshLambertMaterial( { color: 0xfeb74c} );
	var rockMaterial =  new THREE.MeshLambertMaterial( { color: 0x50626b} ); 
	var sandMaterial =  new THREE.MeshLambertMaterial( { color: 0xccd37e} );
	var clayMaterial =  new THREE.MeshLambertMaterial( { color: 0xf28a35} );
	var waterMaterial =  new THREE.MeshLambertMaterial( { color: 0xf158ec6} );
	var grassMaterial =  new THREE.MeshLambertMaterial( { color: 0x6db768} ); 
	 
	var Voxel = function(position, type) {

		var material;

		switch(type) {
			case 2:
				material =  grassMaterial;
				break;
			case 3:
				material =  rockMaterial;
				break;
			case 4:
				material =  sandMaterial;
				break;
			case 5:
				material =  clayMaterial;
				break;
			case 6:
				material =  waterMaterial;
				break;
			default:
				material =  dirtMaterial;
		}

		this.mesh = new THREE.Mesh( cubeGeo, material );
		this.mesh.position.x = position.x * voxelSize;
		this.mesh.position.y = position.y * voxelSize;
		this.mesh.position.z = position.z * voxelSize;
		return this;
	}

	return Voxel;

}