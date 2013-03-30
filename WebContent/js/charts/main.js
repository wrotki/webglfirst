define(["charts/ChartShaders", "charts/Chart","charts/ChartGroup"], 
		function(){
			Array.max = function( array ){
				return Math.max.apply( Math, array );
			};
			Array.min = function( array ){
				return Math.min.apply( Math, array );
			};
            return {
                initialize : function(scene){
                    asActor.call(Chart.prototype);
                    var chartPosition, chartData;
                    chartPosition = {x:40,y:30,z:-150} ;
                    chartData = {Demo: [1,2,4,8,16,32,24,12]} ;
                    var key = Object.keys(chartData)[0];
                    chart = new Chart(chartPosition,key,0x88ffaa,chartData[key]);
                    scene.addActor(chart);
                }
            };
});