var GrassMaterialScope = function() {

	var GrassMaterial = function() {

		var materialArray = [];

	    // Front
	    materialArray.push(new THREE.MeshLambertMaterial({
	        color:0x6db768,
	        visible: false
	    }));
	    
	    // Back
	    materialArray.push(new THREE.MeshLambertMaterial({
	        color:0x6db768,
	        visible: false
	    }));

	    // Top
	    materialArray.push(new THREE.MeshLambertMaterial({
	        color:0x6db768,
	        visible: false
	    }));

	    // Bottom
	    materialArray.push(new THREE.MeshLambertMaterial({
	        color:0x6db768,
	        visible: false
	    }));

	    // Right
	    materialArray.push(new THREE.MeshLambertMaterial({
	        color:0x6db768,
	        visible: false
	    }));
	    
	    // Left
	    materialArray.push(new THREE.MeshLambertMaterial({
	        color:0x6db768,
	        visible: false
	    }));

		return {
			face: new THREE.MeshFaceMaterial(materialArray),
			materialArray: materialArray
		}
	}

	return GrassMaterial;
}