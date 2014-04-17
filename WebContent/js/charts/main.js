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
                    var chartPosition, chartData;
                    chartPosition = {x:0,y:0,z:-500} ;
                    chartData = {
                        Demo: [1,2,4,8,16,32,24,12],
                        Demo2: [1,2,4,8,16,0,24,0],
                        Demo3: [1,2,4,8,0,32,0,12],
                        Demo4: [1,2,4,8,16,0,24,0],
                    };
//                    var key = Object.keys(chartData)[0];
//                    chart = new Chart(chartPosition,key,0x88ffaa,chartData[key]);
//                    scene.addActor(chart);
                    chartPosition = {x:10,y:10,z:-10} ;
                    chartGroup = new ChartGroup(chartPosition,"US",0x88ffaa,chartData);
//                    scene.addActor(chartGroup);
                }
            };
});