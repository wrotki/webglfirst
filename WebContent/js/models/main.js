define(["scene/Actor", "models/Shoe", "models/AnimateLampComponent", "models/Lamp", "models/LampCollada"], 
		function(){
			Array.max = function( array ){
				return Math.max.apply( Math, array );
			};
			Array.min = function( array ){
				return Math.min.apply( Math, array );
			};
    		return {
    		    initialize : function(scene){
                    scene.addActor(new LampCollada({x: -500, y: 0, z: -500}));
                    scene.addActor(new Lamp({x: -500, y: 0, z: 500}));
                    scene.addActor(new Shoe({x: 0, y:80, z: 0}));
    		    }
    		};
});