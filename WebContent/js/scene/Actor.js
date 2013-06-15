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
				
				// TODO - refactor using pattern Dojo request() , adding objects to scene in from a callback
				// eliminate state machine, maintaining actors state changes it is hard to comprehend
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


var load Dae = function()
{
      var dae;
      // Create an instance of the collada loader:
      var loader = new THREE.ColladaLoader();
      // Need to convert the axes so that our model does not stand upside-down:
      loader.options.convertUpAxis = true;
      // Load the 3D collada file (robot01.dae in my example), and specify
      // the callback function that is called once the model has loaded:
      loader.load( './models/robot01.dae', function ( collada ) {
        // Grab the collada scene data:
        dae = collada.scene;
        // No skin applied to my model so no need for the following:
        // var skin = collada.skins[ 0 ];
        // Scale-up the model so that we can see it:
        dae.scale.x = dae.scale.y = dae.scale.z = 25.0;
        // Initialise and then animate the 3D scene
        // since we have now successfully loaded the model:
            init();
            animate();
      });
   };
