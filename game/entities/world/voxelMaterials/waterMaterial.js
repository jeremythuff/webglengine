var WaterMaterialScope = function() {

	var WaterMaterial = function() {

		var materialArray = [];

	    // Front
	    materialArray.push(new THREE.MeshLambertMaterial({ 
	    	color: 0xf158ec6,  
	    	opacity:0.75, 
	    	transparent: true}));
	    
	    // Back
	    materialArray.push(new THREE.MeshLambertMaterial({ 
	    	color: 0xf158ec6,  
	    	opacity:0.75, 
	    	transparent: true}));

	    // Top
	    materialArray.push(new THREE.MeshLambertMaterial({ 
	    	color: 0xf158ec6,  
	    	opacity:0.75, 
	    	transparent: true}));

	    // Bottom
	    materialArray.push(new THREE.MeshLambertMaterial({ 
	    	color: 0xf158ec6,  
	    	opacity:0.75, 
	    	transparent: true}));

	    // Right
	    materialArray.push(new THREE.MeshLambertMaterial({ 
	    	color: 0xf158ec6,  
	    	opacity:0.75, 
	    	transparent: true}));
	    
	    // Left
	    materialArray.push(new THREE.MeshLambertMaterial({ 
	    	color: 0xf158ec6,  
	    	opacity:0.75, 
	    	transparent: true}));

		return {
			face: new THREE.MeshFaceMaterial(materialArray),
			materialArray: materialArray
		}
	}

	return WaterMaterial;
}