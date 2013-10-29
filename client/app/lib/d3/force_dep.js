angular.module('d3_plots', ['d3'])
  .factory('force_plots', ['d3', function(d3){
    var createSVG_Force;
    createSVG_Force = function(scope, element) {
  scope.width = 800;
  scope.height = 500;
  scope.force =  d3.layout.force()
    .charge(-120)
    .linkDistance(30)
    .size([scope.width, scope.height]);
 
  if (scope.svg == null) {
    return scope.svg = d3.select(element[0]).append("svg:svg")
            .attr("width", "100%");
    }
   };
   //return createSVG_Force;
   var update_force_tree;
   update_force_tree = function(newVal, oldVal,  scope, element) {
   
   scope.data = [
  {name: "Greg", score:98},
  {name: "Ari", score:96},
  {name: "Loser", score: 48}
];
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

scope.svg.selectAll("rect")
  .data(scope.data)
  .enter()
    .append("rect")
    .attr("height", 30) // height of each bar
    .attr("width", 0) // initial width of 0 for transition
    .attr("x", 10) // half of the 20 side margin specified above
    .attr("y", function(d, i){return i * 35;}) // height + margin between bars
    .transition()
      .duration(1000) // time of duration
      .attr("width", function(d){return d.score/(max/width);}); // width based on scale
/*     scope.force
      .nodes(scope.data.nodes)
      .links(scope.data.links)
      .start();
     var link = scope.svg.selectAll(".link")
      .data(scope.data.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });
  var color = d3.scale.category20();
  var node = scope.svg.selectAll(".node")
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
   });*/
   };
   return {'createSVG_Force' : createSVG_Force, 'update_force_tree': update_force_tree};   
      }]);