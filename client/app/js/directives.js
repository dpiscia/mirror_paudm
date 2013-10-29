'use strict';

/* Directives */


angular.module('paudm_db.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elem, attrs) {
      elm.text(version);
    };
  }]) .directive('d3Bars', ['d3', function(d3) {
    return {
      restrict: 'EA',
    scope: {},
      link: function(scope, element, attrs) {
      
      var svg = d3.select(element[0])
            .append("svg")
            .attr("width", "400")
            .attr("height","200");
      // dummy data
scope.data = [
  {name: "Greg", score:98},
  {name: "Ari", score:96},
  {name: "Loser", score: 48}
];

// on window resize, re-render d3 canvas
window.onresize = function() {
  return scope.$apply();
};
scope.$watch(function(){
    return angular.element(window)[0].innerWidth;
  }, function(){
    return scope.render(scope.data);
  }
);

// define render function
scope.render = function(data){
  // remove all previous items before render
//canvas.selectAll("*").remove();

// setup variables
var width, height, max;
width = d3.select(element[0])[0][0].offsetWidth - 20;
  // 20 is for margins and can be changed
height = scope.data.length * 35;
  // 35 = 30(bar height) + 5(margin between bars)
max = 98;
  // this can also be found dynamically when the data is not static
  // max = Math.max.apply(Math, _.map(data, ((val)-> val.count)))

// set the height based on the calculations above
svg.attr('height', height);

//create the rectangles for the bar chart
svg.selectAll("rect")
  .data(data)
  .enter()
    .append("rect")
    .attr("height", 30) // height of each bar
    .attr("width", 0) // initial width of 0 for transition
    .attr("x", 10) // half of the 20 side margin specified above
    .attr("y", function(d, i){return i * 35;}) // height + margin between bars
    .transition()
      .duration(1000) // time of duration
      .attr("width", function(d){return d.score/(max/width);}); // width based on scale
};
   
    }
    };
  }])
  
  
  
  
  
  
  
  
  .directive('d3Force', ['d3', function(d3) {
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
                return scope.render(scope.data);
            });

// define render function
     scope.render = function(data){
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