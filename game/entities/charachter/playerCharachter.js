var PlayerCharachterScope = function() {

	var charGeo = new THREE.BoxGeometry( 10, 20, 10 );
	var charMaterial = new THREE.MeshLambertMaterial( { color: 0xd8675d} );
	
	var PlayerCharachter = function() {
		
		var player = this;

		player.mesh = null;

		return this;
	}

	PlayerCharachter.prototype = {
		init: function(position, cb) {

			var player = this;

			player.mesh = new THREE.Mesh( charGeo, charMaterial );
			player.mesh.position.set(position.x, position.y, position.z);

			if(cb) cb();
		}
	}

	return PlayerCharachter;
}