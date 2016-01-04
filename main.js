
(function Main() {
	include("engine/Engine.js", "Engine", this);
	
	var engine = new Engine();
	var game = engine.init("Isometric Game", "game/isometricGame.js", "IsometricGame", this);

	game.start("Intro");

	console.log(engine);

})()

