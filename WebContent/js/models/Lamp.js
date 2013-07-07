// http://bkcore.com/blog/3d/webgl-three-js-workflow-tips.html
// http://www.96methods.com/2012/02/three-js-importing-a-model/
//		THREE.AnimationHandler.add( geometry.animation );
// http://blog.tojicode.com/2011/10/building-game-part-3-skinning-animation.html
// These need to be defined prior to asActor call on the type
var OB = window.OtherBrane;
var path = OB.mediaPath;
function Lamp(origin)
{
    Actor.call(this,origin);
    this.components.push(new AnimateLampComponent(this));
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
    var zmesh = new THREE.SkinnedMesh(Lamp.prototype.model, new THREE.MeshLambertMaterial( { color: 0x606060, morphTargets: true } ));
    // Dirty hack to workaround missing property crashing Three.js
    zmesh.boneTexture = new Object();
    // End hack
    zmesh.position.set( this.origin.x, this.origin.y, this.origin.z );
    zmesh.scale.set( 1, 1, 1 );
    zmesh.overdraw = true;
    this.meshes.push(zmesh);
	return true;
};
