define(["dojo","dojo/_base/xhr","dijit/Dialog", "scene/ThreeDebug",
    "scene/FlyControls", "scene/RequestAnimationFrame","scene/Stats",
    "scene/CameraControls","scene/ThreeDScene","scene/Constants","scene/Actor","scene/ColladaLoader"
    ],
		function(){
			return {
					animate: function(){
					    require(window.OtherBrane.moduleList, function(){ // The module list come from a list of S3 directories - obtained from /WebGLFirst/Config (dojoconfig.jsp)
    						window.threeDScene = this.threeDScene = new ThreeDScene();

                            for(var mod in arguments)
                            {
                                var module = arguments[mod]; 
                                module.initialize(this.threeDScene);
                            }
    						this.threeDScene.animate();
						});
					},
					initialize : function(){
					}
				};
		});