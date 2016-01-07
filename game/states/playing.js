function PlayingScope() {

	include("engine/model/State.js", "State", this);
	include("game/entities/world/sky.js", "Sky", this);

	console.log(this);

	var engine = appContext.getSingleton("engine");
	var game = appContext.getSingleton("game");
	var playing = new State("Playing");

	playing.registerInitCB(function() {

		//if the playing state has already been inititialized then return control and skip 
		if(playing.initialized) {
			playing.activeControll(true);
			return;
		}

		//create camera
		playing.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100000 );
		if(!playing.cameraControls) playing.cameraControls = new THREE.OrbitControls( playing.camera );
		
		playing.cameraControls.target.set(0, 0, 0);

		playing.camera.position.x = 175;
		playing.camera.position.y = 100;
		playing.camera.position.z = 175;

		//configure renderer
		game.renderer.shadowMap.enabled = true;
		game.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		//add skybox
		playing.sky = new Sky('game/resources/img/sky3.jpg');
		playing.sky.init(function(sky) {
			playing.scene.add(sky);	
		});

		//loadMap
		
		
		//add charachter

		console.log("Playing has been initialized");
	});

	playing.registerListener("keydown", function(e) {
		if(e.which==27) {
			game.setState("MainMenu");
		}
	});

	playing.registerRenderCB(function(delta) {
		playing.cameraControls.update(delta);
		game.renderer.render(playing.scene, playing.camera);	
	});

	playing.registerCloseCB(function() {
		console.log("Closing Playing");
		playing.activeControll(false);
	});

	playing.activeControll = function(active) {
		playing.cameraControls.enableZoom = active;
		playing.cameraControls.enableRotate = active;
		playing.cameraControls.enablePan = active;
	}

	appContext.makeSingleton("PlayingState", playing);
}