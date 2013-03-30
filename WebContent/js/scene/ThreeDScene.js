function ThreeDScene(){

	this.moveEnabled = false;
    this.mouse = new THREE.Vector3( 0, 0, 1 );
    this.projector = new THREE.Projector();
            
    var container = dojo.doc.createElement( 'div' );
	dojo.doc.body.appendChild( container );
	
    var stats = this.stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '5px';
	stats.domElement.style.left = '5px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );

    var viewport = dojo.window.getBox();
    var w = viewport.w - 10, h = viewport.h -10 ;

    var canvasContainer = dojo.doc.createElement( 'div' );
    canvasContainer.style.position = 'absolute';
    canvasContainer.style.top = '5px';
    canvasContainer.style.left = '5px';
    canvasContainer.style.border = '5px';
    canvasContainer.style.zIndex = 10;
	dojo.doc.body.appendChild( canvasContainer );

    var renderer = this.renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.sortObjects = false;
    renderer.setSize( w, h );
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '5px';
    renderer.domElement.style.left = '5px';
    renderer.domElement.style.border = '5px';
    canvasContainer.appendChild( renderer.domElement );
    
	var scene = this.scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0xffffff, 1, 100000 );
    
    var camera = this.camera = new THREE.PerspectiveCamera( 45, w / h, 1, 10000 );
    // camera = new THREE.OrthographicCamera( -1, 1, 1,
	// -1, 0.1, 100.0 );
    camera.position.x = 200;
    camera.position.y = -30;
    camera.position.z = 10;
    
    //camera.lookAt(scene.position);
    //camera.target.position.copy( scene.position );
    //camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
    //camera.rotation.y = -90 * (Math.PI / 180);
    this.scene.add( camera );
    
    var light = new THREE.DirectionalLight();
    //light.color = 0x00FFFF;
    light.position.set( 170, 330, 160 );
    scene.add(light);

    light = new THREE.DirectionalLight();
    //light.color = 0xFF00FF;
    light.position.set( -50, 50, 50 );
    light.target.position.set(0,0,0);
    scene.add(light);

    light = new THREE.DirectionalLight();
    //light.color = 0xFFFF00;
    light.position.set( 50, 50, -50 );
    light.target.position.set(0,0,0);
    scene.add(light);

    this.clock = new THREE.Clock();
    
    //var fpControls = new THREE.FirstPersonControls( camera );
    var fpControls = new CameraControls( camera );
//    fpControls.movementSpeed = 10;
//    fpControls.lookSpeed = 0.01;
//    fpControls.noFly = false;
//    fpControls.lookVertical = true;
//    fpControls.freeze = false;
   
	var flyControls = new THREE.FlyControls( camera );
	flyControls.rollSpeed = 0.05;
	
	if(false){
		this.controls = fpControls;
	} else{
		this.controls = flyControls;
	}	this.actors = [];
	this.animations = [];
}

// Main animation loop
ThreeDScene.prototype.animate = function(){
    requestAnimationFrame( ThreeDScene.prototype.animate );
    ThreeDScene.prototype.update.call(window.threeDScene);
    ThreeDScene.prototype.render.call(window.threeDScene);
};

ThreeDScene.prototype.update = function() {
	this.updateActors();
	for(var i in this.actors){
		if (this.actors[i].update) {
			this.actors[i].update();
		}
	}
};

ThreeDScene.prototype.render = function() {
    var delta = this.clock.getDelta();
    this.controls.update( delta );
    THREE.AnimationHandler.update( delta );
    //camera.target.position.copy( this.scene.position );
    this.stats.update();
    this.morphAnimatedMeshes();

    this.renderer.render( this.scene, this.camera );
};

var dstep = -10;

ThreeDScene.prototype.startAnimation = function () {

	for( var i = 0; i < this.animations.length; i ++ ) {

		this.animations[ i ].offset = 0.05 * Math.random();
		this.animations[ i ].play();
	}

	dz = dstep;
	playback = true;

};

ThreeDScene.prototype.morphAnimatedMeshes = function(){
	for(var i in this.actors){
//		if (this.actors[i].state == ACTOR_STATE.ACTOR_SHOWN && 
//				this.actors[i].meshes &&
//				this.actors[i].meshes[0]) {
//
//			var mesh = this.actors[i].meshes[0];
//			// Alternate morph targets
//
//			var time = Date.now() % duration;
//
//			var keyframe = Math.floor( time / interpolation );
//            
//			if(mesh && mesh.morphTargetInfluences){
//				if ( keyframe != currentKeyframe ) {
//					mesh.morphTargetInfluences[ lastKeyframe ] = 0;
//					mesh.morphTargetInfluences[ currentKeyframe ] = 1;
//					mesh.morphTargetInfluences[ keyframe ] = 0;
//	
//					lastKeyframe = currentKeyframe;
//					currentKeyframe = keyframe;
//				}
//				mesh.morphTargetInfluences[ keyframe ] = ( time % interpolation ) / interpolation;
//				mesh.morphTargetInfluences[ lastKeyframe ] = 1 - mesh.morphTargetInfluences[ keyframe ];
//			}
//		}
	}
};

ThreeDScene.prototype.addActor = function(actor){
	this.actors.push(actor);
	if(actor.initialize){
		actor.initialize(this);
	}
};

ThreeDScene.prototype.updateActors = function(){
	for(var i in this.actors){
		var actor = this.actors[i];
		if(actor.state == ACTOR_STATE.MODEL_LOADED){
			if(actor.createMeshes){
				actor.createMeshes();
			}
			for(var m in actor.meshes){
				var mesh = actor.meshes[m];
				this.scene.add(mesh);
				if(mesh && mesh.geometry.animation){
					THREE.AnimationHandler.add( mesh.geometry.animation );
					var animation = new THREE.Animation( mesh, "take_001" );
					this.animations.push( animation );
				}
			}
			actor.state = ACTOR_STATE.ACTOR_SHOWN;
		}
	}
	this.startAnimation();
};
