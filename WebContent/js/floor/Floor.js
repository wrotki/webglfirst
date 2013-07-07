// https://github.com/mrdoob/three.js/wiki
// http://stemkoski.github.io/Three.js/
function Floor(origin){
    Actor.call(this,origin);
}
Floor.prototype = Object.create(Actor.prototype);
Floor.prototype.constructor = Floor;
Floor.prototype.createMeshes = function(){
    var OB = window.OtherBrane;
    var path = OB.mediaPath;
// The model gets loaded by Actor, given the modelUrl 
    SkyBox.prototype.basePath = path;
    var urlPrefix = SkyBox.prototype.basePath + "/3d/";

    // note: 4x4 checkboard pattern scaled so that each square is 25 by 25 pixels.
    var floorTexture = new THREE.ImageUtils.loadTexture( urlPrefix + 'checkerboard.jpg' );
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
    floorTexture.repeat.set( 10, 10 );
    // DoubleSide: render texture on both sides of mesh
    var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
    var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.5;
    floor.rotation.x = Math.PI / 2;

    var zmesh = floor;
    zmesh.position.x = this.origin.x;
    zmesh.position.y = this.origin.y;
    zmesh.position.z = this.origin.z;
    this.meshes.push(zmesh);
    return true;
};
