function LightedCube(origin)
{
	this.origin = origin;
}

LightedCube.prototype.createMeshes = function(){
    var zmesh =  new THREE.Mesh(
            new THREE.CubeGeometry(50, 50, 50),
            new THREE.MeshLambertMaterial({color: 0xFF0500}));
    zmesh.position.x = this.origin.x;
    zmesh.position.y = this.origin.y;
    zmesh.position.z = this.origin.z;
    this.meshes.push(zmesh);
    return true;
};
