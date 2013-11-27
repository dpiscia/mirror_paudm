'use strict';

/* Directives */


angular.module('d3Circle', [])
.directive('d3Circle', ['d3', function(d3) {
  // data should be provided as:
  // scope.data = {nodes : ['name' : name, group : group"], links : ["target" : id, "source " : id , "value" :  number] }
	return {
		restrict: 'EA',
		scope: {data: '=data',},
		link: function(scope, element, attrs) {
			var width = 700;
			var margin = 150;
			var padding = 0.02;
			var svg = d3.select(element[0]).selectAll("svg").data([scope.data]);
			scope.$watch(
				function(){
					return angular.element(window)[0].innerWidth;
				}, 
				function(){
					return scope.render();
				});

// define render function
			scope.render = function(){
			
   

      var matrix = scope.data.matrix;
      var packageNames = scope.data.packageNames;
      var radius = width / 2 - margin;

      // create the layout
      var chord = d3.layout.chord()
        .padding(padding)
        .sortSubgroups(d3.descending);

      // Select the svg element, if it exists.
      

      // Otherwise, create the skeletal chart.
      var gEnter = svg.enter().append("svg:svg")
        .attr("width", width)
        .attr("height", width)
        .attr("class", "dependencyWheel")
      .append("g")
        .attr("transform", "translate(" + (width / 2) + "," + (width / 2) + ")");

      var arc = d3.svg.arc()
        .innerRadius(radius)
        .outerRadius(radius + 20);

      var fill = function(d) {
        if (d.index === 0) return '#ccc';
        return "hsl(" + parseInt(((packageNames[d.index][0].charCodeAt() - 97) / 26) * 360, 10) + ",90%,70%)";
      };

      // Returns an event handler for fading a given chord group.
      var fade = function(opacity) {
        return function(g, i) {
          svg.selectAll(".chord")
              .filter(function(d) {
                return d.source.index != i && d.target.index != i;
              })
            .transition()
              .style("opacity", opacity);
          var groups = [];
          svg.selectAll(".chord")
              .filter(function(d) {
                if (d.source.index == i) {
                  groups.push(d.target.index);
                }
                if (d.target.index == i) {
                  groups.push(d.source.index);
                }
              });
          groups.push(i);
          var length = groups.length;
          svg.selectAll('.group')
              .filter(function(d) {
                for (var i = 0; i < length; i++) {
                  if(groups[i] == d.index) return false;
                }
                return true;
              })
              .transition()
                .style("opacity", opacity);
        };
      };

      chord.matrix(matrix);

      var rootGroup = chord.groups()[0];
      var rotation = - (rootGroup.endAngle - rootGroup.startAngle) / 2 * (180 / Math.PI);

      var g = gEnter.selectAll("g.group")
        .data(chord.groups)
      .enter().append("svg:g")
        .attr("class", "group")
        .attr("transform", function(d) {
          return "rotate(" + rotation + ")";
        });

      g.append("svg:path")
        .style("fill", fill)
        .style("stroke", fill)
        .attr("d", arc)
        .on("mouseover", fade(0.1))
        .on("mouseout", fade(1));

      g.append("svg:text")
        .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
        .attr("transform", function(d) {
          return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" +
            "translate(" + (radius + 26) + ")" +
            (d.angle > Math.PI ? "rotate(180)" : "");
        })
        .text(function(d) { return packageNames[d.index]; });

      gEnter.selectAll("path.chord")
          .data(chord.chords)
        .enter().append("svg:path")
          .attr("class", "chord")
          .style("stroke", function(d) { return d3.rgb(fill(d.source)).darker(); })
          .style("fill", function(d) { return fill(d.source); })
          .attr("d", d3.svg.chord().radius(radius))
          .attr("transform", function(d) {
            return "rotate(" + rotation + ")";
          })
          .style("opacity", 1);

  }




			
		}
	};

}]);