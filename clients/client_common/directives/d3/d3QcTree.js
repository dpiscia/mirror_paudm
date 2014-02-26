'use strict';

/* Directives */


angular.module('d3Qctree', ['d3', 'plot_data_prepation'])
.directive('d3Qctree', ['d3',  'tree_dict_from_flatten' ,'group_task','group_status','select_by_id' , function(d3,tree_dict_from_flatten,group_task, group_status, select_by_id) {
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
				scope.h = 800;
				scope.tree = d3.layout.tree()
					.size([scope.w, scope.h - 160]);
				scope.diagonal = d3.svg.diagonal()
    				.projection(function(d) { return [d.y, d.x]; });
				var svg = d3.select(element[0])
					.append("svg:svg")
					.attr("width", scope.w + 300)
					.attr("height", scope.h).append("g")
    			.attr("transform", "translate(100 ,20 )");
	
	
				scope.$watch(
					'data+type', 
					function(){
						return scope.render();
					}, true);
// define render function
			
				scope.render = function(){
					var mod_data = scope.head.concat(scope.data);
					var root;
					root = tree_dict_from_flatten(mod_data[0],[],mod_data)[0];
					root.fixed = true;
					root.x0 = scope.h / 2;
					root.y0 = 0; 

				  function toggleAll(d) {
				    if (d.children) {
				      d.children.forEach(toggleAll);
				      toggle(d);
				    }
				  }  
				  root.children.forEach(toggleAll);

				
				  update(root);
function update(source) {
  var duration = d3.event && d3.event.altKey ? 5000 : 500;

  // Compute the new tree layout.
  var nodes = scope.tree.nodes(root).reverse();

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("svg:g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", function(d) { toggle(d); update(d); });

  nodeEnter.append("svg:circle")
      .attr("r", 1e-6)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeEnter.append("svg:text")
      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
      .text(function(d) { return d.name; })
      .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
      .attr("r", 4.5)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
      .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
      .data(scope.tree.links(nodes), function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("svg:path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return scope.diagonal({source: o, target: o});
      })
    .transition()
      .duration(duration)
      .attr("d", scope.diagonal);

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", scope.diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return scope.diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}
				// Toggle children.
function toggle(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
}	
				};

		}
	};     
}]);