function Ruler(chart)
{
	Ruler.LineWidth = 2;

	function addRulerLineBlock(range, vertical, offset){
		var hScale = this.chart.getHorizontalScale();
		var vScale = this.chart.getVerticalScale();
		var height = vertical ? range * vScale : Ruler.LineWidth;
		var depth = vertical ? Ruler.LineWidth : range * hScale;
		var chartOrigin = this.chart.getOrigin();		
		
	    var geometry = new THREE.CubeGeometry( Ruler.LineWidth, height, -depth );
	    var material = new THREE.MeshBasicMaterial( { color: 0, wireframe: false, } );	    
	    var rulerBlock = new THREE.Mesh( geometry, material );
	    
	    rulerBlock.position.x = chartOrigin.x;
	    var yOffset = vertical ? vScale * range / 2 : 0;
	    rulerBlock.position.y = (vertical ? 0 : vScale * offset ) + chartOrigin.y + yOffset ;
	    var hOffset = (vertical ? offset : 0) + (vertical ? 0 : hScale * range / 2);
	    rulerBlock.position.z = -(vertical ? hScale * offset : 0 ) + chartOrigin.z - hOffset ;
	    this.rulerLines.push(rulerBlock);
	};
    
	function addLabel(label, position){
		var x = document.createElement( "canvas" );
		var xc = x.getContext("2d");
		x.width = x.height = 250;
		xc.fillStyle = "#000";
		xc.font = "50pt arial bold";
		xc.fillText(label, 10, 100);
	
		var xm = new THREE.MeshBasicMaterial( { map: new THREE.Texture( x ), } );
		xm.map.needsUpdate = true;
	
		var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 200, 200 ), xm );

		var hScale = this.chart.getHorizontalScale();
		var vScale = this.chart.getVerticalScale();
		var chartOrigin = this.chart.getOrigin();		

		mesh.position.x = position.x + chartOrigin.x;
		mesh.position.y = position.y * vScale + chartOrigin.y;
		mesh.position.z = -position.z * hScale + chartOrigin.z;
		mesh.doubleSided = true;
		mesh.updateMatrix();
		this.label = mesh;
	    this.rulerLines.push(mesh);
	};
	
	this.rulerLines = [];
	this.chart = chart;
	var series = this.chart.getSeries();
	var max = Array.max(series);
	addRulerLineBlock.call(this, series.length, false, 0);
	addRulerLineBlock.call(this, series.length, false, max);
	addRulerLineBlock.call(this, max, true, 0);
	addRulerLineBlock.call(this, max, true, series.length);
	var lposition = new THREE.Vector3(0, 0, series.length);
	addLabel.call(this, series.length.toString(), lposition);
	lposition = new THREE.Vector3(0, max, 0);
	addLabel.call(this, max.toString(), lposition);
	lposition = new THREE.Vector3(0, 0, 0);
	addLabel.call(this, "0", lposition);
};
