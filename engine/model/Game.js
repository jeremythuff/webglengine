function GameScope() {

	var Game = function(name) {

		if(appContext.getSingleton("game")) return appContext.getSingleton("game");

		var game = this;
		game.name = name;
		game.running = false;
		game.states = {};
		game.listeners = {}

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
			window.addEventListener(event, cb);
		},
		removeGlobalListener: function(event, cb) {
			window.removeEventListener(event, cb);
		},
		screen: {

		}	
	}

	return Game;
}