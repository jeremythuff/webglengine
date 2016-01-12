function GenerateMapScope() {

	include("engine/model/State.js", "State", this);
	
	var game = appContext.getSingleton("game");
	var generateMap = new State("GenerateMap");

	generateMap.registerInitCB(function() {
		console.log("GenerateMap has been initialized");
	});

	generateMap.registerListener("keydown", function(e) {
		if(e.which==27) {
			game.setState("MainMenu");
		}
	});

	generateMap.registerCloseCB(function() {
		console.log("Closing GenerateMap");
		game.renderer.clear();
		generateMap.destroy();
	});

	appContext.makeSingleton("GenerateMapState", generateMap);
}