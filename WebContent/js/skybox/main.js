define(["skybox/SkyBox"], 
        function(){
            return {
                initialize : function(scene){
                     var skyBox = new SkyBox({x: 0, y: 0, z: 0}, scene);
                }
            };
});