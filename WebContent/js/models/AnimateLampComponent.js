function AnimateLampComponent(owner){
    this.owner  = owner;
}
var duration = 5000;
var keyframes = 30, interpolation = duration / keyframes;
var lastKeyframe = 0, currentKeyframe = 0;
AnimateLampComponent.prototype.update = function(){
	if(this.owner.state != ACTOR_STATE.ACTOR_SHOWN || !this.owner.meshes || ! this.owner.meshes[0]){
		return;
	}
	var mesh = this.owner.meshes[0];
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