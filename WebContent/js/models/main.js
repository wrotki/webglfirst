define(["scene/Actor", "models/Shoe", "models/AnimateLampComponent", "models/Lamp", "models/LampCollada", "models/BoxMan", "models/BoxManBehaviorComponent"],
		function(){
    		return {
    		    initialize : function(scene){
//                    scene.addActor(new LampCollada({x: -500, y: 0, z: -500}));
//                    scene.addActor(new Lamp({x: -500, y: 0, z: 500}));
//                    scene.addActor(new Shoe({x: 0, y:80, z: 0}));
                    for(var i = 0; i < 1; i++){
//                        scene.addActor(new BoxMan({x: 1000.0*(Math.random()-0.5), y: 10, z: 1000.0*(Math.random()-0.5)}));
                        scene.addActor(new BoxMan({x: 0, y: 10, z: 0}));
                    }
    		    }
    		};
});