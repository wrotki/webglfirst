define(["demos/LightedCube"], 
		function(){
		    return {
                initialize : function(scene){
                     scene.addActor(new LightedCube({x: 500, y: 00, z: 500}));
                }
            };
});