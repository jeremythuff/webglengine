function PlayingScope() {

	include("engine/model/State.js", "State", this);
	include("game/entities/world/sky.js", "Sky", this);
	include("game/entities/world/GameMap.js", "GameMap", this);
	include("game/entities/world/voxel.js", "Voxel", this);

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

		//create camera
		playing.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 20000 );
		if(!playing.cameraControls) playing.cameraControls = new THREE.OrbitControls( playing.camera );
		playing.cameraControls.target.set(0, 0, 0);

		playing.camera.position.x = 170;
		playing.camera.position.y = 100;
		playing.camera.position.z = 170;

		//configure renderer
		game.renderer.shadowMap.enabled = true;
		game.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		//add lights
		 // add subtle ambient lighting
        var ambiColor = "#0c0c0c";
        playing.ambientLight = new THREE.AmbientLight(ambiColor);
        playing.scene.add(playing.ambientLight);
        // add light
        playing.spotLight = new THREE.SpotLight(0xffffff);
        playing.spotLight.position.set(40, 100, 10);
        playing.spotLight.castShadow = true;
        playing.scene.add(playing.spotLight);

        playing.ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
		playing.scene.add( playing.ambientLight );

		//add skybox
		playing.sky = new Sky('game/resources/img/sky3.jpg');
		playing.sky.init(function(sky) {
			playing.scene.add(sky);	
		});

		//loadMap
		playing.gameMap = new GameMap("game/data/maps/testMap.json");
		playing.gameMap.init(function() {
			
			var xstart = 0;
			var ystart = 0;
			var zstart = 0;

			var xpos = xstart;
			var ypos = ystart;
			var zpos = zstart;

			var xlength = playing.gameMap.meta.size.x;
			var ylength = playing.gameMap.meta.size.y;
			var zlength = playing.gameMap.meta.size.z;

			for(var index in playing.gameMap.data) {

				var voxType = playing.gameMap.data[index];



				var addVoxel =  (xpos-1 < 0 || xpos+1 == xlength) ||
								(ypos-1 < 0 || ypos+1 == ylength) || 
								(zpos-1 < 0 || zpos+1 == zlength); 

				if(addVoxel) {
					var position = new THREE.Vector3(xpos,ypos,zpos);
					var voxel = new Voxel(position);
					playing.scene.add(voxel.mesh);
				}

				xpos++;
				if(xpos == xlength) {
					xpos = xstart;
					zpos++;
					if(zpos == zlength) {
						zpos = zstart;
						ypos++;
						if(ypos == ylength) {
							ypos = ystart;
						}
					}					
				}
			}

		});


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
		engine.utils.toggleRenderStats(false);
	});

	playing.activeControll = function(active) {
		playing.cameraControls.enableZoom = active;
		playing.cameraControls.enableRotate = active;
		playing.cameraControls.enablePan = active;
	}

	appContext.makeSingleton("PlayingState", playing);
}