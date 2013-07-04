/**
 * @author mariusz
 */
var asActor = function() {
  var prototype = Object.getPrototypeOf(this);
  this.initialize = function(scene) {
        this.scene = scene; 
        this.meshes = [];
        prototype.components = []; // Here be dragons - i.e. AI, physics, and every other aspect of an Actor. Let's assume for the moment 
        // that the component's are not different between instances of a class 
        // prototype.model is initialized by the first instance and shared by others, need to handle a potential race
        if(prototype.modelUrl){ 
            if(!prototype.modelRequested) {
                prototype.modelRequested = true;
                prototype.waiters = [];
                prototype.modelLoader.load(prototype.modelUrl, prototype.modelCallback);            
            }
            this.state = ACTOR_STATE.MODEL_REQUESTED;
            prototype.waiters.push(this);
        } else {
            this.state = ACTOR_STATE.MODEL_LOADED;
        }
         return this;
  };
  this.addWaiters = function(scene){
     for(var i in this.waiters){
            var actor = this.waiters[i];
            actor.state = ACTOR_STATE.MODEL_LOADED;
            actor.meshesCreated = actor.createMeshes();
            actor.initialized = true;
            scene.addActor(actor);
      }
  };
  prototype.update = function(){
      for i=0;i<this.components.length;i++){
          this.components[i].update();
      }       
  }
};    
