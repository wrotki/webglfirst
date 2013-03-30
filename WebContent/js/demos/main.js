define(["demos/LightedCube"], 
		function(){
		    return {
                initialize : function(scene){
                     var origin = {x: 50, y: 800, z: -40} ;
                     var lightedCube = new LightedCube(origin);
                     scene.addActor(lightedCube);
                }
            };
});