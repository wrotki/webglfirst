// http://bkcore.com/blog/3d/webgl-three-js-workflow-tips.html
// http://www.96methods.com/2012/02/three-js-importing-a-model/
// THREE.AnimationHandler.add( geometry.animation );
// http://devmatrix.wordpress.com/2013/02/27/creating-skeletal-animation-in-blender-and-exporting-it-to-three-js/
// http://stackoverflow.com/questions/15095068/three-js-how-to-move-the-bones-of-a-skinnedmesh
// http://stemkoski.github.io/Three.js/
// http://stemkoski.github.io/Three.js/Model-Animation-Control.html

// These need to be defined prior to asActor call on the type
var OB = window.OtherBrane;
var path = OB.mediaPath;
function BoxMan(origin)
{
    Actor.call(this,origin);
    this.components.push(new BoxManBehaviorComponent(this));
}
BoxMan.prototype = Object.create(Actor.prototype);
BoxMan.prototype.constructor = BoxMan;
BoxMan.prototype.modelUrl = path + "/3d/BoxMan.dae";
BoxMan.prototype.modelLoader = new THREE.ColladaLoader();
BoxMan.prototype.modelLoader.options.convertUpAxis = true;
BoxMan.prototype.modelCallback =  function ( collada ) {
    // Grab the collada scene data:
    dae = collada.scene;
    // No skin applied to my model so no need for the following:
    // var skin = collada.skins[ 0 ];
    // Scale-up the model so that we can see it:
    dae.scale.x = dae.scale.y = dae.scale.z = 25.0;
    BoxMan.prototype.colladaModel = dae;        
    BoxMan.prototype.addWaiters(); // Depends on the global window.OtherBrane.threeDScene
};
BoxMan.prototype.createMeshes = function(){
    var meshProto = BoxMan.prototype.colladaModel.children[1];
    var newMesh = new THREE.Mesh(meshProto.geometry, meshProto.material);
    newMesh.position.set( this.origin.x, this.origin.y, this.origin.z );
    this.meshes.push(newMesh);
	return true;
};
