function SkyBox(origin){
    var OB = window.OtherBrane;
    var path = OB.bucketsPath;
// The model gets loaded by Actor, given the modelUrl 
    SkyBox.prototype.basePath = path;
	this.origin = origin;
}

SkyBox.prototype.createMeshes = function(){
    var urlPrefix = SkyBox.prototype.basePath + "/3d/";
    var urls = [ urlPrefix + "posx.jpg", urlPrefix + "negx.jpg",
        urlPrefix + "posy.jpg", urlPrefix + "negy.jpg",
        urlPrefix + "posz.jpg", urlPrefix + "negz.jpg" ];
    var textureCube = THREE.ImageUtils.loadTextureCube( urls );

    var shader = THREE.ShaderUtils.lib["cube"];
    var uniforms = THREE.UniformsUtils.clone( shader.uniforms );
    uniforms['tCube'].texture= textureCube;   // textureCube has been init before
    var material = new THREE.ShaderMaterial({
        fragmentShader    : shader.fragmentShader,
        vertexShader  : shader.vertexShader,
        uniforms  : uniforms
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
