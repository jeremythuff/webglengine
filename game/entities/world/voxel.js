function VoxelScope() {

	var game = appContext.getSingleton("game");

	var voxelSize = 10;
	var cubeGeo = new THREE.BoxGeometry( voxelSize, voxelSize, voxelSize );
	var cubeMaterial =  new THREE.MeshLambertMaterial( { color: 0xfeb74c} );
	 
	var Voxel = function(position) {
		this.mesh = new THREE.Mesh( cubeGeo, cubeMaterial );
		this.mesh.position.x = position.x * voxelSize;
		this.mesh.position.y = position.y * voxelSize;
		this.mesh.position.z = position.z * voxelSize;
		return this;
	}

	return Voxel;

}