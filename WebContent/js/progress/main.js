define(["progress/LightedCube"], 
		function(){
            return {
                initialize : function(scene){
                     asActor.call(LightedCube.prototype);
                     var origin = {x: -30, y: 80, z: -80} ;
                     var lightedCube = new LightedCube(origin);
                     scene.addActor(lightedCube);
                }
            };
});