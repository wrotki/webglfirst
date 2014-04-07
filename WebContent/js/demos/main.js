define(["demos/LightedCube"], 
		function(){
		    return {
                initialize : function(scene){
                     scene.addActor(new LightedCube({x: 30, y: 10, z: -10}));
                }
            };
});