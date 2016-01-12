function IsometricGameScope() {
	include("game/states/intro.js", "Intro", this);
	include("game/states/mainmenu.js", "MainMenu", this);
	include("game/states/generateMap.js", "GenerateMap", this);
	include("game/states/playing.js", "Playing", this);

	var game = appContext.getSingleton("game");

	game.registerState(appContext.getSingleton("IntroState"));
	game.registerState(appContext.getSingleton("MainMenuState"));
	game.registerState(appContext.getSingleton("GenerateMapState"));
	game.registerState(appContext.getSingleton("PlayingState"));
}