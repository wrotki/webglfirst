/**
 * @author mariusz
 */

 /*
 Protocol spec:
 https://www.websequencediagrams.com/#
 */
function Actor(origin) {
    this.meshes = [];
    this.components = []; // Here be dragons - i.e. AI, physics, and every other aspect of an Actor.
    this.origin = origin;
}
// Dummy loader and callback for models with no resources to download
Actor.prototype.modelLoader = {
    load: function(url, callback) {
        callback();
    }
};
Actor.prototype.modelCallback = function(geometry, materials) {
    Actor.prototype.addWaiters();
};
Actor.prototype.initialize = function(scene) {
    var prototype = Object.getPrototypeOf(this);
    Actor.prototype.scene = scene;
    this.state = ACTOR_STATE.MODEL_REQUESTED;
    if(!prototype.modelRequested) {
        prototype.modelRequested = true;
        prototype.modelLoader.load(prototype.modelUrl, prototype.modelCallback);
    }
    this.initialized = true;
    return this;
};
Actor.prototype.addMeshesToScene = function(waiters){
    for(var i=0;i<waiters.length;i++){
        var actor = waiters[i];
        actor.state = ACTOR_STATE.MODEL_LOADED;
        actor.createMeshes();
        for(var m=0;m<actor.meshes.length;m++){
            actor.meshes[m].parentActor = actor;// For debugging
		    Actor.prototype.scene.scene.add(actor.meshes[m]);
        }
        actor.initialized = true;
        // TODO consider removing the threeDScene global to enable multiple scenes and renderers on the page
//        window.OtherBrane.threeDScene.addActor(actor);
    }
};
Actor.prototype.addWaiters = function(typeWaiters){
//    var prototype = Object.getPrototypeOf(this);
    var waiters = typeWaiters;
    if(!waiters){
        waiters = prototype.waiters;
    }
    for(var i=0;i<waiters.length;i++){
        var actor = waiters[i];
        actor.state = ACTOR_STATE.MODEL_LOADED;
        actor.meshesCreated = actor.createMeshes();
        for(var m=0;m<actor.meshes.length;m++){
            actor.meshes[m].parentActor = actor;// For debugging
		    Actor.prototype.scene.scene.add(actor.meshes[m]);
        }
        actor.initialized = true;
        // TODO consider removing the threeDScene global to enable multiple scenes and renderers on the page
//        window.OtherBrane.threeDScene.addActor(actor);
    }
};
Actor.prototype.update = function(){
      for(i=0;i<this.components.length;i++){
          this.components[i].update();
      }       
};
//var asActor = function() {
//  var prototype = Object.getPrototypeOf(this);
//  this.initialize = function(scene) {
//        this.scene = scene;
//        this.meshes = [];
//        prototype.components = []; // Here be dragons - i.e. AI, physics, and every other aspect of an Actor. Let's assume for the moment
//        // that the component's are not different between instances of a class
//        // prototype.model is initialized by the first instance and shared by others, need to handle a potential race
//        if(prototype.modelUrl){
//            if(!prototype.modelRequested) {
//                prototype.modelRequested = true;
//                prototype.waiters = [];
//                prototype.modelLoader.load(prototype.modelUrl, prototype.modelCallback);
//            }
//            this.state = ACTOR_STATE.MODEL_REQUESTED;
//            prototype.waiters.push(this);
//        } else {
//            this.state = ACTOR_STATE.MODEL_LOADED;
//        }
//         return this;
//  };
//  this.addWaiters = function(){
//     for(var i=0;i<this.waiters.length;i++){
//            var actor = this.waiters[i];
//            actor.state = ACTOR_STATE.MODEL_LOADED;
//            actor.meshesCreated = actor.createMeshes();
//            for(var m=0;m<actor.meshes.length;m++){
//            	actor.meshes[m].parentActor = actor;// For debugging
//		        this.scene.scene.add(actor.meshes[m]);
//            }
//            actor.initialized = true;
//            // TODO consider removing the threeDScene global to enable multiple scenes and renderers on the page
////            window.OtherBrane.threeDScene.addActor(actor);
//      }
//  };
//  prototype.update = function(){
//      for(i=0;i<this.components.length;i++){
//          this.components[i].update();
//      }
//  }
//};
