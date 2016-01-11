var ClayMaterialScope = function() {

	var ClayMaterial = function() {

		var materialArray = [];

	    // Front
	    materialArray.push(new THREE.MeshLambertMaterial({
	        color:0xf28a35,
	        visible: false
	    }));
	    
	    // Back
	    materialArray.push(new THREE.MeshLambertMaterial({
	        color:0xf28a35,
	        visible: false
	    }));

	    // Top
	    materialArray.push(new THREE.MeshLambertMaterial({
	        color:0xf28a35,
	        visible: false
	    }));

	    // Bottom
	    materialArray.push(new THREE.MeshLambertMaterial({
	        color:0xf28a35,
	        visible: false
	    }));

	    // Right
	    materialArray.push(new THREE.MeshLambertMaterial({
	        color:0xf28a35,
	        visible: false
	    }));
	    
	    // Left
	    materialArray.push(new THREE.MeshLambertMaterial({
	        color:0xf28a35,
	        visible: false
	    }));

		return {
			face: new THREE.MeshFaceMaterial(materialArray),
			materialArray: materialArray
		}
	}

	return ClayMaterial;
}