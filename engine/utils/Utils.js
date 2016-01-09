var UtilsScope = function()  {
	
	var Utils = function() {

		var utils = this;

		utils.resourceLoaderManager = new THREE.LoadingManager();
		utils.textureLoader = new THREE.TextureLoader(utils.resourceLoaderManager);

		utils.renderStatsActive = false;

		utils.resourceLoaderManager.onProgress = function ( item, loaded, total ) {
			console.log( item, loaded, total );
		};

		return this;
	}

	Utils.prototype = {
		loadStats: function() {

			var utils = this;

			//render stats
			utils.renderStats = {
				fps: new Stats(),
				ms: new Stats(),
				mb: new Stats()
			}		

			utils.renderStats.fps.setMode(0);
			utils.renderStats.ms.setMode(1);
			utils.renderStats.mb.setMode(2);

			utils.renderStats.fps.domElement.style.position   = 'absolute';
			utils.renderStats.fps.domElement.style.left  = '0px';
			utils.renderStats.fps.domElement.style.top    = '0px';

			utils.renderStats.ms.domElement.style.position   = 'absolute';
			utils.renderStats.ms.domElement.style.left  = '100px';
			utils.renderStats.ms.domElement.style.top    = '0px';

			utils.renderStats.mb.domElement.style.position   = 'absolute';
			utils.renderStats.mb.domElement.style.left  = '200px';
			utils.renderStats.mb.domElement.style.top    = '0px';

		},
		loadShaders: function(urls, cb) {

			var utils = this;

			var shaders = {};

			utils.xhr(urls.vert, function(res) {
	        	shaders.vert = res;
	        	if(shaders.frag) { 
	        		console.log("load shaders in utils");
	        		cb(shaders);
	        	}
			});

			utils.xhr(urls.frag, function(res) {
	        	shaders.frag = res;
	        	if(shaders.vert) {
	        		console.log("load shaders in utils");
	        		cb(shaders);
	        	}
			});

		},
		toggleRenderStats: function(active) {
			var utils = this;
			if(active) {
				document.body.appendChild(utils.renderStats.fps.domElement);
				document.body.appendChild(utils.renderStats.ms.domElement);
				document.body.appendChild(utils.renderStats.mb.domElement);
			} else {
				utils.renderStats.fps.domElement.remove();
				utils.renderStats.ms.domElement.remove();
				utils.renderStats.mb.domElement.remove();
			}
			utils.renderStatsActive = active;
		},
		xhr: function(url, inccb, sync) {

			var xhrReq = new XMLHttpRequest();
			var sync = typeof(sync) == "undefined" ? true : false;

			console.log(sync);

			xhrReq.open( 'GET', url, sync);

			xhrReq.onreadystatechange = function () {
				if(xhrReq.readyState == 4) {
					inccb(xhrReq.response || xhrReq.responseText);
				} 		        
		    };

		    xhrReq.send(null);

		}
	}

	return Utils;

}