function ChartGroup(chartGroupOrigin, label, baseColor, dataGroup)
{
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
	var chartPosition = new THREE.Vector3(chartGroupOrigin.x, chartGroupOrigin.y, chartGroupOrigin.z);
	this.charts = [];
	var keys = Object.keys(dataGroup);
	for (var i=0; i < keys.length; i++) {
		chartPosition.x += i * 300;
		chart = new Chart(chartPosition, keys[i], 0xffcc22, dataGroup[keys[i]]);
		this.charts.push(chart);
	};	
	addChartLabel.call(this, label);

};

ChartGroup.prototype.addToScene = function(scene){
	//scene.add(this.label);
	for(var c in this.charts){
		this.charts[c].addToScene(scene);
	}
	scene.add(this.label);
};
