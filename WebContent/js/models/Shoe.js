// http://bkcore.com/blog/3d/webgl-three-js-workflow-tips.html

function Shoe(origin)
{
    var OB = window.OtherBrane;
    var path = OB.mediaPath;
// The model gets loaded by Actor, given the modelUrl 
    Shoe.prototype.modelUrl = path + "/3d/shoe.js";
	this.origin = origin;
}

Shoe.prototype.initialize = function(scene) {
        this.scene = scene; 
        this.meshes = [];
        var prototype = Object.getPrototypeOf(this);
        var createGeometry = function( geometry, materials ){
            prototype.model = geometry;
            prototype.materials = materials;            
            for(var i in prototype.waiters){
                var actor = prototype.waiters[i];
                actor.state = ACTOR_STATE.MODEL_LOADED;
                actor.meshesCreated = actor.createMeshes();
                actor.initialized = true;
                scene.addActor(actor);
            }
        };
        // prototype.model is initialized by the first instance and shared by others, need to handle a potential race
        if(prototype.modelUrl){ 
            if(!prototype.modelRequested) {
                var loader = new THREE.JSONLoader();
                
                // TODO - refactor using pattern similar to Dojo request() , adding objects to scene in from a callback
                // eliminate state machine, maintaining actors state changes it is hard to comprehend
                loader.load(prototype.modelUrl, createGeometry);
                prototype.modelRequested = true;
                prototype.waiters = [];
            }
            this.state = ACTOR_STATE.MODEL_REQUESTED;
            prototype.waiters.push(this);
        } else {
            this.state = ACTOR_STATE.MODEL_LOADED;
        }
          return this;
};  

//var Circle = function(radius) {
//    this.radius = radius;
//};
//asCircle.call(Circle.prototype);

/*
var load Dae = function(){
      var dae;
      // Create an instance of the collada loader:
      var loader = new THREE.ColladaLoader();
      // Need to convert the axes so that our model does not stand upside-down:
      loader.options.convertUpAxis = true;
      // Load the 3D collada file (robot01.dae in my example), and specify
      // the callback function that is called once the model has loaded:
      loader.load( './models/robot01.dae', function ( collada ) {
        // Grab the collada scene data:
        dae = collada.scene;
        // No skin applied to my model so no need for the following:
        // var skin = collada.skins[ 0 ];
        // Scale-up the model so that we can see it:
        dae.scale.x = dae.scale.y = dae.scale.z = 25.0;
        // Initialise and then animate the 3D scene
        // since we have now successfully loaded the model:
            init();
            animate();
      });
 };
*/
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