var PlayerCharachterScope = function() {

	var charGeo = new THREE.BoxGeometry( 10, 20, 10 );
	//var charMaterials = new THREE.MeshLambertMaterial( { color: 0xd8675d} );

	var materialArray = [];

    // Right
    materialArray.push(new THREE.MeshLambertMaterial({
        color: 0xd8675d
    }));
    
    // Left
    materialArray.push(new THREE.MeshLambertMaterial({
        color:0xd8675d
    }));

    // Top
    materialArray.push(new THREE.MeshLambertMaterial({
        color:0xd8675d
    }));

    // Bottom
    materialArray.push(new THREE.MeshLambertMaterial({
        color:0xd8675d
    }));

     // Front
    materialArray.push(new THREE.MeshLambertMaterial({
        color: 0x00ff00
    }));
    
    // Back
    materialArray.push(new THREE.MeshLambertMaterial({
        color:0xd8675d
    }));

    var charMaterials = new THREE.MeshFaceMaterial(materialArray);
	
	var PlayerCharachter = function() {
		
		var player = this;

		player.mesh = null;
        player.selectedVoxel = {
            mesh: null,
            edgeHelper: null
        }

		return this;
	}

	PlayerCharachter.prototype = {
		init: function(position, cb) {

			var player = this;

			player.materials = materialArray;
			
			player.mesh = new THREE.Mesh( charGeo, charMaterials );
			player.mesh.position.set(position.x, position.y, position.z);
			player.mesh.castShadow = true;

			if(cb) cb();
		},
        selectVoxel: function(scene, terrain) {

            var player = this;
            var position = player.mesh.getWorldPosition();
            var direction = player.mesh.getWorldDirection();


            player.mesh.updateMatrixWorld( true );
                    
            player.raycaster.set(new THREE.Vector3(position.x, position.y  -5, position.z), new THREE.Vector3( direction.x, -0.5, direction.z));
            player.intersects = player.raycaster.intersectObject (terrain, true);


            if(player.intersects[0]) {

                if(player.selectedVoxel.edgeHelper) {
                    scene.remove(player.selectedVoxel.edgeHelper);  
                }

                player.selectedVoxel.mesh = player.intersects[0].object;
                player.selectedVoxel.edgeHelper = new THREE.EdgesHelper(player.selectedVoxel.mesh, 0xff9d00);

                player.selectedVoxel.edgeHelper.material.linewidth = 5;
                scene.add( player.selectedVoxel.edgeHelper);

            }

        }
	}

	return PlayerCharachter;
}