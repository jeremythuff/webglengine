var PlayerCharachterScope = function() {

	var charGeo = new THREE.BoxGeometry( 10, 20, 10 );
	//var charMaterial = new THREE.MeshLambertMaterial( { color: 0xd8675d} );

	var materialArray = [];

    // Front
    materialArray.push(new THREE.MeshLambertMaterial({
        color:0x00ff00,
    }));
    
    // Back
    materialArray.push(new THREE.MeshLambertMaterial({
        color:0xd8675d,
    }));

    // Top
    materialArray.push(new THREE.MeshLambertMaterial({
        color:0xd8675d,
    }));

    // Bottom
    materialArray.push(new THREE.MeshLambertMaterial({
        color:0xd8675d,
    }));

    // Right
    materialArray.push(new THREE.MeshLambertMaterial({
        color:0xd8675d,
    }));
    
    // Left
    materialArray.push(new THREE.MeshLambertMaterial({
        color:0xd8675d,
    }));

    var charMaterial = new THREE.MeshFaceMaterial(materialArray);
	
	var PlayerCharachter = function() {
		
		var player = this;

		player.mesh = null;

		return this;
	}

	PlayerCharachter.prototype = {
		init: function(position, cb) {

			var player = this;

			player.mesh = new THREE.Mesh( charGeo, charMaterial );
			player.mesh.position.set(position.x, position.y, position.z);
			player.mesh.castShadow = true;

			if(cb) cb();
		}
	}

	return PlayerCharachter;
}