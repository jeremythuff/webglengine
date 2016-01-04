function StateScope() {

	var State = function(name) {
		this.initialized = false;
		this.name = name;
		this.listeners = {};
		this.initCBs = {};
		this.updateCBs = {};
		this.renderCBs = {};
		this.closeCBs = {};
		this.destroyCBs = {};
		this.scene = new THREE.Scene();
	}

	State.prototype = {
		registerListener: function(event, cb) {
			var state = this;
			var listenerID = state.name+Object.keys(state.listeners).length;

			state.listeners[listenerID] = {
				event: event,
				cb: cb
			};
		},
		registerInitCB: function(cb) {
			var state = this;
			var cbID = state.name+Object.keys(state.initCBs).length;
			state.initCBs[cbID] = cb;
			return cbID;
		},
		registerUpdateCB: function(cb) {
			var state = this;
			var cbID = state.name+Object.keys(state.updateCBs).length;
			state.updateCBs[cbID] = cb;
			return cbID;
		},
		registerRenderCB: function(cb) {
			var state = this;
			var cbID = state.name+Object.keys(state.renderCBs).length;
			state.renderCBs[cbID] = cb;
			return cbID;
		},
		registerCloseCB: function(cb) {
			var state = this;
			var cbID = state.name+Object.keys(state.closeCBs).length;
			state.closeCBs[cbID] = cb;
			return cbID;
		},
		registerDestroyCB: function(cb) {
			var state = this;
			var cbID = state.name+Object.keys(state.destroyCBs).length;
			state.destroyCBs[cbID] = cb;
			return cbID;
		},
		init: function() {
			var state = this;
			for(var id in state.initCBs) {
				state.initCBs[id]();
			}
			for(var id in state.listeners) {
				var listener = state.listeners[id];
				window.addEventListener(listener.event, listener.cb, false);
			}
			state.initialized = true;
		},
		update: function(delta) {
			var state = this;
			for(var id in state.updateCBs) {
				state.updateCBs[id](delta);
			}
		},
		render: function(delta) {
			var state = this;
			for(var id in state.renderCBs) {
				state.renderCBs[id](delta);
			}
		},
		close: function() {
			var state = this;
			for(var id in state.closeCBs) {
				state.closeCBs[id]();
			}
			for (var id in state.listeners) {
				var listener = state.listeners[id];
				window.removeEventListener(listener.event, listener.cb, false);
			}
		},
		destroy: function() {
			var state = this;
			for(var id in state.destroyCBs) {
				console.log(state.destroyCBs[id]);
				state.destroyCBs[id]();
			}
			state.initialized = false;
		}
	}

	return State;
}