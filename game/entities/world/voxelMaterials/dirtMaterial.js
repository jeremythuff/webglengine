var DirtMaterialScope = function() {

	var DirtMaterial = function() {

		var materialArray = [];

	    // Front
	    materialArray.push(new THREE.MeshLambertMaterial({
	        color:0xfeb74a,
	        visible: false
	    }));
	    
	    // Back
	    materialArray.push(new THREE.MeshLambertMaterial({
	        color:0xfeb74a,
	        visible: false
	    }));

	    // Top
	    materialArray.push(new THREE.MeshLambertMaterial({
	        color:0xfeb74a,
	        visible: false
	    }));

	    // Bottom
	    materialArray.push(new THREE.MeshLambertMaterial({
	        color:0xfeb74a,
	        visible: false
	    }));

	    // Right
	    materialArray.push(new THREE.MeshLambertMaterial({
	        color:0xfeb74a,
	        visible: false
	    }));
	    
	    // Left
	    materialArray.push(new THREE.MeshLambertMaterial({
	        color:0xfeb74a,
	        visible: false
	    }));

		return {
			face: new THREE.MeshFaceMaterial(materialArray),
			materialArray: materialArray
		}
	}

	return DirtMaterial;
}