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
    		            		        
                    //asActor.call(Lamp.prototype);
                    // var lampOrigin = {x: 500, y: 0, z: -500};
                    // lamp = new Lamp(lampOrigin);
                    // lamp.initialize(scene);
                    
                    //asActor.call(Shoe.prototype);
                    //var origin = {x: 500, y: 0, z: 0} ;
                    //var shoe = new Shoe(origin);
                    //shoe.initialize(scene);
                    //scene.addActor(shoe);
                /*
                    origin = {x: 150, y: 0, z: -120} ;
                    shoe = new Shoe(origin);
                    scene.addActor(shoe);
                    
                    origin = {x: 180, y: 30, z: -120} ;
                    shoe = new Shoe(origin);
                    scene.addActor(shoe);
                    
                    origin = {x: 110, y: 80, z: -120} ;
                    shoe = new Shoe(origin);
                    scene.addActor(shoe);
                    
                    origin = {x: 250,y:300,z:-120} ;
                    shoe = new Shoe(origin);
                    scene.addActor(shoe);
                    
                    origin = {x: 180,y:220,z:-80} ;
                    shoe = new Shoe(origin);
                    scene.addActor(shoe);
                    
                    origin = {x: 200,y:30,z:-50} ;
                    shoe = new Shoe(origin);
                    scene.addActor(shoe);
                    
                    origin = {x: 20,y:-30,z:-20} ;
                    shoe = new Shoe(origin);
                    scene.addActor(shoe);
                    
                    origin = {x: 80,y:90,z:-50} ;
                    shoe = new Shoe(origin);
                    scene.addActor(shoe);
                    
                    origin = {x: 10,y:70,z:-90} ;
                    shoe = new Shoe(origin);
                    scene.addActor(shoe);
                    */
    		    }
    		};
});