var KeyboardScope = function() {

	var Keyboard = function() {

		this.keys = [];

		appContext.makeSingleton("keyboard", this);

		return this;
	}

	Keyboard.prototype = {
		init: function() {
			var game = appContext.getSingleton("game");
			var keyboard = this;

			game.registerGlobalListener("keydown", function(e){
				keyboard.keys[e.which] = true;
			});

			game.registerGlobalListener("keyup", function(e){
				keyboard.keys[e.which] = false;
			});
		},
		pressed: function(keys, cb) {
			var isPressed = false;

			for(var index in keys) {
				if(this.args[index]) isPressed = true;
			}

			if(isPressed) cb();
			
		}
	}

	return Keyboard;
}