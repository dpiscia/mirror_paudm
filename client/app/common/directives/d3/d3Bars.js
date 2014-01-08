'use strict';

/* Directives */


angular.module('d3Bars', ['d3', 'plot_data_prepation'])
.directive('d3Bars', ['d3',  'mod_chart_qc' ,'mod_chart_task','mod_chart_status', function(d3,mod_chart_qc,mod_chart_task,mod_chart_status) {
  // data should be provided as:
  // scope.data = {nodes : ['name' : name, group : group"], links : ["target" : id, "source " : id , "value" :  number] }
	return {
		restrict: 'EA',
		scope: {data: '=data',
				type : '=',},
		link: function(scope, element, attrs){
			scope.w = (800 + 300);
			scope.h = 400;
      		var svg = d3.select(element[0])
				.append("svg")
				.attr("width", scope.w + 60)
				.attr("height",scope.h + 60).
				append("g")
				.attr("transform", "translate(60 ,20 )");;

			scope.$watch(
				'data+type', 
				function(){
					return scope.render();
				}, true);
// define render function
			
			scope.render = function(){
				var data_mod = [];
				if (scope.type === "task") {data_mod = mod_chart_task(scope.data);}
				else if (scope.type === "QC") {data_mod = mod_chart_qc(scope.data);}
				else {data_mod = mod_chart_status(scope.data);}
				svg.selectAll("g").remove();
				svg.selectAll(".bar").remove();
				
				var x = d3.scale.ordinal()
					.rangeRoundBands([0, (scope.w - 300) ], 0.1 , 0.5);
				//300 px for legend space
				var y = d3.scale.linear()
				    .range([400, 0]);

				var xAxis = d3.svg.axis()
				    .scale(x)
				    ;
				
				var yAxis = d3.svg.axis()
				    .scale(y)
				    .orient("left");
				    
				 var color = d3.scale.category20();   
    
				data_mod.forEach(function(d) {
				    d.data = +d.data;
				  });
  				var legend = svg.selectAll('g').data(data_mod).enter().append('g').attr('class', 'legend').attr("transform", "translate(0 ,20 )");
				legend.append('rect')
					.attr('x', scope.w - 300)
					.attr('y', function(d, i){ return i *  25;})
					.attr('width', 10)
					.attr('height', 10)
					.style('fill', function(d) { 
					  return color(d.status);
					});
				legend.append('text')
					.attr('x', scope.w - 280)
					.attr('y', function(d, i){ return (i *  25) + 9;})
					.text(function(d,nodes)
						{ return d.status+" counts: "+d.data; });
        		
        		x.domain(data_mod.map(function(d) { return d.status; }));
 				y.domain([0, d3.max(data_mod, function(d) { return d.data; })]);

				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + 400 + ")")
					.call(xAxis);

				svg.append("g")
					.attr("class", "y axis")
					.call(yAxis)
					.attr("transform", "translate(20,0)")
					.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 6)
					.attr("dy", ".71em")
					.style("text-anchor", "end")
					.text("Frequency");
      
      			var bars = svg.selectAll(".bar")
					.data(data_mod);
      			
      			bars.exit().remove();  
				bars.enter().append("rect")
					.attr("class", "bar")
					.attr("x", function(d) { return x(d.status); })
					.attr("width", x.rangeBand())
					.attr("y", scope.h)
					.attr("height", 0)
					.style("fill", function(d) { 
						return color(d.status);
        			});
      			svg.select("g.x.axis").selectAll("text").remove();
				bars.transition()
					.delay(function(d, i) { return i * 50; })
					.attr("y", function(d) { return y(d.data); })
					.attr("height", function(d) { return 400 - y(d.data); });
				};
//.attr("transform", function(d, i) { return "translate(0,0) rotate(-45)"; }); 
		}
	};     
}]);