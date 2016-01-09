function VoxelScope() {

	var game = appContext.getSingleton("game");

	var cubeGeo = new THREE.BoxGeometry( 5, 5, 5 );
	var cubeMaterial =  new THREE.MeshLambertMaterial( { color: 0xfeb74c} );
	 
	var Voxel = function(position) {
		this.mesh = new THREE.Mesh( cubeGeo, cubeMaterial );
		this.mesh.position.x = position.x;
		this.mesh.position.y = position.y;
		this.mesh.position.z = position.z;
		return this;
	}

	return Voxel;

}