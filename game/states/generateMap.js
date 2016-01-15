function GenerateMapScope() {

	include("engine/model/State.js", "State", this);
	include("game/entities/world/GameMap.js", "GameMap", this);

	var game = appContext.getSingleton("game");
	var generateMap = new State("GenerateMap");
	
	generateMap.registerInitCB(function() {

		//create camera
		generateMap.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 20000 );
		if(!generateMap.cameraControls) generateMap.cameraControls = new THREE.OrbitControls( generateMap.camera );

		generateMap.camera.position.x = 170;
		generateMap.camera.position.y = 100;
		generateMap.camera.position.z = 170;		

		generateMap.gameMap = new GameMap("game/data/maps/testMap");
		generateMap.gameMap.init(new THREE.Object3D(), function() {
			generateMap.scene.add(generateMap.gameMap.terrain);
			console.log(generateMap);
		});

		//add lights
		// add subtle ambient lighting
        generateMap.ambientLight = new THREE.AmbientLight( 0x555555 ); // soft white light
		generateMap.scene.add( generateMap.ambientLight );

		console.log("GenerateMap has been initialized");
	});

	generateMap.keyboard("esc", function() {
		game.setState("MainMenu");
	});

	generateMap.registerRenderCB(function(delta) {
		game.renderer.render(generateMap.scene, generateMap.camera);	
	});

	generateMap.registerCloseCB(function() {
		console.log("Closing GenerateMap");
		game.renderer.clear();
		generateMap.destroy();
	});

	appContext.makeSingleton("GenerateMapState", generateMap);
}