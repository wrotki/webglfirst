function LightedCube(origin)
{
	this.origin = origin;
	
	this.litCube = new THREE.Mesh(
	        new THREE.CubeGeometry(200, 300, 250),
	        new THREE.MeshLambertMaterial({color: 0xFF0500}));
	this.litCube.position.x = this.origin.x;
	this.litCube.position.y = this.origin.y;
	this.litCube.position.z = this.origin.z;
}

LightedCube.prototype.addToScene = function(scene){
    scene.add(this.litCube);
};