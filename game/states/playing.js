function PlayingScope() {

	var engine = appContext.getSingleton("engine");
	var game = appContext.getSingleton("game");
	var playing = new State("Playing");

	playing.registerInitCB(function() {

		if(playing.initialized) {
			playing.activeControll(true);
			return;
		}

		playing.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100000 );
		if(!playing.cameraControls) playing.cameraControls = new THREE.OrbitControls( playing.camera );
		
		playing.cameraControls.target.set(0, 0, 0);

		game.renderer.shadowMap.enabled = true;
		game.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		var textureloader = new THREE.TextureLoader();

		textureloader.load('game/resources/img/sky3.jpg', function(tex) {
			skyGeometry = new THREE.SphereGeometry(3000, 60, 40);  
			var uniforms = {  
			  texture: { type: 't', value: tex }
			};

			engine.loadShaders({
				vert: "game/resources/shaders/sky.vert",
				frag: "game/resources/shaders/sky.frag"
			}, function(shaders) {
				var material = new THREE.ShaderMaterial( {  
				  uniforms:       uniforms,
				  vertexShader:   shaders.vert,
				  fragmentShader: shaders.frag
				});

				playing.skyBox = new THREE.Mesh(skyGeometry, material);  
				playing.skyBox.scale.set(-10, 10, 10);  
				playing.skyBox.rotation.order = 'XZY';  
				playing.skyBox.renderOrder = 1000.0;  
				playing.scene.add(playing.skyBox);
			});

				
		});

		// create the ground plane
        var planeGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
        var planeMaterial = new THREE.MeshLambertMaterial({color: 0x00ff00});
        playing.ground = new THREE.Mesh(planeGeometry, planeMaterial);
        playing.ground.receiveShadow = true;
        // rotate and position the plane
        playing.ground.rotation.x = -0.5 * Math.PI;
        playing.ground.position.x = 0;
        playing.ground.position.y = 0;
        playing.ground.position.z = 0;
        // add the plane to the scene
        playing.scene.add(playing.ground);

        // add subtle ambient lighting
        var ambiColor = "#0c0c0c";
        playing.ambientLight = new THREE.AmbientLight(ambiColor);
        playing.scene.add(playing.ambientLight);
        // add spotlight for the shadows
        playing.spotLight = new THREE.SpotLight(0xffffff);
        playing.spotLight.position.set(40, 100, 10);
        playing.spotLight.castShadow = true;
        playing.scene.add(playing.spotLight);

        // add spotlight for the shadows
        playing.reflectedLight = new THREE.SpotLight(0x8aa078);
        playing.reflectedLight.position.set(-40, -2, -10);
        playing.reflectedLight.castShadow = false;
        playing.scene.add(playing.reflectedLight);


		var geometry = new THREE.BoxGeometry( 1, 1, 1 );
		var material = new THREE.MeshLambertMaterial( { color: 0xefefef } );
		playing.cube = new THREE.Mesh( geometry, material );
		playing.cube.position.y = 0.5;
		playing.cube.castShadow = true;
		playing.scene.add( playing.cube );

		playing.camera.position.x = 175;
		playing.camera.position.y = 100;
		playing.camera.position.z = 175;

		console.log("Playing has been initialized");
	});

	playing.registerListener("keydown", function(e) {
		if(e.which==27) {
			game.setState("MainMenu");
		}
	});

	var counter = 0;
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