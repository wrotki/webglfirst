/**
 * @author mariusz
 */

var asActor = function() {
  this.initialize = function(scene) {
		this.scene = scene;	
		this.meshes = [];

		var prototype = Object.getPrototypeOf(this);
		var createGeometry = function( geometry, materials )
		{
			prototype.model = geometry;
			prototype.materials = materials;
			
			for(var i in prototype.waiters){
				var actor = prototype.waiters[i];
				actor.state = ACTOR_STATE.MODEL_LOADED;
			}
		};

		// prototype.model is initialized by the first instance and shared by others, need to handle a potential race
		
		if(prototype.modelUrl){	
			if(!prototype.modelRequested) {
				var loader = new THREE.JSONLoader();
				loader.load(prototype.modelUrl, createGeometry);
				prototype.modelRequested = true;
				prototype.waiters = [];
			}
			this.state = ACTOR_STATE.MODEL_REQUESTED;
			prototype.waiters.push(this);
		} else {
			this.state = ACTOR_STATE.MODEL_LOADED;
		}
  };
  
  return this;
};

//var Circle = function(radius) {
//    this.radius = radius;
//};
//asCircle.call(Circle.prototype);
