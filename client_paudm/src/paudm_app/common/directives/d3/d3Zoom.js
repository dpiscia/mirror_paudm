'use strict';

/* Directives */


angular.module('d3Zoom', ['d3', 'plot_data_prepation','d3_tooltip'])
.directive('d3Zoom', ['d3',  'tree_dict_from_flatten' ,'group_task','group_status','d3_tip', function(d3,tree_dict_from_flatten,group_task, group_status,d3_tip) {
  // data should be provided as:
  // scope.data = {nodes : ['name' : name, group : group"], links : ["target" : id, "source " : id , "value" :  number] }
	return {
		restrict: 'EA',
		scope: {
				head: '=head',
				data: '=data',
				type : '=',},
		link: function(scope, element, attrs){
			scope.w = 800;
			scope.h = 600;
			scope.r = 500;
			var svg = d3.select(element[0])
				.append("svg")
				.attr("width", scope.w + 200)
				.attr("height", scope.h)
				.append("g")
				.attr("transform", "translate(" + (scope.w -scope.r ) / 2 + "," + (scope.h - scope.r) / 2 + ")");


			scope.$watch(
				'data+type', 
				function(){
					return scope.render();
				}, true);
// define render function
			
			scope.render = function(){
			/* Initialize tooltip */
				var tip = d3_tip().attr('class', 'd3-tip').html(function(d) { return d; });
				var mod_data = scope.head.concat(scope.data);
				svg.selectAll("legend").remove();
				svg.selectAll("rect").remove();
				svg.selectAll("circle").remove();
				svg.selectAll("text").remove();
				svg.selectAll("g").remove();
				svg.call(tip);	
				var x = d3.scale.linear().range([0, scope.r]),
				    y = d3.scale.linear().range([0, scope.r]),
				    node,
				    root;	
				var nodes = root = tree_dict_from_flatten(mod_data[0],[],mod_data)[0];
				var color = d3.scale.category20();	
				var pack = d3.layout.pack()
				    .size([scope.r, scope.r])
				    .value(function(d) { return d.size; });
    
				var nodes = pack.nodes(root); 
				var legend = svg.selectAll('g')
							.data(function() {if (scope.type === 'task' ) return group_task(mod_data); else return group_status(mod_data);})
							.enter().append('g').attr('class', 'legend').attr("transform", "translate(0 ,20 )");
  
				legend.append('rect')
					.attr('x', scope.w - 200)
					.attr('y', function(d, i){ return i *  25;})
					.attr('width', 10)
					.attr('height', 10)
					.style('fill', function(d) { 
					  return color(d);
				});

				legend.append('text')
				    .attr('x', scope.w - 182)
				    .attr('y', function(d, i){ return (i *  25) + 9;})
				    .text(function(d){ return d; });
        

				svg.selectAll("circle")
					.data(nodes)
					.enter().append("circle")
					.attr("class", function(d) { return d.children ? "parent" : "child"; })
					.attr("cx", function(d) { 
						return d.x; })
					.attr("cy", function(d) { 
					return d.y; })
					.attr("r", function(d) { return d.r; })
					.style("fill", function(d) {if (scope.type === 'task' ) return color(d.name); else return color(d.status);})
					.on("click", function(d) 
					{ return zoom(node === d ? root : d); })
					.on('mouseover', tip.show)
 					.on('mouseout', tip.hide);

				svg.selectAll("text")
					.data(nodes)
					.enter().append("text")
					.attr("class", function(d) { return d.children ? "parent" : "child"; })
					.attr("x", function(d) { return d.x; })
					.attr("y", function(d) { return d.y; })
					.attr("dy", ".35em")
					.attr("text-anchor", "middle")
					.style("opacity", function(d) { return d.r > 20 ? 1 : 0; })
					.text(function(d) { return d.id; })
					.attr("class","plot");

  				d3.select(window).on("click", 	
  					function() { zoom(root); });


				function zoom(d) {
				  var k = scope.r / d.r / 2;
				  x.domain([d.x - d.r, d.x + d.r]);
				  y.domain([d.y - d.r, d.y + d.r]);
				
				  var t = svg.transition()
				      .duration(d3.event.altKey ? 7500 : 750);
				
				  t.selectAll("circle")
				      .attr("cx", function(d) { return x(d.x); })
				      .attr("cy", function(d) { return y(d.y); })
				      .attr("r", function(d) { return k * d.r; });
				
				  t.selectAll("text.plot")
				      .attr("x", function(d) { return x(d.x); })
				      .attr("y", function(d) { return y(d.y); })
				      .style("opacity", function(d) { return k * d.r ; });
				
				  node = d;
				  d3.event.stopPropagation();
				}	
	
				};

		}
	};     
}]);