function LightedCube(origin)
{
    Actor.call(this,origin);
}
LightedCube.prototype = Object.create(Actor.prototype);
LightedCube.prototype.constructor = LightedCube;
LightedCube.prototype.initialize = function(scene) {
    var prototype = LightedCube.prototype;
    if(!prototype.waiters) {
        prototype.waiters = [];
    }
    prototype.waiters.push(this);
    Actor.prototype.modelRequested = true;
    Actor.prototype.initialize.call(this, scene);
    Actor.prototype.addMeshesToScene(LightedCube.prototype.waiters);
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
