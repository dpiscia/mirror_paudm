'use strict';

/* Directives */


angular.module('d3Force', [])
.directive('d3Force', ['d3', function(d3) {
  // data should be provided as:
  // scope.data = {nodes : ['name' : name, group : group"], links : ["target" : id, "source " : id , "value" :  number] }
	return {
		restrict: 'EA',
		scope: {data: '=data',},
		link: function(scope, element, attrs) {
      		var svg = d3.select(element[0])
				.append("svg")
				.attr("width", "500")
				.attr("height","500");
// on window resize, re-render d3 canvas
			window.onresize = function() {
				return scope.$apply();
			};
			scope.$watch(
				function(){
					return angular.element(window)[0].innerWidth;
				}, 
				function(){
					return scope.render();
				});

// define render function
			scope.render = function(){
			scope.force =  d3.layout.force()
				.charge(-120)
				.linkDistance(30)
				.size([500, 500]);
			scope.force
				.nodes(scope.data.nodes)
				.links(scope.data.links)
				.start();

			var link = svg.selectAll(".link")
				.data(scope.data.links)
				.enter().append("line")
				.attr("class", "link")
				.style("stroke-width", function(d) { return Math.sqrt(d.value); });
			var color = d3.scale.category20();
			var node = svg.selectAll(".node")
				.data(scope.data.nodes)
				.enter().append("circle")
				.attr("class", "node")
				.attr("r", 5)
				.style("fill", function(d) { return color(d.group); })
				.call(scope.force.drag);
			node.append("title")
				.text(function(d) { return d.name; });
			scope.force.on("tick", function() {
				link.attr("x1", function(d) { return d.source.x; })
					.attr("y1", function(d) { return d.source.y; })
					.attr("x2", function(d) { return d.target.x; })
					.attr("y2", function(d) { return d.target.y; });
				node.attr("cx", function(d) { return d.x; })
					.attr("cy", function(d) { return d.y; });
   				});    

			};
		}
	};
}]);