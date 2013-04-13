// https://github.com/mrdoob/three.js/wiki
// http://stemkoski.github.io/Three.js/

function SkyBox(origin){
	this.origin = origin;
}

SkyBox.prototype.loadTextureCube = function(callback){
    var OB = window.OtherBrane;
    var path = OB.bucketsPath;
// The model gets loaded by Actor, given the modelUrl 
    SkyBox.prototype.basePath = path;
    var urlPrefix = SkyBox.prototype.basePath + "/3d/";
    var urls = [ urlPrefix + "posx.jpg", urlPrefix + "negx.jpg",
        urlPrefix + "posy.jpg", urlPrefix + "negy.jpg",
        urlPrefix + "posz.jpg", urlPrefix + "negz.jpg" ];
        
    // Need to wait for texture load
    var uvMapping = new THREE.UVMapping();
    
    SkyBox.prototype.textureCube = THREE.ImageUtils.loadTextureCube( urls, uvMapping, callback );
}

SkyBox.prototype.createMeshes = function(){

    var shader = THREE.ShaderUtils.lib["cube"];
    var uniforms = THREE.UniformsUtils.clone( shader.uniforms );
    uniforms['tCube'].texture= SkyBox.prototype.textureCube;   // textureCube has been init before
    var material = new THREE.ShaderMaterial({
        fragmentShader    : shader.fragmentShader,
        vertexShader  : shader.vertexShader,
        uniforms  : uniforms,
        depthWrite: false,
        side: THREE.BackSide
    });
    
    // build the skybox Mesh 
    var zmesh = new THREE.Mesh( new THREE.CubeGeometry( 9000, 9000, 9000, 1, 1, 1, null, true ), material );
    // add it to the scene
    zmesh.position.x = this.origin.x;
    zmesh.position.y = this.origin.y;
    zmesh.position.z = this.origin.z;
    this.meshes.push(zmesh);
    return true;
};
