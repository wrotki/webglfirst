define(["demos/LightedCube"], 
		function(){
		    return {
                initialize : function(scene){
                     var origin = {x: 500, y: 00, z: 500} ;
                     var lightedCube = new LightedCube(origin);
                     lightedCube.initialize(scene);
                }
            };
});