'use strict';

/* Directives */


angular.module('d3Scatter', ['d3'])
.directive('d3Scatter', ['d3', function(d3) {
  // data should be provided as:
  // scope.data = {nodes : ['name' : name, group : group"], links : ["target" : id, "source " : id , "value" :  number] }
	return {
		restrict: 'EA',
		scope: {data: '=data',
				},
		link: function(scope, element, attrs){
		  var margin = {top: 20, right: 15, bottom: 60, left: 60};
			scope.w = 960 - margin.left - margin.right;
			scope.h = 500 - margin.top - margin.bottom;
      		var svg = d3.select(element[0])
				.append("svg")
				.attr("width", scope.w + margin.right + margin.left)
				.attr("height",scope.h  + margin.top + margin.bottom).
				append("g")
				.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

			scope.$watch(
				'data', 
				function(){
					return scope.render();
				}, true);
// define render function
			
			scope.render = function(){
					svg.selectAll("legend").remove();
					svg.selectAll("rect").remove();
					svg.selectAll("circle").remove();
					svg.selectAll("text").remove();
					svg.selectAll("g").remove();      
					svg.selectAll("line.link").remove();
					svg.selectAll("line.link_2").remove();
				var data = scope.data;
			    var x = d3.scale.linear()
              .domain([d3.min(data, function(d) { return d[0]; }), d3.max(data, function(d) { return d[0]; })])
              .range([ 0, scope.w ]);
    
    var y = d3.scale.linear()
    	      .domain([d3.min(data, function(d) { return d[1]; }), d3.max(data, function(d) { return d[1]; })])
    	      .range([ scope.h, 0 ]);
    	      
    	      var xAxis = d3.svg.axis()
	.scale(x)
	.orient('bottom');

    svg.append('g')
	.attr('transform', 'translate(0,' + scope.h + ')')
	.attr('class', 'main axis date')
	.call(xAxis);

    // draw the y axis
    var yAxis = d3.svg.axis()
	.scale(y)
	.orient('left');

    svg.append('g')
	.attr('transform', 'translate(0,0)')
	.attr('class', 'main axis date')
	.call(yAxis);

    var g = svg.append("svg:g"); 
    
    g.selectAll("scatter-dots")
      .data(data)
      .enter().append("svg:circle")
          .attr("cx", function (d,i) { return x(d[0]); } )
          .attr("cy", function (d) { return y(d[1]); } )
          .attr("r", 4)
          .append("svg:title")
          .text(function(d) { 
          	return 'x ='+d[0]+'\n'+'y ='+d[1]; });;
    	      
			}
		}	
	};     
}]);