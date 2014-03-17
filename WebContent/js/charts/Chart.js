// http://www.aerotwist.com/tutorials/an-introduction-to-shaders-part-1/
function Chart(chartOrigin, label, blockColor, series)
{
    Actor.call(this, chartOrigin);
	this.series = series;
	this.chartOrigin = chartOrigin;
	this.labelText = label;
};
Chart.prototype = Object.create(Actor.prototype);
Chart.prototype.constructor = Chart;


Chart.VerticalSize = 800;
Chart.HorizontalSize = 1200;
Chart.prototype.prepareMeshes = function(){    
    var attributes = this.attributes = {
      displacement: {
        type: 'f', // a float
        value: [] // an empty array
      },
      gradient: {
        type: 'f', // a float
        value: [] // an empty array
      }
    };
    this.material = new THREE.ShaderMaterial({
        attributes: attributes,
        vertexShader:   CHART.Shaders.ChartAttribute['vertex'],
        fragmentShader: CHART.Shaders.ChartAttribute['fragment']
    });
    this.mergedGeo = new THREE.Geometry();
	
	function addChartBlock(index, value){
		var hScale = this.getHorizontalScale();
		var vScale = this.getVerticalScale();
	    //var geometry = new THREE.CubeGeometry( 30, value*vScale, 30 );
        var geometry = new THREE.CubeGeometry( 30, 30, 30 );
	    
	    var tempMaterial = new THREE.MeshLambertMaterial({color: 0xFF0500});

	    var chartBlock = new THREE.Mesh( geometry, tempMaterial );
	    chartBlock.position.x = this.chartOrigin.x;
	    chartBlock.position.y = this.chartOrigin.y + /*value * */ vScale / 2;
	    chartBlock.position.z = this.chartOrigin.z - index * hScale;
	    this.chartBlocks[index] = chartBlock;
	    
	    THREE.GeometryUtils.merge(this.mergedGeo, chartBlock);
	};
    
	function addChartLabel(){
		var x = document.createElement( "canvas" );
		var xc = x.getContext("2d");
		x.width = x.height = 250;
		xc.fillStyle = "#000";
		xc.font = "50pt arial bold";
		xc.fillText(this.labelText, 10, 100);
	
		var xm = new THREE.MeshBasicMaterial( { map: new THREE.Texture( x ) } );
		xm.map.needsUpdate = true;
	
		var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 200, 200 ), xm );
		mesh.position.x = this.chartOrigin.x;
		mesh.position.y = this.chartOrigin.y -100;
		mesh.position.z = this.chartOrigin.z +100;
		mesh.doubleSided = true;
		mesh.updateMatrix();
		this.label = mesh;
	};
	
	function addRulers(){
		this.ruler = new Ruler(this);
	};
//  TODO: uncomment	
//	addChartLabel.call(this);
//	addRulers.call(this);
	this.chartBlocks = [];
	for(var i=0; i<this.series.length; i++){
		addChartBlock.call(this,i,this.series[i]);
	}
	
};

Chart.prototype.createMeshes = function(){
	if(this.mergedGeo == null){
    	this.prepareMeshes();
    	// http://learningthreejs.com/data/performance-merging-geometry/#%7B%22nCubes%22%3A50000%2C%22doMerge%22%3Atrue%7D
    	// this.geometry = this.chartBlocks[0].geometry;
        // for(var i=1;i<this.chartBlocks.length;i++){
    		// THREE.GeometryUtils.merge(this.geometry, this.chartBlocks[i].geometry);
    	// }
        this.mergedGeo.computeFaceNormals();
    	var group = new THREE.Mesh( this.mergedGeo, this.material );
    	group.position = new THREE.Vector3(this.chartOrigin.x,this.chartOrigin.y,this.chartOrigin.z);
    	group.matrixAutoUpdate = false;
    	group.updateMatrix(); 
    	this.meshes.push(group);
        this.lastUpdated = Date.now();
    } 
    this.setValues();	
//	TODO: uncomment
//	this.meshes.push(this.label);
//	
//	// TODO: rework this to be a proper composite
//	for(var i in this.ruler.rulerLines){
//	    this.meshes.push(this.ruler.rulerLines[i]); // Includes label
//	} 
	return true;
};

Chart.prototype.removeMeshes = function(){
    for(var i in this.meshes){
		var mesh = this.meshes[i];
		this.scene.scene.remove(mesh);
	}
    this.meshes = [];
    this.mergedGeo = null;
};

Chart.prototype.setValues = function(){
    // now populate the array of attributes
    var verts =
      this.mergedGeo.vertices;
    
    this.attributes.displacement.value.length = verts.length;
    var values =
      this.attributes.displacement.value;
      
    this.attributes.gradient.value.length = verts.length;
    var gradients = 
        this.attributes.gradient.value;
        
    for(var v = 0; v < verts.length; v++) {
      var chartIndex = Math.floor(v/8 /* 8 */);
      var chartVal = this.series[chartIndex];
      var odd = 1 ;chartIndex % 2;
      values[v] = odd * chartVal /** 30*/;
      gradients[v] = v / 8.0 - Math.floor(v/8.0);
    }
    this.attributes.displacement.needsUpdate = true;
};


Chart.prototype.getHorizontalScale = function(){
	return Chart.HorizontalSize/this.series.length;
};

Chart.prototype.getVerticalScale = function(){
	return Chart.VerticalSize/Array.max(this.series);
};

Chart.prototype.getOrigin = function(){
	return this.chartOrigin;
};

Chart.prototype.getSeries = function(){
	return this.series;
};

Chart.prototype.createMesh = function(){
	return true;
};

Chart.prototype.update = function(){
    return;
	if(!this.meshes || ! this.meshes[0]){
		return;
	}
	
	var thisRef = this;
    if((Date.now() - this.lastUpdated > 1000)){
        this.lastUpdated = Date.now();
        
        require(["dojo/request"], function(request){
            request("/WebGLFirst/Graph").then(
                function(text){
                    //console.log("New data at: " + Date.now());
                    thisRef.series = eval(text);
                    if(thisRef.attributes.displacement.value.length/8 != thisRef.series.length){
                        thisRef.removeMeshes();
                        thisRef.state = ACTOR_STATE.MODEL_LOADED; // Trigger re-creation
                    } else {
                        thisRef.setValues();
                    }
                    //console.log("Processing done at: " + Date.now());
                },
                function(error){
                    console.log("An error occurred: " + error);
                }
            );
        });
    } else{
        //console.log('Waiting...')
    }
};