function ChartGroup(chartGroupOrigin, label, baseColor, dataGroup)
{
    Actor.call(this, chartGroupOrigin);

	function addChartLabel(label){
		var x = document.createElement( "canvas" );
		var xc = x.getContext("2d");
		x.width = x.height = 250;
		xc.fillStyle = "#000";
		xc.font = "70pt arial bold";
		xc.fillText(label, 10, 100);
	
		var xm = new THREE.MeshBasicMaterial( { map: new THREE.Texture( x ) } );
		xm.map.needsUpdate = true;
	
		var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 200, 200 ), xm );
		mesh.position.x = chartGroupOrigin.x + 200;
		mesh.position.y = chartGroupOrigin.y - 300;
		mesh.position.z = chartGroupOrigin.z + 200;
		mesh.doubleSided = true;
		mesh.updateMatrix();
		this.label = mesh;
	};
	
	//addChartLabel.call(this, label);
	var nextChartPosition = new THREE.Vector3(chartGroupOrigin.x, chartGroupOrigin.y, chartGroupOrigin.z);
	this.charts = [];
	var keys = Object.keys(dataGroup);
	for (var i=0; i < keys.length; i++) {
		nextChartPosition.x += i * 300;
	    var chartPosition = new THREE.Vector3(nextChartPosition.x, nextChartPosition.y, nextChartPosition.z);
		var chart = new Chart(chartPosition, keys[i], 0xffcc22, dataGroup[keys[i]]);
		this.charts.push(chart);
	};	
	addChartLabel.call(this, label);

};

ChartGroup.prototype = Object.create(Actor.prototype);
ChartGroup.prototype.constructor = ChartGroup;

ChartGroup.prototype.initialize = function(scene) {
    Actor.prototype.initialize.call(this, scene);
};

ChartGroup.prototype.createMeshes = function(){
    for(var i=0; i<this.charts.length; i++){
        this.charts[i].createMeshes();
        var graphMeshes = this.charts[i].meshes;
        for(var j=0;j<graphMeshes.length;j++){
            this.meshes.push(graphMeshes[j]);
        }
    }
};
ChartGroup.prototype.update = function(){
	if(!this.meshes || ! this.meshes[0]){
		return;
	}
    for(var i=0; i<this.charts.length; i++){
        this.charts[i].update();
    }
};

//ChartGroup.prototype.addToScene = function(scene){
//	//scene.add(this.label);
//	for(var c in this.charts){
//		this.charts[c].addToScene(scene);
//	}
//	scene.add(this.label);
//};
