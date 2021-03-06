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

		console.log(playing.keyboard);

		//if the playing state has already been inititialized then return control and skip 
		
		engine.utils.toggleRenderStats(true);

		if(playing.initialized) {
			playing.activeControll(true);
			return;
		}

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

			playing.charachter.controlls(playing);

			playing.charachter.raycaster = new THREE.Raycaster (new THREE.Vector3(position.x, position.y  -5, position.z), new THREE.Vector3( direction.x, -0.5, direction.z), 0, 15); 
			playing.charachter.intersects = playing.charachter.raycaster.intersectObject (playing.gameMap.terrain, true);

		});
		playing.scene.add(playing.gameMap.terrain);

		console.log("Playing has been initialized");
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