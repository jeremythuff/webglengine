function IntroScope() {

	var game = appContext.getSingleton("Game");
	var intro = new State("Intro");

	intro.registerInitCB(function() {
		console.log("Intro has been initialized");
	});

	intro.registerListener("keydown", function(e) {
		if(e.which==13) {
			game.setState("MainMenu");
		}
	});

	intro.registerCloseCB(function() {
		console.log("Closing Intro");
		game.renderer.clear();
		intro.destroy();
	});

	appContext.makeSingleton("IntroState", intro);
}