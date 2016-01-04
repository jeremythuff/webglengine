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

			var shaders = {};
	
		    ajaxForFrag.open( 'GET', urls.frag);
		    
		    ajaxForFrag.onreadystatechange = function () {
		        if (ajaxForFrag.readyState === 4) {
		        	shaders.frag = ajaxForFrag.response || ajaxForFrag.responseText;
		        	if(shaders.vert) cb(shaders);
		        }
		    };

		    ajaxForFrag.send(null);
			
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