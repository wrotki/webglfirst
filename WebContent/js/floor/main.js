define(["floor/Floor"], 
		function(){
            return {
                initialize : function(scene){
                         asActor.call(Floor.prototype);
                         var origin = {x: 0, y: 0, z: 0} ;
                         var object = new Floor(origin);
                         scene.addActor(object);
                }
            };
});