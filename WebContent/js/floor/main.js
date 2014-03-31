define(["floor/Floor"], 
	function(){
        return {
            initialize : function(scene){
                scene.addActor(new Floor({x: 0, y: 0, z: 0}));
            }
        };
});