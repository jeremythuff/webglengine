function EngineScope() {
	include("engine/model/Game.js", "Game", this);

	var Engine = function() {
		var engine = this;
		engine.game = null;	
		engine.renderStatsActive = false;

		appContext.makeSingleton("engine", this);

		return engine;
	}

	Engine.prototype = {
		init: function(name, main, mainName, parentscope) {
			var engine = this;

			appContext.makeSingleton("Game", new Game(name))
			
			engine.game = appContext.getSingleton("Game");

			include(main, mainName, parentscope);

			//render stats
			engine.renderStats = {
				fps: new Stats(),
				ms: new Stats(),
				mg: new Stats()
			}		

			engine.renderStats.fps.setMode(0);
			engine.renderStats.ms.setMode(1);
			engine.renderStats.mb.setMode(2);

			engine.renderStats.fps.domElement.style.position   = 'absolute';
			engine.renderStats.fps.domElement.style.left  = '0px';
			engine.renderStats.fps.domElement.style.top    = '0px';

			engine.renderStats.ms.domElement.style.position   = 'absolute';
			engine.renderStats.ms.domElement.style.left  = '100px';
			engine.renderStats.ms.domElement.style.top    = '0px';

			engine.renderStats.mb.domElement.style.position   = 'absolute';
			engine.renderStats.mb.domElement.style.left  = '200px';
			engine.renderStats.mb.domElement.style.top    = '0px';

			engine.startLoop(); 
			return engine.game;
		},
		toggleRenderStats: function(active) {
			var engine = this;
			if(active) {
				document.body.appendChild(engine.renderStats.fps.domElement);
				document.body.appendChild(engine.renderStats.ms.domElement);
				document.body.appendChild(engine.renderStats.mb.domElement);
			} else {
				engine.renderStats.fps.domElement.remove();
				engine.renderStats.ms.domElement.remove();
				engine.renderStats.mb.domElement.remove();
			}
			engine.renderStatsActive = active;
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
	            	if(engine.renderStatsActive) {
	            		engine.renderStats.fps.begin();
	            		engine.renderStats.ms.begin();
	            		engine.renderStats.mb.begin();
	            	}
	            	engine.game.update( delta );
	            	if ( delta < 160 ) {
		                engine.game.render( delta );		           
		            }
		            if(engine.renderStatsActive) {
	            		engine.renderStats.fps.end();
	            		engine.renderStats.ms.end();
	            		engine.renderStats.mb.end();
	            	}
	            }
	            
	            lastFrame = now;
		        
		    }
		    loop( lastFrame );
		}
	}

	return Engine;
}