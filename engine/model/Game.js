function GameScope() {

	var Game = function(name) {

		if(appContext.getSingleton("game")) return appContext.getSingleton("game");

		var game = this;
		game.name = name;
		game.running = false;
		game.states = {};
		game.listeners = {}

		game.resourceLoaderManager = new THREE.LoadingManager();
		game.textureLoader = new THREE.TextureLoader(game.resourceLoaderManager);
		
		game.resourceLoaderManager.onProgress = function ( item, loaded, total ) {
			console.log( item, loaded, total );
		};

    	game.screen.canvas = document.createElement('canvas');
    	game.screen.ctx = game.screen.canvas.getContext('3d');

		appContext.makeSingleton("game", this);

		return appContext.getSingleton("game");
	}

	Game.prototype = {
		init: function(cb) {
			var game = this;
	    	var w = window.innerWidth;
	    	var h = window.innerHeight;

			game.renderer = new THREE.WebGLRenderer();
			game.renderer.setSize( window.innerWidth, window.innerHeight );
		
			document.body.insertBefore(game.renderer.domElement, document.body.firstChild);
		
			cb();
		},
		loadShaders: function(urls, cb) {
			var ajaxForVert = new XMLHttpRequest();

			var shaders = {};
	
		    ajaxForVert.open( 'GET', urls.vert);
		    
		    ajaxForVert.onreadystatechange = function () {
		        if (ajaxForVert.readyState === 4) {
		        	shaders.vert = ajaxForVert.response || ajaxForVert.responseText;
		        	if(shaders.frag) cb(shaders);
		        }
		    };

		    ajaxForVert.send(null);

		    var ajaxForFrag = new XMLHttpRequest();
	
		    ajaxForFrag.open( 'GET', urls.frag);
		    
		    ajaxForFrag.onreadystatechange = function () {
		        if (ajaxForFrag.readyState === 4) {
		        	shaders.frag = ajaxForFrag.response || ajaxForFrag.responseText;
		        	if(shaders.vert) cb(shaders);
		        }
		    };

		    ajaxForFrag.send(null);
			
		},
		start: function(stateName) {
			var game = this;
			if(stateName) game.setState(stateName);

			game.init(function() {
				game.running = true;
			});		
		},
		stop: function() {
			var game = this;
			if(game.currentState) {
				game.currentState.close();
				game.currentState.destroy();
			}
		    game.running = false;
		},
		update: function(delta) {
			var game = this;
			if(game.currentState)
				game.currentState.update(delta);
		},
		render: function(delta) {
			var game = this;
			if(game.currentState && game.currentState.initialized)
				game.currentState.render(delta);
		},
		setState: function(stateName) {
			var game = this;
			
			if(!game.states[stateName]) {
				console.error("No state by that name");
				return;
			}

			if(game.currentState) game.currentState.close();
			
			game.currentState = game.states[stateName];
			game.currentState.init();
		},
		getState: function(stateName) {
			var game = this;
			return game.states[stateName];
		},
		registerState: function(state) {
			var game = this;
			game.states[state.name] = state;
			return game.states[name];
		},
		registerGlobalListener: function(event, cb) {

		},
		removeGlobalListener: function(event, cb) {

		},
		screen: {

		}	
	}

	return Game;
}