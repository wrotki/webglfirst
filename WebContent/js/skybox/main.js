define(["skybox/SkyBox"], 
		function(){
            return {
                initialize : function(scene){
                     asActor.call(SkyBox.prototype);
                     var origin = {x: 0, y: 0, z: 0} ;
                     var skyBox = new SkyBox(origin);
                     scene.addActor(skyBox);
                }
            };
});