'use strict';

/* Directives */


angular.module('d3Pie', ['d3', 'plot_data_prepation'])
.directive('d3Pie', ['d3', 'mod_chart_qc', 'mod_chart_status' ,'mod_chart_task',function(d3, mod_chart_qc, mod_chart_status, mod_chart_task) {
  // data should be provided as:
  // scope.data = {nodes : ['name' : name, group : group"], links : ["target" : id, "source " : id , "value" :  number] }
	return {
		restrict: 'EA',
		scope: {data: '=data',
				type : '=',},
		link: function(scope, element, attrs){
			scope.w = 800;
			scope.h = 400;
			var svg = d3.select(element[0])
				.append("svg")
				.attr("width", scope.w + 200)
				.attr("height", scope.h);

			scope.$watch(
				'data+type', 
				function(){
					return scope.render();
				}, true);
// define render function
			
			scope.render = function(){
				svg.selectAll('g.legend').remove();
				svg.selectAll('g.state').remove();
				svg.selectAll(".arc").remove(); 
				console.log("pie chart");
				var radius  =200;
				var data_mod = [];
				if (scope.type === "task") {data_mod = mod_chart_task(scope.data);}
				else if (scope.type === "QC") {data_mod = mod_chart_qc(scope.data);}
				else {data_mod = mod_chart_status(scope.data);}
				
				radius = Math.min(scope.w, scope.h) / 2;
				var color = d3.scale.category20();
				
				var arc = d3.svg.arc()
    				.innerRadius(radius - 100)
    				.outerRadius(radius - 20);

				var pie = d3.layout.pie()
				    .sort(null)
				    .value(function(d) { return d.data; });
      
				data_mod.forEach(function(d) {
				    d.data = +d.data;
				    
				  });
  				var count=0;
				   for (var i=data_mod.length; i--;) {
				     count+=data_mod[i].data;
				   }
  				var legend = svg.selectAll('g').data(pie(data_mod)).enter().append('g').attr('class', 'legend').attr("transform", "translate(0 ,20 )");
				legend.append('rect')
					.attr('x', scope.w )
					.attr('y', function(d, i){ return i *  25;})
					.attr('width', 10)
					.attr('height', 10)
					.style('fill', function(d) { 
					  return color(d.data.status);
					});

				legend.append('text')
					.attr('x', scope.w + 12)
					.attr('y', function(d, i){ return (i *  25) + 9;})
					.text(function(d)
					{ return d.data.status+" "+Math.floor((d.data.data/count)*100)+"%"; });
        
        
				var g = svg.selectAll(".arc")
					.data(pie(data_mod));
				g.exit().remove();
				g.enter().append("g")
					.attr("transform", "translate(400 ,200 )")
					.attr("class", "arc");

				var path = g.append("path")
					.attr("d", arc)
					.style("fill",  function(d) { 
						return color(d.data.status);
						})
					.each(function(d) { this._current = d; }); // redraw the arcs
   
				g.append("text")
					.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
					.attr("dy", ".35em")
					.style("text-anchor", "middle")
					.text(function(d) { return d.data.status; });
				};

		}
	};     
}]);