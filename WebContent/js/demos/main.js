define(["demos/LightedCube"], 
		function(){
		    return {
                initialize : function(scene){
                     asActor.call(LightedCube.prototype);
                     var origin = {x: 20, y: 200, z: -80} ;
                     var lightedCube = new LightedCube(origin);
                     scene.addActor(lightedCube);
                }
            };
});