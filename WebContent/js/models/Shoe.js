// http://bkcore.com/blog/3d/webgl-three-js-workflow-tips.html

function Shoe(origin)
{
    var OB = window.OtherBrane;
    var path = OB.mediaPath;
// The model gets loaded by Actor, given the modelUrl 
    Shoe.prototype.modelUrl = path + "/3d/shoe.js";
	this.origin = origin;
}


Shoe.prototype.createMeshes = function(){
    var zmesh = new THREE.Mesh(Shoe.prototype.model, new THREE.MeshFaceMaterial(Shoe.prototype.materials));
    zmesh.position.set( this.origin.x, this.origin.y, this.origin.z );
    zmesh.scale.set( 1, 1, 1 );
    zmesh.overdraw = true;
    this.meshes.push(zmesh);
	return true;
};

Shoe.prototype.update = function(){
	if(!this.meshes || ! this.meshes[0]){
		return;
	}
	var mesh = this.meshes[0];
	var x = Date.now()/1000;
	var y = Date.now()/1000;
	var z = Date.now()/1000;
	mesh.position.x = this.origin.x + Math.sin(x) * 100;
	mesh.position.y = this.origin.y + Math.cos(y) * 100;
	mesh.position.z = this.origin.z + Math.sin(z) * 100;
};