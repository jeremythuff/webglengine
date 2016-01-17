function PlayingScope() {

	include("engine/model/State.js", "State", this);
	
	include("game/entities/world/Sky.js", "Sky", this);
	include("game/entities/world/GameMap.js", "GameMap", this);
	include("game/entities/world/Voxel.js", "Voxel", this);
	
	include("game/entities/charachter/PlayerCharachter.js", "PlayerCharachter", this);

	var engine = appContext.getSingleton("engine");
	var game = appContext.getSingleton("game");
	var playing = new State("Playing");

	playing.registerInitCB(function() {

		//if the playing state has already been inititialized then return control and skip 
		
		engine.utils.toggleRenderStats(true);

		if(playing.initialized) {
			playing.activeControll(true);
			return;
		}

		//setup debug info
		playing.debugElem = document.createElement("div");
		playing.debugElem.classList.add('debug');
		document.body.appendChild(playing.debugElem); 

		//create camera
		playing.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 20000 );
		if(!playing.cameraControls) playing.cameraControls = new THREE.OrbitControls( playing.camera );

		playing.camera.position.x = 170;
		playing.camera.position.y = 100;
		playing.camera.position.z = 170;

		//configure renderer
		game.renderer.shadowMap.enabled = true;
		game.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		//add lights
		// add subtle ambient lighting
        playing.ambientLight = new THREE.AmbientLight( 0x555555 ); // soft white light
		playing.scene.add( playing.ambientLight );

        // add light
        playing.spotLight = new THREE.SpotLight(0xbbbbbb);
        playing.spotLight.position.set(0, 500, 0);
        playing.spotLight.castShadow = true;
        playing.scene.add(playing.spotLight);

		//add skybox
		playing.sky = new Sky('game/resources/img/sky3.jpg');
		playing.sky.init(function(sky) {
			playing.scene.add(sky);	
		});

		//loadMap
		playing.gameMap = new GameMap("game/data/maps/testMap");
		playing.gameMap.init(new THREE.Object3D(), function() {


			//add charachter
			playing.charachter = new PlayerCharachter();
			playing.charachter.init(new THREE.Vector3(playing.gameMap.meta.playerStart.coord.x,playing.gameMap.meta.playerStart.coord.y,playing.gameMap.meta.playerStart.coord.z));
			playing.scene.add(playing.charachter.mesh);

			playing.cameraControls.target.set(playing.charachter.mesh.position.x, playing.charachter.mesh.position.y, playing.charachter.mesh.position.z);


			var position = playing.charachter.mesh.getWorldPosition();
			var direction = playing.charachter.mesh.getWorldDirection();

			playing.charachter.mesh.updateMatrixWorld( true );

			playing.charachter.raycaster = new THREE.Raycaster (new THREE.Vector3(position.x, position.y  -5, position.z), new THREE.Vector3( direction.x, -0.5, direction.z), 0, 15); 
			playing.charachter.intersects = playing.charachter.raycaster.intersectObject (playing.gameMap.terrain, true);

			// playing.debugElem.innerHTML += "Total Voxels: " + playing.gameMap.data.length +"<br>";
			// playing.debugElem.innerHTML += "Rendered Voxels: " + playing.gameMap.terrain.children.length +"<br>";
		});
		playing.scene.add(playing.gameMap.terrain);

		console.log("Playing has been initialized");
	});

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

	playing.keyboard("esc", function() {
		game.setState("MainMenu");
	});

	playing.registerRenderCB(function(delta) {
		playing.cameraControls.update(delta);
		if(playing.charachter) playing.charachter.render();
		game.renderer.render(playing.scene, playing.camera);	
	});

	playing.registerCloseCB(function() {
		console.log("Closing Playing");
		playing.activeControll(false);
		engine.utils.toggleRenderStats(false);
	});

	playing.activeControll = function(active) {
		playing.cameraControls.enableZoom = active;
		playing.cameraControls.enableRotate = active;
		playing.cameraControls.enablePan = active;
	}

	appContext.makeSingleton("PlayingState", playing);
}