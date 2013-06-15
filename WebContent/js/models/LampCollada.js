// http://bkcore.com/blog/3d/webgl-three-js-workflow-tips.html
// http://www.96methods.com/2012/02/three-js-importing-a-model/
//		THREE.AnimationHandler.add( geometry.animation );
function LampCollada(origin)
{
    var OB = window.OtherBrane;
	var path = OB.mediaPath;
	Lamp.prototype.modelUrl = path + "/3d/lamp.js";
	this.origin = origin;	
}

LampCollada.prototype.initialize = function(scene) {
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
        return this;
};  

//var Circle = function(radius) {
//    this.radius = radius;
//};
//asCircle.call(Circle.prototype);

/*
var load Dae = function(){
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
*/
Lamp.prototype.createMeshes = function(){
    var zmesh = new THREE.SkinnedMesh(Lamp.prototype.model, new THREE.MeshLambertMaterial( { color: 0x606060, morphTargets: true } )
    /*new THREE.MeshFaceMaterial(), false */);
    zmesh.position.set( this.origin.x, this.origin.y, this.origin.z );
    zmesh.scale.set( 1, 1, 1 );
    zmesh.overdraw = true;
    this.meshes.push(zmesh);
	return true;
};

//TODO this is very temporary, make it per-object later

var duration = 5000;
var keyframes = 30, interpolation = duration / keyframes;
var lastKeyframe = 0, currentKeyframe = 0;

Lamp.prototype.update = function(){
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