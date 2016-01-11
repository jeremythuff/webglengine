var SandMaterialScope = function() {

	var SandMaterial = function() {

		var materialArray = [];

	    // Front
	    materialArray.push(new THREE.MeshLambertMaterial({
	        color:0xccd37e,
	        visible: false
	    }));
	    
	    // Back
	    materialArray.push(new THREE.MeshLambertMaterial({
	        color:0xccd37e,
	        visible: false
	    }));

	    // Top
	    materialArray.push(new THREE.MeshLambertMaterial({
	        color:0xccd37e,
	        visible: false
	    }));

	    // Bottom
	    materialArray.push(new THREE.MeshLambertMaterial({
	        color:0xccd37e,
	        visible: false
	    }));

	    // Right
	    materialArray.push(new THREE.MeshLambertMaterial({
	        color:0xccd37e,
	        visible: false
	    }));
	    
	    // Left
	    materialArray.push(new THREE.MeshLambertMaterial({
	        color:0xccd37e,
	        visible: false
	    }));

		return {
			face: new THREE.MeshFaceMaterial(materialArray),
			materialArray: materialArray
		}
	}

	return SandMaterial;
}