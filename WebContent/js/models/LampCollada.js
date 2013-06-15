// http://bkcore.com/blog/3d/webgl-three-js-workflow-tips.html
// http://www.96methods.com/2012/02/three-js-importing-a-model/
//		THREE.AnimationHandler.add( geometry.animation );
function LampCollada(origin)
{
    var OB = window.OtherBrane;
	var path = OB.mediaPath;
	LampCollada.prototype.modelUrl = path + "/3d/lampscene.dae";
	this.origin = origin;	
}

LampCollada.prototype.initialize = function(scene) {
        this.scene = scene; 
        this.meshes = [];
        var prototype = Object.getPrototypeOf(this);
        // prototype.model is initialized by the first instance and shared by others, need to handle a potential race
        if(prototype.modelUrl){ 
            if(!prototype.modelRequested) {
                prototype.modelRequested = true;
                prototype.waiters = [];
                this.loadDae();
            }
            this.state = ACTOR_STATE.MODEL_REQUESTED;
            prototype.waiters.push(this);
        } else {
            this.state = ACTOR_STATE.MODEL_LOADED;
        }
         return this;
};  

// http://3drt.com/store/free-downloads/
LampCollada.prototype.loadDae = function(){
      var dae;
      // Create an instance of the collada loader:
      var prototype = Object.getPrototypeOf(this); // For callback to get access to the list of waiters
      var scene = this.scene; 
      var loader = new THREE.ColladaLoader();
      // Need to convert the axes so that our model does not stand upside-down:
      loader.options.convertUpAxis = true;
      // Load the 3D collada file (robot01.dae in my example), and specify
      // the callback function that is called once the model has loaded:
      loader.load(LampCollada.prototype.modelUrl, function ( collada ) {
        // Grab the collada scene data:
        dae = collada.scene;
        // No skin applied to my model so no need for the following:
        // var skin = collada.skins[ 0 ];
        // Scale-up the model so that we can see it:
        dae.scale.x = dae.scale.y = dae.scale.z = 25.0;
        // Initialise and then animate the 3D scene
        // since we have now successfully loaded the model:
        prototype.colladaModel = dae;
        for(var i in prototype.waiters){
            var actor = prototype.waiters[i];
            actor.state = ACTOR_STATE.MODEL_LOADED;
            actor.meshesCreated = actor.createMeshes();
            actor.initialized = true;
            scene.addActor(actor);
        }
      });
};

LampCollada.prototype.createMeshes = function(){
    this.meshes.push(LampCollada.prototype.colladaModel);
	return true;
};

//TODO this is very temporary, make it per-object later

var duration = 5000;
var keyframes = 30, interpolation = duration / keyframes;
var lastKeyframe = 0, currentKeyframe = 0;

LampCollada.prototype.update = function(){
	if(this.state != ACTOR_STATE.ACTOR_SHOWN || !this.meshes || ! this.meshes[0]){
		return;
	}
	var mesh = this.meshes[0];
	// Alternate morph targets

	var time = Date.now() % duration;

	var keyframe = Math.floor( time / interpolation );
    
	if(mesh && mesh.morphTargetInfluences){
		if ( keyframe != currentKeyframe ) {
			mesh.morphTargetInfluences[ lastKeyframe ] = 0;
			mesh.morphTargetInfluences[ currentKeyframe ] = 1;
			mesh.morphTargetInfluences[ keyframe ] = 0;

			lastKeyframe = currentKeyframe;
			currentKeyframe = keyframe;
		}
		mesh.morphTargetInfluences[ keyframe ] = ( time % interpolation ) / interpolation;
		mesh.morphTargetInfluences[ lastKeyframe ] = 1 - mesh.morphTargetInfluences[ keyframe ];
	}
};