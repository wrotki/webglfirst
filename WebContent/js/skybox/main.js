define(["skybox/SkyBox"], 
        function(){
            return {
                initialize : function(scene){
                     scene.addActor(new SkyBox({x: 0, y: 0, z: 0}));
                }
            };
});