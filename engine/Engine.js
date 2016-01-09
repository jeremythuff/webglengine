function EngineScope() {
	include("engine/model/Game.js", "Game", this);
	include("engine/utils/Utils.js", "Utils", this);

	var Engine = function() {
		var engine = this;
		engine.game = null;	

		appContext.makeSingleton("engine", this);

		return engine;
	}

	Engine.prototype = {
		init: function(name, main, mainName, parentscope) {
			var engine = this;
			
			engine.game = new Game(name);
			engine.utils = new Utils();

			include(main, mainName, parentscope);

			engine.utils.loadStats();

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
	            	if(engine.utils.renderStatsActive) {
	            		engine.utils.renderStats.fps.begin();
	            		engine.utils.renderStats.ms.begin();
	            		engine.utils.renderStats.mb.begin();
	            	}
	            	engine.game.update( delta );
	            	if ( delta < 160 ) {
		                engine.game.render( delta );		           
		            }
		            if(engine.utils.renderStatsActive) {
	            		engine.utils.renderStats.fps.end();
	            		engine.utils.renderStats.ms.end();
	            		engine.utils.renderStats.mb.end();
	            	}
	            }
	            
	            lastFrame = now;
		        
		    }
		    loop( lastFrame );
		}
	}

	return Engine;
}