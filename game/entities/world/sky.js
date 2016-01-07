function SkyScope() {

	var game = appContext.getSingleton("Game");

	var Sky = function(texture, vertexShader, fragmentShader) {
	
		this.texture = texture;
		this.vertexShader = vertexShader ? vertexShader : "game/resources/shaders/sky.vert";
		this.fragmentShader = fragmentShader ? fragmentShader : "game/resources/shaders/sky.frag";
		this.box;

		return this;
	}

	Sky.prototype = {
		init: function(cb) {

			var sky = this;

			game.textureLoader.load(this.texture, function(tex) {
				skyGeometry = new THREE.SphereGeometry(3000, 60, 40);  
				
				var uniforms = {  
				  texture: { type: 't', value: tex }
				};

				game.loadShaders({
					vert: sky.vertexShader, 
					frag: sky.fragmentShader 
				}, function(shaders) {
					
					var material = new THREE.ShaderMaterial( {  
					  uniforms:       uniforms,
					  vertexShader:   shaders.vert,
					  fragmentShader: shaders.frag
					});

					sky.box = new THREE.Mesh(skyGeometry, material);  
					sky.box.scale.set(-10, 10, 10);  
					sky.box.rotation.order = 'XZY';  
					sky.box.renderOrder = 1000.0;

					cb(sky.box);  
					
				});
					
			});
		}
	}

	return Sky;

}