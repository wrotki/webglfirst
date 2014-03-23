define(["dojo","dojo/_base/xhr","dijit/Dialog", "scene/ThreeDebug",
    "scene/FlyControls", "scene/FirstPersonControls",  "scene/RequestAnimationFrame","scene/Stats",
    "scene/CameraControls","scene/ThreeDScene","scene/Constants","scene/Functions","scene/Actor","scene/ColladaLoader"
    ],
		function(){
			return {
					animate: function(){
					    require(window.OtherBrane.moduleList, function(){ // The module list come from a list of S3 directories - obtained from /WebGLFirst/Config (dojoconfig.jsp)
//					        return;
					        // TODO consider removing the threeDScene global to enable multiple scenes and renderers on the page
    						window.OtherBrane.threeDScene = this.threeDScene = new ThreeDScene();
                            for(var mod=0;mod<arguments.length;mod++)
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