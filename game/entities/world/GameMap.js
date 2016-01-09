var GameMapScope = function() {

	var engine = appContext.getSingleton("engine");

	var GameMap = function(url) {

		var gameMap = this;

		gameMap.url = url;
		gameMap.data;
		gameMap.meta

		return this;
	}

	GameMap.prototype = {
		init: function(cb) {

			var gameMap = this;

			engine.utils.xhr(gameMap.url, function(map) {
				var mapObj = JSON.parse(map)
				gameMap.data = mapObj.data;
				gameMap.meta = mapObj.meta;
				cb();
			});

		}
	}


	return GameMap;
}