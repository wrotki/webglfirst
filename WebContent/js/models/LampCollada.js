// http://bkcore.com/blog/3d/webgl-three-js-workflow-tips.html
// http://www.96methods.com/2012/02/three-js-importing-a-model/
// THREE.AnimationHandler.add( geometry.animation );
//http://devmatrix.wordpress.com/2013/02/27/creating-skeletal-animation-in-blender-and-exporting-it-to-three-js/
//http://stackoverflow.com/questions/15095068/three-js-how-to-move-the-bones-of-a-skinnedmesh
// http://stemkoski.github.io/Three.js/
//http://stemkoski.github.io/Three.js/Model-Animation-Control.html

function LampCollada(origin)
{
    var OB = window.OtherBrane;
	var path = OB.mediaPath;
	//LampCollada.prototype.modelUrl = path + "/3d/car.dae";
    LampCollada.prototype.modelUrl = path + "/3d/lampscene.dae";
	LampCollada.prototype.modelLoader = new THREE.ColladaLoader();
	LampCollada.prototype.modelLoader.options.convertUpAxis = true;
	var prototype = LampCollada.prototype;
	var thisActor = this;
	
    LampCollada.prototype.modelCallback =  function ( collada ) {
        // Grab the collada scene data:
        dae = collada.scene;
        // No skin applied to my model so no need for the following:
        // var skin = collada.skins[ 0 ];
        // Scale-up the model so that we can see it:
        dae.scale.x = dae.scale.y = dae.scale.z = 25.0;
        prototype.colladaModel = dae;        
        prototype.addWaiters(thisActor.scene);
      };
	this.origin = origin;	
}

LampCollada.prototype.createMeshes = function(){
    LampCollada.prototype.colladaModel.position.set( this.origin.x, this.origin.y, this.origin.z );
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