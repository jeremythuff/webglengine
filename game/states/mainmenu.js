function MainMenuScope() {
	
	include("engine/model/State.js", "State", this);

	var mainmenu = new State("MainMenu");
	var game = appContext.getSingleton("game");
	
	mainmenu.registerInitCB(function() {
		console.log("Main Menu has been initialized");

		mainmenu.elem = document.createElement("div");
		mainmenu.elem.classList.add('menu'); 
		mainmenu.elem.innerHTML = "<div class='menuTitle'>Main Menu</div>";
		mainmenu.items = [];
		mainmenu.activeItem = 0;

		var MenuItem = function(text, action) {
			this.text = text;
			this.action = action;
		}

		mainmenu.items.push(new MenuItem(game.getState("Playing").initialized ? "Resume" : "Start", function() {
			game.setState("Playing");
		}));

		mainmenu.items.push(new MenuItem("Options", function() {
			game.setState("Options");
		}));

		mainmenu.items.push(new MenuItem("Exit", function() {
			game.stop();
		}));		

		for(var index in mainmenu.items) {

			var menuItem = mainmenu.items[index];

			menuItem.elem = document.createElement("div");
			menuItem.elem.classList.add("menuItem");
			if(mainmenu.activeItem == index) menuItem.elem.classList.add('active');
			menuItem.elem.innerHTML = menuItem.text ;
			mainmenu.elem.appendChild(menuItem.elem);

		}

		document.body.appendChild(mainmenu.elem);

	});

	mainmenu.registerListener("keydown", function(e) {

		if(e.which == 27) {
			e.preventDefault();
			if(game.getState("Playing").initialized) {
				game.setState("Playing");	
			} else {
				game.stop();
			}
		}

		if(e.which == 13) {
			e.preventDefault();
			mainmenu.items[mainmenu.activeItem].action();
		}

		if(e.which == 40) {
			e.preventDefault();
			if(mainmenu.activeItem != mainmenu.items.length - 1) {
				mainmenu.activeItem++;
				redrawActiveItem();
			}
		}

		if(e.which == 38) {
			e.preventDefault();
			if(mainmenu.activeItem != 0) {
				mainmenu.activeItem--;
				redrawActiveItem();
			}
		}

	});

	var redrawActiveItem = function() {
		for(var index in mainmenu.items) {
			var menuItem = mainmenu.items[index]
			if(menuItem.elem.classList.contains("active")) menuItem.elem.classList.remove("active");
			if(mainmenu.activeItem == index) menuItem.elem.classList.add('active');
		}
	}

	mainmenu.registerCloseCB(function() {
		console.log("Closing Main Menu");
		document.body.removeChild(mainmenu.elem);
		mainmenu.initialized=false;
		game.renderer.clear();
	});

	appContext.makeSingleton("MainMenuState", mainmenu);
}