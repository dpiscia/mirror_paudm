angular.module('d3_plots', ['d3'])
  .factory('force_plots', ['d3Service', function(d3){
    var createSVG_Force;
    createSVG_Force = function(scope, element) {
  scope.width = 800;
  scope.height = 500;
  scope.force =  d3.layout.force()
    .charge(-120)
    .linkDistance(30)
    .size([scope.width, scope.height]);
 
  if (scope.svg == null) {
    return scope.svg = d3.select("#prova").append("svg:svg").attr("width", scope.width).attr("height", scope.height);
    }
   };
   //return createSVG_Force;
   var update_force_tree;
   update_force_tree = function(newVal, oldVal,  scope) {
   scope.svg.append("p").text("New paragraph!");
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