function EngineScope() {
	include("engine/model/Game.js", "Game", this);

	var Engine = function() {
		var engine = this;
		engine.game = null;

		appContext.makeSingleton("engine", this);

		return engine;
	}

	Engine.prototype = {
		init: function(name, main, mainName, parentscope) {
			var engine = this;

			appContext.makeSingleton("Game", new Game(name))

			engine.game = appContext.getSingleton("Game");

			include(main, mainName, parentscope);

			engine.startLoop(); 
			return engine.game;
		},
		startLoop: function(element) {
			var engine = this;
			var clock = new THREE.Clock();
		    lastFrame = +new Date,
		        raf = window.requestAnimationFrame 		 ||
		        	  window.mozRequestAnimationFrame    ||
		              window.webkitRequestAnimationFrame ||
		              window.msRequestAnimationFrame     ||
		              window.oRequestAnimationFrame;
		    function loop( now ) {	        
	            raf(loop);
	            var delta = clock.getDelta();

	            if ( engine.game.running !== false ) {
	            	engine.game.update( delta );
	            	if ( delta < 160 ) {
		                engine.game.render( delta );
		            }
	            }
	            
	            lastFrame = now;
		        
		    }
		    loop( lastFrame );
		}
	}

	return Engine;
}