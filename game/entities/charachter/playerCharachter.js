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
        render: function() {

        },
        walk: function(direction) {
            var player = this;
            var inertia;

            switch(direction) {
                case "foreward": 
                    inertia = 1;
                    break;
                case "backwards":
                    inertia = -1
                    break;
            }

            player.mesh.translateZ(inertia);
            player.mesh.updateMatrix();
        },
        run: function(direction) {
            var player = this;

            player.mesh.translateZ(1.5);
            player.mesh.updateMatrix();
        },
        turn: function(direction) {
            var player = this;

            switch(direction) {
                case "right":
                    player.mesh.rotation.y -= 0.1;
                    break;
                case "left":
                    player.mesh.rotation.y += 0.1;
                    break;
            }
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

            } else {
                if(player.selectedVoxel.edgeHelper) {
                    scene.remove(player.selectedVoxel.edgeHelper);  
                }
                player.selectedVoxel = {
                    mesh: null,
                    edgeHelper: null
                }
            }

        }, 
        controlls: function(playing) {

            playing.keyboard("w", function() {
                playing.charachter.walk("foreward");
                playing.charachter.selectVoxel(playing.scene, playing.gameMap.terrain);        

                playing.cameraControls.target.set(playing.charachter.mesh.position.x, playing.charachter.mesh.position.y, playing.charachter.mesh.position.z);

                var distanceFromChar = playing.camera.position.distanceTo(playing.charachter.mesh.position, new THREE.Vector3(1,-5,0));

                if(distanceFromChar >= 350) {
                    playing.camera.translateZ((distanceFromChar*distanceFromChar*-1)*0.0001);
                }
            });

            playing.keyboard("shift+w", function() {
                playing.charachter.run("foreward");

                playing.cameraControls.target.set(playing.charachter.mesh.position.x, playing.charachter.mesh.position.y, playing.charachter.mesh.position.z);

                var distanceFromChar = playing.camera.position.distanceTo(playing.charachter.mesh.position, new THREE.Vector3(1,-5,0));

                if(distanceFromChar >= 350) {
                    playing.camera.translateZ((distanceFromChar*distanceFromChar*-1)*0.0001);
                }
            });

            playing.keyboard("d", function() {
                playing.charachter.turn("right")
                playing.charachter.selectVoxel(playing.scene, playing.gameMap.terrain);
            });

            playing.keyboard("s", function() {
                playing.charachter.walk("backwards");
                playing.charachter.selectVoxel(playing.scene, playing.gameMap.terrain);

                playing.cameraControls.target.set(playing.charachter.mesh.position.x, playing.charachter.mesh.position.y, playing.charachter.mesh.position.z);

                var distanceFromChar = playing.camera.position.distanceTo(playing.charachter.mesh.position);

                if(distanceFromChar >= 350) {
                    playing.camera.translateZ((distanceFromChar*distanceFromChar*-1)*0.0001);
                }

            });

            playing.keyboard("a", function() {
                playing.charachter.turn("left")
                playing.charachter.selectVoxel(playing.scene, playing.gameMap.terrain);
            });

            playing.keyboard("r", function() {

                if(!playing.charachter.selectedVoxel) return;

                var selectedMesh = playing.gameMap.terrain.getObjectByName(playing.charachter.selectedVoxel.mesh.name)
                
                if(!selectedMesh) return;

                var selectedVoxel = selectedMesh.userData.voxel;
                playing.gameMap.removeVoxel(selectedVoxel);
            });

        }
	}

	return PlayerCharachter;
}