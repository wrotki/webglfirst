// http://bkcore.com/blog/3d/webgl-three-js-workflow-tips.html
// http://www.96methods.com/2012/02/three-js-importing-a-model/
//		THREE.AnimationHandler.add( geometry.animation );
// http://blog.tojicode.com/2011/10/building-game-part-3-skinning-animation.html
// These need to be defined prior to asActor call on the type
var OB = window.OtherBrane;
var path = OB.mediaPath;
function Lamp(origin)
{
    Actor.call(this);
	this.origin = origin;	
}
Lamp.prototype = Object.create(Actor.prototype);
Lamp.prototype.constructor = Lamp;
Lamp.prototype.modelUrl = path + "/3d/lamp.js";
Lamp.prototype.modelLoader = new THREE.JSONLoader();
Lamp.prototype.modelCallback =  function ( model ) {
        Lamp.prototype.model = model;        
        Lamp.prototype.addWaiters(); // Depends on the global window.OtherBrane.threeDScene
};
Lamp.prototype.createMeshes = function(){
    var zmesh = new THREE.SkinnedMesh(Lamp.prototype.model, new THREE.MeshLambertMaterial( { color: 0x606060, morphTargets: true } )
    // Dirty hack to workaround missing property crashing Three.js
    zmesh.boneTexture = new Object();
    // End hack
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

Lamp.prototype.update_old = function(){
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
