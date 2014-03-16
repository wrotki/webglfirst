/**
 * @author mariusz
 */
function Actor(origin) {
    this.meshes = [];
    this.components = []; // Here be dragons - i.e. AI, physics, and every other aspect of an Actor.
    this.origin = origin;
}
Actor.prototype.initialize = function(scene) {
        this.scene = scene; 
        // prototype.model is initialized by the first instance and shared by others, need to handle a potential race
        var prototype = Object.getPrototypeOf(this);
        if(prototype.modelUrl){ 
            if(!prototype.modelRequested) {
                prototype.modelRequested = true;
                prototype.waiters = [];
                prototype.modelLoader.load(prototype.modelUrl, prototype.modelCallback);            
            }
            this.state = ACTOR_STATE.MODEL_REQUESTED;
            this.waiters.push(this);
            return this;
        } else {
            this.state = ACTOR_STATE.MODEL_LOADED;
        }
        this.initialized = true;
        this.scene.addActor(this);
        return this;
};
Actor.prototype.addWaiters = function(){
     for(var i=0;i<this.waiters.length;i++){
            var actor = this.waiters[i];
            actor.state = ACTOR_STATE.MODEL_LOADED;
            actor.meshesCreated = actor.createMeshes();
            for(var m=0;m<actor.meshes.length;m++){
                actor.meshes[m].parentActor = actor;// For debugging
            }
            actor.initialized = true;
            // TODO consider removing the threeDScene global to enable multiple scenes and renderers on the page
            window.OtherBrane.threeDScene.addActor(actor);
      }
};
Actor.prototype.update = function(){
      for(i=0;i<this.components.length;i++){
          this.components[i].update();
      }       
};
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
  this.addWaiters = function(){
     for(var i=0;i<this.waiters.length;i++){
            var actor = this.waiters[i];
            actor.state = ACTOR_STATE.MODEL_LOADED;
            actor.meshesCreated = actor.createMeshes();
            for(var m=0;m<actor.meshes.length;m++){
            	actor.meshes[m].parentActor = actor;// For debugging
            }
            actor.initialized = true;
            // TODO consider removing the threeDScene global to enable multiple scenes and renderers on the page
            window.OtherBrane.threeDScene.addActor(actor);
      }
  };
  prototype.update = function(){
      for(i=0;i<this.components.length;i++){
          this.components[i].update();
      }       
  }
};    
