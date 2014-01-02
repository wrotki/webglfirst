BOXMAN_STATE = {
		"GOOD" : "good",
		"EVIL" : "evil"
};
function BoxManBehaviorComponent(owner){
    this.owner  = owner;
    if(Math.random() < 0.5){
        this.state = BOXMAN_STATE.GOOD;
    } else{
        this.state = BOXMAN_STATE.EVIL;
    }
}

BoxManBehaviorComponent.prototype.update = function(){
	if(!this.owner.meshes || ! this.owner.meshes[0]){
		return;
	}
    this.observe();
    this.behave();
};

BoxManBehaviorComponent.prototype.observe = function(){
    var actors = this.owner.scene.actors;
    actors.forEach(function(actor){
        if(actor === this.owner){
            return;
        }
        if(Object.getPrototypeOf(this) !== BoxManBehaviorComponent.prototype){
            return;
        }
  	    var mesh = this.owner.meshes[0];
    },this);
};

BoxManBehaviorComponent.prototype.behave = function(){
	var mesh = this.owner.meshes[0];
	/*
    if(mesh.position.x < 0.0){
        mesh.position.x = 5.0;
        return;
    }
    if(mesh.position.x > 1000.0){
        mesh.position.x = 995.0;
        return;
    }
    if(mesh.position.z < 0.0){
        mesh.position.z = 5.0;
        return;
    }
    if(mesh.position.z > 1000.0){
        mesh.position.z = 995.0;
        return;
    }*/
	mesh.position.x += Math.random() - 0.5;
	mesh.position.z += Math.random() - 0.5;
};