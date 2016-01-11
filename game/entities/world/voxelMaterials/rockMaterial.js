var RockMaterialScope = function() {

	var RockMaterial = function() {

		var materialArray = [];

	    // Front
	    materialArray.push(new THREE.MeshLambertMaterial({
	        color:0x50626b,
	        visible: false
	    }));
	    
	    // Back
	    materialArray.push(new THREE.MeshLambertMaterial({
	        color:0x50626b,
	        visible: false
	    }));

	    // Top
	    materialArray.push(new THREE.MeshLambertMaterial({
	        color:0x50626b,
	        visible: false
	    }));

	    // Bottom
	    materialArray.push(new THREE.MeshLambertMaterial({
	        color:0x50626b,
	        visible: false
	    }));

	    // Right
	    materialArray.push(new THREE.MeshLambertMaterial({
	        color:0x50626b,
	        visible: false
	    }));
	    
	    // Left
	    materialArray.push(new THREE.MeshLambertMaterial({
	        color:0x50626b,
	        visible: false
	    }));

		return {
			face: new THREE.MeshFaceMaterial(materialArray),
			materialArray: materialArray
		}
	}

	return RockMaterial;
}